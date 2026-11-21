import { Router, Request, Response } from 'express';

export const salesRouter = Router();

const salesOrdersStore = [
  {
    id: 'so-001',
    orderNumber: 'SO/2026-27/001',
    customerName: 'Trichy Wholesale Confectioneries Pvt Ltd',
    customerGstin: '33AABCT1332M1ZG',
    salesman: 'M. Anand (Salesman A)',
    productSku: 'MUR-200G',
    orderedQty: 150,
    dispatchedQty: 150,
    shortageQty: 0,
    unitPrice: 50.0,
    taxableAmount: 7500.0,
    taxAmount: 375.0, // CGST 187.50 + SGST 187.50
    totalOrderValue: 7875.0,
    status: 'DISPATCHED',
    createdAt: '2026-11-21T10:15:00Z',
  },
  {
    id: 'so-002',
    orderNumber: 'SO/2026-27/002',
    customerName: 'Madurai Snacking Hub',
    customerGstin: '33AAECM9921K1ZZ',
    salesman: 'V. Balaji (Salesman B)',
    productSku: 'MUR-200G',
    orderedQty: 120,
    dispatchedQty: 0,
    availableStock: 88,
    shortageQty: 32, // 120 requested - 88 available
    unitPrice: 50.0,
    taxableAmount: 6000.0,
    taxAmount: 300.0,
    totalOrderValue: 6300.0,
    status: 'SHORTAGE_EXCEPTION',
    notes: 'Order blocked: Shortage of 32 packets. Available stock is 88 packets.',
    createdAt: '2026-11-21T11:45:00Z',
  },
];

salesRouter.get('/orders', (req: Request, res: Response) => {
  res.json({ success: true, data: salesOrdersStore });
});

salesRouter.get('/orders/:id', (req: Request, res: Response) => {
  const order = salesOrdersStore.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: { message: 'Order not found' } });
  }
  res.json({ success: true, data: order });
});
