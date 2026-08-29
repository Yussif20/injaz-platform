/**
 * Landing page content
 * Hero, Why, Banner, HowTo, DesignChoice, MobileApp sections
 */

export const landingContent = {
  hero: {
    titleStart: "أنشئ ",
    titleHighlight: "ملف إنجازك",
    titleEnd1: " لكل سنة الآن بسهولة",
    titleEnd2: "ووضوح مع إنجاز معلم",
    ctaButton: "انشاء ملف",
    imageAlt: "Hero Image",
  },

  whySection: {
    title: "ليش انجاز المعلم؟",
    card1Text: "إمكانية الوصول من الموقع والجوال",
    card2RightTitleLine1: "إمكانية مشاركة",
    card2RightTitleLine2: " الملف وتحميله PDF",
    card2LeftTitle: "تصاميم مختلفة وأقسام متنوعة لكل رتبة",
    card3Text: "تحديثات سنوية لملف إنجازك",
  },

  bannerSection: {
    title: "نهتم بكل تفاصيلك!",
    subtitle: "شاركنا رحلتك المهنية الحين وانشئ ملفات انجازك معنا",
    imageAlt: "Banner background",
  },

  howToSection: {
    title: "كيف تنشأ ملف انجازك؟",
    steps: [
      {
        number: "1",
        main: "سجل دخولك او إنشئ حساب جديد",
        sub: "يمكنك التسجيل من خلال الموقع او التطبيق الخاص بنا",
      },
      {
        number: "2",
        main: "اختر إنشاء ملف",
        sub: "حدد رتبتك الوظيفية والسنة الدراسية",
      },
      {
        number: "3",
        main: "أضف بياناتك",
        sub: "بياناتك الشخصية، بياناتك العلمية والوظيفية، والمهام والإنجازات في بنود مخصصة مرفقة بشواهد",
      },
      {
        number: "4",
        main: "يمكنك معاينه الملف، حفظه كمسودة او نشره بسهولة!",
        sub: "بعد نشر ملفك يمكنك تحميله بصيغه PDF او مشاركته",
      },
    ],
    ctaButton: "إنشاء ملف",
  },

  designChoiceSection: {
    title: "تصميمك المُفضل بانتظارك",
    subtitle: "اختر شكل لملفك من بين 4 تصاميم مميزة",
    imageAlt: "Design Choice Section",
  },

  mobileAppSection: {
    title: "إدارة ملفك أسهل من الجوال!",
    features: [
      "حمل التطبيق لتسجيل دخول او إنشاء حساب",
      "إختر إنشاء ملف",
      "أضف بياناتك ( بيانات شخصية، بيانات علمية ووظيفية )",
      "أضف بنود وشواهد حسب رغبتك",
      "انشر ملفك، حمله او شاركه بسهولة",
    ],
    downloadText: "حمله الآن! متوفر على:",
    imageAlt: "Mobile App Preview",
  },

  faqSection: {
    title: "عندك سؤال؟ خلنا نجاوبك",
    contactUs: "تواصل معنا",
    contactDescription: "إذا لم تتمكن من العثور على اجابتك",
    supportButton: "الدعم الفني",
    whatsappNumber: "966548635554",
    questions: [
      {
        id: "1",
        question: "ما مدة الاشتراك ومتى ينتهي؟",
        answer:
          "مدة الاشتراك سنة دراسية واحدة، وينتهي في التاريخ المعلن وقت الدفع والمحدد لنهاية السنة الدراسية.",
      },
      {
        id: "2",
        question: "هل يمكنني استخدام انجاز المعلم بشكل مجاني؟",
        answer:
          "نعم، يمكنك استخدام انجاز المعلم مجانًا لإدخال بياناتك، رفع الشواهد، ومعاينة ملف الإنجاز. يتطلب الاشتراك المدفوع لتصدير الملف بصيغة PDF أو إنشاء رابط مشاركة.",
      },
      {
        id: "3",
        question: "هل يمكنني تغيير اسمي الشخصي؟",
        answer:
          "لا يمكن تغيير الاسم بعد إنشاء الحساب. في حال تم إدخال الاسم بشكل خاطئ، يمكنك التواصل مع الدعم الفني لدراسة الحالة واتخاذ الإجراء المناسب.",
      },
      {
        id: "4",
        question: "هل أستطيع استرداد المبلغ أو إلغاء الاشتراك واسترداد المدفوعات؟",
        answer:
          "لا، المدفوعات غير قابلة للاسترداد بعد إتمام عملية الدفع، إلا في حال ثبوت وجود خلل تقني يمنعنا من تقديم الخدمة المتفق عليها.",
      },
      {
        id: "5",
        question: "كيف أتواصل مع الدعم الفني؟",
        answer:
          "يمكنك التواصل مع الدعم الفني عبر واتساب. يتم الرد خلال 48 ساعة عمل للحالات العامة، ويتم التعامل مع الحالات الطارئة خلال وقت أقصر.",
        answerWhatsappLabel: "الرقم على واتساب",
      },
    ],
  },

  testimonialsSection: {
    testimonials: [
      {
        id: "1",
        rating: 5,
        text: "تجربة مرة ممتازة صراحة انصح فيها كل مدرس يبي يصمم ملف انجاز مميز ومختلف",
        name: "نورا عبدالله",
        role: "وكيلة مدرسة",
        avatar: "/images/landing/testimonials/avatar.svg",
      },
      {
        id: "2",
        rating: 5,
        text: "تجربة مرة ممتازة صراحة انصح فيها كل مدرس يبي يصمم ملف انجاز مميز ومختلف",
        name: "نورا عبدالله",
        role: "وكيلة مدرسة",
        avatar: "",
      },
      {
        id: "3",
        rating: 5,
        text: "تجربة مرة ممتازة صراحة انصح فيها كل مدرس يبي يصمم ملف انجاز مميز ومختلف",
        name: "نورا عبدالله",
        role: "وكيلة مدرسة",
        avatar: null,
      },
      {
        id: "4",
        rating: 5,
        text: "تجربة مرة ممتازة صراحة انصح فيها كل مدرس يبي يصمم ملف انجاز مميز ومختلف",
        name: "نورا عبدالله",
        role: "وكيلة مدرسة",
        avatar: "/images/landing/testimonials/avatar.svg",
      },
    ],
  },

  subscriptionSection: {
    title: "اشترك الحين وابدأ رحلة انشاء ملف انجازك",
    subtitle: "سهلناها عليك! بطرق دفع آمنة ومتنوعة",
    ctaButton: "اشترك الآن",
    successBadge: "تم الاشتراك بنجاح!",
    imageAlt: "اشترك الآن",
  },

  shareExperienceSection: {
    title: "شاركنا تجربتك!",
    subtitle: "رأيك يهمنا، شاركنا تجربتك ورأيك وانضم لمجتمعنا",
    nameLabel: "الاسم",
    namePlaceholder: "مثال: محمد العتيبي",
    jobTitleLabel: "المسمى الوظيفية",
    jobTitlePlaceholder: "مثال: معلم خبير",
    experienceLabel: "شاركنا تجربتك",
    experiencePlaceholder: "شاركنا تجربتك هنا",
    submitButton: "مشاركة",
    jobTitles: [
      { value: "teacher", label: "معلم" },
      { value: "senior_teacher", label: "معلم خبير" },
      { value: "principal", label: "مدير مدرسة" },
      { value: "vice_principal", label: "وكيل/وكيلة مدرسة" },
    ],
  },
};
