<script>
import RaPetLevelBar from "./RaPetLevelBar";
import RaUpgradeIcon from "./RaUpgradeIcon";

export default {
  name: "RaPet",
  components: {
    RaUpgradeIcon,
    RaPetLevelBar
  },
  props: {
    petConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isRaCapped: false,
      level: 0,
      memories: new Decimal(),
      requiredMemories: new Decimal(),
      memoryChunks: new Decimal(),
      memoryChunksPerSecond: new Decimal(),
      memoriesPerSecond: new Decimal(),
      memoryMultiplier: new Decimal(),
      canGetMemoryChunks: false,
      memoryUpgradeCost: new Decimal(),
      chunkUpgradeCost: new Decimal(),
      memoryUpgradeCapped: false,
      chunkUpgradeCapped: false,
      currentMemoryMult: new Decimal(),
      currentChunkMult: new Decimal(),
      nextMemoryUpgradeEstimate: "",
      nextMemoryChunkUpgradeEstimate: "",
      maxMU19Level: 0,
      mu19bought: false,
      secondSources: false
    };
  },
  computed: {
    levelCap() { return this.pet.name === "Ra" ? 100 : Ra.levelCap; },
    isCapped() {
      return this.pet?.level >= this.levelCap;
    },
    isRaCapped() {
      return Ra.totalPetLevel === Ra.maxTotalPetLevel;;
    },
    showScalingUpgrade() {
      return this.petConfig.scalingUpgradeVisible(this.level);
    },
    scalingUpgradeText() {
      return this.petConfig.scalingUpgradeText(this.level);
    },
    pet() {
      return this.petConfig.pet;
    },
    name() {
      return this.pet.name;
    },
    petStyle() {
      return {
        color: this.pet.color
      };
    },
    unlocks() {
      return this.pet.unlocks;
    },
    chunkTooltip() {
      return `Based on ${this.pet.chunkGain}${this.secondSources ? ` and ${this.pet.secondaryChunkGain}` : ``}`;
    },
    memoryGainTooltip() {
      return `Based on ${this.pet.memoryGain}`;
    },
    highestNotRaLevel() {
      if (Ra.pets.ra.level === 100) return 7;
      if (Ra.pets.ra.level >= 65) return 6;
      if (Ra.pets.ra.level >= 40) return 5;
      if (Ra.pets.ra.level >= 15) return 3;
      if (Ra.pets.ra.level >= 8) return 2;
      if (Ra.pets.ra.level >= 2) return 1;
      return 0;
    }
  },
  methods: {
    update() {
      const pet = this.pet;
      this.isUnlocked = pet?.isUnlocked;
      if (!this.isUnlocked) return;
      this.level = pet.level;
      this.memories.copyFrom(pet.memories);
      this.requiredMemories.copyFrom(pet.requiredMemories);
      this.memoryChunks.copyFrom(pet.memoryChunks);
      this.memoryChunksPerSecond.copyFrom(pet.memoryChunksPerSecond.mul(timeEffects.realTimeSpeedup));
      this.memoriesPerSecond.copyFrom(pet.memoryChunks.mul(Ra.productionPerMemoryChunk).mul(this.currentMemoryMult));
      this.canGetMemoryChunks = pet.canGetMemoryChunks;
      this.memoryMultiplier.copyFrom(pet.memoryProductionMultiplier);
      this.memoryUpgradeCost.copyFrom(pet.memoryUpgradeCost);
      this.chunkUpgradeCost.copyFrom(pet.chunkUpgradeCost);
      this.memoryUpgradeCapped = pet.memoryUpgradeCapped;
      this.chunkUpgradeCapped = pet.chunkUpgradeCapped;
      this.currentMemoryMult.copyFrom(pet.memoryUpgradeCurrentMult);
      this.currentChunkMult = pet.chunkUpgradeCurrentMult;
      this.mu19Bought = MendingUpgrade(19).isBought;
      this.maxMU19Level = pet.id === "ra" ? 7 : this.highestNotRaLevel;

      this.nextMemoryUpgradeEstimate = Ra.timeToGoalString(pet, this.memoryUpgradeCost.sub(this.memories));
      this.nextMemoryChunkUpgradeEstimate = Ra.timeToGoalString(pet, this.chunkUpgradeCost.sub(this.memories));
      this.secondSources = RaUpgrade(15).canBeApplied;
    },
    nextUnlockLevel() {
      const missingUpgrades = this.pet.unlocks
        .map(u => u.level)
        .filter(goal => goal > this.level);
      return missingUpgrades.length === 0 ? 25 : missingUpgrades.min();
    },
    upgradeClassObject(type) {
      const available = type === "memory"
        ? this.memoryUpgradeCost.lte(this.memories)
        : this.chunkUpgradeCost.lte(this.memories);
      const capped = type === "memory" ? this.memoryUpgradeCapped : this.chunkUpgradeCapped;
      const pet = this.pet;
      return {
        "c-ra-pet-upgrade": true,
        "c-ra-pet-upgrade-memory": type === "memory",
        "c-ra-pet-upgrade-chunk": type === "chunk",
        "c-ra-pet-btn--available": available,
        [`c-ra-pet-btn--${pet.id}`]: available,
        "c-ra-pet-btn--available__capped": capped,
        [`c-ra-pet-btn--${pet.id}__capped`]: capped
      };
    },
    barStyle(type) {
      const cost = type === "memory" ? this.memoryUpgradeCost : this.chunkUpgradeCost;
      const gone = (type === "memory" && this.memoryUpgradeCapped || type === "chunk" && this.chunkUpgradeCapped)
        ? cost
        : this.memories;
      return {
        width: `${100 * Decimal.min(1, gone.div(cost)).toNumber()}%`,
        background: this.pet.color
      };
    }
  },
};
</script>

<template>
  <div
    v-if="isUnlocked"
    class="l-ra-pet-container"
  >
    <div
      class="c-ra-pet-header"
      :style="petStyle"
    >
      <div class="c-ra-pet-title">
        <!-- The full name doesn't fit here, so we shorten it as a special case -->
        {{ pet.id === "enslaved" ? "Nameless" : name }} Level {{ formatInt(level) }}/{{ formatInt(levelCap) }}
      </div>
      <div
        v-if="showScalingUpgrade"
        :key="level"
      >
        {{ scalingUpgradeText }}
      </div>
      <br v-else>
      <div v-if="!isCapped">
        <div>
          {{ name }} {{ pet.id === "enslaved" ? "have" : "has" }} {{ quantify("Memory", memories, 2) }}
        </div>
      </div>
      <div
        v-if="!isCapped"
        class="l-ra-pet-middle-container"
      >
        <div class="l-ra-pet-upgrade-container">
          <div class="l-ra-pet-upgrade c-ra-pet-upgrade__top">
            <div
              :class="upgradeClassObject('memory')"
              @click="pet.purchaseMemoryUpgrade()"
            >
              <span class="fas fa-brain" />
              <div
                v-if="!memoryUpgradeCapped"
                class="c-ra-pet-upgrade__tooltip"
              >
                <div class="c-ra-pet-upgrade__tooltip__name">
                  {{ name }}'s Recollection
                </div>
                <div class="c-ra-pet-upgrade__tooltip__description">
                  Gain {{ formatPercents(0.3) }} more Memories
                </div>
                <div class="c-ra-pet-upgrade__tooltip__footer">
                  Cost: {{ quantify("Memory", memoryUpgradeCost, 2, 2) }}
                  <span v-if="memories.lte(memoryUpgradeCost)">
                    {{ nextMemoryUpgradeEstimate }}
                  </span>
                  <br>
                  Currently: {{ formatX(currentMemoryMult, 2, 2) }}
                </div>
              </div>
              <div
                v-else
                class="c-ra-pet-upgrade__tooltip"
              >
                <div class="c-ra-pet-upgrade__tooltip__name">
                  {{ name }}'s Recollection
                </div>
                <div class="c-ra-pet-upgrade__tooltip__description">
                  Capped: {{ formatX(currentMemoryMult, 2, 2) }}
                </div>
              </div>
            </div>
            <div class="c-ra-upgrade-bar">
              <div
                class="c-ra-upgrade-bar__inner"
                :style="barStyle('memory')"
              />
            </div>
          </div>
          <div class="l-ra-pet-upgrade c-ra-pet-upgrade__bottom">
            <div
              :class="upgradeClassObject('chunk')"
              @click="pet.purchaseChunkUpgrade()"
            >
              <span class="fas fa-dice-d6" />
              <div
                v-if="!chunkUpgradeCapped"
                class="c-ra-pet-upgrade__tooltip"
              >
                <div class="c-ra-pet-upgrade__tooltip__name">
                  {{ name }}'s Fragmentation
                </div>
                <div class="c-ra-pet-upgrade__tooltip__description">
                  Gain {{ formatPercents(0.5) }} more Memory Chunks
                </div>
                <div class="c-ra-pet-upgrade__tooltip__footer">
                  Cost: {{ quantify("Memory", chunkUpgradeCost, 2, 2) }}
                  <span v-if="memories.lte(chunkUpgradeCost)">
                    {{ nextMemoryChunkUpgradeEstimate }}
                  </span>
                  <br>
                  Currently: {{ formatX(currentChunkMult, 2, 2) }}
                </div>
              </div>
              <div
                v-else
                class="c-ra-pet-upgrade__tooltip"
              >
                <div class="c-ra-pet-upgrade__tooltip__name">
                  {{ name }}'s Fragmentation
                </div>
                <div class="c-ra-pet-upgrade__tooltip__description">
                  Capped: {{ formatX(currentChunkMult, 2, 2) }}
                </div>
              </div>
            </div>
            <div class="c-ra-upgrade-bar c-ra-upgrade-bar--bottom">
              <div
                class="c-ra-upgrade-bar__inner"
                :style="barStyle('chunk')"
              />
            </div>
          </div>
        </div>
        <RaPetLevelBar
          v-if="!isCapped"
          :pet-config="petConfig"
        />
      </div>
      <div v-if="!isCapped">
        <div>
          {{ quantify("Memory Chunk", memoryChunks, 2, 2) }}, {{ quantify("Memory", memoriesPerSecond, 2, 2) }}/sec
        </div>
        <div>
          Gaining {{ quantify("Memory Chunk", memoryChunksPerSecond, 2, 2) }}/sec
          <span :ach-tooltip="chunkTooltip">
            <i class="fas fa-question-circle" />
          </span>
        </div>
      </div>
      <div v-if="memoryMultiplier.gt(1) && !isRaCapped">
        Multiplying all Memory production by {{ format(memoryMultiplier, 2, 3) }}
        <span :ach-tooltip="memoryGainTooltip">
          <i class="fas fa-question-circle" />
        </span>
      </div>
      <br v-else-if="!isRaCapped">
      <br v-if="!isRaCapped">
      <div
        v-else
        class="l-ra-pet-postcompletion-spacer"
      />
      <div class="l-ra-pet-milestones">
        <!-- This choice of key forces a UI update every level up -->
        <RaUpgradeIcon
          v-for="(unlock, i) in unlocks.slice(0, 7)"
          :key="25 * level + i"
          :unlock="unlock"
        />
      </div>
      <div
        v-if="mu19Bought"
        class="l-ra-pet-milestones"
      >
        <RaUpgradeIcon
          v-for="(unlock, i) in unlocks.slice(7, maxMU19Level + 7)"
          :key="25 * level + i"
          :unlock="unlock"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-ra-pet-milestones {
  display: flex;
  justify-content: center;
}

.c-ra-pet-upgrade-memory {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}

.c-ra-pet-upgrade-chunk {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.l-ra-pet-postcompletion-spacer {
  margin-bottom: 0.8rem;
}
</style>
