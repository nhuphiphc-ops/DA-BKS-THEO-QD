'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

const MODULES = [
  'M1. Dashboard Tổng hợp',
  'M2. Kế hoạch & Nghị quyết',
  'M3. Thu thập Hồ sơ',
  'M4. Quản lý Rủi ro',
  'M5. Quản lý Thành viên',
  'M6. Audit Logs (WORM)',
];

const ROLES: Record<string, string> = {
  'SUPER_ADMIN': 'Trưởng BKS',
  'AUDITOR': 'Thành viên BKS',
  'AUDIT_TARGET': 'Khách (Chỉ xem)',
  'SYSTEM_ADMIN': 'Quản trị Hệ thống',
};

const ROLE_API_MAP: Record<string, string> = {
  'Trưởng BKS': 'SUPER_ADMIN',
  'Thành viên BKS': 'AUDITOR',
  'Khách (Chỉ xem)': 'AUDIT_TARGET',
  'Quản trị Hệ thống': 'SYSTEM_ADMIN',
};

type Member = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
  locked_until?: string | null;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Form invite
  const [form, setForm] = useState({ email: '', full_name: '', password: '', role: 'AUDIT_TARGET' });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Permission modal
  const [permMember, setPermMember] = useState<Member | null>(null);

  // Reset password modal
  const [resetMember, setResetMember] = useState<Member | null>(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await api.get('/users');
      setMembers(data);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/users', form);
      setForm({ email: '', full_name: '', password: '', role: 'AUDIT_TARGET' });
      fetchMembers();
    } catch (err: any) {
      setFormError(err.message || 'Lỗi không xác định từ máy chủ.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (member: Member) => {
    if (!confirm('Xác nhận XÓA tài khoản ' + member.full_name + ' (' + member.email + ')?')) return;
    try {
      await api.delete('/users/' + member.id);
      fetchMembers();
    } catch {
      alert('Lỗi khi xóa tài khoản!');
    }
  };

  const handleResetPassword = async () => {
    if (!resetMember || !newPassword.trim()) return;
    try {
      await api.put('/users/' + resetMember.id + '/reset-password', { password: newPassword });
      setResetMember(null);
      setNewPassword('');
      alert('Đặt lại mật khẩu thành công!');
    } catch {
      alert('Lỗi khi đặt lại mật khẩu!');
    }
  };

  const handleUpdateRole = async (member: Member, newRole: string) => {
    try {
      await api.put('/users/' + member.id + '/role', { role: ROLE_API_MAP[newRole] || newRole });
      fetchMembers();
    } catch {
      alert('Lỗi khi cập nhật vai trò!');
    }
  };

  return (
    <div className="bg-[#1a222c] min-h-[85vh] rounded-2xl shadow-xl p-8 text-slate-200 font-sans">

      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
          <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Quản Lý Thành Viên
        </h1>
        <p className="text-slate-400 mt-2">Mời người dùng mới và thu hồi quyền truy cập hệ thống</p>
        <div className="inline-block mt-3 px-4 py-2 bg-emerald-900/30 border border-emerald-800 text-emerald-400 text-sm rounded-lg">
          Dữ liệu thật từ CSDL — mật khẩu được băm một chiều bằng <strong>Bcrypt</strong>
        </div>
      </div>

      <div className="flex gap-6 items-start">

        {/* Left: Invite Form */}
        <div className="w-[340px] shrink-0 bg-[#1e293b] rounded-xl border border-slate-700 p-6">
          <h2 className="text-base font-bold text-white mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
            Mời Thành Viên Mới
          </h2>
          {formError && <p className="text-red-400 text-sm mb-3 bg-red-900/30 px-3 py-2 rounded">{formError}</p>}
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Email người nhận</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                placeholder="vd: nguyen.va@congty.com" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Họ và tên</label>
              <input required type="text" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Mật khẩu cấp ban đầu</label>
              <input required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                placeholder="Tối thiểu 6 ký tự" minLength={6} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase">Vai trò truy cập</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none">
                <option value="AUDIT_TARGET">Khách (Chỉ xem báo cáo)</option>
                <option value="AUDITOR">Thành viên BKS</option>
                <option value="SUPER_ADMIN">Trưởng BKS</option>
                <option value="SYSTEM_ADMIN">Quản trị Hệ thống</option>
              </select>
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-[#0ea5e9] hover:bg-blue-500 disabled:opacity-60 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
              {submitting ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
              )}
              {submitting ? 'Đang tạo...' : 'Tạo & Mời Thành Viên'}
            </button>
          </form>
        </div>

        {/* Right: Member List */}
        <div className="flex-1 bg-[#1e293b] rounded-xl border border-slate-700 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              Thành Viên Có Quyền Truy Cập
              <span className="bg-slate-700 text-white text-xs px-2 py-0.5 rounded-full">{members.length}</span>
            </h2>
            <span className="text-xs text-slate-500">Chỉ Admin mới xóa được tài khoản</span>
          </div>

          {loading ? (
            <p className="text-slate-500 py-6 text-center">Đang tải dữ liệu từ Cloud...</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase font-semibold text-slate-400 border-b border-slate-700">
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Họ Tên</th>
                  <th className="pb-3 text-center">Vai Trò</th>
                  <th className="pb-3 text-center">Trạng Thái</th>
                  <th className="pb-3 text-center">Ngày Tạo</th>
                  <th className="pb-3 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {members.map(m => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 text-slate-300 text-sm">{m.email}</td>
                    <td className="py-4 text-slate-300 font-medium">{m.full_name}</td>
                    <td className="py-4 text-center">
                      <select
                        value={m.role}
                        onChange={e => handleUpdateRole(m, e.target.value)}
                        className="bg-blue-900/30 border border-blue-800 text-blue-300 text-xs px-2 py-1 rounded-lg focus:outline-none cursor-pointer"
                      >
                        <option value="AUDIT_TARGET">Khách (Chỉ xem)</option>
                        <option value="AUDITOR">Thành viên BKS</option>
                        <option value="SUPER_ADMIN">Trưởng BKS</option>
                        <option value="SYSTEM_ADMIN">Quản trị HT</option>
                      </select>
                    </td>
                    <td className="py-4 text-center">
                      {m.locked_until && new Date(m.locked_until) > new Date() ? (
                        <span className="px-2 py-1 bg-red-900/40 text-red-400 text-xs rounded-full">🔒 Bị khóa</span>
                      ) : (
                        <span className="px-2 py-1 bg-emerald-900/40 text-emerald-400 text-xs rounded-full">✓ Hoạt động</span>
                      )}
                    </td>
                    <td className="py-4 text-center text-xs text-slate-500">
                      {new Date(m.created_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4">
                      <div className="flex justify-center gap-1.5">
                        <button
                          onClick={() => setPermMember(m)}
                          className="p-2 bg-blue-900/40 text-blue-400 rounded hover:bg-blue-600 hover:text-white transition-colors"
                          title="Phân quyền module">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </button>
                        <button
                          onClick={() => { setResetMember(m); setNewPassword(''); }}
                          className="p-2 bg-purple-900/40 text-purple-400 rounded hover:bg-purple-600 hover:text-white transition-colors"
                          title="Đặt lại mật khẩu">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                        </button>
                        <button
                          onClick={() => handleDelete(m)}
                          className="p-2 bg-red-900/40 text-red-400 rounded hover:bg-red-600 hover:text-white transition-colors"
                          title="Xóa tài khoản">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ======= Popup Phân quyền ======= */}
      {permMember && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] w-full max-w-2xl rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 bg-[#0f172a] border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Phân quyền truy cập</h3>
                <p className="text-xs text-slate-400 mt-0.5">{permMember.full_name} — {permMember.email}</p>
              </div>
              <button onClick={() => setPermMember(null)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div className="p-5 text-sm text-slate-400">
              <p className="mb-4">Vai trò hiện tại: <span className="text-blue-400 font-semibold">{ROLES[permMember.role] || permMember.role}</span></p>
              <div className="flex gap-2 mb-5 flex-wrap text-xs">
                <span className="text-slate-500 mr-1">Đặt tất cả:</span>
                {['Ẩn hết', 'Cho xem hết', 'Cho sửa hết'].map(btn => (
                  <button key={btn} className="px-3 py-1.5 border border-slate-700 rounded-full hover:bg-slate-800 text-slate-300">{btn}</button>
                ))}
              </div>
              <table className="w-full">
                <thead className="bg-[#1e293b]">
                  <tr className="text-xs uppercase text-slate-400">
                    <th className="py-2 px-3 text-left rounded-tl-lg">Phân hệ</th>
                    <th className="py-2 px-3 text-right rounded-tr-lg">Mức quyền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {MODULES.map((mod, i) => (
                    <tr key={i} className="hover:bg-[#1e293b]/50">
                      <td className="py-3 px-3 font-medium text-slate-200">{mod}</td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex rounded-lg border border-slate-700 bg-[#0f172a] p-0.5">
                          {['Ẩn', 'Xem', 'Sửa'].map((lvl, li) => (
                            <button key={lvl}
                              className={'px-3 py-1.5 text-xs font-medium rounded-md transition-colors ' + (lvl === 'Xem' ? 'bg-[#0ea5e9] text-white' : 'text-slate-400 hover:text-white')}>
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => setPermMember(null)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-800">Đóng</button>
                <button onClick={() => { handleUpdateRole(permMember, permMember.role); setPermMember(null); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Lưu quyền</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======= Popup Đặt lại mật khẩu ======= */}
      {resetMember && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] w-full max-w-sm rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-5 bg-[#0f172a] border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Đặt lại mật khẩu</h3>
              <button onClick={() => setResetMember(null)} className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-400">Đặt mật khẩu mới cho: <span className="text-white font-semibold">{resetMember.full_name}</span></p>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                minLength={6}
              />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setResetMember(null)} className="px-4 py-2 border border-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-800">Hủy</button>
                <button onClick={handleResetPassword} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">Xác nhận</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
