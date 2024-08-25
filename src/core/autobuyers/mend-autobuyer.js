import { AutobuyerState } from "./autobuyer";

export class MendAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.mend;
  }

  get name() {
    return `Mend`;
  }

  get isUnlocked() {
    return MendingUpgrade(18).isBought;
  }

  get mode() {
    return this.data.mode;
  }

  set mode(value) {
    this.data.mode = value;
  }

  get amount() {
    return this.data.amount;
  }

  get increaseWithMult() {
    return this.data.increaseWithMult;
  }

  set increaseWithMult(value) {
    this.data.increaseWithMult = value;
  }

  set amount(value) {
    this.data.amount = value;
  }

  get time() {
    return this.data.time;
  }

  set time(value) {
    this.data.time = value;
  }

  get xHighest() {
    return this.data.xHighest;
  }

  set xHighest(value) {
    this.data.xHighest = value;
  }

  get hasAdditionalModes() {
    return this.data.hasAdditionalModes;
  }

  set hasAdditionalModes(value) {
    this.data.hasAdditionalModes = value;
  }

  bumpAmount(mult) {
    if (this.isUnlocked && this.increaseWithMult) {
      this.amount = this.amount.times(mult);
    }
  }

  get highestPrevPrestige() {
    // TODO: this
    // return player.records.thisReality.maxEP;
    return DC.D1;
  }

  get timeToNextTick() {
    return Math.clampMin(this.time - Time.thisMendRealTime.totalSeconds.toNumber(), 0);
  }

  get willMend() {
    switch (this.mode) {
      case AUTO_MEND_MODE.AMOUNT:
        return adRedGainedMendingPoints().gte(this.amount);
      case AUTO_MEND_MODE.TIME:
        return Time.thisMendRealTime.totalSeconds.toNumber() > this.time;
      case AUTO_MEND_MODE.X_HIGHEST:
      default:
        return adRedGainedMendingPoints().gte(this.highestPrevPrestige.times(this.xHighest));
    }
  }

  tick() {
    if (this.willMend) mendingResetRequest();
  }

  reset() {
    if (!this.isUnlocked) {
      this.isActive = false;
    }
  }
}
