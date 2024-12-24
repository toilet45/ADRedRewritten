<script>
export default {
  name: "GameSpeedDisplay",
  props: {
  },
  data() {
    return {
      baseSpeed: new Decimal(),
      pulsedSpeed: new Decimal(),
      hasSeenAlteredSpeed: false,
      isStopped: false,
      isEC12: false,
      isPulsing: false,
      hasDevSpeed: false,
      currentDevSpeed: new Decimal(),
      inMatterChallenge: false,
      hasImaginaryBlackHoles: false,
      speedUncapped: false,
      realSpeed: new Decimal(),
      hasSeenRealAlteredSpeed: false
    };
  },
  computed: {
    baseSpeedText() {
      if (this.isStopped) {
        return "Stopped (storing real time)";
      }
      const speed = this.formatNumber(this.baseSpeed.div(this.isEC12 ? 1 : this.currentDevSpeed));
      if (this.isEC12) {
        return `${speed} (fixed)`;
      }
      if (this.baseSpeed.gte(1e300) && !this.speedUncapped) {
        return `${speed} (capped)`;
      }
      return `${speed}`;
    },
    pulseSpeedText() {
      return `${this.formatNumber(this.pulsedSpeed)}`;
    },
    baseText() {
      if (!this.hasSeenAlteredSpeed) return null;
      return this.baseSpeed.div(this.currentDevSpeed).eq(1)
        ? "The game is running at normal speed."
        : `Game speed is altered: ${this.baseSpeedText}`;
    },
    baseRealSpeedText() {
      const realSpeed = this.formatNumber(this.realSpeed);
      return `${realSpeed}`;
    },
    baseRealText() {
      if (this.realSpeed.eq(1)) return `Real time is passing at normal speed.`;
      return `Real time is altered: ${this.baseRealSpeedText}`;
    },
    devSpeedText() {
      const devSpeed = this.formatNumber(this.currentDevSpeed);
      return this.isEC12 || this.inMatterChallenge ? `TESTING SPEED HAS NO EFFECT` : `TESTING SPEED IS MODIFIED: ${devSpeed}`;
    },
  },
  methods: {
    update() {
      this.baseSpeed = getGameSpeedupFactor();
      this.pulsedSpeed = getGameSpeedupForDisplay();
      this.hasSeenAlteredSpeed = PlayerProgress.seenAlteredSpeed();
      this.isStopped = Enslaved.isStoringRealTime;
      // eslint-disable-next-line max-len
      this.isEC12 = EternityChallenge(12).isRunning || EternityChallenge(16).isRunning || EternityChallenge(20).isRunning;
      this.isPulsing = this.baseSpeed.neq(this.pulsedSpeed.times(this.currentDevSpeed)) && Enslaved.canRelease(true);
      this.hasDevSpeed = dev.speedUp !== 1;
      this.currentDevSpeed = new Decimal(dev.speedUp);
      // eslint-disable-next-line max-len
      this.inMatterChallenge = NormalChallenge(11).isRunning || InfinityChallenge(6).isRunning || InfinityChallenge(8).isRunning;
      //this.hasImaginaryBlackHoles = ImaginaryBlackHole(1).isActive && !this.isStopped && this.baseSpeed.gt(1);
      this.speedUncapped = Ra.unlocks.gamespeedUncap.canBeApplied;
      this.realSpeed = getRealTimeSpeedupFactor();
      this.hasSeenRealAlteredSpeed = ImaginaryBlackHole(1).isUnlocked;
    },
    formatNumber(num) {
      if (num.gte(0.001) && num.lt(1e4) && num.neq(1)) {
        return format(num, 3, 3);
      }
      if (num.lt(0.001)) {
        return `${formatInt(1)} / ${format(Decimal.div(1, num), 2)}`;
      }
      return `${format(num, 2)}`;
    }
  }
};
</script>

<template>
  <span class="c-gamespeed">
    <span>
      {{ baseText }}
    </span>
    <span v-if="isPulsing">(<i class="fas fa-expand-arrows-alt u-fa-padding" /> {{ pulseSpeedText }})</span>
    <span
      v-if="hasSeenRealAlteredSpeed"
      class="c-realspeed">
      <br>{{ baseRealText }}</span>
    <span v-if="hasDevSpeed"><br><b class="c-devspeed"> {{ devSpeedText }} </b></span>
  </span>
</template>

<style scoped>
.c-gamespeed {
  font-weight: bold;
  color: var(--color-text);
}

.c-devspeed {
  font-weight: bold;
  color: #258b25;
}

.c-realspeed {
  font-weight: bold;
  color: #c0a821;
}
</style>
