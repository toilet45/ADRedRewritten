<script>
import MendingPointsHeader from "../MendingPointsHeader";

import HeaderBlackHole from "./HeaderBlackHole";
import HeaderChallengeDisplay from "./HeaderChallengeDisplay";
import HeaderChallengeEffects from "./HeaderChallengeEffects";
import HeaderPrestigeGroup from "./HeaderPrestigeGroup";
import MendingButton from "./prestige-header/MendingButton";

import GameSpeedDisplay from "@/components/GameSpeedDisplay";

export default {
  name: "GameHeader",
  components: {
    HeaderChallengeDisplay,
    HeaderChallengeEffects,
    HeaderBlackHole,
    HeaderPrestigeGroup,
    GameSpeedDisplay,
    MendingPointsHeader,
    MendingButton
  },
  data() {
    return {
      hasReality: false,
      hasMend: false
    };
  },
  methods: {
    update() {
      this.hasReality = PlayerProgress.realityUnlocked();
      this.hasMend = PlayerProgress.mendingUnlocked();
    },
  },
};
</script>

<template>
  <div>
    <HeaderChallengeDisplay />
    <HeaderChallengeEffects />
    <MendingPointsHeader v-if="hasMend" />
    <MendingButton v-if="hasMend" />
    <HeaderPrestigeGroup />
    <GameSpeedDisplay v-if="hasReality" />
    <br v-if="hasReality">
    <HeaderBlackHole />
  </div>
</template>

<style scoped>

</style>
