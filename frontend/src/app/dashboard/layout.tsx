import Sidebar from '@/components/layout/Sidebar';
import { ReactNode } from 'react';

import HeaderNav from '@/components/layout/HeaderNav';

// Giả lập lấy User Role từ JWT cookie/session trên server-side
const MOCK_USER_ROLE = 'SUPER_ADMIN'; 

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar userRole={MOCK_USER_ROLE} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">Trung tâm Giám sát Điều hành</h1>
          <div className="ml-auto">
            <HeaderNav />
          </div>
        </header>
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
