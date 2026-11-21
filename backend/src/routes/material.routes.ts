import { Router, Request, Response } from 'express';
import Decimal from 'decimal.js';

export const materialRouter = Router();

// Master Raw & Packaging Materials with benchmark state
let materialsStore = [
  { id: 'mat-01', code: 'RM-FLOUR', name: 'Rice Flour (Grade A)', category: 'RAW', uom: 'kg', openingStock: 100, currentStock: 120, currentWeightedRate: 43.125, minReorderQty: 25 },
  { id: 'mat-02', code: 'RM-OIL', name: 'Refined Groundnut Oil', category: 'RAW', uom: 'L', openingStock: 30, currentStock: 19.5, currentWeightedRate: 140.0, minReorderQty: 10 },
  { id: 'mat-03', code: 'RM-SPICE', name: 'Murukku Special Spice Mix', category: 'RAW', uom: 'kg', openingStock: 5, currentStock: 3.8, currentWeightedRate: 200.0, minReorderQty: 2 },
  { id: 'mat-04', code: 'PM-POUCH', name: 'Printed Nitrogen Pouches (200g)', category: 'PACKAGING', uom: 'pcs', openingStock: 500, currentStock: 306, currentWeightedRate: 2.50, minReorderQty: 100 },
  { id: 'mat-05', code: 'PM-CARTON', name: 'Corrugated Shipping Cartons (20-Pack)', category: 'PACKAGING', uom: 'pcs', openingStock: 30, currentStock: 21, currentWeightedRate: 15.0, minReorderQty: 10 },
];

materialRouter.get('/', (req: Request, res: Response) => {
  const totalValuation = materialsStore.reduce(
    (acc, m) => acc + m.currentStock * m.currentWeightedRate,
    0
  );

  res.json({
    success: true,
    data: materialsStore,
    meta: {
      totalCount: materialsStore.length,
      totalValuation: Math.round(totalValuation * 100) / 100,
    },
  });
});

materialRouter.get('/:id', (req: Request, res: Response) => {
  const material = materialsStore.find((m) => m.id === req.params.id || m.code === req.params.id);
  if (!material) {
    return res.status(404).json({ success: false, error: { message: 'Material not found' } });
  }
  res.json({ success: true, data: material });
});
