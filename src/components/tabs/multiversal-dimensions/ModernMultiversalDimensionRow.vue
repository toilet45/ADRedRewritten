<script>
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ModernMultiversalDimensionRow",
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
      return `${MultiversalDimension(this.tier).shortDisplayName} Multiversal Dimension`;
    },
    buttonContents() {
      return this.formattedMvRCost;
    },
    tooltipContents() {
      if (this.isCapped) return `Multiversal Dimensions are capped at ${format(MultiversalDimensions.purchaseCap)} purchases.`;
      return `Purchased ${quantifyInt("time", this.bought)}`;
    },
    showRow() {
      return true;//this.requirementReached;
    },
    formattedMvRCost() {
      if (this.isContinuumUnlocked) return `Continuum: ${format(this.continuumValue, 2, 2)}`;
      return this.isCapped ? "Capped" : `${this.showCostTitle ? "Cost: " : ""}${format(this.cost, 2)} MvR`;
    },
    hasLongText() {
      return this.buttonContents.length > 20;
    },
    showCostTitle() {
      return this.cost.log10().lte(1e6);
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
      const dimension = MultiversalDimension(tier);
      this.isCapped = dimension.bought.gte(MultiversalDimensions.purchaseCap);
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
      this.isAutobuyerOn = false;//Autobuyer.timeDimension(this.tier).isActive;
      this.isContinuumUnlocked = false;//Laitela.continuumActive && Ra.unlocks.timeDimensionContinuum.canBeApplied;
      this.continuumValue = dimension.continuumValue;
    },
    buyMultiversalDimension() {
      if (!this.isUnlocked) {
        return;
      }
      if (this.isContinuumUnlocked) return;
      buySingleMultiversalDimension(this.tier);
    },
    buyMaxMultiversalDimension() {
      if (this.isContinuumUnlocked) return;
      buyMaxMultiversalDimension(this.tier);
    }
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-row-multiversal-dim l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked && !requirementReached }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="formatX(multiplier, 2, 1)"
      :amount-text="amountText"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container c-modern-dim-tooltip-container">
      <div
        v-if="!isContinuumUnlocked"
        class="c-modern-dim-purchase-count-tooltip">
        <span v-html="tooltipContents" />
      </div>
      <PrimaryButton
        v-if="isContinuumUnlocked"
        class="o-primary-btn--buy-id o-continuum c-dim-tooltip-container"
        :class="{ 'l-dim-row-small-text': hasLongText }"
        @click="buyMultiversalDimension"
      >
        Continuum: {{ continuumString }}
        <div class="c-dim-purchase-count-tooltip">
          Continuum produces all of your Multiversal Dimensions
        </div>
      </PrimaryButton>
      <PrimaryButton
        v-else
        :enabled="isAvailableForPurchase && !isCapped"
        class="o-primary-btn--buy-td o-primary-btn o-primary-btn--new o-primary-btn--buy-dim"
        :class="{ 'l-dim-row-small-text': hasLongText }"
        @click="buyMultiversalDimension"
      >
        {{ buttonContents }}
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.c-modern-dim-tooltip-container .c-modern-dim-purchase-count-tooltip {
  position: absolute;
  width: 20rem;
  top: 50%;
  font-size: 1.3rem;
  line-height: 1.6rem;
  color: white;
  background: black;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-width, 0.5rem);
  /* Buttons are 40rem wide, tooltip is 20rem */
  transform: translate(calc(-175% - 1rem), -50%);
  padding: 0.5rem;
  visibility: hidden;
}

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
