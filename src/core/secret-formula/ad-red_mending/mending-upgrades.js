import { DC } from "../../constants";

const rebuyable = props => {
  props.cost = () => getHybridCostScaling(
    player.mending.rebuyables[props.id],
    DC.E30,
    props.initialCost,
    props.costMult,
    props.costMult.div(10),
    DC.E309,
    DC.E3,
    props.initialCost.times(props.costMult)
  );
  const { effect, effects } = props;
  if (props.effect) props.effect = p => effect(p ?? player.mending.rebuyables[props.id]);
  if (props.effects) props.effects = p => effects(p ?? player.mending.rebuyables[props.id]);
  props.formatCost = value => format(value, 2, 0);
  props.isRebuyable = true;
  return props;
};

const hybridRebuyable = props => {
  const purAmnt = () => Math.min(player.mending.hybrids[props.id].toNumber(), props.purchaseLimit);
  props.cost = () => props.costs[purAmnt()];
  const { effect, effects, description } = props;
  props.description = () => description(purAmnt());
  if (props.effect) props.effect = p => effect(p ?? purAmnt().toDecimal());
  if (props.effects) props.effects = p => effects(p ?? purAmnt().toDecimal());
  props.formatCost = value => format(value, 2, 0);
  props.isHybridRebuyable = true;
  return props;
};


export const mendingUpgrades = [
  rebuyable({
    name: "1",
    id: 1,
    initialCost: DC.D1,
    costMult: DC.E2,
    description: () => `Multiply Multiversal Remain gain by ${formatX(3)}`,
    effect: p => DC.D3.pow(p),
    formatEffect: value => formatX(value, 2, 2),
  }),
  hybridRebuyable({
    name: "2",
    id: 2,
    costs: [DC.D1, DC.D1, DC.D1, DC.D1, DC.D2, DC.D0],
    description: p => ["Gain passive Infinity Point gain",
      "Gain passive Eternity Point gain",
      "Gain passive Reality Machine gain",
      "Imaginary Machines are always equal to their cap",
      "Remnants are always equal to their cap",
      "Fully Purchased"][p],
    effect: p => p,
    formatEffect: value => {
      if (value.eq(0)) return "None";
      return ["IP", "EP", "RM", "iM", "Remnants"].slice(0, value.toNumber()).join(", ");
    },
    purchaseLimit: 5
  }),
  hybridRebuyable({
    name: "3",
    id: 3,
    costs: [DC.D0, DC.D1, DC.D1, DC.D1, DC.D1, DC.D2, DC.D2, DC.D2, DC.D3, DC.D3, DC.D0],
    // TODO: change this desc
    description: () => `Antimatter, Infinity, and Time Dimension are multipled than raised to a power`,
    effects: p => ({
      mult: [DC.D1, DC.E3, DC.E20, DC.E100, DC.E5000,
        DC.E5000, DC.E5000, DC.E5000, DC.E5000,
        DC.E5000, DC.E5000, DC.E5000][p],
      pow: new Decimal([1, 1, 1, 1, 1, 1.01, 1.02, 1.03, 1.05, 1.075, 1.1, 1.1][p])
    }),
    formatEffect: effects => `${formatX(effects.mult)}, ${formatPow(effects.pow, 3, 3)}`,
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
    description: () => `Increase glyph sacrifice caps for Power and Replication glyphs by ${formatX(1e100, 2, 2)}`,
    effect: () => DC.E100
  },
  rebuyable({
    name: "6",
    id: 6,
    initialCost: DC.D5,
    costMult: DC.E3,
    // TODO: change this desc
    description: "RM cap, and IP/EP power",
    effects: p => ({
      rm: DC.E50.pow(p),
      // If above 0.01, then multiply by 100, sqrt, and div by 100 (i.e. sqrt but starting earlier)
      other: p.div(10).min(p.div(10).sqrt()).div(100).add(1)
    }),
    formatEffect: effects => `${formatX(effects.rm)}, ${formatPow(effects.other, 2, 4)}`,
  }),
  hybridRebuyable({
    name: "7",
    id: 7,
    costs: [DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8,
      DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D0],
    // TODO: change this desc
    // eslint-disable-next-line max-len
    description: p => `Bank some of your Eternities on Reality${p >= 10 ? ", and some of your Realities on Mend." : ""}`,
    effects: p => ({
      eternities: DC.D5.mul(p).min(50),
      realities: DC.D2.mul(p).sub(20).max(0)
    }),
    formatEffect: effects =>
      // eslint-disable-next-line max-len
      `${formatPercents(effects.eternities.div(100))}${effects.realities.gt(0) ? `, ${formatPercents(effects.realities.div(100))}` : ""}`,
    purchaseLimit: 20
  }),
  {
    name: "8",
    id: 8,
    cost: new Decimal("12"),
    description: () => `The rewards of Eternity Challenges 1, 2, 4, 5, 9, 10, and 12 are more effective`
  },
  {
    name: "9",
    id: 9,
    cost: new Decimal("18"),
    description: () => `Unlock 2 new dilation studies`
  },
  {
    name: "10",
    id: 10,
    cost: new Decimal("25"),
    description: () => `Free Tickspeed cost scaling starts at ${formatInt(1.9e6)} Upgrades`,
    effect: () => new Decimal(1900000)
  },
  rebuyable({
    name: "11",
    id: 11,
    initialCost: new Decimal("30"),
    costMult: new Decimal("75"),
    description: () => `Distant and Remote Galaxy scaling start ${formatInt(2500)} later`,
    effect: p => Decimal.mul(2500, p),
    formatEffect: value => `+${formatInt(value)}`,
  }),
  hybridRebuyable({
    name: "12",
    id: 12,
    costs: [...Array.repeat(new Decimal(50), 20)],
    // TODO: change this desc
    description: () => `Infinity Power conversion, and free Tickspeed scaling increase`,
    effects: p => ({
      ipConversion: p.mul(0.1),
      tsScaling: p.mul(0.01)
    }),
    formatEffect: effects => `+${format(effects.ipConversion, 1, 1)}, -${format(effects.tsScaling, 2, 2)}`,
    purchaseLimit: 20
  }),
  {
    name: "13",
    id: 13,
    cost: new Decimal("66"),
    description: () => `Achievement multiplier is far stronger`,
    effects: {
      adPow: 10000,
      idPow: 777,
      tdPow: 111,
      tpPow: 10,
      ttGenPow: 4,
      bhPow: 2,
    }
  },
  {
    name: "14",
    id: 14,
    cost: new Decimal("99"),
    description: () => `Start every Mend with all Eternity Challenges fully completed (no effect in Pelle)`
  },
  {
    name: "15",
    id: 15,
    cost: new Decimal("123"),
    description: () => `Generate Tachyon Particles based on best Antimatter this Mend, TP formula is better`,
    effects: {
      tpDiv: 222,
      tpPow: 1.15
    }
  },
  rebuyable({
    name: "16",
    id: 16,
    initialCost: new Decimal("150"),
    costMult: new Decimal("25"),
    // TODO: change this desc
    description: "Gain Multiversal Galaxies, Antimatter Galaxy cost, Galaxy Power",
    effects: p => ({
      galaxies: p.mul(6),
      agCost: Decimal.pow(1.001, p),
      agPow: Decimal.pow(1.001, p).sub(1)
    }),
    formatEffect: effects =>
      `${format(effects.galaxies)}, /${format(effects.agCost, 3, 3)}, +${format(effects.agPow, 3, 3)}`
  }),
  hybridRebuyable({
    name: "17",
    id: 17,
    costs: [new Decimal(175), ...Array.repeat(new Decimal(65), 7)],
    // eslint-disable-next-line no-unused-vars
    description: () => "Unlock ??? Dimensions which cost RM and generate ??? - TBD",
    // eslint-disable-next-line no-unused-vars
    effect: p => p,
    formatEffect: p => format(p),
    purchaseLimit: 8,
  }),
  {
    name: "18",
    id: 18,
    cost: new Decimal("199"),
    description: "Unlock an autobuyer for Mends",
  },
  {
    name: "19",
    id: 19,
    cost: new Decimal("210"),
    description: "Unlock Ra's Memories, which go up to level 100.",
  },
  {
    name: "20",
    id: 20,
    cost: new Decimal("250"),
    description: "Unlock Warp Reality",
  },
];
