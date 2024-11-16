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
