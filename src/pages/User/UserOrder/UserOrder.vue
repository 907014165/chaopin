<template>
  <div class="user-order">
    <nav-bar title="我的订单" @back="back"></nav-bar>
    <van-tabs v-model="active" swipeable>
      <van-tab title="全部">
        <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
          <scroll
            class="wrapper"
            :data="orderList"
            v-show="orderList.length"
            :has-more="hasMore"
            @load="loadMore"
            :pull-up="true"
            :listen-scroll="true"
            @scroll="scroll"
          >
            <sku-group
              :seller="seller"
              v-for="(seller,index) in orderList"
              :key="index"
              :is-shop-cart="true"
              :is-order="true"
              @cancelOrder="cancelOrder(seller.orderId)"
              @clickOrder="clickOrder(seller.orderId,index)"
              @delOrder="delOrder(seller.orderId)"
              @confirmGoods="confirmGoods(seller.orderId)"
              @toPay="toPay(seller)"
              @lookLogistics="lookLogistics(seller.orderId)"
              @SeeComment="seeComment"
              @comment="comment(index)"
              @warnSend="warnSend"
            >
              <div slot="order-price" class="order-price">
                <span>共{{ getCuttentOrderNum(seller.skuList) }}件商品</span>
                <span>合计:￥{{ seller.orderAmount }}</span>
              </div>
            </sku-group>
          </scroll>
          <no-result :type="1" v-show="!orderList.length&&!isLoading">暂无相关订单</no-result>
          <div class="loading-wrapper" v-show="isLoading">
            <van-loading size="24px" vertical>加载中...</van-loading>
          </div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="待付款">
        <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
          <scroll
            class="wrapper"
            :data="orderList"
            v-show="orderList.length"
            :has-more="hasMore"
            @load="loadMore"
            :pull-up="true"
            :listen-scroll="true"
            @scroll="scroll"
          >
            <sku-group
              :seller="seller"
              v-for="(seller,index) in orderList"
              :key="index"
              :is-shop-cart="true"
              :is-order="true"
              @cancelOrder="cancelOrder(seller.orderId)"
              @clickOrder="clickOrder(seller.orderId,index)"
              @delOrder="delOrder(seller.orderId)"
              @confirmGoods="confirmGoods(seller.orderId)"
              @toPay="toPay(seller)"
            >
              <div slot="order-price" class="order-price">
                <span>共{{ getCuttentOrderNum(seller.skuList) }}件商品</span>
                <span>合计:￥{{ seller.orderAmount }}</span>
              </div>
            </sku-group>
          </scroll>
          <no-result :type="1" v-show="!orderList.length&&!isLoading">暂无相关订单</no-result>
          <div class="loading-wrapper" v-show="isLoading">
            <van-loading size="24px" vertical>加载中...</van-loading>
          </div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="待发货">
        <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
          <scroll
            class="wrapper"
            :data="orderList"
            v-show="orderList.length"
            :has-more="hasMore"
            @load="loadMore"
            :pull-up="true"
            :listen-scroll="true"
            @scroll="scroll"
          >
            <sku-group
              :seller="seller"
              v-for="(seller,index) in orderList"
              :key="index"
              :is-shop-cart="true"
              :is-order="true"
              @cancelOrder="cancelOrder(seller.orderId)"
              @clickOrder="clickOrder(seller.orderId,index)"
              @delOrder="delOrder(seller.orderId)"
              @confirmGoods="confirmGoods(seller.orderId)"
              @warnSend="warnSend"
            >
              <div slot="order-price" class="order-price">
                <span>共{{ getCuttentOrderNum(seller.skuList) }}件商品</span>
                <span>合计:￥{{ seller.orderAmount }}</span>
              </div>
            </sku-group>
          </scroll>
          <no-result :type="1" v-show="!orderList.length&&!isLoading">暂无相关订单</no-result>
          <div class="loading-wrapper" v-show="isLoading">
            <van-loading size="24px" vertical>加载中...</van-loading>
          </div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="待收货">
        <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
          <scroll
            class="wrapper"
            :data="orderList"
            v-show="orderList.length"
            :has-more="hasMore"
            @load="loadMore"
            :pull-up="true"
            :listen-scroll="true"
            @scroll="scroll"
          >
            <sku-group
              :seller="seller"
              v-for="(seller,index) in orderList"
              :key="index"
              :is-shop-cart="true"
              :is-order="true"
              @cancelOrder="cancelOrder(seller.orderId)"
              @clickOrder="clickOrder(seller.orderId,index)"
              @delOrder="delOrder(seller.orderId)"
              @confirmGoods="confirmGoods(seller.orderId)"
              @lookLogistics="lookLogistics(seller.orderId)"
            >
              <div slot="order-price" class="order-price">
                <span>共{{ getCuttentOrderNum(seller.skuList) }}件商品</span>
                <span>合计:￥{{ seller.orderAmount }}</span>
              </div>
            </sku-group>
          </scroll>
          <no-result :type="1" v-show="!orderList.length&&!isLoading">暂无相关订单</no-result>
          <div class="loading-wrapper" v-show="isLoading">
            <van-loading size="24px" vertical>加载中...</van-loading>
          </div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="已完成">
        <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
          <scroll
            class="wrapper"
            :data="orderList"
            v-show="orderList.length"
            :has-more="hasMore"
            @load="loadMore"
            :pull-up="true"
            :listen-scroll="true"
            @scroll="scroll"
          >
            <sku-group
              :seller="seller"
              v-for="(seller,index) in orderList"
              :key="index"
              :is-shop-cart="true"
              :is-order="true"
              @cancelOrder="cancelOrder(seller.orderId)"
              @clickOrder="clickOrder(seller.orderId,index)"
              @delOrder="delOrder(seller.orderId)"
              @confirmGoods="confirmGoods(seller.orderId)"
              @comment="comment(index)"
            >
              <div slot="order-price" class="order-price">
                <span>共{{ getCuttentOrderNum(seller.skuList) }}件商品</span>
                <span>合计:￥{{ seller.orderAmount }}</span>
              </div>
            </sku-group>
          </scroll>
          <no-result :type="1" v-show="!orderList.length&&!isLoading">暂无相关订单</no-result>
          <div class="loading-wrapper" v-show="isLoading">
            <van-loading size="24px" vertical>加载中...</van-loading>
          </div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="已取消">
        <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
          <scroll
            class="wrapper"
            :data="orderList"
            v-show="orderList.length"
            :has-more="hasMore"
            @load="loadMore"
            :pull-up="true"
            :listen-scroll="true"
            @scroll="scroll"
          >
            <sku-group
              :seller="seller"
              v-for="(seller,index) in orderList"
              :key="index"
              :is-shop-cart="true"
              :is-order="true"
              @cancelOrder="cancelOrder(seller.orderId)"
              @clickOrder="clickOrder(seller.orderId,index)"
              @delOrder="delOrder(seller.orderId)"
              @confirmGoods="confirmGoods(seller.orderId)"
            >
              <div slot="order-price" class="order-price">
                <span>共{{ getCuttentOrderNum(seller.skuList) }}件商品</span>
                <span>合计:￥{{ seller.orderAmount }}</span>
              </div>
            </sku-group>
          </scroll>
          <no-result :type="1" v-show="!orderList.length&&!isLoading">暂无相关订单</no-result>
          <div class="loading-wrapper" v-show="isLoading">
            <van-loading size="24px" vertical>加载中...</van-loading>
          </div>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="已评价">
        <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
          <scroll
            class="wrapper"
            :data="orderList"
            v-show="orderList.length"
            :has-more="hasMore"
            @load="loadMore"
            :pull-up="true"
            :listen-scroll="true"
            @scroll="scroll"
          >
            <sku-group
              :seller="seller"
              v-for="(seller,index) in orderList"
              :key="index"
              :is-shop-cart="true"
              :is-order="true"
              @cancelOrder="cancelOrder(seller.orderId)"
              @clickOrder="clickOrder(seller.orderId,index)"
              @delOrder="delOrder(seller.orderId)"
              @confirmGoods="confirmGoods(seller.orderId)"
              @SeeComment="seeComment"
            >
              <div slot="order-price" class="order-price">
                <span>共{{ getCuttentOrderNum(seller.skuList) }}件商品</span>
                <span>合计:￥{{ seller.orderAmount }}</span>
              </div>
            </sku-group>
          </scroll>
          <no-result :type="1" v-show="!orderList.length&&!isLoading">暂无相关订单</no-result>
          <div class="loading-wrapper" v-show="isLoading">
            <van-loading size="24px" vertical>加载中...</van-loading>
          </div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <transition name="van-slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { Tab, Tabs, PullRefresh, Toast, Dialog, Loading } from "vant";
import NavBar from "base/NavBar/NavBar";
import NoResult from "base/NoResult/NoResult";
import SkuItem from "components/SkuItem/SkuItem";
import Scroll from "base/Scroll/Scroll";
import SkuGroup from "components/SkuGroup/SkuGroup";

import {
  getUserOrder,
  getUserAllOrder,
  getUserOrderByStatus,
  cancelOrder,
  deleteOrder,
  signOrder
} from "api/order.js";
import OrderGoods from "common/js/orderGoods.js";
import SkuGoods from "common/js/skuGoods.js";
import AddressInfo from "common/js/addressInfo.js";
import { mapMutations } from "vuex";

const All = {
  orderList: []
};
//将规格的json字符串转换为自己想要的 字符串
function spec(treeStr) {
  let specStr = "";
  let specObj = JSON.parse(treeStr);
  //console.log(specObj)
  for (let i = 0; i < specObj.length; i++) {
    let tmp = "";
    for (let key in specObj[i]) {
      //console.log(1)
      tmp += specObj[i][key] + ":";
    }
    tmp = tmp.substring(0, tmp.length - 1);
    specStr += tmp + " ";
  }
  console.log(specStr);
  return specStr;
}
export default {
  data() {
    return {
      active: parseInt(this.$route.params.id),
      isLoading: true, //是否正在加载数据
      orderList: [],
      hasMore: true,
      currentPage: 1,
      scrollY: 0,
      disabled: true
    };
  },
  created() {
    //this._getUserOrder(1);
    //this._getUserAllOrder();

    this.getOrderListByStatus(this.active);
    //this._deleteOrder()
  },
  computed: {
    /* showLoading(){
      if(){}
    } */
  },
  methods: {
    back() {
      /*  this.$router.push({
        path: "/user"
      }); */
      this.$router.goBack({
        path: "/user"
      });
    },
    //监听scroll事件
    scroll(pos) {
      this.scrollY = pos.y;
      if (pos.y >= -10) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    //提醒发货
    warnSend() {
      Toast.success({
        message: "已提醒卖家尽快发货",
        duration: 800
      });
    },
    //刷新
    onRefresh() {
      this.orderList.splice(0);
      this.currentPage = 1;
      this.hasMore = true;
      this.isLoading = true;
      this.scrollY = 0;
      this.getOrderListByStatus(this.active, () => {
        this.isLoading = false;
      });
    },
    //加载更多数据
    loadMore(callback) {
      if (!this.hasMore) {
        return;
      }
      this.currentPage++;
      this.getOrderListByStatus(this.active, callback);
    },
    //评论
    comment(index) {
      console.log("点击了评论按钮" + index);
      console.log(this.orderList[index]);
      this.$router.push({
        path: "/testComment",
        query: {
          seller: this.orderList[index]
        }
      });
    },
    //查看物流
    lookLogistics(orderId) {
      this.$router.push({
        path: "/logisticsDetail",
        query: {
          orderId: orderId
        }
      });
    },
    //查看评论
    seeComment() {
      console.log("查看评论");
      this.$router.push({
        path: "/user/myComment"
      });
    },
    //去支付
    toPay(order) {
      console.log(order);
      let inPaying = {
        orderIds: [order.orderId],
        sum: order.orderAmount
      };
      this.setInPayMent(inPaying);
      this.$router.replace({
        name: "toPay"
      });
    },
    //取消订单
    cancelOrder(orderId) {
      console.log(orderId);
      // let params = {
      //   orderId:orderId
      // }
      Dialog.confirm({
        title: "确定,取消订单?",
        beforeClose: (action, done) => {
          if (action === "confirm") {
            let params = new FormData();
            params.append("orderId", orderId);
            this._cancelOrder(params, () => {
              this.orderList = [];
              this.currentPage = 1;
              this.getOrderListByStatus(this.active);
              done();
            });
          } else {
            done();
          }
        }
      });
    },
    //删除用户订单
    delOrder(orderId) {
      console.log(orderId);

      Dialog.confirm({
        title: "确定,删除订单？",
        beforeClose: (action, done) => {
          if (action === "confirm") {
            let params = {
              orderId: orderId
            };
            this._deleteOrder(params, () => {
              this.orderList = [];
              this.currentPage = 1;
              this.isLoading = true;
              this.getOrderListByStatus(this.active);
              done();
            });
          } else {
            done();
          }
        }
      });
    },
    //用户确认收货
    confirmGoods(orderId) {
      Dialog.confirm({
        title: "确认收货？",
        beforeClose: (action, done) => {
          if (action === "confirm") {
            let params = new FormData();
            params.append("orderId", orderId);
            this._signOrder(params, () => {
              this.orderList = [];
              this.currentPage = 1;
              this.getOrderListByStatus(this.active);
              done();
            });
          } else {
            done();
          }
        }
      });
    },
    //点击订单进入订单详情
    clickOrder(orderId, index) {
      /* console.log("点击了订单");
      console.log(orderId);
      console.log(index) */
      this.setCurrentOrderDetail(this.orderList[index]);
      this.$router.push({
        path: `/user/order/${this.active}/orderDetail/${orderId}`
      });
    },
    //获得当前订单的商品数量
    getCuttentOrderNum(skulist) {
      let num = 0;
      skulist.forEach(sku => {
        num += sku.num;
      });
      return num;
    },
    getOrderListByStatus(status, callback) {
      console.log("执行");
      const Cancel = 0,
        PendingPay = 10,
        PendingLogistics = 20,
        Logistics = 30,
        Complete = 40,
        Comment = 50;

      let params = {
        pageNo: this.currentPage,
        orderStatus: 30
      };
      switch (status) {
        case 0:
          this._getUserAllOrder(callback);
          break;
        case 1:
          params["orderStatus"] = PendingPay;
          this._getUserOrderByStatus(params, callback);
          break;
        case 2:
          params["orderStatus"] = PendingLogistics;
          this._getUserOrderByStatus(params, callback);
          break;
        case 3:
          params["orderStatus"] = Logistics;
          this._getUserOrderByStatus(params, callback);
          break;
        case 4:
          params["orderStatus"] = Complete;
          this._getUserOrderByStatus(params, callback);
          break;
        case 5:
          params["orderStatus"] = Cancel;
          this._getUserOrderByStatus(params, callback);
          break;
        case 6:
          params["orderStatus"] = Comment;
          this._getUserOrderByStatus(params, callback);
          break;
      }
    },
    //初始化 数据结构
    init(res) {
      console.log(res);
      console.log(this.isLoading);
      this.isLoading = false;

      if (!res.data.length) {
        this.hasMore = false;

        return;
      }

      res.data.forEach(order => {
        let addr = new AddressInfo({
          name: order.orderBO.consignee,
          tel: order.orderBO.mobile,
          address: order.orderBO.pcaInfo + " " + order.orderBO.address
        });
        console.log(addr);
        let obj = {
          sellerId: order.orderBO.storeId,
          name: order.storeName,
          status: order.orderBO.orderStatus,
          orderAmount: order.orderBO.orderAmount,
          orderId: order.orderBO.orderId,
          orderNo: order.orderBO.orderNo,
          createTime: order.orderBO.createTime,
          payTime: order.orderBO.payTime,
          sendTime: order.orderBO.sendTime,
          maxDelTime: order.orderBO.maxDelTime,
          dealTime: order.orderBO.dealTime,
          addr: addr,
          skuList: []
        };
        order.orderGoodsList.forEach(ordergoods => {
          let skugoods = new SkuGoods({
            goodsId: ordergoods.goodsId,
            goodsCommonId: ordergoods.goodsCommonId,
            orderGoodsId: ordergoods.orderGoodsId,
            title: ordergoods.goodsName,
            desc: spec(ordergoods.spec),
            num: ordergoods.buyNum,
            price: ordergoods.price,
            thumb: ordergoods.full
          });
          obj.skuList.push(skugoods);
        });
        this.orderList.push(obj);
      });
      this.$nextTick(() => {
        this.orderList = this.orderList.slice(0);
      });
    },
    //根据状态获取用户订单(请求)

    //获取用户所有订单(请求)
    _getUserAllOrder(callback) {
      let params = {
        pageNo: this.currentPage
      };
      /* this.orderList = []; */
      getUserAllOrder(params).then(res => {
        //console.log(res);
        this.init(res);
        if (callback) {
          this.$nextTick(() => {
            callback();
          });
        }
      });
    },
    //删除用户订单(请求)
    _deleteOrder(params, callback) {
      deleteOrder(params).then(res => {
        if (res.data) {
          console.log("删除订单成功");
          callback();
        }
      });
    },
    //取消用户订单(请求)
    _cancelOrder(params, callback) {
      cancelOrder(params).then(res => {
        if (res.data) {
          console.log("取消成功");
          callback();
        }
      });
    },
    //通过状态获取用户订单(请求)
    _getUserOrderByStatus(params, callback) {
      /* this.orderList = []; */
      getUserOrderByStatus(params).then(res => {
        //console.log(res);
        if (res.code === 0) {
          this.init(res);
          if (callback) {
            this.$nextTick(() => {
              callback();
            });
          }
        }
      });
    },
    //用户确认收货(请求)
    _signOrder(params, callback) {
      signOrder(params).then(res => {
        if (res.data) {
          console.log(res);
          console.log("确认收货成功");
          callback();
        }
      });
    },
    ...mapMutations({
      setCurrentOrderDetail: "SET_CURRENT_ORDER_DETAIL",
      setInPayMent: "SET_IN_PAYMENT"
    })
  },
  watch: {
    //0全部 1待付款 2待发货 3待收货 4已完成 5已取消
    //0:已取消 1:全部 10:未付款 20:已付款 30:已发货 40:已完成 50:已评价
    active(newval, oldval) {
      this.orderList = [];
      this.currentPage = 1;
      this.hasMore = true;
      this.isLoading = true;
      this.scrollY = 0;
      this.disabled = true;
      this.getOrderListByStatus(newval);
    },
    $route(to, from) {
      //如果是支付页面过来的特别处理 解决支付页面跳转不能跳转相应的页面的bug
      if (from.name === "userorder") {
        if (this.$route.params.id) {
          this.active = parseInt(this.$route.params.id);
        }
      }
    }
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [PullRefresh.name]: PullRefresh,
    [Toast.name]: Toast,
    [Loading.name]: Loading,
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

  .no-result {
    padding-top: 40px;
  }

  .van-tabs__content {
    position: fixed;
    top: 89px;
    left: 0;
    right: 0;
    bottom: 0;

    .van-tab__pane {
      height: 100%;
      padding-top: -8px;
      overflow: hidden;

      .van-pull-refresh {
        height: 100%;

        .van-pull-refresh__track {
          height: 100%;
        }
      }

      .loading-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .scroll-wrapper-zujian.wrapper {
        height: 100%;

        .order-price {
          font-size: 14px;
          text-align: right;
          padding: 6px 4px;

          span {
            margin: 0 8px;
          }
        }
      }
    }
  }
}
</style>
