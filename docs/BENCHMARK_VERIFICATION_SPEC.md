# BENCHMARK VERIFICATION SPECIFICATION
## Standard Food Manufacturing Benchmark: Murukku 200g Batch

This document outlines the step-by-step mathematical proof and acceptance criteria for the standard manufacturing benchmark test.

---

### Master Data Setup
- **Product**: Murukku 200 g (SKU: `MUR-200G`, HSN: `1905`)
- **Factory Location**: Tamil Nadu (State Code: `33`)
- **Distributor Location**: Tamil Nadu (Intra-state transaction -> CGST 2.5% + SGST 2.5%)
- **Standard Batch Output**: 200 packets
- **Standard BOM Consumption**:
  - Flour: 40.0000 kg
  - Oil: 10.0000 Litres
  - Spice mix: 1.2000 kg
  - Pouches: 200 pcs
  - Cartons: 10 pcs (Each carton holds 20 packets)
- **Selling Price**: ₹50.00 per packet (before GST)
- **GST Rate**: 5% total

---

### Initial State (Opening Stock)
| Item | Opening Qty | Opening Rate | Opening Valuation |
|:---|:---|:---|:---|
| Flour | 100.0000 kg | ₹42.00 / kg | ₹4,200.00 |
| Oil | 30.0000 L | ₹140.00 / L | ₹4,200.00 |
| Spice mix | 5.0000 kg | ₹200.00 / kg | ₹1,000.00 |
| Pouches | 500 pcs | ₹2.50 / pc | ₹1,250.00 |
| Cartons | 30 pcs | ₹15.00 / pc | ₹450.00 |
| **Finished Murukku** | **50 packets** | ₹30.00 / pkt (std) | ₹1,500.00 |

---

### Step-by-Step Execution & Expected Results

#### Step 1: Purchase 60 kg Flour @ ₹45/kg
- **Quantity Added**: +60.0000 kg
- **New Total Flour**: 100 + 60 = **160.0000 kg**
- **Weighted Average Rate Calculation**:
  $$\text{New Rate} = \frac{(100 \times 42.00) + (60 \times 45.00)}{100 + 60} = \frac{4200 + 2700}{160} = \frac{6900}{160} = \mathbf{₹43.1250\text{ / kg}}$$

#### Steps 2-4: Issue Materials for Production Batch
- **Flour Issued**: 40.0000 kg
  - Balance: $160 - 40 =$ **120.0000 kg**
- **Oil Issued**: 10.5000 Litres
  - Balance: $30 - 10.5 =$ **19.5000 L**
  - Oil Consumption Variance: $\frac{10.5 - 10.0}{10.0} \times 100 = \mathbf{+5.0\%}$
- **Spice Mix Issued**: 1.2000 kg
  - Balance: $5.0 - 1.2 =$ **3.8000 kg**

#### Steps 5-7: Record Production Output & Packaging Usage
- **Good Packets Produced**: 188 packets
  - Standard Batch: 200 packets
  - Yield Variance: $\frac{188 - 200}{200} \times 100 = \frac{-12}{200} \times 100 = \mathbf{-6.0\%}$
  - Finished Goods after Production: $50 + 188 =$ **238 packets**
- **Packaging Used**:
  - Damaged Pouches: 6 pcs
  - Good Pouches: 188 pcs
  - Total Pouches Consumed: $188 + 6 = 194$ pcs
  - Pouches Balance: $500 - 194 =$ **306 pcs**
  - Cartons Used: 9 pcs
  - Cartons Balance: $30 - 9 =$ **21 pcs**

#### Steps 13-14: Batch Costing Calculation
- **Material Costs**:
  - Flour: $40 \text{ kg} \times ₹43.125 = ₹1,725.00$
  - Oil: $10.5 \text{ L} \times ₹140.00 = ₹1,470.00$
  - Spice mix: $1.2 \text{ kg} \times ₹200.00 = ₹240.00$
  - Pouches: $194 \text{ pcs} \times ₹2.50 = ₹485.00$
  - Cartons: $9 \text{ pcs} \times ₹15.00 = ₹135.00$
  - **Subtotal Materials**: $1725 + 1470 + 240 + 485 + 135 = \mathbf{₹4,055.00}$
- **Direct Additions**:
  - Direct Labour: **₹1,200.00**
  - Gas / Power Overhead: **₹600.00**
- **Total Production Batch Cost**: $4055 + 1200 + 600 = \mathbf{₹5,855.00}$
- **Cost per Good Packet**: $\frac{₹5,855.00}{188} = \mathbf{₹31.1436}$ (~**₹31.14 / packet**)
- **Gross Margin per Packet**: $₹50.00 - ₹31.14 = \mathbf{₹18.86}$ (**37.7% Gross Margin**)

#### Steps 8-9: Salesman A Orders 150 Packets (Admin Approves, Invoices & Dispatches)
- **Selling Price**: ₹50.00 / packet
- **Taxable Value**: $150 \times 50.00 = \mathbf{₹7,500.00}$
- **GST Split (Intra-state Tamil Nadu)**:
  - CGST (2.5%): $\mathbf{₹187.50}$
  - SGST (2.5%): $\mathbf{₹187.50}$
  - Total GST: ₹375.00
- **Total Invoice Value**: $7500.00 + 187.50 + 187.50 = \mathbf{₹7,875.00}$
- **Dispatch**: 150 packets deducted from Finished Goods
  - Finished Goods Balance: $238 - 150 =$ **88 packets**

#### Steps 10-11: Salesman B Orders 120 Packets (Shortage Handling)
- **Available Finished Goods Stock**: 88 packets
- **Requested Quantity**: 120 packets
- **Shortage Detected & Logged**: $120 - 88 =$ **32 packets**
- **System Action**: Order flagged as `SHORTAGE_EXCEPTION`.

#### Step 12: Record ₹4,000 Payment
- **Invoice Value**: ₹7,875.00
- **Payment Received**: ₹4,000.00
- **Remaining Outstanding Balance**: $7875.00 - 4000.00 = \mathbf{₹3,875.00}$

---

### Verification Summary Table
| Metric | Benchmark Target | Stockledger Calculated | Status |
|:---|:---:|:---:|:---:|
| Flour Remaining | 120 kg | 120.0000 kg | **PASSED** |
| Oil Remaining | 19.5 Litres | 19.5000 L | **PASSED** |
| Pouches Remaining | 306 pcs | 306 pcs | **PASSED** |
| Finished Goods (Post-Production) | 238 packets | 238 packets | **PASSED** |
| Finished Goods (Post-Dispatch) | 88 packets | 88 packets | **PASSED** |
| Yield Variance | -6% | -6.0% | **PASSED** |
| Oil Variance | +5% | +5.0% | **PASSED** |
| Invoice Taxable Value | ₹7,500.00 | ₹7,500.00 | **PASSED** |
| CGST (2.5%) | ₹187.50 | ₹187.50 | **PASSED** |
| SGST (2.5%) | ₹187.50 | ₹187.50 | **PASSED** |
| Invoice Total | ₹7,875.00 | ₹7,875.00 | **PASSED** |
| Outstanding Balance | ₹3,875.00 | ₹3,875.00 | **PASSED** |
| Distributor Shortage | 32 packets | 32 packets | **PASSED** |
