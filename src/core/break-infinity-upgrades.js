import { GameMechanicState, RebuyableMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { SpeedrunMilestones } from "./speedrun";

class ChargedBreakInfinityUpgradeState extends GameMechanicState {
  constructor(config, upgrade) {
    super(config);
    this._upgrade = upgrade;
  }

  get isEffectActive() {
    return this._upgrade.isBought && this._upgrade.isCharged;
  }
}


export class BreakInfinityUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    if (config.charged) {
      this._chargedEffect = new ChargedBreakInfinityUpgradeState(config.charged, this);
    }
  }

  get currency() {
    return Currency.infinityPoints;
  }

  get set() {
    return player.infinityUpgrades;
  }

  get isEffectActive() {
    return this.isBought && !this.isCharged;
  }

  get chargedEffect() {
    return this._chargedEffect;
  }

  purchase() {
    if (super.purchase()) {
      // This applies the 4th column of infinity upgrades retroactively
      if (this.config.id.includes("skip")) skipResetsIfPossible();
      EventHub.dispatch(GAME_EVENT.INFINITY_UPGRADE_BOUGHT);
      return true;
    }
    if (this.canCharge) {
      this.charge();
      EventHub.dispatch(GAME_EVENT.INFINITY_UPGRADE_CHARGED);
      return true;
    }
    return false;
  }

  get hasChargeEffect() {
    return this.config.charged !== undefined;
  }

  get isCharged() {
    return (player.celestials.ra.charged.has(this.id) || player.celestials.ra.breakCharged.has(this.id)) &&
    !(Teresa.hardModeToggled && Teresa.isRunning);
  }

  get canCharge() {
    if (Teresa.hardModeToggled && Teresa.isRunning) return false;
    if (Pelle.isDisabled("chargedInfinityUpgrades")) return false;
    if (this.isCharged) return false;
    if (!this.hasChargeEffect) return false;
    if (!this.isBought) return false;
    return (Ra.breakChargesLeft !== 0 && Ra.unlocks.breakCharges.isUnlocked);
  }

  charge() {
    // eslint-disable-next-line no-negated-condition
    player.celestials.ra.breakCharged.add(this.id);
  }

  disCharge() {
    // eslint-disable-next-line no-negated-condition
    player.celestials.ra.breakCharged.delete(this.id);
  }

  onPurchased() {
    if (this.id === "postGalaxy") {
      SpeedrunMilestones(7).tryComplete();
      PelleStrikes.powerGalaxies.trigger();
    }
  }
}

class RebuyableBreakInfinityUpgradeState extends RebuyableMechanicState {
  get currency() {
    return Currency.infinityPoints;
  }

  get boughtAmount() {
    return player.infinityRebuyables[this.id];
  }

  set boughtAmount(value) {
    player.infinityRebuyables[this.id] = value;
  }

  get isCapped() {
    return this.boughtAmount.gte(this.config.maxUpgrades);
  }

  onPurchased() {
    this.config.onPurchased?.();
  }
}

export const BreakInfinityUpgrade = mapGameDataToObject(
  GameDatabase.infinity.breakUpgrades,
  config => (config.rebuyable
    ? new RebuyableBreakInfinityUpgradeState(config)
    : new BreakInfinityUpgradeState(config))
);
