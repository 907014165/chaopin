<template>
  <div class="nav-bar">
    <van-nav-bar
      :title="title"
      :right-text="rightText"
      :left-text="leftText"
      left-arrow
      @click-left="back"
      @click-right="onClickRight"
    />
  </div>
</template>
<script>
import { NavBar } from "vant";
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    leftText: {
      type: String,
      default: ""
    },
    rightText: {
      type: String,
      default: ""
    },
    leftArrow: {
      type: Boolean,
      default: false
    },
    fixed: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    zIndex: {
      type: Number,
      default: 1
    }
  },
  methods: {
    back() {
      this.$emit("back");
    },
    onClickRight() {
      this.$emit("onClickRight");
    }
  },
  components: {
    [NavBar.name]: NavBar
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.nav-bar {
  .van-icon {
    color: $color-text;
    font-size: $font-size-large;
  }

  .van-nav-bar__title {
    font-size: $font-size-large;
  }

  .van-nav-bar__text {
    color: #1e1e1e;
  }
}
</style>
