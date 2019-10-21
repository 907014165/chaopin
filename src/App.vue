<template>
  <div id="app">
    <!-- search,chat,searchCategory,refund,pay,login,logisticsDetail,ratings -->
    <keep-alive include="home,shopcart,category,user">
      <router-view></router-view>
    </keep-alive>
    <div class="tabbar-wrapper">
      <tab-bar></tab-bar>
    </div>
  </div>
</template>
<script>
import TabBar from "components/Tabbar/Tabbar";
import { mapGetters, mapActions } from "vuex";
import { listenBack } from "common/js/app.js";
export default {
  data() {
    return {
      connectOnece: true
    };
  },
  created() {
    listenBack();
  },
  components: {
    TabBar
  },
  computed: {
    ...mapGetters({
      getUserInfo: "userInfo"
    })
  },
  methods: {
    ...mapActions({
      connectServer: "CONNECT_SERVER"
    })
  },
  watch: {
    //监听 用户登录让 然后连接客服
    getUserInfo(newval, oldval) {
      if (newval && this.connectOnece) {
        console.log("已经获取 用户信息");
        this.connectServer();
        this.connectOnece = false;
      }
    }
  }
};
</script>
<style>
</style>
