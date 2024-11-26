import { DC } from "../../constants";

const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
    player.celestials.ra.shop.rebuyables[props.id],
    DC.E30,
    props.initialCost,
    props.costMult,
    props.costMult.div(10),
    DC.E309,
    DC.E3,
    props.initialCost.times(props.costMult)
  );
  const effect = props.effect;
  props.effect = () => effect;
  props.description = () => props.textTemplate.replace("{value}", format(effect));
  props.formatEffect = value => formatX(value, 2, 0);
  props.formatCost = value => format(value, 2, 0);
  return props;
};


export const raShopUpgrades = [
  rebuyable({
    name: "Temporal Amplifier",
    id: 1,
    initialCost: DC.D1,
    costMult: new Decimal("1F300"),
    textTemplate: "You gain ??? {value} times faster",
    effect: DC.D1
  }),
  rebuyable({
    name: "Replicative Amplifier",
    id: 2,
    initialCost: DC.D1,
    costMult: new Decimal("1F300"),
    textTemplate: "You gain ??? {value} times faster",
    effect: DC.D1
  }),
  rebuyable({
    name: "Eternal Amplifier",
    id: 3,
    initialCost: DC.D2,
    costMult: new Decimal("1F300"),
    textTemplate: "You gain {value} times more ???",
    effect: DC.D1
  }),
  rebuyable({
    name: "Superluminal Amplifier",
    id: 4,
    initialCost: DC.D2,
    costMult: new Decimal("1F300"),
    textTemplate: "You gain {value} times more ???",
    effect: DC.D1
  }),
  rebuyable({
    name: "Boundless Amplifier",
    id: 5,
    initialCost: DC.D3,
    costMult: new Decimal(50),
    textTemplate: "You gain {value} times more ???",
    effect: DC.D1
  }),
  {
    name: "Cosmically Duplicate",
    id: 6,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 7,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 8,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 9,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 10,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 11,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 12,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 13,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 14,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 15,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 16,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 17,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 18,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 19,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 20,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 21,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 22,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 23,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 24,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Cosmically Duplicate",
    id: 25,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
];
