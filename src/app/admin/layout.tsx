"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV = [
  {
    label: "لوحة التحكم",
    href: "/admin",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    label: "التسجيلات",
    href: "/admin/registrations",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "رسائل التواصل",
    href: "/admin/contacts",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "الاستشارات",
    href: "/admin/consultations",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  { type: "separator" as const },
  {
    label: "المقالات",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    children: [
      { label: "كل المقالات", href: "/admin/posts" },
      { label: "إضافة مقال جديد", href: "/admin/posts/new" },
      { label: "التصنيفات", href: "/admin/categories" },
      { label: "الوسوم", href: "/admin/tags" },
    ],
  },
  {
    label: "الوسائط",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    children: [
      { label: "مكتبة الوسائط", href: "/admin/media" },
    ],
  },
  {
    label: "الصفحات",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    children: [
      { label: "كل الصفحات", href: "/admin/pages" },
    ],
  },
];

function SidebarContent({
  pathname, open, collapsed, toggle, isActive, logout,
}: {
  pathname: string;
  open: string[];
  collapsed: boolean;
  toggle: (l: string) => void;
  isActive: (h: string) => boolean;
  logout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 py-2 overflow-y-auto">
        {NAV.map((item, i) => {
          if ("type" in item && item.type === "separator") {
            return <div key={i} className="my-2 border-t border-[#3c434a]" />;
          }
          if ("children" in item && item.children) {
            const isOpen = open.includes(item.label);
            const childActive = item.children.some((c) => isActive(c.href));
            return (
              <div key={item.label}>
                <button onClick={() => toggle(item.label)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors
                    ${childActive ? "text-white bg-[#2c3338]" : "text-[#a7aaad] hover:text-white hover:bg-[#2c3338]"}`}>
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-right">{item.label}</span>
                      <svg className={`w-3 h-3 transition-transform ${isOpen ? "rotate-90" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </button>
                {isOpen && !collapsed && (
                  <div className="bg-[#2c3338]">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href}
                        className={`block px-8 py-1.5 text-xs ${isActive(child.href) ? "text-white" : "text-[#a7aaad] hover:text-white"}`}>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          if ("href" in item) {
            return (
              <Link key={item.href} href={item.href!}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors
                  ${isActive(item.href!) ? "text-white bg-[#2271b1]" : "text-[#a7aaad] hover:text-white hover:bg-[#2c3338]"}`}>
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          }
        })}
      </nav>
      <div className="border-t border-[#3c434a] p-2">
        <button onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#a7aaad] hover:text-white hover:bg-[#2c3338] rounded transition-colors">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [open, setOpen] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const t = sessionStorage.getItem("admin_token");
    if (!t && !isLoginPage) {
      router.replace("/admin/login");
    } else {
      setToken(t);
    }
    setChecking(false);
    NAV.forEach((item) => {
      if ("children" in item && item.children?.some((c) => pathname.startsWith(c.href))) {
        setOpen((o) => [...o, item.label]);
      }
    });
  }, [pathname]);

  // Close mobile drawer on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (isLoginPage) return <>{children}</>;

  if (checking) {
    return (
      <div className="min-h-screen bg-[#1d2327] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) return null;

  function toggle(label: string) {
    setOpen((o) => o.includes(label) ? o.filter((x) => x !== label) : [...o, label]);
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href.split("?")[0]);
  }

  function logout() {
    sessionStorage.removeItem("admin_token");
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1] flex" dir="rtl">

      {/* ── Desktop sidebar ── */}
      <aside className={`hidden md:flex ${collapsed ? "w-14" : "w-56"} min-h-screen bg-[#1d2327] flex-shrink-0 transition-all duration-200 flex-col`}>
        <div className="h-14 flex items-center px-3 border-b border-[#3c434a]">
          {!collapsed && <span className="text-white font-bold text-sm flex-1">Walk Academy</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="text-[#a7aaad] hover:text-white p-1 rounded">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <SidebarContent pathname={pathname} open={open} collapsed={collapsed} toggle={toggle} isActive={isActive} logout={logout} />
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="md:hidden fixed top-0 right-0 left-0 z-30 bg-[#1d2327] h-12 flex items-center px-3 gap-3 border-b border-[#3c434a]">
        <button onClick={() => setMobileOpen(true)} className="text-[#a7aaad] hover:text-white p-1">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="text-white font-bold text-sm flex-1 text-right">Walk Academy</span>
        <button onClick={logout} className="text-[#a7aaad] hover:text-white p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex" dir="rtl">
          <div className="w-64 bg-[#1d2327] flex flex-col h-full shadow-2xl">
            <div className="h-12 flex items-center px-3 border-b border-[#3c434a]">
              <span className="text-white font-bold text-sm flex-1">Walk Academy</span>
              <button onClick={() => setMobileOpen(false)} className="text-[#a7aaad] hover:text-white p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent pathname={pathname} open={open} collapsed={false} toggle={toggle} isActive={isActive} logout={logout} />
          </div>
          {/* backdrop */}
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-auto md:p-6 p-4 mt-12 md:mt-0">
        {children}
      </main>
    </div>
  );
}
