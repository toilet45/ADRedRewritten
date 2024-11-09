<!--<script>
import { ForceBoughtState } from "./StudyStringPreview";

export default {
  name: "PseudoCelestialStudyConnection",
  props: {
    setup: {
      type: Object,
      required: true
    },
    forceIsBought: {
      type: Number,
      default: 1
    },
  },
  data() {
    return {
      isOverridden: false,
      isBought: false
    };
  },
  computed: {
    classObject() {
      const classObject = {
        "o-time-study-connection": true,
        "o-time-study-connection--bought": this.isBought,
      };
      let pathClass;
      const connection = this.setup.connection;
      const from = connection.from;
      const to = connection.to;
      function pathClassOf(study) {
        switch (study.path) {
          default: return undefined;
        }
      }
      switch (to.type) {
        case CELESTIAL_STUDY_TYPE.NORMAL:
          pathClass = pathClassOf(to) || pathClassOf(from);
          break;
        case CELESTIAL_STUDY_TYPE.ETERNITY_CHALLENGE:
          pathClass = "o-time-study-connection--eternity-challenge";
          break;
      }

      if (pathClass !== undefined) {
        classObject[pathClass] = true;
      }
      return classObject;
    }
  },
  methods: {
    update() {
      this.isOverridden = this.setup.connection.isOverridden;
      this.isBought = ForceBoughtState.getState(this.forceIsBought, this.setup.isBought);
    },
    percents(value) {
      return `${value * 100}%`;
    }
  }
};
</script>

<template>
  <line
    v-if="!isOverridden"
    :x1="percents(setup.x1)"
    :y1="percents(setup.y1)"
    :x2="percents(setup.x2)"
    :y2="percents(setup.y2)"
    :class="classObject"
  />
</template>

<style scoped>
.o-time-study-connection {
  /* This one should be px, because it rem svg behaves weirdly under scale */
  stroke-width: 2px;
}
</style>
