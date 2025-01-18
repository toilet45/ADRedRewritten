<script>
import ChallengeGrid from "@/components/ChallengeGrid";
import ChallengeTabHeader from "@/components/ChallengeTabHeader";
import EternityChallengeBox from "./EternityChallengeBox";

export default {
  name: "EternityChallengesTab",
  components: {
    ChallengeTabHeader,
    ChallengeGrid,
    EternityChallengeBox
  },
  data() {
    return {
      unlockedCount: 0,
      showAllChallenges: false,
      autoEC: false,
      isAutoECVisible: false,
      hasUpgradeLock: false,
      remainingECTiers: 0,
      untilNextEC: TimeSpan.zero,
      untilAllEC: TimeSpan.zero,
      hasECR: false,
      hasCelStudies: false,
      EC13Completions: 0,
      EC20Completions: 0
    };
  },
  computed: {
    challenges() {
      return EternityChallenges.all;
    },
    upgradeLockNameText() {
      return RealityUpgrade(12).isLockingMechanics
        ? RealityUpgrade(12).name
        : ImaginaryUpgrade(15).name;
    },
    nextECText() {
      return this.untilNextEC.totalMilliseconds === 0 && !this.autoEC
        ? "Immediately upon unpausing"
        : `${this.untilNextEC} (real time)`;
    },
    allECText() {
      return this.untilAllEC.totalMilliseconds === 0 && !this.autoEC
        ? "Immediately upon unpausing"
        : `After ${this.untilAllEC} (real time)`;
    }
  },
  methods: {
    update() {
      this.showAllChallenges = player.options.showAllChallenges;
      this.unlockedCount = EternityChallenges.all
        .filter(this.isChallengeVisible)
        .length;
      this.isAutoECVisible = Perk.autocompleteEC1.canBeApplied;
      this.autoEC = player.reality.autoEC;
      const shouldPreventEC7 = TimeDimension(1).amount.gt(0);
      this.hasUpgradeLock = RealityUpgrade(12).isLockingMechanics ||
        (ImaginaryUpgrade(15).isLockingMechanics && shouldPreventEC7 &&
          !Array.range(1, 6).some(ec => !EternityChallenge(ec).isFullyCompleted));
      const remainingCompletions = EternityChallenges.remainingAutoCompletions;
      this.remainingECTiers = remainingCompletions;
      if (remainingCompletions !== 0) {
        const autoECInterval = EternityChallenges.autoComplete.interval;
        const untilNextEC = Decimal.max(autoECInterval.sub(player.reality.lastAutoEC), 0);
        this.untilNextEC.setFrom(untilNextEC);
        this.untilAllEC.setFrom(untilNextEC.add(autoECInterval.times(remainingCompletions - 1)));
      }
      this.hasECR = Perk.studyECRequirement.isBought;
      this.hasCelStudies = Ra.unlocks.vHardenedUnlock.canBeApplied;
      this.EC13Completions = EternityChallenge(13).completions + EternityChallenge(20).completions;
      this.EC20Completions = EternityChallenge(20).completions;
    },
    isChallengeVisible(challenge) {
      if (challenge.id >= 13) return challenge.completions > 0 || challenge.isUnlocked || challenge.hasUnlocked;
      return challenge.completions > 0 || challenge.isUnlocked || challenge.hasUnlocked ||
        (this.showAllChallenges && PlayerProgress.realityUnlocked());
    }
  }
};
</script>

<template>
  <div class="l-challenges-tab">
    <ChallengeTabHeader />
    <div v-if="isAutoECVisible">
      Eternity Challenges are automatically completed sequentially, requiring all previous
      Eternity Challenges to be fully completed before any progress is made.
    </div>
    <div
      v-if="isAutoECVisible && remainingECTiers > 0"
      class="c-challenges-tab__auto-ec-info l-challenges-tab__auto-ec-info"
    >
      <div class="l-challenges-tab__auto-ec-timers">
        <span
          v-if="hasUpgradeLock"
          class="l-emphasis"
        >
          Auto EC is currently disabled because of the "{{ upgradeLockNameText }}" upgrade requirement lock.
        </span>
        <span v-if="remainingECTiers > 0">
          Next Auto Eternity Challenge completion: {{ nextECText }}
        </span>
        <span>
          All Auto Eternity Challenge completions: {{ allECText }}
        </span>
        <br>
      </div>
    </div>
    <div v-if="!hasCelStudies">
      Complete Eternity Challenges again for a bigger reward, maximum of {{ formatInt(5) }} times.<br>
      The rewards are applied permanently with no need to have the respective Eternity Challenge Time Study purchased.
    </div>
    <div v-else>
      Complete Eternity Challenges again for a bigger reward.<br>
      Eternity Challenges 1-12 can be completed a maximum of {{ formatInt(EC13Completions + 5) }} times.<br>
      <div v-if="unlockedCount > 12">
        Eternity Challenge{{ unlockedCount == 13 ? " 13" : `s 13-${formatInt(Math.clampMax(unlockedCount, 19))}` }}
        can be completed a maximum of {{ formatInt(EC20Completions + 5) }} times.<br>
      </div>
      <div v-if="unlockedCount > 19">
        Eternity Challenge{{ unlockedCount > 20 ? "s 20+" : " 20" }}
        can be completed a maximum of {{ formatInt(5) }} times.<br>
      </div>
      <!-- eslint-disable-next-line vue/multiline-html-element-content-newline -->
      <div v-if="unlockedCount > 24"> Eternity Challenge 25 can only be completed once. <br>
      </div>
      The rewards are applied permanently with no need to have the respective Eternity Challenge Time Study purchased.
      <div v-if="unlockedCount > 12">
        Eternity Challenges 13+ have all "Start with x IP" rewards disabled
      </div>
    </div>
    <div v-if="!hasECR">
      When you respec out of an unlocked Eternity Challenge, you don't need to redo the secondary requirement<br>
      in order to unlock it again until you complete it; only the Time Theorems are required.
    </div>
    <div v-if="unlockedCount < 12">
      You have seen {{ formatInt(unlockedCount) }} out of {{ formatInt(12) }} Eternity Challenges.
    </div>
    <div v-else-if="hasCelStudies && unlockedCount !== 25">
      You have seen {{ formatInt(unlockedCount) }} Eternity Challenges.
    </div>
    <div v-else-if="hasCelStudies">
      You have seen all {{ formatInt(25) }} Eternity Challenges.
    </div>
    <div v-else>
      You have seen all {{ formatInt(12) }} Eternity Challenges.
    </div>
    <br>
    <ChallengeGrid
      v-slot="{ challenge }"
      :challenges="challenges"
      :is-challenge-visible="isChallengeVisible"
    >
      <EternityChallengeBox :challenge="challenge" />
    </ChallengeGrid>
    <br>
    <div v-if="hasCelStudies">
      Some Eternity Challenges provide bonus rewards on certain completions.
      These bonus rewards can be seen in the how to play modal, under "Bonus EC Rewards"
    </div>
  </div>
</template>

<style scoped>
.l-emphasis {
  font-weight: bold;
  color: var(--color-bad);
}
</style>
