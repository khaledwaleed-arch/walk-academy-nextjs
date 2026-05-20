"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Registration {
  id: number; full_name: string; email: string; phone: string;
  course: string; country: string; status: string; created_at: string;
}
interface Contact {
  id: number; name: string; email: string; phone: string;
  subject: string; message: string; status: string; created_at: string;
}
interface Consultation {
  id: number; name: string; email: string; phone: string; company: string;
  service: string; preferred_date: string; preferred_time: string;
  message: string; status: string; created_at: string;
}
interface Stats {
  total_registrations: number; total_contacts: number; total_subscribers: number;
  total_consultations: number; today_registrations: number; today_contacts: number;
}

const STATUS_COLORS: Record<string, string> = {
  new:       "bg-blue-100 text-blue-700",
  pending:   "bg-blue-100 text-blue-700",
  contacted: "bg-yellow-100 text-yellow-700",
  enrolled:  "bg-green-100 text-green-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (t: string) => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    const data = await res.json();
    setLoading(false);
    if (data.token) { onLogin(data.token); }
    else setErr("Wrong password");
  }

  return (
    <div className="min-h-screen bg-[#0D3B5C] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-10 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0D3B5C] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-shield-halved text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-black text-[#0D3B5C]">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Walk Business</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input type="password" value={pw} onChange={e => setPw(e.target.value)}
            placeholder="Admin Password" required autoFocus
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none bg-gray-50 focus:bg-white transition-all"
          />
          {err && <p className="text-red-500 text-sm text-center">{err}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#F58220] text-white font-bold rounded-xl hover:bg-[#d9700f] transition disabled:opacity-60">
            {loading ? <i className="fas fa-spinner fa-spin" /> : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"regs" | "contacts" | "consultations">("regs");
  const [stats, setStats] = useState<Stats | null>(null);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedMsg, setExpandedMsg] = useState<number | null>(null);

  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const fetchAll = useCallback(async () => {
    const [s, r, c, cons] = await Promise.all([
      fetch("/api/admin/stats", auth).then(r => r.json()),
      fetch("/api/admin/registrations", auth).then(r => r.json()),
      fetch("/api/admin/contacts", auth).then(r => r.json()),
      fetch("/api/admin/consultations", auth).then(r => r.json()),
    ]);
    setStats(s); setRegs(r); setContacts(c); setConsultations(cons);
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchAll(); }, [fetchAll]);

  async function updateStatus(type: "registrations" | "contacts" | "consultations", id: number, status: string) {
    await fetch(`/api/admin/${type}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ id, status }) });
    fetchAll();
  }

  function exportFile(format: string, type?: string) {
    const url = `/api/admin/export?format=${format}${type ? `&type=${type}` : ""}`;
    const a = document.createElement("a"); a.href = url;
    a.setAttribute("download", "");
    // Add auth via query param workaround (open in new tab for PDF, download for xlsx)
    fetch(url, auth).then(r => r.blob()).then(blob => {
      const burl = URL.createObjectURL(blob);
      a.href = burl; document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(burl);
    });
  }

  const filteredRegs = regs.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.full_name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.course.toLowerCase().includes(q) || (r.phone || "").includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredContacts = contacts.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.subject || "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const filteredConsultations = consultations.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.service.toLowerCase().includes(q) || (c.company || "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-[#0D3B5C] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#F58220] rounded-lg flex items-center justify-center">
            <i className="fas fa-building text-white text-sm" />
          </div>
          <div>
            <div className="text-white font-bold leading-tight">Walk Business</div>
            <div className="text-white/50 text-xs">Admin Panel</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchAll} className="text-white/60 hover:text-white text-sm"><i className="fas fa-sync" /></button>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full transition">
            <i className="fas fa-sign-out-alt" /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: "Total Registrations", value: stats.total_registrations, icon: "fa-graduation-cap", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Today Registrations", value: stats.today_registrations, icon: "fa-calendar-day",   color: "text-orange-600", bg: "bg-orange-50" },
              { label: "Total Contacts",       value: stats.total_contacts,       icon: "fa-envelope",       color: "text-green-600", bg: "bg-green-50" },
              { label: "Today Contacts",       value: stats.today_contacts,       icon: "fa-bell",           color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Newsletter Subs",      value: stats.total_subscribers,    icon: "fa-paper-plane",    color: "text-cyan-600", bg: "bg-cyan-50" },
              { label: "Consultations",        value: stats.total_consultations,  icon: "fa-calendar-check", color: "text-rose-600", bg: "bg-rose-50" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <i className={`fas ${s.icon} ${s.color}`} />
                </div>
                <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
                <div className="text-gray-500 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100 flex flex-wrap items-center gap-3">
          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            {[
              { key: "regs",          label: "Registrations", icon: "fa-graduation-cap" },
              { key: "contacts",      label: "Contacts",       icon: "fa-envelope" },
              { key: "consultations", label: "Consultations",  icon: "fa-calendar-check" },
            ].map(t => (
              <button key={t.key} onClick={() => { setTab(t.key as "regs" | "contacts" | "consultations"); setSearch(""); setStatusFilter("all"); }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition ${tab === t.key ? "bg-[#0D3B5C] text-white" : "text-gray-500 hover:bg-gray-50"}`}>
                <i className={`fas ${t.icon} text-xs`} /> {t.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none" />
          </div>

          {/* Status filter */}
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-[#0D3B5C] focus:outline-none appearance-none bg-white">
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="enrolled">Enrolled</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Export buttons */}
          <div className="flex gap-2 ms-auto">
            <button onClick={() => exportFile("xlsx")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition">
              <i className="fas fa-file-excel" /> Excel
            </button>
            <button onClick={() => exportFile("pdf", tab === "regs" ? "registrations" : "contacts")}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition">
              <i className="fas fa-file-pdf" /> PDF
            </button>
          </div>
        </div>

        {/* Registrations Table */}
        {tab === "regs" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0D3B5C] text-white">
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Phone</th>
                    <th className="px-4 py-3 text-left font-semibold">Course</th>
                    <th className="px-4 py-3 text-left font-semibold">Country</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegs.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-16 text-gray-400"><i className="fas fa-inbox text-3xl mb-3 block" />No registrations yet</td></tr>
                  ) : filteredRegs.map((r, i) => (
                    <tr key={r.id} className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{r.id}</td>
                      <td className="px-4 py-3 font-semibold text-[#0D3B5C]">{r.full_name}</td>
                      <td className="px-4 py-3 text-gray-500">{r.email}</td>
                      <td className="px-4 py-3 text-gray-500">{r.phone || "—"}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{r.course}</td>
                      <td className="px-4 py-3 text-gray-500">{r.country || "—"}</td>
                      <td className="px-4 py-3">
                        <select value={r.status}
                          onChange={e => updateStatus("registrations", r.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[r.status] || "bg-gray-100 text-gray-600"}`}>
                          <option value="new">new</option>
                          <option value="contacted">contacted</option>
                          <option value="enrolled">enrolled</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleString("en-GB")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-100">
              Showing {filteredRegs.length} of {regs.length} registrations
            </div>
          </div>
        )}

        {/* Contacts Table */}
        {tab === "contacts" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0D3B5C] text-white">
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Phone</th>
                    <th className="px-4 py-3 text-left font-semibold">Subject</th>
                    <th className="px-4 py-3 text-left font-semibold">Message</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContacts.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-16 text-gray-400"><i className="fas fa-inbox text-3xl mb-3 block" />No messages yet</td></tr>
                  ) : filteredContacts.map((c, i) => (
                    <tr key={c.id} className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{c.id}</td>
                      <td className="px-4 py-3 font-semibold text-[#0D3B5C]">{c.name}</td>
                      <td className="px-4 py-3 text-gray-500">{c.email}</td>
                      <td className="px-4 py-3 text-gray-500">{c.phone || "—"}</td>
                      <td className="px-4 py-3 text-gray-700">{c.subject || "—"}</td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <button onClick={() => setExpandedMsg(expandedMsg === c.id ? null : c.id)}
                          className="text-left text-gray-500 hover:text-[#0D3B5C] text-xs">
                          {expandedMsg === c.id ? c.message : (c.message.substring(0, 50) + (c.message.length > 50 ? "..." : ""))}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <select value={c.status}
                          onChange={e => updateStatus("contacts", c.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[c.status] || "bg-gray-100 text-gray-600"}`}>
                          <option value="new">new</option>
                          <option value="contacted">contacted</option>
                          <option value="enrolled">enrolled</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(c.created_at).toLocaleString("en-GB")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-100">
              Showing {filteredContacts.length} of {contacts.length} messages
            </div>
          </div>
        )}

        {/* Consultations Table */}
        {tab === "consultations" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0D3B5C] text-white">
                    <th className="px-4 py-3 text-left font-semibold">#</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Phone</th>
                    <th className="px-4 py-3 text-left font-semibold">Company</th>
                    <th className="px-4 py-3 text-left font-semibold">Service</th>
                    <th className="px-4 py-3 text-left font-semibold">Date / Time</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsultations.length === 0 ? (
                    <tr><td colSpan={9} className="text-center py-16 text-gray-400"><i className="fas fa-calendar text-3xl mb-3 block" />No consultation requests yet</td></tr>
                  ) : filteredConsultations.map((c, i) => (
                    <tr key={c.id} className={`border-t border-gray-100 hover:bg-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                      <td className="px-4 py-3 text-gray-400 font-mono text-xs">{c.id}</td>
                      <td className="px-4 py-3 font-semibold text-[#0D3B5C]">{c.name}</td>
                      <td className="px-4 py-3 text-gray-500">{c.email}</td>
                      <td className="px-4 py-3 text-gray-500">{c.phone || "—"}</td>
                      <td className="px-4 py-3 text-gray-500">{c.company || "—"}</td>
                      <td className="px-4 py-3 text-[#F58220] font-medium">{c.service}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {c.preferred_date || "—"}<br />{c.preferred_time || ""}
                      </td>
                      <td className="px-4 py-3">
                        <select value={c.status}
                          onChange={e => updateStatus("consultations", c.id, e.target.value)}
                          className={`text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[c.status] || "bg-gray-100 text-gray-600"}`}>
                          <option value="pending">pending</option>
                          <option value="contacted">contacted</option>
                          <option value="confirmed">confirmed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(c.created_at).toLocaleString("en-GB")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 text-xs text-gray-400 border-t border-gray-100">
              Showing {filteredConsultations.length} of {consultations.length} requests
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Root Page ─────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("admin_token");
    if (stored) setToken(stored);
  }, []);

  function handleLogin(t: string) {
    sessionStorage.setItem("admin_token", t);
    setToken(t);
  }

  function handleLogout() {
    sessionStorage.removeItem("admin_token");
    setToken(null);
    router.refresh();
  }

  if (!token) return <LoginScreen onLogin={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
