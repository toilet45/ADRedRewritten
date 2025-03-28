<script>
import PrimaryButton from "@/components/PrimaryButton";
import TimeDimensionRow from "./ClassicTimeDimensionRow";

export default {
  name: "ClassicTimeDimensionsTab",
  components: {
    PrimaryButton,
    TimeDimensionRow
  },
  data() {
    return {
      totalUpgrades: new Decimal(0),
      multPerTickspeed: new Decimal(),
      tickspeedSoftcap: new Decimal(0),
      timeShards: new Decimal(0),
      upgradeThreshold: new Decimal(0),
      shardsPerSecond: new Decimal(0),
      incomeType: "",
      areAutobuyersUnlocked: false,
      showLockedDimCostNote: true,
      penteractsUnlocked: false,
      penteractCost: new Decimal(0),
      canBuyPenteracts: false,
      boughtPenteracts: new Decimal(0),
      extraPenteracts: new Decimal(0),
      totalDimCap: new Decimal(0),
      nextDimCapIncrease: new Decimal(0),
      creditsClosed: false,
      isContinuumUnlocked: false
    };
  },
  computed: {
    costIncreases: () => TimeDimension(1).costIncreaseThresholds,
    pentractCountString() {
      const extra = this.extraPenteracts.gt(0) ? ` + ${format(this.extraPenteracts, 2, 2)}` : "";
      return `${format(this.boughtPenteracts)}${extra}`;
    },
  },
  methods: {
    update() {
      this.showLockedDimCostNote = !TimeDimension(8).isUnlocked && player.realities.gte(1);
      this.totalUpgrades.copyFrom(player.totalTickGained);
      this.multPerTickspeed.copyFrom(FreeTickspeed.multToNext);
      this.tickspeedSoftcap.copyFrom(FreeTickspeed.softcap);
      this.timeShards.copyFrom(Currency.timeShards);
      this.upgradeThreshold.copyFrom(FreeTickspeed.fromShards(Currency.timeShards.value).nextShards);
      this.shardsPerSecond.copyFrom(TimeDimension(1).productionPerRealSecond);
      // eslint-disable-next-line max-len
      this.incomeType = EternityChallenge(7).isRunning || EternityChallenge(19).isRunning ? "Eighth Infinity Dimensions" : "Time Shards";
      this.areAutobuyersUnlocked = Autobuyer.timeDimension(1).isUnlocked;
      this.penteractsUnlocked = ExpansionUpgrade(14).isBought;
      this.penteractCost.copyFrom(Penteracts.nextCost);
      this.canBuyPenteracts = Penteracts.canBuyPenteract;
      this.boughtPenteracts.copyFrom(Penteracts.bought);
      this.extraPenteracts.copyFrom(Penteracts.extra);
      this.totalDimCap = TimeDimensions.purchaseCap;
      this.nextDimCapIncrease.copyFrom(Penteracts.nextPenteractIncrease);
      this.creditsClosed = GameEnd.creditsEverClosed;
      this.isContinuumUnlocked = Laitela.continuumActive && Ra.unlocks.timeDimensionContinuum.canBeApplied;
    },
    maxAll() {
      tryUnlockTimeDimensions();
      maxAllTimeDimensions();
    },
    toggleAllAutobuyers() {
      toggleAllTimeDims();
    },
    buyPenteract() {
      Penteracts.buyPenteract();
    }
  }
};
</script>

<template>
  <div class="l-time-dim-tab l-centered-vertical-tab">
    <div
      v-if="!isContinuumUnlocked"
      class="c-subtab-option-container"
    >
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="maxAll"
      >
        Max all
      </PrimaryButton>
      <PrimaryButton
        v-if="areAutobuyersUnlocked"
        class="o-primary-btn--subtab-option"
        @click="toggleAllAutobuyers"
      >
        Toggle all autobuyers
      </PrimaryButton>
    </div>
    <div>
      <p>
        You have gained
        <span class="c-time-dim-description__accent">{{ formatInt(totalUpgrades) }}</span> Tickspeed upgrades from
        <span class="c-time-dim-description__accent">{{ format(timeShards, 2, 1) }}</span> Time Shards.
      </p>
      <p>
        Next Tickspeed upgrade at
        <span class="c-time-dim-description__accent">{{ format(upgradeThreshold, 2, 1) }}</span>, increasing by
        <span class="c-time-dim-description__accent">{{ formatX(multPerTickspeed, 2, 2) }}</span> per
        Tickspeed upgrade gained.
      </p>
    </div>
    <div
      v-if="penteractsUnlocked"
      class="l-infinity-dim-tab__enslaved-reward-container"
    >
      <button
        class="c-infinity-dim-tab__tesseract-button"
        :class="{
          'c-infinity-dim-tab__tesseract-button--disabled': !canBuyPenteracts,
          'o-pelle-disabled-pointer': creditsClosed
        }"
        @click="buyPenteract"
      >
        <p>
          Buy a Penteract ({{ pentractCountString }})
        </p>
        <p>Increase Time Dimension caps by {{ format(nextDimCapIncrease, 2) }}</p>
        <p><b>Costs: {{ format(penteractCost) }} EP</b></p>
      </button>
    </div>
    <div>
      The amount each additional upgrade requires will start
      increasing above {{ formatInt(tickspeedSoftcap) }} Tickspeed upgrades.
    </div>
    <div
      v-if="shardsPerSecond.lt('ee12')"
    >
      You are getting {{ format(shardsPerSecond, 2, 0) }} {{ incomeType }} per second.
    </div>
    <div class="l-dimensions-container">
      <TimeDimensionRow
        v-for="tier in 8"
        :key="tier"
        :tier="tier"
        :are-autobuyers-unlocked="areAutobuyersUnlocked"
      />
    </div>
    <div>
      Time Dimension costs jump at {{ format(costIncreases[0], 2, 2) }} and
      {{ format(costIncreases[1]) }} Eternity Points,
      <br>
      and costs increase much faster after {{ format(costIncreases[2]) }} Eternity Points.
      <br>
      <div v-if="showLockedDimCostNote">
        Hold shift to see the Eternity Point cost for locked Time Dimensions.
      </div>
      Any 8th Time Dimensions purchased above {{ format(1e8) }} will not further increase the multiplier.
      <br>
      Time Dimensions cannot be bought past {{ format(totalDimCap, 2, 2) }} purchases.
    </div>
  </div>
</template>
