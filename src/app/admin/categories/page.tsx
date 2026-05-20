"use client";
import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  post_count: number;
}

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function CategoriesPage() {
  const token = useToken();
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", slug: "", description: "" });

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/categories", { headers: { Authorization: `Bearer ${token}` } });
    setCats(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!slugEdited && form.name) {
      setForm(f => ({ ...f, slug: slugify(f.name) }));
    }
  }, [form.name, slugEdited]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const cat = await res.json();
      setCats(prev => [...prev, cat]);
      setForm({ name: "", slug: "", description: "" });
      setSlugEdited(false);
    }
    setSaving(false);
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditForm({ name: cat.name, slug: cat.slug, description: cat.description || "" });
  };

  const saveEdit = async (id: number) => {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setCats(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
      setEditId(null);
    }
  };

  const deleteCat = async (id: number) => {
    if (!confirm("حذف هذا التصنيف؟ لن يؤثر على المقالات.")) return;
    await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setCats(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">التصنيفات</h1>

      <div className="flex gap-6 flex-col lg:flex-row" dir="rtl">
        {/* Add new */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">إضافة تصنيف جديد</h2>
            <form onSubmit={create} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">الاسم <span className="text-red-500">*</span></label>
                <input type="text" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">الرابط (Slug)</label>
                <input type="text" value={form.slug}
                  onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1]"
                  dir="ltr" />
                <p className="text-xs text-gray-400 mt-1">يُستخدم في URL التصنيف</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">الوصف</label>
                <textarea value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#2271b1]" />
              </div>
              <button type="submit" disabled={saving}
                className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white text-sm py-2 rounded disabled:opacity-50">
                {saving ? "جارٍ الحفظ..." : "إضافة تصنيف"}
              </button>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">جارٍ التحميل...</div>
            ) : cats.length === 0 ? (
              <div className="p-8 text-center text-gray-400">لا توجد تصنيفات — أضف أول تصنيف</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">الاسم</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 hidden md:table-cell">الرابط</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">الوصف</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 w-16">المقالات</th>
                    <th className="px-4 py-3 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {cats.map(cat => (
                    <tr key={cat.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {editId === cat.id ? (
                        <>
                          <td className="px-4 py-2">
                            <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#2271b1]" />
                          </td>
                          <td className="px-4 py-2 hidden md:table-cell">
                            <input value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#2271b1]" dir="ltr" />
                          </td>
                          <td className="px-4 py-2 hidden lg:table-cell">
                            <input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#2271b1]" />
                          </td>
                          <td className="px-4 py-2 text-center text-gray-500">{cat.post_count}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-1">
                              <button onClick={() => saveEdit(cat.id)}
                                className="text-xs bg-[#2271b1] text-white px-2 py-1 rounded hover:bg-[#135e96]">حفظ</button>
                              <button onClick={() => setEditId(null)}
                                className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">إلغاء</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 font-medium text-gray-900">
                            <div>{cat.name}</div>
                            <div className="flex gap-3 mt-0.5 text-xs text-gray-500 opacity-0 group-hover:opacity-100">
                              <button onClick={() => startEdit(cat)} className="text-[#2271b1] hover:underline">تعديل</button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell" dir="ltr">{cat.slug}</td>
                          <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{cat.description || "—"}</td>
                          <td className="px-4 py-3 text-center text-gray-500">{cat.post_count}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button onClick={() => startEdit(cat)}
                                className="text-xs text-[#2271b1] hover:underline px-1">تعديل</button>
                              <span className="text-gray-300">|</span>
                              <button onClick={() => deleteCat(cat.id)}
                                className="text-xs text-red-500 hover:underline px-1">حذف</button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
