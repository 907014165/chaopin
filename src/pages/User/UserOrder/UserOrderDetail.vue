<template>
  <div class="user-order-detail">
    <nav-bar title="订单详情" @back="back"></nav-bar>
    <div class="header van-hairline--bottom">
      <div class="order-info">
        <div class="order-staus">卖家已发货</div>
        <div class="order-desc">还剩3天20时自动确认</div>
      </div>
      <img src="./yfh.png" class="yfh-img" alt="运送中图片" />
    </div>
    <div class="logistics-wrapper van-hairline--bottom">
      <logistics-card></logistics-card>
    </div>
    <div class="tpl-wrapper">
      <address-card :addressData="address" :is-link="false"></address-card>
    </div>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import AddressCard from "base/AddressCard/AddressCard";
import LogisticsCard from "base/Logistics/LogisticsCard";
import AddressInfo from "common/js/addressInfo.js";
export default {
  data() {
    return {
      address: new AddressInfo({
        id: 1,
        name: "阮受涣",
        tel: "18065855904",
        province: "福建省",
        city: "三明市",
        county: "尤溪县",
        addressDetail: "台溪乡盖竹村82号",
        areaCode: "350426",
        postalCode: "365111",
        isDefault: false
      })
    };
  },
  methods: {
    back() {
      this.$router.back();
    }
  },
  components: {
    NavBar,
    AddressCard,
    LogisticsCard
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.user-order-detail {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;

  .header {
    display: flex;
    background: linear-gradient(to right, rgb(255, 144, 0), rgb(255, 80, 0)) center center / cover no-repeat;

    .order-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 25px;
      color: $color-text-w;

      .order-staus {
        font-size: $font-size-medium-x;
        margin: 10px 0;
      }

      .order-desc {
        font-size: $font-size-small;
      }
    }

    .yfh-img {
      display: inline-block;
      height: 120px;
      width: 168px;

      &img {
        width: 100%;
      }
    }
  }
}
</style>