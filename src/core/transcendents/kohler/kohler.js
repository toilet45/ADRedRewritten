import { BitUpgradeState, RebuyableMechanicState } from "../../game-mechanics";
import { DC } from "../../constants";
import { GameDatabase } from "../../secret-formula/game-database";

import { TranscendentQuotes } from "../quotes";

export const Kohler = {
  get unlocked() {
    return false;
  },

  get trueUnlocked() {
    return false;
  },
  get displayName() {
    return false ? "Kohler" : "???";
  },
  get possessiveName() { 
    return false ? "Kohler's" : "???'s";
  },
  get isRunning() {
    return player.transcendents.kohler.run;
  },
  get isTrueRunning() {
    return player.transcendents.kohler.trueRun;
  },
  quotes: TranscendentQuotes.kohler,
  get symbol() {
    return false ? "<i class='fas fa-staff-snake'></i>" : "?";
  },
  reset() {
    return undefined;
  },
};