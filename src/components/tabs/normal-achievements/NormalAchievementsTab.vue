<script>
import NormalAchievementRow from "./NormalAchievementRow";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";
import SwapAchievementImagesButton from "./SwapAchievementImagesButton";

export default {
  name: "NormalAchievementsTab",
  components: {
    SwapAchievementImagesButton,
    NormalAchievementRow,
    PrimaryToggleButton
  },
  data() {
    return {
      achievementPower: 0,
      achTPEffect: 0,
      achCountdown: new Decimal(),
      totalCountdown: new Decimal(),
      missingAchievements: 0,
      showAutoAchieve: false,
      isAutoAchieveActive: false,
      hideCompletedRows: false,
      achMultBreak: false,
      achMultToIDS: false,
      achMultToTDS: false,
      achMultToBH: false,
      achMultToTP: false,
      achMultToTT: false,
      renderedRowIndices: [],
      hasMended: false
    };
  },
  computed: {
    isDoomed: () => Pelle.isDoomed,
    rows: () => Achievements.allRows,
    renderedRows() {
      return this.rows.filter((_, i) => this.renderedRowIndices.includes(i));
    },
    boostText() {
      const achievementPower = formatX(this.achievementPower, 2, 3);
      const achTPEffect = formatX(this.achTPEffect, 2, 3);
      let bhpow = this.achievementPower.gt(1e35) ? formatX(this.achievementPower.div(1e35).cbrt().mul(1e35), 2, 3)
        : formatX(this.achievementPower, 2, 3);

      if (MendingUpgrade(13).isBought) {
        const adpow = formatX(this.achievementPower.pow(10000), 2, 3);
        const idpow = formatX(this.achievementPower.pow(777), 2, 3);
        const tdpow = formatX(this.achievementPower.pow(111), 2, 3);
        const tppow = formatX(this.achievementPower.pow(10), 2, 3);
        bhpow = this.achievementPower.pow(2).gt(1e35)
          ? formatX(this.achievementPower.pow(2).div(1e35).cbrt().mul(1e35), 2, 3)
          : formatX(this.achievementPower.pow(2), 2, 3);
        const otherpow = formatX(this.achievementPower.pow(4), 2, 3);

        const boostList = [];

        boostList.push(`Antimatter Dimensions: ${adpow}`);
        if (this.achMultToIDS) boostList.push(`Infinity Dimensions: ${idpow}`);
        if (this.achMultToTDS) boostList.push(`Time Dimensions: ${tdpow}`);

        if (this.achMultToTP) boostList.push(`Tachyon Particles: ${tppow}`);
        if (this.achMultToBH) boostList.push(`Black Hole Power: ${bhpow}`);
        if (this.achMultToTT) boostList.push(`Time Theorem production: ${otherpow}`);
        return `${boostList.join("<br>")}`;
      }

      const boostList = [];

      const dimMultList = [];
      dimMultList.push("Antimatter");
      if (this.achMultToIDS) dimMultList.push("Infinity");
      if (this.achMultToTDS) dimMultList.push("Time");
      boostList.push(`${makeEnumeration(dimMultList)} Dimensions: ${achievementPower}`);

      if (this.achMultToTP) boostList.push(`Tachyon Particles: ${achTPEffect}`);
      if (this.achMultToBH) boostList.push(`Black Hole Power: ${bhpow}`);
      if (this.achMultToTT) boostList.push(`Time Theorem production: ${achievementPower}`);
      return `${boostList.join("<br>")}`;
    },
  },
  watch: {
    isAutoAchieveActive(newValue) {
      player.reality.autoAchieve = newValue;
    },
    hideCompletedRows(newValue) {
      player.options.hideCompletedAchievementRows = newValue;
      this.startRowRendering();
    }
  },
  created() {
    this.startRowRendering();
  },
  beforeDestroy() {
    cancelAnimationFrame(this.renderAnimationId);
  },
  methods: {
    update() {
      const gameSpeedupFactor = getGameSpeedupFactor();
      this.achievementPower = Achievements.power;
      this.achTPEffect = RealityUpgrade(8).config.effect();
      this.achCountdown = Achievements.timeToNextAutoAchieve.div(gameSpeedupFactor);
      this.totalCountdown = (new Decimal((Achievements.preReality.countWhere(a => !a.isUnlocked)))
        .sub(1).times(Achievements.period)
        .add(Achievements.timeToNextAutoAchieve)).div(gameSpeedupFactor);
      this.missingAchievements = Achievements.preReality.countWhere(a => !a.isUnlocked);
      this.showAutoAchieve = PlayerProgress.realityUnlocked() && !Perk.achievementGroup5.isBought;
      this.isAutoAchieveActive = player.reality.autoAchieve;
      this.hideCompletedRows = player.options.hideCompletedAchievementRows;
      this.achMultBreak = BreakInfinityUpgrade.achievementMult.canBeApplied;
      this.achMultToIDS = Achievement(75).isUnlocked;
      this.achMultToTDS = EternityUpgrade.tdMultAchs.isBought;
      this.achMultToTP = RealityUpgrade(8).isBought;
      this.achMultToBH = VUnlocks.achievementBH.canBeApplied;
      this.achMultToTT = Ra.unlocks.achievementTTMult.canBeApplied;
      this.hasMended = PlayerProgress.mendingUnlocked();
    },
    startRowRendering() {
      const unlockedRows = [];
      const lockedRows = [];
      for (let i = 0; i < this.rows.length; i++) {
        const targetArray = this.rows[i].every(a => a.isUnlocked) ? unlockedRows : lockedRows;
        targetArray.push(i);
      }
      const renderedLockedRows = lockedRows.filter(row => this.renderedRowIndices.includes(row));
      const nonRenderedLockedRows = lockedRows.filter(row => !this.renderedRowIndices.includes(row));
      let rowsToRender;
      if (player.options.hideCompletedAchievementRows) {
        this.renderedRowIndices = unlockedRows.concat(renderedLockedRows);
        rowsToRender = nonRenderedLockedRows;
      } else {
        this.renderedRowIndices = renderedLockedRows;
        rowsToRender = unlockedRows.concat(nonRenderedLockedRows);
      }
      const stepThroughRendering = () => {
        const ROWS_PER_FRAME = 2;
        for (let i = 0; i < ROWS_PER_FRAME; i++) {
          if (rowsToRender.length === 0) {
            return;
          }
          this.renderedRowIndices.push(rowsToRender.shift());
        }
        this.renderAnimationId = requestAnimationFrame(stepThroughRendering);
      };
      stepThroughRendering();
    },
    isRendered(row) {
      return this.renderedRowIndices.includes(row);
    },
    isObscured(row) {
      if (PlayerProgress.mendingUnlocked()) return false;
      if (this.isDoomed) return row >= 18;
      return row >= 17;
    },
    timeDisplay,
    timeDisplayNoDecimals,
  }
};
</script>

<template>
  <div class="l-achievements-tab">
    <div class="c-subtab-option-container">
      <PrimaryToggleButton
        v-model="hideCompletedRows"
        class="o-primary-btn--subtab-option"
        label="Hide completed rows:"
      />
      <PrimaryToggleButton
        v-if="showAutoAchieve"
        v-model="isAutoAchieveActive"
        class="o-primary-btn--subtab-option"
        label="Auto Achievements:"
      />
    </div>
    <div class="c-achievements-tab__header c-achievements-tab__header--multipliers">
      <span v-if="isDoomed">
        All Achievement multipliers have been disabled<SwapAchievementImagesButton />
      </span>
      <span v-else>
        Achievements provide a multiplier to<SwapAchievementImagesButton />
        <div v-html="boostText" />
      </span>
    </div>
    <div class="c-achievements-tab__header">
      Achievements with a <i class="fas fa-star" /> icon also give an additional reward.
    </div>
    <div
      v-if="showAutoAchieve"
      class="c-achievements-tab__header"
    >
      <div v-if="achCountdown.gt(0)">
        Automatically gain the next missing Achievement in
        {{ timeDisplayNoDecimals(achCountdown) }}<span v-if="!isAutoAchieveActive"> once Auto is turned on</span>.
        (left-to-right, top-to-bottom)
      </div>
      <div v-else-if="missingAchievements !== 0">
        Automatically gain the next missing Achievement as soon as you enable Auto Achievements.
        (left-to-right, top-to-bottom)
      </div>
      <div v-if="totalCountdown.gt(0)">
        You will regain all remaining achievements after {{ timeDisplayNoDecimals(totalCountdown) }} if Auto
        Achievement <span v-if="isAutoAchieveActive">stays enabled</span><span v-else>is turned on</span>.
      </div>
      <div v-if="hasMended">
        For Mending the Multiverse, the Auto Achievement timer no longer resets on Reality.
      </div>
      <br>
    </div>
    <div class="l-achievement-grid">
      <NormalAchievementRow
        v-for="(row, i) in renderedRows"
        :key="i"
        :row="row"
        :is-obscured="isObscured(i)"
      />
    </div>
  </div>
</template>
