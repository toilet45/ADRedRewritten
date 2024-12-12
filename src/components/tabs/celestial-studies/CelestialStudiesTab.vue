<script>
import ECCelestialStudy from "./ECcelStudy";
import NormalCelestialStudy from "./NormalCelestialStudy";
import PrimaryButton from "@/components/PrimaryButton";
import CelestialStudyConnection from "./CelestialStudyConnection";
import CelestialStudyTreeLayout from "./celestial-study-tree-layout";

export default {
  name: "CelestialStudiesTab",
  components: {
    PrimaryButton,
    NormalCelestialStudy,
    ECCelestialStudy,
    CelestialStudyConnection,
  },
  data() {
    return {
      respec: player.celRespec,
      layoutType: {},
      renderedStudyCount: 0,
      renderedConnectionCount: 0,
      isEnslaved: false,
      delayTimer: 0,
    };
  },
  computed: {
    layout() {
      return CelestialStudyTreeLayout.create(this.layoutType);
    },
    allStudies() {
      return this.layout.studies;
    },
    studies() {
      return this.allStudies.slice(0, this.renderedStudyCount);
    },
    allConnections() {
      return this.layout.connections;
    },
    connections() {
      return this.allConnections.slice(0, this.renderedConnectionCount);
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
    respec(newValue) {
      player.respec = newValue;
    },
  },
  created() {
    const incrementRenderedCount = () => {
      let shouldRequestNextFrame = false;
      if (this.renderedStudyCount < this.allStudies.length) {
        this.renderedStudyCount += 2;
        shouldRequestNextFrame = true;
      }
      if (this.renderedConnectionCount < this.allConnections.length) {
        this.renderedConnectionCount += 2;
        shouldRequestNextFrame = true;
      }
      if (shouldRequestNextFrame) {
        this.renderAnimationId = requestAnimationFrame(incrementRenderedCount);
      }
    };
    incrementRenderedCount();

    // CSS controlling the fade in/out for the Enslaved study is an animation happening over the course of 1 second.
    // Removing it normally via key-switching ends up getting rid of it immediately without animating, which we do if it
    // wasn't purchased - otherwise it animates to the unbought state and then remove it after the animation finishes.
    this.on$(GAME_EVENT.REALITY_RESET_AFTER, () => {
      this.delayTimer = player.celestials.enslaved.hasSecretStudy
        ? Date.now()
        : 0;
    });

    // Scroll to top because celestial studies tab is rendered progressively
    // and we don't want the player to see empty space while it's loading.
    document.body.scrollTop = 0;
  },
  beforeDestroy() {
    cancelAnimationFrame(this.renderAnimationId);
  },
  methods: {
    update() {
      this.respec = player.celRespec;
      this.layoutType = CelestialStudyTreeLayout.current;
    },
    studyComponent(study) {
      switch (study.type) {
        case CELESTIAL_STUDY_TYPE.NORMAL: return NormalCelestialStudy;
        case CELESTIAL_STUDY_TYPE.ETERNITY_CHALLENGE: return ECCelestialStudy;
      }
      throw "Unknown Celestial Study type";
    },
    exportStudyTree() {
      if (player.timestudy.studies.length === 0) {
        GameUI.notify.error("You cannot export an empty Celestial Study Tree!");
      } else {
        copyToClipboard(GameCache.currentStudyTree.value.exportString);
        GameUI.notify.info("Exported current Celestial Studies to your clipboard");
      }
    }
  }
};
</script>

<template>
  <div class="l-time-studies-tab">
    <div class="c-subtab-option-container">
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        @click="exportStudyTree"
      >
        Export tree
      </PrimaryButton>
      <PrimaryButton
        :class="respecClassObject"
        @click="respec = !respec"
      >
        Respec Celestial Studies on next Reality
      </PrimaryButton>
      <PrimaryButton
        class="o-primary-btn--subtab-option"
        onclick="Modal.studyString.show({ id: -1 })"
      >
        Import tree
      </PrimaryButton>
    </div>
    <div
      class="l-time-study-tree l-time-studies-tab__tree"
      :style="treeStyleObject"
    >
      <component
        :is="studyComponent(setup.study)"
        v-for="(setup) in studies"
        :key="setup.study.type.toString() + setup.study.id.toString()"
        :setup="setup"
      />
      <svg
        :style="treeStyleObject"
        class="l-time-study-connection"
      >
        <CelestialStudyConnection
          v-for="(setup, index) in connections"
          :key="'connection' + index"
          :setup="setup"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>

</style>