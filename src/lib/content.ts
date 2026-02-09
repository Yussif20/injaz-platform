export type Locale = "ar" | "en";

export const content = {
  ar: {
    common: {
      appName: "إنجاز",
      actions: {
        save: "حفظ",
        cancel: "إلغاء",
        delete: "حذف",
        edit: "تعديل",
        search: "بحث",
      },
      status: {
        loading: "جاري التحميل...",
        success: "تمت العملية بنجاح",
        error: "حدث خطأ",
      },
    },
    auth: {
      login: {
        title: "تسجيل الدخول",
        phone: "رقم الهاتف",
        phonePlaceholder: "05xxxxxxxx",
        password: "كلمة المرور",
        passwordPlaceholder: "أدخل كلمة المرور",
        submit: "دخول",
        forgotPassword: "نسيت كلمة المرور؟",
        errorGeneric: "فشل تسجيل الدخول، يرجى المحاولة مرة أخرى",
      },
      logout: "تسجيل الخروج",
    },
    dashboard: {
      title: "لوحة التحكم",
      welcome: "مرحباً بك في إنجاز",
      sidebar: {
        reports: "إحصائيات وتقارير",
        users: "إدارة العملاء",
        files: "إدارة الملفات",
        subscriptions: "إدارة الإشتراكات",
        ranks: "إدارة الرتب والبنود",
        academicYears: "إدارة السنوات الدراسية",
        assessments: "إدارة التقييمات",
        terms: "الشروط والأحكام",
        socials: "إدارة وسائل التواصل",
        logout: "تسجيل الخروج",
      },
      navbar: {
        logout: "تسجيل الخروج",
        language: "English",
      },
    },
    socials: {
      title: "إدارة وسائل التواصل",
      goBack: "العودة للسابق",
      socialAccounts: "حسابات التواصل الإجتماعي",
      contactInfo: "معلومات تواصل الموقع",
      instagram: "حساب انستجرام",
      snapchat: "حساب سناب شات",
      tiktok: "حساب تيك توك",
      x: "حساب إكس",
      facebook: "حساب فيسبوك",
      phoneNumber: "رقم الجوال",
      email: "البريد الإلكتروني",
      youtube: "قناة يوتيوب",
      enterAccountLink: "ادخل رابط الحساب",
      enterPhoneNumber: "ادخل رقم الجوال",
      enterEmail: "ادخل البريد الإلكتروني",
      enterChannelLink: "ادخل رابط القناة",
      save: "حفظ البيانات",
    },
  },
  en: {
    common: {
      appName: "Injaz",
      actions: {
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        search: "Search",
      },
      status: {
        loading: "Loading...",
        success: "Operation completed successfully",
        error: "An error occurred",
      },
    },
    auth: {
      login: {
        title: "Login",
        phone: "Phone Number",
        phonePlaceholder: "05xxxxxxxx",
        password: "Password",
        passwordPlaceholder: "Enter your password",
        submit: "Sign In",
        forgotPassword: "Forgot password?",
        errorGeneric: "Login failed, please try again",
      },
      logout: "Logout",
    },
    dashboard: {
      title: "Dashboard",
      welcome: "Welcome to Injaz",
      sidebar: {
        reports: "Statistics & Reports",
        users: "Client Management",
        files: "File Management",
        subscriptions: "Subscription Management",
        ranks: "Ranks & Items",
        academicYears: "Academic Years",
        assessments: "Assessment Management",
        terms: "Terms & Conditions",
        socials: "Social Media Management",
        logout: "Logout",
      },
      navbar: {
        logout: "Logout",
        language: "العربية",
      },
    },
    socials: {
      title: "Social Media Management",
      goBack: "Go Back",
      socialAccounts: "Social Media Accounts",
      contactInfo: "Website Contact Info",
      instagram: "Instagram Account",
      snapchat: "Snapchat Account",
      tiktok: "TikTok Account",
      x: "X Account",
      facebook: "Facebook Account",
      phoneNumber: "Phone Number",
      email: "Email Address",
      youtube: "YouTube Channel",
      enterAccountLink: "Enter account link",
      enterPhoneNumber: "Enter phone number",
      enterEmail: "Enter email address",
      enterChannelLink: "Enter channel link",
      save: "Save Data",
    },
  },
};

export function getTranslations(locale: Locale) {
  return content[locale];
}

export function getTranslation(
  locale: Locale,
  namespace: keyof (typeof content)[Locale],
  key?: string,
) {
  const ns = content[locale][namespace] as any;
  if (!key) return ns;
  return key.split(".").reduce((obj, k) => obj?.[k], ns);
}
