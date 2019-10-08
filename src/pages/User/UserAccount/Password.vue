<template>
  <div class="password-login">
    <!-- <headerNav title="登录"/> -->
    <div class="close-wrapper" @click="close">
      <van-icon name="cross" />
    </div>
    <div class="m-logo">
      <img src="./logo.png" alt />
    </div>
    <div class="content-wrapper">
      <van-cell-group>
        <van-field v-model="username" placeholder="请输入账号" />
        <van-field v-model="password" type="password" placeholder="请输入密码" />
      </van-cell-group>
      <div class="login-btn">
        <van-button size="large" type="primary" :disabled="disabled" @click="_login">登录</van-button>
      </div>
      <div class="other">
        <span @click="register">新用户注册</span>
        <span @click="forgotPwd">忘记密码?</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Field, CellGroup, Button, Icon } from "vant";
import { login } from "api/login.js";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    disabled() {
      if (!this.password || !this.username) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    close() {
      this.$router.back();
    },
    _login() {
      let params = {
        mobile: this.username,
        password: this.password
      };
      console.log(params);
      login(params).then(res => {
        console.log(res);
        let token = res.data.token;
        this.setToken(token);
        let redirect = this.$route.query.redirect || "/home";
        this.$router.push(redirect);
      });
    },
    //忘记密码
    forgotPwd() {
      console.log("忘记密码");
    },
    //注册
    register() {
      console.log("用户注册");
      this.$router.push({
        path: "/login/register"
      });
    },
    ...mapMutations({
      setToken: "SET_TOKEN"
    })
  },
  components: {
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Icon.name]: Icon
  }
};
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl';

.password-login {
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

  .content-wrapper {
    .login-btn {
      margin: 15px 15px 15px;
    }

    .other {
      display: flex;
      justify-content: space-between;
      padding: 0 15px;
      font-size: $font-size-medium;
      color: #999;
    }
  }
}
</style>
