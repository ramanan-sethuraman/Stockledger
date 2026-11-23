import { Router, Request, Response } from 'express';
import { erpState } from '../store/erpState.js';

export const invoiceRouter = Router();

invoiceRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: erpState.invoices });
});

// CSV Export for GST Invoices
invoiceRouter.get('/export-csv', (req: Request, res: Response) => {
  const headers = 'InvoiceNumber,CustomerName,TaxableValue,CGST,SGST,IGST,TotalAmount,PaidAmount,BalanceAmount,Status,InvoiceDate';
  const rows = erpState.invoices.map(i =>
    `"${i.invoiceNumber}","${i.customerName}",${i.taxableValue},${i.cgstAmount},${i.sgstAmount},${i.igstAmount},${i.totalInvoiceAmount},${i.paidAmount},${i.balanceAmount},"${i.status}","${i.invoiceDate}"`
  );
  const csv = [headers, ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="stockledger_invoices.csv"');
  res.send(csv);
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
