import { Router, Request, Response } from 'express';
import { erpState } from '../store/erpState.js';

export const productionRouter = Router();

productionRouter.get('/batches', (req: Request, res: Response) => {
  res.json({ success: true, data: erpState.batches });
});

productionRouter.get('/batches/:id', (req: Request, res: Response) => {
  const batch = erpState.batches.find((b) => b.id === req.params.id || b.batchNumber === req.params.id);
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

  // Update Raw & Packaging Material Balances
  const flourItem = erpState.materials.find(m => m.code === 'RM-FLOUR');
  if (flourItem) flourItem.currentStock = Math.max(0, flourItem.currentStock - flour);

  const oilItem = erpState.materials.find(m => m.code === 'RM-OIL');
  if (oilItem) oilItem.currentStock = Math.max(0, oilItem.currentStock - oil);

  const spiceItem = erpState.materials.find(m => m.code === 'RM-SPICE');
  if (spiceItem) spiceItem.currentStock = Math.max(0, spiceItem.currentStock - 1.2);

  const pouchItem = erpState.materials.find(m => m.code === 'PM-POUCH');
  if (pouchItem) pouchItem.currentStock = Math.max(0, pouchItem.currentStock - (good + scrap));

  const cartonItem = erpState.materials.find(m => m.code === 'PM-CARTON');
  if (cartonItem) cartonItem.currentStock = Math.max(0, cartonItem.currentStock - 9);

  // Update Finished Goods Product Stock
  const fgProduct = erpState.products.find(p => p.sku === 'MUR-200G');
  if (fgProduct) fgProduct.currentStock += good;

  // Costing calculations
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
    batchNumber: `BAT-MK-${String(erpState.batches.length + 1).padStart(3, '0')}`,
    productSku: 'MUR-200G',
    productName: 'South Indian Murukku 200g',
    status: 'COMPLETED' as const,
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
    startedAt: new Date(Date.now() - 4 * 3600000).toISOString().replace('T', ' ').substring(0, 16),
    completedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    supervisor: supervisor || 'Production Supervisor',
  };

  erpState.batches.unshift(newBatch);

  // Append Raw & Packaging Material Issue Movements to Double-Entry Ledger
  erpState.appendStockMovement(
    'MATERIAL',
    'RM-FLOUR',
    'Rice Flour (Grade A)',
    'PROD_ISSUE',
    0,
    flour,
    flourItem ? flourItem.currentStock : 0,
    'kg',
    43.125,
    newBatch.batchNumber,
    supervisor || 'Supervisor'
  );

  erpState.appendStockMovement(
    'MATERIAL',
    'RM-OIL',
    'Refined Groundnut Oil',
    'PROD_ISSUE',
    0,
    oil,
    oilItem ? oilItem.currentStock : 0,
    'L',
    140.0,
    newBatch.batchNumber,
    supervisor || 'Supervisor'
  );

  erpState.appendStockMovement(
    'MATERIAL',
    'RM-SPICE',
    'Murukku Special Spice Mix',
    'PROD_ISSUE',
    0,
    1.2,
    spiceItem ? spiceItem.currentStock : 0,
    'kg',
    200.0,
    newBatch.batchNumber,
    supervisor || 'Supervisor'
  );

  if (scrap > 0) {
    erpState.appendStockMovement(
      'MATERIAL',
      'PM-POUCH',
      'Printed Nitrogen Pouches (200g)',
      'SCRAP_DAMAGE',
      0,
      scrap,
      pouchItem ? pouchItem.currentStock + good : 0,
      'pcs',
      2.50,
      newBatch.batchNumber,
      supervisor || 'Supervisor'
    );
  }

  erpState.appendStockMovement(
    'MATERIAL',
    'PM-POUCH',
    'Printed Nitrogen Pouches (200g)',
    'PROD_ISSUE',
    0,
    good,
    pouchItem ? pouchItem.currentStock : 0,
    'pcs',
    2.50,
    newBatch.batchNumber,
    supervisor || 'Supervisor'
  );

  erpState.appendStockMovement(
    'MATERIAL',
    'PM-CARTON',
    'Corrugated Shipping Cartons (20-Pack)',
    'PROD_ISSUE',
    0,
    9,
    cartonItem ? cartonItem.currentStock : 0,
    'pcs',
    15.0,
    newBatch.batchNumber,
    supervisor || 'Supervisor'
  );

  // Append Finished Goods Yield to Double-Entry Ledger
  erpState.appendStockMovement(
    'PRODUCT',
    'MUR-200G',
    'South Indian Murukku 200g',
    'PROD_YIELD',
    good,
    0,
    fgProduct ? fgProduct.currentStock : good,
    'pkts',
    unitCost,
    newBatch.batchNumber,
    supervisor || 'Supervisor'
  );

  res.status(201).json({
    success: true,
    data: newBatch,
    message: `Batch ${newBatch.batchNumber} completed. Good output: ${good} units, Unit cost: ₹${newBatch.costing.costPerGoodPacket.toFixed(2)}`,
  });
});
