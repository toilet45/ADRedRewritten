<script>
import ExpoBlackHoleUpgradeButton from "@/components/tabs/black-hole/ExpoBlackHoleUpgradeButton";

export default {
  name: "ExpoBlackHoleUpgradeRow",
  components: {
    ExpoBlackHoleUpgradeButton
  },
  props: {
    expoBlackHole: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isPermanent: false,
      intervalVal: 0,
      durationVal: 0,
    };
  },
  computed: {
    expoBlackHoleDescription() {
      return this.expoBlackHole.description(false);
    },
    powerConfig() {
      return {
        upgrade: this.expoBlackHole.powerUpgrade,
        description: () => `Make ${this.expoBlackHoleDescription} ${formatX(1.05, 2, 2)} stronger`,
        effectTitle: "Current power",
        formatEffect: value => `${formatPow(value, 2, 2)}`
      };
    },
  },
  methods: {
    update() {
      const bh = this.expoBlackHole;
      this.isUnlocked = bh.isUnlocked;
      this.isPermanent = bh.isPermanent;
      // We pull directly from the black hole data here (and in formatEffect above) because there are other sources
      // which also affect them, and this is the only place where these values are displayed directly in-game. Then
      // we use these values as keys so that the buttons are forced to re-render immediately if they're ever changed
      this.intervalVal = bh.rawInterval;
      this.durationVal = bh.duration;
    }
  }
};
</script>

<template>
  <div
    v-if="isUnlocked"
    class="l-black-hole-upgrade-grid__row"
  >
    <ExpoBlackHoleUpgradeButton :config="powerConfig" />
  </div>
</template>

<style scoped>

</style>
