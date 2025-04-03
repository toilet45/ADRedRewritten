<script>
export default {
  name: "TranscendentQuoteHistory",
  props: {
    transcendent: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isShown: false
    };
  },
  computed: {
    color() {
      return this.transcendent === "laitela" ? `var(--color-laitela--accent)` : `var(--color-${this.transcendent}--base)`;
    },
    possessiveForm() {
      return Transcendents[this.transcendent].possessiveName;
    }
  },
  methods: {
    update() {
      this.isShown = Transcendents[this.transcendent].quotes.all.some(x => x.isUnlocked);
    },
    show() {
      TranscendentQuote.showHistory(Transcendents[this.transcendent].quotes.all);
    },
  }
};
</script>

<template>
  <button
    v-if="isShown"
    class="c-transcendent-quote-history--button"
    :style="{
      '--scoped-cel-color': color
    }"
    @click="show"
  >
    {{ possessiveForm }} Quotes
  </button>
</template>

<style scope>
.c-transcendent-quote-history--button {
  align-self: center;
  font-family: Typewriter;
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--color-text);
  background-color: var(--color-base);
  border: var(--var-border-width, 0.2rem) solid var(--scoped-cel-color);
  border-radius: var(--var-border-radius, 0.5rem);
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  transition: 0.2s;
  transition-property: color, background-color;
  cursor: pointer;
}

.c-transcendent-quote-history--button:hover {
  color: var(--color-text-inverted);
  background-color: var(--scoped-cel-color);
}
</style>
