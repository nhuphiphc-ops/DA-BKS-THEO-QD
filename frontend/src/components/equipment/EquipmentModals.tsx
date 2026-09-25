'use client';

import React, { useState } from 'react';
import { HeavyEquipmentItem, GamudaRentalItem } from '@/data/equipmentData';

// ============================================================================
// HELPER: CSV EXPORT UTILITY WITH UTF-8 BOM FOR PERFECT EXCEL OPENING
// ============================================================================
export const downloadCSV = (filename: string, headers: string[], rows: (string | number | undefined | null)[][]) => {
  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...rows.map(row => row.map(val => {
      const s = String(val ?? '').replace(/"/g, '""');
      return `"${s}"`;
    }).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================================================
// 1. FLOATING TOAST NOTIFICATION
// ============================================================================
export function ToastNotification({ message, onClose }: { message: string | null; onClose: () => void }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950/95 border border-emerald-500 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-bounce-short">
      <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
        ✓
      </div>
      <div className="text-xs font-semibold pr-2">{message}</div>
      <button 
        onClick={onClose}
        className="text-emerald-400 hover:text-white text-base leading-none p-1"
      >
        ✕
      </button>
    </div>
  );
}

// ============================================================================
// 2. EXPORT DATA MODAL (MULTI-SELECTION & INSTANT DOWNLOAD)
// ============================================================================
export function ExportDataModal({
  isOpen,
  onClose,
  heavyEquipmentData,
  gamudaRentalData,
  inventoryTickets,
  contractsData,
  onNotify,
}: {
  isOpen: boolean;
  onClose: () => void;
  heavyEquipmentData: HeavyEquipmentItem[];
  gamudaRentalData: GamudaRentalItem[];
  inventoryTickets: any[];
  contractsData: any[];
  onNotify: (msg: string) => void;
}) {
  if (!isOpen) return null;

  const exportHeavy = () => {
    const headers = ['STT', 'Mã máy', 'Tên thiết bị', 'Nhóm', 'Nguyên giá', 'Hạn khấu hao', 'Vị trí hiện tại', 'Trạng thái', 'CP Bảo dưỡng', 'Khấu hao LK', 'Giá trị còn lại'];
    const rows = heavyEquipmentData.map((item, idx) => [
      idx + 1,
      item.code,
      item.name,
      item.group,
      item.cost,
      item.date_end,
      item.location,
      item.status,
      item.maint_cost,
      item.depreciation,
      item.remaining_value,
    ]);
    downloadCSV('ECONS_Danh_Sach_Thiet_Bi_Lon_Cau_Thap.csv', headers, rows);
    onNotify('Đã xuất thành công file Excel Báo cáo Thiết bị lớn (36 cẩu tháp)!');
  };

  const exportGamuda = () => {
    const headers = ['Mã VT', 'Tên thiết bị / vật tư', 'Nguồn gốc', 'Số lượng x ngày', 'Đơn giá ngày (đ)', 'Thành tiền (đ)'];
    const rows = gamudaRentalData.map(item => [
      item.code,
      item.name,
      item.source,
      item.quantity_days,
      item.unit_price,
      item.total_amount,
    ]);
    downloadCSV('ECONS_Bang_Ke_Thanh_Toan_Gamuda_HH2.csv', headers, rows);
    onNotify('Đã xuất file Excel Bảng kê quyết toán Gamuda HH2 (11.4 tỷ)!');
  };

  const exportTickets = () => {
    const headers = ['STT', 'Số phiếu kho', 'Loại phiếu', 'Ngày chứng từ', 'Kho xuất / Nguồn', 'Kho nhận / Đích', 'Đối tượng giao nhận', 'Số dòng', 'Trạng thái'];
    const rows = inventoryTickets.map((t, idx) => [
      idx + 1,
      t.code,
      t.type,
      t.date,
      t.source,
      t.target,
      t.partner,
      t.rows,
      t.status,
    ]);
    downloadCSV('ECONS_So_Theo_Doi_Phieu_Kho_Xuat_Nhap_DC.csv', headers, rows);
    onNotify('Đã xuất file Excel Sổ theo dõi 1.369 phiếu kho thiết bị!');
  };

  const exportContracts = () => {
    const headers = ['Số hợp đồng', 'Phân loại', 'Đối tác / Bên thuê', 'Dự án công trình', 'Ngày bắt đầu', 'Giá trị HĐ', 'Khai báo giá', 'Trạng thái'];
    const rows = contractsData.map(c => [
      c.code,
      c.type,
      c.partner,
      c.project,
      c.date_start,
      c.val,
      c.declared,
      c.status,
    ]);
    downloadCSV('ECONS_Danh_Muc_119_Hop_Dong_Kinh_Te.csv', headers, rows);
    onNotify('Đã xuất file Excel Danh mục 119 Hợp đồng kinh tế!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111c35] border border-slate-700 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-lg">
            📊
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Xuất Báo Cáo Excel Thiết Bị & Kho Bãi</h2>
            <p className="text-xs text-slate-400">Trích xuất bảng dữ liệu chuẩn hóa sang định dạng Microsoft Excel (.csv UTF-8)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-6">
          <div className="p-4 rounded-xl bg-[#0b1328] border border-slate-800 hover:border-blue-500 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Tài sản cố định</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">36 cẩu tháp</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">Danh mục Thiết bị lớn & Khấu hao</h4>
              <p className="text-xs text-slate-400 mt-1">Gồm nguyên giá 28.5 tỷ, khấu hao lũy kế, chi phí bảo dưỡng sửa chữa và vị trí công trường.</p>
            </div>
            <button 
              onClick={exportHeavy}
              className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow"
            >
              <span>📥 Tải Excel Thiết bị lớn</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#0b1328] border border-slate-800 hover:border-emerald-500 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Doanh thu dự án</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">11.4 tỷ VNĐ</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">Bảng kê Gamuda HH2 (2025-2026)</h4>
              <p className="text-xs text-slate-400 mt-1">Chi tiết 58 dòng vật tư, giàn giáo ringlock, cẩu tháp và doanh thu ngày của công trình.</p>
            </div>
            <button 
              onClick={exportGamuda}
              className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow"
            >
              <span>📥 Tải Excel Bảng kê Gamuda</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#0b1328] border border-slate-800 hover:border-amber-500 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Nhật ký điều chuyển</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">1.369 phiếu</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">Sổ Phiếu Kho Nhập / Xuất / Điều chuyển</h4>
              <p className="text-xs text-slate-400 mt-1">Toàn bộ 1.369 chứng từ kho giữa các dự án MIK, Gamuda, Thái Nguyên, Lương Sơn.</p>
            </div>
            <button 
              onClick={exportTickets}
              className="mt-4 w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow"
            >
              <span>📥 Tải Excel Sổ Phiếu Kho</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#0b1328] border border-slate-800 hover:border-purple-500 transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Hợp đồng kinh tế</span>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">119 HĐ</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">Danh mục Hợp đồng thuê thiết bị</h4>
              <p className="text-xs text-slate-400 mt-1">Tổng hợp 67 HĐ cho thuê nội bộ & ngoài cùng 50 HĐ đi thuê thiết bị từ nhà cung cấp.</p>
            </div>
            <button 
              onClick={exportContracts}
              className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow"
            >
              <span>📥 Tải Excel Hợp đồng kinh tế</span>
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. AUDIT SESSION MODAL (MỞ PHIÊN KIỂM KÊ MỚI)
// ============================================================================
export function AuditSessionModal({
  isOpen,
  onClose,
  onCreateSession,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (session: { title: string; warehouse: string; leader: string; date: string; note: string }) => void;
}) {
  const [title, setTitle] = useState('Phiên kiểm kê định kỳ đối soát toàn diện Quý 3/2026');
  const [warehouse, setWarehouse] = useState('Econs.Kho thiết bị Lương Sơn');
  const [leader, setLeader] = useState('Trần Văn Bình - Ban KS Thiết bị');
  const [date, setDate] = useState('25/09/2026');
  const [note, setNote] = useState('Kiểm đếm 100% cẩu tháp, giàn giáo ringlock và vật tư cốp pha nhôm theo Quyết định số 18/QĐ-BKS');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSession({ title, warehouse, leader, date, note });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111c35] border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
            📋
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Mở Phiên Kiểm Kê Đối Soát Kho Mới</h2>
            <p className="text-xs text-slate-400">Khởi tạo quy trình kiểm kê hiện trường & đối soát thực tế với số liệu iReport</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tên đợt / Phiên kiểm kê</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kho bãi / Công trường</label>
              <select 
                value={warehouse} 
                onChange={e => setWarehouse(e.target.value)}
                className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Econs.Kho thiết bị Lương Sơn">Econs.Kho thiết bị Lương Sơn</option>
                <option value="PHC - HH2 Gamuda">PHC - HH2 Gamuda</option>
                <option value="PHC - PĐB Thái Nguyên">PHC - PĐB Thái Nguyên</option>
                <option value="PHC - KS Hà Thành">PHC - KS Hà Thành</option>
                <option value="PHC - Sun Hà Nam">PHC - Sun Hà Nam</option>
                <option value="PHC - MIK An Khánh">PHC - MIK An Khánh</option>
                <option value="Toàn bộ 65 kho bãi">Toàn bộ 65 kho bãi (Tổng kiểm kê)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ngày bắt đầu kiểm</label>
              <input 
                type="text" 
                value={date} 
                onChange={e => setDate(e.target.value)} 
                className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Trưởng ban / Tổ kiểm kê</label>
            <input 
              type="text" 
              value={leader} 
              onChange={e => setLeader(e.target.value)} 
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Phạm vi & Ghi chú đối soát</label>
            <textarea 
              rows={3} 
              value={note} 
              onChange={e => setNote(e.target.value)} 
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow"
            >
              ✓ Xác nhận mở phiên kiểm kê
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 4. INSPECTION MODAL (44 MÁY CHƯA KIỂM ĐỊNH)
// ============================================================================
export function InspectionModal({
  isOpen,
  onClose,
  onNotify,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}) {
  if (!isOpen) return null;

  const UNINSPECTED_LIST = [
    { code: 'CT5513.01', name: 'Cẩu tháp SQ5513 seri 20160259', loc: 'PHC - KS Hà Thành', status: 'Hết hạn kiểm định', expiry: '15/08/2026', danger: 'Cao' },
    { code: 'CT6013.03', name: 'Cẩu tháp TC6013-6 seri 6011', loc: 'Econs.Kho thiết bị Lương Sơn', status: 'Hết hạn kiểm định', expiry: '20/08/2026', danger: 'Cao' },
    { code: 'CT6015.01', name: 'Cẩu tháp QTZ6015 seri 20150912', loc: 'PHC - HH2 Gamuda', status: 'Hết hạn kiểm định', expiry: '02/09/2026', danger: 'Nghiêm trọng' },
    { code: 'VT0001', name: 'Vận thăng lồng đôi GJJ-SC200/200GD', loc: 'PHC - BV TIM HN CS2', status: 'Hết hạn kiểm định', expiry: '10/09/2026', danger: 'Cao' },
    { code: 'TN.TAS.TC01', name: 'Cẩu tháp Model 7020-12 (TC01 Thái Nguyên)', loc: 'PHC - PĐB Thái Nguyên', status: 'Chưa có tem KĐ an toàn', expiry: 'Chưa kiểm', danger: 'Trung bình' },
    { code: 'TN.TAS.TC02', name: 'Cẩu tháp Model 6513-8 (TC02 Thái Nguyên)', loc: 'PHC - PĐB Thái Nguyên', status: 'Chưa có tem KĐ an toàn', expiry: 'Chưa kiểm', danger: 'Trung bình' },
    { code: 'TN.TAS.TC03', name: 'Cẩu tháp Model 7525-16 (TC03 Thái Nguyên)', loc: 'PHC - PĐB Thái Nguyên', status: 'Chưa có tem KĐ an toàn', expiry: 'Chưa kiểm', danger: 'Trung bình' },
    { code: 'TN.VS.NL.T7020', name: 'Cẩu tháp ZOOMLION T7020-10E', loc: 'Econs.Kho thiết bị Lương Sơn', status: 'Chưa có tem KĐ an toàn', expiry: 'Chưa kiểm', danger: 'Trung bình' },
    { code: 'TN.DN.VT1', name: 'Vận thăng lồng đôi TW 2,0 tấn (Đông Nam Việt Trì)', loc: 'Econs.Kho thiết bị Lương Sơn', status: 'Chưa có hồ sơ KĐ gốc', expiry: 'Chưa kiểm', danger: 'Trung bình' },
    { code: 'TN.SUN.VT1.TW', name: 'Vận thăng lồng đôi TW 2,0 tấn (Sun Hà Nam)', loc: 'PHC - Sun Hà Nam (CC04-CC06)', status: 'Chưa có tem KĐ an toàn', expiry: 'Chưa kiểm', danger: 'Cao' },
  ];

  const handleExportInspection = () => {
    const headers = ['STT', 'Mã máy', 'Tên thiết bị', 'Vị trí hiện tại', 'Tình trạng kiểm định', 'Hạn kiểm định', 'Mức độ cảnh báo'];
    const rows = UNINSPECTED_LIST.map((item, idx) => [
      idx + 1,
      item.code,
      item.name,
      item.loc,
      item.status,
      item.expiry,
      item.danger,
    ]);
    downloadCSV('ECONS_Danh_Sach_44_Thiet_Bi_Chua_Kiem_Dinh.csv', headers, rows);
    onNotify('Đã xuất danh sách thiết bị cần kiểm định an toàn!');
  };

  const handleBookInspection = () => {
    onNotify('Đã lập phiếu yêu cầu Kiểm định Kỹ thuật An toàn Lao động gửi Trung tâm Kiểm định I!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111c35] border border-red-800/80 w-full max-w-4xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-lg">
            ⚠️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">44 Thiết Bị Chưa Đủ Điều Kiện Vận Hành</h2>
              <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold rounded">
                BẮT BUỘC KIỂM ĐỊNH
              </span>
            </div>
            <p className="text-xs text-slate-400">4 máy hết hạn hiệu lực tem an toàn · 40 máy chưa từng nộp hồ sơ kiểm định kỹ thuật</p>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 rounded-xl border border-slate-800 bg-[#0b1328] mb-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 uppercase text-[10px] font-semibold sticky top-0 border-b border-slate-800">
              <tr>
                <th className="p-3">Mã máy</th>
                <th className="p-3">Tên thiết bị</th>
                <th className="p-3">Vị trí hiện tại</th>
                <th className="p-3">Tình trạng hồ sơ</th>
                <th className="p-3">Hạn KĐ</th>
                <th className="p-3 text-center">Rủi ro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {UNINSPECTED_LIST.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-blue-400">{item.code}</td>
                  <td className="p-3 font-medium text-white">{item.name}</td>
                  <td className="p-3 text-slate-400">{item.loc}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950/80 text-red-400 border border-red-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-300">{item.expiry}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.danger === 'Nghiêm trọng' ? 'bg-red-600 text-white' :
                      item.danger === 'Cao' ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {item.danger}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-300 mb-4">
          <strong>Cảnh báo an toàn thi công:</strong> Theo Thông tư 53/2016/TT-BLĐTBXH, thiết bị nâng hạ không có tem kiểm định an toàn còn hiệu lực tuyệt đối không được phép đưa vào vận hành tại các công trường Phục Hưng Holdings.
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <button 
            onClick={handleExportInspection}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
          >
            📥 Xuất Excel danh sách 44 máy
          </button>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
            >
              Đóng
            </button>
            <button 
              onClick={handleBookInspection}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5"
            >
              ✓ Đăng ký kiểm định khẩn cấp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. MAINTENANCE MODAL (25 MÁY ĐẾN HẠN BẢO DƯỠNG)
// ============================================================================
export function MaintenanceModal({
  isOpen,
  onClose,
  onNotify,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}) {
  if (!isOpen) return null;

  const OVERDUE_MAINTENANCE = [
    { code: 'CT5513.01', name: 'Cẩu tháp SQ5513 seri 20160259', loc: 'PHC - KS Hà Thành', dateDue: '15/09/2026', overdueDays: 9, items: 'Kiểm tra tời nâng, thay dầu hộp giảm tốc', team: 'Đội BD Econs 1' },
    { code: 'CT6013.01', name: 'Cẩu tháp TC6013-6 seri 6007', loc: 'Econs.Kho thiết bị Lương Sơn', dateDue: '18/09/2026', overdueDays: 6, items: 'Bôi mỡ vòng bi quay toa, hiệu chỉnh phanh', team: 'Đội BD Econs 2' },
    { code: 'CT6013.02', name: 'Cẩu tháp TC6013-6 seri 166009', loc: 'PHC - Sun Hà Nam', dateDue: '20/09/2026', overdueDays: 4, items: 'Xiết bu lông chân đế, kiểm tra cáp tải', team: 'Đội BD Econs 1' },
    { code: 'VT0001', name: 'Vận thăng GJJ-SC200/200GD', loc: 'PHC - BV TIM HN CS2', dateDue: '16/09/2026', overdueDays: 8, items: 'Thử tải phanh chống rơi, vệ sinh thanh răng', team: 'Đội BD Econs 3' },
    { code: 'CT6015.02', name: 'Cẩu tháp QTZ6015 seri 20160312', loc: 'PHC - HH2 Gamuda', dateDue: '22/09/2026', overdueDays: 2, items: 'Bảo trì hệ thống biến tần và tủ điện động lực', team: 'Đội BD Econs 2' },
  ];

  const handleExport = () => {
    const headers = ['STT', 'Mã máy', 'Tên thiết bị', 'Vị trí', 'Hạn bảo dưỡng', 'Quá hạn (ngày)', 'Hạng mục bảo dưỡng', 'Đội phụ trách'];
    const rows = OVERDUE_MAINTENANCE.map((item, idx) => [
      idx + 1,
      item.code,
      item.name,
      item.loc,
      item.dateDue,
      item.overdueDays,
      item.items,
      item.team,
    ]);
    downloadCSV('ECONS_Ke_Hoach_Bao_Duong_Dinh_Ky.csv', headers, rows);
    onNotify('Đã xuất file Excel kế hoạch bảo dưỡng định kỳ!');
  };

  const handleDispatch = () => {
    onNotify('Đã tạo lệnh điều động Đội Kỹ thuật Econs tiến hành bảo dưỡng ngay!');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111c35] border border-amber-800/80 w-full max-w-4xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
            🔧
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">25 Thiết Bị Quá Hạn & Sắp Đến Hạn Bảo Dưỡng</h2>
              <span className="px-2 py-0.5 bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold rounded">
                CẦN BẢO TRÌ ĐỊNH KỲ
              </span>
            </div>
            <p className="text-xs text-slate-400">Sớm nhất từ ngày 15/09/2026 — yêu cầu bảo trì định kỳ tránh sự cố ngừng máy trên công trường</p>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 rounded-xl border border-slate-800 bg-[#0b1328] mb-4">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0f172a] text-slate-400 uppercase text-[10px] font-semibold sticky top-0 border-b border-slate-800">
              <tr>
                <th className="p-3">Mã máy</th>
                <th className="p-3">Tên thiết bị</th>
                <th className="p-3">Vị trí</th>
                <th className="p-3">Hạn bảo dưỡng</th>
                <th className="p-3 text-center">Quá hạn</th>
                <th className="p-3">Hạng mục kiểm tra</th>
                <th className="p-3">Đội phụ trách</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {OVERDUE_MAINTENANCE.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono font-bold text-blue-400">{item.code}</td>
                  <td className="p-3 font-medium text-white">{item.name}</td>
                  <td className="p-3 text-slate-400">{item.loc}</td>
                  <td className="p-3 font-mono text-slate-300">{item.dateDue}</td>
                  <td className="p-3 text-center font-mono font-bold text-amber-400">
                    +{item.overdueDays} ngày
                  </td>
                  <td className="p-3 text-slate-300">{item.items}</td>
                  <td className="p-3 text-emerald-400 font-semibold">{item.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
          >
            📥 Xuất Excel lịch bảo dưỡng
          </button>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
            >
              Đóng
            </button>
            <button 
              onClick={handleDispatch}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow flex items-center gap-1.5"
            >
              ✓ Lập lệnh điều động bảo dưỡng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. CREATE TICKET MODAL (LẬP PHIẾU XUẤT / NHẬP / ĐIỀU CHUYỂN KHO)
// ============================================================================
export function CreateTicketModal({
  isOpen,
  onClose,
  onCreateTicket,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateTicket: (ticket: any) => void;
}) {
  const [type, setType] = useState<'Xuất kho' | 'Nhập kho' | 'Điều chuyển'>('Điều chuyển');
  const [code, setCode] = useState(`DC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-001`);
  const [source, setSource] = useState('Econs.Kho thiết bị Lương Sơn');
  const [target, setTarget] = useState('PHC - HH2 Gamuda');
  const [partner, setPartner] = useState('ECONS');
  const [itemCode, setItemCode] = useState('RL0001');
  const [itemName, setItemName] = useState('Chân giáo Ringlock D48x2500x2,5mm');
  const [quantity, setQuantity] = useState('500');
  const [driver, setDriver] = useState('Nguyễn Văn Tuấn (Xe 29C-882.14)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTicket({
      id: String(Date.now()),
      code,
      type,
      date: new Date().toLocaleDateString('vi-VN'),
      source: type === 'Nhập kho' ? '—' : source,
      target: type === 'Xuất kho' ? '—' : target,
      partner,
      rows: 1,
      status: 'ĐÃ DUYỆT',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111c35] border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
            📦
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Tạo Phiếu Kho Thiết Bị Mới</h2>
            <p className="text-xs text-slate-400">Xuất kho, nhập kho hoặc điều chuyển tài sản & giàn giáo giữa các công trường</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Loại chứng từ</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value as any)}
                className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="Điều chuyển">Điều chuyển nội bộ</option>
                <option value="Xuất kho">Xuất kho cho thuê</option>
                <option value="Nhập kho">Nhập kho trả hàng</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Số phiếu</label>
              <input 
                type="text" 
                value={code} 
                onChange={e => setCode(e.target.value)} 
                className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kho nguồn (Xuất)</label>
              <input 
                type="text" 
                value={source} 
                disabled={type === 'Nhập kho'}
                onChange={e => setSource(e.target.value)} 
                className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kho đích (Nhận)</label>
              <input 
                type="text" 
                value={target} 
                disabled={type === 'Xuất kho'}
                onChange={e => setTarget(e.target.value)} 
                className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white"
              />
            </div>
          </div>

          <div className="p-3 bg-[#0b1328] border border-slate-800 rounded-xl space-y-3">
            <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Vật tư xuất nhập</div>
            <div className="grid grid-cols-3 gap-2">
              <input 
                type="text" 
                placeholder="Mã VT" 
                value={itemCode} 
                onChange={e => setItemCode(e.target.value)}
                className="bg-[#111c35] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono" 
              />
              <input 
                type="text" 
                placeholder="Tên thiết bị" 
                value={itemName} 
                onChange={e => setItemName(e.target.value)}
                className="col-span-2 bg-[#111c35] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" 
                placeholder="Số lượng" 
                value={quantity} 
                onChange={e => setQuantity(e.target.value)}
                className="bg-[#111c35] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
              />
              <input 
                type="text" 
                placeholder="Tài xế / Biển số xe" 
                value={driver} 
                onChange={e => setDriver(e.target.value)}
                className="bg-[#111c35] border border-slate-700 rounded-lg px-2.5 py-1.5 text-white" 
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow"
            >
              ✓ Lưu phiếu kho & Ghi sổ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 7. TICKET DETAIL MODAL (XEM CHI TIẾT & HÌNH ẢNH HIỆN TRƯỜNG ĐÍNH KÈM)
// ============================================================================
export function TicketDetailModal({
  ticket,
  onClose,
  onNotify,
}: {
  ticket: any | null;
  onClose: () => void;
  onNotify: (msg: string) => void;
}) {
  if (!ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111c35] border border-slate-700 w-full max-w-3xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg">✕</button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
            📄
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Chứng Từ Phiếu Kho: {ticket.code}</h2>
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded">
                {ticket.status}
              </span>
            </div>
            <p className="text-xs text-slate-400">Ngày lập phiếu: {ticket.date} · Đơn vị giao dịch: {ticket.partner}</p>
          </div>
        </div>

        {/* Ticket Header Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#0b1328] border border-slate-800 rounded-xl mb-4 text-xs">
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Loại nghiệp vụ</div>
            <div className="font-bold text-blue-400 mt-0.5">{ticket.type}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Kho xuất (Nguồn)</div>
            <div className="font-medium text-white mt-0.5 truncate">{ticket.source}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Kho nhận (Đích)</div>
            <div className="font-medium text-white mt-0.5 truncate">{ticket.target}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Đối tác giao nhận</div>
            <div className="font-bold text-emerald-400 mt-0.5">{ticket.partner}</div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider text-slate-300">
            Danh mục vật tư trong phiếu ({ticket.rows} dòng)
          </h4>
          <div className="rounded-xl border border-slate-800 bg-[#0b1328] overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#0f172a] text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Mã VT</th>
                  <th className="p-2.5">Tên vật tư thiết bị</th>
                  <th className="p-2.5">ĐVT</th>
                  <th className="p-2.5 text-right">Số lượng</th>
                  <th className="p-2.5">Tình trạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="p-2.5 font-mono font-bold text-blue-400">RL0001</td>
                  <td className="p-2.5 font-medium text-white">Chân giáo Ringlock D48x2500x2,5mm</td>
                  <td className="p-2.5 text-slate-400">Cây</td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-400">650</td>
                  <td className="p-2.5 text-emerald-400">Tốt 100%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-mono font-bold text-blue-400">RL0007</td>
                  <td className="p-2.5 font-medium text-white">Giằng giáo Ringlock D42x600x2mm</td>
                  <td className="p-2.5 text-slate-400">cái</td>
                  <td className="p-2.5 text-right font-mono font-bold text-emerald-400">1.200</td>
                  <td className="p-2.5 text-emerald-400">Tốt 100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Photos Attached Section (Matching requirements in file ảnh.docx) */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider text-slate-300">
              Ảnh kiểm soát hiện trường & Biên bản giao nhận đính kèm
            </h4>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded font-mono">
              3 ảnh lưu trữ
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#0b1328] border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center group hover:border-blue-500 transition-all cursor-pointer">
              <div className="text-2xl mb-1">🚚</div>
              <div className="text-xs font-semibold text-white">Ảnh xe xếp tải</div>
              <div className="text-[10px] text-slate-400">Xe 29C-882.14 tại cổng kho</div>
            </div>

            <div className="bg-[#0b1328] border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center group hover:border-blue-500 transition-all cursor-pointer">
              <div className="text-2xl mb-1">📦</div>
              <div className="text-xs font-semibold text-white">Tem kiểm định & Bó giáo</div>
              <div className="text-[10px] text-slate-400">Quy cách bó 50 cây/kiện</div>
            </div>

            <div className="bg-[#0b1328] border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center group hover:border-blue-500 transition-all cursor-pointer">
              <div className="text-2xl mb-1">✍️</div>
              <div className="text-xs font-semibold text-white">Biên bản ký nhận</div>
              <div className="text-[10px] text-slate-400">Đầy đủ chữ ký thủ kho & lái xe</div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <button 
            onClick={() => onNotify(`Đã tải xuống phiếu kho ${ticket.code} định dạng PDF!`)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
          >
            🖨️ In phiếu kho (PDF)
          </button>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 8. GAMUDA APPENDIX MODAL (PHỤ LỤC HỢP ĐỒNG HH2 GAMUDA)
// ============================================================================
export function GamudaAppendixModal({
  isOpen,
  onClose,
  onNotify,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111c35] border border-blue-500/40 w-full max-w-3xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg">✕</button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
            📜
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Phụ Lục Hợp Đồng Số 18/2025/HĐ-ECONS/PHC-HH2</h2>
            <p className="text-xs text-slate-400">Dự án: Tòa nhà hỗn hợp HH2 Gamuda Gardens · Thời gian thuê: 24/09/2025 – 24/09/2026</p>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 space-y-4 pr-1 text-xs">
          <div className="p-4 bg-[#0b1328] border border-slate-800 rounded-xl">
            <h4 className="text-sm font-bold text-white mb-2">ĐIỀU 1: CÁC BÊN THAM GIA</h4>
            <div className="grid grid-cols-2 gap-4 text-slate-300">
              <div>
                <strong className="text-emerald-400">BÊN CHO THUÊ (BÊN A):</strong>
                <p>CÔNG TY CỔ PHẦN THIẾT BỊ VÀ XÂY DỰNG ECONS</p>
                <p className="text-slate-400">Đại diện: Ông Nguyễn Thế Tài — Giám đốc</p>
              </div>
              <div>
                <strong className="text-blue-400">BÊN THUÊ (BÊN B):</strong>
                <p>CÔNG TY CỔ PHẦN XÂY DỰNG PHỤC HƯNG HOLDINGS</p>
                <p className="text-slate-400">Ban Chỉ Huy Công Trường HH2 Gamuda</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#0b1328] border border-slate-800 rounded-xl">
            <h4 className="text-sm font-bold text-white mb-2">ĐIỀU 2: ĐƠN GIÁ THUÊ & NGUYÊN TẮC TÍNH</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 leading-relaxed">
              <li><strong>Cẩu tháp QTZ6015:</strong> 85.000.000 đ/tháng (đã bao gồm ca máy, thợ vận hành trực 2 ca).</li>
              <li><strong>Hệ giáo Ringlock & phụ kiện:</strong> Tính theo số lượng tồn thực tế x đơn giá ngày (dao động 79 đ – 288 đ/chi tiết/ngày).</li>
              <li><strong>Chi phí vận chuyển & tháo lắp:</strong> Bên B chịu chi phí vận chuyển một lần theo quyết toán thực tế.</li>
              <li><strong>Bồi thường hư hao:</strong> Áp dụng theo quy chế vật tư mất mát của Công ty thiết bị ban hành.</li>
            </ul>
          </div>

          <div className="p-4 bg-[#0b1328] border border-slate-800 rounded-xl">
            <h4 className="text-sm font-bold text-white mb-2">ĐIỀU 3: CHU KỲ QUYẾT TOÁN</h4>
            <p className="text-slate-300 leading-relaxed">
              Hai bên chốt khối lượng và ký biên bản đối soát vào ngày 24 hàng tháng. Thời hạn thanh toán trong vòng 30 ngày kể từ ngày Ban kiểm soát và Giám đốc ký duyệt bảng kê.
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <button 
            onClick={() => onNotify('Đã tải bản scan PDF Phụ lục Hợp đồng Gamuda HH2!')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
          >
            📥 Tải bản scan PDF hợp đồng
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 9. UPDATE PRICE MODAL (KHAI BÁO ĐƠN GIÁ ALTC1200)
// ============================================================================
export function UpdatePriceModal({
  isOpen,
  onClose,
  onSavePrice,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSavePrice: (code: string, price: number) => void;
}) {
  const [code, setCode] = useState('ALTC1200');
  const [name, setName] = useState('Thanh chống nhôm ALTC 1200mm');
  const [unitPrice, setUnitPrice] = useState('1450');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePrice(code, Number(unitPrice));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111c35] border border-amber-500/50 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-lg">
            🏷️
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Khai Báo Đơn Giá Thuê</h2>
            <p className="text-xs text-slate-400">Cập nhật đơn giá ngày vào bảng kê đối soát Gamuda HH2</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mã vật tư</label>
            <input 
              type="text" 
              value={code} 
              disabled
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-blue-400 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tên thiết bị / vật tư</label>
            <input 
              type="text" 
              value={name} 
              disabled
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-slate-300"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Đơn giá ngày áp dụng (VNĐ/ngày)</label>
            <input 
              type="number" 
              value={unitPrice} 
              onChange={e => setUnitPrice(e.target.value)}
              required
              className="w-full bg-[#0b1328] border border-emerald-500/60 rounded-lg px-3 py-2 text-emerald-400 font-mono font-bold text-base focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Khuyến nghị căn cứ HĐ chuẩn: 1.450 đ/cây/ngày</span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow"
            >
              ✓ Cập nhật đơn giá & Tính lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 10. CREATE CONTRACT MODAL (LẬP HỢP ĐỒNG KINH TẾ MỚI)
// ============================================================================
export function CreateContractModal({
  isOpen,
  onClose,
  onCreateContract,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreateContract: (contract: any) => void;
}) {
  const [code, setCode] = useState('2809/2026/HĐTTB/PHC-ECONS');
  const [type, setType] = useState('Cho thuê thiết bị');
  const [partner, setPartner] = useState('Công ty cổ phần xây dựng Phục Hưng Holdings');
  const [project, setProject] = useState('PHC - KĐT Nam Vĩnh Yên');
  const [val, setVal] = useState('1.850.000.000 đ');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateContract({
      code,
      type,
      partner,
      project,
      date_start: new Date().toLocaleDateString('vi-VN'),
      date_end: 'còn hiệu lực',
      val,
      declared: '12 dòng giá · 2 khoản chi',
      status: 'Đang hiệu lực',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111c35] border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-lg">
            📑
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Tạo Hợp Đồng Thuê Mới</h2>
            <p className="text-xs text-slate-400">Đăng ký hợp đồng cho thuê thiết bị nội bộ hoặc thuê ngoài</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Số hợp đồng</label>
            <input 
              type="text" 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Loại hợp đồng</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)}
                className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white"
              >
                <option value="Cho thuê thiết bị">Cho thuê thiết bị</option>
                <option value="Đi thuê ngoài">Đi thuê ngoài</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Giá trị dự toán</label>
              <input 
                type="text" 
                value={val} 
                onChange={e => setVal(e.target.value)} 
                className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Đối tác / Bên thuê</label>
            <input 
              type="text" 
              value={partner} 
              onChange={e => setPartner(e.target.value)} 
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Dự án công trình</label>
            <input 
              type="text" 
              value={project} 
              onChange={e => setProject(e.target.value)} 
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg shadow"
            >
              ✓ Đăng ký hợp đồng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 11. ADD HEAVY EQUIPMENT MODAL (KHAI BÁO THIẾT BỊ LỚN MỚI)
// ============================================================================
export function AddHeavyEquipmentModal({
  isOpen,
  onClose,
  onAddEquipment,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddEquipment: (item: HeavyEquipmentItem) => void;
}) {
  const [code, setCode] = useState('CT6515.01');
  const [name, setName] = useState('Cẩu tháp Zoomlion TC6515-10');
  const [group, setGroup] = useState('Cẩu tháp và các phụ kiện · 36 thiết bị');
  const [cost, setCost] = useState('1850000000');
  const [location, setLocation] = useState('PHC - KĐT Nam Vĩnh Yên');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = Number(cost) || 0;
    onAddEquipment({
      stt: Date.now(),
      code,
      name,
      group,
      cost: c,
      date_use: '25/09/2026',
      date_end: '25/09/2031',
      location,
      loc_src: 'theo phiếu kho',
      status: 'Đang dùng',
      maint_cost: 0,
      depreciation: 0,
      remaining_value: c,
      total_spent: c,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111c35] border border-blue-500/40 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
            🏗️
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Khai Báo Thiết Bị Lớn Mới</h2>
            <p className="text-xs text-slate-400">Đăng ký cẩu tháp, vận thăng lồng hoặc cẩu xích vào hệ thống tài sản ECONS</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mã thiết bị</label>
              <input 
                type="text" 
                value={code} 
                onChange={e => setCode(e.target.value)} 
                className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nguyên giá tài sản (VNĐ)</label>
              <input 
                type="number" 
                value={cost} 
                onChange={e => setCost(e.target.value)} 
                className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tên thiết bị & Số seri</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Vị trí hiện tại / Công trường</label>
            <input 
              type="text" 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow"
            >
              ✓ Đăng ký tài sản lớn
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 12. ADD TENANT MODAL (THÊM BÊN THUÊ MỚI)
// ============================================================================
export function AddTenantModal({
  isOpen,
  onClose,
  onAddTenant,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddTenant: (tenant: any) => void;
}) {
  const [code, setCode] = useState('BT.NEWPARTNER');
  const [name, setName] = useState('');
  const [mst, setMst] = useState('');
  const [internal, setInternal] = useState(false);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAddTenant({
      code,
      name,
      mst: mst || '—',
      internal,
      note: note || 'Thêm mới ngày 25/09/2026',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-[#111c35] border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-lg">
            🏢
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Thêm Bên Thuê / Đối Tác Mới</h2>
            <p className="text-xs text-slate-400">Khai báo danh bạ bên thuê giàn giáo & thiết bị</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mã bên thuê</label>
            <input 
              type="text" 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tên công ty / Đối tác</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              placeholder="VD: CÔNG TY CỔ PHẦN ĐẦU TƯ XÂY DỰNG..."
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mã số thuế</label>
            <input 
              type="text" 
              value={mst} 
              onChange={e => setMst(e.target.value)} 
              placeholder="VD: 0101311315"
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-300 font-medium">
            <input 
              type="checkbox" 
              checked={internal} 
              onChange={e => setInternal(e.target.checked)} 
              className="rounded"
            />
            <span>Đơn vị thành viên nội bộ PHC Holdings</span>
          </label>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Ghi chú đối soát</label>
            <input 
              type="text" 
              value={note} 
              onChange={e => setNote(e.target.value)} 
              placeholder="Ghi chú người duyệt, số HĐ liên quan..."
              className="w-full bg-[#0b1328] border border-slate-700 rounded-lg px-3 py-2 text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow"
            >
              ✓ Lưu bên thuê
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
