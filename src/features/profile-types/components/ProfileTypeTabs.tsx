"use client";

import { useActivateProfileType, useDeactivateProfileType } from "../hooks";
import type { ProfileTypeDto } from "../types/profile-types.types";

interface ProfileTypeTabsProps {
  profileTypes: ProfileTypeDto[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export function ProfileTypeTabs({
  profileTypes,
  selectedId,
  onSelect,
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
    <div className="flex gap-3 overflow-x-auto pb-2">
      {profileTypes.map((type) => {
        const isSelected = type.id === selectedId;
        const isPending =
          (activate.isPending && activate.variables === type.id) ||
          (deactivate.isPending && deactivate.variables === type.id);

        return (
          <div
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`flex min-w-[160px] cursor-pointer flex-col gap-3 rounded-2xl border px-4 py-3 transition-colors ${
              isSelected
                ? "border-primary-200 bg-primary-50"
                : "border-grey-100 bg-white hover:bg-grey-50"
            }`}
          >
            <span
              className={`text-sm font-medium ${
                isSelected ? "text-primary-500" : "text-text-dark"
              }`}
            >
              {type.typeName}
            </span>

            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-grey-100 px-2 py-0.5 text-xs text-grey-500">
                0 مستخدم
              </span>

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
            </div>
          </div>
        );
      })}
    </div>
  );
}
