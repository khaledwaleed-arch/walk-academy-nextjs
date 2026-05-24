import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy — Walk Business",
  description: "Refund and cancellation policy for Walk Business courses and services.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="bg-[#0D3B5C] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-black text-white mb-3">Refund Policy / سياسة الاسترداد</h1>
          <p className="text-white/60">Last updated: May 24, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12 space-y-8">

          <section>
            <h2 className="text-2xl font-bold text-[#0D3B5C] mb-4">Course Cancellation</h2>
            <p className="text-gray-600 leading-relaxed">
              Students may request a full refund within <strong>7 days</strong> of enrollment, provided that less than 20% of the course content has been accessed.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              After 7 days or if more than 20% of course content has been accessed, no refund will be issued.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0D3B5C] mb-4">Consultation Services</h2>
            <p className="text-gray-600 leading-relaxed">
              Free consultation sessions are non-refundable as they are provided at no cost. Paid consulting engagements may be refunded within 48 hours of booking if cancelled before the session begins.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[#0D3B5C] mb-4">How to Request a Refund</h2>
            <p className="text-gray-600 leading-relaxed">
              To request a refund, contact us at{" "}
              <a href="mailto:info@walk-business.com" className="text-[#F58220] hover:underline">info@walk-business.com</a>{" "}
              or via WhatsApp at{" "}
              <a href="https://wa.me/201038606565" className="text-[#F58220] hover:underline" dir="ltr">+20 103 860 6565</a>.
              Please include your full name, course name, and reason for cancellation.
              We will process eligible refunds within 5–7 business days.
            </p>
          </section>

          <hr className="border-gray-100" />

          <section dir="rtl" className="text-right">
            <h2 className="text-2xl font-bold text-[#0D3B5C] mb-4">سياسة الاسترداد</h2>
            <p className="text-gray-600 leading-relaxed">
              يحق للطالب استرداد المبلغ كاملاً خلال <strong>7 أيام</strong> من تاريخ التسجيل، شريطة أن لا يكون قد استُعرض أكثر من 20٪ من محتوى الدورة.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              بعد مرور 7 أيام أو في حال الوصول لأكثر من 20٪ من المحتوى، لا يتم إجراء أي استرداد.
            </p>
            <p className="text-gray-600 leading-relaxed mt-3">
              لطلب الاسترداد، تواصل معنا عبر البريد الإلكتروني{" "}
              <a href="mailto:info@walk-business.com" className="text-[#F58220] hover:underline" dir="ltr">info@walk-business.com</a>{" "}
              أو واتساب{" "}
              <a href="https://wa.me/201038606565" className="text-[#F58220] hover:underline" dir="ltr">+20 103 860 6565</a>.
            </p>
          </section>

          <div className="text-center pt-4">
            <Link href="/" className="inline-flex items-center gap-2 text-[#0D3B5C] hover:text-[#F58220] font-semibold transition-colors">
              <i className="fas fa-arrow-left" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
