"use client";

import { CreditCard, User } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { useLatestSubscriptions } from "../hooks";

function getTimeAgo(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  return diffMins;
}

export function LatestSubscriptions() {
  const { t } = useTranslation();
  const reportsT = t("reports");

  const { data: subscriptions = [], isLoading } = useLatestSubscriptions(10);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-grey-200 bg-white">
      <div className="flex items-center gap-2 rounded-t-2xl bg-primary-500 px-4 py-2.5 text-white">
        <CreditCard className="h-4 w-4" />
        <h3 className="text-xs font-medium">{reportsT.subscriptions.title}</h3>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ maxHeight: "620px" }}>
        {isLoading ? (
          <div className="divide-y divide-grey-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2.5">
                <div className="h-8 w-8 animate-pulse rounded-full bg-grey-200" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-24 animate-pulse rounded bg-grey-200" />
                  <div className="h-2 w-16 animate-pulse rounded bg-grey-200" />
                </div>
              </div>
            ))}
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-xs text-grey-400">
            لا توجد اشتراكات
          </div>
        ) : (
          <div className="divide-y divide-grey-100">
            {subscriptions.map((sub) => {
              const timeAgo = getTimeAgo(sub.subscribedAt);
              return (
                <div
                  key={sub.id}
                  className="flex items-center gap-2 px-3 py-2.5"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grey-100">
                    {sub.userAvatar ? (
                      <img
                        src={sub.userAvatar}
                        alt={sub.userName}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-3.5 w-3.5 text-grey-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-text-dark">
                      {sub.userName}
                    </p>
                    <p className="text-[10px] text-grey-400">
                      {reportsT.subscriptions.timeAgo} {timeAgo}{" "}
                      {reportsT.subscriptions.minutes}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
