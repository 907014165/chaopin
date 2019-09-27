<template>
  <div class="sku-gorup">
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
      <van-checkbox-group v-model="result" @change="changeSelectSku">
        <van-checkbox
          v-for="(item,index) in skuList"
          :key="index"
          :name="item"
          checked-color="#ee0a24"
        >
          <sku-item :is-show-stepper="isShowStepper" :sku="item" @change-num="changeNum"></sku-item>
        </van-checkbox>
      </van-checkbox-group>
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
import { Icon, Button, Checkbox, CheckboxGroup } from "vant";
import SkuItem from "components/SkuItem/SkuItem";
import { mapMutations } from "vuex";
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
    orderState: {
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
    }
  },
  created() {
    this.stateMap = {
      1: "代付款",
      2: "卖家已发货",
      3: "已完成",
      4: "已取消",
      5: ""
    };
    console.log('sku-group create')
    this.init();
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
    test() {
      console.log("test" + "--" + this.orderState);
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
        console.log(this.skuList)
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
      console.log('全选')
      if (newval) {
        console.log("全选");
        this.result.splice(0);
        this.selectAllShow = true;
        this.skuList.forEach((item, index) => {
          console.log(item)
          this.result.push(item);
        });
      } else {
        console.log("取消全选");
        this.result.splice(0);
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
      console.log(this.result)
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
