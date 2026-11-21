import { Router, Request, Response } from 'express';
import { erpState } from '../store/erpState.js';

export const salesRouter = Router();

salesRouter.get('/orders', (req: Request, res: Response) => {
  res.json({ success: true, data: erpState.salesOrders });
});

salesRouter.get('/orders/:id', (req: Request, res: Response) => {
  const order = erpState.salesOrders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: { message: 'Order not found' } });
  }
  res.json({ success: true, data: order });
});

salesRouter.post('/orders', (req: Request, res: Response) => {
  const { customerName, productSku, orderedQty, unitPrice, salesman } = req.body;

  if (!customerName || !orderedQty || Number(orderedQty) <= 0) {
    return res.status(400).json({ success: false, error: { message: 'Valid customer name and ordered quantity required' } });
  }

  const qty = Number(orderedQty);
  const price = Number(unitPrice) || 50.0;
  const taxable = qty * price;
  const tax = taxable * 0.05; // 5% GST
  const total = taxable + tax;

  // Real-time stock availability check against actual Finished Goods stock
  const fg = erpState.products.find(p => p.sku === (productSku || 'MUR-200G'));
  const availableStock = fg ? fg.currentStock : 88;
  const isShortage = qty > availableStock;
  const shortageQty = isShortage ? qty - availableStock : 0;

  const newOrder = {
    id: `so-${Date.now()}`,
    orderNumber: `SO/2026-27/${String(erpState.salesOrders.length + 1).padStart(3, '0')}`,
    customerName,
    customerGstin: '33AABCT1332M1ZG',
    salesman: salesman || 'Active Salesman',
    productSku: productSku || 'MUR-200G',
    orderedQty: qty,
    dispatchedQty: 0,
    availableStock,
    shortageQty,
    unitPrice: price,
    taxableAmount: taxable,
    taxAmount: tax,
    totalOrderValue: total,
    status: isShortage ? ('SHORTAGE_EXCEPTION' as const) : ('SUBMITTED' as const),
    notes: isShortage ? `Insufficient stock! Requested ${qty}, available ${availableStock}. Shortage: ${shortageQty}` : 'Order submitted for Admin approval',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
  };

  erpState.salesOrders.unshift(newOrder);

  res.status(201).json({
    success: true,
    data: newOrder,
    message: isShortage ? `Order created with SHORTAGE EXCEPTION (${shortageQty} units)` : 'Sales order submitted successfully',
  });
});

salesRouter.post('/orders/:id/approve', (req: Request, res: Response) => {
  const order = erpState.salesOrders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, error: { message: 'Order not found' } });
  }

  if (order.status === 'SHORTAGE_EXCEPTION') {
    return res.status(400).json({ success: false, error: { message: 'Cannot approve order with unresolved shortage exception' } });
  }

  // Deduct Finished Goods Stock
  const fg = erpState.products.find(p => p.sku === order.productSku);
  if (fg) {
    fg.currentStock = Math.max(0, fg.currentStock - order.orderedQty);
  }

  order.status = 'DISPATCHED';
  order.dispatchedQty = order.orderedQty;

  // Generate GST Invoice
  const newInvoice = {
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV/2026-27/${String(erpState.invoices.length + 1).padStart(4, '0')}`,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerGstin: order.customerGstin,
    placeOfSupply: 'Tamil Nadu (33)',
    productDescription: 'South Indian Murukku 200g Packets',
    hsnCode: '1905',
    quantity: order.orderedQty,
    unitPrice: order.unitPrice,
    taxableValue: order.taxableAmount,
    isInterState: false,
    cgstRate: 2.5,
    cgstAmount: order.taxableAmount * 0.025,
    sgstRate: 2.5,
    sgstAmount: order.taxableAmount * 0.025,
    igstRate: 0.0,
    igstAmount: 0.0,
    totalInvoiceAmount: order.totalOrderValue,
    paidAmount: 0.0,
    balanceAmount: order.totalOrderValue,
    status: 'POSTED' as const,
    invoiceDate: new Date().toISOString().substring(0, 10),
  };

  erpState.invoices.unshift(newInvoice);

  // Append to Stock Ledger
  erpState.appendStockMovement(
    'PRODUCT',
    order.productSku,
    'South Indian Murukku 200g',
    'SALES_DISPATCH',
    0,
    order.orderedQty,
    fg ? fg.currentStock : 0,
    'pkts',
    31.1436,
    `DSP-${String(erpState.invoices.length).padStart(3, '0')}`,
    'Admin'
  );

  res.json({
    success: true,
    data: { order, invoice: newInvoice },
    message: `Order ${order.orderNumber} approved & dispatched. Invoice ${newInvoice.invoiceNumber} posted.`,
  });
});
