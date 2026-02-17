"use client";

import { FileText } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";

export function LatestFiles() {
  const { t } = useTranslation();
  const reportsT = t("reports");

  // Note: Files data is not available from the current API
  // This section will be populated when a files/profiles endpoint is added
  const files: any[] = [];

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-text-dark">
        <FileText className="h-5 w-5" />
        <h3 className="text-base font-semibold">{reportsT.files.title}</h3>
      </div>

      {files.length === 0 ? (
        <div className="rounded-2xl border border-grey-200 bg-white p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-grey-300" />
          <p className="mt-3 text-sm text-grey-400">
            لا توجد ملفات حالياً
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="rounded-2xl border border-grey-200 bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-grey-100">
                    <FileText className="h-5 w-5 text-grey-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-text-dark">
                      {file.title}
                    </h4>
                    <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-grey-500">
                      <span>{file.owner}</span>
                      <span>{file.role}</span>
                      <span>
                        {reportsT.files.academicYear} {file.academicYear}
                      </span>
                      <span>
                        {reportsT.files.createdAt} {file.createdAt}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          file.published ? "bg-success-500" : "bg-grey-400"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          file.published ? "text-success-500" : "text-grey-500"
                        }`}
                      >
                        {file.published
                          ? reportsT.files.published
                          : reportsT.files.unpublished}
                      </span>
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
