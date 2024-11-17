import { DC } from "../../../constants";

// eslint-disable-next-line multiline-comment-style
/* Leftover code
const thisInfinityMult = thisInfinity => {
  // All "this inf time" or "best inf time" mults are * 10
  const scaledInfinity = thisInfinity.times(10).add(1);
  const cappedInfinity = Decimal.min(Decimal.pow(scaledInfinity, 0.125), 500);
  return DC.D15.pow(Decimal.log10(scaledInfinity).times(cappedInfinity));
};
const passiveIPMult = () => {
  const isEffarigLimited = Effarig.isRunning && Effarig.currentStage === EFFARIG_STAGES.ETERNITY;
  const normalValue = Perk.studyPassive.isBought ? 1e50 : 1e25;
  return isEffarigLimited
    ? Math.min(normalValue, Effarig.eternityCap.toNumber())
    : normalValue;
};
*/


/**
 * List of time study specifications and attributes
 * {
 *  @property {Number} id                   Numerical ID shown for each time study in code and in-game
 *  @property {Number} cost                 Amount of available time theorems required to purchase
 *  @property {Object[]} requirement   Array of Numbers or functions which are checked to determine purchasability
 *  @property {Number} reqType              Number specified by enum in TS_REQUIREMENT_TYPE for requirement behavior
 *    study to also cost space theorems - in all cases this applies if ANY in the array are bought
 *  @property {function: @return String} description  Text to be shown in-game for the time study's effects
 *  @property {function: @return Number} effect       Numerical value for the effects of a study
 *  @property {String[]} cap     Hard-coded cap for studies which don't scale forever
 *  @property {String} formatEffect   Formatting function for effects, if the default formatting isn't appropriate
 * }
 */
export const normalCelestialStudies = [
  {
    id: 11,
    cost: DC.D1,
    // All requirements of an empty array will always evaluate to true, so this study is always purchasable
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4, 0, 0)}`,
    effect: () => DC.E4,
  },
  {
    id: 21,
    cost: DC.D1,
    requirement: [11],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 22,
    cost: DC.D1,
    requirement: [11],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 31,
    cost: DC.D1,
    requirement: [21],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 32,
    cost: DC.D1,
    requirement: [22],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 41,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 42,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 43,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 44,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 51,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 52,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 53,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 54,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 61,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 62,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 63,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 64,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 71,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 72,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 81,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 91,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 92,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 93,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 101,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 102,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 103,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 111,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 112,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 113,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 121,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 131,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 132,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 151,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 152,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 171,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 172,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 181,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 182,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 183,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 184,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 185,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 186,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 187,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 188,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 191,
    cost: DC.D1,
    requirement: [],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tickspeed exponent ${formatX(1e4)}`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
];
