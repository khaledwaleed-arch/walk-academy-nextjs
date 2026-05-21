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
    {
      label: "إجمالي التسجيلات", value: stats.total_registrations,
      href: "/admin/registrations", color: "bg-blue-500",
      icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
    },
    {
      label: "تسجيلات اليوم", value: stats.today_registrations,
      href: "/admin/registrations", color: "bg-orange-500",
      icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
    {
      label: "رسائل التواصل", value: stats.total_contacts,
      href: "/admin/contacts", color: "bg-green-500",
      icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    },
    {
      label: "رسائل اليوم", value: stats.today_contacts,
      href: "/admin/contacts", color: "bg-purple-500",
      icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
    },
    {
      label: "المشتركون", value: stats.total_subscribers,
      href: "/admin/registrations", color: "bg-cyan-500",
      icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      label: "الاستشارات", value: stats.total_consultations,
      href: "/admin/consultations", color: "bg-rose-500",
      icon: <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    },
  ] : [];

  const quickLinks = [
    {
      label: "إضافة مقال جديد", href: "/admin/posts/new", desc: "كتابة ونشر مقال في المدونة",
      icon: <svg className="w-6 h-6 text-[#2271b1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    },
    {
      label: "مكتبة الوسائط", href: "/admin/media", desc: "رفع وإدارة الصور والملفات",
      icon: <svg className="w-6 h-6 text-[#2271b1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
    {
      label: "التسجيلات", href: "/admin/registrations", desc: "متابعة طلبات التسجيل",
      icon: <svg className="w-6 h-6 text-[#2271b1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>,
    },
    {
      label: "التصنيفات", href: "/admin/categories", desc: "إدارة تصنيفات المقالات",
      icon: <svg className="w-6 h-6 text-[#2271b1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
    },
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
                <div className={`w-10 h-10 ${c.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
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
            <div className="mb-2">{l.icon}</div>
            <div className="text-sm font-medium text-gray-900 group-hover:text-[#2271b1]">{l.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{l.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
