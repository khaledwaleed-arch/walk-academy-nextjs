"use client";
import { useState, useEffect } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { useI18n } from "@/lib/i18n";
import { motion, AnimatePresence } from "framer-motion";

interface FaqItem {
  id: number;
  question_en: string; question_ar: string;
  answer_en: string; answer_ar: string;
}

export default function FAQ() {
  const { t, lang, isRTL } = useI18n();
  const [items, setItems] = useState<FaqItem[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/faq")
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => setItems([]));
  }, []);

  const isAr = lang === "ar";

  return (
    <section id="faq" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-question-circle" /> {t("faq.badge")}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">{t("faq.title")}</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">{t("faq.subtitle")}</p>
        </AnimatedSection>

        <div className="space-y-3">
          {items.map((item) => {
            const q = isAr ? item.question_ar : item.question_en;
            const a = isAr ? item.answer_ar : item.answer_en;
            return (
              <div key={item.id} className="border border-gray-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpen(open === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-start hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-[#0D3B5C] text-sm leading-snug">{q}</span>
                  <motion.i
                    animate={{ rotate: open === item.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="fas fa-chevron-down text-[#F58220] shrink-0"
                  />
                </button>
                <AnimatePresence initial={false}>
                  {open === item.id && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-100 pt-4">
                        {a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
