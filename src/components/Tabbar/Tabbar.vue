<template>
  <div class="tabbar">
    <van-tabbar v-model="active" active-color="#f23030">
      <van-tabbar-item icon="wap-home" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/category">分类</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o" to="/shopcart" :info="shopCartListItemNum">购物车</van-tabbar-item>
      <van-tabbar-item icon="manager" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { Tabbar, TabbarItem } from "vant";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      active: 0
    };
  },
  computed: {
    shopCartListItemNum() {
      let num = 0;
      this.getShopCartList.forEach(item => {
        num += item.skuList.length;
      });
      return num;
    },
    ...mapGetters({
      getShopCartList: "shopCartList"
    })
  },
  watch: {
    //监听路由变化 解决tarbar当前高亮bug
    $route(to, from) {
      let path = to.path;
      switch (path) {
        case "/home":
          this.active = 0;
          break;
        case "/category":
          this.active = 1;
          break;
        case "/shopcart":
          this.active = 2;
          break;
        case "/user":
          this.active = 3;
          break;
      }
    }
  },
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  }
};
</script>
<style lang="stylus">
.tabbar {
  height: 50px;

  .van-hairline--top-bottom.van-tabbar.van-tabbar--fixed {
    z-index: -1 !important;
  }
}
</style>
