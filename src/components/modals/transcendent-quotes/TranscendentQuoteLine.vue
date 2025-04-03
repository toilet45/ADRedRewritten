<script>
import TranscendentQuoteBackground from "./TranscendentQuoteBackground";

export default {
  name: "TranscendentQuoteLine",
  components: {
    TranscendentQuoteBackground
  },
  props: {
    transcendentQuote: {
      type: Object,
      required: true
    },
    currentLine: {
      type: Number,
      required: true
    },
    primary: {
      type: Boolean,
      required: false,
      default: false,
    },
    leftVisible: {
      type: Boolean,
      required: false,
      default: false
    },
    rightVisible: {
      type: Boolean,
      required: false,
      default: false
    },
    closeVisible: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  data() {
    return {
      message: "",
      transcendentSymbols: [],
      transcendents: [],
      transcendentName: ""
    };
  },
  computed: {
    line() {
      return this.transcendentQuote.line(this.currentLine);
    },
    leftClass() {
      return {
        "c-modal-transcendent-quote__arrow": true,
        "c-modal-transcendent-quote__arrow-left": true,
        "c-modal-transcendent-quote__arrow-invisible": !this.leftVisible,
        "fas": true,
        "fa-chevron-circle-left": true,
      };
    },
    rightClass() {
      return {
        "c-modal-transcendent-quote__arrow": true,
        "c-modal-transcendent-quote__arrow-right": true,
        "c-modal-transcendent-quote__arrow-invisible": !this.rightVisible,
        "fas": true,
        "fa-chevron-circle-right": true,
      };
    },
  },
  methods: {
    update() {
      const line = this.line;
      this.transcendentSymbols = line.transcendentSymbols;
      this.message = line.line;
      this.transcendents = line.transcendents;
      this.transcendentName = line.transcendentName;
    }
  },
};
</script>

<template>
  <TranscendentQuoteBackground
    :transcendent-symbols="transcendentSymbols"
    :transcendents="transcendents"
    :primary="primary"
  >
    <span
      v-if="line.showTranscendentName"
      class="c-modal-transcendent-name"
    >
      {{ transcendentName }}
    </span>

    <i
      :class="leftClass"
      @click="$emit('progress-in', 'left')"
    />

    <span class="l-modal-transcendent-quote__text">
      {{ message }}
    </span>

    <i
      :class="rightClass"
      @click="$emit('progress-in', 'right')"
    />
    <i
      v-if="closeVisible"
      class="c-modal-transcendent-quote__end fas fa-check-circle"
      @click="emitClose"
    />
  </TranscendentQuoteBackground>
</template>

<style scoped>
.c-modal-transcendent-name {
  position: absolute;
  top: 1rem;
  right: 0;
  left: 0;
  font-weight: bold;
}

.c-modal-transcendent-quote__arrow {
  font-size: 150%;
  margin: 0.5rem;
  cursor: pointer;
}

.c-modal-transcendent-quote__arrow-left {
  position: absolute;
  left: 1rem;
}

.c-modal-transcendent-quote__arrow-right {
  position: absolute;
  right: 1rem;
}

.c-modal-transcendent-quote__end {
  position: absolute;
  bottom: 1.5rem;
  left: calc(50% - 1rem);
  font-size: 150%;
  cursor: pointer;
}

.l-modal-transcendent-quote__text {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.l-modal-transcendent-quote__buttons {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
}

.c-modal-transcendent-quote__arrow-invisible {
  visibility: hidden;
}
</style>
