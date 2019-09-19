<template>
  <div class="user-favorite">
    <nav-bar title="我的收藏" @back="back"></nav-bar>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
export default {
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.back();
    }
  },
  components: {
    NavBar
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.user-favorite {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  background: $color-background;
}
</style>
