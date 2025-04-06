<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "TDSacrificeModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      currentMultiplier: new Decimal(),
      nextMultiplier: new Decimal(),
    };
  },
  computed: {
    message() {
      return `Eternal Sacrifice will give you a power effect to all Time Dimensions based on the amount of
          1st Time Dimensions you had at the time of Sacrificing. It will take ${formatInt(30)} minutes (real time)
          in order for Time Dimension production to regain its full power.`;
    },
    multiplierText() {
      return `Multiplier is currently ${formatPow(this.currentMultiplier, 3, 3)} and will increase to
        ${formatPow(this.nextMultiplier, 3, 3)} on Eternal Sacrifice.`;
    },
  },
  methods: {
    update() {
      this.currentMultiplier.copyFrom(TDSacrifice.totalBoost);
      this.nextMultiplier.copyFrom(TDSacrifice.nextBoost);
    },
    handleYesClick() {
      TDsacrificeReset();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    option="sacrifice"
    @confirm="handleYesClick"
  >
    <template #header>
      Eternal Sacrifice
    </template>
    <div class="c-modal-message__text">
      {{ message }}
    </div>
    <br>
    <div class="c-modal-message__text">
      {{ multiplierText }}
      <br>
    </div>
  </ModalWrapperChoice>
</template>
