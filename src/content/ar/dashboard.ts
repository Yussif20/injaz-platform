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

  // How to use page
  howToUse: {
    pageTitle: "شاهد المقطع لمعرفة كيفية الإستخدام",
    playVideo: "تشغيل الفيديو",
    steps: [
      {
        title: "ابدأ بإضافة بياناتك من خلال حسابي > بيانات ملفي",
        description: "",
      },
      {
        title: "بعد إضافة بياناتك أنشئ ملفك واملئ البيانات الأساسية",
        description: "",
      },
      {
        title: "إضافة بنود للملف من خلال بطاقة الملف",
        description: "مرفق من إعداد ومتابعة الدروس والواجبات والاختبارات",
      },
      {
        title: "معاينة الملف واختيار قالب تصميم",
        description: "",
      },
      {
        title: "نشر الملف، عند نشر ملفك يمكنك مشاركته او تحميله PDF",
        description: "",
      },
    ],
    buttons: {
      addItems: "إضافة بنود",
      previewFile: "معاينة الملف",
      saveAsDraft: "حفظ كمسودة",
      preview: "معاينة الملف",
      customizeTemplate: "تخصيص القالب",
      published: "منشور",
    },
  },

  // Profile data page (بيانات ملفي)
  profileData: {
    tabs: {
      myData: "بياناتي",
      education: "بيانات علمية",
      job: "بيانات وظيفية",
    },
    edit: "تعديل",
    saveChanges: "حفظ التغيرات",
    cancel: "إلغاء",

    // Sub navigation
    subNav: {
      myData: "بياناتي",
      educationData: "البيانات العلمية",
      jobData: "البيانات الوظيفية",
    },

    // My Data section
    generalData: "بيانات عامة",
    contactData: "بيانات التواصل",
    fields: {
      nationalId: "رقم الهوية",
      origin: "المنشأ",
      birthDate: "تاريخ الميلاد",
      workEmail: "البريد الإلكتروني للعمل",
      whatsappNumber: "رقم واتساب",
    },

    // Education section
    educationTitle: "المؤهلات العلمية",
    certificationsTitle: "الشهادات والدورات",
    educationFields: {
      degree: "الدرجة العلمية",
      specialization: "التخصص",
      university: "الجامعة",
      graduationYear: "سنة التخرج",
      certName: "اسم الشهادة",
      certIssuer: "الجهة المانحة",
      certYear: "السنة",
    },
    academicDegrees: [
      { value: "diploma", label: "دبلوم" },
      { value: "bachelor", label: "بكالوريوس" },
      { value: "master", label: "ماجستير" },
      { value: "doctorate", label: "دكتوراه" },
    ],

    // Job section
    jobTitle: "الخبرات الوظيفية",
    jobFields: {
      schoolName: "اسم المدرسة",
      position: "المسمى الوظيفي",
      department: "القسم/الإدارة",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      currentJob: "الوظيفة الحالية",
    },
    addPosition: "إضافة وظيفة",
    addCertification: "إضافة شهادة",
    removeCertification: "حذف",
    removePosition: "حذف",
  },
};
