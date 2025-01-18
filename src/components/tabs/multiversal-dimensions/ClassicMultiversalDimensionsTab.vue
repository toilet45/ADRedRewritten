<script>
import PrimaryButton from "@/components/PrimaryButton";

import ClassicMultiversalDimensionRow from "./ClassicMultiversalDimensionRow";

export default {
  name: "ClassicMultiversalDimensionsTab",
  components: {
    PrimaryButton,
    ClassicMultiversalDimensionRow
  },
  data() {
    return {
      shardsPerSecond: new Decimal(0),
      incomeType: "",
      areAutobuyersUnlocked: false,
      showLockedDimCostNote: true,
      totalDimCap: new Decimal(0),
      creditsClosed: false,
      isContinuumUnlocked: false,
      shards: new Decimal(0),
      freeGalaxies: new Decimal(0),
      galaxyBoost: new Decimal(0),
      nextGalaxy: new Decimal(0)
    };
  },
  computed: {
    costIncreases: () => MultiversalDimension(1).costIncreaseThresholds,
  },
  methods: {
    update() {
      this.shardsPerSecond = MultiversalDimension(1).amount.times(MultiversalDimension(1).multiplier);
      // eslint-disable-next-line max-len
      this.incomeType = "Time Shards";
      this.areAutobuyersUnlocked = false;//Autobuyer.timeDimension(1).isUnlocked;
      this.totalDimCap = MultiversalDimensions.purchaseCap;
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.isContinuumUnlocked = false; //Laitela.continuumActive && Ra.unlocks.timeDimensionContinuum.canBeApplied;
      this.shards.copyFrom(Currency.galacticShards.value);
      this.freeGalaxies = getFreeGalxiesFromMvD();
      this.galaxyBoost = getGalaxyPowerFromMvD();
      this.nextGalaxy = getReqForNextMVGalaxy();
    },
    maxAll() {
      tryUnlockMultiversalDimensions();
      maxAllMultiversalDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllMultiversalDims();
    },
  }
};
</script>

<template>
  <div class="l-time-dim-tab l-centered-vertical-tab">
    <p>
      You have
      <span class="c-multiversal-dim-description__accent">{{ format(shards, 2, 0) }}</span> Galactic Shards making
      all Galaxies <span class="c-multiversal-dim-description__accent">{{ formatPercents(galaxyBoost, 2, 2) }}</span> stronger and giving <span class="c-multiversal-dim-description__accent">{{ formatInt(freeGalaxies, 2, 2) }}</span> free Multiversal Galaxies (next at <span class="c-multiversal-dim-description__accent">{{ format(nextGalaxy, 2, 2) }}</span> Shards).
      <br>
      You are gaining <span class="c-multiversal-dim-description__accent">{{ format(shardsPerSecond, 2, 2) }}</span> shards per second (unaffected by game speed)
    </p>
    <div class="l-dimensions-container">
      <ClassicMultiversalDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
        :are-autobuyers-unlocked="areAutobuyersUnlocked"
      />
    </div>
      Free Multiversal Galaxies from Multiversal Dimensions are capped at x
  </div>
</template>

<style scoped>
.l-multiversal-dim-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text);
}

.c-multiversal-dim-description__accent {
  font-size: 3.5rem;
  color: var(--color-mending);
}

.t-metro .c-multiversal-dim-description__accent,
.t-s8 .c-multiversal-dim-description__accent {
  text-shadow: 0 0 0.1rem rgba(0, 0, 0, 50%), -0.1rem 0.1rem 0.1rem black;
}

.t-dark .c-multiversal-dim-description__accent,
.t-amoled .c-multiversal-dim-description__accent,
.t-amoled-metro .c-multiversal-dim-description__accent,
.t-s6 .c-multiversal-dim-description__accent,
.t-s10 .c-multiversal-dim-description__accent,
.t-s11 .c-multiversal-dim-description__accent {
  color: #77b5fc;
  text-shadow: 0 0 0.7rem #77b5fc;
}

.t-metro .c-multiversal-dim-description__accent,
.t-dark-metro .c-multiversal-dim-description__accent,
.t-s8 .c-multiversal-dim-description__accent {
  color: var(--color-mending)
}
</style>