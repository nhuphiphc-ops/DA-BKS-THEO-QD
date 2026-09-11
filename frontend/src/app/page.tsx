'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await api.post('/auth/login', { username: email, password });
      if (res.access_token) {
        // Lưu vào localStorage cho api.ts dùng
        localStorage.setItem('bks_token', res.access_token);
        // Lưu vào cookie để middleware Next.js đọc được (bảo vệ route)
        document.cookie = 'bks_token=' + res.access_token + '; path=/; max-age=28800; SameSite=Lax';
        router.push('/dashboard/risks');
      } else {
        alert('Dang nhap that bai. Vui long kiem tra lai thong tin!');
      }
    } catch (err) {
      alert('Đăng nhập thất bại. Sai email hoặc mật khẩu!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Header Section */}
        <div className="bg-slate-900 p-8 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide">BKS SECURE PORTAL</h2>
          <p className="text-slate-400 mt-2 text-sm">Hệ thống Kiểm soát Nội bộ & Tuân thủ</p>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Tên đăng nhập / Email</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="kiemsoatvien@congty.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Mật khẩu an toàn</label>
              <input 
                type="password" 
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-slate-600 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">Quên mật khẩu?</a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={"w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all flex justify-center items-center " + (isLoading ? "opacity-70 cursor-not-allowed" : "")}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Xác thực & Đăng nhập'}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            <p>Được bảo vệ bởi thuật toán mã hóa cấp cao AES-256</p>
            <p className="mt-1">Mọi hành vi truy cập trái phép đều được ghi log (WORM)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
