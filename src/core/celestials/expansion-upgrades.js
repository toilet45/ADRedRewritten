import { BitPurchasableMechanicState, RebuyableMechanicState } from "../game-mechanics";

class ExpansionUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
    return this.config.name;
  }

  get shortDescription() {
    return this.config.shortDescription ? this.config.shortDescription() : "";
  }

  get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }

  get currency() {
    return Currency.enslavedPoints;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.celestials.enslaved.expandUpgradeBits;
  }

  set bits(value) {
    player.celestials.enslaved.expandUpgradeBits = value;
  }

  get isAvailableForPurchase() {
    return true;
  }

  get isPossible() {
    return true;
  }

  onPurchased() {
    EventHub.dispatch(GAME_EVENT.EXPANSION_UPGRADE_BOUGHT);
  }
}

class RebuyableExpansionUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.enslavedPoints;
  }

  get boughtAmount() {
    return player.celestials.enslaved.expandRebuyables[this.id];
  }

  set boughtAmount(value) {
    player.celestials.enslaved.expandRebuyables[this.id] = value;
  }
}

ExpansionUpgradeState.index = mapGameData(
  GameDatabase.mending.expansionUpgrades,
  config => (config.id < 6
    ? new RebuyableExpansionUpgradeState(config)
    : new ExpansionUpgradeState(config))
);

/**
 * @param {number} id
 * @return {ExpansionUpgradeState|ExpansionUpgradeState}
 */
export const ExpansionUpgrade = id => ExpansionUpgradeState.index[id];

export const ExpansionUpgrades = {
  /**
   * @type {(ExpansionUpgradeState|ExpansionUpgradeState)[]}
   */
  all: ExpansionUpgradeState.index.compact(),
  get allBought() {
    return (player.celestials.enslaved.expandUpgradeBits >> 6) + 1 ===
    1 << (GameDatabase.mending.expansionUpgrades.length - 5);
  }
};
