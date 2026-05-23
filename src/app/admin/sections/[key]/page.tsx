"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { SECTION_FIELDS } from "@/lib/sectionFields";
import { translations } from "@/lib/i18n";

const LANGS = ["en", "ar"] as const;
const LANG_LABELS: Record<string, string> = { en: "English", ar: "العربية" };

// Read a dot-notation key from the translations object
function getDefault(lang: "en" | "ar", key: string): string {
  const parts = key.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let val: any = translations[lang] ?? translations["en"];
  for (const p of parts) {
    if (val && typeof val === "object") val = val[p];
    else return "";
  }
  return typeof val === "string" ? val : "";
}

interface Section {
  key: string;
  label: string;
  type: string;
  content: Record<string, unknown>;
}

export default function SectionEditorPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = use(params);

  const [section, setSection] = useState<Section | null>(null);
  const [activeLang, setActiveLang] = useState<"en" | "ar">("en");
  const [values, setValues] = useState<Record<string, Record<string, string>>>({ en: {}, ar: {} });
  const [customContent, setCustomContent] = useState<Record<string, string>>({ title_en: "", title_ar: "", body_en: "", body_ar: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fields = SECTION_FIELDS[key] || [];
  const isCustom = section?.type === "custom";

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token");
    fetch(`/api/admin/sections/${key}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setSection(data.section);
        // Populate fields: use override if exists, otherwise show the current default
        const init: Record<string, Record<string, string>> = { en: {}, ar: {} };
        for (const lang of LANGS) {
          for (const f of SECTION_FIELDS[key] || []) {
            const override = data.overrides?.[lang]?.[f.key];
            init[lang][f.key] = override !== undefined && override !== ""
              ? override
              : getDefault(lang, f.key);
          }
        }
        setValues(init);
        // For custom sections
        if (data.section?.type === "custom" && data.section?.content) {
          setCustomContent(data.section.content as Record<string, string>);
        }
        setLoading(false);
      });
  }, [key]);

  function handleChange(lang: string, fieldKey: string, val: string) {
    setValues((prev) => ({ ...prev, [lang]: { ...prev[lang], [fieldKey]: val } }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    const token = sessionStorage.getItem("admin_token");
    const body: Record<string, unknown> = {};

    if (isCustom) {
      body.content = customContent;
      body.label = customContent.title_en || section?.label;
    } else {
      // Only save fields that differ from the default (empty string = delete override)
      const overridesToSave: Record<string, Record<string, string>> = { en: {}, ar: {} };
      for (const lang of LANGS) {
        for (const f of fields) {
          const current = values[lang]?.[f.key] ?? "";
          const defaultVal = getDefault(lang, f.key);
          overridesToSave[lang][f.key] = current !== defaultVal ? current : "";
        }
      }
      body.overrides = overridesToSave;
    }

    await fetch(`/api/admin/sections/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/sections" className="text-[#a7aaad] hover:text-[#1d2327] transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#1d2327]">Edit: {section?.label}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isCustom ? "Custom section — edit title and HTML content" : `${fields.length} editable fields · Default text is pre-filled — edit any field and save`}
          </p>
        </div>
        <button
          onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-[#2271b1] text-white text-sm font-semibold rounded-lg hover:bg-[#135e96] disabled:opacity-60 transition-colors"
        >
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Saving…</>
          ) : saved ? (
            <><i className="fas fa-check" /> Saved!</>
          ) : (
            <><i className="fas fa-save" /> Save Changes</>
          )}
        </button>
      </div>

      {isCustom ? (
        /* Custom section editor */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 divide-x divide-gray-200">
            {/* EN */}
            <div className="p-6 space-y-4">
              <h3 className="font-semibold text-sm text-[#1d2327] flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded text-xs flex items-center justify-center font-bold">EN</span>
                English
              </h3>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Title</label>
                <input type="text" value={customContent.title_en || ""} onChange={(e) => setCustomContent((p) => ({ ...p, title_en: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#2271b1] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Content (HTML allowed)</label>
                <textarea rows={10} value={customContent.body_en || ""} onChange={(e) => setCustomContent((p) => ({ ...p, body_en: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#2271b1] focus:outline-none font-mono" />
              </div>
            </div>
            {/* AR */}
            <div className="p-6 space-y-4" dir="rtl">
              <h3 className="font-semibold text-sm text-[#1d2327] flex items-center gap-2">
                <span className="w-5 h-5 bg-green-100 text-green-700 rounded text-xs flex items-center justify-center font-bold">ع</span>
                العربية
              </h3>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">العنوان</label>
                <input type="text" value={customContent.title_ar || ""} onChange={(e) => setCustomContent((p) => ({ ...p, title_ar: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#2271b1] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">المحتوى (HTML مسموح)</label>
                <textarea rows={10} value={customContent.body_ar || ""} onChange={(e) => setCustomContent((p) => ({ ...p, body_ar: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-[#2271b1] focus:outline-none font-mono" />
              </div>
            </div>
          </div>
        </div>
      ) : fields.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          <i className="fas fa-lock text-3xl mb-3" />
          <p className="font-medium">This section has no editable text fields.</p>
          <p className="text-sm mt-1">Its content is managed through other admin pages (e.g. Blog Posts, Courses).</p>
        </div>
      ) : (
        /* Built-in section editor */
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Language tabs */}
          <div className="flex border-b border-gray-200">
            {LANGS.map((lng) => (
              <button key={lng} onClick={() => setActiveLang(lng)}
                className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px
                  ${activeLang === lng ? "border-[#2271b1] text-[#2271b1]" : "border-transparent text-gray-500 hover:text-[#1d2327]"}`}>
                {LANG_LABELS[lng]}
              </button>
            ))}
            <div className="flex-1 flex items-center px-4">
              <span className="text-xs text-gray-400">Fields show current defaults · click Reset to revert any change</span>
            </div>
          </div>

          {/* Fields */}
          <div className="p-6 space-y-5" dir={activeLang === "ar" ? "rtl" : "ltr"}>
            {fields.map((field) => {
              const current = values[activeLang]?.[field.key] ?? "";
              const defaultVal = getDefault(activeLang, field.key);
              const isModified = current !== defaultVal;
              return (
                <div key={field.key}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-600">
                      {field.label}
                      {isModified && (
                        <span className="ml-2 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded font-normal">modified</span>
                      )}
                    </label>
                    {isModified && (
                      <button
                        type="button"
                        onClick={() => handleChange(activeLang, field.key, defaultVal)}
                        className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  {field.type === "textarea" ? (
                    <textarea
                      rows={3}
                      value={current}
                      onChange={(e) => handleChange(activeLang, field.key, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none resize-y transition-colors
                        ${isModified ? "border-amber-300 focus:border-amber-500 bg-amber-50/30" : "border-gray-200 focus:border-[#2271b1]"}`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={current}
                      onChange={(e) => handleChange(activeLang, field.key, e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none transition-colors
                        ${isModified ? "border-amber-300 focus:border-amber-500 bg-amber-50/30" : "border-gray-200 focus:border-[#2271b1]"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
