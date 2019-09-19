<template>
  <transition name="van-slide-right">
    <scroll class="goods-detail" :data="goods.thumb" ref="scroll">
      <div class="content-wrapper">
        <span class="back" @click="back">
          <van-icon name="arrow-left"/>
        </span>
        <van-swipe class="goods-swipe" :autoplay="3000" @change="onChange">
          <van-swipe-item v-for="thumb in goods.thumb" :key="thumb">
            <img :src="thumb" @load="ImgLoad">
          </van-swipe-item>
          <div class="custom-indicator" slot="indicator">{{ current + 1 }}/{{goods.thumb.length}}</div>
        </van-swipe>

        <van-cell-group>
          <van-cell>
            <div class="goods-title">{{ goods.title }}</div>
            <div class="goods-price">{{ formatPrice(goods.price) }}</div>
          </van-cell>
          <van-cell class="goods-express">
            <van-col span="10">运费：{{ goods.express }}</van-col>
            <van-col span="14">剩余：{{ goods.remain }}</van-col>
          </van-cell>
        </van-cell-group>

        <van-cell-group class="goods-cell-group">
          <van-cell value="进入店铺" icon="shop-o" is-link @click="sorry">
            <template slot="title">
              <span class="van-cell-text">潮品商城</span>
              <van-tag class="goods-tag" type="danger">官方</van-tag>
            </template>
          </van-cell>
          <van-cell title="线下门店" icon="location-o" is-link @click="sorry"/>
        </van-cell-group>

        <van-cell-group class="goods-cell-group">
          <van-cell title="已选" is-link @click="toggleShowSku"/>
        </van-cell-group>
      </div>
      <van-goods-action>
        <van-goods-action-icon icon="chat-o" @click="sorry"><!-- <a href="http://192.168.1.107:9010/client"> -->客服<!-- </a> --></van-goods-action-icon>
        <van-goods-action-icon icon="cart-o" @click="onClickCart">购物车</van-goods-action-icon>
        <van-goods-action-button type="warning" @click="sorry">加入购物车</van-goods-action-button>
        <van-goods-action-button type="danger" @click="buy">立即购买</van-goods-action-button>
      </van-goods-action>
      <van-sku
        ref="sku"
        v-model="show"
        :sku="skuData.sku"
        :goods="skuData.goods_info"
        :goods-id="skuData.goods_id"
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
      <transition name="van-slide-right">
        <router-view></router-view>
      </transition>
    </scroll>
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
  Sku
} from "vant";
import Scroll from "base/Scroll/Scroll";
import skuData from "./data.js";
export default {
  data() {
    return {
      current: 0,
      show: false,
      checkLoad: true,
      goods: {
        goodsId:946755,
        title: "美国伽力果（约680g/3个）",
        price: 2680,
        express: "免运费",
        remain: 19,
        thumb: [
          "https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg",
          "https://img.yzcdn.cn/public_files/2017/10/24/1791ba14088f9c2be8c610d0a6cc0f93.jpeg"
        ]
      },
      skuData: skuData,
      showCustom: false,
      showStepper: false,
      showSoldout: false,
      closeOnClickOverlay: true,
      initialSku: {
        s1: "30349",
        s2: "1193",
        selectedNum: 1
      },
      customSkuValidator: () => "请选择商品!"
    };
  },
  methods: {
    formatPrice() {
      return "¥" + (this.goods.price / 100).toFixed(2);
    },
    onChange(index) {
      this.current = index;
    },
    onClickCart() {
      this.$router.push("cart");
    },
    sorry() {
      Toast("暂无后续逻辑~");
    },
    buy(){
      this.show = !this.show
      
    },
    toggleShowSku() {
      this.show = !this.show;
    },
    back() {
      this.$router.back();
    },
    ImgLoad() {
      if (this.checkLoad) {
        this.checkLoad = false;
        this.$refs.scroll.refresh();
      }
    },
    onBuyClicked(data) {
      this.$toast("buy:" + JSON.stringify(data));
      console.log(JSON.stringify(data));
      this.$router.push({
        path: `/${this.$route.query.ParentPath}/goodsDetail/${data.goodsId}/confirmOrder/${
          data.selectedSkuComb.id
        }`,
        query:{
          data
        }
      });
    },

    onAddCartClicked(data) {
      this.$toast("add cart:" + JSON.stringify(data));
      console.log(this.$refs.sku.getSkuData());
    },
    currentSelect(data) {
      console.log(data);
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
    Scroll
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

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
    }

    .goods-swipe {
      position: relative;

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

    .goods-price {
      color: #f44;
    }

    .goods-express {
      color: #999;
      font-size: 12px;
      padding: 5px 15px;
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
  }
}
</style>
