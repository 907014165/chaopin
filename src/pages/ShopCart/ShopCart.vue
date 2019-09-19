<template>
  <div class="shop-cart">
      <no-result desc="暂无商品" size="middle">
          <img src="./cart-no-result.png" alt="">
      </no-result>
      <sku-group>
        <sku-item :is-show-stepper="showStepper"></sku-item>
      </sku-group>
  </div>
</template>
<script>
import NoResult from "base/NoResult/NoResult";
import SkuGroup from 'components/SkuGroup/SkuGroup'
import SkuItem from 'components/SkuItem/SkuItem'
export default {
  data() {
    return {
      showStepper:true
    };
  },
  components: {
    NoResult,
    SkuGroup,
    SkuItem
  }
};
</script>