import React from 'react';
import { Logo } from './Logo.js';
import { ThemeToggle } from './ThemeToggle.js';
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Factory,
  Package,
  FileText,
  DollarSign,
  Layers,
  TrendingUp,
  UserCheck,
  ChevronRight
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
    <div className="min-h-screen bg-white dark:bg-[#0A0614] text-slate-900 dark:text-slate-100 font-sans selection:bg-purple-600 selection:text-white transition-colors duration-200">
      {/* ----------------- TOP NAVBAR ----------------- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-[#0E091B]/95 border-b border-slate-200/80 dark:border-purple-900/40 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo variant="horizontal" size="md" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Core Architecture</a>
            <a href="#workflow" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Order-to-Audit Flow</a>
            <a href="#personas" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Roles & Workspaces</a>
            <a href="#benchmark" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Benchmark Proof</a>
          </nav>

          {/* Controls & Auth CTA Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Dark Mode Moon/Sun Toggle */}
            <ThemeToggle />

            <button
              onClick={() => onOpenAuth('LOGIN')}
              className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-4 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => onOpenAuth('REGISTER')}
              className="text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md shadow-purple-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Launch ERP
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden bg-white dark:bg-[#0A0614] transition-colors duration-200">
        {/* Ambient Radial Lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-100/70 dark:from-purple-900/30 via-violet-50/40 dark:via-purple-950/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Release Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800 text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-sm">
            <span>Manufacturing & Inventory ERP v1.0 • South Indian Food Processing Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            From Order to Audit. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 dark:from-purple-400 dark:via-purple-300 dark:to-indigo-300">
              One Connected System.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Built for enterprise-grade food manufacturing. Features an <strong className="text-slate-900 dark:text-white">immutable double-entry stock ledger</strong>, version-controlled BOMs with dynamic yield variance tracking, real-time finished goods shortage handling, and statutory GST compliance.
          </p>

          {/* Tagline Badge */}
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-extrabold">
            Every Stock <span className="text-purple-600 dark:text-purple-400">·</span> Every Transaction <span className="text-purple-600 dark:text-purple-400">·</span> Every Detail
          </p>

          {/* Hero Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onQuickDemoLogin('admin@stockledger.in', 'S Ramanan', 'ADMIN')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-xl shadow-purple-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Instant Admin Demo Access</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenAuth('LOGIN')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white dark:bg-[#150F24] hover:bg-slate-50 dark:hover:bg-[#1E1535] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-purple-800/80 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Sign In / Choose Persona</span>
            </button>
          </div>

          {/* Enterprise Architectural Trust Chips */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
            <span className="px-3 py-1 rounded-full bg-slate-50 dark:bg-[#140D26] border border-slate-200 dark:border-purple-900/40 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              No Direct Balance Overwrites
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-50 dark:bg-[#140D26] border border-slate-200 dark:border-purple-900/40 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Moving Weighted-Average Costing (AS-2)
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-50 dark:bg-[#140D26] border border-slate-200 dark:border-purple-900/40 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Statutory 5% GST Intra/Inter-State
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-50 dark:bg-[#140D26] border border-slate-200 dark:border-purple-900/40 flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              100% Verified Standard Benchmark
            </span>
          </div>
        </div>

        {/* ----------------- INTERACTIVE DASHBOARD PREVIEW MOCKUP ----------------- */}
        <div className="mt-14 max-w-6xl mx-auto rounded-2xl p-2 bg-gradient-to-b from-purple-100/60 dark:from-purple-900/40 via-slate-100/40 dark:via-purple-950/20 to-transparent shadow-xl border border-slate-200 dark:border-purple-900/40">
          <div className="bg-white dark:bg-[#120B22] rounded-xl overflow-hidden border border-slate-200 dark:border-purple-900/40 p-6 space-y-6 shadow-sm">
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-purple-900/40 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <span className="font-mono text-slate-600 dark:text-slate-400">stockledger.in/app/executive-dashboard</span>
              </div>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Backend REST Engine: Online
              </span>
            </div>

            {/* Mock KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
              <div className="bg-slate-50 dark:bg-[#1A122E] p-4 rounded-xl border border-slate-200 dark:border-purple-900/40">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">
                  <span>RM Valuation</span>
                  <Package className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono">₹8,685.00</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Flour 120kg @ ₹43.125 + Oil 19.5L</div>
              </div>

              <div className="bg-slate-50 dark:bg-[#1A122E] p-4 rounded-xl border border-slate-200 dark:border-purple-900/40">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">
                  <span>Finished Goods</span>
                  <Factory className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono">88 pkts</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">238 produced - 150 dispatched</div>
              </div>

              <div className="bg-slate-50 dark:bg-[#1A122E] p-4 rounded-xl border border-slate-200 dark:border-purple-900/40">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">
                  <span>Packet Unit Cost</span>
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white font-mono">₹31.14</div>
                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold mt-1">37.7% Gross Margin @ ₹50 SP</div>
              </div>

              <div className="bg-slate-50 dark:bg-[#1A122E] p-4 rounded-xl border border-slate-200 dark:border-purple-900/40">
                <div className="flex justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-1">
                  <span>Receivables Due</span>
                  <DollarSign className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-xl font-black text-purple-900 dark:text-purple-300 font-mono">₹3,875.00</div>
                <div className="text-[10px] text-purple-700 dark:text-purple-400 font-bold mt-1">INV #0001: ₹7,875 - ₹4,000 paid</div>
              </div>
            </div>

            {/* Mock Live Stream */}
            <div className="bg-slate-50 dark:bg-[#1A122E] p-4 rounded-xl border border-slate-200 dark:border-purple-900/40 text-left text-xs font-mono">
              <div className="text-slate-600 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Recent Double-Entry Stock Movement Ledger</span>
                <span className="text-purple-600 dark:text-purple-400 font-sans text-[10px] font-bold">6 movements logged</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-700 dark:text-slate-300 py-1 border-b border-slate-200 dark:border-purple-900/30">
                  <span className="text-purple-700 dark:text-purple-400 font-bold">TXN-006</span>
                  <span>MUR-200G · Murukku 200g</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">SALES_DISPATCH</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">-150 pkts</span>
                  <span className="text-slate-900 dark:text-white font-bold">88 pkts balance</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 py-1 border-b border-slate-200 dark:border-purple-900/30">
                  <span className="text-purple-700 dark:text-purple-400 font-bold">TXN-005</span>
                  <span>MUR-200G · Murukku 200g</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">PROD_YIELD</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">+188 pkts</span>
                  <span className="text-slate-900 dark:text-white font-bold">238 pkts balance</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300 py-1">
                  <span className="text-purple-700 dark:text-purple-400 font-bold">TXN-003</span>
                  <span>RM-OIL · Groundnut Oil</span>
                  <span className="text-amber-700 dark:text-amber-400 font-bold">PROD_ISSUE</span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold">-10.5 L</span>
                  <span className="text-slate-900 dark:text-white font-bold">19.5 L balance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- CORE ARCHITECTURE SECTION ----------------- */}
      <section id="features" className="py-20 px-6 bg-[#F8FAFC] dark:bg-[#07040D] border-t border-slate-200 dark:border-purple-900/40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Architectural Foundations</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Engineered for Mathematical Correctness</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Unlike traditional CRUD platforms that directly overwrite database columns, Stockledger implements an audited financial and material ledger engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#120B22] border border-slate-200 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg transition-all space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/80 flex items-center justify-center font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Double-Entry Stock Ledger</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Every material inward, production issue, scrap write-off, and customer dispatch is committed as an immutable journal entry with a running balance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#120B22] border border-slate-200 dark:border-purple-900/40 hover:border-amber-300 dark:hover:border-amber-500 hover:shadow-lg transition-all space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/80 flex items-center justify-center font-bold">
                <Factory className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">BOM & Yield Variances</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Standard bill of materials calculates planned consumption. Isolates yield variances (-6.0%) and ingredient overconsumption (+5.0% oil) automatically.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#120B22] border border-slate-200 dark:border-purple-900/40 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-lg transition-all space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-800/80 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Statutory GST Invoicing</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Automated intra-state (2.5% CGST + 2.5% SGST) and inter-state (5% IGST) computation, HSN 1905 classification, and partial payment reconciliation.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#120B22] border border-slate-200 dark:border-purple-900/40 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-lg transition-all space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/80 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Absorption Costing</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Dynamically rolls raw material weighted rates, direct packaging scrap, labour overheads, and utilities into the true unit cost of every packet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- ORDER-TO-AUDIT FLOW ----------------- */}
      <section id="workflow" className="py-20 px-6 bg-white dark:bg-[#0A0614] border-t border-slate-200 dark:border-purple-900/40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Complete Lifecycle</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">The Connected Order-to-Audit Workflow</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              A single operational event seamlessly updates every dependent module in real time without human data duplication.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#120B22] border border-slate-200/80 dark:border-purple-900/40 space-y-3 shadow-sm">
              <div className="text-purple-600 dark:text-purple-400 font-mono font-bold text-xs">STEP 01</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Purchase GRN</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Inward 60kg flour @ ₹45. Weighted average rate dynamically adjusts to ₹43.1250/kg.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#120B22] border border-slate-200/80 dark:border-purple-900/40 space-y-3 shadow-sm">
              <div className="text-purple-600 dark:text-purple-400 font-mono font-bold text-xs">STEP 02</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Batch Production</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Consume 40kg flour, 10.5L oil. Produce 188 good pkts. Log 6 scrap pouches and 9 cartons.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#120B22] border border-slate-200/80 dark:border-purple-900/40 space-y-3 shadow-sm">
              <div className="text-purple-600 dark:text-purple-400 font-mono font-bold text-xs">STEP 03</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Sales Order</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Salesman A orders 150 pkts. Real-time availability check confirms 238 pkts in stock.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#120B22] border border-slate-200/80 dark:border-purple-900/40 space-y-3 shadow-sm">
              <div className="text-purple-600 dark:text-purple-400 font-mono font-bold text-xs">STEP 04</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Shortage Detection</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Salesman B orders 120 pkts. Warehouse has only 88 pkts left. System flags 32 pkts shortage!
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#120B22] border border-slate-200/80 dark:border-purple-900/40 space-y-3 shadow-sm">
              <div className="text-purple-600 dark:text-purple-400 font-mono font-bold text-xs">STEP 05</div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">GST Billing & Pay</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Generate ₹7,875 GST invoice. Customer pays ₹4,000. Balance updates to ₹3,875.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- 5 PERSONAS / ROLES ----------------- */}
      <section id="personas" className="py-20 px-6 bg-[#F8FAFC] dark:bg-[#07040D] border-t border-slate-200 dark:border-purple-900/40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">Role-Based Experiences</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Tailored Workspaces for Every Team Member</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Click any persona below to launch the live ERP with that exact authorization profile.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {/* Persona 1 */}
            <div
              onClick={() => onQuickDemoLogin('admin@stockledger.in', 'S Ramanan', 'ADMIN')}
              className="p-6 rounded-2xl bg-white dark:bg-[#160E2A] border border-purple-200 dark:border-purple-700/80 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-xl transition-all cursor-pointer group shadow-sm ring-1 ring-purple-100 dark:ring-purple-900/30"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 font-bold text-[10px] tracking-wider uppercase">
                  Full Authority
                </span>
                <span className="text-xs text-slate-500 dark:text-purple-300 group-hover:text-purple-600 dark:group-hover:text-purple-200 flex items-center gap-1 font-bold">
                  Test Drive <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">System Administrator</h4>
              <span className="text-xs text-purple-700 dark:text-purple-400 block mb-2 font-mono font-semibold">S Ramanan (admin@stockledger.in)</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Full governance, order approvals, dispatch execution, system state resets, and executive oversight.
              </p>
            </div>

            {/* Persona 2 */}
            <div
              onClick={() => onQuickDemoLogin('supervisor@stockledger.in', 'K. Senthil', 'PRODUCTION_SUPERVISOR')}
              className="p-6 rounded-2xl bg-white dark:bg-[#120B22] border border-slate-200 dark:border-purple-900/40 hover:border-amber-400 hover:shadow-xl transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-bold text-[10px] tracking-wider uppercase">
                  Manufacturing Floor
                </span>
                <span className="text-xs text-slate-500 dark:text-amber-300 group-hover:text-amber-600 dark:group-hover:text-amber-200 flex items-center gap-1 font-bold">
                  Test Drive <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Production Supervisor</h4>
              <span className="text-xs text-amber-700 dark:text-amber-400 block mb-2 font-mono font-semibold">K. Senthil (supervisor@stockledger.in)</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                BOM execution, actual ingredient consumption, yield variance tracking, and packaging scrap logging.
              </p>
            </div>

            {/* Persona 3 */}
            <div
              onClick={() => onQuickDemoLogin('salesmanA@stockledger.in', 'M. Anand', 'SALES_EXECUTIVE')}
              className="p-6 rounded-2xl bg-white dark:bg-[#120B22] border border-slate-200 dark:border-purple-900/40 hover:border-green-400 hover:shadow-xl transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 font-bold text-[10px] tracking-wider uppercase">
                  Commercial Orders
                </span>
                <span className="text-xs text-slate-500 dark:text-green-300 group-hover:text-green-600 dark:group-hover:text-green-200 flex items-center gap-1 font-bold">
                  Test Drive <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Sales Executive</h4>
              <span className="text-xs text-green-700 dark:text-green-400 block mb-2 font-mono font-semibold">M. Anand (salesmanA@stockledger.in)</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Customer sales order entry, real-time finished goods stock availability checks, and shortage escalations.
              </p>
            </div>

            {/* Persona 4 */}
            <div
              onClick={() => onQuickDemoLogin('store@stockledger.in', 'S. Murugan', 'INVENTORY_MANAGER')}
              className="p-6 rounded-2xl bg-white dark:bg-[#120B22] border border-slate-200 dark:border-purple-900/40 hover:border-emerald-400 hover:shadow-xl transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-[10px] tracking-wider uppercase">
                  Warehouse & Stores
                </span>
                <span className="text-xs text-slate-500 dark:text-emerald-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-200 flex items-center gap-1 font-bold">
                  Test Drive <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Inventory Manager</h4>
              <span className="text-xs text-emerald-700 dark:text-emerald-400 block mb-2 font-mono font-semibold">S. Murugan (store@stockledger.in)</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Supplier inward purchase receipts (GRN), moving weighted average updates, and reorder point alerts.
              </p>
            </div>

            {/* Persona 5 */}
            <div
              onClick={() => onQuickDemoLogin('auditor@stockledger.in', 'CA. T. Natarajan', 'FINANCIAL_AUDITOR')}
              className="p-6 rounded-2xl bg-white dark:bg-[#120B22] border border-slate-200 dark:border-purple-900/40 hover:border-purple-400 hover:shadow-xl transition-all cursor-pointer group sm:col-span-2 lg:col-span-2 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 font-bold text-[10px] tracking-wider uppercase">
                  Financial & Statutory
                </span>
                <span className="text-xs text-slate-500 dark:text-purple-300 group-hover:text-purple-600 dark:group-hover:text-purple-200 flex items-center gap-1 font-bold">
                  Test Drive <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Financial & Statutory Auditor</h4>
              <span className="text-xs text-purple-700 dark:text-purple-400 block mb-2 font-mono font-semibold">CA. T. Natarajan (auditor@stockledger.in)</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Immutable ledger movement auditing, GST invoice tax compliance verification, absorption costing inspection, and lot traceability forensics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- BENCHMARK PROOF SECTION ----------------- */}
      <section id="benchmark" className="py-20 px-6 bg-white dark:bg-[#0A0614] border-t border-slate-200 dark:border-purple-900/40 transition-colors duration-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Acceptance Proof</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">15-Step Standard Manufacturing Proof</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              The platform executes and mathematically proves all 15 steps of the South Indian Murukku 200g manufacturing scenario.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-[#120B22] p-8 rounded-2xl border border-slate-200 dark:border-purple-900/40 space-y-6 shadow-sm">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-purple-900/40">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Automated Test Engine Status</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">Decimal.js Precision Engine • Zero Floating Point Drift</p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-xs border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                All 15 Criteria 100% Verified
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono text-left">
              <div className="p-3.5 bg-white dark:bg-[#1A122E] rounded-xl border border-slate-200 dark:border-purple-900/40 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Criteria 1: Purchase 60kg Flour</span>
                <span className="font-bold text-slate-900 dark:text-white">Stock: 160kg @ ₹43.1250/kg</span>
              </div>
              <div className="p-3.5 bg-white dark:bg-[#1A122E] rounded-xl border border-slate-200 dark:border-purple-900/40 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Criteria 5: Batch Good Output</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">188 pkts (Yield Var: -6.0%)</span>
              </div>
              <div className="p-3.5 bg-white dark:bg-[#1A122E] rounded-xl border border-slate-200 dark:border-purple-900/40 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Criteria 9: Invoice & Dispatch</span>
                <span className="font-bold text-slate-900 dark:text-white">Taxable ₹7,500 + GST ₹375 = ₹7,875</span>
              </div>
              <div className="p-3.5 bg-white dark:bg-[#1A122E] rounded-xl border border-slate-200 dark:border-purple-900/40 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Criteria 11: Shortage Handling</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">Order 120 pkts: Shortage 32 pkts</span>
              </div>
              <div className="p-3.5 bg-white dark:bg-[#1A122E] rounded-xl border border-slate-200 dark:border-purple-900/40 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Criteria 12: Partial Payment</span>
                <span className="font-bold text-slate-900 dark:text-white">Paid ₹4,000 -&gt; Balance ₹3,875</span>
              </div>
              <div className="p-3.5 bg-white dark:bg-[#1A122E] rounded-xl border border-slate-200 dark:border-purple-900/40 shadow-sm">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Criteria 14: Unit Costing</span>
                <span className="font-bold text-slate-900 dark:text-white">Unit Cost ₹31.14 / pkt (37.7% Margin)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="py-10 px-6 bg-slate-100 dark:bg-[#07040D] border-t border-slate-200 dark:border-purple-900/40 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Logo variant="mark" size="sm" />
            <span className="font-bold text-slate-800 dark:text-slate-200 tracking-wide">STOCKLEDGER ERP</span>
          </div>

          <div className="font-medium text-slate-600 dark:text-slate-400 text-center sm:text-right">
            <span>© 2026 Stockledger. All Rights Are Reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
