<template>
  <div class="no-result">
    <div class="img-wrapper" :class="imgCls">
      <slot></slot>
    </div>
    <div>
      <span class="text">{{ desc }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    desc: {
      type: String,
      default: "您还没有相关订单"
    },
    size: {
      type: String,
      default: "small"
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
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.no-result {
  text-align: center;
  margin: 10px 0;

  .img-wrapper {
    &.small {
      img {
        height: 32px;
        width: 32px;
      }
    }

    &.middle {
      img {
        height: 64px;
        width: 64px;
      }
    }

    &.large {
      img {
        height: 128px;
        width: 128px;
      }
    }
  }

  .text {
    font-size: $font-size-small;
  }
}
</style>
