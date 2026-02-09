"use client";

import { CreditCard, User } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { subscriptionsData } from "../data/reports.mock";

export function LatestSubscriptions() {
  const { t } = useTranslation();
  const reportsT = t("reports");

  return (
    <div className="flex h-full flex-col rounded-2xl border border-grey-200 bg-white">
      <div className="flex items-center gap-2 rounded-t-2xl bg-primary-500 px-4 py-2.5 text-white">
        <CreditCard className="h-4 w-4" />
        <h3 className="text-xs font-medium">{reportsT.subscriptions.title}</h3>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ maxHeight: "620px" }}>
        <div className="divide-y divide-grey-100">
          {subscriptionsData.map((sub) => (
            <div key={sub.id} className="flex items-center gap-2 px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-grey-100">
                {sub.avatar ? (
                  <img
                    src={sub.avatar}
                    alt={sub.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-3.5 w-3.5 text-grey-400" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-text-dark">
                  {sub.name}
                </p>
                <p className="text-[10px] text-grey-400">
                  {reportsT.subscriptions.timeAgo} {sub.timeAgo}{" "}
                  {reportsT.subscriptions.minutes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
