<script>
export default {
  name: "ExpansionButton",
  data() {
    return {
      isUnlocked: false,
      isRunning: false,
      hasGain: false,
      enslavedPointGain: new Decimal(),
      creditsClosed: false
    };
  },
  computed: {
    disableText() {
      // Doesn't need to be reactive or check strike status; it's always permanent once entered in Doomed
      return "Contract your Reality";
    }
  },
  methods: {
    update() {
      this.isUnlocked = Ra.unlocks.timeExpansionUnlock.canBeApplied;
      this.isRunning = player.celestials.enslaved.expanded;
      if (!this.isRunning) return;
      // This lets this.hasGain be true even before eternity.
      this.hasGain = false;
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.enslavedPointGain = new Decimal(0);
    },
    expand() {
      if (this.creditsClosed) return;
      requestManualReality(true);
    }
  }
};
</script>

<template>
  <button
    class="o-expansion-btn"
    :class="isUnlocked ? 'o-expansion-btn--unlocked' : 'o-expansion-btn--locked'"
    @click="expand()"
  >
    <!-- why is there an isUnlocked condition here, the tab isnt visible till Name 50 anyways -->
    <span v-if="!isUnlocked">Reach Nameless level 50 to unlock</span>
    <span v-else-if="!isRunning">
      Expand your Reality.
    </span>
    <span v-else-if="hasGain">
      {{ disableText }}
      <br>
      Gain {{ quantify("Time Remnant", enslavedPointGain, 2, 1) }}.
    </span>
    <span v-else>
      {{ disableText }}
      <br>
      You need more Infinity Points to gain Time Remnants.
    </span>
  </button>
</template>

<style scoped>
/* #region o-expansion-btn */

.o-expansion-btn {
  width: 19rem;
  height: 9rem;
  font-family: Typewriter, serif;
  font-size: 1.12rem;
  font-weight: bold;
  border: var(--var-border-width, 0.2rem) solid var(--color-enslaved--base);
  border-radius: var(--var-border-radius, 0.4rem);
  padding: 1rem;
  transition-duration: 0.2s;
}

.o-expansion-btn--locked {
  color: #181818;
  background-color: #5f5f5f;
  border-color: #8a630f;
}

.o-expansion-btn--unlocked {
  color: var(--color-enslaved--base);
  background-color: black;
  animation: a-expansion-btn-glow 10s infinite;
  cursor: pointer;
}

.o-expansion-btn--unlocked:hover {
  background-color: white;
}

.t-dark .o-expansion-btn--unlocked {
  color: var(--color-enslaved--base);
  background-color: black;
}

.t-dark .o-expansion-btn--unlocked:hover,
.t-s6 .o-expansion-btn--unlocked:hover,
.t-s10 .o-expansion-btn--unlocked:hover {
  color: var(--color-enslaved--base);
  background-color: white;
}

.t-s4 .o-expansion-btn {
  animation: a-expansion-btn-glow--cancer 10s infinite;
}

.o-expansion-btn--locked:hover {
  color: #1d1d1d;
  background-color: #660000;
}

.s-base--metro .o-expansion-btn--locked,
.t-s1 .o-expansion-btn--locked {
  color: black;
  background-color: #9e9e9e;
  border: none;
  box-shadow: 0.1rem 0.1rem 0.1rem 0 black;
}

.s-base--metro .o-expansion-btn--locked:hover {
  background-color: #ef5350;
}

.t-s1 .o-expansion-btn--locked:hover {
  background-color: #d72621;
}

.t-s6 .o-expansion-btn--locked,
.t-s10 .o-expansion-btn--locked {
  color: gray;
  background-color: black;
}

.t-dark .o-expansion-btn--locked {
  color: black;
  background-color: #23292a;
}

.t-dark .o-expansion-btn--locked:hover,
.t-s6 .o-expansion-btn--locked:hover,
.t-s10 .o-expansion-btn--locked:hover {
  color: black;
  background-color: #b84b5f;
  border-color: #b84b5f;
}

@keyframes a-expansion-btn-glow {
  0% { box-shadow: inset 0.5rem  0       2rem; }
  25% { box-shadow: inset 0       0.5rem  2rem; }
  50% { box-shadow: inset -0.5rem 0       2rem; }
  75% { box-shadow: inset 0       -0.5rem 2rem; }
  100% { box-shadow: inset 0.5rem  0       2rem; }
}

@keyframes a-expansion-btn-glow--cancer {
  0% { box-shadow: inset  0.5px -0.5rem 2rem; }
  10% { box-shadow: inset -0.5px  0.5rem 2rem; }
  20% { box-shadow: inset  0.5px -0.5rem 2rem; }
  22% { box-shadow: inset -0.5px  0.5rem 2rem; }
  25% { box-shadow: inset  0.5px -0.5rem 2rem; }
  29% { box-shadow: inset -0.5px  0.5rem 2rem; }
  39% { box-shadow: inset  0.5px -0.5rem 2rem; }
  44% { box-shadow: inset -0.5px  0.5rem 2rem; }
  53% { box-shadow: inset  0.5px -0.5rem 2rem; }
  57% { box-shadow: inset -0.5px  0.5rem 2rem; }
  63% { box-shadow: inset  0.5px -0.5rem 2rem; }
  69% { box-shadow: inset -0.5px  0.5rem 2rem; }
  71% { box-shadow: inset  0.5px -0.5rem 2rem; }
  74% { box-shadow: inset -0.5px  0.5rem 2rem; }
  75% { box-shadow: inset  0.5px -0.5rem 2rem; }
  84% { box-shadow: inset -0.5px  0.5rem 2rem; }
  88% { box-shadow: inset  0.5px -0.5rem 2rem; }
  92% { box-shadow: inset -0.5px  0.5rem 2rem; }
  93% { box-shadow: inset  0.5px -0.5rem 2rem; }
  95% { box-shadow: inset -0.5px  0.5rem 2rem; }
  100% { box-shadow: inset  0.5px -0.5rem 2rem; }
}

/* #endregion o-expansion-btn */
</style>
