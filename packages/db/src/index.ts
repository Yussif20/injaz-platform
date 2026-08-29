/**
 * Typed access to the Injaz database.
 *
 * `database.types.ts` beside this file is generated — run `npm run db:types` after any
 * migration. Do not edit it by hand.
 *
 * A note on versions, because this failed silently once already in this workspace:
 * `@supabase/ssr` must match `@supabase/supabase-js`. When `ssr` is stale it drops the
 * `Database` generic, and every `rpc()` call starts typing its arguments as `undefined`
 * without any error to explain why. If RPC arguments go weird, check the pair first.
 */

import type { Database } from "./database.types";

export type { Database };

/** Row types, keyed by table name: `Row<"portfolios">`. */
export type Row<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Insert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type Update<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

/** Enum unions, keyed by enum name: `Enum<"portfolio_status">`. */
export type Enum<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

/**
 * The states a portfolio can be in.
 *
 * The legacy API returned this as a bare string, and returned success itself as `true`,
 * `"Success"` or `"success"` depending on the endpoint — which is why the teacher app
 * still carries `isApiSuccess(status: string | boolean)`. Postgres will not accept a
 * fourth spelling, so the shim has nothing left to defend against.
 */
export type PortfolioStatus = Enum<"portfolio_status">;
export type PaymentStatus = Enum<"payment_status">;
export type UserRole = Enum<"user_role">;
export type Gender = Enum<"gender">;
export type GenderAvailability = Enum<"gender_availability">;
export type AcademicYearStatus = Enum<"academic_year_status">;

/** Return type of an RPC function, keyed by name. */
export type RpcResult<T extends keyof Database["public"]["Functions"]> =
  Database["public"]["Functions"][T]["Returns"];

/** Argument type of an RPC function, keyed by name. */
export type RpcArgs<T extends keyof Database["public"]["Functions"]> =
  Database["public"]["Functions"][T]["Args"];
