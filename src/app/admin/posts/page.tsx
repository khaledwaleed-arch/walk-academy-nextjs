"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface Post {
  id: number; title: string; slug: string; status: string;
  author_name: string; category_names: string[]; tag_names: string[];
  created_at: string; published_at: string | null;
  scheduled_at: string | null; deleted_at: string | null; visibility: string;
}
interface Counts { all: number; published: number; draft: number; scheduled: number; trash: number; }
interface Category { id: number; name: string; }

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function PostsPage() {
  const router = useRouter();
  const token = useToken();
  const { t, dir } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);
  const [counts, setCounts] = useState<Counts>({ all: 0, published: 0, draft: 0, scheduled: 0, trash: 0 });
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkAction, setBulkAction] = useState("");
  const [processing, setProcessing] = useState<number | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (search) params.set("search", search);
    if (categoryFilter) params.set("category", categoryFilter);
    const res = await fetch(`/api/admin/posts?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setPosts(data.posts || []);
    setCounts(data.counts || {});
    setLoading(false);
    setSelected(new Set());
  }, [status, search, categoryFilter, token, router]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    fetch("/api/admin/categories", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setCategories);
  }, [token]);

  const trashPost = async (id: number) => {
    setProcessing(id);
    await fetch(`/api/admin/posts/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "trash" }),
    });
    await fetchPosts(); setProcessing(null);
  };

  const restorePost = async (id: number) => {
    setProcessing(id);
    await fetch(`/api/admin/posts/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ action: "restore" }),
    });
    await fetchPosts(); setProcessing(null);
  };

  const deletePost = async (id: number) => {
    if (!confirm("Delete permanently? This cannot be undone.")) return;
    setProcessing(id);
    await fetch(`/api/admin/posts/${id}?force=true`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    await fetchPosts(); setProcessing(null);
  };

  const applyBulk = async () => {
    if (!bulkAction || selected.size === 0) return;
    for (const id of Array.from(selected)) {
      if (bulkAction === "trash") {
        await fetch(`/api/admin/posts/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ action: "trash" }) });
      } else if (bulkAction === "restore") {
        await fetch(`/api/admin/posts/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ action: "restore" }) });
      } else if (bulkAction === "delete") {
        await fetch(`/api/admin/posts/${id}?force=true`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      } else if (bulkAction === "publish" || bulkAction === "draft") {
        await fetch(`/api/admin/posts/${id}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ status: bulkAction }) });
      }
    }
    setBulkAction(""); await fetchPosts();
  };

  const toggleAll = () => selected.size === posts.length ? setSelected(new Set()) : setSelected(new Set(posts.map(p => p.id)));
  const toggleOne = (id: number) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const isTrash = status === "trash";

  const TABS = [
    { key: "all", label: t("all"), count: counts.all },
    { key: "published", label: t("published"), count: counts.published },
    { key: "draft", label: t("draft"), count: counts.draft },
    ...(counts.scheduled > 0 ? [{ key: "scheduled", label: t("scheduled"), count: counts.scheduled }] : []),
    { key: "trash", label: t("trash"), count: counts.trash },
  ];

  const STATUS_LABELS: Record<string, string> = {
    published: t("statusPublished"), draft: t("statusDraft"),
    scheduled: t("statusScheduled"), trash: t("statusTrash"),
  };
  const STATUS_COLORS: Record<string, string> = {
    published: "bg-green-100 text-green-700", draft: "bg-yellow-100 text-yellow-700",
    scheduled: "bg-blue-100 text-blue-700", trash: "bg-red-100 text-red-700",
  };

  return (
    <div dir={dir}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{t("posts")}</h1>
          <div className="flex gap-1 mt-1 text-sm flex-wrap">
            {TABS.map((tab, i) => (
              <span key={tab.key} className="flex items-center gap-1">
                {i > 0 && <span className="text-gray-300 select-none">|</span>}
                <button onClick={() => setStatus(tab.key)}
                  className={`${status === tab.key ? "font-semibold text-gray-900 underline" : "text-[#2271b1] hover:underline"}`}>
                  {tab.label} <span className="text-gray-500 font-normal">({tab.count})</span>
                </button>
              </span>
            ))}
          </div>
        </div>
        <Link href="/admin/posts/new"
          className="bg-[#2271b1] hover:bg-[#135e96] text-white text-sm px-4 py-2 rounded">
          {t("addNewPost")}
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <select value={bulkAction} onChange={e => setBulkAction(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-white">
          <option value="">{t("bulkAction")}</option>
          {isTrash ? (
            <>
              <option value="restore">{t("restoreBulk")}</option>
              <option value="delete">{t("deletePermaBulk")}</option>
            </>
          ) : (
            <>
              <option value="publish">{t("publishBulk")}</option>
              <option value="draft">{t("draftBulk")}</option>
              <option value="trash">{t("trashBulk")}</option>
            </>
          )}
        </select>
        <button onClick={applyBulk}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white hover:bg-gray-50">
          {t("applyAction")}
        </button>
        {!isTrash && (
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-white">
            <option value="">{t("allCategories")}</option>
            {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
        )}
        <input type="search" placeholder={t("searchPosts")} value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-56 focus:outline-none focus:border-[#2271b1] ms-auto" />
      </div>

      <div className="bg-white border border-gray-200 rounded shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-400">{t("loading")}</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            {isTrash ? t("trashIsEmpty") : t("noPostsFound")}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input type="checkbox" checked={selected.size === posts.length && posts.length > 0}
                    onChange={toggleAll} className="rounded border-gray-300 text-[#2271b1] cursor-pointer" />
                </th>
                <th className="text-start font-medium text-gray-600 px-4 py-3">{t("titleCol")}</th>
                <th className="text-start font-medium text-gray-600 px-4 py-3 hidden md:table-cell">{t("authorCol")}</th>
                <th className="text-start font-medium text-gray-600 px-4 py-3 hidden md:table-cell">{t("categoriesCol")}</th>
                <th className="text-start font-medium text-gray-600 px-4 py-3 hidden lg:table-cell">{t("tagsCol")}</th>
                <th className="text-start font-medium text-gray-600 px-4 py-3">{t("statusCol")}</th>
                <th className="text-start font-medium text-gray-600 px-4 py-3 hidden lg:table-cell">{t("dateCol")}</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 group ${selected.has(post.id) ? "bg-yellow-50" : i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.has(post.id)} onChange={() => toggleOne(post.id)}
                      className="rounded border-gray-300 text-[#2271b1] cursor-pointer" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 group-hover:text-[#2271b1]">
                      {post.title || <span className="text-gray-400">(No title)</span>}
                      {post.visibility === "private" && <span className="ms-1 text-xs text-gray-500 font-normal">(Private)</span>}
                    </div>
                    <div className="flex gap-3 mt-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      {isTrash ? (
                        <>
                          <button onClick={() => restorePost(post.id)} disabled={processing === post.id}
                            className="text-[#2271b1] hover:underline disabled:opacity-40">{t("restoreAction")}</button>
                          <button onClick={() => deletePost(post.id)} disabled={processing === post.id}
                            className="text-red-500 hover:underline disabled:opacity-40">{t("deletePerma")}</button>
                        </>
                      ) : (
                        <>
                          <Link href={`/admin/posts/${post.id}`} className="text-[#2271b1] hover:underline">{t("editAction")}</Link>
                          <button onClick={() => trashPost(post.id)} disabled={processing === post.id}
                            className="text-gray-500 hover:underline disabled:opacity-40">{t("moveToTrash")}</button>
                          {post.status === "published" && (
                            <Link href={`/blog/${post.slug}`} target="_blank" className="text-gray-500 hover:underline">{t("viewAction")}</Link>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{post.author_name}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.category_names?.map(c => (
                        <span key={c} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{c}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.tag_names?.map(tg => (
                        <span key={tg} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded">{tg}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[post.status] || "bg-gray-100 text-gray-600"}`}>
                      {STATUS_LABELS[post.status] || post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                    {post.status === "published" && post.published_at
                      ? new Date(post.published_at).toLocaleDateString()
                      : post.status === "scheduled" && post.scheduled_at
                      ? `Scheduled: ${new Date(post.scheduled_at).toLocaleDateString()}`
                      : new Date(post.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
          {posts.length} {t("postsCount")}
        </div>
      </div>
    </div>
  );
}
