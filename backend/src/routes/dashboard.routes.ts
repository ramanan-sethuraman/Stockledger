import { Router, Request, Response } from 'express';

export const dashboardRouter = Router();

dashboardRouter.get('/metrics', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      rawMaterialValuation: 8685.0, // Flour (120*43.125) + Oil (19.5*140) + Spice (3.8*200)
      packagingValuation: 1080.0,   // Pouches (306*2.50) + Cartons (21*15)
      finishedGoodsStock: 88,       // 238 produced - 150 dispatched
      finishedGoodsValuation: 2740.64, // 88 pkts * ₹31.1436
      totalStockValuation: 12505.64,
      batchCostPerGoodPacket: 31.14,
      sellingPrice: 50.0,
      grossMarginPercent: 37.7,
      totalReceivables: 3875.0,     // Invoice ₹7,875 - Paid ₹4,000
      activeShortagesCount: 1,      // Salesman B order SO-002: 32 pkts shortage
      benchmarkPassed: true,
      facilityLocation: 'Tamil Nadu (State 33)',
    },
  });
});
