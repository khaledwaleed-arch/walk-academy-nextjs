"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface Course {
  id: number; slug: string; status: string;
  title_en: string; title_ar: string;
  price: string; duration_en: string; sort_order: number;
  created_at: string; updated_at: string;
}

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function CoursesPage() {
  const router = useRouter();
  const token = useToken();
  const { t, dir, isRTL } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [counts, setCounts] = useState<{ all: string; published: string; draft: string }>({ all: "0", published: "0", draft: "0" });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/courses?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setCourses(data.courses || []);
    setCounts(data.counts || {});
    setLoading(false);
  }, [status, search, token, router]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const deleteCourse = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    await fetch(`/api/admin/courses/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    await fetchCourses();
    setDeleting(null);
  };

  const TABS = [
    { key: "all", label: isRTL ? "الكل" : "All", count: counts.all },
    { key: "published", label: isRTL ? "منشور" : "Published", count: counts.published },
    { key: "draft", label: isRTL ? "مسودة" : "Draft", count: counts.draft },
  ];

  const statusBadge = (s: string) =>
    s === "published"
      ? <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">{isRTL ? "منشور" : "Published"}</span>
      : <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">{isRTL ? "مسودة" : "Draft"}</span>;

  return (
    <div dir={dir}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1d2327]">{isRTL ? "الكورسات" : "Courses"}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{isRTL ? "إدارة كورسات الأكاديمية" : "Manage academy courses"}</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2271b1] text-white text-sm font-medium rounded hover:bg-[#135e96] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isRTL ? "إضافة كورس جديد" : "Add New Course"}
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-4 mb-4 border-b border-gray-200">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatus(tab.key)}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${status === tab.key ? "border-[#2271b1] text-[#2271b1]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            {tab.label} <span className="text-gray-400 font-normal">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder={isRTL ? "بحث..." : "Search courses..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-[#2271b1]"
        />
        <button
          onClick={fetchCourses}
          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 border border-gray-300"
        >
          {isRTL ? "بحث" : "Search"}
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-sm">
            {isRTL ? "لا توجد كورسات" : "No courses found"}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide ${isRTL ? "text-right" : "text-left"}`}>{isRTL ? "العنوان" : "Title"}</th>
                <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide ${isRTL ? "text-right" : "text-left"}`}>{isRTL ? "السعر" : "Price"}</th>
                <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide ${isRTL ? "text-right" : "text-left"}`}>{isRTL ? "المدة" : "Duration"}</th>
                <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide ${isRTL ? "text-right" : "text-left"}`}>{isRTL ? "الحالة" : "Status"}</th>
                <th className={`px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide ${isRTL ? "text-right" : "text-left"}`}>{isRTL ? "الترتيب" : "Order"}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50 group">
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#1d2327]">{isRTL ? course.title_ar : course.title_en}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{course.slug}</div>
                    <div className="hidden group-hover:flex items-center gap-3 mt-1">
                      <Link href={`/admin/courses/${course.id}`} className="text-xs text-[#2271b1] hover:underline">
                        {isRTL ? "تعديل" : "Edit"}
                      </Link>
                      <button onClick={() => deleteCourse(course.id, isRTL ? course.title_ar : course.title_en)} className="text-xs text-red-500 hover:underline" disabled={deleting === course.id}>
                        {deleting === course.id ? "..." : isRTL ? "حذف" : "Delete"}
                      </button>
                      <a href={`/courses/${course.slug}`} target="_blank" rel="noreferrer" className="text-xs text-gray-400 hover:text-gray-600 hover:underline">
                        {isRTL ? "عرض" : "View"} ↗
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{course.price || "—"}</td>
                  <td className="px-4 py-3 text-gray-600">{course.duration_en || "—"}</td>
                  <td className="px-4 py-3">{statusBadge(course.status)}</td>
                  <td className="px-4 py-3 text-gray-400">{course.sort_order}</td>
                  <td className="px-4 py-3 text-end">
                    <Link href={`/admin/courses/${course.id}`} className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-600">
                      {isRTL ? "تعديل" : "Edit"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
