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
  props.description = () => props.textTemplate.replace("{value}",
    props.effectInDesc(player.ad_red.mendingRebuyables[props.id]));
  props.formatEffect = value => {
    switch (props.id) {
      case 6: {
        return `${formatX(Decimal.pow(1e50, MendingUpgrade(6).boughtAmount))}, ${formatPow(new Decimal(0.001).times(MendingUpgrade(6).boughtAmount))}`;
      }
      case 11: {
        return `+${formatInt(value)}`;
      }
      default: {
        return formatX(value);
      }
    }
  };
  props.formatCost = value => format(value, 2, 0);
  return props;
};

const hybridRebuyable = props => {
  const purAmnt = () => Math.min(player.ad_red.mendingHybrids[props.id].toNumber(), props.purchaseLimit);
  props.cost = () => props.costs[purAmnt()];
  props.effect = () => player.ad_red.mendingHybrids[props.id];
  props.description = () => {
    switch (props.id) {
      case 3: {
        if (purAmnt() !== props.purchaseLimit) {
          return props.desc(Math.min(purAmnt(), props.purchaseLimit - 1))
            .replace("{value}", `×${format(props.effectTxt[purAmnt()])} ➜ ×${format(props.effectTxt[purAmnt() + 1])}`)
            .replace("{value2}", `^${format(props.effect2[purAmnt()], 3, 3)} ➜ ^${format(props.effect2[purAmnt() + 1], 3, 3)}`);
        }
        return props.desc(Math.min(purAmnt(), props.purchaseLimit - 1))
          .replace("{value}", `×${format(props.effectTxt[purAmnt()])}`)
          .replace("{value2}", `^${format(props.effect2[purAmnt()], 3, 3)}`);
      }
      case 7: {
        if (purAmnt() !== props.purchaseLimit) {
          return props.desc(Math.min(purAmnt(), props.purchaseLimit - 1))
            .replace("{value}", purAmnt() > 9 ? `${formatPercents(props.effectTxt[purAmnt()] / 100)}` : `${formatPercents(props.effectTxt[purAmnt()] / 100)} ➜ ${formatPercents(props.effectTxt[purAmnt() + 1] / 100)}`)
            .replace("{value2}", `${formatPercents(props.effect2[purAmnt() / 100])} ➜ ${formatPercents(props.effect2[purAmnt() + 1] / 100)}`);
        }
        return props.desc(Math.min(purAmnt(), props.purchaseLimit - 1))
          .replace("{value}", `${formatPercents(props.effectTxt[purAmnt()] / 100)}`)
          .replace("{value2}", `${formatPercents(props.effect2[purAmnt()] / 100)}`);
      }
      default: { return props.desc(Math.min(purAmnt(), props.purchaseLimit))
        .replace("{value}", format(props.effectTxt[purAmnt()]))
        .replace("{value2}", format(props.effect2[purAmnt()]));
      }
    }
  };
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
    textTemplate: "Multiply Multiversal Remain gain by {value}",
    effectCalc: amnt => DC.D3.pow(amnt),
    formatEffect: value => formatX(value, 2, 2),
    effectInDesc: () => format(3, 2, 2),
    showCurrentEffect: true,
  }),
  hybridRebuyable({
    name: "2",
    id: 2,
    costs: [DC.D1, DC.D1, DC.D1, DC.D1, DC.D2, new Decimal("1F300")],
    desc: p => ["Gain passive Infinity Point gain (Currently: None ➜ IP)",
      "Gain passive Eternity Point gain (Currently: IP)",
      "Gain passive Reality Machine gain (Currently: IP, EP)",
      "Imaginary Machines are always equal to their cap (Currently: IP, EP, RM)",
      // eslint-disable-next-line max-len
      "Remnants are always equal to their cap (Currently: IP, EP, RM, iM)",
      "Gain passive prestige point gain (Currently: IP, EP, RM, iM, Remnants)"][p],
    // We should have some value here so do this
    effectTxt: ["hi", "IP", "IP, EP", "IP, EP, RM", "IP, EP, RM, iM", "IP, EP, RM, iM, Remnants"],
    effect2: ["hi", "hi", "hi", "hi", "hi", "hi"],
    purchaseLimit: 5
  }),
  hybridRebuyable({
    name: "3",
    id: 3,
    costs: [DC.D0, DC.D1, DC.D1, DC.D1, DC.D1, DC.D2, DC.D2, DC.D2, DC.D3, DC.D3, new Decimal("1F300")],
    desc: () => `Antimatter, Infinity, and Time Dimension multiplers {value} then {value2}`,
    effectTxt: [DC.D1, DC.E3, DC.E20, DC.E100, DC.E5000,
      DC.E5000, DC.E5000, DC.E5000, DC.E5000,
      DC.E5000, DC.E5000, DC.E5000],
    effect2: [DC.D1, DC.D1, DC.D1, DC.D1,
      DC.D1, new Decimal("1.01"), new Decimal("1.02"), new Decimal("1.03"),
      new Decimal("1.05"), new Decimal("1.075"), new Decimal("1.1"), new Decimal(1.1)],
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
    textTemplate: "RM cap and EP/IP power: {value}",
    effectCalc: value => ({
      rm: DC.E50.pow(value),
      // If above 0.01, then multiply by 100, sqrt, and div by 100 (i.e. sqrt but starting earlier)
      other: Decimal.div(value, 10).min(Decimal.div(value, 10).sqrt()).div(100).add(1)
    }),
    effectInDesc: pur => `${formatX(DC.E50, 2, 2)}, +^${format(pur.lt(10) ? 0.001 : pur.div(10).sqrt().div(100), 3, 3)}`,
    // showCurrentEffect: true
  }),
  hybridRebuyable({
    name: "7",
    id: 7,
    costs: [DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8,
      DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8, DC.D8],
    desc: p => `Bank {value} of your Eternities on Reality${p >= 10 ? ", and {value2} of your Realities on Mend." : ""}`,
    effectTxt: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, ...Array.repeat(50, 11)],
    effect2: [...Array.repeat(0, 11), 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    purchaseLimit: 20
  }),
  {
    name: "8",
    id: 8,
    cost: new Decimal("12"),
    description: () => `Improve the effect of some eternity challenges`,
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
    cost: new Decimal("25"),
    description: () => `??`,
    effect: () => DC.D1
  },
  rebuyable({
    name: "11",
    id: 11,
    initialCost: new Decimal("30"),
    costMult: new Decimal("75"),
    textTemplate: "Distant and Remote Galaxy scaling starts {value} later",
    effectCalc: value => new Decimal(2500).times(value),
    effectInDesc: () => formatInt(2500),
    showCurrentEffect: true,
  }),
  hybridRebuyable({
    name: "12",
    id: 12,
    costs: [new Decimal(50)],
    desc: p => `TBD`,
    effectTxt: [...Array.repeat(0, 11)],
    effect2: [...Array.repeat(0, 11)],
    purchaseLimit: 1
  }),
  {
    name: "13",
    id: 13,
    cost: new Decimal("66"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "14",
    id: 14,
    cost: new Decimal("99"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  {
    name: "15",
    id: 15,
    cost: new Decimal("123"),
    description: () => `[TBD]`,
    effect: () => DC.D1
  },
  rebuyable({
    name: "16",
    id: 16,
    initialCost: new Decimal("150"),
    costMult: new Decimal("10^^300"),
    textTemplate: "???",
    effectCalc: () => DC.D1,
    effectInDesc: () => formatInt(1)
  }),
  hybridRebuyable({
    name: "17",
    id: 17,
    costs: [new Decimal(175)],
    desc: p => `TBD`,
    effectTxt: [...Array.repeat(0, 11)],
    effect2: [...Array.repeat(0, 11)],
    purchaseLimit: 1
  }),
  {
    name: "18",
    id: 18,
    cost: new Decimal("199"),
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
