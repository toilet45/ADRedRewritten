<script>
import TranscendentQuoteLine from "@/components/modals/transcendent-quotes/TranscendentQuoteLine";

export default {
  name: "TranscendentQuoteBasicInteractable",
  components: {
    TranscendentQuoteLine
  },
  props: {
    transcendentQuote: {
      type: Object,
      required: true
    },
    isFocused: {
      type: Boolean,
      required: false,
      default: true
    },
    primary: {
      type: Boolean,
      required: false,
      default: false,
    },
    leftVisible: {
      type: Boolean,
      required: false,
      default: true
    },
    rightVisible: {
      type: Boolean,
      required: false,
      default: true
    },
    closeVisible: {
      type: Boolean,
      required: false,
      default: true
    },
  },
  data() {
    return {
      index: 0,
    };
  },
  computed: {
    totalLines() {
      return this.transcendentQuote.totalLines;
    },
    currentLine: {
      get() {
        return this.index;
      },
      set(x) {
        this.index = Math.clamp(x, 0, this.totalLines - 1);
      }
    },
    isQuoteStart() {
      return this.currentLine === 0;
    },
    isQuoteEnd() {
      return this.currentLine === this.totalLines - 1;
    },
  },
  created() {
    this.$nextTick(() => {
      this.on$(GAME_EVENT.ARROW_KEY_PRESSED, arrow => this.progressIn(arrow[0]));
      this.on$(GAME_EVENT.ENTER_PRESSED, () => {
        if (this.isQuoteEnd) this.close();
      });
    });
  },
  methods: {
    progressIn(direction) {
      if (!this.isFocused) return false;
      switch (direction) {
        case "left": return this.currentLine--;
        case "right": return this.currentLine++;
        default: return false;
      }
    },
    close() {
      if (!this.isFocused) return;
      this.index = 0;
      TranscendentQuote.advanceQueue();
    },
  },
};
</script>

<template>
  <TranscendentQuoteLine
    :transcendent-quote="transcendentQuote"
    :current-line="currentLine"
    :left-visible="!isQuoteStart && leftVisible"
    :right-visible="!isQuoteEnd && rightVisible"
    :close-visible="isQuoteEnd && closeVisible"
    primary
    @close="close"
    @progress-in="progressIn"
  />
</template>