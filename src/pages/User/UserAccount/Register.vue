<template>
  <div class="register">
    <div class="close-wrapper" @click="close">
      <van-icon name="cross" />
    </div>
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
          <van-button slot="button" size="small" type="primary" @click="getIdentiCode">发送验证码</van-button>
        </van-field>
        <van-field v-model="password" type="password" placeholder="请输入密码" />
      </van-cell-group>
      <div class="register-btn">
        <van-button size="large" type="primary" @click="register">注册</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Field, CellGroup, Button, Icon, Toast } from "vant";
import { getCode, register } from "api/login.js";

export default {
  data() {
    return {
      mobileNumber: "",
      errorMobile: "",
      code: "",
      password: ""
    };
  },
  methods: {
    close() {
      this.$router.back();
    },
    register() {
      this._register();
    },
    getIdentiCode() {
      /* let params = {
        mobile: this.mobileNumber
      };
      console.log(params); */
      let params = new FormData();
      params.append("mobile", this.mobileNumber);
      console.log(params.get("mobile"));
      getCode(params).then(res => {
        if (res.code == 0) {
          Toast.success("发送成功");
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
      let params = {
        code: this.code,
        mobile: this.mobileNumber,
        password: this.password
      };
      console.log(params);
      register(params).then(res => {
        console.log(res);
      });
    }
  },
  components: {
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Icon.name]: Icon,
    [Toast.name]: Toast
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
  }
}
</style>

