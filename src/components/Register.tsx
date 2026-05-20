"use client";
import { useState } from "react";
import { AnimatedSection } from "./AnimatedSection";

const courses = [
  { value: "c1", label: "Accounting Fundamentals",    price: "2,999 EGP" },
  { value: "c2", label: "Advanced Financial Analysis", price: "4,999 EGP" },
  { value: "c3", label: "Odoo ERP Mastery",            price: "5,999 EGP" },
  { value: "c4", label: "Tax & Compliance",            price: "3,499 EGP" },
];

export default function Register() {
  const [selected, setSelected] = useState("");
  const selectedCourse = courses.find((c) => c.value === selected);

  return (
    <section id="register" className="py-24 bg-[#0D3B5C] relative overflow-hidden">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")` }}
      />
      <div className="relative max-w-3xl mx-auto px-6">
        <AnimatedSection className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/20 border border-[#F58220]/40 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-user-plus" /> Enrollment
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2 mb-3">
            Register for a Course
          </h2>
          <p className="text-white/60">Take the first step toward your future</p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-br from-[#1a5a8a] to-[#0D3B5C] p-8 text-white text-center">
              <div className="w-16 h-16 bg-[#F58220] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-graduation-cap text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold">Start Your Journey Today</h3>
              <p className="text-white/70 mt-1">Fill in your details and we&apos;ll contact you shortly</p>
            </div>

            <div className="p-8">
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Full Name *</label>
                    <input type="text" name="full_name" required placeholder="Your full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Email Address *</label>
                    <input type="email" name="email" required placeholder="your@email.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Phone Number *</label>
                    <input type="tel" name="phone" required placeholder="+20 xxx xxx xxxx"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Country</label>
                    <select name="country"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all appearance-none">
                      <option value="">-- Select Country --</option>
                      {["Egypt","Morocco","Algeria","Tunisia","UAE","Saudi Arabia","France","Other"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Select Course *</label>
                  <select name="course" required value={selected} onChange={(e) => setSelected(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all appearance-none">
                    <option value="">-- Choose a Course --</option>
                    {courses.map((c) => (
                      <option key={c.value} value={c.value}>{c.label} — {c.price}</option>
                    ))}
                  </select>
                </div>

                {selectedCourse && (
                  <div className="flex items-center justify-between bg-[#0D3B5C] text-white rounded-2xl px-6 py-4">
                    <div>
                      <div className="text-white/60 text-xs">Selected Course</div>
                      <div className="font-semibold">{selectedCourse.label}</div>
                    </div>
                    <div className="text-[#F58220] font-black text-2xl">{selectedCourse.price}</div>
                  </div>
                )}

                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <i className="fas fa-info-circle text-[#0D3B5C]" />
                  <p className="text-gray-500 text-xs">
                    After submitting, our team will contact you within 24 hours to confirm your enrollment and discuss payment options.
                  </p>
                </div>

                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#F58220] text-white font-bold rounded-xl text-lg hover:bg-[#d9700f] hover:shadow-xl hover:shadow-orange-400/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <i className="fas fa-paper-plane" /> Submit Registration
                </button>
              </form>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
