# API ARCHITECTURE SPECIFICATION
## Stockledger

### 1. RESTful Endpoint Hierarchy

```
/api/v1
  ├── /auth          -> POST /login, POST /refresh, GET /me, POST /logout
  ├── /users         -> GET /, POST /, PUT /:id (Admin RBAC restricted)
  ├── /materials     -> GET /, POST /, GET /:id/ledger (Raw & Packaging)
  ├── /products      -> GET /, POST /, GET /:id/bom (Finished Goods master)
  ├── /boms          -> GET /, POST /, PUT /:id/activate (Versioned recipe control)
  ├── /purchases     -> GET /, POST /, POST /:id/grn (GRN receipt & moving rate update)
  ├── /production    -> GET /batches, POST /batches, POST /batches/:id/issue, POST /batches/:id/complete
  ├── /sales         -> GET /orders, POST /orders, POST /orders/:id/approve, POST /orders/:id/reject
  ├── /invoices      -> GET /, POST /from-order/:orderId, GET /:id, GET /:id/pdf
  ├── /dispatches    -> GET /, POST /from-invoice/:invoiceId (Stock decrement)
  ├── /payments      -> GET /, POST / (Allocation to invoices & outstanding decrement)
  ├── /inventory     -> GET /ledger, GET /balances, POST /adjustments
  ├── /reports       -> GET /benchmark/run, GET /gst-summary, GET /production-yield, GET /audit-trail
  └── /dashboard     -> GET /metrics (Role-tailored KPI aggregates)
```
