"use client";
import { useState } from "react";
import Link from "next/link";

const SERVICES = [
  "Accounting & Bookkeeping",
  "Financial Analysis & Reporting",
  "Odoo ERP Implementation",
  "Tax & Compliance",
  "Management Consulting",
  "Audit & Assurance",
  "Walk Academy Training",
  "Other",
];

const TIMES = [
  "9:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "1:00 PM – 2:00 PM",
  "2:00 PM – 3:00 PM",
  "3:00 PM – 4:00 PM",
  "4:00 PM – 5:00 PM",
];

export default function ConsultationPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "",
    service: "", preferred_date: "", preferred_time: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.service) {
      setError("Please fill in name, email, and service type.");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Server error");
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again or contact us directly.");
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Nav */}
      <nav className="bg-[#0D3B5C] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <i className="fas fa-arrow-left text-sm" />
            <span className="text-sm font-medium">Walk Business</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] text-white py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6">
            <i className="fas fa-calendar-check" /> Free Consultation
          </span>
          <h1 className="text-3xl lg:text-5xl font-black mb-4">Book a Free Consultation</h1>
          <p className="text-white/70 text-lg">
            احجز استشارة مجانية مع أحد خبرائنا — نساعدك في المحاسبة، Odoo ERP، الضرائب والاستشارات الإدارية
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {status === "success" ? (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check-circle text-4xl text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-[#0D3B5C] mb-3">Booking Confirmed!</h2>
            <p className="text-gray-500 mb-2">شكراً لك — تم استلام طلبك بنجاح</p>
            <p className="text-gray-400 text-sm mb-8">
              Our team will contact you within 24 hours to confirm your appointment.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D3B5C] text-white font-bold rounded-2xl hover:bg-[#1a5a8a] transition-all"
              >
                <i className="fas fa-home" /> Back to Home
              </Link>
              <button
                onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", company: "", service: "", preferred_date: "", preferred_time: "", message: "" }); }}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#0D3B5C] text-[#0D3B5C] font-bold rounded-2xl hover:bg-[#0D3B5C] hover:text-white transition-all"
              >
                Book Another
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-[#0D3B5C] font-bold text-lg mb-6 flex items-center gap-2">
                <i className="fas fa-user text-[#F58220]" /> Your Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name" value={form.name} onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+20 1XX XXX XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Company / Organization</label>
                  <input
                    name="company" value={form.company} onChange={handleChange}
                    placeholder="Company name (optional)"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Service & Scheduling */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-[#0D3B5C] font-bold text-lg mb-6 flex items-center gap-2">
                <i className="fas fa-calendar text-[#F58220]" /> Service & Scheduling
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Service Needed <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service" value={form.service} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm bg-white"
                    required
                  >
                    <option value="">Select a service...</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Date</label>
                    <input
                      type="date" name="preferred_date" value={form.preferred_date} onChange={handleChange}
                      min={today}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preferred Time</label>
                    <select
                      name="preferred_time" value={form.preferred_time} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm bg-white"
                    >
                      <option value="">Any time</option>
                      {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message (optional)</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    rows={4}
                    placeholder="Describe your situation briefly so we can prepare for the consultation..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-red-600 text-sm flex items-center gap-2">
                <i className="fas fa-exclamation-circle" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-4 bg-[#F58220] text-white font-black text-lg rounded-2xl hover:bg-[#d9700f] disabled:opacity-60 transition-all hover:scale-[1.02] shadow-lg shadow-orange-200 flex items-center justify-center gap-3"
            >
              {status === "loading" ? (
                <><i className="fas fa-spinner fa-spin" /> Booking...</>
              ) : (
                <><i className="fas fa-calendar-check" /> Book Free Consultation</>
              )}
            </button>

            <p className="text-center text-gray-400 text-xs">
              By submitting, you agree that Walk Business may contact you about this request.
              We typically respond within 24 hours.
            </p>
          </form>
        )}
      </main>
    </div>
  );
}
