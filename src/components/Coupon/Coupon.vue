<template>
  <div class="coupon">
    <nav-bar title="优惠卷" @back="back"></nav-bar>
    <van-coupon-list
      :coupons="coupons"
      :disabled-coupons="disabledCoupons"
      :show-close-button="false"
      :show-exchange-bar="false"
      currency
    />
  </div>
</template>
<script>
import {
  Tab,
  Tabs,
  PullRefresh,
  List,
  Toast,
  CouponCell,
  CouponList
} from "vant";
import NavBar from "base/NavBar/NavBar";
import { getCouponList } from "api/coupon";
import Coupon from "common/js/coupon.js";

const coupon = {
  id: 1,
  available: 1,
  condition: "无使用门槛\n最多优惠12元",
  reason: "已使用",
  value: 150,
  name: "",
  description: "你可以放心使用",
  startAt: 1489104000,
  endAt: 1514592000,
  valueDesc: "1.5",
  unitDesc: "元"
};

export default {
  data() {
    return {
      active: 0, //当前优惠券状态
      loading: false,
      finished: false,
      isLoading: false,
      coupons: [],
      disabledCoupons: []
    };
  },
  created() {
    this._getUsableCouponList();
    this._getUnUsableCouponList();
  },
  methods: {
    back() {
      this.$router.goBack();
    },
    onLoad() {
      setTimeout(() => {
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        this.finished = true;
      }, 500);
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
      }, 500);
    },
    //获取可用优惠券列表
    _getUsableCouponList() {
      let params = {
        status: 1
      };
      this.coupons.splice(0);
      getCouponList(params).then(res => {
        if (res.code === 0) {
          res.data.forEach(item => {
            this.coupons.push({
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
        }
      });
    },
    //获取不可用优惠券列表
    _getUnUsableCouponList() {
      let params = {
        status: -1
      };
      this.coupons.splice(0);
      getCouponList(params).then(res => {
        if (res.code === 0) {
          res.data.forEach(item => {
            this.disabledCoupons.push({
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
        }
      });
    }
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [CouponCell.name]: CouponCell,
    [CouponList.name]: CouponList,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Toast.name]: Toast,
    NavBar
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.coupon {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 10;
  background: $color-background-d;
}
</style>
