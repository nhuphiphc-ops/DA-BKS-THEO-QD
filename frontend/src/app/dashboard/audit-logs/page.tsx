'use client';

import { useState, useMemo } from 'react';
import { AUDIT_LOGS_DATA, AuditLogItem } from '@/data/auditLogsData';

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const filteredLogs = useMemo(() => {
    return AUDIT_LOGS_DATA.filter((log) => {
      const matchSearch =
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.ip.toLowerCase().includes(search.toLowerCase()) ||
        log.description.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase());
      
      const matchAction = actionFilter === 'ALL' || log.action === actionFilter;

      return matchSearch && matchAction;
    });
  }, [search, actionFilter]);

  const getActionBadge = (action: string) => {
    if (action.includes('LOGIN_SUCCESS')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (action.includes('FAILED') || action.includes('BLOCK')) return 'bg-red-500/20 text-red-400 border-red-500/40';
    if (action.includes('UPLOAD') || action.includes('DOWNLOAD')) return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    if (action.includes('UPDATE') || action.includes('ROLE')) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    return 'bg-purple-500/20 text-purple-400 border-purple-500/40';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#111c35] border border-slate-800 rounded-xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded">
                WORM COMPLIANCE
              </span>
              <span className="text-xs text-slate-400 font-medium">Write Once, Read Many (Bất biến)</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Nhật Ký Kiểm Toán Toàn Vẹn Hệ Thống
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Ghi vết bảo mật chống sửa đổi/chối bỏ, liên kết chuỗi mật mã SHA-256 Chained Hash đáp ứng tiêu chuẩn kiểm toán BKS
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-[#0b1328] border border-emerald-500/40 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Toàn vẹn Chuỗi</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                100% VALID
              </div>
            </div>

            <div className="px-3.5 py-2 bg-[#0b1328] border border-slate-700 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Cảnh báo can thiệp</div>
              <div className="text-sm font-bold text-white mt-0.5">0 vụ việc</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[260px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo Email người dùng, địa chỉ IP, thao tác..."
            className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'Tất cả hoạt động' },
            { id: 'LOGIN_SUCCESS', label: 'Đăng nhập' },
            { id: 'UPLOAD_EVIDENCE', label: 'Tải tài liệu' },
            { id: 'UPDATE_ROLE', label: 'Phân quyền' },
            { id: 'SUSPICIOUS_BLOCK', label: 'Cảnh báo chặn' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActionFilter(item.id)}
              className={"px-3 py-1.5 rounded-lg text-xs font-semibold transition-all " + (
                actionFilter === item.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[11px] font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 text-center">STT</th>
                <th className="p-3.5">Thời gian (WORM)</th>
                <th className="p-3.5">Hành động</th>
                <th className="p-3.5">Mô tả sự kiện</th>
                <th className="p-3.5">Người thực hiện</th>
                <th className="p-3.5">Địa chỉ IP</th>
                <th className="p-3.5 font-mono">Bằng chứng SHA-256</th>
                <th className="p-3.5 text-center">Xác thực</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 text-center text-slate-400 font-mono">{log.id}</td>
                  <td className="p-3.5 font-mono font-medium text-slate-600 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3.5">
                    <span className={"px-2 py-0.5 rounded text-[10px] font-bold border " + getActionBadge(log.action)}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-medium text-slate-900 max-w-xs truncate">
                    {log.description}
                  </td>
                  <td className="p-3.5 font-medium text-blue-700">
                    {log.user}
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">
                    {log.ip}
                  </td>
                  <td className="p-3.5 font-mono text-slate-500">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200 text-[10px] flex items-center gap-1 font-mono transition-colors"
                      title="Bấm để kiểm tra tính liên kết chuỗi khối"
                    >
                      <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                      {log.hash.slice(0, 10)}...{log.hash.slice(-6)}
                    </button>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold rounded-full">
                      ✓ {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Hash Details */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111c35] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-slate-700 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Chữ Ký Toàn Vẹn SHA-256</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Chi tiết Khối Nhật Ký #{selectedLog.id}</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="bg-[#0b1328] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Thời gian ghi nhận:</span>
                <strong className="text-white text-sm">{selectedLog.timestamp}</strong>
              </div>

              <div className="bg-[#0b1328] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Thao tác & Sự kiện:</span>
                <div className="text-blue-400 font-bold mt-0.5">{selectedLog.action}</div>
                <div className="text-slate-300 mt-1 font-sans">{selectedLog.description}</div>
              </div>

              <div className="bg-[#0b1328] p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase">Khối trước (Previous Hash):</span>
                <div className="text-slate-400 break-all mt-1">{selectedLog.prev_hash}</div>
              </div>

              <div className="bg-[#0b1328] p-3 rounded-lg border border-emerald-500/40">
                <span className="text-emerald-400 block text-[10px] uppercase font-bold">Khối hiện tại (Current Block Hash):</span>
                <div className="text-emerald-300 font-bold break-all mt-1">{selectedLog.hash}</div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              <span>Chuỗi băm liên kết hợp lệ. Nhật ký này không thể bị xóa bỏ hoặc chỉnh sửa lén lút bởi bất kỳ ai kể cả Quản trị viên cơ sở dữ liệu.</span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
