"use client";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function CTABanner() {
  const { t, isRTL } = useI18n();
  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="relative py-24 overflow-hidden bg-gradient-to-br from-[#F58220] via-[#e8741a] to-[#d9700f] animate-gradient">
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3C/g%3E%3C/svg%3E")` }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl lg:text-5xl font-black text-white mb-5 leading-tight"
        >
          {t("cta.title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          {t("cta.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <a
            href="#register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#F58220] font-bold rounded-full text-lg hover:bg-[#0D3B5C] hover:text-white hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
          >
            <i className="fas fa-rocket" /> {t("cta.btn_enroll")}
          </a>
          <a
            href="/consultation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white font-bold rounded-full text-lg border-2 border-white/60 hover:bg-white/15 hover:border-white hover:-translate-y-1 transition-all duration-300"
          >
            <i className="fas fa-calendar-check" /> Book Free Consultation
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap gap-8 justify-center"
        >
          {["cta.pill1", "cta.pill2", "cta.pill3"].map((key) => (
            <div key={key} className="flex items-center gap-2 text-white/90">
              <i className="fas fa-check-circle text-white/60" />
              <span className="font-semibold text-lg">{t(key)}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
