<template>
  <div class="sku-item" @click.stop>
    <van-card
      :num="sku.num"
      :price="sku.price"
      :desc="sku.desc"
      :title="sku.title"
      :thumb="sku.thumb"
    >
      <div slot="num" v-if="isShowStepper" @click.stop>
        <van-stepper v-model="num" button-size="20px" @change="changeNum"/>
      </div>
    </van-card>
  </div>
</template>
<script>
import { Card, Stepper } from "vant";
export default {
  data() {
    return {
      value: 0,
      num:this.sku.num
    };
  },
  props: {
    isShowStepper: {
      type: Boolean,
      default: false
    },
    sku: {
      type: Object,
      default() {
        return {
          skuId:1,
          title:
            "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
          desc: "颜色:傻白 尺码:42",
          price: 2.0,
          num: 3,
          thumb:"https://img.yzcdn.cn/vant/t-thirt.jpg"
        };
      }
    }
  },
  methods: {
    changeNum(num){
      //console.log(params)
      let params = {
        skuId:this.sku.skuId,
        num
      }
      this.$emit('change-num',params)
    }
  },
  components: {
    [Card.name]: Card,
    [Stepper.name]: Stepper
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
          font-size 14px
          margin 3px 0
        }
        .van-card__bottom {
          margin 4px 0
          .van-card__price {
            font-size 16px
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
