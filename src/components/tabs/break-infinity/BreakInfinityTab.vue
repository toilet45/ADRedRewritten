<script>
import BreakInfinityButton from "./BreakInfinityButton";
import InfinityUpgradeButton from "@/components/InfinityUpgradeButton";

export default {
  name: "BreakInfinityTab",
  components: {
    BreakInfinityButton,
    InfinityUpgradeButton
  },
  data() {
    return {
      isUnlocked: false,
      totalCharges: 0,
      totalBreakCharges: 0,
      chargesUsed: 0,
      breakChargesUsed: 0,
      breakChargeUnlocked: false,
      disCharge: false,
      breakDisCharge: false
    };
  },
  computed: {
    grid() {
      return [
        [
          BreakInfinityUpgrade.totalAMMult,
          BreakInfinityUpgrade.currentAMMult,
          BreakInfinityUpgrade.galaxyBoost,
        ],
        [
          BreakInfinityUpgrade.infinitiedMult,
          BreakInfinityUpgrade.achievementMult,
          BreakInfinityUpgrade.slowestChallengeMult,
        ],
        [
          BreakInfinityUpgrade.infinitiedGen,
          BreakInfinityUpgrade.autobuyMaxDimboosts,
          BreakInfinityUpgrade.autobuyerSpeed
        ],
        [
          BreakInfinityUpgrade.tickspeedCostMult,
          BreakInfinityUpgrade.dimCostMult,
          BreakInfinityUpgrade.ipGen
        ]
      ];
    },
    disChargeClassObject() {
      return {
        "c-break-infinity-buttons": true,
        "o-primary-btn--subtab-option": true,
        "o-primary-btn--charged-respec-active": this.disCharge
      };
    },
    breakDisChargeClassObject() {
      return {
        "c-break-infinity-buttons": true,
        "o-primary-btn--subtab-option": true,
        "o-primary-btn--charged-respec-active": this.breakDisCharge
      };
    },
  },
  watch: {
    disCharge(newValue) {
      player.celestials.ra.disCharge = newValue;
    },
    breakDisCharge(newValue) {
      player.celestials.ra.breakDisCharge = newValue;
    }
  },
  methods: {
    update() {
      this.isUnlocked = Autobuyer.bigCrunch.hasMaxedInterval;
      this.totalCharges = Ra.totalCharges;
      this.chargesUsed = Ra.totalCharges - Ra.chargesLeft;
      this.totalBreakCharges = Ra.totalBreakCharges;
      this.breakChargesUsed = Ra.totalBreakCharges - Ra.breakChargesLeft;
      this.breakChargeUnlocked = Ra.unlocks.breakCharges.canBeApplied && !Pelle.isDoomed;
      this.disCharge = player.celestials.ra.disCharge;
      this.breakDisCharge = player.celestials.ra.breakDisCharge;
    },
    btnClassObject(column) {
      return {
        "l-infinity-upgrade-grid__cell": true,
        "o-infinity-upgrade-btn--multiplier": column === 3
      };
    },
    timeDisplayShort(time) {
      return timeDisplayShort(time);
    },
  },
};
</script>

<template>
  <div class="l-break-infinity-tab">
    <div v-if="!isUnlocked">
      Reduce the interval of Automatic Big Crunch Autobuyer to
      {{ format(0.1, 1, 1) }} seconds to unlock Break Infinity.
    </div>
    <div v-else>
      <div
        v-if="breakChargeUnlocked"
        class="c-subtab-option-container"
      >
        <PrimaryButton
          :class="disChargeClassObject"
          @click="disCharge = !disCharge"
        >
          Respec Charged Infinity Upgrades on next Reality
        </PrimaryButton>
        <PrimaryButton
          v-if="breakChargeUnlocked"
          :class="breakDisChargeClassObject"
          @click="breakDisCharge = !breakDisCharge"
        >
          Respec Charged Break Infinity Upgrades on next Reality
        </PrimaryButton>
      </div>
      <div v-if="breakChargeUnlocked">
        You have charged {{ formatInt(chargesUsed) }}/{{ formatInt(totalCharges) }} Infinity Upgrades. <br>
        <!-- eslint-disable-next-line max-len -->
        Additionally, you have used {{ formatInt(breakChargesUsed) }}/{{ formatInt(totalBreakCharges) }} Break Infinity Charges.
        Charged Break Infinity Upgrades have their effect altered.
        <br>
        Hold shift to show Charged Break Infinity Upgrades. You can freely respec your choices on Reality.<br>
      </div>
      <BreakInfinityButton class="l-break-infinity-tab__break-btn" />
      <div
        class="l-break-infinity-upgrade-grid l-break-infinity-tab__grid"
      >
        <div
          v-for="(column, columnId) in grid"
          :key="columnId"
          class="l-break-infinity-upgrade-grid__row"
        >
          <InfinityUpgradeButton
            v-for="upgrade in column"
            :key="upgrade.id"
            :upgrade="upgrade"
            :class="btnClassObject(columnId)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Do not ask me why, but we HAVE to do it this way, code is a pos for no reason otherwise*/
.c-break-infinity-buttons {
  height: 2.5rem;
  display: flex;
  border-radius: 0.2rem;
  border-style: solid;
  border-color: var(--color-good);
  background-color: var(--color-base);
  transition-duration: 0.2s;
  font-family: Typewriter, serif;
  font-size: 1.275rem;
  font-weight: bold;
  color: var(--color-text);
  text-align: center;
  margin: 0.4rem 0.8rem;
  padding: 0.3rem 1rem;
  align-items: center;
}
</style>
