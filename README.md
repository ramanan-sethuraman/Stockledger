<div align="center">
  <img src="frontend/public/logo-full.svg" alt="STOCKLEDGER Logo" width="440" />

  ### *Every Stock. Every Transaction. Every Detail.*
  **Enterprise-grade Food Manufacturing & Inventory Management ERP**

  <br />

  [![Manufacturing Benchmark](https://img.shields.io/badge/Manufacturing%20Benchmark-100%25%20Verified-success?style=for-the-badge&logo=checkmarx)](https://github.com/ramanan-sethuraman/Stockledger)
  [![Vercel Multi-Services](https://img.shields.io/badge/Vercel-Multi--Service%20Ready-black?style=for-the-badge&logo=vercel)](https://github.com/ramanan-sethuraman/Stockledger)
  [![Architecture](https://img.shields.io/badge/Architecture-Double--Entry%20Ledger-blue?style=for-the-badge)](https://github.com/ramanan-sethuraman/Stockledger)
  [![Statutory Tax](https://img.shields.io/badge/Statutory-GST%20Compliant-orange?style=for-the-badge)](https://github.com/ramanan-sethuraman/Stockledger)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript)](https://github.com/ramanan-sethuraman/Stockledger)
</div>

---

## 🏛️ Executive Summary & Core Engineering

**Stockledger** is an enterprise-grade resource planning platform engineered specifically for the precision demands of food processing enterprises. It provides end-to-end visibility across procurement, multi-stage bill of materials (BOM), production variance tracking, statutory GST invoicing, dispatch tracking, and financial reconciliation.

Unlike generic prototypes or shallow CRUD applications, Stockledger enforces strict mathematical consistency across all modules:

1. **Immutable Double-Entry Stock Ledger**: Direct stock quantity overwrites are mathematically prohibited. Every receipt, production consumption, batch yield, scrap, and dispatch is committed as an immutable balanced ledger entry.
2. **Version-Controlled BOM & Variance Analysis**: Automatically calculates standard ingredient allowances per batch size, measures actual consumption against standard targets, and highlights material yield variances (e.g., oil absorption, dough scrap).
3. **Statutory GST Billing & Compliance**: Full intra-state (CGST 2.5% + SGST 2.5%) and inter-state (IGST 5.0%) calculations, HSN/SAC code tracking, tax breakdowns, credit limit validation, and payment receipts with outstanding balance tracking.
4. **Instant 1-Click CSV Data Exports**: Instant CSV data exports for GST Invoices, Raw Material Inventories, and the complete Double-Entry Stock Ledger.
5. **Vercel Multi-Services Cloud Architecture**: Zero-downtime, monorepo multi-service deployment configured via `vercel.json` unifying Express API backend routing with a Vite React SPA on a single domain.
6. **Fully Adaptive Responsive Design**: Optimized across mobile, tablet, and desktop viewports with responsive navigation, collapsible sidebars, and fluid data tables.

---

## 🚀 32 Enterprise Implementation Milestones

All 32 enterprise ERP functional milestones are fully implemented and verified in the codebase:

| # | Subsystem / Capability | Description | Status |
|:---:|:---|:---|:---:|
| 1 | **Application Setup** | Monorepo layout, TypeScript compilation, unified environment config | ✅ Complete |
| 2 | **UI/UX Design System** | Deep Royal Purple (`#50128B`, `#1E103A`) dark theme, silver accenting, Lucide icons | ✅ Complete |
| 3 | **Authentication & Authorization** | JWT authentication, bcrypt password hashing, session persistence | ✅ Complete |
| 4 | **Role-Based Dashboards** | Custom views tailored for Admin (S Ramanan), Plant Manager, and Salesman | ✅ Complete |
| 5 | **Product Management** | Finished goods catalog, SKU, HSN codes, unit sizing, selling prices | ✅ Complete |
| 6 | **Customer Management** | Customer directory, GSTIN registration, billing addresses, credit limits | ✅ Complete |
| 7 | **Supplier Management** | Vendor profiles, contact information, GSTIN, material catalogs | ✅ Complete |
| 8 | **Raw Material Management** | Raw ingredients, packaging materials, reorder levels, UOM tracking | ✅ Complete |
| 9 | **BOM Management** | Multilevel Bill of Materials with scrap percentages & standard quantities | ✅ Complete |
| 10 | **Purchase Management** | Goods Receipt Notes (GRN), weighted average cost updates, vendor bills | ✅ Complete |
| 11 | **Production Management** | Batch work orders, BOM auto-scaling, material issue validation | ✅ Complete |
| 12 | **Production Variance Analysis** | Actual vs. standard ingredient consumption, yield variance calculation | ✅ Complete |
| 13 | **Inventory Management** | Real-time stock levels, warehouse bins, batch allocation | ✅ Complete |
| 14 | **Stock Ledger Management** | Double-entry journal entries for every inbound and outbound movement | ✅ Complete |
| 15 | **Sales Order Management** | Customer purchase order capture, delivery dates, line-item pricing | ✅ Complete |
| 16 | **Order Verification & Approval** | Credit limit checking, available stock validation, manager sign-off | ✅ Complete |
| 17 | **GST Billing & Invoice Gen** | Automated GST calculation (CGST, SGST, IGST), sequential invoice numbering | ✅ Complete |
| 18 | **Dispatch Management** | Finished goods dispatch notes, stock relief, carrier tracking | ✅ Complete |
| 19 | **Payment & Collection** | Payment receipt entry, multiple payment modes, partial payment handling | ✅ Complete |
| 20 | **Outstanding & Receivables** | Real-time customer balance calculation, overdue invoices tracking | ✅ Complete |
| 21 | **Product Costing** | Absorption costing: raw material + direct labor + utility overheads | ✅ Complete |
| 22 | **Profit & Margin Calculation** | Line-item margin, batch profitability, revenue vs. COGS reporting | ✅ Complete |
| 23 | **Audit Trail Management** | User actions, timestamps, entity changes, IP tracking | ✅ Complete |
| 24 | **Sales & GST Reports** | Tax liability summaries, monthly turnover, GSTR-1 preparation data | ✅ Complete |
| 25 | **Purchase Reports** | Procurement expenditure, supplier price trends, material consumption | ✅ Complete |
| 26 | **Stock Reports** | Slow-moving inventory, valuation summaries, stock reorder warnings | ✅ Complete |
| 27 | **Production Reports** | Batch yield efficiency, operator throughput, downtime monitoring | ✅ Complete |
| 28 | **Financial Reports** | Revenue, COGS, gross margin, operating profit breakdowns | ✅ Complete |
| 29 | **Data Exports Available** | 1-Click CSV streaming for Invoices, Materials, and Ledger | ✅ Complete |
| 30 | **Benchmark Implementation** | End-to-end 15-step standard food processing verification runner | ✅ Complete |
| 31 | **Testing & Validation** | Automated Vitest API test suite covering all critical business flows | ✅ Complete |
| 32 | **Database & Security** | Prisma ORM, Decimal precision (`Decimal(12,4)`), SQL injection prevention | ✅ Complete |

---

## 🎯 Benchmark Verification (Murukku 200g Production Run)

Stockledger has been rigorously validated against the industry-standard food processing benchmark scenario. All 15 mathematical verification checkpoints pass with 100% precision:

| Step / Metric | Expected Value | Stockledger Engine | Status |
|:---|:---:|:---:|:---:|
| 1. Flour After Purchase (60kg @ ₹45/kg) | 160 kg @ ₹43.125/kg | 160.0000 kg @ ₹43.1250/kg | ✅ Verified |
| 2. Flour After Production Issue | 120 kg | 120.0000 kg | ✅ Verified |
| 3. Oil After Production Issue | 19.5 L | 19.5000 L | ✅ Verified |
| 4. Oil Consumption Variance | +5% | +5.00% | ✅ Verified |
| 5. Production Yield Variance (188/200) | -6% | -6.00% | ✅ Verified |
| 6. Pouches After Scrap (194 consumed) | 306 pcs | 306 pcs | ✅ Verified |
| 7. Cartons Remaining (9 consumed) | 21 pcs | 21 pcs | ✅ Verified |
| 8. Finished Goods Post-Production | 238 pkts | 238 pkts | ✅ Verified |
| 9. Finished Goods Post-Dispatch | 88 pkts | 88 pkts | ✅ Verified |
| 10. Invoice Taxable Value (150 pkts) | ₹7,500.00 | ₹7,500.00 | ✅ Verified |
| 11. CGST (2.5%) | ₹187.50 | ₹187.50 | ✅ Verified |
| 12. SGST (2.5%) | ₹187.50 | ₹187.50 | ✅ Verified |
| 13. Total Invoice Value | ₹7,875.00 | ₹7,875.00 | ✅ Verified |
| 14. Outstanding Balance (Post ₹4k payment) | ₹3,875.00 | ₹3,875.00 | ✅ Verified |
| 15. Shortage on Salesman B (120 requested) | 32 pkts | 32 pkts | ✅ Verified |

---

## ☁️ Vercel Multi-Services Cloud Deployment

The repository is configured for monorepo multi-service deployment via `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "services": {
    "backend": {
      "root": "backend",
      "framework": "express"
    },
    "frontend": {
      "root": "frontend",
      "framework": "vite"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": {
        "service": "backend"
      }
    },
    {
      "source": "/(.*)",
      "destination": {
        "service": "frontend"
      }
    }
  ]
}
```

- **Top-Level Rewrites**: Incoming `/api/(.*)` requests are routed to the Express backend service, preserving endpoints like `/api/v1/auth/login`, `/api/v1/materials`, and `/api/v1/health`.
- **Catch-All SPA Routing**: All other requests `/(.*)` serve the React Vite Single Page Application.
- **Serverless Ready**: `backend/src/server.ts` exports `app` for Vercel serverless execution while continuing to support local Node.js server startup.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts
- **Backend**: Node.js, Express, TypeScript, Zod Schema Validation, Helmet, Morgan
- **Database & Persistence**: SQLite / PostgreSQL with Prisma ORM (Strict `Decimal(12,4)` and `Decimal(14,2)` scaling)
- **Deployment**: Vercel Multi-Services Architecture (`vercel.json`)
- **Testing**: Vitest, Supertest, Benchmark Simulation Runner

---

## ⚡ Quick Start & Development

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 2. Clone and Install
```bash
git clone https://github.com/ramanan-sethuraman/Stockledger.git
cd Stockledger

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

### 3. Initialize Database
```bash
cd backend
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
cd ..
```

### 4. Start Development Servers
In separate terminal sessions or using root scripts:
```bash
# Terminal 1: Backend API (Port 5000)
npm run dev:backend

# Terminal 2: Frontend SPA (Port 3000)
npm run dev:frontend
```

### 5. Run Verification & Tests
```bash
# Run Vitest test suite
npm run test

# Run the 15-Step Food Manufacturing Benchmark Runner
npm run test:benchmark
```

---

## 📄 Architectural Blueprints

Comprehensive technical specifications are available in [`/docs`](docs/):
- [Requirement Traceability Matrix (RTM)](docs/REQUIREMENT_TRACEABILITY_MATRIX.md)
- [System Architecture Specification](docs/SYSTEM_ARCHITECTURE.md)
- [Database Schema & ER Diagram](docs/DATABASE_SCHEMA_DESIGN.md)
- [API Architecture Specification](docs/API_ARCHITECTURE.md)
- [UI/UX Design Specification](docs/UI_UX_DESIGN_PLAN.md)
- [Development Roadmap & Verification Plan](docs/DEVELOPMENT_ROADMAP.md)
- [Risk Register & Mitigation Strategy](docs/RISK_REGISTER.md)
- [Food Manufacturing Benchmark Verification Specification](docs/BENCHMARK_VERIFICATION_SPEC.md)

---

## 👥 Default Enterprise Roles & Personas
- **Admin**: `admin@stockledger.com` (S Ramanan) — Full administrative, financial, and audit oversight.
- **Plant Manager**: `manager@stockledger.com` — Production planning, BOM control, batch execution, and variance analysis.
- **Sales Representative**: `sales@stockledger.com` — Order capture, customer credit checks, and delivery tracking.

---

<div align="center">
  <sub>Engineered by Stockledger Core Systems. Built for high-reliability manufacturing operations.</sub>
</div>
