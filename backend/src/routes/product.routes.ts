import { Router, Request, Response } from 'express';

export const productRouter = Router();

let productsStore = [
  {
    id: 'prod-01',
    sku: 'MUR-200G',
    name: 'South Indian Murukku 200g',
    hsnCode: '1905',
    uom: 'packet',
    unitWeightGrams: 200,
    sellingPrice: 50.0,
    gstRate: 5.0,
    openingStock: 50,
    postProductionStock: 238,
    currentStock: 88, // 238 produced - 150 dispatched
  },
];

productRouter.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: productsStore,
  });
});

productRouter.get('/:sku', (req: Request, res: Response) => {
  const product = productsStore.find((p) => p.sku === req.params.sku || p.id === req.params.sku);
  if (!product) {
    return res.status(404).json({ success: false, error: { message: 'Product not found' } });
  }
  res.json({ success: true, data: product });
});
