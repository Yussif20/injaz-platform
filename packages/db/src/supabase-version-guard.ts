/**
 * A type-level guard against @supabase/ssr drifting out of step with @supabase/supabase-js.
 *
 * When `ssr` is older than the `supabase-js` it wraps, `createServerClient<Database>` stops
 * carrying the generic. Nothing errors and nothing warns: `rpc()` simply starts typing its
 * arguments as `undefined`, so every call site either loses its checking or is "fixed" with
 * a cast, and the mismatch is discovered much later by a runtime failure.
 *
 * This file compiles only while the pair is compatible. It emits no runtime code — the
 * assertions below are types — so it costs a typecheck and nothing else.
 *
 * It caught a real mismatch when this package was created: ssr 0.5.2 against
 * supabase-js 2.112.4 produced exactly the failure above.
 */

import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "./database.types";

const browser = createClient<Database>("http://localhost", "key");
const server = createServerClient<Database>("http://localhost", "key", {
  cookies: { getAll: () => [], setAll: () => {} },
});

// Both clients must accept a correctly-shaped RPC argument. If the generic were dropped,
// the parameter would be `undefined` and these would not compile.
void browser.rpc("admin_revenue_by_month", { months: 13 });
void server.rpc("admin_revenue_by_month", { months: 13 });
void server.rpc("get_shared_portfolio", { share_token: "x" });

// And must reject an incorrectly-shaped one. This is the half that matters: without it,
// a dropped generic that widened the parameter to `any` would sail through the checks
// above. If the argument shape stops being enforced, the directive below becomes unused
// and TypeScript reports *that* — so the guard fails in both directions.
// @ts-expect-error — `nonsense` is not an argument of admin_revenue_by_month
void server.rpc("admin_revenue_by_month", { nonsense: 1 });
