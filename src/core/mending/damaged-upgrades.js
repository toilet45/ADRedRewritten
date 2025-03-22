import { BitPurchasableMechanicState, RebuyableMechanicState } from "../game-mechanics";

class DamagedUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
  }

  get name() {
    return this.config.name;
  }

  get shortDescription() {
    return this.config.shortDescription ? this.config.shortDescription() : "";
  }

  get currencies() {
    return [Currency.lightCredits, Currency.darkCredits];
  }

  get bitIndex() {
    return this.id;
  }

  /* Bits, in this case are only affective for the BH4 upgrade,
    but futureproofing in case we want to expand it like Reality upgrades */
  get bits() {
    return player.celestials.laitela.universalDamage.upgradeBits;
  }

  set bits(value) {
    player.celestials.laitela.universalDamage.upgradeBits = value;
  }

  get costs() {
    return this.config.costs();
  }

  get isAffordable() {
    return this.currencies[0].gte(this.costs[0]) && this.currencies[1].gte(this.costs[1]);
  }

  get isAvailableForPurchase() {
    return true;
  }

  purchase() {
    if (!this.canBeBought) return false;
    if (GameEnd.creditsEverClosed) return false;
    this.currencies[0].subtract(this.costs[0]);
    this.currencies[1].subtract(this.costs[1]);
    this.onPurchased();
    GameUI.update();
    return true;
  }

  onPurchased() {
    switch (this.id) {
      default:
        break;
    }
    const resetCredits = (Decimal.min(Currency.lightCredits.value, Currency.darkCredits.value).eq(0) &&
    Currency.lightCredits.value.neq(Currency.darkCredits.value)) ||
    Currency.lightCredits.value.gt(Decimal.mul(2, Currency.darkCredits.value)) ||
    Currency.darkCredits.value.gt(Decimal.mul(2, Currency.lightCredits.value));
    if (resetCredits) {
      Currency.lightCredits.reset();
      Currency.darkCredits.reset();
    }
  }
}

class RebuyableDamagedUpgradeState extends RebuyableMechanicState {
  get currencies() {
    return [Currency.lightCredits, Currency.darkCredits];
  }

  get isAffordable() {
    return this.currencies[0].gte(this.costs[0]) && this.currencies[1].gte(this.costs[1]);
  }

  get costs() {
    return this.config.costs();
  }

  get boughtAmount() {
    return player.celestials.laitela.universalDamage.upgrades[this.id - 1];
  }

  set boughtAmount(value) {
    player.celestials.laitela.universalDamage.upgrades[this.id - 1] = value;
  }

  purchase() {
    if (!this.canBeBought) return false;
    if (GameEnd.creditsEverClosed) return false;
    this.currencies[0].subtract(this.costs[0]);
    this.currencies[1].subtract(this.costs[1]);
    this.boughtAmount = this.boughtAmount.add(1);
    this.onPurchased();
    GameUI.update();
    return true;
  }

  onPurchased() {
    const resetCredits = (Decimal.min(Currency.lightCredits.value, Currency.darkCredits.value).eq(0) &&
    Currency.lightCredits.value.neq(Currency.darkCredits.value)) ||
    Currency.lightCredits.value.gt(Decimal.mul(2, Currency.darkCredits.value)) ||
    Currency.darkCredits.value.gt(Decimal.mul(2, Currency.lightCredits.value));
    if (resetCredits) {
      Currency.lightCredits.reset();
      Currency.darkCredits.reset();
    }
  }
}

DamagedUpgradeState.index = mapGameData(
    GameDatabase.mending.damagedUpgrades,
    config => (config.id === 6
      ? new DamagedUpgradeState(config)
      : new RebuyableDamagedUpgradeState(config))
);

/**
 * @param {number} id
 * @return {DamagedUpgradeState|DamagedUpgradeState}
 */
export const DamagedUpgrade = id => DamagedUpgradeState.index[id];

export const DamagedUpgrades = {
  /**
  @type {(DamagedUpgradeState|DamagedUpgradeState)[]}
  */
  all: DamagedUpgradeState.index.compact(),
};