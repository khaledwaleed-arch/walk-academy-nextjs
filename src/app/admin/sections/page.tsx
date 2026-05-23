"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Section {
  id: number;
  key: string;
  label: string;
  type: string;
  is_visible: boolean;
  sort_order: number;
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // New section modal
  const [showModal, setShowModal] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [creating, setCreating] = useState(false);

  function fetchSections() {
    const token = sessionStorage.getItem("admin_token");
    return fetch("/api/admin/sections", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => { setSections(data); setLoading(false); });
  }

  useEffect(() => { fetchSections(); }, []);

  function toggleVisible(key: string) {
    setSections((prev) => prev.map((s) => s.key === key ? { ...s, is_visible: !s.is_visible } : s));
    setSaved(false);
  }

  function moveUp(idx: number) {
    if (idx === 0) return;
    const next = [...sections];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setSections(next.map((s, i) => ({ ...s, sort_order: i + 1 })));
    setSaved(false);
  }

  function moveDown(idx: number) {
    if (idx === sections.length - 1) return;
    const next = [...sections];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setSections(next.map((s, i) => ({ ...s, sort_order: i + 1 })));
    setSaved(false);
  }

  function onDragStart(idx: number) { setDragIdx(idx); }
  function onDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...sections];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    setSections(next.map((s, i) => ({ ...s, sort_order: i + 1 })));
    setDragIdx(idx);
    setSaved(false);
  }
  function onDragEnd() { setDragIdx(null); }

  async function save() {
    setSaving(true);
    const token = sessionStorage.getItem("admin_token");
    await fetch("/api/admin/sections", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(sections),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function createSection() {
    if (!newLabel.trim()) return;
    setCreating(true);
    const token = sessionStorage.getItem("admin_token");
    await fetch("/api/admin/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ label: newLabel, content: { title_en: newLabel, title_ar: "", body_en: "", body_ar: "" } }),
    });
    setNewLabel("");
    setCreating(false);
    setShowModal(false);
    setLoading(true);
    fetchSections();
  }

  async function deleteSection(key: string) {
    if (!confirm("Delete this custom section?")) return;
    const token = sessionStorage.getItem("admin_token");
    await fetch(`/api/admin/sections/${key}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setSections((prev) => prev.filter((s) => s.key !== key));
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const visibleCount = sections.filter((s) => s.is_visible).length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#1d2327]">Homepage Sections</h1>
          <p className="text-sm text-gray-500 mt-0.5">{visibleCount} of {sections.length} sections visible</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-[#1d2327] text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
            <i className="fas fa-plus" /> Add Section
          </button>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[#2271b1] text-white text-sm font-semibold rounded-lg hover:bg-[#135e96] disabled:opacity-60 transition-colors">
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" /> Saving…</>
            ) : saved ? (
              <><i className="fas fa-check" /> Saved!</>
            ) : (
              <><i className="fas fa-save" /> Save Order</>
            )}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 flex gap-2 text-sm text-blue-700">
        <i className="fas fa-info-circle mt-0.5 flex-shrink-0" />
        <span>Drag to reorder · Toggle to show/hide · Click <strong>Edit</strong> to change content · <strong>Save Order</strong> to apply changes</span>
      </div>

      {/* Sections list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center text-xs font-semibold text-gray-400 uppercase px-4 py-2 border-b border-gray-100 bg-gray-50">
          <span className="w-8" />
          <span>Section</span>
          <span className="w-16 text-center">Order</span>
          <span className="w-12 text-center">Visible</span>
          <span className="w-16 text-center">Edit</span>
        </div>

        {sections.map((section, idx) => (
          <div
            key={section.key}
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragOver={(e) => onDragOver(e, idx)}
            onDragEnd={onDragEnd}
            className={`grid grid-cols-[auto_1fr_auto_auto_auto] items-center px-4 py-3 border-b border-gray-100 last:border-0 transition-colors cursor-grab active:cursor-grabbing
              ${dragIdx === idx ? "bg-blue-50 opacity-60" : "hover:bg-gray-50"}
              ${!section.is_visible ? "opacity-50" : ""}`}
          >
            {/* Drag handle */}
            <div className="w-8 flex items-center text-gray-300 hover:text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 10.001 4.001A2 2 0 007 2zm0 6a2 2 0 10.001 4.001A2 2 0 007 6zm0 6a2 2 0 10.001 4.001A2 2 0 007 12zM13 2a2 2 0 10.001 4.001A2 2 0 0013 2zm0 6a2 2 0 10.001 4.001A2 2 0 0013 6zm0 6a2 2 0 10.001 4.001A2 2 0 0013 12z" />
              </svg>
            </div>

            {/* Label */}
            <div className="flex items-center gap-2 min-w-0">
              <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${section.type === "custom" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-400"}`}>
                {section.type === "custom" ? "custom" : section.key}
              </span>
              <span className="text-sm font-medium text-[#1d2327] truncate">{section.label}</span>
            </div>

            {/* Up/Down arrows */}
            <div className="w-16 flex items-center justify-center gap-1">
              <button onClick={() => moveUp(idx)} disabled={idx === 0}
                className="p-1 text-gray-400 hover:text-[#2271b1] disabled:opacity-20 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button onClick={() => moveDown(idx)} disabled={idx === sections.length - 1}
                className="p-1 text-gray-400 hover:text-[#2271b1] disabled:opacity-20 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Toggle */}
            <div className="w-12 flex justify-center">
              <button onClick={() => toggleVisible(section.key)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200
                  ${section.is_visible ? "bg-[#2271b1]" : "bg-gray-300"}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200
                  ${section.is_visible ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Edit / Delete */}
            <div className="w-16 flex items-center justify-center gap-1">
              <Link href={`/admin/sections/${section.key}`}
                className="p-1.5 text-[#2271b1] hover:bg-blue-50 rounded transition-colors text-xs font-semibold">
                <i className="fas fa-pen" />
              </Link>
              {section.type === "custom" && (
                <button onClick={() => deleteSection(section.key)}
                  className="p-1.5 text-red-400 hover:bg-red-50 rounded transition-colors">
                  <i className="fas fa-trash text-xs" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Section Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-[#1d2327] mb-1">Add New Section</h2>
            <p className="text-sm text-gray-500 mb-5">Creates a custom section with a title and HTML content that you can edit.</p>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Section Name (English)</label>
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createSection()}
              placeholder="e.g. Special Offer, Announcement, Partners..."
              className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:border-[#2271b1] focus:outline-none mb-5"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={createSection} disabled={creating || !newLabel.trim()}
                className="flex-1 px-4 py-2.5 bg-[#2271b1] text-white text-sm font-semibold rounded-xl hover:bg-[#135e96] disabled:opacity-60 transition-colors">
                {creating ? "Creating…" : "Create Section"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
