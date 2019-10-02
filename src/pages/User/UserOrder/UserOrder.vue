<template>
  <div class="user-order">
    <nav-bar title="我的订单" @back="back"></nav-bar>
    <van-tabs v-model="active" animated swipeable>
      <van-tab title="全部">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <div class="wrapper">
            <sku-group
              :seller="seller"
              v-for="(seller,index) in orderList"
              :key="index"
              :is-shop-cart="true"
            ></sku-group>
          </div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="待付款">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <sku-group
            :seller="seller"
            v-for="seller in orderList"
            :key="seller.sellerId"
            :is-shop-cart="true"
          ></sku-group>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="待发货">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <sku-group
            :seller="seller"
            v-for="seller in orderList"
            :key="seller.sellerId"
            :is-shop-cart="true"
          ></sku-group>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="待收货">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <sku-group
            :seller="seller"
            v-for="seller in orderList"
            :key="seller.sellerId"
            :is-shop-cart="true"
          ></sku-group>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="已完成">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <sku-group
            :seller="seller"
            v-for="seller in orderList"
            :key="seller.sellerId"
            :is-shop-cart="true"
          ></sku-group>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="已取消">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <sku-group
            :seller="seller"
            v-for="seller in orderList"
            :key="seller.sellerId"
            :is-shop-cart="true"
          ></sku-group>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { Tab, Tabs, PullRefresh, Toast } from "vant";
import NavBar from "base/NavBar/NavBar";
import NoResult from "base/NoResult/NoResult";
import SkuItem from "components/SkuItem/SkuItem";
import Scroll from "base/Scroll/Scroll";
import SkuGroup from "components/SkuGroup/SkuGroup";
import { getUserOrder } from "api/user.js";
import OrderGoods from "common/js/orderGoods.js";

const All = {
  orderList: []
};
export default {
  data() {
    return {
      active: parseInt(this.$route.params.id),
      isLoading: false, //是否正在下拉刷新
      orderList: []
    };
  },
  created() {
    this._getUserOrder(1);
  },
  methods: {
    back() {
      this.$router.back();
    },
    onRefresh() {
      setTimeout(() => {
        Toast.success("刷新成功");
        this.isLoading = false;
      }, 500);
    },
    _getUserOrder(status) {
      let params = {
        status: status
      };
      this.orderList.splice(0);
      getUserOrder(params).then(res => {
        if (res.code === 0) {
          /* res.data.forEach(item=>{
            this.orderList.push(new OrderGoods({
              goodsId:item.id,
              desc:item.desc,
              imgUrl:item.img,
              price:item.price,
              orderState:item.state
            }))
          }) */
          res.data.forEach(seller => {
            let obj = {
              sellerId: seller.sellerId,
              name: seller.name,
              status: seller.status,
              skuList: []
            };
            seller.orderList.forEach(sku => {
              obj.skuList.push({
                skuId: sku.skuId,
                title: sku.title,
                desc: sku.desc,
                num: sku.num,
                price: sku.price,
                thumb: sku.thumb
              });
            });
            this.orderList.push(obj);
          });
          console.log(res.data);
        }
      });
    }
  },
  watch: {
    active(newval, oldval) {
      switch (newval) {
        case 0:
          this._getUserOrder(1);
          break;
        case 1:
          this._getUserOrder(10);
          break;
        case 2:
          this._getUserOrder(30);
          break;
        case 3:
          this._getUserOrder(30);
          break;
        case 4:
          this._getUserOrder(40);
          break;
        case 5:
          this._getUserOrder(0);
          break;
      }
    }
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [PullRefresh.name]: PullRefresh,
    [Toast.name]: Toast,
    Scroll,
    NavBar,
    NoResult,
    SkuItem,
    SkuGroup
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.user-order {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  background: $color-background;
  overflow-y: scroll;
}
</style>
