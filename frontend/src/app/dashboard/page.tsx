export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Tổng Số Rủi Ro Đang Xử Lý</div>
          <div className="text-3xl font-bold text-slate-800">12</div>
          <div className="text-red-500 text-sm mt-2 font-medium">↑ 2 rủi ro mức CAO mới</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Yêu Cầu Cung Cấp Hồ Sơ</div>
          <div className="text-3xl font-bold text-slate-800">4 / 15</div>
          <div className="text-amber-500 text-sm mt-2 font-medium">⏳ 3 hồ sơ quá hạn nộp</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-500 text-sm font-medium mb-1">Cảnh báo Bất thường (WORM Logs)</div>
          <div className="text-3xl font-bold text-slate-800">0</div>
          <div className="text-green-600 text-sm mt-2 font-medium">✓ Hệ thống an toàn</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Danh sách Rủi ro (Priority)</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
              <th className="p-4 border-b">Mã RR</th>
              <th className="p-4 border-b">Mô tả phát hiện</th>
              <th className="p-4 border-b">Mức độ</th>
              <th className="p-4 border-b">Hạn chót khắc phục</th>
              <th className="p-4 border-b">Hành động</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="hover:bg-slate-50">
              <td className="p-4 border-b font-medium">RR-2026-001</td>
              <td className="p-4 border-b">Giao dịch công ty con vượt thẩm quyền</td>
              <td className="p-4 border-b">
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">NGHIÊM TRỌNG</span>
              </td>
              <td className="p-4 border-b">15/09/2026</td>
              <td className="p-4 border-b">
                <button className="text-blue-600 hover:underline text-sm font-medium">Chi tiết (Encrypted)</button>
              </td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="p-4 border-b font-medium">RR-2026-002</td>
              <td className="p-4 border-b">Chỉ số CFO (Cash Flow) âm liên tiếp 2 quý</td>
              <td className="p-4 border-b">
                <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-semibold">CAO</span>
              </td>
              <td className="p-4 border-b">30/09/2026</td>
              <td className="p-4 border-b">
                <button className="text-blue-600 hover:underline text-sm font-medium">Chi tiết (Encrypted)</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
