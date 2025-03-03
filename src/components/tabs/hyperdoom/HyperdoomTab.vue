<script>
import DifficultyChangerNT from "./DifficultyChangerNT";
import DifficultyChangerT from "./DifficultyChangerT";

export default {
  name: "HyperdoomTab",
  components: {
    DifficultyChangerT,
    DifficultyChangerNT
  },
  data() {
    return {
      selectedTab: 0,
      isActive: false,
      // The last one is just a bitmask cause its less data to store
      settings: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], 0]
    };
  },
  computed: {
    increaseDifficulty() {
      return 2;
    }
  }
};
</script>

<template>
  <DifficultyChangerNT
    id="1"
    toggled="true"
  />
</template>