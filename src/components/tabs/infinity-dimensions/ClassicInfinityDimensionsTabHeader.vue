<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "ClassicInfinityDimensionsTabHeader",
  components: {
    PrimaryButton
  },
  data() {
    return {
      isSacrificeUnlocked: false,
      isSacrificeAffordable: false,
      currentSacrifice: new Decimal(0),
      sacrificeBoost: new Decimal(0),
      disabledCondition: "",
    };
  },
  computed: {
    sacrificeTooltip() {
      return `Providing a ${formatPow(this.sacrificeBoost, 3, 3)} power effect to all Infinity Dimensions`;
    },
  },
  methods: {
    update() {
      const isSacrificeUnlocked = IDSacrifice.isVisible;
      this.isSacrificeUnlocked = isSacrificeUnlocked;
      if (!isSacrificeUnlocked) return;
      this.isSacrificeAffordable = IDSacrifice.canSacrifice;
      this.currentSacrifice.copyFrom(IDSacrifice.totalBoost);
      this.sacrificeBoost.copyFrom(IDSacrifice.nextBoost);
      this.disabledCondition = IDSacrifice.disabledCondition;
    },
    sacrifice() {
      IDsacrificeBtnClick();
    },
    maxAll() {
      maxAll();
    }
  }
};
</script>

<template>
  <div class="l-infinity-dim-tab__header">
    <PrimaryButton
      v-show="isSacrificeUnlocked"
      v-tooltip="sacrificeTooltip"
      :enabled="isSacrificeAffordable"
      class="o-primary-btn--sacrifice"
      @click="sacrifice"
    >
      <span v-if="isSacrificeAffordable">
        Dimensional Sacrifice ({{ formatX(sacrificeBoost, 2, 2) }})
      </span>
      <span v-else>
        Dimensional Sacrifice Disabled ({{ disabledCondition }})
      </span>
    </PrimaryButton>
  </div>
</template>
