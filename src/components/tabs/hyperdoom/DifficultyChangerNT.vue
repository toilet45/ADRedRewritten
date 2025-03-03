<script>
export default {
  name: "DifficultyChanger",
  props: {
    difficultyCap: {
      type: Number,
      required: true
    },
    // eslint-disable-next-line line-comment-position, no-inline-comments
    id: { // In the form of xy, where x is row and y is column
      type: Number,
      required: true
    }
  },
  data() {
    return {
      currentSetting: 0
    };
  },
  computed: {
    styleObject() {
      return {
        "background-position": `-${((this.id - 1) % 6) * 160}px -${(Math.floor((this.id - 1) / 6)) * 160}px`
      };
    },
    classObject() {
      return {
        "o-hyperdoom": true,
        "o-hyperdoom-images": true
      };
    },
  },
  methods: {
    increaseDifficulty() {
      this.currentSetting = Math.clampMax(this.currentSetting += 1, difficultyCap);
    },
    decreaseDifficulty() {
      this.currentSetting = Math.clampMin(this.currentSetting -= 1, 0);
    }
  }
};
</script>

<template>
  <div>
    <svg
      height="6.15rem"
      width="7.5rem"
      viewbox="9, 9, 52, 52"
    >
      <path
        fill="none"
        stroke="var(--color-pelle--base)"
        d="
M 15.625 45
L 25 20
C 25,20 32.5,0 40,20
L 49.375 45
C 49.375,45 55,60 40,60
L 25 60
C 25,60 10,60 15.625,45z
       "
      />
    </svg><br>
    <div
      :style="styleObject"
      :class="classObject"
    /><br>
    <svg
      height="36.15rem"
      width="57.5rem"
      viewbox="9, 9, 52, 52"
    >
      <path
        fill="none"
        stroke="var(--color-pelle--base)"
        d="
M 15.625 25
L 25 50
C 25,50 32.5,70 40,50
L 49.375 25
C 49.375,25 55,10 40,10
L 25 10
C 25,10 10,10 15.625,25z
       "
      />
    </svg>
  </div>
</template>