<template>
  <div class="phone-login">
    <div class="close-wrapper" @click="close">
      <van-icon name="cross"/>
    </div>
    <div class="m-logo">
      <img src="./logo.png" alt>
    </div>
    <div class="phone-login-wrapper">
      <van-cell-group>
        <van-field placeholder="请输入手机号" @input="inputMobile"/>
        <van-field center clearable placeholder="请输入短信验证码" :maxlength="6" @input="inputCode">
          <van-button slot="button" size="small" type="primary" @click="SendAuthenticode">发送验证码</van-button>
        </van-field>
      </van-cell-group>
      <div class="login-btn">
        <van-button size="large" type="primary" :disabled="disabled" @click="login">登录</van-button>
      </div>
    </div>
  </div>
</template>

<script>
/* import { doPassportMobileSendRegisterCode, doPassportMobileRegister } from '../../api/user';
import { Dialog } from 'vant';
import { setLoginToken } from '../../utils/cache'; */

import { Dialog, Button, CellGroup, Field, Cell, Icon } from "vant";

export default {
  data() {
    return {
      mobile: "",
      code: "",
      disabled: true
    };
  },

  methods: {
    inputMobile: function(value) {
      this.mobile = value;
    },
    inputCode: function(value) {
      this.code = value;
      this.disabled = this.mobile.length === 6 ? false : true;
    },
    sendCode: function() {
      if (!this.mobile || this.mobile.length !== 11) {
        Dialog.alert({
          title: "系统提示",
          message: "手机号码不正确"
        });
        return;
      }
      let response = doPassportMobileSendRegisterCode(this.mobile);
      response.then(data => {
        Dialog.alert({
          title: "系统提示",
          message: "发送验证码成功"
        });
      });
    },
    submit: function() {
      let that = this;
      let response = doPassportMobileRegister(this.mobile, this.code);
      response.then(data => {
        setLoginToken(data.token.accessToken, data.token.refreshToken);
        Dialog.alert({
          title: "系统提示",
          message: "登陆成功",
          beforeClose: function(action, done) {
            done();
            // TODO 芋艿，简单的 callback 后续完善
            let redirect = that.$route.query.redirect || "/user/index";
            that.$router.push(redirect);
          }
        });
      });
    },
    SendAuthenticode() {
      console.log("发送验证码");
    },
    close() {
      this.$router.back();
    },
    login() {
      console.log("登录");
    }
  },
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [Icon.name]: Icon
  }
};
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl';

.phone-login {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 40;
  background: $color-background;

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

  .phone-login-wrapper {
    .login-btn {
      margin: 30px 15px;
    }
  }
}
</style>
