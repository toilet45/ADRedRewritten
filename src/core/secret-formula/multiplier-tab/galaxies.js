import { MultiplierTabHelper } from "./helper-functions";
import { MultiplierTabIcons } from "./icons";

// See index.js for documentation
export const galaxies = {
  // Note: none of the galaxy types use the global multiplier that applies to all of them within multValue, which
  // very slightly reduces performance impact and is okay because it's applied consistently
  antimatter: {
    name: "Antimatter Galaxies",
    displayOverride: () => {
      const num = player.galaxies.add(GalaxyGenerator.galaxies);
      const mult = MultiplierTabHelper.globalGalaxyMult();
      return `${format(num)}, ${formatX(mult, 2, 2)} strength`;
    },
    multValue: () => Decimal.pow10(player.galaxies.add(GalaxyGenerator.galaxies)),
    isActive: true,
    icon: MultiplierTabIcons.ANTIMATTER,
  },
  replicanti: {
    name: "Replicanti Galaxies",
    displayOverride: () => {
      const num = Replicanti.galaxies.total;
      let rg = Replicanti.galaxies.bought;
      rg = rg.times((DC.D1.add(Effects.sum(TimeStudy(132), TimeStudy(133)))));
      rg = rg.add(Replicanti.galaxies.extra);
      rg = rg.add(Decimal.min(Replicanti.galaxies.bought, ReplicantiUpgrade.galaxies.value).times(
          Effects.sum(EternityChallenge(8).reward)));
      const mult = rg.div(Decimal.clampMin(num, 1)).times(MultiplierTabHelper.globalGalaxyMult());
      return `${formatInt(num)}, ${formatX(mult, 2, 2)} strength`;
    },
    multValue: () => {
      let rg = Replicanti.galaxies.bought;
      rg = rg.times((new Decimal(1).add(Effects.sum(TimeStudy(132), TimeStudy(133)))));
      rg = rg.add(Replicanti.galaxies.extra);
      rg = rg.add(Math.min(Replicanti.galaxies.bought, ReplicantiUpgrade.galaxies.value).times(Effects(EternityChallenge(8).reward)));
      return Decimal.pow10(rg);
    },
    isActive: () => Replicanti.areUnlocked,
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("replication"),
  },
  tachyon: {
    name: "Tachyon Galaxies",
    displayOverride: () => {
      const num = player.dilation.totalTachyonGalaxies;
      const mult = MultiplierTabHelper.globalGalaxyMult().times(new Decimal(1).add(Decimal.max(0, Replicanti.amount.max(1).log10().div(1e6)).times(AlchemyResource.alternation.effectValue)));
      return `${format(num)}, ${formatX(mult, 2, 2)} strength`;
    },
    multValue: () => {
      const num = player.dilation.totalTachyonGalaxies;
      const mult = new Decimal(1).add(Decimal.max(0, Replicanti.amount.max(1).log10().div(1e6)).times(AlchemyResource.alternation.effectValue));
      return Decimal.pow10(num.times(mult));
    },
    isActive: () => player.dilation.totalTachyonGalaxies.gt(0),
    icon: MultiplierTabIcons.SPECIFIC_GLYPH("dilation"),
  },
  nerfPelle: {
    name: "Doomed Reality",
    displayOverride: () => `All Galaxy strength /${formatInt(2)}`,
    powValue: new Decimal(0.5),
    isActive: () => Pelle.isDoomed,
    icon: MultiplierTabIcons.PELLE,
  }
};
