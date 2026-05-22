export interface CourseModule {
  title: string;
  topics: string[];
}

export interface Course {
  slug: string;
  key: string;
  levelColor: string;
  price: string;
  en: {
    title: string;
    level: string;
    duration: string;
    tagline: string;
    description: string;
    outcomes: string[];
    modules: CourseModule[];
    audience: string[];
  };
  ar: {
    title: string;
    level: string;
    duration: string;
    tagline: string;
    description: string;
    outcomes: string[];
    modules: CourseModule[];
    audience: string[];
  };
}

const courses: Course[] = [
  {
    slug: "accounting-fundamentals",
    key: "c1",
    levelColor: "bg-green-500",
    price: "3,500 EGP",
    en: {
      title: "Professional Accountant Qualification",
      level: "Beginner",
      duration: "4 Weeks",
      tagline: "Build a solid foundation in accounting from day one",
      description:
        "A comprehensive 4-week course designed for fresh graduates and career changers. You'll master the accounting cycle, financial statements, and real-world bookkeeping using hands-on exercises based on Egyptian and IFRS standards.",
      outcomes: [
        "Understand the full accounting cycle end-to-end",
        "Prepare and analyse balance sheets, income statements, and cash flows",
        "Apply Egyptian Accounting Standards (EAS) & IFRS basics",
        "Record journal entries with confidence in manual and digital ledgers",
        "Communicate financial data clearly to non-accountants",
      ],
      modules: [
        {
          title: "Week 1 — Accounting Foundations",
          topics: [
            "The accounting equation and double-entry principle",
            "Chart of accounts and classification",
            "Journal entries and the general ledger",
            "Trial balance preparation",
          ],
        },
        {
          title: "Week 2 — Financial Statements",
          topics: [
            "Income statement construction",
            "Balance sheet preparation",
            "Cash flow statement basics",
            "Notes to financial statements",
          ],
        },
        {
          title: "Week 3 — Standards & Compliance",
          topics: [
            "Egyptian Accounting Standards overview",
            "IFRS vs EAS key differences",
            "Revenue recognition and accruals",
            "Depreciation methods",
          ],
        },
        {
          title: "Week 4 — Practical Application",
          topics: [
            "Complete company simulation",
            "Month-end and year-end closing",
            "Common errors and how to fix them",
            "Final project and assessment",
          ],
        },
      ],
      audience: [
        "Recent accounting graduates entering the job market",
        "Finance professionals needing a structured refresher",
        "Business owners wanting to understand their numbers",
        "Anyone preparing for CPA, CMA, or ACCA foundation exams",
      ],
    },
    ar: {
      title: "التأهيل المهني للمحاسبين",
      level: "مبتدئ",
      duration: "4 أسابيع",
      tagline: "ابنِ أساساً متيناً في المحاسبة من اليوم الأول",
      description:
        "برنامج شامل مدته 4 أسابيع مصمَّم للخريجين الجدد والمحوِّلين لمسار مهني. ستتقن دورة المحاسبة، والقوائم المالية، والقيود اليومية عبر تمارين عملية مبنية على المعايير المصرية ومعايير IFRS.",
      outcomes: [
        "فهم دورة المحاسبة الكاملة من البداية إلى النهاية",
        "إعداد وتحليل الميزانيات العمومية وقوائم الدخل والتدفقات النقدية",
        "تطبيق المعايير المحاسبية المصرية وأساسيات IFRS",
        "تسجيل القيود اليومية بثقة في السجلات اليدوية والرقمية",
        "التواصل الواضح للبيانات المالية مع غير المتخصصين",
      ],
      modules: [
        {
          title: "الأسبوع 1 — أسس المحاسبة",
          topics: [
            "المعادلة المحاسبية ومبدأ القيد المزدوج",
            "دليل الحسابات والتصنيف",
            "القيود اليومية ودفتر الأستاذ العام",
            "إعداد ميزان المراجعة",
          ],
        },
        {
          title: "الأسبوع 2 — القوائم المالية",
          topics: [
            "إعداد قائمة الدخل",
            "إعداد الميزانية العمومية",
            "أساسيات قائمة التدفقات النقدية",
            "إيضاحات القوائم المالية",
          ],
        },
        {
          title: "الأسبوع 3 — المعايير والامتثال",
          topics: [
            "نظرة عامة على المعايير المحاسبية المصرية",
            "الفروق الرئيسية بين IFRS والمعايير المصرية",
            "الاعتراف بالإيرادات والمستحقات",
            "طرق الإهلاك",
          ],
        },
        {
          title: "الأسبوع 4 — التطبيق العملي",
          topics: [
            "محاكاة كاملة لشركة حقيقية",
            "إقفال نهاية الشهر والسنة",
            "الأخطاء الشائعة وكيفية تصحيحها",
            "المشروع والتقييم النهائي",
          ],
        },
      ],
      audience: [
        "خريجو المحاسبة الجدد الباحثون عن عمل",
        "المحترفون الماليون الراغبون في مراجعة منظَّمة",
        "أصحاب الأعمال الراغبون في فهم أرقامهم",
        "المستعدون لامتحانات CPA أو CMA أو ACCA",
      ],
    },
  },
  {
    slug: "odoo-erp-mastery",
    key: "c3",
    levelColor: "bg-blue-500",
    price: "5,000 EGP",
    en: {
      title: "Odoo Implementer",
      level: "Intermediate",
      duration: "6 Weeks",
      tagline: "Implement and operate Odoo ERP like a professional consultant",
      description:
        "The most comprehensive Odoo training in Egypt — 8 weeks covering Accounting, Inventory, Sales, Purchasing, and HR modules. Learn configuration, data migration, and day-to-day operations so you can implement Odoo for your employer or clients.",
      outcomes: [
        "Configure Odoo from scratch for a real business",
        "Master Accounting, Inventory, Sales, and HR modules",
        "Migrate data from Excel and legacy systems into Odoo",
        "Troubleshoot common issues and customise views",
        "Earn a Walk Business Odoo Practitioner certificate",
      ],
      modules: [
        {
          title: "Weeks 1–2 — Odoo Foundations",
          topics: [
            "Odoo architecture and user interface",
            "Company setup: fiscal years, currencies, taxes",
            "User management and access rights",
            "Installing and configuring modules",
          ],
        },
        {
          title: "Weeks 3–4 — Accounting Module",
          topics: [
            "Chart of accounts and journal configuration",
            "Customer invoicing and vendor bills",
            "Bank reconciliation and payments",
            "Financial reports and closing",
          ],
        },
        {
          title: "Week 5 — Inventory & Warehousing",
          topics: [
            "Product and category setup",
            "Receipts, deliveries, and internal transfers",
            "Valuation methods (FIFO, AVCO)",
            "Physical inventory adjustment",
          ],
        },
        {
          title: "Week 6 — Sales & Purchasing",
          topics: [
            "Quotations, sales orders, and delivery flow",
            "Purchase orders and vendor management",
            "Pricelists and discounts",
            "Customer portal and reporting",
          ],
        },
        {
          title: "Week 7 — HR & Payroll",
          topics: [
            "Employee records and contracts",
            "Leave management and attendance",
            "Egyptian payroll basics in Odoo",
            "Expense management",
          ],
        },
        {
          title: "Week 8 — Implementation Project",
          topics: [
            "Full company setup from scratch",
            "Data migration from Excel",
            "Go-live checklist and user training",
            "Final project presentation",
          ],
        },
      ],
      audience: [
        "Accountants wanting an ERP skill to stand out",
        "IT managers tasked with implementing Odoo",
        "Consultants building an ERP practice",
        "Business owners wanting to run Odoo in-house",
      ],
    },
    ar: {
      title: "Odoo Implementer",
      level: "متوسط",
      duration: "6 أسابيع",
      tagline: "نفِّذ وشغِّل Odoo ERP كمستشار محترف",
      description:
        "أشمل تدريب Odoo في مصر — 8 أسابيع تغطي وحدات المحاسبة والمخزون والمبيعات والمشتريات والموارد البشرية. تعلَّم الإعداد وترحيل البيانات والتشغيل اليومي لتطبيق Odoo لصاحب العمل أو العملاء.",
      outcomes: [
        "إعداد Odoo من الصفر لأعمال حقيقية",
        "إتقان وحدات المحاسبة والمخزون والمبيعات والموارد البشرية",
        "ترحيل البيانات من Excel والأنظمة القديمة إلى Odoo",
        "استكشاف المشكلات الشائعة وتخصيص العروض",
        "الحصول على شهادة Walk Business Odoo Practitioner",
      ],
      modules: [
        {
          title: "الأسبوعان 1-2 — أسس Odoo",
          topics: [
            "بنية Odoo وواجهة المستخدم",
            "إعداد الشركة: السنوات المالية والعملات والضرائب",
            "إدارة المستخدمين وصلاحيات الوصول",
            "تثبيت الوحدات وإعدادها",
          ],
        },
        {
          title: "الأسبوعان 3-4 — وحدة المحاسبة",
          topics: [
            "دليل الحسابات وإعداد اليوميات",
            "فواتير العملاء وفواتير الموردين",
            "تسوية البنك والمدفوعات",
            "التقارير المالية والإقفال",
          ],
        },
        {
          title: "الأسبوع 5 — المخزون والمستودعات",
          topics: [
            "إعداد المنتجات والفئات",
            "المستلمات والتسليمات والتحويلات الداخلية",
            "طرق التقييم (FIFO، AVCO)",
            "تعديل الجرد الفعلي",
          ],
        },
        {
          title: "الأسبوع 6 — المبيعات والمشتريات",
          topics: [
            "عروض الأسعار وأوامر البيع وتدفق التسليم",
            "أوامر الشراء وإدارة الموردين",
            "قوائم الأسعار والخصومات",
            "بوابة العملاء والتقارير",
          ],
        },
        {
          title: "الأسبوع 7 — الموارد البشرية وكشف الرواتب",
          topics: [
            "سجلات الموظفين والعقود",
            "إدارة الإجازات والحضور",
            "أساسيات كشف رواتب مصري في Odoo",
            "إدارة المصروفات",
          ],
        },
        {
          title: "الأسبوع 8 — مشروع التطبيق",
          topics: [
            "إعداد شركة كاملة من الصفر",
            "ترحيل البيانات من Excel",
            "قائمة التشغيل الفعلي وتدريب المستخدمين",
            "عرض المشروع النهائي",
          ],
        },
      ],
      audience: [
        "المحاسبون الراغبون في مهارة ERP للتميز",
        "مديرو تقنية المعلومات المكلَّفون بتطبيق Odoo",
        "المستشارون الساعون لبناء ممارسة ERP",
        "أصحاب الأعمال الراغبون في تشغيل Odoo داخلياً",
      ],
    },
  },
];

export default courses;

export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export function getAllCourseSlugs(): string[] {
  return courses.map((c) => c.slug);
}
