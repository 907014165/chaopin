<template>
  <div class="fill-order">
    <nav-bar title="确认订单" @back="back"></nav-bar>
    <address-card
      id="14756"
      name="阮受涣"
      tel="180****5907"
      address="福建省三明市尤溪县台溪乡盖住村82号"
      :addressData="addr"
      @edit="edit"
    ></address-card>
    <sku-group :has-footer="hasFooter" :is-seller="isSeller" v-if="order">
      <sku-item :sku="sku"></sku-item>
    </sku-group>
    <template v-if="seller">
      <sku-group
        :has-footer="hasFooter"
        :seller="item"
        v-for="(item,index) in seller"
        :key="index"
        :is-seller="isSeller"
        :is-shop-cart="true"
      ></sku-group>
    </template>
    <van-cell-group>
      <van-field
        v-model="message"
        label="留言"
        type="textarea"
        placeholder="请输入留言"
        rows="1"
        autosize
      />
    </van-cell-group>
    <van-coupon-cell :coupons="coupons" :chosen-coupon="chosenCoupon" @click="showList = true" />
    <van-submit-bar
      class="comfir-submit"
      :price="totlePriceWithCoupon===0?totlePrice:totlePriceWithCoupon*100"
      button-text="提交订单"
      @submit="onSubmit"
    />
    <van-popup v-model="showList" position="bottom">
      <van-coupon-list
        :coupons="coupons"
        :chosen-coupon="chosenCoupon"
        :show-exchange-bar="false"
        :disabled-coupons="disabledCoupons"
        @change="onChange"
        @exchange="onExchange"
      />
    </van-popup>
    <router-view></router-view>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import SkuItem from "components/SkuItem/SkuItem";
import SkuGroup from "components/SkuGroup/SkuGroup";
import AddressCard from "base/AddressCard/AddressCard";
import {
  createOrderImmediately,
  createOrderByShopCart,
  getOrderPrice
} from "api/order.js";
import { getUsefulCoupon, getUnUserfulCoupon } from "api/coupon.js";
import { getDefaultAddr } from "api/user.js";
import AddressInfo from "common/js/addressInfo.js";
import {
  Cell,
  CellGroup,
  Field,
  CouponCell,
  CouponList,
  Popup,
  RadioGroup,
  Radio,
  SubmitBar,
  Toast
} from "vant";
import { mapGetters, mapMutations } from "vuex";
export default {
  data() {
    return {
      order: this.$route.query.skuGoods,
      seller: this.$route.query.seller,
      defaultAddr: null,
      message: "",
      chosenCoupon: null,
      hasFooter: false,
      isSeller: false,
      showList: false,
      coupons: [],
      disabledCoupons: [],
      currentCouponsId: null,
      disabledCoupons: [],
      couponsDescPrice: 0,
      totlePriceWithCoupon: 0,
      list: [1, 2],
      radio: "1"
    };
  },
  created() {
    //listenBack();
    this._getDefaultAddr();
  },
  mounted() {
    this._getUsefulCoupon();
    this._getUnUserfulCoupon();
    this.errBack();
  },
  computed: {
    totlePrice() {
      //从商品详情过来的商品价格是分
      if (this.order) {
        return this.order.price * this.order.num - this.couponsDescPrice;
      } else {
        let price = 0;
        this.seller.forEach(seller => {
          seller.skuList.forEach(sku => {
            price += sku.price * sku.num;
          });
        });
        return (price - this.couponsDescPrice / 100) * 100;
      }
    },
    CouponParams() {
      if (this.order) {
        let couponInfoList = [
          {
            buyNum: this.order.num,
            goodsId: this.order.skuId
          }
        ];
        return couponInfoList;
      } else {
        let couponInfoList = [];
        this.seller.forEach(seller => {
          seller.skuList.forEach(sku => {
            couponInfoList.push({
              buyNum: sku.num,
              goodsId: sku.goodsId
            });
          });
        });
        return couponInfoList;
      }
    },
    orderPriceParams() {
      if (this.order) {
        let params = {
          couponId: this.currentCouponsId
        };
        let couponInfoList = [
          {
            buyNum: this.order.num,
            goodsId: this.order.skuId
          }
        ];
        params["orderCouponDTOs"] = couponInfoList;
        return params;
      } else {
        let params = {
          couponId: this.currentCouponsId
        };
        let couponInfoList = [];
        this.seller.forEach(seller => {
          seller.skuList.forEach(sku => {
            couponInfoList.push({
              buyNum: sku.num,
              goodsId: sku.goodsId
            });
          });
        });
        params["orderCouponDTOs"] = couponInfoList;
        return params;
      }
    },
    /* seller() {
      if (this.$route.query.seller) {
        return [...this.$route.query.seller];
      } else {
        return [];
      }
    }, */
    sku() {
      return {
        skuId: this.order.skuId,
        goodsId: this.order.goodsId,
        title: this.order.title,
        desc: this.order.desc,
        price: this.order.price / 100,
        num: this.order.num,
        thumb: this.order.thumb
      };
    },
    addr() {
      return this.getCurrentAddr
        ? this.getCurrentAddr
        : this.defaultAddr
        ? this.defaultAddr
        : {};
    },
    ...mapGetters({
      getCurrentAddr: "getCurrentAddress",
      getInPayMent: "inPayment"
    })
  },
  methods: {
    back() {
      this.$router.goBack();
    },
    errBack() {
      if (!this.order && !this.seller) {
        this.$router.goBack();
      }
    },
    onChange(index) {
      this.showList = false;
      this.chosenCoupon = index;
      this.couponsDescPrice = this.coupons[index].value;
      this.currentCouponsId = this.coupons[index].id;
      this._getOrderPrice();
    },
    onExchange(coupon) {
      this.coupons.push(coupon);
      console.log(coupon);
    },
    onSubmit() {
      console.log(this.order);
      console.log(this.$route);

      if (!this.addr.id) {
        Toast({
          type: "fail",
          message: "请选择收货地址",
          duration: 800
        });
        return;
      }
      //用户立即股买
      if (this.order) {
        let params = {
          buyNum: this.order.num,
          couponId: this.currentCouponsId,
          freightType: "fast",
          goodsId: this.order.skuId,
          memberAddressId: this.addr.id,
          remark: this.message
        };
        console.log(params);
        createOrderImmediately(params).then(res => {
          if (res.code === 0) {
            let inpayment = res.data;
            console.log(inpayment);
            this.setInPayMent(inpayment);
            this.$router.push({
              name: "toPay"
            });
          } else {
            Toast.fail(res.message);
          }
          console.log(res);
        });
      }
      //用户从购物车下单
      if (this.seller) {
        let cartIdArr = [];
        this.seller.forEach((seller, index) => {
          cartIdArr[index] = [];
          seller.skuList.forEach(sku => {
            cartIdArr[index].push(sku.cartId);
          });
        });

        let params = {
          memberAddressId: this.addr.id,
          orderAddDTOs: [
            {
              cartIds: cartIdArr[0],
              couponId: this.currentCouponsId,
              freightType: "fast",
              remark: this.message
            }
          ]
        };
        console.log(params);
        createOrderByShopCart(params).then(res => {
          if (res.data) {
            console.log(res);
            let inpayment = res.data;
            console.log(inpayment);
            this.setInPayMent(inpayment);
            this.$router.push({
              name: "toPay"
            });
            this.setIsBuyGoods(true);
          } else {
            //console.log("fdwaj");
            //console.log(res.message);
            //alert(res.message)
            Toast.fail(res.message);
          }
        });
      }
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    edit() {
      console.log("hhh");
      this.$router.push({
        path: "/user/address",
        query: {
          isSelect: true,
          id: this.addr.id
        }
      });
    },
    init(res, couponList) {
      res.data.forEach(item => {
        couponList.push({
          id: item.couponId,
          name: item.name,
          condition: item.condition,
          startAt: item.startAt,
          endAt: item.endAt,
          description: item.description,
          reason: item.reason,
          value: item.value,
          valueDesc: item.valueDesc,
          unitDesc: item.unitDesc
        });
      });
    },
    _getDefaultAddr() {
      /* let params = {
        memberId: "1"
      }; */
      getDefaultAddr().then(res => {
        console.log(res);
        if (res.code === 0 && res.data) {
          this.defaultAddr = new AddressInfo({
            id: res.data.memberAddressId,
            name: res.data.consignee,
            tel: res.data.mobile,
            province: res.data.province,
            city: res.data.city,
            county: res.data.area,
            addressDetail: res.data.address,
            areaCode: res.data.areaCode + "",
            postalCode: res.data.zipCode,
            isDefault: res.data.isDefault
          });
        }
      });
    },
    //获取有用的优惠券列表
    _getUsefulCoupon() {
      getUsefulCoupon(this.CouponParams).then(res => {
        //console.log(res);
        if (res.code === 0) {
          this.init(res, this.coupons);
        }
      });
    },
    //获取不可用的优惠券列表
    _getUnUserfulCoupon() {
      getUnUserfulCoupon(this.CouponParams).then(res => {
        if (res.code === 0) {
          this.init(res, this.disabledCoupons);
        }
        console.log(res);
      });
    },
    //获取订单价格
    _getOrderPrice() {
      getOrderPrice(this.orderPriceParams).then(res => {
        if (res.code === 0) {
          this.totlePriceWithCoupon = res.data;
        }
      });
    },
    ...mapMutations({
      setIsBuyGoods: "SET_IS_BUY_GOODS",
      setInPayMent: "SET_IN_PAYMENT"
    })
  },
  components: {
    NavBar,
    AddressCard,
    SkuItem,
    SkuGroup,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [CouponCell.name]: CouponCell,
    [CouponList.name]: CouponList,
    [Popup.name]: Popup,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [SubmitBar.name]: SubmitBar,
    [Toast.name]: Toast
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.fill-order {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 3000;
  background: $color-background;

  .van-submit-bar {
    bottom: 0 !important;
  }

  .van-radio-group {
    .van-cell-group {
      .van-icon-alipay {
        font-size: 24px;
        color: #02A9F0;
      }

      .van-icon-wechat {
        font-size: 24px;
        color: #52BD33;
      }
    }
  }

  .comfir-submit {
    position: absolute;
    bottom: 0;
  }
}
</style>
