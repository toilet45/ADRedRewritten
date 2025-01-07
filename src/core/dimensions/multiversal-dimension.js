import { DC } from "../constants";

import { DimensionState } from "./dimension";

export function buySingleMultiversalDimension(tier, auto = false) {
  const dim = MultiversalDimension(tier);
  if (dim.bought.gte(MultiversalDimensions.purchaseCap)) return false;
  if (Currency.mendingPoints.lt(dim.cost)) return false;
  Currency.mendingPoints.subtract(dim.cost);
  dim.amount = dim.amount.add(1);
  dim.bought = dim.bought.add(1);
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function resetMultiversalDimensions() {
  for (const dim of MultiversalDimensions.all) dim.amount = new Decimal(dim.bought);
  updateMultiversalDimensionCosts();
}

export function fullResetMultiversalDimensions() {
  for (const dim of MultiversalDimensions.all) {
    dim.cost = new Decimal(dim.baseCost);
    dim.amount = DC.D0;
    dim.bought = DC.D0;
  }
}

export function toggleAllMultiversalDims() {
  const areEnabled = Autobuyer.multiversalDimension(1).isActive;
  for (let i = 1; i < 9; i++) {
    Autobuyer.multiversalDimension(i).isActive = !areEnabled;
  }
}

export function calcHighestPurchaseableMvD(tier, currency) {
  const logC = currency.log10();
  const logBase = MultiversalDimension(tier)._baseCost.log10();
  let logMult = Decimal.log10(MultiversalDimension(tier)._costMultiplier);

  // TODO: make Hexa figure out scaling
  return Decimal.max(0, logC.sub(logBase).div(logMult).add(1)).floor();

  throw new Error("calcHighestPurchasableTD reached too far in code");
}

export function buyMaxMultiversalDimension(tier, portionToSpend = 1, isMaxAll = false) {
  const canSpend = Currency.mendingPoints.value.times(portionToSpend);
  const dim = MultiversalDimension(tier);
  if (canSpend.lt(dim.cost) || dim.bought.gte(MultiversalDimensions.purchaseCap)) return false;


  let pur = Decimal.sub(calcHighestPurchaseableMvD(tier, canSpend), dim.bought);
  pur = pur.clampMin(0).clampMax(MultiversalDimensions.purchaseCap);
  const cost = dim.nextCost(pur.add(dim.bought).sub(1));
  if (pur.lte(0)) return false;
  Currency.mendingPoints.subtract(cost);
  dim.amount = dim.amount.plus(pur);
  dim.bought = dim.bought.add(pur);
  dim.cost = dim.nextCost(dim.bought);
  return true;
}

export function maxAllMultiversalDimensions() {
  // Try to buy single from the highest affordable new dimensions
  for (let i = 8; i > 0 && MultiversalDimension(i).bought.eq(0); i--) {
    buySingleMultiversalDimension(i, true);
  }

  // Buy everything costing less than 1% of initial EP
  for (let i = 8; i > 0; i--) {
    buyMaxMultiversalDimension(i, 0.01, true);
  }

  // Loop buying the cheapest dimension possible; explicit infinite loops make me nervous
  const purchasableDimensions = MultiversalDimensions.all.filter(d => d.isUnlocked);
  for (let stop = 0; stop < 1000; stop++) {
    const cheapestDim = purchasableDimensions.reduce((a, b) => (b.cost.gte(a.cost) ? a : b));
    if (!buySingleMultiversalDimension(cheapestDim.tier, true)) break;
  }
}

export function multiversalDimensionCommonMultiplier() {
  let mult = new Decimal(1);
  return mult;
}

export function updateMultiversalDimensionCosts() {
  for (let i = 1; i <= 8; i++) {
    const dim = MultiversalDimension(i);
    dim.cost = dim.nextCost(dim.bought);
  }
}

class MultiversalDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.multiversal, tier);
    const BASE_COSTS = [null, DC.E24, DC.BEMAX, DC.BEMAX, DC.BEMAX, DC.BEMAX, DC.BEMAX, DC.BEMAX, DC.BEMAX];
    this._baseCost = BASE_COSTS[tier];
    const COST_MULTS = [null, 1e300, 1e300, 1e300, 1e300, 1e300, 1e300, 1e300, 1e300].map(e => (e ? new Decimal(e) : null));
    this._costMultiplier = COST_MULTS[tier];
    // eslint-disable-next-line max-len
    const E6000_SCALING_AMOUNTS = [null, 1e300, 1e300, 1e300, 1e300, 1e300, 1e300, 1e300, 1e300].map(e => (e ? new Decimal(e) : null));
    this._e6000ScalingAmount = E6000_SCALING_AMOUNTS[tier];
    const COST_THRESHOLDS = [DC.NUMMAX, DC.E1300, DC.E6000];
    this._costIncreaseThresholds = COST_THRESHOLDS;
  }

  /** @returns {Decimal} */
  get cost() {
    return this.data.cost;
  }

  /** @param {Decimal} value */
  set cost(value) { this.data.cost = value; }

  nextCost(bought) {
    const costMultIncreases = [1, 1.5, 2.2];
    for (let i = 0; i < this._costIncreaseThresholds.length; i++) {
      const cost = Decimal.pow(this.costMultiplier.mul(costMultIncreases[i]), bought).times(this.baseCost);
      if (cost.lt(this._costIncreaseThresholds[i])) return cost;
    }

    let base = this.costMultiplier;
    if (this._tier <= 4) base = base.mul(2.2);
    const exponent = this.e6000ScalingAmount.add((bought.sub(this.e6000ScalingAmount))
      .times(MultiversalDimensions.scalingPast1e6000));
    const cost = Decimal.pow(base, exponent).times(this.baseCost);
    return cost;
  }

  get isUnlocked() {
    return true; //Ra.unlocks.MvDUnlock.canBeApplied;
  }

  get isAvailableForPurchase() {
    return this.isAffordable;
  }

  get isAffordable() {
    return Currency.mendingPoints.gte(this.cost);
  }

  get multiplier() {
    const tier = this._tier;
    let mult = GameCache.multiversalDimensionCommonMultiplier.value;

    const dim = MultiversalDimension(tier);
    // eslint-disable-next-line no-nested-ternary
    const bought = dim.bought;

    if (player.dilation.active || PelleStrikes.dilation.hasStrike) {
      mult = dilatedValueOf(mult);
    }

    if (Effarig.isRunning) {
      mult = Effarig.multiplier(mult);
    } else if (V.isRunning) {
      mult = mult.pow(0.5);
    }

    if (Laitela.isDamaged) mult = mult.pow(0.6);
    return mult;
  }

  get productionPerSecond() {
    if ((Laitela.isRunning && this.tier > Laitela.maxAllowedDimension)) {
      return DC.D0;
    }
    let production = this.totalAmount.times(this.multiplier);
    return production;
  }

  get rateOfChange() {
    const tier = this._tier;
    if (tier === 8) {
      return DC.D0;
    }
    const toGain = MultiversalDimension(tier + 1).productionPerSecond;
    const current = Decimal.max(this.totalAmount, 1);
    return toGain.times(10).dividedBy(current);
  }

  get isProducing() {
    const tier = this.tier;
    if ((Laitela.isRunning && tier > Laitela.maxAllowedDimension)) {
      return false;
    }
    return this.totalAmount.gt(0);
  }

  get baseCost() {
    return this._baseCost;
  }

  get costMultiplier() {
    return this._costMultiplier;
  }

  get powerMultiplier() {
    return DC.D4;
  }

  get e6000ScalingAmount() {
    return this._e6000ScalingAmount;
  }

  get costIncreaseThresholds() {
    return this._costIncreaseThresholds;
  }

  get requirementReached() {
    return true;
  }

  get continuumValue() {
    return DC.D0;
  }

  get totalAmount() {
    return this.amount.max(this.continuumValue);
  }
}

/**
 * @function
 * @param {number} tier
 * @return {MultiversalDimensionState}
 */
export const MultiversalDimension = MultiversalDimensionState.createAccessor();

export const MultiversalDimensions = {
  /**
   * @type {MultiversalDimensionState[]}
   */
  all: MultiversalDimension.index.compact(),

  get scalingPast1e6000() {
    return 4;
  },

  get purchaseCap() {
    return DC.BEMAX;
  },

  tick(diff) {
    for (let tier = 8; tier > 1; tier--) {
      MultiversalDimension(tier).produceDimensions(MultiversalDimension(tier - 1), diff.div(10));
    }
    MultiversalDimension(1).produceCurrency(Currency.galacticShards, diff);
  }
};
