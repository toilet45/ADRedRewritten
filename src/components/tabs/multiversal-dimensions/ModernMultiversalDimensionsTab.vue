<script>
import NewMultiversalDimensionRow from "./ModernMultiversalDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "NewMultiversalDimensionsTab",
  components: {
    PrimaryButton,
    NewMultiversalDimensionRow
  },
  data() {
    return {
      totalUpgrades: new Decimal(0),
      multPerTickspeed: new Decimal(0),
      tickspeedSoftcap: new Decimal(0),
      timeShards: new Decimal(0),
      upgradeThreshold: new Decimal(0),
      shardsPerSecond: new Decimal(0),
      incomeType: "",
      areAutobuyersUnlocked: false,
      showLockedDimCostNote: true,
      penteractsUnlocked: false,
      penteractCost: new Decimal(0),
      canBuyPenteracts: false,
      boughtPenteracts: new Decimal(0),
      extraPenteracts: new Decimal(0),
      totalDimCap: new Decimal(0),
      nextDimCapIncrease: new Decimal(0),
      creditsClosed: false,
      isContinuumUnlocked: false,
      shards: new Decimal(0)
    };
  },
  computed: {
    costIncreases: () => MultiversalDimension(1).costIncreaseThresholds,
  },
  methods: {
    update() {
      this.shardsPerSecond.copyFrom(MultiversalDimension(1).productionPerSecond);
      // eslint-disable-next-line max-len
      this.incomeType = "Time Shards";
      this.areAutobuyersUnlocked = false;//Autobuyer.timeDimension(1).isUnlocked;
      this.totalDimCap = MultiversalDimensions.purchaseCap;
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.isContinuumUnlocked = false;//Laitela.continuumActive && Ra.unlocks.timeDimensionContinuum.canBeApplied;
      this.shards.copyFrom(Currency.galacticShards.value);
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
  <div class="l-multiversal-dim-tab l-centered-vertical-tab">
    <p>
      You have
      <span class="c-multiversal-dim-description__accent">{{ formatInt(shards) }}</span> Galactic Shards making
      all Galaxies <span class="c-multiversal-dim-description__accent">{{ formatPercents(0, 2, 2) }}</span> stronger.
      <br>
      You are gaining <span class="c-multiversal-dim-description__accent">{{ format(shardsPerSecond, 2, 2) }}</span> shards per second (unaffected by game time)
    </p>
    <div class="l-dimensions-container">
      <NewMultiversalDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
        :are-autobuyers-unlocked="areAutobuyersUnlocked"
      />
    </div>
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