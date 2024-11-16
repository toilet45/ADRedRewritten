<script>
import MendingUpgradeButton from "./MendingUpgradeButton";

export default {
  name: "MendingUpgradesTab",
  components: {
    MendingUpgradeButton
  },
  data() {
    return {
      mendingPoints: new Decimal()
    };
  },
  computed: {
    upgrades: () => MendingUpgrades.all,
    costScalingTooltip: () => `Prices start increasing faster above ${format(1e30)} MvR and then even faster
      above ${format(new Decimal(Number.MAX_VALUE), 1)} MvR`,
    possibleTooltip: () => `Checkered upgrades are impossible to unlock this Reality. Striped upgrades are
      still possible.`,
    lockTooltip: () => `This will only function if you have not already failed the condition or
      unlocked the upgrade.`,
  },
  methods: {
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    },
    update() {
      this.mendingPoints.copyFrom(Currency.mendingPoints.value);
    }
  }
};
</script>

<template>
  <div class="l-reality-upgrade-grid">
    <div class="c-mending-tab__header">
      You have
      <span class="c-mending-tab__mending-points">{{ format(mendingPoints, 2) }}</span>
      {{ pluralize("Multiversal Remain", mendingPoints) }}.
    </div>
    Each upgrade in the first column can be bought endlessly and gives an additive {{ formatX(1.02, 2, 2) }} multiplier to Multiversal Remain gain. <br>
    Mending Upgrade 3 and all second column upgrades can be bought a finite amount of times and give a compounding {{ formatX(1.15, 2, 2) }} multiplier to Multiversal Remain gain per purchase. <br>
    The other upgrades are one time purchases and also and give a compounding {{ formatX(1.15, 2, 2) }} Multiplier to Multiversal Remain gain.
    <div
      v-for="row in 4"
      :key="row"
      class="l-reality-upgrade-grid__row"
    >
      <MendingUpgradeButton
        v-for="column in 5"
        :key="id(row, column)"
        :upgrade="upgrades[id(row, column)]"
      />
    </div>
  </div>
</template>

<style scoped>
.c-mending-tab__header {
  font-size: 1.5rem;
  margin: 1.5rem 0;
}

.c-mending-tab__mending-points {
  color: var(--color-mending);
}

/* #region themes */

/* #region t-dark t-s6 t-s10 */

.t-dark .c-mending-tab__mending-points,
.t-s6 .c-mending-tab__mending-points,
.t-s10 .c-mending-tab__mending-points {
  text-shadow: 0 0 0.7rem;
}

/* #endregion t-dark t-s6 t-s10 */

/* #region t-s1 */

.t-s1 .c-mending-tab__mending-points {
  text-shadow: 0.1rem 0.1rem 0 black;
}

/* #endregion t-s1 */
</style>
