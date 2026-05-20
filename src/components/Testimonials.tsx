"use client";
import { AnimatedSection, StaggerGrid, StaggerItem } from "./AnimatedSection";

const testimonials = [
  {
    avatar: "A",
    gradient: "from-[#0D3B5C] to-[#1a5a8a]",
    name: "Ahmed",
    role: "Accountant, Import-Export Company",
    text: "From university student to accountant at a major import-export company within 6 months of training. Walk Academy bridged the gap that my degree never could.",
  },
  {
    avatar: "S",
    gradient: "from-[#F58220] to-[#d9700f]",
    name: "Sarah",
    role: "Accounting Department Head, Startup",
    text: "Successfully managed the accounting department of a startup using my acquired Odoo skills. The hands-on training made all the difference — it felt like real work from day one.",
  },
  {
    avatar: "M",
    gradient: "from-[#1a5a8a] to-[#0D3B5C]",
    name: "Mohamed",
    role: "Accountant, Multinational Corporation",
    text: "Secured a position in a multinational corporation thanks to my proficiency in modern accounting systems. Walk Academy's flexible training allowed me to learn at my own pace.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-quote-left" /> Testimonials
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Real stories from graduates who transformed their careers
          </p>
        </AnimatedSection>

        <StaggerGrid className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <div className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col border border-transparent hover:border-[#F58220]/20 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F58220] to-[#ffa04d]" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <i key={i} className="fas fa-star text-[#F58220] text-sm" />
                  ))}
                </div>

                {/* Quote */}
                <div className="text-gray-600 text-sm leading-relaxed flex-1 italic mb-6">
                  &ldquo;{t.text}&rdquo;
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-[#0D3B5C] text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
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
