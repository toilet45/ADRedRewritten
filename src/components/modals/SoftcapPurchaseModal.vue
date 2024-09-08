<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";

export default {
  name: "SoftcapPurchaseModal",
  components: {
    ModalWrapperChoice
  },
  props: {
    upgradeName: {
      type: String,
      required: true,
    },
    exitFn: {
      type: Function,
      required: true,
    }
  },
  methods: {
    handleYesClick() {
      this.exitFn();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ModalWrapperChoice
    @confirm="handleYesClick"
  >
    <template #header>
      You are about to purchase {{ upgradeName }}
    </template>

    <div class="c-modal-message__text">
      <span>
        You are about to purchase {{ upgradeName }}.
        This may cause you to get softlocked if you purchase it too early.<br>
        Are you sure you want to purchase it anyways?<br>
        (This modal will not appear again)
      </span>
    </div>
    <template #confirm-text>
      Purchase
    </template>
  </ModalWrapperChoice>
</template>
