import { DC } from "../../constants";

export const alchemyResourcesV2 = {
  // T1 resources ("base" resources)
  "cursed": {
    id: ALCHEMY_RESOURCE_V2.CURSED,
    name: "Cursed",
    symbol: "Ω",
    isBaseResource: true,
    effect: amount => amount.div(100000),
    tier: 1,
    uiOrder: 1,
    unlockedAt: 2,
    description: "reduces the nerfs given by Cursed Glyphs",
    formatEffect: value => `Cursed glyphs are ${formatPercents(value, 2, 2)} weaker`
  },
  "effarig": {
    id: ALCHEMY_RESOURCE_V2.EFFARIG,
    name: "Efffarig",
    symbol: "∞",
    isBaseResource: true,
    effect: amount => amount.floor(),
    tier: 1,
    uiOrder: 2,
    unlockedAt: 3,
    description: "sets a minimum value for base alchemy resources to be",
    formatEffect: value => `Alchemy resources never go below ${formatInt(value)}`
  },
  "amalgamated": {
    id: ALCHEMY_RESOURCE_V2.AMALGAMATED,
    name: "Amalgamated",
    symbol: "Δ",
    isBaseResource: true,
    effect: amount => amount.div(40000),
    tier: 1,
    uiOrder: 3,
    unlockedAt: 4,
    description: "increases the odds the amalgam glyphs contain an extra effect",
    formatEffect: value => `Odds that Amalgam glyphs gain an extra effect ${formatPercents(value, 2, 2)}`
  },
  "reality": {
    id: ALCHEMY_RESOURCE_V2.REALITY,
    name: "Reality",
    symbol: "Ξ",
    isBaseResource: true,
    effect: amount => amount.div(2.5).floor(),
    tier: 1,
    uiOrder: 4,
    unlockedAt: 5,
    description: `increases the level at which Reality Glyphs are generated`,
    formatEffect: value => `Reality Glyph level +${formatInt(value)}`
  },
  "damaged": {
    id: ALCHEMY_RESOURCE_V2.DAMAGED,
    name: "Damaged",
    symbol: "Ψ",
    isBaseResource: true,
    effect: amount => amount.div(10000),
    tier: 1,
    uiOrder: 5,
    unlockedAt: 6,
    description: "increases the levels at which regular glyphs are generated",
    formatEffect: value => `Glyph levels are ${formatPercents(value, 2, 2)} higher`
  },
  "horrific": {
    id: ALCHEMY_RESOURCE_V2.HORRIFIC,
    name: "Horrific",
    symbol: "Ψ",
    isBaseResource: true,
    effect: amount => Decimal.pow10(amount.div(2000)),
    tier: 1,
    uiOrder: 5,
    unlockedAt: 6,
    description: "unknown effect",
    formatEffect: value => `Some effect using ${formatX(value, 2, 2)}`
  },

  // T2 resources (combinations of pairs of T1 resources)
  "bounded": {
    id: ALCHEMY_RESOURCE_V2.BOUNDED,
    name: "Bounded",
    symbol: "α",
    isBaseResource: false,
    effect: amount => Decimal.pow(2, amount.div(100).pow(0.675)),
    tier: 2,
    uiOrder: 3,
    unlockedAt: 8,
    description: "increase caps for infinity and time dimensions",
    formatEffect: value => `Infinity Dimension and Time Dimension caps ${formatX(value, 4, 4)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE_V2.CURSED,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.AMALGAMATED,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.REALITY,
        amount: DC.D1
      }
    ]
  },
  "connection": {
    id: ALCHEMY_RESOURCE.CONNECTION,
    name: "Connection",
    symbol: "τ",
    isBaseResource: false,
    effect: amount => amount.div(1e6),
    tier: 2,
    uiOrder: 2,
    unlockedAt: 9,
    description: "improves glyphs of the same type",
    formatEffect: value => `Glyph effects +${formatPercents(value, 4, 4)} for each glyph of that type`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE_V2.EFFARIG,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.AMALGAMATED,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.REALITY,
        amount: DC.D1
      }
    ]
  },
  "unfixable": {
    id: ALCHEMY_RESOURCE.UNFIXABLE,
    name: "Unfixable",
    symbol: "ρ",
    isBaseResource: false,
    effect: amount => [amount.div(10).floor(), amount.div(10).sqrt().div(10)],
    tier: 2,
    uiOrder: 1,
    unlockedAt: 10,
    description: "reduces the equivalent glyph count, and levels of negative glyphs",
    // eslint-disable-next-line max-len
    formatEffect: value => `Negative glyph levels -${formatInt(value[0])}, Equivalent glyph count -${format(value[1], 3, 3)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE_V2.CURSED,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.HORRIFIC,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.DAMAGED,
        amount: DC.D1
      }
    ]
  },
  "glyphless": {
    id: ALCHEMY_RESOURCE.GLYPHLESS,
    name: "Glyphless",
    symbol: "λ",
    isBaseResource: false,
    effect: amount => amount.div(100000),
    tier: 2,
    uiOrder: 5,
    unlockedAt: 11,
    description: "glyphs become stronger based on how far below 5 the equiv is",
    formatEffect: value => `Based on your Equivalent glyph count,
    gain a boost to all glyph effects by ${formatPercents(value, 2, 2)}`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE_V2.EFFARIG,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.HORRIFIC,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.DAMAGED,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.REALITY,
        amount: DC.D1
      }
    ]
  },

  // T3 resources (The central resource, made with t2 resources)
  "glitched": {
    id: ALCHEMY_RESOURCE.EFFARIG,
    name: "Effarig",
    symbol: "Ϙ",
    isBaseResource: false,
    effect: amount => [amount.div(500000), amount.div(200000).add(1),
      amount.div(150000).add(1), amount.div(2).floor()],
    tier: 3,
    uiOrder: 1.5,
    unlockedAt: 7,
    description: "boosts glyph effects, ip gain, ep gain, and glyph levels",
    formatEffect: value => `Glyph effects are ${formatPercents(value[0], 3, 3)} stronger,
    IP gain ^${format(value[1], 3, 3)}, EP gain ^${format(value[2], 3, 3)}, and
    Glyph levels are increased by +${formatInt(value[3])} after instability`,
    reagents: [
      {
        resource: ALCHEMY_RESOURCE_V2.EFFARIG,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.HORRIFIC,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.DAMAGED,
        amount: DC.D1
      },
      {
        resource: ALCHEMY_RESOURCE_V2.REALITY,
        amount: DC.D1
      }
    ]
  },
};
