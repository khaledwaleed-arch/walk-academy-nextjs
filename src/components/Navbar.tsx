"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useI18n, type Lang } from "@/lib/i18n";

const NAV_KEYS = [
  { href: "#home",     key: "nav.home" },
  { href: "#about",    key: "nav.about" },
  { href: "#services", key: "nav.services" },
  { href: "#academy",  key: "nav.academy" },
  { href: "#blog",     key: "nav.blog" },
  { href: "#contact",  key: "nav.contact" },
];

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "ع" },
];

export default function Navbar() {
  const { t, lang, setLang, isRTL } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive]     = useState("#home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      dir={isRTL ? "rtl" : "ltr"}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#092c46] shadow-2xl py-3 border-b border-[#F58220]/20"
          : "bg-[#0D3B5C]/95 backdrop-blur-md py-4 border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2 group shrink-0">
          <div className="relative h-14 flex items-center">
            <Image
              src="/logo.png"
              alt="Walk Business"
              width={188}
              height={55}
              className="h-14 w-auto object-contain brightness-0 invert"
              priority
            />
          </div>
        </a>

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-1">
          {NAV_KEYS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === l.href
                    ? "text-white bg-white/15"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                {t(l.key)}
                {active === l.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#F58220] rounded-full"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language switcher */}
          <div className="hidden sm:flex items-center gap-0.5 bg-white/10 rounded-full px-1.5 py-1">
            {LANGS.map(({ code, label }) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
                  lang === code
                    ? "bg-[#F58220] text-white shadow-sm"
                    : "text-white/70 hover:bg-white/15 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <a
            href="#register"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#F58220] text-white text-sm font-semibold rounded-full hover:bg-[#d9700f] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
          >
            <i className="fas fa-rocket text-xs" />
            {t("nav.register")}
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-white rounded"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block w-6 h-0.5 bg-white rounded"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-0.5 bg-white rounded"
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden overflow-hidden bg-[#092c46] border-t border-white/10"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_KEYS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 font-medium transition"
                >
                  {t(l.key)}
                </a>
              ))}

              {/* Mobile language switcher */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                {LANGS.map(({ code, label }) => (
                  <button
                    key={code}
                    onClick={() => setLang(code)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                      lang === code
                        ? "bg-[#F58220] text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <a
                href="#register"
                onClick={() => setMenuOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 px-5 py-3 bg-[#F58220] text-white font-semibold rounded-full"
              >
                <i className="fas fa-rocket text-xs" /> {t("nav.register")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
