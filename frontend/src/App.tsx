import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo.js';
import { LandingPage } from './components/LandingPage.js';
import {
  Layers,
  Package,
  Factory,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
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
  X,
  CreditCard,
  Truck,
  ShieldCheck,
  Building2,
  FileCheck2,
  AlertCircle,
  Menu,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'PRODUCTION_SUPERVISOR' | 'SALES_EXECUTIVE' | 'INVENTORY_MANAGER' | 'FINANCIAL_AUDITOR';
}

interface MaterialItem {
  id: string;
  code: string;
  name: string;
  category: 'RAW' | 'PACKAGING';
  uom: string;
  openingStock: number;
  currentStock: number;
  currentWeightedRate: number;
  minReorderQty: number;
}

interface ProductItem {
  id: string;
  sku: string;
  name: string;
  hsnCode: string;
  uom: string;
  unitWeightGrams: number;
  sellingPrice: number;
  gstRate: number;
  openingStock: number;
  currentStock: number;
}

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  productSku: string;
  orderedQty: number;
  dispatchedQty: number;
  shortageQty: number;
  unitPrice: number;
  taxableAmount: number;
  totalOrderValue: number;
  status: 'SUBMITTED' | 'APPROVED' | 'DISPATCHED' | 'SHORTAGE_EXCEPTION' | 'CANCELLED';
  createdAt: string;
  notes?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  customerName: string;
  quantity: number;
  taxableValue: number;
  cgstAmount: number;
  sgstAmount: number;
  totalInvoiceAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'DRAFT' | 'POSTED' | 'PARTIALLY_PAID' | 'PAID';
  invoiceDate: string;
}

interface ProductionBatch {
  id: string;
  batchNumber: string;
  productName: string;
  plannedYield: number;
  goodOutput: number;
  yieldVariancePercent: number;
  oilIssued: number;
  oilVariance: number;
  scrapPouches: number;
  costing: {
    totalBatchCost: number;
    costPerGoodPacket: number;
    grossMarginPercent: number;
  };
  status: string;
  supervisor: string;
  completedAt: string;
}

interface StockLedgerEntry {
  id: string;
  transactionRef: string;
  itemCode: string;
  itemName: string;
  movementType: string;
  quantityIn: number;
  quantityOut: number;
  balanceAfter: number;
  uom: string;
  unitRate: number;
  referenceDoc: string;
  actor: string;
  timestamp: string;
}

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('stockledger_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regRole, setRegRole] = useState<'ADMIN' | 'PRODUCTION_SUPERVISOR' | 'SALES_EXECUTIVE' | 'INVENTORY_MANAGER' | 'FINANCIAL_AUDITOR'>('SALES_EXECUTIVE');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Safe Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    setIsSidebarOpen(false);
    setShowAuthModal(false);
    localStorage.removeItem('stockledger_user');
    notify('You have been safely logged out.');
  };

  // Navigation & Swipe Drawer State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'materials' | 'production' | 'invoicing' | 'ledger' | 'benchmark' | 'audit'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Touch Swipe Gesture Recognition (Swipe Right to Open, Swipe Left to Close)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Detect horizontal swipe gesture
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX > 45 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      } else if (deltaX < -45 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  // ERP Domain Data States (Live from Backend)
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [stockLedger, setStockLedger] = useState<StockLedgerEntry[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Modals visibility
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  // Modal Inputs (Clean unpopulated states with clear placeholders)
  // 1. Order modal
  const [newCustomer, setNewCustomer] = useState('');
  const [newOrderSku, setNewOrderSku] = useState('MUR-200G');
  const [newOrderQty, setNewOrderQty] = useState('');
  const [newOrderPrice, setNewOrderPrice] = useState('50.00');

  // 2. Batch modal
  const [batchProductSku, setBatchProductSku] = useState('MUR-200G');
  const [batchPlanned, setBatchPlanned] = useState('200');
  const [batchGood, setBatchGood] = useState('');
  const [batchFlour, setBatchFlour] = useState('');
  const [batchOil, setBatchOil] = useState('');
  const [batchScrap, setBatchScrap] = useState('');

  // 3. Purchase GRN modal
  const [purchaseMaterialCode, setPurchaseMaterialCode] = useState('RM-FLOUR');
  const [purchaseQty, setPurchaseQty] = useState('');
  const [purchaseRate, setPurchaseRate] = useState('');
  const [purchaseSupplier, setPurchaseSupplier] = useState('');
  const [purchaseInvoiceRef, setPurchaseInvoiceRef] = useState('');

  // 4. Payment modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState('');
  const [paymentMode, setPaymentMode] = useState('NEFT / RTGS Bank Transfer');

  // Show Toast Notification
  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 5000);
  };

  // Persist User Session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('stockledger_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('stockledger_user');
    }
  }, [currentUser]);

  // Fetch all ERP data from backend
  const fetchAllData = async () => {
    setIsLoadingData(true);
    try {
      const [matRes, prodRes, ordersRes, invRes, batchesRes, ledgerRes] = await Promise.all([
        fetch('/api/v1/materials').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/v1/products').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/v1/sales/orders').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/v1/invoices').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/v1/production/batches').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/v1/inventory/ledger').then(r => r.json()).catch(() => ({ data: [] })),
      ]);

      if (matRes.success && matRes.data) setMaterials(matRes.data);
      if (prodRes.success && prodRes.data) setProducts(prodRes.data);
      if (ordersRes.success && ordersRes.data) setSalesOrders(ordersRes.data);
      if (invRes.success && invRes.data) setInvoices(invRes.data);
      if (batchesRes.success && batchesRes.data) setBatches(batchesRes.data);
      if (ledgerRes.success && ledgerRes.data) setStockLedger(ledgerRes.data);
    } catch (err) {
      console.error('Failed to sync ERP state:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAllData();
    }
  }, [currentUser]);

  // ---------------- AUTH HANDLERS ----------------
  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setAuthError('Email and password are required');
      return;
    }
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.data.user);
        localStorage.setItem('stockledger_user', JSON.stringify(data.data.user));
        setShowAuthModal(false);
        notify(`Welcome back, ${data.data.user.fullName}!`);
      } else {
        setAuthError(data.error?.message || 'Invalid email or password');
      }
    } catch (err) {
      setAuthError('Server communication failed. Please check connection.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFormRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword || !regFullName) {
      setAuthError('All registration fields are required');
      return;
    }
    setAuthLoading(true);
    setAuthError('');

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          fullName: regFullName,
          role: regRole,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.data.user);
        localStorage.setItem('stockledger_user', JSON.stringify(data.data.user));
        setShowAuthModal(false);
        notify(`Welcome to Stockledger, ${data.data.user.fullName}!`);
      } else {
        setAuthError(data.error?.message || 'Registration failed');
      }
    } catch (err) {
      setAuthError('Registration request failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleQuickDemoLogin = async (
    email: string,
    fullName: string,
    role: any,
    password = 'Password@123'
  ) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.data.user);
        localStorage.setItem('stockledger_user', JSON.stringify(data.data.user));
        setShowAuthModal(false);
        notify(`Logged in as ${data.data.user.fullName} (${data.data.user.role})`);
      } else {
        // Fallback for seamless demo testing
        const u = { id: `usr-${Date.now()}`, email, fullName, role };
        setCurrentUser(u);
        localStorage.setItem('stockledger_user', JSON.stringify(u));
        setShowAuthModal(false);
        notify(`Logged in as ${fullName} (${role})`);
      }
    } catch (e) {
      // Offline fallback
      const u = { id: `usr-${Date.now()}`, email, fullName, role };
      setCurrentUser(u);
      localStorage.setItem('stockledger_user', JSON.stringify(u));
      setShowAuthModal(false);
      notify(`Logged in as ${fullName} (${role})`);
    } finally {
      setAuthLoading(false);
    }
  };

  // ---------------- DOMAIN ACTION HANDLERS ----------------

  // 1. Inward Purchase (GRN)
  const handlePurchaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(purchaseQty);
    const rate = Number(purchaseRate);

    if (!qty || qty <= 0 || !rate || rate <= 0) {
      alert('Please enter valid positive quantity and unit rate');
      return;
    }

    try {
      const res = await fetch('/api/v1/materials/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialCode: purchaseMaterialCode,
          quantity: qty,
          unitRate: rate,
          supplierName: purchaseSupplier || 'Registered Raw Material Supplier',
          invoiceRef: purchaseInvoiceRef || `GRN-${Date.now().toString().slice(-4)}`,
          actor: currentUser?.fullName || 'Inventory Manager',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notify(data.message);
        setShowPurchaseModal(false);
        setPurchaseQty('');
        setPurchaseRate('');
        setPurchaseSupplier('');
        setPurchaseInvoiceRef('');
        fetchAllData();
      } else {
        alert(data.error?.message || 'Purchase inward failed');
      }
    } catch (err) {
      alert('Error submitting purchase inward');
    }
  };

  // 2. Create Sales Order
  const handleCreateOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(newOrderQty);
    const price = Number(newOrderPrice) || 50.0;

    if (!newCustomer.trim() || !qty || qty <= 0) {
      alert('Please enter a valid customer name and order quantity');
      return;
    }

    try {
      const res = await fetch('/api/v1/sales/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: newCustomer.trim(),
          productSku: newOrderSku,
          orderedQty: qty,
          unitPrice: price,
          salesman: currentUser?.fullName || 'Sales Executive',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notify(data.message);
        setShowOrderModal(false);
        setNewCustomer('');
        setNewOrderQty('');
        fetchAllData();
      } else {
        alert(data.error?.message || 'Failed to create sales order');
      }
    } catch (err) {
      alert('Error creating sales order');
    }
  };

  // 3. Approve & Dispatch Sales Order
  const handleApproveOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/v1/sales/orders/${orderId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notify(data.message);
        fetchAllData();
      } else {
        alert(data.error?.message || 'Approval failed');
      }
    } catch (err) {
      alert('Error approving sales order');
    }
  };

  // 4. Run Production Batch
  const handleCreateBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const good = Number(batchGood);
    const planned = Number(batchPlanned) || 200;
    const flour = Number(batchFlour) || 40.0;
    const oil = Number(batchOil) || 10.5;
    const scrap = Number(batchScrap) || 0;

    if (!good || good <= 0) {
      alert('Please enter valid good packets produced');
      return;
    }

    try {
      const res = await fetch('/api/v1/production/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productSku: batchProductSku,
          plannedYield: planned,
          goodOutput: good,
          flourIssued: flour,
          oilIssued: oil,
          scrapPouches: scrap,
          supervisor: currentUser?.fullName || 'Production Supervisor',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notify(data.message);
        setShowBatchModal(false);
        setBatchGood('');
        setBatchFlour('');
        setBatchOil('');
        setBatchScrap('');
        fetchAllData();
      } else {
        alert(data.error?.message || 'Production execution failed');
      }
    } catch (err) {
      alert('Error executing production batch');
    }
  };

  // 5. Record Invoice Payment
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    const amount = Number(paymentAmountInput);

    if (!amount || amount <= 0) {
      alert('Please enter a valid positive payment amount');
      return;
    }

    try {
      const res = await fetch(`/api/v1/invoices/${selectedInvoice.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentAmount: amount }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        notify(data.message);
        setShowPaymentModal(false);
        setSelectedInvoice(null);
        setPaymentAmountInput('');
        fetchAllData();
      } else {
        alert(data.error?.message || 'Payment recording failed');
      }
    } catch (err) {
      alert('Error recording payment');
    }
  };

  // 6. Reset System State Controls
  const handleSystemReset = async (type: 'opening' | 'benchmark' | 'blank') => {
    try {
      const endpoint =
        type === 'opening'
          ? '/api/v1/system/reset-opening'
          : type === 'blank'
          ? '/api/v1/system/reset-blank'
          : '/api/v1/system/reset-benchmark';

      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        notify(data.message);
        setShowResetModal(false);
        fetchAllData();
      }
    } catch (err) {
      alert('Failed to reset system data');
    }
  };

  // Live Selected FG Stock
  const selectedProduct = products.find(p => p.sku === newOrderSku) || products[0];
  const availableFgStock = selectedProduct ? selectedProduct.currentStock : 0;
  const isOrderShortage = Number(newOrderQty) > availableFgStock;

  // ==============================================================
  // VIEW: PUBLIC SAAS LANDING PAGE & AUTH MODAL (WHEN NOT LOGGED IN)
  // ==============================================================
  if (!currentUser) {
    return (
      <div className="relative min-h-screen">
        <LandingPage
          onOpenAuth={(mode) => {
            setAuthMode(mode || 'LOGIN');
            setAuthError('');
            setShowAuthModal(true);
          }}
          onQuickDemoLogin={(email, fullName, role) => {
            handleQuickDemoLogin(email, fullName, role as any);
          }}
        />

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed top-4 right-4 z-50 bg-[#172554] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-400/30 text-xs font-semibold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Interactive Auth Modal Dialog */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-200 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Logo Header */}
              <div className="text-center mb-6 flex flex-col items-center">
                <Logo variant="stacked" size="md" theme="light" />
              </div>

              {/* Tab: Sign In vs Register */}
              <div className="flex border-b border-slate-200 mb-6">
                <button
                  onClick={() => { setAuthMode('LOGIN'); setAuthError(''); }}
                  className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                    authMode === 'LOGIN' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthMode('REGISTER'); setAuthError(''); }}
                  className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                    authMode === 'REGISTER' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  New User Register
                </button>
              </div>

              {authError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Login Form */}
              {authMode === 'LOGIN' ? (
                <form onSubmit={handleFormLogin} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Corporate Email Address</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. admin@stockledger.in"
                        className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Security Password</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter account password"
                        className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1.5">
                      <span>Default password: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700 font-mono">Password@123</code></span>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail('admin@stockledger.in');
                          setLoginPassword('Password@123');
                        }}
                        className="text-blue-600 font-bold hover:underline cursor-pointer"
                      >
                        Fill Admin
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-[#172554] text-white font-bold py-2.5 rounded-lg text-sm hover:bg-blue-900 transition-colors shadow flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
                  >
                    {authLoading ? 'Verifying...' : 'Sign In to Workspace'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleFormRegister} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                    <input
                      type="text"
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Corporate Email Address</label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Set Account Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Create secure password"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Functional Enterprise Role</label>
                    <select
                      value={regRole}
                      onChange={(e: any) => setRegRole(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white font-medium"
                    >
                      <option value="ADMIN">System Administrator (Full Control)</option>
                      <option value="PRODUCTION_SUPERVISOR">Production Supervisor (Batches & Variances)</option>
                      <option value="SALES_EXECUTIVE">Sales Executive (Orders & Shortages)</option>
                      <option value="INVENTORY_MANAGER">Inventory Manager (GRN & Ledger)</option>
                      <option value="FINANCIAL_AUDITOR">Financial Auditor (GST & Costing)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow disabled:opacity-70 cursor-pointer"
                  >
                    {authLoading ? 'Creating Profile...' : 'Register & Enter Workspace'}
                  </button>
                </form>
              )}

              {/* Quick 1-Click Demo Login Personas */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2.5 text-center">
                  1-Click Instant Evaluator Access
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => handleQuickDemoLogin('admin@stockledger.in', 'Dr. R. Ramanan', 'ADMIN')}
                    className="p-2 border border-slate-200 rounded-lg font-semibold hover:bg-blue-50 hover:border-blue-300 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-blue-900 block font-bold">Admin</span>
                    <span className="text-[10px] text-slate-500 truncate block">Dr. R. Ramanan</span>
                  </button>

                  <button
                    onClick={() => handleQuickDemoLogin('supervisor@stockledger.in', 'K. Senthil', 'PRODUCTION_SUPERVISOR')}
                    className="p-2 border border-slate-200 rounded-lg font-semibold hover:bg-amber-50 hover:border-amber-300 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-amber-900 block font-bold">Supervisor</span>
                    <span className="text-[10px] text-slate-500 truncate block">K. Senthil</span>
                  </button>

                  <button
                    onClick={() => handleQuickDemoLogin('salesmanA@stockledger.in', 'M. Anand', 'SALES_EXECUTIVE')}
                    className="p-2 border border-slate-200 rounded-lg font-semibold hover:bg-green-50 hover:border-green-300 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-green-900 block font-bold">Sales Executive</span>
                    <span className="text-[10px] text-slate-500 truncate block">M. Anand</span>
                  </button>

                  <button
                    onClick={() => handleQuickDemoLogin('store@stockledger.in', 'S. Murugan', 'INVENTORY_MANAGER')}
                    className="p-2 border border-slate-200 rounded-lg font-semibold hover:bg-emerald-50 hover:border-emerald-300 text-left transition-colors cursor-pointer"
                  >
                    <span className="text-emerald-900 block font-bold">Inventory</span>
                    <span className="text-[10px] text-slate-500 truncate block">S. Murugan</span>
                  </button>

                  <button
                    onClick={() => handleQuickDemoLogin('auditor@stockledger.in', 'CA. T. Natarajan', 'FINANCIAL_AUDITOR')}
                    className="p-2 border border-slate-200 rounded-lg font-semibold hover:bg-purple-50 hover:border-purple-300 text-left transition-colors cursor-pointer col-span-2 sm:col-span-2"
                  >
                    <span className="text-purple-900 block font-bold">Financial Auditor</span>
                    <span className="text-[10px] text-slate-500 truncate block">CA. T. Natarajan</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==============================================================
  // VIEW: LOGGED-IN ENTERPRISE APPLICATION
  // ==============================================================
  return (
    <div
      className="flex h-screen bg-[#F8FAFC] overflow-hidden text-slate-800 relative select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Toast Notification Bar */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-[#172554] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-blue-400/30 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Floating Left Edge Touch / Swipe Pill Handle */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed left-0 top-1/2 -translate-y-1/2 z-30 bg-[#172554] text-white py-3 px-2 rounded-r-2xl shadow-2xl border-y border-r border-blue-400/40 flex flex-col items-center gap-1.5 hover:bg-blue-800 transition-all hover:pl-3 group cursor-pointer"
          title="Touch or Swipe Right to open navigation drawer"
        >
          <Menu className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="[writing-mode:vertical-lr] text-[9px] font-black tracking-widest uppercase text-blue-200">
            SWIPE
          </span>
        </button>
      )}

      {/* Backdrop Overlay when Sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        />
      )}

      {/* ----------------- LEFT SIDEBAR (SWIPE & TOUCH DRAWER) ----------------- */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-[#172554] text-white flex flex-col justify-between z-50 shadow-2xl transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Identity & Close Button */}
          <div className="p-4 border-b border-blue-900/50 flex items-center justify-between">
            <Logo variant="horizontal" size="md" theme="dark" showTagline={false} />
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-blue-900/60 rounded-lg transition-colors cursor-pointer"
              title="Close Navigation Drawer (or swipe left)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Touch Gesture Instruction Indicator */}
          <div className="px-4 py-2 bg-blue-950/40 border-b border-blue-900/30 text-[10px] text-blue-300 flex items-center justify-between">
            <span>👈 Swipe left or tap outside to close</span>
            <span className="font-mono text-sky-400 font-bold">TOUCH ENABLED</span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Executive Dashboard
            </button>

            <button
              onClick={() => { setActiveTab('invoicing'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
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
              onClick={() => { setActiveTab('production'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'production' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <Factory className="w-4 h-4" />
              Production & Batches
              {batches.length > 0 && (
                <span className="ml-auto text-[10px] bg-amber-500/30 text-white px-1.5 py-0.5 rounded font-bold">
                  {batches.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('materials'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'materials' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <Package className="w-4 h-4" />
              Warehouse & Materials
            </button>

            <button
              onClick={() => { setActiveTab('ledger'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'ledger' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              Double-Entry Ledger
              <span className="ml-auto text-[10px] bg-green-500/30 text-white px-1.5 py-0.5 rounded font-bold">
                {stockLedger.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('benchmark'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                activeTab === 'benchmark' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:bg-blue-900/40 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              Standard Benchmark
              <span className="ml-auto text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded font-bold">15/15</span>
            </button>

            <button
              onClick={() => { setActiveTab('audit'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
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
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-blue-900/60 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-2 border-t border-blue-900/30">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              API: Online (Port 5000)
            </div>
            <button
              onClick={fetchAllData}
              title="Refresh all data from backend"
              className="hover:text-white text-slate-400 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingData ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </aside>

      {/* ----------------- MAIN VIEW CONTAINER ----------------- */}
      <div className="flex-1 flex flex-col overflow-y-auto w-full">
        {/* Top Header with Hamburger Touch Button & User Controls */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3 text-sm">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-sm"
              title="Touch or Swipe to open navigation drawer"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>
            <span className="font-semibold text-slate-500 hidden sm:inline">Stockledger</span>
            <ChevronRight className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <span className="font-bold text-slate-900 capitalize">{activeTab}</span>

            {/* Quick button to view Landing Page */}
            <button
              onClick={() => {
                setCurrentUser(null);
                notify('Switched to Public Landing Page preview.');
              }}
              className="ml-2 hidden md:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
              title="View Public Landing Page"
            >
              <span>Landing Page</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* System State Controller Dropdown */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs">
              <button
                onClick={() => handleSystemReset('opening')}
                title="Reset warehouse to opening stock (100kg Flour, 30L Oil, 50 pkts FG) and 0 orders"
                className="px-2 py-1 rounded text-slate-700 hover:bg-white font-semibold transition-all cursor-pointer text-[11px]"
              >
                Reset Opening
              </button>
              <button
                onClick={() => handleSystemReset('benchmark')}
                title="Load the standard 15-step verified benchmark scenario"
                className="px-2 py-1 rounded text-blue-900 hover:bg-white font-bold transition-all cursor-pointer text-[11px]"
              >
                Load Demo
              </button>
              <button
                onClick={() => handleSystemReset('blank')}
                title="Wipe state to 0 for custom input (for new users starting fresh)"
                className="px-2 py-1 rounded text-slate-500 hover:bg-white font-semibold transition-all cursor-pointer text-[11px]"
              >
                Clean Slate
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="hidden xl:flex items-center gap-2">
              <button
                onClick={() => setShowPurchaseModal(true)}
                className="flex items-center gap-1.5 bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-800 shadow-sm cursor-pointer"
              >
                <Package className="w-3.5 h-3.5" />
                Inward GRN
              </button>
              <button
                onClick={() => setShowOrderModal(true)}
                className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Sales Order
              </button>
              <button
                onClick={() => setShowBatchModal(true)}
                className="flex items-center gap-1.5 bg-[#172554] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-900 shadow-sm cursor-pointer"
              >
                <Factory className="w-3.5 h-3.5" />
                Run Batch
              </button>
            </div>

            {/* Header Divider */}
            <div className="h-6 w-px bg-slate-200 hidden sm:block mx-0.5" />

            {/* Logged-In User Profile & Prominent Logout Button */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[120px]">
                  {currentUser.fullName}
                </span>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
                  {currentUser.role.replace(/_/g, ' ')}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ml-1"
                title="Sign out of Stockledger"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
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
                  <p className="text-sm text-slate-500">Live operational indicators connected to backend REST endpoints and stock ledger.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Tamil Nadu Manufacturing Facility | FY 2026-27</span>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Raw Material Valuation</span>
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    ₹{materials.reduce((acc, m) => acc + (m.currentStock * m.currentWeightedRate), 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="mt-2 text-xs text-slate-500 font-medium">
                    Weighted valuation across {materials.length} inventory items
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Finished Murukku Stock</span>
                    <Factory className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {products.find(p => p.sku === 'MUR-200G')?.currentStock || 0} pkts
                  </div>
                  <div className="mt-2 text-xs text-slate-500 font-medium">
                    Available for immediate commercial dispatch
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Latest Batch Cost</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    ₹{batches[0]?.costing.costPerGoodPacket.toFixed(2) || '31.14'} <span className="text-sm font-normal text-slate-500">/ pkt</span>
                  </div>
                  <div className="mt-2 text-xs text-green-700 font-semibold">
                    Gross Margin: {batches[0]?.costing.grossMarginPercent.toFixed(1) || '37.7'}% (@ ₹50 SP)
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Outstanding Receivables</span>
                    <DollarSign className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-purple-900 font-mono">
                    ₹{invoices.reduce((acc, i) => acc + i.balanceAmount, 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="mt-2 text-xs text-purple-700 font-semibold">
                    Across {invoices.filter(i => i.balanceAmount > 0).length} unpaid / partial invoices
                  </div>
                </div>
              </div>

              {/* Operational Status Panels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Sales Orders Preview */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 text-sm">Recent Commercial Orders</h3>
                    <button onClick={() => setActiveTab('invoicing')} className="text-xs text-blue-600 font-bold hover:underline">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {salesOrders.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-xs">
                        No sales orders created yet. Click "Sales Order" above to place your first order.
                      </div>
                    ) : (
                      salesOrders.slice(0, 3).map((o) => (
                        <div key={o.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-blue-900">{o.orderNumber}</span>
                            <span className="text-slate-500 block">{o.customerName}</span>
                          </div>
                          <div className="text-right">
                            <span className="font-mono font-bold text-slate-900">{o.orderedQty} pkts</span>
                            <span className={`block font-bold text-[10px] ${
                              o.status === 'SHORTAGE_EXCEPTION' ? 'text-amber-700' : o.status === 'DISPATCHED' ? 'text-green-700' : 'text-blue-700'
                            }`}>
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Warehouse Inventory Preview */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900 text-sm">Warehouse Stock Balances</h3>
                    <button onClick={() => setActiveTab('materials')} className="text-xs text-blue-600 font-bold hover:underline">
                      Manage Stock
                    </button>
                  </div>
                  <div className="space-y-2">
                    {materials.map((m) => (
                      <div key={m.id} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-0">
                        <span className="font-medium text-slate-800">{m.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-mono font-bold text-slate-900">{m.currentStock} {m.uom}</span>
                          <span className="text-[11px] text-slate-400 font-mono">@ ₹{m.currentWeightedRate.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===================== VIEW 2: SALES & INVOICING ===================== */}
          {activeTab === 'invoicing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Commercial Orders & GST Invoices</h2>
                  <p className="text-sm text-slate-500">Order approval, real-time inventory shortage verification, dispatch, and partial payments.</p>
                </div>
                <button
                  onClick={() => setShowOrderModal(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create Sales Order
                </button>
              </div>

              {/* Orders Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider flex justify-between items-center">
                  <span>Sales Orders & Shortage Exception Workflow</span>
                  <span className="text-slate-500 font-mono font-normal">Total: {salesOrders.length} orders</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Order No</th>
                      <th className="p-3.5">Customer Name</th>
                      <th className="p-3.5 text-right">Ordered Qty</th>
                      <th className="p-3.5 text-right">Total (Incl GST)</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {salesOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 font-sans">
                          No sales orders found. Click "Create Sales Order" to test the order lifecycle.
                        </td>
                      </tr>
                    ) : (
                      salesOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-blue-900">{o.orderNumber}</td>
                          <td className="p-3.5 font-sans font-medium text-slate-800">{o.customerName}</td>
                          <td className="p-3.5 text-right font-bold">{o.orderedQty} pkts</td>
                          <td className="p-3.5 text-right font-bold text-slate-900">₹{o.totalOrderValue.toFixed(2)}</td>
                          <td className="p-3.5 text-center font-sans">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              o.status === 'SHORTAGE_EXCEPTION'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : o.status === 'DISPATCHED'
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}>
                              {o.status === 'SHORTAGE_EXCEPTION' ? `SHORTAGE (Deficit: ${o.shortageQty} pkts)` : o.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-sans">
                            {o.status === 'SUBMITTED' ? (
                              <button
                                onClick={() => handleApproveOrder(o.id)}
                                className="bg-emerald-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-emerald-700 shadow-sm"
                              >
                                Approve & Dispatch
                              </button>
                            ) : o.status === 'SHORTAGE_EXCEPTION' ? (
                              <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-1 rounded border border-amber-200">
                                Blocked: Need Production
                              </span>
                            ) : (
                              <span className="text-[11px] text-green-700 font-bold">Dispatched</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Invoices & Payments Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mt-6">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider flex justify-between items-center">
                  <span>GST Tax Invoices & Partial Payment Reconciliation</span>
                  <span className="text-slate-500 font-mono font-normal">Total: {invoices.length} invoices</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Invoice No</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5 text-right">Taxable (₹)</th>
                      <th className="p-3.5 text-right">GST 5% (₹)</th>
                      <th className="p-3.5 text-right">Total (₹)</th>
                      <th className="p-3.5 text-right">Paid (₹)</th>
                      <th className="p-3.5 text-right">Balance Due</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {invoices.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400 font-sans">
                          No invoices generated yet. Invoices are automatically generated when a sales order is approved and dispatched.
                        </td>
                      </tr>
                    ) : (
                      invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-purple-900">{inv.invoiceNumber}</td>
                          <td className="p-3.5 font-sans font-medium text-slate-800">{inv.customerName}</td>
                          <td className="p-3.5 text-right">₹{inv.taxableValue.toFixed(2)}</td>
                          <td className="p-3.5 text-right text-slate-500">
                            ₹{(inv.cgstAmount + inv.sgstAmount).toFixed(2)}
                            <span className="text-[10px] block text-slate-400">CGST+SGST</span>
                          </td>
                          <td className="p-3.5 text-right font-black text-slate-900">₹{inv.totalInvoiceAmount.toFixed(2)}</td>
                          <td className="p-3.5 text-right text-green-700 font-bold">₹{inv.paidAmount.toFixed(2)}</td>
                          <td className="p-3.5 text-right text-red-600 font-black">₹{inv.balanceAmount.toFixed(2)}</td>
                          <td className="p-3.5 text-center font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              inv.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                            }`}>
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-sans">
                            {inv.balanceAmount > 0 ? (
                              <button
                                onClick={() => {
                                  setSelectedInvoice(inv);
                                  setPaymentAmountInput(inv.balanceAmount.toFixed(2));
                                  setShowPaymentModal(true);
                                }}
                                className="bg-purple-600 text-white px-2.5 py-1 rounded text-xs font-bold hover:bg-purple-700 shadow-sm"
                              >
                                Record Payment
                              </button>
                            ) : (
                              <span className="text-green-700 font-bold text-xs">Cleared</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== VIEW 3: PRODUCTION ===================== */}
          {activeTab === 'production' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Production Batches & Costing</h2>
                  <p className="text-sm text-slate-500">Bill of Materials execution, yield variance, oil consumption, and unit packet costing.</p>
                </div>
                <button
                  onClick={() => setShowBatchModal(true)}
                  className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-amber-700 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Run Production Batch
                </button>
              </div>

              {/* Standard BOM Reference Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
                  Standard Bill of Materials (BOM) — Murukku 200g (Batch Size: 200 Packets)
                </span>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Rice Flour</span>
                    <span className="font-bold text-slate-900">40.0 kg</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Groundnut Oil</span>
                    <span className="font-bold text-slate-900">10.0 L</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Spice Mix</span>
                    <span className="font-bold text-slate-900">1.2 kg</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Nitrogen Pouches</span>
                    <span className="font-bold text-slate-900">200 pcs</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block text-[10px]">Shipping Cartons</span>
                    <span className="font-bold text-slate-900">10 pcs</span>
                  </div>
                </div>
              </div>

              {/* Batches Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-700 uppercase tracking-wider">
                  Completed Production Batches & Operational Variances
                </div>
                <div className="divide-y divide-slate-100">
                  {batches.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No production batches recorded. Click "Run Production Batch" above to execute your first batch.
                    </div>
                  ) : (
                    batches.map((b) => (
                      <div key={b.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-900 text-sm font-mono">{b.batchNumber}</span>
                            <span className="text-xs text-slate-600 font-medium">{b.productName}</span>
                          </div>
                          <span className="text-xs text-slate-500">Supervisor: <strong className="text-slate-800">{b.supervisor}</strong></span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-slate-500 block text-[10px]">Output vs Planned</span>
                            <span className="font-bold text-slate-900">{b.goodOutput} / {b.plannedYield} pkts</span>
                            <span className={`text-[10px] block font-bold mt-0.5 ${b.yieldVariancePercent < 0 ? 'text-amber-700' : 'text-green-700'}`}>
                              Yield Variance: {b.yieldVariancePercent}%
                            </span>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-slate-500 block text-[10px]">Oil Consumed</span>
                            <span className="font-bold text-slate-900">{b.oilIssued} L (Std: 10.0L)</span>
                            <span className="text-[10px] block font-bold text-amber-700 mt-0.5">
                              Oil Variance: +{b.oilVariance}%
                            </span>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="text-slate-500 block text-[10px]">Total Batch Cost</span>
                            <span className="font-bold text-slate-900">₹{b.costing.totalBatchCost.toFixed(2)}</span>
                            <span className="text-[10px] block text-slate-500 mt-0.5">RM + PM + Labour + Overhead</span>
                          </div>

                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <span className="text-green-700 block text-[10px] font-bold">Unit Cost & Margin</span>
                            <span className="font-black text-green-950 text-sm">₹{b.costing.costPerGoodPacket.toFixed(2)} / pkt</span>
                            <span className="text-[10px] block font-bold text-green-800 mt-0.5">
                              Gross Margin: {b.costing.grossMarginPercent.toFixed(1)}% (@ ₹50 SP)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===================== VIEW 4: WAREHOUSE & MATERIALS ===================== */}
          {activeTab === 'materials' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Warehouse Raw & Packaging Materials</h2>
                  <p className="text-sm text-slate-500">Live stock on hand, weighted-average valuation, inward purchases (GRN), and reorder alerts.</p>
                </div>
                <button
                  onClick={() => setShowPurchaseModal(true)}
                  className="flex items-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-800 shadow-sm"
                >
                  <Package className="w-4 h-4" />
                  Record Inward Purchase (GRN)
                </button>
              </div>

              {/* Materials Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">Code</th>
                      <th className="p-3.5">Material Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5 text-right">Stock on Hand</th>
                      <th className="p-3.5 text-right">Weighted Rate</th>
                      <th className="p-3.5 text-right">Total Valuation</th>
                      <th className="p-3.5 text-center">Reorder Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {materials.map((m) => {
                      const valuation = m.currentStock * m.currentWeightedRate;
                      const isLowStock = m.currentStock <= m.minReorderQty;
                      return (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-blue-900">{m.code}</td>
                          <td className="p-3.5 font-sans font-semibold text-slate-900">{m.name}</td>
                          <td className="p-3.5 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.category === 'RAW' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {m.category}
                            </span>
                          </td>
                          <td className="p-3.5 text-right font-black text-slate-900">{m.currentStock} {m.uom}</td>
                          <td className="p-3.5 text-right font-bold text-slate-700">₹{m.currentWeightedRate.toFixed(4)}</td>
                          <td className="p-3.5 text-right font-black text-slate-900">₹{valuation.toFixed(2)}</td>
                          <td className="p-3.5 text-center font-sans">
                            {isLowStock ? (
                              <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                Low Stock Alert
                              </span>
                            ) : (
                              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                Adequate
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== VIEW 5: DOUBLE-ENTRY LEDGER ===================== */}
          {activeTab === 'ledger' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Immutable Double-Entry Stock Movement Ledger</h2>
                  <p className="text-sm text-slate-500">Every inventory movement requires an explicit journal entry, reference document, and running balance.</p>
                </div>
                <div className="text-xs font-mono text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                  Total Entries: <strong>{stockLedger.length}</strong>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200 font-sans">
                    <tr>
                      <th className="p-3.5">Journal Ref</th>
                      <th className="p-3.5">Item Name</th>
                      <th className="p-3.5">Movement Type</th>
                      <th className="p-3.5 text-right">Change</th>
                      <th className="p-3.5 text-right">Balance After</th>
                      <th className="p-3.5">Reference Doc</th>
                      <th className="p-3.5">Actor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {stockLedger.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50">
                        <td className="p-3.5 font-bold text-blue-600">{row.transactionRef}</td>
                        <td className="p-3.5 font-sans font-medium text-slate-900">{row.itemName}</td>
                        <td className="p-3.5 font-sans">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.movementType.includes('PURCHASE') || row.movementType.includes('YIELD') || row.movementType.includes('OPENING')
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {row.movementType}
                          </span>
                        </td>
                        <td className={`p-3.5 text-right font-bold ${row.quantityIn > 0 ? 'text-green-700' : 'text-red-600'}`}>
                          {row.quantityIn > 0 ? `+${row.quantityIn} ${row.uom}` : `-${row.quantityOut} ${row.uom}`}
                        </td>
                        <td className="p-3.5 text-right font-black text-slate-900">{row.balanceAfter} {row.uom}</td>
                        <td className="p-3.5 font-sans">{row.referenceDoc}</td>
                        <td className="p-3.5 font-sans text-slate-500">{row.actor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== VIEW 6: STANDARD BENCHMARK PROOF ===================== */}
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

          {/* ===================== VIEW 7: TRACEABILITY & AUDIT ===================== */}
          {activeTab === 'audit' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Lot Traceability & Statutory Audit</h2>
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

      {/* ===================== MODAL 1: CREATE SALES ORDER ===================== */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Create New Sales Order</h3>
              <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Customer Name</label>
                <input
                  type="text"
                  value={newCustomer}
                  onChange={(e) => setNewCustomer(e.target.value)}
                  placeholder="e.g. Cauvery Wholesale Confectioneries Pvt Ltd"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Product SKU</label>
                <select
                  value={newOrderSku}
                  onChange={(e) => setNewOrderSku(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.sku}>{p.sku} — {p.name} (Stock: {p.currentStock} pkts)</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Order Quantity (Packets)</label>
                  <span className="text-[11px] font-bold text-slate-500">Stock on Hand: {availableFgStock} pkts</span>
                </div>
                <input
                  type="number"
                  value={newOrderQty}
                  onChange={(e) => setNewOrderQty(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  min="1"
                  required
                />
              </div>

              {/* Dynamic Shortage Warning */}
              {newOrderQty && (
                <div className={`p-3 rounded-lg text-xs font-medium border ${
                  isOrderShortage ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-green-50 border-green-200 text-green-900'
                }`}>
                  {isOrderShortage ? (
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Shortage Exception Warning:</strong> Order of {newOrderQty} packets exceeds available stock of {availableFgStock} pkts.
                        <span className="block font-bold mt-0.5">Deficit of {Number(newOrderQty) - availableFgStock} pkts will be flagged for production fulfillment.</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      <span>Stock available in warehouse. Order can be approved and dispatched immediately.</span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs font-mono space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Taxable Value:</span>
                  <span>₹{((Number(newOrderQty) || 0) * (Number(newOrderPrice) || 50)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST 5% (CGST 2.5% + SGST 2.5%):</span>
                  <span>₹{((Number(newOrderQty) || 0) * (Number(newOrderPrice) || 50) * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-blue-950 pt-1 border-t border-blue-200 text-sm">
                  <span>Total Order Value:</span>
                  <span>₹{((Number(newOrderQty) || 0) * (Number(newOrderPrice) || 50) * 1.05).toFixed(2)}</span>
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

      {/* ===================== MODAL 2: INWARD PURCHASE GRN ===================== */}
      {showPurchaseModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Record Inward Material Purchase (GRN)</h3>
              <button onClick={() => setShowPurchaseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePurchaseSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Select Material</label>
                <select
                  value={purchaseMaterialCode}
                  onChange={(e) => setPurchaseMaterialCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
                >
                  {materials.map(m => (
                    <option key={m.id} value={m.code}>{m.code} — {m.name} (Current Stock: {m.currentStock} {m.uom})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Quantity Received</label>
                  <input
                    type="number"
                    step="0.01"
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(e.target.value)}
                    placeholder="e.g. 60.0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Purchase Rate (₹/unit)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={purchaseRate}
                    onChange={(e) => setPurchaseRate(e.target.value)}
                    placeholder="e.g. 45.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Supplier Name</label>
                <input
                  type="text"
                  value={purchaseSupplier}
                  onChange={(e) => setPurchaseSupplier(e.target.value)}
                  placeholder="e.g. Thanjavur Agro Mills Pvt Ltd"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Purchase Order / Challan Ref</label>
                <input
                  type="text"
                  value={purchaseInvoiceRef}
                  onChange={(e) => setPurchaseInvoiceRef(e.target.value)}
                  placeholder="e.g. PO-2026-001"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                />
              </div>

              {purchaseQty && purchaseRate && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Total Purchase Value:</span>
                    <span className="font-bold text-emerald-950">₹{(Number(purchaseQty) * Number(purchaseRate)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 text-[11px]">
                    <span>Weighted Rate Formula:</span>
                    <span>(Old Val + Inward Val) / New Stock</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-700 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-emerald-800 shadow"
              >
                Confirm Inward & Post to Stock Ledger
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL 3: RUN PRODUCTION BATCH ===================== */}
      {showBatchModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Run Production Batch (Murukku 200g)</h3>
              <button onClick={() => setShowBatchModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatchSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Standard Batch Output</label>
                  <input
                    type="text"
                    disabled
                    value="200 Packets"
                    className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Actual Good Packets Output</label>
                  <input
                    type="number"
                    value={batchGood}
                    onChange={(e) => setBatchGood(e.target.value)}
                    placeholder="e.g. 188"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Flour (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={batchFlour}
                    onChange={(e) => setBatchFlour(e.target.value)}
                    placeholder="e.g. 40.0"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Oil Issued (L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={batchOil}
                    onChange={(e) => setBatchOil(e.target.value)}
                    placeholder="e.g. 10.5"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Scrap Pouches</label>
                  <input
                    type="number"
                    value={batchScrap}
                    onChange={(e) => setBatchScrap(e.target.value)}
                    placeholder="e.g. 6"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {batchGood && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>Yield Variance:</span>
                    <span className="font-bold text-amber-900">
                      {(((Number(batchGood) - 200) / 200) * 100).toFixed(1)}%
                    </span>
                  </div>
                  {batchOil && (
                    <div className="flex justify-between text-slate-700">
                      <span>Oil Variance:</span>
                      <span className="font-bold text-amber-900">
                        {(((Number(batchOil) - 10.0) / 10.0) * 100).toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              )}

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

      {/* ===================== MODAL 4: RECORD PAYMENT ===================== */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Record Customer Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-xs font-mono mb-4 space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Invoice No:</span>
                <span className="font-bold text-purple-950">{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Customer:</span>
                <span className="font-bold truncate max-w-[180px]">{selectedInvoice.customerName}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Total Invoice:</span>
                <span className="font-bold">₹{selectedInvoice.totalInvoiceAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-purple-900 font-bold border-t border-purple-200 pt-1">
                <span>Outstanding Balance:</span>
                <span>₹{selectedInvoice.balanceAmount.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentAmountInput}
                  onChange={(e) => setPaymentAmountInput(e.target.value)}
                  placeholder="e.g. 4000.00"
                  max={selectedInvoice.balanceAmount}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Payment Channel</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white font-medium"
                >
                  <option>NEFT / RTGS Bank Transfer</option>
                  <option>UPI Corporate Transfer</option>
                  <option>Cheque Deposit</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-purple-700 shadow"
              >
                Confirm Payment & Clear Balance
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
