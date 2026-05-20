"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import MediaPicker from "@/components/admin/MediaPicker";

const RichEditor = dynamic(() => import("@/components/admin/RichEditor"), { ssr: false });

interface Page {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  template: string;
  created_at: string;
  updated_at: string;
}

interface PageForm {
  title: string;
  slug: string;
  content: string;
  status: "draft" | "published";
  template: string;
}

const TEMPLATES = [
  { value: "default", label: "افتراضي" },
  { value: "full-width", label: "عرض كامل" },
  { value: "landing", label: "صفحة هبوط" },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function PagesPage() {
  const router = useRouter();
  const token = useToken();

  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<PageForm>({ title: "", slug: "", content: "", status: "draft", template: "default" });
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mediaPicker, setMediaPicker] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/pages", { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) { router.push("/admin/login"); return; }
    setPages(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!slugEdited && form.title) setForm(f => ({ ...f, slug: slugify(f.title) }));
  }, [form.title, slugEdited]);

  const startNew = () => {
    setForm({ title: "", slug: "", content: "", status: "draft", template: "default" });
    setSlugEdited(false);
    setEditId("new");
  };

  const startEdit = async (id: number) => {
    const res = await fetch(`/api/admin/pages/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    const p = await res.json();
    setForm({ title: p.title, slug: p.slug, content: p.content || "", status: p.status, template: p.template || "default" });
    setSlugEdited(true);
    setEditId(id);
  };

  const save = async (status: "draft" | "published") => {
    setSaving(true);
    const url = editId === "new" ? "/api/admin/pages" : `/api/admin/pages/${editId}`;
    const method = editId === "new" ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status }),
    });
    if (res.ok) {
      await load();
      setEditId(null);
    }
    setSaving(false);
  };

  const deletePage = async (id: number) => {
    if (!confirm("حذف هذه الصفحة؟")) return;
    await fetch(`/api/admin/pages/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setPages(prev => prev.filter(p => p.id !== id));
  };

  if (editId !== null) {
    return (
      <div className="flex gap-0 -m-6 min-h-screen" dir="rtl">
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setEditId(null)} className="text-[#2271b1] hover:underline text-sm">
              ← العودة للصفحات
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-600">{editId === "new" ? "صفحة جديدة" : "تعديل الصفحة"}</span>
          </div>

          <input
            type="text"
            placeholder="عنوان الصفحة"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full text-3xl font-bold text-gray-900 border-none outline-none placeholder-gray-300 mb-2 bg-transparent"
          />
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
            <span>الرابط:</span>
            <span className="text-gray-400">/</span>
            <input
              type="text"
              value={form.slug}
              onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }}
              className="border-b border-dashed border-gray-300 text-[#2271b1] focus:outline-none px-1"
              dir="ltr"
            />
          </div>

          <RichEditor
            value={form.content}
            onChange={c => setForm(f => ({ ...f, content: c }))}
            onImageInsert={() => setMediaPicker(true)}
            placeholder="محتوى الصفحة..."
          />
        </div>

        <div className="w-72 flex-shrink-0 bg-gray-50 border-r border-gray-200 p-5">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">القالب</label>
              <select value={form.template} onChange={e => setForm(f => ({ ...f, template: e.target.value }))}
                className="w-full border border-gray-300 rounded px-2 py-2 text-sm bg-white focus:outline-none focus:border-[#2271b1]">
                {TEMPLATES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => save("draft")} disabled={saving}
                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs py-2 rounded">
                حفظ مسودة
              </button>
              <button onClick={() => save("published")} disabled={saving}
                className="flex-1 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs py-2 rounded">
                {saving ? "..." : form.status === "published" ? "تحديث" : "نشر"}
              </button>
            </div>
          </div>
        </div>

        {mediaPicker && (
          <MediaPicker
            token={token}
            onSelect={(url) => { (window as any).__tiptapInsertImage?.(url); setMediaPicker(false); }}
            onClose={() => setMediaPicker(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">الصفحات</h1>
        <button onClick={startNew}
          className="bg-[#2271b1] hover:bg-[#135e96] text-white text-sm px-4 py-2 rounded">
          إضافة صفحة جديدة
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm" dir="rtl">
        {loading ? (
          <div className="p-8 text-center text-gray-400">جارٍ التحميل...</div>
        ) : pages.length === 0 ? (
          <div className="p-8 text-center text-gray-400">لا توجد صفحات — أنشئ أول صفحة</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right px-4 py-3 font-medium text-gray-600">العنوان</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 hidden md:table-cell">الرابط</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">القالب</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">الحالة</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">آخر تعديل</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {pages.map(page => (
                <tr key={page.id} className="border-b border-gray-100 hover:bg-gray-50 group">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{page.title || <span className="text-gray-400">(بدون عنوان)</span>}</div>
                    <div className="flex gap-3 mt-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(page.id)} className="text-[#2271b1] hover:underline">تعديل</button>
                      <button onClick={() => deletePage(page.id)} className="text-red-500 hover:underline">حذف</button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell" dir="ltr">/{page.slug}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    {TEMPLATES.find(t => t.value === page.template)?.label || page.template}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                      page.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {page.status === "published" ? "منشور" : "مسودة"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                    {new Date(page.updated_at || page.created_at).toLocaleDateString("ar-EG")}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => startEdit(page.id)}
                      className="text-xs text-[#2271b1] hover:underline">تعديل</button>
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
