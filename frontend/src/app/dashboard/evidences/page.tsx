export default function EvidencesPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">Thu thập Hồ sơ (Audit Evidences)</h2>
        <button className="px-4 py-2 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-900">
          Gửi yêu cầu cung cấp hồ sơ
        </button>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-1">Mã hóa AES-256 Kích hoạt</h3>
            <p className="text-sm text-blue-600">Tất cả tài liệu tải lên đều được mã hóa theo thời gian thực và đóng Watermark chống chụp lén.</p>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider">
              <th className="p-4 border-b">Yêu Cầu</th>
              <th className="p-4 border-b">Đơn vị nhận</th>
              <th className="p-4 border-b">Hạn chót</th>
              <th className="p-4 border-b">Trạng thái nộp</th>
              <th className="p-4 border-b">Tài liệu đính kèm</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="hover:bg-slate-50">
              <td className="p-4 border-b font-medium">Báo cáo tài chính Q2/2026</td>
              <td className="p-4 border-b">Ban Tài chính Kế toán</td>
              <td className="p-4 border-b">20/08/2026</td>
              <td className="p-4 border-b"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">ĐÃ NỘP</span></td>
              <td className="p-4 border-b"><button className="text-blue-600 hover:underline text-sm font-medium">Tải xuống (Secure Link)</button></td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="p-4 border-b font-medium">Hợp đồng vay vốn NH X</td>
              <td className="p-4 border-b">Ban Nguồn vốn</td>
              <td className="p-4 border-b">15/09/2026</td>
              <td className="p-4 border-b"><span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">CHƯA NỘP (QUÁ HẠN)</span></td>
              <td className="p-4 border-b"><button className="text-slate-400 cursor-not-allowed text-sm font-medium">Trống</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
