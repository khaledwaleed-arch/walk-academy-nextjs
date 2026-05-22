"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

interface Module { title: string; topics: string[]; }

interface CourseForm {
  slug: string; status: string; price: string; level_color: string; sort_order: number;
  title_en: string; title_ar: string;
  duration_en: string; duration_ar: string;
  tagline_en: string; tagline_ar: string;
  description_en: string; description_ar: string;
  outcomes_en: string[]; outcomes_ar: string[];
  modules_en: Module[]; modules_ar: Module[];
  audience_en: string[]; audience_ar: string[];
}

const EMPTY: CourseForm = {
  slug: "", status: "draft", price: "", level_color: "bg-blue-500", sort_order: 0,
  title_en: "", title_ar: "", duration_en: "", duration_ar: "",
  tagline_en: "", tagline_ar: "", description_en: "", description_ar: "",
  outcomes_en: [""], outcomes_ar: [""],
  modules_en: [{ title: "", topics: [""] }], modules_ar: [{ title: "", topics: [""] }],
  audience_en: [""], audience_ar: [""],
};

const COLORS = [
  { value: "bg-blue-500", label: "Blue" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-purple-500", label: "Purple" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-teal-500", label: "Teal" },
];

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

function StringList({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const update = (i: number, v: string) => { const a = [...items]; a[i] = v; onChange(a); };
  const add = () => onChange([...items, ""]);
  const remove = (i: number) => onChange(items.filter((_, x) => x !== i));
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={e => update(i, e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]" />
            {items.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-lg leading-none px-1">×</button>
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-2 text-xs text-[#2271b1] hover:underline">+ Add</button>
    </div>
  );
}

function ModuleList({ label, items, onChange }: { label: string; items: Module[]; onChange: (v: Module[]) => void }) {
  const updateTitle = (i: number, v: string) => { const a = [...items]; a[i] = { ...a[i], title: v }; onChange(a); };
  const updateTopic = (mi: number, ti: number, v: string) => {
    const a = [...items]; const topics = [...a[mi].topics]; topics[ti] = v; a[mi] = { ...a[mi], topics }; onChange(a);
  };
  const addTopic = (mi: number) => { const a = [...items]; a[mi] = { ...a[mi], topics: [...a[mi].topics, ""] }; onChange(a); };
  const removeTopic = (mi: number, ti: number) => { const a = [...items]; a[mi] = { ...a[mi], topics: a[mi].topics.filter((_, x) => x !== ti) }; onChange(a); };
  const addModule = () => onChange([...items, { title: "", topics: [""] }]);
  const removeModule = (i: number) => onChange(items.filter((_, x) => x !== i));
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-2">{label}</label>
      <div className="space-y-4">
        {items.map((mod, mi) => (
          <div key={mi} className="border border-gray-200 rounded p-3 bg-gray-50">
            <div className="flex gap-2 mb-2">
              <input value={mod.title} onChange={e => updateTitle(mi, e.target.value)} placeholder="Module title"
                className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-[#2271b1]" />
              {items.length > 1 && (
                <button type="button" onClick={() => removeModule(mi)} className="text-red-400 hover:text-red-600 text-sm px-2">Remove</button>
              )}
            </div>
            <div className="space-y-1 ms-4">
              {mod.topics.map((topic, ti) => (
                <div key={ti} className="flex gap-2">
                  <input value={topic} onChange={e => updateTopic(mi, ti, e.target.value)} placeholder="Topic"
                    className="flex-1 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#2271b1]" />
                  {mod.topics.length > 1 && (
                    <button type="button" onClick={() => removeTopic(mi, ti)} className="text-red-400 hover:text-red-600 text-sm px-1">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addTopic(mi)} className="text-xs text-[#2271b1] hover:underline">+ Topic</button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addModule} className="mt-2 text-xs text-[#2271b1] hover:underline">+ Add Module</button>
    </div>
  );
}

export default function CourseEditorPage() {
  const router = useRouter();
  const params = useParams();
  const token = useToken();
  const { isRTL } = useLanguage();
  const isNew = params.id === "new";
  const [form, setForm] = useState<CourseForm>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"en" | "ar">("en");

  useEffect(() => {
    if (isNew) return;
    fetch(`/api/admin/courses/${params.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setForm({
          slug: data.slug || "", status: data.status || "draft",
          price: data.price || "", level_color: data.level_color || "bg-blue-500",
          sort_order: data.sort_order || 0,
          title_en: data.title_en || "", title_ar: data.title_ar || "",
          duration_en: data.duration_en || "", duration_ar: data.duration_ar || "",
          tagline_en: data.tagline_en || "", tagline_ar: data.tagline_ar || "",
          description_en: data.description_en || "", description_ar: data.description_ar || "",
          outcomes_en: data.outcomes_en?.length ? data.outcomes_en : [""],
          outcomes_ar: data.outcomes_ar?.length ? data.outcomes_ar : [""],
          modules_en: data.modules_en?.length ? data.modules_en : [{ title: "", topics: [""] }],
          modules_ar: data.modules_ar?.length ? data.modules_ar : [{ title: "", topics: [""] }],
          audience_en: data.audience_en?.length ? data.audience_en : [""],
          audience_ar: data.audience_ar?.length ? data.audience_ar : [""],
        });
        setLoading(false);
      })
      .catch(() => { setError("Failed to load"); setLoading(false); });
  }, [isNew, params.id, token]);

  const f = (key: keyof CourseForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: key === "sort_order" ? Number(e.target.value) : e.target.value }));

  const save = async (publishNow?: boolean) => {
    setSaving(true); setError("");
    const body = { ...form, status: publishNow ? "published" : form.status };
    const url = isNew ? "/api/admin/courses" : `/api/admin/courses/${params.id}`;
    const method = isNew ? "POST" : "PUT";
    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Save failed"); setSaving(false); return; }
      router.push("/admin/courses");
    } catch { setError("Network error"); setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const Title = ({ label, field }: { label: string; field: keyof CourseForm }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input value={form[field] as string} onChange={f(field)}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1]" />
    </div>
  );

  const TextArea = ({ label, field, rows = 3 }: { label: string; field: keyof CourseForm; rows?: number }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <textarea value={form[field] as string} onChange={f(field)} rows={rows}
        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] resize-none" />
    </div>
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1d2327]">
            {isNew ? (isRTL ? "كورس جديد" : "New Course") : (isRTL ? "تعديل الكورس" : "Edit Course")}
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.back()} className="px-3 py-1.5 text-sm border border-gray-300 rounded text-gray-600 hover:bg-gray-50">
            {isRTL ? "إلغاء" : "Cancel"}
          </button>
          <button onClick={() => save(false)} disabled={saving}
            className="px-4 py-1.5 text-sm border border-[#2271b1] text-[#2271b1] rounded hover:bg-blue-50 font-medium">
            {saving ? "..." : isRTL ? "حفظ مسودة" : "Save Draft"}
          </button>
          <button onClick={() => save(true)} disabled={saving}
            className="px-4 py-1.5 text-sm bg-[#2271b1] text-white rounded hover:bg-[#135e96] font-medium">
            {saving ? "..." : isRTL ? "نشر" : "Publish"}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Language tabs */}
          <div className="bg-white rounded border border-gray-200 p-5">
            <div className="flex gap-1 mb-5 border-b border-gray-200">
              <button onClick={() => setTab("en")}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === "en" ? "border-[#2271b1] text-[#2271b1]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                English
              </button>
              <button onClick={() => setTab("ar")}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === "ar" ? "border-[#2271b1] text-[#2271b1]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                العربية
              </button>
            </div>

            {tab === "en" ? (
              <div className="space-y-4" dir="ltr">
                <Title label="Title (English)" field="title_en" />
                <div className="grid grid-cols-2 gap-4">
                  <Title label="Duration (e.g. 4 Weeks)" field="duration_en" />
                </div>
                <Title label="Tagline" field="tagline_en" />
                <TextArea label="Description" field="description_en" rows={4} />
                <StringList label="Learning Outcomes" items={form.outcomes_en} onChange={v => setForm(p => ({ ...p, outcomes_en: v }))} />
                <ModuleList label="Modules / Curriculum" items={form.modules_en} onChange={v => setForm(p => ({ ...p, modules_en: v }))} />
                <StringList label="Target Audience" items={form.audience_en} onChange={v => setForm(p => ({ ...p, audience_en: v }))} />
              </div>
            ) : (
              <div className="space-y-4" dir="rtl">
                <Title label="العنوان (عربي)" field="title_ar" />
                <div className="grid grid-cols-2 gap-4">
                  <Title label="المدة (مثل: 4 أسابيع)" field="duration_ar" />
                </div>
                <Title label="العنوان الفرعي" field="tagline_ar" />
                <TextArea label="الوصف" field="description_ar" rows={4} />
                <StringList label="مخرجات التعلم" items={form.outcomes_ar} onChange={v => setForm(p => ({ ...p, outcomes_ar: v }))} />
                <ModuleList label="الوحدات / المنهج" items={form.modules_ar} onChange={v => setForm(p => ({ ...p, modules_ar: v }))} />
                <StringList label="الجمهور المستهدف" items={form.audience_ar} onChange={v => setForm(p => ({ ...p, audience_ar: v }))} />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar settings */}
        <div className="space-y-4">
          {/* Publish */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{isRTL ? "النشر" : "Publish"}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isRTL ? "الحالة" : "Status"}</label>
                <select value={form.status} onChange={f("status")}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]">
                  <option value="draft">{isRTL ? "مسودة" : "Draft"}</option>
                  <option value="published">{isRTL ? "منشور" : "Published"}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Course settings */}
          <div className="bg-white rounded border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{isRTL ? "إعدادات الكورس" : "Course Settings"}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Slug (URL)</label>
                <input value={form.slug} onChange={f("slug")} dir="ltr"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-[#2271b1]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isRTL ? "السعر" : "Price"}</label>
                <input value={form.price} onChange={f("price")} placeholder="e.g. 3,500 EGP" dir="ltr"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isRTL ? "لون البطاقة" : "Card Color"}</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {COLORS.map(c => (
                    <button key={c.value} type="button" onClick={() => setForm(p => ({ ...p, level_color: c.value }))}
                      className={`w-8 h-8 rounded-full ${c.value} border-2 transition-all ${form.level_color === c.value ? "border-gray-800 scale-110" : "border-transparent"}`}
                      title={c.label} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">{isRTL ? "ترتيب العرض" : "Sort Order"}</label>
                <input type="number" value={form.sort_order} onChange={f("sort_order")} min={0} dir="ltr"
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
