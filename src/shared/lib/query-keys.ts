import type { PaginatedQueryParams } from "@/shared/types";

function createKeys(scope: string) {
  return {
    all: () => [scope] as const,
    lists: () => [scope, "list"] as const,
    filtered: (params?: PaginatedQueryParams) =>
      [scope, "list", params ?? {}] as const,
    detail: (id: number) => [scope, "detail", id] as const,
  };
}

export const queryKeys = {
  auth: { me: () => ["auth", "me"] as const },
  users: createKeys("users"),
  academicYears: createKeys("academicYears"),
  ranks: createKeys("ranks"),
  profileTypes: createKeys("profileTypes"),
  sections: createKeys("sections"),
  subsections: createKeys("subsections"),
  subscriptions: createKeys("subscriptions"),
  subscriptionDiscounts: createKeys("subscriptionDiscounts"),
  subscriptionSettings: createKeys("subscriptionSettings"),
  systemParameters: createKeys("systemParameters"),
};
