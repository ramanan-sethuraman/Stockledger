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

// CSV Export for Double-Entry Stock Movement Ledger
inventoryRouter.get('/ledger/export-csv', (req: Request, res: Response) => {
  const headers = 'JournalRef,ItemName,MovementType,QuantityIn,QuantityOut,BalanceAfter,UOM,ReferenceDoc,Actor,Timestamp';
  const rows = erpState.stockLedger.map(l =>
    `"${l.transactionRef}","${l.itemName}","${l.movementType}",${l.quantityIn},${l.quantityOut},${l.balanceAfter},"${l.uom}","${l.referenceDoc}","${l.actor}","${l.timestamp}"`
  );
  const csv = [headers, ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="stockledger_double_entry_log.csv"');
  res.send(csv);
});
