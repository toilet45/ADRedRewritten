<script>
import ArmageddonButton from "../../tabs/celestial-pelle/ArmageddonButton";
import RealityCurrencyHeader from "../../RealityCurrencyHeader";

import HeaderTickspeedInfo from "../HeaderTickspeedInfo";

import RealityButton from "./RealityButton";

// This component contains antimatter and antimatter rate at the start of the game, as well as some additional
// information depending on the UI (tickspeed for Classic, game speed for Modern). Everything but antimatter is
// removed once Reality is unlocked, to make room for the reality button
export default {
  name: "HeaderCenterContainer",
  components: {
    HeaderTickspeedInfo,
    RealityCurrencyHeader,
    RealityButton,
    ArmageddonButton,
  },
  data() {
    return {
      shouldDisplay: true,
      isModern: false,
      hasRealityButton: false,
      isDoomed: false,
      antimatter: new Decimal(0),
      antimatterPerSec: new Decimal(0),
      displayInstability: false,
      instabilityStart: new Decimal(),
      scPow: new Decimal()
    };
  },
  methods: {
    update() {
      this.shouldDisplay = player.break || !Player.canCrunch;
      if (!this.shouldDisplay) return;

      this.isModern = player.options.newUI;
      this.isDoomed = Pelle.isDoomed;
      this.antimatter.copyFrom(Currency.antimatter);
      this.hasRealityButton = PlayerProgress.realityUnlocked() || TimeStudy.reality.isBought;
      if (!this.hasRealityButton) this.antimatterPerSec.copyFrom(Currency.antimatter.productionPerSecond);
      this.displayInstability = false; //AntimatterDimension(1).multiplier.log10().gt("9e15") && MendingUpgrade(20).isBought;
      this.instabilityStart = ADInstabilityStart();
      this.scPow = Decimal.log(getDimensionFinalMultiplierUncached(1), getDimensionFinalMultiplierUncachedWithoutSC(1)).recip();
    },
  },
};
</script>

<template>
  <div
    v-if="shouldDisplay"
    class="c-prestige-button-container"
  >
    <span>You have <span class="c-game-header__antimatter">{{ format(antimatter, 2, 1) }}</span> antimatter.</span>
    <span v-if="displayInstability">Due to Dimensional Instability, your Antimatter Dimension multipliers are being rooted by {{ format(scPow, 3, 3) }} past {{format(instabilityStart, 2, 2)}}</span>
    <div
      v-if="hasRealityButton"
      class="c-reality-container"
    >
      <RealityCurrencyHeader />
      <ArmageddonButton
        v-if="isDoomed"
        :is-header="true"
      />
      <RealityButton v-else />
    </div>
    <div v-else>
      You are getting {{ format(antimatterPerSec, 2) }} antimatter per second.
      <br>
      <HeaderTickspeedInfo />
    </div>
  </div>
</template>

<style scoped>
.c-reality-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
