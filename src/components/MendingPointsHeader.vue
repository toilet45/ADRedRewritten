<script>
export default {
  name: "MendingPointsHeader",
  data() {
    return {
      mendingPoints: new Decimal(),
      isVisible: false
    };
  },
  methods: {
    update() {
      this.mendingPoints.copyFrom(Currency.mendingPoints);
      this.isVisible = PlayerProgress.mendingUnlocked();
    }
  }
};
</script>

<template>
  <div
    v-show="isVisible"
    class="c-mending-tab__header"
  >
    You have
    <span class="c-mending-tab__mending-points">{{ format(mendingPoints, 2) }}</span>
    {{ pluralize("Multiversal Remain", mendingPoints) }}.
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

.t-s1 .c-mending-tab__mending-points {
  text-shadow: 0.1rem 0.1rem 0 black;
}
</style>
