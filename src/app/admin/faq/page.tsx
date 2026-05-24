"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface FaqItem {
  id: number; question_en: string; question_ar: string;
  answer_en: string; answer_ar: string;
  sort_order: number; is_visible: boolean;
}

const EMPTY: Omit<FaqItem, "id"> = {
  question_en: "", question_ar: "", answer_en: "", answer_ar: "", sort_order: 0, is_visible: true,
};

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function FaqAdminPage() {
  const router = useRouter();
  const token = useToken();
  const { t, dir } = useLanguage();
  const [items, setItems] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<FaqItem, "id">>(EMPTY);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/faq", { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [token, router]);

  useEffect(() => { load(); }, [load]);

  const startEdit = (item: FaqItem) => {
    setEditing(item.id);
    setIsNew(false);
    setForm({ question_en: item.question_en, question_ar: item.question_ar, answer_en: item.answer_en, answer_ar: item.answer_ar, sort_order: item.sort_order, is_visible: item.is_visible });
  };

  const startNew = () => {
    setEditing(-1);
    setIsNew(true);
    setForm({ ...EMPTY, sort_order: items.length + 1 });
  };

  const cancel = () => { setEditing(null); setIsNew(false); };

  const save = async () => {
    setSaving(true);
    const method = isNew ? "POST" : "PUT";
    const url = isNew ? "/api/admin/faq" : `/api/admin/faq/${editing}`;
    const res = await fetch(url, {
      method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    if (res.ok) { await load(); cancel(); }
    setSaving(false);
  };

  const del = async (id: number) => {
    if (!confirm("Delete this FAQ item?")) return;
    await fetch(`/api/admin/faq/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    load();
  };

  const toggleVisible = async (item: FaqItem) => {
    await fetch(`/api/admin/faq/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...item, is_visible: !item.is_visible }),
    });
    load();
  };

  return (
    <div dir={dir}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">FAQ</h1>
        <button onClick={startNew}
          className="bg-[#2271b1] hover:bg-[#135e96] text-white text-sm px-4 py-2 rounded">
          + Add FAQ Item
        </button>
      </div>

      {(editing !== null) && (
        <div className="bg-white border border-gray-200 rounded shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">{isNew ? "New FAQ Item" : "Edit FAQ Item"}</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Question (EN)</label>
              <input value={form.question_en} onChange={e => setForm(f => ({ ...f, question_en: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Question (AR)</label>
              <input value={form.question_ar} dir="rtl" onChange={e => setForm(f => ({ ...f, question_ar: e.target.value }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1]" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Answer (EN)</label>
              <textarea value={form.answer_en} onChange={e => setForm(f => ({ ...f, answer_en: e.target.value }))} rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] resize-y" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Answer (AR)</label>
              <textarea value={form.answer_ar} dir="rtl" onChange={e => setForm(f => ({ ...f, answer_ar: e.target.value }))} rows={3}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] resize-y" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1]" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_visible} onChange={e => setForm(f => ({ ...f, is_visible: e.target.checked }))}
                  className="w-4 h-4 accent-[#2271b1] cursor-pointer" />
                <span className="text-sm text-gray-700">Visible on site</span>
              </label>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={save} disabled={saving}
              className="px-4 py-2 bg-[#2271b1] text-white text-sm rounded hover:bg-[#135e96] disabled:opacity-60">
              {saving ? "Saving..." : isNew ? "Create" : "Save Changes"}
            </button>
            <button onClick={cancel} className="px-4 py-2 border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">{t("loading")}</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No FAQ items yet. Click "Add FAQ Item" to create one.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-start px-4 py-3 font-medium text-gray-600 w-8">#</th>
                <th className="text-start px-4 py-3 font-medium text-gray-600">Question</th>
                <th className="text-start px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Question (AR)</th>
                <th className="text-start px-4 py-3 font-medium text-gray-600 w-24">Visible</th>
                <th className="text-start px-4 py-3 font-medium text-gray-600 w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 ${i % 2 === 1 ? "bg-gray-50/40" : ""}`}>
                  <td className="px-4 py-3 text-gray-400 text-xs">{item.sort_order}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 text-sm">{item.question_en || <span className="text-gray-400">(no English question)</span>}</div>
                    <div className="text-gray-400 text-xs mt-0.5 line-clamp-2">{item.answer_en}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell" dir="rtl">
                    <div className="font-medium text-gray-700 text-sm">{item.question_ar || <span className="text-gray-400 text-start" dir="ltr">(no Arabic question)</span>}</div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleVisible(item)}
                      className={`text-xs px-2 py-1 rounded-full font-medium ${item.is_visible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {item.is_visible ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(item)} className="text-xs text-[#2271b1] hover:underline">Edit</button>
                      <button onClick={() => del(item.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
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
