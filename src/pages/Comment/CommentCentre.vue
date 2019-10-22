<template>
  <transition name="van-slide-right">
    <div class="comment-centre">
      <nav-bar :title="'评价中心'" @back="back"></nav-bar>
      <van-tabs v-model="active">
        <van-tab title="待评论">
          <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
            <transition name="van-fade">
              <scroll
                class="wrapper"
                :data="orderList"
                v-show="orderList.length"
                :has-more="hasMore"
                @load="loadMore"
                :pull-up="true"
                @scroll="scroll"
                :listen-scroll="true"
              >
                <sku-group
                  :seller="seller"
                  v-for="(seller,index) in orderList"
                  :key="index"
                  :is-shop-cart="true"
                  @comment="comment(index)"
                ></sku-group>
              </scroll>
            </transition>
          </van-pull-refresh>
        </van-tab>
        <van-tab title="已评论">
          <van-pull-refresh v-model="isLoading" :disabled="disabled" @refresh="onRefresh">
            <transition name="van-fade">
              <scroll
                class="wrapper"
                :data="orderList"
                v-show="orderList.length"
                :has-more="hasMore"
                @load="loadMore"
                :pull-up="true"
                @scroll="scroll"
                :listen-scroll="true"
              >
                <sku-group
                  :seller="seller"
                  v-for="(seller,index) in orderList"
                  :key="index"
                  :is-shop-cart="true"
                  @comment="comment(index)"
                  @SeeComment="seeComment"
                ></sku-group>
              </scroll>
            </transition>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
      <div class="loading-wrapper" v-show="firstLoading">
        <van-loading size="24px" vertical>加载中...</van-loading>
      </div>
    </div>
  </transition>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import SkuGroup from "components/SkuGroup/SkuGroup";
import Scroll from "base/Scroll/Scroll";

import { getUserOrderByStatus } from "api/order.js";
import AddressInfo from "common/js/addressInfo.js";
import SkuGoods from "common/js/skuGoods.js";
import { Tab, Tabs, PullRefresh, Loading } from "vant";

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
      active: this.$route.query.initActive ? this.$route.query.initActive : 0, //显示当前是属于那种状态
      orderList: [],
      currentPage: 1,
      hasMore: true,
      isLoading: true,
      scrollY: 0,
      disabled: true,
      firstLoading: true
    };
  },
  created() {
    /* this._getUserOrder(); */
    this.getOrderListByStatus(this.active);
  },
  methods: {
    back() {
      this.$router.replace({
        path: "/user"
      });
    },
    onRefresh() {
      this.orderList.splice(0);
      this.currentPage = 1;
      this.hasMore = true;
      this.isLoading = true;
      this.getOrderListByStatus(this.active);
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
    seeComment() {
      console.log("查看评论");
      this.$router.push({
        path: "/user/myComment"
      });
    },
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
    loadMore(callback) {
      if (!this.hasMore) {
        return;
      }
      this.currentPage++;
      this.getOrderListByStatus(this.active, callback);
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
          params["orderStatus"] = Complete;
          this._getUserOrderByStatus(params, callback);
          break;
        case 1:
          params["orderStatus"] = Comment;
          this._getUserOrderByStatus(params, callback);
          break;
      }
    },
    init(res) {
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
          addr: addr,
          skuList: []
        };
        order.orderGoodsList.forEach(ordergoods => {
          let skugoods = new SkuGoods({
            goodsId: ordergoods.goodsId,
            goodsCommonId: ordergoods.goodsCommonId,
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
    },
    //通过状态获取用户订单(请求)
    _getUserOrderByStatus(params, callback) {
      /* this.orderList = []; */
      getUserOrderByStatus(params).then(res => {
        //console.log(res);
        if (res.code === 0) {
          this.init(res);
          this.firstLoading = false;
          if (callback) {
            callback();
          }
        }
      });
    }
  },
  watch: {
    //0全部 1待付款 2待发货 3待收货 4已完成 5已取消
    //0:已取消 1:全部 10:未付款 20:已付款 30:已发货 40:已完成 50:已评价
    active(newval, oldval) {
      this.orderList.splice(0);
      this.currentPage = 1;
      this.hasMore = true;
      this.isLoading = true;
      this.firstLoading = true;
      this.scrollY = 0;
      this.disabled = true;
      this.getOrderListByStatus(newval);
    }
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [PullRefresh.name]: PullRefresh,
    [Loading.name]: Loading,
    NavBar,
    SkuGroup,
    Scroll
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.comment-centre {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 41;
  background: $color-background;

  .loading-wrapper {
    display: flex;
    position: absolute;
    top: 46px;
    right: 0;
    bottom: 0;
    left: 0;
    justify-content: center;
    align-items: center;
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