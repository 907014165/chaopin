<template>
  <div class="home">
    <scroll class="scroll-wrapper" :data="goodsList" ref="scroll" @load="loadMore" :pull-up="true">
      <div class="scroll-content">
        <div class="search-box-wrapper">
          <van-search
            v-model="value"
            placeholder="请输入搜索关键词"
            show-action
            shape="round"
            @search="onSearch"
            @cancel="onCancel"
            @click="toSearch"
          />
        </div>
        <div class="slide-wrapper" v-if="slideImages.length">
          <slider ref="slide">
            <div v-for="(item,index) in slideImages" :key="index">
              <img :src="item.imgUrl" alt />
            </div>
          </slider>
        </div>
        <van-grid :column-num="5">
          <van-grid-item
            v-for="item in classList"
            :key="item.goodsClassId"
            :icon="`http://192.168.1.53:9090/${item.posterImage}`"
            :text="item.className"
            :to="{path:'/searchCategory',query:{goodsClassId:item.goodsClassId}}"
          />
        </van-grid>
        <goods-list :goods-list="goodsList" @selected="selectGoods"></goods-list>
        <!-- <goods-list :goods-list="recommendList" @selected="selectGoods"></goods-list> -->
        <div class="pullup-wrapper">
          <div v-if="!isPullUpLoad" class="before-trigger">
            <span class="pullup-txt">{{ pullUpText }}</span>
          </div>
          <div v-else class="after-trigger">
            <van-loading size="24px">加载中...</van-loading>
          </div>
        </div>
      </div>
    </scroll>
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
import { Search, Grid, GridItem, List, Loading } from "vant";
import GoodsList from "components/GoodsList/GoodsList";

export default {
  data() {
    return {
      slideImages: [], //轮播图列表
      recommendList: [],
      goodsList: [], //商品列表
      classList: [], //分类列表
      value: "",//
      currentPage: 1,//查询的当前页数
      loading: false,//
      finished: false,//
      hsaMore: true, //判断是否 还有更多的值
      immediateCheck: false,
      isPullUpLoad: false,//是否上拉刷新
      pullUpText: "上拉加载更多..."
    };
  },
  created() {
    //获得轮播图图片列表
    this._getSlideImages();
    //this._getRecommendList();
    //获取商品列表
    this._getGoodsList();
    //获取商品分类列表
    this._getClassList();
    //this._getTest();
    //this._getTest1();
  },
  mounted() {
    
  },
  methods: {
    _getSlideImages() {
      getSlideImages().then(res => {
        console.log(res);
        if (res.code === ERR_OK) {
          this.slideImages = res.data;
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
    _getGoodsList() {
      let params = {
        byDefault: 1,
        current: this.currentPage
      };
      console.log(params)
      getGoodsList(params).then(res => {
        if (res.code === 0) {
          console.log(res);
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
        }
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
    _getClassList() {
      getClassList().then(res => {
        if (res.code === 0) {
          this.classList = res.data;
        }
      });
    },
    loadMore() {
      if (!this.hsaMore) {
        this.pullUpText = "别拉了！到底了...";
        return;
      }
      this.isPullUpLoad = true;
      this.currentPage++;
      let params = {
        byDefault: 1,
        current: this.currentPage
      };
      getGoodsList(params).then(res => {
        if (res.code === 0) {
          if (res.data.list.length === 0) {
            this.hsaMore = false;
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
          this.$refs.scroll.finishPullUp();
          this.$refs.scroll.refresh();
          this.isPullUpLoad = false;
        }
      });
    },
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
  components: {
    [Search.name]: Search,
    [Grid.name]: Grid,
    [List.name]: List,
    [GridItem.name]: GridItem,
    [Loading.name]: Loading,
    Slider,
    GoodsList,
    Scroll
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.home {
  .scroll-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 50px;
    left: 0;
    overflow: hidden;

    .scroll-content {
      overflow: hidden;

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
</style>
