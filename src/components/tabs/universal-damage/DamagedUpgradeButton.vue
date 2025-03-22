<script>
import DescriptionDisplay from "@/components/DescriptionDisplay";
import DualCostDisplay from "@/components/DualCostDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "DamagedUpgradeButton",
  components: {
    PrimaryToggleButton,
    DescriptionDisplay,
    EffectDisplay,
    DualCostDisplay,
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
      mendCount: new Decimal(),
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-damaged-upgrade-btn--useless": this.isUseless,
        "c-damaged-upgrade-btn--bought": this.isBought && !this.isUseless,
        "c-damaged-upgrade-btn--unavailable": !this.isBought && !this.canBeBought && this.isAvailableForPurchase,
      };
    },
    isUseless() {
      return false; //Pelle.disabledRUPGs.includes(this.upgrade.id) && Pelle.isDoomed;
    },
  },
  watch: {
    isAutobuyerOn(newValue) {
      // Autobuyer.realityUpgrade(this.upgrade.id).isActive = newValue;
    }
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAvailableForPurchase = upgrade.isAvailableForPurchase;
      this.canBeBought = upgrade.canBeBought;
      this.isRebuyable = upgrade.isRebuyable;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isAutoUnlocked = false; //Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied || MendingMilestone.seven.isReached;
      // if (this.isRebuyable) this.isAutobuyerOn = Autobuyer.realityUpgrade(upgrade.id).isActive;
      if (this.id < 6) this.mendCount.copyFrom(upgrade.boughtAmount);
    },
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      :class="classObject"
      class="l-damaged-upgrade-btn c-damaged-upgrade-btn"
      @click.shift.exact="toggleLock(upgrade)"
      @click.exact="upgrade.purchase()"
    >
      <HintText
        type="realityUpgrades"
        class="l-hint-text--damaged-upgrade c-hint-text--damaged-upgrade"
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
            class="c-damaged-upgrade-btn__requirement"
          />
        </template>
        <template v-else>
          <EffectDisplay
            :config="config"
            br
          />
          <DualCostDisplay
            v-if="!isBought"
            :config="config"
            br
            name1="Light Credit"
            name2="Dark Credit"
          />
        </template>
        <br>
        <span v-if="isRebuyable">
          <span v-if="mendCount.lte(0)"> Currently Inactive</span>
          <span v-else> Active for the next {{ formatInt(mendCount) }} Mends </span>
        </span>
      </span>
    </button>
    <PrimaryToggleButton
      v-if="isRebuyable && isAutoUnlocked"
      v-model="isAutobuyerOn"
      label="Auto:"
      class="l--spoon-btn-group__little-spoon-damaged-btn o-primary-btn--damaged-upgrade-toggle"
    />
  </div>
</template>

<style scoped>
.l-damaged-upgrade-btn {
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

.c-damaged-upgrade-btn {
  text-align: center;
  font-family: Typewriter, serif;
  font-size: 1rem;
  color: var(--color-laitela--accent);
  background-color: var(--color-background);
  border: var(--var-border-width, 0.2rem) solid var(--color-laitela--accent);
  border-radius: var(--var-border-radius, 0.5rem);
  transition-duration: 0.15s;
  cursor: pointer;
}

.s-base--dark .c-damaged-upgrade-btn {
  color: var(--color-laitela--accent);
}

.c-damaged-upgrade-btn__requirement {
  font-weight: bold;
}

.c-damaged-upgrade-btn:hover {
  color: black;
  background-color: #c0c0c0;
}

.c-damaged-upgrade-btn--unavailable {
  color: black;
  background-color: var(--color-glyph-undo-disabled);
  cursor: default;
}

.c-damaged-upgrade-btn--unavailable:hover {
  color: white;
  background-color: var(--color-glyph-undo-disabled);
}

.c-damaged-upgrade-btn--useless {
  background-color: var(--color-pelle--base);
  border-color: #4a110b;
  filter: grayscale(50%);
  cursor: default;
}

.c-damaged-upgrade-btn--useless:hover {
  color: white;
  background-color: var(--color-pelle--base);
  filter: grayscale(50%);
}

.c-damaged-upgrade-btn--bought {
  color: var(--color-laitela--base);
  background-color: var(--color-laitela--accent);
  border-color: #2e0625;
  cursor: default;
}

.c-damaged-upgrade-btn--bought:hover {
  color: var(--color-laitela--base);
  background-color: var(--color-laitela--accent);
}

.t-dark .c-damaged-upgrade-btn--unavailable {
  color: var(--color-laitela--base);
  background-color: #37474f;
}

.t-s6.c-damaged-upgrade-btn:hover,
.t-s10.c-damaged-upgrade-btn:hover {
  background-color: var(--color-laitela--base);
}

.t-s6.c-damaged-upgrade-btn--unavailable:hover,
.t-s10.c-damaged-upgrade-btn--unavailable:hover {
  color: var(--color-laitela--base);
  background-color: #656565;
}

.t-s6.c-damaged-upgrade-btn--bought,
.t-s10.c-damaged-upgrade-btn--bought {
  background-color: var(--color-laitela--accent);
  border-color: #094e0b;
}

.t-s6.c-damaged-upgrade-btn--bought:hover,
.t-s10.c-damaged-upgrade-btn--bought:hover {
  color: var(--color-laitela--base);
  background-color: var(--color-laitela--accent);
}

.l-hint-text--damaged-upgrade {
  top: -1.7rem;
  font-size: 1.25rem;
}

.c-hint-text--damaged-upgrade {
  font-weight: bold;
  color: var(--color-text);
  text-shadow: none;
}
</style>
