<template>
  <div class="home">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="immediateCheck"
      @load="getSkuList"
    >
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
            <img :src="item.imgUrl" alt>
          </div>
        </slider>
      </div>
      <van-grid>
        <van-grid-item
          v-for="value in 4"
          :key="value"
          icon="//m.360buyimg.com/mobilecms/s120x120_jfs/t1/20983/16/10753/6124/5c8a16aaE5d6b15d7/01e0e818a7505267.png"
          text="文字"
        />
      </van-grid>
      <goods-list :goods-list="recommendList" @selected="selectGoods"></goods-list>
    </van-list>
    <transition name="van-slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { ERR_OK } from "api/config";
import {
  getSlideImages,
  getRecommendList,
  getTest,
  getTest1
} from "api/index.js";
import Slider from "base/slider/slider";
import Vue from "vue";
import { Search, Grid, GridItem, List } from "vant";
import GoodsList from "components/GoodsList/GoodsList";

Vue.use(Search)
  .use(Grid)
  .use(GridItem);
export default {
  data() {
    return {
      slideImages: [],
      recommendList: [],
      value: "",
      loading: false,
      finished: false,
      immediateCheck: false
    };
  },
  created() {
    this._getSlideImages();
    this._getRecommendList();
    //this._getTest();
    //this._getTest1();
  },
  methods: {
    _getSlideImages() {
      getSlideImages().then(res => {
        if (res.code === ERR_OK) {
          this.slideImages = res.data;
        }
      });
    },
    _getRecommendList() {
      getRecommendList().then(res => {
        if (res.code === ERR_OK) {
          this.recommendList = res.data;
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
    getSkuList() {
      setTimeout(() => {
        this.loading = false;
        this.finished = true;
        console.log("获取商品信息");
      }, 500);
    },
    selectGoods(goodsId) {
      this.$router.push({
        path: `/home/goodsDetail/${goodsId}`,
        query:{
          ParentPath:'home'
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
    [List.name]: List,
    Slider,
    GoodsList
  }
};
</script>
<style lang="stylus" scoped>
.home {
  .recommend-list-containner {
    
  }
}
</style>
