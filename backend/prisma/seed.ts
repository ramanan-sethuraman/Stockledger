import { PrismaClient, UserRole, MaterialCategory, UomType } from '@prisma/client';
import bcrypt from 'bcrypt';
import Decimal from 'decimal.js';

const prisma = new PrismaClient();

export async function seedDatabase() {
  console.log('🌱 Seeding Stockledger Database with Masters...');

  // 1. Seed Roles & Users
  const passwordHash = await bcrypt.hash('Password@123', 10);

  const users = [
    { email: 'admin@stockledger.in', fullName: 'S Ramanan (System Admin)', role: UserRole.ADMIN },
    { email: 'supervisor@stockledger.in', fullName: 'K. Senthil (Production Supervisor)', role: UserRole.PRODUCTION_SUPERVISOR },
    { email: 'salesmanA@stockledger.in', fullName: 'M. Anand (Salesman A)', role: UserRole.SALES_EXECUTIVE },
    { email: 'salesmanB@stockledger.in', fullName: 'V. Balaji (Salesman B)', role: UserRole.SALES_EXECUTIVE },
    { email: 'store@stockledger.in', fullName: 'S. Murugan (Inventory Manager)', role: UserRole.INVENTORY_MANAGER },
    { email: 'auditor@stockledger.in', fullName: 'CA. T. Natarajan (Financial Auditor)', role: UserRole.FINANCIAL_AUDITOR },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { fullName: u.fullName, role: u.role },
      create: {
        email: u.email,
        fullName: u.fullName,
        passwordHash,
        role: u.role,
        isActive: true,
      },
    });
  }
  console.log('✅ Users & Roles Seeded (Default password: Password@123)');

  // 2. Seed Raw & Packaging Materials (Opening Balances)
  const materials = [
    { code: 'RM-FLOUR', name: 'Rice Flour (Grade A)', category: MaterialCategory.RAW, uom: UomType.KG, openingStock: 100, openingRate: 42.0 },
    { code: 'RM-OIL', name: 'Refined Groundnut Oil', category: MaterialCategory.RAW, uom: UomType.LITRE, openingStock: 30, openingRate: 140.0 },
    { code: 'RM-SPICE', name: 'Murukku Special Spice Mix', category: MaterialCategory.RAW, uom: UomType.KG, openingStock: 5, openingRate: 200.0 },
    { code: 'PM-POUCH', name: 'Printed Nitrogen Pouches (200g)', category: MaterialCategory.PACKAGING, uom: UomType.PIECE, openingStock: 500, openingRate: 2.50 },
    { code: 'PM-CARTON', name: 'Corrugated Shipping Cartons (20-Pack)', category: MaterialCategory.PACKAGING, uom: UomType.PIECE, openingStock: 30, openingRate: 15.0 },
  ];

  for (const m of materials) {
    await prisma.material.upsert({
      where: { code: m.code },
      update: {
        currentStock: new Decimal(m.openingStock),
        currentWeightedRate: new Decimal(m.openingRate),
      },
      create: {
        code: m.code,
        name: m.name,
        category: m.category,
        uom: m.uom,
        currentStock: new Decimal(m.openingStock),
        currentWeightedRate: new Decimal(m.openingRate),
      },
    });
  }
  console.log('✅ Raw & Packaging Materials Seeded with Opening Balances');

  // 3. Seed Finished Goods Product (Murukku 200g)
  const product = await prisma.product.upsert({
    where: { sku: 'MUR-200G' },
    update: {
      sellingPrice: new Decimal(50.0),
      currentStock: new Decimal(50.0), // 50 packets opening stock
    },
    create: {
      sku: 'MUR-200G',
      name: 'South Indian Murukku 200g',
      hsnCode: '1905',
      uom: UomType.PACKET,
      unitWeightGrams: new Decimal(200.0),
      sellingPrice: new Decimal(50.0),
      gstRate: new Decimal(5.0),
      currentStock: new Decimal(50.0),
    },
  });
  console.log('✅ Finished Goods Product Seeded (Murukku 200g, 50 packets opening stock)');

  // 4. Seed Standard BOM for Murukku 200g (Batch: 200 packets)
  const flour = await prisma.material.findUniqueOrThrow({ where: { code: 'RM-FLOUR' } });
  const oil = await prisma.material.findUniqueOrThrow({ where: { code: 'RM-OIL' } });
  const spice = await prisma.material.findUniqueOrThrow({ where: { code: 'RM-SPICE' } });
  const pouch = await prisma.material.findUniqueOrThrow({ where: { code: 'PM-POUCH' } });
  const carton = await prisma.material.findUniqueOrThrow({ where: { code: 'PM-CARTON' } });

  const bom = await prisma.bom.upsert({
    where: { productId_version: { productId: product.id, version: 'v1.0' } },
    update: { isActive: true },
    create: {
      productId: product.id,
      version: 'v1.0',
      batchOutputQty: new Decimal(200.0),
      batchOutputUom: UomType.PACKET,
      isActive: true,
      notes: 'Standard Murukku 200g Recipe (Batch Yield: 200 packets)',
    },
  });

  const bomItems = [
    { materialId: flour.id, standardQty: 40.0, standardUom: UomType.KG },
    { materialId: oil.id, standardQty: 10.0, standardUom: UomType.LITRE },
    { materialId: spice.id, standardQty: 1.2, standardUom: UomType.KG },
    { materialId: pouch.id, standardQty: 200.0, standardUom: UomType.PIECE },
    { materialId: carton.id, standardQty: 10.0, standardUom: UomType.PIECE },
  ];

  await prisma.bomItem.deleteMany({ where: { bomId: bom.id } });
  for (const item of bomItems) {
    await prisma.bomItem.create({
      data: {
        bomId: bom.id,
        materialId: item.materialId,
        standardQty: new Decimal(item.standardQty),
        standardUom: item.standardUom,
      },
    });
  }
  console.log('✅ Standard BOM Seeded (40kg Flour, 10L Oil, 1.2kg Spice, 200 Pouches, 10 Cartons)');

  // 5. Seed Customer (Distributor in Tamil Nadu)
  await prisma.customer.upsert({
    where: { code: 'CUST-TN-001' },
    update: { creditLimit: new Decimal(50000.0) },
    create: {
      code: 'CUST-TN-001',
      name: 'Cauvery Wholesale Confectioneries Pvt Ltd',
      gstin: '33AABCT1332M1ZG',
      stateCode: '33', // Tamil Nadu (Intra-state)
      billingAddress: 'No. 14, Industrial Main Road, Tamil Nadu 600018',
      shippingAddress: 'Central Warehouse, SIDCO Industrial Estate, Tamil Nadu 600010',
      creditLimit: new Decimal(50000.0),
      currentOutstanding: new Decimal(0.0),
    },
  });

  // 6. Seed Supplier (Grain Mills Ltd in Tamil Nadu)
  await prisma.supplier.upsert({
    where: { code: 'SUPP-TN-001' },
    update: {},
    create: {
      code: 'SUPP-TN-001',
      name: 'Cauvery Agro Mills & Flour Supplies',
      gstin: '33AAACM4512N1ZQ',
      stateCode: '33',
      address: '22, Mill Road, Tamil Nadu 624001',
      phone: '+91 94431 00221',
      email: 'orders@cauveryagro.in',
    },
  });

  console.log('🌟 Database Seed Completed Successfully!');
}

if (process.argv[1].endsWith('seed.ts') || process.argv[1].endsWith('seed.js')) {
  seedDatabase()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
