export const benchmarkMaterials = [
  { id: 'mat-01', code: 'RM-FLOUR', name: 'Rice Flour (Grade A)', category: 'RAW' as const, uom: 'kg', openingStock: 100, currentStock: 120, currentWeightedRate: 43.125, minReorderQty: 25 },
  { id: 'mat-02', code: 'RM-OIL', name: 'Refined Groundnut Oil', category: 'RAW' as const, uom: 'L', openingStock: 30, currentStock: 19.5, currentWeightedRate: 140.0, minReorderQty: 10 },
  { id: 'mat-03', code: 'RM-SPICE', name: 'Murukku Special Spice Mix', category: 'RAW' as const, uom: 'kg', openingStock: 5, currentStock: 3.8, currentWeightedRate: 200.0, minReorderQty: 2 },
  { id: 'mat-04', code: 'PM-POUCH', name: 'Printed Nitrogen Pouches (200g)', category: 'PACKAGING' as const, uom: 'pcs', openingStock: 500, currentStock: 306, currentWeightedRate: 2.50, minReorderQty: 100 },
  { id: 'mat-05', code: 'PM-CARTON', name: 'Corrugated Shipping Cartons (20-Pack)', category: 'PACKAGING' as const, uom: 'pcs', openingStock: 30, currentStock: 21, currentWeightedRate: 15.0, minReorderQty: 10 },
];

export const benchmarkProducts = [
  {
    id: 'prod-01',
    sku: 'MUR-200G',
    name: 'South Indian Murukku 200g',
    hsnCode: '1905',
    uom: 'packet',
    unitWeightGrams: 200,
    sellingPrice: 50.0,
    gstRate: 5.0,
    openingStock: 50,
    currentStock: 88,
  },
];

export const benchmarkOrders = [
  {
    id: 'so-001',
    orderNumber: 'SO/2026-27/001',
    customerName: 'Cauvery Wholesale Confectioneries Pvt Ltd',
    customerGstin: '33AABCT1332M1ZG',
    salesman: 'M. Anand (Salesman A)',
    productSku: 'MUR-200G',
    orderedQty: 150,
    dispatchedQty: 150,
    shortageQty: 0,
    unitPrice: 50.0,
    taxableAmount: 7500.0,
    totalOrderValue: 7875.0,
    status: 'DISPATCHED' as const,
    notes: 'Dispatched in full. Invoice INV/2026-27/0001 generated.',
    createdAt: '2026-11-21 10:15',
  },
  {
    id: 'so-002',
    orderNumber: 'SO/2026-27/002',
    customerName: 'Madurai Snacking Hub',
    customerGstin: '33AAECM9921K1ZZ',
    salesman: 'V. Balaji (Salesman B)',
    productSku: 'MUR-200G',
    orderedQty: 120,
    dispatchedQty: 0,
    shortageQty: 32,
    unitPrice: 50.0,
    taxableAmount: 6000.0,
    totalOrderValue: 6300.0,
    status: 'SHORTAGE_EXCEPTION' as const,
    notes: 'Order blocked: Shortage of 32 packets. Available stock is 88 packets.',
    createdAt: '2026-11-21 11:45',
  },
];

export const benchmarkInvoices = [
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
    status: 'PARTIALLY_PAID' as const,
    invoiceDate: '2026-11-21',
  },
];

export const benchmarkBatches = [
  {
    id: 'batch-001',
    batchNumber: 'BAT-MK-001',
    productName: 'South Indian Murukku 200g',
    plannedYield: 200,
    goodOutput: 188,
    yieldVariancePercent: -6.0,
    oilIssued: 10.5,
    oilVariance: 5.0,
    scrapPouches: 6,
    costing: {
      totalBatchCost: 5855.0,
      costPerGoodPacket: 31.1436,
      grossMarginPercent: 37.71,
    },
    status: 'COMPLETED',
    supervisor: 'K. Senthil',
    completedAt: '2026-11-21 13:30',
  },
];

export const benchmarkLedger = [
  { id: '1', transactionRef: 'TXN-001', itemCode: 'RM-FLOUR', itemName: 'Rice Flour (Grade A)', movementType: 'PURCHASE_GRN', quantityIn: 60.0, quantityOut: 0.0, balanceAfter: 160.0, uom: 'kg', unitRate: 45.0, referenceDoc: 'GRN-2026-001', actor: 'S. Murugan', timestamp: '2026-11-21 08:30' },
  { id: '2', transactionRef: 'TXN-002', itemCode: 'RM-FLOUR', itemName: 'Rice Flour (Grade A)', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 40.0, balanceAfter: 120.0, uom: 'kg', unitRate: 43.125, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 09:15' },
  { id: '3', transactionRef: 'TXN-003', itemCode: 'RM-OIL', itemName: 'Refined Groundnut Oil', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 10.5, balanceAfter: 19.5, uom: 'L', unitRate: 140.0, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 09:20' },
  { id: '4', transactionRef: 'TXN-004', itemCode: 'RM-SPICE', itemName: 'Special Spice Mix', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 1.2, balanceAfter: 3.8, uom: 'kg', unitRate: 200.0, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 09:25' },
  { id: '5', transactionRef: 'TXN-005', itemCode: 'PM-POUCH', itemName: 'Printed Pouches (200g)', movementType: 'SCRAP_DAMAGE', quantityIn: 0.0, quantityOut: 6.0, balanceAfter: 494.0, uom: 'pcs', unitRate: 2.50, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 12:00' },
  { id: '6', transactionRef: 'TXN-006', itemCode: 'PM-POUCH', itemName: 'Printed Pouches (200g)', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 188.0, balanceAfter: 306.0, uom: 'pcs', unitRate: 2.50, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 13:00' },
  { id: '7', transactionRef: 'TXN-007', itemCode: 'PM-CARTON', itemName: 'Shipping Cartons (20-Pack)', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 9.0, balanceAfter: 21.0, uom: 'pcs', unitRate: 15.0, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 13:15' },
  { id: '8', transactionRef: 'TXN-008', itemCode: 'MUR-200G', itemName: 'South Indian Murukku 200g', movementType: 'PROD_YIELD', quantityIn: 188.0, quantityOut: 0.0, balanceAfter: 238.0, uom: 'pkts', unitRate: 31.1436, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 13:30' },
  { id: '9', transactionRef: 'TXN-009', itemCode: 'MUR-200G', itemName: 'South Indian Murukku 200g', movementType: 'SALES_DISPATCH', quantityIn: 0.0, quantityOut: 150.0, balanceAfter: 88.0, uom: 'pkts', unitRate: 31.1436, referenceDoc: 'DSP-2026-001', actor: 'S Ramanan', timestamp: '2026-11-21 14:30' },
];

export const openingMaterials = [
  { id: 'mat-01', code: 'RM-FLOUR', name: 'Rice Flour (Grade A)', category: 'RAW' as const, uom: 'kg', openingStock: 100, currentStock: 100, currentWeightedRate: 42.0, minReorderQty: 25 },
  { id: 'mat-02', code: 'RM-OIL', name: 'Refined Groundnut Oil', category: 'RAW' as const, uom: 'L', openingStock: 30, currentStock: 30, currentWeightedRate: 140.0, minReorderQty: 10 },
  { id: 'mat-03', code: 'RM-SPICE', name: 'Murukku Special Spice Mix', category: 'RAW' as const, uom: 'kg', openingStock: 5, currentStock: 5, currentWeightedRate: 200.0, minReorderQty: 2 },
  { id: 'mat-04', code: 'PM-POUCH', name: 'Printed Nitrogen Pouches (200g)', category: 'PACKAGING' as const, uom: 'pcs', openingStock: 500, currentStock: 500, currentWeightedRate: 2.50, minReorderQty: 100 },
  { id: 'mat-05', code: 'PM-CARTON', name: 'Corrugated Shipping Cartons (20-Pack)', category: 'PACKAGING' as const, uom: 'pcs', openingStock: 30, currentStock: 30, currentWeightedRate: 15.0, minReorderQty: 10 },
];

export const openingProducts = [
  {
    id: 'prod-01',
    sku: 'MUR-200G',
    name: 'South Indian Murukku 200g',
    hsnCode: '1905',
    uom: 'packet',
    unitWeightGrams: 200,
    sellingPrice: 50.0,
    gstRate: 5.0,
    openingStock: 50,
    currentStock: 50,
  },
];
