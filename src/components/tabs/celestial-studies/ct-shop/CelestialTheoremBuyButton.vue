<script>
export default {
  props: {
    budget: Decimal,
    cost: Decimal,
    formatCost: {
      type: Function,
      required: true,
    },
    action: {
      type: Function,
      required: true
    },
  },
  data() {
    return {
      isLocked: false
    };
  },
  computed: {
    isEnabled() {
      if (this.isLocked) return false;
      return this.budget.gte(this.cost);
    },
    enabledClass() {
      if (!this.isEnabled || this.isLocked) return "c-tt-buy-button--locked";

      return "c-tt-buy-button--unlocked";
    }
  },
  methods: {
    update() {
      this.isLocked = Ra.pets.v.level < 75;
    }
  }
};
</script>

<template>
  <button
    class="l-ct-buy-button c-ct-buy-button"
    :class="enabledClass"
    @click="action"
  >
    {{ isLocked ? `Requires V level ${formatInt(75)} to unlock` : formatCost(cost) }}
  </button>
</template>