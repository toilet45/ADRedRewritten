<!--<script>
import PseudoCelestialStudyButton from "./PseudoCelestialStudyButton";
import PseudoCelestialStudyConnection from "./PseudoCelestialStudyConnection";
import CelestialStudyTreeLayout from "@/components/tabs/celestial-studies/celestial-study-tree-layout";

export const ForceBoughtState = {
  notBought: 0,
  unspecified: 1,
  bought: 2,

  getState(forceState, currentState) {
    switch (forceState) {
      case this.notBought:
        return false;
      case this.unspecified:
        return currentState;
      case this.bought:
        return true;
    }
    return currentState;
  }
};

export default {
  name: "CelestialStudiesTab",
  components: {
    PseudoCelestialStudyButton,
    PseudoCelestialStudyConnection,
  },
  props: {
    disregardCurrentStudies: {
      type: Boolean,
      default: false
    },
    newStudies: {
      required: true,
      validator: newStudies => Array.isArray(newStudies) || newStudies === undefined,
    },
    showPreview: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      layoutType: {},
      vLevel: 0,
      renderedStudyCount: 0,
      isEnslaved: false,
      delayTimer: 0,
    };
  },
  computed: {
    layout() {
      return CelestialStudyTreeLayout.create(this.layoutType, 0.15);
    },
    studies() {
      return this.layout.studies;
    },
    connections() {
      return this.layout.connections;
    },
    treeStyleObject() {
      return {
        width: `${this.layout.width}rem`,
        height: `${this.layout.height}rem`
      };
    },
    respecClassObject() {
      return {
        "o-primary-btn--subtab-option": true,
        "o-primary-btn--respec-active": this.respec
      };
    }
  },
  watch: {
    vLevel() {
      // When vLevel changes, we recompute the study tree because of triad studies
      this.$recompute("layout");
    }
  },
  methods: {
    update() {
      this.layoutType = CelestialStudyTreeLayout.current;
    },
    studyComponent(study) {
      switch (study.type) {
        case CELESTIAL_STUDY_TYPE.NORMAL: return NormalCelestialStudy;
        case CELESTIAL_STUDY_TYPE.ETERNITY_CHALLENGE: return ECCelestialStudy;
      }
      throw "Unknown Time Study type";
    },
    studyString(study) {
      switch (study.type) {
        case CELESTIAL_STUDY_TYPE.NORMAL: return `${study.id}`;
        case CELESTIAL_STUDY_TYPE.ETERNITY_CHALLENGE: return `EC${study.id}`;
      }
      return "fuck";
    },
    getStudyForceBoughtState(studyStr) {
      if (!this.disregardCurrentStudies) return ForceBoughtState.unspecified;
      return this.newStudies.includes(studyStr) ? ForceBoughtState.bought : ForceBoughtState.notBought;
    },
    getConnectionForceBoughtState(setup) {
      if (!this.disregardCurrentStudies) return ForceBoughtState.unspecified;
      return (this.newStudies.includes(this.studyString(setup.connection.to)) &&
        this.newStudies.includes(this.studyString(setup.connection.from)))
        ? ForceBoughtState.bought
        : ForceBoughtState.notBought;
    }
  }
};
</script>

<template>
  <div class="l-study-string-preview__tree--wrapper">
    <div
      v-if="showPreview"
      class="l-time-study-tree l-study-string-preview__tree"
      :style="treeStyleObject"
    >
      <PseudoCelestialStudyButton
        v-for="setup in studies"
        :key="setup.study.type.toString() + setup.study.id.toString()"
        :setup="setup"
        :force-is-bought="getStudyForceBoughtState(studyString(setup.study))"
        :is-new-from-import="!disregardCurrentStudies && newStudies.includes(studyString(setup.study))"
      />
      <svg
        :style="treeStyleObject"
        class="l-time-study-connection"
      >
        <PseudoCelestialStudyConnection
          v-for="(setup, index) in connections"
          :key="'connection' + index"
          :force-is-bought="getConnectionForceBoughtState(setup)"
          :setup="setup"
        />
      </svg>
    </div>
    <span
      v-else
      class="c-unavailable-warning"
    >
      Preview Unavailable
    </span>
  </div>
</template>

<style scoped>
.l-study-string-preview__tree--wrapper {
  display: flex;
  overflow-y: auto;
  width: 20rem;
  height: 44.5rem;
  position: relative;
  justify-content: center;
  border: var(--color-text) solid var(--var-border-width, 0.3rem);
  border-radius: var(--var-border-radius, 0.3rem);
  margin: auto;
  padding: 0.5rem;
}

.c-unavailable-warning {
  align-self: center;
}
</style>
