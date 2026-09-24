'use client';

import { useState, useMemo } from 'react';
import { EVIDENCE_MASTER_DATA, EvidenceItem } from '@/data/evidencesData';

export default function EvidencesPage() {
  const [evidences, setEvidences] = useState<EvidenceItem[]>(EVIDENCE_MASTER_DATA);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EvidenceItem | null>(null);

  // New Request Form State
  const [newReq, setNewReq] = useState({
    name: '',
    category: 'Tài chính & Kiểm toán',
    pic: 'Phòng Tài chính - Kế toán',
    details: '',
    law: 'Khoản 2 Điều 171 Luật Doanh nghiệp 2020',
    deadline: '15/10/2026',
    format_type: 'File mềm ký số (PDF)',
  });

  const filteredEvidences = useMemo(() => {
    return evidences.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.code.toLowerCase().includes(search.toLowerCase()) ||
        item.pic.toLowerCase().includes(search.toLowerCase()) ||
        item.details.toLowerCase().includes(search.toLowerCase());

      const matchCat = catFilter === 'ALL' || item.category === catFilter;
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchSearch && matchCat && matchStatus;
    });
  }, [evidences, search, catFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = evidences.length;
    const submitted = evidences.filter((e) => e.status === 'ĐÃ NỘP').length;
    const reviewing = evidences.filter((e) => e.status === 'ĐANG ĐỐI CHIẾU').length;
    const waiting = evidences.filter((e) => e.status === 'CHỜ NỘP').length;
    const overdue = evidences.filter((e) => e.status === 'QUÁ HẠN').length;
    return { total, submitted, reviewing, waiting, overdue };
  }, [evidences]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const created: EvidenceItem = {
      id: String(evidences.length + 1),
      code: `REQ-AD-${Math.floor(100 + Math.random() * 900)}`,
      name: newReq.name,
      category: newReq.category,
      details: newReq.details || 'Yêu cầu cung cấp hồ sơ kiểm tra đột xuất của Ban Kiểm soát',
      law: newReq.law,
      pic: newReq.pic,
      freq: 'Đột xuất',
      deadline: newReq.deadline,
      format_type: newReq.format_type,
      status: 'CHỜ NỘP',
    };

    setEvidences([created, ...evidences]);
    setShowRequestForm(false);
    setNewReq({
      name: '',
      category: 'Tài chính & Kiểm toán',
      pic: 'Phòng Tài chính - Kế toán',
      details: '',
      law: 'Khoản 2 Điều 171 Luật Doanh nghiệp 2020',
      deadline: '15/10/2026',
      format_type: 'File mềm ký số (PDF)',
    });
    alert('Đã gửi phiếu yêu cầu cung cấp hồ sơ thành công tới đơn vị đầu mối!');
  };

  const getStatusBadge = (status: string) => {
    if (status === 'ĐÃ NỘP') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (status === 'ĐANG ĐỐI CHIẾU') return 'bg-blue-100 text-blue-800 border-blue-300';
    if (status === 'CHỜ NỘP') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded">
              ĐIỀU 170 & 171 LUẬT DN 2020
            </span>
            <span className="text-xs text-slate-400 font-medium">BKS VẬN HÀNH 1 NĂM</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Thu Thập Hồ Sơ, Báo Cáo & Tài Liệu Giám Sát
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ma trận 65+ danh mục hồ sơ trọng yếu phủ kín 4 quý kiểm toán từ 8 đơn vị đầu mối chịu trách nhiệm cung cấp
          </p>
        </div>

        <button
          onClick={() => setShowRequestForm(!showRequestForm)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
          {showRequestForm ? 'Đóng form' : '+ Gửi Yêu Cầu Cung Cấp Mới'}
        </button>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase">Tổng danh mục hồ sơ</div>
          <div className="text-2xl font-black text-slate-800 mt-1">{stats.total}</div>
          <div className="text-[11px] text-slate-400 mt-1">Chuẩn hóa theo 5 nhóm kiểm toán</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm bg-gradient-to-br from-white to-emerald-50">
          <div className="text-xs font-semibold text-emerald-700 uppercase">Đã bàn giao đầy đủ</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.submitted}</div>
          <div className="text-[11px] text-emerald-600 mt-1">Đã lưu trữ mã hóa an toàn</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm bg-gradient-to-br from-white to-blue-50">
          <div className="text-xs font-semibold text-blue-700 uppercase">Đang đối chiếu / thẩm tra</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{stats.reviewing}</div>
          <div className="text-[11px] text-blue-600 mt-1">KSV đang kiểm tra tính xác thực</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm bg-gradient-to-br from-white to-red-50">
          <div className="text-xs font-semibold text-red-700 uppercase">Chưa nộp & Quá hạn</div>
          <div className="text-2xl font-black text-red-600 mt-1">{stats.overdue + stats.waiting}</div>
          <div className="text-[11px] text-red-600 mt-1 font-semibold">⚠️ {stats.overdue} hồ sơ quá hạn nộp</div>
        </div>
      </div>

      {/* New Request Modal / Form */}
      {showRequestForm && (
        <div className="bg-white border-2 border-blue-500 rounded-xl p-6 shadow-xl space-y-4">
          <div className="border-b pb-3">
            <h3 className="text-base font-bold text-slate-800">Tạo Phiếu Yêu Cầu Cung Cấp Hồ Sơ / Tài Liệu Mới</h3>
            <p className="text-xs text-slate-500 mt-0.5">Căn cứ thẩm quyền tiếp cận thông tin của Ban Kiểm soát (Điều 171 Luật Doanh nghiệp 2020)</p>
          </div>

          <form onSubmit={handleCreateRequest} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tên Hồ Sơ / Tài Liệu Yêu Cầu *</label>
              <input
                required
                type="text"
                value={newReq.name}
                onChange={(e) => setNewReq({ ...newReq, name: e.target.value })}
                placeholder="VD: Sổ chi tiết công nợ phải thu quá hạn trên 1 năm tại DA MIK..."
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nhóm Nghiệp Vụ</label>
              <select
                value={newReq.category}
                onChange={(e) => setNewReq({ ...newReq, category: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              >
                <option value="Nghị quyết & Điều hành">Nghị quyết & Điều hành</option>
                <option value="Tài chính & Kiểm toán">Tài chính & Kiểm toán</option>
                <option value="Giao dịch bên liên quan">Giao dịch bên liên quan</option>
                <option value="KSNB & Dự án">KSNB & Dự án</option>
                <option value="CBTT & Cổ đông">CBTT & Cổ đông</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Đơn Vị Đầu Mối Chịu Trách Nhiệm (PIC) *</label>
              <select
                value={newReq.pic}
                onChange={(e) => setNewReq({ ...newReq, pic: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              >
                <option value="Văn phòng HĐQT & Thư ký Công ty">Văn phòng HĐQT & Thư ký Công ty</option>
                <option value="Ban Tổng Giám đốc & Văn phòng Điều hành">Ban Tổng Giám đốc & Văn phòng Điều hành</option>
                <option value="Phòng Tài chính - Kế toán">Phòng Tài chính - Kế toán</option>
                <option value="Ban Kinh tế - Kế hoạch & Đấu thầu">Ban Kinh tế - Kế hoạch & Đấu thầu</option>
                <option value="Các Ban Quản lý Dự án & Giám đốc Dự án">Các Ban Quản lý Dự án & Giám đốc Dự án</option>
                <option value="Ban An toàn - Sức khỏe - Môi trường (HSE)">Ban An toàn - Sức khỏe - Môi trường (HSE)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hạn Chót Bàn Giao *</label>
              <input
                required
                type="text"
                value={newReq.deadline}
                onChange={(e) => setNewReq({ ...newReq, deadline: e.target.value })}
                placeholder="VD: 15/10/2026"
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hình Thức Bàn Giao</label>
              <select
                value={newReq.format_type}
                onChange={(e) => setNewReq({ ...newReq, format_type: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
              >
                <option value="File mềm ký số (PDF)">File mềm ký số (PDF)</option>
                <option value="File Excel gốc & Đối chiếu số liệu">File Excel gốc & Đối chiếu số liệu</option>
                <option value="Bản cứng gốc kiểm tra tại chỗ">Bản cứng gốc kiểm tra tại chỗ</option>
              </select>
            </div>

            <div className="lg:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Gửi Phiếu Yêu Cầu Chính Thức
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[260px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo Mã hồ sơ, tên tài liệu, đơn vị PIC nộp..."
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'ALL', label: 'Tất cả nhóm' },
            { id: 'Nghị quyết & Điều hành', label: 'HĐQT & TGĐ' },
            { id: 'Tài chính & Kiểm toán', label: 'Tài chính' },
            { id: 'Giao dịch bên liên quan', label: 'Bên liên quan' },
            { id: 'KSNB & Dự án', label: 'Dự án & Thi công' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCatFilter(cat.id)}
              className={"px-3 py-1.5 rounded-lg text-xs font-semibold transition-all " + (
                catFilter === cat.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white"
        >
          <option value="ALL">Tất cả trạng thái ({evidences.length})</option>
          <option value="ĐÃ NỘP">ĐÃ NỘP ({stats.submitted})</option>
          <option value="ĐANG ĐỐI CHIẾU">ĐANG ĐỐI CHIẾU ({stats.reviewing})</option>
          <option value="CHỜ NỘP">CHỜ NỘP ({stats.waiting})</option>
          <option value="QUÁ HẠN">QUÁ HẠN ({stats.overdue})</option>
        </select>
      </div>

      {/* Evidences Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Mã Hồ Sơ</th>
                <th className="p-3.5">Tên Hồ Sơ / Tài Liệu Thu Thập</th>
                <th className="p-3.5">Nhóm Nghiệp Vụ</th>
                <th className="p-3.5">Đơn vị Đầu Mối (PIC)</th>
                <th className="p-3.5">Hạn Chót</th>
                <th className="p-3.5 text-center">Trạng Thái</th>
                <th className="p-3.5 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredEvidences.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-blue-600">{item.code}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-900 max-w-sm">{item.name}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.details}</div>
                  </td>
                  <td className="p-3.5 text-slate-600 font-medium">{item.category}</td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-800">{item.pic}</span>
                    <div className="text-[10px] text-slate-400 font-mono">{item.freq}</div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{item.deadline}</td>
                  <td className="p-3.5 text-center">
                    <span className={"px-2.5 py-1 rounded-full text-[10px] font-bold border " + getStatusBadge(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    {item.status === 'ĐÃ NỘP' ? (
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 text-[11px] font-semibold transition-colors"
                      >
                        Tải an toàn (Watermark)
                      </button>
                    ) : item.status === 'QUÁ HẠN' ? (
                      <button
                        onClick={() => alert(`Đã gửi thông báo đôn đốc khẩn cấp tới ${item.pic} theo Điều 171 Luật Doanh nghiệp 2020!`)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200 text-[11px] font-bold transition-colors"
                      >
                        ⚡ Đôn đốc khẩn cấp
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const updated = evidences.map(e => e.id === item.id ? { ...e, status: 'ĐÃ NỘP' as const } : e);
                          setEvidences(updated);
                          alert(`Đã tiếp nhận hồ sơ ${item.code} và mã hóa thành công lưu vào kho lưu trữ!`);
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 text-[11px] font-semibold transition-colors"
                      >
                        Nộp hồ sơ
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Download with Watermark Simulation */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-slate-800 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Cơ Chế Bảo Vệ Tài Liệu</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">Tải Xuống Hồ Sơ Mã Hóa {selectedItem.code}</h3>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-blue-800">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Tài liệu được bảo vệ 2 lớp bởi BKS Secure Engine:
              </div>
              <p>• Mã hóa mức ứng dụng <strong>AES-256-GCM</strong> trước khi lưu vào Object Storage.</p>
              <p>• Đóng <strong>Watermark động</strong> chống rò rỉ: <em>"BKS VIEW ONLY · User: admin@phuchung.com.vn · Time: {new Date().toLocaleDateString('vi-VN')}"</em>.</p>
            </div>

            <div className="text-xs space-y-1">
              <div><strong>Hồ sơ:</strong> {selectedItem.name}</div>
              <div><strong>Căn cứ:</strong> {selectedItem.law}</div>
              <div><strong>Đơn vị nộp:</strong> {selectedItem.pic}</div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  alert(`Đang sinh Dynamic Watermark và tải file PDF an toàn: BKS_SECURE_${selectedItem.code}.pdf!`);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow"
              >
                Tải PDF Bản Ký Số (Watermark)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
