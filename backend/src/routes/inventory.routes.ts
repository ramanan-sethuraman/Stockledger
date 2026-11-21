import { Router, Request, Response } from 'express';

export const inventoryRouter = Router();

const stockLedgerStore = [
  { id: '1', transactionRef: 'TXN-001', itemType: 'MATERIAL', itemCode: 'RM-FLOUR', itemName: 'Rice Flour (Grade A)', movementType: 'PURCHASE_GRN', quantityIn: 60.0, quantityOut: 0.0, balanceAfter: 160.0, uom: 'kg', unitRate: 45.0, referenceDoc: 'GRN-2026-001', actor: 'S. Murugan', timestamp: '2026-11-21T08:30:00Z' },
  { id: '2', transactionRef: 'TXN-002', itemType: 'MATERIAL', itemCode: 'RM-FLOUR', itemName: 'Rice Flour (Grade A)', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 40.0, balanceAfter: 120.0, uom: 'kg', unitRate: 43.125, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21T09:15:00Z' },
  { id: '3', transactionRef: 'TXN-003', itemType: 'MATERIAL', itemCode: 'RM-OIL', itemName: 'Refined Groundnut Oil', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 10.5, balanceAfter: 19.5, uom: 'L', unitRate: 140.0, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21T09:20:00Z' },
  { id: '4', transactionRef: 'TXN-004', itemType: 'MATERIAL', itemCode: 'RM-SPICE', itemName: 'Special Spice Mix', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 1.2, balanceAfter: 3.8, uom: 'kg', unitRate: 200.0, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21T09:25:00Z' },
  { id: '5', transactionRef: 'TXN-005', itemType: 'MATERIAL', itemCode: 'PM-POUCH', itemName: 'Printed Pouches (200g)', movementType: 'SCRAP_DAMAGE', quantityIn: 0.0, quantityOut: 6.0, balanceAfter: 494.0, uom: 'pcs', unitRate: 2.50, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21T12:00:00Z' },
  { id: '6', transactionRef: 'TXN-006', itemType: 'MATERIAL', itemCode: 'PM-POUCH', itemName: 'Printed Pouches (200g)', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 188.0, balanceAfter: 306.0, uom: 'pcs', unitRate: 2.50, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21T13:00:00Z' },
  { id: '7', transactionRef: 'TXN-007', itemType: 'MATERIAL', itemCode: 'PM-CARTON', itemName: 'Shipping Cartons (20-Pack)', movementType: 'PROD_ISSUE', quantityIn: 0.0, quantityOut: 9.0, balanceAfter: 21.0, uom: 'pcs', unitRate: 15.0, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21T13:15:00Z' },
  { id: '8', transactionRef: 'TXN-008', itemType: 'PRODUCT', itemCode: 'MUR-200G', itemName: 'South Indian Murukku 200g', movementType: 'PROD_YIELD', quantityIn: 188.0, quantityOut: 0.0, balanceAfter: 238.0, uom: 'pkts', unitRate: 31.1436, referenceDoc: 'BAT-MK-001', actor: 'K. Senthil', timestamp: '2026-11-21T13:30:00Z' },
  { id: '9', transactionRef: 'TXN-009', itemType: 'PRODUCT', itemCode: 'MUR-200G', itemName: 'South Indian Murukku 200g', movementType: 'SALES_DISPATCH', quantityIn: 0.0, quantityOut: 150.0, balanceAfter: 88.0, uom: 'pkts', unitRate: 31.1436, referenceDoc: 'DSP-2026-001', actor: 'Dr. R. Ramanan', timestamp: '2026-11-21T14:30:00Z' },
];

inventoryRouter.get('/ledger', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: stockLedgerStore,
    meta: { totalRecords: stockLedgerStore.length },
  });
});
