<script>
export default {
  name: "WarpRealityButton",
  data() {
    return {
      isBroken: false,
      isUnlocked: false,
      isEnslaved: false,
    };
  },
  computed: {
    classObject() {
      return {
        "o-infinity-upgrade-btn": true,
        "o-infinity-upgrade-btn--color-2": true,
        "o-infinity-upgrade-btn--available": this.isUnlocked,
        "o-infinity-upgrade-btn--unavailable": !this.isUnlocked,
        "o-infinity-upgrade-btn--unclickable": this.isBroken,
      };
    },
    tooltip() {
      return undefined;
    },
    text() {
      return this.isBroken ? "REALITY IS WARPED" : "WARP REALITY";
    }
  },
  methods: {
    update() {
      this.isBroken = player.reality.warped;
      this.isUnlocked = MendingUpgrade(20).isBought;
    },
    clicked() {
      if (this.isBroken) return;
      Modal.warpReality.show();
    }
  }
};
</script>

<template>
  <button
    v-tooltip="tooltip"
    :class="classObject"
    @click="clicked"
  >
    {{ text }}
  </button>
</template>

<style scoped>

</style>
