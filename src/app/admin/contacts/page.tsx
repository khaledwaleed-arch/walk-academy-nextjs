"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface Contact {
  id: number; name: string; email: string; phone: string;
  subject: string; message: string; status: string; created_at: string;
}

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function ContactsPage() {
  const router = useRouter();
  const token = useToken();
  const { t, dir } = useLanguage();
  const [rows, setRows] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<number | null>(null);

  const STATUS_COLORS: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/contacts", { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) { router.push("/admin/login"); return; }
    setRows(await res.json());
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: number, status: string) => {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, status }),
    });
    setRows(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const filtered = rows.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || (r.subject || "").toLowerCase().includes(q);
    return matchSearch && (statusFilter === "all" || r.status === statusFilter);
  });

  return (
    <div dir={dir}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">{t("contactsTitle")}</h1>
        <button onClick={load} className="text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-100">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={t("searchContacts")}
          className="border border-gray-300 rounded px-3 py-2 text-sm w-72 focus:outline-none focus:border-[#2271b1]" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#2271b1]">
          <option value="all">{t("allStatuses")}</option>
          <option value="new">{t("statusNew")}</option>
          <option value="contacted">{t("statusContacted")}</option>
          <option value="cancelled">{t("statusClosed")}</option>
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">{t("loading")}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-start px-4 py-3 font-medium text-gray-600">#</th>
                  <th className="text-start px-4 py-3 font-medium text-gray-600">{t("nameLabel")}</th>
                  <th className="text-start px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-start px-4 py-3 font-medium text-gray-600 hidden md:table-cell">{t("subjectCol")}</th>
                  <th className="text-start px-4 py-3 font-medium text-gray-600">{t("messageCol")}</th>
                  <th className="text-start px-4 py-3 font-medium text-gray-600">{t("statusCol")}</th>
                  <th className="text-start px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">{t("dateCol")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">{t("noContacts")}</td></tr>
                ) : filtered.map((r, i) => (
                  <tr key={r.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{r.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{r.email}</td>
                    <td className="px-4 py-3 text-gray-700 hidden md:table-cell">{r.subject || "—"}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <button onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                        className="text-gray-500 hover:text-[#2271b1] text-xs text-start">
                        {expanded === r.id ? r.message : (r.message?.substring(0, 60) + (r.message?.length > 60 ? "..." : ""))}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-600"}`}>
                        <option value="new">{t("statusNew")}</option>
                        <option value="contacted">{t("statusContacted")}</option>
                        <option value="cancelled">{t("statusClosed")}</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
          {t("showing")} {filtered.length} {t("ofWord")} {rows.length} {t("msgWord")}
        </div>
      </div>
    </div>
  );
}
