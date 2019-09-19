<template>
  <div class="sku-item">
    <van-card
      num="2"
      price="2.00"
      desc="颜色:傻白 尺码:42"
      title="商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题"
      thumb="https://img.yzcdn.cn/vant/t-thirt.jpg"
    >
      <div slot="num" v-if="isShowStepper">
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
