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
      <address-card :addressData="getCurrentOrderDetail.addr" :is-link="false"></address-card>
    </div>
    <sku-group :is-shop-cart="true" :has-footer="false">
      <div>
        <sku-item
          v-for="(sku,index) in getCurrentOrderDetail.skuList"
          :sku="sku"
          :is-footer="true"
          :key="index"
        >
          <van-button type="default" size="small" @click.stop="refund(index)" v-if="showReFundBtn">退还</van-button>
        </sku-item>
      </div>
      <div slot="order-price" class="order-price">
        <span>共{{getCuttentOrderNum(getCurrentOrderDetail.skuList) }}件商品</span>
        <span>合计:￥{{ getCurrentOrderDetail.orderAmount }}</span>
      </div>
    </sku-group>
    <div class="order-detail-info">
      <div class="info-header">
        <span class="info">订单信息</span>
      </div>
      <div class="info-content">
        <div class="item">
          <span class="item-info">订单编号</span>
          <span class="item-text">{{ getCurrentOrderDetail.orderNo }}</span>
        </div>
        <div class="item">
          <span class="item-info">创建时间</span>
          <span class="item-text">{{ getCurrentOrderDetail.orderNo }}</span>
        </div>
        <div class="item">
          <span class="item-info">付款时间</span>
          <span class="item-text">{{ getCurrentOrderDetail.orderNo }}</span>
        </div>
        <div class="item">
          <span class="item-info">发货时间</span>
          <span class="item-text">{{ getCurrentOrderDetail.orderNo }}</span>
        </div>
        <div class="item">
          <span class="item-info">成交时间</span>
          <span class="item-text">{{ getCurrentOrderDetail.orderNo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import AddressCard from "base/AddressCard/AddressCard";
import LogisticsCard from "base/Logistics/LogisticsCard";
import SkuItem from "components/SkuItem/SkuItem";
import Scroll from "base/Scroll/Scroll";
import SkuGroup from "components/SkuGroup/SkuGroup";
import AddressInfo from "common/js/addressInfo.js";
import { mapGetters } from "vuex";
import { Button } from "vant";
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
  computed: {
    showReFundBtn() {
      const PendingLogistics = 20,
        Logistics = 30,
        Complete = 40,
        Comment = 50;
      let map = [PendingLogistics, Logistics, Complete, Comment];
      return map.indexOf(this.getCurrentOrderDetail.status) != -1 ? true : false;
    },
    ...mapGetters({
      getCurrentOrderDetail: "currentOrderDetail"
    })
  },
  methods: {
    back() {
      this.$router.back();
    },
    test() {
      console.log(this.getCurrentOrderDetail);
    },
    refund(index){
      console.log('退还')
      console.log(index)
    },
    //获得当前订单的商品数量
    getCuttentOrderNum(skulist) {
      let num = 0;
      skulist.forEach(sku => {
        num += sku.num;
      });
      return num;
    }
  },
  components: {
    [Button.name]: Button,
    NavBar,
    AddressCard,
    LogisticsCard,
    SkuGroup,
    Scroll,
    SkuItem
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
  z-index: 10;
  overflow-y: scroll;
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

  .order-price {
    font-size: 14px;
    text-align: right;
    padding: 6px 4px;

    span {
      margin: 0 8px;
    }
  }

  .order-detail-info {
    padding: 5px 10px;
    background: $color-text-w;

    .info-header {
      .info {
        border-left: 4px solid red;
        font-size: $font-size-medium-x;
        padding: 0 6px;
      }
    }

    .info-content {
      margin-top: 10px;

      .item {
        font-size: $font-size-medium;
        padding: 10px 8px;
        display: flex;

        .item-info {
          width: 100px;
        }

        .item-text {
          flex: 1;
        }
      }
    }
  }
}
</style>