"use client";
import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";

const services = [
  { icon: "fa-balance-scale", title: "Core Principles & Standards",     desc: "Deep understanding of fundamental accounting principles, GAAP, and international financial reporting standards (IFRS)." },
  { icon: "fa-file-invoice-dollar", title: "Financial Operations Mastery", desc: "Proficiency in bookkeeping, financial statement preparation, and regulatory compliance — building a solid career foundation." },
  { icon: "fa-chart-line",   title: "Real-World Financial Analysis",    desc: "Practical skills to analyze complex financial data, interpret key metrics, and present insights that drive sound business decisions." },
  { icon: "fa-cogs",         title: "Odoo ERP — Hands-On",              desc: "Practical use of Odoo ERP covering Accounting, Sales & Purchases, Inventory & Warehousing, and Manufacturing modules." },
  { icon: "fa-briefcase",    title: "Simulated Business Scenarios",     desc: "Apply concepts through realistic case studies covering full sales, purchase, and inventory workflows from start to finish." },
  { icon: "fa-certificate",  title: "Certification & Career Launch",    desc: "Earn industry-recognized credentials that validate your expertise and position you as a highly sought-after professional." },
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-book-open" /> What We Offer
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">
            What You Will Learn
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            From fundamentals to advanced accounting — a complete career-ready curriculum
          </p>
        </AnimatedSection>

        <StaggerGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <StaggerItem key={s.title}>
              <div className="group bg-white rounded-3xl p-7 border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden h-full">
                {/* Accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F58220] scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
                <div className="w-14 h-14 bg-[#0D3B5C]/8 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#0D3B5C] transition-colors duration-300">
                  <i className={`fas ${s.icon} text-xl text-[#0D3B5C] group-hover:text-white transition-colors duration-300`} />
                </div>
                <h3 className="text-lg font-bold text-[#0D3B5C] mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}
