<template>
  <div class="banner" @click="clickItem">
    <slot></slot>
  </div>
</template>
<script>
export default {
  methods: {
    clickItem() {
      this.$emit("click");
    }
  }
};
</script>
<style lang="stylus">
.banner {
  font-size: 0;

  img {
    width: 100%;
  }
}
</style>
