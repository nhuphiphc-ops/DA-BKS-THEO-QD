'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard Giám sát', href: '/dashboard', roles: ['SUPER_ADMIN', 'AUDITOR', 'SYSTEM_ADMIN'] },
    { name: 'Kế hoạch & Nghị quyết', href: '/dashboard/plans', roles: ['SUPER_ADMIN', 'AUDITOR'] },
    { name: 'Thu thập Hồ sơ', href: '/dashboard/evidences', roles: ['SUPER_ADMIN', 'AUDITOR', 'AUDIT_TARGET'] },
    { name: 'Quản lý Rủi ro', href: '/dashboard/risks', roles: ['SUPER_ADMIN', 'AUDITOR', 'AUDIT_TARGET'] },
    { name: 'Quản lý Thành viên', href: '/dashboard/members', roles: ['SUPER_ADMIN', 'SYSTEM_ADMIN'] },
    { name: 'Audit Logs (WORM)', href: '/dashboard/audit-logs', roles: ['SYSTEM_ADMIN'] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-700">
      <div className="p-6 font-bold text-xl text-white border-b border-slate-700">
        BKS Secure Portal
      </div>
      <div className="flex-1 py-4">
        <ul className="space-y-1">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`block px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors ${
                    isActive ? 'bg-slate-800 text-blue-400 border-r-4 border-blue-500 font-medium' : ''
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="p-6 border-t border-slate-700">
        <div className="text-sm">Đăng nhập với vai trò:</div>
        <div className="font-semibold text-white mt-1">{userRole}</div>
      </div>
    </div>
  );
}
