"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Lang = "en" | "ar" | "fr";

const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      academy: "Academy",
      blog: "Blog",
      contact: "Contact",
      register: "Get Started",
    },
    hero: {
      badge: "Comprehensive Business Solutions",
      title1: "Walk Business —",
      title_accent: "Your Complete",
      title2: "Growth Partner",
      subtitle:
        "From professional accounting and auditing to expert training, management consulting, and Odoo ERP — one trusted partner for all your business needs.",
      cta_primary: "Explore Services",
      cta_secondary: "Free Consultation",
    },
    hero_card: {
      title: "Our Core Services",
      subtitle: "Integrated solutions under one roof",
      s1: "Accounting & Finance",
      s2: "Walk Academy (Training)",
      s3: "Management Consulting",
      s4: "Audit & Compliance",
      s5: "Odoo ERP Solutions",
    },
    hero_badges: {
      b1: "8+ Years Experience",
      b2: "500+ Clients",
      b3: "5 Service Areas",
    },
    stats: {
      s1: "Graduates Struggle Without Practical Training",
      s2: "Companies Use Odoo Worldwide",
      s3: "Employers Prefer ERP-Skilled Accountants",
      s4: "Average Time to Land a Job After Training",
    },
    problem: {
      badge: "The Real Challenge",
      title_1: "Bridging the Gap Between",
      title_accent: "Academic",
      title_2: "& Real-World Accounting",
      subtitle:
        "University gives you the theory. Walk Business gives you the edge to actually succeed.",
      p1_title: "Outdated Curricula",
      p1_desc:
        "University programs often don't cover the latest accounting software or market tools like Odoo or SAP.",
      p2_title: "No Practical Training",
      p2_desc:
        "Absence of hands-on training with essential accounting systems leaves graduates unprepared for day-one work.",
      p3_title: "Skills Gap",
      p3_desc:
        "85% of business graduates struggle to adapt to actual corporate accounting demands — Walk Business closes that gap.",
    },
    services: {
      badge: "What We Offer",
      title: "Our Services",
      subtitle:
        "Five professional service areas designed to serve businesses and individuals",
      accounting: {
        title: "Accounting Services",
        desc: "Full-cycle accounting: bookkeeping, financial statements, payroll, and regulatory compliance to keep your business on track.",
      },
      academy: {
        title: "Walk Academy (Training)",
        desc: "Hands-on professional training for accounting graduates — GAAP, IFRS, financial analysis, and Odoo ERP in one career-launching program.",
      },
      consulting: {
        title: "Management Consulting",
        desc: "Strategic advisory, business planning, financial analysis, and operational improvement tailored to your company's growth.",
      },
      audit: {
        title: "Audit & Compliance",
        desc: "Independent internal and external audit services, risk assessment, and regulatory compliance to protect your business.",
      },
      odoo: {
        title: "Odoo ERP Solutions",
        desc: "End-to-end Odoo implementation: accounting, inventory, sales, purchasing, and manufacturing — customized for your industry.",
      },
      tax: {
        title: "Tax & Legal Advisory",
        desc: "Expert tax planning, VAT compliance, and legal advisory services to minimize liability and maximize efficiency.",
      },
    },
    odoo: {
      badge: "Hands-On ERP Training & Implementation",
      title_1: "Odoo: The Key to",
      title_accent: "Modern Business Success",
      subtitle:
        "Used by over <strong>7 million companies worldwide</strong> — Walk Business trains your team and implements Odoo to transform your operations.",
      m1_title: "Accounting",
      m1_desc: "Automated bookkeeping, seamless bank reconciliations, efficient invoicing, and comprehensive payment processing.",
      m2_title: "Sales & Purchases",
      m2_desc: "Streamlined management of customer orders, supplier relationships, and precise invoicing end to end.",
      m3_title: "Inventory & Warehousing",
      m3_desc: "Robust stock control, real-time inventory tracking, and optimized warehouse management.",
      m4_title: "Manufacturing",
      m4_desc: "Detailed production planning, accurate bill of materials, and efficient work order management.",
      m5_title: "Dashboards & Analytics",
      m5_desc: "Powerful dashboards to extract real-time insights and inform strategic data-driven business decisions.",
      m6_title: "Business Integration",
      m6_desc: "Integrate finance, HR, sales, and supply chain into one cohesive, centralized platform.",
    },
    about: {
      title: "About Walk Business",
      subtitle: "Who We Are",
      exp_label: "Years Experience",
      desc1:
        "Walk Business is a multi-service professional firm dedicated to empowering companies and individuals with the financial knowledge, practical skills, and technology tools they need to grow confidently.",
      desc2:
        "Our team of experienced professionals delivers five integrated service areas — accounting, training, consulting, audit, and Odoo ERP — under one trusted brand, providing end-to-end support at every stage of your journey.",
      mission: "Our Mission",
      mission_desc:
        "To empower businesses and individuals with the financial knowledge and tools for sustainable growth.",
      vision: "Our Vision",
      vision_desc:
        "To be the leading integrated business solutions provider across the region.",
      learn_more: "Learn More About Us",
    },
    academy: {
      title: "Walk Academy",
      subtitle: "Build Your Accounting Career",
      desc: "Join hundreds of students who have transformed their careers through our practical, industry-aligned courses.",
      cta: "View All Courses",
      register_cta: "Enroll Now",
      courses: {
        c1: { title: "Accounting Fundamentals", level: "Beginner", duration: "4 Weeks", price: "299" },
        c2: { title: "Advanced Financial Analysis", level: "Advanced", duration: "6 Weeks", price: "499" },
        c3: { title: "Odoo ERP Mastery", level: "Intermediate", duration: "8 Weeks", price: "599" },
        c4: { title: "Tax & Compliance", level: "Intermediate", duration: "3 Weeks", price: "349" },
      },
    },
    common: { certificate: "Certificate", online: "Online" },
    why: {
      badge: "Why Choose Us",
      title: "Why Choose Walk Business?",
      subtitle: "Your success is our priority — a comprehensive, supportive partnership",
      p1_title: "Practical Approach",
      p1_desc: "Hands-on focus entirely on skills the market actually demands — not just theory.",
      p2_title: "Flexible Engagement",
      p2_desc: "Services and training with no fixed constraints — tailored to your timeline and budget.",
      p3_title: "Expert Team",
      p3_desc: "Personalized support from experienced professionals in accounting, consulting, and Odoo.",
      p4_title: "Recognized Results",
      p4_desc: "Certified outcomes and measurable business improvements that build real credibility.",
    },
    testimonials: {
      badge: "Testimonials",
      title: "What Our Clients Say",
      subtitle: "Trusted by businesses across the region",
      t1_text: "From university student to accountant at a major import-export company within 6 months of training. Walk Business bridged the gap that my degree never could.",
      t1_name: "Ahmed", t1_role: "Accountant, Import-Export Company",
      t2_text: "Successfully managed the accounting department of a startup using my acquired Odoo skills. The hands-on training made all the difference — it felt like real work from day one.",
      t2_name: "Sarah", t2_role: "Accounting Department Head, Startup",
      t3_text: "Secured a position in a multinational corporation thanks to my proficiency in modern accounting systems. Walk Business's flexible training allowed me to learn at my own pace.",
      t3_name: "Mohamed", t3_role: "Accountant, Multinational Corporation",
    },
    blog: {
      badge: "Blog",
      title: "Latest Insights",
      subtitle: "Stay updated with accounting, finance, and ERP news",
      read_more: "Read More",
      b1_cat: "Accounting", b1_title: "Top 5 Accounting Mistakes Small Businesses Make", b1_desc: "Avoid these common pitfalls that cost businesses thousands every year...", b1_date: "May 1, 2026",
      b2_cat: "Odoo ERP", b2_title: "Why Odoo is the Best ERP for Growing Businesses", b2_desc: "A deep dive into how Odoo streamlines operations and reduces costs...", b2_date: "Apr 25, 2026",
      b3_cat: "Training", b3_title: "How to Start Your Accounting Career in 2026", b3_desc: "A complete roadmap for aspiring accountants entering the job market...", b3_date: "Apr 18, 2026",
    },
    cta: {
      title: "Ready to Grow? Let Walk Business Take You There!",
      subtitle: "Don't just rely on theory. Go beyond — master Odoo, get expert consulting, and build your career with our full support.",
      btn_enroll: "Get Started",
      btn_connect: "Connect With Us",
      pill1: "Expert Consulting",
      pill2: "Master Odoo ERP",
      pill3: "Get Certified",
    },
    contact: {
      badge: "Contact",
      title: "Get In Touch",
      subtitle: "We'd love to hear from you",
      name: "Full Name", email: "Email Address", phone: "Phone Number",
      subject: "Subject", message: "Your Message", send: "Send Message",
      address: "Address", phone_label: "Phone", email_label: "Email", follow: "Follow Us",
    },
    register: {
      title: "Register for a Course",
      subtitle: "Take the first step toward your future",
      full_name: "Full Name", email: "Email Address", phone: "Phone Number",
      course: "Select Course", country: "Country", payment_title: "Payment Details",
      card: "Card Number", expiry: "Expiry Date", cvv: "CVV",
      amount: "Total Amount", submit: "Complete Registration & Pay",
      secure: "Secured by Stripe — Your payment is fully encrypted",
    },
    footer: {
      desc: "Your trusted partner for accounting, training, consulting, audit, and Odoo ERP solutions.",
      quick_links: "Quick Links", our_services: "Our Services", newsletter: "Newsletter",
      newsletter_desc: "Subscribe to get the latest updates and offers.",
      subscribe: "Subscribe", email_placeholder: "Your email address",
      rights: "All Rights Reserved", privacy: "Privacy Policy", terms: "Terms of Service",
    },
  },

  ar: {
    nav: {
      home: "الرئيسية",
      about: "من نحن",
      services: "خدماتنا",
      academy: "الأكاديمية",
      blog: "المدونة",
      contact: "اتصل بنا",
      register: "ابدأ الآن",
    },
    hero: {
      badge: "حلول أعمال متكاملة",
      title1: "ووك بيزنس —",
      title_accent: "شريكك المتكامل",
      title2: "للنمو والتميز",
      subtitle:
        "من المحاسبة الاحترافية والتدقيق إلى التدريب المتخصص والاستشارات الإدارية وتطبيق Odoo ERP — شريك واحد موثوق لجميع احتياجات أعمالك.",
      cta_primary: "استكشف خدماتنا",
      cta_secondary: "استشارة مجانية",
    },
    hero_card: {
      title: "خدماتنا الأساسية",
      subtitle: "حلول متكاملة تحت سقف واحد",
      s1: "خدمات المحاسبة والمالية",
      s2: "ووك أكاديمي (التدريب)",
      s3: "الاستشارات الإدارية",
      s4: "التدقيق والامتثال",
      s5: "حلول Odoo ERP",
    },
    hero_badges: {
      b1: "+8 سنوات خبرة",
      b2: "+500 عميل",
      b3: "5 مجالات خدمية",
    },
    stats: {
      s1: "من الخريجين يعانون بدون تدريب عملي",
      s2: "شركة تستخدم Odoo حول العالم",
      s3: "أصحاب العمل يفضلون المحاسبين المتمكنين من ERP",
      s4: "متوسط الوقت للحصول على وظيفة بعد التدريب",
    },
    problem: {
      badge: "التحدي الحقيقي",
      title_1: "سد الفجوة بين",
      title_accent: "الأكاديمي",
      title_2: "والمحاسبة الواقعية",
      subtitle: "الجامعة تعطيك النظرية. ووك بيزنس تعطيك الميزة للنجاح الحقيقي.",
      p1_title: "مناهج قديمة",
      p1_desc: "برامج الجامعة غالباً لا تغطي أحدث برامج المحاسبة وأدوات السوق مثل Odoo أو SAP.",
      p2_title: "غياب التدريب العملي",
      p2_desc: "غياب التدريب التطبيقي على أنظمة المحاسبة الأساسية يجعل الخريجين غير مستعدين للعمل من اليوم الأول.",
      p3_title: "فجوة المهارات",
      p3_desc: "85% من خريجي إدارة الأعمال يكافحون للتكيف مع متطلبات المحاسبة الحقيقية — ووك بيزنس تسد هذه الفجوة.",
    },
    services: {
      badge: "ما نقدمه",
      title: "خدماتنا",
      subtitle: "خمسة مجالات خدمية احترافية مصممة لخدمة الشركات والأفراد",
      accounting: {
        title: "خدمات المحاسبة",
        desc: "محاسبة متكاملة: مسك الدفاتر، القوائم المالية، الرواتب، والامتثال التنظيمي للحفاظ على سير أعمالك.",
      },
      academy: {
        title: "ووك أكاديمي (التدريب)",
        desc: "تدريب مهني تطبيقي لخريجي المحاسبة — GAAP وIFRS والتحليل المالي وOdoo ERP في برنامج واحد لإطلاق مسيرتك.",
      },
      consulting: {
        title: "الاستشارات الإدارية",
        desc: "استشارات استراتيجية وتخطيط أعمال وتحليل مالي وتحسين تشغيلي مصمم لنمو شركتك.",
      },
      audit: {
        title: "التدقيق والامتثال",
        desc: "خدمات تدقيق داخلية وخارجية مستقلة، تقييم المخاطر، والامتثال التنظيمي لحماية أعمالك.",
      },
      odoo: {
        title: "حلول Odoo ERP",
        desc: "تطبيق Odoo متكامل: محاسبة، مخزون، مبيعات، مشتريات، وتصنيع — مخصص لصناعتك.",
      },
      tax: {
        title: "الاستشارات الضريبية والقانونية",
        desc: "تخطيط ضريبي متخصص وامتثال لضريبة القيمة المضافة واستشارات قانونية للحد من الالتزامات وتعظيم الكفاءة.",
      },
    },
    odoo: {
      badge: "تدريب وتطبيق ERP احترافي",
      title_1: "Odoo: مفتاح",
      title_accent: "نجاح الأعمال الحديثة",
      subtitle: "يستخدمه أكثر من <strong>7 ملايين شركة حول العالم</strong> — ووك بيزنس تدرّب فريقك وتطبق Odoo لتحويل عملياتك.",
      m1_title: "المحاسبة", m1_desc: "مسك دفاتر آلي، تسوية بنكية سلسة، فوترة فعّالة، ومعالجة مدفوعات شاملة.",
      m2_title: "المبيعات والمشتريات", m2_desc: "إدارة مبسّطة لطلبات العملاء وعلاقات الموردين وفواتير دقيقة من البداية للنهاية.",
      m3_title: "المخزون والمستودعات", m3_desc: "تحكم قوي في المخزون، تتبع فوري، وإدارة مستودعات محسّنة لتحقيق أقصى كفاءة.",
      m4_title: "التصنيع", m4_desc: "تخطيط إنتاج تفصيلي، قائمة مواد دقيقة، وإدارة أوامر عمل فعّالة.",
      m5_title: "لوحات البيانات والتحليلات", m5_desc: "استخدم لوحات Odoo القوية لاستخراج رؤى فورية واتخاذ قرارات أعمال استراتيجية.",
      m6_title: "التكامل المؤسسي", m6_desc: "دمج المالية والموارد البشرية والمبيعات وسلاسل التوريد في منصة مركزية متكاملة.",
    },
    about: {
      title: "عن ووك بيزنس",
      subtitle: "من نحن",
      exp_label: "سنوات خبرة",
      desc1: "ووك بيزنس شركة خدمات مهنية متكاملة مكرسة لتمكين الشركات والأفراد بالمعرفة المالية والمهارات العملية وأدوات التكنولوجيا اللازمة للنمو بثقة.",
      desc2: "فريقنا من المحترفين ذوي الخبرة يقدم خمسة مجالات خدمية متكاملة — محاسبة وتدريب واستشارات وتدقيق وOdoo ERP — تحت علامة تجارية واحدة موثوقة.",
      mission: "مهمتنا",
      mission_desc: "تمكين الأعمال والأفراد بالمعرفة المالية والأدوات اللازمة لتحقيق نمو مستدام.",
      vision: "رؤيتنا",
      vision_desc: "أن نكون المزود الرائد لحلول الأعمال المتكاملة في المنطقة.",
      learn_more: "اعرف المزيد عنا",
    },
    academy: {
      title: "أكاديمية ووك",
      subtitle: "ابنِ مسيرتك المحاسبية",
      desc: "انضم إلى مئات الطلاب الذين غيروا مساراتهم المهنية من خلال دوراتنا العملية المتوافقة مع متطلبات الصناعة.",
      cta: "عرض جميع الدورات",
      register_cta: "سجل الآن",
      courses: {
        c1: { title: "أساسيات المحاسبة", level: "مبتدئ", duration: "4 أسابيع", price: "299" },
        c2: { title: "التحليل المالي المتقدم", level: "متقدم", duration: "6 أسابيع", price: "499" },
        c3: { title: "إتقان Odoo ERP", level: "متوسط", duration: "8 أسابيع", price: "599" },
        c4: { title: "الضرائب والامتثال", level: "متوسط", duration: "3 أسابيع", price: "349" },
      },
    },
    common: { certificate: "شهادة", online: "أونلاين" },
    why: {
      badge: "لماذا نختارنا",
      title: "لماذا تختار ووك بيزنس؟",
      subtitle: "نجاحك أولويتنا — شراكة شاملة وداعمة",
      p1_title: "نهج عملي",
      p1_desc: "تركيز كامل على المهارات المطلوبة فعلاً في السوق — ليس مجرد نظريات.",
      p2_title: "مرونة في التعامل",
      p2_desc: "خدمات وتدريب بلا قيود ثابتة — مصممة وفق جدولك الزمني وميزانيتك.",
      p3_title: "فريق متخصص",
      p3_desc: "دعم شخصي مستمر من خبراء في المحاسبة والاستشارات وOdoo.",
      p4_title: "نتائج معترف بها",
      p4_desc: "شهادات معتمدة وتحسينات أعمال قابلة للقياس تبني مصداقية حقيقية.",
    },
    testimonials: {
      badge: "آراء العملاء",
      title: "ماذا يقول عملاؤنا",
      subtitle: "موثوق به من قبل الشركات في جميع أنحاء المنطقة",
      t1_text: "من طالب جامعي إلى محاسب في شركة استيراد وتصدير كبرى خلال 6 أشهر. ووك بيزنس سدّت الفجوة التي لم تستطع شهادتي سدّها.",
      t1_name: "أحمد", t1_role: "محاسب، شركة استيراد وتصدير",
      t2_text: "أدرتُ القسم المحاسبي لشركة ناشئة بنجاح باستخدام مهارات Odoo. التدريب العملي أحدث الفارق كله.",
      t2_name: "سارة", t2_role: "رئيسة القسم المحاسبي، شركة ناشئة",
      t3_text: "حصلت على منصب في شركة متعددة الجنسيات بفضل إتقاني لأنظمة المحاسبة الحديثة. التدريب المرن سمح لي بالتعلم بالسرعة التي تناسبني.",
      t3_name: "محمد", t3_role: "محاسب، شركة متعددة الجنسيات",
    },
    blog: {
      badge: "المدونة",
      title: "آخر المستجدات",
      subtitle: "ابقَ على اطلاع بأخبار المحاسبة والمال وERP",
      read_more: "اقرأ المزيد",
      b1_cat: "محاسبة", b1_title: "أهم 5 أخطاء محاسبية ترتكبها الشركات الصغيرة", b1_desc: "تجنب هذه الأخطاء الشائعة التي تكلف الشركات آلاف الدولارات سنوياً...", b1_date: "1 مايو 2026",
      b2_cat: "Odoo ERP", b2_title: "لماذا Odoo هو أفضل ERP للشركات النامية", b2_desc: "تعمق في كيفية تبسيط Odoo للعمليات وتقليل التكاليف...", b2_date: "25 أبريل 2026",
      b3_cat: "تدريب", b3_title: "كيف تبدأ مسيرتك المحاسبية في 2026", b3_desc: "خارطة طريق متكاملة للمحاسبين الطموحين الدخلاء على سوق العمل...", b3_date: "18 أبريل 2026",
    },
    cta: {
      title: "مستعد للنمو؟ دع ووك بيزنس تأخذك للأمام!",
      subtitle: "لا تعتمد فقط على النظرية. تجاوز النظرية — أتقن Odoo، واحصل على استشارة متخصصة، وابنِ مسيرتك بدعمنا الكامل.",
      btn_enroll: "ابدأ الآن",
      btn_connect: "تواصل معنا",
      pill1: "استشارة متخصصة",
      pill2: "أتقن Odoo ERP",
      pill3: "احصل على شهادة",
    },
    contact: {
      badge: "اتصل بنا",
      title: "تواصل معنا",
      subtitle: "يسعدنا سماع منك",
      name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف",
      subject: "الموضوع", message: "رسالتك", send: "إرسال الرسالة",
      address: "العنوان", phone_label: "الهاتف", email_label: "البريد الإلكتروني", follow: "تابعنا",
    },
    register: {
      title: "سجل في دورة",
      subtitle: "اتخذ الخطوة الأولى نحو مستقبلك",
      full_name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "رقم الهاتف",
      course: "اختر الدورة", country: "الدولة", payment_title: "تفاصيل الدفع",
      card: "رقم البطاقة", expiry: "تاريخ الانتهاء", cvv: "CVV",
      amount: "المبلغ الإجمالي", submit: "إتمام التسجيل والدفع",
      secure: "مؤمّن بواسطة Stripe — مدفوعاتك مشفرة بالكامل",
    },
    footer: {
      desc: "شريكك الموثوق للمحاسبة والتدريب والاستشارات والتدقيق وحلول Odoo ERP.",
      quick_links: "روابط سريعة", our_services: "خدماتنا", newsletter: "النشرة البريدية",
      newsletter_desc: "اشترك للحصول على آخر التحديثات والعروض.",
      subscribe: "اشتراك", email_placeholder: "بريدك الإلكتروني",
      rights: "جميع الحقوق محفوظة", privacy: "سياسة الخصوصية", terms: "شروط الخدمة",
    },
  },

  fr: {
    nav: {
      home: "Accueil",
      about: "À Propos",
      services: "Services",
      academy: "Académie",
      blog: "Blog",
      contact: "Contact",
      register: "Commencer",
    },
    hero: {
      badge: "Solutions Business Complètes",
      title1: "Walk Business —",
      title_accent: "Votre Partenaire",
      title2: "de Croissance",
      subtitle:
        "De la comptabilité professionnelle et l'audit à la formation, au conseil de gestion, et aux solutions Odoo ERP — un partenaire de confiance pour tous vos besoins.",
      cta_primary: "Explorer nos Services",
      cta_secondary: "Consultation Gratuite",
    },
    hero_card: {
      title: "Nos Services Clés",
      subtitle: "Solutions intégrées sous un même toit",
      s1: "Comptabilité & Finance",
      s2: "Walk Academy (Formation)",
      s3: "Conseil en Gestion",
      s4: "Audit & Conformité",
      s5: "Solutions Odoo ERP",
    },
    hero_badges: {
      b1: "8+ Ans d'Expérience",
      b2: "500+ Clients",
      b3: "5 Domaines de Service",
    },
    stats: {
      s1: "Des diplômés peinent sans formation pratique",
      s2: "Entreprises utilisent Odoo dans le monde",
      s3: "Les employeurs préfèrent les comptables ERP",
      s4: "Temps moyen pour décrocher un emploi après formation",
    },
    problem: {
      badge: "Le Vrai Défi",
      title_1: "Combler l'Écart Entre",
      title_accent: "Académique",
      title_2: "& Comptabilité Réelle",
      subtitle: "L'université vous donne la théorie. Walk Business vous donne l'avantage pour réussir.",
      p1_title: "Curricula Obsolètes",
      p1_desc: "Les programmes universitaires ne couvrent souvent pas les derniers logiciels comptables ou outils de marché.",
      p2_title: "Pas de Formation Pratique",
      p2_desc: "L'absence de formation pratique laisse les diplômés non préparés pour le premier jour de travail.",
      p3_title: "Fossé des Compétences",
      p3_desc: "85% des diplômés en gestion peinent à s'adapter aux exigences comptables réelles — Walk Business comble ce fossé.",
    },
    services: {
      badge: "Ce que Nous Offrons",
      title: "Nos Services",
      subtitle: "Cinq domaines de services professionnels pour entreprises et particuliers",
      accounting: {
        title: "Services Comptables",
        desc: "Comptabilité complète: tenue des livres, états financiers, paie et conformité réglementaire.",
      },
      academy: {
        title: "Walk Academy (Formation)",
        desc: "Formation professionnelle pratique pour diplômés en comptabilité — GAAP, IFRS, analyse financière et Odoo ERP.",
      },
      consulting: {
        title: "Conseil en Gestion",
        desc: "Conseil stratégique, planification d'entreprise, analyse financière et amélioration opérationnelle.",
      },
      audit: {
        title: "Audit & Conformité",
        desc: "Services d'audit interne et externe indépendants, évaluation des risques et conformité réglementaire.",
      },
      odoo: {
        title: "Solutions Odoo ERP",
        desc: "Implémentation complète d'Odoo: comptabilité, inventaire, ventes, achats et fabrication.",
      },
      tax: {
        title: "Conseil Fiscal & Juridique",
        desc: "Planification fiscale, conformité TVA et conseil juridique pour minimiser la charge et maximiser l'efficacité.",
      },
    },
    odoo: {
      badge: "Formation & Implémentation ERP",
      title_1: "Odoo: La Clé du",
      title_accent: "Succès Business Moderne",
      subtitle: "Utilisé par plus de <strong>7 millions d'entreprises</strong> — Walk Business forme votre équipe et implémente Odoo pour transformer vos opérations.",
      m1_title: "Comptabilité", m1_desc: "Comptabilité automatisée, rapprochements bancaires fluides, facturation efficace et traitement des paiements.",
      m2_title: "Ventes & Achats", m2_desc: "Gestion simplifiée des commandes clients, relations fournisseurs et facturation précise.",
      m3_title: "Inventaire & Entreposage", m3_desc: "Contrôle robuste des stocks, suivi en temps réel et gestion optimisée des entrepôts.",
      m4_title: "Fabrication", m4_desc: "Planification détaillée de la production, nomenclature précise et gestion des ordres de travail.",
      m5_title: "Tableaux de Bord & Analytiques", m5_desc: "Tableaux de bord puissants pour extraire des insights en temps réel et prendre des décisions stratégiques.",
      m6_title: "Intégration Métier", m6_desc: "Intégrer finance, RH, ventes et chaîne d'approvisionnement en une plateforme centralisée.",
    },
    about: {
      title: "À Propos de Walk Business",
      subtitle: "Qui Sommes-Nous",
      exp_label: "Ans d'Expérience",
      desc1: "Walk Business est une société de services professionnels multi-domaines dédiée à donner aux entreprises et individus les connaissances financières, compétences pratiques et outils technologiques nécessaires pour croître.",
      desc2: "Notre équipe de professionnels expérimentés délivre cinq domaines de services intégrés — comptabilité, formation, conseil, audit et Odoo ERP — sous une marque de confiance.",
      mission: "Notre Mission",
      mission_desc: "Donner aux entreprises et aux individus les connaissances financières et les outils nécessaires pour une croissance durable.",
      vision: "Notre Vision",
      vision_desc: "Être le fournisseur leader de solutions business intégrées dans la région.",
      learn_more: "En Savoir Plus",
    },
    academy: {
      title: "Walk Académie",
      subtitle: "Construisez Votre Carrière Comptable",
      desc: "Rejoignez des centaines d'étudiants qui ont transformé leur carrière grâce à nos cours pratiques.",
      cta: "Voir Tous les Cours",
      register_cta: "S'inscrire Maintenant",
      courses: {
        c1: { title: "Fondamentaux de la Comptabilité", level: "Débutant", duration: "4 Semaines", price: "299" },
        c2: { title: "Analyse Financière Avancée", level: "Avancé", duration: "6 Semaines", price: "499" },
        c3: { title: "Maîtrise Odoo ERP", level: "Intermédiaire", duration: "8 Semaines", price: "599" },
        c4: { title: "Fiscalité & Conformité", level: "Intermédiaire", duration: "3 Semaines", price: "349" },
      },
    },
    common: { certificate: "Certificat", online: "En Ligne" },
    why: {
      badge: "Pourquoi Nous Choisir",
      title: "Pourquoi Choisir Walk Business?",
      subtitle: "Votre succès est notre priorité — un partenariat complet et solidaire",
      p1_title: "Approche Pratique",
      p1_desc: "Focus entier sur les compétences réellement demandées par le marché.",
      p2_title: "Engagement Flexible",
      p2_desc: "Services et formation sans contraintes fixes — adaptés à votre calendrier et budget.",
      p3_title: "Équipe Experte",
      p3_desc: "Soutien personnalisé de professionnels expérimentés en comptabilité, conseil et Odoo.",
      p4_title: "Résultats Reconnus",
      p4_desc: "Certifications accréditées et améliorations mesurables qui construisent une vraie crédibilité.",
    },
    testimonials: {
      badge: "Témoignages",
      title: "Ce que Disent Nos Clients",
      subtitle: "Fait confiance par des entreprises à travers la région",
      t1_text: "D'étudiant universitaire à comptable dans une grande entreprise import-export en 6 mois. Walk Business a comblé le fossé que mon diplôme n'a jamais pu.",
      t1_name: "Ahmed", t1_role: "Comptable, Entreprise Import-Export",
      t2_text: "J'ai réussi à gérer le département comptable d'une startup grâce à mes compétences Odoo. La formation pratique a tout changé.",
      t2_name: "Sarah", t2_role: "Responsable Comptabilité, Startup",
      t3_text: "J'ai décroché un poste dans une multinationale grâce à ma maîtrise des systèmes comptables modernes.",
      t3_name: "Mohamed", t3_role: "Comptable, Multinationale",
    },
    blog: {
      badge: "Blog",
      title: "Dernières Actualités",
      subtitle: "Restez informé des nouvelles de la comptabilité, finance et ERP",
      read_more: "Lire la Suite",
      b1_cat: "Comptabilité", b1_title: "Top 5 des Erreurs Comptables des Petites Entreprises", b1_desc: "Évitez ces erreurs courantes qui coûtent des milliers aux entreprises...", b1_date: "1 Mai 2026",
      b2_cat: "Odoo ERP", b2_title: "Pourquoi Odoo est le Meilleur ERP pour les Entreprises en Croissance", b2_desc: "Une plongée profonde dans la façon dont Odoo simplifie les opérations...", b2_date: "25 Avril 2026",
      b3_cat: "Formation", b3_title: "Comment Démarrer Votre Carrière Comptable en 2026", b3_desc: "Une feuille de route complète pour les comptables aspirants...", b3_date: "18 Avril 2026",
    },
    cta: {
      title: "Prêt à Grandir? Walk Business Vous y Emmène!",
      subtitle: "Ne comptez pas seulement sur la théorie. Allez au-delà — maîtrisez Odoo, obtenez des conseils d'experts, et construisez votre carrière.",
      btn_enroll: "Commencer",
      btn_connect: "Nous Contacter",
      pill1: "Conseil Expert",
      pill2: "Maîtriser Odoo ERP",
      pill3: "Obtenir une Certification",
    },
    contact: {
      badge: "Contact",
      title: "Contactez-Nous",
      subtitle: "Nous serions ravis de vous entendre",
      name: "Nom Complet", email: "Adresse Email", phone: "Numéro de Téléphone",
      subject: "Sujet", message: "Votre Message", send: "Envoyer le Message",
      address: "Adresse", phone_label: "Téléphone", email_label: "Email", follow: "Suivez-Nous",
    },
    register: {
      title: "S'inscrire à un Cours",
      subtitle: "Faites le premier pas vers votre avenir",
      full_name: "Nom Complet", email: "Adresse Email", phone: "Numéro de Téléphone",
      course: "Sélectionner un Cours", country: "Pays", payment_title: "Détails de Paiement",
      card: "Numéro de Carte", expiry: "Date d'Expiration", cvv: "CVV",
      amount: "Montant Total", submit: "Finaliser l'Inscription & Payer",
      secure: "Sécurisé par Stripe — Votre paiement est entièrement chiffré",
    },
    footer: {
      desc: "Votre partenaire de confiance pour la comptabilité, la formation, le conseil, l'audit et les solutions Odoo ERP.",
      quick_links: "Liens Rapides", our_services: "Nos Services", newsletter: "Newsletter",
      newsletter_desc: "Abonnez-vous pour recevoir les dernières mises à jour et offres.",
      subscribe: "S'abonner", email_placeholder: "Votre adresse email",
      rights: "Tous Droits Réservés", privacy: "Politique de Confidentialité", terms: "Conditions d'Utilisation",
    },
  },
} as const;

type Translations = typeof translations;
type LangTranslations = Translations["en"];

function getNestedValue(obj: Record<string, unknown>, keys: string[]): string {
  let val: unknown = obj;
  for (const k of keys) {
    if (val && typeof val === "object") {
      val = (val as Record<string, unknown>)[k];
    } else {
      return keys.join(".");
    }
  }
  return typeof val === "string" ? val : keys.join(".");
}

const I18nContext = createContext<{
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  isRTL: boolean;
}>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
  isRTL: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = (localStorage.getItem("walk_lang") as Lang) || "en";
    if (saved !== lang) setLangState(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.style.fontFamily =
      lang === "ar"
        ? "var(--font-cairo), sans-serif"
        : "var(--font-inter), sans-serif";
  }, [lang]);

  function setLang(newLang: Lang) {
    setLangState(newLang);
    localStorage.setItem("walk_lang", newLang);
  }

  function t(key: string): string {
    const keys = key.split(".");
    return getNestedValue(translations[lang] as unknown as Record<string, unknown>, keys);
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t, isRTL: lang === "ar" }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
