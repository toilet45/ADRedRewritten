// eslint-disable-next-line no-unused-vars
import { DC } from "../../../constants";

export const ecCelestialStudies = [
  {
    id: 13,
    cost: new Decimal(0),
    requirement: [22],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Eternity Challenge Completions",
      current: () => EternityChallenges.completions,
      required: completions => 60 + 15 * completions + (Enslaved.isRunning ? 995 : 0),
      formatValue: formatInt
    }
  },
  {
    id: 14,
    cost: new Decimal(0),
    requirement: [71, 72],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Time Theorems",
      current: () => player.timestudy.theorem,
      required: completions => DC.E33333.mul(DC.E5000.pow(Decimal.pow(completions, 2))),
      formatValue: value => format(value, 0, 0)
    }
  },
  {
    id: 15,
    cost: new Decimal(5),
    requirement: [81],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Peak Gamespeed",
      current: () => player.celestials.ra.peakGamespeed,
      required: completions => DC.E1200.mul(DC.E300.pow(completions)),
      formatValue: format
    }
  },
  {
    id: 16,
    cost: new Decimal(5),
    requirement: [81],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Reality Glyph Sacrifice",
      current: () => player.reality.glyphs.sac.reality,
      required: completions => DC.E300.mul(DC.E100.pow(completions)),
      formatValue: format
    }
  },
  {
    id: 17,
    cost: new Decimal(5),
    requirement: [91],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Tickspeed",
      current: () => Tickspeed.current.recip(),
      required: completions => DC.EE33.pow(Decimal.pow10(completions * 1.5)),
      formatValue: format
    }
  },
  {
    id: 18,
    cost: new Decimal(0),
    requirement: [93],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "AD Continuum",
      current: () => AntimatterDimension(1).continuumValue,
      required: completions => new Decimal(1e24).times(100 ** completions),
      formatValue: format
    }
  },
  {
    id: 19,
    cost: new Decimal(0),
    requirement: [131, 132],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Eternity Challenge Completions",
      current: () => EternityChallenges.completions,
      required: completions => 150 + 30 * completions + (Enslaved.isRunning ? 995 : 0),
      formatValue: formatInt
    }
  },
  {
    id: 20,
    cost: new Decimal(0),
    requirement: [11],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Multiversal Remains",
      current: () => Currency.mendingPoints.value,
      required: completions => new Decimal(1e50).times(DC.E10.pow(completions)),
      formatValue: formatInt
    }
  },
  {
    id: 21,
    cost: new Decimal(0),
    requirement: [11],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Imaginary Machines",
      current: () => Currency.imaginaryMachines.value,
      required: completions => new Decimal(1e90 * (1e5 ** completions)),
      formatValue: format
    }
  },
  {
    id: 22,
    cost: new Decimal(0),
    requirement: [11],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Antimatter",
      current: () => Currency.antimatter.value,
      required: completions => new Decimal(1e55).times(1e5 ** completions).pow10(),
      formatValue: format
    }
  },
  {
    id: 23,
    cost: new Decimal(0),
    requirement: [11],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Antimatter Galaxies",
      current: () => player.galaxies,
      required: completions => new Decimal(7.5e7 + (5e6 * completions + 1)),
      formatValue: formatInt
    }
  },
  {
    id: 24,
    cost: new Decimal(0),
    requirement: [11],
    reqType: CS_REQUIREMENT_TYPE.AT_LEAST_ONE,
    secondary: {
      resource: "Eternity Challenge Completions",
      current: () => EternityChallenges.completions,
      required: completions => 60 + 15 * completions + (Enslaved.isRunning ? 995 : 0),
      formatValue: formatInt
    }
  },
  {
    id: 25,
    cost: new Decimal(0),
    requirement: [11],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    secondary: {
      resource: "Completions of EC21-24",
      current: () => EternityChallenge(21).completions + EternityChallenge(22).completions +
      EternityChallenge(23).completions + EternityChallenge(24).completions,
      // eslint-disable-next-line no-unused-vars
      required: completions => (completions + 2) * 10,
      formatValue: formatInt
    }
  },
];
