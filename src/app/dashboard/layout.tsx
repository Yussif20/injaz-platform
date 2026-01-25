"use client";

import { useState } from "react";
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
      {/* Top navbar */}
      <DashboardNavbar
        onMenuToggle={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main content area with sidebar */}
      <div className="flex">
        {/* Sidebar - right side in RTL */}
        <DashboardSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 lg:pr-72 min-h-[calc(100vh-5rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
