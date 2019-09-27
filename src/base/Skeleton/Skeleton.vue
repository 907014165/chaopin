<template>
  <div class="skeleton-wrapper">
    <div class="img"></div>
    <div class="content">
      <van-skeleton title :row="2" />
      <div class="favorite">

        </div>
    </div>
    <div class="content">
      <van-skeleton title :row="3" />
    </div>
    <div class="bottom"></div>
  </div>
</template>
<script>
import { Skeleton } from "vant";
export default {
    components: {
        [Skeleton.name]:Skeleton
    }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

@keyframes flicker {
  0% {
    background: #F3F4F6;
  }

  100% {
    background: #FFFFFF;
  }
}

.skeleton-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: $color-background-w;

  .content {
    margin: 10px 0 20px 0;
    position relative
    .favorite {
        position absolute 
        right 20px
        top 0
        width 20px
        height 20px
        background #F3F4F6
      }
  }

  .img {
    padding-top: 100%;
    background: #F3F4F6;
    animation: flicker 2s linear infinite;
  }

  .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 50px;
    width: 100%;
    background: #F3F4F6;
  }
}
</style>