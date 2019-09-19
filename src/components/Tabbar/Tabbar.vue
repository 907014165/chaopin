<template>
  <div class="tabbar">
    <van-tabbar v-model="active">
      <van-tabbar-item icon="wap-home" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="wap-nav" to="/category">分类</van-tabbar-item>
      <van-tabbar-item icon="cart" to="/shopcart">购物车</van-tabbar-item>
      <van-tabbar-item icon="contact" to="/user">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { Tabbar, TabbarItem } from "vant";
export default {
  data() {
    return {
      active: 0
    };
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
<style lang="stylus" scoped>
.tabbar {
  height: 50px;
}
</style>
