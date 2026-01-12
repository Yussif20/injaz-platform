/**
 * Authentication pages content
 * Sign In, Sign Up, Forgot Password
 */

export const authContent = {
  signIn: {
    logoAlt: "شعار إنجاز معلم",
    title: "تسجيل دخول",
    subtitle: "مرحبا بك مرة ثانية، سجل بياناتك للدخول",
    phoneLabel: "رقم الجوال*",
    phonePlaceholder: "مثال: 96587432",
    passwordLabel: "كلمة المرور*",
    passwordPlaceholder: "*********",
    forgotPassword: "نسيت كلمة المرور؟",
    submitButton: "تسجيل دخول",
    signUpLink: "ليس لديك حساب؟ إنشاء حساب جديد",
    customerServiceAlt: "خدمة العملاء",
  },

  signUp: {
    logoAlt: "شعار إنجاز معلم",
    title: "إنشاء حساب جديد",
    subtitle: "مرحبا بك في انجاز معلم، سجل البيانات لإنشاء حسابك",
    fullNameLabel: "الإسم ثلاثي",
    fullNameNote: "* (لا يمكن تغييره لاحقا)",
    fullNamePlaceholder: "مثال: محمد أحمد العتيبي",
    genderLabel: "النوع",
    genderRequired: "*",
    genderPlaceholder: "اختر النوع",
    genderMale: "ذكر",
    genderFemale: "أنثى",
    phoneLabel: "رقم الجوال",
    phoneNote: "* (لا يمكن تغييره لاحقا)",
    phonePlaceholder: "مثال: 96587432",
    passwordLabel: "كلمة المرور",
    passwordRequired: "*",
    passwordPlaceholder: "*********",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "مثال: mohamed@gmail.com",
    confirmPasswordLabel: "إعادة كلمة المرور",
    confirmPasswordRequired: "*",
    confirmPasswordPlaceholder: "*********",
    termsLabel: "أوافق على الشروط والأحكام",
    submitButton: "إنشاء حساب",
    signInLink: "لديك حساب؟ تسجيل دخول",
    customerServiceAlt: "خدمة العملاء",
  },

  forgotPassword: {
    title: "استعادة كلمة المرور",
    subtitle: "أدخل رقم جوالك وسنرسل لك رمز التحقق",
    phoneLabel: "رقم الجوال*",
    phonePlaceholder: "مثال: 96587432",
    submitButton: "إرسال رمز التحقق",
    backToLogin: "العودة لتسجيل الدخول",
    // Reset password step
    otpSentTo: "تم إرسال رمز التحقق إلى",
    otpLabel: "رمز التحقق",
    newPasswordLabel: "كلمة المرور الجديدة *",
    newPasswordPlaceholder: "*********",
    confirmNewPasswordLabel: "تأكيد كلمة المرور الجديدة *",
    confirmNewPasswordPlaceholder: "*********",
    resetButton: "تغيير كلمة المرور",
  },

  // OTP related strings
  otp: {
    title: "التحقق من رقم الجوال",
    titleConfirm: "تأكيد رقم الجوال",
    subtitle: "أدخل رمز التحقق المرسل إلى رقمك",
    subtitleRegister:
      "برجاء ادخال رمز التحقق المكون من 6 أرقام الذي تم ارساله على واتساب للرقم",
    sentTo: "تم إرسال رمز التحقق إلى",
    inputLabel: "رمز التحقق",
    verifyButton: "تحقق",
    resendText: "لم تستلم الرمز؟",
    resendButton: "إعادة الإرسال",
    resendCountdown: "إعادة الإرسال",
    errorLength6: "رمز التحقق يجب أن يكون 6 أرقام",
    errorInvalid: "رمز التحقق غير صحيح",
  },

  // Support page
  support: {
    logoAlt: "إنجاز معلم",
    backAlt: "رجوع",
    title: "الدعم الفني",
    subtitle: "تواصل معنا",
    description: "تواصل معنا خلال واتساب ليتم مساعدتك بأقرب وقت",
    whatsappAlt: "واتساب",
  },

  // Step labels for multi-step forms
  steps: {
    phone: "رقم الجوال",
    verify: "التحقق",
    details: "البيانات",
    newPassword: "كلمة المرور الجديدة",
  },

  // Error messages
  errors: {
    loginFailed: "فشل تسجيل الدخول",
    registerFailed: "فشل إنشاء الحساب",
    invalidCredentials: "رقم الجوال أو كلمة المرور غير صحيحة",
    invalidOtp: "رمز التحقق غير صحيح",
    otpExpired: "انتهت صلاحية رمز التحقق",
    sendOtpFailed: "فشل إرسال رمز التحقق",
    phoneRequired: "رقم الجوال مطلوب",
    passwordRequired: "كلمة المرور مطلوبة",
    passwordMismatch: "كلمات المرور غير متطابقة",
    passwordTooShort: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
    invalidPhone: "رقم الجوال غير صالح",
    invalidEmail: "البريد الإلكتروني غير صالح",
    termsRequired: "يجب الموافقة على الشروط والأحكام",
    serverError: "حدث خطأ غير متوقع",
    networkError: "خطأ في الاتصال بالخادم",
  },

  // Success messages
  success: {
    loginSuccess: "تم تسجيل الدخول بنجاح",
    registerSuccess: "تم إنشاء الحساب بنجاح",
    otpSent: "تم إرسال رمز التحقق بنجاح",
    otpVerified: "تم التحقق من الرمز بنجاح",
    passwordReset: "تم تغيير كلمة المرور بنجاح",
    logoutSuccess: "تم تسجيل الخروج بنجاح",
  },

  // Buttons
  buttons: {
    back: "رجوع",
    next: "التالي",
    submit: "إرسال",
    verify: "تحقق",
    login: "تسجيل دخول",
    register: "إنشاء حساب",
    resetPassword: "تغيير كلمة المرور",
  },
};
