import { Router, Request, Response } from 'express';
import { erpState } from '../store/erpState.js';

export const systemRouter = Router();

// Reset data to benchmark baseline (all 15 steps demonstrated)
systemRouter.post('/reset-benchmark', (req: Request, res: Response) => {
  erpState.resetToBenchmarkState();
  res.json({
    success: true,
    message: 'System data reset to completed standard benchmark dataset.',
  });
});

// Reset data to opening balances (ready for custom operations from scratch)
systemRouter.post('/reset-opening', (req: Request, res: Response) => {
  erpState.resetToOpeningState();
  res.json({
    success: true,
    message: 'System data reset to initial opening balances. You can now execute fresh purchases, batches, orders, and payments.',
  });
});

// Reset data to completely blank state
systemRouter.post('/reset-blank', (req: Request, res: Response) => {
  erpState.resetToBlankState();
  res.json({
    success: true,
    message: 'System wiped clean. Ready for new enterprise configuration.',
  });
});
