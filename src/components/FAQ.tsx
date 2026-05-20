"use client";
import { useState } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

const FAQ_EN = [
  { q: "What services does Walk Business offer?", a: "Walk Business provides five integrated services: Accounting, Walk Academy (professional training), Management Consulting, Audit & Compliance, and Odoo ERP Solutions." },
  { q: "How long are the Walk Academy courses?", a: "Course durations range from 3 to 8 weeks depending on the program. Accounting Fundamentals is 4 weeks, Financial Analysis is 6 weeks, Odoo ERP Mastery is 8 weeks, and Tax & Compliance is 3 weeks." },
  { q: "What is Odoo ERP and why should I learn it?", a: "Odoo is an open-source ERP used by over 7 million companies worldwide. Mastering it gives you a strong competitive advantage, as 70%+ of employers prefer accountants who can work with modern ERP systems." },
  { q: "Do you offer online or in-person training?", a: "We offer both formats. Online sessions provide flexibility to learn at your own pace, while in-person workshops provide hands-on practice. Contact us to discuss what works best for you." },
  { q: "Is there a certificate upon completion?", a: "Yes. All Walk Academy programs conclude with an industry-recognized certificate that validates your skills and enhances your professional resume." },
  { q: "How can I register for a course?", a: "Simply scroll to the 'Register' section, fill in your details, select your course, and submit. Our team will contact you within 24 hours to confirm your enrollment." },
  { q: "Do you provide Odoo implementation for businesses?", a: "Yes. In addition to training, Walk Business provides full Odoo ERP implementation services — including system setup, customization, data migration, and staff training — tailored to your industry." },
  { q: "What are the payment options?", a: "We accept bank transfers, cash, and installment plans for training courses. For consulting and ERP projects, payment terms are agreed in the service contract. Contact us for details." },
];

const FAQ_AR = [
  { q: "ما الخدمات التي تقدمها ووك بيزنس؟", a: "تقدم ووك بيزنس خمس خدمات متكاملة: المحاسبة، وووك أكاديمي (التدريب الاحترافي)، والاستشارات الإدارية، والتدقيق والامتثال، وحلول Odoo ERP." },
  { q: "ما مدة دورات أكاديمية ووك؟", a: "تتراوح مدة الدورات بين 3 و8 أسابيع. أساسيات المحاسبة 4 أسابيع، التحليل المالي 6 أسابيع، Odoo ERP 8 أسابيع، الضرائب والامتثال 3 أسابيع." },
  { q: "ما هو Odoo ERP ولماذا يجب تعلمه؟", a: "Odoo نظام ERP مفتوح المصدر يستخدمه أكثر من 7 ملايين شركة حول العالم. إتقانه يمنحك ميزة تنافسية قوية، إذ يفضل أكثر من 70% من أصحاب العمل المحاسبين القادرين على العمل بأنظمة ERP الحديثة." },
  { q: "هل التدريب أونلاين أم حضوري؟", a: "نقدم كلا الخيارين. التدريب الأونلاين يمنحك مرونة التعلم بالسرعة التي تناسبك، بينما ورش العمل الحضورية تتيح التطبيق العملي المباشر. تواصل معنا لمناقشة الخيار الأنسب لك." },
  { q: "هل يوجد شهادة بعد الانتهاء؟", a: "نعم. تنتهي جميع برامج ووك أكاديمي بشهادة معترف بها في الصناعة تُثبت مهاراتك وتعزز سيرتك الذاتية المهنية." },
  { q: "كيف أسجل في دورة؟", a: "انتقل إلى قسم 'التسجيل'، أدخل بياناتك، اختر الدورة، وأرسل الطلب. سيتواصل فريقنا معك خلال 24 ساعة لتأكيد التسجيل." },
  { q: "هل تقدم تطبيق Odoo للشركات؟", a: "نعم. بالإضافة للتدريب، تقدم ووك بيزنس خدمات تطبيق Odoo الكامل — تشمل إعداد النظام والتخصيص وترحيل البيانات وتدريب الفريق — مصممة لصناعتك." },
  { q: "ما خيارات الدفع المتاحة؟", a: "نقبل التحويلات البنكية والنقد وخطط التقسيط لدورات التدريب. لمشاريع الاستشارات وERP تُحدد شروط الدفع في عقد الخدمة. تواصل معنا للتفاصيل." },
];

const FAQ_FR = [
  { q: "Quels services propose Walk Business?", a: "Walk Business propose cinq services intégrés: Comptabilité, Walk Academy (formation professionnelle), Conseil en gestion, Audit & Conformité, et Solutions Odoo ERP." },
  { q: "Quelle est la durée des cours Walk Academy?", a: "Les durées varient de 3 à 8 semaines: Fondamentaux 4 semaines, Analyse financière 6 semaines, Odoo ERP 8 semaines, Fiscalité 3 semaines." },
  { q: "Qu'est-ce qu'Odoo ERP et pourquoi l'apprendre?", a: "Odoo est un ERP open-source utilisé par plus de 7 millions d'entreprises. Le maîtriser vous donne un avantage concurrentiel fort, car plus de 70% des employeurs préfèrent les comptables compétents en ERP." },
  { q: "La formation est-elle en ligne ou présentielle?", a: "Nous proposons les deux formats. En ligne pour la flexibilité, en présentiel pour la pratique directe. Contactez-nous pour discuter de ce qui vous convient." },
  { q: "Y a-t-il un certificat à la fin?", a: "Oui. Tous les programmes Walk Academy se terminent par un certificat reconnu par l'industrie qui valorise votre CV professionnel." },
  { q: "Comment s'inscrire à un cours?", a: "Allez à la section 'Inscription', remplissez vos coordonnées, sélectionnez votre cours et soumettez. Notre équipe vous contactera sous 24 heures." },
  { q: "Proposez-vous l'implémentation Odoo pour les entreprises?", a: "Oui. Walk Business fournit des services complets d'implémentation Odoo — configuration, personnalisation, migration de données et formation — adaptés à votre secteur." },
  { q: "Quelles sont les options de paiement?", a: "Nous acceptons les virements bancaires, espèces et plans de paiement échelonné. Pour les projets de conseil et ERP, les conditions sont définies dans le contrat de service." },
];

const FAQ_DATA: Record<string, { q: string; a: string }[]> = { en: FAQ_EN, ar: FAQ_AR, fr: FAQ_FR };

export default function FAQ() {
  const { t, lang, isRTL } = useI18n();
  const [open, setOpen] = useState<number | null>(null);
  const items = FAQ_DATA[lang] || FAQ_EN;

  return (
    <section id="faq" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-question-circle" /> FAQ
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">
            {lang === "ar" ? "الأسئلة الشائعة" : lang === "fr" ? "Questions Fréquentes" : "Frequently Asked Questions"}
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            {lang === "ar" ? "إجابات على أكثر الأسئلة شيوعاً حول خدماتنا" : lang === "fr" ? "Réponses aux questions les plus fréquentes sur nos services" : "Answers to the most common questions about our services"}
          </p>
        </AnimatedSection>

        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-[#0D3B5C] text-sm leading-snug">{item.q}</span>
                <motion.i
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="fas fa-chevron-down text-[#F58220] shrink-0"
                />
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
