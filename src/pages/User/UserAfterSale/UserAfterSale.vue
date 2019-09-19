<template>
  <div class="user-after-sale">
      <nav-bar title="售后服务" @back="back"></nav-bar>
  </div>
</template>
<script>
import NavBar from 'base/NavBar/NavBar'
export default {
    data() {
        return {
            
        }
    },
    methods: {
        back(){
            this.$router.back()
        }
    },
    components: {
        NavBar
    }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';
.user-after-sale {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  background: $color-background;
}
</style>
