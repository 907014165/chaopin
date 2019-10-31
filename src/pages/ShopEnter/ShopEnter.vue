<template>
  <div class="shop-enter">
    <nav-bar :title="'商家入驻'" @back="back"></nav-bar>
    <van-cell-group title="联系方式">
      <van-field v-model="userName" label="姓名" placeholder="请输入您的姓名" required />
      <van-field v-model="userMobile" label="电话号码" type="tel" placeholder="请输入电话号码" required />
      <van-field v-model="area" label="所在地区" placeholder="填写你所在的地区" required />
    </van-cell-group>
    <van-cell-group title="入驻信息">
      <van-field v-model="shopName" label="店铺名称" placeholder="请输入店铺名称" required />
      <van-field v-model="shopBrand" label="入驻品牌" placeholder="请输入你想入驻的品牌" required />
      <van-field v-model="shopDesc" label="基本描述" placeholder="基本描述信息" required />
    </van-cell-group>
    <van-button
      color="linear-gradient(to right, #FF6347,#FF4500)"
      size="large"
      @click="submitApply"
    >提交申请</van-button>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import { Field, CellGroup, Button, Toast } from "vant";
import { shopEnter } from "api/shopEnter.js";
export default {
  data() {
    return {
      userName: "",
      userMobile: "",
      area: "",
      shopName: "",
      shopBrand: "",
      shopDesc: ""
    };
  },
  methods: {
    back() {
      this.$router.goBack();
    },
    submitApply() {
      let params = {
        area: this.area,
        brand: this.shopBrand,
        description: this.shopDesc,
        phone: this.userMobile,
        storeName: this.shopName,
        userName: this.userName
      };
      console.log(params);
      shopEnter(params).then(res => {
        console.log(res);
        if (res.code === 0 && res.data) {
          Toast({
            type: "success",
            duration: 1200,
            message: "已提交申请,日后平台管理员会与您联系",
            onClose: () => {
              this.$router.replace({
                path: "/user"
              });
            }
          });
        } else {
          Toast({
            type: "success",
            duration: 800,
            message: res.message
          });
        }
      });
    }
  },
  components: {
    [Field.name]: Field,
    [CellGroup.name]: CellGroup,
    [Button.name]: Button,
    [Toast.name]: Toast,
    NavBar
  }
};
</script>
<style lang="stylus">
.shop-enter {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  .van-button.van-button--default.van-button--large {
    position: fixed;
    bottom: 0;
  }
}
</style>