<template>
  <div class="refund">
    <nav-bar :left-text="`${refundTxt}`" @back="back"></nav-bar>
    <van-card desc="描述信息" title="商品标题" thumb="https://img.yzcdn.cn/vant/t-thirt.jpg" />
    <van-cell-group title=" ">
      <van-cell
        title="我要退款(无需退货)"
        label="没有收到货,或与卖家协商同意不用退货值退款"
        :center="true"
        size="large"
        @click="selectType1"
        is-link
      />
      <van-cell
        title="我要退货退款"
        label="已收到货,需要退收到货物"
        :center="true"
        size="large"
        @click="selectType2"
        is-link
      />
    </van-cell-group>
    <van-cell-group title=" ">
      <van-cell title="退还数量" :center="true" size="large">
        <van-stepper v-model="value" min="1" max="8" />
      </van-cell>
      <van-cell
        title="退款原因"
        value="请选择"
        :center="true"
        size="large"
        is-link
        @click="toggleReasonSelect"
      ></van-cell>
      <van-field v-model="message" label="退款说明" placeholder="选填" />
    </van-cell-group>
    <div class="file-uploader">
      <h1>上传凭证</h1>
      <van-uploader v-model="fileList" multiple :max-count="5" @delete="fileListDelete" />
    </div>
    <van-action-sheet title="退款原因" v-model="show" :actions="actions" @select="onSelect" />
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import { getRefundReason } from "api/refund.js";
import {
  Card,
  Cell,
  CellGroup,
  Stepper,
  Uploader,
  Field,
  ActionSheet
} from "vant";
export default {
  data() {
    return {
      refundTxt: "选择服务类型",
      type: 0,
      value: 1,
      fileList: [],
      message: "",
      show: false,
      actions: []
    };
  },
  created() {
    this._getRefundReason();
  },
  methods: {
    back() {
      this.$router.back();
    },
    selectType1() {
      console.log("111");
      this.refundTxt = "申请退款";
      this.type = 1;
    },
    selectType2() {
      console.log("222");
      this.refundTxt = "申请退款";
      this.type = 2;
    },
    fileListDelete(file, detail) {
      console.log(file);
      console.log(detail);
    },
    onSelect(item) {
      console.log(item);
      this.toggleReasonSelect();
    },
    toggleReasonSelect() {
      this.show = !this.show;
    },
    _getRefundReason() {
      getRefundReason().then(res => {
        console.log(res);
        res.data.forEach(item => {
          this.actions.push({
            name: item.reasonInfo,
            id: item.reasonId,
            sort: item.sort
          });
        });
      });
    }
  },
  components: {
    [Card.name]: Card,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Stepper.name]: Stepper,
    [Uploader.name]: Uploader,
    [Field.name]: Field,
    [ActionSheet.name]: ActionSheet,
    NavBar
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.refund {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: $color-background;

  .file-uploader {
    margin: 10px 0;
    background: #fff;
    padding: 5px 10px;

    h1 {
      font-size: 16px;
      padding: 10px 0;
    }

    .van-uploader {
      .van-icon.van-icon-delete {
        font-size: 16px;
      }
    }
  }

  .van-nav-bar__text {
    color: #999;
  }
}
</style>