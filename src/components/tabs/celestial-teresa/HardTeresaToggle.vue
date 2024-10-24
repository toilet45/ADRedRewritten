<script>
export default {
  name: "HardTeresaToggle",
  data() {
    return {
      isInTeresa: false,
      isEnabled: false
    };
  },
  computed: {
    icon() {
      return "fas fa-trophy";
    },
    celModeClass() {
      if (!this.isEnabled) {
        return {
          "o-cel-modes-toggle__label": true,
          "o-cel-modes-toggle__label--active-paused": this.isEnabled,
          "o-cel-modes-toggle__label--deactive-paused": !this.isEnabled,
          "o-cel-modes-toggle__label--disabled": !this.isEnabled,
          ".o-temp__label": true
        };
      }
      return {
        "o-cel-modes-toggle__label": true,
        "o-cel-modes-toggle__label--active": this.isInTeresa,
        "o-cel-modes-toggle__label--disabled": !this.isEnabled,
        ".o-temp__label": true
      };
    },
  },
  methods: {
    update() {
      this.isInTeresa = Teresa.isRunning;
      this.isEnabled = Teresa.hardModeToggled;
    },
    emitClick() {
      if (!Teresa.isRunning) {
        player.celestials.teresa.hard.toggled = !player.celestials.teresa.hard.toggled;
      }
    }
  }
};
</script>

<template>
  <div
    class="l-cel-mode"
    @click="emitClick"
  >
    <label :class="celModeClass">
      <span :class="icon" />
    </label>
  </div>
</template>

<style scoped>
.o-temp__label {
  display: flex;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  color: black;
  background: var(--color-gh-purple);
  border: var(--var-border-width, 0.2rem) solid #383232;
  border-top-right-radius: var(--var-border-radius, 0.3rem);
  border-bottom-left-radius: var(--var-border-radius, 1rem);
  transition-duration: 0.2s;
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
}
</style>

