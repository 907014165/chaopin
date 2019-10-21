<template>
  <div class="sku-item" @click.stop="selectGoods">
    <van-card
      :num="sku.num"
      :price="sku.price"
      :desc="sku.desc"
      :title="sku.title"
      :thumb="sku.thumb"
    >
      <div slot="num" v-if="isShowStepper" @click.stop>
        <van-stepper v-model="num" button-size="20px" :max="maxNum" @change="changeNum" />
      </div>
      <div slot="footer" v-if="isFooter">
        <slot></slot>
      </div>
    </van-card>
    <!-- <div class="order_footer van-hairline--top">
      <div class="btn-wrapper">
        <van-button
          plain
          hairline
          :type="item.type"
          size="small"
          v-for="(item,index) in currentBtn"
          :key="index"
        >{{ item.text }}</van-button>
      </div>
    </div>-->
  </div>
</template>
<script>
import { Card, Stepper, Button } from "vant";
export default {
  data() {
    return {
      value: 0,
      num: this.sku.num,
      stateBtn: {
        10: [
          {
            type: "danger",
            text: "去支付"
          }
        ],
        20: [
          {
            type: "default",
            text: "查看物流"
          },
          {
            type: "danger",
            text: "确认收货"
          }
        ],
        40: [
          {
            type: "default",
            text: "评论"
          },
          {
            type: "danger",
            text: "再次购买"
          }
        ],
        0: [
          {
            type: "default",
            text: "退款明细"
          },
          {
            type: "danger",
            text: "再次购买"
          }
        ],
        5: []
      }
    };
  },
  props: {
    isShowStepper: {
      type: Boolean,
      default: false
    },
    isFooter:{
      type:Boolean,
      default:false
    },
    sku: {
      type: Object,
      default() {
        return {
          skuId: 1,
          goodsId: 33,
          title:
            "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
          desc: "颜色:傻白 尺码:42",
          price: 2.0,
          num: 3,
          orderStatus: 10,
          thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
        };
      }
    },
    isOrder: {
      type: Boolean,
      default: false
    },
    maxNum: {
      type:Number,
      default:1
    }
  },
  computed: {
    currentBtn() {
      return this.stateBtn[this.sku.orderStatus];
    }
  },
  methods: {
    changeNum(num) {
      //console.log(params)
      let params = {
        skuId: this.sku.skuId,
        num
      };
      this.$emit("change-num", params);
    },
    //点击
    selectGoods() {
      console.log(this.isOrder);
      if (this.isOrder) {
        this.$emit("clickOrder");
      } else {
        this.$router.push({
          path: `/search/goodsDetail/${this.sku.goodsCommonId}`,
          query: {
            ParentPath: "search"
          }
        });
      }
    }
  },
  components: {
    [Card.name]: Card,
    [Stepper.name]: Stepper,
    [Button.name]: Button
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.sku-item {
  .van-card {
    background: $color-background-w;

    .van-card__header {
      .van-card__content {
        .van-card__title {
          font-size: 14px;
          margin: 3px 0;
        }

        .van-card__bottom {
          margin: 4px 0;

          .van-card__price {
            font-size: 16px;
          }
        }
      }
    }
  }

  .van-image__img {
    border-radius: 8px;
  }
}
</style>
