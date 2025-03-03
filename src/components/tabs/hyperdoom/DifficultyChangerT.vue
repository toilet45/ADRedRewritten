<script>
export default {
  name: "DifficultyChanger",
  props: {
    toggled: {
      type: Boolean,
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
      isToggled: 0
    };
  },
  computed: {
    styleObject() {
      return {
        "background-position": `-${((id - 1) % 6) * 320}px -${(Math.floor((id - 1) / 6)) * 320}px`
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
    toggle() {
      this.isToggled = !this.isToggled;
    }
  }
};
</script>

<template>
  <div>
    <div
      :style="styleObject"
      :class="classObject"
      @onclick="toggle"
    />
  </div>
</template>