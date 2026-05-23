"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
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
  instructor_name: string;
  instructor_title_en: string; instructor_title_ar: string;
  instructor_bio_en: string; instructor_bio_ar: string;
  schedule_en: string; schedule_ar: string;
  start_date_en: string; start_date_ar: string;
  location_en: string; location_ar: string;
}

const EMPTY: CourseForm = {
  slug: "", status: "draft", price: "", level_color: "bg-blue-500", sort_order: 0,
  title_en: "", title_ar: "", duration_en: "", duration_ar: "",
  tagline_en: "", tagline_ar: "", description_en: "", description_ar: "",
  outcomes_en: [""], outcomes_ar: [""],
  modules_en: [{ title: "", topics: [""] }],
  modules_ar: [{ title: "", topics: [""] }],
  audience_en: [""], audience_ar: [""],
  instructor_name: "",
  instructor_title_en: "", instructor_title_ar: "",
  instructor_bio_en: "", instructor_bio_ar: "",
  schedule_en: "", schedule_ar: "",
  start_date_en: "", start_date_ar: "",
  location_en: "In Person — Cairo", location_ar: "حضوري — القاهرة",
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder = "", dir: d }: { value: string; onChange: (v: string) => void; placeholder?: string; dir?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={d}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]/30 transition" />
  );
}

function Textarea({ value, onChange, rows = 3, dir: d, placeholder }: { value: string; onChange: (v: string) => void; rows?: number; dir?: string; placeholder?: string }) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} dir={d} placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1]/30 transition resize-y" />
  );
}

function StringList({ label, items, onChange, dir: d }: { label: string; items: string[]; onChange: (v: string[]) => void; dir?: string }) {
  const update = (i: number, v: string) => { const a = [...items]; a[i] = v; onChange(a); };
  const add = () => onChange([...items, ""]);
  const remove = (i: number) => onChange(items.filter((_, x) => x !== i));
  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input value={item} onChange={e => update(i, e.target.value)} dir={d}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]" />
            {items.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="text-red-400 hover:text-red-600 text-xl leading-none w-8 flex-shrink-0">×</button>
            )}
          </div>
        ))}
        <button type="button" onClick={add} className="text-xs text-[#2271b1] hover:underline font-medium">+ Add item</button>
      </div>
    </Field>
  );
}

function ModuleList({ label, items, onChange, dir: d }: { label: string; items: Module[]; onChange: (v: Module[]) => void; dir?: string }) {
  const updateTitle = (i: number, v: string) => { const a = [...items]; a[i] = { ...a[i], title: v }; onChange(a); };
  const updateTopic = (mi: number, ti: number, v: string) => {
    const a = [...items]; const topics = [...a[mi].topics]; topics[ti] = v; a[mi] = { ...a[mi], topics }; onChange(a);
  };
  const addTopic = (mi: number) => { const a = [...items]; a[mi] = { ...a[mi], topics: [...a[mi].topics, ""] }; onChange(a); };
  const removeTopic = (mi: number, ti: number) => { const a = [...items]; a[mi] = { ...a[mi], topics: a[mi].topics.filter((_, x) => x !== ti) }; onChange(a); };
  const addModule = () => onChange([...items, { title: "", topics: [""] }]);
  const removeModule = (i: number) => onChange(items.filter((_, x) => x !== i));
  return (
    <Field label={label}>
      <div className="space-y-3">
        {items.map((mod, mi) => (
          <div key={mi} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex gap-2 mb-3">
              <span className="flex-shrink-0 w-6 h-6 bg-[#0D3B5C] text-white text-xs rounded-full flex items-center justify-center font-bold mt-1">{mi + 1}</span>
              <input value={mod.title} onChange={e => updateTitle(mi, e.target.value)} placeholder="Module title" dir={d}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-[#2271b1]" />
              {items.length > 1 && (
                <button type="button" onClick={() => removeModule(mi)} className="text-red-400 hover:text-red-600 text-xs px-2">Remove</button>
              )}
            </div>
            <div className="space-y-1.5 ps-8">
              {mod.topics.map((topic, ti) => (
                <div key={ti} className="flex gap-2">
                  <i className="fas fa-play-circle text-[#F58220] text-xs mt-2 flex-shrink-0" />
                  <input value={topic} onChange={e => updateTopic(mi, ti, e.target.value)} placeholder="Topic / lesson" dir={d}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-[#2271b1]" />
                  {mod.topics.length > 1 && (
                    <button type="button" onClick={() => removeTopic(mi, ti)} className="text-red-400 hover:text-red-600 text-sm px-1">×</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addTopic(mi)} className="text-xs text-[#2271b1] hover:underline">+ Add topic</button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addModule} className="mt-3 text-xs text-[#2271b1] hover:underline font-medium">+ Add Module</button>
    </Field>
  );
}

type Tab = "basic" | "content" | "curriculum" | "instructor" | "schedule";

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "basic",      label: "Basic Info",   icon: "fa-info-circle" },
  { key: "content",    label: "Content",      icon: "fa-align-left" },
  { key: "curriculum", label: "Curriculum",   icon: "fa-list-ol" },
  { key: "instructor", label: "Instructor",   icon: "fa-user-tie" },
  { key: "schedule",   label: "Schedule",     icon: "fa-calendar-alt" },
];

export default function CourseEditorPage() {
  const router = useRouter();
  const params = useParams();
  const token = useToken();
  const { isRTL } = useLanguage();
  const isNew = params.id === "new";

  const [form, setForm] = useState<CourseForm>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [lang, setLang] = useState<"en" | "ar">("en");

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
          instructor_name: data.instructor_name || "",
          instructor_title_en: data.instructor_title_en || "",
          instructor_title_ar: data.instructor_title_ar || "",
          instructor_bio_en: data.instructor_bio_en || "",
          instructor_bio_ar: data.instructor_bio_ar || "",
          schedule_en: data.schedule_en || "",
          schedule_ar: data.schedule_ar || "",
          start_date_en: data.start_date_en || "",
          start_date_ar: data.start_date_ar || "",
          location_en: data.location_en || "In Person — Cairo",
          location_ar: data.location_ar || "حضوري — القاهرة",
        });
        setLoading(false);
      })
      .catch(() => { setError("Failed to load"); setLoading(false); });
  }, [isNew, params.id, token]);

  const set = (key: keyof CourseForm) => (val: string) =>
    setForm(p => ({ ...p, [key]: val }));

  const save = async (publishNow?: boolean) => {
    setSaving(true); setError(""); setSaved(false);
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
      if (isNew) { router.push("/admin/courses"); return; }
      setSaving(false); setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError("Network error"); setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-6 h-6 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const ar = lang === "ar";

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/courses" className="text-[#a7aaad] hover:text-[#1d2327] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#1d2327]">
            {isNew ? "New Course" : (form.title_en || "Edit Course")}
          </h1>
          {!isNew && (
            <a href={`/courses/${form.slug}`} target="_blank" rel="noreferrer"
              className="text-xs text-[#2271b1] hover:underline mt-0.5 inline-flex items-center gap-1">
              View on site <i className="fas fa-external-link-alt" />
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => save(false)} disabled={saving}
            className="px-4 py-1.5 text-sm border border-[#2271b1] text-[#2271b1] rounded-lg hover:bg-blue-50 font-medium transition-colors">
            {saving ? "Saving…" : saved ? "✓ Saved" : "Save Draft"}
          </button>
          <button onClick={() => save(true)} disabled={saving}
            className="px-4 py-1.5 text-sm bg-[#2271b1] text-white rounded-lg hover:bg-[#135e96] font-medium transition-colors">
            {saving ? "…" : "Publish"}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: tabbed editor */}
        <div className="lg:col-span-2 space-y-0">
          {/* Tab bar */}
          <div className="bg-white rounded-t-xl border border-gray-200 border-b-0 flex overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${activeTab === tab.key ? "border-[#2271b1] text-[#2271b1] bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                <i className={`fas ${tab.icon} text-xs`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Language toggle inside tab content */}
          <div className="bg-white border border-gray-200 border-t-0 px-5 pt-4 pb-0 flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Language:</span>
            {(["en", "ar"] as const).map(l => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${lang === l ? "bg-[#0D3B5C] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
                {l === "en" ? "English" : "العربية"}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-b-xl border border-gray-200 border-t-0 p-5 space-y-5">

            {/* ── BASIC INFO ── */}
            {activeTab === "basic" && (
              <div className="space-y-4" dir={ar ? "rtl" : "ltr"}>
                <Field label={ar ? "العنوان" : "Course Title"}>
                  <Input value={ar ? form.title_ar : form.title_en} onChange={set(ar ? "title_ar" : "title_en")} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label={ar ? "المدة" : "Duration"}>
                    <Input value={ar ? form.duration_ar : form.duration_en} onChange={set(ar ? "duration_ar" : "duration_en")} placeholder={ar ? "مثال: 4 أسابيع" : "e.g. 4 Weeks"} />
                  </Field>
                  <Field label={ar ? "السعر" : "Price"}>
                    <Input value={form.price} onChange={set("price")} placeholder="e.g. 3,500 EGP" dir="ltr" />
                  </Field>
                </div>
                <Field label={ar ? "العنوان الفرعي (tagline)" : "Tagline"}>
                  <Input value={ar ? form.tagline_ar : form.tagline_en} onChange={set(ar ? "tagline_ar" : "tagline_en")} placeholder={ar ? "جملة تسويقية قصيرة" : "Short marketing line"} />
                </Field>
                <Field label={ar ? "الجمهور المستهدف" : "Target Audience"}>
                  <StringList label="" items={ar ? form.audience_ar : form.audience_en}
                    onChange={v => setForm(p => ({ ...p, [ar ? "audience_ar" : "audience_en"]: v }))} dir={ar ? "rtl" : "ltr"} />
                </Field>
              </div>
            )}

            {/* ── CONTENT ── */}
            {activeTab === "content" && (
              <div className="space-y-4" dir={ar ? "rtl" : "ltr"}>
                <Field label={ar ? "وصف الدورة" : "Course Description"}>
                  <Textarea value={ar ? form.description_ar : form.description_en} onChange={set(ar ? "description_ar" : "description_en")} rows={5} />
                </Field>
                <StringList label={ar ? "ماذا ستتعلم (مخرجات التعلم)" : "What You'll Learn (Learning Outcomes)"}
                  items={ar ? form.outcomes_ar : form.outcomes_en}
                  onChange={v => setForm(p => ({ ...p, [ar ? "outcomes_ar" : "outcomes_en"]: v }))} dir={ar ? "rtl" : "ltr"} />
              </div>
            )}

            {/* ── CURRICULUM ── */}
            {activeTab === "curriculum" && (
              <div dir={ar ? "rtl" : "ltr"}>
                <ModuleList
                  label={ar ? "الوحدات والمحاور" : "Modules & Topics"}
                  items={ar ? form.modules_ar : form.modules_en}
                  onChange={v => setForm(p => ({ ...p, [ar ? "modules_ar" : "modules_en"]: v }))}
                  dir={ar ? "rtl" : "ltr"} />
              </div>
            )}

            {/* ── INSTRUCTOR ── */}
            {activeTab === "instructor" && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
                  <i className="fas fa-info-circle mr-1" /> Instructor name is shared between languages. Title and bio can differ.
                </div>
                <Field label="Instructor Name">
                  <Input value={form.instructor_name} onChange={set("instructor_name")} placeholder="e.g. Ahmed Khaled" />
                </Field>
                <div className="grid grid-cols-2 gap-4" dir={ar ? "rtl" : "ltr"}>
                  <Field label={ar ? "المسمى الوظيفي" : "Title / Role"}>
                    <Input value={ar ? form.instructor_title_ar : form.instructor_title_en}
                      onChange={set(ar ? "instructor_title_ar" : "instructor_title_en")}
                      placeholder={ar ? "مثال: محاسب قانوني معتمد" : "e.g. Certified Public Accountant"} />
                  </Field>
                </div>
                <Field label={ar ? "نبذة عن المدرب" : "Instructor Bio"}>
                  <Textarea value={ar ? form.instructor_bio_ar : form.instructor_bio_en}
                    onChange={set(ar ? "instructor_bio_ar" : "instructor_bio_en")} rows={4} dir={ar ? "rtl" : "ltr"} />
                </Field>
              </div>
            )}

            {/* ── SCHEDULE ── */}
            {activeTab === "schedule" && (
              <div className="space-y-4" dir={ar ? "rtl" : "ltr"}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label={ar ? "تاريخ البدء" : "Start Date"}>
                    <Input value={ar ? form.start_date_ar : form.start_date_en}
                      onChange={set(ar ? "start_date_ar" : "start_date_en")}
                      placeholder={ar ? "مثال: 1 يونيو 2026" : "e.g. June 1, 2026"} />
                  </Field>
                  <Field label={ar ? "المكان" : "Location"}>
                    <Input value={ar ? form.location_ar : form.location_en}
                      onChange={set(ar ? "location_ar" : "location_en")}
                      placeholder={ar ? "مثال: حضوري — القاهرة" : "e.g. In Person — Cairo"} />
                  </Field>
                </div>
                <Field label={ar ? "الجدول الزمني / مواعيد الحضور" : "Schedule / Timetable"}>
                  <Textarea value={ar ? form.schedule_ar : form.schedule_en}
                    onChange={set(ar ? "schedule_ar" : "schedule_en")} rows={4}
                    placeholder={ar ? "مثال:\nالسبت والأحد — 10 صباحاً حتى 2 مساءً\nالمدة الإجمالية: 8 جلسات" : "e.g.\nSaturdays & Sundays — 10 AM to 2 PM\nTotal: 8 sessions"} />
                </Field>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT: settings sidebar */}
        <div className="space-y-4">

          {/* Publish */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="fas fa-globe text-[#2271b1]" /> Publish
            </h3>
            <div className="space-y-3">
              <Field label="Status">
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </Field>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => save(false)} disabled={saving}
                className="flex-1 px-3 py-2 text-sm border border-[#2271b1] text-[#2271b1] rounded-lg hover:bg-blue-50 font-medium transition-colors">
                {saving ? "…" : saved ? "✓ Saved" : "Save"}
              </button>
              <button onClick={() => save(true)} disabled={saving}
                className="flex-1 px-3 py-2 text-sm bg-[#2271b1] text-white rounded-lg hover:bg-[#135e96] font-medium transition-colors">
                Publish
              </button>
            </div>
          </div>

          {/* Course settings */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <i className="fas fa-cog text-gray-400" /> Settings
            </h3>
            <div className="space-y-3">
              <Field label="Slug (URL)">
                <input value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} dir="ltr"
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:border-[#2271b1]" />
              </Field>
              <Field label="Sort Order">
                <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} min={0} dir="ltr"
                  className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#2271b1]" />
              </Field>
              <Field label="Card Accent Color">
                <div className="flex flex-wrap gap-2 mt-1">
                  {COLORS.map(c => (
                    <button key={c.value} type="button" onClick={() => setForm(p => ({ ...p, level_color: c.value }))}
                      className={`w-8 h-8 rounded-full ${c.value} border-2 transition-all ${form.level_color === c.value ? "border-gray-800 scale-110 shadow-md" : "border-transparent opacity-70 hover:opacity-100"}`}
                      title={c.label} />
                  ))}
                </div>
              </Field>
            </div>
          </div>

          {/* Quick preview */}
          {!isNew && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <i className="fas fa-eye text-gray-400" /> Preview
              </h3>
              <div className={`w-full h-2 rounded-full mb-3 ${form.level_color}`} />
              <p className="text-sm font-semibold text-[#0D3B5C] leading-snug">{form.title_en || "Untitled"}</p>
              <p className="text-xs text-gray-400 mt-1">{form.duration_en} · {form.price || "No price"}</p>
              {form.instructor_name && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <i className="fas fa-user-tie text-[#F58220]" /> {form.instructor_name}
                </p>
              )}
              {form.start_date_en && (
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <i className="fas fa-calendar text-[#F58220]" /> {form.start_date_en}
                </p>
              )}
              <a href={`/courses/${form.slug}`} target="_blank" rel="noreferrer"
                className="mt-3 text-xs text-[#2271b1] hover:underline inline-flex items-center gap-1">
                View live page <i className="fas fa-external-link-alt" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
