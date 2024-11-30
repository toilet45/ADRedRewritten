import { RaPetAutobuyerState } from "./ra-memory-autobuyer";

export class TeresaMemoryAutobuyerState extends RaPetAutobuyerState {
  get _petName() { return "teresa"; }

  get isUnlocked() {
    return MendingUpgrade(17).boughtAmount.gt(3);
  }

  static get autobuyerGroupName() { return "Teresa's Memory"; }
  static get isActive() { return player.auto.raMemories.teresa.isActive; }
  static set isActive(value) { player.auto.raMemories.teresa.isActive = value; }
}

export class EffarigMemoryAutobuyerState extends RaPetAutobuyerState {
  get _petName() { return "effarig"; }

  get isUnlocked() {
    return MendingUpgrade(17).boughtAmount.gt(3);
  }

  static get autobuyerGroupName() { return "Effarig's Memory"; }
  static get isActive() { return player.auto.raMemories.effarig.isActive; }
  static set isActive(value) { player.auto.raMemories.effarig.isActive = value; }
}

export class EnslavedMemoryAutobuyerState extends RaPetAutobuyerState {
  get _petName() { return "enslaved"; }

  get isUnlocked() {
    return MendingUpgrade(17).boughtAmount.gt(3);
  }

  static get autobuyerGroupName() { return "Nameless' Memory"; }
  static get isActive() { return player.auto.raMemories.enslaved.isActive; }
  static set isActive(value) { player.auto.raMemories.enslaved.isActive = value; }
}

export class VMemoryAutobuyerState extends RaPetAutobuyerState {
  get _petName() { return "v"; }

  get isUnlocked() {
    return MendingUpgrade(17).boughtAmount.gt(3);
  }

  static get autobuyerGroupName() { return "V's Memory"; }
  static get isActive() { return player.auto.raMemories.v.isActive; }
  static set isActive(value) { player.auto.raMemories.v.isActive = value; }
}

export class RaMemoryAutobuyerState extends RaPetAutobuyerState {
  get _petName() { return "ra"; }

  get isUnlocked() {
    return MendingUpgrade(17).boughtAmount.gt(3);
  }

  static get autobuyerGroupName() { return "Ra's Memory"; }
  static get isActive() { return player.auto.raMemories.ra.isActive; }
  static set isActive(value) { player.auto.raMemories.ra.isActive = value; }
}

export class LaitelaMemoryAutobuyerState extends RaPetAutobuyerState {
  get _petName() { return "laitela"; }

  get isUnlocked() {
    return MendingUpgrade(17).boughtAmount.gt(3) && Ra.unlocks.laiMemoryUnlock.canBeApplied;
  }

  static get autobuyerGroupName() { return "Lai'tela's Memory"; }
  static get isActive() { return player.auto.raMemories.laitela.isActive; }
  static set isActive(value) { player.auto.raMemories.laitela.isActive = value; }
}

export class PelleMemoryAutobuyerState extends RaPetAutobuyerState {
  get _petName() { return "pelle"; }

  get isUnlocked() {
    return MendingUpgrade(17).boughtAmount.gt(3) && Ra.unlocks.pelleMemoryUnlock.canBeApplied;
  }

  static get autobuyerGroupName() { return "Pelle's Memory"; }
  static get isActive() { return player.auto.raMemories.pelle.isActive; }
  static set isActive(value) { player.auto.raMemories.pelle.isActive = value; }
}