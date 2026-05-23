"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import PaymentMethodSelector, { type PaymentMethod } from "@/components/PaymentMethodSelector";

interface CourseOption {
  value: string;
  label: string;
  price: string;
}

const COUNTRIES = ["Egypt", "Morocco", "Algeria", "Tunisia", "UAE", "Saudi Arabia", "Kuwait", "France", "Other"];
type Status = "idle" | "sending" | "ok" | "err";

export default function RegisterPage() {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selected, setSelected] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((rows) => {
        setCourses(
          rows.map((c: { slug: string; title_en: string; price: string }) => ({
            value: c.slug,
            label: c.title_en,
            price: c.price ?? "",
          }))
        );
      })
      .catch(() => {});
  }, []);

  const selectedCourse = courses.find((c) => c.value === selected);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
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
    <main className="min-h-screen bg-gradient-to-br from-[#0D3B5C] via-[#1a5a8a] to-[#0D3B5C] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-2xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Walk Business" width={50} height={50} className="brightness-0 invert" />
          <span className="text-white font-bold text-lg">Walk Academy</span>
        </Link>
        <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors">
          ← Back to site
        </Link>
      </header>

      <div className="flex-1 flex items-start justify-center px-4 pb-12 pt-4">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Card header */}
          <div className="bg-gradient-to-br from-[#1a5a8a] to-[#0D3B5C] p-8 text-white text-center">
            <div className="w-16 h-16 bg-[#F58220] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-graduation-cap text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold">Enroll in Walk Academy</h1>
            <p className="text-white/70 mt-1 text-sm">Fill in your details and we&apos;ll contact you within 24 hours</p>
          </div>

          <div className="p-8">
            {status === "ok" ? (
              <div className="flex flex-col items-center py-8 text-center gap-4">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-green-500 text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-[#0D3B5C]">Registration Submitted!</h2>
                <p className="text-gray-500 max-w-sm text-sm">
                  Our team will contact you within 24 hours to confirm your enrollment.
                </p>
                {paymentMethod === "instapay" && (
                  <div className="w-full bg-[#f5f0ff] border-2 border-[#3d1a6e]/30 rounded-2xl p-5 text-left">
                    <p className="font-semibold text-[#3d1a6e] text-sm mb-3"><i className="fas fa-credit-card mr-2" />Pay via InstaPay</p>
                    <p className="text-xs text-gray-500 mb-1">Send payment to:</p>
                    <p className="font-bold text-[#3d1a6e]">khaledwaledd@instapay</p>
                    <a href="https://ipn.eg/S/khaledwaledd/instapay/6Lok2a" target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 px-5 py-2 bg-[#3d1a6e] text-white text-sm font-semibold rounded-full hover:bg-[#2d1254] transition-colors">
                      <i className="fas fa-external-link-alt text-xs" /> Open InstaPay Link
                    </a>
                  </div>
                )}
                {paymentMethod === "wallet" && (
                  <div className="w-full bg-[#fff5f5] border-2 border-[#C8102E]/30 rounded-2xl p-5 text-left">
                    <p className="font-semibold text-[#C8102E] text-sm mb-3"><i className="fas fa-mobile-alt mr-2" />Pay via Mobile Wallet</p>
                    <p className="text-xs text-gray-500 mb-1">Send payment to:</p>
                    <p className="font-bold text-[#C8102E] text-xl tracking-widest">011 4370 6993</p>
                    <p className="text-xs text-gray-400 mt-2">Keep your transfer receipt as proof of payment</p>
                  </div>
                )}
                <button
                  onClick={handleReset}
                  className="mt-2 px-8 py-3 bg-[#F58220] text-white rounded-full font-semibold hover:bg-[#d9700f] transition-colors"
                >
                  Register Another
                </button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Full Name *</label>
                    <input
                      type="text" name="full_name" required placeholder="Your full name"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Email *</label>
                    <input
                      type="email" name="email" required placeholder="your@email.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Phone *</label>
                    <input
                      type="tel" name="phone" required placeholder="+20 xxx xxx xxxx"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Country</label>
                    <select
                      name="country"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all appearance-none"
                    >
                      <option value="">-- Select Country --</option>
                      {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Course *</label>
                  <select
                    name="course" required value={selected} onChange={(e) => setSelected(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all appearance-none"
                  >
                    <option value="">-- Choose a Course --</option>
                    {courses.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}{c.price ? ` — ${c.price}` : ""}</option>
                    ))}
                  </select>
                </div>

                {selectedCourse && (
                  <div className="flex items-center justify-between bg-[#0D3B5C] text-white rounded-2xl px-6 py-4">
                    <div>
                      <div className="text-white/60 text-xs">Selected Course</div>
                      <div className="font-semibold text-sm">{selectedCourse.label}</div>
                    </div>
                    <div className="text-[#F58220] font-black text-xl">{selectedCourse.price}</div>
                  </div>
                )}

                {selected && (
                  <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                )}

                {status === "err" && (
                  <p className="text-red-500 text-sm text-center">Something went wrong. Please try again.</p>
                )}

                <button
                  type="submit" disabled={status === "sending"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#F58220] text-white font-bold rounded-xl text-lg hover:bg-[#d9700f] hover:shadow-xl hover:shadow-orange-400/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <i className={`fas ${status === "sending" ? "fa-spinner fa-spin" : "fa-paper-plane"}`} />
                  {status === "sending" ? "Submitting..." : "Register Now"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
