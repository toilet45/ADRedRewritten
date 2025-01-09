<script>
import CelestialStudySaveLoadButton from "./CelestialStudySaveLoadButton";
import CelestialTheoremBuyButton from "./CelestialTheoremBuyButton";

export default {
  name: "CelestialTheoremShop",
  components: {
    CelestialTheoremBuyButton,
    CelestialStudySaveLoadButton
  },
  data() {
    return {
      theoremAmount: new Decimal(),
      totalTimeTheorems: new Decimal(),
      shopMinimized: false,
      minimizeAvailable: false,
      hasTTAutobuyer: false,
      isAutobuyerOn: false,
      amAmnt: new Decimal(),
      amCost: new Decimal(),
      ttAmnt: new Decimal(),
      ttCost: new Decimal(),
      VCelTheorems: new Decimal(),
      showBought: false
    };
  },
  computed: {
    minimized() {
      return this.shopMinimized;
    },
    formatCelestialTheoremType() {
      if (this.theoremAmount.gte(1e6)) {
        return format;
      }
      return formatInt;
    },
    totalCelestialTheoremText() {
      return `${quantifyInt("total Celestial Theorem", this.totalTimeTheorems, 2, 2, this.formatTimeTheoremType)}`;
    },
    minimizeArrowStyle() {
      return {
        transform: this.minimized ? "rotate(-180deg)" : "",
        transition: "all 0.25s ease-out"
      };
    },
    saveLoadText() {
      return this.$viewModel.shiftDown ? "Save:" : "Load:";
    },
    shopBottomRowHeightStyle() {
      return {
        height: "4.4rem",
      };
    }
  },
  methods: {
    minimize() {
      player.timestudy.shopMinimized = !player.timestudy.shopMinimized;
    },
    formatAM(am) {
      return `${format(am)} AM`;
    },
    buyWithAM() {
      CelestialTheorems.buyOne("am", false);
    },
    formatTT(tt) {
      return `${format(tt)} TT`;
    },
    buyWithTT() {
      CelestialTheorems.buyOne("tt", false);
    },
    buyMaxTheorems() {
      CelestialTheorems.buyMax(false);
    },
    update() {
      this.theoremAmount.copyFrom(Currency.celestialTheorems);
      this.VCelTheorems = V.availableCT;
      this.totalTimeTheorems.copyFrom(Currency.celestialTheorems.max);
      this.shopMinimized = !Ra.unlocks.celTreeUnlocks.canBeApplied;
      this.hasTTAutobuyer = false;
      this.minimizeAvailable = false;
      this.amAmnt.copyFrom(CelestialTheoremPurchaseType.am.currency);
      this.amCost.copyFrom(CelestialTheoremPurchaseType.am.cost);
      this.ttAmnt.copyFrom(CelestialTheoremPurchaseType.tt.currency);
      this.ttCost.copyFrom(CelestialTheoremPurchaseType.tt.cost);
      this.showBought = Ra.unlocks.celTreeUnlocks.canBeApplied;
    },
    toggleTTgen() {
      this.invertTTgenDisplay = !this.invertTTgenDisplay;
    }
  },
};
</script>

<template>
  <div class="time-theorem-buttons">
    <div class="ttshop-container ttshop-background">
      <div
        data-role="page"
        class="ttbuttons-row ttbuttons-top-row"
      >
        <button
          class="l-tt-save-load-btn c-tt-buy-button c-tt-buy-button--unlocked"
          onClick="Modal.preferredTree.show()"
        >
          <i class="fas fa-cog" />
        </button>
        <p class="timetheorems">
          <span
            v-if="!showBought"
            class="c-ct-amount">
            {{ quantifyInt("Celestial Theorem", VCelTheorems, 2, 0, formatCelestialTheoremType) }}
          </span>
          <span
            v-else
            class="c-ct-amount"
          >
           {{ formatInt(VCelTheorems) }} + {{ quantifyInt("Celestial Theorem", theoremAmount, 2, 0, formatCelestialTheoremType) }}
          </span>
        </p>
        <div class="l-load-tree-area">
          <div class="l-tree-load-button-wrapper">
            <span class="c-ttshop__save-load-text">{{ saveLoadText }}</span>
            <CelestialStudySaveLoadButton
              v-for="saveslot in 6"
              :key="saveslot"
              :saveslot="saveslot"
            />
          </div>
          <div class="tt-gen-container">
            <span>
              You have {{ totalCelestialTheoremText }}.
            </span>
          </div>
        </div>
      </div>
      <div
        v-if="!minimized"
        class="ttbuttons-row"
        :style="shopBottomRowHeightStyle"
      >
        <CelestialTheoremBuyButton
          :budget="amAmnt"
          :cost="amCost"
          :format-cost="formatAM"
          :action="buyWithAM"
        />
        <CelestialTheoremBuyButton
          :budget="ttAmnt"
          :cost="ttCost"
          :format-cost="formatTT"
          :action="buyWithTT"
        />
        <div class="l-tt-buy-max-vbox">
          <button
            v-if="!minimized"
            class="o-tt-top-row-button c-tt-buy-button c-tt-buy-button--unlocked"
            @click="buyMaxTheorems"
          >
            Buy max
          </button>
        </div>
      </div>
      <div
        v-else
        class="ttbuttons-row ttbuttons-bottom-row-hide"
      />
    </div>
    <button
      v-if="minimizeAvailable"
      class="ttshop-minimize-btn ttshop-background"
      @click="minimize"
    >
      <span
        class="minimize-arrow"
        :style="minimizeArrowStyle"
      >▼</span>
    </button>
  </div>
</template>

<style scoped>
.l-load-tree-area {
  display: flex;
  flex-direction: column;
  width: 50%;
  align-items: left;
}

.l-tree-load-button-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.ttbuttons-bottom-row-hide {
  height: 0;
}

.tt-gen-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.checkbox-margin {
  margin: 0 0.4rem;
}
</style>
