# SYSTEM ARCHITECTURE SPECIFICATION
## FactoryFlow ERP / Stockledger

### 1. High-Level System Architecture Diagram

```mermaid
flowchart TD
    subgraph CLIENT_TIER["Presentation Tier (Vite + React 18 + TypeScript)"]
        UI_AUTH["Auth & RBAC (Role Guards)"]
        UI_SALES["Sales & Order Portal (Salesman / Admin)"]
        UI_PROD["Production & Batch Execution (Supervisor)"]
        UI_INV["Inventory & Ledger Console (Store Manager)"]
        UI_FIN["GST Invoicing & Payments (Accounts)"]
        UI_DASH["Executive Dashboard & Audit (Owner / Auditor)"]
        STATE_MGR["TanStack Query (Cache & Sync) + React Hook Form + Zod"]
    end

    subgraph API_GATEWAY["API Gateway & Middleware Layer (Node.js + Express + TS)"]
        RATE_LIMIT["Rate Limiter & Helmet Security"]
        AUTH_MW["JWT Verifier & Context Injector"]
        RBAC_MW["Role-Based Access Guard"]
        VALID_MW["Zod Schema Request Validator"]
        TXN_INTERCEPTOR["Atomic Transaction Wrapper"]
        AUDIT_MW["Financial & Security Audit Logger"]
    end

    subgraph BUSINESS_ENGINES["Core Domain Services Layer"]
        PROD_ENGINE["Production Engine (BOM, Yield, Variance)"]
        INV_ENGINE["Double-Entry Inventory Ledger Engine"]
        TAX_ENGINE["Statutory GST & HSN Engine"]
        COST_ENGINE["Costing Engine (Weighted-Avg & Absorption)"]
        SALES_ENGINE["Order-to-Dispatch Fulfillment Engine"]
        LEDGER_ENG["Financial Sub-Ledger & Receivables"]
    end

    subgraph DATA_TIER["Persistence & Integrity Tier (PostgreSQL + Prisma)"]
        PG_DB[(PostgreSQL 16 Engine)]
        subgraph PG_SCHEMAS["Schema Partitions & Constraints"]
            TABLES_CORE["Core Masters (Users, Products, Materials, BOMs)"]
            TABLES_TXN["Transactional Records (PO, SO, Batch, Invoice)"]
            TABLES_LEDGER["Immutable Stock & Financial Ledgers"]
            TABLES_AUDIT["Append-Only Audit Logs"]
        end
    end

    CLIENT_TIER -->|HTTPS / JSON REST| API_GATEWAY
    API_GATEWAY --> BUSINESS_ENGINES
    BUSINESS_ENGINES -->|Prisma Client / Atomic Prisma Transactions| DATA_TIER
```

---

### 2. Dual-Engine Architecture: Production & Inventory

The central technical differentiator of this ERP is the **Ledger-Based Inventory Model** operating under strict ACID guarantees:

```mermaid
sequenceDiagram
    autonumber
    actor Supervisor as Production Supervisor
    participant ProdSvc as Production Engine
    participant BomSvc as BOM Engine
    participant TxnMgr as Prisma $transaction
    participant LedgerSvc as Stock Ledger Engine
    participant CostSvc as Costing Engine
    participant AuditSvc as Audit Logger

    Supervisor->>ProdSvc: Complete Batch (Murukku 200g, 188 Good, 6 Scrap)
    ProdSvc->>BomSvc: Fetch Active BOM & Standards (Expected: 200 pkts)
    ProdSvc->>TxnMgr: Begin Atomic Transaction (ISOLATION LEVEL: SERIALIZABLE)
    
    rect rgb(240, 248, 255)
        Note over TxnMgr,LedgerSvc: 1. Raw Materials Deduction
        TxnMgr->>LedgerSvc: Debit Flour (-40 kg, Lot #FL-01)
        TxnMgr->>LedgerSvc: Debit Oil (-10.5 L, Lot #OIL-01)
        TxnMgr->>LedgerSvc: Debit Spice Mix (-1.2 kg, Lot #SP-01)
        
        Note over TxnMgr,LedgerSvc: 2. Packaging Materials Deduction
        TxnMgr->>LedgerSvc: Debit Pouches (-194 pcs [188 good + 6 damaged])
        TxnMgr->>LedgerSvc: Debit Cartons (-9 pcs)
        
        Note over TxnMgr,LedgerSvc: 3. Finished Goods Addition
        TxnMgr->>LedgerSvc: Credit Murukku 200g (+188 packets, Lot #BATCH-MK-001)
    end

    rect rgb(255, 248, 240)
        Note over TxnMgr,CostSvc: 4. Financial Valuation & Variance
        TxnMgr->>CostSvc: Calculate Batch Cost (Weighted Materials + ₹1200 Labour + ₹600 Power)
        TxnMgr->>CostSvc: Record Unit Cost (₹5,855.00 / 188 = ₹31.14)
        TxnMgr->>ProdSvc: Record Variances (Yield: -6.0%, Oil: +5.0%)
    end

    TxnMgr->>AuditSvc: Append Immutable Audit Record
    TxnMgr-->>ProdSvc: Commit Transaction
    ProdSvc-->>Supervisor: Batch Completed Successfully (Status: POSTED)
```

---

### 3. Key Non-Negotiable Architecture Rules

1. **Immutable Stock Ledger**: Stock levels are never updated with simple `UPDATE items SET quantity = quantity - x`. Instead, every movement inserts an immutable row into `stock_ledger`. The current stock balance is either dynamically summed or maintained in a strictly synchronized projection table with optimistic locking (`version` column).
2. **Deterministic Financial Arithmetic**: All monetary quantities and fractional weights are stored with explicit scale:
   - Money: `Decimal(14, 2)` (or integer paisa equivalent)
   - Quantities & UOM rates: `Decimal(12, 4)`
   - Floating point arithmetic is strictly forbidden in calculations.
3. **Optimistic & Pessimistic Concurrency**:
   - Stock allocations during concurrent order placement acquire pessimistic row locks (`SELECT FOR UPDATE`) or optimistic version checks to prevent race condition overselling.
4. **Statutory Tax Engine**:
   - Intra-state transaction (Supplier/Factory in Tamil Nadu -> Customer in Tamil Nadu): Splits into equal CGST (2.5%) and SGST (2.5%).
   - Inter-state transaction: IGST (5.0%).
   - Rounding conforms to Indian GST Rule 54 (half-up rounding to nearest rupee on total invoice, exact two decimals on itemized line totals).
