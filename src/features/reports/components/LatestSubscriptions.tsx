"use client";


import { useTranslation } from "@/i18n/TranslationContext";
import { useLatestSubscriptions } from "../hooks";

interface LatestSubscriptionsProps {
  trendValue?: number;
  trendDirection?: "up" | "down";
}

function getTimeAgo(
  dateString: string,
  labels: { minutes: string; hours: string; days: string },
): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 60) return `${diffMins} ${labels.minutes}`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} ${labels.hours}`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} ${labels.days}`;
}

export function LatestSubscriptions({
  trendValue,
  trendDirection,
}: LatestSubscriptionsProps) {
  const { t } = useTranslation();
  const reportsT = t("reports");

  const { data: subscriptions = [], isLoading } = useLatestSubscriptions(10);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-grey-200 bg-white">
      <div className="flex items-center gap-2 rounded-t-2xl bg-[#E3EFEF] px-4 py-3">
        <img src="/icons/subscription-green.svg" alt="" className="h-5 w-5" />
        <h3 className="text-lg font-normal text-primary-500">{reportsT.subscriptions.title}</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="divide-y divide-grey-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-28 animate-pulse rounded bg-grey-200" />
                  <div className="h-3 w-20 animate-pulse rounded bg-grey-200" />
                </div>
                <div className="h-9 w-9 animate-pulse rounded-full bg-grey-200" />
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
              const timeAgo = getTimeAgo(
                sub.subscribedAt,
                reportsT.subscriptions,
              );
              return (
                <div key={sub.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-grey-200 bg-grey-50">
                    {sub.userAvatar ? (
                      <img
                        src={sub.userAvatar}
                        alt={sub.userName}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                    ) : (
                      <img
                        src="/logo-icon.svg"
                        alt=""
                        className="h-5 w-5"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-dark">
                      {sub.userName}
                    </p>
                    <p className="mt-0.5 text-xs text-grey-400">
                      {reportsT.subscriptions.timeAgo} {timeAgo}
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
