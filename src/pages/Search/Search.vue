<template>
  <transition name="van-slide-right">
    <div class="search">
      <div class="search-box-wrapper van-hairline--bottom">
        <search-box
          :keywords="value"
          @change="changeVal"
          @search="_getGoodsListByKeyWords"
          @focus="focus"
          @blur="blur"
        >
          <van-icon name="arrow-left" slot="label" @click="back"></van-icon>
        </search-box>
      </div>
      <div class="shortcutWrapper" v-show="toggleShow">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li
              v-for="(item,index) in hotKeys"
              class="item"
              :key="index"
              @click="setQuery(item.keyword)"
            >
              <span>{{ item.keyword }}</span>
            </li>
          </ul>
        </div>
        <div class="search-history">
          <h1 class="title">
            <h1 class="text">搜索历史</h1>
            <span class="clear" v-show="deleteShow" @click="toggleDelete">
              <van-icon class-prefix="iconfont" name="icon-del" />
            </span>
            <transition name="van-slide-right">
              <div class="delete" v-show="!deleteShow">
                <span class="delete-all" @click="deleteAll">全部删除</span>
                <span class="delete-complete" @click="deleteComplete">完成</span>
              </div>
            </transition>
          </h1>
          <ul>
            <li
              v-for="(item,index) in getSearchHistory"
              class="item"
              :key="index"
              @click="setQuery(item)"
            >
              <span>
                {{ item }}
                <van-icon name="close" v-show="!deleteShow" @click="deleteSearchHistory(item)" />
              </span>
            </li>
          </ul>
        </div>
      </div>

      <goods-filter
        v-show="!toggleShow&&!isSearchIng"
        @shapeChanged="shapeChanged"
        @sortChanged="sortChanged"
      ></goods-filter>
      <transition name="van-fade">
        <Scroll
          class="scroll-wrapper"
          v-show="!toggleShow&&!isSearchIng"
          :data="goodsList"
          ref="scroll"
          @load="loadMore"
          :has-more="hasMore"
          :pull-up="true"
        >
          <div class="content-wrapper">
            <goods-list
              :goods-list="goodsList"
              :shape-type="showShape"
              v-if="!toggleShow"
              @selected="selectGoods"
            ></goods-list>
            <!-- <div class="pullup-wrapper">
            <div v-if="!isPullUpLoad" class="before-trigger">
              <span class="pullup-txt">{{ pullUpText }}</span>
            </div>
            <div v-else class="after-trigger">
              <van-loading size="24px">加载中...</van-loading>
            </div>
            </div>-->
          </div>
        </Scroll>
      </transition>
      <no-result v-show="noResult&&!isSearchIng">抱歉，没找到你想要的商品</no-result>

      <div class="loading-wrapper" v-show="isSearchIng">
        <van-loading size="24px" vertical>加载中...</van-loading>
      </div>

      <transition name="van-slide-right">
        <router-view></router-view>
      </transition>
    </div>
  </transition>
</template>
<script>
import SearchBox from "base/SearchBox/SearchBox";
import GoodsFilter from "base/GoodsFilter/GoodsFilter";
import GoodsList from "components/GoodsList/GoodsList";
import NoResult from "base/NoResult/NoResult";
import Scroll from "base/Scroll/Scroll";
import Goods from "common/js/goods.js";
import {
  getHotKey,
  getGoodsListByKeyWords,
  getSearchGoodsList
} from "api/search";
import { mapGetters, mapMutations } from "vuex";
import { Icon, Loading } from "vant";
export default {
  name: "search",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.init();
    });
  },
  data() {
    return {
      value: "", //搜素关键词
      hotKeys: [], //热词
      showShape: true, //商品列表 排列方式 true为两列 false为单列
      goodsList: [], //搜索结果列表
      goodsShow: false, //true 为focus false为blur focus显示热词 有点恶心 后期想想怎么优化
      isPullUpLoad: false, //上拉时 是否正在加载数据
      hasResult: true,
      hasMore: true,
      sortMap: ["byDefault", "bySaleNum", "byPrice", "byDiscount"],
      sortIndex: 1,
      sortOrder: 1, //1 降序
      currentPage: 1,
      deleteShow: true, //删除图标显示
      isSearchIng: false, //是否正在搜素
      noResult: false
    };
  },
  computed: {
    toggleShow() {
      if (
        (this.goodsShow || !this.goodsList.length) &&
        !this.isSearchIng &&
        !this.noResult
      ) {
        return true;
      } else {
        return false;
      }
    },
    ...mapGetters({
      getSearchHistory: "searchHistory"
    })
  },
  created() {
    this._getHotKey();
  },
  methods: {
    back() {
      this.$router.goBack();
    },
    //初始化数据
    init() {
      this.value = "";
      this.goodsList = [];
      this.currentPage = 1;
      //this._getGoodsListByKeyWords();
    },
    setQuery(key) {
      this.value = key;
      this._getGoodsListByKeyWords();
    },
    //输入框值发生改变的回调
    changeVal(val) {
      this.value = val;
      console.log(this.value);
    },
    //当列表类型发生改变的回调
    shapeChanged(curshape) {
      this.showShape = curshape;
      //解决scroll 组件在列表类型发生改变后 高度不能刷新的bug
      //这个方法很恶心 日后再想怎么解决
      this.goodsList = this.goodsList.slice(0);
    },
    sortChanged(data) {
      this.sortIndex = data.sort;
      this.sortOrder = data.order;
      this.currentPage = 1;
      this.hasMore = true;
      this.goodsList.splice(0);
      this._getGoodsListByKeyWords();
    },
    selectGoods(goodsId) {
      this.$router.push({
        path: `/search/goodsDetail/${goodsId}`,
        query: {
          ParentPath: "search"
        }
      });
    },
    focus() {
      this.goodsShow = true;
      this.isSearchIng = false;
      this.noResult = false;
      this.goodsList.splice(0);
      console.log("focus");
    },
    blur() {
      this.goodsShow = false;
      //this.isSearchIng = true;
      //this.noResult = true;
      console.log("blur");
    },
    loadMore(callback) {
      /* this.isPullUpLoad = true; */
      this._getMoreGoodsList(callback);
    },
    toggleDelete() {
      this.deleteShow = !this.deleteShow;
    },
    deleteAll() {
      this.clearSearchHistory();
      this.deleteShow = true;
    },
    deleteComplete() {
      this.deleteShow = true;
    },
    goodsFilterChanged() {},
    goodsTemplateChanged() {},
    _getHotKey() {
      getHotKey().then(res => {
        console.log(res);
        if (res.code === 0) {
          this.hotKeys = res.data;
          //this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    _getGoodsListByKeyWords() {
      console.log("search");
      this.setSearchHistory(this.value);
      this.isSearchIng = true;
      this.currentPage = 1;
      this.goodsList.splice(0);
      let params = {
        keyWord: this.value,
        current: this.currentPage
      };
      params[this.sortMap[this.sortIndex]] = this.sortOrder;
      getGoodsListByKeyWords(params).then(res => {
        if (res.code === 0) {
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
          this.noResult = res.data.list.length ? false : true;
          this.isSearchIng = false;
        }
        this.$nextTick(() => {
          this.goodsList = this.goodsList.slice(0);
        });
      });
    },
    _getMoreGoodsList(callback) {
      this.currentPage++;
      let params = {
        keyWord: this.value,
        current: this.currentPage
      };
      getGoodsListByKeyWords(params)
        .then(res => {
          if (res.code === 0) {
            if (res.data.list.length === 0) {
              this.hasMore = false;
            }
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
            /* //结束上拉刷新动作
          this.$refs.scroll.finishPullUp();
          //让scroll 刷新 重新计算dom高度
          this.$refs.scroll.refresh();
          //结束上拉刷新（控制显示提示字段）
          this.isPullUpLoad = false; */
            this.$nextTick(() => {
              this.goodsList = this.goodsList.slice(0);
            });
            if (callback) {
              this.$nextTick(() => {
                callback();
              });
            }
          }
          if (callback) {
            this.$nextTick(() => {
              callback();
            });
          }
        })
        .catch(err => {
          callback();
        });
    },
    ...mapMutations({
      setSearchHistory: "SET_SEARCH_HISTORY",
      clearSearchHistory: "CLEAR_SEARCH_HISTORY",
      deleteSearchHistory: "DELETE_SEARCH_HISTORY"
    })
  },
  components: {
    SearchBox,
    GoodsFilter,
    GoodsList,
    Scroll,
    NoResult,
    [Icon.name]: Icon,
    [Loading.name]: Loading
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.search {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  background: $color-background-w;

  .loading-wrapper {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .shortcutWrapper {
    width: 100%;

    .hot-key {
      margin: 15px 20px 20px 20px;

      .title {
        margin-bottom: 15px;
        font-size: $font-size-medium-x;
        color: $color-text;
      }

      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: #f0f2f5;
        font-size: $font-size-medium;
        color: #666;
      }
    }

    .search-history {
      margin: 15px 20px 20px 20px;
      position: relative;

      .title {
        display: flex;
        justify-content: space-between;
        font-size: $font-size-medium-x;
        color: $color-text;
        margin-bottom: 15px;

        .delete {
          position: absolute;
          right: 0;
          line-height: 16px;
          font-size: 10px;
          background: $color-background-w;

          .delete-complete {
            color: red;
            margin-left: 12px;
          }
        }
      }

      .item {
        display: inline-block;
        padding: 5px 10px;
        margin: 0 20px 10px 0;
        border-radius: 6px;
        background: #f0f2f5;
        font-size: $font-size-medium;
        line-height: 14px;
        color: #666;

        .van-icon-close {
          vertical-align: middle;
        }
      }
    }
  }

  .scroll-wrapper {
    position: fixed;
    top: 99px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: -1;
    overflow: hidden;

    .content-wrapper {
      .pullup-wrapper {
        height: 24px;

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

  .loading-wrapper {
    text-align: center;
    margin: auto;
  }
}
</style>
