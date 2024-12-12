import { CelestialStudyState } from "./celestial-studies";

export const NormalCelestialStudies = {};

/* NormalCelestialStudies.pathList = [
  { path: TIME_STUDY_PATH.ANTIMATTER_DIM, studies: [71, 81, 91, 101], name: "Antimatter Dims" },
  { path: TIME_STUDY_PATH.INFINITY_DIM, studies: [72, 82, 92, 102], name: "Infinity Dims" },
  { path: TIME_STUDY_PATH.TIME_DIM, studies: [73, 83, 93, 103], name: "Time Dims" },
  { path: TIME_STUDY_PATH.MULTIVERSAL_DIM, studies: [74, 84, 94, 104], name: "Multiversal Dims" },
  { path: TIME_STUDY_PATH.ACTIVE, studies: [121, 131, 141], name: "Active" },
  { path: TIME_STUDY_PATH.PASSIVE, studies: [122, 132, 142], name: "Passive" },
  { path: TIME_STUDY_PATH.IDLE, studies: [123, 133, 143], name: "Idle" },
  { path: TIME_STUDY_PATH.LIGHT, studies: [221, 223, 225, 227, 231, 233], name: "Light" },
  { path: TIME_STUDY_PATH.DARK, studies: [222, 224, 226, 228, 232, 234], name: "Dark" }
];
*/

// NormalCelestialStudies.paths = NormalCelestialStudies.pathList.mapToObject(e => e.path, e => e.studies);

export class NormalCelestialStudyState extends CelestialStudyState {
  constructor(config) {
    const type = CELESTIAL_STUDY_TYPE.NORMAL;
    super(config, type);
    /* Commented out until paths are finalized
    const path = NormalCelestialStudies.pathList.find(p => p.studies.includes(this.id));
    this._path = path?.path ?? CELESTIAL_STUDY_PATH.NONE;
    */
    this._path = CELESTIAL_STUDY_PATH.NONE;
  }

  get isUnlocked() {
    return this.config.unlocked?.() ?? true;
  }

  get isBought() {
    return GameCache.celestialStudies.value[this.id];
  }

  // Its just a bunch of case cases its really not that complex.
  /* eslint-disable max-len, complexity */
  checkRequirement() {
    const check = req => (typeof req === "number"
      ? CelestialStudy(req).isBought
      : req());
    switch (this.config.reqType) {
      case CS_REQUIREMENT_TYPE.AT_LEAST_ONE:
        return this.config.requirement.some(r => check(r));
      case CS_REQUIREMENT_TYPE.ALL:
        return this.config.requirement.every(r => check(r));
      case CS_REQUIREMENT_TYPE.CHOICE_A:
        return !(CelestialStudy(31).isBought || CelestialStudy(32).isBought) && this.config.requirement.some(r => check(r));
      case CS_REQUIREMENT_TYPE.CHOICE_B1:
        return !(CelestialStudy(41).isBought || CelestialStudy(42).isBought) && this.config.requirement.some(r => check(r));
      case CS_REQUIREMENT_TYPE.CHOICE_B2:
        return !(CelestialStudy(43).isBought || CelestialStudy(44).isBought) && this.config.requirement.some(r => check(r));
      case CS_REQUIREMENT_TYPE.CHOICE_C:
        return !(CelestialStudy(91).isBought || CelestialStudy(92).isBought || CelestialStudy(93).isBought) && this.config.requirement.some(r => check(r));
      case CS_REQUIREMENT_TYPE.CHOICE_D:
        return !(CelestialStudy(131).isBought || CelestialStudy(132).isBought) && this.config.requirement.some(r => check(r));
      case CS_REQUIREMENT_TYPE.CHOICE_E:
        return !(CelestialStudy(151).isBought || CelestialStudy(152).isBought) && this.config.requirement.some(r => check(r));
      case CS_REQUIREMENT_TYPE.CHOICE_F:
        return !(CelestialStudy(171).isBought || CelestialStudy(172).isBought) && this.config.requirement.some(r => check(r));
      case CS_REQUIREMENT_TYPE.CHOICE_G1:
        return !(CelestialStudy(181).isBought || CelestialStudy(182).isBought || CelestialStudy(183).isBought || CelestialStudy(184).isBought) && this.config.requirement.some(r => check(r));
      case CS_REQUIREMENT_TYPE.CHOICE_G2:
        return !(CelestialStudy(185).isBought || CelestialStudy(186).isBought || CelestialStudy(187).isBought || CelestialStudy(188).isBought) && this.config.requirement.some(r => check(r));
      default:
        throw Error(`Unrecognized CS requirement type: ${this.reqType}`);
    }
  }
  /* eslint-enable max-len, complexity */

  // This checks for and forbids buying studies due to being part of a set which can't normally be bought
  // together (eg. active/passive/idle and light/dark) unless the player has the requisite ST.
  checkSetRequirement() {
    return true;
  }

  get canBeBought() {
    return this.checkRequirement() && this.checkSetRequirement();
  }

  get isEffectActive() {
    return this.isBought;
  }

  purchase() {
    if (this.isBought || !this.isAffordable || !this.canBeBought) return false;
    if (GameEnd.creditsEverClosed) return false;
    player.celestialstudy.studies.push(this.id);
    Currency.celestialTheorems.subtract(this.cost);
    GameCache.celestialStudies.invalidate();
    CelestialStudyTree.commitToGameState([CelestialStudy(this.id)]);
    return true;
  }

  purchaseUntil() {
    CelestialStudyTree.commitToGameState(buyCelStudiesUntil(this.id));
  }

  get path() {
    return this._path;
  }
}

NormalCelestialStudyState.studies = mapGameData(
  GameDatabase.mending.celestialStudies.normal,
  config => new NormalCelestialStudyState(config)
);

NormalCelestialStudyState.all = NormalCelestialStudyState.studies.filter(e => e !== undefined);

/**
 * @returns {NormalCelestialStudyState}
 */
export function CelestialStudy(id) {
  return NormalCelestialStudyState.studies[id];
}

/**
 * @returns {NormalCelestialStudyState[]}
 */
CelestialStudy.boughtNormalCS = function() {
  return player.celestialstudy.studies.map(id => CelestialStudy(id));
};

/* Not finalized yet
CelestialStudy.preferredPaths = {
  dimension: {
    get path() {
      return player.celestialstudy.preferredPaths[0];
    },
    set path(value) {
      const options = [1, 2, 3];
      player.celestialstudy.preferredPaths[0] = value.filter(id => options.includes(id));
    },
    get studies() {
      return player.celestialstudy.preferredPaths[0].flatMap(path => NormalCelestialStudies.paths[path]);
    },
    get usePriority() {
      return this.path.length > 1 ||
        CelestialStudy(201).isBought ||
        DilationUpgrade.timeStudySplit.isBought ||
        PlayerProgress.realityUnlocked();
    }
  },
  pace: {
    get path() {
      return player.celestialstudy.preferredPaths[1];
    },
    set path(value) {
      const options = [5, 6, 7];
      player.celestialstudy.preferredPaths[1] = options.includes(value) ? value : 0;
    },
    get studies() {
      return NormalCelestialStudies.paths[player.celestialstudy.preferredPaths[1]];
    }
  }
};
*/
