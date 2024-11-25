<script>
export default {
  name: "MendingButton",
  data() {
    return {
      isVisible: false,
      gainedMvR: new Decimal(0),
      currentMvRRate: new Decimal(0),
      currentMvR: new Decimal(0),
      canMend: false,
      mendGoal: new Decimal(0),
      hover: false,
      creditsClosed: false,
      needsDoom: true,
    };
  },
  computed: {
    buttonClassObject() {
      return {
        "o-mend-button--unavailable": !this.canMend,
        "o-pelle-disabled-pointer": this.creditsClosed
      };
    },
  },
  methods: {
    update() {
      this.isVisible = PlayerProgress.mendingUnlocked();
      if (!this.isVisible) return;
      this.canMend = (Pelle.isDoomed || MendingMilestone.six.isReached) && Currency.antimatter.value.gte(this.mendGoal);
      this.mendGoal = new Decimal(MendingMilestone.six.isReached ? "1e5e14" : "1e9e15");
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.needsDoom = !MendingMilestone.six.isReached;
      const gainedMvR = gainedMendingPoints();
      this.currentMvR.copyFrom(Currency.mendingPoints);
      this.gainedMvR.copyFrom(gainedMvR);
      this.currentMvRRate.copyFrom(gainedMvR.div(Decimal.max(0.0005, Time.thisMendRealTime.totalMinutes)));
    },
    mend() {
      if (!isMendingAvailable) return;
      mendingResetRequest();
    }
  },
};
</script>

<template>
  <button
    v-if="isVisible"
    :class="buttonClassObject"
    class="o-mend-prestige-button o-mend-button"
    @click="mend"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Cannot Crunch -->
    <template v-if="!canMend">
      Reach {{ format(mendGoal, 2, 2) }}
      <br>
      antimatter {{needsDoom ? "in a Doomed Reality" : ""}}
    </template>
    <template v-else>
      <b>
        Mend this Multiverse for
        <span>{{ format(gainedMvR, 2) }}</span>
        <span> Multiversal {{ pluralize("Remain", gainedMvR) }}</span>
        <span> ({{ format(currentMvRRate, 2, 2) }}/min)</span>
      </b>
    </template>
  </button>
</template>

<style scoped>

</style>
