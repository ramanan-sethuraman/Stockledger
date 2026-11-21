import Decimal from 'decimal.js';

export interface MaterialItem {
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

export interface ProductItem {
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

export interface StockLedgerEntry {
  id: string;
  transactionRef: string;
  itemType: 'MATERIAL' | 'PRODUCT';
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

export interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerGstin: string;
  salesman: string;
  productSku: string;
  orderedQty: number;
  dispatchedQty: number;
  availableStock: number;
  shortageQty: number;
  unitPrice: number;
  taxableAmount: number;
  taxAmount: number;
  totalOrderValue: number;
  status: 'SUBMITTED' | 'APPROVED' | 'DISPATCHED' | 'SHORTAGE_EXCEPTION' | 'CANCELLED';
  notes: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  customerName: string;
  customerGstin: string;
  placeOfSupply: string;
  productDescription: string;
  hsnCode: string;
  quantity: number;
  unitPrice: number;
  taxableValue: number;
  isInterState: boolean;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalInvoiceAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: 'DRAFT' | 'POSTED' | 'PARTIALLY_PAID' | 'PAID';
  invoiceDate: string;
}

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  productSku: string;
  productName: string;
  status: 'COMPLETED';
  plannedYield: number;
  goodOutput: number;
  damagedOutput: number;
  scrapPouches: number;
  yieldVariancePercent: number;
  materialIssues: Array<{
    material: string;
    standardQty: number;
    actualQty: number;
    uom: string;
    variance: number;
  }>;
  costing: {
    rawMaterialCost: number;
    packagingCost: number;
    directLabourCost: number;
    directOverheadCost: number;
    totalBatchCost: number;
    costPerGoodPacket: number;
    sellingPrice: number;
    grossMarginPerPacket: number;
    grossMarginPercent: number;
  };
  startedAt: string;
  completedAt: string;
  supervisor: string;
}

class ErpStateManager {
  public materials: MaterialItem[] = [];
  public products: ProductItem[] = [];
  public stockLedger: StockLedgerEntry[] = [];
  public salesOrders: SalesOrder[] = [];
  public invoices: Invoice[] = [];
  public batches: ProductionBatch[] = [];

  constructor() {
    this.initializeState();
  }

  public initializeState() {
    this.materials = [
      { id: 'mat-01', code: 'RM-FLOUR', name: 'Rice Flour (Grade A)', category: 'RAW', uom: 'kg', openingStock: 100, currentStock: 120, currentWeightedRate: 43.125, minReorderQty: 25 },
      { id: 'mat-02', code: 'RM-OIL', name: 'Refined Groundnut Oil', category: 'RAW', uom: 'L', openingStock: 30, currentStock: 19.5, currentWeightedRate: 140.0, minReorderQty: 10 },
      { id: 'mat-03', code: 'RM-SPICE', name: 'Murukku Special Spice Mix', category: 'RAW', uom: 'kg', openingStock: 5, currentStock: 3.8, currentWeightedRate: 200.0, minReorderQty: 2 },
      { id: 'mat-04', code: 'PM-POUCH', name: 'Printed Nitrogen Pouches (200g)', category: 'PACKAGING', uom: 'pcs', openingStock: 500, currentStock: 306, currentWeightedRate: 2.50, minReorderQty: 100 },
      { id: 'mat-05', code: 'PM-CARTON', name: 'Corrugated Shipping Cartons (20-Pack)', category: 'PACKAGING', uom: 'pcs', openingStock: 30, currentStock: 21, currentWeightedRate: 15.0, minReorderQty: 10 },
    ];

    this.products = [
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
        currentStock: 88, // 50 opening + 188 produced - 150 dispatched
      },
    ];

    this.stockLedger = [
      { id: '1', transactionRef: 'TXN-001', itemType: 'MATERIAL', itemCode: 'RM-FLOUR', itemName: 'Rice Flour (Grade A)', movementType: 'PURCHASE_GRN', quantityIn: 60.0, quantityOut: 0.0, balanceAfter: 160.0, uom: 'kg', unitRate: 45.0, referenceDoc: 'GRN-2026-001', actor: 'S. Murugan', timestamp: '2026-11-21 08:30' },
      { id: '2', transactionRef: 'TXN-002', itemType: 'MATERIAL', itemCode: 'RM-FLOUR', itemName: 'Rice Flour (Grade A)', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 40.0, balanceAfter: 120.0, uom: 'kg', unitRate: 43.125, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 09:15' },
      { id: '3', transactionRef: 'TXN-003', itemType: 'MATERIAL', itemCode: 'RM-OIL', itemName: 'Refined Groundnut Oil', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 10.5, balanceAfter: 19.5, uom: 'L', unitRate: 140.0, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 09:20' },
      { id: '4', transactionRef: 'TXN-004', itemType: 'MATERIAL', itemCode: 'RM-SPICE', itemName: 'Special Spice Mix', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 1.2, balanceAfter: 3.8, uom: 'kg', unitRate: 200.0, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 09:25' },
      { id: '5', transactionRef: 'TXN-005', itemType: 'MATERIAL', itemCode: 'PM-POUCH', itemName: 'Printed Pouches (200g)', movementType: 'SCRAP_DAMAGE', quantityIn: 0.0, quantityOut: 6.0, balanceAfter: 494.0, uom: 'pcs', unitRate: 2.50, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 12:00' },
      { id: '6', transactionRef: 'TXN-006', itemType: 'MATERIAL', itemCode: 'PM-POUCH', itemName: 'Printed Pouches (200g)', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 188.0, balanceAfter: 306.0, uom: 'pcs', unitRate: 2.50, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 13:00' },
      { id: '7', transactionRef: 'TXN-007', itemType: 'MATERIAL', itemCode: 'PM-CARTON', itemName: 'Shipping Cartons (20-Pack)', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 9.0, balanceAfter: 21.0, uom: 'pcs', unitRate: 15.0, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 13:15' },
      { id: '8', transactionRef: 'TXN-008', itemType: 'PRODUCT', itemCode: 'MUR-200G', itemName: 'South Indian Murukku 200g', movementType: 'PROD_YIELD', quantityIn: 188.0, quantityOut: 0.0, balanceAfter: 238.0, uom: 'pkts', unitRate: 31.1436, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21 13:30' },
      { id: '9', transactionRef: 'TXN-009', itemType: 'PRODUCT', itemCode: 'MUR-200G', itemName: 'South Indian Murukku 200g', movementType: 'SALES_DISPATCH', quantityIn: 0.0, quantityOut: 150.0, balanceAfter: 88.0, uom: 'pkts', unitRate: 31.1436, referenceDoc: 'DSP-2026-001', actor: 'Dr. R. Ramanan', timestamp: '2026-11-21 14:30' },
    ];

    this.salesOrders = [
      {
        id: 'so-001',
        orderNumber: 'SO/2026-27/001',
        customerName: 'Cauvery Wholesale Confectioneries Pvt Ltd',
        customerGstin: '33AABCT1332M1ZG',
        salesman: 'M. Anand (Salesman A)',
        productSku: 'MUR-200G',
        orderedQty: 150,
        dispatchedQty: 150,
        availableStock: 238,
        shortageQty: 0,
        unitPrice: 50.0,
        taxableAmount: 7500.0,
        taxAmount: 375.0,
        totalOrderValue: 7875.0,
        status: 'DISPATCHED',
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
        availableStock: 88,
        shortageQty: 32,
        unitPrice: 50.0,
        taxableAmount: 6000.0,
        taxAmount: 300.0,
        totalOrderValue: 6300.0,
        status: 'SHORTAGE_EXCEPTION',
        notes: 'Order blocked: Shortage of 32 packets. Available stock is 88 packets.',
        createdAt: '2026-11-21 11:45',
      },
    ];

    this.invoices = [
      {
        id: 'inv-001',
        invoiceNumber: 'INV/2026-27/0001',
        orderNumber: 'SO/2026-27/001',
        customerName: 'Cauvery Wholesale Confectioneries Pvt Ltd',
        customerGstin: '33AABCT1332M1ZG',
        placeOfSupply: 'Tamil Nadu (33)',
        productDescription: 'South Indian Murukku 200g Packets',
        hsnCode: '1905',
        quantity: 150,
        unitPrice: 50.0,
        taxableValue: 7500.0,
        isInterState: false,
        cgstRate: 2.5,
        cgstAmount: 187.50,
        sgstRate: 2.5,
        sgstAmount: 187.50,
        igstRate: 0.0,
        igstAmount: 0.0,
        totalInvoiceAmount: 7875.0,
        paidAmount: 4000.0,
        balanceAmount: 3875.0,
        status: 'PARTIALLY_PAID',
        invoiceDate: '2026-11-21',
      },
    ];

    this.batches = [
      {
        id: 'batch-001',
        batchNumber: 'BAT-MK-001',
        productSku: 'MUR-200G',
        productName: 'South Indian Murukku 200g',
        status: 'COMPLETED',
        plannedYield: 200,
        goodOutput: 188,
        damagedOutput: 0,
        scrapPouches: 6,
        yieldVariancePercent: -6.0,
        materialIssues: [
          { material: 'Rice Flour', standardQty: 40.0, actualQty: 40.0, uom: 'kg', variance: 0 },
          { material: 'Groundnut Oil', standardQty: 10.0, actualQty: 10.5, uom: 'L', variance: 5.0 },
          { material: 'Spice Mix', standardQty: 1.2, actualQty: 1.2, uom: 'kg', variance: 0 },
          { material: 'Printed Pouches', standardQty: 200, actualQty: 194, uom: 'pcs', variance: -3.0 },
          { material: 'Shipping Cartons', standardQty: 10, actualQty: 9, uom: 'pcs', variance: -10.0 },
        ],
        costing: {
          rawMaterialCost: 3435.0,
          packagingCost: 620.0,
          directLabourCost: 1200.0,
          directOverheadCost: 600.0,
          totalBatchCost: 5855.0,
          costPerGoodPacket: 31.1436,
          sellingPrice: 50.0,
          grossMarginPerPacket: 18.8564,
          grossMarginPercent: 37.71,
        },
        startedAt: '2026-11-21 09:00',
        completedAt: '2026-11-21 13:30',
        supervisor: 'K. Senthil',
      },
    ];
  }

  public resetToOpeningState() {
    this.materials = [
      { id: 'mat-01', code: 'RM-FLOUR', name: 'Rice Flour (Grade A)', category: 'RAW', uom: 'kg', openingStock: 100, currentStock: 100, currentWeightedRate: 42.0, minReorderQty: 25 },
      { id: 'mat-02', code: 'RM-OIL', name: 'Refined Groundnut Oil', category: 'RAW', uom: 'L', openingStock: 30, currentStock: 30, currentWeightedRate: 140.0, minReorderQty: 10 },
      { id: 'mat-03', code: 'RM-SPICE', name: 'Murukku Special Spice Mix', category: 'RAW', uom: 'kg', openingStock: 5, currentStock: 5, currentWeightedRate: 200.0, minReorderQty: 2 },
      { id: 'mat-04', code: 'PM-POUCH', name: 'Printed Nitrogen Pouches (200g)', category: 'PACKAGING', uom: 'pcs', openingStock: 500, currentStock: 500, currentWeightedRate: 2.50, minReorderQty: 100 },
      { id: 'mat-05', code: 'PM-CARTON', name: 'Corrugated Shipping Cartons (20-Pack)', category: 'PACKAGING', uom: 'pcs', openingStock: 30, currentStock: 30, currentWeightedRate: 15.0, minReorderQty: 10 },
    ];

    this.products = [
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

    this.stockLedger = [
      { id: '1', transactionRef: 'TXN-OP-001', itemType: 'MATERIAL', itemCode: 'RM-FLOUR', itemName: 'Rice Flour (Grade A)', movementType: 'OPENING_BALANCE', quantityIn: 100.0, quantityOut: 0.0, balanceAfter: 100.0, uom: 'kg', unitRate: 42.0, referenceDoc: 'SYS-OPENING', actor: 'System', timestamp: '2026-11-21 00:00' },
      { id: '2', transactionRef: 'TXN-OP-002', itemType: 'MATERIAL', itemCode: 'RM-OIL', itemName: 'Refined Groundnut Oil', movementType: 'OPENING_BALANCE', quantityIn: 30.0, quantityOut: 0.0, balanceAfter: 30.0, uom: 'L', unitRate: 140.0, referenceDoc: 'SYS-OPENING', actor: 'System', timestamp: '2026-11-21 00:00' },
      { id: '3', transactionRef: 'TXN-OP-003', itemType: 'MATERIAL', itemCode: 'RM-SPICE', itemName: 'Murukku Special Spice Mix', movementType: 'OPENING_BALANCE', quantityIn: 5.0, quantityOut: 0.0, balanceAfter: 5.0, uom: 'kg', unitRate: 200.0, referenceDoc: 'SYS-OPENING', actor: 'System', timestamp: '2026-11-21 00:00' },
      { id: '4', transactionRef: 'TXN-OP-004', itemType: 'MATERIAL', itemCode: 'PM-POUCH', itemName: 'Printed Nitrogen Pouches (200g)', movementType: 'OPENING_BALANCE', quantityIn: 500.0, quantityOut: 0.0, balanceAfter: 500.0, uom: 'pcs', unitRate: 2.50, referenceDoc: 'SYS-OPENING', actor: 'System', timestamp: '2026-11-21 00:00' },
      { id: '5', transactionRef: 'TXN-OP-005', itemType: 'MATERIAL', itemCode: 'PM-CARTON', itemName: 'Corrugated Shipping Cartons (20-Pack)', movementType: 'OPENING_BALANCE', quantityIn: 30.0, quantityOut: 0.0, balanceAfter: 30.0, uom: 'pcs', unitRate: 15.0, referenceDoc: 'SYS-OPENING', actor: 'System', timestamp: '2026-11-21 00:00' },
      { id: '6', transactionRef: 'TXN-OP-006', itemType: 'PRODUCT', itemCode: 'MUR-200G', itemName: 'South Indian Murukku 200g', movementType: 'OPENING_BALANCE', quantityIn: 50.0, quantityOut: 0.0, balanceAfter: 50.0, uom: 'pkts', unitRate: 31.14, referenceDoc: 'SYS-OPENING', actor: 'System', timestamp: '2026-11-21 00:00' },
    ];

    this.salesOrders = [];
    this.invoices = [];
    this.batches = [];
  }

  public resetToBenchmarkState() {
    this.initializeState();
  }

  public resetToBlankState() {
    this.materials = [];
    this.products = [];
    this.stockLedger = [];
    this.salesOrders = [];
    this.invoices = [];
    this.batches = [];
  }

  public purchaseMaterial(
    materialCode: string,
    quantity: number,
    unitRate: number,
    supplierName?: string,
    invoiceRef?: string,
    actor?: string
  ) {
    const mat = this.materials.find(m => m.code === materialCode);
    if (!mat) throw new Error(`Material with code ${materialCode} not found`);

    const oldStock = mat.currentStock;
    const oldRate = mat.currentWeightedRate;
    const newStock = oldStock + quantity;

    // Weighted average cost formula
    const newWeightedRate =
      newStock > 0
        ? Math.round(((oldStock * oldRate + quantity * unitRate) / newStock) * 10000) / 10000
        : unitRate;

    mat.currentStock = newStock;
    mat.currentWeightedRate = newWeightedRate;

    const ledgerEntry = this.appendStockMovement(
      'MATERIAL',
      mat.code,
      mat.name,
      'PURCHASE_GRN',
      quantity,
      0,
      newStock,
      mat.uom,
      unitRate,
      invoiceRef || `GRN-${Date.now().toString().slice(-4)}`,
      actor || 'Store Inward Manager'
    );

    return { material: mat, ledgerEntry };
  }

  // Double-Entry Ledger appender
  public appendStockMovement(
    itemType: 'MATERIAL' | 'PRODUCT',
    itemCode: string,
    itemName: string,
    movementType: string,
    quantityIn: number,
    quantityOut: number,
    balanceAfter: number,
    uom: string,
    unitRate: number,
    referenceDoc: string,
    actor: string
  ): StockLedgerEntry {
    const entry: StockLedgerEntry = {
      id: String(this.stockLedger.length + 1),
      transactionRef: `TXN-${String(this.stockLedger.length + 1).padStart(3, '0')}`,
      itemType,
      itemCode,
      itemName,
      movementType,
      quantityIn,
      quantityOut,
      balanceAfter,
      uom,
      unitRate,
      referenceDoc,
      actor,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    this.stockLedger.unshift(entry);
    return entry;
  }
}

export const erpState = new ErpStateManager();
