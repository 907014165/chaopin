<template>
  <div class="sku-gorup" :class="isShopCart?'isShopCart':''">
    <div class="order_head">
      <div class="order_seller">
        <van-checkbox
          v-model="selectAllShow"
          v-if="skuList.length"
          @click="toggleSelectAll"
          checked-color="#ee0a24"
        ></van-checkbox>
        <span class="seller-icon" v-if="isSeller">
          <van-icon name="shop-o"></van-icon>
        </span>
        <span class="seller-name">{{ seller.name }}</span>
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
      <template v-if="seller.skuList.length">
        <van-checkbox-group v-model="result" @change="changeSelectSku">
          <van-checkbox
            v-for="(item,index) in skuList"
            :key="index"
            :name="item"
            checked-color="#ee0a24"
          >
            <sku-item
              :is-show-stepper="isShowStepper"
              :sku="item"
              @change-num="changeNum"
              :is-order="isOrder"
              :max-num="item.storageNum"
              @clickOrder="clickOrder"
            ></sku-item>
          </van-checkbox>
        </van-checkbox-group>
      </template>
      <slot name="order-price"></slot>
    </div>
    <div class="order_footer van-hairline--top" v-if="hasFooter">
      <div class="btn-wrapper">
        <van-button
          plain
          hairline
          :type="item.type"
          size="small"
          v-for="(item,index) in currentBtn"
          @click="btnOperation(item)"
          :key="index"
        >{{ item.text }}</van-button>
      </div>
    </div>
  </div>
</template>
<script>
import { Icon, Button, Checkbox, CheckboxGroup } from "vant";
import SkuItem from "components/SkuItem/SkuItem";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      stateMap: null,
      stateBtn: {
        10: [
          {
            type: "default",
            text: "取消订单",
            btnType: "cancelOrder"
          },
          {
            type: "danger",
            text: "去支付",
            btnType: "toPay"
          }
        ],
        20: [
          {
            type: "danger",
            text: "提醒卖家发货",
            btnType: "warnSend"
          }
        ],
        30: [
          {
            type: "default",
            text: "查看物流",
            btnType: "lookLogistics"
          },
          {
            type: "danger",
            text: "确认收货",
            btnType: "confirmGoods"
          }
        ],
        40: [
          {
            type: "default",
            text: "评论",
            btnType: "comment"
          } /* ,
          {
            type: "danger",
            text: "申请退款"
          } */
        ],
        50: [
          {
            type: "default",
            text: "查看评论",
            btnType: "SeeComment"
          }
        ],
        0: [
          {
            type: "default",
            text: "删除订单",
            btnType: "delOrder"
          },
          {
            type: "danger",
            text: "再次购买"
          }
        ],
        5: []
      },
      result: [],
      isSelectAll: this.SelectAll,
      skuList: this.seller.skuList,
      selectAllShow: false //负责全选按钮的样式
    };
  },
  props: {
    seller: {
      type: Object,
      default() {
        return {
          sellerId: 78,
          name: "潮品商城",
          skuList: []
        };
      }
    },
    isSeller: {
      type: Boolean,
      default: true
    },
    /* skuList: {
      type: Array,
      default() {
        return [];
      }
    }, */
    orderStatus: {
      type: Number,
      default: 1
    },
    hasFooter: {
      type: Boolean,
      default: true
    },
    isShowStepper: {
      type: Boolean,
      default: false
    },
    SelectAll: {
      type: Boolean,
      default: false
    },
    isShopCart: {
      type: Boolean,
      default: false
    },
    isOrder: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.stateMap = {
      10: "待付款",
      20: "已付款",
      30: "卖家已发货",
      40: "已完成",
      50: "已评价",
      0: "已取消",
      5: ""
    };
    console.log("sku-group create");
    this.init();
  },
  computed: {
    currentState() {
      return this.stateMap[this.seller.status];
    },
    currentBtn() {
      return this.stateBtn[this.seller.status];
    },
    currentStateCls() {
      return;
    }
  },
  methods: {
    clickOrder() {
      this.$emit("clickOrder");
    },
    deleteSku() {
      this.$emit("del");
    },
    //底部订单按钮操作回调
    btnOperation(item) {
      this.$emit(`${item.btnType}`);
    },
    test() {
      console.log("test" + "--" + this.orderStatus);
    },
    toggleSelectAll() {
      this.isSelectAll = !this.isSelectAll;
    },
    init() {
      //console.log("初始化");
      if (this.isSelectAll) {
        console.log("全选");
        this.selectAllShow = true;
        this.result.splice(0);
        console.log(this.skuList);
        this.skuList.forEach((item, index) => {
          this.result.push(item);
        });
      } else {
        console.log("取消全选");
        this.result.splice(0);
        this.selectAllShow = false;
      }

      if (this.result.length === this.skuList.length) {
        //并且高亮为true
        this.selectAllShow = true;
      } else {
        //否则高亮为false
        this.selectAllShow = false;
      }

      if (this.selectAllShow && !this.isSelectAll) {
        this.toggleSelectAll();
      }
    },
    changeSelectSku() {
      console.log("change");
      let params = {
        sellerId: this.seller.sellerId,
        isSelectAll: this.selectAllShow,
        name: this.seller.name,
        skuList: this.result
      };
      this.setShopCart(params);
    },
    //当选择的数字发生
    changeNum(params) {
      let index = this.skuList.findIndex(item => {
        return item.skuId === params.skuId;
      });

      this.skuList[index].num = params.num;

      let seller = {
        sellerId: this.seller.sellerId,
        isSelectAll: this.selectAllShow,
        name: this.seller.name,
        skuList: this.result
      };
      this.setShopCart(seller);
      this.$emit("change-num", params);
    },
    ...mapMutations({
      setShopCart: "SET_SHOP_CART"
    })
  },
  watch: {
    //全选
    isSelectAll(newval, oldval) {
      console.log("全选");
      if (newval) {
        console.log("全选");
        this.result.splice(0);
        this.selectAllShow = true;
        this.skuList.forEach((item, index) => {
          console.log(item);
          this.result.push(item);
        });
      } else {
        console.log("取消全选");
        //如果全选了 就全部清空
        if (this.result.length === this.skuList.length) {
          this.result.splice(0);
        }
        this.selectAllShow = false;
      }
    },
    selectAllShow(newval, oldval) {
      //console.log('fff')
      //如果全选高亮 并且此时 全选状态为false
      if (newval && !this.isSelectAll) {
        this.toggleSelectAll();
      } else {
      }
    },
    //如果列表全选 让全选按钮高亮
    result() {
      console.log(this.result);
      if (this.result.length === this.skuList.length) {
        /* //满足条件让全选置为true
        this.isSelectAll = true; */
        //并且高亮为true
        this.selectAllShow = true;
      } else {
        //否则高亮为false
        this.selectAllShow = false;
      }
    },
    //监听skulist 如果发生变化 选择结果置空
    skuList() {
      this.result.splice(0);
    },
    SelectAll(newval) {
      this.isSelectAll = newval;
    }
  },
  components: {
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Checkbox.name]: Checkbox,
    [CheckboxGroup.name]: CheckboxGroup,
    SkuItem
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

  &.isShopCart {
    .van-checkbox__icon, .van-checkbox__icon--round {
      display: none;
    }
  }

  .order_head {
    display: flex;
    justify-content: space-between;

    .order_seller {
      font-size: 14px;
      line-height: 24px;
      display: flex;
      align-items: center;

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

  .order_content {
    .van-checkbox__label {
      width: 100%;
    }
  }

  .order_footer {
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
