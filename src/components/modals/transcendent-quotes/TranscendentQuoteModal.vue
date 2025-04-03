<script>
import TranscendentQuoteLineBasicInteractable from "./templates/TranscendentQuoteLineBasicInteractable";

export default {
  name: "TranscendentQuoteModal",
  components: {
    TranscendentQuoteLineBasicInteractable
  },
  props: {
    transcendentQuote: {
      type: Object,
      required: true
    }
  },
};
</script>

<template>
  <div class="l-modal-overlay c-modal-overlay">
    <TranscendentQuoteLineBasicInteractable
      class="c-quote-overlay"
      :transcendent-quote="transcendentQuote"
    />
  </div>
</template>

<style scoped>
.c-quote-overlay {
  font-size: 1.4rem;
  padding: 1rem;
  transition-duration: 0.2s;
}
</style>
