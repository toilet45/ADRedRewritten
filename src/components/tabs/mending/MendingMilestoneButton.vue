<script>
export default {
  name: "MendingMilestoneButton",
  props: {
    getMilestone: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      isReached: false,
      isLocked: false,
    };
  },
  computed: {
    milestone() {
      return this.getMilestone();
    },
    config() {
      return this.milestone.config;
    },
    mends() {
      return this.config.mends;
    },
    reward() {
      const reward = this.config.reward;
      return typeof reward === "function" ? reward() : reward;
    },
    rewardClassObject() {
      return {
        "o-mend-milestone__reward": true,
        "o-mend-milestone__reward--locked": !this.isReached,
        "o-mend-milestone__reward--reached": this.isReached,
        "o-mend-milestone__reward--small-font": this.reward.length > 80
      };
    },
    activeCondition() {
      return this.config.activeCondition ? this.config.activeCondition() : null;
    },
    isDoomed: () => Pelle.isDoomed,
    isUseless() {
      return this.isDoomed && this.config.pelleUseless;
    }
  },
  methods: {
    update() {
      this.isLocked = this.isDoomed && this.config.givenByPelle !== undefined;
      this.isReached = this.milestone.isReached;
    }
  }
};
</script>

<template>
  <div
    v-if="!config.invisible"
    class="l-mend-milestone"
  >
    <span class="o-mend-milestone__goal">
      {{ quantifyInt("Mend", mends) }}:
    </span>
    <button
      v-tooltip="activeCondition"
      :class="rewardClassObject"
    >
      <span :class="{ 'o-pelle-disabled': isUseless }">
        {{ reward }} {{ (isLocked && !isReached) ? "(Locked behind a Pelle Upgrade)" : "" }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.l-mend-milestone {
  display: flex;
  flex-direction: column;
}

.o-mend-milestone__goal {
  text-align: left;
  font-size: 2rem;
}

.o-mend-milestone__reward {
  width: 25rem;
  height: 8rem;
  font-family: Typewriter, serif;
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
  border: 0.1rem solid var(--color-mending);
  border-radius: var(--var-border-radius, 0.4rem);
  transition-duration: 0.2s;
}

.o-mend-milestone__reward--locked {
  background-color: dimgrey;
}

.o-mend-milestone__reward--reached {
  background-color: var(--color-mending);
  border-color: black;
}

.o-mend-milestone__reward--small-font {
  font-size: 1.1rem;
}

.s-base--metro .o-mend-milestone__reward--locked,
.t-s1 .o-mend-milestone__reward--locked {
  background-color: #9e9e9e;
  border: none;
  box-shadow: 0.1rem 0.1rem 0.1rem 0 black;
}

.t-dark .o-mend-milestone__reward--locked,
.t-s6 .o-mend-milestone__reward--locked,
.t-s10 .o-mend-milestone__reward--locked {
  color: var(--color-mending);
  background-color: black;
  border-color: var(--color-mending);
  animation: a-time-study 7s infinite;
}
</style>
