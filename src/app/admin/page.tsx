"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Stats {
  total_registrations: number;
  total_contacts: number;
  total_subscribers: number;
  total_consultations: number;
  today_registrations: number;
  today_contacts: number;
}

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function AdminDashboard() {
  const token = useToken();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setStats(await res.json());
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const cards = stats ? [
    { label: "إجمالي التسجيلات", value: stats.total_registrations, href: "/admin/registrations", color: "bg-blue-500",   icon: "🎓" },
    { label: "تسجيلات اليوم",    value: stats.today_registrations,  href: "/admin/registrations", color: "bg-orange-500", icon: "📅" },
    { label: "رسائل التواصل",    value: stats.total_contacts,        href: "/admin/contacts",      color: "bg-green-500",  icon: "✉️" },
    { label: "رسائل اليوم",      value: stats.today_contacts,        href: "/admin/contacts",      color: "bg-purple-500", icon: "🔔" },
    { label: "المشتركون",        value: stats.total_subscribers,     href: "/admin/registrations", color: "bg-cyan-500",   icon: "📨" },
    { label: "الاستشارات",       value: stats.total_consultations,   href: "/admin/consultations", color: "bg-rose-500",   icon: "🗓️" },
  ] : [];

  const quickLinks = [
    { label: "إضافة مقال جديد",   href: "/admin/posts/new",    icon: "✏️", desc: "كتابة ونشر مقال في المدونة" },
    { label: "مكتبة الوسائط",    href: "/admin/media",         icon: "🖼️", desc: "رفع وإدارة الصور والملفات" },
    { label: "التسجيلات",         href: "/admin/registrations", icon: "🎓", desc: "متابعة طلبات التسجيل" },
    { label: "التصنيفات",         href: "/admin/categories",    icon: "🏷️", desc: "إدارة تصنيفات المقالات" },
  ];

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">لوحة التحكم</h1>
          <p className="text-sm text-gray-500 mt-0.5">مرحباً بك في لوحة إدارة Walk Academy</p>
        </div>
        <button onClick={load} className="text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {cards.map(c => (
            <Link key={c.label} href={c.href}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-[#2271b1] transition-colors">
                    {c.value}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{c.label}</div>
                </div>
                <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center text-lg flex-shrink-0`}>
                  {c.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick links */}
      <h2 className="text-base font-semibold text-gray-700 mb-3">وصول سريع</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickLinks.map(l => (
          <Link key={l.href} href={l.href}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:border-[#2271b1] hover:shadow-sm transition-all group">
            <div className="text-2xl mb-2">{l.icon}</div>
            <div className="text-sm font-medium text-gray-900 group-hover:text-[#2271b1]">{l.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{l.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
