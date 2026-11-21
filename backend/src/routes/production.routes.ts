import { Router, Request, Response } from 'express';

export const productionRouter = Router();

const batchesStore = [
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
      rawMaterialCost: 3435.0, // Flour (1725) + Oil (1470) + Spice (240)
      packagingCost: 620.0,    // Pouches (485) + Cartons (135)
      directLabourCost: 1200.0,
      directOverheadCost: 600.0,
      totalBatchCost: 5855.0,
      costPerGoodPacket: 31.1436,
      sellingPrice: 50.0,
      grossMarginPerPacket: 18.8564,
      grossMarginPercent: 37.71,
    },
    startedAt: '2026-11-21T09:00:00Z',
    completedAt: '2026-11-21T13:30:00Z',
    supervisor: 'K. Senthil',
  },
];

productionRouter.get('/batches', (req: Request, res: Response) => {
  res.json({ success: true, data: batchesStore });
});

productionRouter.get('/batches/:id', (req: Request, res: Response) => {
  const batch = batchesStore.find((b) => b.id === req.params.id || b.batchNumber === req.params.id);
  if (!batch) {
    return res.status(404).json({ success: false, error: { message: 'Batch not found' } });
  }
  res.json({ success: true, data: batch });
});
