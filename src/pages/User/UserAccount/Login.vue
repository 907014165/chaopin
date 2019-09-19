<template>
  <transition name="fade">
    <div class="login">
      <div class="close-wrapper" @click="close">
        <van-icon name="cross"/>
      </div>
      <div class="m-logo">
        <img src="./logo.png" alt>
      </div>
      <div class="login-type-wrapper">
        <router-link to="/login/phonelogin">
          <van-button size="large">手机号登录</van-button>
        </router-link>
        <router-link to="/login/password">
          <van-button size="large">密码登录</van-button>
        </router-link>
        <router-link to="/login/register">
          <van-button size="large" type="primary">手机号一键注册</van-button>
        </router-link>
      </div>
      <div class="m-thirdpart">
        <!-- <p class="tit">
        <span class="txt">或用以下方式登录</span>
        </p>-->
        <van-divider>其他登录方式</van-divider>
        <div class="lnk">
          <van-icon name="wechat" color="#1AAD16"/>
          <van-icon class-prefix="iconfont" name="icon-qq" color="#7dcbeb"/>
        </div>
      </div>
      <transition name="van-slide-right">
        <router-view></router-view>
      </transition>
    </div>
  </transition>
</template>

<script>
import { Button, Icon, Divider } from "vant";
export default {
  data() {
    return {
      
    };
  },
  methods: {
    close() {
      this.$router.back();
    }
  },
  components: {
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Divider.name]: Divider
  }
};
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl';

.login {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: $color-background;
  z-index: 30;

  .close-wrapper {
    position: absolute;
    left: 15px;
    top: 15px;
  }

  .m-logo {
    text-align: center;
    margin: 60px;

    img {
      height: 90px;
      width: 90px;
    }
  }

  .login-type-wrapper {
    margin: 0 10px;
    font-size: 14px;

    .van-button {
      font-size: 14px;
      height: 42px;
      line-height: 42px;
      margin-bottom: 15px;
    }
  }

  .m-thirdpart {
    padding: 40px 20px 50px;
    font-size: 12px;

    .tit {
      position: relative;
      width: 215px;
      margin: 0 auto;
      border-bottom: 1px solid #eee;
    }

    .txt {
      position: absolute;
      left: 50%;
      top: -12px;
      margin: 0 0 0 -57px;
      width: 114px;
      background: #fff;
      text-align: center;
      color: #999;
      font-size: 12px;
      line-height: 26px;
    }

    .lnk {
      position: relative;
      padding: 27px 0 0;
      width: 280px;
      margin: 0 auto;
      text-align: center;

      .van-icon {
        font-size: 31px;
        margin: 0 29px;
        vertical-align: top;
      }

      .iconfont-icon-qq {
        font-size: 31px;
        margin: 0 29px;
        vertical-align: top;
      }
    }
  }

  &.fade-enter-active, &.fade-leave-active {
    transition: all 0.5s;
  }

  &.fade-enter, &.fade-leave-active {
    opacity: 0;
  }
}
</style>
