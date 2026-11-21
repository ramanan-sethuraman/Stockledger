import { Router, Request, Response } from 'express';
import { erpState } from '../store/erpState.js';

export const inventoryRouter = Router();

inventoryRouter.get('/ledger', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: erpState.stockLedger,
    meta: { totalRecords: erpState.stockLedger.length },
  });
});
