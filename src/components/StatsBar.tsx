"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const STATS = [
  { target: 85, suffix: "%",   key: "stats.s1" },
  { target: 7,  suffix: "M+",  key: "stats.s2" },
  { target: 70, suffix: "%+",  key: "stats.s3" },
  { target: 6,  suffix: " Mo", key: "stats.s4" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = target / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <div ref={ref} className="flex items-center justify-center gap-1 text-[#F58220]">
      <span className="text-4xl lg:text-5xl font-black tabular-nums">{count}</span>
      <span className="text-2xl lg:text-3xl font-black">{suffix}</span>
    </div>
  );
}

export default function StatsBar() {
  const { t } = useI18n();
  return (
    <div className="bg-[#092c46] py-14 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#F58220]/5 via-transparent to-[#F58220]/5" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {STATS.map((s) => (
            <motion.div
              key={s.key}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-center group"
            >
              <CountUp target={s.target} suffix={s.suffix} />
              <p className="text-white/60 text-sm mt-3 leading-snug max-w-[180px] mx-auto">
                {t(s.key)}
              </p>
              <div className="w-8 h-0.5 bg-[#F58220]/40 mx-auto mt-3 group-hover:w-16 group-hover:bg-[#F58220] transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
