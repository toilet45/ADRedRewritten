<script>
export default {
  name: "UniversalDamageTab",
  components: {
  },
  data() {
    return {
      damaged: false,
    };
  },
  computed: {
    runButtonClassObject() {
      return {
        "c-universal-damage-button__icon": true,
        "c-universal-damage-button__icon--running": this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runDescription() {
      return GameDatabase.celestials.descriptions[9].effects();
    }
  },
  methods: {
    update() {
      this.damaged = Laitela.isDamaged;
    },
  }
};
</script>

<template>
  <div class="l-teresa-celestial-tab">
    <div class="l-mechanics-container">
      <div
        v-if="true"
      >
        <div class="c-universal-damage c-universal-damage-run-button">
          <div class="flex">
            <span :class="{ 'o-pelle-disabled': isDoomed }">
              Begin Universal Damage
            </span>
          </div>
          <div
            :class="runButtonClassObject"
            @click="startRun()"
          >
            Ϟ
          </div>
          {{ runDescription }}
          <br><br>
          <div>
            Gain Dark Credits and Credits on exit, based on Dark Matter and Antimatter respectively.
          </div>
        </div>
      </div>
      <div
        v-if="false"
        class="c-teresa-shop"
      >
        <span class="o-teresa-pp">
          You have {{ quantify("Perk Point", 4, 2, 0) }}.
        </span>
        <PerkShopUpgradeButton
          v-for="upgrade in upgrades"
          :key="upgrade.id"
          :upgrade="upgrade"
        />
      </div>
      <div
        v-else
        class="l-rm-container-labels l-teresa-mechanic-container"
      />
    </div>
  </div>
</template>

<style scoped>
</style>
