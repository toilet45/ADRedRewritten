<!--<script>
import CostDisplay from "@/components/CostDisplay";

export default {
  name: "CelestialStudyButton",
  components: {
    CostDisplay
  },
  props: {
    setup: {
      type: Object,
      required: true
    },
    showCost: {
      type: Boolean,
      required: false,
      default: true
    },
    specialClick: {
      type: Function,
      required: false,
      default: null,
    }
  },
  data() {
    return {
      isBought: false,
      isAvailableForPurchase: false,
      eternityChallengeRunning: false,
      isCompleteEC: false,
    };
  },
  computed: {
    study() {
      return this.setup.study;
    },
    styleObject() {
      return {
        top: `${this.setup.top}rem`,
        left: `${this.setup.left}rem`
      };
    },
    classObject() {
      return {
        "o-time-study": true,
        "l-time-study": true,
        "o-time-study--small": this.setup.isSmall,
        "o-time-study--unavailable": !this.isAvailableForPurchase && !this.isBought,
        "o-time-study--available": this.isAvailableForPurchase && !this.isBought,
        "o-time-study--bought": this.isBought,
      };
    },
    pathClass() {
      switch (this.study.type) {
        case CELESTIAL_STUDY_TYPE.NORMAL:
          switch (this.setup.path) {
            default: return "o-time-study-normal";
          }
        case CELESTIAL_STUDY_TYPE.ETERNITY_CHALLENGE:
          return "o-time-study-eternity-challenge";
      }
      return "";
    },
    studyClass() {
      let pathClasses = "";
      if (!this.isAvailableForPurchase && !this.isBought) {
        pathClasses += `${this.pathClass}--unavailable`;
      }
      if (this.isAvailableForPurchase && !this.isBought) {
        pathClasses += `${this.pathClass}--available`;
      }
      if (this.isBought) {
        pathClasses += `${this.pathClass}--bought`;
      }
      if (this.isCompleteEC) {
        pathClasses += ` ${this.pathClass}--complete`;
      }
      return pathClasses;
    },
    eternityChallengeAnim() {
      return this.eternityChallengeRunning ? "o-time-study-eternity-challenge--running" : "";
    },
    config() {
      return { ...this.study.config, formatCost: value => (value.gte(1e6) ? format(value) : formatInt(value)) };
    },
    showDefaultCostDisplay() {
      return !this.setup.isSmall && !this.doomedRealityStudy && this.showCost;
    },
    customCostStr() {
      let ttStr;
      if (this.config.cost.lte(1e6)) {
        ttStr = this.setup.isSmall
          ? `${formatInt(this.config.cost)} CT`
          : quantifyInt("Celestial Theorem", this.config.cost);
      } else {
        ttStr = this.setup.isSmall
          ? `${format(this.config.cost)} CT`
          : quantify("Celestial Theorem", this.config.cost);
      }

      const costs = [];
      if (this.config.cost.neq(0)) costs.push(ttStr);
      return costs.join(" + ");
    },
  },
  methods: {
    update() {
      const study = this.study;
      this.isBought = study.isBought;
      this.eternityChallengeRunning = study.type === CELESTIAL_STUDY_TYPE.ETERNITY_CHALLENGE &&
        EternityChallenge.current?.id === study.id;
      if (!this.isBought) {
        this.isAvailableForPurchase = study.canBeBought && study.isAffordable;
      }
      this.isCompleteEC = this.study.type === CELESTIAL_STUDY_TYPE.ETERNITY_CHALLENGE &&
        EternityChallenge(this.study.id).remainingCompletions === 0;
    },
    handleClick() {
      if (this.specialClick === null || !this.study.isBought) this.study.purchase();
      else this.specialClick();
    },
    shiftClick() {
      if (this.study.purchaseUntil) this.study.purchaseUntil();
    }
  }
};

export class CelestialStudySetup {
  constructor(props) {
    this.study = props.study;
    this.row = props.row;
    this.column = props.column;
  }

  setPosition(layout) {
    this.top = layout.itemPosition(this.row);
    const row = layout.rows[this.row];
    this.left = row.itemPosition(this.column, layout);
    this.width = row.layout.itemWidth;
    this.height = row.layout.itemHeight;
  }

  get path() {
    return this.study.path;
  }
}
</script>

<template>
  <button
    :class="[classObject, studyClass, eternityChallengeAnim]"
    :style="styleObject"
    @click.exact="handleClick"
    @click.shift.exact="shiftClick"
  >
    <slot />
    <CostDisplay
      v-if="showDefaultCostDisplay"
      br
      :config="config"
      name="Celestial Theorem"
    />
    <div v-else-if="!doomedRealityStudy && !isDisabledByEnslaved">
      Cost: {{ customCostStr }}
    </div>
  </button>
</template>

<style scoped>

</style>
-->