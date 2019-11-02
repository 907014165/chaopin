<template>
  <div class="user-info">
    <nav-bar title="账户设置" @back="back"></nav-bar>
    <van-cell value is-link :center="true" to="/user/userinfo/userInfoEdit">
      <!-- 使用 title 插槽来自定义标题 -->
      <template slot="title">
        <div class="user">
          <img
            :src="getUserInfo.fullAvatar?getUserInfo.fullAvatar:`http://static.iocoder.cn/1553652151601.jpg?imageView2/2/w/308/h/210/interlace/1/q/100`"
            class="user-avatar"
          />
          <span class="username">{{ getUserInfo.memberName }}</span>
        </div>
      </template>
    </van-cell>
    <van-cell-group title=" " :center="true">
      <van-cell title="关于我们" is-link />
      <van-cell title="投诉建议" is-link />
    </van-cell-group>
    <!-- <van-button color="linear-gradient(to right, #FF6347,#FF4500)" @click="toLogin">去登录</van-button> -->
    <van-button
      color="linear-gradient(to right, #FF6347,#FF4500)"
      size="large"
      @click="loginOut"
    >退出登录</van-button>
    <transition name="van-slide-right">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import { Cell, CellGroup, Button } from "vant";
import { mapMutations, mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      getUserInfo: "userInfo"
    })
  },
  methods: {
    back() {
      this.$router.goBack();
      this.$router.isBack = true;
    },
    //退出登录
    loginOut() {
      /* this.removeToken();
      this.removeSocket();
      this.removeThirdLoginInfo(); */

      this.userLoginOut();
      this.$router.replace({
        path: "/home"
      });
    },
    toLogin() {
      this.$router.replace({
        path: "/login"
      });
    },
    ...mapMutations({
      removeToken: "REMOVE_TOKEN",
      removeSocket: "REMOVE_SOCKET",
      removeThirdLoginInfo: "REMOVE_THIRD_LOGIN_INFO"
    }),
    ...mapActions({
      userLoginOut: "LOGIN_OUT"
    })
  },
  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    NavBar
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.user-info {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: $color-background;

  .user {
    display: flex;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .username {
      display: inline-block;
      margin-left: 15px;
      font-size: $font-size-medium-x;
      font-weight: 500;
    }
  }

  .van-button.van-button--default.van-button--large {
    position: fixed;
    left: 0;
    bottom: 0;
  }
}
</style>
