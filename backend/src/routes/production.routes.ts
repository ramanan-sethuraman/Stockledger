import { Router, Request, Response } from 'express';

export const productionRouter = Router();

export let batchesStore = [
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

productionRouter.post('/batches', (req: Request, res: Response) => {
  const { plannedYield, goodOutput, flourIssued, oilIssued, scrapPouches, supervisor } = req.body;

  const planned = Number(plannedYield) || 200;
  const good = Number(goodOutput) || 188;
  const flour = Number(flourIssued) || 40.0;
  const oil = Number(oilIssued) || 10.5;
  const scrap = Number(scrapPouches) || 6;

  // Real-time variance calculations
  const yieldVariance = ((good - planned) / planned) * 100;
  const oilVariance = ((oil - 10.0) / 10.0) * 100;

  // Costing calculation: Flour + Oil + Spice + Pouches + Cartons + Labour + Overhead
  const flourCost = flour * 43.125;
  const oilCost = oil * 140.0;
  const spiceCost = 1.2 * 200.0;
  const pouchesCost = (good + scrap) * 2.50;
  const cartonsCost = 9 * 15.0;
  const materialCost = flourCost + oilCost + spiceCost + pouchesCost + cartonsCost;
  const labourCost = 1200.0;
  const overheadCost = 600.0;
  const totalCost = materialCost + labourCost + overheadCost;
  const unitCost = totalCost / good;
  const marginPerUnit = 50.0 - unitCost;
  const marginPercent = (marginPerUnit / 50.0) * 100;

  const newBatch = {
    id: `batch-${Date.now()}`,
    batchNumber: `BAT-MK-${String(batchesStore.length + 1).padStart(3, '0')}`,
    productSku: 'MUR-200G',
    productName: 'South Indian Murukku 200g',
    status: 'COMPLETED',
    plannedYield: planned,
    goodOutput: good,
    damagedOutput: 0,
    scrapPouches: scrap,
    yieldVariancePercent: Math.round(yieldVariance * 100) / 100,
    materialIssues: [
      { material: 'Rice Flour', standardQty: 40.0, actualQty: flour, uom: 'kg', variance: 0 },
      { material: 'Groundnut Oil', standardQty: 10.0, actualQty: oil, uom: 'L', variance: Math.round(oilVariance * 100) / 100 },
      { material: 'Spice Mix', standardQty: 1.2, actualQty: 1.2, uom: 'kg', variance: 0 },
      { material: 'Printed Pouches', standardQty: planned, actualQty: good + scrap, uom: 'pcs', variance: -3.0 },
      { material: 'Shipping Cartons', standardQty: 10, actualQty: 9, uom: 'pcs', variance: -10.0 },
    ],
    costing: {
      rawMaterialCost: Math.round((flourCost + oilCost + spiceCost) * 100) / 100,
      packagingCost: Math.round((pouchesCost + cartonsCost) * 100) / 100,
      directLabourCost: labourCost,
      directOverheadCost: overheadCost,
      totalBatchCost: Math.round(totalCost * 100) / 100,
      costPerGoodPacket: Math.round(unitCost * 10000) / 10000,
      sellingPrice: 50.0,
      grossMarginPerPacket: Math.round(marginPerUnit * 10000) / 10000,
      grossMarginPercent: Math.round(marginPercent * 100) / 100,
    },
    startedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    completedAt: new Date().toISOString(),
    supervisor: supervisor || 'Production Supervisor',
  };

  batchesStore.unshift(newBatch);

  res.status(201).json({
    success: true,
    data: newBatch,
    message: `Batch ${newBatch.batchNumber} completed. Good output: ${good} units, Unit cost: ₹${newBatch.costing.costPerGoodPacket.toFixed(2)}`,
  });
});
