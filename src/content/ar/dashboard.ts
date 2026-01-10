/**
 * Dashboard pages content
 * Sidebar, Account, Settings
 */

export const dashboardContent = {
  // Main sidebar navigation
  sidebar: {
    home: "الرئيسية",
    createProfile: "أنشئ ملف",
    myAccount: "حسابي",
  },

  // Top navbar
  navbar: {
    logout: "تسجيل الخروج",
    logoAlt: "إنجاز المعلم",
  },

  // Breadcrumb
  breadcrumb: {
    account: "حسابي",
    accountInfo: "بيانات الحساب",
    profileData: "بيانات ملفي",
    subscription: "اشتراكي",
    support: "الدعم الفني",
    terms: "الشروط والأحكام",
    howToUse: "كيفية الإستخدام",
    filePassword: "تعيين كلمة مرور للملفات",
    changePassword: "تغيير كلمة المرور",
  },

  // Account inner sidebar
  accountSidebar: {
    accountInfo: "بيانات الحساب",
    profileData: "بيانات ملفي",
    subscription: "اشتراكي",
    support: "الدعم الفني",
    terms: "الشروط والأحكام",
    howToUse: "كيفية الإستخدام",
    filePassword: "تعيين كلمة مرور للملفات",
  },

  // Account info page (بيانات الحساب)
  accountInfo: {
    editImage: "تعديل الصورة",
    profileImageAlt: "صورة الملف الشخصي",
    nameLabel: "الاسم",
    genderLabel: "النوع",
    genderMale: "ذكر",
    genderFemale: "أنثى",
    genderPlaceholder: "اختر النوع",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "مثال: mohamed@gmail.com",
    phoneLabel: "رقم الجوال",
    changePassword: "تغيير كلمة المرور",
    saveChanges: "حفظ التغيرات",
    deleteAccount: "حذف الحساب",
  },

  // Change password page
  changePassword: {
    title: "تغيير كلمة المرور",
    oldPasswordLabel: "كلمة المرور الحالية *",
    oldPasswordPlaceholder: "*********",
    newPasswordLabel: "كلمة المرور الجديدة *",
    newPasswordPlaceholder: "*********",
    confirmPasswordLabel: "تأكيد كلمة المرور الجديدة *",
    confirmPasswordPlaceholder: "*********",
    saveChanges: "حفظ التغيرات",
  },

  // Modals
  modals: {
    logout: {
      title: "تسجيل الخروج",
      message: "هل أنت متأكد من تسجيل الخروج؟",
      confirm: "تسجيل الخروج",
      cancel: "إلغاء",
    },
    deleteAccount: {
      title: "حذف الحساب",
      message: "هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.",
      confirm: "حذف الحساب",
      cancel: "إلغاء",
    },
  },

  // Error messages
  errors: {
    oldPasswordRequired: "كلمة المرور الحالية مطلوبة",
    newPasswordRequired: "كلمة المرور الجديدة مطلوبة",
    confirmPasswordRequired: "تأكيد كلمة المرور مطلوب",
    passwordMismatch: "كلمات المرور غير متطابقة",
    passwordTooShort: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    invalidEmail: "البريد الإلكتروني غير صالح",
    updateFailed: "فشل تحديث البيانات",
    deleteAccountFailed: "فشل حذف الحساب",
  },

  // Success messages
  success: {
    profileUpdated: "تم تحديث البيانات بنجاح",
    passwordChanged: "تم تغيير كلمة المرور بنجاح",
    accountDeleted: "تم حذف الحساب بنجاح",
  },
};
