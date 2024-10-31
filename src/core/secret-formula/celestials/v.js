import { DC } from "../../constants";

// This is supposed to be in ./navigation.js but importing doesn't work for some stupid reason
function emphasizeEnd(valueA, valueB) {
  // Since we redifine here, lets make it better
  const fraction = valueA.div(valueB).min(1).toNumber();
  return Math.pow(fraction, 10);
}

export const V_REDUCTION_MODE = {
  SUBTRACTION: 1,
  DIVISION: 2
};

export const v = {
  // Note: mainUnlock IDs here are one-indexed to match with navigation indices
  mainUnlock: {
    realities: {
      id: 1,
      name: "Realities",
      resource: () => Currency.realities.value,
      requirement: 10000,
      format: x => formatInt(x),
      progress: () => Currency.realities.value.div(10000).add(MendingMilestone.three.isReached ? 1 : 0).min(1).toNumber(),
    },
    eternities: {
      id: 2,
      name: "Eternities",
      resource: () => Currency.eternitiesTotal.value,
      requirement: 1e70,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.eternitiesTotal.value.max(1).log10(), 70),
    },
    infinities: {
      id: 3,
      name: "Infinities",
      resource: () => Currency.infinitiesTotal.value,
      requirement: 1e160,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.infinitiesTotal.value.max(1).log10(), 160),
    },
    dilatedTime: {
      id: 4,
      name: "Dilated Time",
      resource: () => player.records.thisReality.maxDT,
      requirement: DC.E320,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(player.records.thisReality.maxDT.max(1).log10(), 320),
    },
    replicanti: {
      id: 5,
      name: "Replicanti",
      resource: () => player.records.thisReality.maxReplicanti,
      requirement: DC.E320000,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(player.records.thisReality.maxReplicanti.max(1).log10(), 320000),
    },
    realityMachines: {
      id: 6,
      name: "Reality Machines",
      resource: () => Currency.realityMachines.value,
      requirement: 1e60,
      format: x => format(x, 2),
      progress: () => emphasizeEnd(Currency.realityMachines.value.max(1).log10(), 60),
    },
  },
  runUnlocks: [
    {
      id: 0,
      name: "Glyph Knight",
      description: value => `Unlock Reality with at most ${quantifyInt("Glyph", -value)} equipped.`,
      // This achievement has internally negated values since the check is always greater than
      values: [-5, -4, -3, -2, -1, 0],
      condition: () => V.isRunning && TimeStudy.reality.isBought,
      currentValue: () => -Glyphs.activeWithoutCompanion.length,
      formatRecord: x => (x >= -5 ? formatInt(-x) : "Not reached"),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 1,
      name: "AntiStellar",
      description: value => `Have ${formatInt(value)} total Galaxies from all types.`,
      values: [4000, 4300, 4600, 4900, 5200, 5500],
      condition: () => V.isRunning,
      currentValue: () => player.dilation.totalTachyonGalaxies.add(Replicanti.galaxies.total).add(player.galaxies),
      formatRecord: x => formatInt(x),
      shardReduction: tiers => Decimal.floor(300 * tiers),
      maxShardReduction: goal => goal - 4000,
      perReductionStep: 3,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 2,
      name: "Se7en deadly matters",
      description: value => `Get ${format(Decimal.pow10(value))} Infinity Points in Eternity Challenge 7.`,
      values: [6e5, 7.2e5, 8.4e5, 9.6e5, 1.08e6, 1.2e6],
      condition: () => V.isRunning && EternityChallenge(7).isRunning,
      currentValue: () => Currency.infinityPoints.value.max(1).log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 1.2e5 * tiers,
      maxShardReduction: goal => goal - 6e5,
      perReductionStep: DC.E1200,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 3,
      name: "Young Boy",
      description: value => `Get ${format(Decimal.pow10(value))} Antimatter in Eternity Challenge 12 without
        unlocking Time Dilation.`,
      values: [400e6, 450e6, 500e6, 600e6, 700e6, 800e6],
      condition: () => V.isRunning && EternityChallenge(12).isRunning && !PlayerProgress.dilationUnlocked(),
      currentValue: () => Currency.antimatter.value.max(1).log10(),
      formatRecord: x => format(Decimal.pow10(x)),
      shardReduction: tiers => 50e6 * tiers,
      maxShardReduction: goal => goal - 400e6,
      perReductionStep: DC.E500000,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 4,
      name: "Eternal Sunshine",
      description: value => `Get ${format(Decimal.pow10(value))} Eternity Points.`,
      values: [7000, 7600, 8200, 8800, 9400, 10000],
      condition: () => V.isRunning,
      currentValue: () => Currency.eternityPoints.value.max(1).log10(),
      formatRecord: x => format(Decimal.pow10(x), 2),
      shardReduction: tiers => 600 * tiers,
      maxShardReduction: goal => goal - 7000,
      perReductionStep: 1e6,
      mode: V_REDUCTION_MODE.DIVISION
    },
    {
      id: 5,
      name: "Matterception",
      description: value => `Get ${formatInt(value)} Dimension Boosts while Dilated and inside Eternity Challenge 5.`,
      values: [51, 52, 53, 54, 55, 56],
      condition: () => V.isRunning && player.dilation.active && EternityChallenge(5).isRunning,
      currentValue: () => DimBoost.purchasedBoosts,
      formatRecord: x => formatInt(x),
      shardReduction: tiers => Math.floor(tiers),
      maxShardReduction: () => 5,
      reductionStepSize: 100,
      perReductionStep: 1,
      mode: V_REDUCTION_MODE.SUBTRACTION
    },
    {
      id: 6,
      name: "Requiem for a Glyph",
      description: value => `Unlock Reality with at most ${formatInt(-value)} Glyphs equipped for the entire Reality.`,
      // This achievement has internally negated values since the check is always greater than
      values: [1, 4, 7, 10, 13],
      condition: () => V.isRunning && TimeStudy.reality.isBought,
      currentValue: () => -player.requirementChecks.reality.maxGlyphs,
      formatRecord: x => formatInt(-x),
      shardReduction: () => 0,
      maxShardReduction: () => 0,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true
    },
    {
      id: 7,
      name: "Post-destination",
      description: value => `Get ${formatInt(400000)} Time Theorems with a /${format(Decimal.pow10(value), 2, 2)}
        Black Hole or slower, without discharging or entering EC12.`,
      values: [100, 150, 200, 250, 300],
      condition: () => V.isRunning,
      currentValue: () => (
        // Dirty hack I know lmao
        Currency.timeTheorems.gte(400000)
          ? Decimal.log10(player.requirementChecks.reality.slowestBH).neg()
          : new Decimal()),
      formatRecord: x => `${formatInt(1)} / ${format(Decimal.pow(10, x))}`,
      shardReduction: tiers => 50 * tiers,
      maxShardReduction: goal => goal - 50,
      reductionStepSize: 2,
      perReductionStep: 10,
      mode: V_REDUCTION_MODE.DIVISION,
      isHard: true
    },
    {
      id: 8,
      name: "Shutter Glyph",
      description: value => `Reach a Glyph of level ${formatInt(value)}.`,
      values: [6500, 7000, 8000, 9000, 10000],
      condition: () => V.isRunning,
      currentValue: () => gainedGlyphLevel().actualLevel,
      formatRecord: x => formatInt(x),
      shardReduction: tiers => Math.floor(500 * tiers),
      maxShardReduction: () => 500,
      perReductionStep: 5,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true,
    },
    {
      id: 9,
      name: "7 Studies later",
      description: value => `Reach ${format(new Decimal(value).pow10().pow10())} antimatter
      with at most ${formatInt(7)} studies bought in this reality, and no dilation.`,
      // This achievement has internally negated values since the check is always greater than
      values: [15, 15.4, 15.7, 16, 16.2],
      condition: () => V.isRunning && player.requirementChecks.reality.maxStudies <= 7 && !TimeStudy.dilation.isBought,
      currentValue: () => player.antimatter.max(1).log10().max(1).log10(),
      formatRecord: x => format(x.pow10().pow10()),
      shardReduction: tiers => 0.002 * tiers,
      maxShardReduction: () => 0.5,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true,
      isExtra: true,
    },
    {
      id: 10,
      name: "The Dilation",
      description: value => `Get ${format(Decimal.pow10(value))} Dilated Time, with a
      /${format(1e300)} Black Hole, without entering EC12 or discharging`,
      values: [650, 750, 850, 1000, 1200],
      condition: () => V.isRunning && player.requirementChecks.reality.slowestBH.lte("1e-300"),
      currentValue: () => player.dilation.dilatedTime.max(1).log10(),
      formatRecord: x => `${format(Decimal.pow(10, x))}`,
      shardReduction: tiers => tiers * 10,
      maxShardReduction: () => 300,
      reductionStepSize: 4,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true,
      isExtra: true,
    },
    {
      id: 11,
      name: "Placeholder Name",
      description: value => `Reach a Glyph of level ${formatInt(value)}.`,
      values: [6500, 7000, 8000, 9000, 10000],
      condition: () => V.isRunning && false,
      currentValue: () => gainedGlyphLevel().actualLevel,
      formatRecord: x => formatInt(x),
      shardReduction: tiers => Math.floor(500 * tiers),
      maxShardReduction: () => 500,
      perReductionStep: 5,
      mode: V_REDUCTION_MODE.SUBTRACTION,
      isHard: true,
      isExtra: true,
    }
  ],
  unlocks: {
    vAchievementUnlock: {
      id: 0,
      reward: "Unlock V, The Celestial Of Achievements",
      description: "Meet all the above requirements simultaneously",
      requirement: () => Object.values(GameDatabase.celestials.v.mainUnlock).every(e => e.progress() >= 1)
    },
    shardReduction: {
      id: 1,
      reward: `You can spend Perk Points to reduce the goal requirement of all tiers of each V-Achievement.`,
      description: () => `Have ${formatInt(2)} V-Achievements`,
      requirement: () => V.spaceTheorems >= 2
    },
    adPow: {
      id: 2,
      reward: "Antimatter Dimension power based on total Space Theorems.",
      description: () => `Have ${formatInt(5)} V-Achievements`,
      effect: () => 1 + Math.sqrt(V.spaceTheorems) / 100,
      format: x => formatPow(x, 3, 3),
      requirement: () => V.spaceTheorems >= 5
    },
    fastAutoEC: {
      id: 3,
      reward: "Achievement multiplier reduces Auto-EC completion time.",
      description: () => `Have ${formatInt(10)} V-Achievements`,
      effect: () => Achievements.power,
      // Base rate is 60 ECs at 20 minutes each
      // eslint-disable-next-line no-nested-ternary
      format: x => (MendingUpgrade(14).isBoguht ? "Instant (Mending Upgrade 14)"
        : Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied
          ? "Instant (Ra upgrade)"
          : `${TimeSpan.fromMinutes(new Decimal(1200).div(x)).toStringShort()} for full completion`),
      requirement: () => V.spaceTheorems >= 10
    },
    autoAutoClean: {
      id: 4,
      reward: "Unlock the ability to Automatically Purge Glyphs on Reality.",
      description: () => `Have ${formatInt(16)} V-Achievements`,
      requirement: () => V.spaceTheorems >= 16
    },
    achievementBH: {
      id: 5,
      reward: "Achievement multiplier affects Black Hole power.",
      description: () => `Have ${formatInt(30)} V-Achievements`,
      effect: () => (Achievements.power.powEffectOf(MendingUpgrade(13).effects.bhPow).gt(1e35)
        ? Achievements.power.powEffectOf(MendingUpgrade(13).effects.bhPow).div(1e35).sqrt().mul(1e35)
        : Achievements.power.powEffectOf(MendingUpgrade(13).effects.bhPow)),
      format: x => formatX(x, 2, 0),
      requirement: () => V.spaceTheorems >= 30
    },
    raUnlock: {
      id: 6,
      reward() {
        return `Reduce the Space Theorem cost of Time Studies by ${formatInt(2)}.
                Unlock Ra, Celestial of the Forgotten.`;
      },
      description: () => `Have ${formatInt(36)} V-Achievements`,
      effect: 2,
      requirement: () => V.spaceTheorems >= 36
    }
  }
};
