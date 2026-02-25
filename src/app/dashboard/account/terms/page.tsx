"use client";

import { dashboardContent } from "@/content";

// Mock terms content - replace with real data from API/CMS later
const MOCK_TERMS = {
  lastUpdated: "١ يناير ٢٠٢٥",
  sections: [
    {
      title: "١. القبول بالشروط",
      content:
        "باستخدامك منصة إنجاز معلم، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه البنود، يرجى عدم استخدام الخدمة.",
    },
    {
      title: "٢. وصف الخدمة",
      content:
        "توفر منصة إنجاز معلم أدوات لإنشاء وإدارة ملفات الإنجاز المهني للمعلمين والمعلمات. تشمل الخدمة إنشاء الملفات، إضافة الشواهد، ومعاينة ونشر الملفات وفقاً للإعدادات المتاحة.",
    },
    {
      title: "٣. حساب المستخدم والمسؤولية",
      content:
        "أنت مسؤول عن الحفاظ على سرية بيانات الدخول الخاصة بحسابك. أي نشاط يتم تحت حسابك يقع تحت مسؤوليتك. يُنصح بعدم مشاركة كلمة المرور مع أي طرف ثالث.",
    },
    {
      title: "٤. المحتوى والملكية الفكرية",
      content:
        "المحتوى الذي تضيفه إلى ملفك (نصوص، صور، شواهد) يبقى ملكاً لك. تمنح المنصة ترخيصاً محدوداً لعرض ومعالجة هذا المحتوى لغرض تقديم الخدمة فقط. لا تستخدم المنصة محتواك لأغراض أخرى دون موافقتك.",
    },
    {
      title: "٥. قواعد الاستخدام",
      content:
        "يتعهد المستخدم بعدم استخدام الخدمة لأغراض غير قانونية أو مخالفة للأنظمة المعمول بها. يُحظر رفع محتوى مسيء أو منسوخ دون إذن. تحتفظ المنصة بحق تعليق أو إنهاء الحساب في حال المخالفة.",
    },
    {
      title: "٦. التحديثات والتعديلات",
      content:
        "قد نقوم بتحديث هذه الشروط من وقت لآخر. سيتم إشعارك بالتغييرات الجوهرية عبر المنصة أو البريد الإلكتروني. استمرارك في استخدام الخدمة بعد التحديث يعني موافقتك على الشروط المعدّلة.",
    },
    {
      title: "٧. التواصل",
      content:
        "للاستفسارات حول الشروط والأحكام أو الخدمة، يمكنك التواصل معنا عبر قنوات الدعم المتاحة في قسم الدعم الفني بحسابك.",
    },
  ],
};

export default function TermsPage() {
  const { breadcrumb } = dashboardContent;

  return (
    <div className="bg-[#FAFAFA] rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[400px] text-right">
      <h1 className="text-xl sm:text-2xl font-semibold text-secondary-800 mb-2">
        {breadcrumb.terms}
      </h1>
      <p className="text-sm text-grey-500 mb-8">
        آخر تحديث: {MOCK_TERMS.lastUpdated}
      </p>

      <div className="space-y-8">
        {MOCK_TERMS.sections.map((section, index) => (
          <section
            key={index}
            className="border-b border-grey-100 pb-6 last:border-b-0 last:pb-0"
          >
            <h2 className="text-base sm:text-lg font-semibold text-secondary-800 mb-3">
              {section.title}
            </h2>
            <p className="text-sm sm:text-base text-grey-600 leading-relaxed">
              {section.content}
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
