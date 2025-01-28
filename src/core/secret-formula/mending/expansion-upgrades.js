import { DC } from "../../constants";

const rebuyable = props => {
  // eslint-disable-next-line max-len
  props.cost = () => props.initialCost.times(Decimal.pow(player.celestials.enslaved.expandRebuyables[props.id]));
  const effect = props.effect;
  props.effect = () => effect;
  props.description = () => props.textTemplate;
  props.formatEffect = value => {
    if (props.id === 1) return formatInt(value);
    if (props.id === 2) return value.lt(11) ? `+${formatPercents(value.sub(1), 2, 2)}` : formatX(value, 2, 2);
    if (props.id === 3) return format(value, 2, 0);
    if (props.id === 4) return format(value, 2, 0);
    if (props.id === 5) return `${formatInt(value)}^log²(x) -> ${formatInt(value.add(5))}^log²(x)`;
    return formatX(value, 2, 0);
  };
  props.formatCost = value => format(value, 2, 0);
  return props;
};


export const expansionUpgrades = [
  rebuyable({
    name: "Expansion Upgrade 1",
    id: 1,
    initialCost: new Decimal(100),
    costMult: new Decimal(10),
    textTemplate: "Glyph Levels +100 in Time Expansion",
    effect: () => DC.E1.mul(player.celestials.enslaved.expandRebuyables[1])
  }),
  rebuyable({
    name: "Expansion Upgrade 2",
    id: 2,
    initialCost: new Decimal(1000),
    costMult: new Decimal(1000),
    textTemplate: "Equipped Glyphs are 1% stronger",
    effect: () => player.celestials.enslaved.expandRebuyables[2].div(100).add(1)
  }),
  rebuyable({
    name: "Expansion Upgrade 3",
    id: 3,
    initialCost: new Decimal(500),
    costMult: new Decimal(20),
    textTemplate: "Multiply Infinity Point and Eternity Point gain by 2",
    effect: () => DC.D2.pow(player.celestials.enslaved.expandRebuyables[3])
  }),
  rebuyable({
    name: "Expansion Upgrade 4",
    id: 4,
    initialCost: new Decimal(1000),
    costMult: new Decimal(30),
    textTemplate: `Multiply Gamespeed by 1e10 after softcaps`,
    effect: () => new Decimal(1e10).pow(player.celestials.enslaved.expandRebuyables[4])
  }),
  rebuyable({
    name: "Expansion Upgrade 5",
    id: 5,
    initialCost: DC.D3,
    costMult: new Decimal(50),
    textTemplate: "Increase sixth glyph instability base by 5",
    effect: () => DC.D5.mul(player.celestials.enslaved.expandRebuyables[5]).add(2),
  }),
  {
    name: "Expansion Upgrade 6",
    id: 6,
    cost: 15,
    description: () => `Gamespeed is raised ${formatPow(1.234, 3, 3)} if above ${formatInt(1)}`,
    effect: () => new Decimal(1.234),
    formatEffect: value => formatPow(value, 2, 2)
  },
  {
    name: "Expansion Upgrade 7",
    id: 7,
    cost: 15,
    description: "Memory gain is boosted based on Gamespeed",
    effect: () => Decimal.max(1, (timeEffects.gameTimeSpeedup.add(1)).log10().pow(2).div(10)),
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
    effect: () => (Enslaved.isExpaned ? DC.D1 : DC.D1),
    formatEffect: value => `${format(value)}`
  },
  {
    name: "Expansion Upgrade 12",
    id: 12,
    cost: 50,
    description: () => `Gamespeed softcap applies every ${format("1e400")} instead of every ${format("1e308")}`,
    effect: () => DC.D1,
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
