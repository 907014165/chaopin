<template>
  <div id="app">
    <keep-alive exclude="search,chat,searchCategory,user">
      <router-view></router-view>
    </keep-alive>
    <div class="tabbar-wrapper">
      <tab-bar></tab-bar>
    </div>
  </div>
</template>
<script>
import TabBar from "components/Tabbar/Tabbar";
export default {
  components: {
    TabBar
  }
};
</script>
<style>
</style>
