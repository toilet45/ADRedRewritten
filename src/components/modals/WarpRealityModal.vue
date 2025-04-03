<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "WarpRealityModal",
  components: {
    ModalWrapperChoice
  },
  computed: {
    message() {
      const end = formatPostBreak("e9e15", 2);
      return `Warping Reality will allow numbers to go past ${end}.\
        However, all resources are softcapped the further beyond ${end} they are.\
        `.split("\n");
    },
  },
  methods: {
    handleYesClick() {
      player.reality.warped = true;
      Achievement(201).unlock();
      TranscendentQuotes.kohler.warp.show();
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    :show-cancel="false"
    @confirm="handleYesClick"
  >
    <template #header>
      You are Warping Reality
    </template>
    <div class="c-modal-message__text">
      <span
        v-for="(line, index) in message"
        :key="index"
      >
        {{ line }} <br>
      </span>
    </div>
    <template #confirm-text>
      WARP!!!
    </template>
  </ModalWrapperChoice>
</template>
