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
    reqType: CS_REQUIREMENT_TYPE.SOME,
    // Actually describing this effect is WAYYY too much text, so just leave it vague like this
    description: () => `Galaxies directly affect tickspeed less, but Galaxy Power is far stronger.
    Replicanti Galaxies affect tickspeed even less.`,
    effect: () => DC.E4,
  },
  {
    id: 22,
    cost: DC.D1,
    requirement: [11],
    reqType: CS_REQUIREMENT_TYPE.SOME,
    description: () => `Dimensional Boost exponent ${formatPow(2)}. Improve Charged Break Upgrade 8.`,
    effect: () => [2, Achievements.power.pow(30).add(1).log10().pow(1.25).pow10()],
  },
  {
    id: 31,
    cost: DC.D1,
    requirement: [21],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_A,
    description: () => `Improve some Glyph Effects.`
  },
  {
    id: 32,
    cost: DC.D1,
    requirement: [22],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_A,
    description: () => `Improve the production of all Dimensions significantly based on Mends`,
    effect: () => Currency.mends.value.max(1).div(25).clampMax(4).add(1).add(Currency.mends.value.max(1).log10().max(1).log10()),
    formatEffect: value => formatPow(value, 2, 2)
  },
  {
    id: 41,
    cost: DC.D1,
    requirement: [31],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_B1,
    description: () => `Improve Glyph Sacrifice effects`,
    effect: () => DC.E4,
  },
  {
    id: 42,
    cost: DC.D2,
    requirement: [31],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_B1,
    description: () => `Improve Glyph Alchemy effects`,
    effect: () => DC.E4,
  },
  {
    id: 43,
    cost: DC.D1,
    requirement: [32],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_B2,
    description: () => `Weaken the Time Shard to Tickspeed conversion softcap`,
    effect: () => DC.E4,
  },
  {
    id: 44,
    cost: DC.D2,
    requirement: [32],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_B2,
    description: () => `All dimension production ${formatPow(4)}`,
    effect: () => new Decimal(4),
  },
  {
    id: 51,
    cost: DC.D2,
    requirement: [41],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Power glyph sacrfice effect is squared, and affects Remote Galaxy scaling.`,
    effect: () => DC.D2,
  },
  {
    id: 52,
    cost: DC.D2,
    requirement: [42],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Equipped Reality Glyphs provide a much stronger Galaxy Strength boost`,
    effect: () => 5.5,
  },
  {
    id: 53,
    cost: DC.D2,
    requirement: [43],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Time Dimension caps are muliplied based on Time Glyph Sacrifice`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 54,
    cost: DC.D2,
    requirement: [44],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Antimatter Dimensions gain a power effect based on Power Glyph Sacrifice`,
    effect: () => player.reality.glyphs.sac.power.clampMin(1).log10().root(3).div(1.5).clampMax(9).add(1),
    formatEffect: value => formatPow(value, 2, 1)
  },
  {
    id: 61,
    cost: DC.D1,
    requirement: [51],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Infinity Glyph Sacrifice becomes a power effect to the ${formatInt(8)}th Infinity Dimension`,
  },
  {
    id: 62,
    cost: DC.D1,
    requirement: [52],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Time Glyph Sacrifice becomes a power effect to the ${formatInt(8)}th Time Dimension,
     improved based on equipped Time Glyph count`,
    effect: () => DC.D1.add(Glyphs.active.filter(n => n.type === "time").length).sqrt(),
    formatEffect: value => formatPow(value, 2, 1)
  },
  {
    id: 63,
    cost: DC.D1,
    requirement: [53],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Infinity Glyph Sacrifice delays the Infinity Dimension hardcap.`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 64,
    cost: DC.D3,
    requirement: [54],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `All Dimension Exponents gain a very small power, based on Tachyon Particles`,
    effect: () => player.dilation.tachyonParticles.clampMin(1).log10().root(25).div(150).add(1),
    formatEffect: value => formatPow(value, 4, 4)
  },
  {
    id: 71,
    cost: DC.D1,
    requirement: [61, 62],
    reqType: CS_REQUIREMENT_TYPE.SOME,
    description: () => `Glyph Sacrifice is calculated using a value ${formatX("1e200")} the cap/sacrifice value`,
    effect: () => DC.E200,
  },
  {
    id: 72,
    cost: DC.D1,
    requirement: [63, 64],
    reqType: CS_REQUIREMENT_TYPE.SOME,
    description: () => `All Glyph Effects providing a power effect to a Dimension are ${formatX(1.1, 1, 1)}`,
    effect: () => 1.1,
  },
  {
    id: 81,
    cost: DC.D1,
    requirement: [71, 72],
    reqType: CS_REQUIREMENT_TYPE.SOME,
    description: () => `Game speed is raised ${formatPow(1.75, 2, 2)}`,
    effect: () => 1.75,
  },
  {
    id: 91,
    cost: DC.D1,
    requirement: [81],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_C,
    description: () => `Delay the Antimatter softcap based on Antimatter`,
    effect: () => Currency.antimatter.value.max(1).log10().max(1).log10().root(5).add(1),
    formatEffect: value => formatPow(value, 2, 1)
  },
  {
    id: 92,
    cost: DC.D1,
    requirement: [81],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_C,
    description: () => `Delay the Infinity Point softcap based on Infinity Points`,
    effect: () => Currency.infinityPoints.value.max(1).log10().max(1).log10().root(3).add(1),
    formatEffect: value => formatPow(value, 2, 1)
  },
  {
    id: 93,
    cost: DC.D1,
    requirement: [81],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_C,
    description: () => `Delay the Eternity Point softcap based on Eternity Points`,
    effect: () => Currency.eternityPoints.value.max(1).log10().max(1).log10().add(1),
    formatEffect: value => formatPow(value, 2, 1)
  },
  {
    id: 101,
    cost: DC.D1,
    requirement: [92],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Raise Infinity Point gain based on Mends`,
    effect: () => 4,
    formatEffect: value => formatPow(value, 2, 2)
  },
  {
    id: 111,
    cost: DC.D1,
    requirement: [91, () => EternityChallenge(17).completions > 0],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Delay Antimatter softcap based on Infinity Points`,
    effect: () => Currency.infinityPoints.value.max(1).log10().max(1).log10().cbrt().add(1),
    formatEffect: value => formatPow(value, 3, 3)
  },
  {
    id: 112,
    cost: DC.D1,
    requirement: [101],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Delay Infinity Point softcap based on Eternity Points`,
    effect: () => Currency.eternityPoints.value.max(1).log10().max(1).log10().pow(2).add(1),
    formatEffect: value => formatPow(value, 3, 3)
  },
  {
    id: 113,
    cost: DC.D1,
    requirement: [93, () => EternityChallenge(18).completions > 0],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Delay Eternity Point softcap based on Imaginary Machines`,
    effect: () => Currency.imaginaryMachines.value.max(1).log10().sqrt().add(1),
    formatEffect: value => formatPow(value, 3, 3)
  },
  {
    id: 121,
    cost: DC.D1,
    requirement: [111, 112, 113],
    reqType: CS_REQUIREMENT_TYPE.SOME,
    description: () => `Replicanti speed is boosted based on Infinity Points`,
    effect: () => DC.E4,
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 131,
    cost: DC.D1,
    requirement: [121],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_D,
    description: () => `Tachyon Galaxies are ${formatX(15)} stronger`,
    effect: () => 16,
  },
  {
    id: 132,
    cost: DC.D1,
    requirement: [121],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_D,
    description: () => `Antimatter Galaxies are ${formatX(30)} stronger`,
    effect: () => 31,
  },
  {
    id: 151,
    cost: DC.D1,
    requirement: [131, 132],
    secondRequirement: [() => EternityChallenge(19).completions > 0],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_E,
    description: () => `Multiversal Dimensions are gain a multiplier based on Replicanti`,
    effect: () => Currency.replicanti.value.clampMin(1).log10().clampMin(1).div(1e7).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 152,
    cost: DC.D1,
    requirement: [131, 132],
    secondRequirement: [() => EternityChallenge(19).completions > 0],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_E,
    description: () => `Multiversal Dimensions gain a multiplier based on Tachyon Particles`,
    effect: () => Currency.tachyonParticles.value.clampMin(1).log10().clampMin(1).div(1000).clampMin(1),
    formatEffect: value => formatX(value, 2, 1)
  },
  {
    id: 171,
    cost: DC.D1,
    requirement: [131, 132],
    secondRequirement: [() => EternityChallenge(20).completions > 0],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_F,
    description: () => `Tickspeed exponent ${formatX(1.2, 1, 1)}`,
    effect: () => 1.2,
  },
  {
    id: 172,
    cost: DC.D1,
    requirement: [131, 132],
    secondRequirement: [() => EternityChallenge(20).completions > 0],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_F,
    description: () => `Galaxy Power +${formatInt(1550)}%`,
    effect: () => 15.5,
  },
  {
    id: 181,
    cost: DC.D1,
    requirement: [171],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_G,
    description: () => `Glyph Effects that occur on Power Glyphs are far stronger`,
  },
  {
    id: 182,
    cost: DC.D1,
    requirement: [171],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_G,
    description: () => `Glyph Effects that occur on Infinity Glyphs are far stronger`,
  },
  {
    id: 183,
    cost: DC.D1,
    requirement: [171],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_G,
    description: () => `Glyph Effects that occur on Time Glyphs are far stronger`,
  },
  {
    id: 184,
    cost: DC.D1,
    requirement: [171],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_G,
    description: () => `Glyph Effects that occur on Replication Glyphs are far stronger`,
  },
  {
    id: 185,
    cost: DC.D1,
    requirement: [172],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_G,
    description: () => `Glyph Effects that occur on Dilation Glyphs are far stronger`,
  },
  {
    id: 186,
    cost: DC.D1,
    requirement: [172],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_G,
    description: () => `Glyph Effects that occur on Effarig Glyphs are far stronger`,
  },
  {
    id: 187,
    cost: DC.D1,
    requirement: [172],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_G,
    description: () => `Glyph Effects that occur on Reality Glyphs are far stronger`,
  },
  {
    id: 188,
    cost: DC.D1,
    requirement: [172],
    reqType: CS_REQUIREMENT_TYPE.CHOICE_G,
    description: () => `Effects on Amalgam glyphs are far stronger.`,
  },
  {
    id: 191,
    cost: DC.D1,
    requirement: [181, 182, 183, 184, 185, 186, 187, 188],
    reqType: CS_REQUIREMENT_TYPE.SOME,
    description: () => `Celestial Theorem Antimatter costs are significantly lower`,
    effect: () => 1.1,
    formatEffect: value => formatPow(value, 2, 2)
  },
  {
    id: 221,
    cost: DC.D1,
    requirement: [191],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `You can purchase another row 18 study`,
    effect: () => 1.1,
    formatEffect: value => formatPow(value, 2, 2)
  },
  {
    id: 222,
    cost: DC.D1,
    requirement: [191],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Eternity Challenge 13 cap is doubled.
     (Eternity Challenge 6 and 11 completions are capped at 20)`,
    effect: () => 2,
  },
  {
    id: 223,
    cost: DC.D1,
    requirement: [191],
    reqType: CS_REQUIREMENT_TYPE.ALL,
    description: () => `Tesseract cost exponent is raised ${formatPow(0.5)}`,
    effect: () => 0.5,
  },
  {
    id: 231,
    cost: DC.D1,
    requirement: [221, 222, 223],
    reqType: CS_REQUIREMENT_TYPE.SOME,
    description: () => `You can purchase another row 18 study`,
  },
  {
    id: 232,
    cost: DC.D1,
    requirement: [221, 222, 223],
    secondRequirement: [() => player.antimatter.gt("ee150")],
    reqType: CS_REQUIREMENT_TYPE.SOME_REQ,
    description: () => `Unlock Rapture (Requires ${format("ee150")})`,
  },
  {
    id: 233,
    cost: DC.D1,
    requirement: [221, 222, 223],
    reqType: CS_REQUIREMENT_TYPE.SOME,
    description: () => `Multiversal dimensions are significantly cheaper.
    Raise all Multiversal Dimensions by ${formatPow(1.65, 2, 2)}`,
    effect: () => 1.65,
  },
];
