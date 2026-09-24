'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-full">
              BKS EXECUTIVE COMMAND CENTER
            </span>
            <span className="text-xs text-slate-400">Niên độ tài chính 2026</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
            Trung Tâm Giám Sát, Kiểm Soát & Tuân Thủ
          </h1>
          <p className="text-xs lg:text-sm text-slate-300 mt-1 max-w-2xl">
            Hệ thống thông tin điều hành dành riêng cho Ban Kiểm soát: Giám sát Nghị quyết HĐQT/ĐHĐCĐ, thu thập tài liệu độc lập, thẩm tra tài sản thiết bị và quản lý rủi ro trọng yếu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/dashboard/equipment"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <span>🏗️ Quản lý Thiết bị ECONS</span>
            <span>→</span>
          </Link>

          <Link
            href="/dashboard/risks"
            className="px-4 py-2.5 bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <span>⚠️ Quản lý Rủi ro</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* 5 Core Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Metric 1 */}
        <Link href="/dashboard/risks" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-red-400 transition-all group">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rủi ro trọng yếu</div>
          <div className="text-2xl font-black text-slate-900 mt-1 group-hover:text-red-600 transition-colors">12 rủi ro</div>
          <div className="text-[11px] text-red-600 font-semibold mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            2 mức NGHIÊM TRỌNG
          </div>
        </Link>

        {/* Metric 2 */}
        <Link href="/dashboard/plans" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all group">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kế hoạch & Nghị quyết</div>
          <div className="text-2xl font-black text-slate-900 mt-1 group-hover:text-blue-600 transition-colors">8 Nghị quyết</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            100% Đúng thẩm quyền
          </div>
        </Link>

        {/* Metric 3 */}
        <Link href="/dashboard/evidences" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 transition-all group">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hồ sơ thu thập</div>
          <div className="text-2xl font-black text-slate-900 mt-1 group-hover:text-amber-600 transition-colors">54 Danh mục</div>
          <div className="text-[11px] text-amber-600 font-semibold mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            4 hồ sơ đôn đốc nộp
          </div>
        </Link>

        {/* Metric 4 */}
        <Link href="/dashboard/equipment" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-emerald-400 transition-all group">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Thiết bị lớn ECONS</div>
          <div className="text-2xl font-black text-slate-900 mt-1 group-hover:text-emerald-600 transition-colors">36 Cẩu tháp</div>
          <div className="text-[11px] text-slate-500 mt-2 font-mono">
            Nguyên giá <strong>28.55 tỷ</strong>
          </div>
        </Link>

        {/* Metric 5 */}
        <Link href="/dashboard/audit-logs" className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-purple-400 transition-all group">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bảo mật WORM Logs</div>
          <div className="text-2xl font-black text-slate-900 mt-1 group-hover:text-purple-600 transition-colors">SHA-256</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Toàn vẹn 100%
          </div>
        </Link>
      </div>

      {/* Grid: 6 Module Hub Cards */}
      <div>
        <h2 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <span>Phân Hệ Nghiệp Vụ Giám Sát</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Box 1 */}
          <Link
            href="/dashboard/equipment"
            className="p-5 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl transition-all block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🏗️</span>
              <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">Truy cập →</span>
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Quản Lý Thiết Bị & Doanh Thu ECONS</h3>
            <p className="text-xs text-slate-500 mt-1">
              Đối soát 1.959 dòng tồn kho, theo dõi 36 cẩu tháp nguyên giá 28.55 tỷ và bảng kê HH2 Gamuda 11.4 tỷ.
            </p>
          </Link>

          {/* Box 2 */}
          <Link
            href="/dashboard/plans"
            className="p-5 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl transition-all block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📋</span>
              <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">Truy cập →</span>
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Kế Hoạch & Nghị Quyết HĐQT</h3>
            <p className="text-xs text-slate-500 mt-1">
              Kiểm tra tính thẩm quyền và tiến độ thực thi các Nghị quyết của ĐHĐCĐ, HĐQT và Quyết định của Ban TGĐ.
            </p>
          </Link>

          {/* Box 3 */}
          <Link
            href="/dashboard/evidences"
            className="p-5 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl transition-all block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📁</span>
              <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">Truy cập →</span>
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Thu Thập Hồ Sơ & Bằng Chứng</h3>
            <p className="text-xs text-slate-500 mt-1">
              Ma trận 65+ danh mục hồ sơ 1 năm BKS, quản lý đầu mối bàn giao theo Điều 171 Luật Doanh nghiệp 2020.
            </p>
          </Link>

          {/* Box 4 */}
          <Link
            href="/dashboard/risks"
            className="p-5 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl transition-all block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">⚠️</span>
              <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">Truy cập →</span>
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Quản Lý Rủi Ro (Audit Findings)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Ghi nhận các phát hiện kiểm toán, phân loại mức độ rủi ro nghiêm trọng và theo dõi biện pháp khắc phục.
            </p>
          </Link>

          {/* Box 5 */}
          <Link
            href="/dashboard/members"
            className="p-5 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl transition-all block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">👥</span>
              <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">Truy cập →</span>
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Quản Lý Thành Viên & Phân Quyền</h3>
            <p className="text-xs text-slate-500 mt-1">
              Quản trị nhân sự kiểm soát, ma trận phân quyền RBAC đa cấp độ, đặt lại mật khẩu và khóa tài khoản an toàn.
            </p>
          </Link>

          {/* Box 6 */}
          <Link
            href="/dashboard/audit-logs"
            className="p-5 bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl transition-all block group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🛡️</span>
              <span className="text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">Truy cập →</span>
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-blue-600">Nhật Ký An Ninh WORM Logs</h3>
            <p className="text-xs text-slate-500 mt-1">
              Kiểm tra tính toàn vẹn chuỗi khối SHA-256 Chained Hash, chống chỉnh sửa và chối bỏ theo chuẩn an toàn thông tin.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
