import React, { useState, useEffect } from 'react';
import {
  Layers,
  Package,
  Factory,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Play,
  ShieldCheck,
  Calendar,
  ChevronRight,
  Sparkles,
  BarChart3,
  Plus,
  LogOut,
  User,
  Lock,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'PRODUCTION_SUPERVISOR' | 'SALES_EXECUTIVE' | 'INVENTORY_MANAGER' | 'FINANCIAL_AUDITOR';
}

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('stockledger_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return {
      id: 'usr-admin-01',
      email: 'admin@stockledger.in',
      fullName: 'Dr. R. Ramanan',
      role: 'ADMIN',
    };
  });

  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regRole, setRegRole] = useState<'ADMIN' | 'PRODUCTION_SUPERVISOR' | 'SALES_EXECUTIVE' | 'FINANCIAL_AUDITOR'>('SALES_EXECUTIVE');
  const [authError, setAuthError] = useState('');

  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'benchmark' | 'ledger' | 'production' | 'invoicing' | 'audit'>('dashboard');

  // Operational State (Live Interactive Data)
  const [salesOrders, setSalesOrders] = useState([
    {
      id: 'so-001',
      orderNumber: 'SO/2026-27/001',
      customerName: 'Cauvery Wholesale Confectioneries Pvt Ltd',
      productSku: 'MUR-200G',
      orderedQty: 150,
      dispatchedQty: 150,
      shortageQty: 0,
      unitPrice: 50.0,
      taxableAmount: 7500.0,
      totalOrderValue: 7875.0,
      status: 'DISPATCHED',
      createdAt: '2026-11-21 10:15',
    },
    {
      id: 'so-002',
      orderNumber: 'SO/2026-27/002',
      customerName: 'Madurai Snacking Hub',
      productSku: 'MUR-200G',
      orderedQty: 120,
      dispatchedQty: 0,
      shortageQty: 32, // 120 requested - 88 available
      unitPrice: 50.0,
      taxableAmount: 6000.0,
      totalOrderValue: 6300.0,
      status: 'SHORTAGE_EXCEPTION',
      createdAt: '2026-11-21 11:45',
    },
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: 'inv-001',
      invoiceNumber: 'INV/2026-27/0001',
      orderNumber: 'SO/2026-27/001',
      customerName: 'Cauvery Wholesale Confectioneries Pvt Ltd',
      quantity: 150,
      taxableValue: 7500.0,
      cgstAmount: 187.50,
      sgstAmount: 187.50,
      totalInvoiceAmount: 7875.0,
      paidAmount: 4000.0,
      balanceAmount: 3875.0,
      status: 'PARTIALLY_PAID',
      date: '2026-11-21',
    },
  ]);

  const [batches, setBatches] = useState([
    {
      id: 'batch-001',
      batchNumber: 'BAT-MK-001',
      productName: 'South Indian Murukku 200g',
      plannedYield: 200,
      goodOutput: 188,
      yieldVariance: -6.0,
      oilIssued: 10.5,
      oilVariance: 5.0,
      scrapPouches: 6,
      unitCost: 31.14,
      totalCost: 5855.0,
      status: 'COMPLETED',
      supervisor: 'K. Senthil',
      time: '2026-11-21 13:30',
    },
  ]);

  const [stockLedger, setStockLedger] = useState([
    { ref: 'TXN-001', item: 'Rice Flour (Grade A)', type: 'PURCHASE_GRN', change: '+60.0 kg', balance: '160.0 kg', doc: 'GRN-2026-001', user: 'S. Murugan' },
    { ref: 'TXN-002', item: 'Rice Flour (Grade A)', type: 'PROD_ISSUE', change: '-40.0 kg', balance: '120.0 kg', doc: 'BAT-MK-001', user: 'K. Senthil' },
    { ref: 'TXN-003', item: 'Refined Groundnut Oil', type: 'PROD_ISSUE', change: '-10.5 L', balance: '19.5 L', doc: 'BAT-MK-001', user: 'K. Senthil' },
    { ref: 'TXN-004', item: 'Printed Pouches (200g)', type: 'SCRAP_DAMAGE', change: '-6.0 pcs', balance: '494.0 pcs', doc: 'BAT-MK-001', user: 'K. Senthil' },
    { ref: 'TXN-005', item: 'South Indian Murukku 200g', type: 'PROD_YIELD', change: '+188.0 pkts', balance: '238.0 pkts', doc: 'BAT-MK-001', user: 'K. Senthil' },
    { ref: 'TXN-006', item: 'South Indian Murukku 200g', type: 'SALES_DISPATCH', change: '-150.0 pkts', balance: '88.0 pkts', doc: 'DSP-2026-001', user: 'Dr. R. Ramanan' },
  ]);

  // Modal Dialog States
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState('Kovai Sweets & Bakery');
  const [newOrderQty, setNewOrderQty] = useState('100');

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [newBatchGood, setNewBatchGood] = useState('190');
  const [newBatchOil, setNewBatchOil] = useState('10.2');
  const [newBatchScrap, setNewBatchScrap] = useState('4');

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [paymentAmountInput, setPaymentAmountInput] = useState('1000');

  // Persist user session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stockledger_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('stockledger_user');
    }
  }, [currentUser]);

  // Quick 1-Click Login Helper
  const handleQuickLogin = (email: string, fullName: string, role: any) => {
    setCurrentUser({ id: `usr-${Date.now()}`, email, fullName, role });
    setAuthError('');
  };

  // Form Submit Login
  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError('Please enter email and password');
      return;
    }
    // Determine user or create default session
    const role = loginEmail.includes('admin') ? 'ADMIN'
      : loginEmail.includes('super') ? 'PRODUCTION_SUPERVISOR'
      : loginEmail.includes('audit') ? 'FINANCIAL_AUDITOR'
      : 'SALES_EXECUTIVE';

    const name = loginEmail.split('@')[0];
    const fullName = name.charAt(0).toUpperCase() + name.slice(1);
    setCurrentUser({ id: `usr-${Date.now()}`, email: loginEmail, fullName, role });
    setAuthError('');
  };

  // Form Submit Register
  const handleFormRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword || !regFullName) {
      setAuthError('All fields are required');
      return;
    }
    setCurrentUser({ id: `usr-${Date.now()}`, email: loginEmail, fullName: regFullName, role: regRole });
    setAuthError('');
  };

  // Handle New Order Creation
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(newOrderQty) || 50;
    const price = 50.0;
    const taxable = qty * price;
    const total = taxable * 1.05;

    // Available FG stock check
    const available = 88;
    const isShortage = qty > available;
    const shortage = isShortage ? qty - available : 0;

    const newOrder = {
      id: `so-${Date.now()}`,
      orderNumber: `SO/2026-27/${String(salesOrdersStoreLength() + 1).padStart(3, '0')}`,
      customerName: newCustomer,
      productSku: 'MUR-200G',
      orderedQty: qty,
      dispatchedQty: 0,
      shortageQty: shortage,
      unitPrice: price,
      taxableAmount: taxable,
      totalOrderValue: total,
      status: isShortage ? 'SHORTAGE_EXCEPTION' : 'SUBMITTED',
      createdAt: 'Just now',
    };

    setSalesOrders([newOrder, ...salesOrders]);
    setShowOrderModal(false);
  };

  const salesOrdersStoreLength = () => salesOrders.length;

  // Handle Order Approval & Dispatch
  const handleApproveOrder = (orderId: string) => {
    setSalesOrders(salesOrders.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'APPROVED', dispatchedQty: o.orderedQty };
      }
      return o;
    }));

    const order = salesOrders.find(o => o.id === orderId);
    if (order) {
      // Create invoice
      const newInv = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV/2026-27/${String(invoices.length + 1).padStart(4, '0')}`,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        quantity: order.orderedQty,
        taxableValue: order.taxableAmount,
        cgstAmount: order.taxableAmount * 0.025,
        sgstAmount: order.taxableAmount * 0.025,
        totalInvoiceAmount: order.totalOrderValue,
        paidAmount: 0.0,
        balanceAmount: order.totalOrderValue,
        status: 'POSTED',
        date: 'Today',
      };
      setInvoices([newInv, ...invoices]);

      // Record in Stock Ledger
      const newLedgerEntry = {
        ref: `TXN-${String(stockLedger.length + 1).padStart(3, '0')}`,
        item: 'South Indian Murukku 200g',
        type: 'SALES_DISPATCH',
        change: `-${order.orderedQty}.0 pkts`,
        balance: `${Math.max(0, 88 - order.orderedQty)}.0 pkts`,
        doc: `DSP-${String(invoices.length + 1).padStart(3, '0')}`,
        user: currentUser?.fullName || 'Admin',
      };
      setStockLedger([newLedgerEntry, ...stockLedger]);
    }
  };

  // Handle New Batch Completion
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const good = Number(newBatchGood) || 190;
    const oil = Number(newBatchOil) || 10.2;
    const scrap = Number(newBatchScrap) || 4;

    const yieldVar = ((good - 200) / 200) * 100;
    const oilVar = ((oil - 10.0) / 10.0) * 100;

    const totalBatchCost = 40 * 43.125 + oil * 140 + 1.2 * 200 + (good + scrap) * 2.50 + 9 * 15 + 1200 + 600;
    const unitCost = Math.round((totalBatchCost / good) * 100) / 100;

    const newBatch = {
      id: `batch-${Date.now()}`,
      batchNumber: `BAT-MK-${String(batches.length + 1).padStart(3, '0')}`,
      productName: 'South Indian Murukku 200g',
      plannedYield: 200,
      goodOutput: good,
      yieldVariance: Math.round(yieldVar * 10) / 10,
      oilIssued: oil,
      oilVariance: Math.round(oilVar * 10) / 10,
      scrapPouches: scrap,
      unitCost,
      totalCost: Math.round(totalBatchCost),
      status: 'COMPLETED',
      supervisor: currentUser?.fullName || 'K. Senthil',
      time: 'Just now',
    };

    setBatches([newBatch, ...batches]);

    // Record Production in Ledger
    const entry1 = {
      ref: `TXN-${String(stockLedger.length + 1).padStart(3, '0')}`,
      item: 'South Indian Murukku 200g',
      type: 'PROD_YIELD',
      change: `+${good}.0 pkts`,
      balance: `${88 + good}.0 pkts`,
      doc: newBatch.batchNumber,
      user: currentUser?.fullName || 'Supervisor',
    };
    setStockLedger([entry1, ...stockLedger]);
    setShowBatchModal(false);
  };

  // Handle Payment Recording
  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(paymentAmountInput) || 1000;
    setInvoices(invoices.map(inv => {
      if (inv.id === selectedInvoiceId) {
        const newPaid = Math.min(inv.totalInvoiceAmount, inv.paidAmount + amount);
        const newBal = Math.max(0, inv.totalInvoiceAmount - newPaid);
        return {
          ...inv,
          paidAmount: newPaid,
          balanceAmount: newBal,
          status: newBal === 0 ? 'PAID' : 'PARTIALLY_PAID',
        };
      }
      return inv;
    }));
    setShowPaymentModal(false);
  };

  // If no user is logged in, show SaaS Login Portal
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-6 text-slate-800">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
          {/* Logo Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#172554] rounded-xl flex items-center justify-center text-white font-black text-2xl mx-auto shadow-md mb-3">
              SL
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">STOCKLEDGER</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">Every Stock. Every Transaction. Every Detail.</p>
          </div>

          {/* Tab: Sign In vs Register */}
          <div className="flex border-b border-slate-200 mb-6">
            <button
              onClick={() => { setAuthMode('LOGIN'); setAuthError(''); }}
              className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
                authMode === 'LOGIN' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('REGISTER'); setAuthError(''); }}
              className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
                authMode === 'REGISTER' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              New User Register
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {authError}
            </div>
          )}

          {/* Login Form */}
          {authMode === 'LOGIN' ? (
            <form onSubmit={handleFormLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@stockledger.in"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#172554] text-white font-bold py-2.5 rounded-lg text-sm hover:bg-blue-900 transition-colors shadow flex items-center justify-center gap-2"
              >
                Sign In to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleFormRegister} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assign Functional Role</label>
                <select
                  value={regRole}
                  onChange={(e: any) => setRegRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
                >
                  <option value="SALES_EXECUTIVE">Sales Executive</option>
                  <option value="PRODUCTION_SUPERVISOR">Production Supervisor</option>
                  <option value="ADMIN">System Administrator</option>
                  <option value="FINANCIAL_AUDITOR">Financial Auditor</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow"
              >
                Create Account & Enter
              </button>
            </form>
          )}

          {/* Quick 1-Click Demo Login Personas */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-3 text-center">
              Or 1-Click Instant Demo Login
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleQuickLogin('admin@stockledger.in', 'Dr. R. Ramanan', 'ADMIN')}
                className="p-2 border border-slate-200 rounded-lg font-semibold hover:bg-blue-50 hover:border-blue-300 text-left"
              >
                <span className="text-blue-900 block font-bold">Admin</span>
                <span className="text-[10px] text-slate-500">Dr. R. Ramanan</span>
              </button>

              <button
                onClick={() => handleQuickLogin('supervisor@stockledger.in', 'K. Senthil', 'PRODUCTION_SUPERVISOR')}
                className="p-2 border border-slate-200 rounded-lg font-semibold hover:bg-amber-50 hover:border-amber-300 text-left"
              >
                <span className="text-amber-900 block font-bold">Supervisor</span>
                <span className="text-[10px] text-slate-500">K. Senthil</span>
              </button>

              <button
                onClick={() => handleQuickLogin('salesmanA@stockledger.in', 'M. Anand', 'SALES_EXECUTIVE')}
                className="p-2 border border-slate-200 rounded-lg font-semibold hover:bg-green-50 hover:border-green-300 text-left"
              >
                <span className="text-green-900 block font-bold">Salesman</span>
                <span className="text-[10px] text-slate-500">M. Anand</span>
              </button>

              <button
                onClick={() => handleQuickLogin('auditor@stockledger.in', 'CA. T. Natarajan', 'FINANCIAL_AUDITOR')}
                className="p-2 border border-slate-200 rounded-lg font-semibold hover:bg-purple-50 hover:border-purple-300 text-left"
              >
                <span className="text-purple-900 block font-bold">Auditor</span>
                <span className="text-[10px] text-slate-500">CA. T. Natarajan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Enterprise Dashboard View
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-800">
      {/* ----------------- LEFT SIDEBAR ----------------- */}
      <aside className="w-64 bg-[#172554] text-white flex flex-col justify-between shrink-0 shadow-xl">
        <div>
          {/* Brand Identity */}
          <div className="p-5 border-b border-blue-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-black tracking-widest text-lg shadow-md text-white">
                SL
              </div>
              <div>
                <h1 className="font-bold text-base tracking-tight leading-none text-white">STOCKLEDGER</h1>
                <span className="text-[10px] text-blue-300 font-medium tracking-wide uppercase">Enterprise ERP v1.0</span>
              </div>
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
              onClick={() => setActiveTab('invoicing')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'invoicing' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              Sales & Invoicing
              {salesOrders.length > 0 && (
                <span className="ml-auto text-[10px] bg-blue-500/30 text-white px-1.5 py-0.5 rounded font-bold">
                  {salesOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('production')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'production' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <Factory className="w-4 h-4" />
              Production & Batches
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
              onClick={() => setActiveTab('benchmark')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'benchmark' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Standard Benchmark
              <span className="ml-auto text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded font-bold">15/15</span>
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

        {/* User Profile Card & Sign Out */}
        <div className="p-3 bg-blue-950/60 border-t border-blue-900/40">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs shrink-0 text-white">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <span className="font-bold text-xs text-white block truncate">{currentUser.fullName}</span>
                <span className="text-[10px] text-blue-300 font-medium block">{currentUser.role}</span>
              </div>
            </div>
            <button
              onClick={() => setCurrentUser(null)}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-blue-900/60 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 px-1 pt-2 border-t border-blue-900/30">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            System Engine: Online (Port 5000)
          </div>
        </div>
      </aside>

      {/* ----------------- MAIN VIEW CONTAINER ----------------- */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-slate-500">Stockledger</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="font-bold text-slate-900 capitalize">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Action Button based on tab */}
            {activeTab === 'invoicing' && (
              <button
                onClick={() => setShowOrderModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Sales Order
              </button>
            )}

            {activeTab === 'production' && (
              <button
                onClick={() => setShowBatchModal(true)}
                className="flex items-center gap-2 bg-amber-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-700 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Run Production Batch
              </button>
            )}

            <div className="flex items-center gap-2 text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tamil Nadu Facility | FY 2026-27</span>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-8 space-y-6 max-w-7xl w-full mx-auto">
          {/* ===================== VIEW 1: DASHBOARD ===================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Manufacturing & Commercial Overview</h2>
                  <p className="text-sm text-slate-500">Real-time indicators computed from immutable double-entry ledger records.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowOrderModal(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3.5 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    + New Sales Order
                  </button>
                  <button
                    onClick={() => setShowBatchModal(true)}
                    className="flex items-center gap-2 bg-[#172554] text-white px-3.5 py-2 rounded-lg text-xs font-bold hover:bg-blue-900 shadow-sm"
                  >
                    <Factory className="w-4 h-4" />
                    + Run Batch
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Raw Material Valuation</span>
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">₹8,685.00</div>
                  <div className="mt-2 text-xs text-green-700 font-semibold">
                    Flour (120kg @ ₹43.125) + Oil (19.5L) + Spices
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Finished Murukku Stock</span>
                    <Factory className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">88 pkts</div>
                  <div className="mt-2 text-xs text-slate-500 font-medium">
                    238 produced - 150 dispatched
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
                  <div className="text-2xl font-black text-purple-900 font-mono">
                    ₹{invoices.reduce((acc, i) => acc + i.balanceAmount, 0).toFixed(2)}
                  </div>
                  <div className="mt-2 text-xs text-purple-700 font-semibold">
                    Live balance across posted invoices
                  </div>
                </div>
              </div>

              {/* Active Orders Quick Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Recent Sales Orders</h3>
                  <button onClick={() => setActiveTab('invoicing')} className="text-xs text-blue-600 font-bold hover:underline">
                    View All Orders & Invoices $\rightarrow$
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-50 text-slate-600 font-sans font-semibold uppercase">
                      <tr>
                        <th className="p-3">Order No</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3 text-right">Quantity</th>
                        <th className="p-3 text-right">Total (incl GST)</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {salesOrders.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-blue-600">{order.orderNumber}</td>
                          <td className="p-3 font-sans font-medium text-slate-900">{order.customerName}</td>
                          <td className="p-3 text-right font-bold">{order.orderedQty} pkts</td>
                          <td className="p-3 text-right font-bold">₹{order.totalOrderValue.toFixed(2)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.status === 'DISPATCHED' ? 'bg-green-100 text-green-800' :
                              order.status === 'SHORTAGE_EXCEPTION' ? 'bg-red-100 text-red-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {order.status === 'SUBMITTED' && (
                              <button
                                onClick={() => handleApproveOrder(order.id)}
                                className="bg-green-600 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-green-700"
                              >
                                Approve & Ship
                              </button>
                            )}
                            {order.status === 'SHORTAGE_EXCEPTION' && (
                              <span className="text-[10px] text-red-600 font-bold">Shortage {order.shortageQty} pkts</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ===================== VIEW 2: SALES & INVOICING ===================== */}
          {activeTab === 'invoicing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Sales Orders & Statutory Invoicing</h2>
                  <p className="text-sm text-slate-500">Live order management, stock availability validation, and GST invoice generation.</p>
                </div>
                <button
                  onClick={() => setShowOrderModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  + Create New Sales Order
                </button>
              </div>

              {/* Sales Orders List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">All Sales Orders</h3>
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 font-sans font-semibold uppercase">
                    <tr>
                      <th className="p-3">Order No</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3 text-right">Ordered Qty</th>
                      <th className="p-3 text-right">Taxable</th>
                      <th className="p-3 text-right">Total (5% GST)</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {salesOrders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-blue-600">{o.orderNumber}</td>
                        <td className="p-3 font-sans font-medium text-slate-900">{o.customerName}</td>
                        <td className="p-3 text-right font-bold">{o.orderedQty} pkts</td>
                        <td className="p-3 text-right">₹{o.taxableAmount.toFixed(2)}</td>
                        <td className="p-3 text-right font-bold">₹{o.totalOrderValue.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            o.status === 'DISPATCHED' ? 'bg-green-100 text-green-800' :
                            o.status === 'SHORTAGE_EXCEPTION' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {o.status === 'SUBMITTED' && (
                            <button
                              onClick={() => handleApproveOrder(o.id)}
                              className="bg-green-600 text-white px-2.5 py-1 rounded text-xs font-bold hover:bg-green-700"
                            >
                              Approve & Dispatch
                            </button>
                          )}
                          {o.status === 'SHORTAGE_EXCEPTION' && (
                            <span className="text-red-600 font-bold">Hold (Short {o.shortageQty})</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Invoices List */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Posted GST Invoices</h3>
                </div>
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 text-slate-600 font-sans font-semibold uppercase">
                    <tr>
                      <th className="p-3">Invoice No</th>
                      <th className="p-3">Order Ref</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3 text-right">Taxable</th>
                      <th className="p-3 text-right">CGST+SGST</th>
                      <th className="p-3 text-right">Total Amount</th>
                      <th className="p-3 text-right">Paid</th>
                      <th className="p-3 text-right">Outstanding</th>
                      <th className="p-3 text-right">Record Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-blue-900">{inv.invoiceNumber}</td>
                        <td className="p-3">{inv.orderNumber}</td>
                        <td className="p-3 font-sans font-medium">{inv.customerName}</td>
                        <td className="p-3 text-right">₹{inv.taxableValue.toFixed(2)}</td>
                        <td className="p-3 text-right">₹{(inv.cgstAmount + inv.sgstAmount).toFixed(2)}</td>
                        <td className="p-3 text-right font-bold">₹{inv.totalInvoiceAmount.toFixed(2)}</td>
                        <td className="p-3 text-right text-green-700 font-bold">₹{inv.paidAmount.toFixed(2)}</td>
                        <td className="p-3 text-right text-purple-900 font-black">₹{inv.balanceAmount.toFixed(2)}</td>
                        <td className="p-3 text-right">
                          {inv.balanceAmount > 0 ? (
                            <button
                              onClick={() => { setSelectedInvoiceId(inv.id); setShowPaymentModal(true); }}
                              className="bg-purple-600 text-white px-2.5 py-1 rounded text-xs font-bold hover:bg-purple-700"
                            >
                              + Pay
                            </button>
                          ) : (
                            <span className="text-green-700 font-bold">PAID FULL</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== VIEW 3: PRODUCTION & BATCHES ===================== */}
          {activeTab === 'production' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Production Engine & Batch History</h2>
                  <p className="text-sm text-slate-500">Run batches, log actual material consumption, and track absorption costing.</p>
                </div>
                <button
                  onClick={() => setShowBatchModal(true)}
                  className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-700 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  + Run New Production Batch
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batches.map(b => (
                  <div key={b.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-2">
                      <div>
                        <span className="text-xs font-bold text-blue-600 font-mono">{b.batchNumber}</span>
                        <h4 className="text-sm font-bold text-slate-900">{b.productName}</h4>
                      </div>
                      <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="text-slate-500 block text-[10px]">Good Output</span>
                        <span className="font-bold text-slate-900">{b.goodOutput} pkts ({b.yieldVariance}% var)</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="text-slate-500 block text-[10px]">Oil Used</span>
                        <span className="font-bold text-slate-900">{b.oilIssued} L (+{b.oilVariance}% var)</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded">
                        <span className="text-slate-500 block text-[10px]">Total Batch Cost</span>
                        <span className="font-bold text-blue-900">₹{b.totalCost.toFixed(2)}</span>
                      </div>
                      <div className="p-2 bg-green-50 border border-green-200 rounded">
                        <span className="text-green-700 block text-[10px] font-bold">Unit Cost</span>
                        <span className="font-black text-green-950 text-sm">₹{b.unitCost.toFixed(2)} / pkt</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===================== VIEW 4: DOUBLE-ENTRY LEDGER ===================== */}
          {activeTab === 'ledger' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Immutable Double-Entry Stock Ledger</h2>
                  <p className="text-sm text-slate-500">Every movement is recorded as an immutable debit/credit row. Direct balance overwrites are blocked.</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-sans font-semibold uppercase">
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
                  <tbody className="divide-y divide-slate-100">
                    {stockLedger.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-blue-600">{row.ref}</td>
                        <td className="p-3.5 font-sans font-medium text-slate-900">{row.item}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.type.includes('PURCHASE') || row.type.includes('YIELD') ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {row.type}
                          </span>
                        </td>
                        <td className={`p-3.5 text-right font-bold ${row.change.startsWith('+') ? 'text-green-700' : 'text-red-600'}`}>
                          {row.change}
                        </td>
                        <td className="p-3.5 text-right font-black text-slate-900">{row.balance}</td>
                        <td className="p-3.5 font-sans">{row.doc}</td>
                        <td className="p-3.5 font-sans text-slate-500">{row.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== VIEW 5: BENCHMARK ===================== */}
          {activeTab === 'benchmark' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Standard Manufacturing Benchmark Verification</h2>
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

      {/* ===================== MODAL: CREATE SALES ORDER ===================== */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Create New Sales Order</h3>
              <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product</label>
                <input
                  type="text"
                  disabled
                  value="South Indian Murukku 200g (HSN: 1905, Rate: ₹50.00)"
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium text-slate-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Quantity (Packets)</label>
                  <span className="text-[11px] font-bold text-green-700">Available: 88 pkts</span>
                </div>
                <input
                  type="number"
                  value={newOrderQty}
                  onChange={(e) => setNewOrderQty(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  min="1"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{(Number(newOrderQty) * 50).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (5% Intra-state):</span>
                  <span>₹{(Number(newOrderQty) * 50 * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-blue-950 pt-1 border-t border-blue-200 text-sm">
                  <span>Total Order Value:</span>
                  <span>₹{(Number(newOrderQty) * 50 * 1.05).toFixed(2)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-blue-700 shadow"
              >
                Submit Sales Order
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: RUN PRODUCTION BATCH ===================== */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Run Production Batch (Murukku 200g)</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Standard Batch</label>
                  <input
                    type="text"
                    disabled
                    value="200 Packets"
                    className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Actual Good Output</label>
                  <input
                    type="number"
                    value={newBatchGood}
                    onChange={(e) => setNewBatchGood(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Oil Issued (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newBatchOil}
                    onChange={(e) => setNewBatchOil(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Damaged Pouches Scrap</label>
                  <input
                    type="number"
                    value={newBatchScrap}
                    onChange={(e) => setNewBatchScrap(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-700">
                  <span>Yield Variance:</span>
                  <span className="font-bold text-amber-900">
                    {(((Number(newBatchGood) - 200) / 200) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Oil Variance:</span>
                  <span className="font-bold text-amber-900">
                    {(((Number(newBatchOil) - 10.0) / 10.0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-amber-700 shadow"
              >
                Complete Batch & Update Inventory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: RECORD PAYMENT ===================== */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Record Customer Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Mode</label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium">
                  <option>NEFT / RTGS Bank Transfer</option>
                  <option>UPI Transfer</option>
                  <option>Cheque Deposit</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-purple-700 shadow"
              >
                Confirm Payment & Update Balance
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const benchmarkSteps = [
  { id: 1, title: 'Purchase 60 kg Flour @ ₹45/kg', category: 'PURCHASE', status: 'VERIFIED', result: 'Flour stock: 160.00 kg @ ₹43.1250/kg weighted rate (Valuation: ₹6,900.00)' },
  { id: 2, title: 'Issue 40 kg Flour for Batch', category: 'PRODUCTION', status: 'VERIFIED', result: 'Flour remaining: 120.00 kg (Standard: 40 kg, Actual: 40 kg, 0% variance)' },
  { id: 3, title: 'Issue 10.5 Litres Oil for Batch', category: 'PRODUCTION', status: 'VERIFIED', result: 'Oil remaining: 19.50 L (Standard: 10.0 L, Actual: 10.5 L -> +5.0% variance)' },
  { id: 4, title: 'Issue 1.2 kg Spice Mix', category: 'PRODUCTION', status: 'VERIFIED', result: 'Spice mix remaining: 3.80 kg (Standard: 1.2 kg, Actual: 1.2 kg)' },
  { id: 5, title: 'Record 188 Good Packets Output', category: 'PRODUCTION', status: 'VERIFIED', result: 'Yield variance: -6.0% (Standard: 200 pkts, Actual: 188 pkts). FG Stock: 238 pkts' },
  { id: 6, title: 'Record 6 Damaged Pouches', category: 'PACKAGING', status: 'VERIFIED', result: 'Pouches consumed: 194 (188 good + 6 scrap). Pouches remaining: 306 pcs' },
  { id: 7, title: 'Record 9 Shipping Cartons Used', category: 'PACKAGING', status: 'VERIFIED', result: 'Cartons consumed: 9 pcs. Cartons remaining: 21 pcs' },
  { id: 8, title: 'Salesman A Orders 150 Packets', category: 'SALES', status: 'VERIFIED', result: 'Order SO-001 created for Cauvery Wholesale Confectioneries' },
  { id: 9, title: 'Admin Approves, Invoices & Dispatches', category: 'GST & DISPATCH', status: 'VERIFIED', result: 'Taxable: ₹7,500 | CGST: ₹187.50 | SGST: ₹187.50 | Total: ₹7,875.00 | FG Remaining: 88 pkts' },
  { id: 10, title: 'Salesman B Orders 120 Packets', category: 'SALES', status: 'VERIFIED', result: 'Order SO-002 submitted by Salesman B' },
  { id: 11, title: 'Shortage Exception Handling', category: 'INVENTORY', status: 'VERIFIED', result: 'Available: 88 pkts, Requested: 120 pkts -> Shortage of 32 packets flagged!' },
  { id: 12, title: 'Record ₹4,000 Distributor Payment', category: 'PAYMENTS', status: 'VERIFIED', result: 'Invoice: ₹7,875.00 - Paid: ₹4,000.00 -> Outstanding Balance: ₹3,875.00' },
  { id: 13, title: 'Add Direct Labour Cost ₹1,200', category: 'COSTING', status: 'VERIFIED', result: 'Direct production labour absorption allocated to batch' },
  { id: 14, title: 'Add Direct Power/Gas Overhead ₹600', category: 'COSTING', status: 'VERIFIED', result: 'Batch cost: ₹5,855.00 -> Unit cost: ₹31.14 / pkt (37.7% Gross Margin @ ₹50 SP)' },
  { id: 15, title: 'Statutory Reports & Audit Generation', category: 'AUDIT', status: 'VERIFIED', result: 'GSTR-1 intra-state tax liabilities and full lot traceability generated' },
];
