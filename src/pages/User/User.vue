<template>
  <div class="user">
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="user-profile">
        <div class="background">
          <img src="http://static.iocoder.cn/1553652151601.jpg?imageView2/2/w/308/h/210/interlace/1/q/100" alt="">
        </div>
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
                <van-info :info="11"/>
              </van-icon>
              <div>待付款</div>
            </van-col>
          </router-link>
          <router-link to="/user/order/2">
            <van-col span="6">
              <van-icon name="logistics">
                <van-info :info="11"/>
              </van-icon>
              <div>待发货</div>
            </van-col>
          </router-link>
          <router-link to="/user/order/3">
            <van-col span="6">
              <van-icon name="chat-o" :info="55"></van-icon>
              <div>待评价</div>
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
              <van-icon name="coupon-o"/>
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
              <van-icon name="location-o"/>
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
              <van-icon name="chat-o"/>
              <div>我的评价</div>
            </van-col>
          </router-link>
          <router-link to="/user/favorite">
            <van-col span="6">
              <van-icon class-prefix="iconfont" name="icon-kanjia"/>
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
  name:'user',
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

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.user {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;

  .van-pull-refresh {
    height: 100%;

    .van-pull-refresh__track {
      height: 100% !important;
    }
  }

  .slide-enter-active, .slide-leave-active {
    transition: all 0.3s;
  }

  .slide-enter {
    transform: translate3d(100%, 0, 0);
  }

  .slide-leave-to {
    transform: translate3d(-100%, 0, 0);
  }

  .iconfont-icon-kanjia {
    font-size: 24px;
  }

  &-profile {
    text-align: center;
    display: block;
    width: 100%;
    height: 141px;
    position relative
    background-repeat: no-repeat;
    background-size: 100% 100%;
    overflow hidden

    .background {
      position absolute
      left 0
      right 0
      bottom 0
      top 0
      z-index -1
      filter: blur(20px);
    }

    img {
      width: 100%;
    }

    &-avatar {
      padding-top: 30px;
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