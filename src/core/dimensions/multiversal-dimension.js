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


export function buyMaxMultiversalDimension(tier, portionToSpend = 1, bulk = Infinity) {
  dimension = MultiversalDimension(tier);
  const maxBought = dimension.costScale.getMaxBought(
    Decimal.floor(dimension.bought), Currency.mendingPoints.value.mul(portionToSpend), DC.D1
  );
  if (maxBought === null) {
    return;
  }
  let buying = maxBought.quantity;
  if (buying.gt(bulk)) buying = new Decimal(bulk);
  dimension.amount = dimension.amount.plus(buying);
  dimension.bought = dimension.bought.add(buying);
  Currency.mendingPoints.sub(Decimal.pow10(maxBought.logPrice));
  Currency.mendingPoints = Currency.mendingPoints.value.max(0);
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
  for (let stop = 0; stop < 50; stop++) {
    const cheapestDim = purchasableDimensions.reduce((a, b) => (b.cost.gte(a.cost) ? a : b));
    if (!buySingleMultiversalDimension(cheapestDim.tier, true)) break;
  }
}

export function multiversalDimensionCommonMultiplier() {
  const mult = new Decimal(1);
  return mult;
}

export function updateMultiversalDimensionCosts() {
  for (let i = 1; i <= 8; i++) {
    const dim = MultiversalDimension(i);
    dim.cost = dim.nextCost(dim.bought);
  }
}

export function getFreeGalxiesFromMvD() {
  const shards = Currency.galacticShards.value;
  return shards.max(1).log10().pow(1.5).floor();
}

export function getReqForNextMVGalaxy() {
  return getFreeGalxiesFromMvD().add(1).root(1.5).pow10();
}

export function getGalaxyPowerFromMvD() {
  const shards = Currency.galacticShards.value;
  let x = shards.max(1).log10().pow(1.5).div(100);
  if (x.gt(1)) x = x.sub(1).cbrt().add(1);
  return x;
}

class MultiversalDimensionState extends DimensionState {
  constructor(tier) {
    super(() => player.dimensions.multiversal, tier);
    const BASE_COSTS = [null, DC.E24, DC.E40, DC.E65, DC.E100, DC.E250, DC.E500, DC.E1000, DC.E2000];
    this._baseCost = BASE_COSTS[tier];
    const COST_MULTS = [null, 1e6, 1e15, 1e25, 1e50, 1e100, 1e150, 1e200, 1e300].map(e => (e ? new Decimal(e) : null));
    this._costMultiplier = COST_MULTS[tier];
  }

  get costScale() {
    return new ExponentialCostScaling({
      baseCost: this._baseCost,
      baseIncrease: this._costMultiplier,
      costScale: DC.D4,
      scalingCostThreshold: this._baseCost.pow(this.tier / 2 + 2)
    });
  }


  /**
   * @returns {Decimal}
   */
  get cost() {
    return this.costScale.calculateCost(this.bought.floor());
  }

  get isUnlocked() {
    return Ra.unlocks.MvDUnlock.canBeApplied;
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
    mult = mult.times(Decimal.pow(2, bought.sub(1))).clampMin(1);

    if (tier === 1) mult = mult.timesEffectOf(TimeStudy(74));

    return mult;
  }

  get productionPerSecond() {
    const production = this.totalAmount.times(this.multiplier);
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
