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

  get cost() {
    return this.id === "am"
      ? this.costBase.pow(this.costIncrement.pow(this.amount.pow(2)).add(1))
      : this.costBase.mul(this.costIncrement.pow(this.amount));
  }

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
    return this.cost.times(this.costIncrement.pow(amount.sub(1).pow(2)));
  }

  purchase(bulk = false) {
    if (!this.canAfford) return false;
    if (this.id === "tt") {
      const pur = bulk
        ? this.currency.value.div(this.costBase).log(this.costIncrement).add(1).floor()
        : 1;
      Currency.celestialTheorems.add(pur);
      this.add(pur);
      return true;
    }
    const pur = bulk
      // Prayge that this calculation works and that we never have to touch it again (we will)
      // eslint-disable-next-line max-len
      ? this.currency.value.max(1).log10().max(1).log10().div(this.costBase.log10()).sub(1).log(this.costIncrement).sqrt()
      : 1;
    Currency.celestialTheorems.add(pur);
    this.add(pur);
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
  get amount() { return player.celestialstudy.purchasedAM; }
  set amount(value) { player.celestialstudy.purchasedAM = value; }
  get id() { return "am"; }

  get currency() { return Currency.antimatter; }
  get costBase() { return DC.EE8; }
  get costIncrement() { return DC.D5; }
}();

CelestialTheoremPurchaseType.tt = new class extends CelestialTheoremPurchaseType {
  get amount() { return player.celestialstudy.purchasedTT; }
  set amount(value) { player.celestialstudy.purchasedTT = value; }
  get id() { return "tt"; }

  get currency() { return Currency.timeTheorems; }
  get costBase() { return DC.E20000; }
  get costIncrement() { return DC.E2000; }
}();

export const CelestialTheorems = {
  buyOne(type = "all") {
    const am = type === "tt" ? false : CelestialTheoremPurchaseType.am.purchase();
    const tt = type === "am" ? false : CelestialTheoremPurchaseType.tt.purchase();
    return am || tt;
  },
  buyMax() {
    // const am = CelestialTheoremPurchaseType.am.purchase(true);
    const tt = CelestialTheoremPurchaseType.tt.purchase(true);
    return am || tt;
  }
};
