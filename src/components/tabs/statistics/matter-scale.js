import { DC } from "@/core/constants";

function roundAndStr(decimal, amnt = 4) {
  return decimal.toString().substring(0, amnt + Math.max(0, Math.ceil(decimal.log10().toNumber())));
}
export const MatterScale = {
  proton: new Decimal("2.82e-45"),

  estimate(matter) {
    if (!matter) return ["There is no antimatter yet."];
    if (matter.gt(DC.EE16)) {
      const size = this.macroScaleLengths(matter.log10().div(6.25e34));
      return [
        `If each digit of your antimatter count was written at a planck length, your antimatter count would be`,
        `equal to ${format(matter.log10().div(6.25e34).div(size.amount), 2, 2)} ${size.name}`,
      ];
    }
    if (matter.gt(DC.EE14)) {
      return [
        `It would take ${formatX(matter.log10().div(2437102080 * 300), 2)}`,
        "of the current age of the Universe to write out your antimatter count",
        `at ${formatInt(3)} numbers a second`
      ];
    }
    if (matter.gt(DC.E1_5E12)) {
      return [
        `It would take ${roundAndStr(matter.log10().div(2437102080 * 3))}%`,
        "of the current age of the Universe to write out your antimatter count",
        `at ${formatInt(3)} numbers a second`
      ];
    }
    if (matter.gt(new Decimal("1e7200000000"))) {
      return [
        `If you wrote ${formatInt(3)} numbers a second, it would take you`,
        // eslint-disable-next-line max-len
        `${roundAndStr(matter.log10().div(2437102080 * 3))} average American lifespans to write down your antimatter amount.`
      ];
    }
    if (matter.gt(DC.E1E7)) {
      return [
        `It would take ${roundAndStr(matter.log10().div(2437102080 * 3))}%`,
        " of the average American lifespan to write out your antimatter count",
        `at ${formatInt(3)} numbers a second`
      ];
    }
    if (matter.gt(DC.E10000)) {
      return [
        `If you wrote ${formatInt(3)} numbers a second, it would take you`,
        TimeSpan.fromSeconds(matter.log10().div(3)).toString(),
        "to write down your antimatter amount."
      ];
    }
    const planck = new Decimal("4.22419e-105");
    const planckedMatter = matter.times(planck);
    if (planckedMatter.gt(this.proton)) {
      const scale = this.macroScale(planckedMatter);
      const amount = format(planckedMatter.dividedBy(scale.amount), 2, 1);
      return [`If every antimatter were a planck volume, you would have
        enough to ${scale.verb} ${amount} ${scale.name}`];
    }
    const scale = this.microScale(matter);
    return [`If every antimatter were ${format(this.proton.div(scale.amount).div(matter), 2, 1)} ${scale.name},
      you would have enough to make a proton.`];
  },

  microScale(matter) {
    const micro = this.microObjects;
    for (let i = 0; i < micro.length; i++) {
      const scale = micro[i];
      if (matter.times(scale.amount).lt(this.proton)) {
        return scale;
      }
    }
    throw "Cannot determine smallest antimatter scale";
  },

  macroScale(matter) {
    const macro = this.macroObjects;
    const last = macro.last();
    if (matter.gte(last.amount)) return last;
    let low = 0;
    let high = macro.length;
    while (low !== high) {
      const mid = Math.floor((low + high) / 2);
      if (macro[mid].amount.lte(matter)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return macro[high - 1];
  },

  macroScaleLengths(matter) {
    const macro = this.macroLengths;
    const last = macro.last();
    if (matter.gte(last.amount)) return last;
    let low = 0;
    let high = macro.length;
    while (low !== high) {
      const mid = Math.floor((low + high) / 2);
      if (macro[mid].amount.lte(matter)) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }
    return macro[high - 1];
  },

  microObjects: [
    { amount: new Decimal("1e-54"), name: "attometers cubed" },
    { amount: new Decimal("1e-63"), name: "zeptometers cubed" },
    { amount: new Decimal("1e-72"), name: "yoctometers cubed" },
    { amount: new Decimal("4.22419e-105"), name: "planck volumes" }
  ],

  macroObjects: [
    { amount: new Decimal("2.82e-45"), name: "protons", verb: "make" },
    { amount: new Decimal("1e-42"), name: "nuclei", verb: "make" },
    { amount: new Decimal("7.23e-30"), name: "Hydrogen atoms", verb: "make" },
    { amount: new Decimal("5e-21"), name: "viruses", verb: "make" },
    { amount: new Decimal("9e-17"), name: "red blood cells", verb: "make" },
    { amount: new Decimal("6.2e-11"), name: "grains of sand", verb: "make" },
    { amount: new Decimal("5e-8"), name: "grains of rice", verb: "make" },
    { amount: new Decimal("3.555e-6"), name: "teaspoons", verb: "fill" },
    { amount: new Decimal("7.5e-4"), name: "wine bottles", verb: "fill" },
    { amount: DC.D1, name: "fridge-freezers", verb: "fill" },
    { amount: new Decimal("2.5e3"), name: "Olympic-sized swimming pools", verb: "fill" },
    { amount: new Decimal("2.6006e6"), name: "Great Pyramids of Giza", verb: "make" },
    { amount: new Decimal("3.3e8"), name: "Great Walls of China", verb: "make" },
    { amount: new Decimal("5e12"), name: "large asteroids", verb: "make" },
    { amount: new Decimal("4.5e17"), name: "dwarf planets", verb: "make" },
    { amount: new Decimal("1.08e21"), name: "Earths", verb: "make" },
    { amount: new Decimal("1.53e24"), name: "Jupiters", verb: "make" },
    { amount: new Decimal("1.41e27"), name: "Suns", verb: "make" },
    { amount: new Decimal("5e32"), name: "red giants", verb: "make" },
    { amount: new Decimal("8e36"), name: "hypergiant stars", verb: "make" },
    { amount: new Decimal("1.7e45"), name: "nebulas", verb: "make" },
    { amount: new Decimal("1.7e48"), name: "Oort clouds", verb: "make" },
    { amount: new Decimal("3.3e55"), name: "Local Bubbles", verb: "make" },
    { amount: new Decimal("3.3e61"), name: "galaxies", verb: "make" },
    { amount: new Decimal("5e68"), name: "Local Groups", verb: "make" },
    { amount: new Decimal("1e73"), name: "Sculptor Voids", verb: "make" },
    { amount: new Decimal("3.4e80"), name: "observable universes", verb: "make" },
    { amount: new Decimal("1e113"), name: "Dimensions", verb: "make" },
    { amount: DC.C2P1024, name: "Infinity Dimensions", verb: "make" },
  ],

  macroLengths: [
    { amount: new Decimal("0.835e-15"), name: "protons" },
    { amount: new Decimal("11.7e-15"), name: "uranium nuclei" },
    { amount: new Decimal("1.06e-10"), name: "hydrogen atoms" },
    { amount: new Decimal("4e-7"), name: "large viruses" },
    { amount: new Decimal("3e-5"), name: "skin cells" },
    { amount: new Decimal("0.005"), name: "lengths of rice" },
    { amount: new Decimal("0.232"), name: "baseballs" },
    { amount: new Decimal("12"), name: "double-decker buses" },
    { amount: new Decimal("2300"), name: "lengths of the largest dam in the world" },
    { amount: new Decimal("42195"), name: "marathons" },
    { amount: new Decimal(3.1415926535 * 974.6e3), name: "times around Ceres" },
    { amount: new Decimal(40.075e6), name: "times around the equator" },
    { amount: new Decimal(3.1415926535 * 1.39e9), name: "times around the Sun" },
    { amount: new Decimal("150e9"), name: "astronomical units (AU)" },
    { amount: new Decimal("5.9e12"), name: "travels from pluto to the sun" },
    { amount: new Decimal("62.03e12"), name: "around the event horizon of the largest black hole" },
    { amount: new Decimal("30.857e15"), name: "Parsecs" },
    { amount: new Decimal("1.9e18"), name: "travels to closest star identical to ours" },
    { amount: new Decimal("1.54e21"), name: "travels to the most recent naked eye supernova" },
    { amount: new Decimal("30.857e21"), name: "Megaparsecs" },
    { amount: new Decimal("30.857e24"), name: "Gigaparsecs" },
    { amount: new Decimal("2.764e27"), name: "Loops of the observable universe" },
  ]
};
