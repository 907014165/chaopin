<template>
  <div class="password-login">
    <!-- <headerNav title="登录"/> -->
    <div class="close-wrapper" @click="close">
      <van-icon name="cross" />
    </div>
    <div class="title">{{ title }}</div>
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
import { Field, CellGroup, Button, Icon, Toast } from "vant";
import { login } from "api/login.js";
import { mapMutations, mapGetters } from "vuex";
export default {
  data() {
    return {
      username: "",
      password: "",
      title: this.$route.query.title ? this.$route.query.title : "用户登录"
    };
  },
  computed: {
    disabled() {
      if (!this.password || !this.username) {
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
    _login() {
      //console.log(params);
      Toast.loading({
        mask: true,
        message: "登录中..."
      });
      if (!this.getThirdloginInfo) {
        let params = {
          mobile: this.username,
          password: this.password
        };
        login(params)
          .then(res => {
            console.log(res);
            Toast.clear();
            if (res.code === 0) {
              let token = res.data;
              console.log(token);
              this.setToken(token);
              console.log(this.$route);
              let redirect = this.$route.query.redirect || "/home";
              this.$router.replace({
                path: redirect
              });
            } else {
              Toast({
                message: res.message
              });
            }
          })
          .catch(err => {
            Toast({
              message: "登录超时"
            });
          });
      } else {
        let params = {
          mobile: this.username,
          password: this.password,
          openId: this.getThirdloginInfo.authResult.openid,
          accessToken: this.getThirdloginInfo.authResult.access_token,
          fromType: this.getThirdloginInfo.fromType
        };
        let str = JSON.stringify(params);
        console.log(str);
        login(params).then(res => {
          console.log(res);
          Toast.clear();
          if (res.code === 0) {
            let token = res.data;
            console.log(token);
            this.setToken(token);
            console.log(this.$route);
            let redirect = this.$route.query.redirect || "/home";
            this.$router.replace({
              path: redirect
            });
          } else {
            Toast({
              message: res.message
            });
          }
        });
      }
    },
    //忘记密码
    forgotPwd() {
      console.log("忘记密码");
      this.$router.push({
        path: "/login/register",
        query: {
          forgetPwd: true,
          title: "找回密码"
        }
      });
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
    [Icon.name]: Icon,
    [Toast.name]: Toast
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
