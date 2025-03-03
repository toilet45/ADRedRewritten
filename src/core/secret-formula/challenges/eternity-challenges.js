import { DC } from "../../constants";

const specialInfinityGlyphDisabledEffectText = () => (PelleRifts.chaos.milestones[1].canBeApplied
  ? "The Pelle-Specific effect from Infinity Glyphs is also disabled."
  : "");

// eslint-disable-next-line capitalized-comments
// superGoals are the goals after 5, except for EC1 in Nameless, which are after 1000.
export const eternityChallenges = [
  {
    id: 1,
    description: "Time Dimensions are disabled.",
    goal: DC.E1800,
    goalIncrease: DC.E200,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    reward: {
      description: "Time Dimension multiplier based on time spent this Eternity",
      effect: completions =>
        Decimal.pow(Decimal.max(player.records.thisEternity.time.div(10), 0.9),
          MendingUpgrade(8).isBought ? 0.5 + (completions * 0.1) : 0.3 + (completions * 0.05)),
      formatEffect: value => formatX(value, 2, 1)
    },
    // These will get notation-formatted and scrambled between for the final goal
    scrambleText: ["1e2600", "1e201600"],
  },
  {
    id: 2,
    description: "Infinity Dimensions are disabled.",
    goal: DC.E975,
    pelleGoal: DC.E1750,
    goalIncrease: DC.E175,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    reward: {
      description: "1st Infinity Dimension multiplier based on Infinity Power",
      effect: completions => Currency.infinityPower.value.pow(1.5 / (700 - completions * 100)).clampMin(1),
      cap: () => (MendingUpgrade(8).isBought ? DC.E10000 : DC.E100).pow(Decimal.sub(EternityChallenge(2).completions, 4).max(1).pow(Decimal.sub(EternityChallenge(4).completions, 2).mul(20).max(1))),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 3,
    description: "Antimatter Dimensions 5-8 don't produce anything. Dimensional Sacrifice is disabled.",
    goal: DC.E600,
    pelleGoal: DC.E925,
    goalIncrease: DC.E75,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    reward: {
      description: () => `Increase the multiplier for buying ${formatInt(10)} Antimatter Dimensions`,
      effect: completions => completions * 0.72,
      formatEffect: value => `+${format(value, 2, 2)}`
    }
  },
  {
    id: 4,
    description: `all Infinity multipliers and generators are disabled. The goal must be reached within a certain
      number of Infinities or else you will fail the Challenge.`,
    goal: DC.E2750,
    goalIncrease: DC.E550,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    restriction: completions => Math.max(16 - 4 * completions, 0),
    checkRestriction: restriction => Currency.infinities.lte(restriction),
    formatRestriction: restriction => (restriction === 0
      ? "without any Infinities"
      : `in ${quantifyInt("Infinity", restriction)} or less`),
    failedRestriction: "(Too many Infinities for more)",
    reward: {
      description: "Infinity Dimension multiplier based on unspent IP",
      effect: completions => Decimal.max(1, Currency.infinityPoints.value.pow(0.003 + completions * 0.002)),
      // eslint-disable-next-line max-len
      cap: () => (MendingUpgrade(8).isBought ? DC.E20000 : DC.E200).pow(Decimal.sub(EternityChallenge(4).completions, 4).max(1).pow(Decimal.sub(EternityChallenge(4).completions, 5).mul(20).max(1))),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 5,
    description: () => `Antimatter Galaxy cost increase scaling starts immediately (normally at ${formatInt(100)}
      Galaxies). Dimension Boost costs scaling is massively increased.`,
    goal: DC.E750,
    pelleGoal: DC.E1400,
    goalIncrease: DC.E400,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    reward: {
      description: "Distant Galaxy cost scaling starts later",
      effect: completions => completions * 5 * (MendingUpgrade(8).isBought ? 10 : 1),
      formatEffect: value => `${formatInt(value)} AG later`
    }
  },
  {
    id: 6,
    // The asterisk, if present, will get replaced with strings generated from the scramble text
    description: () => {
      if (Enslaved.isRunning) return "You *. The cost of upgrading your max Replicanti Galaxies is massively reduced.";
      return "You cannot gain Antimatter Galaxies normally. The cost of upgrading your max Replicanti" +
              " Galaxies is massively reduced.";
    },
    goal: DC.E850,
    pelleGoal: DC.E1500,
    goalIncrease: DC.E250,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    reward: {
      description: "Further reduce Antimatter Dimension cost multiplier growth",
      // eslint-disable-next-line no-nested-ternary
      effect: completions => (completions > 10
        ? 1 + completions * 0.025
        : completions > 5
          ? 0.75 + completions * 0.05
          : completions * 0.2),
      formatEffect: value => {
        const total = Player.dimensionMultDecrease.add(Effects.sum(EternityChallenge(6).reward)).round().sub(value);
        return `-${format(value, 2, 1)} (${formatX(total, 2, 1)} total)`;
      }
    },
    scrambleText: ["cannot gain Antimatter Galaxies normally", "c㏰'퐚 gai鸭 Anti꟢at랜erﻪﶓa⁍axie㮾 䂇orma㦂l"],
  },
  {
    id: 7,
    description:
      "1st Time Dimensions produce 8th Infinity Dimensions and 1st Infinity Dimensions produce " +
      "7th Antimatter Dimensions. Tickspeed also directly applies to Infinity and Time Dimensions.",
    goal: DC.E2000,
    pelleGoal: DC.E2700,
    goalIncrease: DC.E530,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    effect: () => TimeDimension(1).productionPerSecond,
    reward: {
      description: "1st Time Dimension produces 8th Infinity Dimensions",
      effect: completions => TimeDimension(1).productionPerSecond.pow(completions * 0.2).minus(1).clampMin(0),
      formatEffect: value => `${format(value, 2, 1)} per second`
    }
  },
  {
    id: 8,
    description: () => `you can only upgrade Infinity Dimensions ${formatInt(50)} times and Replicanti
      upgrades ${formatInt(40)} times. Infinity Dimension and Replicanti upgrade autobuyers are disabled.`,
    goal: DC.E1300,
    pelleGoal: DC.E2800,
    goalIncrease: DC.E900,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    reward: {
      description: "Infinity Power strengthens Replicanti Galaxies",
      effect: completions => {
        const infinityPower = Currency.infinityPower.value.add(1).pLog10().add(1).log10();
        return Decimal.pow(infinityPower, 0.03 * completions).sub(1).max(0);
      },
      formatEffect: value => formatPercents(value, 2)
    }
  },
  {
    id: 9,
    description: () => `you cannot buy Tickspeed upgrades. Infinity Power instead multiplies
      Time Dimensions with greatly reduced effect. ${specialInfinityGlyphDisabledEffectText()}`,
    goal: DC.E1750,
    pelleGoal: DC.E2900,
    goalIncrease: DC.E250,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    reward: {
      description: "Infinity Dimension multiplier based on Time Shards",
      effect: completions => Currency.timeShards.value.pow(completions * 0.1).clampMin(1),
      cap: () => (MendingUpgrade(8).isBought ? DC.E45000 : DC.E400).pow(Decimal.sub(EternityChallenge(9).completions, 4).max(1).pow(Decimal.sub(EternityChallenge(9).completions, 5).mul(20).max(1))),
      formatEffect: value => formatX(value, 2, 1)
    }
  },
  {
    id: 10,
    description: () => {
      let description = `Time Dimensions and Infinity Dimensions are disabled. You gain an immense boost from
        Infinities to Antimatter Dimensions (Infinities${formatPow(950)}). ${specialInfinityGlyphDisabledEffectText()}`;
      EternityChallenge(10).applyEffect(v => description += ` Currently: ${formatX(v, 2, 1)}`);
      return description;
    },
    goal: DC.E3000,
    pelleGoal: DC.E3200,
    goalIncrease: DC.E300,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    effect: () => Decimal.pow(Currency.infinitiesTotal.value, 950).clampMin(1).pow(TimeStudy(31).effectOrDefault(1)),
    reward: {
      description: "Time Dimension multiplier based on Infinities",
      effect: completions => {
        const mult = Currency.infinitiesTotal.value.times(2.783e-6).pow(0.4 + 0.1 * completions).clampMin(1);
        return mult.pow(MendingUpgrade(8).isBought ? 4 : 1).powEffectOf(TimeStudy(31));
      },
      formatEffect: value => {
        // Since TS31 is already accounted for in the effect prop, we need to "undo" it to display the base value here
        const mult = formatX(value, 2, 1);
        return TimeStudy(31).canBeApplied
          ? `${formatX(value.pow(1 / TimeStudy(31).effectValue), 2, 1)} (After TS31: ${mult})`
          : mult;
      }
    }
  },
  {
    id: 11,
    description: () => `all Dimension multipliers and powers are disabled except for the multipliers from
      Infinity Power and Dimension Boosts (to Antimatter Dimensions). ${specialInfinityGlyphDisabledEffectText()}`,
    goal: DC.E450,
    pelleGoal: DC.E11200,
    goalIncrease: DC.E200,
    pelleGoalIncrease: DC.E1400,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    reward: {
      description: "Further reduce Tickspeed cost multiplier growth",
      // eslint-disable-next-line no-nested-ternary
      effect: completions => (completions > 10
        ? 0.6 + completions / 100
        : completions * 0.07),
      formatEffect: value => {
        const total = Player.tickSpeedMultDecrease.add(Effects.sum(EternityChallenge(11).reward)).round().sub(value);
        return `-${format(value, 2, 2)} (${formatX(total, 2, 2)} total)`;
      }
    }
  },
  {
    id: 12,
    description: () => (PlayerProgress.realityUnlocked()
      ? `the game runs ×${formatInt(1000)} slower; all other game speed effects are disabled. The goal must be reached
        within a certain amount of time or you will fail the Challenge. ${specialInfinityGlyphDisabledEffectText()}`
      : `the game runs ×${formatInt(1000)} slower. The goal must be reached
        within a certain amount of time or you will fail the Challenge.`),
    goal: DC.E110000,
    pelleGoal: DC.E208000,
    goalIncrease: DC.E12000,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: 5,
    restriction: completions => Math.max(10 - 2 * completions, 1) / 10,
    checkRestriction: restriction => Time.thisEternity.totalSeconds.lt(restriction),
    formatRestriction: restriction => `in ${quantify("in-game second", restriction, 0, 1)} or less.`,
    failedRestriction: "(Too slow for more)",
    reward: {
      description: "Infinity Dimension cost multipliers are reduced",
      effect: completions => 1 - (completions * (MendingUpgrade(8).isBought ? 0.02 : 0.008)),
      formatEffect: value => `x${formatPow(value, 3, 3)}`
    }
  },
  {
    id: 13,
    description: () => `IP gain exponent is raised ^${format(0.075, 3, 3)}.
    Gamespeed does not affect Passive IP gain`,
    goal: DC.E100,
    pelleGoal: DC.E100,
    goalIncrease: DC.E50,
    scaled: {
      goal: DC.E1900,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "Maximum Completions for Eternity Challenges 1-12 are increased",
      effect: completions => completions,
      formatEffect: value => `+${formatInt(value)}`
    }
  },
  {
    id: 14,
    description: () => `1st Antimatter Dimension Production exponent ^${format(0.025, 3, 3)}.
    Gamespeed does not affect Passive IP gain. All IP multipliers are disabled.`,
    goal: DC.E200,
    pelleGoal: DC.BIMAX,
    goalIncrease: DC.E20,
    scaled: {
      goal: DC.E80,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "Gain more rows of Celestial Study Tree",
      effect: completions => completions,
      formatEffect: value => `+${formatInt(value)}`
    }
  },
  {
    id: 15,
    description: () => `Dimension multipliers are reduced by the number you have. IP gain is log10.
    Gamespeed does not affect Passive IP gain. All IP multipliers are disabled.`,
    goal: DC.E40,
    pelleGoal: DC.E100,
    goalIncrease: DC.E10,
    scaled: {
      goal: DC.E100,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "IP exponent is raised to a power",
      effect: completions => completions / 1000 + 1,
      formatEffect: value => `^${format(value, 3, 3)}`
    }
  },
  {
    id: 16,
    description: () => `AD, ID and TD multipliers are ${formatX(1)}. AD multipliers are increased
    by Antimatter, ID by IP and TDs by EP. Gamespeed is capped at
    ${formatX(1, 0, 0)}. Infinity Power improves IP gain. Tickspeed is ${formatX(1.2, 1, 1)}, and unpurchasable.
    IP multipliers outside of ID are disabled.`,
    goal: DC.E6E6,
    pelleGoal: DC.E6E6,
    goalIncrease: DC.E1E6,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "Infinity Power provides a power effect to IP exponent",
      // eslint-disable-next-line max-len
      effect: completions => Currency.infinityPower.value.max(1).log10().max(1).log10().mul(completions).div(5e4).add(1),
      formatEffect: value => `^${format(value, 3, 6)}`
    }
  },
  {
    id: 17,
    description: () => `Tickspeed multiplier is ${formatX(1)}.
    Sacrifice, All AD Power Effects, IP multipliers, Dimension Boosts and Infinity Dimensions are disabled.
    Time Studies provide no effect`,
    goal: DC.E5E16,
    pelleGoal: DC.E5E16,
    goalIncrease: DC.EE16,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "Tickspeed exponent is raised to a power",
      effect: completions => completions / 1000 + 1,
      formatEffect: value => `^${format(value, 3, 3)}`
    }
  },
  {
    id: 18,
    description: () => `Continuum is set to +${formatInt(0)}% purchases. All Tickspeed and Dimension Multipliers are
    disabled, except for buy ${formatInt(10)}. Buy ${formatInt(10)} multiplier is capped at ${formatX(2)}.
    Passive IP gain is disabled. Replicanti speed is divided by ${format("1e1750")}`,
    goal: DC.E2_5E9,
    pelleGoal: DC.E100,
    goalIncrease: DC.E5E8,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "Buy 10 exponent is raised to a power",
      effect: completions => completions / 15 + 1,
      formatEffect: value => `^${format(value, 3, 3)}`
    }
  },
  {
    id: 19,
    description: () => `You are trapped in EC1-12, without IP generation nerfs or failure conditions.
    All IP multipliers are disabled`,
    goal: DC.E100,
    pelleGoal: DC.E100,
    goalIncrease: DC.E50,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "Maximum Completions for Eternity Challenges 1-18 are increased",
      effect: completions => completions,
      formatEffect: value => `+${formatInt(value)}`
    }
  },
  {
    id: 20,
    description: () => `All IP multipliers are disabled. IP gain is based on Replicanti`,
    goal: DC.E3E6,
    pelleGoal: DC.E3E6,
    goalIncrease: DC.E500000,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "IP boosts Replicanti Speed",
      effect: completions => DC.E100.pow(Currency.infinityPoints.value.max(1).log10().max(1).log10()
        .pow(0.2).mul(completions * 5 + 1)),
      formatEffect: value => `${formatX(value, 3, 3)}`
    }
  },
  {
    id: 21,
    description: () => `All continuous production/generation is logarthmic.`,
    // AD, ID, TD, IP, Replicanti
    goal: DC.E10000,
    pelleGoal: DC.E100,
    goalIncrease: DC.E5000,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "Memory production multiplier",
      // eslint-disable-next-line max-len
      effect: completions => Decimal.pow(Decimal.pow(50, Math.pow(completions, 2)), EternityChallenge(22).reward.effectOrDefault(1)),
      formatEffect: value => `${formatX(value)}`
    }
  },
  {
    id: 22,
    description: () => `Antimatter gain is reduced based on Antimatter. All IP multipliers are disabled.`,
    goal: DC.E100,
    pelleGoal: DC.E100,
    goalIncrease: DC.E50,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "Boost to Eternity Challenge 21",
      effect: completions => Math.pow(completions, 1.5) + 1,
      formatEffect: value => `^${format(value)}`
    }
  },
  {
    id: 23,
    description: () => `IP gain and Dimension production are only affected by tickspeed.`,
    goal: DC.E100,
    pelleGoal: DC.E100,
    goalIncrease: DC.E50,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "Power effect to tickspeed exponent",
      effect: completions => Decimal.pow(3, completions).cbrt(),
      formatEffect: value => `^${format(value)}`
    }
  },
  {
    id: 24,
    description: () => `IP gain and Dimension production are only affected by AD and ID purchases.`,
    goal: DC.E100,
    pelleGoal: DC.E100,
    goalIncrease: DC.E50,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    reward: {
      description: "Power effect to AD1 exponent",
      effect: completions => Decimal.pow(1.15, completions),
      formatEffect: value => `^${format(value)}`
    }
  },
  {
    id: 25,
    description: () => `Suffering`,
    // Actual effect:
    // AD production is log(x)
    // All IP multipliers are disabled
    // Gamespeed is capped to 1x rt and gt
    goal: DC.F4,
    pelleGoal: DC.E10,
    goalIncrease: DC.E10,
    scaled: {
      goal: DC.EE15,
      goalIncrease: DC.E1,
      goalIncreaseType: "exponential"
    },
    scaleStart: Infinity,
    // Only has 1 completion, so no need to edge case or whatever.
    reward: {
      description: "Unlock a new glyph.",
      effect: completions => completions,
      formatEffect: value => (Decimal.gt(value, 0.5) ? "Unlocked" : "Locked")
    }
  },
];
