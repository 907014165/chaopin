<template>
  <div class="user-order">
    <nav-bar title="我的订单" @back="back"></nav-bar>
    <van-tabs v-model="active" animated swipeable>
      <van-tab title="全部">
        <sku-group>
          <sku-item></sku-item>
        </sku-group>
      </van-tab>
      <van-tab title="待付款">
        <no-result>
          <img src="./no-result.png" alt>
        </no-result>
      </van-tab>
      <van-tab title="待收货">
        <sku-group :order-state="active">
          <sku-item></sku-item>
        </sku-group>
      </van-tab>
      <van-tab title="已完成">
        <sku-group :order-state="active">
          <sku-item></sku-item>
        </sku-group>
      </van-tab>
      <van-tab title="已取消">
        <sku-group :order-state="active">
          <sku-item></sku-item>
        </sku-group>
      </van-tab>
    </van-tabs>
    
  </div>
</template>
<script>
import { Tab, Tabs } from "vant";
import NavBar from "base/NavBar/NavBar";
import NoResult from "base/NoResult/NoResult";
import SkuItem from "components/SkuItem/SkuItem";
import SkuGroup from "components/SkuGroup/SkuGroup";

const All = {
  orderList:[]
}
export default {
  data() {
    return {
      active: parseInt(this.$route.params.id)
    };
  },
  created() {},
  methods: {
    back() {
      this.$router.back();
    }
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    NavBar,
    NoResult,
    SkuItem,
    SkuGroup
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.user-order {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  background: $color-background;
}
</style>
