"use client";
import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";
import { useI18n } from "@/lib/i18n";

const COURSES = [
  { key: "c1", levelColor: "bg-green-500" },
  { key: "c2", levelColor: "bg-red-500" },
  { key: "c3", levelColor: "bg-blue-500" },
  { key: "c4", levelColor: "bg-purple-500" },
];

const PRICES: Record<string, string> = {
  c1: "2,999 EGP",
  c2: "4,999 EGP",
  c3: "5,999 EGP",
  c4: "3,499 EGP",
};

export default function Academy() {
  const { t, isRTL } = useI18n();
  return (
    <section id="academy" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-graduation-cap" /> {t("academy.subtitle")}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">{t("academy.title")}</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">{t("academy.desc")}</p>
        </AnimatedSection>

        <StaggerGrid className="grid md:grid-cols-2 gap-6 mb-10">
          {COURSES.map((c) => (
            <StaggerItem key={c.key}>
              <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] p-7 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-bold mb-3 ${c.levelColor}`}>
                    {t(`academy.courses.${c.key}.level`)}
                  </span>
                  <h3 className="text-white text-xl font-bold">{t(`academy.courses.${c.key}.title`)}</h3>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-5 mb-5 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-clock text-[#F58220]" /> {t(`academy.courses.${c.key}.duration`)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-certificate text-[#F58220]" /> {t("common.certificate")}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="fas fa-video text-[#F58220]" /> {t("common.online")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[#0D3B5C] font-black text-2xl">{PRICES[c.key]}</div>
                      <div className="text-gray-400 text-xs mt-0.5">Full program fee</div>
                    </div>
                    <a
                      href="#register"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F58220] text-white text-sm font-semibold rounded-full hover:bg-[#d9700f] group-hover:shadow-lg group-hover:shadow-orange-400/30 transition-all duration-300"
                    >
                      {t("academy.register_cta")} <i className="fas fa-arrow-right text-xs" />
                    </a>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <AnimatedSection className="text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#0D3B5C] text-[#0D3B5C] font-bold rounded-full hover:bg-[#0D3B5C] hover:text-white transition-all duration-300"
          >
            {t("academy.cta")} <i className="fas fa-arrow-right" />
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
