<template>
  <div class="sku-gorup" @click="test">
    <div class="order_head">
      <div class="order_seller">
        <span class="seller-icon" v-if="isSeller">
          <van-icon name="shop-o"></van-icon>
        </span>
        <span class="seller-name">{{ seller }}</span>
        <span class="seller-icon" v-if="isSeller">
          <van-icon name="arrow"></van-icon>
        </span>
      </div>
      <div class="order_state" v-if="hasFooter">
        <span>{{ currentState }}</span>
        <span @click="deleteSku"></span>
      </div>
    </div>
    <div class="order_content">
      <slot></slot>
    </div>
    <div class="order_footer van-hairline--top" v-if="hasFooter">
      <div class="btn-wrapper">
        <van-button
          plain
          hairline
          :type="item.type"
          size="small"
          v-for="(item,index) in currentBtn"
          :key="index"
        >{{ item.text }}</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Icon, Button } from "vant";

export default {
  data() {
    return {
      stateMap: null,
      stateBtn: {
        1: [
          {
            type: "danger",
            text: "去支付"
          }
        ],
        2: [
          {
            type: "default",
            text: "查看物流"
          },
          {
            type: "danger",
            text: "确认收货"
          }
        ],
        3: [
          {
            type: "default",
            text: "评论"
          },
          {
            type: "danger",
            text: "再次购买"
          }
        ],
        4: [
          {
            type: "default",
            text: "退款明细"
          },
          {
            type: "danger",
            text: "再次购买"
          }
        ]
      }
    };
  },
  props: {
    seller: {
      type: String,
      default: "潮品商城"
    },
    isSeller: {
      type: Boolean,
      default: true
    },
    orderState: {
      type: Number,
      default: 1
    },
    hasFooter: {
      type: Boolean,
      default: true
    }
  },
  created() {
    this.stateMap = { 1: "代付款", 2: "卖家已发货", 3: "已完成", 4: "已取消" };
  },
  computed: {
    currentState() {
      return this.stateMap[this.orderState];
    },
    currentBtn() {
      return this.stateBtn[this.orderState];
    },
    currentStateCls() {
      return;
    }
  },
  methods: {
    deleteSku() {
      this.$emit("del");
    },
    test(){
      console.log('test' + '--' + this.orderState)
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

.sku-gorup {
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  background: $color-background-w;

  .order_head {
    display: flex;
    justify-content: space-between;

    .order_seller {
      font-size: 14px;
      line-height: 24px;

      .seller-icon {
        vertical-align: middle;
        padding: 0 4px;
        font-weight: 700;
      }

      .seller-name {
        font-size: 15px;
        font-weight: 700;
      }
    }

    .order_state {
      font-size: 14px;
      line-height: 24px;
    }
  }

  .order_footer {
    overflow: hidden;
    padding-top: 8px;
    display: flex;
    flex-direction: row-reverse;

    .btn-wrapper {
      .van-button {
        margin: 0 8px;
      }
    }
  }
}
</style>
