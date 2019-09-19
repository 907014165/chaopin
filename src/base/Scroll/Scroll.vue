<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>
<script>
import BScroll from "@better-scroll/core";
import Pullup from "@better-scroll/pull-up";
import ObserveDom from "@better-scroll/observe-dom";
BScroll.use(Pullup).use(ObserveDom);
export default {
  data() {
    return {
    };
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
      if (this.listenScroll) {
        //let me = this;
        //console.log('test')
        this.scroll.on("scroll", pos => {
          //console.log(pos)
          this.$emit("scroll", pos);
        });
      }
      if (this.pullUp) {
        this.scroll.on("pullingUp", () => {
          this.$emit("load");     
        });
      }
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollEnd() {
      this.scroll && this.scroll.scrollEnd();
    },
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