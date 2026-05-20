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
    price: "2,999 EGP",
    en: {
      title: "Accounting Fundamentals",
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
      title: "أساسيات المحاسبة",
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
    slug: "advanced-financial-analysis",
    key: "c2",
    levelColor: "bg-red-500",
    price: "4,999 EGP",
    en: {
      title: "Advanced Financial Analysis",
      level: "Advanced",
      duration: "6 Weeks",
      tagline: "Turn raw numbers into strategic business decisions",
      description:
        "A rigorous 6-week programme for experienced accountants and finance managers. Covers ratio analysis, forecasting, valuation models, and the analytical frameworks used by CFOs and investment analysts in the Egyptian and regional market.",
      outcomes: [
        "Perform in-depth ratio analysis and trend identification",
        "Build 3-statement financial models in Excel",
        "Value companies using DCF, multiples, and comparable analysis",
        "Interpret management reports and audit findings",
        "Present financial insights convincingly to boards and investors",
      ],
      modules: [
        {
          title: "Week 1 — Financial Statement Deep Dive",
          topics: [
            "Advanced balance sheet analysis",
            "Quality of earnings assessment",
            "Off-balance-sheet items",
            "Segment and geographic analysis",
          ],
        },
        {
          title: "Week 2 — Ratio & Performance Analysis",
          topics: [
            "Liquidity, solvency, and profitability ratios",
            "DuPont decomposition",
            "Benchmarking against industry peers",
            "Red flags and manipulation detection",
          ],
        },
        {
          title: "Week 3 — Forecasting & Budgeting",
          topics: [
            "Revenue and cost forecasting techniques",
            "Driver-based financial modelling",
            "Scenario and sensitivity analysis",
            "Rolling budgets and variance analysis",
          ],
        },
        {
          title: "Week 4 — Valuation Methods",
          topics: [
            "Discounted Cash Flow (DCF) modelling",
            "EV/EBITDA and P/E multiples",
            "Precedent transaction analysis",
            "Valuation pitfalls to avoid",
          ],
        },
        {
          title: "Week 5 — Decision Support",
          topics: [
            "Capital budgeting: NPV, IRR, payback",
            "Make-or-buy and lease-or-buy decisions",
            "Working capital optimisation",
            "KPI dashboards and management reporting",
          ],
        },
        {
          title: "Week 6 — Capstone Project",
          topics: [
            "Full company financial analysis",
            "Investment recommendation report",
            "Presentation to panel",
            "Individual assessment and feedback",
          ],
        },
      ],
      audience: [
        "Senior accountants aiming for finance manager roles",
        "Finance managers preparing for CFO positions",
        "Analysts in banking, consulting, or investment",
        "CFA, CMA, or MBA candidates seeking practical skills",
      ],
    },
    ar: {
      title: "التحليل المالي المتقدم",
      level: "متقدم",
      duration: "6 أسابيع",
      tagline: "حوِّل الأرقام الخام إلى قرارات استراتيجية",
      description:
        "برنامج مكثَّف مدته 6 أسابيع للمحاسبين ومديري التمويل ذوي الخبرة. يغطي تحليل النسب والتنبؤ ونماذج التقييم والأطر التحليلية التي يستخدمها المديرون الماليون والمحللون في السوق المصري والإقليمي.",
      outcomes: [
        "إجراء تحليل نسب معمَّق وتحديد الاتجاهات",
        "بناء نماذج مالية ثلاثية القوائم في Excel",
        "تقييم الشركات بالتدفق النقدي المخصوم والمضاعفات",
        "تفسير تقارير الإدارة ونتائج التدقيق",
        "تقديم الرؤى المالية بإقناع أمام مجالس الإدارة",
      ],
      modules: [
        {
          title: "الأسبوع 1 — التحليل المعمَّق للقوائم المالية",
          topics: [
            "التحليل المتقدم للميزانية العمومية",
            "تقييم جودة الأرباح",
            "العناصر خارج الميزانية",
            "تحليل القطاعات والمناطق الجغرافية",
          ],
        },
        {
          title: "الأسبوع 2 — تحليل النسب والأداء",
          topics: [
            "نسب السيولة والملاءة والربحية",
            "تحليل DuPont",
            "المقارنة بالمنافسين في القطاع",
            "إشارات التحذير واكتشاف التلاعب",
          ],
        },
        {
          title: "الأسبوع 3 — التنبؤ والموازنة",
          topics: [
            "تقنيات التنبؤ بالإيرادات والتكاليف",
            "النمذجة المالية المبنية على المحركات",
            "تحليل السيناريوهات والحساسية",
            "الموازنات الدائرة وتحليل الانحرافات",
          ],
        },
        {
          title: "الأسبوع 4 — أساليب التقييم",
          topics: [
            "نمذجة التدفق النقدي المخصوم (DCF)",
            "مضاعفات EV/EBITDA وP/E",
            "تحليل المعاملات السابقة",
            "مزالق التقييم الشائعة",
          ],
        },
        {
          title: "الأسبوع 5 — دعم القرار",
          topics: [
            "الموازنة الرأسمالية: NPV وIRR ومدة الاسترداد",
            "قرارات الصنع أو الشراء، التأجير أو التملك",
            "تحسين رأس المال العامل",
            "لوحات KPI وتقارير الإدارة",
          ],
        },
        {
          title: "الأسبوع 6 — المشروع الختامي",
          topics: [
            "تحليل مالي كامل لشركة حقيقية",
            "تقرير توصية استثمارية",
            "عرض أمام لجنة",
            "تقييم فردي وتغذية راجعة",
          ],
        },
      ],
      audience: [
        "كبار المحاسبين الطامحين لمناصب مديري التمويل",
        "مديرو التمويل الساعون لمناصب CFO",
        "المحللون في البنوك والاستشارات والاستثمار",
        "المرشحون لـ CFA أو CMA أو MBA",
      ],
    },
  },
  {
    slug: "odoo-erp-mastery",
    key: "c3",
    levelColor: "bg-blue-500",
    price: "5,999 EGP",
    en: {
      title: "Odoo ERP Mastery",
      level: "Intermediate",
      duration: "8 Weeks",
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
      title: "إتقان Odoo ERP",
      level: "متوسط",
      duration: "8 أسابيع",
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
  {
    slug: "tax-compliance",
    key: "c4",
    levelColor: "bg-purple-500",
    price: "3,499 EGP",
    en: {
      title: "Tax & Compliance",
      level: "Intermediate",
      duration: "3 Weeks",
      tagline: "Navigate Egyptian tax law with confidence and accuracy",
      description:
        "A focused 3-week course covering Egyptian income tax, value-added tax (VAT), withholding tax, and e-invoice compliance. Designed for accountants who need practical mastery of Egyptian Tax Authority (ETA) requirements and filing procedures.",
      outcomes: [
        "Understand Egyptian Income Tax Law 91/2005 and its amendments",
        "Calculate and file VAT returns correctly every month",
        "Handle withholding tax on payments to employees and suppliers",
        "Use the ETA e-invoice portal efficiently",
        "Avoid common penalties and audit triggers",
      ],
      modules: [
        {
          title: "Week 1 — Income Tax",
          topics: [
            "Egyptian Tax Authority structure and obligations",
            "Corporate income tax: rates, deductions, and exemptions",
            "Personal income tax and salary tax calculation",
            "Annual tax return preparation and filing",
          ],
        },
        {
          title: "Week 2 — VAT & Indirect Taxes",
          topics: [
            "VAT Law 67/2016: registration, rates, and exemptions",
            "Input and output VAT reconciliation",
            "Monthly VAT return filing step-by-step",
            "Special cases: zero-rated, exempt, and mixed supplies",
          ],
        },
        {
          title: "Week 3 — Withholding, E-Invoice & Compliance",
          topics: [
            "Withholding tax rates and filing requirements",
            "E-invoice mandates and ETA portal walkthrough",
            "Handling tax audits and penalty mitigation",
            "Tax planning basics and compliance calendar",
          ],
        },
      ],
      audience: [
        "Accountants handling tax compliance for Egyptian companies",
        "CFOs and finance managers needing regulatory updates",
        "Startups and SME owners managing their own tax",
        "Anyone preparing for ETA inspector or tax advisor exams",
      ],
    },
    ar: {
      title: "الضرائب والامتثال",
      level: "متوسط",
      duration: "3 أسابيع",
      tagline: "تنقَّل في قانون الضرائب المصري بثقة ودقة",
      description:
        "دورة مركَّزة مدتها 3 أسابيع تغطي ضريبة الدخل المصرية وضريبة القيمة المضافة وضريبة الخصم والإضافة وامتثال الفاتورة الإلكترونية. مصمَّمة للمحاسبين الذين يحتاجون إلى إتقان عملي لمتطلبات مصلحة الضرائب المصرية وإجراءات التسجيل.",
      outcomes: [
        "فهم قانون الضريبة على الدخل 91/2005 وتعديلاته",
        "حساب وتقديم إقرارات ضريبة القيمة المضافة بشكل صحيح شهرياً",
        "التعامل مع ضريبة الخصم والإضافة على مدفوعات الموظفين والموردين",
        "استخدام بوابة الفاتورة الإلكترونية بكفاءة",
        "تجنب العقوبات الشائعة ومحفزات الفحص الضريبي",
      ],
      modules: [
        {
          title: "الأسبوع 1 — ضريبة الدخل",
          topics: [
            "هيكل مصلحة الضرائب والالتزامات",
            "ضريبة دخل الشركات: المعدلات والخصومات والإعفاءات",
            "ضريبة الدخل الشخصي وحساب ضريبة الرواتب",
            "إعداد وتقديم الإقرار الضريبي السنوي",
          ],
        },
        {
          title: "الأسبوع 2 — القيمة المضافة والضرائب غير المباشرة",
          topics: [
            "قانون القيمة المضافة 67/2016: التسجيل والمعدلات والإعفاءات",
            "تسوية ضريبة المدخلات والمخرجات",
            "تقديم الإقرار الشهري لضريبة القيمة المضافة خطوة بخطوة",
            "الحالات الخاصة: صفر الضريبة والمعفيات والتوريدات المختلطة",
          ],
        },
        {
          title: "الأسبوع 3 — الخصم والإضافة والفاتورة الإلكترونية",
          topics: [
            "معدلات ضريبة الخصم ومتطلبات التسجيل",
            "الفاتورة الإلكترونية الإلزامية وجولة في بوابة مصلحة الضرائب",
            "التعامل مع الفحص الضريبي والتخفيف من العقوبات",
            "أساسيات التخطيط الضريبي وتقويم الامتثال",
          ],
        },
      ],
      audience: [
        "المحاسبون المسؤولون عن الامتثال الضريبي للشركات المصرية",
        "المديرون الماليون وCFOs بحاجة لتحديثات تنظيمية",
        "أصحاب الشركات الناشئة والصغيرة المديرون لضرائبهم بأنفسهم",
        "المستعدون لامتحانات مفتش الضرائب أو المستشار الضريبي",
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
