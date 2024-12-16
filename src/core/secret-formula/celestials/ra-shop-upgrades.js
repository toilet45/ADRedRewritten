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
  props.description = () => props.textTemplate.replace("{value}", format(effect, 2, 2));
  props.formatEffect = value => {
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
  };
  props.formatCost = value => format(value, 2, 0);
  return props;
};


export const raShopUpgrades = [
  rebuyable({
    name: "???",
    id: 1,
    initialCost: new Decimal(1e22),
    costMult: new Decimal("1e6"),
    textTemplate: "You gain Memories {value} times faster",
    effect: DC.D4
  }),
  rebuyable({
    name: "???",
    id: 2,
    initialCost: new Decimal(1e30),
    costMult: new Decimal("1e10"),
    textTemplate: "Raise Memory Chunk gain by ^{value}",
    effect: DC.D1_02
  }),
  rebuyable({
    name: "???",
    id: 3,
    initialCost: DC.E60,
    costMult: new Decimal("1e30"),
    textTemplate: "Post-Level 75 Memory requirements are divided by /{value}",
    effect: DC.E1
  }),
  rebuyable({
    name: "???",
    id: 4,
    initialCost: DC.E65,
    costMult: new Decimal("1e35"),
    textTemplate: "Memory Chunk softcap starts x{value} later",
    effect: DC.D1_3
  }),
  rebuyable({
    name: "???",
    id: 5,
    initialCost: DC.E75,
    costMult: new Decimal(50),
    textTemplate: "Recollection and Fragmentation purchase caps are raised by {value}",
    effect: DC.D1
  }),
  rebuyable({
    name: "???",
    id: 6,
    initialCost: DC.E105,
    costMult: new Decimal(1e50),
    textTemplate: "Level 100 Memory requirement /{value}",
    effect: DC.E2
  }),
  {
    name: "???",
    id: 7,
    cost: new Decimal(2e16), //about Ra 20
    description: "Recollection and Fragmentation for the first four Celestials no longer resets on Mend",
    effect: () => DC.D1,
  },
  {
    name: "???",
    id: 8,
    cost: new Decimal(1e24),
    description: "The upgrade on the left affects all Celestials",
    effect: () => DC.D1,
  },
  {
    name: "???",
    id: 9,
    cost: new Decimal("1F300"),
    description: "Increment allowed Dimension Boosts in Ra's Reality by 1",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 10,
    cost: new Decimal("1F300"),
    description: "Increase Tickspeed Multiplier in Ra's Reality to x1.3",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 11,
    cost: new Decimal("1F300"),
    description: "Rememberance is now x15 and penality is x0.7",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 12,
    cost: new Decimal("1F300"),
    description: "Memory Chunks are generated outside of Ra's Reality",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 13,
    cost: new Decimal("1F300"),
    description: "Free Dimension Boosts are effective in Ra's Reality, but only at 10% efficency",
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
    description: "Unlock secondary resources for Memory Chunk gain",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 16,
    cost: new Decimal("1F300"),
    description: "Rememberance is now x75 and penality is x0.9",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 17,
    cost: new Decimal("1F300"),
    description: "Remote Galaxy scaling starts later in Ra's Reality based on levels",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 18,
    cost: new Decimal("1F300"),
    description: "Unlock Ra's Nightmare (hard Ra)",
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
    description: "Free Dimboosts work at 50% efficiency",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 21,
    cost: new Decimal("1F300"),
    description: "Unlock tertiary resources for Memory Chunk gain",
    effect: () => DC.D1,
    formatEffect: value => formatX(value, 2, 2)
  },
  {
    name: "???",
    id: 22,
    cost: new Decimal("1F300"),
    description: "Remove Rembrance penality, Rememberance boost is now x250, and affects all Celestials at the same time",
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
    cost: new Decimal("1e300"),
    description: "Pelle Level 100 requirement is divided by 1e7750",
    effect: () => new Decimal("1e7750"),
  },
];
