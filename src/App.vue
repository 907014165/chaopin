<template>
  <div id="app">
    <!-- search,chat,searchCategory,refund,pay,login,logisticsDetail,ratings -->
    <keep-alive include="home,shopcart,category,chat,search,searchCategory">
      <router-view></router-view>
    </keep-alive>
    <div class="tabbar-wrapper">
      <tab-bar></tab-bar>
    </div>
  </div>
</template>
<script>
import TabBar from "components/Tabbar/Tabbar";
import { getUserInfo } from "api/user.js";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { listenBack } from "common/js/app.js";
export default {
  data() {
    return {
      connectOnece: true
    };
  },
  created() {
    listenBack();
    this.init();
  },
  components: {
    TabBar
  },
  computed: {
    ...mapGetters({
      getUserInfo: "userInfo",
      getToken: "token"
    })
  },
  methods: {
    //初始化用户信息
    init() {
      if (this.getToken) {
        getUserInfo().then(res => {
          this.setUserInfo(res.data);
        });
      }
    },
    ...mapActions({
      connectServer: "CONNECT_SERVER"
    }),
    ...mapMutations({
      setUserInfo: "SET_USER_INFO"
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
