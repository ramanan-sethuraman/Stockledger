# RISK REGISTER & MITIGATION STRATEGY
## Stockledger

| Risk ID | Risk Category | Risk Description | Severity | Probability | Impact Analysis | Mitigation Strategy & Architectural Safeguard |
|:---|:---|:---|:---:|:---:|:---|:---|
| **RSK-01** | Financial Integrity | Floating-point rounding error in monetary calculations. | **CRITICAL** | High | Discrepancy in GST reports or invoice totals causes audit failure. | Use `Decimal` arithmetic throughout the backend. Never perform raw JS float arithmetic on currency or quantities. |
| **RSK-02** | Inventory Integrity | Race conditions during concurrent sales orders or production dispatches causing negative stock balances. | **CRITICAL** | Medium | Overselling product or consuming materials that do not exist physically in the factory. | Enforce database transactions with optimistic version locking on balances and strict check constraint `CHECK (balance >= 0)`. |
| **RSK-03** | Data Consistency | Partial failure during production batch completion. | **CRITICAL** | Medium | Discrepancy between physical warehouse and digital ledger. | Wrap batch completion in an ACID transaction boundary (`prisma.$transaction`). All deductions and credits commit atomically. |
| **RSK-04** | Statutory Compliance | Inaccurate GST split. | **HIGH** | Medium | Tax liability miscalculation. | Automated state-code matching: If `Supplier.state_code == Customer.state_code` (e.g. "33" for Tamil Nadu), force CGST (2.5%) + SGST (2.5%). Else apply IGST (5.0%). |
