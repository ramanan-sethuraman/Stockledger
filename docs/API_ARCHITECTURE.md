# API ARCHITECTURE SPECIFICATION
## FactoryFlow ERP / Stockledger

### 1. RESTful Endpoint Hierarchy

```
/api/v1
  ├── /auth
  │     POST /login                 (Email & password -> Access & Refresh tokens)
  │     POST /refresh               (Rotate JWT tokens)
  │     GET  /me                    (Current user profile & RBAC permissions)
  │     POST /logout                (Revoke active session)
  │
  ├── /users                        [Admin only]
  │     GET  /                      (List users with filters)
  │     POST /                      (Create user)
  │     PUT  /:id                   (Update user roles / status)
  │
  ├── /materials                    [Store, Production, Admin]
  │     GET  /                      (Raw & packaging materials catalogue)
  │     POST /                      (Register material)
  │     GET  /:id                   (Material details, stock & valuation)
  │     GET  /:id/ledger            (Material specific stock movements)
  │
  ├── /products                     [Sales, Production, Admin]
  │     GET  /                      (Finished goods catalogue)
  │     POST /                      (Register finished good)
  │     GET  /:id                   (Product details & current stock)
  │     GET  /:id/bom               (Associated active BOM)
  │
  ├── /boms                         [Production, Admin]
  │     GET  /                      (List BOMs & versions)
  │     POST /                      (Create new BOM version)
  │     GET  /:id                   (BOM items & standard recipe breakdown)
  │     PUT  /:id/activate          (Make version active)
  │
  ├── /purchases                    [Purchase, Store, Admin]
  │     GET  /                      (List Purchase Orders)
  │     POST /                      (Create PO)
  │     POST /:id/grn               (Receive GRN, update stock ledger & weighted avg rates)
  │
  ├── /production                   [Production, Store, Admin]
  │     GET  /batches               (List batches with status)
  │     POST /batches               (Create new batch from active BOM)
  │     POST /batches/:id/issue     (Issue raw materials & packaging)
  │     POST /batches/:id/complete  (Atomic completion: yield, scrap, FG credit, variance, costing)
  │     GET  /batches/:id/costing   (Detailed batch costing breakdown)
  │     GET  /batches/:id/variance  (Yield & material consumption variances)
  │
  ├── /sales                        [Sales, Admin]
  │     GET  /orders                (List sales orders)
  │     POST /orders                (Submit sales order with credit/stock check)
  │     GET  /orders/:id            (Order line items & fulfillment status)
  │     POST /orders/:id/approve    (Admin approval & stock reservation lock)
  │     POST /orders/:id/reject     (Reject order with reason)
  │
  ├── /invoices                     [Accounts, Admin]
  │     GET  /                      (List GST invoices)
  │     POST /from-order/:orderId   (Generate GST compliant invoice)
  │     GET  /:id                   (Invoice details, HSN breakdown, tax split)
  │     GET  /:id/pdf               (Printable GST tax invoice)
  │
  ├── /dispatches                   [Warehouse, Logistics, Admin]
  │     GET  /                      (List dispatch notes)
  │     POST /from-invoice/:invId   (Execute dispatch, deduct FG in stock ledger)
  │
  ├── /payments                     [Accounts, Admin]
  │     GET  /                      (List payment receipts)
  │     POST /                      (Record payment receipt & allocate to invoices)
  │     GET  /receivables           (Customer outstanding & ageing analysis)
  │
  ├── /inventory                    [All roles - read; Store - write]
  │     GET  /ledger                (Global double-entry stock movement ledger)
  │     GET  /balances              (Current on-hand balances with valuation)
  │     POST /adjustments           (Authorized stock adjustments with dual-sign-off)
  │
  ├── /reports                      [Auditor, Admin, Owner]
  │     GET  /benchmark/run         (Execute & verify exact NIT Trichy benchmark)
  │     GET  /benchmark/status      (Verify 15-step benchmark acceptance report)
  │     GET  /gst-summary           (GSTR-1 / GSTR-3B tax liability summaries)
  │     GET  /production-yield      (Batch efficiency & wastage reports)
  │     GET  /costing-variance      (Standard vs actual cost comparisons)
  │     GET  /audit-trail           (Immutable system security & transaction audit log)
  │
  └── /dashboard                    [All roles - role tailored view]
        GET  /metrics               (Real-time KPIs, inventory valuation, margin, alerts)
```

---

### 2. Standardized Request/Response Envelope

Every API response follows a consistent contract:

```typescript
// Standard Success Response
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
  };
}

// Standard Error Response
interface ApiErrorResponse {
  success: false;
  error: {
    code: string;           // e.g. "INSUFFICIENT_STOCK", "VALIDATION_FAILED"
    message: string;        // Human-readable message
    details?: any;          // Field-level validation errors or context
    referenceId?: string;   // Traceable correlation ID for server logs
  };
}
```

---

### 3. Middleware Pipeline & Security Controls

```
HTTP Request
    │
    ▼
[RateLimiter]       (Protect against DoS & brute force)
    │
    ▼
[Cors & Helmet]     (Strict headers, CSP, frameguards)
    │
    ▼
[AuthMiddleware]    (Extract & verify JWT; populate req.user)
    │
    ▼
[RbacMiddleware]    (Enforce role requirements: ADMIN, SUPERVISOR, SALES, ACCOUNTS)
    │
    ▼
[ZodValidator]      (Parse & sanitize req.body, req.query, req.params)
    │
    ▼
[DomainController]  (Route handling)
    │
    ▼
[PrismaTransaction] (Execute business logic inside ACID isolation boundary)
    │
    ▼
[AuditInterceptor]  (Log mutating actions to audit_logs table)
    │
    ▼
HTTP Response
```
