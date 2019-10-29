<template>
  <div class="register">
    <div class="close-wrapper" @click="close">
      <van-icon name="cross" />
    </div>
    <div class="title">{{ title }}</div>
    <div class="m-logo">
      <img src="./logo.png" alt />
    </div>
    <div class="register-wrapper">
      <van-cell-group>
        <van-field
          v-model="mobileNumber"
          placeholder="请输入手机号"
          :error-message="errorMobile"
          @blur="checkMobileNumber"
        />
        <van-field v-model="code" center clearable placeholder="请输入短信验证码" :maxlength="6">
          <van-button
            slot="button"
            size="small"
            type="primary"
            @click="getIdentiCode"
            :disabled="codeDisabled"
            v-if="!forgetPwd"
          >
            <span v-if="!codeDisabled">发送验证码</span>
            <van-count-down :time="time" format="ss 秒" v-if="codeDisabled" @finish="finish" />
          </van-button>
          <van-button
            slot="button"
            size="small"
            type="primary"
            @click="getUpdatePwdCode"
            :disabled="codeDisabled"
            v-if="forgetPwd"
          >
            <span v-if="!codeDisabled">发送验证码</span>
            <van-count-down :time="time" format="ss 秒" v-if="codeDisabled" @finish="finish" />
          </van-button>
        </van-field>
        <van-field v-model="password" type="password" placeholder="请输入密码" />
        <van-field
          v-model="confirmPassword"
          type="password"
          placeholder="请重新输入密码"
          v-if="forgetPwd"
          :error-message="errorPwd"
          @blur="checkPwd"
        />
      </van-cell-group>
      <div class="register-btn" v-if="!forgetPwd">
        <van-button size="large" type="primary" @click="register" :disabled="disabled">注册</van-button>
      </div>
      <div class="forget-pwd-btn" v-if="forgetPwd">
        <van-button size="large" type="primary" @click="updatePwd" :disabled="disabledPwd">完成</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Field, CellGroup, Button, Icon, Toast, CountDown } from "vant";
import { getCode, getPwdCode, register, updatePwd } from "api/login.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      mobileNumber: "",
      errorMobile: "",
      code: "",
      password: "",
      confirmPassword: "",
      errorPwd: "",
      title: this.$route.query.title ? this.$route.query.title : "用户注册",
      time: 60 * 1000,
      codeDisabled: false,
      forgetPwd: this.$route.query.forgetPwd
        ? this.$route.query.forgetPwd
        : false
    };
  },
  computed: {
    disabled() {
      if (
        !this.password ||
        !this.mobileNumber ||
        !this.code ||
        this.errorMobile
      ) {
        return true;
      } else {
        return false;
      }
    },
    disabledPwd() {
      if (
        !this.password ||
        !this.mobileNumber ||
        !this.code ||
        this.errorMobile ||
        this.errorPwd ||
        !this.confirmPassword
      ) {
        return true;
      } else {
        return false;
      }
    },
    ...mapGetters({
      getThirdloginInfo: "ThirdloginInfo"
    })
  },
  methods: {
    close() {
      this.$router.back();
    },
    updatePwd() {
      let params = {
        code: this.code,
        newPassword: this.confirmPassword
      };
      updatePwd(params).then(res => {
        if (res.code === 0) {
          this.$router.replace({
            name: "passwordlogin"
          });
        } else {
          Toast(res.message);
        }
      });
    },
    finish() {
      this.codeDisabled = false;
    },
    register() {
      this._register();
    },
    checkPwd() {
      if (!this.password && !this.confirmPassword) {
        return;
      }
      if (this.password != this.confirmPassword) {
        this.errorPwd = "两次密码不一致";
      } else {
        this.errorPwd = "";
      }
    },
    getIdentiCode() {
      /* let params = {
        mobile: this.mobileNumber
      };
      console.log(params); */
      if (this.errorMobile) {
        Toast({
          message: "请检查手机号码是否填写正确",
          duration: 800,
          type: "fail"
        });
        return;
      }
      Toast({
        type: "loading",
        mask: true,
        message: "发送中"
      });
      let params = new FormData();
      params.append("mobile", this.mobileNumber);
      //console.log(params.get("mobile"));
      getCode(params).then(res => {
        if (res.code == 0) {
          Toast.success("发送成功");
          this.codeDisabled = true;
        } else {
          Toast.success(res.msg);
        }
        console.log(res);
      });
    },
    getUpdatePwdCode() {
      /* let params = {
        mobile: this.mobileNumber
      };
      console.log(params); */
      if (this.errorMobile) {
        Toast({
          message: "请检查手机号码是否填写正确",
          duration: 800,
          type: "fail"
        });
        return;
      }
      Toast({
        type: "loading",
        mask: true,
        message: "发送中"
      });
      let params = new FormData();
      params.append("mobile", this.mobileNumber);
      //console.log(params.get("mobile"));
      getPwdCode(params).then(res => {
        if (res.code == 0) {
          Toast.success("发送成功");
          this.codeDisabled = true;
        } else {
          Toast.success(res.msg);
        }
        console.log(res);
      });
    },
    checkMobileNumber() {
      this.checkPhone(this.mobileNumber);
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
    _register() {
      //console.log(params);
      let _this = this;
      if (!this.getThirdloginInfo) {
        let params = {
          code: this.code,
          mobile: this.mobileNumber,
          password: this.password
        };
        register(params).then(res => {
          if (res.code === 0) {
            Toast({
              type: "success",
              duration: 800,
              message: "注册成功",
              onClose() {
                _this.$router.replace({
                  name: "passwordlogin"
                });
              }
            });
          } else {
            Toast(res.message);
          }
        });
      } else {
        let params = {
          code: this.code,
          mobile: this.mobileNumber,
          password: this.password,
          openId: this.getThirdloginInfo.authResult.openid,
          accessToken: this.getThirdloginInfo.authResult.access_token
        };
        register(params).then(res => {
          if (res.code === 0) {
            Toast({
              type: "success",
              duration: 800,
              message: "注册成功",
              onClose() {
                _this.$router.replace({
                  name: "passwordlogin"
                });
              }
            });
          } else {
            Toast(res.message);
          }
        });
      }
    }
  },
  watch: {},
  components: {
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Toast.name]: Toast,
    [CountDown.name]: CountDown
  }
};
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl';

.register {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 40;
  background: $color-background;

  .close-wrapper {
    position: absolute;
    left: 15px;
    top: 15px;
  }

  .title {
    position: absolute;
    top: 15px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 20px;
  }

  .m-logo {
    text-align: center;
    margin: 60px;

    img {
      height: 90px;
      width: 90px;
    }
  }

  .register-wrapper {
    .register-btn {
      margin: 30px 15px;
    }

    .forget-pwd-btn {
      margin: 30px 15px;
    }
  }
}
</style>

