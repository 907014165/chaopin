<template>
  <div class="logistics-detail">
    <nav-bar title="物流详情" @back="back"></nav-bar>
    <van-steps direction="vertical" :active="0">
      <van-step v-for="(step,index) in expressData" :key="index">
        <h3>{{ step.context }}</h3>
        <p>{{ step.time }}</p>
      </van-step>
    </van-steps>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import { Step, Steps } from "vant";
import { getLogistics } from "api/order.js";
export default {
  data() {
    return {
      active: 0,
      expressData: []
    };
  },
  created() {
    this._getLogistics();
  },
  computed: {
    stepList() {
      return this.transitList.slice(0).reverse();
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    _getLogistics() {
      getLogistics().then(res => {
        let express = JSON.parse(res.data);
        console.log(express);
        this.expressData = express.showapi_res_body.data;
      });
    }
  },
  components: {
    [Step.name]: Step,
    [Steps.name]: Steps,
    NavBar
  }
};
</script>
<style lang="stylus"></style>