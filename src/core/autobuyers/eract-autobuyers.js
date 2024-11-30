import { AutobuyerState } from "./autobuyer";

export class TesseractAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.tesseract;
  }

  get name() {
    return `Tesseract`;
  }

  get isUnlocked() {
    return false;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    Tesseracts.buyTesseract();
  }
}

export class PenteractAutobuyerState extends AutobuyerState {
  get data() {
    return player.auto.penteract;
  }

  get name() {
    return `Penteract`;
  }

  get isUnlocked() {
    return false;
  }

  get hasUnlimitedBulk() {
    return true;
  }

  tick() {
    Penteracts.buyPenteract();
  }
}