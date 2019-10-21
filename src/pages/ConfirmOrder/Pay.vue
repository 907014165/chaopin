<template>
  <transition name="van-slide-right">
    <div class="pay">
      <nav-bar :title="'潮品支付平台'" @back="back"></nav-bar>
      <div class="price">
        <h1 class="price-text">
          {{ getInPayMent.sum }}
          <span>元</span>
        </h1>
        <span class="time">
          剩余支付时间:
          <van-count-down millisecond :time="time" format="HH:mm:ss" />
        </span>
      </div>
      <div class="pay-type">
        <div class="pay-type-text">选择支付方式</div>
        <van-radio-group v-model="payType">
          <van-cell-group>
            <van-cell title="支付宝支付" clickable @click="payType = '1'" icon="alipay">
              <van-radio slot="right-icon" name="1" />
            </van-cell>
            <van-cell title="微信支付" clickable @click="payType = '2'" icon="wechat">
              <van-radio slot="right-icon" name="2" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
      <van-button type="danger" size="large" @click="zhifu">支付</van-button>
    </div>
  </transition>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import {
  RadioGroup,
  Radio,
  Cell,
  CellGroup,
  CountDown,
  Button,
  Dialog
} from "vant";
import { mapGetters } from "vuex";
import { toPayWx, wxPayCb, toPayAliPay, aliPayCb } from "api/pay.js";
import axios from "axios";
var pays = {
  name: "rsh"
};
document.addEventListener("plusready", function() {
  // 获取登录认证通道
  plus.oauth.getServices(
    function(services) {
      for (var i in services) {
        var service = services[i];
        //console.log(service.id+": "+service.authResult+", "+service.userInfo);
        auths[service.id] = service;
      }
    },
    function(e) {
      console.log("获取登录认证失败：" + e.message);
    }
  );
  //获取支付渠道
  plus.payment.getChannels(
    function(channels) {
      let channel = null;
      for (let i in channels) {
        channel = channels[i];
        if (channel.id == "qhpay" || channel.id == "qihoo") {
          // 过滤掉不支持的支付通道
          continue;
        }
        pays[channel.id] = channel;
        //ORANGE.pay.checkServices(channel, id, orderid, order_type);
      }
    },
    function(e) {
      alert("获取支付通道失败：" + e.message);
    }
  );
});
import { URL } from "api/config";
var ALIPAYSERVER = `${URL}:9092/order/member/pay/alipay/create`;
var WXPAYSERVER = `${URL}:9092/order/member/pay/wxpay/create`;
/* var ALIPAYSERVER = `http://192.168.1.101:9092/order/member/pay/alipay/create`;
var WXPAYSERVER = `http://192.168.1.101:9092/order/member/pay/wxpay/create`; */
const alipay = "1";
const wxpay = "2";

var loginType = 1,
  auths = {},
  userInfo,
  authResult,
  fromType = null;
//判断本地是否有相关的支付服务
let isInstalled = function(id) {
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
};
//请求支付
function pay(id, params, finishCb) {
  // 从服务器请求支付订单
  let channel = pays[id];
  var PAYSERVER = "";
  if (id == "alipay") {
    PAYSERVER = ALIPAYSERVER;
    toPayAliPay(PAYSERVER, params).then(res => {
      console.log(res);
      console.log(PAYSERVER);
      let testStr = JSON.stringify(pays);
      let response = res.data;
      let sign = response.api;
      console.log(response);
      console.log(sign);
      if (res.code === 0) {
        plus.payment.request(
          channel,
          sign,
          function(result) {
            let params1 = new FormData();
            params1.append("outTradeNo", response.outTradeNo);
            aliPayCb(params1).then(res => {
              console.log(res);
            });
            finishCb();
          },
          function(error) {
            plus.nativeUI.alert("支付失败：" + error.code);
          }
        );
      } else {
        alert("获取订单信息失败");
      }
    });
  } else if (id == "wxpay") {
    PAYSERVER = WXPAYSERVER;
    toPayWx(PAYSERVER, params).then(res => {
      console.log(PAYSERVER);
      let ceshi = JSON.stringify(res);
      console.log(ceshi);
      let testStr = JSON.stringify(pays);
      console.log(res);
      console.log(testStr);
      if (res.code === 0) {
        console.log(res.data);
        let response = res.data;
        let api = JSON.stringify(response.api);
        console.log(api);
        plus.payment.request(
          channel,
          api,
          function(result) {
            let params1 = new FormData();
            params1.append("outTradeNo", response.outTradeNo);
            wxPayCb(params1).then(res => {
              console.log(res);
            });
            finishCb();
          },
          function(error) {
            plus.nativeUI.alert("支付失败：" + error.code);
          }
        );
      } else {
        alert("获取订单信息失败");
      }
    });
  } else {
    plus.nativeUI.alert("不支持此支付通道！", null, "捐赠");
    return;
  }
  console.log("test");
}
export default {
  name: "pay",
  data() {
    return {
      time: 30 * 60 * 1000,
      payType: "1"
    };
  },
  created() {
    plus.payment.getChannels(
      function(channels) {
        let channel = null;
        for (let i in channels) {
          channel = channels[i];
          if (channel.id == "qhpay" || channel.id == "qihoo") {
            // 过滤掉不支持的支付通道
            continue;
          }
          pays[channel.id] = channel;
          //ORANGE.pay.checkServices(channel, id, orderid, order_type);
        }
      },
      function(e) {
        alert("获取支付通道失败：" + e.message);
      }
    );
  },
  computed: {
    ...mapGetters({
      getInPayMent: "inPayment"
    })
  },
  methods: {
    back() {
      this.$router.replace({
        path: `/user/order/${0}`
      });
    },
    zhifu() {
      let params = this.getInPayMent.orderIds;
      console.log(params);
      if (this.payType === alipay) {
        pay("alipay", params, () => {
          this.finishCb();
        });
      }
      if (this.payType === wxpay) {
        console.log(params);
        pay("wxpay", params, () => {
          this.finishCb();
        });
      }
    },
    finishCb() {
      Dialog({
        message: "支付成功",
        beforeClose: (action, done) => {
          this.$router.replace({
            path: `/user/order/${0}`
          });
          done();
        }
      });
    }
  },
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [CountDown.name]: CountDown,
    [Button.name]: Button,
    NavBar
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.pay {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: $color-background-w;

  .price {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 50px;

    .price-text {
      color: $color-text-red;

      span {
        font-size: 12px;
      }
    }

    .time {
      margin: 10px;
      display: flex;
      align-items: center;
      font-size: 14px;
    }
  }

  .pay-type {
    .pay-type-text {
      padding: 10px;
      font-size: $font-size-medium-x;
    }
  }

  .van-radio-group {
    .van-cell-group {
      .van-icon-alipay {
        font-size: 24px;
        color: #02A9F0;
      }

      .van-icon-wechat {
        font-size: 24px;
        color: #52BD33;
      }
    }
  }

  .van-button.van-button--danger.van-button--large {
    margin: 30px 0;
  }
}
</style>