export default function RisksPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">Quản lý Rủi ro (Audit Findings)</h2>
        <button className="px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">
          + Ghi nhận rủi ro mới
        </button>
      </div>
      <div className="p-6">
        <div className="flex gap-4 mb-6">
          <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex-1">
            <span className="block text-red-600 text-sm font-medium">Nghiêm trọng</span>
            <span className="block text-2xl font-bold text-red-700">2</span>
          </div>
          <div className="px-4 py-3 bg-orange-50 border border-orange-200 rounded-lg flex-1">
            <span className="block text-orange-600 text-sm font-medium">Cao</span>
            <span className="block text-2xl font-bold text-orange-700">5</span>
          </div>
          <div className="px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg flex-1">
            <span className="block text-yellow-600 text-sm font-medium">Trung bình</span>
            <span className="block text-2xl font-bold text-yellow-700">12</span>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
              <th className="p-4 border-b">Mã RR</th>
              <th className="p-4 border-b">Mô tả rủi ro</th>
              <th className="p-4 border-b">Mức độ</th>
              <th className="p-4 border-b">Trạng thái xử lý (Action Plan)</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="hover:bg-slate-50">
              <td className="p-4 border-b font-medium">RR-2026-001</td>
              <td className="p-4 border-b">Giao dịch công ty con vượt thẩm quyền</td>
              <td className="p-4 border-b"><span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">NGHIÊM TRỌNG</span></td>
              <td className="p-4 border-b"><span className="text-orange-600 font-medium">IN_PROGRESS</span></td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="p-4 border-b font-medium">RR-2026-002</td>
              <td className="p-4 border-b">Chỉ số CFO (Cash Flow) âm liên tiếp 2 quý</td>
              <td className="p-4 border-b"><span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-semibold">CAO</span></td>
              <td className="p-4 border-b"><span className="text-slate-500 font-medium">OPEN</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
