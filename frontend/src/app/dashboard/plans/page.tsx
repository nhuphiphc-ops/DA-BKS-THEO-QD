export default function PlansPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">Quản lý Kế hoạch & Nghị quyết</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700">
          + Thêm Kế hoạch mới
        </button>
      </div>
      <div className="p-6">
        <p className="text-slate-600 mb-4">Danh sách các kế hoạch kiểm toán định kỳ và nghị quyết HDQT/ĐHĐCĐ cần giám sát.</p>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
              <th className="p-4 border-b">Số Hiệu</th>
              <th className="p-4 border-b">Tên Kế hoạch / Nghị quyết</th>
              <th className="p-4 border-b">Cấp Ban Hành</th>
              <th className="p-4 border-b">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="hover:bg-slate-50">
              <td className="p-4 border-b font-medium">NQ-01/2026/ĐHĐCĐ</td>
              <td className="p-4 border-b">Nghị quyết Đại hội đồng cổ đông thường niên 2026</td>
              <td className="p-4 border-b">ĐHĐCĐ</td>
              <td className="p-4 border-b"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">ĐÚNG THẨM QUYỀN</span></td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="p-4 border-b font-medium">BKS-KH-Q3</td>
              <td className="p-4 border-b">Kế hoạch kiểm toán nội bộ Quý 3/2026</td>
              <td className="p-4 border-b">Trưởng BKS</td>
              <td className="p-4 border-b"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">ĐANG THỰC HIỆN</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
