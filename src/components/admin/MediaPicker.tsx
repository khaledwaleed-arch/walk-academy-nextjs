"use client";
import { useState, useEffect, useCallback } from "react";

interface MediaItem {
  id: number;
  url: string;
  original_name: string;
  alt_text: string | null;
  mime_type: string;
  size_bytes: number;
  created_at: string;
}

interface Props {
  token: string;
  onSelect: (url: string, alt: string) => void;
  onClose: () => void;
}

function fmtSize(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaPicker({ token, onSelect, onClose }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState<"library" | "upload">("library");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/media", { headers: { Authorization: `Bearer ${token}` } });
    setItems(await res.json());
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      await fetch("/api/admin/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    }
    await load();
    setTab("library");
    setUploading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-2xl w-[900px] max-h-[80vh] flex flex-col" style={{ maxWidth: "95vw" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex gap-4">
            <button onClick={() => setTab("library")}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${tab === "library" ? "border-[#2271b1] text-[#2271b1]" : "border-transparent text-gray-500"}`}>
              مكتبة الوسائط
            </button>
            <button onClick={() => setTab("upload")}
              className={`text-sm font-medium pb-1 border-b-2 transition-colors ${tab === "upload" ? "border-[#2271b1] text-[#2271b1]" : "border-transparent text-gray-500"}`}>
              رفع ملف
            </button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {tab === "upload" ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <label className={`flex flex-col items-center gap-4 p-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors
              ${uploading ? "border-gray-200 bg-gray-50" : "border-[#2271b1] hover:bg-blue-50"}`}>
              {uploading ? (
                <>
                  <div className="w-10 h-10 border-4 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-500">جارٍ الرفع...</span>
                </>
              ) : (
                <>
                  <svg className="w-12 h-12 text-[#2271b1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span className="text-gray-600 font-medium">اسحب ملفات هنا أو انقر للاختيار</span>
                  <span className="text-gray-400 text-sm">JPG, PNG, GIF, WebP, SVG, PDF</span>
                </>
              )}
              <input type="file" multiple accept="image/*,application/pdf" className="hidden"
                onChange={e => handleUpload(e.target.files)} disabled={uploading} />
            </label>
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>لا توجد وسائط — ارفع ملفات أولاً</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
                  {items.map(item => (
                    <button key={item.id} onClick={() => setSelected(item)}
                      className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                        selected?.id === item.id ? "border-[#2271b1] ring-2 ring-[#2271b1]/30" : "border-transparent hover:border-gray-300"
                      }`}>
                      {item.mime_type.startsWith("image/") ? (
                        <img src={item.url} alt={item.alt_text || item.original_name}
                          className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs p-2 text-center">
                          {item.original_name}
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
              )}
            </div>

            {/* Sidebar */}
            {selected && (
              <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 flex flex-col gap-3 overflow-y-auto flex-shrink-0">
                <div className="aspect-square bg-white border border-gray-200 rounded overflow-hidden">
                  {selected.mime_type.startsWith("image/") ? (
                    <img src={selected.url} alt={selected.alt_text || ""} className="w-full h-full object-contain" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm p-4 text-center">
                      {selected.original_name}
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-gray-700 break-all">{selected.original_name}</p>
                <p className="text-xs text-gray-500">{fmtSize(selected.size_bytes)}</p>
                <p className="text-xs text-gray-500">{new Date(selected.created_at).toLocaleDateString("ar-EG")}</p>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">نص بديل</label>
                  <input type="text" defaultValue={selected.alt_text || ""}
                    onChange={e => setSelected({ ...selected, alt_text: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]" />
                </div>
                <button onClick={() => onSelect(selected.url, selected.alt_text || "")}
                  className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white text-sm py-2 rounded mt-auto">
                  إدراج في المقال
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
