"use client";

import { useAuth, useLogout } from "@/features/auth";
import { Button } from "@/shared/components/ui";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const { logout, isLoading: isLoggingOut } = useLogout();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-shade-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-shade-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-semibold text-secondary-700">
            لوحة التحكم
          </h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            isLoading={isLoggingOut}
            disabled={isLoggingOut}
          >
            تسجيل الخروج
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <h2 className="text-lg sm:text-xl font-medium text-text-dark mb-2">
            مرحباً، {user?.fullName || "مستخدم"}
          </h2>
          <p className="text-grey-500">
            أهلاً بك في لوحة تحكم إنجاز المعلم
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6">
          <h3 className="text-lg font-medium text-text-dark mb-4 border-b pb-2">
            معلومات الحساب
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-grey-500 text-sm">الاسم الكامل</span>
              <p className="text-text-dark font-medium">{user?.fullName || "-"}</p>
            </div>
            <div>
              <span className="text-grey-500 text-sm">رقم الجوال</span>
              <p className="text-text-dark font-medium" dir="ltr">{user?.phone || "-"}</p>
            </div>
            <div>
              <span className="text-grey-500 text-sm">اسم المستخدم</span>
              <p className="text-text-dark font-medium">{user?.userName || "-"}</p>
            </div>
            <div>
              <span className="text-grey-500 text-sm">الصلاحية</span>
              <p className="text-text-dark font-medium">{user?.role || "-"}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h3 className="text-lg font-medium text-text-dark mb-4 border-b pb-2">
            الإجراءات السريعة
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              title="إنشاء ملف جديد"
              description="أنشئ ملف إنجاز جديد"
              icon="📄"
              href="/profiles/new"
            />
            <ActionCard
              title="ملفاتي"
              description="عرض جميع ملفات الإنجاز"
              icon="📁"
              href="/profiles"
            />
            <ActionCard
              title="الإعدادات"
              description="إدارة إعدادات الحساب"
              icon="⚙️"
              href="/settings"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function ActionCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="block p-4 border border-grey-200 rounded-xl hover:border-primary-500 hover:bg-shade-50 transition-colors duration-200"
    >
      <span className="text-2xl mb-2 block">{icon}</span>
      <h4 className="font-medium text-text-dark">{title}</h4>
      <p className="text-sm text-grey-500">{description}</p>
    </a>
  );
}
