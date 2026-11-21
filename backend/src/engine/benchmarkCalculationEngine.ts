import Decimal from 'decimal.js';

// Configure Decimal precision for financial calculations (minimum 28 significant digits)
Decimal.set({ precision: 28, rounding: Decimal.ROUND_HALF_UP });

export interface InventoryItemState {
  code: string;
  name: string;
  uom: string;
  quantity: Decimal;
  unitRate: Decimal;
  totalValuation: Decimal;
}

export interface ProductionIssueInput {
  flourKg: Decimal;
  oilLitres: Decimal;
  spiceMixKg: Decimal;
  pouchesPcs: Decimal;
  cartonsPcs: Decimal;
  damagedPouchesPcs: Decimal;
}

export interface ProductionYieldResult {
  plannedUnits: Decimal;
  goodOutputUnits: Decimal;
  yieldVariancePercent: Decimal;
  oilStandardLitres: Decimal;
  oilActualLitres: Decimal;
  oilVariancePercent: Decimal;
  flourRemainingKg: Decimal;
  oilRemainingLitres: Decimal;
  pouchesRemainingPcs: Decimal;
  cartonsRemainingPcs: Decimal;
  finishedGoodsPostProduction: Decimal;
}

export interface BatchCostingResult {
  flourCost: Decimal;
  oilCost: Decimal;
  spiceCost: Decimal;
  pouchesCost: Decimal;
  cartonsCost: Decimal;
  totalMaterialCost: Decimal;
  labourCost: Decimal;
  overheadCost: Decimal;
  totalBatchCost: Decimal;
  costPerGoodPacket: Decimal;
  sellingPrice: Decimal;
  grossMarginPerPacket: Decimal;
  grossMarginPercent: Decimal;
}

export interface GstInvoiceResult {
  unitsOrdered: Decimal;
  sellingPricePerUnit: Decimal;
  taxableValue: Decimal;
  cgstRatePercent: Decimal;
  cgstAmount: Decimal;
  sgstRatePercent: Decimal;
  sgstAmount: Decimal;
  totalInvoiceAmount: Decimal;
  finishedGoodsRemaining: Decimal;
}

export class BenchmarkEngine {
  /**
   * Step 1: Weighted Average Valuation for Purchases
   */
  public static calculatePurchaseWeightedAverage(
    currentQty: Decimal,
    currentRate: Decimal,
    incomingQty: Decimal,
    incomingRate: Decimal
  ): { totalQty: Decimal; weightedRate: Decimal; totalValuation: Decimal } {
    const currentValuation = currentQty.times(currentRate);
    const incomingValuation = incomingQty.times(incomingRate);
    const totalQty = currentQty.plus(incomingQty);
    const totalValuation = currentValuation.plus(incomingValuation);
    const weightedRate = totalValuation.dividedBy(totalQty);

    return { totalQty, weightedRate, totalValuation };
  }

  /**
   * Steps 2 - 7: Production Batch Execution & Variances
   */
  public static executeProductionBatch(
    openingFlour: Decimal,
    openingOil: Decimal,
    openingSpice: Decimal,
    openingPouches: Decimal,
    openingCartons: Decimal,
    openingFinishedGoods: Decimal,
    issues: ProductionIssueInput,
    plannedYield: Decimal = new Decimal(200),
    goodOutput: Decimal = new Decimal(188),
    standardOil: Decimal = new Decimal(10)
  ): ProductionYieldResult {
    // 1. Raw material remaining
    const flourRemainingKg = openingFlour.minus(issues.flourKg);
    const oilRemainingLitres = openingOil.minus(issues.oilLitres);

    // 2. Packaging consumed (good output pouches + damaged pouches)
    const totalPouchesUsed = goodOutput.plus(issues.damagedPouchesPcs);
    const pouchesRemainingPcs = openingPouches.minus(totalPouchesUsed);
    const cartonsRemainingPcs = openingCartons.minus(issues.cartonsPcs);

    // 3. Finished Goods post production
    const finishedGoodsPostProduction = openingFinishedGoods.plus(goodOutput);

    // 4. Yield Variance: ((Actual Good - Planned) / Planned) * 100
    const yieldVariancePercent = goodOutput
      .minus(plannedYield)
      .dividedBy(plannedYield)
      .times(100);

    // 5. Oil Variance: ((Actual Oil - Standard Oil) / Standard Oil) * 100
    const oilVariancePercent = issues.oilLitres
      .minus(standardOil)
      .dividedBy(standardOil)
      .times(100);

    return {
      plannedUnits: plannedYield,
      goodOutputUnits: goodOutput,
      yieldVariancePercent,
      oilStandardLitres: standardOil,
      oilActualLitres: issues.oilLitres,
      oilVariancePercent,
      flourRemainingKg,
      oilRemainingLitres,
      pouchesRemainingPcs,
      cartonsRemainingPcs,
      finishedGoodsPostProduction,
    };
  }

  /**
   * Steps 13 - 14: Batch Costing & Absorption Allocation
   */
  public static calculateBatchCosting(
    flourIssuedKg: Decimal,
    flourRate: Decimal,
    oilIssuedLitres: Decimal,
    oilRate: Decimal,
    spiceIssuedKg: Decimal,
    spiceRate: Decimal,
    pouchesUsedPcs: Decimal,
    pouchRate: Decimal,
    cartonsUsedPcs: Decimal,
    cartonRate: Decimal,
    goodOutputPackets: Decimal,
    labourCost: Decimal,
    overheadCost: Decimal,
    sellingPricePerPacket: Decimal = new Decimal(50)
  ): BatchCostingResult {
    const flourCost = flourIssuedKg.times(flourRate);
    const oilCost = oilIssuedLitres.times(oilRate);
    const spiceCost = spiceIssuedKg.times(spiceRate);
    const pouchesCost = pouchesUsedPcs.times(pouchRate);
    const cartonsCost = cartonsUsedPcs.times(cartonRate);

    const totalMaterialCost = flourCost
      .plus(oilCost)
      .plus(spiceCost)
      .plus(pouchesCost)
      .plus(cartonsCost);

    const totalBatchCost = totalMaterialCost.plus(labourCost).plus(overheadCost);
    const costPerGoodPacket = totalBatchCost.dividedBy(goodOutputPackets);
    const grossMarginPerPacket = sellingPricePerPacket.minus(costPerGoodPacket);
    const grossMarginPercent = grossMarginPerPacket
      .dividedBy(sellingPricePerPacket)
      .times(100);

    return {
      flourCost,
      oilCost,
      spiceCost,
      pouchesCost,
      cartonsCost,
      totalMaterialCost,
      labourCost,
      overheadCost,
      totalBatchCost,
      costPerGoodPacket,
      sellingPrice: sellingPricePerPacket,
      grossMarginPerPacket,
      grossMarginPercent,
    };
  }

  /**
   * Steps 8 - 9: Sales Order, GST Calculation & Dispatch
   */
  public static generateGstInvoiceAndDispatch(
    unitsOrdered: Decimal,
    sellingPrice: Decimal,
    currentFgStock: Decimal,
    cgstPercent: Decimal = new Decimal(2.5),
    sgstPercent: Decimal = new Decimal(2.5)
  ): GstInvoiceResult {
    const taxableValue = unitsOrdered.times(sellingPrice);
    const cgstAmount = taxableValue.times(cgstPercent).dividedBy(100);
    const sgstAmount = taxableValue.times(sgstPercent).dividedBy(100);
    const totalInvoiceAmount = taxableValue.plus(cgstAmount).plus(sgstAmount);
    const finishedGoodsRemaining = currentFgStock.minus(unitsOrdered);

    return {
      unitsOrdered,
      sellingPricePerUnit: sellingPrice,
      taxableValue,
      cgstRatePercent: cgstPercent,
      cgstAmount,
      sgstRatePercent: sgstPercent,
      sgstAmount,
      totalInvoiceAmount,
      finishedGoodsRemaining,
    };
  }

  /**
   * Steps 10 - 11: Shortage Detection
   */
  public static checkOrderShortage(
    availableStock: Decimal,
    requestedOrderQty: Decimal
  ): { available: Decimal; requested: Decimal; shortageQty: Decimal; isShortage: boolean } {
    if (requestedOrderQty.greaterThan(availableStock)) {
      const shortageQty = requestedOrderQty.minus(availableStock);
      return {
        available: availableStock,
        requested: requestedOrderQty,
        shortageQty,
        isShortage: true,
      };
    }
    return {
      available: availableStock,
      requested: requestedOrderQty,
      shortageQty: new Decimal(0),
      isShortage: false,
    };
  }

  /**
   * Step 12: Payment Receipt & Outstanding Balance
   */
  public static applyPayment(
    invoiceTotal: Decimal,
    paymentAmount: Decimal
  ): { total: Decimal; paid: Decimal; outstanding: Decimal } {
    const outstanding = invoiceTotal.minus(paymentAmount);
    return { total: invoiceTotal, paid: paymentAmount, outstanding };
  }
}
