import { AccountSidebar } from "@/features/dashboard";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Account sidebar - right side (RTL inherited from parent) - desktop only */}
      <div className="hidden lg:block">
        <AccountSidebar />
      </div>

      {/* Content area - left side; default grey bg for all account pages */}
      <div className="flex-1 min-h-0 bg-[#FAFAFA]">{children}</div>
    </div>
  );
}
