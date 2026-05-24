"use client";
import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const SERVICES_EN = [
  "Accounting & Bookkeeping",
  "Financial Analysis & Reporting",
  "Odoo ERP Implementation",
  "Tax & Compliance",
  "Management Consulting",
  "Audit & Assurance",
  "Walk Academy Training",
  "Other",
];

const SERVICES_AR = [
  "محاسبة وإمساك الدفاتر",
  "التحليل المالي وإعداد التقارير",
  "تطبيق Odoo ERP",
  "الضرائب والامتثال",
  "الاستشارات الإدارية",
  "التدقيق والتحقق",
  "تدريب Walk Academy",
  "أخرى",
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
  const { t, isRTL, lang } = useI18n();
  const isAr = lang === "ar";
  const services = isAr ? SERVICES_AR : SERVICES_EN;

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
      setError(t("consultation.error_required"));
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gtag = (window as any).gtag;
      if (typeof gtag === "function") {
        gtag("event", "generate_lead", { event_category: "consultation", event_label: form.service });
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setError(t("consultation.error_server"));
    }
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#F5F5F5]" dir={isRTL ? "rtl" : "ltr"}>
      {/* Nav */}
      <nav className="bg-[#0D3B5C] py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <i className={`fas fa-arrow-${isRTL ? "right" : "left"} text-sm`} />
            <span className="text-sm font-medium">Walk Business</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-[#0D3B5C] to-[#1a5a8a] text-white py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-6">
            <i className="fas fa-calendar-check" /> {t("consultation.badge")}
          </span>
          <h1 className="text-3xl lg:text-5xl font-black mb-4">{t("consultation.title")}</h1>
          <p className="text-white/70 text-lg">{t("consultation.subtitle")}</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {status === "success" ? (
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check-circle text-4xl text-green-500" />
            </div>
            <h2 className="text-2xl font-black text-[#0D3B5C] mb-3">{t("consultation.success_title")}</h2>
            <p className="text-gray-400 text-sm mb-8">{t("consultation.success_desc")}</p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D3B5C] text-white font-bold rounded-2xl hover:bg-[#1a5a8a] transition-all"
              >
                <i className="fas fa-home" /> {t("consultation.back_home")}
              </Link>
              <button
                onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", company: "", service: "", preferred_date: "", preferred_time: "", message: "" }); }}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#0D3B5C] text-[#0D3B5C] font-bold rounded-2xl hover:bg-[#0D3B5C] hover:text-white transition-all"
              >
                {t("consultation.book_another")}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-[#0D3B5C] font-bold text-lg mb-6 flex items-center gap-2">
                <i className="fas fa-user text-[#F58220]" /> {t("consultation.personal_info")}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t("consultation.name_label")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="name" value={form.name} onChange={handleChange}
                    placeholder={isAr ? "اسمك الكامل" : "Your full name"}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t("consultation.email_label")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder={t("consultation.email_placeholder")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm"
                    required
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("consultation.phone_label")}</label>
                  <input
                    name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+20 1XX XXX XXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("consultation.company_label")}</label>
                  <input
                    name="company" value={form.company} onChange={handleChange}
                    placeholder={t("consultation.company_placeholder")}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Service & Scheduling */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-[#0D3B5C] font-bold text-lg mb-6 flex items-center gap-2">
                <i className="fas fa-calendar text-[#F58220]" /> {t("consultation.service_section")}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {t("consultation.service_label")} <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service" value={form.service} onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm bg-white"
                    required
                  >
                    <option value="">{t("consultation.service_placeholder")}</option>
                    {services.map((s, i) => (
                      <option key={SERVICES_EN[i]} value={SERVICES_EN[i]}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("consultation.date_label")}</label>
                    <input
                      type="date" name="preferred_date" value={form.preferred_date} onChange={handleChange}
                      min={today}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("consultation.time_label")}</label>
                    <select
                      name="preferred_time" value={form.preferred_time} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F58220] focus:ring-2 focus:ring-[#F58220]/20 outline-none transition text-sm bg-white"
                    >
                      <option value="">{t("consultation.time_any")}</option>
                      {TIMES.map((time) => <option key={time} value={time}>{time}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("consultation.message_label")}</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange}
                    rows={4}
                    placeholder={t("consultation.message_placeholder")}
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
                <><i className="fas fa-spinner fa-spin" /> {t("consultation.booking")}</>
              ) : (
                <><i className="fas fa-calendar-check" /> {t("consultation.submit")}</>
              )}
            </button>

            <p className="text-center text-gray-400 text-xs">{t("consultation.terms")}</p>
          </form>
        )}
      </main>
    </div>
  );
}
