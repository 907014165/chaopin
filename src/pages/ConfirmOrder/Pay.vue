<template>
  <transition name="van-slide-right">
    <div class="pay">
      <nav-bar :title="'潮品支付平台'" @back="back"></nav-bar>
      <div class="price">
        <h1 class="price-text">{{ getInPayMent.num }}</h1>
        <span class="time">
          <van-count-down millisecond :time="time" format="HH:mm:ss:SSS" />
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
      <van-button type="danger" size="large" @click="pay">支付</van-button>
    </div>
  </transition>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import { RadioGroup, Radio, Cell, CellGroup, CountDown, Button } from "vant";
import { mapGetters } from "vuex";
import { toPay } from "api/pay.js";
const WEIXIN = "2",
  ALIPAY = "1";
var ALIPAYSERVER =
  "http://demo.dcloud.net.cn/helloh5/payment/alipay.php?total=";
var WXPAYSERVER = "http://192.168.1.101:9092/order/member/pay/wxpay/create";
//支付渠道
var pays = {};
document.addEventListener("plusready", function() {
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

export default {
  data() {
    return {
      time: 30 * 60 * 60 * 1000,
      payType: "1"
    };
  },
  computed: {
    ...mapGetters({
      getInPayMent: "inPayment"
    })
  },
  methods: {
    back() {
      this.$router.back();
    },
    pay() {
      let PAYSERVER = "";
      let channel = pays['wxpay']
      if (this.payType === WEIXIN) {
        PAYSERVER = WXPAYSERVER;
      }
      let params = this.getInPayMent.ordersId;
      console.log(params);
      toPay(PAYSERVER, params).then(res => {
        if (res.code === 0) {
          console.log(res.data);
          let str = JSON.stringify(res.data);
          console.log(str);
          /* let params = new FormData();
          params.append() */
          plus.payment.request(
            channel,
            str,
            function(result) {
              let resultStr = JSON.stringify(result);
              let params = {
                result: resultStr
              };
              
              alert(resultStr);
            },
            function(error) {
              plus.nativeUI.alert("支付失败：" + error.code);
            }
          );
        } else {
          alert("获取订单信息失败");
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
}
</style>