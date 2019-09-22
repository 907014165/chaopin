<template>
  <div class="user-info">
    <nav-bar title="账户设置" @back="back"></nav-bar>
    
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
<style lang="stylus">
@import '~common/stylus/variable.styl';
.user-info {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 50px;
  left: 0;
  z-index: 40;
  background: $color-background;
}
</style>
