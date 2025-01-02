import { GameMechanicState } from "../game-mechanics";
import { V } from "../globals";
/* IDK if needed rn
function showSecondPreferredWarning(currTree) {
  const canPickSecond = currTree.allowedDimPathCount === 2 && currTree.currDimPathCount < 2;
  // Show a warning if the player can choose the second preferred dimension path and hasn't yet done so.
  if (canPickSecond && TimeStudy.preferredPaths.dimension.path.length < 2) {
    GameUI.notify.error("You haven't selected a second preferred Dimension path.");
    return true;
  }
  return false;
}

function showThirdPreferredWarning(currTree) {
  const canPickThird = currTree.allowedDimPathCount === 3 && currTree.currDimPathCount < 3;
  // Warn the layer if there are atleast 4 paths (can only pick 3), but they havent picked a third preferred.
  if (canPickThird && TimeStudy.preferredPaths.dimension.path.length < 3 && Ra.unlocks.MvDUnlock.isUnlocked) {
    GameUI.notify.error("You haven't selected a third preferred Dimension path.");
    return true;
  }
  return false;
}
*/
// This is only ever called from manual player actions, which means we can immediately commit them to the game state
// eslint-disable-next-line complexity
/*
export function buyStudiesUntil(id, ec = -1) {
  let studyArray = [];
  const lastInPrevRow = Math.floor(id / 10) * 10 - 1;
  const requestedPath = CelestialStudy(id).path;
  const currTree = GameCache.currentCelStudyTree.value;
  // Makes an array [start, start+1, ... , end], empty if end < start
  const range = (start, end) => [...Array(Math.clampMin(end - start + 1, 0)).keys()].map(i => i + start);
  const ecHasRequirement = !Perk.studyECRequirement.isBought;

  // If the player tries to buy a study which is immediately buyable, we try to buy it first in case buying other
  // studies up to that point renders it unaffordable. Effectively the clicked study is higher priority than all others
  studyArray.push(id);

  // Greddily buy all studies before the dimension split then try again; if the requested study was above the dimension
  // split, then we're done and don't need to attempt to buy any more
  studyArray.push(...range(11, Math.min(lastInPrevRow, 70)));
  studyArray.push(id);

 //  if (id < 71) return studyArray;

  // Priority for behavior when buying in the Dimension split; we follow only the first applicable entry below:
  // - If we're buying a study within the split, we first buy just the requested path up to the requested study.
  //   (stops buying)
  // - If we want to buy EC11 or EC12 we only buy the required dimension path unless we have the EC requirement perk
  //   (continues onward)
  // - If we can't buy any additional paths or have 3 paths available, we attempt to buy everything here, prioritizing
  //   preferred paths. With less than 3 paths available, this only purchases the rest of any unfinished paths
  //   (continues onward)
  // - If the player has a preferred path, we attempt to buy it (continues onward)
  // - If the player doesn't have a preferred path, we say so and do nothing (stops buying)
  // - Otherwise we do nothing (stops buying)
  if (id < 111) {
    studyArray.push(...NormalCelestialStudies.paths[requestedPath].filter(s => (s <= id)));
    return studyArray;
  }

  if (ec === 11 && ecHasRequirement) {
    studyArray.push(...NormalTimeStudies.paths[TIME_STUDY_PATH.ANTIMATTER_DIM].filter(s => (s <= id)));
  } else if (ec === 12 && ecHasRequirement) {
    studyArray.push(...NormalTimeStudies.paths[TIME_STUDY_PATH.TIME_DIM].filter(s => (s <= id)));
  } else if (currTree.currDimPathCount === currTree.allowedDimPathCount || currTree.allowedDimPathCount === 4 ||
     (currTree.allowedDimPathCount === 3 && !Ra.unlocks.MvDUnlock.isUnlocked)) {
    studyArray.push(...TimeStudy.preferredPaths.dimension.studies);
    studyArray.push([71, 81, 91, 101, 72, 82, 92, 102, 73, 83, 93, 103, 74, 84, 94, 104]);
  } else if (TimeStudy.preferredPaths.dimension.path.length > 0) {
    studyArray.push(...TimeStudy.preferredPaths.dimension.studies);
  } else if (currTree.currDimPathCount === 0) {
    GameUI.notify.error("You haven't selected a preferred Dimension path.");
    return studyArray;
  }

  // Explicitly purchase 111 here if it's included and stop if applicable, as it isn't covered by logic in either split.
  if (id >= 111) studyArray.push(111);

  const secondPreferredWarningShown = showSecondPreferredWarning(currTree);
  const thirdPreferredWarningShown = showThirdPreferredWarning(currTree);

  if (id < 121) return studyArray;

  // Priority for behavior when buying in the Pace split; we follow only the first applicable entry below. In contrast
  // to the Dimension split, here we instead err on the side of not buying extra studies since they will cost ST.
  // - If we're buying a study within the split, we first buy just the requested path up to the requested study.
  //   We don't attempt to buy other paths here because that may waste ST (stops buying)
  // - If V has been fully completed, we just brute-force this whole group (continues onward)
  // - If we already have part of a single path, we buy the rest of it (continues onward)
  // - If we have a preferred path, we buy it all (continues onward)
  // - If we don't have any pace paths at this point, there's no way to objectively choose one (stops buying)
  // - Fallback case: we have more than one path and intentionally do nothing here (continues onward)

  if (id < 151) {
    studyArray.push(...NormalCelestialStudies.paths[TimeStudy(id).path].filter(s => (s <= id)));
    return studyArray;
  }

  const pacePaths = currTree.pacePaths
    .map(pathName => NormalCelestialStudies.pathList.find(p => p.name === pathName).path);
  if (V.isFullyCompleted && !Pelle.isDoomed) {
    const allPace = NormalCelestialStudies.paths[TIME_STUDY_PATH.ACTIVE]
      .concat(NormalCelestialStudies.paths[TIME_STUDY_PATH.PASSIVE])
      .concat(NormalCelestialStudies.paths[TIME_STUDY_PATH.IDLE]);
    studyArray.push(...allPace);
  } else if (pacePaths.length === 1) {
    studyArray.push(...NormalCelestialStudies.paths[pacePaths[0]]);
  } else if (TimeStudy.preferredPaths.pace.path !== 0) {
    studyArray.push(...CelestialStudy.preferredPaths.pace.studies);
  } else if (pacePaths.length === 0) {
    GameUI.notify.error("You haven't selected a preferred Pace path.");
    return studyArray;
  }

  // First we buy up to 201 so we can buy the second preferred path if needed
  studyArray.push(...range(151, Math.min(id, 201)));
  if (id < 201) return studyArray;

  // If we want to buy EC11 or EC12 we don't want 201 unless we have the EC study requirement perk
  if (!(ecHasRequirement && (ec === 11 || ec === 12))) {
    // We need to commit what we have to the game state, because the check for priorityRequirement
    // requires us knowing if we have actually purchased 201.
    CelestialStudyTree.commitToGameState(studyArray);
    studyArray = [];

    // Buy the second preferred dimension path if we have one
    if (CelestialStudy.preferredPaths.dimension.path.length > 0) {
      studyArray.push(...CelestialStudy.preferredPaths.dimension.studies);
      // We need to commit the dimension paths to the game state in order
      // to know if we should display the second preferred path warning.
      CelestialStudyTree.commitToGameState(studyArray);
      studyArray = [];
    }

    if (!secondPreferredWarningShown) showSecondPreferredWarning(GameCache.currentCelStudyTree.value);
    if (!thirdPreferredWarningShown) showThirdPreferredWarning(GameCache.currentCelStudyTree.value);

    studyArray.push(...range(211, Math.min(lastInPrevRow, 214)));

    // If the user clicked on a study in rows 19-22, we've tried to buy up to the previous
    // row. Try to buy that study now:
    studyArray.push(id);
  }

  // Don't bother buying any more studies at or below row 22 unless the player has fully finished V, in which case just
  // brute-force all of them up to the specified study. This buys all pre-triads, then triads sequentially up to the id
  if (id < 221 || !V.isFullyCompleted) return studyArray;
  studyArray.push(...range(221, Math.max(id, 234)));
  return studyArray;
}
*/

export function respecCelestialStudies(auto) {
  for (const study of CelestialStudy.boughtNormalCS()) {
    study.refund();
  }
  player.celestialstudy.studies = [];
  GameCache.celestialStudies.invalidate();
  const ecStudy = CelestialStudy.eternityChallenge.current();
  if (ecStudy !== undefined) {
    ecStudy.refund();
    player.challenge.eternity.unlocked = 0;
  }
  if (!auto) {
    Tab.eternity.celstudies.show();
  }
  GameCache.currentStudyTree.invalidate();
}

export class CelestialStudyState extends GameMechanicState {
  constructor(config, type) {
    super(config);
    this.type = type;
  }

  get cost() {
    return this.config.cost;
  }

  refund() {
    if (player.celestials.v.CTSpent.gt(0)) {
      if (player.celestials.v.CTSpent.sub(this.cost).lt(0)) {
        const surplus = this.cost.sub(player.celestials.v.CTSpent);
        player.celestials.v.CTSpent = new Decimal(0);
        Currency.celestialStudies.add(surplus);
      }
      else {
        V.celestialTheorems.add(this.cost);
        player.celestials.v.CTSpent = player.celestials.v.CTSpent.sub(this.cost);
      }
    }
    else Currency.celestialTheorems.add(this.cost);
  }

  get isAffordable() {
    return Currency.celestialTheorems.value.add(V.availableCT).gte(this.cost);
  }

  get canBeBought() {
    return true;
  }
}
