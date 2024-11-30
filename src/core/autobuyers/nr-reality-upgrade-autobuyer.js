import { AutobuyerState } from "./autobuyer";

export class NonRepeatableRealityUpgradeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.nonRebuyableUpgrade.reality;
  }

  get name() {
    return `Non-repeatable Reality Upgrade Autobuyer`;
  }

  get isUnlocked() {
    return false;
  }

  get bulk() {
    return 0;
  }

  tick() {
    if (player.auto.nonRebuyableUpgrade.imaginary) {
      for (let i = 6; i <= 25; i++) {
        if (Currency.imaginaryMachines.gte(RealityUpgrade(i).cost) && !RealityUpgrade(i).isBought) {
          RealityUpgrade(i).purchase();
          RealityUpgrade(i).onPurchased();
        }
      }
    }
  }
}

export class NonRepeatableImaginaryUpgradeAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.nonRebuyableUpgrade.imaginary;
  }

  get name() {
    return `Non-repeatable Imaginary Upgrade Autobuyer`;
  }

  get isUnlocked() {
    return MendingUpgrade(17).boughtAmount.gt(6);
  }

  get bulk() {
    return 0;
  }

  tick() {
    if (player.auto.nonRebuyableUpgrade.imaginary) {
      for (let i = 11; i <= 25; i++) {
        if (Currency.imaginaryMachines.gte(ImaginaryUpgrade(i).cost) && !ImaginaryUpgrade(i).isBought) {
          ImaginaryUpgrade(i).purchase();
          ImaginaryUpgrade(i).onPurchased();
        }
      }
    }
  }
}