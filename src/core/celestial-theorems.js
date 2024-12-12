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

  get cost() { return this.costBase.pow(this.costIncrement.mul(this.amount)); }

  /**
   * @abstract
   */
  get costBase() { throw new NotImplementedError(); }

  /**
   * @abstract
   */
  get costIncrement() { throw new NotImplementedError(); }

  get bulkPossible() {
    return this.currency.value.div(this.costBase).max(1).log(this.costIncrement).add(1);
  }

  // Note: This is actually just the cost of the largest term of the geometric series. If buying EP without the
  // perk that makes them free, this will be incorrect, but the EP object already overrides this anyway
  bulkCost(amount) {
    return this.cost.times(this.costIncrement.pow(amount.sub(1)));
  }

  purchase(bulk = false) {
    if (!this.canAfford) return false;
    Currency.celestialTheorems.add(
      bulk
        ? this.currency.value.div(this.costBase).max(1).log(this.costIncrement).add(1).sub(this.amount)
        : 1);
    return true;
  }

  get canAfford() {
    return this.currency.gte(this.cost);
  }

  reset() {
    this.amount = DC.D0;
  }
}

CelestialTheoremPurchaseType.am = new class extends CelestialTheoremPurchaseType {
  get amount() { return player.celestialstudy.purchased; }
  set amount(value) { player.celestialstudy.purchased = value; }

  get currency() { return Currency.antimatter; }
  get costBase() { return DC.E20000; }
  get costIncrement() { return new Decimal(1.05); }
}();

export const CelestialTheorems = {
  buyOne() {
    return false;
  },
  buyMax() {
    return false;
  }
};
