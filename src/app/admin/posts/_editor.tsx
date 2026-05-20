"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import MediaPicker from "@/components/admin/MediaPicker";

const RichEditor = dynamic(() => import("@/components/admin/RichEditor"), { ssr: false });

function slugify(str: string) {
  return str.toLowerCase()
    .replace(/[؀-ۿ\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

interface Category { id: number; name: string; }

interface PostData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: "draft" | "published";
  featured_image_url: string;
  meta_title: string;
  meta_description: string;
  category_ids: number[];
}

const EMPTY: PostData = {
  title: "", slug: "", content: "", excerpt: "",
  status: "draft", featured_image_url: "",
  meta_title: "", meta_description: "", category_ids: [],
};

export default function PostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const token = useToken();

  const [data, setData] = useState<PostData>(EMPTY);
  const [slugEdited, setSlugEdited] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [mediaPicker, setMediaPicker] = useState<"featured" | "editor" | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

  // Load categories
  useEffect(() => {
    fetch("/api/admin/categories", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setCategories);
  }, [token]);

  // Load post if editing
  useEffect(() => {
    if (!postId) return;
    fetch(`/api/admin/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(p => {
        setData({
          title: p.title || "",
          slug: p.slug || "",
          content: p.content || "",
          excerpt: p.excerpt || "",
          status: p.status || "draft",
          featured_image_url: p.featured_image_url || "",
          meta_title: p.meta_title || "",
          meta_description: p.meta_description || "",
          category_ids: p.category_ids || [],
        });
        setSlugEdited(true);
        setPublishedAt(p.published_at);
      });
  }, [postId, token]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && data.title) {
      setData(d => ({ ...d, slug: slugify(d.title) }));
    }
  }, [data.title, slugEdited]);

  const save = useCallback(async (status: "draft" | "published") => {
    setSaving(true);
    setSaveMsg("");
    const payload = { ...data, status };
    const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
    const method = postId ? "PUT" : "POST";
    const res = await fetch(url, {
      method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const saved = await res.json();
    setSaving(false);
    if (res.ok) {
      setSaveMsg(status === "published" ? "تم النشر" : "تم الحفظ كمسودة");
      setTimeout(() => setSaveMsg(""), 3000);
      if (!postId && saved.id) router.replace(`/admin/posts/${saved.id}`);
    } else {
      setSaveMsg("حدث خطأ");
    }
  }, [data, postId, token, router]);

  const handleImageInsert = () => setMediaPicker("editor");

  const onMediaSelect = (url: string, alt: string) => {
    if (mediaPicker === "featured") {
      setData(d => ({ ...d, featured_image_url: url }));
    } else {
      (window as any).__tiptapInsertImage?.(url);
    }
    setMediaPicker(null);
  };

  const toggleCategory = (id: number) => {
    setData(d => ({
      ...d,
      category_ids: d.category_ids.includes(id)
        ? d.category_ids.filter(x => x !== id)
        : [...d.category_ids, id],
    }));
  };

  return (
    <div className="flex gap-0 -m-6 min-h-screen" dir="rtl">
      {/* Main editing area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 bg-white min-h-screen">
        {/* Title */}
        <input
          type="text"
          placeholder="أدخل عنوان المقال"
          value={data.title}
          onChange={e => setData(d => ({ ...d, title: e.target.value }))}
          className="w-full text-3xl font-bold text-gray-900 border-none outline-none placeholder-gray-300 mb-2 bg-transparent"
        />

        {/* Permalink */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
          <span>الرابط الثابت:</span>
          <span className="text-gray-400">/blog/</span>
          <input
            type="text"
            value={data.slug}
            onChange={e => { setSlugEdited(true); setData(d => ({ ...d, slug: e.target.value })); }}
            className="border-b border-dashed border-gray-300 text-[#2271b1] focus:outline-none focus:border-[#2271b1] bg-transparent px-1"
            dir="ltr"
          />
        </div>

        {/* Rich Editor */}
        <RichEditor
          value={data.content}
          onChange={c => setData(d => ({ ...d, content: c }))}
          onImageInsert={handleImageInsert}
          placeholder="ابدأ الكتابة هنا..."
        />
      </div>

      {/* Right Sidebar */}
      <div className="w-72 flex-shrink-0 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        {/* Publish Box */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-100 px-4 py-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">نشر</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>الحالة:</span>
              <select value={data.status} onChange={e => setData(d => ({ ...d, status: e.target.value as any }))}
                className="border border-gray-300 rounded px-1 py-0.5 text-xs bg-white focus:outline-none">
                <option value="draft">مسودة</option>
                <option value="published">منشور</option>
              </select>
            </div>
            {publishedAt && (
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>نُشر: {new Date(publishedAt).toLocaleDateString("ar-EG")}</span>
              </div>
            )}
            {saveMsg && (
              <div className={`text-xs px-2 py-1 rounded ${saveMsg.includes("خطأ") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                {saveMsg}
              </div>
            )}
            <div className="flex gap-2 pt-1">
              <button onClick={() => save("draft")} disabled={saving}
                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs py-2 px-3 rounded disabled:opacity-50">
                حفظ مسودة
              </button>
              <button onClick={() => save("published")} disabled={saving}
                className="flex-1 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs py-2 px-3 rounded disabled:opacity-50">
                {saving ? "..." : data.status === "published" ? "تحديث" : "نشر"}
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-100 px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">الصورة المميزة</span>
          </div>
          <div className="p-4">
            {data.featured_image_url ? (
              <div className="relative">
                <img src={data.featured_image_url} alt="" className="w-full rounded border border-gray-200 object-cover" />
                <button onClick={() => setData(d => ({ ...d, featured_image_url: "" }))}
                  className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none">
                  ×
                </button>
              </div>
            ) : (
              <button onClick={() => setMediaPicker("featured")}
                className="w-full border-2 border-dashed border-gray-300 hover:border-[#2271b1] text-gray-500 hover:text-[#2271b1] rounded py-6 text-sm transition-colors text-center">
                تعيين الصورة المميزة
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-100 px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">التصنيفات</span>
          </div>
          <div className="p-4 max-h-48 overflow-y-auto space-y-2">
            {categories.length === 0 ? (
              <p className="text-xs text-gray-400">لا توجد تصنيفات</p>
            ) : categories.map(cat => (
              <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={data.category_ids.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="rounded border-gray-300 text-[#2271b1]" />
                <span className="text-sm text-gray-700">{cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Excerpt */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-100 px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">مقتطف</span>
          </div>
          <div className="p-4">
            <textarea
              value={data.excerpt}
              onChange={e => setData(d => ({ ...d, excerpt: e.target.value }))}
              placeholder="وصف مختصر يظهر في قوائم المقالات..."
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#2271b1]"
            />
          </div>
        </div>

        {/* SEO */}
        <div>
          <div className="bg-gray-100 px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">SEO</span>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">عنوان SEO</label>
              <input type="text" value={data.meta_title}
                onChange={e => setData(d => ({ ...d, meta_title: e.target.value }))}
                placeholder={data.title}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">وصف meta</label>
              <textarea value={data.meta_description}
                onChange={e => setData(d => ({ ...d, meta_description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm resize-none focus:outline-none focus:border-[#2271b1]" />
              <p className={`text-xs mt-1 ${data.meta_description.length > 160 ? "text-red-500" : "text-gray-400"}`}>
                {data.meta_description.length}/160
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      {mediaPicker && (
        <MediaPicker
          token={token}
          onSelect={onMediaSelect}
          onClose={() => setMediaPicker(null)}
        />
      )}
    </div>
  );
}
