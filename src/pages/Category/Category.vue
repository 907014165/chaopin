<template>
  <div class="category">
    <div class="search-wrapper van-hairline--top-bottom">
      <van-search placeholder="请输入搜索关键词" show-action shape="round" @click="toSearch" />
    </div>
    <div class="content-wrapper" v-if="sliderList.length">
      <div class="content">
        <scroll class="slider-wrapper" ref="slide">
          <van-sidebar v-model="activeKey" @change="changeSlideItem">
            <van-sidebar-item
              v-for="(item,index) in sliderList"
              :key="index"
              :title="item.goodsClass.className"
              ref="slidelist"
            />
          </van-sidebar>
        </scroll>

        <div class="content-right">
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <banner v-if="currentCategory">
              <img :src="currentCategory.goodsClass.fullPosterImage" alt />
            </banner>
            <van-grid :border="false" :column-num="3" v-if="currentCategory">
              <van-grid-item
                v-for="category in currentCategory.brands"
                :to="{path:'/searchCategory',query:{goodsClassId:currentCategory.goodsClass.goodsClassId,brandId:category.brandId,title:category.brandName}}"
                :key="category.brandId"
              >
                <div class="item-content">
                  <van-image :src="category.fullLogo" />
                  <span class="text">{{ category.brandName }}</span>
                </div>
              </van-grid-item>
            </van-grid>
          </van-pull-refresh>
        </div>
      </div>
    </div>
    <div class="loading-wrapper" v-if="!sliderList.length">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
  </div>
</template>
<script>
import {
  Sidebar,
  SidebarItem,
  Grid,
  GridItem,
  Image,
  Search,
  Loading,
  PullRefresh
} from "vant";
import Scroll from "base/Scroll/Scroll";
import Banner from "base/Banner/Banner";
import { getCategoryList, getBrands } from "api/category.js";
import { listenBack } from "common/js/app.js";
//监听 返回事件
/* document.addEventListener("plusready", function() {
  var webview = plus.webview.currentWebview();
  plus.key.addEventListener("backbutton", function() {
    webview.canBack(function(e) {
      if (e.canBack) {
        webview.back();
      } else {
        //webview.close(); //hide,quit
        //plus.runtime.quit();
        //首页返回键处理
        //处理逻辑：1秒内，连续两次按返回键，则退出应用；
        var first = null;
        plus.key.addEventListener(
          "backbutton",
          function() {
            //首次按键，提示‘再按一次退出应用’
            if (!first) {
              first = new Date().getTime();
              plus.nativeUI.toast("再按一次退出应用");
              setTimeout(function() {
                first = null;
              }, 1000);
            } else {
              if (new Date().getTime() - first < 1500) {
                plus.runtime.quit();
              }
            }
          },
          false
        );
      }
    });
  });
}); */
export default {
  name: "category",
  data() {
    return {
      activeKey: 0,
      keywords: "",
      sliderList: [], //分类的数组
      slideMid: 5, //
      currentIndex: 0, //当前分类的下标
      isLoading: false
    };
  },
  created() {
    this._getCategoryList();
    listenBack();
    //this._getBrands()
  },
  mounted() {
    this.timer = setTimeout(() => {
      window.addEventListener("resize", () => {
        let slideWrapper = this.$refs.slide.$el.clientHeight;
        let slideChild = this.$refs.slidelist[0].$el.clientHeight;
        this.slideMid = Math.floor(slideWrapper / slideChild / 2);
      });
    }, 20);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  computed: {
    currentCategory() {
      return this.sliderList[this.currentIndex];
    }
  },
  methods: {
    search() {
      console.log("search");
    },
    onRefresh() {
      this._getCategoryList(() => {
        this.isLoading = false;
      });
    },
    toSearch() {
      this.$router.push({
        path: "/search",
        query: {
          isFocus: true
        }
      });
    },
    changeSlideItem(index) {
      if (index > this.slideMid) {
        let currentSlideItem = this.$refs.slidelist[index - this.slideMid].$el;
        this.$refs.slide.scrollToElement(currentSlideItem, 1000);
      } else {
        this.$refs.slide.scrollTo(0, 0, 1000);
      }
      //改变当前 选中的下标
      this.currentIndex = index;
    },
    _getCategoryList(finishPullDown) {
      getCategoryList().then(res => {
        if (res.code === 0) {
          this.sliderList = res.data;
          finishPullDown && finishPullDown();
        }
      });
    },
    _getBrands() {
      let params = {
        brands: [1, 2, 3]
      };
      getBrands(params).then(res => {
        console.log(res);
      });
    }
  },
  components: {
    [Sidebar.name]: Sidebar,
    [SidebarItem.name]: SidebarItem,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [Image.name]: Image,
    [Search.name]: Search,
    [Loading.name]: Loading,
    [PullRefresh.name]: PullRefresh,
    Scroll,
    Banner
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.category {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  z-index: 1;

  .content-wrapper {
    position: fixed;
    top: 54px;
    bottom: 50px;
    left: 0;
    right: 0;
    overflow-y: scroll;

    .content {
      position: relative;
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;

      .slider-wrapper {
        height: 100%;
        overflow: hidden;
        flex: 0 0 85px;

        .van-sidebar, .van-hairline--top-bottom {
          .van-sidebar-item, .van-hairline {
            padding: 15px 12px 15px 8px;

            .van-sidebar-item__text {
              position: static;
            }
          }
        }
      }

      .content-right {
        flex: 1;
        width: 100%;
        background: $color-background-w;

        .van-pull-refresh {
          height: 100%;

          .van-pull-refresh__track {
            height: 100%;
          }
        }

        .item-content {
          text-align: center;

          .text {
            font-size: $font-size-small;
          }
        }
      }
    }
  }
}
</style>
