<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from "@better-scroll/core";
import Pullup from "@better-scroll/pull-up";
import PullDown from "@better-scroll/pull-down";
import ObserveDom from "@better-scroll/observe-dom";
BScroll.use(Pullup)
  .use(PullDown)
  .use(ObserveDom);
export default {
  data() {
    return {};
  },
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: null
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    pullUp: {
      type: Boolean,
      default: false
    },
    pullDown: {
      type: Boolean,
      default: false
    },
    pullTop: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this._initBScroll();
  },
  methods: {
    _initBScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      //初始化betterScroll
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        observeDom: true,
        pullUpLoad: this.pullUp,
        bounce: {
          top: this.pullTop,
          bottom: true,
          left: true,
          right: true
        }
      });
      //监听滚动事件
      if (this.listenScroll) {
        //let me = this;
        //console.log('test')
        this.scroll.on("scroll", pos => {
          //console.log(pos)
          this.$emit("scroll", pos);
        });
      }
      //上拉刷新
      if (this.pullUp) {
        this.scroll.on("pullingUp", () => {
          this.$emit("load");
        });
      }

      //下拉刷新
      if (this.pullDown) {
        this.scroll.on("pullingDown", () => {
          this.$emit("pull-down-handler")
        });
      }
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    //刷新
    refresh() {
      //console.log('我刷新啦')
      this.scroll && this.scroll.refresh();
    },
    //结束上拉刷新
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    //滚动到指定位置
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    //滚动到底部
    scrollEnd() {
      this.scroll && this.scroll.scrollEnd();
    },
    //滚动到指定的dom对象
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  //监听 data的变化 让scroll 刷新
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, this.refreshDelay);
    }
  }
};
</script>