<script>
import ResetModal from "@/components/modals/prestige/ResetModal";

export default {
  name: "MendModal",
  components: {
    ResetModal
  },
  data() {
    return {
      gainedMultiversalRemains: new Decimal(),
      gainedMends: new Decimal()
    };
  },
  computed: {
    message() {
      return `Mending this Multiverse will reset everything except Challenge records, and anything under 
      the General header on the Statistics tab 
      (except total Antimatter). ${PlayerProgress.mendingUnlocked() ? `` : `You will 
      also gain a Multiversal Remain and unlock various upgrades.`}`;
    },
    gainedMvROnMend() {
      return `You will gain ${quantify("Mend", this.gainedMends, 0, 0, true)} 
      and ${quantify("Multiversal Remain", this.gainedMultiversalRemains, 0, 0, true)} on Mend.`;
    },
  },
  methods: {
    update() {
      this.gainedMultiversalRemains = adRedGainedMendingPoints();
      this.gainedMends = adRedGainedMends();
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
    header="You are about to Mend this Multiverse"
    :message="message"
    :gained-resources="gainedMvROnMend"
    :confirm-fn="handleYesClick"
    confirm-option="mend"
  />
</template>
