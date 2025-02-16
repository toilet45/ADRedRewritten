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
      isDamaged: false
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
      this.canMend = this.isDamaged || (Pelle.isDoomed || MendingMilestone.six.isReached) &&
        Currency.antimatter.value.gte(this.mendGoal);
      this.mendGoal = new Decimal(MendingMilestone.six.isReached ? "1e5e14" : "1e9e15");
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.needsDoom = !MendingMilestone.six.isReached;
      const gainedMvR = gainedMendingPoints();
      this.currentMvR.copyFrom(Currency.mendingPoints);
      this.gainedMvR.copyFrom(gainedMvR);
      this.currentMvRRate.copyFrom(gainedMvR.div(Decimal.max(0.0005, Time.thisMendRealTime.totalMinutes)));
      this.isDamaged = Laitela.isDamaged;
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
    v-if="isDamaged"
    :class="buttonClassObject"
    class="o-mend-prestige-button o-damaged-mend-button"
    @click="mend"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Cannot Crunch -->
    <template v-if="!canMend">
      Reach {{ format(mendGoal, 2, 2) }}
      <br>
      antimatter {{ needsDoom ? "in a Doomed Reality" : ""}}
    </template>
    <template v-else>
      <b>
        Mend this Universe for
        <span>{{ format(0, 2) }}</span>
        <span> Light {{ pluralize("Credit", 0) }}</span> and
        <span> {{ format(0, 2) }}</span>
        <span> Dark {{ pluralize("Credit", 0) }}</span>
        <span> ({{ format(0, 2, 2) }} light/min</span> and
        <span> {{ format(0, 2, 2) }} dark/min)</span>
      </b>
    </template>
  </button>
  <button
    v-else-if="isVisible"
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
      antimatter {{ needsDoom ? "in a Doomed Reality" : ""}}
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
.o-mend-button {
  font-weight: bold;
  color: var(--color-mending);
  background-color: var(--color-prestige--accent);
  border-color: var(--color-mending);
}

.o-mend-button:hover {
  color: black;
  background-color: var(--color-mending);
}

.o-mend-button span {
  transition-duration: 0.2s;
}

.o-mend-button:hover span {
  color: black;
}

.t-metro .o-mend-button {
  box-shadow: 0.1rem 0.1rem 0.1rem 0 #9e9e9e;
}

.o-mend-button--unavailable {
  opacity: 0.5;
  cursor: default;
}

.c-mend-prestige-button-container {
  display: flex;
  flex-direction: column;
  height: 14rem;
  justify-content: space-around;
  align-items: center;
  padding: 1rem;
}

.o-mend-prestige-button {
  width: 30rem;
  height: 6rem;
  font-family: Typewriter, serif;
  font-size: 1.1rem;
  border: var(--var-border-width, 0.2rem) solid;
  border-radius: var(--var-border-radius, 0.4rem);
  transition-duration: 0.2s;
  cursor: pointer;
}

.o-mend-prestige-button br {
  pointer-events: none;
}

.o-mend-prestige-button b {
  pointer-events: none;
}

.o-damaged-mend-button {
  font-weight: bold;
  color: var(--color-laitela--accent);
  background-color: var(--color-laitela--base);
  border-color: var(--color-laitela--accent);
}

.o-damaged-mend-button:hover {
  color: black;
  background-color: white;
}

.o-damaged-mend-button span {
  transition-duration: 0.2s;
}

.o-damaged-mend-button:hover span {
  color: black;
}

.t-metro .o-damaged-mend-button {
  box-shadow: 0.1rem 0.1rem 0.1rem 0 #9e9e9e;
}

.o-damaged-mend-button--unavailable {
  opacity: 0.5;
  cursor: default;
}
</style>
