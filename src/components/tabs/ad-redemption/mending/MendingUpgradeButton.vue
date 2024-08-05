<script>
import CostDisplay from "@/components/CostDisplay";
import DescriptionDisplay from "@/components/DescriptionDisplay";
import EffectDisplay from "@/components/EffectDisplay";
import HintText from "@/components/HintText";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "MendingUpgradeButton",
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
      //isAutoUnlocked: false,
      //isAutobuyerOn: false,
      //canBeLocked: false,
      //hasRequirementLock: false,
    };
  },
  computed: {
    config() {
      return this.upgrade.config;
    },
    classObject() {
      return {
        "c-mend-upgrade-btn--useless": this.isUseless,
        "c-mend-upgrade-btn--bought": this.isBought && !this.isUseless,
        "c-mend-upgrade-btn--unavailable": !this.isBought && !this.canBeBought && this.isAvailableForPurchase,
        "c-mend-upgrade-btn--possible": !this.isAvailableForPurchase && this.isPossible,
        "c-mend-upgrade-btn--locked": !this.isAvailableForPurchase && !this.isPossible,
      };
    },
    requirementConfig() {
      return {
        description: this.config.requirement
      };
    },
    canLock() {
      return this.config.canLock && !(this.isAvailableForPurchase || this.isBought);
    },
    isUseless() {
      return false;//Pelle.disabledRUPGs.includes(this.upgrade.id) && Pelle.isDoomed;
    },
  },
  watch: {
    /*isAutobuyerOn(newValue) {
      Autobuyer.realityUpgrade(this.upgrade.id).isActive = newValue;
    }*/
  },
  methods: {
    update() {
      const upgrade = this.upgrade;
      this.isAvailableForPurchase = upgrade.isAvailableForPurchase;
      this.canBeBought = upgrade.canBeBought;
      this.isRebuyable = upgrade.isRebuyable;
      this.isBought = !upgrade.isRebuyable && upgrade.isBought;
      this.isPossible = upgrade.isPossible;
      //this.isAutoUnlocked = Ra.unlocks.instantECAndRealityUpgradeAutobuyers.canBeApplied;
      //this.canBeLocked = upgrade.config.canLock && !this.isAvailableForPurchase;
      //this.hasRequirementLock = upgrade.hasPlayerLock;
      //if (this.isRebuyable) this.isAutobuyerOn = Autobuyer.realityUpgrade(upgrade.id).isActive;
    },
    /*toggleLock(upgrade) {
      if (this.isRebuyable) return;
      upgrade.toggleMechanicLock();
    }*/
  }
};
</script>

<template>
  <div class="l-spoon-btn-group">
    <button
      :class="classObject"
      class="l-mend-upgrade-btn c-mend-upgrade-btn"
      @click.exact="upgrade.purchase()"
    >
      <HintText
        type="realityUpgrades"
        class="l-hint-text--mend-upgrade c-hint-text--mend-upgrade"
      >
        {{ config.name }}
      </HintText>
      <span :class="{ 'o-pelle-disabled': isUseless }">
        <DescriptionDisplay :config="config" />
        <template v-if="($viewModel.shiftDown === isAvailableForPurchase) && !isRebuyable">
          <br>
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
            name="Multiversal Remain"
          />
        </template>
      </span>
    </button>
  </div>
</template>

<style scoped>
.l-mend-upgrade-btn {
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

.c-mend-upgrade-btn {
  text-align: center;
  font-family: Typewriter, serif;
  font-size: 1rem;
  color: var(--color-mending-dark);
  background-color: var(--color-background);
  border: var(--var-border-width, 0.2rem) solid var(--color-mending-dark);
  border-radius: var(--var-border-radius, 0.5rem);
  transition-duration: 0.15s;
  cursor: pointer;
}

.s-base--dark .c-mend-upgrade-btn {
  color: var(--color-mending-light);
}

.c-mend-upgrade-btn__requirement {
  font-weight: bold;
}

.c-mend-upgrade-btn:hover {
  color: black;
  background-color: var(--color-mending-light);
}

.c-mend-upgrade-btn--unavailable {
  color: var(--color-mending-light);
  background-color: var(--color-glyph-undo-disabled);
  cursor: default;
}

.c-mend-upgrade-btn--unavailable:hover {
  color: var(--color-mending-light);
  background-color: var(--color-glyph-undo-disabled);
}

.c-mend-upgrade-btn--useless {
  background-color: var(--color-pelle--base);
  border-color: #4a110b;
  filter: grayscale(50%);
  cursor: default;
}

.c-mend-upgrade-btn--useless:hover {
  color: var(--color-mending-light);
  background-color: var(--color-pelle--base);
  filter: grayscale(50%);
}

.c-mend-upgrade-btn--bought {
  color: var(--color-mending-light);
  background-color: var(--color-mending);
  border-color: #2e0625;
  cursor: default;
}

.c-mend-upgrade-btn--bought:hover {
  color: var(--color-mending-light);
  background-color: var(--color-mending);
}

.t-dark .c-mend-upgrade-btn--unavailable {
  color: var(--color-mending-light);
  background-color: #37474f;
}

.t-s6.c-mend-upgrade-btn:hover,
.t-s10.c-mend-upgrade-btn:hover {
  background-color: var(--color-mending-light);
}

.t-s6.c-mend-upgrade-btn--unavailable:hover,
.t-s10.c-mend-upgrade-btn--unavailable:hover {
  color: var(--color-mending-light);
  background-color: #656565;
}

.t-s6.c-mend-upgrade-btn--bought,
.t-s10.c-mend-upgrade-btn--bought {
  background-color: var(--color-mending);
  border-color: #094e0b;
}

.t-s6.c-mend-upgrade-btn--bought:hover,
.t-s10.c-mend-upgrade-btn--bought:hover {
  color: var(--color-mending-light);
  background-color: var(--color-mending);
}

.l-hint-text--mend-upgrade {
  top: -1.7rem;
  font-size: 1.25rem;
}

.c-hint-text--mend-upgrade {
  font-weight: bold;
  color: var(--color-text);
  text-shadow: none;
}
</style>
