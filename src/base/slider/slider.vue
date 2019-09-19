<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item,index) in dots"
        :key="index"
        :class="{'active':currentPageIndex===index}"
      ></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { addClass } from "common/js/dom";
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
BScroll.use(Slide);

export default {
  name: "slider",
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      dots: [],
      slider: null,
      currentPageIndex: 0,
      playTimer: 0
    };
  },
  mounted() {
    this.timer = setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();
      window.addEventListener("resize", () => {
        this.slider.refresh();
        if (!this.slider) {
          return;
        }
        this._setSliderWidth(true);
        this.slider.refresh();
      });
    }, 20);
  },
  beforeDestroy() {
    clearTimeout(this.playTimer);
    clearTimeout(this.timer)
    this.slider.destroy();
  },
  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;

      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        addClass(child, "slider-item");

        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initSlider() {
      clearTimeout(this.playTimer);
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        slide: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        },
        useTransition: true,
        bounce: false,
        stopPropagation: true,
        probeType: 2
      });
      this.slider.on("scrollEnd", this._onScrollEnd);
      this.slider.on("beforeScrollStart", () => {
        clearTimeout(this.playTimer);
      });
      this.slider.on("scrollEnd", () => {
        this.autoGoNext();
      });
      this.slider.on("slideWillChange", page => {
        this.currentPageIndex = page.pageX;
      });
      this.slider.on("slideWillChange", page => {
        this.currentPageIndex = page.pageX;
      });
      this.autoGoNext();
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    },
    nextPage() {
      this.slider.next();
    },
    prePage() {
      this.slider.prev();
    },
    _onScrollEnd() {
      let pageIndex = this.slider.getCurrentPage().pageX;
      this.currentPageIndex = pageIndex;
      this.autoGoNext();
    },
    autoGoNext() {
      clearTimeout(this.playTimer);
      this.playTimer = setTimeout(() => {
        this.nextPage();
      }, this.interval);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slider {
  min-height: 1px;
  position: relative;
  width: 100%;
  overflow: hidden;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      display: inline-block;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      transform: translate3d(0, 0, 0);
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    left: 50%;
    bottom: 12px;
    transform: translateX(-50%);

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>