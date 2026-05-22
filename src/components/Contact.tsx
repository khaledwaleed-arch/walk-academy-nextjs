"use client";
import { useState } from "react";
import { AnimatedSection } from "./AnimatedSection";
import { useI18n } from "@/lib/i18n";

const socials = [
  { icon: "fa-facebook-f",  href: "https://www.facebook.com/share/1FWUU3yLs7/",           label: "Facebook",  hoverColor: "hover:bg-[#1877f2]" },
  { icon: "fa-instagram",   href: "https://www.instagram.com/walk.academy",                 label: "Instagram", hoverColor: "hover:bg-[#e1306c]" },
  { icon: "fa-linkedin-in", href: "https://www.linkedin.com/company/walk-academy/",         label: "LinkedIn",  hoverColor: "hover:bg-[#0077b5]" },
  { icon: "fa-youtube",     href: "https://www.youtube.com/@Walk-Academy",                  label: "YouTube",   hoverColor: "hover:bg-[#FF0000]" },
  { icon: "fa-tiktok",      href: "https://www.tiktok.com/@walkacademy",                    label: "TikTok",    hoverColor: "hover:bg-[#010101]" },
  { icon: "fa-whatsapp",    href: "https://wa.me/201143706993",                             label: "WhatsApp",  hoverColor: "hover:bg-[#25D366]" },
];

type Status = "idle" | "sending" | "ok" | "err";

export default function Contact() {
  const { t, isRTL } = useI18n();
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gtag = (window as any).gtag;
        if (typeof gtag === "function") {
          gtag("event", "contact", { event_category: "contact_form" });
        }
      }
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  return (
    <section id="contact" dir={isRTL ? "rtl" : "ltr"} className="py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-envelope" /> {t("contact.badge")}
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">{t("contact.title")}</h2>
          <p className="text-lg text-gray-500">{t("contact.subtitle")}</p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <AnimatedSection direction="left" className="lg:col-span-2 space-y-6">
            {[
              { icon: "fa-map-marker-alt", titleKey: "contact.address", value: "152 st King Faisal, Giza, Egypt" },
              { icon: "fa-phone",          titleKey: "contact.phone_label", value: "+20 114 370 6993", href: "tel:+201143706993" },
              { icon: "fa-envelope",       titleKey: "contact.email_label", value: "info@walk-business.com", href: "mailto:info@walk-business.com" },
            ].map((item) => (
              <div key={item.titleKey} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm">
                <div className="w-12 h-12 bg-[#0D3B5C]/8 rounded-xl flex items-center justify-center shrink-0">
                  <i className={`fas ${item.icon} text-[#0D3B5C]`} />
                </div>
                <div>
                  <div className="text-[#0D3B5C] font-semibold text-sm">{t(item.titleKey)}</div>
                  {item.href ? (
                    <a href={item.href} className="text-gray-600 text-sm hover:text-[#F58220] transition-colors">{item.value}</a>
                  ) : (
                    <div className="text-gray-600 text-sm">{item.value}</div>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-[#0D3B5C] font-semibold mb-3">{t("contact.follow")}</div>
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className={`w-10 h-10 bg-[#0D3B5C]/8 text-[#0D3B5C] rounded-xl flex items-center justify-center text-sm ${s.hoverColor} hover:text-white hover:-translate-y-1 transition-all duration-200`}>
                    <i className={`fab ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection direction="right" delay={0.15} className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              {status === "ok" ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-check text-green-500 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0D3B5C]">Message sent!</h3>
                  <p className="text-gray-500 text-sm">We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setStatus("idle")} className="mt-2 px-6 py-2 bg-[#F58220] text-white rounded-full text-sm font-semibold">Send another</button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">{t("contact.name")}</label>
                      <input type="text" name="name" placeholder={t("contact.name")} required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">{t("contact.email")}</label>
                      <input type="email" name="email" placeholder={t("contact.email")} required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">{t("contact.phone")}</label>
                      <input type="tel" name="phone" placeholder={t("contact.phone")}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">{t("contact.subject")}</label>
                      <input type="text" name="subject" placeholder={t("contact.subject")} required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">{t("contact.message")}</label>
                    <textarea name="message" placeholder={t("contact.message")} rows={5} required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all resize-none" />
                  </div>
                  {status === "err" && (
                    <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                  )}
                  <button type="submit" disabled={status === "sending"}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#F58220] text-white font-bold rounded-xl hover:bg-[#d9700f] hover:shadow-lg hover:shadow-orange-400/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <i className={`fas ${status === "sending" ? "fa-spinner fa-spin" : "fa-paper-plane"}`} />
                    {status === "sending" ? "Sending..." : t("contact.send")}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
