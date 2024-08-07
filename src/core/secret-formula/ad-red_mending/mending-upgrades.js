/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
import { DC } from "../../constants";

const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
    player.ad_red.mendingRebuyables[props.id],
    DC.E30,
    props.initialCost,
    props.costMult,
    props.costMult.div(10),
    DC.E309,
    DC.E3,
    props.initialCost.times(props.costMult)
  );
  props.effect = () => props.effectCalc(player.ad_red.mendingRebuyables[props.id]);
  props.description = () => props.textTemplate.replace("{value}", props.effectInDesc());
  props.formatEffect = value => formatX(value);
  props.formatCost = value => format(value, 2, 0);
  return props;
};

const hybridRebuyable = props => {
  const purAmnt = () => Math.min(player.ad_red.mendingHybrids[props.id].toNumber(), props.purchaseLimit);
  props.cost = () => props.costs[purAmnt()];
  props.effect = () => player.ad_red.mendingHybrids[props.id];
  props.description = () => props.texts[Math.min(purAmnt(), props.purchaseLimit - 1)]
    .replace("{value}", format(effect[purAmnt()]),
      "{value2}", format(effect2[purAmnt()]));
  props.formatEffect = value => formatX(value, 2, 0);
  props.formatCost = value => format(value, 2, 0);
  // eslint-disable-next-line no-self-assign
  props.purchaseLimit = props.purchaseLimit;
  return props;
};


export const mendingUpgrades = [
  rebuyable({
    name: "1",
    id: 1,
    initialCost: new Decimal("10^^300"),
    costMult: new Decimal("10^^300"),
    textTemplate: "Multiply Multiversal Remain gain by ×{value}",
    effectCalc: amnt => DC.D3.pow(amnt),
    formatEffect: value => formatX(value, 2, 2),
    effectInDesc: () => format(3, 2, 2)
  }),
  hybridRebuyable({
    name: "2",
    id: 2,
    costs: [DC.D1, DC.D1, DC.D1, DC.D1, DC.D2],
    texts: ["ts181 is always active",
      "ts181 and Teresa passive EP gain is always active",
      "ts181, Teresa passive EP gain and charged infinity upgrade 16 is always active",
      "ts181, Teresa passive EP gain and charged infinity upgrade 16 is always active. iM is always at cap.",
      // eslint-disable-next-line max-len
      "ts181, Teresa passive EP gain and charged infinity upgrade 16 is always active. Remnants and iM are always at their respective caps."],
    effect: ["hi", "IP", "IP, EP", "IP, EP, RM", "IP, EP, RM, iM", "IP, EP, RM, iM, Remnants"], // We should have some value here so do this
    effect2: ["hi", "hi", "hi", "hi", "hi", "hi"], // We should have some value here so do this
    purchaseLimit: 5
  }),
  hybridRebuyable({
    name: "3",
    id: 3,
    costs: [DC.D1, DC.D1, DC.D1, DC.D1, DC.D2],
    texts: ["Dimension multipliers ×{value}", "Dimension multipliers ×{value}", "Dimension multipliers ×{value}",
      "Dimension multipliers ×{value}", "Dimension multipliers ×{value}", "Dimension multipliers ×{value}, ^{value2}",
      "Dimension multipliers ×{value}, ^{value2}", "Dimension multipliers ×{value}, ^{value2}",
      // eslint-disable-next-line max-len
      "Dimension multipliers ×{value}, ^{value2}", "Dimension multipliers ×{value}, ^{value2}"], // Amazing code as you can tell
    effect: [new Decimal("1"), new Decimal("1000"), new Decimal("1e20"), new Decimal("1e100"), new Decimal("1e5000"),
      new Decimal("1e5000"), new Decimal("1e5000"), new Decimal("1e5000"), new Decimal("1e5000"),
      new Decimal("1e5000"), new Decimal("1e5000")],
    effect2: [new Decimal("1"), new Decimal("1"), new Decimal("1"), new Decimal("1"),
      new Decimal("1"), new Decimal("1.01"), new Decimal("1.02"), new Decimal("1.03"),
      new Decimal("1.05"), new Decimal("1.075"), new Decimal("1.1")],
    purchaseLimit: 10
  }),
  {
    name: "4",
    id: 4,
    cost: DC.D2,
    description: () => `Glyph Instability is slighly weaker`,
    effect: () => DC.D0_965
  },
  {
    name: "5",
    id: 5,
    cost: DC.D3,
    description: () => `Increase glyph sacrifice caps for Power and Replication glyphs by +${format(1e100, 2, 2)}`,
    effect: () => DC.E100
  },
  rebuyable({
    name: "6",
    id: 6,
    initialCost: DC.D5,
    costMult: DC.E3,
    textTemplate: "RM cap and EP/IP power: {value}",
    effectCalc: value => ({
      rm: DC.E50.pow(value),
      other: Decimal.div(value, 10).min(Decimal.div(value, 10).sqrt()).div(100).add(1)
    }),
    effectInDesc: () => `${formatX(DC.E50, 2, 2)}, +${format(0.001, 3, 3)}`
  }),
  {
    name: "7",
    id: 7,
    cost: () => new Decimal("10^^300"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "8",
    id: 8,
    cost: () => new Decimal("10^^300"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "9",
    id: 9,
    cost: () => new Decimal("10^^300"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "10",
    id: 10,
    cost: () => new Decimal("10^^300"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  rebuyable({
    name: "11",
    id: 11,
    initialCost: new Decimal("30"),
    costMult: new Decimal("75"),
    textTemplate: "Distant and Remote scaling delay +{value}",
    effectCalc: value => new Decimal(2500).pow(value),
    effectInDesc: () => formatInt(2500)
  }),
  {
    name: "12",
    id: 12,
    cost: () => new Decimal("10^^300"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "13",
    id: 13,
    cost: () => new Decimal("10^^300"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "14",
    id: 14,
    cost: () => new Decimal("10^^300"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "15",
    id: 15,
    cost: () => new Decimal("10^^300"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  rebuyable({
    name: "16",
    id: 16,
    initialCost: new Decimal("10^^300"),
    costMult: new Decimal("10^^300"),
    textTemplate: "???",
    effectCalc: () => DC.D1,
    effectInDesc: () => formatInt(1)
  }),
  {
    name: "17",
    id: 17,
    cost: () => new Decimal("10^^300"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "18",
    id: 18,
    cost: () => new Decimal("199"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "19",
    id: 19,
    cost: () => new Decimal("210"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "20",
    id: 20,
    cost: () => new Decimal("250"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
];
