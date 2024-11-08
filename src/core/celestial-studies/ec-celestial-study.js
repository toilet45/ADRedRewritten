import { CelestialStudy } from "./normal-celestial-study";
import { CelestialStudyState } from "./celestial-studies";

export class ECCelestialStudyState extends CelestialStudyState {
  constructor(config) {
    super(config, CELESTIAL_STUDY_TYPE.ETERNITY_CHALLENGE);
    this.invalidateRequirement();
  }

  get isBought() {
    return player.challenge.eternity.unlocked === this.id;
  }

  purchase(auto) {
    if (GameEnd.creditsEverClosed) return false;
    EternityChallenge(this.id).hasUnlocked = true;
    const clickTime = Date.now();

    if (this.isBought && player.challenge.eternity.current === 0 && !auto) {
      // If it is bought and you aren't in a Eternity Challenge, check
      if (clickTime - ui.lastClickTime < 750) {
        // If you last clicked on it within 3/4ths of a second, enter them in or ask confirmation if they have that on
        ui.lastClickTime = 0;
        EternityChallenge(this.id).requestStart();
      } else {
        // Otherwise, record it for the next time they click
        ui.lastClickTime = clickTime;
      }
    } else if (!this.isBought && this.canBeBought) {
      // If you haven't bought it and can buy it, reset the time of click, and
      // send you into the EC, deduct your resources, and move you to the EC tab if that isn't disabled
      ui.lastClickTime = 0;

      player.challenge.eternity.unlocked = this.id;
      if (!auto) {
        Tab.challenges.eternity.show();
      }
      player.challenge.eternity.requirementBits |= 1 << this.id;
      Currency.celestialTheorems.subtract(this.cost);
      CelestialStudyTree.commitToGameState([TimeStudy.eternityChallenge(this.id)]);
      return true;
    }
    return false;
  }
/* Commented out until we have layout
  purchaseUntil() {
    const studiesToBuy = [
      undefined,
      171, 171, 171,
      143, 42, 121,
      111, 123, 151,
      181, 181, 181
    ];
    // If the player shift clicks an EC study that is immediately buyable, we try to
    // buy it first - in case buying studies up to that point renders it unaffordable.
    this.purchase();
    CelestialStudyTree.commitToGameState(buyStudiesUntil(studiesToBuy[this.id], this.id));
    // For EC 11 and 12, we can't choose between light and dark,
    // but we can buy the 191/193
    if (this.id === 11) {
      TimeStudy(191).purchase();
    } else if (this.id === 12) {
      TimeStudy(193).purchase();
    }
    this.purchase();
  }
*/

  get canBeBought() {
    if (!this.isAffordable) {
      return false;
    }
    if (player.challenge.eternity.unlocked !== 0) {
      return false;
    }
    if (!this.config.requirement.some(s => CelestialStudy(s).isBought)) {
      return false;
    }
    return this.allSecondaryRequirementsMet;
  }

  /**
   * @returns {EternityChallengeState}
   */
  get challenge() {
    return EternityChallenge(this.id);
  }

  get requirementTotal() {
    return this.config.secondary.required(this.challenge.completions);
  }

  get requirementCurrent() {
    const current = this.config.secondary.current();
    if (this.cachedCurrentRequirement === undefined) {
      this.cachedCurrentRequirement = current;
    } else if (typeof current === "number") {
      this.cachedCurrentRequirement = Math.max(this.cachedCurrentRequirement, current);
    } else {
      this.cachedCurrentRequirement = this.cachedCurrentRequirement.clampMin(current);
    }
    return this.cachedCurrentRequirement;
  }

  /* TODO: decide if we want these to be afftected by ECR
  get allSecondaryRequirementsMet() {
    return Perk.studyECRequirement.isBought || !this.hasForbiddenStudies && this.isEntryGoalMet;
  }

  get hasForbiddenStudies() {
    return this.config.secondary.forbiddenStudies?.some(s => CelestialStudy(s).isBought);
  }

  get isEntryGoalMet() {
    if (this.wasRequirementPreviouslyMet) return true;
    if (this.config.secondary.forbiddenStudies) return true;
    const current = this.requirementCurrent;
    const total = this.requirementTotal;
    return typeof current === "number" ? current >= total : current.gte(total);
  }

  get wasRequirementPreviouslyMet() {
    if (this.id === 11 || this.id === 12) return false;
    return (player.challenge.eternity.requirementBits & (1 << this.id)) !== 0;
  }
  */

  invalidateRequirement() {
    this.cachedCurrentRequirement = undefined;
  }
}


ECCelestialStudyState.studies = mapGameData(
  GameDatabase.eternity.celestialStudies.ec,
  config => new ECCelestialStudyState(config)
);

/**
 * @param {number} id
 * @returns {ECTimeStudyState}
 */
CelestialStudy.eternityChallenge = function(id) {
  return ECCelestialStudyState.studies[id];
};

/**
 * @returns {ECCelestialStudyState|undefined}
 */
CelestialStudy.eternityChallenge.current = function() {
  return player.challenge.eternity.unlocked
    ? CelestialStudy.eternityChallenge(player.challenge.eternity.unlocked)
    : undefined;
};

ECCelestialStudyState.invalidateCachedRequirements = function() {
  ECCelestialStudyState.studies.forEach(study => study.invalidateRequirement());
};