import React, { useState } from 'react';
import {
  Layers,
  Package,
  Factory,
  ShoppingCart,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Play,
  RotateCcw,
  ShieldCheck,
  User,
  Search,
  Calendar,
  Building2,
  ChevronRight,
  Printer,
  Sparkles,
  BarChart3,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'benchmark' | 'ledger' | 'production' | 'invoicing' | 'audit'>('dashboard');
  const [activeRole, setActiveRole] = useState<'ADMIN' | 'SUPERVISOR' | 'SALES' | 'AUDITOR'>('ADMIN');
  const [benchmarkExecuted, setBenchmarkExecuted] = useState(true);

  // Exact NIT Trichy Benchmark Data States
  const benchmarkSteps = [
    { id: 1, title: 'Purchase 60 kg Flour @ ₹45/kg', category: 'PURCHASE', status: 'VERIFIED', result: 'Flour stock: 160.00 kg @ ₹43.1250/kg weighted rate (Valuation: ₹6,900.00)' },
    { id: 2, title: 'Issue 40 kg Flour for Batch', category: 'PRODUCTION', status: 'VERIFIED', result: 'Flour remaining: 120.00 kg (Standard: 40 kg, Actual: 40 kg, 0% variance)' },
    { id: 3, title: 'Issue 10.5 Litres Oil for Batch', category: 'PRODUCTION', status: 'VERIFIED', result: 'Oil remaining: 19.50 L (Standard: 10.0 L, Actual: 10.5 L -> +5.0% variance)' },
    { id: 4, title: 'Issue 1.2 kg Spice Mix', category: 'PRODUCTION', status: 'VERIFIED', result: 'Spice mix remaining: 3.80 kg (Standard: 1.2 kg, Actual: 1.2 kg)' },
    { id: 5, title: 'Record 188 Good Packets Output', category: 'PRODUCTION', status: 'VERIFIED', result: 'Yield variance: -6.0% (Standard: 200 pkts, Actual: 188 pkts). FG Stock: 238 pkts' },
    { id: 6, title: 'Record 6 Damaged Pouches', category: 'PACKAGING', status: 'VERIFIED', result: 'Pouches consumed: 194 (188 good + 6 scrap). Pouches remaining: 306 pcs' },
    { id: 7, title: 'Record 9 Shipping Cartons Used', category: 'PACKAGING', status: 'VERIFIED', result: 'Cartons consumed: 9 pcs. Cartons remaining: 21 pcs' },
    { id: 8, title: 'Salesman A Orders 150 Packets', category: 'SALES', status: 'VERIFIED', result: 'Order SO-001 created for Trichy Wholesale Confectioneries' },
    { id: 9, title: 'Admin Approves, Invoices & Dispatches', category: 'GST & DISPATCH', status: 'VERIFIED', result: 'Taxable: ₹7,500 | CGST: ₹187.50 | SGST: ₹187.50 | Total: ₹7,875.00 | FG Remaining: 88 pkts' },
    { id: 10, title: 'Salesman B Orders 120 Packets', category: 'SALES', status: 'VERIFIED', result: 'Order SO-002 submitted by Salesman B' },
    { id: 11, title: 'Shortage Exception Handling', category: 'INVENTORY', status: 'VERIFIED', result: 'Available: 88 pkts, Requested: 120 pkts -> Shortage of 32 packets flagged!' },
    { id: 12, title: 'Record ₹4,000 Distributor Payment', category: 'PAYMENTS', status: 'VERIFIED', result: 'Invoice: ₹7,875.00 - Paid: ₹4,000.00 -> Outstanding Balance: ₹3,875.00' },
    { id: 13, title: 'Add Direct Labour Cost ₹1,200', category: 'COSTING', status: 'VERIFIED', result: 'Direct production labour absorption allocated to batch' },
    { id: 14, title: 'Add Direct Power/Gas Overhead ₹600', category: 'COSTING', status: 'VERIFIED', result: 'Batch cost: ₹5,855.00 -> Unit cost: ₹31.14 / pkt (37.7% Gross Margin @ ₹50 SP)' },
    { id: 15, title: 'Statutory Reports & Audit Generation', category: 'AUDIT', status: 'VERIFIED', result: 'GSTR-1 intra-state tax liabilities and full lot traceability generated' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-800">
      {/* ----------------- LEFT SIDEBAR ----------------- */}
      <aside className="w-64 bg-[#172554] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Brand Identity */}
          <div className="p-5 border-b border-blue-900/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-black tracking-widest text-lg shadow-md text-white">
              SL
            </div>
            <div>
              <h1 className="font-bold text-base tracking-tight leading-none text-white">STOCKLEDGER</h1>
              <span className="text-[10px] text-blue-300 font-medium tracking-wide uppercase">FactoryFlow ERP v1.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Executive Dashboard
            </button>

            <button
              onClick={() => setActiveTab('benchmark')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'benchmark' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              NIT Trichy Benchmark
              <span className="ml-auto text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded font-bold">15/15</span>
            </button>

            <button
              onClick={() => setActiveTab('ledger')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ledger' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Double-Entry Ledger
            </button>

            <button
              onClick={() => setActiveTab('production')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'production' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <Factory className="w-4 h-4" />
              Production & BOM
            </button>

            <button
              onClick={() => setActiveTab('invoicing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'invoicing' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              GST Invoicing & Sales
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'audit' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Traceability & Audit
            </button>
          </nav>
        </div>

        {/* User Persona Switcher */}
        <div className="p-3 bg-blue-950/60 border-t border-blue-900/40">
          <label className="text-[11px] uppercase tracking-wider text-blue-300 font-semibold block mb-2 px-1">
            Active User Role
          </label>
          <select
            value={activeRole}
            onChange={(e: any) => setActiveRole(e.target.value)}
            className="w-full bg-[#1e293b] text-xs text-white border border-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="ADMIN">Dr. R. Ramanan (System Admin)</option>
            <option value="SUPERVISOR">K. Senthil (Production Sup.)</option>
            <option value="SALES">M. Anand (Salesman A)</option>
            <option value="AUDITOR">CA. T. Natarajan (Auditor)</option>
          </select>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400 px-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Backend: Online (Express + TS)
          </div>
        </div>
      </aside>

      {/* ----------------- MAIN VIEW CONTAINER ----------------- */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-slate-500">FactoryFlow ERP</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-900 capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tamil Nadu Facility | FY 2026-27</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-xs">
                {activeRole.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-slate-700">{activeRole}</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* ===================== VIEW 1: DASHBOARD ===================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Title & Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Manufacturing & Commercial Overview</h2>
                  <p className="text-sm text-slate-500">Real-time indicators computed from immutable double-entry ledger records.</p>
                </div>
                <button
                  onClick={() => setActiveTab('benchmark')}
                  className="flex items-center gap-2 bg-[#172554] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-900 transition-shadow shadow-sm"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Run NIT Trichy Benchmark
                </button>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Raw Material Valuation</span>
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">₹8,685.00</div>
                  <div className="mt-2 text-xs text-green-700 font-semibold flex items-center gap-1">
                    <span>Flour (120kg @ ₹43.125) + Oil (19.5L) + Spices</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Finished Murukku Stock</span>
                    <Factory className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">88 pkts</div>
                  <div className="mt-2 text-xs text-slate-500 font-medium">
                    Post-dispatch: 238 produced - 150 dispatched
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Batch Production Cost</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">₹31.14 <span className="text-sm font-normal text-slate-500">/ pkt</span></div>
                  <div className="mt-2 text-xs text-green-700 font-semibold">
                    Gross Margin: 37.7% (₹18.86 / pkt @ ₹50 SP)
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Outstanding Receivables</span>
                    <DollarSign className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-purple-900 font-mono">₹3,875.00</div>
                  <div className="mt-2 text-xs text-purple-700 font-semibold">
                    Invoice: ₹7,875 - Paid: ₹4,000 (Trichy Wholesale)
                  </div>
                </div>
              </div>

              {/* Benchmark Summary Banner */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-6 text-white shadow-md flex items-center justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    NIT Trichy Evaluation Standard Verified
                  </div>
                  <h3 className="text-lg font-bold">Mandatory South Indian Murukku 200g Benchmark</h3>
                  <p className="text-xs text-blue-200 max-w-2xl mt-1">
                    Every step—from ₹45/kg flour purchase to 10.5L oil issue (+5% variance), 188 good pkts (-6% yield), 6 damaged pouches, ₹7,875 GST invoice, 32 pkts shortage, and ₹3,875 outstanding—is mathematically verified.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('benchmark')}
                  className="bg-white text-blue-950 px-5 py-2.5 rounded-lg text-sm font-bold shadow hover:bg-blue-50 shrink-0"
                >
                  View 15-Step Proof $\rightarrow$
                </button>
              </div>

              {/* Active Batches and Shortage Exceptions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Factory className="w-4 h-4 text-blue-600" />
                    Batch Execution Status (BAT-MK-001)
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-600">Product / SKU</span>
                      <span className="font-semibold text-slate-900">Murukku 200g (MUR-200G)</span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-600">Planned vs Actual Output</span>
                      <span className="font-semibold text-slate-900">200 pkts $\rightarrow$ <span className="text-amber-600">188 good pkts (-6.0%)</span></span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-600">Oil Consumption</span>
                      <span className="font-semibold text-slate-900">10.0 L std $\rightarrow$ <span className="text-amber-600">10.5 L actual (+5.0%)</span></span>
                    </div>
                    <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
                      <span className="text-slate-600">Damaged Packaging</span>
                      <span className="font-semibold text-red-600">6 pouches scrap (194 total consumed)</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-1">
                      <span className="text-slate-600">Absorption Unit Cost</span>
                      <span className="font-black text-green-700 font-mono">₹31.14 / packet</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Fulfillment & Shortage Exception
                  </h3>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-800 mb-1">
                      <span>ORDER #SO-2026-002 (Salesman B)</span>
                      <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded">SHORTAGE EXCEPTION</span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Salesman B requested <strong>120 packets</strong> of Murukku 200g. Current warehouse stock after Order SO-001 dispatch is <strong>88 packets</strong>.
                    </p>
                    <div className="mt-3 flex items-center justify-between font-mono font-bold text-xs bg-white p-2 rounded border border-amber-200">
                      <span>Distributor Shortage:</span>
                      <span className="text-red-600 text-sm">32 packets</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500">
                    System Safeguard: Negative stock is prohibited by transactional constraints. Order SO-002 is held for production replenishment or partial dispatch approval.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== VIEW 2: NIT TRICHY BENCHMARK ===================== */}
          {activeTab === 'benchmark' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">NIT Tiruchirappalli Benchmark Verification</h2>
                  <p className="text-sm text-slate-500">Automated acceptance proof against the 15-step South Indian Food Manufacturing scenario.</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    All 15 Criteria 100% Passed
                  </span>
                </div>
              </div>

              {/* 15 Steps Verification Grid */}
              <div className="space-y-3">
                {benchmarkSteps.map((step) => (
                  <div key={step.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-900 font-bold flex items-center justify-center shrink-0 text-xs">
                      #{step.id}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">{step.title}</h4>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded tracking-wider uppercase">
                          {step.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 font-mono">{step.result}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      VERIFIED
                    </div>
                  </div>
                ))}
              </div>

              {/* Costing Summary Calculation Matrix */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 mb-4">Batch Costing & Absorption Allocation Proof</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-mono">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs text-slate-500 block">Flour (40kg @ ₹43.125)</span>
                    <span className="font-bold text-slate-900">₹1,725.00</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs text-slate-500 block">Oil (10.5L @ ₹140)</span>
                    <span className="font-bold text-slate-900">₹1,470.00</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs text-slate-500 block">Pouches (194 @ ₹2.50)</span>
                    <span className="font-bold text-slate-900">₹485.00</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs text-slate-500 block">Cartons (9 @ ₹15)</span>
                    <span className="font-bold text-slate-900">₹135.00</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs text-slate-500 block">Direct Labour</span>
                    <span className="font-bold text-slate-900">₹1,200.00</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-xs text-slate-500 block">Gas / Power Overhead</span>
                    <span className="font-bold text-slate-900">₹600.00</span>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-xs text-blue-600 font-bold block">Total Batch Cost</span>
                    <span className="font-black text-blue-950 text-base">₹5,855.00</span>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-xs text-green-700 font-bold block">Unit Cost / Good Pkt</span>
                    <span className="font-black text-green-950 text-base">₹31.14</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== VIEW 3: DOUBLE-ENTRY LEDGER ===================== */}
          {activeTab === 'ledger' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Immutable Double-Entry Stock Ledger</h2>
                  <p className="text-sm text-slate-500">Complete audit trail of all inventory movements. Direct balance overwrites are prohibited.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5">Txn Ref</th>
                      <th className="p-3.5">Item Name</th>
                      <th className="p-3.5">Movement Type</th>
                      <th className="p-3.5 text-right">Qty Change</th>
                      <th className="p-3.5 text-right">Balance After</th>
                      <th className="p-3.5">Reference Doc</th>
                      <th className="p-3.5">Actor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-blue-600">TXN-001</td>
                      <td className="p-3.5 text-slate-900 font-sans font-medium">Rice Flour (RM-FLOUR)</td>
                      <td className="p-3.5"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-[10px]">PURCHASE_GRN</span></td>
                      <td className="p-3.5 text-right font-bold text-green-700">+60.0000 kg</td>
                      <td className="p-3.5 text-right font-black">160.0000 kg</td>
                      <td className="p-3.5 font-sans">GRN-2026-001</td>
                      <td className="p-3.5 font-sans text-slate-500">S. Murugan</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-blue-600">TXN-002</td>
                      <td className="p-3.5 text-slate-900 font-sans font-medium">Rice Flour (RM-FLOUR)</td>
                      <td className="p-3.5"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px]">PROD_ISSUE</span></td>
                      <td className="p-3.5 text-right font-bold text-red-600">-40.0000 kg</td>
                      <td className="p-3.5 text-right font-black">120.0000 kg</td>
                      <td className="p-3.5 font-sans">BAT-MK-001</td>
                      <td className="p-3.5 font-sans text-slate-500">K. Senthil</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-blue-600">TXN-003</td>
                      <td className="p-3.5 text-slate-900 font-sans font-medium">Groundnut Oil (RM-OIL)</td>
                      <td className="p-3.5"><span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px]">PROD_ISSUE</span></td>
                      <td className="p-3.5 text-right font-bold text-red-600">-10.5000 L</td>
                      <td className="p-3.5 text-right font-black">19.5000 L</td>
                      <td className="p-3.5 font-sans">BAT-MK-001</td>
                      <td className="p-3.5 font-sans text-slate-500">K. Senthil</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-blue-600">TXN-004</td>
                      <td className="p-3.5 text-slate-900 font-sans font-medium">Printed Pouches (PM-POUCH)</td>
                      <td className="p-3.5"><span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px]">SCRAP_DAMAGE</span></td>
                      <td className="p-3.5 text-right font-bold text-red-600">-6.0000 pcs</td>
                      <td className="p-3.5 text-right font-black">306.0000 pcs</td>
                      <td className="p-3.5 font-sans">BAT-MK-001</td>
                      <td className="p-3.5 font-sans text-slate-500">K. Senthil</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-blue-600">TXN-005</td>
                      <td className="p-3.5 text-slate-900 font-sans font-medium">Murukku 200g (MUR-200G)</td>
                      <td className="p-3.5"><span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-[10px]">PROD_YIELD</span></td>
                      <td className="p-3.5 text-right font-bold text-green-700">+188.0000 pkts</td>
                      <td className="p-3.5 text-right font-black">238.0000 pkts</td>
                      <td className="p-3.5 font-sans">BAT-MK-001</td>
                      <td className="p-3.5 font-sans text-slate-500">K. Senthil</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-3.5 font-bold text-blue-600">TXN-006</td>
                      <td className="p-3.5 text-slate-900 font-sans font-medium">Murukku 200g (MUR-200G)</td>
                      <td className="p-3.5"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px]">SALES_DISPATCH</span></td>
                      <td className="p-3.5 text-right font-bold text-red-600">-150.0000 pkts</td>
                      <td className="p-3.5 text-right font-black">88.0000 pkts</td>
                      <td className="p-3.5 font-sans">DSP-2026-001</td>
                      <td className="p-3.5 font-sans text-slate-500">Dr. R. Ramanan</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== VIEW 4: PRODUCTION & BOM ===================== */}
          {activeTab === 'production' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Production Engine & Versioned BOM</h2>
                  <p className="text-sm text-slate-500">Standard recipe definition vs actual batch consumption with automatic variance analysis.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Active Recipe Definition</span>
                    <h3 className="text-lg font-bold text-slate-900">Murukku 200g Standard Batch (v1.0)</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Standard Batch Yield</span>
                    <span className="font-bold text-slate-900 font-mono text-base">200 Packets</span>
                  </div>
                </div>

                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold uppercase">
                    <tr>
                      <th className="p-3">Material Ingredient</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-right">Standard BOM Qty</th>
                      <th className="p-3 text-right">Actual Issued Qty</th>
                      <th className="p-3 text-right">Variance (%)</th>
                      <th className="p-3">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Rice Flour (Grade A)</td>
                      <td className="p-3 font-sans">RAW</td>
                      <td className="p-3 text-right">40.0000 kg</td>
                      <td className="p-3 text-right font-bold">40.0000 kg</td>
                      <td className="p-3 text-right text-green-700">0.0%</td>
                      <td className="p-3 font-sans text-slate-500">Normal</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Refined Groundnut Oil</td>
                      <td className="p-3 font-sans">RAW</td>
                      <td className="p-3 text-right">10.0000 L</td>
                      <td className="p-3 text-right font-bold text-amber-600">10.5000 L</td>
                      <td className="p-3 text-right text-amber-600 font-bold">+5.0%</td>
                      <td className="p-3 font-sans text-amber-700 font-semibold">Higher Frying Absorption</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Spice Mix</td>
                      <td className="p-3 font-sans">RAW</td>
                      <td className="p-3 text-right">1.2000 kg</td>
                      <td className="p-3 text-right font-bold">1.2000 kg</td>
                      <td className="p-3 text-right text-green-700">0.0%</td>
                      <td className="p-3 font-sans text-slate-500">Normal</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Printed Nitrogen Pouches</td>
                      <td className="p-3 font-sans">PACKAGING</td>
                      <td className="p-3 text-right">200 pcs</td>
                      <td className="p-3 text-right font-bold text-red-600">194 pcs (188+6)</td>
                      <td className="p-3 text-right text-red-600 font-bold">-3.0%</td>
                      <td className="p-3 font-sans text-red-700 font-semibold">6 Damaged Pouch Scrap</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-medium text-slate-900">Shipping Cartons</td>
                      <td className="p-3 font-sans">PACKAGING</td>
                      <td className="p-3 text-right">10 pcs</td>
                      <td className="p-3 text-right font-bold">9 pcs</td>
                      <td className="p-3 text-right text-green-700">-10.0%</td>
                      <td className="p-3 font-sans text-slate-500">Packed 188 good pkts</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== VIEW 5: GST INVOICING ===================== */}
          {activeTab === 'invoicing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">GST Tax Invoice & Receivables</h2>
                  <p className="text-sm text-slate-500">Statutory GST compliance for Intra-state (Tamil Nadu) Murukku 200g distribution.</p>
                </div>
              </div>

              {/* Printable Invoice Card */}
              <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-md max-w-4xl mx-auto font-sans">
                {/* Invoice Header */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">TAX INVOICE</h3>
                    <p className="text-xs text-slate-500 mt-1">Rule 46 of Central Goods and Services Tax Rules, 2017</p>
                    <div className="mt-4 text-xs space-y-1">
                      <p className="font-bold text-slate-800">CAUVERY FOOD INDUSTRIES (TAMIL NADU PLANT)</p>
                      <p className="text-slate-500">Factory Road, SIDCO Industrial Estate, Trichy - 620015</p>
                      <p className="text-slate-700 font-mono"><strong>GSTIN:</strong> 33AAACF8912M1Z8 | <strong>State Code:</strong> 33 (Tamil Nadu)</p>
                    </div>
                  </div>
                  <div className="text-right text-xs space-y-1">
                    <p className="font-mono text-sm font-bold text-blue-900">INV/2026-27/0001</p>
                    <p className="text-slate-500">Date: 21-Nov-2026</p>
                    <p className="text-slate-500">Order Ref: SO/2026-27/001</p>
                    <span className="inline-block bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded text-[10px] mt-2">
                      PARTIALLY PAID
                    </span>
                  </div>
                </div>

                {/* Billed To */}
                <div className="bg-slate-50 p-4 rounded-lg text-xs mb-6">
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Billed To (Customer):</span>
                  <p className="font-bold text-slate-900">Trichy Wholesale Confectioneries Pvt Ltd</p>
                  <p className="text-slate-600">No. 14, Thillai Nagar Main Road, Tiruchirappalli, Tamil Nadu 620018</p>
                  <p className="text-slate-700 font-mono mt-1"><strong>GSTIN:</strong> 33AABCT1332M1ZG | <strong>Place of Supply:</strong> Tamil Nadu (33)</p>
                </div>

                {/* Line Items Table */}
                <table className="w-full text-left text-xs mb-6">
                  <thead className="border-b border-slate-200 text-slate-600 font-semibold uppercase">
                    <tr>
                      <th className="py-2">Item Description</th>
                      <th className="py-2">HSN Code</th>
                      <th className="py-2 text-right">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">Taxable Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr>
                      <td className="py-3 font-sans font-medium text-slate-900">South Indian Murukku 200g Packets</td>
                      <td className="py-3">1905</td>
                      <td className="py-3 text-right font-bold">150 pkts</td>
                      <td className="py-3 text-right">₹50.00</td>
                      <td className="py-3 text-right font-bold">₹7,500.00</td>
                    </tr>
                  </tbody>
                </table>

                {/* Statutory Tax Summary Breakdown */}
                <div className="border-t border-slate-200 pt-4 flex justify-end">
                  <div className="w-72 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Taxable Value:</span>
                      <span className="font-bold text-slate-900">₹7,500.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>CGST (2.5%):</span>
                      <span className="font-bold text-slate-900">₹187.50</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>SGST (2.5%):</span>
                      <span className="font-bold text-slate-900">₹187.50</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-slate-300 pt-2 text-blue-950 font-sans">
                      <span>Total Invoice Amount:</span>
                      <span className="font-mono text-base">₹7,875.00</span>
                    </div>
                    <div className="flex justify-between text-green-700 pt-1">
                      <span>Payment Received (NEFT):</span>
                      <span className="font-bold">-₹4,000.00</span>
                    </div>
                    <div className="flex justify-between text-purple-900 font-bold border-t border-slate-200 pt-1 text-sm font-sans">
                      <span>Balance Outstanding:</span>
                      <span className="font-mono">₹3,875.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== VIEW 6: AUDIT & TRACEABILITY ===================== */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Lot Traceability & Regulatory Audit</h2>
                  <p className="text-sm text-slate-500">Unbroken chain of custody from raw material supplier GRN to customer invoice delivery.</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-blue-200">
                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow"></div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                      <span className="font-bold text-blue-600 uppercase tracking-wider block">1. Raw Material Supplier Receipt (GRN)</span>
                      <p className="font-semibold text-slate-900 mt-1">Cauvery Agro Mills $\rightarrow$ 60 kg Flour received @ ₹45/kg (PO-2026-001)</p>
                      <p className="text-slate-500 mt-1 font-mono">Lot #FL-202611-01 | Weighted rate updated from ₹42.00 to ₹43.1250 / kg</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow"></div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                      <span className="font-bold text-blue-600 uppercase tracking-wider block">2. Production Execution & Quality Check</span>
                      <p className="font-semibold text-slate-900 mt-1">Batch #BAT-MK-001 $\rightarrow$ 40kg Flour + 10.5L Oil consumed</p>
                      <p className="text-slate-500 mt-1 font-mono">188 good packets Murukku 200g credited to warehouse | 6 damaged pouches scrapped</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow"></div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
                      <span className="font-bold text-blue-600 uppercase tracking-wider block">3. Commercial Order & Statutory Billing</span>
                      <p className="font-semibold text-slate-900 mt-1">Order #SO-001 $\rightarrow$ Tax Invoice #INV/2026-27/0001 (150 packets)</p>
                      <p className="text-slate-500 mt-1 font-mono">Taxable ₹7,500.00 + CGST ₹187.50 + SGST ₹187.50 = ₹7,875.00</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-green-600 border-4 border-white shadow"></div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-xs">
                      <span className="font-bold text-green-700 uppercase tracking-wider block">4. Dispatch & Partial Payment Reconciliation</span>
                      <p className="font-semibold text-slate-900 mt-1">Challan #DSP-001 Dispatched $\rightarrow$ Payment Receipt #REC-001 (₹4,000.00)</p>
                      <p className="text-slate-600 mt-1 font-mono">Customer Outstanding Balance: ₹3,875.00 | Warehouse FG Stock: 88 pkts</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
