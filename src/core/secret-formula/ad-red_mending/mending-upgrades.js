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
  const effect = props.effect;
  props.effect = () => player.reality.rebuyables[props.id];
  props.description = () => props.textTemplate.replace("{value}", format(effect));
  props.formatEffect = value => formatX(value, 2, 0);
  props.formatCost = value => format(value, 2, 0);
  return props;
};


export const mendingUpgrades = [
  rebuyable({
    name: "1",
    id: 1,
    initialCost: new Decimal("10^^300"),
    costMult: new Decimal("10^^300"),
    textTemplate: "???",
    effect: DC.D1
  }),
  rebuyable({
    name: "2",
    id: 2,
    initialCost: new Decimal("10^^300"),
    costMult: new Decimal("10^^300"),
    textTemplate: "???",
    effect: DC.D1
  }),
  rebuyable({
    name: "3",
    id: 3,
    initialCost: new Decimal("10^^300"),
    costMult: new Decimal("10^^300"),
    textTemplate: "???",
    effect: DC.D1
  }),
  rebuyable({
    name: "4",
    id: 4,
    initialCost: new Decimal("10^^300"),
    costMult: new Decimal("10^^300"),
    textTemplate: "???",
    effect: DC.D1
  }),
  rebuyable({
    name: "5",
    id: 5,
    initialCost: new Decimal("10^^300"),
    costMult: new Decimal("10^^300"),
    textTemplate: "???",
    effect: DC.D1
  }),
  {
    name: "6",
    id: 6,
    cost: new Decimal("10^^300"),
    requirement: () => `None`,
    hasFailed: () => false,
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `[TBD]`,
    shortDescription: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "7",
    id: 7,
    cost: new Decimal("10^^300"),
    requirement: () => `None`,
    hasFailed: () => false,
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `[TBD]`,
    shortDescription: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "8",
    id: 8,
    cost: new Decimal("10^^300"),
    requirement: () => `None`,
    hasFailed: () => false,
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `[TBD]`,
    shortDescription: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "9",
    id: 9,
    cost: new Decimal("10^^300"),
    requirement: () => `None`,
    hasFailed: () => false,
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `[TBD]`,
    shortDescription: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "10",
    id: 10,
    cost: new Decimal("10^^300"),
    requirement: () => `None`,
    hasFailed: () => false,
    checkRequirement: () => true,
    checkEvent: GAME_EVENT.GAME_TICK_AFTER,
    description: () => `[TBD]`,
    shortDescription: () => `[TBD]`,
    effect: () => DC.D1
  },
];
