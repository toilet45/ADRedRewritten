import { DC } from "./constants";

/**
 * @abstract
 */
export class CelestialTheoremPurchaseType {
  /**
  * @abstract
  */
  get amount() { throw new NotImplementedError(); }

  /**
  * @abstract
  */
  set amount(value) { throw new NotImplementedError(); }

  add(amount) { this.amount = this.amount.add(amount); }

  /**
  * @abstract
  */
  get currency() { throw new NotImplementedError(); }

  get cost() { return this.costBase.times(this.costIncrement.pow(this.amount)); }

  /**
   * @abstract
   */
  get costBase() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get costIncrement() { throw new NotImplementedError(); }

  get bulkPossible() {
    if (Perk.ttFree.canBeApplied) {
      return this.currency.value.divide(this.cost).log10().div(this.costIncrement.log10()).add(1).floor();
    }
    return Decimal.affordGeometricSeries(this.currency.value, this.cost, this.costIncrement, 0);
  }

  // Note: This is actually just the cost of the largest term of the geometric series. If buying EP without the
  // perk that makes them free, this will be incorrect, but the EP object already overrides this anyway
  bulkCost(amount) {
    return this.cost.times(this.costIncrement.pow(amount.sub(1)));
  }

  purchase(bulk = false) {
    if (!this.canAfford) return false;

    if (!bulk) {
      Currency.celestialTheorems.add(1);
      this.add(1);
      return true;
    }
    const canBuy = this.currency.value.sub(this.costBase)
      .clampMin(this.costIncrement.recip()).log(this.costIncrement);
    let amntPur = canBuy.sub(this.amount).floor();
    // We can definitely afford x - 1
    amntPur = amntPur.sub(1).max(0);
    Currency.celestialTheorems.add(amntPur);
    this.add(amntPur);
    // Can we afford another? If not, just return that we definitely bought some already
    if (this.currency.lt(this.cost) && amntPur.neq(0)) return true;
    Currency.timeTheorems.add(1);
    this.add(1);
    return true;
  }

  get canAfford() {
    return this.currency.gte(this.cost);
  }

  reset() {
    this.amount = DC.D0;
  }
}

export const CelestialTheorems = {
  buyOne() {
    return false;
  },
  buyMax() {
    return false;
  }
};
