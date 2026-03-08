"use client";

import { useActivateProfileType, useDeactivateProfileType } from "../hooks";
import type { ProfileTypeDto } from "../types/profile-types.types";

interface ProfileTypeTabsProps {
  profileTypes: ProfileTypeDto[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  userCounts?: Record<number, number>;
}

export function ProfileTypeTabs({
  profileTypes,
  selectedId,
  onSelect,
  userCounts = {},
}: ProfileTypeTabsProps) {
  const activate = useActivateProfileType();
  const deactivate = useDeactivateProfileType();

  const handleToggle = (e: React.MouseEvent, type: ProfileTypeDto) => {
    e.stopPropagation();
    if (type.isActive) {
      deactivate.mutate(type.id);
    } else {
      activate.mutate(type.id);
    }
  };

  return (
    <div className="flex flex-wrap items-end gap-4 pb-0">
      {profileTypes.map((type) => {
        const isSelected = type.id === selectedId;
        const isPending =
          (activate.isPending && activate.variables === type.id) ||
          (deactivate.isPending && deactivate.variables === type.id);
        const count = userCounts[type.id] ?? 0;

        return (
          <div
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`flex cursor-pointer items-center gap-3 px-5 py-4 transition-colors ${
              isSelected
                ? "rounded-t-2xl bg-white"
                : "rounded-full border border-transparent bg-transparent hover:bg-grey-100 mb-1"
            }`}
          >
            {/* Toggle switch */}
            <button
              onClick={(e) => !isPending && handleToggle(e, type)}
              disabled={isPending}
              aria-label="تبديل الحالة"
              className="flex-shrink-0"
            >
              {isPending ? (
                <div className="flex h-5 w-10 items-center justify-center rounded-full bg-grey-200">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-grey-400 border-t-transparent" />
                </div>
              ) : (
                <div
                  className={`relative h-5 w-10 rounded-full transition-colors duration-200 ${
                    type.isActive ? "bg-primary-500" : "bg-grey-300"
                  }`}
                >
                  <span
                    className="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
                    style={{
                      transform: type.isActive
                        ? "translateX(22px)"
                        : "translateX(2px)",
                    }}
                  />
                </div>
              )}
            </button>

            {/* Rank name */}
            <span
              className={`text-lg font-medium whitespace-nowrap ${
                isSelected ? "text-primary-500" : "text-text-dark"
              }`}
            >
              {type.typeName}
            </span>

            {/* User count badge */}
            <span className="rounded-full bg-grey-100 px-2 py-0.5 text-xs text-grey-500 whitespace-nowrap">
              {count} مستخدم
            </span>
          </div>
        );
      })}
    </div>
  );
}
