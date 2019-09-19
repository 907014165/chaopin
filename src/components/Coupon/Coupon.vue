<template>
  <div class="coupon">
    <nav-bar title="优惠卷" @back="back"></nav-bar>

    <van-tabs v-model="active">
      <van-tab title="未使用">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">内容一</van-list>
        </van-pull-refresh>
      </van-tab>
      <van-tab title="已使用">内容 2</van-tab>
      <van-tab title="已过期">内容 3</van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { Tab, Tabs, PullRefresh, List, Toast } from "vant";
import NavBar from "base/NavBar/NavBar";
export default {
  data() {
    return {
      active: 0,
      loading: false,
      finished: false,
      isLoading: false
    };
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    NavBar,
    [PullRefresh.name]: PullRefresh,
    [List.name]: List,
    [Toast.name]: Toast
  },
  methods: {
    back() {
      this.$router.back();
    },
    onLoad() {
      setTimeout(() => {
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        this.finished = true;
      }, 500);
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
      }, 500);
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.coupon {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 10;
  background: $color-background-d;
}
</style>
