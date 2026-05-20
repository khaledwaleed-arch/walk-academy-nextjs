import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Walk Business",
  description: "Terms of Service for Walk Business website and services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#0D3B5C] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-black text-white mb-3">Terms of Service</h1>
          <p className="text-white/60">Last updated: May 20, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-10 shadow-sm space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using walk-business.com, you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our website or services.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">2. Services</h2>
            <p>Walk Business provides accounting services, professional training (Walk Academy), management consulting, audit, and Odoo ERP solutions. Details of each service are provided upon inquiry and are subject to separate service agreements.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">3. Course Enrollment</h2>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Course registrations are confirmed only after payment is received.</li>
              <li>Cancellations made more than 7 days before course start are eligible for a full refund.</li>
              <li>Cancellations within 7 days are eligible for a 50% refund or course credit.</li>
              <li>Course materials remain the intellectual property of Walk Business.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">4. Intellectual Property</h2>
            <p>All content on this website — including text, graphics, logos, and course materials — is the property of Walk Business and is protected by applicable copyright laws. You may not reproduce or distribute any content without prior written permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">5. Limitation of Liability</h2>
            <p>Walk Business shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service giving rise to the claim.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">6. Governing Law</h2>
            <p>These terms are governed by the laws of the Arab Republic of Egypt. Any disputes shall be subject to the exclusive jurisdiction of Egyptian courts.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">7. Contact</h2>
            <p>Questions about these terms: <a href="mailto:info@walk-business.com" className="text-[#F58220] hover:underline">info@walk-business.com</a> | +20 114 370 6993</p>
          </section>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0D3B5C] text-white rounded-full font-semibold hover:bg-[#092c46] transition-colors">
            <i className="fas fa-arrow-left text-sm" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
