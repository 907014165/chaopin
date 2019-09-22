<template>
  <div class="home">
    <scroll
      class="scroll-wrapper"
      :data="recommendList"
      ref="scroll"
      @load="loadMore"
      :pull-up="true"
    >
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
import {
  getSlideImages,
  getRecommendList,
  getTest,
  getTest1
} from "api/index.js";
import Slider from "base/slider/slider";
import Scroll from "base/Scroll/Scroll";
import Vue from "vue";
import { Search, Grid, GridItem, List, Loading } from "vant";
import GoodsList from "components/GoodsList/GoodsList";

export default {
  data() {
    return {
      slideImages: [],
      recommendList: [],
      value: "",
      loading: false,
      finished: false,
      immediateCheck: false,
      isPullUpLoad: false,
      pullUpText: "上拉加载更多..."
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
        console.log(res)
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
    loadMore() {
      if (this.recommendList.length > 30) {
        this.pullUpText = '别拉了！到底了...'
        return;
      }
      this.isPullUpLoad = true;
      setTimeout(() => {
        getRecommendList().then(res => {
          if (res.code === ERR_OK) {
            this.recommendList.push(...res.data);
            this.$refs.scroll.finishPullUp();
            this.$refs.scroll.refresh();
            this.isPullUpLoad = false;
          }
        });
      }, 1000);
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
    [Search.name]:Search,
    [Grid.name]:Grid,
    [List.name]: List,
    [GridItem.name]:GridItem,
    [Loading.name]: Loading,
    Slider,
    GoodsList,
    Scroll
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
.home {
  .scroll-wrapper {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 50px;
    left: 0;

    .scroll-content {
      overflow: hidden;

      .pullup-wrapper {
        text-align: center;
        line-height 24px
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
