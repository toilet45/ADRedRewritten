import { BitPurchasableMechanicState, RebuyableMechanicState } from "../../game-mechanics";

class RaUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
  }

  get name() {
    return this.config.name;
  }

  get shortDescription() {
    return this.config.shortDescription ? this.config.shortDescription() : "";
  }

  get currency() {
    return Currency.raPoints;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.celestials.ra.shop.upgradeBits;
  }

  set bits(value) {
    player.celestials.ra.shop.upgradeBits = value;
  }

  onPurchased() {
    EventHub.dispatch(GAME_EVENT.RA_SHOP_UPGRADE_BOUGHT);
  }
}

class RebuyableRaUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.raPoints;
  }

  get boughtAmount() {
    return player.celestials.ra.shop.rebuyables[this.id];
  }

  set boughtAmount(value) {
    ayer.celestials.ra.shop.rebuyables[this.id] = value;
  }
}

RaUpgradeState.index = mapGameData(
  GameDatabase.celestials.raShopUpgrades,
  config => (config.id < 6
    ? new RebuyableRaUpgradeState(config)
    : new RaUpgradeState(config))
);

/**
 * @param {number} id
 * @return {RaUpgradeState|RebuyableRaUpgradeState}
 */
export const RaUpgrade = id => RaUpgradeState.index[id];

export const RaUpgrades = {
  /**
   * @type {(RaUpgradeState|RebuyableRaUpgradeState)[]}
   */
  all: RaUpgradeState.index.compact(),
  get allBought() {
    return (player.celestials.ra.shop.upgradeBits >> 6) + 1 === 1 << (GameDatabase.celestials.ra.shopUpgrades.length - 5);
  }
};
