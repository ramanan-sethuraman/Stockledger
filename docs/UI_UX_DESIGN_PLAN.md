# UI/UX DESIGN SPECIFICATION & DESIGN SYSTEM
## FactoryFlow ERP / Stockledger

### 1. Visual Hierarchy & Design System Palette

Designed according to SaaS standards (Linear, Stripe, Vercel), optimized for data density, legibility, and rapid operational entry:

| Token Name | Hex Code | Purpose & Usage |
|:---|:---|:---|
| **Primary Navy** | `#172554` (blue-950) | Sidebar branding, primary CTA buttons, major headers |
| **Secondary Slate**| `#334155` (slate-700) | Secondary navigation, sub-headings, table headers |
| **Background** | `#F8FAFC` (slate-50) | Clean application canvas, card borders |
| **Surface** | `#FFFFFF` | Card bodies, modal containers, data table rows |
| **Border Slate** | `#E2E8F0` (slate-200) | Subtle row dividers, input field borders |
| **Success Forest** | `#15803D` (green-700)| Batch yield passed, invoices paid, stock healthy |
| **Warning Amber** | `#D97706` (amber-600)| Low stock alerts, pending approvals, negative variance |
| **Danger Crimson** | `#DC2626` (red-600)  | Stockout errors, order rejected, validation failure |

---

### 2. Typography & Layout System

- **Font Family**: Inter (`Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- **Scale**:
  - Page Titles: `text-2xl font-bold tracking-tight text-slate-900`
  - Section Headers: `text-lg font-semibold text-slate-800`
  - KPI Values: `text-3xl font-extrabold tracking-tight text-slate-950 font-mono`
  - Body Text: `text-sm text-slate-600 leading-relaxed`
  - Table Data: `text-sm font-medium text-slate-700 tabular-nums`
  - Badges & Tags: `text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider`

---

### 3. Role-Tailored Interface Personas

1. **Sales Executive (Speed & Clarity)**:
   - Quick-add order matrix with instant real-time stock indicator (Green = Available, Red = Stockout).
   - Instant calculation of order subtotal, GST, and customer credit balance.
2. **Production Supervisor (Operational Focus)**:
   - Visual Batch Execution Card: Step-by-step BOM recipe checklist.
   - Material Issue inputs with tolerance warning tags.
   - Live yield gauge showing percentage difference from 200 standard packets.
3. **Accounts & Store Manager (Control & Accuracy)**:
   - Dual-entry inventory inspection grid with filterable reference documents.
   - One-click GST tax invoice generation with PDF print preview and HSN breakdown.
   - Payment allocation modal with automatic outstanding balance decrement.
4. **Auditor & Factory Owner (Traceability & Strategy)**:
   - Full-lifecycle traceability drilldown: Click any invoice -> view dispatch -> view production batch -> view material GRN -> view supplier invoice.
   - Executive KPI cards: Real-time inventory valuation, daily gross margin %, top debtors ageing.
   - **One-Click NIT Trichy Benchmark Runner**: Dedicated visual simulation widget demonstrating the exact 15-step scenario and live verification of all acceptance criteria.
