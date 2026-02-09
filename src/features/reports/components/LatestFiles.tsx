"use client";

import { FileText, ExternalLink } from "lucide-react";
import { useTranslation } from "@/i18n/TranslationContext";
import { latestFilesData } from "../data/reports.mock";

export function LatestFiles() {
  const { t } = useTranslation();
  const reportsT = t("reports");

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-text-dark">
        <FileText className="h-5 w-5" />
        <h3 className="text-base font-semibold">{reportsT.files.title}</h3>
      </div>

      <div className="space-y-3">
        {latestFilesData.map((file) => (
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

              <button
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium ${
                  file.published
                    ? "bg-primary-500 text-white"
                    : "border border-grey-200 bg-white text-grey-500"
                }`}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {reportsT.files.viewFile}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
