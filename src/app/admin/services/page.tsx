"use client";
import { useState, useEffect, useCallback } from "react";

interface Service {
  id: number; slug: string; icon: string;
  title_en: string; title_ar: string;
  desc_en: string; desc_ar: string;
  sort_order: number; visible: boolean;
}

const EMPTY_SERVICE: Omit<Service, "id"> = {
  slug: "", icon: "fa-star",
  title_en: "", title_ar: "",
  desc_en: "", desc_ar: "",
  sort_order: 0, visible: true,
};

const ICON_OPTIONS = [
  "fa-calculator", "fa-graduation-cap", "fa-briefcase", "fa-shield-halved",
  "fa-gears", "fa-balance-scale", "fa-chart-line", "fa-file-invoice",
  "fa-users", "fa-handshake", "fa-lightbulb", "fa-star",
  "fa-laptop-code", "fa-money-bill-wave", "fa-building", "fa-globe",
  "fa-cog", "fa-clipboard-list", "fa-award", "fa-rocket",
];

function useToken() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_token") || "";
}

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition w-full">
        <i className={`fas ${value} text-[#F58220] w-5 text-center`} />
        <span className="text-gray-600 font-mono text-xs flex-1 text-left">{value}</span>
        <i className="fas fa-chevron-down text-gray-400 text-xs" />
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl p-3 grid grid-cols-5 gap-2 w-64">
          {ICON_OPTIONS.map(ic => (
            <button key={ic} type="button" onClick={() => { onChange(ic); setOpen(false); }}
              title={ic}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                ${value === ic ? "bg-[#0D3B5C] text-white" : "bg-gray-50 hover:bg-[#0D3B5C]/10 text-gray-600"}`}>
              <i className={`fas ${ic} text-sm`} />
            </button>
          ))}
          <div className="col-span-5 mt-1 pt-2 border-t border-gray-100">
            <input
              placeholder="Custom: fa-..." value={value}
              onChange={e => onChange(e.target.value)}
              className="w-full text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceForm({
  data, onSave, onCancel, saving,
}: {
  data: Omit<Service, "id"> & { id?: number };
  onSave: (d: typeof data) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState(data);
  const [lang, setLang] = useState<"en" | "ar">("en");
  const ar = lang === "ar";

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  return (
    <div className="border-t border-gray-100 pt-5 space-y-4">
      {/* Lang toggle */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-400 font-medium">Language:</span>
        {(["en", "ar"] as const).map(l => (
          <button key={l} type="button" onClick={() => setLang(l)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${lang === l ? "bg-[#0D3B5C] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
            {l === "en" ? "English" : "العربية"}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4" dir={ar ? "rtl" : "ltr"}>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{ar ? "العنوان" : "Title"}</label>
          <input value={ar ? form.title_ar : form.title_en} onChange={set(ar ? "title_ar" : "title_en")}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Icon</label>
          <IconPicker value={form.icon} onChange={v => setForm(p => ({ ...p, icon: v }))} />
        </div>
      </div>

      <div dir={ar ? "rtl" : "ltr"}>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{ar ? "الوصف" : "Description"}</label>
        <textarea value={ar ? form.desc_ar : form.desc_en} onChange={set(ar ? "desc_ar" : "desc_en")} rows={3}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1] resize-y" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Slug (URL key)</label>
          <input value={form.slug} onChange={set("slug")} dir="ltr"
            placeholder="e.g. accounting" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#2271b1]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Sort Order</label>
          <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} min={0} dir="ltr"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2271b1]" />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button type="button" onClick={() => onSave(form)} disabled={saving}
          className="px-5 py-2 bg-[#2271b1] text-white text-sm font-semibold rounded-lg hover:bg-[#135e96] disabled:opacity-60 transition-colors">
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function ServicesAdminPage() {
  const token = useToken();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/services", { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setServices(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const saveService = async (form: Omit<Service, "id"> & { id?: number }) => {
    setSaving(true);
    if (form.id) {
      await fetch(`/api/admin/services/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    setEditingId(null);
    load();
  };

  const toggleVisible = async (s: Service) => {
    await fetch(`/api/admin/services/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...s, visible: !s.visible }),
    });
    load();
  };

  const deleteService = async (s: Service) => {
    if (!confirm(`Delete "${s.title_en}"? This cannot be undone.`)) return;
    setDeletingId(s.id);
    await fetch(`/api/admin/services/${s.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setDeletingId(null);
    load();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1d2327]">Services</h1>
          <p className="text-sm text-gray-500 mt-0.5">Add, edit, reorder, or delete services shown on the homepage</p>
        </div>
        <button onClick={() => setEditingId("new")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2271b1] text-white text-sm font-medium rounded-lg hover:bg-[#135e96] transition-colors">
          <i className="fas fa-plus text-xs" /> Add New Service
        </button>
      </div>

      {/* New service form */}
      {editingId === "new" && (
        <div className="bg-white rounded-xl border-2 border-[#2271b1]/30 p-5 mb-4 shadow-sm">
          <p className="text-sm font-semibold text-[#2271b1] mb-4 flex items-center gap-2">
            <i className="fas fa-plus-circle" /> New Service
          </p>
          <ServiceForm
            data={{ ...EMPTY_SERVICE, sort_order: services.length + 1 }}
            onSave={saveService} onCancel={() => setEditingId(null)} saving={saving} />
        </div>
      )}

      {/* Services list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {services.map(s => (
            <div key={s.id}
              className={`bg-white rounded-xl border transition-all duration-200
                ${!s.visible ? "opacity-60 border-gray-200" : "border-gray-200 shadow-sm"}
                ${editingId === s.id ? "border-[#2271b1]/40 shadow-md" : "hover:shadow-md"}`}>
              <div className="flex items-center gap-4 p-4">
                {/* Drag handle / order */}
                <span className="text-gray-300 text-xs font-mono w-5 text-center flex-shrink-0">{s.sort_order}</span>

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${s.visible ? "bg-[#0D3B5C]" : "bg-gray-200"}`}>
                  <i className={`fas ${s.icon} text-sm ${s.visible ? "text-white" : "text-gray-400"}`} />
                </div>

                {/* Title + desc */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1d2327] text-sm">{s.title_en || <span className="text-gray-400 italic">Untitled</span>}</span>
                    {s.title_ar && <span className="text-gray-400 text-xs" dir="rtl">{s.title_ar}</span>}
                    {!s.visible && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-xs rounded">hidden</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{s.desc_en}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                      ${editingId === s.id ? "bg-[#2271b1] text-white" : "border border-gray-300 text-gray-600 hover:bg-gray-50"}`}>
                    <i className={`fas ${editingId === s.id ? "fa-chevron-up" : "fa-pencil"} mr-1`} />
                    {editingId === s.id ? "Close" : "Edit"}
                  </button>
                  <button onClick={() => toggleVisible(s)}
                    title={s.visible ? "Hide from site" : "Show on site"}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors">
                    <i className={`fas ${s.visible ? "fa-eye" : "fa-eye-slash"} text-xs`} />
                  </button>
                  <button onClick={() => deleteService(s)} disabled={deletingId === s.id}
                    title="Delete permanently"
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50">
                    <i className="fas fa-trash text-xs" />
                  </button>
                </div>
              </div>

              {/* Inline edit form */}
              {editingId === s.id && (
                <div className="px-5 pb-5">
                  <ServiceForm
                    data={s}
                    onSave={saveService} onCancel={() => setEditingId(null)} saving={saving} />
                </div>
              )}
            </div>
          ))}

          {services.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <i className="fas fa-th-large text-4xl mb-3 block" />
              <p>No services yet. Click "Add New Service" to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
