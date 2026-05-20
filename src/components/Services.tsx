"use client";
import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";
import { useI18n } from "@/lib/i18n";

const SERVICES = [
  { icon: "fa-calculator",        key: "accounting" },
  { icon: "fa-graduation-cap",    key: "academy" },
  { icon: "fa-briefcase",         key: "consulting" },
  { icon: "fa-shield-halved",     key: "audit" },
  { icon: "fa-gears",             key: "odoo" },
  { icon: "fa-balance-scale",     key: "tax" },
];

export default function Services() {
  const { t, isRTL } = useI18n();
  return (
    <section id="services" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-th-large" /> {t("services.badge")}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">
            {t("services.title")}
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">{t("services.subtitle")}</p>
        </AnimatedSection>

        <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <StaggerItem key={s.key}>
              <div className="group bg-white rounded-3xl p-7 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden h-full">
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F58220] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                <div className="w-14 h-14 bg-[#0D3B5C]/8 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#0D3B5C] transition-colors duration-300">
                  <i className={`fas ${s.icon} text-xl text-[#0D3B5C] group-hover:text-white transition-colors duration-300`} />
                </div>
                <h3 className="text-lg font-bold text-[#0D3B5C] mb-3">{t(`services.${s.key}.title`)}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{t(`services.${s.key}.desc`)}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
