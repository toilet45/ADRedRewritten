<script>
import FailableEcText from "./FailableEcText";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "HeaderChallengeDisplay",
  components: {
    FailableEcText,
    PrimaryButton
  },
  data() {
    return {
      activityTokens: [],
      infinityUnlocked: false,
      showExit: false,
      exitText: "",
      resetCelestial: false,
      inPelle: false,
      inExpansion: false,
      inDamage: false,
      maxCompletion: 0
    };
  },
  computed: {
    parts() {
      // We need activityToken for NC/IC/EC because plain check of WhateverChallenge.isRunning
      // won't trigger display update if we, say, switch from one challenge to another
      function celestialReality(celestial, name, tab) {
        return {
          name: () => `${name} Reality`,
          isActive: token => token,
          activityToken: () => celestial.isRunning,
          tabName: () => tab,
        };
      }
      return [
        {
          name: () => "Teresa's Reality",
          isActive: token => token,
          activityToken: () => Teresa.isRunning & !Teresa.hardModeToggled
        },
        {
          name: () => "Teresa's Hardened Reality",
          isActive: token => token,
          activityToken: () => Teresa.isRunning & Teresa.hardModeToggled
        },
        celestialReality(Effarig, "Effarig's", "effarig"),
        celestialReality(Enslaved, "The Nameless Ones'", "enslaved"),
        celestialReality(V, "V's", "v"),
        celestialReality(Ra, "Ra's", "ra"),
        celestialReality(Laitela, "Lai'tela's", "laitela"),
        {
          name: () => "Time Dilation",
          isActive: token => token,
          activityToken: () => player.dilation.active
        },
        {
          name: token => `Eternity Challenge ${token}`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.eternity.current
        },
        {
          name: token => `Infinity Challenge ${token}`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.infinity.current
        },
        {
          name: token => `${NormalChallenge(token).config.name} Challenge`,
          isActive: token => token > 0,
          activityToken: () => player.challenge.normal.current
        },
      ];
    },
    activeChallengeNames() {
      const names = [];
      for (let i = 0; i < this.activityTokens.length; i++) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        if (part.name(token).includes("Eternity Challenge")) {
          const currEC = player.challenge.eternity.current;
          const nextCompletion = EternityChallenge(currEC).completions + 1;
          let completionText = "";
          if (Enslaved.isRunning && currEC === 1) {
            completionText = `(${formatInt(nextCompletion)}/???)`;
          } else if (nextCompletion >= this.maxCompletion + 1) {
            completionText = `(already completed)`;
          } else {
            completionText = `(${formatInt(nextCompletion)}/${formatInt(this.maxCompletion)})`;
          }
          names.push(`${part.name(token)} ${completionText}`);
        } else {
          names.push(part.name(token));
        }
      }
      return names;
    },
    isVisible() {
      return this.infinityUnlocked || this.activeChallengeNames.length > 0;
    },
    isInFailableEC() {
      return this.activeChallengeNames.some(str => str.match(/Eternity Challenge (4|12)/gu));
    },
    challengeDisplay() {
      if (this.inPelle && this.activeChallengeNames.length > 0) {
        return `${this.activeChallengeNames.join(" + ")} in a Doomed Reality. Good luck.`;
      }
      if (this.activeChallengeNames.length > 0) {
        if (this.inExpansion) return `${this.activeChallengeNames.join(" + ")} in an Expanded Reality`;
        if (this.inDamage) return `${this.activeChallengeNames.join(" + ")} in a Damaged Universe`;
        if (this.inPelle) return `${this.activeChallengeNames.join(" + ")} in a Doomed Reality. Good luck.`;
        return this.activeChallengeNames.join(" + ");
      }
      if (this.activeChallengeNames.length === 0) {
        // eslint-disable-next-line max-len
        if (this.inExpansion) return "an Expanded Reality";
        if (this.inDamage) return "a Damaged Universe";
        if (this.inPelle) return "a Doomed Reality. Good luck.";
      }
      return `${PlayerProgress.mendingUnlocked() ? "a Mended Multiverse" : "the Antimatter Universe"} (no active challenges)`;
    },
  },
  methods: {
    update() {
      this.infinityUnlocked = PlayerProgress.infinityUnlocked();
      this.activityTokens = this.parts.map(part => part.activityToken());
      // Dilation in Pelle can't be left once entered, but we still want to allow leaving more nested challenges
      this.showExit = (this.inPelle && player.dilation.active
        ? this.activeChallengeNames.length > 1
        : this.activeChallengeNames.length !== 0) || this.inPelle && Ra.unlocks.undoDoom.canBeApplied;
      this.exitText = this.exitDisplay();
      this.resetCelestial = player.options.retryCelestial;
      this.inPelle = Pelle.isDoomed;
      this.inExpansion = Enslaved.isExpanded;
      this.inDamage = Laitela.isDamaged;
      this.maxCompletion = this.challengeCaps();
    },
    // Process exit requests from the inside out; Challenges first, then dilation, then Celestial Reality. If the
    // relevant option is toggled, we pass a bunch of information over to a modal - otherwise we immediately exit
    exitButtonClicked() {
      let names, clickFn;
      const isEC = Player.anyChallenge instanceof EternityChallengeState;

      // Dilation and ECs can't be exited independently and we have a special dilation-exit modal, so we have
      // to treat that particular case differently. The dilation modal itself will account for EC state
      if (player.dilation.active && (!Player.isInAnyChallenge || isEC)) {
        if (player.options.confirmations.dilation) Modal.exitDilation.show();
        else startDilatedEternityRequest();
        return;
      }

      if (Player.isInAnyChallenge) {
        // Regex replacement is used to remove the "(X/Y)" which appears after ECs. The ternary statement is there
        // because this path gets called for NCs, ICs, and ECs
        const toExit = this.activeChallengeNames[this.activeChallengeNames.length - 1].replace(/\W+\(.*\)/u, "");
        names = { chall: toExit, normal: isEC ? "Eternity" : "Infinity" };
        clickFn = () => {
          const oldChall = Player.anyChallenge;
          Player.anyChallenge.exit(false);
          if (player.options.retryChallenge) oldChall.requestStart();
        };
      } else {
        names = { chall: this.activeChallengeNames[0], normal: "Reality" };
        clickFn = () => {
          if (this.inPelle) Pelle.reset();
          beginProcessReality(getRealityProps(true));
        };
      }

      if (player.options.confirmations.exitChallenge) {
        Modal.exitChallenge.show(
          {
            challengeName: names.chall,
            normalName: names.normal,
            hasHigherLayers: this.inPelle || this.activeChallengeNames.length > 1,
            exitFn: clickFn
          }
        );
      } else {
        clickFn();
      }
    },
    // Bring the player to the tab related to the innermost challenge
    textClicked() {
      if (this.activeChallengeNames.length === 0) return;

      // Iterating back-to-front and breaking ensures we get the innermost restriction
      let fullName = "", celestial = "";
      for (let i = this.activityTokens.length - 1; i >= 0; i--) {
        const token = this.activityTokens[i];
        const part = this.parts[i];
        if (!part.isActive(token)) continue;
        fullName = part.name(token);
        celestial = part.tabName?.();
        break;
      }

      // Normal challenges are matched with an end-of-string metacharacter
      if (fullName.match(" Challenge$")) Tab.challenges.normal.show(true);
      else if (fullName.match("Infinity Challenge")) Tab.challenges.infinity.show(true);
      else if (fullName.match("Eternity Challenge")) Tab.challenges.eternity.show(true);
      else if (player.dilation.active) Tab.eternity.dilation.show(true);
      else Tab.celestials[celestial].show(true);
    },
    exitDisplay() {
      if (Player.isInAnyChallenge) return player.options.retryChallenge ? "Retry Challenge" : "Exit Challenge";
      if (player.dilation.active) return "Exit Dilation";
      if (this.resetCelestial) return "Restart Reality";
      return "Exit Reality";
    },
    challengeCaps() {
      const challengeID = player.challenge.eternity.current;
      if (challengeID === 25) return 1;
      if (challengeID > 18) return 5;
      if (challengeID > 12) return 5 + Effects.sum(EternityChallenge(19).reward).toNumber();
      return 5 + Effects.sum(EternityChallenge(14).reward, EternityChallenge(19).reward).toNumber();
    },
    textClassObject() {
      return {
        "l-challenge-display": true,
        "l-challenge-display--clickable": this.activeChallengeNames.length !== 0,
      };
    }
  },
};
</script>

<template>
  <div
    v-if="isVisible"
    class="l-game-header__challenge-text"
  >
    <span
      :class="textClassObject()"
      @click="textClicked"
    >
      You are currently in {{ challengeDisplay }}
    </span>
    <FailableEcText v-if="isInFailableEC" />
    <span class="l-padding-line" />
    <PrimaryButton
      v-if="showExit"
      @click="exitButtonClicked"
    >
      {{ exitText }}
    </PrimaryButton>
  </div>
</template>

<style scoped>
.l-game-header__challenge-text {
  display: flex;
  height: 2rem;
  top: 50%;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-text);
  margin: 0.5rem;
}

.l-challenge-display {
  padding: 0.5rem;
  cursor: default;
}

.l-challenge-display--clickable {
  cursor: pointer;
  user-select: none;
}

.l-challenge-display--clickable:hover {
  text-decoration: underline;
}

.l-padding-line {
  padding: 0.3rem;
}
</style>
