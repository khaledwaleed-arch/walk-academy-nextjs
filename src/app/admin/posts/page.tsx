"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "published";
  author_name: string;
  category_names: string[];
  created_at: string;
  published_at: string | null;
  excerpt: string;
}

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<number | null>(null);

  const token = useToken();

  const fetchPosts = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/posts?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, [status, search]);

  const deletePost = async (id: number) => {
    if (!confirm("حذف هذا المقال؟")) return;
    setDeleting(id);
    await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(p => p.filter(x => x.id !== id));
    setDeleting(null);
  };

  const counts = { all: posts.length };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">المقالات</h1>
          <div className="flex gap-3 mt-1 text-sm">
            {(["all", "published", "draft"] as const).map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`${status === s ? "font-semibold text-[#2271b1]" : "text-[#2271b1] hover:underline"}`}>
                {s === "all" ? "الكل" : s === "published" ? "منشور" : "مسودة"}
              </button>
            ))}
          </div>
        </div>
        <Link href="/admin/posts/new"
          className="bg-[#2271b1] hover:bg-[#135e96] text-white text-sm px-4 py-2 rounded">
          إضافة مقال جديد
        </Link>
      </div>

      {/* Search */}
      <div className="flex gap-2 mb-4">
        <input
          type="search"
          placeholder="بحث في المقالات..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-[#2271b1]"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-gray-400">جارٍ التحميل...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-gray-400">لا توجد مقالات</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right font-medium text-gray-600 px-4 py-3">العنوان</th>
                <th className="text-right font-medium text-gray-600 px-4 py-3 hidden md:table-cell">الكاتب</th>
                <th className="text-right font-medium text-gray-600 px-4 py-3 hidden md:table-cell">التصنيفات</th>
                <th className="text-right font-medium text-gray-600 px-4 py-3">الحالة</th>
                <th className="text-right font-medium text-gray-600 px-4 py-3 hidden lg:table-cell">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.id} className={`border-b border-gray-100 hover:bg-gray-50 group ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900 group-hover:text-[#2271b1]">
                      {post.title || <span className="text-gray-400">(بدون عنوان)</span>}
                    </div>
                    <div className="flex gap-3 mt-1 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/posts/${post.id}`} className="text-[#2271b1] hover:underline">تعديل</Link>
                      <button onClick={() => deletePost(post.id)} disabled={deleting === post.id}
                        className="text-red-500 hover:underline disabled:opacity-40">حذف</button>
                      {post.status === "published" && (
                        <Link href={`/blog/${post.slug}`} target="_blank" className="hover:underline">عرض</Link>
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
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                      post.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {post.status === "published" ? "منشور" : "مسودة"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                    {post.status === "published" && post.published_at
                      ? new Date(post.published_at).toLocaleDateString("ar-EG")
                      : new Date(post.created_at).toLocaleDateString("ar-EG")}
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
