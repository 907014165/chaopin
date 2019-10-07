<template>
  <div ref="wrapper" class="scroll-wrapper-zujian">
    <div class="scroll-content-s">
      <slot></slot>
      <template v-if="hasPllupTxt">
        <div class="pullup-wrapper" v-if="pullUp">
          <div v-show="!isPullUpLoad" class="before-trigger">
            <span class="pullup-txt">{{ pullUpText }}</span>
          </div>
          <div v-show="isPullUpLoad" class="after-trigger">
            <van-loading size="24px">加载中...</van-loading>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import BScroll from "@better-scroll/core";
import Pullup from "@better-scroll/pull-up";
import PullDown from "@better-scroll/pull-down";
import ObserveDom from "@better-scroll/observe-dom";
import { Loading } from "vant";
BScroll.use(Pullup)
  .use(PullDown)
  .use(ObserveDom);
export default {
  data() {
    return {
      isPullUpLoad: false, //是否正在上拉刷新
      pullUpText: "上拉加载更多...", //上拉刷新开启时 底部提示文案
      scroll: null,
      hasPllupTxt: true //判断是否有上拉的提示文字（当内容小于scroll的高度 则不用提示文字）
    };
  },
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    //是否 开启点击事件
    click: {
      type: Boolean,
      default: true
    },
    //是否监听滚动事件
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
    //是否开启上拉刷新
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
    },
    //是否还可以上拉刷新
    hasMore: {
      type: Boolean,
      default: true
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
        let _this = this;
        this.scroll.on("pullingUp", () => {
          console.log("调用上拉刷新");
          //console.log(this.hasMore);
          if (this.hasMore) {
            _this.isPullUpLoad = true;
            _this.$emit("load", () => {
              console.log("上拉刷新回调函数");
              _this.scroll.finishPullUp();
              _this.scroll.refresh();
              _this.isPullUpLoad = false;
              //console.log(_this.isPullUpLoad);
            });
          }
        });
      }

      //下拉刷新
      if (this.pullDown) {
        this.scroll.on("pullingDown", () => {
          this.$emit("pull-down-handler");
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
  components: {
    [Loading.name]: Loading
  },
  //监听 data的变化 让scroll 刷新
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
        //判断是否可以滚动
        console.log(this.scroll.maxScrollY)
        if (!this.scroll.maxScrollY) {
          this.hasPllupTxt = false;
        } else {
          this.hasPllupTxt = true;
        }
      }, this.refreshDelay);
    },
    hasMore() {
      console.log(this.hasMore)
      if (!this.hasMore) {
        this.pullUpText = "别拉了,到底了...";
      }else{
        this._initBScroll()
        this.pullUpText = '上拉加载更多...'
      }
    }
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.scroll-wrapper-zujian {
  .scroll-content-s {
    .pullup-wrapper {
      text-align: center;
      line-height: 24px;

      .before-trigger {
        text-align: center;
        font-size: $font-size-medium;
      }

      .after-trigger {
        height: 24px;
        text-align: center;
      }
    }
  }
}
</style>