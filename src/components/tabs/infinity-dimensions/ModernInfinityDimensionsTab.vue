<script>
import InfinityDimensionRow from "./ModernInfinityDimensionRow";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ModernInfinityDimensionsTab",
  components: {
    PrimaryButton,
    InfinityDimensionRow
  },
  data() {
    return {
      infinityPower: new Decimal(0),
      dimMultiplier: new Decimal(0),
      powerPerSecond: new Decimal(0),
      incomeType: "",
      isEC8Running: false,
      EC8PurchasesLeft: 0,
      isEC9Running: false,
      isEnslavedRunning: false,
      isAnyAutobuyerUnlocked: false,
      conversionRate: new Decimal(0),
      nextDimCapIncrease: new Decimal(0),
      tesseractCost: new Decimal(0),
      totalDimCap: new Decimal(0),
      canBuyTesseract: false,
      enslavedCompleted: false,
      boughtTesseracts: new Decimal(0),
      extraTesseracts: new Decimal(0),
      creditsClosed: false,
      showLockedDimCostNote: true,
      isContinuumActive: false,
      redistributedTesseractsOnIPMult: new Decimal(0),
      redistributedTesseractsOnIPSC: new Decimal(0),
      isSacrificeAffordable: false,
      isSacrificeUnlocked: false,
      currentSacrifice: new Decimal(1),
      sacrificeBoost: new Decimal(1),
    };
  },
  computed: {
    tesseractCountString() {
      const extra = this.extraTesseracts.gt(0) ? ` + ${format(this.extraTesseracts, 2, 2)}` : "";
      const redistributedTess = Decimal.add(this.redistributedTesseractsOnIPMult, this.redistributedTesseractsOnIPSC);
      const redistributed = redistributedTess.gt(0) ? ` - ${format(redistributedTess, 2, 0)}` : "";
      return `${format(this.boughtTesseracts)}${extra}${redistributed}`;
    },
    sacrificeTooltip() {
      return `Providing a ${formatPow(this.sacrificeBoost, 3, 3)} power effect to all Infinity Dimensions`;
    },
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !InfinityDimension(8).isUnlocked;
      this.isEC9Running = EternityChallenge(9).isRunning || EternityChallenge(19).isRunning;
      this.infinityPower.copyFrom(Currency.infinityPower);
      this.conversionRate.copyFrom(InfinityDimensions.powerConversionRate);
      if (this.isEC9Running) {
        this.dimMultiplier.copyFrom(Decimal.pow(Decimal.max(this.infinityPower.log2(), 1), 4).max(1));
      } else {
        this.dimMultiplier.copyFrom(this.infinityPower.pow(this.conversionRate).max(1));
      }
      this.powerPerSecond.copyFrom(InfinityDimension(1).productionPerSecond);
      // eslint-disable-next-line max-len
      this.incomeType = EternityChallenge(7).isRunning || EternityChallenge(19).isRunning ? "Seventh Dimensions" : "Infinity Power";
      this.isEC8Running = EternityChallenge(8).isRunning || EternityChallenge(19).isRunning;
      if (this.isEC8Running) {
        this.EC8PurchasesLeft = player.eterc8ids;
      }
      this.isEnslavedRunning = Enslaved.isRunning;
      this.isAnyAutobuyerUnlocked = Autobuyer.infinityDimension(1).isUnlocked;
      this.nextDimCapIncrease.copyFrom(Tesseracts.nextTesseractIncrease);
      this.tesseractCost.copyFrom(Tesseracts.nextCost);
      this.totalDimCap.copyFrom(InfinityDimensions.totalDimCap);
      this.canBuyTesseract = Tesseracts.canBuyTesseract;
      this.enslavedCompleted = Enslaved.isCompleted;
      this.boughtTesseracts.copyFrom(Tesseracts.bought);
      this.extraTesseracts.copyFrom(Tesseracts.extra);
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.isContinuumActive = Laitela.continuumActive && Ra.unlocks.infinityDimensionContinuum.canBeApplied;
      this.redistributedTesseractsOnIPSC.copyFrom(Tesseracts.redistributedOnIPSoftCap);
      this.redistributedTesseractsOnIPMult.copyFrom(Tesseracts.redistributedOnIPMultCap);
      this.isSacrificeAffordable = IDSacrifice.canSacrifice;
      const isSacrificeUnlocked = IDSacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;
      this.currentSacrifice.copyFrom(IDSacrifice.totalBoost);
      this.sacrificeBoost.copyFrom(IDSacrifice.nextBoost);
    },
    maxAll() {
      InfinityDimensions.buyMax();
    },
    toggleAllAutobuyers() {
      toggleAllInfDims();
    },
    buyTesseract() {
      Tesseracts.buyTesseract();
    },
    sacrifice() {
      IDsacrificeBtnClick();
    },
  }
};
</script>

<template>
  <div class="l-infinity-dim-tab">
    <div
      v-if="!isContinuumActive"
      class="c-subtab-option-container"
    >
      <PrimaryButton
        v-if="!isEC8Running"
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <PrimaryButton
        v-if="isAnyAutobuyerUnlocked && !isEC8Running"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Toggle all autobuyers
      </PrimaryButton>
    </div>
    <div>
      <PrimaryButton
        v-show="isSacrificeUnlocked"
        v-tooltip="sacrificeTooltip"
        :enabled="isSacrificeAffordable"
        class="o-primary-btn--sacrifice"
        @click="sacrifice"
      >
        <span v-if="isSacrificeAffordable">Infinite Sacrifice ({{ formatPow(sacrificeBoost, 3, 3) }})</span>
        <span v-else>Infinite Sacrifice Disabled ({{ disabledCondition }})</span>
      </PrimaryButton>
      <div v-if="isSacrificeUnlocked">
        Infinite Sacrifice power: {{ formatPow(currentSacrifice, 3, 3) }}
      </div>
    </div>
    <div>
      <p>
        You have
        <span class="c-infinity-dim-description__accent">{{ format(infinityPower, 2, 1) }}</span>
        Infinity Power,
        <br>
        <span v-if="!isEC9Running">
          increased by
          <span class="c-infinity-dim-description__accent">{{ formatPow(conversionRate, 2, 3) }}</span>
        </span>
        <span v-else>
          translated
        </span>
        to a
        <span class="c-infinity-dim-description__accent">{{ formatX(dimMultiplier, 2, 1) }}</span>
        multiplier on all
        <span v-if="!isEC9Running">Antimatter Dimensions.</span>
        <span v-else>Time Dimensions due to Eternity Challenge 9.</span>
      </p>
    </div>
    <div
      v-if="enslavedCompleted"
      class="l-infinity-dim-tab__enslaved-reward-container"
    >
      <button
        class="c-infinity-dim-tab__tesseract-button"
        :class="{
          'c-infinity-dim-tab__tesseract-button--disabled': !canBuyTesseract,
          'o-pelle-disabled-pointer': creditsClosed
        }"
        @click="buyTesseract"
      >
        <p>
          Buy a Tesseract ({{ tesseractCountString }})
        </p>
        <p>Increase dimension caps by {{ format(nextDimCapIncrease, 2) }}</p>
        <p><b>Costs: {{ format(tesseractCost) }} IP</b></p>
      </button>
    </div>
    <div v-if="isEnslavedRunning">
      All Infinity Dimensions are limited to a single purchase.
    </div>
    <div v-else>
      All Infinity Dimensions except for the 8th are limited to a maximum of {{ format(totalDimCap, 2) }}
      purchases each.
    </div>
    <div
      v-if="powerPerSecond.lt('ee12')"
    >
      You are getting {{ format(powerPerSecond, 2, 0) }} {{ incomeType }} per second.
    </div>
    <b
      v-if="isEC8Running"
      class="l-infinity-dim-tab__ec8-purchases"
    >
      You have {{ quantifyInt("purchase", EC8PurchasesLeft) }} left within Eternity Challenge 8.
    </b>
    <div class="l-dimensions-container">
      <InfinityDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
      />
    </div>
    <div v-if="showLockedDimCostNote">
      Hold shift to see the Infinity Point cost for locked Infinity Dimensions.
    </div>
  </div>
</template>
