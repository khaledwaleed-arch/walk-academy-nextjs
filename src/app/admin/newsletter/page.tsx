'use client';
import { useEffect, useState } from 'react';

interface Subscriber {
  id: number;
  email: string;
  created_at: string;
}

export default function NewsletterAdminPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = () => {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem('admin_token') || localStorage.getItem('adminToken') || '';
  };

  const load = async () => {
    setLoading(true);
    const token = getToken();
    try {
      const res = await fetch('/api/admin/newsletter', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setSubscribers(data.subscribers || []);
      setTotal(data.total || 0);
    } catch (e) {
      setError('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id: number, email: string) => {
    if (!confirm(`Remove ${email} from newsletter?`)) return;
    const token = getToken();
    await fetch(`/api/admin/newsletter?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    load();
  };

  useEffect(() => { load(); }, []);

  const exportCSV = () => {
    const csv = ['ID,Email,Date', ...subscribers.map(s =>
      `${s.id},"${s.email}","${new Date(s.created_at).toLocaleString('en-GB')}"`
    )].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0D3B5C]">Newsletter Subscribers</h1>
          <p className="text-gray-500 mt-1">Total: {total} subscribers</p>
        </div>
        <button
          onClick={exportCSV}
          className="bg-[#0D3B5C] text-white px-4 py-2 rounded-lg hover:bg-[#0a2d47] transition-colors"
        >
          Export CSV
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      {subscribers.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No subscribers yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0D3B5C] text-white">
                <th className="text-left p-3 text-sm">ID</th>
                <th className="text-left p-3 text-sm">Email</th>
                <th className="text-left p-3 text-sm">Subscribed</th>
                <th className="text-left p-3 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 text-sm text-gray-500">{s.id}</td>
                  <td className="p-3 text-sm font-medium">{s.email}</td>
                  <td className="p-3 text-sm text-gray-500">
                    {new Date(s.created_at).toLocaleDateString('en-GB', {
                      year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => deleteSubscriber(s.id, s.email)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
