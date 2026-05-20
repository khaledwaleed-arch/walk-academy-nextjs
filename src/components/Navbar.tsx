"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const links = [
  { href: "#home",      label: "Home" },
  { href: "#about",     label: "About" },
  { href: "#services",  label: "Services" },
  { href: "#academy",   label: "Academy" },
  { href: "#blog",      label: "Blog" },
  { href: "#contact",   label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [active, setActive]       = useState("#home");

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#092c46] shadow-2xl py-3 border-b border-[#F58220]/20"
          : "bg-[#0D3B5C]/95 backdrop-blur-md py-4 border-b border-white/5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
            <span className="text-white font-black text-2xl leading-none">W</span>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F58220] group-hover:h-2 transition-all duration-300" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-white font-extrabold text-xl tracking-tight">Walk</span>
            <span className="text-[#F58220] text-xs font-semibold tracking-[0.15em] uppercase">Academy</span>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active === l.href
                    ? "text-white bg-white/15"
                    : "text-white/75 hover:text-white hover:bg-white/10"
                }`}
              >
                {l.label}
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
          <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-full px-2 py-1">
            {["EN", "AR", "FR"].map((lang) => (
              <button
                key={lang}
                className="px-3 py-1 rounded-full text-xs font-semibold text-white/70 hover:bg-[#F58220] hover:text-white transition-all duration-200 first:hover:bg-[#F58220]"
              >
                {lang}
              </button>
            ))}
          </div>

          <a
            href="#register"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-[#F58220] text-white text-sm font-semibold rounded-full hover:bg-[#d9700f] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
          >
            <i className="fas fa-rocket text-xs" />
            Register Now
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
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 font-medium transition"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#register"
                onClick={() => setMenuOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 px-5 py-3 bg-[#F58220] text-white font-semibold rounded-full"
              >
                <i className="fas fa-rocket text-xs" /> Register Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
