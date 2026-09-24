'use client';

import { useRouter } from 'next/navigation';

export default function HeaderNav() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bks_token');
      document.cookie = 'bks_token=; path=/; max-age=0; SameSite=Lax';
      router.push('/');
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold border border-green-200 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
        MFA Active
      </span>

      <button
        onClick={handleLogout}
        className="px-3 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
        title="Đăng xuất khỏi hệ thống"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
        Đăng xuất
      </button>
    </div>
  );
}
