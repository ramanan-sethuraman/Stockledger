import Decimal from 'decimal.js';
import { BenchmarkEngine } from './benchmarkCalculationEngine.js';

console.log('====================================================');
console.log('NIT TIRUCHIRAPPALLI ERP BENCHMARK - AUTOMATED RUNNER');
console.log('Product: Murukku 200g (Tamil Nadu Food Manufacturing)');
console.log('====================================================\n');

function assertEqual(actual: Decimal | number, expected: Decimal | number, label: string) {
  const actualDec = new Decimal(actual);
  const expectedDec = new Decimal(expected);
  if (!actualDec.equals(expectedDec)) {
    console.error(`❌ FAIL: [${label}] Expected ${expectedDec.toString()}, got ${actualDec.toString()}`);
    process.exit(1);
  } else {
    console.log(`✅ PASS: [${label}] = ${actualDec.toString()}`);
  }
}

// -------------------------------------------------------------
// STEP 1: Purchase 60 kg flour @ ₹45/kg
// Opening: 100 kg @ ₹42/kg
// -------------------------------------------------------------
console.log('--- STEP 1: PURCHASE & WEIGHTED AVERAGE VALUATION ---');
const step1 = BenchmarkEngine.calculatePurchaseWeightedAverage(
  new Decimal(100), // opening flour kg
  new Decimal(42),  // opening rate ₹/kg
  new Decimal(60),  // purchased kg
  new Decimal(45)   // purchase rate ₹/kg
);

assertEqual(step1.totalQty, 160, 'Step 1: Total Flour Stock after Purchase (kg)');
assertEqual(step1.weightedRate, 43.125, 'Step 1: Weighted Average Flour Rate (₹/kg)');
assertEqual(step1.totalValuation, 6900, 'Step 1: Total Flour Valuation (₹)');

// -------------------------------------------------------------
// STEPS 2 - 7: Production Batch Execution & Variance
// Standard: 40kg flour, 10L oil, 1.2kg spices, 200 pouches, 10 cartons -> 200 pkts
// Actual: 40kg flour, 10.5L oil, 1.2kg spices, 188 good pkts, 6 damaged pouches, 9 cartons used
// -------------------------------------------------------------
console.log('\n--- STEPS 2-7: PRODUCTION EXECUTION & VARIANCE ---');
const step2To7 = BenchmarkEngine.executeProductionBatch(
  new Decimal(160), // flour after purchase
  new Decimal(30),  // opening oil L
  new Decimal(5),   // opening spice kg
  new Decimal(500), // opening pouches
  new Decimal(30),  // opening cartons
  new Decimal(50),  // opening finished goods
  {
    flourKg: new Decimal(40),
    oilLitres: new Decimal(10.5),
    spiceMixKg: new Decimal(1.2),
    pouchesPcs: new Decimal(188),
    cartonsPcs: new Decimal(9),
    damagedPouchesPcs: new Decimal(6),
  },
  new Decimal(200), // planned yield
  new Decimal(188), // actual good output
  new Decimal(10)   // standard oil
);

assertEqual(step2To7.flourRemainingKg, 120, 'Step 2: Flour Remaining (kg)');
assertEqual(step2To7.oilRemainingLitres, 19.5, 'Step 3: Oil Remaining (Litres)');
assertEqual(step2To7.oilVariancePercent, 5.0, 'Step 3: Oil Variance (%)');
assertEqual(step2To7.yieldVariancePercent, -6.0, 'Step 5: Yield Variance (%)');
assertEqual(step2To7.finishedGoodsPostProduction, 238, 'Step 5: Finished Goods Post-Production');
assertEqual(step2To7.pouchesRemainingPcs, 306, 'Step 6: Pouches Remaining (pcs)');
assertEqual(step2To7.cartonsRemainingPcs, 21, 'Step 7: Cartons Remaining (pcs)');

// -------------------------------------------------------------
// STEPS 13 - 14: Batch Costing Calculation
// Labour: ₹1200, Gas/Power: ₹600
// -------------------------------------------------------------
console.log('\n--- STEPS 13-14: BATCH COSTING & ABSORPTION ALLOCATION ---');
const costing = BenchmarkEngine.calculateBatchCosting(
  new Decimal(40),      // flour issued
  step1.weightedRate,   // weighted flour rate ₹43.125
  new Decimal(10.5),    // oil issued
  new Decimal(140),     // oil rate ₹140
  new Decimal(1.2),     // spice issued
  new Decimal(200),     // spice rate ₹200
  new Decimal(194),     // pouches used (188 + 6 damaged)
  new Decimal(2.50),    // pouch rate ₹2.50
  new Decimal(9),       // cartons used
  new Decimal(15),      // carton rate ₹15
  new Decimal(188),     // good output packets
  new Decimal(1200),    // labour cost
  new Decimal(600),     // gas/power overhead
  new Decimal(50)       // selling price
);

assertEqual(costing.flourCost, 1725, 'Costing: Flour Material Cost (₹)');
assertEqual(costing.oilCost, 1470, 'Costing: Oil Material Cost (₹)');
assertEqual(costing.spiceCost, 240, 'Costing: Spice Mix Material Cost (₹)');
assertEqual(costing.pouchesCost, 485, 'Costing: Pouches Cost (₹)');
assertEqual(costing.cartonsCost, 135, 'Costing: Cartons Cost (₹)');
assertEqual(costing.totalMaterialCost, 4055, 'Costing: Total Material Cost (₹)');
assertEqual(costing.totalBatchCost, 5855, 'Costing: Total Batch Production Cost (₹)');
assertEqual(costing.costPerGoodPacket.toDecimalPlaces(4), new Decimal('31.1436'), 'Costing: Cost per Good Packet (₹)');
console.log(`ℹ️  Unit Cost: ₹${costing.costPerGoodPacket.toFixed(2)} | Gross Margin: ₹${costing.grossMarginPerPacket.toFixed(2)} (${costing.grossMarginPercent.toFixed(1)}%)`);

// -------------------------------------------------------------
// STEPS 8 - 9: Salesman A Orders 150 Packets (Admin Approves, Invoices & Dispatches)
// -------------------------------------------------------------
console.log('\n--- STEPS 8-9: SALES ORDER, GST INVOICE & DISPATCH ---');
const step8To9 = BenchmarkEngine.generateGstInvoiceAndDispatch(
  new Decimal(150), // 150 packets ordered
  new Decimal(50),  // ₹50 per packet
  step2To7.finishedGoodsPostProduction // 238 packets available
);

assertEqual(step8To9.taxableValue, 7500, 'Step 9: Invoice Taxable Value (₹)');
assertEqual(step8To9.cgstAmount, 187.50, 'Step 9: CGST @ 2.5% (₹)');
assertEqual(step8To9.sgstAmount, 187.50, 'Step 9: SGST @ 2.5% (₹)');
assertEqual(step8To9.totalInvoiceAmount, 7875, 'Step 9: Total Invoice Amount (₹)');
assertEqual(step8To9.finishedGoodsRemaining, 88, 'Step 9: Finished Goods Balance after Dispatch');

// -------------------------------------------------------------
// STEPS 10 - 11: Salesman B Orders 120 Packets (Shortage Handling)
// -------------------------------------------------------------
console.log('\n--- STEPS 10-11: SHORTAGE DETECTION ---');
const step10To11 = BenchmarkEngine.checkOrderShortage(
  step8To9.finishedGoodsRemaining, // 88 packets remaining
  new Decimal(120)                 // 120 requested by Salesman B
);

assertEqual(step10To11.isShortage ? 1 : 0, 1, 'Step 11: Shortage Flag Triggered');
assertEqual(step10To11.shortageQty, 32, 'Step 11: Distributor Shortage Quantity (packets)');

// -------------------------------------------------------------
// STEP 12: Record ₹4,000 Payment
// -------------------------------------------------------------
console.log('\n--- STEP 12: PAYMENT RECEIPT & OUTSTANDING BALANCE ---');
const step12 = BenchmarkEngine.applyPayment(
  step8To9.totalInvoiceAmount, // ₹7,875
  new Decimal(4000)            // ₹4,000 payment
);

assertEqual(step12.outstanding, 3875, 'Step 12: Remaining Outstanding Balance (₹)');

console.log('\n====================================================');
console.log('🎯 ALL 15 NIT TRICHY BENCHMARK CRITERIA VERIFIED 100%');
console.log('====================================================\n');
