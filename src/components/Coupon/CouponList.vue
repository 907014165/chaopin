<template>
  <div class="coupon-list">
    <nav-bar :title="'领取优惠卷'" @back="back"></nav-bar>
    <!-- <transition name="van-fade">
      <template v-show="couponList.length"> -->
        <coupon-item
          v-for="(coupon,index) in couponList"
          :key="index"
          :item="coupon"
          @getCoupon="_getCoupon(coupon.couponId)"
        ></coupon-item>
      <!-- </template>
    </transition> -->
  </div>
</template>

<script>
import CouponItem from "./CouponItem";
import NavBar from "base/NavBar/NavBar";
import { Dialog, Toast } from "vant";
import { canReceiveCoupons, getCoupon } from "api/coupon.js";

class PendingCoupon {
  constructor({
    couponId,
    is_expired,
    cut,
    full,
    limit_start_time,
    limit_end_time
  }) {
    this.couponId = couponId;
    this.is_expired = is_expired;
    this.cut = cut;
    this.full = full;
    this.limit_start_time = limit_start_time;
    this.limit_end_time = limit_end_time;
  }
}
export default {
  data() {
    return {
      couponList: []
    };
  },
  created() {
    this._canReceiveCoupons();
  },
  methods: {
    back() {
      this.$router.goBack();
    },
    _getCoupon(couponId) {
      Dialog.confirm({
        title: "确认领取？",
        beforeClose: (action, done) => {
          if (action === "confirm") {
            let data = {
              couponId: couponId
            };
            getCoupon(data).then(res => {
              console.log(res);
              if (res.data) {
                Toast({
                  type: "success",
                  message: "领取成功",
                  duration: 800
                });
                done();
              } else {
                Toast({
                  type: success,
                  message: res.message,
                  duration: 800
                });
                done();
              }
              this._canReceiveCoupons();
            });
          } else {
            done();
          }
        }
      });
    },
    _canReceiveCoupons() {
      this.couponList = [];
      canReceiveCoupons().then(res => {
        if (res.code === 0) {
          res.data.forEach(coupon => {
            this.couponList.push(
              new PendingCoupon({
                couponId: coupon.couponId,
                is_expired: 0,
                cut: coupon.cutMoney,
                full: coupon.fullMoney,
                limit_start_time: coupon.limitStartTime,
                limit_end_time: coupon.limitEndTime
              })
            );
          });
        }
      });
    }
  },
  components: {
    [Dialog.name]: Dialog,
    [Toast.name]: Dialog,
    NavBar,
    CouponItem
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.coupon-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: scroll;
  background: $color-background;
}
</style>