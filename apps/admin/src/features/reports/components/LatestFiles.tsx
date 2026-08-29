"use client";

import { ExternalLink } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { useLatestFiles } from "../hooks";
import Link from "next/link";

export function LatestFiles() {
  const { t } = useTranslation();
  const reportsT = t("reports");

  const { data: files = [], isLoading } = useLatestFiles(4);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E3EFEF]">
          <img src="/icons/file-primary.svg" alt="" className="h-4 w-4" />
        </div>
        <h3 className="text-lg font-normal text-primary-500">
          {reportsT.files.title}
        </h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-grey-200 bg-white px-8 py-5"
            >
              <div className="flex items-start gap-5">
                <div className="h-11 w-11 animate-pulse rounded-full bg-grey-200" />
                <div className="flex flex-1 flex-col gap-3">
                  <div className="h-5 w-40 animate-pulse rounded bg-grey-200" />
                  <div className="flex gap-6">
                    <div className="h-4 w-28 animate-pulse rounded bg-grey-200" />
                    <div className="h-4 w-20 animate-pulse rounded bg-grey-200" />
                    <div className="h-4 w-28 animate-pulse rounded bg-grey-200" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        <div className="rounded-2xl border border-grey-200 bg-white p-8 text-center">
          <img
            src="/icons/file-primary.svg"
            alt=""
            className="mx-auto h-12 w-12 opacity-30"
          />
          <p className="mt-3 text-sm text-grey-400">لا توجد ملفات حالياً</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="rounded-2xl border border-grey-200 bg-white px-4 py-3 xl:px-8 xl:py-5"
            >
              <div className="flex items-start gap-3 xl:gap-5">
                {/* File Icon */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center self-center rounded-full bg-[#E3EFEF] xl:h-11 xl:w-11">
                  <img
                    src="/icons/file-primary.svg"
                    alt=""
                    className="h-4 w-4 xl:h-6 xl:w-6"
                  />
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col gap-2 xl:gap-3">
                  {/* Row 1: Title + View Button */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-normal text-text-dark xl:text-lg">
                      {file.title}
                    </p>
                    <Link
                      href="/dashboard/files"
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs transition-colors xl:gap-1.5 xl:px-5 xl:py-1.5 xl:text-sm ${
                        file.isPublished
                          ? "bg-primary-500 text-white hover:bg-primary-800"
                          : "cursor-not-allowed border border-grey-200 bg-grey-100 text-grey-400"
                      }`}
                    >
                      <ExternalLink className="h-3 w-3 xl:h-4 xl:w-4" />
                      {reportsT.files.viewFile}
                    </Link>
                  </div>

                  {/* Row 2: Details + Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs font-light text-text-dark xl:gap-6 xl:text-lg">
                      {file.ownerName && <span>{file.ownerName}</span>}
                      <span>{file.ownerRank}</span>
                      <span>
                        {reportsT.files.academicYear} {file.academicYear}
                      </span>
                      <span>
                        {reportsT.files.createdAt} {file.createdAt}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs font-light xl:text-sm ${
                          file.isPublished
                            ? "text-primary-500"
                            : "text-grey-500"
                        }`}
                      >
                        {file.isPublished
                          ? reportsT.files.published
                          : reportsT.files.unpublished}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full xl:h-2.5 xl:w-2.5 ${
                          file.isPublished ? "bg-primary-500" : "bg-grey-400"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
