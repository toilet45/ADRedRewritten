import { Singularity } from "../globals";

import { AutobuyerState } from "./autobuyer";

export class SingularityCapAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.singCap;
  }

  get name() {
    return `Singularity Cap`;
  }

  get isUnlocked() {
    return Ra.unlocks.autoSingCapIncUnlock.canBeApplied;
  }

  get multiplier() {
    return this.data.multiplier;
  }

  set multiplier(value) {
    this.data.multiplier = value.clampMin(1);
  }

  get bulk() {
    return 0;
  }

  get hasInput() {
    return true;
  }

  get inputType() {
    return "decimal";
  }

  get inputEntry() {
    return "multiplier";
  }

  get description() {
    return "Auto condense time (ms)";
  }

  tick() {
    const duration = Singularity.cap.div(Currency.darkEnergy.productionPerSecond).div(getRealTimeSpeedupFactor());
    if (duration.lt((this.multiplier.div(10000)))) {
      Singularity.increaseCap();
    }
    if (duration.gt((this.multiplier.div(1000)))) {
      Singularity.decreaseCap();
    }
  }
}
