import { DC } from "./constants";

export class Sacrifice {
  // This is tied to the "buying an 8th dimension" achievement in order to hide it from new players before they reach
  // sacrifice for the first time.
  static get isVisible() {
    return Achievement(18).isUnlocked || PlayerProgress.realityUnlocked();
  }

  static get canSacrifice() {
    return DimBoost.purchasedBoosts.gt(4) && !EternityChallenge(3).isRunning && this.nextBoost.gt(1) &&
      AntimatterDimension(8).totalAmount.gt(0) && Currency.antimatter.lt(Player.infinityLimit) &&
      !Enslaved.isRunning;
  }

  static get disabledCondition() {
    if (NormalChallenge(10).isRunning) return "8th Dimensions are disabled";
    if (EternityChallenge(3).isRunning || EternityChallenge(19).isRunning) return "Eternity Challenge 3";
    if (DimBoost.purchasedBoosts.lt(5)) return `Requires ${formatInt(5)} Dimension Boosts`;
    if (AntimatterDimension(8).totalAmount.eq(0)) return "No 8th Antimatter Dimensions";
    if (this.nextBoost.lte(1)) return `${formatX(1)} multiplier`;
    if (Player.isInAntimatterChallenge) return "Challenge goal reached";
    return "Need to Crunch";
  }

  static getSacrificeDescription(changes) {
    const f = (name, condition) => (name in changes ? changes[name] : condition);
    let factor = 2;
    let places = 1;
    let base = `(log₁₀(AD1)/${formatInt(10)})`;
    if (f("Challenge8isRunning", NormalChallenge(8).isRunning)) {
      factor = 1;
      base = "x";
    } else if (f("InfinityChallenge2isCompleted", InfinityChallenge(2).isCompleted)) {
      factor = 1 / 120;
      places = 3;
      base = "AD1";
    }

    const exponent = (1 +
      (f("Achievement32", Achievement(32).isEffectActive) ? Achievement(32).config.effect : 0) +
      (f("Achievement57", Achievement(57).isEffectActive) ? Achievement(57).config.effect : 0)
    ) * (1 +
      (f("Achievement88", Achievement(88).isEffectActive) ? Achievement(88).config.effect : 0) +
      (f("TimeStudy228", TimeStudy(228).isEffectActive) ? TimeStudy(228).config.effect : 0)
    ) * factor;
    return base + (exponent === 1 ? "" : formatPow(exponent, places, places));
  }

  // The code path for calculating the sacrifice exponent is pretty convoluted, but needs to be structured this way
  // in order to mostly replicate old pre-Reality behavior. There are two key things to note in how sacrifice behaves
  // which are not immediately apparent here; IC2 changes the formula by getting rid of a log10 (and therefore makes
  // sacrifice significantly stronger despite the much smaller exponent) and pre-Reality behavior assumed that the
  // player would already have ach32/57 by the time they complete IC2. As Reality resets achievements, we had to
  // assume that all things boosting sacrifice can be gotten independently, which resulted in some odd effect stacking.
  static get sacrificeExponent() {
    let base;
    // C8 seems weaker, but it actually follows its own formula which ends up being stronger based on how it stacks
    if (NormalChallenge(8).isRunning) base = DC.D1;
    // Pre-Reality this was 100; having ach32/57 results in 1.2x, which is brought back in line by changing to 120
    else if (InfinityChallenge(2).isCompleted) base = DC.D1.div(120);
    else base = DC.D2;

    // All the factors which go into the multiplier have to combine this way in order to replicate legacy behavior
    const preIC2 = Effects.sum(Achievement(32), Achievement(57)).add(1);
    const postIC2 = Effects.sum(Achievement(88), TimeStudy(228)).add(1);
    const triad = TimeStudy(304).effectOrDefault(1);

    return base.mul(preIC2).mul(postIC2).mul(triad);
  }

  static get nextBoost() {
    const nd1Amount = AntimatterDimension(1).amount;
    if (nd1Amount.eq(0)) return DC.D1;
    const sacrificed = player.sacrificed.clampMin(1);
    let prePowerSacrificeMult;
    // Pre-reality update C8 works really weirdly - every sacrifice, the current sacrifice multiplier gets applied to
    // ND8, then sacrificed amount is updated, and then the updated sacrifice multiplier then gets applied to a
    // different variable that is only applied during C8. However since sacrifice only depends on sacrificed ND1, this
    // can actually be done in a single calculation in order to handle C8 in a less hacky way.
    if (NormalChallenge(8).isRunning) {
      prePowerSacrificeMult = nd1Amount.pow(0.05).dividedBy(sacrificed.pow(0.04)).clampMin(1)
        .times(nd1Amount.pow(0.05).dividedBy(sacrificed.plus(nd1Amount).pow(0.04)));
    } else if (InfinityChallenge(2).isCompleted) {
      prePowerSacrificeMult = nd1Amount.dividedBy(sacrificed);
    } else {
      prePowerSacrificeMult = new Decimal((nd1Amount.log10().div(10)).div(Decimal.max(sacrificed.log10().div(10), 1)));
    }

    return prePowerSacrificeMult.clampMin(1).pow(this.sacrificeExponent);
  }

  static get totalBoost() {
    if (player.sacrificed.eq(0)) return DC.D1;
    // C8 uses a variable that keeps track of a sacrifice boost that persists across sacrifice-resets and isn't
    // used anywhere else, which also naturally takes account of the exponent from achievements and time studies.
    if (NormalChallenge(8).isRunning) {
      return player.chall8TotalSacrifice;
    }

    let prePowerBoost;

    if (InfinityChallenge(2).isCompleted) {
      prePowerBoost = player.sacrificed;
    } else {
      prePowerBoost = player.sacrificed.log10().div(10);
    }

    return prePowerBoost.clampMin(1).pow(this.sacrificeExponent);
  }
}

export function sacrificeReset() {
  if (!Sacrifice.canSacrifice) return false;
  if ((!player.break || (!InfinityChallenge.isRunning && NormalChallenge.isRunning)) &&
    Currency.antimatter.gt(DC.NUMMAX)) return false;
  if (
    NormalChallenge(8).isRunning &&
    (Sacrifice.totalBoost.gte(DC.NUMMAX))
  ) {
    return false;
  }
  EventHub.dispatch(GAME_EVENT.SACRIFICE_RESET_BEFORE);
  const nextBoost = Sacrifice.nextBoost;
  player.chall8TotalSacrifice = player.chall8TotalSacrifice.times(nextBoost);
  player.sacrificed = player.sacrificed.plus(AntimatterDimension(1).amount);
  const isAch118Unlocked = Achievement(118).canBeApplied;
  if (NormalChallenge(8).isRunning) {
    if (!isAch118Unlocked) {
      AntimatterDimensions.reset();
    }
    Currency.antimatter.reset();
  } else if (!isAch118Unlocked) {
    AntimatterDimensions.resetAmountUpToTier(NormalChallenge(12).isRunning ? 6 : 7);
  }
  player.requirementChecks.infinity.noSacrifice = false;
  EventHub.dispatch(GAME_EVENT.SACRIFICE_RESET_AFTER);
  return true;
}

export function sacrificeBtnClick() {
  if (!Sacrifice.isVisible || !Sacrifice.canSacrifice) return;
  if (player.options.confirmations.sacrifice) {
    Modal.sacrifice.show();
  } else {
    sacrificeReset();
  }
}

export class IDSacrifice {
  // This is tied to the "buying an 8th dimension" achievement in order to hide it from new players before they reach
  // sacrifice for the first time.
  static get isVisible() {
    return TimeStudy(72).isBought && Ra.unlocks.newVhard.canBeApplied;
  }

  static get canSacrifice() {
    return this.nextBoost.gt(1) && !(EternityChallenge(2).isRunning || EternityChallenge(10).isRunning ||
    EternityChallenge(16).isRunning || EternityChallenge(17).isRunning || EternityChallenge(19).isRunning)
  }

  static get disabledCondition() {
    if (EternityChallenge(2).isRunning || EternityChallenge(10).isRunning || EternityChallenge(16).isRunning ||
    EternityChallenge(17).isRunning || EternityChallenge(19).isRunning) return "Infinity Dimensions are disabled";
    if (this.nextBoost.lt(1.01)) return `${formatPow(1, 3, 3)} power`;
    return "Need to Crunch";
  }

  // Keep changes incase we want to use it in the future
  // eslint-disable-next-line no-unused-vars
  static getSacrificeDescription(changes) {
    return `log₁₀${formatPow(2, 0, 0)}(ID1)/${formatInt(50)} + ${formatInt(1)}`;
  }

  // Keep as not const incase we ever want to change
  static get sacrificeDevisor() {
    let base;
    // eslint-disable-next-line prefer-const
    base = new Decimal(50).recip();
    return base;
  }

  static get nextBoost() {
    const id1Amount = InfinityDimension(1).amount;
    if (id1Amount.lte(10)) return DC.D1;
    return stackedLog(id1Amount, 2).div(50).add(1);
  }

  static get totalBoost() {
    if (player.sacrifices.infinity.sacrificeNerf.gt(1)) {
      return DC.D5.pow(player.sacrifices.infinity.sacrificeNerf.log10()).recip();
    }
    if (player.sacrifices.infinity.mult.lt(1)) return DC.D1;
    return player.sacrifices.infinity.mult;
  }
}

export function IDSacrificeReset() {
  if (!IDSacrifice.canSacrifice) return false;
  EventHub.dispatch(GAME_EVENT.INF_SACRIFICE_RESET_BEFORE);
  const nextBoost = IDSacrifice.nextBoost;
  player.sacrifices.infinity.mult = nextBoost;
  player.sacrifices.infinity.sacrificeNerf = new Decimal(600);
  EventHub.dispatch(GAME_EVENT.INF_SACRIFICE_RESET_AFTER);
  return true;
}

export function IDsacrificeBtnClick() {
  if (!IDSacrifice.isVisible || !IDSacrifice.canSacrifice) return;
  if (player.options.confirmations.IDsacrifice) {
    Modal.IDsacrifice.show();
  } else {
    IDSacrificeReset();
  }
}

export class TDSacrifice {
  // This is tied to the "buying an 8th dimension" achievement in order to hide it from new players before they reach
  // sacrifice for the first time.
  static get isVisible() {
    return TimeStudy(73).isBought && Ra.unlocks.newVhard.canBeApplied;
  }

  static get canSacrifice() {
    return this.nextBoost.gt(1) && !(EternityChallenge(1).isRunning || EternityChallenge(10).isRunning ||
    EternityChallenge(16).isRunning || EternityChallenge(19).isRunning);
  }

  static get disabledCondition() {
    if (EternityChallenge(1).isRunning || EternityChallenge(10).isRunning || EternityChallenge(16).isRunning ||
    EternityChallenge(19).isRunning) return "Time Dimensions are disabled";
    if (this.nextBoost.lt(1.01)) return `${formatPow(1, 3, 3)} power`;
    return "Need to Crunch";
  }

  // Keep changes incase we want to use it in the future
  // eslint-disable-next-line no-unused-vars
  static getSacrificeDescription(changes) {
    return `log₁₀${formatPow(2, 0, 0)}(TD1)/${formatInt(44)} + ${formatInt(1)}`;
  }

  // Keep as not const incase we ever want to change
  static get sacrificeDevisor() {
    let base;
    // eslint-disable-next-line prefer-const
    base = new Decimal(44).recip();
    return base;
  }

  static get nextBoost() {
    const td1Amount = TimeDimension(1).amount;
    if (td1Amount.lte(10)) return DC.D1;
    return stackedLog(td1Amount, 2).div(44).add(1);
  }

  static get totalBoost() {
    if (player.sacrifices.eternity.sacrificeNerf.gt(1)) {
      return DC.D2.pow(player.sacrifices.eternity.sacrificeNerf.log10()).recip();
    }
    if (player.sacrifices.eternity.mult.lt(1)) return DC.D1;
    return player.sacrifices.eternity.mult;
  }
}

export function TDSacrificeReset() {
  if (!IDSacrifice.canSacrifice) return false;
  EventHub.dispatch(GAME_EVENT.ETER_SACRIFICE_RESET_BEFORE);
  const nextBoost = TDSacrifice.nextBoost;
  player.sacrifices.eternity.mult = nextBoost;
  player.sacrifices.eternity.sacrificeNerf = new Decimal(1800);
  EventHub.dispatch(GAME_EVENT.ETER_SACRIFICE_RESET_BEFORE);
  return true;
}

export function TDsacrificeBtnClick() {
  if (!TDsacrifice.isVisible || !TDsacrifice.canSacrifice) return;
  if (player.options.confirmations.TDsacrifice) {
    Modal.TDsacrifice.show();
  } else {
    TDSacrificeReset();
  }
}

