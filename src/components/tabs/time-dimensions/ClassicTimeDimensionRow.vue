<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ClassicTimeDimensionRow",
  components: {
    GenericDimensionRowText,
    PrimaryButton,
    PrimaryToggleButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    },
    areAutobuyersUnlocked: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      isCapped: false,
      multiplier: new Decimal(0),
      amount: new Decimal(0),
      bought: new Decimal(0),
      rateOfChange: new Decimal(0),
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      isAutobuyerOn: false,
      requirementReached: false,
      realityUnlocked: false,
      showTTCost: false,
      ttCost: 0,
      ttGen: new Decimal(),
      currTT: new Decimal(),
      isContinuumUnlocked: false,
      continuumValue: new Decimal()
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    name() {
      return `${TimeDimension(this.tier).shortDisplayName} Time Dimension`;
    },
    buttonContents() {
      if (this.showTTCost) return this.formattedTTCost;
      return this.formattedEPCost;
    },
    tooltipContents() {
      if (this.showTTCost) return `${this.formattedEPCost}<br>${this.timeEstimate}`;
      if (this.isCapped & this.bought.lt(TimeDimensions.purchaseCap)) {
        return `Nameless prevents the purchase of more than ${format(1)} Time Dimension`;
      }
      if (this.isContinuumUnlocked) return "Continuum is producing all of your Time Dimensions";
      if (this.isCapped) return `Time Dimensions are capped at ${format(TimeDimensions.purchaseCap)} purchases.`;
      return `Purchased ${quantifyInt("time", this.bought)}`;
    },
    showRow() {
      return this.realityUnlocked || this.isUnlocked || this.requirementReached;
    },
    formattedTTCost() {
      return `Unlock: ${format(this.ttCost)} TT`;
    },
    formattedEPCost() {
      if (this.isContinuumUnlocked) return `Continuum: ${format(this.continuumValue, 2, 2)}`;
      return this.isCapped ? "Capped" : `${this.showCostTitle ? "Cost: " : ""}${format(this.cost, 2)} EP`;
    },
    hasLongText() {
      return this.buttonContents.length > 20;
    },
    showCostTitle() {
      return this.cost.log10().lte(1e6);
    },
    timeEstimate() {
      if (!this.showTTCost || this.ttGen.eq(0)) return "";
      const time = Decimal.sub(this.ttCost, this.currTT).dividedBy(this.ttGen);
      return time.gt(0) ? `Enough TT in ${TimeSpan.fromSeconds(time).toStringShort()}` : "";
    },
    amountText() {
      const amount = this.tier < 8 ? format(this.amount, 2) : formatInt(this.amount);
      return `${amount}`;
    },
    continuumString() {
      return this.continuumValue.gte(1e9) ? format(this.continuumValue, 2, 2) : formatFloat(this.continuumValue, 2);
    },
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.timeDimension(this.tier).isActive = newValue;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = TimeDimension(tier);
      this.isCapped = dimension.bought.gte(Enslaved.isRunning ? 1 : TimeDimensions.purchaseCap);
      this.isUnlocked = dimension.isUnlocked;
      this.multiplier.copyFrom(dimension.multiplier);
      this.amount.copyFrom(dimension.totalAmount);
      this.bought.copyFrom(dimension.bought);
      if (tier < 8) {
        this.rateOfChange.copyFrom(dimension.rateOfChange);
      }
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
      if (!this.isUnlocked) {
        this.isAvailableForPurchase = dimension.requirementReached;
      }
      this.requirementReached = dimension.requirementReached;
      this.isAutobuyerOn = Autobuyer.timeDimension(this.tier).isActive;
      this.realityUnlocked = PlayerProgress.realityUnlocked();
      this.showTTCost = !this.isUnlocked && !this.shiftDown;
      if (this.tier > 4) this.ttCost = TimeStudy.timeDimension(this.tier).cost;
      this.currTT.copyFrom(Currency.timeTheorems.value);
      this.ttGen.copyFrom(getTTPerSecond().times(timeEffects.gameTimeSpeedup));
      this.isContinuumUnlocked = Laitela.continuumActive && Ra.unlocks.timeDimensionContinuum.canBeApplied;
      if (this.isContinuumUnlocked) this.continuumValue = dimension.continuumValue;
    },
    buyTimeDimension() {
      if (!this.isUnlocked) {
        TimeDimension(this.tier).tryUnlock();
        return;
      }
      if (this.isContinuumUnlocked) return;
      buySingleTimeDimension(this.tier);
    },
    buyMaxTimeDimension() {
      if (this.isContinuumUnlocked) return;
      buyMaxTimeDimension(this.tier);
    },
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked && !requirementReached }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 1)"
      :amount-text="amountText"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container">
      <PrimaryButton
        v-if="isContinuumUnlocked"
        class="o-primary-btn--buy-id o-continuum c-dim-tooltip-container"
        :class="{ 'l-dim-row-small-text': hasLongText }"
      >
        Continuum: {{ continuumString }}
        <div class="c-dim-purchase-count-tooltip">
          Continuum produces all of your Time Dimensions
        </div>
      </PrimaryButton>
      <PrimaryButton
        v-else
        :enabled="isAvailableForPurchase && !isCapped"
        class="o-primary-btn--buy-td o-primary-btn--buy-dim c-dim-tooltip-container"
        :class="{ 'l-dim-row-small-text': hasLongText }"
        @click="buyTimeDimension"
      >
        {{ buttonContents }}
        <div class="c-dim-purchase-count-tooltip">
          <span v-html="tooltipContents" />
        </div>
      </PrimaryButton>
      <div v-if="!isContinuumUnlocked">
        <PrimaryToggleButton
          v-if="areAutobuyersUnlocked"
          v-model="isAutobuyerOn"
          class="o-primary-btn--buy-td-auto"
          label="Auto:"
        />
        <PrimaryButton
          v-else
          :enabled="isAvailableForPurchase && !isCapped"
          class="o-primary-btn--buy-td-auto"
          @click="buyMaxTimeDimension"
        >
          Buy Max
        </PrimaryButton>
      </div>
    </div>
  </div>
</template>


<style scoped>
.o-continuum {
  border-color: var(--color-laitela--accent);
  color: var(--color-laitela--accent);
  background: var(--color-laitela--base);
}

.o-continuum:hover {
  border-color: var(--color-laitela--accent);
  color: var(--color-laitela--base);
  background: var(--color-laitela--accent);
}
</style>
