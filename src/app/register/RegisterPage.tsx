"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import PaymentMethodSelector, { type PaymentMethod } from "@/components/PaymentMethodSelector";

interface CourseOption {
  value: string;
  label_en: string;
  label_ar: string;
  price: string;
}

const COUNTRIES = ["Egypt", "Morocco", "Algeria", "Tunisia", "UAE", "Saudi Arabia", "Kuwait", "France", "Other"];
type Status = "idle" | "sending" | "ok" | "err";

export default function RegisterPage() {
  const { t, isRTL, lang } = useI18n();
  const isAr = lang === "ar";
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selected, setSelected] = useState(searchParams.get("course") ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((rows) => {
        setCourses(
          rows.map((c: { slug: string; title_en: string; title_ar: string; price: string }) => ({
            value: c.slug,
            label_en: c.title_en,
            label_ar: c.title_ar || c.title_en,
            price: c.price ?? "",
          }))
        );
      })
      .catch(() => {});
  }, []);

  const selectedCourse = courses.find((c) => c.value === selected);
  const getLabel = (c: CourseOption) => isAr ? c.label_ar : c.label_en;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    body.payment_method = paymentMethod;
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gtag = (window as any).gtag;
        if (typeof gtag === "function") {
          gtag("event", "generate_lead", {
            event_category: "registration",
            event_label: body.course as string || "unknown",
            event_source: "direct_link",
          });
        }
      }
      setStatus(res.ok ? "ok" : "err");
    } catch {
      setStatus("err");
    }
  }

  function handleReset() {
    setStatus("idle");
    setSelected("");
    setPaymentMethod("");
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0D3B5C] via-[#1a5a8a] to-[#0D3B5C] flex flex-col" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Walk Business" width={50} height={50} className="brightness-0 invert" />
          <span className="text-white font-bold text-lg">Walk Academy</span>
        </Link>
        <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
          {t("register.back")}
        </Link>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 pb-12 pt-4">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Card header */}
          <div className="bg-gradient-to-br from-[#1a5a8a] to-[#0D3B5C] p-8 text-white text-center">
            <div className="w-16 h-16 bg-[#F58220] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-graduation-cap text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold">{t("register.title")}</h1>
            <p className="text-white/70 mt-1 text-sm">{t("register.subtitle")}</p>
          </div>

          <div className="p-8">
            {status === "ok" ? (
              <div className="flex flex-col items-center py-6 text-center gap-5">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-green-500 text-3xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#0D3B5C]">{t("register.success_title")}</h2>
                  <p className="text-gray-500 text-sm mt-1">{t("register.success_desc")}</p>
                </div>

                {paymentMethod === "instapay" && (
                  <div className="w-full bg-[#f5f0ff] border-2 border-[#3d1a6e]/30 rounded-2xl p-5">
                    <p className="font-bold text-[#3d1a6e] mb-3 flex items-center gap-2 justify-center">
                      <i className="fas fa-credit-card" /> {t("register.instapay_title")}
                    </p>
                    <p className="font-bold text-[#3d1a6e] text-lg">khaledwaledd@instapay</p>
                    <a href="https://ipn.eg/S/khaledwaledd/instapay/6Lok2a" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 bg-[#3d1a6e] text-white text-sm font-semibold rounded-full hover:bg-[#2d1254] transition-colors">
                      <i className="fas fa-external-link-alt text-xs" /> {t("register.instapay_open")}
                    </a>
                  </div>
                )}
                {paymentMethod === "wallet" && (
                  <div className="w-full bg-[#fff5f5] border-2 border-[#C8102E]/30 rounded-2xl p-5">
                    <p className="font-bold text-[#C8102E] mb-3 flex items-center gap-2 justify-center">
                      <i className="fas fa-mobile-alt" /> {t("register.wallet_title")}
                    </p>
                    <p className="font-bold text-[#C8102E] text-2xl tracking-widest" dir="ltr">+201038606565</p>
                    <p className="text-xs text-gray-400 mt-2">{t("register.wallet_receipt")}</p>
                  </div>
                )}

                <button
                  onClick={handleReset}
                  className="w-full px-8 py-3 border-2 border-gray-200 text-gray-500 rounded-xl font-semibold hover:border-gray-300 hover:text-gray-700 transition-colors text-sm"
                >
                  {t("register.register_another")}
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0D3B5C] text-white text-xs font-bold">1</span>
                  <span className="text-sm font-bold text-[#0D3B5C]">{t("register.step1")}</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">{t("register.full_name")} *</label>
                    <input
                      type="text" name="full_name" required
                      placeholder={isAr ? "اسمك الكامل" : "Your full name"}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">{t("register.email")} *</label>
                    <input
                      type="email" name="email" required placeholder={t("consultation.email_placeholder")}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">{t("register.phone")} *</label>
                    <input
                      type="tel" name="phone" required placeholder="+20 xxx xxx xxxx"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">{t("register.country")}</label>
                    <select
                      name="country"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all appearance-none"
                    >
                      <option value="">{t("register.select_country")}</option>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">{t("register.course")} *</label>
                  <select
                    name="course" required value={selected} onChange={(e) => setSelected(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all appearance-none"
                  >
                    <option value="">{t("register.select_course")}</option>
                    {courses.map((c) => (
                      <option key={c.value} value={c.value}>{getLabel(c)}{c.price ? ` — ${c.price}` : ""}</option>
                    ))}
                  </select>
                </div>

                {selectedCourse && (
                  <div className="flex items-center justify-between bg-[#0D3B5C] text-white rounded-2xl px-6 py-4">
                    <div>
                      <div className="text-white/60 text-xs">{t("register.selected_label")}</div>
                      <div className="font-semibold text-sm">{getLabel(selectedCourse)}</div>
                    </div>
                    <div className="text-[#F58220] font-black text-xl">{selectedCourse.price}</div>
                  </div>
                )}

                {selected && (
                  <div className="border-t-2 border-dashed border-gray-200 pt-5">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F58220] text-white text-xs font-bold">2</span>
                      <span className="text-sm font-bold text-[#0D3B5C]">{t("register.step2")}</span>
                    </div>
                    <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                  </div>
                )}

                {status === "err" && (
                  <p className="text-red-500 text-sm text-center">{t("register.error_msg")}</p>
                )}

                <button
                  type="submit" disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#F58220] text-white font-bold rounded-xl text-lg hover:bg-[#d9700f] hover:shadow-xl hover:shadow-orange-400/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <i className={`fas ${status === "sending" ? "fa-spinner fa-spin" : "fa-lock"}`} />
                  {status === "sending" ? t("register.sending") : t("register.submit")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
