'use client';

import { useState, useMemo } from 'react';
import {
  HEAVY_EQUIPMENT_DATA,
  GAMUDA_RENTAL_DATA,
  MONTHLY_IN_OUT,
  WAREHOUSE_DISTRIBUTION,
  LOCATION_HOLDINGS,
  TOP_TRANSFER_ITEMS,
  INVENTORY_TICKETS,
  CONTRACTS_DATA,
  TENANTS_DATA,
  INVENTORY_ITEMS_SAMPLE,
} from '@/data/equipmentData';

export default function EquipmentManagementPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'warehouse' | 'maintenance' | 'financial' | 'contracts' | 'settings'>('overview');

  // Sub-tabs
  const [warehouseSubTab, setWarehouseSubTab] = useState<'tickets' | 'inventory'>('tickets');
  const [settingsSubTab, setSettingsSubTab] = useState<'tenants' | 'materials'>('tenants');

  // Search & Filters
  const [timeFilter, setTimeFilter] = useState('Năm nay');
  const [heavySearch, setHeavySearch] = useState('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [inventorySearch, setInventorySearch] = useState('');
  const [contractFilter, setContractFilter] = useState('all');
  const [showNegativeOnly, setShowNegativeOnly] = useState(false);

  // Filtered Heavy Equipment
  const filteredHeavy = useMemo(() => {
    return HEAVY_EQUIPMENT_DATA.filter(item => {
      const q = heavySearch.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.code.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
    });
  }, [heavySearch]);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return INVENTORY_TICKETS.filter(t => {
      const q = ticketSearch.toLowerCase();
      return t.code.toLowerCase().includes(q) || t.source.toLowerCase().includes(q) || t.target.toLowerCase().includes(q) || t.type.toLowerCase().includes(q);
    });
  }, [ticketSearch]);

  // Filtered Contracts
  const filteredContracts = useMemo(() => {
    return CONTRACTS_DATA.filter(c => {
      if (contractFilter === 'rent_out') return c.type === 'Cho thuê thiết bị';
      if (contractFilter === 'rent_in') return c.type === 'Đi thuê ngoài';
      return true;
    });
  }, [contractFilter]);

  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + ' đ';
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val);
  };

  return (
    <div className="min-h-screen bg-[#0b1328] text-slate-100 p-4 lg:p-6 rounded-2xl shadow-2xl border border-slate-800 font-sans">
      
      {/* Top Header / Breadcrumb & Branding */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
              PHC iREPORT
            </span>
            <span className="text-xs text-slate-400 font-medium">CÔNG TY CON · ECONS</span>
            <span className="text-xs text-slate-600">/</span>
            <span className="text-xs text-blue-400 font-semibold">QUẢN LÝ THIẾT BỊ & MÁY MÓC</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Hệ Thống Giám Sát & Điều Hành Thiết Bị
          </h1>
          <p className="text-xs lg:text-sm text-slate-400 mt-1">
            Dữ liệu đối soát tài sản lớn, tồn kho luân chuyển và bảng kê thanh toán công ty thiết bị
          </p>
        </div>

        {/* Global Action & Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
          {/* Time Preset */}
          <div className="inline-flex bg-[#111c35] border border-slate-700 p-1 rounded-lg text-xs font-medium">
            {['Tuần này', 'Tháng này', 'Quý này', 'Năm nay', 'Lũy kế'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeFilter(t)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  timeFilter === t
                    ? 'bg-blue-600 text-white font-semibold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#111c35] border border-slate-700 rounded-lg text-xs text-slate-300">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <span>01/01/2026 — 24/09/2026</span>
          </div>

          <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors">
            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex gap-2 overflow-x-auto py-4 border-b border-slate-800 scrollbar-none">
        {[
          { id: 'overview', label: '📊 Tổng quan thiết bị', badge: 'Live' },
          { id: 'warehouse', label: '📦 Xuất nhập kho & Tồn kho', badge: '1.959 dòng' },
          { id: 'maintenance', label: '🏗️ Bảo trì & Thiết bị lớn', badge: '36 cẩu tháp' },
          { id: 'financial', label: '💰 Doanh thu & Chi phí', badge: 'Gamuda 11.4 tỷ' },
          { id: 'contracts', label: '📑 Hợp đồng & Điều khoản', badge: '119 HĐ' },
          { id: 'settings', label: '⚙️ Thiết lập & Danh mục', badge: '22 bên thuê' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-xs lg:text-sm whitespace-nowrap transition-all border ${
              activeTab === tab.id
                ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                : 'bg-[#111c35] border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-[#162444]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
              activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TỔNG QUAN THIẾT BỊ (MATCHING IMAGE 4 & 5) */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 pt-5">
          {/* 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-[#111c35] border border-blue-500/30 rounded-xl p-5 relative overflow-hidden group hover:border-blue-500 transition-all">
              <div className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase mb-1">
                Thiết bị sở hữu ECONS
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                1.666.477,68 <span className="text-xs font-normal text-slate-400">đơn vị</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Thuê ngoài 737.192 · PHC 0 · <strong>Sở hữu chiếm 69,3%</strong></span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#111c35] border border-slate-700/80 rounded-xl p-5 relative overflow-hidden group hover:border-slate-600 transition-all">
              <div className="text-[11px] font-bold text-blue-400 tracking-wider uppercase mb-1">
                Đang ở công trường / Bên thuê
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                2.081.749,28 <span className="text-xs font-normal text-slate-400">đơn vị</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                <span><strong>86,6% tổng tồn</strong> · 36 điểm đang giữ hàng</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#111c35] border border-slate-700/80 rounded-xl p-5 relative overflow-hidden group hover:border-slate-600 transition-all">
              <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">
                Tổng tồn kho toàn công ty
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                2.403.669,68 <span className="text-xs font-normal text-slate-400">đơn vị</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                <span>37 kho có hàng · <strong>408 mã có tồn</strong></span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#111c35] border border-slate-700/80 rounded-xl p-5 relative overflow-hidden group hover:border-slate-600 transition-all">
              <div className="text-[11px] font-bold text-amber-400 tracking-wider uppercase mb-1">
                Phiếu chờ duyệt
              </div>
              <div className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                0 <span className="text-xs font-normal text-slate-400">phiếu</span>
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-slate-800 text-slate-300">0 nháp</span>
              </div>
              <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                ✓ Hệ thống kiểm soát luân chuyển đang thông suốt
              </div>
            </div>
          </div>

          {/* Section: Biến động nhập xuất & Phân bổ tồn kho */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Chart: Biến động nhập / xuất */}
            <div className="lg:col-span-7 bg-[#111c35] border border-slate-800 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Biến động nhập / xuất
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">01/01/2026 – 24/09/2026 · gộp theo tháng</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-3 h-3 rounded bg-emerald-500"></span> Nhập
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-3 h-3 rounded bg-amber-500"></span> Xuất
                  </span>
                </div>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-64 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-slate-700/60 px-2">
                {MONTHLY_IN_OUT.map((item, idx) => {
                  const maxVal = 1000000;
                  const inHeight = Math.max(12, Math.min(100, (item.inQty / maxVal) * 100));
                  const outHeight = Math.max(8, Math.min(100, (item.outQty / maxVal) * 100));

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip on Hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-14 bg-slate-900 border border-slate-700 text-[10px] text-white p-2 rounded shadow-xl whitespace-nowrap z-20 pointer-events-none">
                        <div className="font-bold text-blue-400">{item.month}</div>
                        <div className="text-emerald-400">Nhập: {formatNumber(item.inQty)}</div>
                        <div className="text-amber-400">Xuất: {formatNumber(item.outQty)}</div>
                      </div>

                      {/* Bars */}
                      <div className="w-full flex items-end justify-center gap-1 h-full">
                        <div
                          style={{ height: `${inHeight}%` }}
                          className="w-1/2 bg-emerald-500 hover:bg-emerald-400 rounded-t transition-all"
                        ></div>
                        <div
                          style={{ height: `${outHeight}%` }}
                          className="w-1/2 bg-amber-500 hover:bg-amber-400 rounded-t transition-all"
                        ></div>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-2 font-mono">{item.month.split('/')[0]}</span>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Summary Bar */}
              <div className="grid grid-cols-3 gap-2 pt-4 text-center">
                <div className="bg-[#0b1328] p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Tổng nhập</div>
                  <div className="text-sm lg:text-base font-bold text-emerald-400 mt-0.5">3.642.750,58</div>
                </div>
                <div className="bg-[#0b1328] p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Tổng xuất</div>
                  <div className="text-sm lg:text-base font-bold text-amber-400 mt-0.5">1.381.461,90</div>
                </div>
                <div className="bg-[#0b1328] p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Chênh lệch tồn</div>
                  <div className="text-sm lg:text-base font-bold text-blue-400 mt-0.5">+2.261.288,68</div>
                </div>
              </div>
            </div>

            {/* Donut Chart: Phân bổ tồn theo kho */}
            <div className="lg:col-span-5 bg-[#111c35] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Phân bổ tồn theo kho
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">2.403.669,68 đơn vị tồn dương · 37 kho</p>
              </div>

              {/* Donut Representation & List */}
              <div className="flex items-center gap-6 my-4">
                {/* SVG Donut */}
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#1e293b" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4" strokeDasharray="13.4 86.6" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="12.7 87.3" strokeDashoffset="-13.4" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="10.9 89.1" strokeDashoffset="-26.1" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4" strokeDasharray="10.8 89.2" strokeDashoffset="-37" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#06b6d4" strokeWidth="4" strokeDasharray="9.2 90.8" strokeDashoffset="-47.8" />
                    <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#64748b" strokeWidth="4" strokeDasharray="43 57" strokeDashoffset="-57" />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-lg font-black text-white">37</div>
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Kho</div>
                  </div>
                </div>

                {/* Warehouse Breakdown */}
                <div className="flex-1 space-y-2 text-xs">
                  {WAREHOUSE_DISTRIBUTION.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="flex items-center gap-2 truncate pr-2 text-slate-300">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="font-mono font-bold text-white shrink-0">{item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning Banner */}
              <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg flex items-center gap-2.5 text-xs text-red-300">
                <svg className="w-5 h-5 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                <span><strong>90 dòng tồn âm</strong> — mở màn Tồn kho để đối chiếu và cân sổ.</span>
              </div>
            </div>
          </div>

          {/* Section 3: Thiết bị đang ở đâu, Tình trạng thiết bị, Kiểm kê */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Box 1: Thiết bị đang ở đâu */}
            <div className="bg-[#111c35] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Thiết bị đang ở đâu</h3>
                <p className="text-xs text-slate-400 mb-4">Theo dự án / bên thuê · tỷ trọng số lượng</p>

                <div className="space-y-3.5">
                  {LOCATION_HOLDINGS.map((loc, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300 font-medium truncate pr-2">{loc.name}</span>
                        <span className="font-mono font-bold text-white shrink-0">{loc.qty}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${loc.pct}%`, backgroundColor: loc.color }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Box 2: Tình trạng thiết bị */}
            <div className="bg-[#111c35] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Tình trạng thiết bị</h3>
                <p className="text-xs text-slate-400 mb-4">Toàn bộ 2.403.669,68 đơn vị</p>

                {/* Progress bar */}
                <div className="w-full bg-red-500 rounded-full h-7 overflow-hidden flex items-center font-bold text-xs text-slate-900 mb-4 shadow-inner">
                  <div className="bg-emerald-500 h-full flex items-center justify-center text-slate-950 font-extrabold" style={{ width: '93.5%' }}>
                    93,5%
                  </div>
                  <div className="w-[6.5%] text-center text-white text-[10px] font-mono">6,5%</div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#0b1328] p-3 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Tốt
                    </div>
                    <div className="text-sm font-bold text-white mt-1">2.247.370,77</div>
                  </div>
                  <div className="bg-[#0b1328] p-3 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-400"></span> Hỏng
                    </div>
                    <div className="text-sm font-bold text-red-400 mt-1">156.298,91</div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs text-amber-300">
                <strong>156.298,91 đơn vị hỏng</strong> chiếm 6,5% — vượt ngưỡng an toàn 5%, cần lập phiếu bảo dưỡng hoặc thanh lý.
              </div>
            </div>

            {/* Box 3: Kiểm kê */}
            <div className="bg-[#111c35] border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-white mb-1">Kiểm kê — lệch theo phiên</h3>
                <p className="text-xs text-slate-400 mb-4">6 phiên gần nhất · Lệch = thực tế - hệ thống</p>

                <div className="h-44 border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-4">
                  <svg className="w-10 h-10 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                  <span className="text-xs text-slate-400 font-medium">Chưa có phiên kiểm kê nào trong kỳ</span>
                  <span className="text-[10px] text-slate-500 mt-1">Toàn bộ 65 kho bãi đang vận hành chuẩn số liệu</span>
                </div>
              </div>

              <button className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors">
                + Mở phiên kiểm kê đối soát kho mới
              </button>
            </div>
          </div>

          {/* Section 4: Top vật tư luân chuyển */}
          <div className="bg-[#111c35] border border-slate-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-base font-bold text-white">Top vật tư luân chuyển nhiều nhất</h3>
                <p className="text-xs text-slate-400">01/01/2026 – 24/09/2026 · Tổng lượt nhập + xuất</p>
              </div>
              <button 
                onClick={() => setActiveTab('warehouse')}
                className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                Xem báo cáo kho →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOP_TRANSFER_ITEMS.map((item) => (
                <div key={item.rank} className="bg-[#0b1328] border border-slate-800/80 p-3.5 rounded-lg flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded bg-blue-900/40 text-blue-400 border border-blue-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {item.rank}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 line-clamp-1">{item.name}</div>
                      <div className="w-28 bg-slate-800 rounded-full h-1 mt-2">
                        <div className="bg-emerald-400 h-1 rounded-full" style={{ width: `${item.pct}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-white">{formatNumber(item.count)}</div>
                    <div className="text-[10px] text-slate-500">lượt</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: XUẤT NHẬP KHO & TỒN KHO (MATCHING IMAGE 6 & 7) */}
      {/* ========================================================================= */}
      {activeTab === 'warehouse' && (
        <div className="space-y-5 pt-5">
          {/* Sub-tab switcher */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex gap-2">
              <button
                onClick={() => setWarehouseSubTab('tickets')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  warehouseSubTab === 'tickets'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-[#111c35] text-slate-400 hover:text-white'
                }`}
              >
                Phiếu kho thiết bị (1.369 dòng)
              </button>
              <button
                onClick={() => setWarehouseSubTab('inventory')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  warehouseSubTab === 'inventory'
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-[#111c35] text-slate-400 hover:text-white'
                }`}
              >
                Tồn kho thiết bị (1.959 dòng)
              </button>
            </div>

            <div className="text-xs text-slate-400">
              {warehouseSubTab === 'tickets' ? 'Quản lý phiếu nhập / xuất / điều chuyển' : 'Báo cáo số lượng tồn theo từng điểm kho'}
            </div>
          </div>

          {/* SubTab: Phiếu kho */}
          {warehouseSubTab === 'tickets' && (
            <div className="space-y-4">
              {/* Filter */}
              <div className="flex flex-wrap gap-3 items-center justify-between bg-[#111c35] p-4 rounded-xl border border-slate-800">
                <div className="flex-1 min-w-[240px]">
                  <input
                    type="text"
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    placeholder="Tìm số phiếu / đối tác / kho nguồn / đích..."
                    className="w-full bg-[#0b1328] border border-slate-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="text-xs text-slate-400">
                  Hiển thị <span className="text-white font-bold">{filteredTickets.length}</span> / 1.369 phiếu
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111c35]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b1328] text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">STT</th>
                      <th className="p-3.5">Số phiếu</th>
                      <th className="p-3.5">Loại</th>
                      <th className="p-3.5">Ngày</th>
                      <th className="p-3.5">Kho nguồn</th>
                      <th className="p-3.5">Kho đích</th>
                      <th className="p-3.5">Đối tượng</th>
                      <th className="p-3.5 text-center">Số dòng</th>
                      <th className="p-3.5 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    {filteredTickets.map((t, idx) => (
                      <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 text-slate-500">{idx + 1}</td>
                        <td className="p-3.5 font-bold text-blue-400">{t.code}</td>
                        <td className="p-3.5 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            t.type === 'Xuất kho' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                            t.type === 'Nhập kho' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-400">{t.date}</td>
                        <td className="p-3.5 font-sans">{t.source}</td>
                        <td className="p-3.5 font-sans">{t.target}</td>
                        <td className="p-3.5 font-semibold text-white">{t.partner}</td>
                        <td className="p-3.5 text-center">{t.rows}</td>
                        <td className="p-3.5 text-center font-sans">
                          <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded">
                            {t.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SubTab: Tồn kho */}
          {warehouseSubTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 items-center justify-between bg-[#111c35] p-4 rounded-xl border border-slate-800">
                <div className="flex-1 min-w-[240px]">
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Tìm tên vật tư, mã thiết bị, tên kho..."
                    className="w-full bg-[#0b1328] border border-slate-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs text-red-400 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showNegativeOnly}
                    onChange={(e) => setShowNegativeOnly(e.target.checked)}
                    className="rounded border-slate-700 text-red-500 focus:ring-0"
                  />
                  <span>Chỉ dòng tồn âm (90 mã cảnh báo)</span>
                </label>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111c35]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0b1328] text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">STT</th>
                      <th className="p-3.5">Kho lưu giữ</th>
                      <th className="p-3.5">Mã VT</th>
                      <th className="p-3.5">Tên thiết bị / vật tư</th>
                      <th className="p-3.5">Nhóm</th>
                      <th className="p-3.5">ĐVT</th>
                      <th className="p-3.5">Tình trạng</th>
                      <th className="p-3.5">Sở hữu</th>
                      <th className="p-3.5 text-right">SL tồn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {INVENTORY_ITEMS_SAMPLE.filter(item => {
                      const q = inventorySearch.toLowerCase();
                      return item.ten.toLowerCase().includes(q) || item.ma.toLowerCase().includes(q) || item.kho.toLowerCase().includes(q);
                    }).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 text-slate-500 font-mono">{item.stt}</td>
                        <td className="p-3.5 font-medium text-slate-300">{item.kho}</td>
                        <td className="p-3.5 font-mono font-bold text-blue-400">{item.ma}</td>
                        <td className="p-3.5 font-medium text-white">{item.ten}</td>
                        <td className="p-3.5 text-slate-400">{item.nhom}</td>
                        <td className="p-3.5 text-slate-400">{item.dvt}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold rounded">
                            {item.tinhTrang}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-300">{item.soHuu}</td>
                        <td className="p-3.5 text-right font-mono font-bold text-emerald-400">{formatNumber(item.ton)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BẢO TRÌ & THIẾT BỊ LỚN (MATCHING IMAGE 9) */}
      {/* ========================================================================= */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6 pt-5">
          {/* 2 Big Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-red-950/40 border border-red-800/70 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-900/60 text-red-400 flex items-center justify-center font-bold text-lg shrink-0">
                  44
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Máy chưa đủ điều kiện vận hành</h4>
                  <p className="text-xs text-red-300">4 hết hạn · 40 chưa từng kiểm định an toàn</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-red-900 hover:bg-red-800 text-white text-xs font-semibold rounded-lg shrink-0">
                Kiểm định ngay →
              </button>
            </div>

            <div className="p-4 bg-amber-950/40 border border-amber-800/70 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-900/60 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
                  25
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Máy quá hạn hoặc sắp đến hạn bảo dưỡng</h4>
                  <p className="text-xs text-amber-300">Sớm nhất 15/09/2026 — quá 9 ngày định kỳ tháng</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg shrink-0">
                Lịch bảo dưỡng →
              </button>
            </div>
          </div>

          {/* Group Header Card */}
          <div className="bg-[#111c35] border border-blue-500/40 p-4 rounded-xl flex flex-wrap justify-between items-center gap-4">
            <div>
              <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">Danh mục tài sản lớn</div>
              <div className="text-lg font-extrabold text-white">Cẩu tháp và các phụ kiện · 36 thiết bị</div>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400">Nguyên giá:</span>{' '}
                <strong className="text-white">28.552.754.899 đ</strong>
              </div>
              <div>
                <span className="text-slate-400">Khấu hao:</span>{' '}
                <strong className="text-amber-400">2.932.754.269 đ</strong>
              </div>
              <div>
                <span className="text-slate-400">Còn lại:</span>{' '}
                <strong className="text-emerald-400">25.620.000.630 đ</strong>
              </div>
              <div>
                <span className="text-slate-400">Đã bỏ:</span>{' '}
                <strong className="text-blue-400">30.230.494.899 đ</strong>
              </div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex justify-between items-center gap-3">
            <input
              type="text"
              value={heavySearch}
              onChange={(e) => setHeavySearch(e.target.value)}
              placeholder="Lọc theo mã máy, tên cẩu tháp, công trường..."
              className="w-80 bg-[#111c35] border border-slate-700 text-xs rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <div className="text-xs text-slate-400">
              Có <strong className="text-white">{filteredHeavy.length}</strong> thiết bị
            </div>
          </div>

          {/* Heavy Equipment Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111c35]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1328] text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Mã & Tên thiết bị</th>
                  <th className="p-3.5 text-right">Nguyên giá</th>
                  <th className="p-3.5">Hạn khấu hao</th>
                  <th className="p-3.5">Vị trí hiện tại</th>
                  <th className="p-3.5 text-center">Trạng thái</th>
                  <th className="p-3.5 text-right">Chi phí BD/SC</th>
                  <th className="p-3.5 text-right">Khấu hao LK</th>
                  <th className="p-3.5 text-right">Giá trị còn lại</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredHeavy.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-mono font-bold text-blue-400">{item.code}</div>
                      <div className="text-slate-300 text-xs mt-0.5">{item.name}</div>
                    </td>
                    <td className="p-3.5 text-right font-mono font-semibold text-white">
                      {formatVND(item.cost)}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">
                      {item.date_end || '23/12/2028'}
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-slate-200">{item.location}</div>
                      <span className="text-[10px] text-slate-500 font-mono">{item.loc_src}</span>
                    </td>
                    <td className="p-3.5 text-center">
                      <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-mono text-amber-400">
                      {formatVND(item.maint_cost)}
                    </td>
                    <td className="p-3.5 text-right font-mono text-slate-400">
                      {formatVND(item.depreciation)}
                    </td>
                    <td className="p-3.5 text-right font-mono font-bold text-emerald-400">
                      {formatVND(item.remaining_value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DOANH THU & CHI PHÍ - GAMUDA (MATCHING IMAGE 11) */}
      {/* ========================================================================= */}
      {activeTab === 'financial' && (
        <div className="space-y-6 pt-5">
          {/* Project Header Bar */}
          <div className="p-4 bg-[#111c35] border border-slate-800 rounded-xl flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Hồ sơ đối soát dự án</span>
              <h3 className="text-lg font-extrabold text-white">PHC – HH2 Gamuda</h3>
              <p className="text-xs text-slate-400 mt-0.5">Kỳ quyết toán: 24/09/2025 → 24/09/2026</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow">
                Xem phụ lục hợp đồng
              </button>
            </div>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#111c35] border border-slate-800 p-5 rounded-xl">
              <div className="text-xs font-bold text-slate-400 uppercase">Econs thu từ dự án</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">11.469.866.999 đ</div>
              <p className="text-[11px] text-slate-400 mt-2">
                Vật tư: 2.47 tỷ · Máy: 1.84 tỷ · Khoản tháng: 1.93 tỷ · Một lần: 4.91 tỷ
              </p>
            </div>

            <div className="bg-[#111c35] border border-slate-800 p-5 rounded-xl">
              <div className="text-xs font-bold text-slate-400 uppercase">Econs trả (Thuê ngoài)</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">2.405.941.232 đ</div>
              <p className="text-[11px] text-slate-400 mt-2">
                Vật tư: 1.03 tỷ (2 NCC) · Một lần: 1.36 tỷ · Máy: 0 đ
              </p>
            </div>

            <div className="bg-[#111c35] border border-emerald-500/40 p-5 rounded-xl bg-gradient-to-br from-[#111c35] to-emerald-950/20">
              <div className="text-xs font-bold text-emerald-400 uppercase">Lợi nhuận gộp còn lại</div>
              <div className="text-2xl font-extrabold text-white mt-1">9.063.925.767 đ</div>
              <p className="text-[11px] text-emerald-300 mt-2">
                Tỷ suất sinh lời ấn tượng đạt <strong>79,0%</strong> trên phần tính được
              </p>
            </div>
          </div>

          {/* Alert */}
          <div className="p-3.5 bg-amber-950/40 border border-amber-800/70 rounded-xl text-xs text-amber-300 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            <span><strong>1 mã đang có mặt ở công trình nhưng CHƯA KHAI GIÁ: ALTC1200</strong> — Cần cập nhật đơn giá vào thẻ hợp đồng để bổ sung doanh thu!</span>
          </div>

          {/* Rental Items Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111c35]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1328] text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Mã VT</th>
                  <th className="p-3.5">Tên thiết bị / vật tư</th>
                  <th className="p-3.5">Nguồn</th>
                  <th className="p-3.5 text-right">Đơn vị · ngày</th>
                  <th className="p-3.5 text-right">Đơn giá ngày</th>
                  <th className="p-3.5 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {GAMUDA_RENTAL_DATA.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-bold text-blue-400">{item.code}</td>
                    <td className="p-3.5 font-sans font-medium text-white">{item.name}</td>
                    <td className="p-3.5 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        item.source === 'Hàng Econs'
                          ? 'bg-blue-900/40 text-blue-300 border border-blue-800'
                          : 'bg-amber-900/40 text-amber-300 border border-amber-800'
                      }`}>
                        {item.source}
                      </span>
                    </td>
                    <td className="p-3.5 text-right text-slate-300">{formatNumber(item.quantity_days)}</td>
                    <td className="p-3.5 text-right text-slate-400">{formatVND(item.unit_price)}</td>
                    <td className="p-3.5 text-right font-bold text-emerald-400">{formatVND(item.total_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: HỢP ĐỒNG & ĐIỀU KHOẢN (MATCHING IMAGE 10) */}
      {/* ========================================================================= */}
      {activeTab === 'contracts' && (
        <div className="space-y-5 pt-5">
          {/* Alert */}
          <div className="p-4 bg-amber-950/40 border border-amber-800/70 rounded-xl text-xs text-amber-300">
            <strong>4 hợp đồng chưa khai bảng giá</strong> — Hợp đồng cho thuê mà chưa có dòng giá nào thì bảng kê tiền thuê không tính được đồng nào cho nó. Mở thẻ hợp đồng để xem đã khai những gì.
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Tất cả (119)' },
                { id: 'rent_out', label: 'Cho thuê thiết bị (67)' },
                { id: 'rent_in', label: 'Đi thuê ngoài (50)' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setContractFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    contractFilter === f.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-[#111c35] text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400">
              Quản lý 119 hợp đồng kinh tế của công ty thiết bị
            </div>
          </div>

          {/* Contracts Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111c35]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1328] text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Số hợp đồng</th>
                  <th className="p-3.5">Loại</th>
                  <th className="p-3.5">Đối tác</th>
                  <th className="p-3.5">Dự án</th>
                  <th className="p-3.5">Hiệu lực</th>
                  <th className="p-3.5 text-right">Giá trị</th>
                  <th className="p-3.5 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredContracts.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-blue-400">{c.code}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.type === 'Cho thuê thiết bị'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {c.type}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-200 font-medium">{c.partner}</td>
                    <td className="p-3.5 text-slate-300">{c.project}</td>
                    <td className="p-3.5 font-mono text-slate-400">{c.date_start}</td>
                    <td className="p-3.5 text-right font-mono font-bold text-white">{c.val}</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.status === 'Đang hiệu lực'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: THIẾT LẬP & DANH MỤC (MATCHING IMAGE 8 & 16) */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-5 pt-5">
          {/* Sub-tab switcher */}
          <div className="flex gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setSettingsSubTab('tenants')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                settingsSubTab === 'tenants'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-[#111c35] text-slate-400 hover:text-white'
              }`}
            >
              Bên thuê (22 đối tác)
            </button>
            <button
              onClick={() => setSettingsSubTab('materials')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                settingsSubTab === 'materials'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-[#111c35] text-slate-400 hover:text-white'
              }`}
            >
              Danh mục vật tư (503 mã)
            </button>
          </div>

          {/* Tenants Table */}
          {settingsSubTab === 'tenants' && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111c35]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b1328] text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">STT</th>
                    <th className="p-3.5">Mã đối tác</th>
                    <th className="p-3.5">Tên đối tác / Bên thuê</th>
                    <th className="p-3.5">Mã số thuế</th>
                    <th className="p-3.5 text-center">Nội bộ PHC</th>
                    <th className="p-3.5">Ghi chú đối soát</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {TENANTS_DATA.map((t, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 text-slate-500 font-mono">{idx + 1}</td>
                      <td className="p-3.5 font-mono font-bold text-blue-400">{t.code}</td>
                      <td className="p-3.5 font-medium text-white">{t.name}</td>
                      <td className="p-3.5 font-mono text-slate-400">{t.mst}</td>
                      <td className="p-3.5 text-center">
                        {t.internal && (
                          <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[10px] font-bold rounded">
                            ✓ PHC
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-400 text-xs italic">{t.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Materials Table Sample */}
          {settingsSubTab === 'materials' && (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111c35]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b1328] text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">STT</th>
                    <th className="p-3.5">Mã vật tư</th>
                    <th className="p-3.5">Tên vật tư thiết bị</th>
                    <th className="p-3.5">Nhóm phân loại</th>
                    <th className="p-3.5">ĐVT</th>
                    <th className="p-3.5 text-right">Đơn trọng (kg)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {INVENTORY_ITEMS_SAMPLE.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 text-slate-500 font-mono">{idx + 1}</td>
                      <td className="p-3.5 font-mono font-bold text-blue-400">{m.ma}</td>
                      <td className="p-3.5 font-medium text-white">{m.ten}</td>
                      <td className="p-3.5 text-slate-400">{m.nhom}</td>
                      <td className="p-3.5 text-slate-400">{m.dvt}</td>
                      <td className="p-3.5 text-right font-mono text-slate-300">30.24</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
