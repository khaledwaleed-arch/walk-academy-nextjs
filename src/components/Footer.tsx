"use client";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

const QUICK_LINK_KEYS = [
  { href: "#home",     key: "nav.home" },
  { href: "#about",    key: "nav.about" },
  { href: "#academy",  key: "nav.academy" },
  { href: "#blog",     key: "nav.blog" },
  { href: "#contact",  key: "nav.contact" },
];

const SERVICE_KEYS = [
  "services.accounting.title",
  "services.academy.title",
  "services.consulting.title",
  "services.audit.title",
  "services.odoo.title",
];

const socials = [
  { icon: "fa-facebook-f",  href: "https://www.facebook.com/share/1FWUU3yLs7/",     label: "Facebook" },
  { icon: "fa-instagram",   href: "https://www.instagram.com/walk.academy",           label: "Instagram" },
  { icon: "fa-linkedin-in", href: "https://www.linkedin.com/company/walk-academy/",   label: "LinkedIn" },
  { icon: "fa-youtube",     href: "https://www.youtube.com/@Walk-Academy",            label: "YouTube" },
  { icon: "fa-tiktok",      href: "https://www.tiktok.com/@walkacademy",              label: "TikTok" },
];

export default function Footer() {
  const { t, isRTL } = useI18n();

  return (
    <footer className="bg-[#092c46] text-white/70" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <Image
                src="/logo.png"
                alt="Walk Business"
                width={160}
                height={48}
                className="h-12 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-sm leading-relaxed mb-6">{t("footer.desc")}</p>
            <div className="flex gap-2 flex-wrap">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 bg-white/8 hover:bg-[#F58220] border border-white/10 hover:border-[#F58220] rounded-lg flex items-center justify-center text-xs hover:text-white hover:-translate-y-0.5 transition-all duration-200"
                >
                  <i className={`fab ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-5 pb-2 border-b-2 border-[#F58220] inline-block">
              {t("footer.quick_links")}
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINK_KEYS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm hover:text-[#F58220] hover:ps-1 transition-all duration-200 flex items-center gap-2"
                  >
                    {t(l.key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-5 pb-2 border-b-2 border-[#F58220] inline-block">
              {t("footer.our_services")}
            </h4>
            <ul className="space-y-2.5">
              {SERVICE_KEYS.map((key) => (
                <li key={key}>
                  <a href="#services" className="text-sm hover:text-[#F58220] hover:ps-1 transition-all duration-200">
                    {t(key)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-5 pb-2 border-b-2 border-[#F58220] inline-block">
              {t("footer.newsletter")}
            </h4>
            <p className="text-sm mb-4 leading-relaxed">{t("footer.newsletter_desc")}</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder={t("footer.email_placeholder")}
                className="flex-1 px-4 py-2.5 rounded-full bg-white/8 border border-white/15 text-sm text-white placeholder-white/40 focus:border-[#F58220] focus:outline-none focus:bg-white/12 transition-all"
              />
              <button className="px-4 py-2.5 bg-[#F58220] text-white rounded-full text-sm font-semibold hover:bg-[#d9700f] transition-colors shrink-0">
                <i className="fas fa-paper-plane" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-white/40">
          <p>&copy; {new Date().getFullYear()} Walk Business. {t("footer.rights")}.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-[#F58220] transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-[#F58220] transition-colors">{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
