<script>
import ExpansionButton from "./ExpansionButton";
import TimeExpansionUpgradeButton from "./TimeExpansionUpgradeButton";

export default {
  name: "TimeExpansionTab",
  components: {
    ExpansionButton,
    TimeExpansionUpgradeButton
  },
  data() {
    return {
      expanded: false,
      enslavedPoints: new Decimal(0)
    };
  },
  computed: {
    upgrades: () => ExpansionUpgrades.all,
  },
  methods: {
    update() {
      this.expanded = Enslaved.isExpanded;
      this.enslavedPoints.copyFrom(Currency.enslavedPoints.value);
    },
    id(row, column) {
      return (row - 1) * 5 + column - 1;
    }
  }
};
</script>

<template>
  <span>
    You have
    <span class="c-ensp-dim-description__accent">{{ format(enslavedPoints, 2, 1) }}</span>
    {{ pluralize("Time Remnant", enslavedPoints) }}.
    <br>
    <ExpansionButton />
    <div class="l-reality-upgrade-grid">
      <div
        v-for="row in 3"
        :key="row"
        class="l-reality-upgrade-grid__row"
      >
        <TimeExpansionUpgradeButton
          v-for="column in 5"
          :key="id(row, column)"
          :upgrade="upgrades[id(row, column)]"
        />
      </div>
    </div>
  </span>
</template>

<style scoped>
.c-ensp-dim-description__accent {
  font-size: 3.5rem;
  color: var(--color-enslaved--base);
  text-shadow: 0 0 0.7rem var(--color-enslaved--base);
}
</style>
