import { DC } from "../../constants";
import { GameMechanicState } from "../../game-mechanics";
import { Quotes } from "../quotes";

class RaUnlockState extends GameMechanicState {
  get bits() { return player.celestials.ra.unlockBits; }
  set bits(value) { player.celestials.ra.unlockBits = value; }

  get isUnlocked() {
    return player.celestials.ra.unlocks.includes(this.id);
  }

  get disabledByPelle() {
    return Pelle.isDoomed && this.config.disabledByPelle;
  }

  get isEffectActive() {
    return this.isUnlocked && !this.disabledByPelle;
  }

  get requirementText() {
    const pet = this.pet.name;
    return this.level === 1
      ? `Unlock ${pet}`
      : `Get ${pet} to level ${this.level}`;
  }

  get reward() {
    return typeof this.config.reward === "function"
      ? this.config.reward()
      : this.config.reward;
  }

  get displayIcon() {
    return this.disabledByPelle ? `<span class="fas fa-ban"></span>` : this.config.displayIcon;
  }

  get pet() {
    return Ra.pets[this.config.pet];
  }

  get level() {
    return this.config.level;
  }

  get canBeUnlocked() {
    return this.pet.level >= this.level && !this.isUnlocked;
  }

  unlock() {
    if (this.canBeUnlocked) player.celestials.ra.unlocks.push(this.id);
  }

  onUnlock() {
    player.celestials.ra.unlocks.push(this.id);
    this.config.onUnlock?.();
  }
}

const unlocks = mapGameDataToObject(
  GameDatabase.celestials.ra.unlocks,
  config => new RaUnlockState(config)
);

class RaPetState extends GameMechanicState {
  get data() {
    return player.celestials.ra.pets[this.id];
  }

  get name() {
    return this.config.name;
  }

  get chunkGain() {
    return this.config.chunkGain;
  }

  get secondaryChunkGain() {
    return this.config.secondaryChunkGain;
  }

  get memoryGain() {
    return this.config.memoryGain;
  }

  get color() {
    return this.config.color;
  }

  get requiredUnlock() {
    return this.config.requiredUnlock?.();
  }

  get rawMemoryChunksPerSecond() {
    return this.config.rawMemoryChunksPerSecond();
  }

  get secondaryChunkMultiplier() {
    return this.config.secondaryChunkMultiplier();
  }

  get memoryProductionMultiplier() {
    let x = this.config.memoryProductionMultiplier();
    x = x.times(this.level < 25 && (this.name === "Teresa" || this.name === "Effarig" ||
       this.name === "The Nameless Ones" || this.name === "V") ? MendingUpgrade(5).effectOrDefault(1) : 1);
    return x;
  }

  get isUnlocked() {
    return this.requiredUnlock === undefined || this.requiredUnlock === true || this.requiredUnlock.isUnlocked;
  }

  get isCapped() {
    // eslint-disable-next-line no-nested-ternary
    return this.level >= (this.name === "Ra" ? (MendingUpgrade(20).isBought ? 100 : 25) : Ra.levelCap);
  }

  get level() {
    return this.isUnlocked ? this.data.level : 0;
  }

  set level(value) {
    this.data.level = value;
  }

  get memories() {
    return this.data.memories;
  }

  set memories(value) {
    this.data.memories = value;
  }

  get memoryChunks() {
    return this.data.memoryChunks;
  }

  set memoryChunks(value) {
    this.data.memoryChunks = value;
  }

  get requiredMemories() {
    let x = Ra.requiredMemoriesForLevel(this.level, this.name);
    if (this.level >= 75) x = x.div(RaUpgrade(3).effectOrDefault(1));
    if (this.level >= 100) {
      x = x.div(RaUpgrade(6).effectOrDefault(1));
      if (this.name === "Pelle") x = x.div(RaUpgrade(24).effectOrDefault(1));
    }
    return x;
  }

  get memoryChunksPerSecond() {
    if (!this.canGetMemoryChunks) return DC.D0;
    let res = this.rawMemoryChunksPerSecond.mul(this.chunkUpgradeCurrentMult)
      .mul(Effects.product(Ra.unlocks.continuousTTBoost.effects.memoryChunks))
      .mul(GlyphInfo.reality.sacrificeInfo.effect());
    if (this.hasRemembrance) res = res.mul(Ra.remembrance.multiplier);
    else if (Ra.petWithRemembrance) res = res.mul(Ra.remembrance.nerf);
    if (RaUpgrade(15).isBought) res = res.mul(this.secondaryChunkMultiplier);
    return res.times(dev.speedUp);
  }

  get canGetMemoryChunks() {
    return this.isUnlocked && Ra.isRunning;
  }

  get hasRemembrance() {
    return Ra.petWithRemembrance === this.name;
  }

  get memoryUpgradeCurrentMult() {
    let x = Decimal.pow(1.3, this.data.memoryUpgrades).timesEffectOf(RaUpgrade(1));
    if (this.name !== "Ra") {
      x = x.times(RaUpgrade(10).effectOrDefault(1));
    }
    return x;
  }

  get chunkUpgradeCurrentMult() {
    return Decimal.pow(1.5, this.data.chunkUpgrades).powEffectOf(RaUpgrade(2));
  }

  get memoryUpgradeCost() {
    return Decimal.pow(5, this.data.memoryUpgrades).mul(DC.E3);
  }

  get chunkUpgradeCost() {
    return Decimal.pow(25, this.data.chunkUpgrades).mul(5000);
  }

  get canBuyMemoryUpgrade() {
    return this.memoryUpgradeCost.lte(this.memories);
  }

  get canBuyChunkUpgrade() {
    return this.chunkUpgradeCost.lte(this.memories);
  }

  get memoryUpgradeCapped() {
    return this.memoryUpgradeCost.gte(Ra.requiredMemoriesForLevel(24).div(2).mul(Effects.sum(RaUpgrade(5)).mul(5)));
  }

  get chunkUpgradeCapped() {
    return this.chunkUpgradeCost.gte(Ra.requiredMemoriesForLevel(24).div(2).mul(Effects.sum(RaUpgrade(5)).mul(25)));
  }

  purchaseMemoryUpgrade() {
    if (!this.canBuyMemoryUpgrade || this.memoryUpgradeCapped) return;

    this.memories = this.memories.sub(this.memoryUpgradeCost);
    this.data.memoryUpgrades++;
  }

  purchaseChunkUpgrade() {
    if (!this.canBuyChunkUpgrade || this.chunkUpgradeCapped) return;

    this.memories = this.memories.sub(this.chunkUpgradeCost);
    this.data.chunkUpgrades++;
  }

  levelUp() {
    if (this.memories.lt(this.requiredMemories)) return;
    if (this.isCapped) return;

    this.memories = this.memories.sub(this.requiredMemories);
    this.level++;
    Ra.checkForUnlocks();
    Ra.checkUnlockUnlocks();
  }

  get unlocks() {
    return Ra.unlocks.all
      .filter(x => x.pet === this)
      .sort((a, b) => a.level - b.level);
  }

  tick(realDiff, generateChunks) {
    const seconds = realDiff.div(1000);
    const newMemoryChunks = generateChunks
      ? seconds.mul(this.memoryChunksPerSecond)
      : DC.D0;
    // Adding memories from half of the gained chunks this tick results in the best mathematical behavior
    // for very long simulated ticks
    const newMemories = seconds.mul(this.memoryChunks.add(newMemoryChunks.div(2)))
      .mul(Ra.productionPerMemoryChunk).mul(this.memoryUpgradeCurrentMult);
    this.memoryChunks = this.memoryChunks.add(newMemoryChunks);
    this.memories = this.memories.add(newMemories);
  }

  reset(mu19 = false) {
    if (!mu19) this.data.level = 1;
    this.data.memories = DC.D0;
    this.data.memoryChunks = DC.D0;
    const cel5Plus = (this.name === "Ra" || this.name === "Lai'tela" || this.name === "Pelle");
    if ((cel5Plus && !RaUpgrade(8).canBeApplied)) {
      this.data.memoryUpgrades = 0;
      this.data.chunkUpgrades = 0;
    }
    if ((!cel5Plus && !RaUpgrade(7).canBeApplied)) {
      this.data.memoryUpgrades = 0;
      this.data.chunkUpgrades = 0;
    }
  }
}

const pets = mapGameDataToObject(
  GameDatabase.celestials.ra.pets,
  config => new RaPetState(config)
);

export const Ra = {
  displayName: "Ra",
  possessiveName: "Ra's",
  unlocks,
  pets,
  remembrance: {
    get multiplier() {
      if (RaUpgrade(22).canBeApplied) return 250;
      if (RaUpgrade(16).canBeApplied) return 75;
      if (RaUpgrade(11).canBeApplied) return 15;
      return 5;
    },
    get nerf() {
      if (RaUpgrade(16).canBeApplied) return 1;
      if (RaUpgrade(11).canBeApplied) return 0.7;
      return 0.5;
    },
    requiredLevels: 20,
    get isUnlocked() {
      return Ra.totalPetLevel >= this.requiredLevels;
    }
  },
  // Dev/debug function for easier testing
  reset(mu19 = false) {
    const data = player.celestials.ra;
    data.unlockBits = 0;
    data.run = false;
    data.charged = new Set();
    data.disCharge = false;
    data.breakDisCharge = false;
    data.peakGamespeed = DC.D1;
    data.alchemy = Array.repeat(0, 21)
      .map(() => ({
        amount: DC.D0,
        reaction: false
      }));
    data.highestRefinementValue = {
      power: DC.D0,
      infinity: DC.D0,
      time: DC.D0,
      replication: DC.D0,
      dilation: DC.D0,
      effarig: DC.D0
    };
    data.momentumTime = DC.D0;
    data.unlocks = [];
    data.petWithRemembrance = "";
    for (const pet of Ra.pets.all) pet.reset(mu19);
  },
  memoryTick(realDiff, generateChunks) {
    if (!this.isUnlocked) return;
    for (const pet of Ra.pets.all) pet.tick(realDiff, generateChunks);
  },
  get productionPerMemoryChunk() {
    let res = Effects.product(Ra.unlocks.continuousTTBoost.effects.memories, Achievement(168));
    for (const pet of Ra.pets.all) {
      if (pet.isUnlocked) res = res.mul(pet.memoryProductionMultiplier);
    }
    res = res.mul(Ra.unlocks.achToMemories.effectOrDefault(new Decimal(1)));
    res = res.mul(Ra.unlocks.memGainOutsideRa.canBeApplied && !Ra.isRunning ? 20 : 1);
    res = res.mul(ExpansionUpgrade(7).effectOrDefault(1));
    return res;
  },
  get memoryBoostResources() {
    const boostList = [];
    for (const pet of Ra.pets.all) {
      if (new Decimal(pet.memoryProductionMultiplier).neq(1) && pet.name !== "Ra") boostList.push(pet.memoryGain);
    }
    if (Achievement(168).isUnlocked) boostList.push("Achievement 168");
    if (Ra.unlocks.continuousTTBoost.canBeApplied) boostList.push("current TT");
    if (Ra.unlocks.achToMemories.canBeApplied) boostList.push("Achievement Multiplier");
    if (Ra.unlocks.memGainOutsideRa.canBeApplied & !Ra.isRunning) boostList.push("Ra level 30");
    if (MendingUpgrade(5).isBought) boostList.push("Mending Upgrade 5");

    if (boostList.length === 1) return `${boostList[0]}`;
    if (boostList.length === 2) return `${boostList[0]} and ${boostList[1]}`;
    return `${boostList.slice(0, -1).join(", ")}, and ${boostList[boostList.length - 1]}`;
  },
  // This is the exp required ON "level" in order to reach "level + 1"
  requiredMemoriesForLevel(level, petName = "teresa") {
    if (level >= (MendingUpgrade(19).isBought ? 100 : 25)) return DC.BEMAX;
    const adjustedLevel = Decimal.pow(level, 2).div(10).add(level - (Ra.unlocks.scaleReduce ? 3 : 0)).max(1);
    const post15Scaling = Decimal.pow(1.5, Decimal.max(0, level - (Ra.unlocks.scaleReduce ? 17 : 15)));
    const post25Scaling = Decimal.pow(1.05, Decimal.max(0, level - (Ra.unlocks.scaleReduce ? 27 : 25)).pow(2));
    const post65Scaling = Decimal.pow(1.2, Decimal.max(0, level - (Ra.unlocks.scaleReduce ? 67 : 65)).pow(3));
    let req = Decimal.floor(Decimal.pow(adjustedLevel, 5.52).mul(post15Scaling)
      .mul(post25Scaling).mul(post65Scaling).mul(DC.E6));
    if (["teresa", "effarig", "enslaved", "v"].includes(petName.toLowerCase()) && level < 25) return req;
    if (petName.toLowerCase() === "ra") req = req.pow(0.65);
    if (petName.toLowerCase() === "teresa") req = req.pow(1.1);
    if (petName.toLowerCase() === "effarig") req = req.pow(1.25);
    if (petName.toLowerCase() === "enslaved") req = req.pow(1.4);
    if (petName.toLowerCase() === "v") req = req.pow(1.65);
    if (petName.toLowerCase() === "laitela") req = req.mul(1e12).pow(2);
    if (petName.toLowerCase() === "pelle") req = req.pow(4).mul(1e50);
    if (level > 90) req = req.pow(1 + (level - 85) / 100);
    return req;
  },
  // Returns a string containing a time estimate for gaining a specific amount of exp (UI only)
  timeToGoalString(pet, expToGain) {
    // Quadratic formula for growth (uses constant growth for a = 0)
    const a = Enslaved.isStoringRealTime
      ? DC.D0
      : Ra.productionPerMemoryChunk.mul(pet.memoryUpgradeCurrentMult).mul(pet.memoryChunksPerSecond).div(2);
    const b = Ra.productionPerMemoryChunk.mul(pet.memoryUpgradeCurrentMult).mul(pet.memoryChunks);
    const c = expToGain.neg();
    let estimate = a.eq(0)
      ? c.neg().div(b)
      : decimalQuadraticSolution(a, b, c);
    estimate = estimate.div(getRealTimeSpeedupFactor());
    if (Decimal.isFinite(estimate)) {
      return estimate.lt(31536000 * 100)
        ? `in ${TimeSpan.fromSeconds(new Decimal(estimate)).toStringShort()}`
        : `in more than ${TimeSpan.fromSeconds(new Decimal(31536000 * 100)).toStringShort()}`;
    }
    return "";
  },
  get totalPetLevel() {
    return this.pets.all.map(pet => (pet.isUnlocked ? pet.level : 0)).nSum();
  },
  get levelCap() {
    if (MendingUpgrade(19).isBought) {
      if (Ra.unlocks.finalCelMemoryInc.isUnlocked) {
        return 100;
      }
      if (Ra.unlocks.secondToLastLevelInc.isUnlocked) {
        return 90;
      }
      if (Ra.unlocks.anotherLevelIncAgain.isUnlocked) {
        return 75;
      }
      if (Ra.unlocks.anotherLevelInc.isUnlocked) {
        return 55;
      }
      if (Ra.unlocks.levelIncAgain.isUnlocked) {
        return 40;
      }
      if (Ra.unlocks.levelInc.isUnlocked) {
        return 30;
      }
    }
    return 25;
  },
  get maxTotalPetLevel() {
    return this.levelCap * this.pets.all.length;
  },
  checkForUnlocks() {
    if (!VUnlocks.raUnlock.canBeApplied) return;
    for (const unl of Ra.unlocks.all) {
      unl.unlock();
    }
    if (Ra.pets.enslaved.level >= 40) ImaginaryBlackHoles.unlock();
    Ra.checkForQuotes();
  },
  checkForQuotes() {
    for (const quote of Ra.quotes.all) {
      // Quotes without requirements will be shown in other ways
      if (quote.requirement) {
        quote.show();
      }
    }
  },
  checkUnlockUnlocks() {
    if (this.id === "enslaved" && this.level === 40) {
      player.ImaginaryBlackHole[0].unlocked = true;
    }
  },
  initializeRun() {
    clearCelestialRuns();
    player.celestials.ra.run = true;
    this.quotes.realityEnter.show();
  },
  toggleMode() {
    player.celestials.ra.activeMode = !player.celestials.ra.activeMode;
  },
  // This gets widely used in lots of places since the relevant upgrade is "all forms of continuous non-dimension
  // production", which in this case is infinities, eternities, replicanti, dilated time, and time theorem generation.
  // It also includes the 1% IP time study, Teresa's 1% EP upgrade, and the charged RM generation upgrade. Note that
  // removing the hardcap of 10 may cause runaways.
  theoremBoostFactor() {
    return Decimal.min(10, Decimal.max(0, Currency.timeTheorems.value.add(1).log10().sub(350)).div(50));
  },
  get isUnlocked() {
    return V.spaceTheorems >= 36 || Ra.pets.ra.level >= 25;
  },
  get isRunning() {
    return player.celestials.ra.run;
  },
  get totalCharges() {
    const x = Ra.unlocks.chargedInfinityUpgrades.effectOrDefault(0);
    // If (Ra.unlocks.breakCharges.canBeApplied) x += 4;
    return x;
  },
  get totalBreakCharges() {
    return Ra.unlocks.breakCharges.effectOrDefault(0);
  },
  get chargesLeft() {
    return this.totalCharges - player.celestials.ra.charged.size;
  },
  get breakChargesLeft() {
    return this.totalBreakCharges - player.celestials.ra.breakCharged.size;
  },
  get canBuyTriad() {
    return Ra.unlocks.unlockHardV.canBeApplied;
  },
  get petWithRemembrance() {
    return player.celestials.ra.petWithRemembrance;
  },
  set petWithRemembrance(name) {
    player.celestials.ra.petWithRemembrance = name;
  },
  updateAlchemyFlow(realityRealTime) {
    const perSecond = DC.E3.div(realityRealTime);
    for (const resource of AlchemyResources.all) {
      resource.ema.addValue((resource.amount.sub(resource.before)).mul(perSecond));
      resource.before = resource.amount;
    }
  },
  applyAlchemyReactions(realityRealTime) {
    if (!Ra.unlocks.effarigUnlock.canBeApplied) return;
    const sortedReactions = AlchemyReactions.all
      .compact()
      .sort((r1, r2) => Decimal.compare(r2.priority, r1.priority));
    for (const reaction of sortedReactions) {
      reaction.combineReagents();
    }
    this.updateAlchemyFlow(realityRealTime);
  },
  get alchemyResourceCap() {
    return Ra.unlocks.alchHardcapIncrease.canBeApplied ? 50000 : 25000;
  },
  get momentumValue() {
    const hoursFromUnlock = TimeSpan.fromMilliseconds(player.celestials.ra.momentumTime).totalHours;
    return Decimal.min(hoursFromUnlock.times(0.005).add(1), AlchemyResource.momentum.effectValue);
  },
  quotes: Quotes.ra,
  symbol: "<i class='fas fa-sun'></i>"
};

export const GlyphAlteration = {
  // Adding a secondary effect to some effects
  get additionThreshold() {
    return 1e36;
  },
  // One-time massive boost of a single effect
  get empowermentThreshold() {
    return 1e43;
  },
  // Scaling boost from sacrifice quantity
  get boostingThreshold() {
    return 1e60;
  },
  getSacrificePower(type) {
    if (Pelle.isDisabled("alteration")) return DC.D0;
    const sacPower = player.reality.glyphs.sac[type];
    if (sacPower === undefined) {
      throw new Error("Unknown sacrifice type");
    }
    if (type === "reality") return sacPower.div(1e120);
    return sacPower;
  },
  get isUnlocked() {
    if (Pelle.isDisabled("alteration")) return false;
    return Ra.unlocks.alteredGlyphs.canBeApplied;
  },
  isAdded(type) {
    return this.isUnlocked && this.getSacrificePower(type).gte(this.additionThreshold);
  },
  isEmpowered(type) {
    return this.isUnlocked && this.getSacrificePower(type).gte(this.empowermentThreshold);
  },
  isBoosted(type) {
    return this.isUnlocked && this.getSacrificePower(type).gte(this.boostingThreshold);
  },
  sacrificeBoost(type) {
    const capped = this.getSacrificePower(type).clampMax(GlyphSacrificeHandler.maxSacrificeForEffects);
    return capped.div(this.boostingThreshold).clampMin(1).log10().div(2);
  },
  baseAdditionColor(isDark = Theme.current().isDark()) {
    return isDark ? "#CCCCCC" : "black";
  },
  baseEmpowermentColor(isDark = Theme.current().isDark()) {
    return isDark ? "#EEEE30" : "#C6C610";
  },
  baseBoostColor(isDark = Theme.current().isDark()) {
    return isDark ? "#60DDDD" : "#28BDBD";
  },
  getAdditionColor(type) {
    const isDark = CosmeticGlyphTypes[type].currentColor.bg === "black";
    return this.isAdded(type) ? this.baseAdditionColor(isDark) : undefined;
  },
  getEmpowermentColor(type) {
    const isDark = CosmeticGlyphTypes[type].currentColor.bg === "black";
    return this.isEmpowered(type) ? this.baseEmpowermentColor(isDark) : undefined;
  },
  getBoostColor(type) {
    const isDark = CosmeticGlyphTypes[type].currentColor.bg === "black";
    return this.isBoosted(type) ? this.baseBoostColor(isDark) : undefined;
  }
};

EventHub.logic.on(GAME_EVENT.TAB_CHANGED, () => {
  if (Tab.celestials.ra.isOpen) Ra.quotes.unlock.show();
});
