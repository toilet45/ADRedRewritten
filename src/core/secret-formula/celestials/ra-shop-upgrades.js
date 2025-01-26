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
  props.effect = () => {
    if (props.id === 5) return Decimal.mul(effect, RaUpgrade(props.id).boughtAmount);
    if (props.id === 2) return Decimal.mul(effect.sub(1), RaUpgrade(props.id).boughtAmount).add(1);
    return Decimal.pow(effect, RaUpgrade(props.id).boughtAmount);
  }
  props.description = () => props.textTemplate.replace("{value}", props.formatting(effect));
  // eslint-disable-next-line no-unused-expressions, no-sequences, no-inline-comments, spaced-comment
  props.formatEffect = value => props.formatting(value), /*{
    switch (props.id) {
      case 2:
        return formatPow(value, 2, 2);
      case 5:
        return `+${formatInt(value)}`;
      case 3:
      case 6:
        return `/${format(value, 2, 0)}`;
      default:
        return formatX(value, 2, 0);
    }
  }; */
  props.formatCost = value => format(value, 2, 0);
  return props;
};


export const raShopUpgrades = [
  rebuyable({
    name: "???",
    id: 1,
    initialCost: new Decimal(1e22),
    costMult: new Decimal("1e6"),
    formatting: value => formatX(value, 2, 2),
    textTemplate: "Memory gain {value}",
    effect: DC.D4
  }),
  rebuyable({
    name: "???",
    id: 2,
    initialCost: new Decimal(1e30),
    costMult: new Decimal("1e10"),
    formatting: value => formatPow(value, 2, 2),
    textTemplate: "Memory Chunk gain {value}",
    effect: DC.D1_02
  }),
  rebuyable({
    name: "???",
    id: 3,
    initialCost: DC.E60,
    costMult: new Decimal("1e30"),
    formatting: value => `/${format(value, 2, 2)}`,
    textTemplate: "Post-Level 75 Memory requirements {value}",
    effect: DC.E1
  }),
  rebuyable({
    name: "???",
    id: 4,
    initialCost: DC.E65,
    costMult: new Decimal("1e35"),
    formatting: value => formatX(value, 2, 2),
    textTemplate: "Memory Chunk Softcap start value: {value}",
    effect: DC.D1_3
  }),
  rebuyable({
    name: "???",
    id: 5,
    initialCost: DC.E75,
    costMult: new Decimal(50),
    formatting: value => `+${formatInt(value)}`,
    textTemplate: "Recollection and Fragmentation purchase caps are increased by 1 level",
    effect: DC.D1
  }),
  rebuyable({
    name: "???",
    id: 6,
    initialCost: DC.E105,
    costMult: new Decimal(1e50),
    formatting: value => `/${format(value, 2, 2)}`,
    textTemplate: "Level 100 Memory requirement {value}",
    effect: DC.E2
  }),
  {
    name: "???",
    id: 7,
    cost: new Decimal(1e14), // About Ra 20
    description: "Recollection and Fragmentation for the first four Celestials no longer resets on Mend",
    effect: () => DC.D1,
  },
  {
    name: "???",
    id: 8,
    cost: new Decimal(1e18),
    description: "The upgrade on the left affects all Celestials",
    effect: () => DC.D1,
  },
  {
    name: "???",
    id: 9,
    cost: new Decimal(1e22),
    description: "Increment allowed Dimension Boosts in Ra's Reality by 1",
    effect: () => DC.D1,
  },
  {
    name: "???",
    id: 10,
    cost: new Decimal(1e27),
    description: "Ra's Memories boost Memory gain of the other Celestials",
    effect: () => {
      let x = Ra.pets.ra.memories.clampMin(1).log10().div(2).clampMin(1);
      if (x.gt(50)) x = x.div(10).pow(0.3).times(50);
      return x;
    },
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 11,
    cost: new Decimal(1e33),
    description: () => `Rememberance boost is now ${formatX(15)} and penality is ${formatX(0.7, 1, 1)}`,
    effect: () => DC.D1,
  },
  {
    name: "???",
    id: 12,
    cost: new Decimal(1e35),
    description: "Replicanti Galaxy hardcap in Ra is increased based on Celestial levels",
    effect: () => {
      let x = Ra.totalPetLevel * 50000;
      if (x > 10000000) {
        x /= 100000;
        x **= 0.2;
        x *= 10000000;
      }
      return new Decimal(x);
    },
    formatEffect: value => `+${formatInt(value)}`
  },
  {
    name: "???",
    id: 13,
    cost: new Decimal(1e40), // Ra 50 is about ~e37
    description: "Nameless' Memories increase real time speed at a reduced rate",
    effect: () => Ra.pets.enslaved.memories.clampMin(1).log10().clampMin(1).div(15).clampMin(1),
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 14,
    cost: new Decimal(1e55),
    description: "V's Memories increase Infinity Power Conversion factor",
    effect: () => {
      let x = Ra.pets.ra.memories.clampMin(1).log10().div(15);
      if (x.gt(5)) x = x.div(5).pow(0.2).times(5);
      return x;
    },
    formatEffect: value => `+${format(value, 2, 2)}`
  },
  {
    name: "???",
    id: 15,
    cost: new Decimal(1e75),
    description: "Unlock secondary resources for Memory Chunk gain",
    effect: () => DC.D1,
  },
  {
    name: "???",
    id: 16,
    cost: new Decimal(1e100),
    description: () => `Remove Rembrance penality and boost is now ${formatX(75)}`,
    effect: () => DC.D1,
  },
  {
    name: "???",
    id: 17,
    cost: new Decimal(1e120),
    description: "Remote Galaxy scaling starts later in Ra's Reality based on levels",
    effect: () => {
      let x = DC.E2.times(Ra.totalPetLevel);
      if (x.gt(40000)) {
        x = x.div(40000);
        x = x.pow(0.33);
        x = x.times(40000);
      }
      return x;
    },
    formatEffect: value => `+${formatInt(value)}`
  },
  {
    name: "???",
    id: 18,
    cost: new Decimal(1e150),
    description: "The left and above upgrades are applied outside of Ra at a reduced rate (/10)",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 19, // Ra 90 is about e1081
    cost: new Decimal("1e1100"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 20,
    cost: new Decimal("1e2000"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 21,
    cost: new Decimal("1e5000"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 22,
    cost: new Decimal("1e10000"),
    description: () => `Rememberance boost is now ${formatX(250)}, and affects all Celestials at the same time`,
    effect: () => DC.D1,
  },
  {
    name: "???",
    id: 23,
    cost: new Decimal("1e20000"),
    description: "???",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 24,
    cost: new Decimal("1e50000"),
    description: "Pelle Level 100 requirement is divided by 1e7750",
    effect: () => new Decimal("1e7750"),
  },
];
