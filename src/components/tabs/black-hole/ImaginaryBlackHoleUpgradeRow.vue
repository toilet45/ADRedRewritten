<script>
import ImaginaryBlackHoleUpgradeButton from "@/components/tabs/black-hole/ImaginaryBlackHoleUpgradeButton";

export default {
  name: "ImaginaryBlackHoleUpgradeRow",
  components: {
    ImaginaryBlackHoleUpgradeButton
  },
  /* props: {
    ImaginaryBlackHole: {
      type: Object,
      required: true
    }
  }, */
  data() {
    return {
      isUnlocked: false,
      isPermanent: false,
      intervalVal: 0,
      durationVal: 0,
    };
  },
  computed: {
    ImaginaryBlackHoleDescription() {
      return ImaginaryBlackHole(1).description(false);
    },
    powerConfig() {
      const x = Decimal.pow(5, player.ImaginaryBlackHole[0].powerUpgrades.mul(2).add(1));
      return {
        upgrade: ImaginaryBlackHole(1).powerUpgrade,
        description: () => `Make ${this.ImaginaryBlackHoleDescription} ${formatX(x, 2, 2)} stronger`,
        effectTitle: "Current power",
        formatEffect: value => `${formatX(value, 2, 2)}`
      };
    },
    rtPowerConfig() {
      return {
        upgrade: ImaginaryBlackHole(1).rtPowerUpgrade,
        // eslint-disable-next-line max-len
        description: () => `Make ${this.ImaginaryBlackHoleDescription} ${formatPercents(0.2)} stronger for real time.`,
        effectTitle: "Current real time power",
        formatEffect: value => `${formatX(value, 2, 2)}`
      };
    },
  },
  methods: {
    update() {
      const bh = ImaginaryBlackHole(1);
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
    <ImaginaryBlackHoleUpgradeButton :config="powerConfig" />
    <ImaginaryBlackHoleUpgradeButton :config="rtPowerConfig" />
  </div>
</template>

<style scoped>

</style>
