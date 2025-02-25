import { GameMechanicState, SetPurchasableMechanicState } from "./game-mechanics";
import { DC } from "./constants";
// eslint-disable-next-line sort-imports
import { BreakInfinityUpgrade } from "./break-infinity-upgrades";

class ChargedInfinityUpgradeState extends GameMechanicState {
  constructor(config, upgrade) {
    super(config);
    this._upgrade = upgrade;
  }

  get isEffectActive() {
    return this._upgrade.isBought && this._upgrade.isCharged;
  }
}

export class InfinityUpgradeState extends SetPurchasableMechanicState {
  constructor(config) {
    super(config);
    if (config.charged) {
      this._chargedEffect = new ChargedInfinityUpgradeState(config.charged, this);
    }
  }

  get currency() {
    return Currency.infinityPoints;
  }

  get set() {
    return player.infinityUpgrades;
  }

  get isAvailableForPurchase() {
    return this.config.checkRequirement?.() ?? true;
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
    return (Ra.chargesLeft !== 0 && this.id[0] !== "s") ||
      (Ra.breakChargesLeft !== 0 && this.id[0] === "s" && Ra.unlocks.breakCharges.isUnlocked);
  }

  charge() {
    // eslint-disable-next-line no-negated-condition
    if (this.id[0] === "s") player.celestials.ra.breakCharged.add(this.id);
    else player.celestials.ra.charged.add(this.id);
  }

  disCharge() {
    // eslint-disable-next-line no-negated-condition
    if (this.id[0] === "s") player.celestials.ra.breakCharged.delete(this.id);
    else player.celestials.ra.charged.delete(this.id);
  }
}

export function totalIPMult() {
  const disabledByECs = EternityChallenge(14).isRunning || EternityChallenge(15).isRunning ||
  EternityChallenge(21).isRunning || EternityChallenge(22).isRunning;
  if ((Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.INFINITY) || disabledByECs) {
    return DC.D1;
  }
  let ipMult = DC.D1
    .timesEffectsOf(
      TimeStudy(41),
      TimeStudy(51),
      TimeStudy(141),
      TimeStudy(142),
      TimeStudy(143),
      Achievement(85),
      Achievement(93),
      Achievement(116),
      Achievement(125),
      Achievement(141).effects.ipGain,
      InfinityUpgrade.ipMult,
      DilationUpgrade.ipMultDT,
      GlyphEffect.ipMult
    );

  if (MendingMilestone.one.isReached) {
    ipMult = ipMult.times(100);
  }

  ipMult = ipMult.times(Replicanti.amount.powEffectOf(AlchemyResource.exponential));
  return ipMult;
}

export function disChargeAll() {
  const upgrades = [
    InfinityUpgrade.totalTimeMult,
    InfinityUpgrade.dim18mult,
    InfinityUpgrade.dim36mult,
    InfinityUpgrade.resetBoost,
    InfinityUpgrade.buy10Mult,
    InfinityUpgrade.dim27mult,
    InfinityUpgrade.dim45mult,
    InfinityUpgrade.galaxyBoost,
    InfinityUpgrade.thisInfinityTimeMult,
    InfinityUpgrade.unspentIPMult,
    InfinityUpgrade.dimboostMult,
    InfinityUpgrade.ipGen
  ];
  for (const upgrade of upgrades) {
    if (upgrade.isCharged) {
      upgrade.disCharge();
    }
  }
  player.celestials.ra.disCharge = false;
  EventHub.dispatch(GAME_EVENT.INFINITY_UPGRADES_DISCHARGED);
}

export function breakDisChargeAll() {
  const upgrades = [
    InfinityUpgrade.skipReset1,
    InfinityUpgrade.skipReset2,
    InfinityUpgrade.skipReset3,
    InfinityUpgrade.skipResetGalaxy,
    BreakInfinityUpgrade.totalAMMult,
    BreakInfinityUpgrade.currentAMMult,
    BreakInfinityUpgrade.galaxyBoost,
    BreakInfinityUpgrade.infinitiedMult,
    BreakInfinityUpgrade.achievementMult,
    BreakInfinityUpgrade.slowestChallengeMult,
    BreakInfinityUpgrade.infinitiedGen,
    BreakInfinityUpgrade.autobuyMaxDimboosts,
    BreakInfinityUpgrade.autobuyerSpeed,
  ];
  for (const upgrade of upgrades) {
    if (upgrade.isCharged) {
      upgrade.disCharge();
    }
  }
  player.celestials.ra.breakDisCharge = false;
  EventHub.dispatch(GAME_EVENT.BREAK_INFINITY_UPGRADES_DISCHARGED);
}

// The repeatable 2xIP upgrade has an odd cost structure - it follows a shallow exponential (step *10) up to e3M, at
// which point it follows a steeper one (step *1e10) up to e6M before finally hardcapping. At the hardcap, there's
// an extra bump that increases the multipler itself from e993k to e1M. All these numbers are specified in
// GameDatabase.infinity.upgrades.ipMult
class InfinityIPMultUpgrade extends GameMechanicState {
  get cost() {
    if (this.purchaseCount.gte(this.purchasesAtIncrease)) {
      return this.config.costIncreaseThreshold
        .times(Decimal.pow(this.costIncrease, this.purchaseCount.sub(this.purchasesAtIncrease)));
    }
    return Decimal.pow(this.costIncrease, this.purchaseCount.add(1));
  }

  get purchaseCount() {
    return player.IPMultPurchases;
  }

  get purchasesAtIncrease() {
    return this.config.costIncreaseThreshold.log10().sub(1);
  }

  get hasIncreasedCost() {
    return this.purchaseCount.gte(this.purchasesAtIncrease);
  }

  get costIncrease() {
    return this.hasIncreasedCost ? 1e10 : 10;
  }

  get isCapped() {
    return this.cost.gte(this.config.costCap) || player.IPMultPurchases.gt(3300000);
  }

  get isBought() {
    return this.isCapped;
  }

  get isRequirementSatisfied() {
    return Achievement(41).isUnlocked;
  }

  get canBeBought() {
    return !Pelle.isDoomed && !this.isCapped && Currency.infinityPoints.gte(this.cost) && this.isRequirementSatisfied;
  }

  // This is only ever called with amount = 1 or within buyMax under conditions that ensure the scaling doesn't
  // change mid-purchase
  purchase(amount = 1) {
    if (!this.canBeBought) return;
    if (!TimeStudy(181).isBought) {
      Autobuyer.bigCrunch.bumpAmount(DC.D2.pow(amount));
    }
    Currency.infinityPoints.subtract(Decimal.sumGeometricSeries(amount, this.cost, this.costIncrease, 0));
    player.IPMultPurchases = player.IPMultPurchases.add(amount);
    GameUI.update();
  }

  buyMax() {
    if (!this.canBeBought) return;
    if (!this.hasIncreasedCost) {
      // Only allow IP below the softcap to be used
      const availableIP = Currency.infinityPoints.value.clampMax(this.config.costIncreaseThreshold);
      const purchases = Decimal.affordGeometricSeries(availableIP, this.cost, this.costIncrease, 0);
      if (purchases.lte(0)) return;
      this.purchase(purchases);
    }
    // Do not replace it with `if else` - it's specifically designed to process two sides of threshold separately
    // (for example, we have 1e4000000 IP and no mult - first it will go to (but not including) 1e3000000 and then
    // it will go in this part)
    if (this.hasIncreasedCost) {
      const availableIP = Currency.infinityPoints.value.clampMax(this.config.costCap);
      const purchases = Decimal.affordGeometricSeries(availableIP, this.cost, this.costIncrease, 0);
      if (purchases.lte(0)) return;
      this.purchase(purchases);
    }
  }
}

export const InfinityUpgrade = mapGameDataToObject(
  GameDatabase.infinity.upgrades,
  config => (config.id === "ipMult"
    ? new InfinityIPMultUpgrade(config)
    : new InfinityUpgradeState(config))
);
