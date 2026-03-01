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

  // Welcome header
  welcomeHeader: {
    greeting: "مرحبًا بك،",
    subtext: "ابدء رحلتك معنا بتجميع إنجازاتك لكل سنة",
  },

  // Files section
  filesSection: {
    title: "الملفات",
    creationDate: "تاريخ الإنشاء:",
    addEvidence: "اضافة شواهد",
    previewFile: "معاينة الملف",
    noFiles: "لا توجد ملفات حتى الآن",
    createFirstFile: "أنشئ ملفك الأول",
    // Empty state (no files yet)
    emptyStateTitle: "ليس لديك ملفات انجاز بعد ",
    emptyStateSubtitle: "انشئ اول ملف إنجاز لك الآن",
    emptyStateButton: "إنشاء الملف",
  },

  // File status badges
  fileStatus: {
    incomplete: "ملف غير مكتمل",
    unpublished: "ملف غير منشور",
    published: "ملف منشور",
  },

  // File options menu
  fileOptions: {
    editBasicData: "تعديل بيانات الملف الأساسية",
    editMyData: "تعديل بياناتي",
    createPassword: "إنشاء كلمة مرور للملف",
    changePassword: "إعدادات كلمة المرور",
    unpublish: "إلغاء النشر",
    deleteFile: "حذف الملف",
  },

  // Filters section
  filters: {
    filterByYear: "تصنيف حسب السنة",
    filterByStatus: "تصنيف حسب حالة الملف",
    filterButton: "تصنيف",
    allYears: "كل السنوات",
    allStatuses: "الكل",
    gregorian: "تاريخ ميلادي",
    hijri: "تاريخ هجري",
    years: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
  },

  // File password modals
  filePasswordModal: {
    setTitle: "تعيين كلمة مرور الملف",
    setDescription: "لا يمكن لأحد الإطلاع على ملفك إلا بعد إدخال كلمة المرور",
    changeTitle: "إعدادات كلمة المرور",
    passwordLabel: "كلمة المرور",
    newPasswordLabel: "كلمة المرور الجديدة",
    passwordPlaceholder: "مثال: Am@234",
    activateButton: "تفعيل",
    saveChangesButton: "حفظ التغييرات",
    deactivateButton: "إلغاء التفعيل",
  },

  // Top navbar
  navbar: {
    logout: "تسجيل الخروج",
    logoAlt: "إنجاز المعلم",
  },

  // Breadcrumb
  breadcrumb: {
    home: "الرئيسية",
    account: "حسابي",
    accountInfo: "بيانات الحساب",
    profileData: "بيانات ملفي",
    subscription: "اشتراكي",
    subscriptionManage: "إدارة الاشتراكات",
    subscriptionHistory: "تاريخ الاشتراكات",
    subscriptionConfirm: "تأكيد الاشتراك",
    support: "الدعم الفني",
    terms: "الشروط والأحكام",
    howToUse: "كيفية الإستخدام",
    filePassword: "تعيين كلمة مرور للملفات",
    changePassword: "تغيير كلمة المرور",
    createFile: "انشاء ملف انجاز",
  },

  // Account inner sidebar
  accountSidebar: {
    accountInfo: "بيانات الحساب",
    profileData: "بيانات ملفي",
    profileDataPersonal: "بياناتي",
    profileDataEducation: "البيانات العلمية",
    profileDataCareer: "البيانات الوظيفية",
    subscription: "اشتراكي",
    subscriptionManage: "إدارة الاشتراكات",
    subscriptionHistory: "تاريخ الاشتراكات",
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
      message: "هل ترغب بتسجيل الخروج؟",
      confirm: "تسجيل الخروج",
      cancel: "إلغاء",
    },
    deleteAccount: {
      title: "حذف الحساب",
      message: "هل انت متأكد من حذف الحساب؟",
      confirm: "حذف الحساب",
      cancel: "إلغاء",
    },
    deleteFile: {
      title: "هل انت متأكد من حذف الملف نهائياً؟",
      confirm: "حذف الملف",
      cancel: "إلغاء",
    },
    editDataWarning: {
      title: "عند تعديل البيانات يتم حذف بنود الملف",
      message: "سيتعين عليك إضافة بنود جديدة تبعاً للبيانات الجديدة",
      confirm: "تعديل البيانات",
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
    passwordNeedsUppercase:
      "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل",
    passwordNeedsSpecialChar:
      "كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)",
    invalidEmail: "البريد الإلكتروني غير صالح",
    updateFailed: "فشل تحديث البيانات",
    deleteAccountFailed: "فشل حذف الحساب",
  },

  // Password requirements hint
  passwordRequirements: {
    title: "متطلبات كلمة المرور:",
    minLength: "6 أحرف على الأقل",
    uppercase: "حرف كبير واحد على الأقل (A-Z)",
    specialChar: "رمز خاص واحد على الأقل (!@#$%^&*)",
  },

  // Success messages
  success: {
    profileUpdated: "تم تحديث البيانات بنجاح",
    passwordChanged: "تم تغيير كلمة المرور بنجاح",
    accountDeleted: "تم حذف الحساب بنجاح",
  },

  // Sections page (البنود)
  sectionsPage: {
    pageTitle: "البنود",
    subtitle: "قم باختيار و تعديل البنود المرغوب في إضافتها",
    saveAsDraft: "حفظ كمسودة",
    previewFile: "معاينة الملف",
    weightLabel: "الوزن النسبي:",
    addEvidence: "إضافة شاهد",
    addAnotherEvidence: "إضافة شاهد آخر",
    breadcrumb: {
      home: "الرئيسية",
      addEvidence: "اضافة شواهد",
      sections: "البنود",
    },
  },

  // Add Evidence Modal
  addEvidenceModal: {
    title: "بيانات الشاهد",
    imageTitleLabel: "عنوان الصورة",
    imageTitlePlaceholder: "ادخل وصف مناسب للصورة",
    imageSizeLimit: "يجب أن لا يزيد حجم الصورة عن 5 ميجا",
    uploadImage: "تحميل الصورة",
    submitButton: "اضافة الشاهد",
    changeImage: "تغيير الصورة",
  },

  // Edit Evidence Modal
  editEvidenceModal: {
    title: "تعديل الشاهد",
    submitButton: "حفظ التغييرات",
  },

  // Image Actions
  imageActions: {
    edit: "تعديل",
    delete: "حذف",
    deleteConfirmMessage: "هل انت متأكد من حذف الصورة؟",
    deleteConfirmButton: "حذف",
    cancelButton: "إلغاء",
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

  // Create file page (انشاء ملف انجاز)
  createFile: {
    pageTitle: "انشاء ملف انجاز",
    errorAlreadyHasProfileForYear:
      "لديك بالفعل ملف لهذه السنة الدراسية. يمكنك العودة للوحة التحكم لتعديله أو إنشاء ملف لسنة أخرى.",
    imageLabel: "صورة الملف",
    imageHint: "(صورة شخصية او عادية)",
    imageSizeLimit: "يجب أن لا يزيد حجم الصورة عن 1 ميجا",
    uploadImage: "تحميل الصورة",
    changeImage: "تغيير الصورة",
    yearLabel: "حدد العام الدراسي",
    yearPlaceholder: "مثال: 2025",
    profileTypeLabel: "حدد نوع الملف",
    profileTypePlaceholder: "اختر نوع الملف",
    createFileButton: "إنشاء الملف",
    saveChangesButton: "حفظ التغييرات",
    editPageTitle: "تعديل بيانات الملف",
    dateTypes: {
      gregorian: "تاريخ ميلادي",
      hijri: "تاريخ هجري",
    },
    jobRanks: [
      { value: "معلم ممارس", label: "معلم ممارس" },
      { value: "معلم متقدم", label: "معلم متقدم" },
      { value: "معلم خبير", label: "معلم خبير" },
    ],
    gregorianYears: [
      { value: "2024", label: "2024" },
      { value: "2025", label: "2025" },
      { value: "2026", label: "2026" },
    ],
    hijriYears: [
      { value: "1442هـ", label: "1442هـ" },
      { value: "1443هـ", label: "1443هـ" },
      { value: "1444هـ", label: "1444هـ" },
    ],
    // Promo sidebar
    promoTitle: "أنشئ ملفك",
    promoSubtitle: "بسهولة من جوالك",
    promoDescription: "تطبيقنا متوفر على",
    playStore: "Get it from Play Store",
    appStore: "Get it from App Store",
  },

  // Preview Portfolio Page (معاينة الملف)
  previewPage: {
    pageTitle: "معاينة الملف",
    downloadFile: "تحميل الملف",
    downloadAsImage: "تحميل كصورة",
    shareFile: "مشاركة الملف",
    fileTitle: "ملف إنجاز",
    publishFile: "نشر الملف",
    memberBadge: "عضو في ملتقى المعلمين",

    // Personal Info Section
    personalInfo: {
      title: "بياناتي",
      subtitle: "تعرف على بياناتي الشخصية",
      birthday: "تاريخ الميلاد",
      email: "البريد الإلكتروني",
      nationalId: "الهوية الوطنية",
      origin: "المنشأ",
    },

    // Education Section
    education: {
      title: "البيانات العلمية",
      subtitle: "تعرف على المؤهلات العلمية للمعلم/ة في",
    },

    // Career Section
    career: {
      title: "البيانات الوظيفية",
      subtitle: "تعرف على المسيرة الوظيفية للمعلم/ة في",
    },

    // Achievements Section
    achievements: {
      title: "مهام وإنجازات المعلم",
      subtitle: "تعرف على أبرز إنجازاتي ومهاراتي",
      weightLabel: "الوزن النسبي",
      attachmentLabel: "مرفق من",
    },

    // Contact Section
    contact: {
      title: "تواصل معي",
    },

    // Theme Selector
    themeSelector: {
      title: "تخصيص القالب",
      themes: {
        default: "افتراضي",
        dark: "داكن",
        heritage: "تراثي",
        arabic: "عربي",
      },
      customizeButton: "تخصيص القالب",
    },

    // Loading & Error
    loading: "جاري التحميل...",
    notFound: "لم يتم العثور على الملف",
    backHome: "العودة للرئيسية",
  },

  // Subscription pages
  subscription: {
    // Page titles
    manageTitle: "إدارة الاشتراكات",
    historyTitle: "تاريخ الاشتراكات",

    // Promo banner
    promoBadge: "عروض نهاية العام",
    planTitle: "خطة الاشتراك",
    priceOriginal: "70",
    priceDiscounted: "50",
    priceCurrency: "ريال",
    priceUnit: "السنة الدراسية",
    priceSuffix: "بدل",

    // Plan features
    features: [
      "ملف إنجاز لكل سنة دراسية",
      "إمكانية إنشاء كلمة مرور خاصة للملف",
      "إضافة بنود خاصة لكل رتبة وظيفية",
      "إمكانية نشر الملف وتحميله بصيغة PDF",
      "اختيار شكل للملف من بين 4 قوالب تصميم مميزة",
    ],

    // Countdown
    countdownTitle: "متبقي على الإنتهاء",
    days: "أيام",
    hours: "ساعة",
    minutes: "دقيقة",
    seconds: "ثواني",

    // Subscribe button
    subscribeNow: "اشترك الآن",

    // Empty states
    noSubscriptions: "لا يوجد اشتراكات بعد",
    noHistory: "لا يوجد سجل اشتراكات",

    // History table
    historyTableHeaders: {
      plan: "الخطة",
      startDate: "تاريخ البداية",
      endDate: "تاريخ النهاية",
      status: "الحالة",
      amount: "المبلغ",
    },

    // Status labels
    statusActive: "نشط",
    statusExpired: "منتهي",
    statusCancelled: "ملغي",

    // Active subscription card
    activeSubscriptionTitle: "اشتراكك الحالي",
    activeExpiryLabel: "تاريخ الانتهاء:",
    activeDaysRemainingLabel: "الأيام المتبقية:",
    activePaymentMethodLabel: "طريقة الدفع:",
    activeAmountLabel: "المبلغ المدفوع:",
    viewHistoryLink: "عرض السجل",
    sar: "ر.س",
    dayUnit: "يوم",

    // Closed subscription message
    closedTitle: "الاشتراكات مغلقة حالياً",
    closedMessage: "لا تتوفر اشتراكات في الوقت الحالي، يرجى المحاولة لاحقاً.",

    // Payment flow
    processingPayment: "جاري معالجة الدفع...",
    paymentSuccess: "تم الاشتراك بنجاح!",
    paymentSuccessMessage: "تم تفعيل اشتراكك. يمكنك الآن إنشاء ملفات الإنجاز.",
    paymentError: "فشلت عملية الدفع",
    retryPayment: "إعادة المحاولة",
    applePayComingSoon: "متاح قريباً",
    applePayUnavailable: "يتطلب Safari",
    applePayHint: "ستظهر نافذة Apple Pay لإتمام الدفع",
    applePayPayButton: "الدفع بـ Apple Pay",

    // 3DS callback page
    callbackVerifying: "جاري التحقق من الدفع...",
    callbackVerifyingMessage: "يرجى الانتظار بينما نتحقق من حالة الدفع.",
    callbackSuccess: "تم الاشتراك بنجاح!",
    callbackSuccessMessage: "سيتم تحويلك إلى صفحة الاشتراك خلال ثوانٍ.",
    callbackPending: "جاري التحقق من الدفع...",
    callbackPendingMessage: "إذا اكتمل الدفع، سيظهر اشتراكك خلال دقائق.",
    callbackRefresh: "تحديث الحالة",
    callbackGoToSubscription: "الذهاب إلى الاشتراك",

    // Subscription form
    form: {
      title: "تأكيد الإشتراك",
      subscriptionValue: "قيمة الاشتراك:",
      expiryDate: "موعد الانتهاء:",
      priceText: "50 ريال بدل 70 / للسنة الدراسية",

      // Payment methods
      paymentMethodTitle: "اختر طريقة الدفع المناسبة",
      visa: "فيزا",
      mada: "مدى",
      applePay: "أبل باي",

      // Card details
      cardDetailsTitle: "بيانات البطاقة",
      cardNameLabel: "الاسم على البطاقة",
      cardNamePlaceholder: "مثال: محمد أحمد العتيبي",
      cardNumberLabel: "رقم البطاقة",
      cardNumberPlaceholder: "مثال: 123 456 789 587",
      cvvLabel: "رمز التحقق",
      cvvPlaceholder: "مثال: 123",
      expiryLabel: "تاريخ الإنتهاء",
      expiryPlaceholder: "شهر/سنة",

      // Buttons
      confirmPayment: "تأكيد الدفع",
      cancel: "إلغاء",

      // Confirmation modal
      confirmModalTitle: "تأكيد الاشتراك",
      remainingText: "متبقي على انتهاء السنة الدراسية:",
      subscriptionEndsOn: "الاشتراك ينتهي في:",
      monthAnd: "شهر و",
      days: "أيام",
      confirm: "تأكيد",
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
