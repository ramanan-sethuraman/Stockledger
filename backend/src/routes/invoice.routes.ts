import { Router, Request, Response } from 'express';

export const invoiceRouter = Router();

export let invoicesStore = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV/2026-27/0001',
    orderNumber: 'SO/2026-27/001',
    customerName: 'Cauvery Wholesale Confectioneries Pvt Ltd',
    customerGstin: '33AABCT1332M1ZG',
    placeOfSupply: 'Tamil Nadu (33)',
    productDescription: 'South Indian Murukku 200g Packets',
    hsnCode: '1905',
    quantity: 150,
    unitPrice: 50.0,
    taxableValue: 7500.0,
    isInterState: false,
    cgstRate: 2.5,
    cgstAmount: 187.50,
    sgstRate: 2.5,
    sgstAmount: 187.50,
    igstRate: 0.0,
    igstAmount: 0.0,
    totalInvoiceAmount: 7875.0,
    paidAmount: 4000.0,
    balanceAmount: 3875.0,
    status: 'PARTIALLY_PAID',
    invoiceDate: '2026-11-21T11:00:00Z',
  },
];

invoiceRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: invoicesStore });
});

invoiceRouter.get('/:id', (req: Request, res: Response) => {
  const invoice = invoicesStore.find((i) => i.id === req.params.id || i.invoiceNumber === req.params.id);
  if (!invoice) {
    return res.status(404).json({ success: false, error: { message: 'Invoice not found' } });
  }
  res.json({ success: true, data: invoice });
});

invoiceRouter.post('/', (req: Request, res: Response) => {
  const { orderNumber, customerName, quantity, unitPrice, isInterState } = req.body;

  const qty = Number(quantity) || 150;
  const price = Number(unitPrice) || 50.0;
  const taxable = qty * price;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isInterState) {
    igst = taxable * 0.05;
  } else {
    cgst = taxable * 0.025;
    sgst = taxable * 0.025;
  }

  const total = taxable + cgst + sgst + igst;

  const newInvoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV/2026-27/${String(invoicesStore.length + 1).padStart(4, '0')}`,
    orderNumber: orderNumber || `SO/2026-27/${String(invoicesStore.length + 1).padStart(3, '0')}`,
    customerName: customerName || 'Cauvery Wholesale Confectioneries Pvt Ltd',
    customerGstin: '33AABCT1332M1ZG',
    placeOfSupply: isInterState ? 'Inter-State' : 'Tamil Nadu (33)',
    productDescription: 'South Indian Murukku 200g Packets',
    hsnCode: '1905',
    quantity: qty,
    unitPrice: price,
    taxableValue: taxable,
    isInterState: Boolean(isInterState),
    cgstRate: isInterState ? 0 : 2.5,
    cgstAmount: cgst,
    sgstRate: isInterState ? 0 : 2.5,
    sgstAmount: sgst,
    igstRate: isInterState ? 5.0 : 0,
    igstAmount: igst,
    totalInvoiceAmount: total,
    paidAmount: 0.0,
    balanceAmount: total,
    status: 'POSTED',
    invoiceDate: new Date().toISOString(),
  };

  invoicesStore.unshift(newInvoice);

  res.status(201).json({
    success: true,
    data: newInvoice,
    message: `Tax Invoice ${newInvoice.invoiceNumber} posted successfully`,
  });
});

invoiceRouter.post('/:id/payment', (req: Request, res: Response) => {
  const invoice = invoicesStore.find((i) => i.id === req.params.id || i.invoiceNumber === req.params.id);
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
