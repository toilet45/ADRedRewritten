<script>
import ClassicMultiversalDimensionsTab from "./ClassicMultiversalDimensionsTab";
import ModernMultiversalDimensionsTab from "./ModernMultiversalDimensionsTab";

export default {
  name: "TimeDimensionsTab",
  components: {
    ClassicMultiversalDimensionsTab,
    ModernMultiversalDimensionsTab
  },
  computed: {
    activeComponent() {
      return this.$viewModel.newUI
        ? "ModernMultiversalDimensionsTab"
        : "ClassicMultiversalDimensionsTab";
    }
  }
};
</script>

<template>
  <component :is="activeComponent" />
</template>
