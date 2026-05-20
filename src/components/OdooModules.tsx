"use client";
import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";
import { useI18n } from "@/lib/i18n";

const MODULES = [
  { icon: "fa-calculator",      key: "m1" },
  { icon: "fa-shopping-cart",   key: "m2" },
  { icon: "fa-warehouse",       key: "m3" },
  { icon: "fa-industry",        key: "m4" },
  { icon: "fa-chart-pie",       key: "m5" },
  { icon: "fa-project-diagram", key: "m6" },
];

export default function OdooModules() {
  const { t, isRTL } = useI18n();
  return (
    <section id="odoo" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-cogs" /> {t("odoo.badge")}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">
            {t("odoo.title_1")}{" "}
            <span className="text-[#F58220]">{t("odoo.title_accent")}</span>
          </h2>
          <p
            className="text-lg text-gray-500 max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: t("odoo.subtitle") }}
          />
        </AnimatedSection>

        <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((m) => (
            <StaggerItem key={m.key}>
              <div className="group bg-[#F5F5F5] rounded-3xl p-7 hover:bg-[#0D3B5C] transition-all duration-400 hover:shadow-2xl hover:-translate-y-2 cursor-default h-full">
                <div className="w-14 h-14 bg-[#0D3B5C]/10 group-hover:bg-white/15 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300">
                  <i className={`fas ${m.icon} text-xl text-[#0D3B5C] group-hover:text-[#F58220] transition-colors duration-300`} />
                </div>
                <h3 className="text-lg font-bold text-[#0D3B5C] group-hover:text-white mb-3 transition-colors duration-300">
                  {t(`odoo.${m.key}_title`)}
                </h3>
                <p className="text-gray-500 group-hover:text-white/70 text-sm leading-relaxed transition-colors duration-300">
                  {t(`odoo.${m.key}_desc`)}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
