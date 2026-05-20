"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface MediaItem {
  id: number;
  url: string;
  original_name: string;
  alt_text: string | null;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

export default function MediaPage() {
  const router = useRouter();
  const token = useToken();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [altText, setAltText] = useState("");
  const [altSaving, setAltSaving] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/media", { headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 401) { router.push("/admin/login"); return; }
    setItems(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (res.ok) {
        const item = await res.json();
        setItems(prev => [item, ...prev]);
      }
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleUpload(e.dataTransfer.files);
  };

  const selectItem = (item: MediaItem) => {
    setSelected(item);
    setAltText(item.alt_text || "");
  };

  const saveAlt = async () => {
    if (!selected) return;
    setAltSaving(true);
    await fetch(`/api/admin/media/${selected.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ alt_text: altText }),
    });
    setItems(prev => prev.map(i => i.id === selected.id ? { ...i, alt_text: altText } : i));
    setSelected(prev => prev ? { ...prev, alt_text: altText } : null);
    setAltSaving(false);
  };

  const deleteItem = async (id: number) => {
    if (!confirm("حذف هذه الوسيلة نهائياً؟")) return;
    await fetch(`/api/admin/media/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(prev => prev.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
  };

  return (
    <div className="flex gap-0 -m-6 min-h-screen" dir="rtl">
      {/* Main area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">مكتبة الوسائط</h1>
          <div className="flex items-center gap-3">
            {/* View toggle */}
            <div className="flex border border-gray-300 rounded overflow-hidden">
              <button onClick={() => setView("grid")}
                className={`p-2 ${view === "grid" ? "bg-[#2271b1] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button onClick={() => setView("list")}
                className={`p-2 ${view === "list" ? "bg-[#2271b1] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <button onClick={() => fileRef.current?.click()}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white text-sm px-4 py-2 rounded">
              رفع ملف
            </button>
            <input ref={fileRef} type="file" multiple accept="image/*,application/pdf"
              className="hidden" onChange={e => handleUpload(e.target.files)} />
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className={`relative border-2 border-dashed rounded-lg mb-6 transition-colors
            ${uploading ? "border-[#2271b1] bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
        >
          {uploading ? (
            <div className="p-6 flex items-center justify-center gap-3 text-[#2271b1]">
              <div className="w-5 h-5 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">جارٍ الرفع...</span>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-gray-400">
              اسحب ملفات هنا للرفع
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">جارٍ التحميل...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p>لا توجد وسائط مرفوعة</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {items.map(item => (
              <button key={item.id} onClick={() => selectItem(item)}
                className={`relative aspect-square rounded overflow-hidden border-2 transition-all group ${
                  selected?.id === item.id ? "border-[#2271b1] ring-2 ring-[#2271b1]/30" : "border-transparent hover:border-gray-300"
                }`}>
                {item.mime_type.startsWith("image/") ? (
                  <img src={item.url} alt={item.alt_text || item.original_name}
                    className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-1 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-xs px-1 truncate w-full text-center">{item.original_name.split(".").pop()?.toUpperCase()}</span>
                  </div>
                )}
                {selected?.id === item.id && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-[#2271b1] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 w-16"></th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الاسم</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 hidden md:table-cell">النوع</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 hidden md:table-cell">الحجم</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">التاريخ</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} onClick={() => selectItem(item)}
                    className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selected?.id === item.id ? "bg-blue-50" : ""}`}>
                    <td className="px-4 py-2 w-16">
                      {item.mime_type.startsWith("image/") ? (
                        <img src={item.url} alt="" className="w-10 h-10 object-cover rounded" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                          {item.mime_type.split("/")[1]?.toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-800">{item.original_name}</td>
                    <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{item.mime_type}</td>
                    <td className="px-4 py-2 text-gray-500 hidden md:table-cell">{fmtSize(item.size_bytes)}</td>
                    <td className="px-4 py-2 text-gray-500 text-xs hidden lg:table-cell">
                      {new Date(item.created_at).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="px-4 py-2">
                      <button onClick={e => { e.stopPropagation(); deleteItem(item.id); }}
                        className="text-red-400 hover:text-red-600 p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details sidebar */}
      {selected && (
        <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-gray-50 p-5 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 text-sm">تفاصيل الملف</h3>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">×</button>
          </div>

          {selected.mime_type.startsWith("image/") && (
            <div className="mb-4 bg-white border border-gray-200 rounded overflow-hidden">
              <img src={selected.url} alt={selected.alt_text || ""} className="w-full object-contain max-h-48" />
            </div>
          )}

          <div className="space-y-2 text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
            <p className="font-medium text-gray-800 break-all">{selected.original_name}</p>
            <p>{fmtSize(selected.size_bytes)}</p>
            <p>{selected.mime_type}</p>
            <p>{new Date(selected.created_at).toLocaleDateString("ar-EG")}</p>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 block mb-1">رابط الملف</label>
            <div className="flex gap-1">
              <input readOnly value={selected.url}
                className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-xs bg-white text-gray-600" dir="ltr" />
              <button onClick={() => copyUrl(selected.url)}
                className="border border-gray-300 rounded px-2 py-1.5 text-xs bg-white hover:bg-gray-50 text-gray-600">
                نسخ
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-gray-600 block mb-1">نص بديل (Alt)</label>
            <input type="text" value={altText} onChange={e => setAltText(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]" />
          </div>

          <div className="flex gap-2">
            <button onClick={saveAlt} disabled={altSaving}
              className="flex-1 bg-[#2271b1] hover:bg-[#135e96] text-white text-xs py-2 rounded disabled:opacity-50">
              {altSaving ? "..." : "حفظ"}
            </button>
            <button onClick={() => deleteItem(selected.id)}
              className="bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-3 rounded">
              حذف
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
