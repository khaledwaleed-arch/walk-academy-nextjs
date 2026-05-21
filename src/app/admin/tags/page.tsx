"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Tag { id: number; name: string; slug: string; post_count: number; }

function slugify(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function TagsPage() {
  const token = useToken();
  const { t, dir } = useLanguage();
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [slugEdited, setSlugEdited] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: "", slug: "" });

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/tags", { headers: { Authorization: `Bearer ${token}` } });
    setTags(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!slugEdited && form.name) setForm(f => ({ ...f, slug: slugify(f.name) }));
  }, [form.name, slugEdited]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const tag = await res.json();
      setTags(prev => [...prev, tag]);
      setForm({ name: "", slug: "" });
      setSlugEdited(false);
    } else {
      alert("Tag already exists or an error occurred");
    }
    setSaving(false);
  };

  const startEdit = (tag: Tag) => {
    setEditId(tag.id);
    setEditForm({ name: tag.name, slug: tag.slug });
  };

  const saveEdit = async (id: number) => {
    const res = await fetch(`/api/admin/tags/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      const updated = await res.json();
      setTags(prev => prev.map(tg => tg.id === id ? { ...tg, ...updated } : tg));
      setEditId(null);
    }
  };

  const deleteTag = async (id: number) => {
    if (!confirm("Delete this tag? It will be removed from all posts.")) return;
    await fetch(`/api/admin/tags/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setTags(prev => prev.filter(tg => tg.id !== id));
  };

  return (
    <div dir={dir}>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{t("tagsTitle")}</h1>
      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded shadow-sm p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">{t("addNewTag")}</h2>
            <form onSubmit={create} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("nameLabel")} <span className="text-red-500">*</span></label>
                <input type="text" required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{t("slugLabel")}</label>
                <input type="text" value={form.slug}
                  onChange={e => { setSlugEdited(true); setForm(f => ({ ...f, slug: e.target.value })); }}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1]"
                  dir="ltr" />
                <p className="text-xs text-gray-400 mt-1">{t("tagSlugHint")}</p>
              </div>
              <button type="submit" disabled={saving}
                className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white text-sm py-2 rounded disabled:opacity-50">
                {saving ? t("savingMsg") : t("addTagBtn")}
              </button>
            </form>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">{t("loading")}</div>
            ) : tags.length === 0 ? (
              <div className="p-8 text-center text-gray-400">{t("noTagsMsg")}</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-start px-4 py-3 font-medium text-gray-600">{t("nameLabel")}</th>
                    <th className="text-start px-4 py-3 font-medium text-gray-600 hidden md:table-cell">{t("slugLabel")}</th>
                    <th className="text-start px-4 py-3 font-medium text-gray-600 w-20">{t("countLabel")}</th>
                    <th className="px-4 py-3 w-24"></th>
                  </tr>
                </thead>
                <tbody>
                  {tags.map(tag => (
                    <tr key={tag.id} className="border-b border-gray-100 hover:bg-gray-50">
                      {editId === tag.id ? (
                        <>
                          <td className="px-4 py-2">
                            <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#2271b1]" />
                          </td>
                          <td className="px-4 py-2 hidden md:table-cell">
                            <input value={editForm.slug} onChange={e => setEditForm(f => ({ ...f, slug: e.target.value }))}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#2271b1]" dir="ltr" />
                          </td>
                          <td className="px-4 py-2 text-center text-gray-500">{tag.post_count}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-1">
                              <button onClick={() => saveEdit(tag.id)} className="text-xs bg-[#2271b1] text-white px-2 py-1 rounded hover:bg-[#135e96]">{t("save")}</button>
                              <button onClick={() => setEditId(null)} className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded hover:bg-gray-300">{t("cancel")}</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 font-medium text-gray-900">{tag.name}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs hidden md:table-cell" dir="ltr">{tag.slug}</td>
                          <td className="px-4 py-3 text-center text-gray-500">{tag.post_count}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button onClick={() => startEdit(tag)} className="text-xs text-[#2271b1] hover:underline px-1">{t("edit")}</button>
                              <span className="text-gray-300">|</span>
                              <button onClick={() => deleteTag(tag.id)} className="text-xs text-red-500 hover:underline px-1">{t("delete")}</button>
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
