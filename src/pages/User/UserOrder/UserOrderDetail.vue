<template>
  <div class="user-order-detail">
    <nav-bar title="订单详情" @back="back"></nav-bar>
    <div class="header van-hairline--bottom">
      <div class="order-info">
        <div class="order-staus">{{ orderTypeTxt }}</div>
        <div class="order-desc">
          <!-- 还剩3天20时自动确认 -->
        </div>
      </div>
      <img :src="currentImg" v-show="currentImg" class="yfh-img" alt="运送中图片" />
    </div>
    <div class="logistics-wrapper van-hairline--bottom">
      <logistics-card
        @selectLogistics="toLogisticsDetail"
        :order-id="getCurrentOrderDetail.orderId"
        v-if="showLogisticsCard"
      ></logistics-card>
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
          <van-button
            type="danger"
            plain
            hairline
            size="small"
            @click.stop="refund(index)"
            v-if="showReFundBtn"
          >{{ refundStatusText[refundState[index]?refundState[index]:0] }}</van-button>
        </sku-item>
      </div>
      <div slot="order-price" class="order-price van-hairline--top">
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
        <div class="item" v-if="getCurrentOrderDetail.createTime">
          <span class="item-info">创建时间</span>
          <span class="item-text">{{ getCurrentOrderDetail.createTime|formatDate }}</span>
        </div>
        <div class="item" v-if="getCurrentOrderDetail.payTime">
          <span class="item-info">付款时间</span>
          <span class="item-text">{{ getCurrentOrderDetail.payTime|formatDate }}</span>
        </div>
        <div class="item" v-if="getCurrentOrderDetail.sendTime">
          <span class="item-info">发货时间</span>
          <span class="item-text">{{ getCurrentOrderDetail.sendTime|formatDate }}</span>
        </div>
        <div class="item" v-if="getCurrentOrderDetail.dealTime">
          <span class="item-info">成交时间</span>
          <span class="item-text">{{ getCurrentOrderDetail.dealTime|formatDate }}</span>
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
import { getRefundStatus } from "api/order.js";
import { mapGetters, mapMutations } from "vuex";
import { Button } from "vant";
import moment from "moment";
import { isAndroid_ios } from "common/js/util.js";

var imgAc = require("./11.png");
var imgLogistic = require("./12.png");
var imgPendingPay = require("./09.png");

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
      }),
      imgAc: imgAc,
      imgLogistic: imgLogistic,
      imgPendingPay: imgPendingPay,
      refundState: [], //退单状态列表
      refundId: [], //订单退单列表id
      refundStatusText: {
        //退款状态文字
        0: "退款",
        1: "处理中",
        2: "商家已同意",
        3: "已拒绝"
      }
    };
  },
  created() {
    //获取当前订单列表的退款状态
    this._getRefundStatus();
  },
  computed: {
    //是否可以可以退款
    showReFundBtn() {
      const PendingLogistics = 20,
        Logistics = 30,
        Complete = 40,
        Comment = 50;
      let map = [PendingLogistics, Logistics, Complete, Comment];
      return map.indexOf(this.getCurrentOrderDetail.status) != -1
        ? true
        : false;
    },

    //根据不同的状态改变对应状态的图片
    currentImg() {
      const Cancel = 0,
        PendingPay = 10,
        PendingLogistics = 20,
        Logistics = 30,
        Complete = 40;
      let imgUrl = "";
      switch (this.getCurrentOrderDetail.status) {
        case Cancel:
          imgUrl = imgPendingPay;
          break;
        case PendingPay:
          imgUrl = imgPendingPay;
          break;
        case PendingLogistics:
          imgUrl = imgPendingPay;
          break;
        case Logistics:
          imgUrl = imgLogistic;
          break;
        case Complete:
          imgUrl = imgAc;
          break;
      }
      return imgUrl;
    },
    //根据不同的状态计算对应的交易文字提示
    orderTypeTxt() {
      const Cancel = 0,
        PendingPay = 10,
        PendingLogistics = 20,
        Logistics = 30,
        Complete = 40,
        Comment = 50;
      let txt = "";
      switch (this.getCurrentOrderDetail.status) {
        case Cancel:
          txt = "已取消";
          break;
        case PendingPay:
          txt = "待付款";
          break;
        case PendingLogistics:
          txt = "等待卖家发货";
          break;
        case Logistics:
          txt = "卖家已发货";
          break;
        case Complete:
          txt = "交易完成";
          break;
        case Comment:
          txt = "交易完成";
          break;
      }
      return txt;
    },
    //是否有物流信息
    showLogisticsCard() {
      const Logistics = 30,
        Complete = 40,
        Comment = 50;
      let map = [Logistics, Complete, Comment];
      return map.indexOf(this.getCurrentOrderDetail.status) != -1
        ? true
        : false;
    },
    ...mapGetters({
      getCurrentOrderDetail: "currentOrderDetail"
    })
  },
  methods: {
    back() {
      this.$router.goBack();
    },
    test() {
      console.log(this.getCurrentOrderDetail);
    },
    //查看物流信息详情
    toLogisticsDetail() {
      this.$router.push({
        path: "/logisticsDetail",
        query: {
          orderId: this.getCurrentOrderDetail.orderId
        }
      });
    },
    //退款
    refund(index) {
      console.log("退还");
      console.log(this.getCurrentOrderDetail.skuList[index]);
      //如果之前处理过 直接去详情页面
      if (this.refundState[index]) {
        this.$router.push({
          name: "aftersaleDetail",
          query: {
            refundId: this.refundId[index]
          }
        });
      } else {
        this.setCurrentRefundGoods({
          orderId: this.getCurrentOrderDetail.orderId,
          goods: this.getCurrentOrderDetail.skuList[index]
        });
        this.$router.push({
          path: "/refund",
          query: {
            refundInfo: {
              orderId: this.getCurrentOrderDetail.orderId,
              goods: this.getCurrentOrderDetail.skuList[index]
            }
          }
        });
      }
    },
    //获得当前订单的商品数量
    getCuttentOrderNum(skulist) {
      let num = 0;
      skulist.forEach(sku => {
        num += sku.num;
      });
      return num;
    },
    _getRefundStatus() {
      let params = {
        orderId: this.getCurrentOrderDetail.orderId
      };
      getRefundStatus(params).then(res => {
        console.log(res);
        res.data.forEach(item => {
          this.refundState.push(item.refundState);
          this.refundId.push(item.refundId);
        });
      });
    },
    ...mapMutations({
      setCurrentRefundGoods: "SET_CURRENT_REFUND_GOODS"
    })
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      if (isAndroid_ios()) {
        date.setHours(date.getHours() - 8);
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
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
    background: linear-gradient(to right, rgb(255, 96, 64), rgb(255, 0, 0)) center center / cover no-repeat;

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