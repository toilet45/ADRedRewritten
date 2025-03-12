import { damagedUpgrades } from "./damaged-upgrades";

import { expansionUpgrades } from "./expansion-upgrades";
import { mendingMilestones } from "./mending-milestones";
import { mendingUpgrades } from "./mending-upgrades";

import { ecCelestialStudies } from "./celestial-studies/ec-celestial-studies";
import { normalCelestialStudies } from "./celestial-studies/normal-celestial-studies";

export const mending = {
  mendingMilestones,
  mendingUpgrades,
  expansionUpgrades,
  celestialStudies: {
    ec: ecCelestialStudies,
    normal: normalCelestialStudies
  },
  damagedUpgrades
};
