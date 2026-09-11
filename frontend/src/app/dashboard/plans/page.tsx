'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    resolution_code: '', 
    title: '', 
    issuer_level: 'DHDCD',
    compliance_status: 'DUNG_THAM_QUYEN' 
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const data = await api.get('/resolutions');
      setPlans(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put('/resolutions/' + editingId, formData);
      } else {
        await api.post('/resolutions', formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({ resolution_code: '', title: '', issuer_level: 'DHDCD', compliance_status: 'DUNG_THAM_QUYEN' });
      fetchPlans();
    } catch (err) {
      alert('Lỗi khi lưu Kế hoạch!');
    }
  };

  const handleEdit = (plan: any) => {
    setFormData({
      resolution_code: plan.resolution_code,
      title: plan.title,
      issuer_level: plan.issuer_level,
      compliance_status: plan.status
    });
    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dòng này?')) return;
    try {
      await api.delete('/resolutions/' + id);
      fetchPlans();
    } catch (err) {
      alert('Lỗi khi xóa!');
    }
  };

  const getStatusClass = (status: string) => {
    if (status === 'VI_PHAM') return 'bg-red-100 text-red-800';
    if (status === 'DUNG_THAM_QUYEN') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">Quản lý Kế hoạch & Nghị quyết - <span className="text-blue-600">Dữ liệu thật (Live)</span></h2>
        <button 
          onClick={() => { setShowForm(!showForm); setEditingId(null); }}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
        >
          {showForm ? 'Đóng' : '+ Thêm Kế hoạch mới'}
        </button>
      </div>

      {showForm && (
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm text-slate-600 mb-1">Số Hiệu NQ</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.resolution_code} onChange={e => setFormData({...formData, resolution_code: e.target.value})} placeholder="VD: NQ-01/2026/DHDCD" />
            </div>
            <div className="flex-2 min-w-[300px]">
              <label className="block text-sm text-slate-600 mb-1">Tên Kế hoạch / Nghị quyết</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Nghị quyết ĐHĐCĐ thường niên 2026..." />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Cấp Ban Hành</label>
              <select className="border p-2 rounded" value={formData.issuer_level} onChange={e => setFormData({...formData, issuer_level: e.target.value})}>
                <option value="DHDCD">ĐHĐCĐ</option>
                <option value="HDQT">HĐQT</option>
                <option value="TRUONG_BKS">Trưởng BKS</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Trạng thái</label>
              <select className="border p-2 rounded" value={formData.compliance_status} onChange={e => setFormData({...formData, compliance_status: e.target.value})}>
                <option value="DUNG_THAM_QUYEN">ĐÚNG THẨM QUYỀN</option>
                <option value="DANG_THUC_HIEN">ĐANG THỰC HIỆN</option>
                <option value="VI_PHAM">VỊ PHẠM</option>
              </select>
            </div>
            <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded font-medium">
              {editingId ? 'Cập nhật' : 'Lưu vào Database'}
            </button>
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
                <th className="p-4 border-b">STT</th>
                <th className="p-4 border-b">Số Hiệu</th>
                <th className="p-4 border-b">Tên Kế hoạch / Nghị quyết</th>
                <th className="p-4 border-b">Cấp Ban Hành</th>
                <th className="p-4 border-b">Trạng Thái</th>
                <th className="p-4 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 border-b text-center text-slate-500">Chưa có dữ liệu.</td>
                </tr>
              ) : (
                plans.map((p: any, index: number) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4 border-b text-sm text-slate-500 text-center font-medium">{index + 1}</td>
                    <td className="p-4 border-b font-medium text-slate-900">{p.resolution_code}</td>
                    <td className="p-4 border-b">{p.title}</td>
                    <td className="p-4 border-b text-sm font-semibold">{p.issuer_level}</td>
                    <td className="p-4 border-b">
                      <span className={"px-2 py-1 rounded text-xs font-semibold " + getStatusClass(p.status)}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-4 border-b">
                      <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700 text-sm font-medium mr-3">Sửa</button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Xóa</button>
                    </td>
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
