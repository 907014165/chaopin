<template>
  <transition name="fade">
    <div class="login">
      <div class="close-wrapper" @click="close">
        <van-icon name="cross" />
      </div>
      <div class="m-logo">
        <img src="./logo.png" alt />
      </div>
      <div class="login-type-wrapper">
        <van-button size="large" to="/login/phonelogin">手机号登录</van-button>

        <van-button size="large" to="/login/password">密码登录</van-button>

        <van-button size="large" type="primary" to="/login/register">手机号一键注册</van-button>
      </div>
      <div class="m-thirdpart">
        <!-- <p class="tit">
        <span class="txt">或用以下方式登录</span>
        </p>-->
        <van-divider>其他登录方式</van-divider>
        <div class="lnk">
          <van-icon name="wechat" color="#1AAD16" @click="thirdLogin('weixin')" />
          <van-icon
            class-prefix="iconfont"
            name="icon-qq"
            color="#7dcbeb"
            @click="thirdLogin('qq')"
          />
        </div>
      </div>
      <transition name="van-fade">
        <router-view></router-view>
      </transition>
    </div>
  </transition>
</template>

<script>
import { Button, Icon, Divider } from "vant";
import { mapMutations } from "vuex";
import { weChatLogin, QQLogin } from "api/login";

var loginType = 1,
  auths = {},
  userInfo,
  authResult,
  fromType = null;
// 获取用户信息

function isInstalled(id) {
  if (mui.os.android) {
    var main = plus.android.runtimeMainActivity();
    var packageManager = main.getPackageManager();
    var PackageManager = plus.android.importClass(packageManager);
    var packageName = {
      qq: "com.tencent.mobileqq",
      weixin: "com.tencent.mm",
      sinaweibo: "com.sina.weibo"
    };
    try {
      return packageManager.getPackageInfo(
        packageName[id],
        PackageManager.GET_ACTIVITIES
      );
    } catch (e) {
      // mui.toast(e)
      console.log("未安装");
    }
  } else {
    switch (id) {
      case "qq":
        var TencentOAuth = plus.ios.import("TencentOAuth");
        return TencentOAuth.iphoneQQInstalled();
      case "weixin":
        var WXApi = plus.ios.import("WXApi");
        return WXApi.isWXAppInstalled();
      case "sinaweibo":
        var SinaAPI = plus.ios.import("WeiboSDK");
        return SinaAPI.isWeiboAppInstalled();
      default:
        break;
    }
  }
}
export default {
  name: "login",
  data() {
    return {
      fromType: "",
      auths: {},
      userInfo: null,
      authResult: null,
      fromType: null
    };
  },
  created() {
    //this.loginOpenid();
    // 获取登录认证通道

    plus.oauth.getServices(
      services => {
        for (var i in services) {
          var service = services[i];
          //console.log(service.id+": "+service.authResult+", "+service.userInfo);
          this.auths[service.id] = service;
          /* if (~authBtns.indexOf(service.id)) {
            var isInstalled = isInstalled(service.id);
            //如果微信未安装，则为不启用状态
            btn.setAttribute(
              "class",
              "oauth-btn" +
                (!isInstalled && service.id === "weixin" ? " disabled" : "")
            );
            btn.authId = service.id;
            btn.style.backgroundImage = 'url("images/' + service.id + '.png")';
            oauthArea.appendChild(btn);
          } */
        }
      },
      function(e) {
        console.log("获取登录认证失败：" + e.message);
      }
    );
  },
  methods: {
    close() {
      this.$router.goBack({
        path: "/home"
      });
    },
    //第三方登录
    thirdLogin(type) {
      if (type === "weixin") {
        this.fromType = "weixin";
        this.login("weixin");
      } else {
        this.fromType = "qq";
        this.login("qq");
      }
    },
    isInstalled(id) {
      if (mui.os.android) {
        var main = plus.android.runtimeMainActivity();
        var packageManager = main.getPackageManager();
        var PackageManager = plus.android.importClass(packageManager);
        var packageName = {
          qq: "com.tencent.mobileqq",
          weixin: "com.tencent.mm",
          sinaweibo: "com.sina.weibo"
        };
        try {
          return packageManager.getPackageInfo(
            packageName[id],
            PackageManager.GET_ACTIVITIES
          );
        } catch (e) {
          // mui.toast(e)
          console.log("未安装");
        }
      } else {
        switch (id) {
          case "qq":
            var TencentOAuth = plus.ios.import("TencentOAuth");
            return TencentOAuth.iphoneQQInstalled();
          case "weixin":
            var WXApi = plus.ios.import("WXApi");
            return WXApi.isWXAppInstalled();
          case "sinaweibo":
            var SinaAPI = plus.ios.import("WeiboSDK");
            return SinaAPI.isWeiboAppInstalled();
          default:
            break;
        }
      }
    },
    login(id) {
      console.log("----- 登录认证 -----");
      var auth = this.auths[id];
      console.log(auth);
      let _this = this;
      if (auth) {
        if (plus.os.name == "Android") {
          var w = plus.nativeUI.showWaiting("登录中...");
        }
        if (id === "weixin") {
          auth.login(
            function(e) {
              //登录认证成功获取用户信息
              console.log(JSON.stringify(e));
              _this.getUserInfo(auth, () => {
                w && w.close();
                w = null;
              });
              /* userinfo(auth); */
            },
            function(e) {
              w && w.close();
              w = null;
              plus.nativeUI.alert("登录失败", null, "登录失败");
            }
          );
        } else {
          auth.login(
            function(e) {
              //登录认证成功获取用户信息
              console.log(JSON.stringify(e));
              _this.getUserInfo(auth, () => {
                w && w.close();
                w = null;
              });
              /* userinfo(auth); */
            },
            function(e) {
              w && w.close();
              w = null;
              plus.nativeUI.alert("登录失败", null, "登录失败");
            }
          );
        }
      } else {
        plus.nativeUI.alert("无效的登录认证通道！", null, "登录");
      }
    },
    getUserInfo(auth, successCallBack) {
      let _this = this;
      auth.getUserInfo(
        function(e) {
          //plus.nativeUI.toast("获取用户信息成功");
          //var name = auth.userInfo.nickname || auth.userInfo.name;
          //登录认证数据
          //successCallBack && successCallBack();
          _this.authResult = auth.authResult;
          //登录用户信息
          _this.userInfo = auth.userInfo;
          //设置第三方登录后的信息
          let thirdLoginInfo = {
            fromType: _this.fromType,
            userInfo: auth.userInfo,
            authResult: auth.authResult
          };
          _this.setThirdLoginInfo(thirdLoginInfo);
          _this.loginOpenid(
            auth.userInfo,
            auth.authResult,
            _this.fromType,
            successCallBack
          );
          console.log(JSON.stringify(_this.authResult));
          console.log(JSON.stringify(_this.userInfo));
        },
        function(e) {
          plus.nativeUI.toast("获取用户信息失败：" + e.message);
        }
      );
    },
    loginOpenid(userInfo, authResult, fromType, successCallBack) {
      //发送给 服务器 params
      let params = new FormData();
      params.append("openId", authResult.openid);
      params.append("accessToken", authResult.access_token);
      let str = JSON.stringify(params);
      if (fromType === "weixin") {
        weChatLogin(params).then(res => {
          successCallBack && successCallBack();
          if (res.code === 0) {
            this.setToken(res.data);
            //console.log(this.$route);
            let redirect = this.$route.query.redirect || "/home";
            this.$router.replace({
              path: redirect
            });
          } else {
            console.log("账号绑定引导");
            this.$router.replace({
              path: "/login/relevancy"
            });
          }
        });
      } else {
        QQLogin(params).then(res => {
          successCallBack && successCallBack();
          if (res.code === 0) {
            this.setToken(res.data);
            //console.log(this.$route);
            let redirect = this.$route.query.redirect || "/home";
            this.$router.replace({
              path: redirect
            });
          } else {
            console.log("账号绑定引导");
            this.$router.replace({
              path: "/login/relevancy"
            });
          }
        });
      }

      console.log(str);
    },
    ...mapMutations({
      setThirdLoginInfo: "SET_THIRD_LOGIN_INFO",
      setToken: "SET_TOKEN"
    })
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
