import { Router, Request, Response } from 'express';
import { erpState } from '../store/erpState.js';

export const productRouter = Router();

productRouter.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: erpState.products,
  });
});

productRouter.get('/:sku', (req: Request, res: Response) => {
  const product = erpState.products.find((p) => p.sku === req.params.sku || p.id === req.params.sku);
  if (!product) {
    return res.status(404).json({ success: false, error: { message: 'Product not found' } });
  }
  res.json({ success: true, data: product });
});

// Create new custom finished product
productRouter.post('/', (req: Request, res: Response) => {
  const { sku, name, hsnCode, uom, unitWeightGrams, sellingPrice, gstRate, openingStock } = req.body;

  if (!sku || !name || !sellingPrice) {
    return res.status(400).json({ success: false, error: { message: 'SKU, name, and sellingPrice are required' } });
  }

  const existing = erpState.products.find(p => p.sku === sku);
  if (existing) {
    return res.status(400).json({ success: false, error: { message: `Product SKU ${sku} already exists` } });
  }

  const stock = Number(openingStock) || 0;
  const price = Number(sellingPrice);

  const newProduct = {
    id: `prod-${Date.now()}`,
    sku: sku.trim().toUpperCase(),
    name: name.trim(),
    hsnCode: hsnCode || '1905',
    uom: uom || 'packet',
    unitWeightGrams: Number(unitWeightGrams) || 200,
    sellingPrice: price,
    gstRate: Number(gstRate) || 5.0,
    openingStock: stock,
    currentStock: stock,
  };

  erpState.products.push(newProduct);

  if (stock > 0) {
    erpState.appendStockMovement(
      'PRODUCT',
      newProduct.sku,
      newProduct.name,
      'OPENING_BALANCE',
      stock,
      0,
      stock,
      newProduct.uom,
      price * 0.6,
      'SYS-MANUAL',
      'System Admin'
    );
  }

  res.status(201).json({ success: true, data: newProduct, message: 'Product created successfully' });
});
