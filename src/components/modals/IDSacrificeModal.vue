<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "IDSacrificeModal",
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
      return `Infinite Sacrifice will give you a power effect to all Infinity Dimensions based on the amount of
          1st Infinity Dimensions you had at the time of Sacrificing. It will take ${formatInt(10)} minutes (real time)
          in order for Infinity Dimension production to regain its full power.`;
    },
    multiplierText() {
      return `Multiplier is currently ${formatPow(this.currentMultiplier, 3, 3)} and will increase to
        ${formatPow(this.nextMultiplier, 3, 3)} on Infinite Sacrifice.`;
    },
  },
  methods: {
    update() {
      this.currentMultiplier.copyFrom(IDSacrifice.totalBoost);
      this.nextMultiplier.copyFrom(IDSacrifice.nextBoost);
    },
    handleYesClick() {
      IDsacrificeReset();
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
      Dimensional Sacrifice
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
