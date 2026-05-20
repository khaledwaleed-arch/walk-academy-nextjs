import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Walk Business",
  description: "Privacy Policy for Walk Business website and services.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-[#0D3B5C] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-black text-white mb-3">Privacy Policy</h1>
          <p className="text-white/60">Last updated: May 20, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-3xl p-10 shadow-sm space-y-8 text-gray-600 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">1. Information We Collect</h2>
            <p>When you use our website, register for a course, or contact us, we may collect:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Personal information (name, email address, phone number)</li>
              <li>Course enrollment details</li>
              <li>Messages and correspondence you send us</li>
              <li>Technical information (IP address, browser type) via standard server logs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Process course registrations and contact requests</li>
              <li>Send enrollment confirmations and course updates</li>
              <li>Respond to your inquiries</li>
              <li>Send newsletters (only if you subscribed)</li>
              <li>Improve our services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">3. Data Storage</h2>
            <p>Your data is stored securely on our servers located in the EU. We use industry-standard encryption and access controls. We do not sell or rent your personal information to third parties.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">4. Cookies</h2>
            <p>We use only essential functional cookies (language preference). We do not use advertising or tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">5. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data at any time. Contact us at <a href="mailto:info@walk-business.com" className="text-[#F58220] hover:underline">info@walk-business.com</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#0D3B5C] mb-3">6. Contact</h2>
            <p>For any privacy-related questions: <a href="mailto:info@walk-business.com" className="text-[#F58220] hover:underline">info@walk-business.com</a> | +20 114 370 6993</p>
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
