<!-- eslint-disable no-inline-comments -->
<!-- eslint-disable line-comment-position -->
<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "TimeExpansionUpgradeButton",
  components: {
    PrimaryToggleButton,
    DescriptionDisplay,
    EffectDisplay,
    CostDisplay,
    HintText
  },
  props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isAvailableForPurchase: false,
      canBeBought: false,
      isRebuyable: false,
      isBought: false,
      isPossible: false,
      isAutoUnlocked: false,
      isAutobuyerOn: false,
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-expansion-upgrade-btn--useless": this.isUseless,
        "c-expansion-upgrade-btn--bought": this.isBought && !this.isUseless,
        "c-expansion-upgrade-btn--unavailable": !this.isBought && !this.canBeBought && this.isAvailableForPurchase,
        "c-expansion-upgrade-btn--possible": !this.isAvailableForPurchase && this.isPossible,
        "c-expansion-upgrade-btn--locked": !this.isAvailableForPurchase && !this.isPossible,
      };
    },
    requirementConfig() {
      return {
        description: this.config.requirement
      };
    },
    isUseless() {
      return false; // Pelle.disabledRUPGs.includes(this.upgrade.id) && Pelle.isDoomed;
    },
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.realityUpgrade(this.upgrade.id).isActive = newValue;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAvailableForPurchase = upgrade.isAvailableForPurchase;
      this.canBeBought = upgrade.canBeBought;
      this.isRebuyable = upgrade.isRebuyable;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isPossible = upgrade.isPossible;
      this.isAutoUnlocked = false; // Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied;
      if (this.isRebuyable) this.isAutobuyerOn = false;// Autobuyer.realityUpgrade(upgrade.id).isActive;
    },
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      :class="classObject"
      class="l-expansion-upgrade-btn c-expansion-upgrade-btn"
      @click.shift.exact="toggleLock(upgrade)"
      @click.exact="upgrade.purchase()"
    >
      <HintText
        type="realityUpgrades"
        class="l-hint-text--reality-upgrade c-hint-text--reality-upgrade"
      >
        {{ config.name }}
      </HintText>
      <span :class="{ 'o-pelle-disabled': isUseless }">
        <DescriptionDisplay :config="config" />
        <template v-if="($viewModel.shiftDown === isAvailableForPurchase) && !isRebuyable">
          <br>
          <DescriptionDisplay
            :config="requirementConfig"
            label="Requirement:"
            class="c-expansion-upgrade-btn__requirement"
          />
        </template>
        <template v-else>
          <EffectDisplay
            :config="config"
            br
          />
          <CostDisplay
            v-if="!isBought"
            :config="config"
            br
            name="Time Remnant"
          />
        </template>
      </span>
    </button>
    <PrimaryToggleButton
      v-if="isRebuyable && isAutoUnlocked"
      v-model="isAutobuyerOn"
      label="Auto:"
      class="l--spoon-btn-group__little-spoon-reality-btn o-primary-btn--reality-upgrade-toggle"
    />
  </div>
</template>

<style scoped>
.l-reality-upgrade-grid {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  margin-top: 1.2rem;
}

.l-reality-upgrade-grid__row {
  display: flex;
  flex-direction: row;
}

.l-expansion-upgrade-btn {
  display: flex;
  flex-direction: column;
  width: 20.5rem;
  height: 10rem;
  position: relative;
  justify-content: center;
  align-items: center;
  margin: 1.2rem;
  padding: 0 0.5rem;
}

.c-expansion-upgrade-btn {
  text-align: center;
  font-family: Typewriter, serif;
  font-size: 1rem;
  color: var(--color-effarig--base);
  background-color: var(--color-background);
  border: var(--var-border-width, 0.2rem) solid var(--color-effarig--base);
  border-radius: var(--var-border-radius, 0.5rem);
  transition-duration: 0.15s;
  cursor: pointer;
}

.s-base--dark .c-expansion-upgrade-btn {
  color: var(--color-v--base);
}

.c-expansion-upgrade-btn__requirement {
  font-weight: bold;
}

.c-expansion-upgrade-btn:hover {
  color: black;
  background-color: var(--color-v--base);
}

.c-expansion-upgrade-btn--unavailable {
  color: var(--color-v--base);
  background-color: var(--color-glyph-undo-disabled);
  cursor: default;
}

.c-expansion-upgrade-btn--unavailable:hover {
  color: var(--color-v--base);
  background-color: var(--color-glyph-undo-disabled);
}

.c-expansion-upgrade-btn--useless {
  background-color: var(--color-pelle--base);
  border-color: #4a110b;
  filter: grayscale(50%);
  cursor: default;
}

.c-expansion-upgrade-btn--useless:hover {
  color: var(--color-v--base);
  background-color: var(--color-pelle--base);
  filter: grayscale(50%);
}

.c-expansion-upgrade-btn--bought {
  color: var(--color-v--base);
  background-color: var(--color-enslaved--base);
  border-color: #094e0b;
  cursor: default;
}

.c-expansion-upgrade-btn--bought:hover {
  color: var(--color-v--base);
  background-color: var(--color-enslaved--base);
}

.c-expansion-upgrade-btn--possible {
  /* Text color gets inherited from other pseudo-classes; so we use !important here in order to ensure good contrast
    specifically on reality and imaginary upgrades, the only upgrades which use this and the related --locked below */
  color: black !important;
  background:
    repeating-linear-gradient(
      -45deg,
      #A2A229,
      #A2A229 3rem,
      #919122 3rem,
      #919122 6rem
    );
  cursor: default;
}

.c-expansion-upgrade-btn--possible:hover {
  /* This is actually a solid color, but it flickers on hover if we don't make it a linear-gradient */
  background: linear-gradient(0deg, #919122, #919122);
}

.c-expansion-upgrade-btn--locked {
  color: white !important;
  background: #952020;
  background-image:
    linear-gradient(45deg, #802222 25%, transparent 25%),
    linear-gradient(135deg, #802222 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #802222 75%),
    linear-gradient(135deg, transparent 75%, #802222 75%);
  background-position: 0 0, 2rem 0, 2rem -2rem, 0 2rem;
  background-size: 4rem 4rem;
  cursor: default;
}

.c-expansion-upgrade-btn--locked:hover {
  background-color: #802222;
}

.o-requirement-lock {
  position: absolute;
  font-size: 5rem;
  padding: 0.5rem 1.8rem;
  color: black;
  opacity: 0.4;
  user-select: none;
  pointer-events: none;
}

.c-expansion-upgrade-btn--black-hole-unlock {
  text-shadow: -0.1rem 0.1rem 0.3rem var(--color-v--base);
  margin: auto;
}

.t-dark .c-expansion-upgrade-btn--unavailable {
  color: var(--color-enslaved--base);
  background-color: #37474f;
}

.t-s6.c-expansion-upgrade-btn:hover,
.t-s10.c-expansion-upgrade-btn:hover {
  background-color: var(--color-v--base);
}

.t-s6.c-expansion-upgrade-btn--unavailable:hover,
.t-s10.c-expansion-upgrade-btn--unavailable:hover {
  color: var(--color-v--base);
  background-color: #656565;
}

.t-s6.c-expansion-upgrade-btn--bought,
.t-s10.c-expansion-upgrade-btn--bought {
  background-color: var(--color-enslaved--base);
  border-color: #094e0b;
}

.t-s6.c-expansion-upgrade-btn--bought:hover,
.t-s10.c-expansion-upgrade-btn--bought:hover {
  color: var(--color-v--base);
  background-color: var(--color-enslaved--base);
}
</style>
