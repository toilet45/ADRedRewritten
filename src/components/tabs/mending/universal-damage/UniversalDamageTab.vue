<script>
export default {
  name: "TimeExpansionTab",
  components: {
  },
  data() {
    return {
      damaged: false,
    };
  },
  computed: {

  },
  methods: {
    update() {
      this.damaged = Laitela.isDamaged;
    },
  }
};
</script>

<template>
  <div>PLACEHOLDER</div>
</template>

<style scoped>
</style>
