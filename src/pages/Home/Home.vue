<template>
  <div class="home">
    <div class="search-box-wrapper">
      <van-search
        v-model="value"
        class="van-hairline--bottom"
        placeholder="请输入搜索关键词"
        show-action
        shape="round"
        @search="onSearch"
        @cancel="onCancel"
        @click="toSearch"
      />
    </div>
    <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
      <scroll
        class="scroll-wrapper"
        :data="goodsList"
        ref="scroll"
        @pull-down-handler="reFresh"
        @load="loadMore"
        :has-more="hasMore"
        :pull-up="true"
        :listen-scroll="true"
        @scroll="scroll"
      >
        <div class="scroll-content">
          <div class="slide-wrapper" v-if="slideImages.length">
            <slider ref="slide">
              <div v-for="(item,index) in slideImages" :key="index" @click="goToDetail(item)">
                <img :src="item.full" @click="test" alt />
              </div>
            </slider>
          </div>
          <van-grid :column-num="5">
            <van-grid-item
              v-for="item in classList"
              :key="item.goodsClassId"
              :icon="item.fullImage"
              :text="item.className"
              :to="{path:'/searchCategory',query:{goodsClassId:item.goodsClassId,title:item.className}}"
            />
          </van-grid>
          <goods-list :goods-list="goodsList" @selected="selectGoods"></goods-list>
          <!-- <goods-list :goods-list="recommendList" @selected="selectGoods"></goods-list> -->
          <!-- <div class="pullup-wrapper">
          <div v-if="!isPullUpLoad" class="before-trigger">
            <span class="pullup-txt">{{ pullUpText }}</span>
          </div>
          <div v-else class="after-trigger">
            <van-loading size="24px">加载中...</van-loading>
          </div>
          </div>-->
        </div>
      </scroll>
    </van-pull-refresh>
    <transition name="van-slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { ERR_OK } from "api/config";
import Goods from "common/js/goods";
import {
  getSlideImages,
  getRecommendList,
  getTest,
  getTest1,
  getGoodsList,
  getClassList
} from "api/index.js";
import Slider from "base/slider/slider";
import Scroll from "base/Scroll/Scroll";
import Vue from "vue";
import { Search, Grid, GridItem, List, Loading, PullRefresh } from "vant";
import GoodsList from "components/GoodsList/GoodsList";
//监听 返回事件
import { listenBack } from "common/js/app.js";

export default {
  name: "home",
  data() {
    return {
      slideImages: [], //轮播图列表
      recommendList: [],
      goodsList: [], //商品列表
      classList: [], //分类列表
      value: "", //
      currentPage: 1, //查询的当前页数
      loading: false, //
      finished: false, //
      hasMore: true, //判断是否 还有更多的值
      immediateCheck: false,
      isLoading: false,
      disabled: false,
      isPullUpLoad: false, //是否上拉刷新
      pullUpText: "上拉加载更多..."
    };
  },
  beforeRouteEnter(to, from, next) {
    console.log("附近的萨克雷");
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (from.path.indexOf("login") != -1) {
        console.log("来自 登录");
        vm.currentPage = 1;
        vm.goodsList = [];
        vm._getGoodsList();
        vm._getClassList();
      }
    });
  },
  created() {
    //获得轮播图图片列表
    this._getSlideImages();
    listenBack();
    //this._getRecommendList();
    //获取商品列表
    //this.goodsList.splice(0);
    this._getGoodsList();
    //获取商品分类列表
    this._getClassList();
    //this._getTest();
    //this._getTest1();
  },
  mounted() {},
  methods: {
    test(finishPullDown) {
      setTimeout(() => {
        finishPullDown();
      }, 300);
    },
    //监听 scroll的变化
    //因为和scroll组件和pullrefresh冲突 所以有了这么一个恶心的方法
    scroll(pos) {
      this.scrollY = pos.y;
      //console.log(pos.y);
      //当y的滚动距离大于-10时 让下拉刷新 启动
      if (pos.y >= -10) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    onRefresh() {
      this.currentPage = 1;
      this.hasMore = true;
      this.goodsList.splice(0);
      this._getClassList();
      this._getSlideImages();
      this._getGoodsList(() => {
        this.isLoading = false;
      });
    },
    reFresh(finishPullDown) {
      this._getGoodsList(finishPullDown);
    },
    //点击轮播图 去商品详情
    goToDetail(item) {
      console.log(item);
      if (item.type !== "goods") {
        return;
      }
      this.$router.push({
        path: `/home/goodsDetail/${item.value}`,
        query: {
          ParentPath: "home"
        }
      });
    },
    _getSlideImages() {
      getSlideImages().then(res => {
        //console.log(res);
        if (res.code === ERR_OK) {
          this.slideImages = res.data.carousel;
          console.log(res);
        }
      });
    },
    _getRecommendList() {
      getRecommendList().then(res => {
        if (res.code === ERR_OK) {
          this.recommendList.push(...res.data);
        }
      });
    },
    //获取推荐商品列表
    _getGoodsList(finishPullDown) {
      let params = {
        byDefault: 1,
        current: this.currentPage
      };
      console.log(params);
      getGoodsList(params)
        .then(res => {
          if (res.code === 0) {
            console.log(res);
            res.data.list.forEach(item => {
              this.goodsList.push(
                new Goods({
                  goodsId: item.goodsCommonId,
                  desc: item.goodsName,
                  imgUrl: item.fullImage,
                  price: item.sellPrice,
                  oldPrice: item.costPrice,
                  discount: item.discount
                })
              );
            });
            this.$nextTick(() => {
              this.goodsList = this.goodsList.slice(0);
            });

            if (finishPullDown) {
              this.$nextTick(() => {
                finishPullDown();
              });
            }
          }
        })
        .catch(err => {
          finishPullDown && finishPullDown();
        });
    },
    _getTest() {
      getTest().then(res => {
        console.log(res);
      });
    },
    _getTest1() {
      getTest1().then(res => {
        console.log(res);
      });
    },
    _getClassList(finishPullDown) {
      getClassList().then(res => {
        if (res.code === 0) {
          this.classList = res.data;
          if (finishPullDown) {
            this.$nextTick(() => {
              finishPullDown();
            });
          }
        }
      });
    },
    loadMore(callback) {
      if (!this.hasMore) {
        this.pullUpText = "别拉了！到底了...";
        return;
      }
      //开启上拉刷新
      //this.isPullUpLoad = true;
      //当前页加一
      this.currentPage++;
      let params = {
        byDefault: 1,
        current: this.currentPage
      };
      getGoodsList(params).then(res => {
        if (res.code === 0) {
          //如果获取 数据为0 则为没有更多的数据
          if (res.data.list.length === 0) {
            this.hasMore = false;
          }
          res.data.list.forEach(item => {
            this.goodsList.push(
              new Goods({
                goodsId: item.goodsCommonId,
                desc: item.body,
                imgUrl: item.image,
                price: item.sellPrice,
                oldPrice: item.costPrice,
                discount: item.discount
              })
            );
          });
          /* //结束上拉刷新
          this.$refs.scroll.finishPullUp();
          //让scroll重新渲染
          this.$refs.scroll.refresh();
          //结束上拉刷新
          this.isPullUpLoad = false; */

          //结束上拉刷新的回调函数
          callback();
        }
      });
    },
    //选中商品
    selectGoods(goodsId) {
      this.$router.push({
        path: `/home/goodsDetail/${goodsId}`,
        query: {
          ParentPath: "home"
        }
      });
    },
    onSearch() {
      console.log("search");
    },
    onCancel() {
      console.log("cancel");
    },
    //图片加载时 重新刷新 萝卜兔
    ImgLoad() {
      this.$refs.slide.refresh();
    },
    //跳转到search页面进行搜索
    toSearch() {
      this.$router.push({
        path: "/search",
        query: {
          isFocus: true
        }
      });
    }
  },
  watch: {
    /* $route(to, from) {
      console.log("1111");
      console.log(from);
      if (from.path.indexOf("login") != -1) {
        console.log("来自 登录");
        this.currentPage = 1;
        this.goodsList = [];
        let params = {
          byDefault: 1,
          current: this.currentPage
        };
        this._getGoodsList();
        this._getClassList();
      }
    } */
  },
  components: {
    [Search.name]: Search,
    [Grid.name]: Grid,
    [List.name]: List,
    [GridItem.name]: GridItem,
    [Loading.name]: Loading,
    [PullRefresh.name]: PullRefresh,
    Slider,
    GoodsList,
    Scroll
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.home {
  .van-pull-refresh {
    position: fixed;
    top: 54px;
    right: 0;
    bottom: 50px;
    left: 0;
    overflow: hidden;

    .van-pull-refresh__track {
      height: 100%;

      .scroll-wrapper {
        height: 100%;

        .scroll-content {
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
    }
  }
}
</style>
