import { Router, Request, Response } from 'express';
import { erpState } from '../store/erpState.js';

export const invoiceRouter = Router();

invoiceRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: erpState.invoices });
});

invoiceRouter.get('/:id', (req: Request, res: Response) => {
  const invoice = erpState.invoices.find((i) => i.id === req.params.id || i.invoiceNumber === req.params.id);
  if (!invoice) {
    return res.status(404).json({ success: false, error: { message: 'Invoice not found' } });
  }
  res.json({ success: true, data: invoice });
});

invoiceRouter.post('/:id/payment', (req: Request, res: Response) => {
  const invoice = erpState.invoices.find((i) => i.id === req.params.id || i.invoiceNumber === req.params.id);
  if (!invoice) {
    return res.status(404).json({ success: false, error: { message: 'Invoice not found' } });
  }

  const { paymentAmount } = req.body;
  const amount = Number(paymentAmount);

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: { message: 'Valid payment amount required' } });
  }

  invoice.paidAmount = Math.min(invoice.totalInvoiceAmount, invoice.paidAmount + amount);
  invoice.balanceAmount = Math.max(0, invoice.totalInvoiceAmount - invoice.paidAmount);
  invoice.status = invoice.balanceAmount === 0 ? 'PAID' : 'PARTIALLY_PAID';

  res.json({
    success: true,
    data: invoice,
    message: `Payment of ₹${amount.toFixed(2)} recorded. Outstanding balance: ₹${invoice.balanceAmount.toFixed(2)}`,
  });
});
