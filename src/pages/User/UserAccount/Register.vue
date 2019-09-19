<template>
  <div class="register">
    <div class="close-wrapper" @click="close">
      <van-icon name="cross"/>
    </div>
    <div class="m-logo">
      <img src="./logo.png" alt>
    </div>
    <div class="register-wrapper">
      <van-cell-group>
        <van-field placeholder="请输入手机号"/>
        <van-field center clearable placeholder="请输入短信验证码" :maxlength="6">
          <van-button slot="button" size="small" type="primary">发送验证码</van-button>
        </van-field>
        <van-field type="password" placeholder="请输入密码"/>
      </van-cell-group>
      <div class="register-btn">
        <van-button size="large" type="primary">注册</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Field, CellGroup, Button, Icon } from "vant";
export default {
  data() {
    return {};
  },
  methods: {
    close(){
      this.$router.back()
    }
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

