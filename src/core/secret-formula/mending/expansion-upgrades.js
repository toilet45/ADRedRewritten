import { DC } from "../../constants";

const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
    player.celestials.enslaved.expandRebuyables[props.id],
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
  if (props.id === 5) {
    let desc = props.textTemplate.replace("{value}", format(1));
    desc = desc.replace("{C}", format(effect(DC.D1).sub(1))).replace("{V}", format(effect(DC.D1)));
    props.description = desc;
  }
  props.formatEffect = value => formatX(value, 2, 0);
  props.formatCost = value => format(value, 2, 0);
  return props;
};


export const expansionUpgrades = [
  rebuyable({
    name: "Expansion Upgrade 1",
    id: 1,
    initialCost: new Decimal(100),
    costMult: new Decimal(10),
    textTemplate: "Glyph Levels +{value} in Time Expansion",
    effect: DC.E1
  }),
  rebuyable({
    name: "Expansion Upgrade 2",
    id: 2,
    initialCost: new Decimal(1000),
    costMult: new Decimal(1000),
    textTemplate: "Equipped Glyphs are {value}% stronger",
    effect: DC.D1
  }),
  rebuyable({
    name: "Expansion Upgrade 3",
    id: 3,
    initialCost: new Decimal(500),
    costMult: new Decimal(20),
    textTemplate: "Infinity Point and Eternity Point gain x{value}",
    effect: DC.D2
  }),
  rebuyable({
    name: "Expansion Upgrade 4",
    id: 4,
    initialCost: new Decimal(1000),
    costMult: new Decimal(30),
    textTemplate: "Multiply Gamespeed by x{value} after softcaps",
    effect: new Decimal(1e10)
  }),
  rebuyable({
    name: "Expansion Upgrade 5",
    id: 5,
    initialCost: DC.D3,
    costMult: new Decimal(50),
    textTemplate: "Increase hyper logarithm scaling base by {value} ({C}^log²(x) -> {V}^log²(x))",
    effect: DC.D5,
  }),
  {
    name: "Expansion Upgrade 6",
    id: 6,
    cost: 15,
    description: () => `All Gamespeed effects ${formatPow(1.234, 3, 3)}`,
    effect: () => new Decimal(1.234),
    formatEffect: value => formatPow(value, 2, 2)
  },
  {
    name: "Expansion Upgrade 7",
    id: 7,
    cost: 15,
    description: "Memory gain is boosted based on Gamespeed",
    // Is x40 at e400 Gamespeed, TODO: softcap at 50x? --- Nope, needs buff
    effect: () => Decimal.max(1, (getGameSpeedupFactor().add(1)).log10().div(10)),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Expansion Upgrade 8",
    id: 8,
    cost: 15,
    description: () => `Increase Tickspeed Multiplier to ${formatX(1.01, 2, 2)} in Time Expansion`,
    effect: () => new Decimal(1.01),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Expansion Upgrade 9",
    id: 9,
    cost: 15,
    description: "Start Time Expansion with Infinity Challenge 4 and 5 completed",
    effect: () => DC.D1
  },
  {
    name: "Expansion Upgrade 10",
    id: 10,
    cost: 15,
    description: () => `Start every Time Expansion with ${formatInt(1)} Eternity and ${formatInt(6)}
    Eternity Points`,
    effect: () => DC.D1
  },
  {
    name: "Expansion Upgrade 11",
    id: 11,
    cost: 50,
    description: () => `Infinity Dimensions affect Time Dimensions at a reduced rate in Time Expansion`,
    effect: () => DC.D1,
    formatEffect: value => `${format(value)}`
  },
  {
    name: "Expansion Upgrade 12",
    id: 12,
    cost: 50,
    description: () => `Gamespeed softcap applies every ${format("1e400")} instead of every ${format("1e308")}`,
    effect: () => new Decimal("1e400"),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "Expansion Upgrade 13",
    id: 13,
    cost: 50,
    description: () => `Infinity Point softcap is slightly weaker`,
    effect: () => new Decimal(0.96)
  },
  {
    name: "Expansion Upgrade 14",
    id: 14,
    cost: 50,
    description: "Unlock Hypercubes",
    shortDescription: () => `Hypercube Unlock`,
    effect: () => DC.D1,
  },
  {
    name: "PLACEHOLDER",
    id: 15,
    cost: 50,
    description: "PLACEHOLDER BC TOO LAZY TO FIX FORMATTING RIGHT NOW",
    shortDescription: () => `PLLACEHOLDER`,
    effect: () => DC.D1,
    formatEffect: value => `${formatX(value)}`
  },
];
