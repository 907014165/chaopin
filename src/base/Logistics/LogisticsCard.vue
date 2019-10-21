<template>
  <div class="logistics-card van-hairline--bottom" @click.stop="selectLogistic">
    <van-icon name="logistics" color="#298EFF" />
    <div class="content" v-if="expressData.length">
      <h1 class="info">{{ expressData[0].context }}</h1>
      <div class="time">{{ expressData[0].time }}</div>
    </div>
    <div class="content" v-if="!expressData.length">
      <h1 class="info">暂无物流信息</h1>
      <div class="time"></div>
    </div>
    <van-icon name="arrow" />
  </div>
</template>
<script>
import { Icon } from "vant";
import { getLogistics } from "api/order.js";
import { mapGetters } from "vuex";
import moment from 'moment'
export default {
  data() {
    return {
      expressData: []
    };
  },
  props: {
    orderId: {
      type: Number,
      default: 0
    }
  },
  created() {
    this._getLogistics();
  },
  computed: {
    ...mapGetters({
      getCurrentOrderDetail: "currentOrderDetail"
    })
  },
  methods: {
    selectLogistic() {
      this.$emit("selectLogistics");
    },
    formatDate(time) {
      let date = new Date(time);
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    _getLogistics() {
      let params = {
        orderId: this.orderId
      };
      getLogistics(params).then(res => {
        console.log(res);
        if (res.code === 0) {
          let express = JSON.parse(res.data);
          if (express.showapi_res_code !== -1) {
            console.log(express);
            this.expressData = express.showapi_res_body.data;
          }
        }
        this.expressData.push({
          context: "已发货 待揽收",
          time: this.formatDate(this.getCurrentOrderDetail.sendTime)
        });
      });
    }
  },
  components: {
    [Icon.name]: Icon
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.logistics-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
  padding-left: 30px;
  background: $color-background-w;

  .content {
    padding: 0 10px;
    flex: 1;

    .info {
      box-sizing: border-box;
      max-height: 31px;
      font-size: 13px;
      color: #298EFF;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-word;
      margin-top: 5px;
      line-height: 16px;
      margin-bottom: 6px;
    }

    .time {
      font-size: 13px;
    }
  }

  .van-icon {
    font-size: 24px;

    &.van-icon-arrow {
      font-size: 18px;
    }
  }
}
</style>