"use client";
import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";

const modules = [
  { icon: "fa-calculator",       title: "Accounting",            desc: "Automated bookkeeping, seamless bank reconciliations, efficient invoicing, and comprehensive payment processing inside Odoo." },
  { icon: "fa-shopping-cart",    title: "Sales & Purchases",     desc: "Streamlined management of customer orders, supplier relationships, and precise customer invoicing from end to end." },
  { icon: "fa-warehouse",        title: "Inventory & Warehousing",desc: "Robust stock control, real-time inventory tracking, and optimized warehouse management for maximum efficiency." },
  { icon: "fa-industry",         title: "Manufacturing",         desc: "Detailed production planning, accurate bill of materials, and efficient work order management inside Odoo." },
  { icon: "fa-chart-pie",        title: "Dashboards & Analytics",desc: "Utilize Odoo's powerful dashboards to extract real-time insights and inform strategic data-driven business decisions." },
  { icon: "fa-project-diagram",  title: "Business Integration",  desc: "Understand how ERP systems integrate finance, HR, sales, and supply chain into one cohesive, centralized platform." },
];

export default function OdooModules() {
  return (
    <section id="odoo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-cogs" /> Hands-On ERP Training
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">
            Odoo: The Key to{" "}
            <span className="text-[#F58220]">Modern Accounting Success</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Used by over <strong className="text-[#0D3B5C]">7 million companies worldwide</strong> — mastering Odoo
            gives you a clear competitive advantage and opens doors to higher salaries and faster promotions.
          </p>
        </AnimatedSection>

        <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => (
            <StaggerItem key={m.title}>
              <div className="group bg-[#F5F5F5] rounded-3xl p-7 hover:bg-[#0D3B5C] transition-all duration-400 hover:shadow-2xl hover:-translate-y-2 cursor-default h-full">
                <div className="w-14 h-14 bg-[#0D3B5C]/10 group-hover:bg-white/15 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300">
                  <i className={`fas ${m.icon} text-xl text-[#0D3B5C] group-hover:text-[#F58220] transition-colors duration-300`} />
                </div>
                <h3 className="text-lg font-bold text-[#0D3B5C] group-hover:text-white mb-3 transition-colors duration-300">
                  {m.title}
                </h3>
                <p className="text-gray-500 group-hover:text-white/70 text-sm leading-relaxed transition-colors duration-300">
                  {m.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
