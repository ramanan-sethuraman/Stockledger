import React from 'react';
import { Logo } from './Logo.js';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Factory,
  Package,
  FileText,
  DollarSign,
  Layers,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  Cpu,
  BarChart3,
  Building2,
  Truck,
  FileCheck2,
  Lock,
  ChevronRight,
  Zap,
  Boxes
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: (mode?: 'LOGIN' | 'REGISTER') => void;
  onQuickDemoLogin: (email: string, fullName: string, role: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuth,
  onQuickDemoLogin,
}) => {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* ----------------- TOP NAVBAR ----------------- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0F19]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="horizontal" size="md" theme="dark" showTagline={false} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-sky-400 transition-colors">Core Architecture</a>
            <a href="#workflow" className="hover:text-sky-400 transition-colors">Order-to-Audit Flow</a>
            <a href="#personas" className="hover:text-sky-400 transition-colors">Roles & Workspaces</a>
            <a href="#benchmark" className="hover:text-sky-400 transition-colors">Benchmark Proof</a>
          </nav>

          {/* Auth CTA Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAuth('LOGIN')}
              className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('REGISTER')}
              className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-blue-500/50"
            >
              Launch ERP
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Ambient Radial Lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/20 via-sky-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-xs font-semibold text-sky-400 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
            <span>Manufacturing & Inventory ERP v1.0 • South Indian Food Processing Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-[1.1]">
            From Order to Audit. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-300">
              One Connected System.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Built for enterprise-grade food manufacturing. Features an <strong className="text-white">immutable double-entry stock ledger</strong>, version-controlled BOMs with dynamic yield variance tracking, real-time finished goods shortage handling, and statutory GST compliance.
          </p>

          {/* Tagline Badge */}
          <p className="text-xs uppercase tracking-widest text-slate-400 font-extrabold">
            Every Stock <span className="text-sky-400">·</span> Every Transaction <span className="text-sky-400">·</span> Every Detail
          </p>

          {/* Hero Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onQuickDemoLogin('admin@stockledger.in', 'R. Sundaram', 'ADMIN')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Instant Admin Demo Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('LOGIN')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>Sign In / Choose Persona</span>
            </button>
          </div>

          {/* Enterprise Architectural Trust Chips */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 font-medium">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              No Direct Balance Overwrites
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Moving Weighted-Average Costing (AS-2)
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Statutory 5% GST Intra/Inter-State
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              100% Verified Standard Benchmark
            </span>
          </div>
        </div>

        {/* ----------------- INTERACTIVE DASHBOARD PREVIEW MOCKUP ----------------- */}
        <div className="mt-14 max-w-6xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-slate-700/40 via-slate-800/20 to-transparent shadow-2xl border border-slate-700/50 backdrop-blur-xl">
          <div className="bg-[#0F172A] rounded-xl overflow-hidden border border-slate-800 p-6 space-y-6">
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-mono text-slate-500">stockledger.in/app/executive-dashboard</span>
              </div>
              <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Backend REST Engine: Online
              </span>
            </div>

            {/* Mock KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-400 text-xs font-bold uppercase mb-1">
                  <span>RM Valuation</span>
                  <Package className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-xl font-black text-white font-mono">₹8,685.00</div>
                <div className="text-[10px] text-slate-400 mt-1">Flour 120kg @ ₹43.125 + Oil 19.5L</div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-400 text-xs font-bold uppercase mb-1">
                  <span>Finished Goods</span>
                  <Factory className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-black text-white font-mono">88 pkts</div>
                <div className="text-[10px] text-slate-400 mt-1">238 produced - 150 dispatched</div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-400 text-xs font-bold uppercase mb-1">
                  <span>Packet Unit Cost</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-white font-mono">₹31.14</div>
                <div className="text-[10px] text-emerald-400 mt-1">37.7% Gross Margin @ ₹50 SP</div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-slate-400 text-xs font-bold uppercase mb-1">
                  <span>Receivables Due</span>
                  <DollarSign className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-black text-purple-300 font-mono">₹3,875.00</div>
                <div className="text-[10px] text-purple-400 mt-1">INV #0001: ₹7,875 - ₹4,000 paid</div>
              </div>
            </div>

            {/* Mock Live Stream */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 text-left text-xs font-mono">
              <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Recent Double-Entry Stock Movement Ledger</span>
                <span className="text-sky-400 font-sans text-[10px]">6 movements logged</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60">
                  <span className="text-sky-400 font-bold">TXN-006</span>
                  <span>MUR-200G · Murukku 200g</span>
                  <span className="text-amber-400 font-bold">SALES_DISPATCH</span>
                  <span className="text-rose-400">-150 pkts</span>
                  <span className="text-white font-bold">88 pkts balance</span>
                </div>
                <div className="flex justify-between text-slate-300 py-1 border-b border-slate-800/60">
                  <span className="text-sky-400 font-bold">TXN-005</span>
                  <span>MUR-200G · Murukku 200g</span>
                  <span className="text-emerald-400 font-bold">PROD_YIELD</span>
                  <span className="text-emerald-400">+188 pkts</span>
                  <span className="text-white font-bold">238 pkts balance</span>
                </div>
                <div className="flex justify-between text-slate-300 py-1">
                  <span className="text-sky-400 font-bold">TXN-003</span>
                  <span>RM-OIL · Groundnut Oil</span>
                  <span className="text-amber-400 font-bold">PROD_ISSUE</span>
                  <span className="text-rose-400">-10.5 L</span>
                  <span className="text-white font-bold">19.5 L balance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- CORE ARCHITECTURE SECTION ----------------- */}
      <section id="features" className="py-24 px-6 bg-[#0E1322] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Architectural Foundations</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Engineered for Mathematical Correctness</h2>
            <p className="text-sm text-slate-400">
              Unlike traditional CRUD platforms that directly overwrite database columns, Stockledger implements an audited financial and material ledger engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#131B2E] border border-slate-800 hover:border-blue-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-sky-400 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Double-Entry Stock Ledger</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every material inward, production issue, scrap write-off, and customer dispatch is committed as an immutable journal entry with a running balance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#131B2E] border border-slate-800 hover:border-amber-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">BOM & Yield Variances</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard bill of materials calculates planned consumption. Isolates yield variances (-6.0%) and ingredient overconsumption (+5.0% oil) automatically.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#131B2E] border border-slate-800 hover:border-purple-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Statutory GST Invoicing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated intra-state (2.5% CGST + 2.5% SGST) and inter-state (5% IGST) computation, HSN 1905 classification, and partial payment reconciliation.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-[#131B2E] border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Absorption Unit Costing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Combines moving weighted-average material valuation with direct labor absorption (₹1,200) and power overheads (₹600) to compute exact unit margin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- ORDER-TO-AUDIT FLOW ----------------- */}
      <section id="workflow" className="py-24 px-6 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Complete Lifecycle</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">The Connected Order-to-Audit Workflow</h2>
            <p className="text-sm text-slate-400">
              A single operational event seamlessly updates every dependent module in real time without human data duplication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-sky-400 font-mono font-bold text-xs">STEP 01</div>
              <h4 className="font-bold text-white text-sm">Purchase GRN</h4>
              <p className="text-xs text-slate-400">
                Inward 60kg flour @ ₹45. Weighted average rate dynamically adjusts to ₹43.1250/kg.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-sky-400 font-mono font-bold text-xs">STEP 02</div>
              <h4 className="font-bold text-white text-sm">Batch Production</h4>
              <p className="text-xs text-slate-400">
                Consume 40kg flour, 10.5L oil. Produce 188 good pkts. Log 6 scrap pouches and 9 cartons.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-sky-400 font-mono font-bold text-xs">STEP 03</div>
              <h4 className="font-bold text-white text-sm">Sales Order</h4>
              <p className="text-xs text-slate-400">
                Salesman A orders 150 pkts. Real-time availability check confirms 238 pkts in stock.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-sky-400 font-mono font-bold text-xs">STEP 04</div>
              <h4 className="font-bold text-white text-sm">Shortage Detection</h4>
              <p className="text-xs text-slate-400">
                Salesman B orders 120 pkts. Warehouse has only 88 pkts left. System flags 32 pkts shortage!
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="text-sky-400 font-mono font-bold text-xs">STEP 05</div>
              <h4 className="font-bold text-white text-sm">GST Billing & Pay</h4>
              <p className="text-xs text-slate-400">
                Generate ₹7,875 GST invoice. Customer pays ₹4,000. Balance updates to ₹3,875.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- 5 PERSONAS / ROLES ----------------- */}
      <section id="personas" className="py-24 px-6 bg-[#0E1322] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-400">Role-Based Experiences</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Tailored Workspaces for Every Team Member</h2>
            <p className="text-sm text-slate-400">
              Click any persona below to launch the live ERP with that exact authorization profile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {/* Persona 1 */}
            <div
              onClick={() => onQuickDemoLogin('admin@stockledger.in', 'R. Sundaram', 'ADMIN')}
              className="p-6 rounded-2xl bg-[#131B2E] border border-blue-900/40 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-600/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-blue-500/20 text-sky-400 font-bold text-[10px] tracking-wider uppercase">
                  Full Authority
                </span>
                <span className="text-xs text-slate-400 group-hover:text-sky-400 flex items-center gap-1 font-bold">
                  Test Drive <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">System Administrator</h4>
              <span className="text-xs text-slate-400 block mb-2 font-mono">R. Sundaram (admin@stockledger.in)</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full governance, order approvals, dispatch execution, system state resets, and executive oversight.
              </p>
            </div>

            {/* Persona 2 */}
            <div
              onClick={() => onQuickDemoLogin('supervisor@stockledger.in', 'K. Senthil', 'PRODUCTION_SUPERVISOR')}
              className="p-6 rounded-2xl bg-[#131B2E] border border-amber-900/40 hover:border-amber-500 hover:shadow-xl hover:shadow-amber-600/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] tracking-wider uppercase">
                  Manufacturing Floor
                </span>
                <span className="text-xs text-slate-400 group-hover:text-amber-400 flex items-center gap-1 font-bold">
                  Test Drive <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">Production Supervisor</h4>
              <span className="text-xs text-slate-400 block mb-2 font-mono">K. Senthil (supervisor@stockledger.in)</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                BOM execution, actual ingredient consumption, yield variance tracking, and packaging scrap logging.
              </p>
            </div>

            {/* Persona 3 */}
            <div
              onClick={() => onQuickDemoLogin('salesmanA@stockledger.in', 'M. Anand', 'SALES_EXECUTIVE')}
              className="p-6 rounded-2xl bg-[#131B2E] border border-green-900/40 hover:border-green-500 hover:shadow-xl hover:shadow-green-600/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 font-bold text-[10px] tracking-wider uppercase">
                  Commercial Orders
                </span>
                <span className="text-xs text-slate-400 group-hover:text-green-400 flex items-center gap-1 font-bold">
                  Test Drive <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">Sales Executive</h4>
              <span className="text-xs text-slate-400 block mb-2 font-mono">M. Anand (salesmanA@stockledger.in)</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customer sales order entry, real-time finished goods stock availability checks, and shortage escalations.
              </p>
            </div>

            {/* Persona 4 */}
            <div
              onClick={() => onQuickDemoLogin('store@stockledger.in', 'S. Murugan', 'INVENTORY_MANAGER')}
              className="p-6 rounded-2xl bg-[#131B2E] border border-emerald-900/40 hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-600/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] tracking-wider uppercase">
                  Warehouse & Stores
                </span>
                <span className="text-xs text-slate-400 group-hover:text-emerald-400 flex items-center gap-1 font-bold">
                  Test Drive <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">Inventory Manager</h4>
              <span className="text-xs text-slate-400 block mb-2 font-mono">S. Murugan (store@stockledger.in)</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Supplier inward purchase receipts (GRN), moving weighted average updates, and reorder point alerts.
              </p>
            </div>

            {/* Persona 5 */}
            <div
              onClick={() => onQuickDemoLogin('auditor@stockledger.in', 'CA. T. Natarajan', 'FINANCIAL_AUDITOR')}
              className="p-6 rounded-2xl bg-[#131B2E] border border-purple-900/40 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-600/20 transition-all cursor-pointer group sm:col-span-2 lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-purple-500/20 text-purple-400 font-bold text-[10px] tracking-wider uppercase">
                  Financial & Statutory
                </span>
                <span className="text-xs text-slate-400 group-hover:text-purple-400 flex items-center gap-1 font-bold">
                  Test Drive <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">Financial & Statutory Auditor</h4>
              <span className="text-xs text-slate-400 block mb-2 font-mono">CA. T. Natarajan (auditor@stockledger.in)</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Immutable ledger movement auditing, GST invoice tax compliance verification, absorption costing inspection, and lot traceability forensics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- BENCHMARK PROOF SECTION ----------------- */}
      <section id="benchmark" className="py-24 px-6 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Acceptance Proof</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">15-Step Standard Manufacturing Proof</h2>
            <p className="text-sm text-slate-400">
              The platform executes and mathematically proves all 15 steps of the South Indian Murukku 200g manufacturing scenario.
            </p>
          </div>

          <div className="bg-[#0F172A] p-8 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-lg">Automated Test Engine Status</h3>
                <p className="text-xs text-slate-400 font-mono">Decimal.js Precision Engine • Zero Floating Point Drift</p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                All 15 Criteria 100% Verified
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-left">
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">Criteria 1: Purchase 60kg Flour</span>
                <span className="font-bold text-white">Stock: 160kg @ ₹43.1250/kg</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">Criteria 5: Batch Good Output</span>
                <span className="font-bold text-emerald-400">188 pkts (Yield Var: -6.0%)</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">Criteria 9: Invoice & Dispatch</span>
                <span className="font-bold text-white">Taxable ₹7,500 + GST ₹375 = ₹7,875</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">Criteria 11: Shortage Handling</span>
                <span className="font-bold text-amber-400">Order 120 pkts: Shortage 32 pkts</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">Criteria 12: Partial Payment</span>
                <span className="font-bold text-white">Paid ₹4,000 -&gt; Balance ₹3,875</span>
              </div>
              <div className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">Criteria 14: Unit Costing</span>
                <span className="font-bold text-white">Unit Cost ₹31.14 / pkt (37.7% Margin)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="py-12 px-6 border-t border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo variant="mark" size="sm" theme="dark" />
            <span className="font-bold text-slate-300">STOCKLEDGER ERP</span>
            <span>—</span>
            <span>Every Stock. Every Transaction. Every Detail.</span>
          </div>

          <div className="flex items-center gap-6">
            <span>React 18</span>
            <span>TypeScript</span>
            <span>Tailwind CSS</span>
            <span>Express.js</span>
            <span>Decimal.js</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
