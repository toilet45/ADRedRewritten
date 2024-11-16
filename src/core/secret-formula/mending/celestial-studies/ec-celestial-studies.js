// eslint-disable-next-line no-unused-vars
import { DC } from "../../../constants";

export const ecCelestialStudies = [
  {
    id: 13,
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
    id: 14,
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
    id: 15,
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
    id: 16,
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
    id: 17,
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
    id: 18,
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
    id: 19,
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
    id: 20,
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
    id: 21,
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
    id: 22,
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
    id: 23,
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
      required: completions => 20,
      formatValue: formatInt
    }
  },
];
