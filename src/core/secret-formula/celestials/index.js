import { alchemyResources } from "./alchemy";
import { alchemyResourcesV2 } from "./alchemy-v2";
import { celestialNavigation } from "./navigation";
import { effarigUnlocks } from "./effarig";
import { enslaved } from "./enslaved";
import { finalSigil } from "./navigation-sigils/final-sigil";
import { galaxyIcon } from "./navigation-sigils/galaxy-icon";
import { pelleGalaxyGeneratorUpgrades } from "./galaxy-generator";
import { pelleRifts } from "./rifts";
import { pelleStrikes } from "./strikes";
import { pelleUpgrades } from "./pelle-upgrades";
import { perkShop } from "./perk-shop";
import { quotes } from "./quotes";
import { ra } from "./ra";
import { raShopUpgrades } from "./ra-shop-upgrades";
import { singularityMilestones } from "./singularity-milestones";
import { teresa } from "./teresa";
import { v } from "./v";

export const celestials = {
  effarig: {
    unlocks: effarigUnlocks
  },
  alchemy: {
    resources: alchemyResources
  },
  alchemyV2: {
    resources: alchemyResourcesV2
  },
  pelle: {
    galaxyGeneratorUpgrades: pelleGalaxyGeneratorUpgrades,
    strikes: pelleStrikes,
    upgrades: pelleUpgrades,
    rifts: pelleRifts
  },
  descriptions: {},
  enslaved,
  navigation: celestialNavigation,
  navSigils: {
    ...galaxyIcon,
    ...finalSigil
  },
  perkShop,
  ra,
  raShopUpgrades,
  singularityMilestones,
  teresa,
  quotes,
  v,
};
