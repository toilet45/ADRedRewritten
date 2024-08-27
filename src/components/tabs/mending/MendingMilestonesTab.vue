<script>
import MendingMilestoneButton from "./MendingMilestoneButton";

export default {
  name: "MendingMilestonesTab",
  components: {
    MendingMilestoneButton
  },
  data() {
    return {
      mendCount: new Decimal(),
    };
  },
  computed: {
    milestones() {
      return Object.values(GameDatabase.mending.mendingMilestones)
        .sort((a, b) => a.mends - b.mends)
        .map(config => new MendingMilestoneState(config));
    },
    rows() {
      return Math.ceil(this.milestones.length / 2);
    }
  },
  methods: {
    update() {
      this.mendCount.copyFrom(Currency.mends.value.floor());
    },
    getMilestone(row, column) {
      return () => this.milestones[(row - 1) * 2 + column - 1];
    }
  }
};
</script>

<template>
  <div class="l-mend-milestone-grid">
    <div>You have Mended this Multiverse {{ quantify("time", mendCount, 3) }}.</div>
    <div
      v-for="row in rows"
      :key="row"
      class="l-mend-milestone-grid__row"
    >
      <MendingMilestoneButton
        v-for="column in 2"
        :key="row * 2 + column"
        :get-milestone="getMilestone(row, column)"
        class="l-mend-milestone-grid__cell"
      />
    </div>
  </div>
</template>

<style scoped>
.l-mend-milestone-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.l-mend-milestone-grid__row {
  display: flex;
  flex-direction: row;
}

.l-mend-milestone-grid__cell {
  margin: 0.5rem 0.8rem;
}
</style>
