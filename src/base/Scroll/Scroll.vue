<template>
  <div ref="wrapper" class="scroll-wrapper-zujian">
    <div class="scroll-content-s" ref="content" id="content">
      <div class="pulldown-wrapper">
        <div class="before-trigger" v-show="posy>0&&beforePullDown">释放即可刷新...</div>
        <div v-show="!beforePullDown">
          <div v-show="isPullingDown">
            <van-loading size="24px">更新中...</van-loading>
          </div>
          <div v-show="!isPullingDown" class="loading-success">
            <span>刷新成功</span>
          </div>
        </div>
      </div>
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

const TIME_BOUNCE = 800;
const TIME_STOP = 300;
const THRESHOLD = 30;
const STOP = 24;
let STEP = 0;
export default {
  data() {
    return {
      isPullUpLoad: false, //是否正在上拉刷新
      isPullingDown: false, //是否正在上拉刷新
      beforePullDown: true,
      pullUpText: "上拉加载更多...", //上拉刷新开启时 底部提示文案
      posy: 0,
      hasMore1: this.hasMore,
      hasPllupTxt: false //判断是否有上拉的提示文字（当内容小于scroll的高度 则不用提示文字）
    };
  },
  created() {
    this.scroll = null;
    this.hasMore1 = true;
  },
  props: {
    probeType: {
      type: Number,
      default: 3
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
      default() {
        return [];
      }
    },
    refreshDelay: {
      type: Number,
      default: 1000
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
    },
    imgList: {
      type: Array,
      default() {
        return [];
      }
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
        scrollY: true,
        observeDom: true,
        pullUpLoad: this.pullUp,
        bounce: {
          top: this.pullTop,
          bottom: true,
          left: true,
          right: true
        },
        preventDefaultException:{
          tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|DIV|IMG)$/
        },
        pullDownRefresh: {
          threshold: THRESHOLD,
          stop: STOP
        }
      });
      //监听滚动事件
      if (this.listenScroll || this.pullDown) {
        //let me = this;
        //console.log('test')
        this.scroll.on("scroll", pos => {
          //console.log(pos)
          this.posy = pos.y;
          //console.log(this.posy);
          this.$emit("scroll", pos);
        });
      }
      //上拉刷新
      if (this.pullUp) {
        let _this = this;
        this.scroll.on("pullingUp", () => {
          console.log("调用上拉刷新");
          //console.log(this.hasMore);
          if (!this.hasMore) {
            console.log("粗错啦");
          } else {
            _this.isPullUpLoad = true;
            _this.$emit("load", () => {
              console.log("上拉刷新回调函数");
              _this.scroll.finishPullUp();
              this.$nextTick(() => {
                _this.scroll.refresh();
              });
              _this.isPullUpLoad = false;
              //console.log(_this.isPullUpLoad);
            });
          }
        });
      }

      //下拉刷新
      if (this.pullDown) {
        this.scroll.on("pullingDown", () => {
          console.log("调用下拉刷新");
          this.beforePullDown = false;
          this.isPullingDown = true;
          this.$emit("pull-down-handler", () => {
            console.log("下拉刷新回调");
            this.isPullingDown = false;
            this.finishPullDown();
          });
        });
      }
    },
    async finishPullDown() {
      const stopTime = TIME_STOP;
      await new Promise(resolve => {
        setTimeout(() => {
          this.scroll.finishPullDown();
          resolve();
        }, stopTime);
      });
      setTimeout(() => {
        this.beforePullDown = true;
        this.scroll.refresh();
      }, TIME_BOUNCE);
    },
    disable() {
      this.scroll && this.scroll.disable();
    },
    enable() {
      this.scroll && this.scroll.enable();
    },
    //刷新
    refresh() {
      console.log("我刷新啦");
      this.$nextTick(() => {
        this.scroll && this.scroll.refresh();
      });
    },
    //结束上拉刷新
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    //滚动到指定位置
    scrollTo() {
      //console.log("无法");
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    //滚动到底部
    scrollEnd() {
      this.scroll.refresh();
      let clientHeight = this.$refs.content.clientHeight;
      let paramsArr = [0, -clientHeight, 1];
      this.scroll.scrollTo.apply(this.scroll, paramsArr);
      let tmp = [0, 1, 1];
      setTimeout(() => {
        this.scroll.scrollBy.apply(this.scroll, tmp);
      }, 20);
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
    data(newval, old) {
      /* //this.refresh();
      let _this = this;
      console.log(newval);
      //this.hasPllupTxt = newval.length === 0 ? false : true;
      //console.log(_this.$refs.wrapper.offsetHeight);
      this.$nextTick(() => {
        setTimeout(() => {
          //判断是否可以滚动
          _this.refresh();
          //console.log(_this.scroll.maxScrollY);
          console.log(_this.$refs.wrapper.offsetHeight);
          let maxY = -parseInt(_this.scroll.maxScrollY);
          console.log(maxY);
          if (!_this.scroll.maxScrollY) {
            this.hasPllupTxt = false;
          } else {
            this.hasPllupTxt = true;
          }
        }, this.refreshDelay);
      }); */
      this.$nextTick(() => {
        this.refresh();
        //判断是否可以滚动
        let wrapperHeight = this.$refs.wrapper.clientHeight;
        let contentHeight = this.$refs.content.clientHeight;
        if (contentHeight <= wrapperHeight) {
          this.hasPllupTxt = false;
          console.log(this.hasPllupTxt);
        } else {
          this.hasPllupTxt = true;
        }
      });
    },
    hasMore() {
      console.log(this.hasMore);
      if (!this.hasMore) {
        this.pullUpText = "别拉了,到底了...";
      } else {
        //this._initBScroll();
        this.scroll.openPullUp(true);
        this.pullUpText = "上拉加载更多...";
      }
    }
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.scroll-wrapper-zujian {
  .scroll-content-s {
    .pulldown-wrapper {
      text-align: center;
      line-height: 24px;
      color: $color-text-gray;

      .before-trigger {
        font-size: 14px;
      }

      .loading-success {
        font-size: 14px;
      }
    }

    .pullup-wrapper {
      text-align: center;
      line-height: 24px;
      color: $color-text-gray;

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