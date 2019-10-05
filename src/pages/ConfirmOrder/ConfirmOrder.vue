<template>
  <div class="fill-order">
    <nav-bar title="确认订单" @back="back"></nav-bar>
    <address-card
      id="14756"
      name="阮受涣"
      tel="180****5907"
      address="福建省三明市尤溪县台溪乡盖住村82号"
      :addressData="getCurrentAddr"
      @edit="edit"
    ></address-card>
    <sku-group :has-footer="hasFooter" :is-seller="isSeller" v-if="order">
      <sku-item :sku="order"></sku-item>
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
    <van-radio-group v-model="radio">
      <van-cell-group>
        <van-cell title="支付宝支付" clickable @click="radio = '1'" icon="alipay">
          <van-radio slot="right-icon" name="1" />
        </van-cell>
        <van-cell title="微信支付" clickable @click="radio = '2'" icon="wechat">
          <van-radio slot="right-icon" name="2" />
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <van-submit-bar :price="totlePrice" button-text="提交订单" @submit="onSubmit" />
    <van-popup v-model="showList" position="bottom">
      <van-coupon-list
        :coupons="coupons"
        :chosen-coupon="chosenCoupon"
        :disabled-coupons="disabledCoupons"
        @change="onChange"
        @exchange="onExchange"
      />
    </van-popup>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import SkuItem from "components/SkuItem/SkuItem";
import SkuGroup from "components/SkuGroup/SkuGroup";
import AddressCard from "base/AddressCard/AddressCard";
import { createOrderImmediately, createOrderByShopCart } from "api/order.js";
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

const coupon = {
  available: 1,
  condition: "无使用门槛\n最多优惠12元",
  reason: "",
  value: 150,
  name: "优惠券名称",
  startAt: 1489104000,
  endAt: 1514592000,
  valueDesc: "1.5",
  unitDesc: "元"
};

export default {
  data() {
    return {
      order: this.$route.query.skuGoods,

      message: "",
      chosenCoupon: -1,
      hasFooter: false,
      isSeller: false,
      showList: false,
      coupons: [coupon],
      disabledCoupons: [coupon],
      list: [1, 2],
      radio: "1"
    };
  },
  computed: {
    totlePrice() {
      if (this.order) {
        return this.order.price;
      } else {
        let price = 0;
        this.seller.forEach(seller => {
          seller.skuList.forEach(sku => {
            price += sku.price;
          });
        });
        return price;
      }
    },
    seller() {
      if (this.$route.query.seller) {
        return [...this.$route.query.seller];
      } else {
        return null;
      }
    },
    ...mapGetters({
      getCurrentAddr: "getCurrentAddress"
    })
  },
  methods: {
    back() {
      this.$router.back();
    },
    onChange(index) {
      this.showList = false;
      this.chosenCoupon = index;
    },
    onExchange(code) {
      this.coupons.push(coupon);
    },
    onSubmit() {
      Toast.success("暂无后续逻辑");
      console.log(this.order);
      console.log(this.$route);
      //用户立即股买
      if (this.order) {
        let params = {
          activityId: null,
          buyNum: this.order.num,
          couponId: null,
          freightType: "fast",
          goodsId: this.order.skuId,
          memberAddressId: 35935,
          remark: this.message
        };
        console.log(params);
        createOrderImmediately(params).then(res => {
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
          memberAddressId: 35935,
          orderAddDTOs: [
            {
              activityId: null,
              cartIds: cartIdArr[0],
              couponId: null,
              freightType: "fast",
              remark: "我就是个gaygay"
            }
          ]
        };
        console.log(params);
        createOrderByShopCart(params).then(res => {
          if (res.data) {
            this.setIsBuyGoods(true);
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
          isSelect: true
        }
      });
    },
    _getAddr() {},
    ...mapMutations({
      setIsBuyGoods: "SET_IS_BUY_GOODS"
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
}
</style>
