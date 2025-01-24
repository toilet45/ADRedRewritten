<script>
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
          switch (this.study.id) {
            case 31:
            case 32:
            case 151:
            case 152:
              return "o-split1-study-normal";
            case 41:
            case 42:
              return "o-split2-study-normal";
            case 43:
            case 44:
              return "o-split3-study-normal";
            case 91:
            case 92:
            case 93:
            case 131:
            case 132:
              return "o-split4-study-normal";
            default:
              return "o-time-study-normal";
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
      return { ...this.study.config, formatCost: value => (value.gte(1e6) ? format(value, 0, 0) : formatInt(value)),
        places: 0, placesUnder1000: 0 };
    },
    showDefaultCostDisplay() {
      return !this.setup.isSmall && !this.doomedRealityStudy && this.showCost;
    },
    customCostStr() {
      let ttStr;
      if (this.config.cost.lte(1e6)) {
        ttStr = this.setup.isSmall
          ? `${formatInt(this.config.cost, 0, 0)} CT`
          : quantifyInt("Celestial Theorem", this.config.cost, 0, 0);
      } else {
        ttStr = this.setup.isSmall
          ? `${format(this.config.cost, 0, 0)} CT`
          : quantify("Celestial Theorem", this.config.cost, 0, 0);
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
.o-time-study {
  width: 18rem;
  height: 10rem;
  font-family: Typewriter, serif;
  font-size: 1rem;
  font-weight: bold;
  background-color: black;
  border: 0.1rem solid;
  border-radius: var(--var-border-radius, 0.4rem);
  transition-duration: 0.2s;
}

.o-time-study--available {
  animation: a-time-study 7s infinite;
  cursor: pointer;
}

.o-time-study--available:hover {
  background-color: #00bcd4;
  animation: none;
}

.o-time-study--unavailable {
  color: black;
}

.o-time-study--unavailable:hover {
  background-color: var(--color-bad);
}

.t-metro .o-time-study--unavailable,
.t-inverted-metro .o-time-study--unavailable,
.t-s1 .o-time-study--unavailable,
.t-s8 .o-time-study--unavailable {
  box-shadow: 0.1rem 0.1rem 0.1rem 0 black;
}

.s-base--metro .o-time-study--unavailable,
.t-s1 .o-time-study--unavailable {
  color: black;
  border: none;
}

@keyframes a-time-study {
  0% { box-shadow: inset 0 0 0.3rem 0; }
  50% { box-shadow: inset 0 0 2rem 0; }
  100% { box-shadow: inset 0 0 0.3rem 0; }
}

.o-time-study--small {
  width: 12rem;
  font-size: 0.85rem;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
}

.o-time-study-normal--available {
  color: var(--color-teresa--base);
  border-color: var(--color-teresa--base);
}

.o-time-study-normal--available:hover {
  color: white;
  background-color: var(--color-teresa--base);
  border-color: black;
}

.o-time-study-eternity-challenge--available {
  color: #490066;
  background-color: white;
  border-color: black;
}

.o-time-study-eternity-challenge--available:hover {
  color: white;
  background-color: #490066;
}

.o-time-study-eternity-challenge--complete {
  box-shadow: inset 0 0 3rem var(--color-good-dark);
}

.o-time-study-triad--available {
  color: var(--color-v--base);
  background: black;
  border-color: black;
  animation: a-time-study 1.5s infinite;
}

.o-time-study-triad--available:hover {
  color: black;
  background: var(--color-v--base);
}

.o-time-study-normal--unavailable {
  background-color: #9e9e9e;
}

.t-dark .o-time-study--unavailable:hover,
.t-s6 .o-time-study--unavailable:hover,
.t-s10 .o-time-study--unavailable:hover {
  background-color: var(--color-bad);
  border-color: var(--color-bad);
}

.o-time-study-eternity-challenge--unavailable {
  background-color: #9e9e9e;
}

.o-time-study-dilation--unavailable {
  background-color: #9ca894;
}

.o-time-study-triad--unavailable {
  background-color: #a8a494;
}

.o-time-study-normal--bought {
  color: black;
  background-color: var(--color-teresa--base);
  border-color: black;
}

.o-time-study-eternity-challenge--bought {
  color: white;
  background-color: #490066;
  border-color: black;
}

.o-time-study-eternity-challenge--running {
  color: var(--color-eternity);
  background-color: black;
  border: 0.1rem solid var(--color-eternity);
  animation: a-eternity-challenge-running 6s infinite;
}

@keyframes a-eternity-challenge-running {
  0% { box-shadow: inset 1rem  0       3rem #490066; }
  25% { box-shadow: inset 0     0.5rem  3rem #490066; }
  50% { box-shadow: inset -1rem 0       3rem #490066; }
  75% { box-shadow: inset 0     -0.5rem 3rem #490066; }
  100% { box-shadow: inset 1rem  0       3rem #490066; }
}

.o-time-study-triad--bought {
  color: black;
  background-color: var(--color-v--base);
  border-color: black;
}

.o-time-study--secret {
  opacity: 0;
  transition: opacity 1s;
  transition-delay: 1s;
  cursor: pointer;
}

.o-time-study--secret-unlocked {
  opacity: 1;
  transition: opacity 1s;
  transition-delay: 0s;
  cursor: pointer;
}

.o-time-study--enslaved {
  opacity: 0.02;
  background: var(--color-enslaved--base);
  transition: all 1s;
  animation: a-time-study 0.5s infinite;
  cursor: pointer;
}

.o-time-study--enslaved-unlocked {
  opacity: 1;
  background: var(--color-eternity);
  animation: a-time-study 2s infinite;
  cursor: default;
}

.o-split1-study-normal--available {
  color: var(--color-mending);
  border-color: var(--color-mending);
}

.o-split1-study-normal--available:hover {
  color: white;
  background-color: var(--color-mending);
  border-color: black;
}

.o-split1-study-normal--unavailable {
  background-color: var(--color-mending-light);
}

.o-split1-study-normal--bought {
  color: black;
  background-color: var(--color-mending);
  border-color: black;
}

.o-split2-study-normal--available {
  color: var(--color-effarig--base);
  border-color: var(--color-effarig--base);
}

.o-split2-study-normal--available:hover {
  color: white;
  background-color: var(--color-effarig--base);
  border-color: black;
}

.o-split2-study-normal--unavailable {
  background-color: #eec9c9;
}

.o-split2-study-normal--bought {
  color: black;
  background-color: var(--color-effarig--base);
  border-color: black;
}

.o-split3-study-normal--available {
  color: var(--color-eternity);
  border-color: var(--color-eternity);
}

.o-split3-study-normal--available:hover {
  color: white;
  background-color: var(--color-eternity);
  border-color: black;
}

.o-split3-study-normal--unavailable {
  background-color: #c8a8e6;
}

.o-split3-study-normal--bought {
  color: black;
  background-color: var(--color-eternity);
  border-color: black;
}

.o-split4-study-normal--available {
  color: var(--color-reality);
  border-color: var(--color-reality);
}

.o-split4-study-normal--available:hover {
  color: white;
  background-color: var(--color-reality);
  border-color: black;
}

.o-split4-study-normal--unavailable {
  background-color: var(--color-reality-light);
}

.o-split4-study-normal--bought {
  color: black;
  background-color: var(--color-reality);
  border-color: black;
}
</style>