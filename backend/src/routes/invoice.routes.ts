import { Router, Request, Response } from 'express';

export const invoiceRouter = Router();

const invoicesStore = [
  {
    id: 'inv-001',
    invoiceNumber: 'INV/2026-27/0001',
    orderNumber: 'SO/2026-27/001',
    customerName: 'Trichy Wholesale Confectioneries Pvt Ltd',
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
    paidAmount: 4000.0, // Benchmark Step 12
    balanceAmount: 3875.0, // Benchmark Step 12 Outstanding
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
