<template>
  <transition name="van-slide-right">
    <div class="goods-detail-wrapper">
      <scroll class="goods-detail" :data="goods1.album" ref="scroll" v-if="goods1">
        <div class="content-wrapper">
          <div class="back" @click="back">
            <van-icon name="arrow-left" />
          </div>
          <van-swipe class="goods-swipe" :autoplay="3000" @change="onChange" v-if="goods1">
            <van-swipe-item v-for="(thumb,index) in goods1.album" :key="index">
              <img :src="thumb" />
            </van-swipe-item>
            <div class="custom-indicator" slot="indicator">{{ current + 1 }}/{{goods1.album.length}}</div>
          </van-swipe>
          <van-cell-group v-if="goods1">
            <van-cell>
              <div class="sub-title">
                <div class="goods-price">
                  <span class="new-price">{{ goods1.sellPrice }}</span>
                  <span class="old-price">{{ goods1.costPrice }}</span>
                </div>
                <div class="add-favorite" @click="_toggleFavorite">
                  <van-icon name="like-o" v-show="!isFavorite" />
                  <van-icon name="like" v-show="isFavorite" color="#f23030" />
                  <div class="info">收藏</div>
                </div>
              </div>
              <div class="goods-title">{{ goods1.goodsName }}</div>
            </van-cell>
            <van-cell class="goods-express">
              <van-col span="10">运费：{{ goods.express }}</van-col>
              <van-col span="14">剩余：{{ goods1.stocks }}</van-col>
            </van-cell>
            <van-cell class="goods-express" :center="true">
              <van-col span="2">服务</van-col>
              <van-col span="22" class="server">
                <van-icon name="passed" color="#f23030" />七天无理由退货
                <van-icon name="passed" color="#f23030" />48小时发货
              </van-col>
            </van-cell>
          </van-cell-group>

          <van-cell-group class="goods-cell-group">
            <van-cell icon="shop-o" is-link @click="sorry">
              <template slot="title">
                <span class="van-cell-text">潮品商城</span>
                <van-tag class="goods-tag" type="danger">官方</van-tag>
              </template>
            </van-cell>
            <!--  <van-cell title="线下门店" icon="location-o" is-link @click="sorry"/> -->
          </van-cell-group>

          <van-cell-group class="goods-cell-group">
            <van-cell :title="info" v-for="(info,index) in goods1.parameterList" :key="index"></van-cell>
            <!--  <van-cell title="线下门店" icon="location-o" is-link @click="sorry"/> -->
          </van-cell-group>

          <van-cell-group class="goods-cell-group">
            <van-cell :title="currentSelectSku" is-link @click="toggleShowSku" />
          </van-cell-group>
          <div class="comment-wrapper">
            <rating-header @click="lookMoreComment" :goodsCommonId="goods1.goodsCommonId"></rating-header>
            <rating-seller
              :is-all-ratings="false"
              :goods-common-id="goods1.goodsCommonId"
              @refresh="scrollRefresh"
            ></rating-seller>
            <div class="look-more">
              <van-button
                plain
                hairline
                type="default"
                round
                size="small"
                @click="lookMoreComment"
              >查看全部评论</van-button>
            </div>
          </div>
          <div class></div>
          <van-divider>商品详情展示</van-divider>
          <!-- 商品图片列表 -->
          <banner v-for="(imgSrc,index) in imgList" :key="index">
            <img :src="imgSrc" alt @load="refreshScroll" @click="showImgPreview(index)" />
          </banner>
        </div>
      </scroll>
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" @click="connectKefu">客服</van-goods-action-icon>
        <van-goods-action-icon icon="cart-o" @click="onClickCart">购物车</van-goods-action-icon>
        <van-goods-action-button type="warning" @click="clickShopCart">加入购物车</van-goods-action-button>
        <van-goods-action-button type="danger" @click="buy">立即购买</van-goods-action-button>
      </van-goods-action>
      <template v-if="goods1">
        <van-sku
          ref="sku"
          v-model="show"
          :sku="sku"
          :goods="goods_info"
          :goods-id="goods1.goodsCommonId"
          :hide-stock="skuData.sku.hide_stock"
          :quota="skuData.quota"
          :quota-used="skuData.quota_used"
          :initial-sku="initialSku"
          reset-stepper-on-hide
          reset-selected-sku-on-hide
          :close-on-click-overlay="closeOnClickOverlay"
          :custom-sku-validator="customSkuValidator"
          @sku-selected="currentSelect"
          @buy-clicked="onBuyClicked"
          @add-cart="onAddCartClicked"
        />
      </template>

      <transition name="van-slide-right">
        <router-view></router-view>
      </transition>
      <transition name="van-fade">
        <skeleton v-if="!goods1"></skeleton>
      </transition>
    </div>
  </transition>
</template>
<script>
import {
  Tag,
  Col,
  Icon,
  Cell,
  CellGroup,
  Swipe,
  Toast,
  SwipeItem,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Sku,
  Button,
  Divider,
  ImagePreview
} from "vant";
import Vue from "vue";
import Scroll from "base/Scroll/Scroll";
import skuData from "./data.js";
import Skeleton from "base/Skeleton/Skeleton";
import RatingSeller from "base/Ratings/RatingSeller";
import RatingHeader from "base/Ratings/RatingHeader";
import Banner from "base/Banner/Banner";
import { mapMutations, mapGetters } from "vuex";
import {
  getSkuById,
  getGoodsById,
  toggleFavorite,
  addShopCart
} from "api/goods.js";
import data from "./data.js";
import { listenBack } from "common/js/app.js";
Vue.use(ImagePreview);
export default {
  data() {
    return {
      current: 0,
      show: false,
      checkLoad: true,
      isFavorite: false,
      sku: {},
      goods_info: {
        
      },
      goods: {
        goodsId: 946755,
        title: "美国伽力果（约680g/3个）",
        price: 2680,
        express: "免运费",
        remain: 19,
        thumb: [
          "https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg",
          "https://img.yzcdn.cn/public_files/2017/10/24/1791ba14088f9c2be8c610d0a6cc0f93.jpeg"
        ]
      },
      imgList: [],
      goods1: null,
      selecSkuInfo: "",
      skuData: skuData,
      showCustom: false,
      showStepper: false,
      showSoldout: false,
      closeOnClickOverlay: true,
      customSkuValidator: () => "请选择商品!"
    };
  },
  created() {
    //listenBack();
  },
  mounted() {
    this._getSkuById();
    this._getGoodsById();
  },
  computed: {
    currentSelectSku() {
      if (JSON.stringify(this.sku) !== "{}") {
        let str = "已选  ";
        for (let i = 0; i < this.sku.tree.length; i++) {
          //console.log(this.initialSku[`s${i + 1}`]);
          let s = `s${i + 1}`;
          console.log(s);
          str += `${this.sku.tree[i].v[this.initialSku[s] - 1].name} `;
        }
        //return `已选  ${this.sku.tree[0].v[this.initialSku.s1 - 1].name},${this.sku.tree[1].v[this.initialSku.s2 - 1].name}`;
        return str;
      } else {
        return "选择规格";
      }
    },
    currentSelectSkuImg() {
      if (JSON.stringify(this.sku) !== "{}") {
        return `${this.sku.tree[0].v[this.initialSku.s1 - 1].imgUrl}`;
      } else {
        return "";
      }
    },
    initialSku() {
      let initSku = {};
      if (JSON.stringify(this.sku) != "{}") {
        let skuList = this.sku.list;
        for (let i = 0; i < skuList.length; i++) {
          if (skuList[i].stock_num) {
            initSku = {
              s1: skuList[i].s1,
              s2: skuList[i].s2,
              selectedNum: 1
            };
            break;
          }
        }
      }
      return initSku;
    },
    ...mapGetters({
      getToken: "token"
    })
  },
  methods: {
    scrollRefresh() {
      console.log("scroll refresh");
      this.$refs.scroll.refresh();
    },
    refreshScroll() {
      this.$refs.scroll.refresh();
    },
    parseDom(arg) {
      var objE = document.createElement("div");
      objE.innerHTML = arg;
      return objE.childNodes;
    },
    //获取img都没 的src
    getImgSrc(arg) {
      let img = this.parseDom(arg);
      return img[0].attributes.src.value;
    },
    showImgPreview(startIndex) {
      ImagePreview({
        images: this.imgList,
        startPosition: startIndex,
        onClose() {
          // do something
        }
      });
    },
    lookMoreComment() {
      this.$router.push({
        path: "/ratings",
        query: {
          goodsCommonId: this.$route.params.spuid
        }
      });
    },
    formatPrice() {
      return "¥" + (this.goods.price / 100).toFixed(2);
    },
    onChange(index) {
      this.current = index;
    },
    onClickCart() {
      this.$router.push({
        path: "/shopcart"
      });
    },
    connectKefu() {
      this.$router.push({
        path: "/chat",
        query: {
          goodsInfo: this.goods1
        }
      });
    },
    sorry() {
      Toast.success("暂无后续逻辑~");
    },
    clickShopCart() {
      //Toast.success("加入购物车，暂无后续逻辑~");
      this.show = !this.show;
    },
    buy() {
      this.show = !this.show;
    },
    toggleShowSku() {
      this.show = !this.show;
    },
    back() {
      this.$router.goBack();
    },
    ImgLoad() {
      if (this.checkLoad) {
        this.checkLoad = false;
        this.$refs.scroll.refresh();
      }
    },
    onBuyClicked(data) {
      //this.$toast("buy:" + JSON.stringify(data));
      console.log(JSON.stringify(data));
      if (!this.getToken) {
        //console.log('没 token')
        this.$router.replace({
          path: "/login"
        });
        return;
      }
      this.$router.push({
        path: `/${this.$route.query.ParentPath}/goodsDetail/${data.goodsId}/confirmOrder/${data.selectedSkuComb.id}`,
        query: {
          id: 33,
          skuGoods: {
            skuId: data.selectedSkuComb.id,
            goodsId: data.goodsId,
            title: this.goods1.goodsName,
            desc: this.currentSelectSku,
            price: data.selectedSkuComb.price,
            num: data.selectedNum,
            thumb: this.currentSelectSkuImg
          }
        }
      });
    },
    //添加购物车
    onAddCartClicked(data) {
      //this.$toast("add cart:" + JSON.stringify(data));
      //console.log(data);
      //用户没登录 引导登录
      if (!this.getToken) {
        //console.log('没 token')
        this.$router.replace({
          path: "/login"
        });
        return;
      }
      let params = {
        storeId: this.goods1.storeId, //店铺id
        goodsId: data.selectedSkuComb.id, //规格id
        memberId: 1,
        buyNum: data.selectedNum //选择商品的数量
      };
      console.log(params);
      addShopCart(params).then(res => {
        console.log(res);
        if (res.code === 0) {
          //console.log(res.data)
          if (res.data) {
            Toast.success("加入购物车成功");
            this.setIsAddShopCart(true);
            this.toggleShowSku();
          } else {
            Toast.fail("加入购物车失败");
            this.toggleShowSku();
          }
        }
      });

      //console.log(this.$refs.sku.getSkuData());
    },
    //当选择的规格发生改变时的回调函数
    currentSelect(data) {
      console.log(data);
      this.initialSku.s1 = data.selectedSku.s1 /* ? data.selectedSku.s1 : 1 */;
      this.initialSku.s2 = data.selectedSku.s2 /* ? data.selectedSku.s2 : 1 */;
    },
    //切换喜欢收藏按钮
    _toggleFavorite() {
      this.isFavorite = !this.isFavorite;
      console.log(this.isFavorite);
      //console.log(this.goods1)
      let params = {
        goodsCommonId: this.goods1.goodsCommonId
      };
      if (this.isFavorite) {
        //this._
        toggleFavorite(params).then(res => {
          console.log(res.data);
          Toast.success("收藏成功");
        });
      } else {
        toggleFavorite(params).then(res => {
          console.log(res.data);
          Toast.success("取消收藏");
        });
      }
    },
    //根据商品id互殴去商品
    _getSkuById() {
      let params = {
        goodsCommonId: this.$route.params.spuid
      };
      getSkuById(params).then(res => {
        if (res.code === 0) {
          this.sku = res.data;
        }
      });
    },
    //根据商品id 获取商品详情数据
    _getGoodsById() {
      let params = {
        goodsCommonId: this.$route.params.spuid
      };
      getGoodsById(params).then(res => {
        if (res.code === 0) {
          this.isFavorite = res.data.isFavorite;
          this.goods1 = res.data;
          res.data.bodyList.forEach(img => {
            this.imgList.push(this.getImgSrc(img));
          });
        }
      });
    },
    /* _toggleFavorite() {
      let params = {
        goodsCommonId: this.goods1.goodsCommonId,
        memberId: 1
      };
      toggleFavorite().then(res => {
        console.log(res);
      });
    }, */
    ...mapMutations({
      setIsAddShopCart: "SET_IS_SHOP_CART"
    })
  },
  watch: {
    $route(to, from) {
      /* console.log(to);
      console.log(from); */
      if (from.name === "shopcart") {
        this._getGoodsById();
        this._getSkuById();
        console.log("fsa");
      }
    }
  },
  components: {
    [Tag.name]: Tag,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton,
    [Sku.name]: Sku,
    [Button.name]: Button,
    RatingHeader: RatingHeader,
    [Divider.name]: Divider,
    Scroll,
    Skeleton,
    RatingSeller,
    Banner
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.goods-detail-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0px;
  z-index: 60;
  padding-bottom: 50px;
  overflow: hidden;
  background: $color-background;

  .goods-detail {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0px;
    padding-bottom: 50px;
    overflow: hidden;
    background: $color-background;
    z-index: 10;

    .content-wrapper {
      width: 100%;
      padding-bottom: 50px;

      .back {
        position: absolute;
        top: 15px;
        left: 15px;
        z-index: 20;
        font-size: $font-size-large-xx;
        color: $color-text-ll;

        .van-icon.van-icon::before {
          padding: 3px;
          border-radius: 50%;
          background: rgba(128, 128, 128, 0.5);
        }
      }

      .goods-swipe {
        position: relative;
        padding-top: 100%;

        .van-swipe__track {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .custom-indicator {
          position: absolute;
          right: 5px;
          bottom: 5px;
          padding: 3px 5px;
          border-radius: 10px;
          background: rgba(0, 0, 0, 0.1);
          color: #fff;
          font-size: 12px;
        }

        img {
          width: 100%;
          display: block;
        }
      }

      .goods-title {
        font-size: 16px;
      }

      .sub-title {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .goods-price {
          span {
            padding: 0 4px;
          }

          .new-price {
            color: $color-text-red;
            font-weight: 600;
            font-size: $font-size-large-x;
          }

          .old-price {
            color: $color-text-gray;
            font-size: $font-size-medium;
            text-decoration: line-through;
          }
        }

        .add-favorite {
          text-align: center;
          display: flex;
          flex-direction: column;

          .van-icon {
            font-size: $font-size-large-x;
          }
        }
      }

      .goods-express {
        color: #999;
        font-size: 12px;
        padding: 5px 15px;

        .server {
          display: flex;
          align-items: center;

          .van-icon.van-icon-passed {
            font-size: 15px;
            margin-left: 4px;
          }
        }
      }

      .goods-cell-group {
        margin: 15px 0;

        .van-cell__value {
          color: #999;
        }
      }

      .goods-tag {
        margin-left: 5px;
      }

      .comment-wrapper {
        .comment-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px;
          background: $color-background-w;

          .info {
            line-height: 18px;

            .info-text {
              padding: 0 6px;
              font-size: $font-size-medium-x;
              border-left: 4px solid red;
            }

            .info-num {
              font-size: $font-size-medium;
            }
          }

          .goods-evaluation {
            font-size: $font-size-medium;
            display: flex;
            align-items: center;
          }
        }

        .look-more {
          padding: 6px 0;
          background: $color-background-w;
          text-align: center;

          .van-button__text {
            padding: 10px;
          }
        }
      }
    }
  }

  .van-goods-action {
    z-index: 10;
  }
}
</style>
