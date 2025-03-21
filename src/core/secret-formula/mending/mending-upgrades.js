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
  if (props.effect) props.effect = p => effect(p ?? player.mending?.rebuyables[props.id]);
  if (props.effects) props.effects = p => effects(p ?? player.mending?.rebuyables[props.id]);
  props.formatCost = value => format(value, 2, 0);
  props.isRebuyable = true;
  return props;
};

const hybridRebuyable = props => {
  const purAmnt = () => Math.min(player.mending?.hybrids[props.id].toNumber(), props.purchaseLimit);
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
    costs: [DC.D0, ...Array.repeat(DC.D1, 5), DC.D2, DC.D2, DC.D2, DC.D2, DC.D3, DC.D3, DC.D0],
    // TODO: change this desc
    description: p => `Antimatter ${p > 2 ? ", Infinity, and Time" : ""}${p === 1 ? "and Infinity" : ""} Dimensions gain a multiplier and a power effect`,
    effects: p => ({
      mult: Laitela.isDamaged ? DC.D1 : [DC.D1, DC.E3, DC.E6, DC.E10, DC.E20, DC.E35, DC.E75,
        DC.E200, DC.E500, DC.E1100, DC.E2000,
        DC.E3500, DC.E5000, DC.E5000][p],
      pow: Laitela.isDamaged ? DC.D1 : new Decimal([1, 1, 1, 1, 1, 1, 1, 1.01, 1.02, 1.03, 1.05, 1.075, 1.1, 1.1][p])
    }),
    formatEffect: effects => `${formatX(effects.mult)}, ${formatPow(effects.pow, 3, 3)}`,
    purchaseLimit: 10
  }),
  hybridRebuyable({
    name: "3",
    id: 3,
    costs: [DC.D1, DC.D1, DC.D1, DC.D1, DC.D2, DC.D0],
    description: p => ["Gain passive Prestige Point gain",
      "Gain passive Prestige Point gain",
      "Gain passive Prestige Point gain",
      "Imaginary Machines are always equal to their cap",
      "Remnants are always equal to their cap",
      "Gain passive Prestige Point gain"][p],
    effect: p => p,
    formatEffect: value => {
      if (value.eq(0)) return "None";
      return ["IP", "EP", "RM", "iM", "Remnants"].slice(0, value.toNumber()).join(", ");
    },
    purchaseLimit: 5
  }),
  {
    name: "4",
    id: 4,
    cost: DC.D2,
    description: () => `Glyph Instability is slightly weaker`,
    effect: () => (Laitela.isDamaged ? DC.D1 : DC.D0_965)
  },
  {
    name: "5",
    id: 5,
    cost: DC.D3,
    description: () => (MendingUpgrade(19).isBought
      ? `Mends multiply pre level 25 Memory gain for the first four Celestials and Dark Matter gain`
      : `Mends multiply Memory and Dark Matter gain`),
    effect: () => {
      let x = Currency.mends.value.add(1);
      // Softcap at x20, hardcap at x1000
      if (x.gt(20)) {
        x = x.div(20);
        x = x.pow(0.33);
        x = x.times(20);
      }
      return x.clampMax(1000);
    },
    formatEffect: value => formatX(value, 2, 2)
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
    costs: [...Array.repeat(DC.D8, 21)],
    // TODO: change this desc
    // eslint-disable-next-line max-len
    description: p => `Bank some of your Eternities on Reality${p >= 10 ? ", and some of your Realities on Mend." : ""}`,
    effects: p => ({
      eternities: Laitela.isDamaged ? DC.D0 : DC.D5.mul(p).min(50),
      realities: Laitela.isDamaged ? DC.D0 : DC.D2.mul(p).sub(20).max(0)
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
    description: () => `Unlock 2 new Dilation studies (affected by ATD)`
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
    costs: [...Array.repeat(new Decimal(50), 21)],
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
      adPow: () => (Laitela.isDamaged ? 1 : 10000),
      idPow: () => (Laitela.isDamaged ? 1 : 777),
      tdPow: () => (Laitela.isDamaged ? 1 : 111),
      tpPow: () => (Laitela.isDamaged ? 1 : 10),
      ttGenPow: () => (Laitela.isDamaged ? 1 : 4),
      bhPow: () => (Laitela.isDamaged ? 1 : 2),
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
      tpDiv: () => (Laitela.isDamaged ? 1 : 222),
      tpPow: () => (Laitela.isDamaged ? 1 : 1.15)
    }
  },
  rebuyable({
    name: "16",
    id: 16,
    initialCost: new Decimal("150"),
    costMult: new Decimal("25"),
    // TODO: change this desc
    description: "Gain Multiversal Galaxies, Divide Antimatter Galaxy cost, Increase power of all Galaxies",
    effects: p => ({
      galaxies: p.mul(6),
      agCost: Decimal.pow(1.001, p),
      agPow: Decimal.pow(1.001, p)
    }),
    formatEffect: effects =>
      // Its literally 121 instead of 120 we can just ignore it
      // eslint-disable-next-line max-len
      `+${formatInt(effects.galaxies)} MG, /${format(effects.agCost, 3, 3)}, +${formatPercents(effects.agPow.sub(1), 3, 3)}`
  }),
  hybridRebuyable({
    name: "QoL Bonanza",
    id: 17,
    costs: [new Decimal(175), ...Array.repeat(new Decimal(65), 8)],
    // eslint-disable-next-line no-unused-vars
    description: p => ["Start every Mend with Continuum unlocked (works in Pelle)",
      "Automatically purchase and sacrifice Music Glyphs",
      "Music Glyphs cost 0 Perk Points",
      "Unlock autobuyers for Ra Memory Levels",
      `Unlock the ability to bump equipped Glyphs' level on Reality`,
      "Remove unlock requirements from Imaginary Upgrades",
      "Automatically purchase non rebuyable Imaginary Upgrades when affordable",
      `Imaginary Machines start generating at ${formatInt(0)} RM`,
      `All QoL bought`][p],
    // eslint-disable-next-line no-unused-vars
    effect: p => p,
    formatEffect: p => `${format(p)} / ${formatInt(8)}`,
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
    description: "Unlock Ra's Memories",
  },
  {
    name: "20",
    id: 20,
    cost: new Decimal("250"),
    description: () => `Unlock Warp Reality, allowing Antimatter to exceed ${format("e9e15", 2, 2)}`,
  },
];
