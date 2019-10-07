<template>
  <div class="home">
    <scroll class="scroll-wrapper" :data="goodsList" ref="scroll" :has-more="hasMore" @load="loadMore" :pull-up="true">
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
            <div v-for="(item,index) in slideImages" :key="index" @click="goToDetail(item)"> 
              <img :src="`http://192.168.1.101:18052${item.image}`" @click="test" alt  />
            </div>
          </slider>
        </div>
        <van-grid :column-num="5">
          <van-grid-item
            v-for="item in classList"
            :key="item.goodsClassId"
            :icon="`http://192.168.1.53:9090/${item.posterImage}`"
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
        </div> -->
      </div>
    </scroll>
    <transition name="van-slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
document.addEventListener("plusready", function() {
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
              plus.nativeUI.toast('再按一次退出应用');
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
});

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
      value: "", //
      currentPage: 1, //查询的当前页数
      loading: false, //
      finished: false, //
      hasMore: true, //判断是否 还有更多的值
      immediateCheck: false,
      isPullUpLoad: false, //是否上拉刷新
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
  mounted() {},
  methods: {
    test(){
      console.log('测试')
    },
    //点击轮播图 去商品详情
    goToDetail(item){
      console.log(item)
      if(item.type!=='goods'){
        return ;
      }
      this.$router.push({
        path: `/home/goodsDetail/${item.value}`,
        query: {
          ParentPath: "home"
        }
      })
    },
    _getSlideImages() {
      getSlideImages().then(res => {
        //console.log(res);
        if (res.code === ERR_OK) {
          this.slideImages = res.data.carousel;
          console.log(res)
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
    _getGoodsList() {
      let params = {
        byDefault: 1,
        current: this.currentPage
      };
      console.log(params);
      getGoodsList(params).then(res => {
        if (res.code === 0) {
          console.log(res);
          res.data.list.forEach(item => {
            this.goodsList.push(
              new Goods({
                goodsId: item.goodsCommonId,
                desc: item.goodsName,
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
          callback()
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
