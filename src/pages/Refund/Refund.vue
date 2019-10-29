<template>
  <transition name="van-fade">
    <div class="refund">
      <nav-bar :left-text="`${refundTxt}`" @back="back"></nav-bar>
      <template v-if="getcurrentRefundGoods">
        <van-card
          :desc="getcurrentRefundGoods.goods.desc"
          :title="getcurrentRefundGoods.goods.title"
          :thumb="getcurrentRefundGoods.goods.thumb"
        />
      </template>

      <template v-if="!showRefund">
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
      </template>
      <template v-if="showRefund">
        <van-cell-group title=" ">
          <van-cell title="退还数量" :center="true" size="large">
            <van-stepper v-model="value" min="1" :max="getcurrentRefundGoods.goods.num" />
          </van-cell>
          <van-cell
            title="退款原因"
            :value="refundReasonTxt"
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
        <van-button
          class="sub-btn"
          color="linear-gradient(to right, #FF6347,#FF4500)"
          size="large"
          @click="submit"
        >提交</van-button>
      </template>
      <van-action-sheet title="退款原因" v-model="show" :actions="actions" @select="onSelect" />
    </div>
  </transition>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import { getRefundReason, applyRefund } from "api/refund.js";
import { fileUpload } from "api/comment.js";
import { mapGetters } from "vuex";
import {
  Card,
  Cell,
  CellGroup,
  Stepper,
  Uploader,
  Field,
  Button,
  Toast,
  ActionSheet
} from "vant";
export default {
  name: "refund",
  data() {
    return {
      refundTxt: "选择服务类型",
      type: 0,
      value: 1,
      fileList: [],
      message: "",
      show: false,
      showRefund: false,
      reasonId: null,
      actions: [],
      refundReasonTxt: "请选择",
      imgList: []
    };
  },
  created() {
    this._getRefundReason();
  },
  mounted() {
    /* if (!this.getcurrentRefundGoods) {
      console.log("tre");
      this.$router.push({
        path: "/home"
      });
    } */
  },
  computed: {
    ...mapGetters({
      getcurrentRefundGoods: "currentRefundGoods"
    })
  },
  methods: {
    //返回
    back() {
      this.$router.goBack();
    },
    //选择种类2
    selectType1() {
      console.log("111");
      this.refundTxt = "申请退款";
      this.type = 1;
      this.showRefund = true;
    },
    //选择种类1
    selectType2() {
      console.log("222");
      this.refundTxt = "申请退款";
      this.type = 2;
      this.showRefund = true;
    },
    //图片删除
    fileListDelete(file, detail) {
      console.log(file);
      console.log(detail);
      this.imgList.splice(detail.index, 1);
    },
    //选择原因列表
    onSelect(item) {
      console.log(item);
      this.refundReasonTxt = item.name;
      this.reasonId = item.id;
      this.toggleReasonSelect();
    },
    //切换退款原因选择列表
    toggleReasonSelect() {
      this.show = !this.show;
    },
    submit() {
      console.log("提交");
      let params = {
        buyerMessage: this.message,
        goodsNum: this.value,
        orderGoodsId: this.getcurrentRefundGoods.goods.orderGoodsId,
        orderId: this.getcurrentRefundGoods.orderId,
        picInfos: this.imgList,
        reasonId: this.reasonId,
        reasonInfo: this.refundReasonTxt,
        refundType: this.type
      };
      console.log(params);
      this._applyRefund(params);
    },
    //获取退款原因
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
    },
    _fileUpload(file) {
      fileUpload(file).then(res => {
        console.log(res);
        this.imgList.push(res.data.image);
      });
    },
    _applyRefund(params) {
      applyRefund(params).then(res => {
        if (res.code === 0) {
          Toast.success({
            message: "提交申请成功",
            duration: 800,
            onClose: () => {
              this.$router.replace({
                name: "userAfterSale"
              });
            }
          });
        } else {
          Toast.fail({
            message: res.message,
            duration: 800,
            onClose: () => {
              this.$router.back();
            }
          });
        }
      });
    }
  },
  watch: {
    fileList(newval, oldval) {
      if (newval.length > oldval.length) {
        console.log("add");
        let formdata = new FormData();
        formdata.append(
          "img",
          this.fileList[0].file,
          this.fileList[0].file.name
        );
        console.log(formdata.get("img"));
        this._fileUpload(formdata);
      }
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
    [Button.name]: Button,
    [Toast.name]: Toast,
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
  overflow-y: scroll;
  padding-bottom: 50px;
  background: $color-background;

  .van-card {
    background: #fff;
  }

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
    color: #1e1e1e;
  }

  .sub-btn {
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
</style>