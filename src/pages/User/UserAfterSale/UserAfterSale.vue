<template>
  <div class="user-after-sale">
    <nav-bar title="售后服务" @back="back"></nav-bar>
    <scroll
      :data="refundList"
      :has-more="hasMore"
      @load="loadMore"
      :pull-up="true"
      class="user-after-sale-scroll"
    >
      <template>
        <refund-item
          :refund-type="refund.refundType"
          :refund-status="refund.sellerState"
          :is-pay="refund.isPay"
          v-for="(refund,index) in refundList"
          @seeDetail="seeDetail(index)"
          :key="index"
        >
          <van-card
            :title="refund.goodsName"
            :desc="``"
            :thumb="refund.goodsImage"
            :num="refund.goodsNum"
          />
        </refund-item>
      </template>
    </scroll>
    <div class="loading-wrapper" v-show="isLoading">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
    <transition name="van-slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import RefundItem from "pages/Refund/RefundItem";
import Scroll from "base/Scroll/Scroll";
import { getRefundList } from "api/refund.js";
import { Card, Loading } from "vant";
export default {
  data() {
    return {
      refundList: [],
      hasMore: true,
      currentPage: 1,
      isLoading: true
    };
  },
  created() {
    this._getRefundList();
  },
  methods: {
    back() {
      this.$router.replace({
        path: "/user"
      });
    },
    seeDetail(index) {
      console.log(this.refundList[index].refundId);
      this.$router.push({
        name: "aftersaleDetail",
        query: {
          refundId: this.refundList[index].refundId
        }
      });
    },
    loadMore(callback) {
      if (!this.hasMore) {
        return;
      }
      this.currentPage++;
      this._getRefundList(callback);
    },
    _getRefundList(callback) {
      let params = {
        pageNo: this.currentPage
      };
      getRefundList(params).then(res => {
        console.log(res);
        if (res.code === 0) {
          if (res.data.length == 0) {
            this.hasMore = false;
          }
          res.data.forEach(item => {
            this.refundList.push(item);
          });
          this.isLoading = false;
          this.$nextTick(() => {
            if (callback) {
              callback();
            }
          });
          //this.refundList = res.data;
        }
      });
    }
  },
  components: {
    [Card.name]: Card,
    [Loading.name]: Loading,
    NavBar,
    RefundItem,
    Scroll
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.user-after-sale {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  background: $color-background;

  .user-after-sale-scroll {
    position: fixed;
    top: 46px;
    right: 0;
    bottom: 0;
    left: 0;
  }

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
}
</style>
