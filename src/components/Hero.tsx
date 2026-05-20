"use client";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const LANGS: { code: "en" | "ar" | "fr"; label: string }[] = [
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
];

const SERVICES = [
  { key: "hero_card.s1", icon: "fa-calculator",    color: "bg-blue-500/20",   text: "text-blue-300" },
  { key: "hero_card.s2", icon: "fa-graduation-cap", color: "bg-orange-500/20", text: "text-[#F58220]" },
  { key: "hero_card.s3", icon: "fa-briefcase",      color: "bg-green-500/20",  text: "text-green-300" },
  { key: "hero_card.s4", icon: "fa-shield-halved",  color: "bg-purple-500/20", text: "text-purple-300" },
  { key: "hero_card.s5", icon: "fa-gears",          color: "bg-cyan-500/20",   text: "text-cyan-300" },
];

export default function Hero() {
  const { t, isRTL, lang, setLang } = useI18n();

  return (
    <section
      id="home"
      dir={isRTL ? "rtl" : "ltr"}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      style={{
        background: "linear-gradient(135deg, #0D3B5C 0%, #1a5a8a 45%, #0f4a7a 75%, #0D3B5C 100%)",
        backgroundSize: "200% 200%",
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="animate-spin-slow absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/5" />
        <div className="animate-spin-slow absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full border border-white/5" style={{ animationDirection: "reverse" }} />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#F58220]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — content */}
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] text-sm font-semibold mb-6">
                <i className="fas fa-building" />
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl lg:text-6xl font-black leading-tight mb-6"
            >
              {t("hero.title1")}{" "}
              <span className="text-[#F58220] relative whitespace-nowrap">
                {t("hero.title_accent")}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M1 8 C60 3, 140 3, 299 8" stroke="#F58220" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
                </svg>
              </span>{" "}
              {t("hero.title2")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg text-white/75 mb-10 max-w-xl leading-relaxed"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#services"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#F58220] text-white font-bold rounded-full text-lg hover:bg-[#d9700f] hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 whitespace-nowrap"
              >
                <i className="fas fa-th-large" /> {t("hero.cta_primary")}
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-full text-lg border border-white/30 hover:bg-white/20 hover:-translate-y-1 backdrop-blur-sm transition-all duration-300 whitespace-nowrap"
              >
                <i className="fas fa-comments" /> {t("hero.cta_secondary")}
              </a>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              {[
                { icon: "fa-clock",       key: "hero_badges.b1" },
                { icon: "fa-users",       key: "hero_badges.b2" },
                { icon: "fa-layer-group", key: "hero_badges.b3" },
              ].map((b) => (
                <div key={b.key} className="flex items-center gap-2 text-white/60 text-sm">
                  <i className={`fas ${b.icon} text-[#F58220]`} />
                  <span>{t(b.key)}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — services card */}
          <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative hidden lg:flex justify-center"
          >
            {/* Floating badge top */}
            <div className={`animate-float absolute -top-6 z-20 bg-white rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 ${isRTL ? "-left-6" : "-right-6"}`}>
              <div className="w-10 h-10 bg-[#F58220]/15 rounded-xl flex items-center justify-center">
                <i className="fas fa-award text-[#F58220] text-lg" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">Certified</div>
                <div className="text-sm text-[#0D3B5C] font-bold">Professional</div>
              </div>
            </div>

            {/* Floating badge bottom — functional language switcher */}
            <div className={`animate-float-delayed absolute -bottom-6 z-20 bg-white rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 ${isRTL ? "-right-6" : "-left-6"}`}>
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-globe text-green-600 text-lg" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium mb-1">Language</div>
                <div className="flex items-center gap-1" dir="ltr">
                  {LANGS.map(({ code, label }) => (
                    <button
                      key={code}
                      onClick={() => setLang(code)}
                      className={`px-2 py-0.5 rounded-md text-xs font-bold transition-all ${
                        lang === code
                          ? "bg-[#0D3B5C] text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main card */}
            <div
              className="relative w-full max-w-md rounded-3xl p-8 border border-white/15 shadow-2xl"
              style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(24px)" }}
            >
              <div className="w-14 h-14 bg-[#F58220] rounded-2xl flex items-center justify-center mb-5">
                <i className="fas fa-building text-white text-2xl" />
              </div>
              <h3 className="text-white text-xl font-bold mb-1">{t("hero_card.title")}</h3>
              <p className="text-white/60 text-sm mb-6">{t("hero_card.subtitle")}</p>

              <ul className="space-y-3">
                {SERVICES.map(({ key, icon, color, text }) => (
                  <li key={key} className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center shrink-0`}>
                      <i className={`fas ${icon} ${text} text-sm`} />
                    </div>
                    <span className="text-white/85 text-sm font-medium">{t(key)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between" dir="ltr">
                <div className="flex -space-x-2">
                  {["W", "A", "L", "K"].map((c) => (
                    <div key={c} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D3B5C] to-[#F58220] border-2 border-white/20 flex items-center justify-center text-white text-xs font-bold">
                      {c}
                    </div>
                  ))}
                </div>
                <span className="text-white/60 text-xs">500+ clients</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-[#F58220] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
