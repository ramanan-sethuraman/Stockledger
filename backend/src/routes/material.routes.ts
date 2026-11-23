import { Router, Request, Response } from 'express';
import { erpState } from '../store/erpState.js';

export const materialRouter = Router();

materialRouter.get('/', (req: Request, res: Response) => {
  const totalValuation = erpState.materials.reduce(
    (acc, m) => acc + m.currentStock * m.currentWeightedRate,
    0
  );

  res.json({
    success: true,
    data: erpState.materials,
    meta: {
      totalCount: erpState.materials.length,
      totalValuation: Math.round(totalValuation * 100) / 100,
    },
  });
});

// CSV Export for Materials and Inventory Valuation
materialRouter.get('/export-csv', (req: Request, res: Response) => {
  const headers = 'Code,Name,Category,StockOnHand,UOM,WeightedRate,TotalValuation,MinReorderQty';
  const rows = erpState.materials.map(m =>
    `"${m.code}","${m.name}","${m.category}",${m.currentStock},"${m.uom}",${m.currentWeightedRate},${(m.currentStock * m.currentWeightedRate).toFixed(2)},${m.minReorderQty}`
  );
  const csv = [headers, ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="stockledger_materials_inventory.csv"');
  res.send(csv);
});

materialRouter.get('/:id', (req: Request, res: Response) => {
  const material = erpState.materials.find((m) => m.id === req.params.id || m.code === req.params.id);
  if (!material) {
    return res.status(404).json({ success: false, error: { message: 'Material not found' } });
  }
  res.json({ success: true, data: material });
});

// Record Purchase Inward (GRN) with Weighted-Average Rate Update
materialRouter.post('/purchase', (req: Request, res: Response) => {
  const { materialCode, quantity, unitRate, supplierName, invoiceRef, actor } = req.body;

  if (!materialCode || !quantity || Number(quantity) <= 0 || !unitRate || Number(unitRate) <= 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'Valid materialCode, quantity (> 0), and unitRate (> 0) are required' },
    });
  }

  try {
    const result = erpState.purchaseMaterial(
      materialCode,
      Number(quantity),
      Number(unitRate),
      supplierName,
      invoiceRef,
      actor
    );

    res.status(201).json({
      success: true,
      data: result,
      message: `Successfully received ${quantity} units of ${result.material.name} at ₹${Number(unitRate).toFixed(2)}/unit. New weighted average rate: ₹${result.material.currentWeightedRate.toFixed(4)}`,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, error: { message: error.message } });
  }
});

// Add new custom material
materialRouter.post('/', (req: Request, res: Response) => {
  const { code, name, category, uom, openingStock, currentWeightedRate, minReorderQty } = req.body;

  if (!code || !name || !category || !uom) {
    return res.status(400).json({ success: false, error: { message: 'Code, name, category, and uom required' } });
  }

  const existing = erpState.materials.find(m => m.code === code);
  if (existing) {
    return res.status(400).json({ success: false, error: { message: `Material code ${code} already exists` } });
  }

  const stock = Number(openingStock) || 0;
  const rate = Number(currentWeightedRate) || 0;

  const newMat = {
    id: `mat-${Date.now()}`,
    code: code.trim().toUpperCase(),
    name: name.trim(),
    category: category === 'PACKAGING' ? 'PACKAGING' as const : 'RAW' as const,
    uom: uom.trim(),
    openingStock: stock,
    currentStock: stock,
    currentWeightedRate: rate,
    minReorderQty: Number(minReorderQty) || 10,
  };

  erpState.materials.push(newMat);

  if (stock > 0) {
    erpState.appendStockMovement(
      'MATERIAL',
      newMat.code,
      newMat.name,
      'OPENING_BALANCE',
      stock,
      0,
      stock,
      newMat.uom,
      rate,
      'SYS-MANUAL',
      'Inventory Manager'
    );
  }

  res.status(201).json({ success: true, data: newMat, message: 'Material created successfully' });
});
