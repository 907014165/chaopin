<template>
  <div class="phone-login">
    <div class="close-wrapper" @click="close">
      <van-icon name="cross" />
    </div>
    <div class="m-logo">
      <img src="./logo.png" alt />
    </div>
    <div class="phone-login-wrapper">
      <van-cell-group>
        <van-field
          placeholder="请输入手机号"
          :error-message="errorMobile"
          v-model="mobile"
          @blur="checkMobileNumber"
        />
        <van-field v-model="code" center clearable placeholder="请输入短信验证码" :maxlength="6">
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

import { Dialog, Button, CellGroup, Field, Cell, Icon, Toast } from "vant";
import { getCode, register } from "api/login.js";
import { smLogin } from "api/login.js";
import { mapMutations } from 'vuex'

export default {
  data() {
    return {
      mobile: "",
      code: "",
      errorMobile: ""
    };
  },
  computed: {
    disabled() {
      if (!this.code || !this.mobile) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
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
    SendAuthenticode() {
      console.log("发送验证码");
      let params = new FormData();
      params.append("mobile", this.mobile);
      console.log(params.get("mobile"));
      getCode(params).then(res => {
        if (res.code == 0) {
          Toast.success("发送成功");
        }
        console.log(res);
      });
    },
    checkMobileNumber() {
      this.checkPhone(this.mobile);
    },
    checkPhone(phone) {
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        console.log("error");
        this.errorMobile = "手机号格式错误";
        return false;
      } else {
        console.log("success");
        this.errorMobile = "";
        return true;
      }
    },
    close() {
      this.$router.back();
    },
    login() {
      console.log("登录");
      let params = {
        code: this.code,
        mobile: this.mobile
      };
      console.log(params);
      smLogin(params).then(res => {
        if(res.code === 0){
          console.log(res)
          //this.setToken(res.data.token)
        }
      });
    },
    ...mapMutations({
      setToken:'SET_TOKEN'
    })
  },
  components: {
    [Dialog.name]: Dialog,
    [Button.name]: Button,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [Icon.name]: Icon,
    [Toast.name]: Toast
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
