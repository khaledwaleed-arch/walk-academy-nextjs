"use client";
import { AnimatedSection } from "./AnimatedSection";

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Visual side */}
          <AnimatedSection direction="left">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] min-h-[440px] flex items-center justify-center relative shadow-2xl">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")` }}
                />
                <div className="relative z-10 text-center p-12">
                  <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-building text-white text-5xl opacity-40" />
                  </div>
                  <div className="text-white text-2xl font-bold">Walk Academy</div>
                  <div className="text-white/50 text-sm mt-2">Est. 2014 — Cairo, Egypt</div>
                </div>

                {/* Floating stats */}
                <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
                  {[
                    { n: "500+", l: "Graduates" },
                    { n: "10+", l: "Years" },
                    { n: "4.9", l: "Rating" },
                  ].map((s) => (
                    <div key={s.l} className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/15">
                      <div className="text-[#F58220] font-black text-lg">{s.n}</div>
                      <div className="text-white/60 text-xs">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience badge */}
              <div className="absolute -bottom-6 -right-6 bg-[#F58220] text-white rounded-2xl p-5 shadow-2xl text-center animate-pulse-glow">
                <div className="text-4xl font-black leading-none">10+</div>
                <div className="text-sm font-medium opacity-90 mt-1">Years Experience</div>
              </div>
            </div>
          </AnimatedSection>

          {/* Content side */}
          <AnimatedSection direction="right" delay={0.15}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
              <i className="fas fa-info-circle" /> Who We Are
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0D3B5C] mb-6 mt-2">
              About Walk Academy
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Walk Academy is a professional accounting training academy dedicated to
              transforming graduates into confident, job-ready accountants equipped
              with both theoretical knowledge and hands-on ERP expertise.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Our experienced instructors — industry veterans with years of practical
              experience — guide you through a comprehensive curriculum covering GAAP,
              IFRS, financial analysis, and Odoo ERP, offering continuous mentorship
              every step of the way.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { title: "Our Mission", desc: "To empower businesses and individuals with the financial knowledge and tools for sustainable growth.", icon: "fa-bullseye" },
                { title: "Our Vision",  desc: "To be the leading accounting and ERP solutions provider across the region.", icon: "fa-eye" },
              ].map((v) => (
                <div key={v.title} className="bg-[#F5F5F5] rounded-2xl p-5 border-l-4 border-[#F58220]">
                  <div className="flex items-center gap-2 mb-2">
                    <i className={`fas ${v.icon} text-[#F58220]`} />
                    <h4 className="font-bold text-[#0D3B5C] text-sm">{v.title}</h4>
                  </div>
                  <p className="text-gray-500 text-sm leading-snug">{v.desc}</p>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0D3B5C] text-white font-semibold rounded-full hover:bg-[#092c46] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            >
              Learn More About Us <i className="fas fa-arrow-right text-xs" />
            </a>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
