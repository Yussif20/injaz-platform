"use client";

import { Suspense, useState } from "react";
import { DashboardNavbar, DashboardSidebar } from "@/features/dashboard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-grey-50" dir="rtl">
      {/* Top navbar — wrapped in Suspense for useSearchParams() during static generation */}
      <Suspense
        fallback={
          <header className="h-16 lg:h-20 border-b border-grey-200 bg-white shrink-0" />
        }
      >
        <DashboardNavbar
          onMenuToggle={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </Suspense>

      {/* Main content area with sidebar */}
      <div className="flex">
        {/* Sidebar - right side in RTL */}
        <DashboardSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 md:pr-28 lg:pr-72 min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
