"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Consultation {
  id: number; name: string; email: string; phone: string;
  company: string; service: string; preferred_date: string;
  preferred_time: string; message: string; status: string; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function ConsultationsPage() {
  const router = useRouter();
  const token = useToken();
  const [rows, setRows] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/consultations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) { router.push("/admin/login"); return; }
    setRows(await res.json());
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/admin/consultations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    });
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.service.toLowerCase().includes(q) || (r.company || "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">الاستشارات</h1>
        <button onClick={load} className="text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو الخدمة أو الشركة..."
          className="border border-gray-300 rounded px-3 py-2 text-sm w-72 focus:outline-none focus:border-[#2271b1]" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2271b1]">
          <option value="all">كل الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="contacted">تم التواصل</option>
          <option value="confirmed">مؤكد</option>
          <option value="cancelled">ملغي</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">جارٍ التحميل...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">#</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الاسم</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الإيميل</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 hidden md:table-cell">الشركة</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الخدمة</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">الموعد</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">الرسالة</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400">لا توجد استشارات</td></tr>
                ) : filtered.map((r, i) => (
                  <tr key={r.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{r.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.email}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{r.company || "—"}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{r.service}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell whitespace-nowrap">
                      {r.preferred_date || "—"} {r.preferred_time && `/ ${r.preferred_time}`}
                    </td>
                    <td className="px-4 py-3 max-w-[180px] hidden lg:table-cell">
                      {r.message && (
                        <button onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                          className="text-gray-500 hover:text-[#2271b1] text-xs text-right">
                          {expanded === r.id ? r.message : (r.message.substring(0, 50) + (r.message.length > 50 ? "..." : ""))}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-600"}`}>
                        <option value="pending">قيد الانتظار</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="confirmed">مؤكد</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
          يُعرض {filtered.length} من {rows.length} استشارة
        </div>
      </div>
    </div>
  );
}
