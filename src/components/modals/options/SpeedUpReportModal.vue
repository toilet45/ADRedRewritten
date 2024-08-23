<script>
import ModalWrapper from "@/components/modals/ModalWrapper";

export default {
  name: "SpeedUpReportModal",
  components: {
    ModalWrapper
  },
  data() {
    return {
      effectiveDurationText: "",
      durationText: "",
    };
  },
  created() {
    this.effectiveDurationText = TimeSpan.fromMilliseconds(new Decimal(dev.speedUpDuration)).toString();
    this.durationText = TimeSpan.fromMilliseconds(new Decimal(Date.now() - dev.speedUpStart)).toString();
    dev.speedUpDuration = 0;
    delete dev.speedUpDuration;
    delete dev.speedUpRestart;
    delete dev.speedUpStart;
  },
};
</script>

<template>
  <ModalWrapper>
    <template #header>
      Testing Speed Up Report
    </template>
    <div>
      The speed up lasted {{ durationText }}.
      <br>
      It was equivalent to spending {{ effectiveDurationText }} in game.
    </div>
  </ModalWrapper>
</template>