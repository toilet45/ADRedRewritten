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
  props.description = () => props.desc(Math.min(purAmnt(), props.purchaseLimit - 1))
    .replace("{value}", format(props.effectTxt[purAmnt()]),
      "{value2}", format(props.effect2[purAmnt()]));
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
    initialCost: DC.D1,
    costMult: DC.E2,
    textTemplate: "Multiply Multiversal Remain gain by ×{value}",
    effectCalc: amnt => DC.D3.pow(amnt),
    formatEffect: value => formatX(value, 2, 2),
    effectInDesc: () => format(3, 2, 2),
    showCurrentEffect: true,
  }),
  hybridRebuyable({
    name: "2",
    id: 2,
    costs: [DC.D1, DC.D1, DC.D1, DC.D1, DC.D2],
    desc: p => ["Gain passive prestige currency gain (None ➜ IP)",
      "Gain passive prestige currency gain (IP ➜ IP, EP)",
      "Gain passive prestige currency gain (IP, EP ➜ IP, EP, RM)",
      "Imaginary Machines are always equal to their cap (IP, EP, RM ➜ IP, EP, RM, iM)",
      // eslint-disable-next-line max-len
      "Remnants are always equal to their cap (IP, EP, RM, iM ➜ IP, EP, RM, iM, Remnants)"][p],
    // We should have some value here so do this
    effectTxt: ["hi", "IP", "IP, EP", "IP, EP, RM", "IP, EP, RM, iM", "IP, EP, RM, iM, Remnants"],
    effect2: ["hi", "hi", "hi", "hi", "hi", "hi"],
    purchaseLimit: 5
  }),
  hybridRebuyable({
    name: "3",
    id: 3,
    costs: [DC.D0, DC.D1, DC.D1, DC.D1, DC.D1, DC.D2, DC.D2, DC.D2, DC.D3, DC.D3],
    desc: p => `Dimension multiplers ×{value}${p >= 5 ? ", ^{value2}" : ""}`,
    effectTxt: [new Decimal("1"), new Decimal("1000"), new Decimal("1e20"), new Decimal("1e100"), new Decimal("1e5000"),
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
    description: () => `Glyph Instability is slightly weaker`,
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
  hybridRebuyable({
    name: "7",
    id: 7,
    costs: [DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8,
      DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8],
    desc: p => `Eternities are banked on Reality at {value}%\
    ${p >= 11 ? ", and Realities are banked on Mend at {value2}%." : ""}`,
    effectTxt: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
    effect2: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    purchaseLimit: 20
  }),
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
    cost: new Decimal("18"),
    description: () => `Unlock 2 new dilation studies`,
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
    cost: new Decimal("210"),
    description: () => `Unlock Ra's Memories, which go up to level 100.`,
    effect: () => DC.D1
  },
  {
    name: "20",
    id: 20,
    cost: new Decimal("250"),
    description: () => `Warp Reality`,
    effect: () => DC.D1
  },
];
