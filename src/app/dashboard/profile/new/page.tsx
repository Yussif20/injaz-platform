import { dashboardContent } from "@/content";

export default function CreateProfilePage() {
  const { sidebar } = dashboardContent;

  return (
    <div className="text-right" dir="rtl">
      <h1 className="text-2xl font-medium text-secondary-800 mb-4">
        {sidebar.createProfile}
      </h1>
      <p className="text-grey-600">
        صفحة إنشاء ملف جديد - قريباً
      </p>
    </div>
  );
}
