import { isDecimal } from "../../utility/type-check";
import { BitPurchasableMechanicState, RebuyableMechanicState } from "../game-mechanics";

class MendingUpgradeState extends BitPurchasableMechanicState {
  constructor(config) {
    super(config);
    this.registerEvents(config.checkEvent, () => this.tryUnlock());
  }

  get name() {
    return this.config.name;
  }

  // Get requirement() {
  // return typeof this.config.requirement === "function" ? this.config.requirement() : this.config.requirement;
  // }
  //
  // get lockEvent() {
  // return typeof this.config.lockEvent === "function" ? this.config.lockEvent() : this.config.lockEvent;
  // }

  get currency() {
    return Currency.mendingPoints;
  }

  get bitIndex() {
    return this.id;
  }

  get bits() {
    return player.mending.upgradeBits;
  }

  set bits(value) {
    player.mending.upgradeBits = value;
  }

  // Get hasPlayerLock() {
  // return (player.reality.reqLock.reality & (1 << this.bitIndex)) !== 0;
  // }
  //
  // set hasPlayerLock(value) {
  // if (value) player.reality.reqLock.reality |= 1 << this.bitIndex;
  // else player.reality.reqLock.reality &= ~(1 << this.bitIndex);
  // }
  //
  // get isLockingMechanics() {
  // const shouldBypass = this.config.bypassLock?.() ?? false;
  // return this.hasPlayerLock && this.isPossible && !shouldBypass && !this.isAvailableForPurchase;
  // }
  //
  // // Required to be changed this way to avoid direct prop mutation in Vue components
  // setMechanicLock(value) {
  // this.hasPlayerLock = value;
  // }
  //
  // toggleMechanicLock() {
  // this.hasPlayerLock = !this.hasPlayerLock;
  // }
  //
  // // Note we don't actually show the modal if we already failed or unlocked it
  // tryShowWarningModal(specialLockText) {
  // if (this.isPossible && !this.isAvailableForPurchase) {
  //     Modal.upgradeLock.show({ upgrade: this, isImaginary: false, specialLockText });
  // }
  // }

  get isAvailableForPurchase() {
    // (player.mending.upgReqs & (1 << this.id)) !== 0;
    return true;
  }

  get isPossible() {
    // This.config.hasFailed ? !this.config.hasFailed() : true;
    return true;
  }

  tryUnlock() {
    const mendingReached = PlayerProgress.mendingUnlocked();
    if (!mendingReached || this.isAvailableForPurchase || !this.config.checkRequirement()) return;
    player.mending.upgReqs |= (1 << this.id);
    GameUI.notify.mending(`You've unlocked a Mending Upgrade: ${this.config.name}`);
    // This.hasPlayerLock = false;
  }
  // eslint-disable-next-line capitalized-comments

  onPurchased() {
    EventHub.dispatch(GAME_EVENT.MENDING_UPGRADE_BOUGHT);
    const id = this.id;
    switch (id) {
      case 19: {
        Achievement(193).unlock();
        break;
      }
      case 20: {
        player.reality.warped = true;
        break;
      }
      default:
    }
  }
}

class RebuyableMendingUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.mendingPoints;
  }

  get boughtAmount() {
    return player.mending.rebuyables[this.id];
  }

  set boughtAmount(value) {
    player.mending.rebuyables[this.id] = value;
  }

  get cap() {
    return this.config.cap;
  }

  get effects() {
    return this.config.effects?.();
  }

  // eslint-disable-next-line no-empty-function
  set effects(value) {}

  purchase() {
    if (!this.canBeBought) return false;
    if (GameEnd.creditsEverClosed) return false;
    if (!(this.id === 1 && Currency.mends.lt(3) && !player.softlockModals.mendingUpgradeOne)) {
      this.currency.subtract(this.cost);
      this.boughtAmount = this.boughtAmount.add(1);
      this.onPurchased();
      GameUI.update();
      return true;
    }
    player.softlockModals.mendingUpgradeOne = true;
    Modal.softcapPurchase.show(
      {
        upgradeName: "Mending Upgrade 1",
        exitFn: () => {
          this.currency.subtract(this.cost);
          this.boughtAmount = this.boughtAmount.add(1);
          this.onPurchased();
          GameUI.update();
          return true;
        }
      }
    );
    return false;
  }

  onPurchased() {
    const id = this.id;
    if (id === 1) Autobuyer.mend.bumpAmount(new Decimal(3));
  }
}

class HybridRebuyableMendingUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.mendingPoints;
  }

  get boughtAmount() {
    return player.mending.hybrids[this.id];
  }

  set boughtAmount(value) {
    player.mending.hybrids[this.id] = value;
  }

  get cap() {
    return this.config.purchaseLimit;
  }

  get isCapped() {
    return this.boughtAmount.toNumber() >= this.cap;
  }

  get effects() {
    return this.config.effects?.();
  }

  // eslint-disable-next-line no-empty-function
  set effects(value) {}
}

MendingUpgradeState.index = mapGameData(
  GameDatabase.mending.mendingUpgrades,
  // eslint-disable-next-line no-nested-ternary
  config => (config.isHybridRebuyable
    ? new HybridRebuyableMendingUpgradeState(config)
    : config.isRebuyable
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
    // eslint-disable-next-line max-len
    return (player.mending.upgradeBits >> 6) + 1 === 1 << (GameDatabase.mending.mendingUpgrades.length - 5);
  }
};
