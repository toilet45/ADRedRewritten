import TWEEN from "tween.js";

import { ElectronRuntime, SteamRuntime } from "@/steam";

import { DC } from "./core/constants";
import { deepmergeAll } from "@/utility/deepmerge";
import { DEV } from "@/env";
import { SpeedrunMilestones } from "./core/speedrun";
import { supportedBrowsers } from "./supported-browsers";

if (GlobalErrorHandler.handled) {
  throw new Error("Initialization failed");
}
GlobalErrorHandler.cleanStart = true;

export function playerInfinityUpgradesOnReset() {

  const infinityUpgrades = new Set(
    ["timeMult", "dimMult", "timeMult2",
      "skipReset1", "skipReset2", "unspentBonus",
      "27Mult", "18Mult", "36Mult", "resetMult",
      "skipReset3", "passiveGen", "45Mult",
      "resetBoost", "galaxyBoost", "skipResetGalaxy",
      "ipOffline"]
  );

  const breakInfinityUpgrades = new Set(
    ["timeMult", "dimMult", "timeMult2",
      "skipReset1", "skipReset2", "unspentBonus",
      "27Mult", "18Mult", "36Mult", "resetMult",
      "skipReset3", "passiveGen", "45Mult",
      "resetBoost", "galaxyBoost", "skipResetGalaxy",
      "totalMult", "currentMult", "postGalaxy",
      "challengeMult", "achievementMult", "infinitiedMult",
      "infinitiedGeneration", "autoBuyerUpgrade", "autobuyMaxDimboosts",
      "ipOffline"]
  );

  if (PelleUpgrade.keepBreakInfinityUpgrades.canBeApplied) {
    player.infinityUpgrades = new Set([...player.infinityUpgrades].filter(u => breakInfinityUpgrades.has(u)));
    return;
  }

  if (PelleUpgrade.keepInfinityUpgrades.canBeApplied) {
    player.infinityUpgrades = new Set([...player.infinityUpgrades].filter(u => infinityUpgrades.has(u)));
    player.infinityRebuyables = [DC.D0, DC.D0, DC.D0];
    GameCache.tickSpeedMultDecrease.invalidate();
    GameCache.dimensionMultDecrease.invalidate();
    return;
  }

  if (RealityUpgrade(10).isBought || EternityMilestone.keepBreakUpgrades.isReached) {
    player.infinityUpgrades = breakInfinityUpgrades;
    player.infinityRebuyables = [new Decimal(8), new Decimal(7), new Decimal(10)];
  } else if (EternityMilestone.keepInfinityUpgrades.isReached) {
    player.infinityUpgrades = infinityUpgrades;
    player.infinityRebuyables = [new Decimal(), new Decimal(), new Decimal()];
  } else {
    player.infinityUpgrades.clear();
    player.infinityRebuyables = [new Decimal(), new Decimal(), new Decimal()];
  }

  if (Pelle.isDoomed) {
    player.infinityUpgrades.clear();
    player.infinityRebuyables = [new Decimal(), new Decimal(), new Decimal()];
  }

  GameCache.tickSpeedMultDecrease.invalidate();
  GameCache.dimensionMultDecrease.invalidate();
}

export function stackedLogPower(value, stacks, power) {
  let outputVal = new Decimal(value);
  for (let i = 0; i < stacks; i++) {
    if (outputVal.abs().eq(0)) outputVal = new Decimal(1);
    outputVal = outputVal.log10();
  }
  outputVal = outputVal.pow(power);
  for (let i = 0; i < stacks; i++) {
    outputVal = Decimal.pow10(outputVal);
  }
  return outputVal;
}

export function stackedLog(value, stacks) {
  let outputVal = new Decimal(value);
  for (let i = 0; i < stacks; i++) {
    if (outputVal.abs().eq(0)) outputVal = new Decimal(1);
    outputVal = outputVal.log10();
  }
  return outputVal;
}

export function breakInfinity() {
  if (!Autobuyer.bigCrunch.hasMaxedInterval) return;
  if (InfinityChallenge.isRunning) return;
  for (const autobuyer of Autobuyers.all) {
    if (autobuyer.data.interval !== undefined) autobuyer.maxIntervalForFree();
  }
  // There's a potential migration edge case involving already-maxed autobuyers; this should give the achievement
  Achievement(61).tryUnlock();
  player.break = !player.break;
  TabNotification.ICUnlock.tryTrigger();
  EventHub.dispatch(player.break ? GAME_EVENT.BREAK_INFINITY : GAME_EVENT.FIX_INFINITY);
  GameUI.update();
}

// eslint-disable-next-line complexity
export function gainedInfinityPoints(mm1gen = false) {
  const div = new Decimal(Effects.min(
    308,
    Achievement(103),
    TimeStudy(111)
  )).toNumber();
  const ipSoftcap = new Decimal("e5e32").powEffectsOf(CelestialStudy(92), CelestialStudy(112));
  if (Pelle.isDisabled("IPMults")) {
    return Decimal.pow10(player.records.thisInfinity.maxAM.max(1).log10().div(div).sub(0.75))
      .timesEffectsOf(PelleRifts.vacuum)
      .times(Pelle.specialGlyphEffect.infinity)
      .pow(MendingUpgrade(6).effects.other)
      .floor();
  }
  if (EternityChallenge(16).isRunning) {
    const ip = Decimal.pow10(player.records.thisInfinity.maxAM.max(1).log10().div(div).sub(0.75));
    return ip.mul(Currency.infinityPower.value.max(1).sqrt());
  }
  if (EternityChallenge(20).isRunning) {
    return Decimal.pow10(player.replicanti.amount.max(1).log10().div(div).sub(0.75));
  }
  if (EternityChallenge(23).isRunning) {
    return Decimal.pow10(Tickspeed.perSecond.max(1).log10().max(1).log10().div(div).sub(0.75));
  }
  if (EternityChallenge(24).isRunning) {
    return player.dimensions.antimatter.reduce((a, b) => b.bought.mul(a), DC.D1);
  }
  let ip = (player.break || mm1gen)
    ? Decimal.pow10(player.records.thisInfinity.maxAM.max(1).log10().div(div).sub(0.75))
    : new Decimal(308 / div);
  if (EternityChallenge(22).isRunning) {
    if (ip.gt(ipSoftcap)) {
      ip = ip.log10().div("5e32").pow(0.666).mul("5e32").pow10();
    }
    return ip.floor();
  }
  if (Enslaved.isExpanded) return ip.times(ExpansionUpgrade(3).effectOrDefault(1)).floor();
  if (Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY) {
    ip = ip.min(DC.E200);
  }
  ip = ip.times(GameCache.totalIPMult.value);
  if (Teresa.isRunning && !Teresa.hardModeToggled) {
    ip = ip.pow(0.55);
  } else if (V.isRunning) {
    ip = ip.pow(0.5);
  } else if (Laitela.isRunning) {
    ip = dilatedValueOf(ip);
  } else if (Teresa.isRunning && Teresa.hardModeToggled) {
    ip = stackedLogPower(ip, 1, 0.75);
  }

  if (GlyphAlteration.isAdded("infinity")) {
    ip = ip.pow(getSecondaryGlyphEffect("infinityIP"));
  }

  ip = ip.pow(MendingUpgrade(6).effects.other);

  ip = ip.powEffectOf(CelestialStudy(101));

  if (EternityChallenge(13).isRunning) ip = stackedLogPower(ip, 1, 0.075);
  if (EternityChallenge(15).isRunning) ip = ip.max(1).log10();

  if (InfinityChallenge(9).isRunning) {
    let dimPurchases = new Decimal(0);
    for (let i = 1; i < 9; i++) {
      dimPurchases = dimPurchases.add(
        Laitela.continuumActive ? AntimatterDimension(i).bought : AntimatterDimension(i).continuumValue);
    }

    ip = ip.times(dimPurchases);
  }

  if (ip.gt(ipSoftcap)) {
    ip = ip.log10().div("5e32").pow(0.666).mul("5e32").pow10();
  }

  return ip.floor();
}

function totalEPMult() {
  if (Enslaved.isExpanded) return DC.D1;
  return Pelle.isDisabled("EPMults")
    ? Pelle.specialGlyphEffect.time.timesEffectOf(PelleRifts.vacuum.milestones[2])
    : getAdjustedGlyphEffect("cursedEP")
      .timesEffectsOf(
        EternityUpgrade.epMult,
        TimeStudy(61),
        TimeStudy(122),
        TimeStudy(121),
        TimeStudy(123),
        RealityUpgrade(12),
        GlyphEffect.epMult,
        ExpansionUpgrade(3)
      ).times(MendingMilestone.one.isReached ? GameDatabase.mending.mmOneBoost().ep : 1);
}

export function gainedEternityPoints() {
  const base = new Decimal(5).plusEffectOf(
    TimeStudy(306)
  );
  const epSoftcap = new Decimal("ee30").powEffectsOf(
    CelestialStudy(93), CelestialStudy(113));
  let ep = base.pow(player.records.thisEternity.maxIP.plus(
    gainedInfinityPoints()).log10().div(new Decimal(308).sub(PelleRifts.recursion.effectValue)).sub(0.7))
    .times(totalEPMult());

  if (Teresa.isRunning && !Teresa.hardModeToggled) {
    ep = ep.pow(0.55);
  } else if (V.isRunning) {
    ep = ep.pow(0.5);
  } else if (Laitela.isRunning) {
    ep = dilatedValueOf(ep);
  } else if (Teresa.isRunning && Teresa.hardModeToggled) {
    ep = stackedLogPower(ep, 1, 0.75);
  }
  if (GlyphAlteration.isAdded("time")) {
    ep = ep.pow(getSecondaryGlyphEffect("timeEP"));
  }

  ep = ep.pow(MendingUpgrade(6).effects.other);

  if (ep.gt(epSoftcap)) {
    ep = ep.log10().div("1e30").pow(0.777).mul("1e30").pow10();
  }

  return ep.floor();
}

export function requiredIPForEP(epAmount) {
  return Decimal.pow10((Decimal.log10(Decimal.divide(epAmount, totalEPMult()), 5).times(308).plus(0.7)))
    .clampMin(Number.MAX_VALUE);
}

export function gainedGlyphLevel() {
  const glyphState = getGlyphLevelInputs();
  const rawLevel = glyphState.rawLevel.floor();
  const actualLevel = glyphState.actualLevel.floor();
  return {
    rawLevel,
    actualLevel
  };
}

export function resetChallengeStuff() {
  player.chall2Pow = DC.D1;
  player.chall3Pow = DC.D0_01;
  Currency.matter.reset();
  player.chall8TotalSacrifice = DC.D1;
  player.postC4Tier = 1;
}

export function ratePerMinute(amount, time) {
  return Decimal.divide(amount, time.div(60 * 1000));
}

// eslint-disable-next-line max-params
export function addInfinityTime(trueTime, time, realTime, ip, infinities) {
  let challenge = "";
  if (player.challenge.normal.current) challenge = `Normal Challenge ${player.challenge.normal.current}`;
  if (player.challenge.infinity.current) challenge = `Infinity Challenge ${player.challenge.infinity.current}`;
  player.records.recentInfinities.pop();
  player.records.recentInfinities.unshift([trueTime, time, realTime, ip, infinities, challenge]);
  GameCache.bestRunIPPM.invalidate();
}

export function resetInfinityRuns() {
  player.records.recentInfinities = Array.from(
    { length: 10 },
    () => [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, DC.D1, ""]
  );
  GameCache.bestRunIPPM.invalidate();
}

// Player gains 50% of infinities they would get based on their best infinities/hour crunch if they have the
// milestone and turned on infinity autobuyer with 1 minute or less per crunch
export function getInfinitiedMilestoneReward(ms, considerMilestoneReached) {
  return Autobuyer.bigCrunch.autoInfinitiesAvailable(considerMilestoneReached) && !Enslaved.isExpanded
    ? Decimal.floor(player.records.thisEternity.bestInfinitiesPerMs.times(ms).dividedBy(2))
    : DC.D0;
}

// eslint-disable-next-line max-params
export function addEternityTime(trueTime, time, realTime, ep, eternities) {
  let challenge = "";
  if (player.challenge.eternity.current) {
    const currEC = player.challenge.eternity.current;
    const ec = EternityChallenge(currEC);
    const challText = player.dilation.active ? "Dilated EC" : "Eternity Challenge";
    challenge = `${challText} ${currEC} (${formatInt(ec.completions)}/${formatInt(ec.maxCompletions)})`;
  } else if (player.dilation.active) challenge = "Time Dilation";
  // If we call this function outside of dilation, it uses the existing AM and produces an erroneous number
  const gainedTP = player.dilation.active ? getTachyonGain() : DC.D0;
  player.records.recentEternities.pop();
  player.records.recentEternities.unshift([trueTime, time, realTime, ep, eternities, challenge, gainedTP]);
  GameCache.averageRealTimePerEternity.invalidate();
}

export function resetEternityRuns() {
  player.records.recentEternities = Array.from(
    { length: 10 },
    () => [Number.MAX_VALUE, DC.BEMAX, DC.BEMAX, DC.D1, DC.D1, "", DC.D0]
  );
  GameCache.averageRealTimePerEternity.invalidate();
}

// Player gains 50% of the eternities they would get if they continuously repeated their fastest eternity, if they
// have the auto-eternity milestone and turned on eternity autobuyer with 0 EP
export function getEternitiedMilestoneReward(ms, considerMilestoneReached) {
  return Autobuyer.eternity.autoEternitiesAvailable(considerMilestoneReached) && !Enslaved.isExpanded
    ? Decimal.floor(player.records.thisReality.bestEternitiesPerMs.times(ms).dividedBy(2))
    : DC.D0;
}

function isOfflineEPGainEnabled() {
  return player.options.offlineProgress && !Autobuyer.bigCrunch.autoInfinitiesAvailable() &&
    !Autobuyer.eternity.autoEternitiesAvailable() && !Enslaved.isExpanded;
}

export function getOfflineEPGain(ms) {
  if (!EternityMilestone.autoEP.isReached || !isOfflineEPGainEnabled() || Enslaved.isExpanded) return DC.D0;
  return player.records.bestEternity.bestEPminReality.times(
    TimeSpan.fromMilliseconds(new Decimal(ms)).totalMinutes.div(4));
}

// Note: realities and ampFactor must be distinct because there are a few things farther up which only multiply
// reality count and none of the other things
// eslint-disable-next-line max-params
export function addRealityTime(trueTime, time, realTime, rm, level, realities, ampFactor, projIM) {
  let reality = "";
  const celestials = [Teresa, Effarig, Enslaved, V, Ra, Laitela];
  for (const cel of celestials) {
    if (cel.isRunning) reality = cel.displayName;
  }
  const shards = Effarig.shardsGained;
  player.records.recentRealities.pop();
  player.records.recentRealities.unshift([trueTime, time, realTime, rm.times(ampFactor),
    realities, reality, level, shards.mul(ampFactor), projIM]);
}

// Yes this is a ton of params, but we also want this information stored for reasons.
// eslint-disable-next-line max-params
export function addMendingTime(trueTime, time, realTime, rm, level, mends, projIM, MvR) {
  const mending = "";
  player.records.recentMends.pop();
  player.records.recentMends.unshift([trueTime, time, realTime, MvR, mends, mending, rm, projIM, level]);
}

export function gainedInfinities() {
  if (EternityChallenge(4).isRunning || Pelle.isDisabled("InfinitiedMults") ||
    EternityChallenge(19).isRunning) return DC.D1;
  if (Enslaved.isExpanded) return new Decimal(1);
  let infGain = Effects.max(1, Achievement(87));

  infGain = infGain.timesEffectsOf(
    TimeStudy(32),
    RealityUpgrade(5),
    RealityUpgrade(7),
    Achievement(131).effects.infinitiesGain,
    Achievement(164),
    Ra.unlocks.continuousTTBoost.effects.infinity
  );

  if (MendingMilestone.one.isReached) {
    infGain = infGain.times(GameDatabase.mending.mmOneBoost().infinities);
  }

  infGain = infGain.times(getAdjustedGlyphEffect("infinityinfmult"));
  infGain = infGain.powEffectOf(SingularityMilestone.infinitiedPow);
  return infGain;
}

export function updateRefresh() {
  GameStorage.save();
  location.reload(true);
}

export const GAME_SPEED_EFFECT = {
  FIXED_SPEED: 1,
  TIME_GLYPH: 2,
  BLACK_HOLE: 3,
  TIME_STORAGE: 4,
  SINGULARITY_MILESTONE: 5,
  NERFS: 6,
  EXPO_BLACK_HOLE: 7
};

/**
  * @param {number[]?} effectsToConsider A list of various game speed changing effects to apply when calculating
  *   the game speed.  If left undefined, all effects will be applied.
  * @param {number?} blackHolesActiveOverride A numerical value which forces all black holes up to its specified index
  *   to be active for the purposes of game speed calculation. This is only used during offline black hole stuff.
  */

export function gameSpeedupSoftcap(speed) {
  if (speed.lt("1e500")) return speed;
  const dvsr = ExpansionUpgrade(12).isBought ? 400 : 308;
  let spd = speed.log10();
  spd = spd.sub(500);
  spd = spd.mul(Decimal.pow(1e-6, Decimal.log10(spd).pow(2).div(dvsr)));
  return spd.add(500).pow10();
}
// eslint-disable-next-line complexity
export function getGameSpeedupFactor(effectsToConsider, blackHolesActiveOverride) {
  let effects;
  if (effectsToConsider === undefined) {
    effects = [GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH, GAME_SPEED_EFFECT.BLACK_HOLE,
      GAME_SPEED_EFFECT.TIME_STORAGE, GAME_SPEED_EFFECT.SINGULARITY_MILESTONE, GAME_SPEED_EFFECT.NERFS,
      GAME_SPEED_EFFECT.EXPO_BLACK_HOLE, GAME_SPEED_EFFECT.SOFTCAP];
  } else {
    effects = effectsToConsider;
  }

  if (effects.includes(GAME_SPEED_EFFECT.FIXED_SPEED)) {
    if (EternityChallenge(12).isRunning || EternityChallenge(19).isRunning) {
      // eslint-disable-next-line capitalized-comments, no-inline-comments
      return Decimal.mul(1 / 1000, 1/* dev.speedUp */);
    }
  }

  let factor = DC.D1;
  if (effects.includes(GAME_SPEED_EFFECT.BLACK_HOLE)) {
    if (BlackHoles.areNegative) {
      factor = factor.mul(player.blackHoleNegative);
    } else if (!BlackHoles.arePaused) {
      for (const blackHole of BlackHoles.list) {
        if (!blackHole.isUnlocked) break;
        const isActive = blackHolesActiveOverride === undefined
          ? blackHole.isActive
          : blackHole.id <= blackHolesActiveOverride;
        if (!isActive) break;
        factor = factor.mul(blackHole.power.pow(BlackHoles.unpauseAccelerationFactor));
        factor = factor.mul(VUnlocks.achievementBH.effectOrDefault(1));
      }
    }
  }

  if (effects.includes(GAME_SPEED_EFFECT.SINGULARITY_MILESTONE)) {
    factor = factor.mul(SingularityMilestone.gamespeedFromSingularities.effectOrDefault(1));
  }

  if (effects.includes(GAME_SPEED_EFFECT.TIME_GLYPH)) {
    factor = factor.mul(getAdjustedGlyphEffect("timespeed"));
    factor = factor.pow(getAdjustedGlyphEffect("effarigblackhole"));
  }

  if (Enslaved.isStoringGameTime && effects.includes(GAME_SPEED_EFFECT.TIME_STORAGE)) {
    const storedTimeWeight = Ra.unlocks.autoPulseTime.canBeApplied ? 0.99 : 1;
    factor = factor.mul(1 - storedTimeWeight).add(storedTimeWeight);
  }

  // These effects should always be active, but need to be disabled during offline black hole simulations because
  // otherwise it gets applied twice
  if (effects.includes(GAME_SPEED_EFFECT.NERFS)) {
    if (Effarig.isRunning) {
      factor = Effarig.multiplier(factor);
    } else if (Laitela.isRunning) {
      const nerfModifier = Time.thisRealityRealTime.totalMinutes.div(10).clampMax(1);
      factor = factor.pow(nerfModifier);
    }
  }

  if (effects.includes(GAME_SPEED_EFFECT.EXPO_BLACK_HOLE)) {
    factor = factor.mul(ImaginaryBlackHole(1).isActive ? ImaginaryBlackHole(1).power : 1);
  }

  factor = factor.mul(PelleUpgrade.timeSpeedMult.effectValue);
  const forcedDisableDevspeed = EternityChallenge(12).isRunning || NormalChallenge(11).isRunning ||
    InfinityChallenge(6).isRunning || InfinityChallenge(8).isRunning || EternityChallenge(19).isRunning;
  if (!Ra.unlocks.gamespeedUncap.canBeApplied) factor = factor.clampMin(1e-300).clampMax(1e300);
  factor = factor.mul(forcedDisableDevspeed ? 1 : dev.speedUp);

  if (factor.gt(1)) factor = factor.pow(CelestialStudy(81).effectOrDefault(1));
  if (factor.gt(1)) factor = factor.pow(ExpansionUpgrade(6).effectOrDefault(1));
  if (effects.includes(GAME_SPEED_EFFECT.SOFTCAP)) factor = gameSpeedupSoftcap(factor);
  if (EternityChallenge(16).isRunning && effects.includes(GAME_SPEED_EFFECT.SOFTCAP)) factor = factor.clampMax(DC.D1);
  factor = factor.mul(ExpansionUpgrade(4).effectOrDefault(1));
  if (ExpansionUpgrade(7).isBought && factor.gt(1)) factor = factor.pow(1.234);
  if (Enslaved.isExpanded) factor = factor.pow(factor.add(1).log10().add(1).log10().add(1));
  return factor;
}

export function getRealTimeSpeedupFactor() {
  if (EternityChallenge(12).isRunning || !ImaginaryBlackHole(1).isActive) return new Decimal(1);
  let x = ImaginaryBlackHole(1).rtPowerUpgrade.value;
  x = x.timesEffectOf(RaUpgrade(13));
  return x;
}

export function getExpoSpeedupFactor() {
  return new Decimal(1);
  // A.mul(ImaginaryBlackHole(2).power);
}
export function getGameSpeedupForDisplay() {
  const speedFactor = getGameSpeedupFactor();
  if (
    Enslaved.isAutoReleasing &&
    Enslaved.canRelease(true) &&
    !BlackHoles.areNegative &&
    !Pelle.isDisabled("blackhole")
  ) {
    const x = Decimal.max(Enslaved.autoReleaseSpeed, speedFactor);
    return Ra.unlocks.gamespeedUncap.canBeApplied ? x : x.clampMax(1e300);
  }
  return speedFactor.div(dev.speedUp);
}

// Seperated for organisation - Very few things should need this
export function trueTimeMechanics(trueDiff) {
  // Upgrade multiversal galaxies in player object
  player.mending.multiversalGalaxies = MendingUpgrade(16).effects.galaxies
    .add(InfinityUpgrade.skipResetGalaxy.chargedEffect.effectOrDefault(0))
    .add(getFreeGalxiesFromMvD());

  // Ra-Nameless auto-release stored time (once every 5 ticks)
  if (Enslaved.isAutoReleasing) {
    Enslaved.autoReleaseTick++;
  }
  if (Enslaved.autoReleaseTick >= 5 && !Enslaved.isExpanded) {
    Enslaved.autoReleaseTick = 0;
    Enslaved.useStoredTime(true);
    Enslaved.isReleaseTick = true;
  } else if (Enslaved.autoReleaseTick >= 5) {
    Enslaved.autoReleaseTick = 0;
  } else if (!Enslaved.isReleaseTick) {
    Enslaved.nextTickDiff = new Decimal(trueDiff);
  }

  Autobuyers.tick();
  Tutorial.tutorialLoop();

  if (Achievement(165).isUnlocked && player.celestials.effarig.autoAdjustGlyphWeights) {
    autoAdjustGlyphWeights();
  }
}

// Separated out for organization; however this is also used in more than one spot in gameLoop() as well. Returns
// true if the rest of the game loop should be skipped
export function realTimeMechanics(realDiff, trueDiff) {
  // Ra memory generation bypasses stored real time, but memory chunk generation is disabled when storing real time.
  // This is in order to prevent players from using time inside of Ra's reality for amplification as well
  Ra.memoryTick(realDiff, !Enslaved.isStoringRealTime);
  if (AlchemyResource.momentum.isUnlocked) {
    player.celestials.ra.momentumTime = player.celestials.ra.momentumTime.add(
      realDiff.times(Achievement(175).effectOrDefault(1)));
  }

  DarkMatterDimensions.tick(realDiff);
  MultiversalDimensions.tick(realDiff);

  player.sacrifices.infinity.sacrificeNerf = player.sacrifices.infinity.sacrificeNerf.sub(realDiff.div(1e3));
  player.sacrifices.eternity.sacrificeNerf = player.sacrifices.eternity.sacrificeNerf.sub(realDiff.div(1e3));

  // When storing real time, skip everything else having to do with production once stats are updated
  if (Enslaved.isStoringRealTime) {
    player.records.realTimePlayed = player.records.realTimePlayed.add(realDiff);
    player.records.thisInfinity.realTime = player.records.thisInfinity.realTime.add(realDiff);
    player.records.thisEternity.realTime = player.records.thisEternity.realTime.add(realDiff);
    player.records.thisReality.realTime = player.records.thisReality.realTime.add(realDiff);
    player.records.thisMend.realTime = player.records.thisMend.realTime.add(realDiff);

    player.records.trueTimePlayed += trueDiff;
    player.records.thisInfinity.trueTime += trueDiff;
    player.records.thisEternity.trueTime += trueDiff;
    player.records.thisReality.trueTime += trueDiff;
    player.records.thisMend.trueTime += trueDiff;

    Enslaved.storeRealTime(realDiff);
    // Most autobuyers will only tick usefully on the very first tick, but this needs to be here in order to allow
    // the autobuyers unaffected by time storage to tick as well
    Autobuyers.tick();
    GameUI.update();
    return true;
  }

  BlackHoles.updatePhases(realDiff);
  return false;
}

// "passDiff" is in ms. It is only unspecified when it's being called normally and not due to simulating time, in which
// case it uses the gap between now and the last time the function was called (capped at a day). This is on average
// equal to the update rate, but may be much larger if the game was unfocused or the device went to sleep for some time.
// eslint-disable-next-line complexity
export function gameLoop(passedDiff, options = {}) {
  PerformanceStats.start("Frame Time");
  PerformanceStats.start("Game Update");

  EventHub.dispatch(GAME_EVENT.GAME_TICK_BEFORE);
  // In certain cases we want to allow the player to interact with the game's settings and tabs, but prevent any actual
  // resource generation from happening - in these cases, we have to make sure this all comes before the hibernation
  // check or else it'll attempt to run the game anyway
  if (Speedrun.isPausedAtStart() || GameEnd.creditsEverClosed) {
    GameUI.update();
    return;
  }
  const thisUpdate = Date.now();
  const passDiff = passedDiff === undefined
    ? Math.clamp(thisUpdate - player.lastUpdate, 1, 8.64e7) : passedDiff;
    // This is really, really bad but we dont want 0 getting passed into every function on the fucking earth
  let diff = new Decimal(passDiff);
  const trueDiff = passDiff === undefined
    ? Math.clamp(thisUpdate - player.lastUpdate, 1, 8.64e7) /* (dev.speedUp ?? 1)*/
    : passDiff;
  // eslint-disable-next-line prefer-const
  let realDiff = new Decimal(trueDiff);
  if (!GameStorage.ignoreBackupTimer) player.backupTimer += trueDiff;

  realDiff = realDiff.mul(getRealTimeSpeedupFactor());
  // For single ticks longer than a minute from the GameInterval loop, we assume that the device has gone to sleep or
  // hibernation - in those cases we stop the interval and simulate time instead. The gameLoop interval automatically
  // restarts itself at the end of the simulateTime call. This will not trigger for an unfocused game, as this seems to
  // result in a ~1 second tick rate for browsers.
  // Note that we have to explicitly call all the real-time mechanics with the existing value of realDiff, because
  // simply letting it run through simulateTime seems to result in it using zero
  if (player.options.hibernationCatchup && passDiff === undefined && trueDiff > 6e4 /* (dev.speedUp ?? 1)*/) {
    GameIntervals.gameLoop.stop();
    simulateTime(trueDiff / 1000, true);
    trueTimeMechanics(trueDiff);
    realTimeMechanics(realDiff, trueDiff);
    return;
  }

  trueTimeMechanics(trueDiff);
  if (diff === undefined || Enslaved.isReleaseTick) {
    diff = new Decimal(Enslaved.nextTickDiff);
  }
  diff = diff.mul(getRealTimeSpeedupFactor());
  // Run all the functions which only depend on real time and not game time, skipping the rest of the loop if needed
  if (realTimeMechanics(realDiff, trueDiff)) return;

  // We do these after autobuyers, since it's possible something there might
  // change a multiplier.
  GameCache.antimatterDimensionCommonMultiplier.invalidate();
  GameCache.antimatterDimensionFinalMultipliers.invalidate();
  GameCache.infinityDimensionCommonMultiplier.invalidate();
  GameCache.timeDimensionCommonMultiplier.invalidate();
  GameCache.totalIPMult.invalidate();

  const fixedSpeedActive = EternityChallenge(12).isRunning || EternityChallenge(16).isRunning;
  if (!Enslaved.isReleaseTick && !fixedSpeedActive) {
    let speedFactor;
    if (options.blackHoleSpeedup === undefined) {
      speedFactor = getGameSpeedupFactor();
    } else {
      // This is only called from simulateTime() and is calculated externally in order to avoid weirdness when game
      // speed is directly nerfed
      speedFactor = options.blackHoleSpeedup;
    }

    if (Enslaved.isStoringGameTime && !fixedSpeedActive) {
      // These variables are the actual game speed used and the game speed unaffected by time storage, respectively
      const reducedTimeFactor = getGameSpeedupFactor();
      const totalTimeFactor = getGameSpeedupFactor([GAME_SPEED_EFFECT.FIXED_SPEED, GAME_SPEED_EFFECT.TIME_GLYPH,
        GAME_SPEED_EFFECT.BLACK_HOLE, GAME_SPEED_EFFECT.SINGULARITY_MILESTONE, GAME_SPEED_EFFECT.EXPO_BLACK_HOLE]);
      const amplification = Ra.unlocks.improvedStoredTime.effects.gameTimeAmplification.effectOrDefault(1);
      const beforeStore = player.celestials.enslaved.stored;
      player.celestials.enslaved.stored = Decimal.clampMax(player.celestials.enslaved.stored
        .add(diff.times(totalTimeFactor.sub(reducedTimeFactor)).times(amplification)), Enslaved.timeCap);
      Enslaved.currentBlackHoleStoreAmountPerMs = (player.celestials.enslaved.stored.sub(beforeStore)).div(diff);
      speedFactor = reducedTimeFactor;
    }
    diff = diff.times(speedFactor);
  } else if (fixedSpeedActive) {
    diff = diff.times(getGameSpeedupFactor());
    Enslaved.currentBlackHoleStoreAmountPerMs = DC.D0;
  }
  player.celestials.ra.peakGamespeed = player.celestials.ra.peakGamespeed.clampMin(getGameSpeedupFactor());
  Enslaved.isReleaseTick = false;

  // These need to all be done consecutively in order to minimize the chance of a reset occurring between real time
  // updating and game time updating. This is only particularly noticeable when game speed is 1 and the player
  // expects to see identical numbers. We also don't increment the timers if the game has been beaten (Achievement 188)
  const isEndReached = Achievement(188).isUnlocked && !PlayerProgress.mendingUnlocked();
  if (!isEndReached) {
    player.records.realTimeDoomed = player.records.realTimeDoomed.add(realDiff);
    player.records.realTimePlayed = player.records.realTimePlayed.add(realDiff);
    player.records.totalTimePlayed = player.records.totalTimePlayed.add(diff);
    player.records.thisInfinity.realTime = player.records.thisInfinity.realTime.add(realDiff);
    player.records.thisInfinity.time = player.records.thisInfinity.time.add(diff);
    player.records.thisEternity.realTime = player.records.thisEternity.realTime.add(realDiff);
    if (Enslaved.isRunning && Enslaved.feltEternity && !EternityChallenge(12).isRunning &&
    !EternityChallenge(19).isRunning) {
      player.records.thisEternity.time = player.records.thisEternity.time.add(
        diff.times(1 + Currency.eternitiesTotal.value.min(1e66).toNumber()));
    } else {
      player.records.thisEternity.time = player.records.thisEternity.time.add(diff);
    }
    player.records.thisReality.realTime = player.records.thisReality.realTime.add(realDiff);
    player.records.thisReality.time = player.records.thisReality.time.add(diff);

    player.records.thisMend.realTime = player.records.thisMend.realTime.add(realDiff);
    player.records.thisMend.time = player.records.thisMend.time.add(diff);

    player.records.trueTimePlayed += trueDiff;
    player.records.thisInfinity.trueTime += trueDiff;
    player.records.thisEternity.trueTime += trueDiff;
    player.records.thisReality.trueTime += trueDiff;
    player.records.thisMend.trueTime += trueDiff;
  }

  DeltaTimeState.update(trueDiff, realDiff, diff);

  updateNormalAndInfinityChallenges(diff);

  // IP generation is broken into a couple of places in gameLoop; changing that might change the
  // behavior of eternity farming.
  preProductionGenerateIP(diff);

  if (!(Pelle.isDoomed || Enslaved.isExpanded)) {
    passivePrestigeGen();
  }


  applyAutoprestige(realDiff);
  updateImaginaryMachines(realDiff);

  const uncountabilityGain = new Decimal(AlchemyResource.uncountability.effectValue)
    .times(Time.realDeltaTime.totalSeconds);
  Currency.realities.add(uncountabilityGain);
  Currency.perkPoints.add(uncountabilityGain);

  if (Perk.autocompleteEC1.canBeApplied || (MendingUpgrade(14).isBought && !Laitela.isDamaged)) {
    player.reality.lastAutoEC = player.reality.lastAutoEC.add(realDiff);
  }

  EternityChallenge(12).tryFail();
  Achievements._power.invalidate();

  TimeDimensions.tick(diff);
  InfinityDimensions.tick(diff);
  AntimatterDimensions.tick(diff);

  const gain = Decimal.clampMin(FreeTickspeed.fromShards(Currency.timeShards.value).newAmount
    .sub(player.totalTickGained), 0);
  player.totalTickGained = player.totalTickGained.add(gain);

  updatePrestigeRates();
  tryCompleteInfinityChallenges();

  EternityChallenges.autoComplete.tick();

  replicantiLoop(diff);

  if (PlayerProgress.dilationUnlocked()) {
    Currency.dilatedTime.add(getDilationGainPerSecond().times(diff.div(1000)));
  }

  updateTachyonGalaxies();
  Currency.timeTheorems.add(getTTPerSecond().times(diff.div(1000)));
  InfinityDimensions.tryAutoUnlock();

  // Unlocks dilation at a certain total TT count for free, but we add the cost first in order to make
  // sure that TT count doesn't go negative and that we can actually buy it. This technically bumps the max theorem
  // amount up as well, but at this point of the game 5k TT is insignificant to basically all other sources of TT.
  if (Ra.unlocks.autoUnlockDilation.canBeApplied &&
    Currency.timeTheorems.max.gte(TimeStudy.dilation.totalTimeTheoremRequirement) &&
    !isInCelestialReality() &&
    !Pelle.isDoomed) {
    Currency.timeTheorems.add(TimeStudy.dilation.cost);
    TimeStudy.dilation.purchase(true);
  }

  applyAutoUnlockPerks();
  if (GlyphSelection.active) GlyphSelection.update(gainedGlyphLevel());

  // There are some external checks which prevent excessive resource gain with Teresa-25; it may give TP outside of
  // dilation, but the TP gain function is also coded to behave differently if it's active
  const teresa1 = player.dilation.active && Ra.unlocks.autoTP.canBeApplied;
  const teresa25 = !isInCelestialReality() && Ra.unlocks.unlockDilationStartingTP.canBeApplied;
  if ((teresa1 || teresa25 || MendingUpgrade(15).isBought) && !Pelle.isDoomed) rewardTP();

  if (Enslaved.canTickHintTimer) {
    player.celestials.enslaved.hintUnlockProgress += Enslaved.isRunning ? realDiff.clampMax(1e10).toNumber()
      : realDiff.mul(0.4).clampMax(1e10).toNumber();
    if (player.celestials.enslaved.hintUnlockProgress > (TimeSpan.fromHours(5).totalMilliseconds.toNumber())) {
      EnslavedProgress.hintsUnlocked.giveProgress();
      Enslaved.quotes.hintUnlock.show();
    }
  }

  laitelaRealityTick(realDiff);
  Achievements.autoAchieveUpdate(diff);
  V.checkForUnlocks();
  AutomatorBackend.update(trueDiff);
  Pelle.gameLoop(realDiff);
  GalaxyGenerator.loop(realDiff);
  GameEnd.gameLoop(trueDiff);

  if (!Enslaved.canAmplify) {
    Enslaved.boostReality = false;
  }

  // Stopping these checks after CREDITS_START reduces lag and allows for the glyph customization modal to appear
  if (GameEnd.endState < END_STATE_MARKERS.CREDITS_START) {
    if (Tabs.current.isPermanentlyHidden) {
      const tab = Tabs.all.reverse().find(t => !t.isPermanentlyHidden && t.id !== 10);
      if (tab) tab.show(true);
      else [...Tab.dimensions.subtabs].reverse().find(t => !t.isPermanentlyHidden).show(true);
    }

    if (Tabs.current.subtabs.find(t => t.isOpen).isPermanentlyHidden) {
      [...Tab.dimensions.subtabs].reverse().find(t => !t.isPermanentlyHidden).show(true);
    }
  }

  EventHub.dispatch(GAME_EVENT.GAME_TICK_AFTER);
  GameUI.update();
  player.lastUpdate = thisUpdate;
  PerformanceStats.end("Game Update");
}

function updatePrestigeRates() {
  const currentIPmin = gainedInfinityPoints().div(Decimal.max(0.0005, Time.thisInfinityRealTime.totalMinutes));
  if (currentIPmin.gt(player.records.thisInfinity.bestIPmin) && Player.canCrunch) {
    player.records.thisInfinity.bestIPmin = currentIPmin;
    player.records.thisInfinity.bestIPminVal = gainedInfinityPoints();
  }

  const currentEPmin = gainedEternityPoints().dividedBy(Decimal.max(0.0005, Time.thisEternityRealTime.totalMinutes));
  if (currentEPmin.gt(player.records.thisEternity.bestEPmin) && Player.canEternity) {
    player.records.thisEternity.bestEPmin = currentEPmin;
    player.records.thisEternity.bestEPminVal = gainedEternityPoints();
  }

  const currentRSmin = Effarig.shardsGained.div(Decimal.max(0.0005, Time.thisRealityRealTime.totalMinutes));
  if (currentRSmin.gt(player.records.thisReality.bestRSmin && isRealityAvailable())) {
    player.records.thisReality.bestRSmin = currentRSmin;
    player.records.thisReality.bestRSminVal = Effarig.shardsGained;
  }
}

function passivePrestigeGen() {
  let eternitiedGain = DC.D0;
  if (RealityUpgrade(14).isBought) {
    eternitiedGain = DC.D1.timesEffectsOf(
      Achievement(113),
      RealityUpgrade(3),
      RealityUpgrade(14)
    );
    eternitiedGain = Decimal.times(eternitiedGain, getAdjustedGlyphEffect("timeetermult"));
    eternitiedGain = new Decimal(Time.deltaTime).times(
      Decimal.pow(eternitiedGain, AlchemyResource.eternity.effectValue));
    player.reality.partEternitied = player.reality.partEternitied.plus(eternitiedGain);
    Currency.eternities.add(Enslaved.isExpanded ? 0 : player.reality.partEternitied.floor());
    player.reality.partEternitied = player.reality.partEternitied.sub(player.reality.partEternitied.floor());
  }

  if (!EternityChallenge(4).isRunning && !EternityChallenge(19).isRunning) {
    let infGen = DC.D0;
    if (BreakInfinityUpgrade.infinitiedGen.isBought && !Enslaved.isExpanded) {
      // Multipliers are done this way to explicitly exclude ach87 and TS32
      infGen = infGen.plus(Time.deltaTimeMs.div(2).div(Decimal.clampMin(50, player.records.bestInfinity.time)));
      infGen = infGen.timesEffectsOf(
        RealityUpgrade(5),
        RealityUpgrade(7),
        Ra.unlocks.continuousTTBoost.effects.infinity
      );
      infGen = infGen.times(getAdjustedGlyphEffect("infinityinfmult"));
    }
    if (RealityUpgrade(11).isBought) {
      infGen = infGen.plus(RealityUpgrade(11).effectValue.times(Time.deltaTime));
    }
    if (EffarigUnlock.eternity.isUnlocked) {
      // We consider half of the eternities we gained above this tick
      // to have been gained before the infinities, and thus not to
      // count here. This gives us the desirable behavior that
      // infinities and eternities gained overall will be the same
      // for two ticks as for one tick of twice the length.
      infGen = infGen.plus(gainedInfinities().times(
        Currency.eternities.value.minus(eternitiedGain.div(2).floor())).times(Time.deltaTime));
    }
    infGen = infGen.plus(player.partInfinitied);
    if (BreakInfinityUpgrade.infinitiedGen.isCharged) {
      infGen = infGen.pow(1.33);
    }
    Currency.infinities.add(Enslaved.isExpanded ? 0 : infGen.floor());
    player.partInfinitied = infGen.minus(infGen.floor()).toNumber();
  }
  if (MendingMilestone.eight.isReached) {
    player.celestials.teresa.pouredAmount = Math.min(1e24, Decimal.max(Currency.realityMachines.value, player.celestials.teresa.pouredAmount).toNumber())
    Teresa.checkForUnlocks();
  }
  if (Ra.unlocks.passiveTeresa.canBeApplied) {
    player.celestials.teresa.bestRunAM = Decimal.max(player.celestials.teresa.bestRunAM, Currency.antimatter.value.pow(0.2));
  }
  if (Ra.unlocks.annihilationGain.canBeApplied) {
    Laitela.celestial.darkMatterMult = Laitela.celestial.darkMatterMult.add(
      Laitela.darkMatterMultGain.times(Time.realDeltaTimeMs.div(2000)));
  }
}

// Applies all perks which automatically unlock things when passing certain thresholds, needs to be checked every tick
function applyAutoUnlockPerks() {
  if (!TimeDimension(8).isUnlocked && Perk.autounlockTD.canBeApplied) {
    for (let dim = 5; dim <= 8; ++dim) TimeStudy.timeDimension(dim).purchase();
  }
  if (MendingUpgrade(9).isBought && Perk.autounlockTD.canBeApplied && !Laitela.isDamaged) {
    TimeStudy.TGformula.purchase(true);
    TimeStudy.TPformula.purchase(true);
  }
  if (Perk.autounlockDilation3.canBeApplied) buyDilationUpgrade(DilationUpgrade.ttGenerator.id);
  if (Perk.autounlockReality.canBeApplied) TimeStudy.reality.purchase(true);
  applyEU2();
}

function laitelaRealityTick(realDiff) {
  const laitelaInfo = player.celestials.laitela;
  if (Laitela.isDamaged) {
    for (const quote of Laitela.quotes.all.slice(10)) {
      if (quote.requirement) {
        quote.show();
      }
    }
  }
  if (!Laitela.isRunning) return;
  if (laitelaInfo.entropy.gte(0)) {
    laitelaInfo.entropy = laitelaInfo.entropy.add(realDiff.div(1e3).mul(Laitela.entropyGainPerSecond));
  }

  // Setting entropy to -1 on completion prevents the modal from showing up repeatedly
  if (laitelaInfo.entropy.gte(1)) {
    let completionText = `Lai'tela's Reality has been destabilized after ${Time.thisRealityTrueTime.toStringShort()}.`;
    laitelaInfo.entropy = DC.DM1;
    const oldInfo = {
      fastestCompletion: laitelaInfo.fastestCompletion,
      difficultyTier: laitelaInfo.difficultyTier,
      realityReward: Laitela.realityReward
    };
    laitelaInfo.thisCompletion = Time.thisRealityTrueTime.totalSeconds;
    laitelaInfo.fastestCompletion = laitelaInfo.thisCompletion.clampMax(laitelaInfo.fastestCompletion);
    clearCelestialRuns();
    const destabilising = Time.thisRealityTrueTime.totalSeconds.lte(30);
    if (destabilising) {
      laitelaInfo.difficultyTier++;
      laitelaInfo.fastestCompletion = new Decimal(300);
      completionText += laitelaBeatText(Laitela.maxAllowedDimension + 1);
      for (const quote of Laitela.quotes.all) {
        if (quote.requirement) {
          quote.show();
        }
      }
    }
    if (Laitela.realityReward.gt(oldInfo.realityReward)) {
      completionText += `<br><br>Dark Matter Multiplier: ${formatX(oldInfo.realityReward, 2, 2)}
      ➜ ${formatX(Laitela.realityReward, 2, 2)}<br>Best Completion Time: `;
      const firstAttempt =
        oldInfo.fastestCompletion.eq(3600) || oldInfo.fastestCompletion.eq(300) && oldInfo.difficultyTier > 0;
      completionText += `${firstAttempt ? "None" : TimeSpan.fromSeconds(oldInfo.fastestCompletion).toStringShort()} ➜
        ${destabilising ? "Destabilized" : TimeSpan.fromSeconds(laitelaInfo.fastestCompletion).toStringShort()}
        <br>Highest Active Dimension: ${destabilising ? `${formatInt(8 - oldInfo.difficultyTier)} ➜` : ""}
        ${formatInt(8 - laitelaInfo.difficultyTier)}`;
      player.records.bestReality.laitelaSet = Glyphs.copyForRecords(Glyphs.active.filter(g => g !== null));
    } else {
      completionText += ` You need to destabilize in faster than
        ${TimeSpan.fromSeconds(laitelaInfo.fastestCompletion).toStringShort()} to improve your multiplier.`;
    }
    if (Laitela.isFullyDestabilized) SpeedrunMilestones(24).tryComplete();
    Modal.message.show(completionText, {}, 2);
  }
}

function laitelaBeatText(disabledDim) {
  switch (disabledDim) {
    case 1: return `<br><br>Lai'tela's Reality will now completely disable production from all Dimensions.
        The Reality can still be entered, but further destabilization is no longer possible.
        For completely destabilizing the Reality, you also get an additional ${formatX(8)} to Dark Energy gain.`;
    case 2: return `<br><br>Lai'tela's Reality will now disable production from all 2nd Dimensions during
      future runs, but the reward will be ${formatInt(100)} times stronger than before. Completely destabilizing
      the Reality for the final Dimension will give you an additional ${formatX(8)} to Dark Energy gain.`;
    case 3: return `<br><br>Lai'tela's Reality will now disable production from all 3rd Dimensions during
        future runs, but the reward will be ${formatInt(100)} times stronger than before.`;
    case 8: return `<br><br>Lai'tela's Reality will now disable production from all 8th Dimensions during
        future runs, but the reward will be ${formatInt(100)} times stronger than before. This boost can be
        repeated for each remaining Dimension by reaching destabilization within ${formatInt(30)} seconds again.`;
    default: return `<br><br>Lai'tela's Reality will now disable production from all
        ${disabledDim}th Dimensions during future runs, but the reward will be
        ${formatInt(100)} times stronger than before.`;
  }
}

// This gives IP/EP/RM from the respective upgrades that reward the prestige currencies continuously
// eslint-disable-next-line complexity
function applyAutoprestige(diff) {
  const disableIPSpeedBoost = EternityChallenge(13).isRunning || EternityChallenge(14).isRunning ||
  EternityChallenge(15).isRunning || player.challenge.infinity.current > 8;
  if ((TimeStudy(181).canBeApplied || (MendingUpgrade(3).boughtAmount.gte(1) && !Laitela.isDamaged)) && !Enslaved.isExpanded && !EternityChallenge(18).isRunning) {
    const val = (gainedInfinityPoints(true).times((disableIPSpeedBoost ? Time.realDeltaTimeMs : Time.deltaTime)
      .div(MendingUpgrade(3).boughtAmount.gte(1) && !Laitela.isDamaged ? 1 : 100))
      .timesEffectOf(Ra.unlocks.continuousTTBoost.effects.autoPrestige));
    Currency.infinityPoints.add(EternityChallenge(21).isRunning ? val.clampMin(1).log10().clampMin(1) : val);
  }

  if ((TeresaUnlocks.epGen.canBeApplied || MendingUpgrade(3).boughtAmount.gte(2) && !Laitela.isDamaged) && !Enslaved.isExpanded) {
    Currency.eternityPoints.add(player.records.thisEternity.bestEPmin.times(DC.D0_01)
      .times(getGameSpeedupFactor().times(diff.div(1000)))
      .timesEffectOf(Ra.unlocks.continuousTTBoost.effects.autoPrestige));
  }

  if ((InfinityUpgrade.ipGen.isCharged || (MendingUpgrade(3).boughtAmount.gte(3) && !Laitela.isDamaged && !Pelle.isDoomed)) &&
  !Enslaved.isExpanded) {
    const addedRM = MachineHandler.gainedRealityMachines
      .timesEffectsOf(InfinityUpgrade.ipGen.chargedEffect)
      .times(diff.div(1000));
    Currency.realityMachines.add(addedRM);
  }

  if (PelleRifts.chaos.milestones[2].canBeApplied) {
    Currency.eternityPoints.add(gainedEternityPoints().times(DC.D0_1).times(diff.div(1000)));
  }

  if (MendingUpgrade(3).boughtAmount.gte(5) && !Laitela.isDamaged && !Enslaved.isExpanded) {
    Currency.remnants.add(Pelle.remnantsGain);
  }
}

function updateImaginaryMachines(diff) {
  MachineHandler.updateIMCap();
  Currency.imaginaryMachines.add(MachineHandler.gainedImaginaryMachines(diff));
}

function updateTachyonGalaxies() {
  const tachyonGalaxyMult = Effects.max(1, DilationUpgrade.doubleGalaxies);
  const tachyonGalaxyThreshold = Ra.unlocks.galaxyCostReduce.canBeApplied ? Infinity : 1000;
  const thresholdMult = getTachyonGalaxyMult();
  player.dilation.baseTachyonGalaxies = Decimal.max(player.dilation.baseTachyonGalaxies,
    DC.D1.plus(Decimal.floor(Decimal.log(Currency.dilatedTime.value.dividedBy(1000), thresholdMult))));
  player.dilation.nextThreshold = DC.E3.times(thresholdMult
    .pow(player.dilation.baseTachyonGalaxies));
  player.dilation.totalTachyonGalaxies =
    Decimal.min(player.dilation.baseTachyonGalaxies.times(tachyonGalaxyMult), tachyonGalaxyThreshold)
      .add(Decimal.max(player.dilation.baseTachyonGalaxies.times(tachyonGalaxyMult).sub(tachyonGalaxyThreshold), 0)
        .div(tachyonGalaxyMult));

  player.dilation.totalTachyonGalaxies = player.dilation.totalTachyonGalaxies
    .times(DilationUpgrade.galaxyMultiplier.effectValue).timesEffectOf(TimeStudy.TGformula).floor();

  if (Ra.unlocks.tachyonicBoosts.canBeApplied) {
    player.dilation.baseTachyonicBoosts = Decimal.max(player.dilation.baseTachyonicBoosts,
      DC.D1.plus(Decimal.floor(Decimal.log(Currency.dilatedTime.value.dividedBy(1000), thresholdMult.root(5)).pow(2))));
    player.dilation.totalTachyonicBoosts = player.dilation.baseTachyonicBoosts;

    player.dilation.totalTachyonicBoosts = player.dilation.totalTachyonicBoosts.mul(1);
  }
}

export function getTTPerSecond() {
  if (Enslaved.isExpanded) return DC.D0;
  // All TT multipliers (note that this is equal to 1 pre-Ra)
  let ttMult = Effects.product(
    Ra.unlocks.continuousTTBoost.effects.ttGen,
    Ra.unlocks.achievementTTMult,
    Achievement(137),
    Achievement(156),
  );
  if (GlyphAlteration.isAdded("dilation")) ttMult = ttMult.mul(getSecondaryGlyphEffect("dilationTTgen"));

  // Glyph TT generation
  const glyphTT = Teresa.isRunning || Enslaved.isRunning || Pelle.isDoomed
    ? 0
    : new Decimal(getAdjustedGlyphEffect("dilationTTgen")).times(ttMult);

  // Dilation TT generation
  const dilationTT = DilationUpgrade.ttGenerator.isBought
    ? DilationUpgrade.ttGenerator.effectValue.times(Pelle.isDoomed ? 1 : ttMult)
    : DC.D0;

  // Lai'tela TT power
  let finalTT = dilationTT.add(glyphTT);
  if (finalTT.gt(1)) {
    finalTT = finalTT.pow(SingularityMilestone.theoremPowerFromSingularities.effectOrDefault(1));
  }

  return finalTT;
}

// eslint-disable-next-line no-unused-vars
function recursiveTimeOut(fn, iterations, endFn) {
  fn(iterations);
  if (iterations === 0) endFn();
  else setTimeout(() => recursiveTimeOut(fn, iterations - 1, endFn), 0);
}

function afterSimulation(seconds, playerBefore) {
  if (seconds > 600) {
    const playerAfter = deepmergeAll([{}, player]);
    Modal.awayProgress.show({ playerBefore, playerAfter, seconds });
  }

  GameUI.notify.showBlackHoles = true;
}

export function simulateTime(seconds, real, fast) {
  // The game is simulated at a base 50ms update rate, with a maximum tick count based on the values of real and fast
  // - Calling with real === true will always simulate at full accuracy with no tick count reduction unless it would
  //   otherwise simulate with more ticks than offline progress would allow
  // - Calling with fast === true will only simulate it with a max of 50 ticks
  // - Otherwise, tick count will be limited to the offline tick count (which may be set externally during save import)
  // Tick count is never *increased*, and only ever decreased if needed.
  if (seconds < 0) return;
  let ticks = Math.floor(seconds * 20);
  GameUI.notify.showBlackHoles = false;

  // Limit the tick count (this also applies if the black hole is unlocked)
  const maxTicks = GameStorage.maxOfflineTicks(1000 * seconds, GameStorage.offlineTicks ?? player.options.offlineTicks);
  if (ticks > maxTicks && !fast) {
    ticks = maxTicks;
  } else if (ticks > 50 && !real && fast) {
    ticks = 50;
  }

  const playerStart = deepmergeAll([{}, player]);

  let totalGameTime;

  if (BlackHoles.areUnlocked && !BlackHoles.arePaused) {
    totalGameTime = BlackHoles.calculateGameTimeFromRealTime(seconds, BlackHoles.calculateSpeedups());
  } else {
    totalGameTime = getGameSpeedupFactor().mul(seconds);
  }

  const infinitiedMilestone = getInfinitiedMilestoneReward(totalGameTime.mul(1000));
  const eternitiedMilestone = getEternitiedMilestoneReward(totalGameTime.mul(1000));

  if (eternitiedMilestone.gt(0)) {
    Currency.eternities.add(eternitiedMilestone);
  } else if (infinitiedMilestone.gt(0)) {
    Currency.infinities.add(infinitiedMilestone);
  } else {
    Currency.eternityPoints.add(getOfflineEPGain(seconds * 1000));
  }

  if (InfinityUpgrade.ipOffline.isBought && player.options.offlineProgress) {
    Currency.infinityPoints.add(player.records.thisEternity.bestIPMsWithoutMaxAll.times(seconds * 1000 / 2));
  }

  EventHub.dispatch(GAME_EVENT.OFFLINE_CURRENCY_GAINED);

  let remainingRealSeconds = seconds;
  // During async code the number of ticks remaining can go down suddenly
  // from "Speed up" which means tick length needs to go up, and thus
  // you can't just divide total time by total ticks to get tick length.
  // For example, suppose you had 6000 offline ticks, and called "Speed up"
  // 1000 ticks in, meaning that after "Speed up" there'd only be 1000 ticks more
  // (so 1000 + 1000 = 2000 ticks total). Dividing total time by total ticks would
  // use 1/6th of the total time before "Speed up" (1000 of 6000 ticks), and 1/2 after
  // (1000 of 2000 ticks). Short of some sort of magic user prediction to figure out
  // whether the user *will* press "Speed up" at some point, dividing remaining time
  // by remaining ticks seems like the best thing to do.
  let loopFn = i => {
    const diff = remainingRealSeconds / i;
    gameLoop(1000 * diff);
    remainingRealSeconds -= diff;
  };

  // Simulation code which accounts for BH cycles (segments where a BH is active doesn't use diff since it splits
  // up intervals based on real time instead in an effort to keep ticks all roughly equal in game time).
  // Black hole auto-pausing is entirely handled by the black hole phase advancement code (for actually pausing)
  // and calculateOfflineTick (for time calculation).
  if (BlackHoles.areUnlocked && !BlackHoles.arePaused) {
    loopFn = i => {
      const [realTickTime, blackHoleSpeedup] = BlackHoles.calculateOfflineTick(remainingRealSeconds,
        i, 0.0001);
      remainingRealSeconds -= realTickTime;
      gameLoop(1000 * realTickTime, { blackHoleSpeedup });
    };
  }

  // We don't show the offline modal here or bother with async if doing a fast simulation
  if (fast) {
    // Fast simulations happen when simulating between 10 and 50 seconds of offline time.
    // One easy way to get this is to autosave every 30 or 60 seconds, wait until the save timer
    // in the bottom-left hits 15 seconds, and refresh (without saving directly beforehand).
    GameIntervals.stop();
    // Fast simulations are always 50 ticks. They're done in this weird countdown way because
    // we want to be able to call the same function that we call when using async code (to avoid
    // duplicating functions), and that function expects a parameter saying how many ticks are remaining.
    for (let remaining = 50; remaining > 0; remaining--) {
      loopFn(remaining);
    }
    GameStorage.postLoadStuff();
    afterSimulation(seconds, playerStart);
  } else {
    const progress = {};
    ui.view.modal.progressBar = {};
    Async.run(loopFn,
      ticks,
      {
        batchSize: 1,
        maxTime: 60,
        sleepTime: 1,
        asyncEntry: doneSoFar => {
          GameIntervals.stop();
          ui.$viewModel.modal.progressBar = {
            label: "Offline Progress Simulation",
            info: `The game is being run at a lower accuracy in order to quickly calculate the resources you
              gained while you were away. See the How To Play entry on "Offline Progress" for technical details. If
              you are impatient and want to get back to the game sooner, you can click the "Speed up" button to
              simulate the rest of the time with half as many ticks (down to a minimum of ${formatInt(500)} ticks
              remaining). The "SKIP" button will instead use all the remaining offline time in ${formatInt(10)}
              ticks.`,
            progressName: "Ticks",
            current: doneSoFar,
            max: ticks,
            startTime: Date.now(),
            buttons: [{
              text: "Speed up",
              condition: (current, max) => max - current > 500,
              click: () => {
                const newRemaining = Math.clampMin(Math.floor(progress.remaining / 2), 500);
                // We subtract the number of ticks we skipped, which is progress.remaining - newRemaining.
                // This, and the below similar code in "SKIP", are needed or the progress bar to be accurate
                // (both with respect to the number of ticks it shows and with respect to how full it is).
                progress.maxIter -= progress.remaining - newRemaining;
                progress.remaining = newRemaining;
                // We update the progress bar max data (remaining will update automatically).
                ui.$viewModel.modal.progressBar.max = progress.maxIter;
              }
            },
            {
              text: "SKIP",
              condition: (current, max) => max - current > 10,
              click: () => {
                // We jump to 10 from the end (condition guarantees there are at least 10 left).
                // We subtract the number of ticks we skipped, which is progress.remaining - 10.
                progress.maxIter -= progress.remaining - 10;
                progress.remaining = 10;
              }
            }]
          };
        },
        asyncProgress: doneSoFar => {
          ui.$viewModel.modal.progressBar.current = doneSoFar;
        },
        asyncExit: () => {
          ui.$viewModel.modal.progressBar = undefined;
          // .postLoadStuff will restart GameIntervals
          GameStorage.postLoadStuff();
        },
        then: () => {
          afterSimulation(seconds, playerStart);
        },
        progress
      });
  }
}

window.onload = function() {
  const supportedBrowser = browserCheck();
  GameUI.initialized = supportedBrowser;
  ui.view.initialized = supportedBrowser;
  setTimeout(() => {
    ElectronRuntime.updateZoom();
    document.getElementById("loading").style.display = "none";
  }, 500);
  if (!supportedBrowser) {
    GameIntervals.stop();
    document.getElementById("loading").style.display = "none";
    document.getElementById("browser-warning").style.display = "flex";
  }
};

window.onfocus = function() {
  setShiftKey(false);
};

window.onblur = function() {
  GameKeyboard.stopSpins();
};

export function setShiftKey(isDown) {
  ui.view.shiftDown = isDown;
}

export function setHoldingR(x) {
  Replicanti.galaxies.isPlayerHoldingR = x;
}

export function browserCheck() {
  return supportedBrowsers.test(navigator.userAgent);
}

export function init() {
  // eslint-disable-next-line no-console
  console.log("🌌 Antimatter Dimensions: Reality Update 🌌");
  if (DEV) {
    // eslint-disable-next-line no-console
    console.log("👨‍💻 Development Mode 👩‍💻");
  }
  ElectronRuntime.initialize();
  SteamRuntime.initialize();
  Cloud.init();
  GameStorage.load();
  Tabs.all.find(t => t.config.id === player.options.lastOpenTab).show(true);
}

window.tweenTime = 0;
let lastFrame;
function animateTweens(time) {
  requestAnimationFrame(animateTweens);
  if (time === undefined || lastFrame === undefined) {
    lastFrame = time;
    return;
  }
  let delta = time - lastFrame;
  lastFrame = time;
  if (player.dilation.active) {
    delta /= Pelle.isDoomed ? 1.5 : 10;
  }
  tweenTime += delta;
  TWEEN.update(tweenTime);
}

animateTweens();
