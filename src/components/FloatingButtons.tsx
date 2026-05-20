"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* WhatsApp */}
      <a
        href="https://wa.me/201038606565"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="fixed bottom-7 right-7 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center text-2xl shadow-2xl shadow-green-500/40 hover:scale-110 hover:bg-[#1ebe5d] transition-all duration-300"
        style={{ animation: "pulse-glow-wa 2.5s ease-in-out infinite" }}
      >
        <i className="fab fa-whatsapp" />
      </a>

      {/* Book Consultation — bottom LEFT */}
      <a
        href="/consultation"
        aria-label="Book Free Consultation"
        className="fixed bottom-7 left-7 z-50 flex items-center gap-2 px-5 py-3 bg-[#F58220] text-white rounded-full shadow-xl shadow-orange-300/40 hover:scale-105 hover:bg-[#d9700f] transition-all duration-300 text-sm font-bold"
      >
        <i className="fas fa-calendar-check" />
        <span>استشارة مجانية</span>
      </a>

      {/* Back to Top */}
      <AnimatePresence>
        {showTop && (
          <motion.a
            href="#home"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-24 right-7 z-50 w-11 h-11 bg-[#0D3B5C] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-[#F58220] hover:-translate-y-1 transition-all duration-300"
            aria-label="Back to top"
          >
            <i className="fas fa-chevron-up text-sm" />
          </motion.a>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes pulse-glow-wa {
          0%, 100% { box-shadow: 0 8px 32px rgba(37,211,102,0.4); }
          50%       { box-shadow: 0 8px 48px rgba(37,211,102,0.7); }
        }
      `}</style>
    </>
  );
}
