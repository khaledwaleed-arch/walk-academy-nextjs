"use client";
import { AnimatedSection } from "./AnimatedSection";

const socials = [
  { icon: "fa-facebook-f",  href: "https://www.facebook.com/share/1FWUU3yLs7/",                                label: "Facebook",  hoverColor: "hover:bg-[#1877f2]" },
  { icon: "fa-instagram",   href: "https://www.instagram.com/walk.academy",                                    label: "Instagram", hoverColor: "hover:bg-gradient-to-br hover:from-[#f09433] hover:to-[#e6683c]" },
  { icon: "fa-linkedin-in", href: "https://www.linkedin.com/company/walk-academy/",                            label: "LinkedIn",  hoverColor: "hover:bg-[#0077b5]" },
  { icon: "fa-youtube",     href: "https://www.youtube.com/@Walk-Academy",                                     label: "YouTube",   hoverColor: "hover:bg-[#FF0000]" },
  { icon: "fa-tiktok",      href: "https://www.tiktok.com/@walkacademy",                                       label: "TikTok",    hoverColor: "hover:bg-[#010101]" },
  { icon: "fa-whatsapp",    href: "https://wa.me/201143706993",                                                label: "WhatsApp",  hoverColor: "hover:bg-[#25D366]" },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F58220]/10 border border-[#F58220]/30 text-[#F58220] text-sm font-semibold mb-4">
            <i className="fas fa-envelope" /> Contact
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#0D3B5C] mt-2 mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-500">We&apos;d love to hear from you</p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Info */}
          <AnimatedSection direction="left" className="lg:col-span-2 space-y-6">
            {[
              { icon: "fa-map-marker-alt", title: "Address",       value: "152 st King Faisal, Giza, Egypt" },
              { icon: "fa-phone",          title: "Phone",         value: "+20 114 370 6993", href: "tel:+201143706993" },
              { icon: "fa-envelope",       title: "Email",         value: "info@walk-business.com", href: "mailto:info@walk-business.com" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm">
                <div className="w-12 h-12 bg-[#0D3B5C]/8 rounded-xl flex items-center justify-center shrink-0">
                  <i className={`fas ${item.icon} text-[#0D3B5C]`} />
                </div>
                <div>
                  <div className="text-[#0D3B5C] font-semibold text-sm">{item.title}</div>
                  {item.href ? (
                    <a href={item.href} className="text-gray-600 text-sm hover:text-[#F58220] transition-colors">
                      {item.value}
                    </a>
                  ) : (
                    <div className="text-gray-600 text-sm">{item.value}</div>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="text-[#0D3B5C] font-semibold mb-3">Follow Us</div>
              <div className="flex flex-wrap gap-2">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className={`w-10 h-10 bg-[#0D3B5C]/8 text-[#0D3B5C] rounded-xl flex items-center justify-center text-sm ${s.hoverColor} hover:text-white hover:-translate-y-1 transition-all duration-200`}
                  >
                    <i className={`fab ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection direction="right" delay={0.15} className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <form className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Full Name</label>
                    <input type="text" name="name" placeholder="Full Name" required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Email Address</label>
                    <input type="email" name="email" placeholder="Email Address" required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Phone Number</label>
                    <input type="tel" name="phone" placeholder="Phone Number"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Subject</label>
                    <input type="text" name="subject" placeholder="Subject" required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0D3B5C] mb-2">Your Message</label>
                  <textarea name="message" placeholder="Your Message" rows={5} required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all resize-none" />
                </div>
                <button type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#F58220] text-white font-bold rounded-xl hover:bg-[#d9700f] hover:shadow-lg hover:shadow-orange-400/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <i className="fas fa-paper-plane" /> Send Message
                </button>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
