<template>
  <div class="refund-item">
    <div class="refund-item-seller">
      <van-icon name="shop-o"></van-icon>
      <span class="seller-name">{{ sellerName }}</span>
      <van-icon name="arrow"></van-icon>
    </div>
    <div class="refund-item-content">
      <slot></slot>
      <div class="refund-type-text">
        <span>{{ refundTypeTxt[refundType] }}</span>
        <span>{{ refundStatusTxt }}</span>
      </div>
    </div>
    <div class="refund-item-operation van-hairline--top">
      <slot name="operation"></slot>
      <van-button plain hairline type="danger" size="small" @click="seeDetail">查看详情</van-button>
    </div>
  </div>
</template>
<script>
import { Icon, Button } from "vant";

export default {
  data() {
    return {
      opeBtn: {},
      refundTypeTxt: {
        1: "仅退款",
        2: "退货退款"
      }
    };
  },
  props: {
    sellerName: {
      type: String,
      default: "潮品商城"
    },
    sellerId: {
      type: Number,
      default: 1
    },
    refundType: {
      type: Number,
      default: 1
    },
    refundStatus: {
      type: Number,
      default: 1
    },
    isPay: {
      type: Number,
      default: 0
    }
  },
  computed: {
    refundStatusTxt() {
      if (this.isPay) {
        return "退款成功";
      } else {
        let map = {
          1: "处理中",
          2: "商家同意",
          3: "商家已拒绝"
        };
        return map[this.refundStatus]
      }
    }
  },
  methods: {
    seeDetail() {
      this.$emit("seeDetail");
    }
  },
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.refund-item {
  background: $color-background-w;
  padding: 10px;
  padding-bottom: 0;
  margin-bottom: 5px;

  .refund-item-seller {
    display: flex;
    justify-items: center;
    padding: 10px 0;
    font-size: 14px;

    .van-icon {
      font-size: 16px;
    }

    .seller-name {
      padding: 0 6px;
      line-height: 16px;
    }
  }

  .refund-item-content {
    .refund-type-text {
      font-size: 14px;
      padding: 10px 0;

      span {
        padding: 5px;
      }
    }
  }

  .refund-item-operation {
    display: flex;
    flex-direction: row-reverse;
    padding: 10px;
  }
}
</style>