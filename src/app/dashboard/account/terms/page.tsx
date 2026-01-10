"use client";

import { dashboardContent } from "@/content";

export default function TermsPage() {
  const { breadcrumb } = dashboardContent;

  return (
    <div className="bg-white rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[400px]">
      <h1 className="text-xl sm:text-2xl font-medium text-secondary-700 text-right mb-6">
        {breadcrumb.terms}
      </h1>
      {/* Content will be added later */}
    </div>
  );
}
