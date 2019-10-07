<template>
  <transition name="van-slide-right">
    <div class="pay">
      <nav-bar :title="'潮品支付平台'" @back="back"></nav-bar>
      <div class="price">
        <h1 class="price-text">188</h1>
        <span class="time">
          <van-count-down millisecond :time="time" format="HH:mm:ss:SSS" />
        </span>
      </div>
      <div class="pay-type">
        <div class="pay-type-text">选择支付方式</div>
        <van-radio-group v-model="radio">
          <van-cell-group>
            <van-cell title="支付宝支付" clickable @click="radio = '1'" icon="alipay">
              <van-radio slot="right-icon" name="1" />
            </van-cell>
            <van-cell title="微信支付" clickable @click="radio = '2'" icon="wechat">
              <van-radio slot="right-icon" name="2" />
            </van-cell>
          </van-cell-group>
        </van-radio-group>
      </div>
    </div>
  </transition>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import { RadioGroup, Radio, Cell, CellGroup, CountDown } from "vant";
export default {
  data() {
    return {
      time: 30 * 60 * 60 * 1000,
      radio: 1
    };
  },
  methods: {
    back() {
      this.$router.back();
    }
  },
  components: {
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [CountDown.name]: CountDown,
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