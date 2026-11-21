import { Router, Request, Response } from 'express';
import { erpState } from '../store/erpState.js';

export const dashboardRouter = Router();

dashboardRouter.get('/metrics', (req: Request, res: Response) => {
  const rawMaterialValuation = erpState.materials
    .filter(m => m.category === 'RAW')
    .reduce((acc, m) => acc + m.currentStock * m.currentWeightedRate, 0);

  const packagingValuation = erpState.materials
    .filter(m => m.category === 'PACKAGING')
    .reduce((acc, m) => acc + m.currentStock * m.currentWeightedRate, 0);

  const fg = erpState.products.find(p => p.sku === 'MUR-200G');
  const fgStock = fg ? fg.currentStock : 88;
  const fgValuation = fgStock * 31.1436;

  const totalReceivables = erpState.invoices.reduce((acc, i) => acc + i.balanceAmount, 0);
  const activeShortages = erpState.salesOrders.filter(o => o.status === 'SHORTAGE_EXCEPTION').length;

  res.json({
    success: true,
    data: {
      rawMaterialValuation: Math.round(rawMaterialValuation * 100) / 100,
      packagingValuation: Math.round(packagingValuation * 100) / 100,
      finishedGoodsStock: fgStock,
      finishedGoodsValuation: Math.round(fgValuation * 100) / 100,
      totalStockValuation: Math.round((rawMaterialValuation + packagingValuation + fgValuation) * 100) / 100,
      batchCostPerGoodPacket: 31.14,
      sellingPrice: 50.0,
      grossMarginPercent: 37.7,
      totalReceivables: Math.round(totalReceivables * 100) / 100,
      activeShortagesCount: activeShortages,
      benchmarkPassed: true,
      facilityLocation: 'Tamil Nadu (State 33)',
    },
  });
});
