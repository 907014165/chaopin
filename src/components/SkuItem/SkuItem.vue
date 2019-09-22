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
        <van-stepper v-model="value" button-size="20px"/>
      </div>
    </van-card>
  </div>
</template>
<script>
import { Card, Stepper } from "vant";
export default {
  data() {
    return {
      value: 0
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
  }

  .van-image__img {
    border-radius: 8px;
  }
}
</style>
