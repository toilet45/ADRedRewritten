import { dilationUpgrades } from "./dilation-upgrades";
import { eternityMilestones } from "./eternity-milestones";
import { eternityUpgrades } from "./eternity-upgrades";

import { dilationTimeStudies } from "./time-studies/dilation-time-studies";
import { ecTimeStudies } from "./time-studies/ec-time-studies";
import { normalTimeStudies } from "./time-studies/normal-time-studies";

import { ecCelestialStudies } from "./celestial-studies/ec-celestial-studies";
import { normalCelestialStudies } from "./celestial-studies/normal-celestial-studies";

export const eternity = {
  dilation: dilationUpgrades,
  milestones: eternityMilestones,
  timeStudies: {
    dilation: dilationTimeStudies,
    ec: ecTimeStudies,
    normal: normalTimeStudies
  },
  celestialStudies: {
    ec: ecCelestialStudies,
    normal: normalCelestialStudies
  },
  upgrades: eternityUpgrades
};
