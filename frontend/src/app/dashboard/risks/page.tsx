'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function RisksPage() {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newRisk, setNewRisk] = useState({ title: '', description: '', severity: 'HIGH' });

  useEffect(() => {
    fetchFindings();
  }, []);

  const fetchFindings = async () => {
    try {
      const data = await api.get('/audit-findings');
      setFindings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await api.post('/audit-findings', newRisk);
      setShowForm(false);
      setNewRisk({ title: '', description: '', severity: 'HIGH' });
      fetchFindings(); // reload data
    } catch (err) {
      alert('Lỗi khi lưu rủi ro!');
    }
  };

  const getSeverityClass = (severity: string) => {
    if (severity === 'CRITICAL') return 'bg-red-100 text-red-800';
    if (severity === 'HIGH') return 'bg-orange-100 text-orange-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">Quản lý Rủi ro (Audit Findings) - <span className="text-blue-600">Dữ liệu thật (Live)</span></h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700"
        >
          {showForm ? 'Đóng' : '+ Ghi nhận rủi ro mới'}
        </button>
      </div>

      {showForm && (
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleSubmit} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm text-slate-600 mb-1">Mã/Tiêu đề Rủi ro</label>
              <input required type="text" className="w-full border p-2 rounded" value={newRisk.title} onChange={e => setNewRisk({...newRisk, title: e.target.value})} placeholder="VD: RR-2026-003" />
            </div>
            <div className="flex-2">
              <label className="block text-sm text-slate-600 mb-1">Mô tả</label>
              <input required type="text" className="w-full border p-2 rounded" value={newRisk.description} onChange={e => setNewRisk({...newRisk, description: e.target.value})} placeholder="Giao dịch sai thẩm quyền..." />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Mức độ</label>
              <select className="border p-2 rounded" value={newRisk.severity} onChange={e => setNewRisk({...newRisk, severity: e.target.value})}>
                <option value="CRITICAL">Nghiêm trọng</option>
                <option value="HIGH">Cao</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="LOW">Thấp</option>
              </select>
            </div>
            <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded font-medium">Lưu vào Database</button>
          </form>
        </div>
      )}

      <div className="p-6">
        {loading ? (
          <p className="text-slate-500">Đang tải dữ liệu từ Cloud...</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 border-b">ID</th>
                <th className="p-4 border-b">Tiêu đề</th>
                <th className="p-4 border-b">Mô tả rủi ro</th>
                <th className="p-4 border-b">Mức độ</th>
                <th className="p-4 border-b">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {findings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-4 border-b text-center text-slate-500">Chưa có dữ liệu nào trong Database Supabase. Hãy thêm mới!</td>
                </tr>
              ) : (
                findings.map((f: any) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="p-4 border-b text-sm text-slate-500">{f.id}</td>
                    <td className="p-4 border-b font-medium">{f.title}</td>
                    <td className="p-4 border-b">{f.description}</td>
                    <td className="p-4 border-b">
                      <span className={"px-2 py-1 rounded text-xs font-semibold " + getSeverityClass(f.severity)}>
                        {f.severity}
                      </span>
                    </td>
                    <td className="p-4 border-b font-medium text-slate-500">{f.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
