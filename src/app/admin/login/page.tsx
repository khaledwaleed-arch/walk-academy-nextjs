"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = sessionStorage.getItem("admin_token");
    if (t) router.replace("/admin");
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.token) {
      sessionStorage.setItem("admin_token", data.token);
      router.replace("/admin");
    } else {
      setErr("كلمة المرور غير صحيحة");
    }
  }

  return (
    <div className="min-h-screen bg-[#1d2327] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-10 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1d2327] rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Walk Academy</h1>
          <p className="text-gray-500 text-sm mt-1">لوحة تحكم المشرف</p>
        </div>
        <form onSubmit={submit} className="space-y-4" dir="rtl">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">كلمة المرور</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              placeholder="أدخل كلمة المرور"
              required
              autoFocus
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:border-[#2271b1] focus:outline-none focus:ring-2 focus:ring-[#2271b1]/20 transition"
            />
          </div>
          {err && <p className="text-red-500 text-sm text-center">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold rounded-lg transition disabled:opacity-60"
          >
            {loading ? "جارٍ التحقق..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
