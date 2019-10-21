<template>
  <transition name="van-slide-right">
    <div class="logistics-detail">
      <nav-bar title="物流详情" @back="back"></nav-bar>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="(step,index) in expressData" :key="index">
          <h3>{{ step.context }}</h3>
          <p>{{ step.time }}</p>
        </van-step>
      </van-steps>
    </div>
  </transition>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import { Step, Steps } from "vant";
import { getLogistics } from "api/order.js";
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "logisticsDetail",
  data() {
    return {
      active: 0,
      expressData: []
    };
  },
  created() {
    this._getLogistics();
  },
  mounted() {},
  computed: {
    stepList() {
      return this.transitList.slice(0).reverse();
    },
    ...mapGetters({
      getCurrentOrderDetail: "currentOrderDetail"
    })
  },
  methods: {
    back() {
      this.$router.back();
    },
    formatDate(time) {
      let date = new Date(time);
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    _getLogistics() {
      let params = {
        orderId: this.$route.query.orderId
      };
      getLogistics(params).then(res => {
        console.log(res);
        if (res.code === 0) {
          let express = JSON.parse(res.data);
          console.log(express);
          this.expressData = express.showapi_res_body.data;
          this.expressData.push({
            context: "已发货 待揽收",
            time: this.formatDate(this.getCurrentOrderDetail.sendTime)
          });
        } else {
        }
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
<style lang="stylus">
.logistics-detail {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  overflow-y: scroll;
}
</style>