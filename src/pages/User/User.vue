<template>
  <div class="user">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="user-profile">
        <div class="user-profile-avatar">
          <router-link to="/user/userinfo">
            <img
              :src="user && user.avatar ? user.avatar : 'http://static.iocoder.cn/1553652151601.jpg?imageView2/2/w/308/h/210/interlace/1/q/100'"
            >
          </router-link>
        </div>
        <div class="user-profile-username">
          <a href="/#/user/info">
            <span class="m-nick">{{user ? user.nickname : '未登陆'}}</span>
          </a>
        </div>
      </div>

      <van-cell-group class="user-group">
        <van-cell title="我的订单" value="查看全部订单" is-link to="/user/order/0"/>
        <van-row class="user-links">
          <router-link to="/user/order/1">
            <van-col span="6">
              <van-icon name="pending-payment">
                <van-info :info="data.UnPayTotal"/>
              </van-icon>
              <div>待付款</div>
            </van-col>
          </router-link>
          <router-link to="/user/order/2">
            <van-col span="6">
              <van-icon name="logistics">
                <van-info :info="data.UnRecieveTotal"/>
              </van-icon>
              <div>待发货</div>
            </van-col>
          </router-link>
          <router-link to="/user/order/3">
            <van-col span="6">
              <van-icon name="point-gift"></van-icon>
              <div>已完成</div>
            </van-col>
          </router-link>
          <router-link to="/user/aftersale">
            <van-col span="6">
              <van-icon name="after-sale">
                <van-info :info="data.AfterSaleTotal"/>
              </van-icon>
              <div>售后</div>
            </van-col>
          </router-link>
        </van-row>
      </van-cell-group>

      <van-cell-group class="user-group">
        <van-cell title="我的服务"/>
        <van-row class="user-links">
          <router-link to="/user/coupon" @click="showList=true">
            <van-col span="6">
              <van-icon name="coupon"/>
              <div>我的优惠券</div>
            </van-col>
          </router-link>
          <router-link to="/user/favorite">
            <van-col span="6">
              <van-icon name="like-o"/>
              <div>我的收藏</div>
            </van-col>
          </router-link>
          <router-link to="/user/address">
            <van-col span="6">
              <van-icon name="location"/>
              <div>收货地址</div>
            </van-col>
          </router-link>
          <router-link to="/chat">
            <van-col span="6">
              <van-icon name="service-o"/>
              <div>客服</div>
            </van-col>
          </router-link>
        </van-row>
        <van-row class="user-links">
          <router-link to="/user/coupon" @click="showList=true">
            <van-col span="6">
              <van-icon name="coupon"/>
              <div>我的评价</div>
            </van-col>
          </router-link>
          <router-link to="/user/favorite">
            <van-col span="6">
              <van-icon name="like-o"/>
              <div>我的砍价</div>
            </van-col>
          </router-link>
        </van-row>
      </van-cell-group>
    </van-pull-refresh>

    <transition name="van-slide-right">
      <router-view :show-list="showList"></router-view>
    </transition>
  </div>
</template>

<script>
import { Cell, CellGroup, Icon, Row, Col, Info, PullRefresh } from "vant";

export default {
  data() {
    return {
      data: {},
      user: undefined,
      showList: true,
      isLoading: false
    };
  },
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Icon.name]: Icon,
    [Row.name]: Row,
    [Col.name]: Col,
    [Info.name]: Info,
    [PullRefresh.name]: PullRefresh
  },
  methods: {
    logout: function() {
      // 清空本地 token
      clearLoginToken();
      // TODO 芋艿，后面最好处理下 token
      // 跳转到登陆
      this.$router.push("/login");
    },
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    }
  },
  created: function() {
    // GetUserIndex().then(response=>{
    //     this.data=response;
    // });
  },
  mounted() {
    /* if (getAccessToken()) { // 存在
      let response = getUserInfo();
      response.then(data => {
        this.user = data;
      });
    } */
  }
};
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl';

.user {
  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter {
    transform: translate3d(100%, 0, 0);
  }

  .slide-leave-to {
    transform: translate3d(-100%, 0, 0);
  }

  &-profile {
    text-align: center;
    display: block;
    width: 100%;
    height: 141px;
    background-color: #f1f5fa;
    background-repeat: no-repeat;
    background-size: 100% 100%;

    img {
      width: 100%;
    }

    &-avatar {
      padding-top: 23px;
      padding-bottom: 5px;

      img {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        overflow: hidden;
      }
    }

    &-username {
      font-size: 20px;
    }
  }

  &-group {
    margin-bottom: 0.3rem;

    .van-cell__value {
      color: #999;
      font-size: 12px;
    }
  }

  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;

    .van-icon {
      position: relative;
      width: 24px;
      font-size: 24px;
    }
  }

  .van-icon {
    color: $color-text;
  }
}
</style>