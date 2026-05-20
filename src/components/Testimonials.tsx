"use client";
import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";
import { useI18n } from "@/lib/i18n";

const TESTIMONIALS = [
  { key: "t1", avatar: "A", gradient: "from-[#0D3B5C] to-[#1a5a8a]" },
  { key: "t2", avatar: "S", gradient: "from-[#F58220] to-[#d9700f]" },
  { key: "t3", avatar: "M", gradient: "from-[#1a5a8a] to-[#0D3B5C]" },
];

export default function Testimonials() {
  const { t, isRTL } = useI18n();
  return (
    <section id="testimonials" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-quote-left" /> {t("testimonials.badge")}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">{t("testimonials.title")}</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">{t("testimonials.subtitle")}</p>
        </AnimatedSection>

        <StaggerGrid className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <StaggerItem key={item.key}>
              <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col border border-transparent hover:border-[#F58220]/20 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F58220] to-[#ffa04d]" />
                <div className="flex gap-1 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <i key={i} className="fas fa-star text-[#F58220] text-sm" />
                  ))}
                </div>
                <div className="text-gray-600 text-sm leading-relaxed flex-1 italic mb-6">
                  &ldquo;{t(`testimonials.${item.key}_text`)}&rdquo;
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                    {item.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-[#0D3B5C] text-sm">{t(`testimonials.${item.key}_name`)}</div>
                    <div className="text-gray-400 text-xs">{t(`testimonials.${item.key}_role`)}</div>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
