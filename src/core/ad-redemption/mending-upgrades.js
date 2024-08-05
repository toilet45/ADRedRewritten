import { BitPurchasableMechanicState, RebuyableMechanicState } from "../game-mechanics";

class MendingUpgradeState extends BitPurchasableMechanicState {
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

  /*get requirement() {
    return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  }

  get lockEvent() {
    return typeof this.config.lockEvent === "function" ? this.config.lockEvent() : this.config.lockEvent;
  }*/

  get currency() {
    return Currency.ad_red_mendingPoints;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.ad_red.mendingUpgradeBits;
  }

  set bits(value) {
    player.ad_red.mendingUpgradeBits = value;
  }

  /*get hasPlayerLock() {
    return (player.reality.reqLock.reality & (1 << this.bitIndex)) !== 0;
  }

  set hasPlayerLock(value) {
    if (value) player.reality.reqLock.reality |= 1 << this.bitIndex;
    else player.reality.reqLock.reality &= ~(1 << this.bitIndex);
  }

  get isLockingMechanics() {
    const shouldBypass = this.config.bypassLock?.() ?? false;
    return this.hasPlayerLock && this.isPossible && !shouldBypass && !this.isAvailableForPurchase;
  }

  // Required to be changed this way to avoid direct prop mutation in Vue components
  setMechanicLock(value) {
    this.hasPlayerLock = value;
  }

  toggleMechanicLock() {
    this.hasPlayerLock = !this.hasPlayerLock;
  }

  // Note we don't actually show the modal if we already failed or unlocked it
  tryShowWarningModal(specialLockText) {
    if (this.isPossible && !this.isAvailableForPurchase) {
      Modal.upgradeLock.show({ upgrade: this, isImaginary: false, specialLockText });
    }
  }*/

  get isAvailableForPurchase() {
    return true;//(player.ad_red.mendingUpgReqs & (1 << this.id)) !== 0;
  }

  get isPossible() {
    return true;//this.config.hasFailed ? !this.config.hasFailed() : true;
  }

  tryUnlock() {
    const mendingReached = PlayerProgress.mendingUnlocked();
    if (!mendingReached || this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.ad_red.mendingUpgReqs |= (1 << this.id);
    GameUI.notify.reality(`You've unlocked a Mending Upgrade: ${this.config.name}`);
    //this.hasPlayerLock = false;
  }

  onPurchased() {
    EventHub.dispatch(GAME_EVENT.AD_RED_MENDING_UPGRADE_BOUGHT);
    const id = this.id;
    
  }
}

class RebuyableMendingUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.ad_red_mendingPoints;
  }

  get boughtAmount() {
    return player.ad_red.mendingRebuyables[this.id];
  }

  set boughtAmount(value) {
    player.ad_red.mendingRebuyables[this.id] = value;
  }

  get cap(){
    return this.config.cap;
  }
}

MendingUpgradeState.index = mapGameData(
  GameDatabase.mending.mendingUpgrades,
  config => (config.id < 6
    ? new RebuyableMendingUpgradeState(config)
    : new MendingUpgradeState(config))
);

/**
 * @param {number} id
 * @return {MendingUpgradeState|RebuyableMendingUpgradeState}
 */
export const MendingUpgrade = id => MendingUpgradeState.index[id];

export const MendingUpgrades = {
  /**
   * @type {(MendingUpgradeState|RebuyableMendingUpgradeState)[]}
   */
  all: MendingUpgradeState.index.compact(),
  get allBought() {
    return (player.ad_red.mendingUpgradeBits >> 6) + 1 === 1 << (GameDatabase.ad_red.mendingUpgrades.length - 5);
  }
};
