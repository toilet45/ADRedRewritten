<script>
import { isDecimal, isFunction, isNumber } from "@/utility";

/* eslint-disable no-empty-function */
export default {
  name: "DualCostDisplay",
  props: {
    config: {
      type: Object,
      required: false,
      default: undefined
    },
    br: {
      type: Boolean,
      required: false
    },
    name1: {
      type: String,
      required: true
    },
    name2: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: "Cost:",
      required: false
    }
  },
  data() {
    return {
      isVisible: false,
      costs: [0, 0],
      placesUnder1000: 2,
      places: 2,
      displayFirst: false,
      displaySecond: false,
      displayFree: false
    };
  },
  watch: {
    config: {
      immediate: true,
      handler(config) {
        this.updateFunction = () => { };
        const costs = config?.costs;
        this.isVisible = costs !== undefined;
        if (!this.isVisible) return;
        this.formatCosts = config.formatCosts ?? format;

        this.places = config.places ?? 2;
        this.placesUnder1000 = config.placesUnder1000 ?? 0;

        if (isNumber(costs)) {
          this.costs = costs;
          return;
        }

        if (isDecimal(costs)) {
          this.costs = Decimal.fromDecimal(costs);
          return;
        }

        if (!isFunction(costs)) {
          throw new Error(`CostDisplay config.cost has unsupported type "${typeof costs}"`);
        }

        const value = costs();

        if (isNumber(value[0])) {
          this.costs = value;
          this.updateFunction = () => this.costs = costs();
          return;
        }

        if (isDecimal(value[0])) {
          this.costs = [Decimal.fromDecimal(value[0]), Decimal.fromDecimal(value[1])];
          this.updateFunction = () => this.costs = costs();
          return;
        }

        this.displayFirst = new Decimal(value[1]).eq(0);
        this.displaySecond = new Decimal(value[0]).eq(0);
        this.displayFree = this.displayFirst && this.displaySecond;

        throw new Error(`DualCostDisplay config.costs is a function which returns` +
          ` unsupported type "${typeof value}"`);

      }
    }
  },
  beforeCreate() {
    this.updateFunction = () => { };
  },
  methods: {
    update() {
      this.updateFunction();
    },
    quantify
  }
};
</script>

<template>
  <span v-if="isVisible">
    <br v-if="br">
    <span v-if="displayFree"> {{ label }} FREE</span>
    <span v-else-if="displayFirst"> {{ label }} {{ quantify(name1, costs[0], places, placesUnder1000, formatCosts) }} </span>
    <span v-else-if="displaySecond"> {{ label }} {{ quantify(name2, costs[1], places, placesUnder1000, formatCosts) }} </span>
    <span v-else> {{ label }} {{ quantify(name1, costs[0], places, placesUnder1000, formatCosts) }} and {{ quantify(name2, costs[1], places, placesUnder1000, formatCosts) }} </span>
  </span>
</template>
