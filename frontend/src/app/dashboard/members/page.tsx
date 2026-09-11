'use client';

import { useState } from 'react';

const mockMembers = [
  { id: '1', email: 'admin@phuchung.com.vn', name: 'Nguyễn Nhu Phi', role: 'Trưởng BKS', viewCount: 19, editCount: 2, createdAt: '2026-07-07 10:05' },
  { id: '2', email: 'ductaikt53a@gmail.com', name: 'Đào Đức Tài', role: 'Thành viên BKS', viewCount: 18, editCount: 1, createdAt: '2026-08-26 17:04' },
];

const modules = [
  'M1. Dashboard Tổng hợp',
  'M2. Chi phí QLDN-PHC',
  'M3. Giám sát Tuân thủ',
  'M4. Giám sát Công ty Con',
  'M5. Công ty Liên kết',
  'M6. Giám sát Dự án',
  'M7. Giám sát Dòng tiền',
  'M8. Giám sát Công nợ',
  'M9. Quan hệ Cổ đông',
  'M10. Công bố Thông tin'
];

export default function MembersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const openPermissions = (member: any) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#1a222c] min-h-[85vh] rounded-2xl shadow-xl p-8 text-slate-200 font-sans">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
          Quản Lý Thành Viên
        </h1>
        <p className="text-slate-400 mt-2">Mời người dùng mới và thu hồi quyền truy cập hệ thống của họ</p>
        <div className="inline-block mt-3 px-4 py-2 bg-emerald-900/30 border border-emerald-800 text-emerald-400 text-sm rounded-lg">
          <span className="font-bold mr-1">Chế độ Firebase:</span> Tài khoản tạo ở đây là tài khoản đăng nhập thật, mật khẩu được lưu an toàn trên Firebase.
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* Left Column: Invite Form */}
        <div className="w-1/3 bg-[#1e293b] rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            Mời Thành Viên Mới
          </h2>
          
          <form className="space-y-5" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Email người nhận</label>
              <input type="email" className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none" placeholder="vd: tuyen.pt@phuchung.com.vn" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Họ và tên</label>
              <input type="text" className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none" placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Thiết lập mật khẩu cấp</label>
              <input type="password" className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none" placeholder="Nhập mật khẩu cấp cho họ" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase">Vai trò truy cập</label>
              <select className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none appearance-none">
                <option>Khách (Chỉ xem báo cáo, ẩn nút vận hành)</option>
                <option>Thành viên BKS</option>
                <option>Trưởng BKS</option>
              </select>
            </div>
            <button className="w-full bg-[#0ea5e9] hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              Tạo & Mời Thành Viên
            </button>
          </form>
        </div>

        {/* Right Column: Member List */}
        <div className="w-2/3 bg-[#1e293b] rounded-xl border border-slate-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Thành Viên Có Quyền Truy Cập
              <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded-full">2</span>
            </h2>
            <span className="text-xs text-slate-500">Chỉ Admin mới xóa được tài khoản</span>
          </div>

          <div className="text-xs text-emerald-500 mb-4 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Danh sách và phân quyền dùng ở kho chung — mọi người đăng nhập ở máy nào cũng nhận đúng quyền.
          </div>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-400 uppercase text-xs border-b border-slate-700">
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Họ Tên</th>
                <th className="pb-3 font-semibold text-center">Vai Trò</th>
                <th className="pb-3 font-semibold text-center">Quyền</th>
                <th className="pb-3 font-semibold text-center">Ngày Tạo</th>
                <th className="pb-3 font-semibold text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {mockMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/50">
                  <td className="py-4 text-slate-300">{m.email}</td>
                  <td className="py-4 text-slate-300">
                    <div className="flex flex-col">
                      <span>{m.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <div className="w-8 h-8 rounded bg-blue-900/50 text-blue-400 flex items-center justify-center mb-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                      </div>
                      <span className="text-[10px] text-blue-400 font-medium leading-tight">{m.role}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center text-[11px] text-slate-400 leading-tight">
                    <span className="text-blue-400 font-bold">{m.viewCount}/19</span> xem<br/>
                    <span className="text-orange-400 font-bold">{m.editCount}</span> sửa<br/>
                    theo mẫu vai trò
                  </td>
                  <td className="py-4 text-center text-xs text-slate-500">
                    {m.createdAt.split(' ')[0]}<br/>{m.createdAt.split(' ')[1]}
                  </td>
                  <td className="py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openPermissions(m)} className="p-2 bg-blue-900/40 text-blue-400 rounded hover:bg-blue-600 hover:text-white transition-colors" title="Phân quyền">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      </button>
                      <button className="p-2 bg-purple-900/40 text-purple-400 rounded hover:bg-purple-600 hover:text-white transition-colors" title="Đổi mật khẩu">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                      </button>
                      <button className="p-2 bg-red-900/40 text-red-400 rounded hover:bg-red-600 hover:text-white transition-colors" title="Xóa tài khoản">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Modal */}
      {isModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-[#0f172a]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                Phân quyền truy cập
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-6 bg-[#111827]">
              <div className="mb-6">
                <div className="text-lg font-bold text-white">{selectedMember.name}</div>
                <div className="text-sm text-slate-400">
                  {selectedMember.email} · đang dùng <span className="font-semibold text-slate-300">mẫu quyền của vai trò {selectedMember.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-4 text-sm">
                <span className="text-slate-400">Áp nhanh theo mẫu vai trò:</span>
                <button className="px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800">Trưởng Ban Kiểm soát</button>
                <button className="px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800">Thành viên BKS</button>
                <button className="px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800">Tổng Giám Đốc</button>
                <button className="px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800">Giám đốc PHC-Land</button>
                <button className="px-3 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800">Khách (Chỉ xem)</button>
              </div>

              <div className="flex items-center gap-3 mb-6 text-sm">
                <span className="text-slate-400">Đặt tất cả:</span>
                <button className="px-4 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800">Ẩn hết</button>
                <button className="px-4 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800">Cho xem hết</button>
                <button className="px-4 py-1.5 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800">Cho sửa hết</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 bg-[#111827]">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-[#1e293b] z-10">
                  <tr className="text-xs uppercase font-semibold text-slate-400">
                    <th className="py-3 px-4 rounded-tl-lg">PHÂN HỆ</th>
                    <th className="py-3 px-4 rounded-tr-lg text-right">MỨC QUYỀN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {modules.map((mod, idx) => (
                    <tr key={idx} className="hover:bg-[#1e293b]/50 group transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-200">{mod}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex rounded-lg border border-slate-700 bg-[#0f172a] p-1">
                          <button className="px-4 py-1.5 text-xs font-medium rounded-md text-slate-400 hover:text-white flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                            Ẩn
                          </button>
                          <button className="px-4 py-1.5 text-xs font-medium rounded-md bg-[#0ea5e9] text-white flex items-center gap-1 shadow-sm">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            Xem
                          </button>
                          <button className="px-4 py-1.5 text-xs font-medium rounded-md text-slate-400 hover:text-white flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            Sửa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
