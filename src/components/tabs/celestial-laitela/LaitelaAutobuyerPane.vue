<script>
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "LaitelaAutobuyerPane",
  components: {
    PrimaryToggleButton
  },
  data() {
    return {
      hasDimension: false,
      hasAscension: false,
      hasSingularity: false,
      hasAnnihilated: false,
      dimension: false,
      ascension: false,
      singularity: false,
      annihilation: false,

      maxAutobuy: 0,
      maxAutoAscend: 0,
      autoSingularityFactor: 0,
      dmd5Plus: false
    };
  },
  computed: {
    autobuyStr() {
      if (this.maxAutobuy === 8) return "ON (all DMD)";
      return this.maxAutobuy === 4 && !this.dmd5Plus
        ? "ON (all DMD)"
        : `ON (max. DMD ${this.maxAutobuy})`;
    },
    autoAscendStr() {
      if (this.maxAutoAscend === 8) return "ON (all DMD)";
      return this.maxAutoAscend === 4 && !this.dmd5Plus
        ? "ON (all DMD)"
        : `ON (max. DMD ${this.maxAutoAscend})`;
    },
    autoSingularityStr() {
      return this.autoSingularityFactor === 1
        ? "At Cap"
        : `Cap ${formatX(this.autoSingularityFactor, 2, 2)}`;
    },
  },
  watch: {
    dimension(newValue) {
      player.auto.darkMatterDims.isActive = newValue;
    },
    ascension(newValue) {
      player.auto.ascension.isActive = newValue;
    },
    singularity(newValue) {
      player.auto.singularity.isActive = newValue;
    },
    annihilation(newValue) {
      player.auto.annihilation.isActive = newValue;
    },
  },
  methods: {
    update() {
      this.hasDimension = Autobuyer.darkMatterDims.isUnlocked;
      this.hasAscension = Autobuyer.darkMatterDimsAscension.isUnlocked;
      this.hasSingularity = Autobuyer.singularity.isUnlocked;
      this.hasAnnihilated = Autobuyer.annihilation.isUnlocked;
      const auto = player.auto;
      this.dimension = auto.darkMatterDims.isActive;
      this.ascension = auto.ascension.isActive;
      this.singularity = auto.singularity.isActive;
      this.annihilation = auto.annihilation.isActive;

      this.maxAutobuy =  SingularityMilestone.darkDimensionAutobuyers.effectValue >= 5 ? SingularityMilestone.darkDimensionAutobuyers.effectValue : (MendingMilestone.eleven.isReached ? 4 : SingularityMilestone.darkDimensionAutobuyers.effectValue);
      this.maxAutoAscend = SingularityMilestone.ascensionAutobuyers.effectValue >= 5 ? SingularityMilestone.ascensionAutobuyers.effectValue : (MendingMilestone.eleven.isReached ? 4 : SingularityMilestone.ascensionAutobuyers.effectValue);
      this.autoSingularityFactor = SingularityMilestone.autoCondense.effectValue;
      this.dmd5Plus = DarkMatterDimension(5).isUnlocked;
    },
  }
};
</script>

<template>
  <div
    v-if="hasDimension || hasAscension || hasSingularity || hasAnnihilated"
    class="c-laitela-singularity-container"
  >
    <PrimaryToggleButton
      v-if="hasDimension"
      v-model="dimension"
      class="c-laitela-automation-toggle"
      label="Auto-buy DMD:"
      :on="autobuyStr"
    />
    <PrimaryToggleButton
      v-if="hasAscension"
      v-model="ascension"
      class="c-laitela-automation-toggle"
      label="Auto-Ascend:"
      :on="autoAscendStr"
    />
    <PrimaryToggleButton
      v-if="hasSingularity"
      v-model="singularity"
      class="c-laitela-automation-toggle"
      label="Auto-Singularity:"
      :on="autoSingularityStr"
    />
    <PrimaryToggleButton
      v-if="hasAnnihilated"
      v-model="annihilation"
      class="c-laitela-automation-toggle"
      label="Auto-Annihilation:"
    />
  </div>
</template>
