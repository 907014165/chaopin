<template>
  <div class="no-result">
    <van-icon v-if="type===0" class-prefix="iconfont" name="icon-lab-kuqi" />
    <van-icon v-if="type===1" class-prefix="iconfont" name="icon-wujieguo" />
    <slot></slot>
  </div>
</template>
<script>
import { Icon } from "vant";
export default {
  props: {
    desc: {
      type: String,
      default: "您还没有相关订单"
    },
    size: {
      type: String,
      default: "small"
    },
    type: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    imgCls() {
      return this.size === "small"
        ? "small"
        : this.size === "middle"
        ? "middle"
        : this.size === "large"
        ? "large"
        : "small";
    }
  },
  components: {
    [Icon.name]: Icon
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.no-result {
  display: flex;
  justify-content: center;
  align-items: center;

  .iconfont {
    font-size: 60px;
  }

  font-size: $font-size-medium-x;
  color: $color-text-gray;
}
</style>
