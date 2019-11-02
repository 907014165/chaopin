<template>
  <div class="coupon-item">
    <li :class="[item.is_expired == 1 ? 'mui-active' : ''  ]" class="mb05">
      <div class="coupon-header">
        <div class="coupon-money">
          ￥
          <span>{{item.cut}}</span>
        </div>
        <div class="right">
          <div class="category1">全部品类</div>
          <div class="condition">满{{item.full}}可用</div>
        </div>
      </div>
      <div class="h"></div>
      <div class="coupon-footer p1">
        <span
          class="colora f6"
        >{{item.limit_start_time | dateFormat}}-{{item.limit_end_time | dateFormat}}</span>
        <span class="fr" @click="getCoupon">
          <template v-if="item.is_expired == 1">已领取</template>
          <template v-if="item.is_expired == 0">立即领取</template>
        </span>
      </div>
    </li>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      default() {
        return {
          is_expired: 1,
          cut: 15,
          full: 199,
          limit_start_time: "2019-10-26",
          limit_end_time: "2020-10-25"
        };
      }
    }
  },
  methods: {
    getCoupon() {
      this.$emit("getCoupon");
    }
  }
};
</script>

<style lang="stylus" scoped>
.coupon-item {
  padding: 5px;

  .mui-active {
    color: #ea3962;
  }

  li {
    display: block;
    background: #fff;
    border-radius: 5px;
    position: relative;

    .coupon-header {
      color: #ea3962;
      font-size: 10px;
      padding: 15px;
      display: flex;
      justify-content: space-between;

      .coupon-money {
        color: #ea3962;
        font-size: 20px;

        span {
          font-size: 30px;
        }
      }

      .right {
        color: black;

        .category1 {
          margin: 5px;
        }

        .condition {
          margin: 5px;
        }
      }
    }

    .h {
      height: 1px;
      border-bottom: dashed 1px #f1f1f1;
      position: relative;
      width: 100%;

      &:after, &:before {
        display: block;
        content: '';
        width: 16px;
        height: 16px;
        background: #F5F5F5;
        border-radius: 50%;
        position: absolute;
        top: -8px;
      }

      &:after {
        right: -8px;
      }

      &:before {
        left: -8px;
      }
    }

    .coupon-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;

      .fr {
        font-size: 16px;
        color: #372d2d;
      }

      .colora {
        font-size: 12px;
        color: #372d2d;
      }
    }
  }
}
</style>