"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import MediaPicker from "@/components/admin/MediaPicker";
import { useLanguage } from "@/contexts/LanguageContext";

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
interface Tag { id: number; name: string; slug: string; }

interface PostData {
  title: string; slug: string; content: string; excerpt: string;
  status: "draft" | "published" | "scheduled";
  featured_image_url: string; meta_title: string; meta_description: string;
  category_ids: number[]; tag_ids: number[];
  author_name: string; visibility: "public" | "private" | "password";
  password: string; scheduled_at: string;
}

const EMPTY: PostData = {
  title: "", slug: "", content: "", excerpt: "", status: "draft",
  featured_image_url: "", meta_title: "", meta_description: "",
  category_ids: [], tag_ids: [], author_name: "Walk Academy",
  visibility: "public", password: "", scheduled_at: "",
};

export default function PostEditor({ postId }: { postId?: string }) {
  const router = useRouter();
  const token = useToken();
  const { t, dir } = useLanguage();

  const [data, setData] = useState<PostData>(EMPTY);
  const [slugEdited, setSlugEdited] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [mediaPicker, setMediaPicker] = useState<"featured" | "editor" | null>(null);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<Tag[]>([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setCategories);
    fetch("/api/admin/tags", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setTags);
  }, [token]);

  useEffect(() => {
    if (!postId) return;
    fetch(`/api/admin/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(p => {
        setData({
          title: p.title || "", slug: p.slug || "", content: p.content || "",
          excerpt: p.excerpt || "", status: p.status || "draft",
          featured_image_url: p.featured_image_url || "",
          meta_title: p.meta_title || "", meta_description: p.meta_description || "",
          category_ids: p.category_ids || [], tag_ids: p.tag_ids || [],
          author_name: p.author_name || "Walk Academy",
          visibility: p.visibility || "public", password: p.password || "",
          scheduled_at: p.scheduled_at ? p.scheduled_at.slice(0, 16) : "",
        });
        setSlugEdited(true);
        setPublishedAt(p.published_at);
        if (p.status === "scheduled") setShowSchedule(true);
      });
  }, [postId, token]);

  useEffect(() => {
    if (!slugEdited && data.title) setData(d => ({ ...d, slug: slugify(d.title) }));
  }, [data.title, slugEdited]);

  useEffect(() => {
    if (!tagInput.trim()) { setTagSuggestions([]); return; }
    const q = tagInput.toLowerCase();
    setTagSuggestions(tags.filter(tg => !data.tag_ids.includes(tg.id) && tg.name.toLowerCase().includes(q)).slice(0, 5));
  }, [tagInput, tags, data.tag_ids]);

  const addTag = async (tagOrName: Tag | string) => {
    let tag: Tag;
    if (typeof tagOrName === "string") {
      const name = tagOrName.trim();
      if (!name) return;
      const sl = slugify(name) || name.toLowerCase().replace(/\s+/g, "-");
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug: sl }),
      });
      if (!res.ok) return;
      tag = await res.json();
      setTags(prev => [...prev, tag]);
    } else {
      tag = tagOrName;
    }
    setData(d => ({ ...d, tag_ids: [...d.tag_ids, tag.id] }));
    setTagInput(""); setTagSuggestions([]);
  };

  const removeTag = (id: number) => setData(d => ({ ...d, tag_ids: d.tag_ids.filter(x => x !== id) }));

  const save = useCallback(async (saveStatus: "draft" | "published" | "scheduled") => {
    setSaving(true); setSaveMsg("");
    const payload = { ...data, status: saveStatus, scheduled_at: saveStatus === "scheduled" ? data.scheduled_at : null };
    const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
    const method = postId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const saved = await res.json();
    setSaving(false);
    if (res.ok) {
      const msgs: Record<string, string> = { published: t("publishBtn"), draft: t("saveDraft"), scheduled: t("scheduleBtn") };
      setSaveMsg(`✓ ${msgs[saveStatus]}`);
      setTimeout(() => setSaveMsg(""), 3000);
      if (!postId && saved.id) router.replace(`/admin/posts/${saved.id}`);
    } else {
      setSaveMsg(t("errorMsg"));
    }
  }, [data, postId, token, router, t]);

  const onMediaSelect = (url: string) => {
    if (mediaPicker === "featured") setData(d => ({ ...d, featured_image_url: url }));
    else (window as any).__tiptapInsertImage?.(url);
    setMediaPicker(null);
  };

  const toggleCategory = (id: number) => {
    setData(d => ({ ...d, category_ids: d.category_ids.includes(id) ? d.category_ids.filter(x => x !== id) : [...d.category_ids, id] }));
  };

  const selectedTags = tags.filter(tg => data.tag_ids.includes(tg.id));

  return (
    <div className="flex gap-0 -m-6 min-h-screen" dir={dir}>
      {/* Main area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 bg-white min-h-screen">
        <input type="text" placeholder={t("enterTitle")} value={data.title}
          onChange={e => setData(d => ({ ...d, title: e.target.value }))}
          className="w-full text-3xl font-bold text-gray-900 border-none outline-none placeholder-gray-300 mb-2 bg-transparent" />
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 pb-4 border-b border-gray-100">
          <span>{t("permalink")}:</span>
          <span className="text-gray-400">/blog/</span>
          <input type="text" value={data.slug}
            onChange={e => { setSlugEdited(true); setData(d => ({ ...d, slug: e.target.value })); }}
            className="border-b border-dashed border-gray-300 text-[#2271b1] focus:outline-none focus:border-[#2271b1] bg-transparent px-1"
            dir="ltr" />
        </div>
        <RichEditor value={data.content} onChange={c => setData(d => ({ ...d, content: c }))}
          onImageInsert={() => setMediaPicker("editor")} placeholder="Start writing here..." />
      </div>

      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 bg-gray-50 border-s border-gray-200 overflow-y-auto">

        {/* Publish Box */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-100 px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">{t("publishBox")}</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t("statusLabel")}:</span>
              <select value={data.status} onChange={e => {
                const v = e.target.value as PostData["status"];
                setData(d => ({ ...d, status: v }));
                setShowSchedule(v === "scheduled");
              }} className="border border-gray-300 rounded px-1 py-0.5 text-xs bg-white focus:outline-none">
                <option value="draft">{t("draft")}</option>
                <option value="published">{t("published")}</option>
                <option value="scheduled">{t("scheduled")}</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{t("visibilityLabel")}:</span>
              <select value={data.visibility} onChange={e => setData(d => ({ ...d, visibility: e.target.value as PostData["visibility"] }))}
                className="border border-gray-300 rounded px-1 py-0.5 text-xs bg-white focus:outline-none">
                <option value="public">{t("visibilityPublic")}</option>
                <option value="private">{t("visibilityPrivate")}</option>
                <option value="password">{t("visibilityPassword")}</option>
              </select>
            </div>

            {data.visibility === "password" && (
              <input type="text" value={data.password}
                onChange={e => setData(d => ({ ...d, password: e.target.value }))}
                placeholder={t("passwordLabel")}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]" />
            )}

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{t("authorLabel")}:</span>
              <input type="text" value={data.author_name}
                onChange={e => setData(d => ({ ...d, author_name: e.target.value }))}
                className="flex-1 border border-gray-300 rounded px-1 py-0.5 text-xs bg-white focus:outline-none focus:border-[#2271b1]" />
            </div>

            {publishedAt && !showSchedule && (
              <div className="text-xs text-gray-500 flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{t("publishedOn")}: {new Date(publishedAt).toLocaleDateString()}</span>
              </div>
            )}

            {showSchedule && (
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">{t("publishDate")}</label>
                <input type="datetime-local" value={data.scheduled_at}
                  onChange={e => setData(d => ({ ...d, scheduled_at: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]" />
              </div>
            )}

            {saveMsg && (
              <div className={`text-xs px-2 py-1 rounded ${saveMsg.includes("error") || saveMsg.includes("خطأ") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                {saveMsg}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button onClick={() => save("draft")} disabled={saving}
                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs py-2 px-3 rounded disabled:opacity-50">
                {t("saveDraft")}
              </button>
              {data.status === "scheduled" ? (
                <button onClick={() => save("scheduled")} disabled={saving}
                  className="flex-1 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs py-2 px-3 rounded disabled:opacity-50">
                  {saving ? "…" : t("scheduleBtn")}
                </button>
              ) : (
                <button onClick={() => save("published")} disabled={saving}
                  className="flex-1 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs py-2 px-3 rounded disabled:opacity-50">
                  {saving ? "…" : data.status === "published" ? t("updateBtn") : t("publishBtn")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-100 px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">{t("featuredImage")}</span>
          </div>
          <div className="p-4">
            {data.featured_image_url ? (
              <div className="relative">
                <img src={data.featured_image_url} alt="" className="w-full rounded border border-gray-200 object-cover" />
                <button onClick={() => setData(d => ({ ...d, featured_image_url: "" }))}
                  className="absolute top-1 end-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
                <button onClick={() => setMediaPicker("featured")}
                  className="mt-2 w-full text-xs text-[#2271b1] hover:underline text-center block">
                  {t("changeFeaturedImage")}
                </button>
              </div>
            ) : (
              <button onClick={() => setMediaPicker("featured")}
                className="w-full border-2 border-dashed border-gray-300 hover:border-[#2271b1] text-gray-500 hover:text-[#2271b1] rounded py-6 text-sm transition-colors text-center">
                {t("setFeaturedImage")}
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-100 px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">{t("categories")}</span>
          </div>
          <div className="p-4 max-h-48 overflow-y-auto space-y-2">
            {categories.length === 0 ? (
              <p className="text-xs text-gray-400">{t("noCategories")}</p>
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

        {/* Tags */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-100 px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">{t("tagsSection")}</span>
          </div>
          <div className="p-4">
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedTags.map(tg => (
                  <span key={tg.id} className="flex items-center gap-1 bg-[#2271b1] text-white text-xs px-2 py-0.5 rounded-full">
                    {tg.name}
                    <button onClick={() => removeTag(tg.id)} className="hover:opacity-70 leading-none">×</button>
                  </span>
                ))}
              </div>
            )}
            <div className="relative">
              <input ref={tagInputRef} type="text" value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); if (tagInput.trim()) addTag(tagInput.trim()); } }}
                placeholder={t("addTagsPlaceholder")}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]" />
              {tagSuggestions.length > 0 && (
                <div className="absolute top-full start-0 end-0 bg-white border border-gray-200 rounded shadow-lg z-10 mt-0.5">
                  {tagSuggestions.map(tg => (
                    <button key={tg.id} onClick={() => addTag(tg)}
                      className="w-full text-start px-3 py-1.5 text-sm hover:bg-gray-50 text-gray-700 block">
                      {tg.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">{t("separateTags")}</p>
          </div>
        </div>

        {/* Excerpt */}
        <div className="border-b border-gray-200">
          <div className="bg-gray-100 px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">{t("excerptSection")}</span>
          </div>
          <div className="p-4">
            <textarea value={data.excerpt} onChange={e => setData(d => ({ ...d, excerpt: e.target.value }))}
              placeholder={t("excerptPlaceholder")} rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#2271b1]" />
          </div>
        </div>

        {/* SEO */}
        <div>
          <div className="bg-gray-100 px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">{t("seoSection")}</span>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">{t("seoTitleLabel")}</label>
              <input type="text" value={data.meta_title}
                onChange={e => setData(d => ({ ...d, meta_title: e.target.value }))}
                placeholder={data.title}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">{t("metaDescLabel")}</label>
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

      {mediaPicker && (
        <MediaPicker token={token} onSelect={onMediaSelect} onClose={() => setMediaPicker(null)} />
      )}
    </div>
  );
}
