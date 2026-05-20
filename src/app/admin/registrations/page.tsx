"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Registration {
  id: number; full_name: string; email: string; phone: string;
  course: string; country: string; status: string; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  enrolled: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function RegistrationsPage() {
  const router = useRouter();
  const token = useToken();
  const [rows, setRows] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/registrations", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) { router.push("/admin/login"); return; }
    setRows(await res.json());
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/admin/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    });
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const exportFile = async (format: string) => {
    const res = await fetch(`/api/admin/export?format=${format}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `registrations.${format}`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.course.toLowerCase().includes(q) || (r.phone || "").includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">التسجيلات</h1>
        <div className="flex gap-2">
          <button onClick={() => exportFile("xlsx")}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700">
            ⬇ Excel
          </button>
          <button onClick={() => exportFile("pdf")}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700">
            ⬇ PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="بحث بالاسم أو الإيميل أو الكورس..."
          className="border border-gray-300 rounded px-3 py-2 text-sm w-72 focus:outline-none focus:border-[#2271b1]" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2271b1]">
          <option value="all">كل الحالات</option>
          <option value="new">جديد</option>
          <option value="contacted">تم التواصل</option>
          <option value="enrolled">مسجّل</option>
          <option value="cancelled">ملغي</option>
        </select>
        <button onClick={load} className="text-sm text-gray-500 hover:text-[#2271b1] px-2">تحديث</button>
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
                  <th className="text-right px-4 py-3 font-medium text-gray-600 hidden md:table-cell">الهاتف</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الكورس</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">الدولة</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الحالة</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-400">لا توجد تسجيلات</td></tr>
                ) : filtered.map((r, i) => (
                  <tr key={r.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{r.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{r.full_name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.email}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{r.phone || "—"}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{r.course}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{r.country || "—"}</td>
                    <td className="px-4 py-3">
                      <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-600"}`}>
                        <option value="new">جديد</option>
                        <option value="contacted">تم التواصل</option>
                        <option value="enrolled">مسجّل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString("ar-EG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
          يُعرض {filtered.length} من {rows.length} تسجيل
        </div>
      </div>
    </div>
  );
}
