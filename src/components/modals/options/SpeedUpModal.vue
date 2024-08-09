<script>
import ModalWrapperChoice from "@/components/modals/ModalWrapperChoice";
import { Modal } from "../../../core/modal";

export default {
  name: "SpeedUpModal",
  components: {
    ModalWrapperChoice
  },
  data() {
    return {
      input: "",
      speedUp: 1,
      displayText: "",
      isValidSpeed: true,
    }
  },
  created() {
    this.speedUp = dev.speedUp ?? 1;
    this.input = `${dev.speedUp ?? 1}`;
    this.handleSpeedUpInput();
  },
  methods: {
    setSpeedUp(){
      if(!this.isValidSpeed) return;
      const now = Date.now()
      if((dev.speedUp ?? 1) != 1){
        dev.speedUpDuration = dev.speedUpDuration ?? 0;
        dev.speedUpDuration += (now - (dev.speedUpRestart ?? now)) * dev.speedUp;
      }
      this.emitClose();
      if(this.speedUp == 1){
        if((dev.speedUp ?? 1) == 1) return;
        Modal.speedUpReport.show();
        delete dev.speedUp;
        return;
      } else {
        if((dev.speedUp ?? 1) == 1){
          dev.speedUpStart = now;
        }
        dev.speedUpRestart = now;
      }
      dev.speedUp = this.speedUp;
    },
    formatDuration(duration) {
      days = Math.floor(duration)
    },
    handleSpeedUpInput(){
      const speedUp = parseFloat(this.input);
      if(!isFinite(speedUp) || isNaN(speedUp) || speedUp < 0 || speedUp > 100){
        this.displayText = "Invalid speed";
        this.isValidSpeed = false;
      } else {
        this.displayText = `Speed will be set to ${speedUp}x`
        this.isValidSpeed = true;
        this.speedUp = speedUp
      }
    },
  },
}
</script>

<template>
  <ModalWrapperChoice
    :show-confirm="isValidSpeed"
    :confirmFn="setSpeedUp"
  >
    <template #header>
      Modify Testing Speed
    </template>
    <div>
      <div>
        Set game speed up for testing purposes.
        A report will be displayed after settings the speed up back to 1 informing how
        long was the speed up effecitvely.
      </div>
      <div
          class="c-modal-hard-reset-danger"
        >
        This speed up will affect EVERYTHING(Singularities is not guaranteed to be affected by this)
      </div>
      <input
        ref="input"
        v-model="input"
        type="text"
        class="c-modal-input"
        @keyup.enter="setSpeedUp"
        @keyup.esc="emitClose"
        @input="handleSpeedUpInput()"
      >
      <div>
        {{ displayText }}
      </div>
    </div>
  </ModalWrapperChoice>
</template>