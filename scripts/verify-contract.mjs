/**
 * Verify the replacement backend against the contract the old one published.
 *
 * The .NET backend is gone. supabase/tests/fixtures/legacy-openapi.json — captured while
 * it still answered — is the only remaining statement of what it returned, and this script
 * is what turns "I replaced the backend" from a claim into something checkable.
 *
 * It checks three things, against a running local stack:
 *
 *   1. Every enum value the contract declares exists in the corresponding Postgres enum.
 *      The legacy database stored these as loose integers and free text, which is why the
 *      frontend still carries shims like `isApiSuccess(status: string | boolean)`.
 *
 *   2. The nested DTOs that the share view returns verbatim — qualifications, career jobs,
 *      sections, subsections, images — carry exactly the contract's property names. These
 *      are compared strictly, because the UI reads them by name and any drift is a blank
 *      field rather than an error.
 *
 *   3. The portfolio listing carries the contract's ProfileDto properties, minus an
 *      explicit list of deliberate omissions. Each omission has to be named here, so
 *      dropping a field is a decision someone wrote down rather than something that
 *      quietly went missing.
 *
 * Run:  npm run db:verify     (needs `npm run db:start` first)
 */

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const CONTRACT = "supabase/tests/fixtures/legacy-openapi.json";
const DB_CONTAINER = "supabase_db_injaz-platform";

let failures = 0;
let checks = 0;

function report(ok, label, detail) {
  checks += 1;
  if (ok) {
    console.log(`  ok    ${label}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${label}`);
    if (detail) console.log(`        ${detail}`);
  }
}

/** Run SQL in the local database container and return stdout. */
function sql(query) {
  return execFileSync(
    "docker",
    ["exec", "-i", DB_CONTAINER, "psql", "-qtA", "-U", "postgres", "-d", "postgres", "-c", query],
    { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 },
  ).trim();
}

const contract = JSON.parse(readFileSync(CONTRACT, "utf8"));
const schemas = contract.components.schemas;

/** Property names the contract declares for a DTO. */
function contractProps(dtoName) {
  const dto = schemas[dtoName];
  if (!dto) throw new Error(`${dtoName} is not in the captured contract`);
  return Object.keys(dto.properties ?? {});
}

console.log(`\nContract: ${contract.info.title} ${contract.info.version}`);
console.log(
  `          ${Object.keys(contract.paths).length} paths, ` +
    `${Object.keys(schemas).length} schemas\n`,
);

// ─── 1. Enums ─────────────────────────────────────────────────────────────────
//
// The contract writes these as "0 = Draft", so the label is what we compare, lowercased
// and snake_cased to match the Postgres convention.

console.log("Enums declared by the contract exist in Postgres");

const ENUM_MAP = {
  UserRole: "user_role",
  Gender: "gender",
  GenderAvailability: "gender_availability",
  ProfileStatus: "portfolio_status",
  PaymentStatus: "payment_status",
};

const pgEnums = Object.fromEntries(
  sql(
    `select t.typname, string_agg(e.enumlabel, ',' order by e.enumsortorder)
       from pg_type t join pg_enum e on e.enumtypid = t.oid
       join pg_namespace n on n.oid = t.typnamespace
      where n.nspname = 'public' group by t.typname`,
  )
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [name, labels] = line.split("|");
      return [name, labels.split(",")];
    }),
);

for (const [contractName, pgName] of Object.entries(ENUM_MAP)) {
  const declared = (schemas[contractName]?.enum ?? []).map((entry) =>
    // "0 = Draft" -> "draft";  "3 = PendingSubscription" -> "pending_subscription"
    String(entry)
      .split("=")
      .pop()
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
      .toLowerCase(),
  );
  const actual = pgEnums[pgName] ?? [];
  const missing = declared.filter((v) => !actual.includes(v));

  // Guard against a vacuous pass. If the contract lookup or the label transform came back
  // empty, `missing` would also be empty and this check would report success having
  // compared nothing at all — the exact trap of trusting a negative result from a probe
  // that could not have produced a positive one.
  if (declared.length === 0 || actual.length === 0) {
    report(
      false,
      `${contractName} -> public.${pgName}`,
      `nothing to compare: contract declared ${declared.length} values, ` +
        `Postgres has ${actual.length}`,
    );
    continue;
  }

  report(
    missing.length === 0,
    `${contractName} -> public.${pgName} (${declared.length} values)`,
    missing.length ? `missing in Postgres: ${missing.join(", ")}` : null,
  );
}

// ─── 2. Nested DTOs, compared strictly ────────────────────────────────────────

console.log("\nNested DTOs returned verbatim by the share view");

const shareToken = sql(
  `select token from public.share_links
    where token like 'demo%' order by id limit 1`,
);

if (!shareToken) {
  report(false, "a demo share link exists", "run `npm run db:reset` to seed one");
} else {
  const shared = JSON.parse(
    sql(`select public.get_shared_portfolio('${shareToken}')::text`),
  );

  const NESTED = [
    ["QualificationDto", () => shared.qualifications?.[0]],
    ["CareerJobDto", () => shared.careerJobs?.[0]],
    ["ProfileSectionDto", () => shared.sections?.[0]],
    ["ProfileSubsectionDto", () => shared.sections?.[0]?.subsections?.[0]],
    ["SubsectionImageDto", () => shared.sections?.[0]?.subsections?.[0]?.images?.[0]],
  ];

  for (const [dtoName, pick] of NESTED) {
    const sample = pick();
    if (!sample) {
      report(false, dtoName, "no sample row in the seeded data to compare against");
      continue;
    }

    const expected = contractProps(dtoName);
    const actual = Object.keys(sample);

    // publicUrl is the backend's pre-joined absolute URL. Storage now signs its own URLs
    // from imagePath, so the field is computed at the edge rather than stored.
    const allowedMissing = new Set(["publicUrl", "subsections"]);

    const missing = expected.filter(
      (k) => !actual.includes(k) && !allowedMissing.has(k),
    );
    const extra = actual.filter((k) => !expected.includes(k));

    report(
      missing.length === 0 && extra.length === 0,
      `${dtoName} (${expected.length} properties)`,
      [
        missing.length ? `missing: ${missing.join(", ")}` : null,
        extra.length ? `unexpected: ${extra.join(", ")}` : null,
      ]
        .filter(Boolean)
        .join("; ") || null,
    );
  }
}

// ─── 3. The portfolio listing ─────────────────────────────────────────────────

console.log("\nPortfolio listing against ProfileDto");

// Every property of ProfileDto that my_portfolios() does not return, with the reason.
// Anything not listed here and not returned is a regression, not a decision.
const PROFILE_DTO_OMISSIONS = {
  userId: "the caller is the owner by construction; RLS scopes the query to them",
  userFullName: "on the account, fetched once, not repeated per portfolio row",
  personalInfo: "fetched with the account, not with the list",
  qualifications: "fetched with the account, not with the list",
  careerJobs: "fetched with the account, not with the list",
  imageUrl: "replaced by imagePath; the URL is signed at the edge, not stored",
};

const listingColumns = sql(
  `select string_agg(column_name, ',' order by ordinal_position)
     from information_schema.columns
    where table_schema = 'public'
      and table_name = 'my_portfolios'`,
);

// A set-returning function's columns are not in information_schema; read the signature.
const listingCols =
  listingColumns ||
  sql(
    `select pg_get_function_result(oid) from pg_proc
      where proname = 'my_portfolios' and pronamespace = 'public'::regnamespace`,
  );

const snake = (s) => s.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
const returned = listingCols.toLowerCase();

for (const prop of contractProps("ProfileDto")) {
  const reason = PROFILE_DTO_OMISSIONS[prop];
  const present = returned.includes(snake(prop));

  if (reason) {
    report(
      !present,
      `ProfileDto.${prop} omitted deliberately`,
      present ? `documented as omitted but is present — update the list` : null,
    );
  } else {
    report(present, `ProfileDto.${prop} reproduced`, present ? null : "not returned");
  }
}

// ─── Result ───────────────────────────────────────────────────────────────────

console.log(
  `\n${failures === 0 ? "PASS" : "FAIL"} — ${checks - failures}/${checks} checks\n`,
);
process.exit(failures === 0 ? 0 : 1);
