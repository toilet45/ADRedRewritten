<script>
import DamagedUpgradeButton from "./DamagedUpgradeButton";

export default {
  name: "UniversalDamageTab",
  components: {
    DamagedUpgradeButton
  },
  data() {
    return {
      damaged: false,
      lightCredits: new Decimal(),
      darkCredits: new Decimal(),
      isDoomed: false
    };
  },
  computed: {
    upgrades: () => DamagedUpgrades.all,
    runButtonClassObject() {
      return {
        "c-universal-damage-button__icon": true,
        "c-universal-damage-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[9].effects();
    }
  },
  methods: {
    id(row, column) {
      return (row - 1) * 3 + column - 1;
    },
    update() {
      this.damaged = Laitela.isDamaged;
      this.lightCredits.copyFrom(Currency.lightCredits.value);
      this.darkCredits.copyFrom(Currency.darkCredits.value);
      this.isDoomed = Pelle.isDoomed;
    },
    startRun() {
      mendingReset(1);
    },
  }
};
</script>

<template>
  <div class="l-teresa-celestial-tab">
    <div class="l-mechanics-container">
      <div
        v-if="true"
      >
        <div class="c-universal-damage c-universal-damage-run-button">
          <div class="flex">
            <span :class="{ 'o-pelle-disabled': isDoomed }">
              Begin Universal Damage
            </span>
          </div>
          <div
            :class="runButtonClassObject"
            @click="startRun()"
          >
            <i class="fa-solid fa-yin-yang"></i>
          </div>
          {{ runDescription }}
          <br><br>
          <div>
            Gain Dark Credits and Credits on exit, based on Dark Matter and Antimatter respectively.
          </div>
        </div>
      </div>
      <p>
        You have <span class="c-light-credit-description__accent"> {{ format(lightCredits, 2, 0) }}</span> Light {{ pluralize('Credit', lightCredits)}}
        and <span class="c-dark-credit-description__accent"> {{ format(darkCredits, 2, 0) }}</span> Dark {{ pluralize('Credit', darkCredits)}}.
      </p>
      <div class="l-reality-upgrade-grid">
        <div class="c-reality-upgrade-infotext">
          All upgrades except for the sixth are only active for a certain amount of Mends.
          <br>
          You can spend Credits to increase the amount of active Mends by one.
          <br>
          Entering Universal Damage or other special Mends will not decrement this.
          <br>
          <br>
          Light and Dark Credits must be within {{ formatX(2) }} each other otherwise they annihilate each other to 0
        </div>
        <div
          v-for="row in 2"
          :key="row"
          class="l-reality-upgrade-grid__row"
        >
          <DamagedUpgradeButton
            v-for="column in 3"
            :key="id(row, column)"
            :upgrade="upgrades[id(row, column)]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-light-credit-description__accent {
  font-size: 3.5rem;
  color: black;
}

.t-metro .c-light-credit-description__accent,
.t-s8 .c-light-credit-description__accent {
  text-shadow: 0 0 0.1rem rgba(0, 0, 0, 50%), -0.1rem 0.1rem 0.1rem black;
}

.t-dark .c-light-credit-description__accent,
.t-amoled .c-light-credit-description__accent,
.t-amoled-metro .c-light-credit-description__accent,
.t-s6 .c-light-credit-description__accent,
.t-s10 .c-light-credit-description__accent,
.t-s11 .c-light-credit-description__accent {
  color: white;
  text-shadow: 0 0 0.7rem #ffffff;
}

.t-metro .c-light-credit-description__accent,
.t-dark-metro .c-light-credit-description__accent,
.t-s8 .c-light-credit-description__accent {
  color: #dddddd;
}

.c-dark-credit-description__accent {
  font-size: 3.5rem;
  color: black;
}

.t-metro .c-dark-credit-description__accent,
.t-s8 .c-dark-credit-description__accent {
  text-shadow: 0 0 0.1rem rgba(0, 0, 0, 50%), -0.1rem 0.1rem 0.1rem black;
}

.t-dark .c-dark-credit-description__accent,
.t-amoled .c-dark-credit-description__accent,
.t-amoled-metro .c-dark-credit-description__accent,
.t-s6 .c-dark-credit-description__accent,
.t-s10 .c-dark-credit-description__accent,
.t-s11 .c-dark-credit-description__accent {
  color: #272727;
  text-shadow: 0 0 0.7rem #ffffff;
}

.t-metro .c-dark-credit-description__accent,
.t-dark-metro .c-dark-credit-description__accent,
.t-s8 .c-dark-credit-description__accent {
  color: #272727;
}
</style>
