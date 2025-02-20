<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import RaPet from "./RaPet";
import RaPetRemembranceButton from "./RaPetRemembranceButton";
import ShopUpgradeButton from "./ShopUpgradeButton";

export default {
  name: "RaTab",
  components: {
    RaPet,
    RaPetRemembranceButton,
    CelestialQuoteHistory,
    ShopUpgradeButton
  },
  data() {
    return {
      memoriesPerChunk: new Decimal(),
      showReality: false,
      isRaCapped: false,
      totalLevels: 0,
      showRemembrance: false,
      hasRemembrance: false,
      remembranceReq: 0,
      remembranceMult: 1,
      remembranceNerf: 1,
      petWithRemembrance: "",
      isRunning: false,
      memoryBoosts: "",
      shopUnlocked: false,
      raPoints: new Decimal(),
      shopRows: 0,
    };
  },
  computed: {
    upgrades: () => RaUpgrades.all,
    laitelaUnlock: () => Laitela.isUnlocked,
    pets: () => [
      {
        pet: Ra.pets.teresa,
        scalingUpgradeVisible: () => Ra.unlocks.chargedInfinityUpgrades.isUnlocked,
        scalingUpgradeText: () => (Ra.pets.teresa.level < 40
          ? `You can Charge ${quantifyInt("Infinity Upgrade", Ra.totalCharges)}.`
          : `You can Charge ${quantifyInt("Break Infinity Upgrade", Ra.totalBreakCharges)}`),
      },
      {
        pet: Ra.pets.effarig,
        scalingUpgradeVisible: () => AlchemyResources.all.filter(r => r.isUnlocked).length > 0,
        scalingUpgradeText: () => {
          const resources = AlchemyResources.all.filter(r => r.isUnlocked).length;
          return `You have unlocked ${quantifyInt("Alchemy Resource", resources)}.`;
        },
      },
      {
        pet: Ra.pets.enslaved,
        scalingUpgradeVisible: () => Ra.unlocks.improvedStoredTime.isUnlocked,
        scalingUpgradeText: () => `Stored game time
          ${formatX(Ra.unlocks.improvedStoredTime.effects.gameTimeAmplification.effectOrDefault(1), 2)} and real time
          +${formatInt(Ra.unlocks.improvedStoredTime.effects.realTimeCap.effectOrDefault(0) / (1000 * 3600))} hours`,
      },
      {
        pet: Ra.pets.v,
        scalingUpgradeVisible: () => Ra.unlocks.unlockHardV.isUnlocked,
        scalingUpgradeText: () => {
          const triadCount = Ra.unlocks.unlockHardV.effectOrDefault(0);
          return `You have unlocked ${quantifyInt("Triad Study", triadCount)}.`;
        },
      },
      {
        pet: Ra.pets.ra,
        scalingUpgradeVisible: () => false,
        scalingUpgradeText: () => `Why do u see this`,
      },
      {
        pet: Ra.pets.laitela,
        scalingUpgradeVisible: () => Ra.unlocks.newDMD.isUnlocked,
        scalingUpgradeText: () => {
          const laieffect = Ra.unlocks.newDMD.effectOrDefault([0, 0]);
          return `You have increased the singularity cap by ${formatInt(laieffect[1])},
          and unlocked ${formatInt(laieffect[0])} new dimensions`;
        },
      },
      {
        pet: Ra.pets.pelle,
        scalingUpgradeVisible: () => false,
        scalingUpgradeText: () => `Why do u see this`,
      }
    ],
    petStyle() {
      return {
        color: (this.petWithRemembrance === "")
          ? "white"
          : this.pets.find(pet => pet.pet.name === this.petWithRemembrance).pet.color,
      };
    },
    runButtonClassObject() {
      return {
        "c-ra-run-button__icon": true,
        "c-ra-run-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[4].effects().replace(/^\w/u, c => c.toUpperCase()).split("\n");
    },
    memoryDescription() {
      return `Within Ra's Reality, Memory Chunks for Celestial Memories
        will be generated based on certain resource amounts.`;
    },
    isDoomed: () => Pelle.isDoomed,
  },
  methods: {
    currentShopRows() {
      let x = 2;
      if (Ra.unlocks.raShopNewRow.canBeApplied) x += 1;
      if (Ra.unlocks.raShopFinalRow.canBeApplied) x += 1;
      return x;
    },
    id(row, column) {
      return (row - 1) * 6 + column - 1;
    },
    update() {
      this.memoriesPerChunk.copyFrom(Ra.productionPerMemoryChunk);
      this.isRaCapped = Ra.totalPetLevel === (MendingUpgrade(19).isBought ? 700 : 100);
      this.totalLevels = Ra.totalPetLevel;
      this.showRemembrance = Ra.unlocks.effarigUnlock.canBeApplied;
      this.hasRemembrance = Ra.remembrance.isUnlocked;
      this.remembranceReq = Ra.remembrance.requiredLevels;
      this.remembranceMult = Ra.remembrance.multiplier;
      this.remembranceNerf = Ra.remembrance.nerf;
      this.petWithRemembrance = Ra.petWithRemembrance;
      this.isRunning = Ra.isRunning;
      this.memoryBoosts = Ra.memoryBoostResources;
      this.shopUnlocked = Ra.unlocks.raShopUnlock.canBeApplied;
      this.raPoints.copyFrom(Ra.pets.ra.memories);
      this.shopRows = this.currentShopRows();
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Ra's", number: 4 });
    },
    toggleMode() {
      Ra.toggleMode();
    }
  },
};
</script>

<template>
  <div class="l-ra-celestial-tab">
    <div class="c-ra-memory-header">
      <CelestialQuoteHistory celestial="ra" />
      <div v-if="!isRaCapped">
        Each Memory Chunk generates a base of one Memory per second<span v-if="memoriesPerChunk.gt(1)">,
          which has been increased to {{ quantify("Memory", memoriesPerChunk, 2, 3) }} per second</span>.
        <br>
        Storing real time prevents Memory Chunk generation, but Memories will still be gained normally.
        <span v-if="memoriesPerChunk.gt(1)">
          <br>
          This is being increased due to {{ memoryBoosts }}.
        </span>
      </div>
      <div v-else>
        All Memories have been returned.
      </div>
    </div>
    <div>
      Mouse-over the icons below the bar to see descriptions of upgrades,
      <br>
      and mouse-over <i class="fas fa-question-circle" /> icons for specific resource information.
    </div>
    <div class="l-ra-all-pets-container">
      <RaPet
        v-for="(pet, i) in pets"
        :key="i"
        :pet-config="pet"
      />
    </div>
    <div class="l-ra-non-pets">
      <button class="c-ra-run-button">
        <h2 :class="{ 'o-pelle-disabled': isDoomed }">
          <span v-if="isRunning">You are in </span>
          <span v-else>Start </span>
          Ra's Reality
        </h2>
        <div
          :class="runButtonClassObject"
          @click="startRun"
        >
          <span class="c-ra-run-button__icon__sigil fas fa-sun" />
        </div>
        <span
          v-for="(line, lineId) in runDescription"
          :key="lineId + '-ra-run-desc'"
        >
          {{ line }}
        </span>
        <br>
        <span>
          {{ memoryDescription }}
        </span>
      </button>
      <div
        v-if="showRemembrance && !isRaCapped"
        class="c-ra-remembrance-unlock"
      >
        <h1 :style="petStyle">
          Remembrance
        </h1>
        <span :style="petStyle">
          Whichever Celestial has Remembrance will get {{ formatX(remembranceMult) }} Memory Chunk gain. The other
          Celestials will get {{ formatX(remembranceNerf, 1, 1) }} Memory Chunk gain.
        </span>
        <div
          v-if="hasRemembrance"
          class="c-ra-remembrance-unlock-inner"
        >
          <RaPetRemembranceButton
            v-for="(pet, i) in pets"
            :key="i"
            :pet-config="pet"
          />
        </div>
        <div
          v-else
          class="c-ra-remembrance-unlock-inner"
        >
          Unlocked by getting {{ formatInt(remembranceReq) }} total Celestial Memory levels
          (you need {{ formatInt(remembranceReq - totalLevels) }} more)
        </div>
      </div>
    </div>
    <div
      v-if="shopUnlocked"
      class="l-reality-upgrade-grid"
    >
      <div class="c-ra-point-text">
        You have {{ format(raPoints, 2) }} Ra Memories
      </div>
      <div
        v-for="row in shopRows"
        :key="row"
        class="l-reality-upgrade-grid__row"
      >
        <ShopUpgradeButton
          v-for="column in 6"
          :key="id(row, column)"
          :upgrade="upgrades[id(row, column)]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-ra-point-text {
  color: var(--color-text);
  font-size: 1.5rem;
}
</style>
