<template>
  <transition name="van-slide-right">
    <div class="content-wrapper-category">
      <nav-bar :title="title" @back="back"></nav-bar>
      <transition name="van-fade">
        <scroll
          class="search-category-wrapper"
          :data="goodsList"
          @load="loadMore"
          :has-more="hasMore"
          :pull-up="true"
          ref="scroll"
          :listen-scroll="true"
          :probe-type="3"
          v-show="this.goodsList.length"
          @scroll="scroll"
        >
          <div class="search-category">
            <banner ref="banner">
              <img :src="bannerImg" alt />
            </banner>
            <goods-filter
              @shapeChanged="shapeChanged"
              @sortChanged="sortChanged"
              :shape-type="currentShape"
              :key="1"
            ></goods-filter>
            <goods-list :goods-list="goodsList" :shape-type="currentShape" @selected="selectGoods"></goods-list>
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
      </transition>

      <!-- <div class="fixed-title" v-show="showFixedTitle">
        <goods-filter @shapeChanged="shapeChanged" :key="2"></goods-filter>
      </div>-->
      <div class="loading-wrapper" v-show="showLoading">
        <van-loading size="24px" vertical>加载中...</van-loading>
      </div>

      <transition name="van-slide-right">
        <router-view></router-view>
      </transition>
    </div>
  </transition>
</template>
<script>
import { Loading } from "vant";
import NavBar from "base/NavBar/NavBar";
import Banner from "base/Banner/Banner";
import GoodsFilter from "base/GoodsFilter/GoodsFilter";
import GoodsList from "components/GoodsList/GoodsList";
import Scroll from "base/Scroll/Scroll";
import { getRecommendList } from "api/index.js";
import { getSearchGoodsList } from "api/search.js";
import Goods from "common/js/goods.js";
export default {
  name: "searchCategory",
  data() {
    return {
      currentShape: true, //当前列表状态
      goodsList: [],
      sortIndex: 0,
      sortOrder: 1,
      hasMore: true,
      sortMap: ["byDefault", "bySaleNum", "byPrice", "byDiscount"],
      isPullUpLoad: false, //上拉时 是否正在加载数据
      pullUpText: "上拉加载更多...",
      bannerImg: null,
      pageY: 0,
      bannerDom: null,
      currentPage: 1,
      hasResult: false,
      title: this.$route.query.title
    };
  },
  props: {
    isBrand: {
      type: Boolean,
      default: false
    },
    isCategory: {
      type: Boolean,
      default: true
    }
  },
  created() {
    //this._getGoodsList();
    this._getSearchGoodsList();
  },
  destroyed() {
    console.log("应用销毁");
  },
  mounted() {
    this.bannerDom = this.$refs.banner.$el;
  },
  computed: {
    showFixedTitle() {
      if (this.bannerDom) {
        return Math.abs(this.pageY) > this.bannerDom.clientHeight
          ? true
          : false;
      } else {
        return false;
      }
    },
    showLoading() {
      if (!this.hasResult && !this.goodsList.length) {
        return false;
      } else {
        if (this.goodsList.length) {
          return false;
        }
        return true;
      }
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    scroll(pos) {
      this.pageY = pos.y;
      //console.log(this.showFixedTitle);
      //console.log(pos);
    },
    sortChanged(data) {
      this.sortIndex = data.sort;
      this.sortOrder = data.order;
      this.currentPage = 1;
      this.hasMore = true;
      this.goodsList = [];
      console.log("change");
      this._getSearchGoodsList();
    },
    shapeChanged(currentShape) {
      //console.log(currentShape);
      this.currentShape = currentShape;
      this.goodsList = this.goodsList.slice(0);
    },
    selectGoods(goodsId) {
      this.$router.push({
        path: `/searchCategory/goodsDetail/${goodsId}`
        /* query: {
          ParentPath: "/searchCategory"
        } */
      });
    },
    loadMore(callback) {
      /* this.isPullUpLoad = true; */
      if (!this.hasMore) {
        callback();
        return;
      }
      this.currentPage++;
      this._getMoreGoodsList(callback);
    },
    _getMoreGoodsList(callback) {
      let params = {
        goodsClassId: this.$route.query.goodsClassId,
        current: this.currentPage
      };
      params[this.sortMap[this.sortIndex]] = this.sortOrder;
      console.log(params);
      getSearchGoodsList(params)
        .then(res => {
          if (res.code === 0) {
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
            this.$nextTick(() => {
              this.goodsList = this.goodsList.slice(0);
            });
            /* this.$refs.scroll.finishPullUp();
          this.$refs.scroll.refresh();
          this.isPullUpLoad = false; */
            if (callback) {
              this.$nextTick(() => {
                callback();
              });
            }
          }
        })
        .catch(res => {
          callback();
        });
    },
    _getGoodsList() {
      getRecommendList().then(res => {
        if (res.code === 0) {
          this.goodsList = res.data;
          console.log(res.data);
        }
      });
    },
    _getSearchGoodsList() {
      let params = {
        goodsClassId: this.$route.query.goodsClassId,
        brandId: this.$route.query.brandId,
        current: this.currentPage
      };
      params[this.sortMap[this.sortIndex]] = this.sortOrder;
      console.log(params);
      getSearchGoodsList(params).then(res => {
        if (res.code === 0) {
          console.log(res);
          this.hasResult = res.data.list.length === 0 ? false : true;
          this.bannerImg = res.data.fullImage;
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
        }
      });
    }
  },
  watch: {
    bannerImg() {
      /* this.bannerDom = this.$refs.banner.$el; */
      console.log(this.bannerDom);
    }
  },
  components: {
    [Loading.name]: Loading,
    NavBar,
    Banner,
    GoodsFilter,
    GoodsList,
    Scroll
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.content-wrapper-category {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 30;

  .search-category-wrapper {
    position: fixed;
    left: 0;
    top: 46px;
    right: 0;
    bottom: 0;
    overflow: hidden;
    background: $color-background;

    .search-category {
      .fixed-title {
        position: fixed;
        left: 0;
        right: 0;
        top: 46px;
      }

      .pullup-wrapper {
        text-align: center;

        .before-trigger {
          line-height: 24px;
          font-size: 14px;
          color: $color-text-gray;
        }
      }
    }

    .loading-wrapper {
      text-align: center;
      margin: auto;
    }
  }
}
</style>
