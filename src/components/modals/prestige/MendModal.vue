<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "EternityModal",
  components: {
    ResetModal
  },
  data() {
    return {
      gainedEternityPoints: new Decimal(),
      gainedEternities: new Decimal()
    };
  },
  computed: {
    message() {
      return PlayerProgress.mendingUnlocked()
        ? `Mending will reset everything except Challenge records, and anything under the General header on the
          Statistics tab.`
        : `Mending will reset everything except Challenge records, and anything under the General header on the
          Statistics tab. You will also gain a Multiversal Remain and unlock various upgrades.`;
    },
    gainedEPOnEternity() {
      return `You will gain ${quantify("Mend", this.gainedEternities, 2)} 
      and ${quantify("Multiversal Remain", this.gainedEternityPoints, 2)} on Mend.`;
    },
  },
  methods: {
    update() {
      this.gainedMultiversalRemains = gainedMultiversalRemains();
      this.gainedMends = gainedEternities();
    },
    handleYesClick() {
      mendingReset();
      EventHub.ui.offAll(this);
    }
  },
};
</script>

<template>
  <ResetModal
    header="You are about to Mend the Multiverse"
    :message="message"
    :gained-resources="gainedEPOnEternity"
    :confirm-fn="handleYesClick"
    confirm-option="mend"
  />
</template>
