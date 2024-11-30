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
    name: "???",
    id: 1,
    initialCost: DC.D1,
    costMult: new Decimal("1F300"),
    textTemplate: "You gain ??? {value} times faster",
    effect: DC.D1
  }),
  rebuyable({
    name: "???",
    id: 2,
    initialCost: DC.D1,
    costMult: new Decimal("1F300"),
    textTemplate: "You gain ??? {value} times faster",
    effect: DC.D1
  }),
  rebuyable({
    name: "???",
    id: 3,
    initialCost: DC.D2,
    costMult: new Decimal("1F300"),
    textTemplate: "You gain {value} times more ???",
    effect: DC.D1
  }),
  rebuyable({
    name: "???",
    id: 4,
    initialCost: DC.D2,
    costMult: new Decimal("1F300"),
    textTemplate: "You gain {value} times more ???",
    effect: DC.D1
  }),
  rebuyable({
    name: "???",
    id: 5,
    initialCost: DC.D3,
    costMult: new Decimal(50),
    textTemplate: "You gain {value} times more ???",
    effect: DC.D1
  }),
  {
    name: "???",
    id: 6,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 7,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 8,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 9,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 10,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 11,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 12,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 13,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 14,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 15,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 16,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 17,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 18,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 19,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 20,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 21,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 22,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 23,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 24,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 25,
    cost: new Decimal("1F300"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
];
