<template>
  <div class="refund-detail">
    <nav-bar :left-text="`退款详情`" @back="back"></nav-bar>
    <template v-if="refundInfo">
      <div class="header van-hairline--bottom">
        <div class="order-info">
          <div class="order-staus">{{ refundState }}</div>
          <div class="order-desc"></div>
        </div>
      </div>
    </template>

    <template v-if="refundInfo&&!refundInfo.isPay">
      <div class="refund-operation">
        <div class="title van-hairline--bottom">{{ refundState1 }}</div>
        <div class="content">
          <div class="content-info"></div>
          <div class="content-express" v-if="refundInfo.refundType==2&&refundInfo.sellerState==2">
            <van-cell-group>
              <van-field
                v-model="expressNo"
                center
                clearable
                label="快递单号"
                placeholder="请填写快递单号"
                v-show="1<=expStep"
              >
                <van-button slot="button" size="small" type="primary" @click="_getExpressCompany">确定</van-button>
              </van-field>
              <van-field
                v-model="expName"
                center
                clearable
                label="快递公司"
                placeholder="请填快递公司"
                v-show="2<=expStep"
              >
                <van-button slot="button" size="small" type="primary" @click="toggleShow">选择快递公司</van-button>
              </van-field>
              <div class="comfirm" v-show="3<=expStep">
                <van-button slot="button" size="small" type="primary" @click="subExp">提交</van-button>
              </div>
            </van-cell-group>
            <van-action-sheet title="选择快递公司" v-model="show" :actions="actions" @select="onSelect" />
          </div>
          <div class="content-footer" v-else>
            <van-button plain hairline type="danger" size="small" @click="updataRefund">修改申请</van-button>
            <van-button plain hairline type="default" size="small" @click="deleteRefund">撤销申请</van-button>
            <van-button plain hairline type="default" size="small">客服介入</van-button>
          </div>
        </div>
      </div>
    </template>

    <template v-if="refundInfo">
      <div class="refund-info">
        <div class="info-title">退款信息</div>
        <div class="info-goods">
          <van-card
            :title="refundInfo.goodsName"
            :desc="``"
            :thumb="refundInfo.full"
            :num="refundInfo.goodsNum"
          />
        </div>

        <div class="info-content">
          <div class="item">
            <span>退款原因:</span>
            <span>{{ refundInfo.reasonInfo }}</span>
          </div>
          <div class="item">
            <span>退款金额:</span>
            <span>{{ refundInfo.refundAmount }}</span>
          </div>
          <div class="item">
            <span>申请时间:</span>
            <span>{{ refundInfo.addTime|formatDate }}</span>
          </div>
          <div class="item">
            <span>退款编号:</span>
            <span>{{ refundInfo.refundSn }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import {
  getRefundDetail,
  delRefund,
  getExpressCompany,
  subRefundExpNo
} from "api/refund.js";
import SkuGoods from "common/js/skuGoods.js";
import moment from "moment";
import { isAndroid_ios } from "common/js/util.js";
import {
  Card,
  Button,
  Dialog,
  Toast,
  CellGroup,
  Field,
  ActionSheet
} from "vant";
import { mapMutations } from "vuex";

//将规格的json字符串转换为自己想要的 字符串
function spec(treeStr) {
  let specStr = "";
  let specObj = JSON.parse(treeStr);
  //console.log(specObj)
  for (let i = 0; i < specObj.length; i++) {
    let tmp = "";
    for (let key in specObj[i]) {
      //console.log(1)
      tmp += specObj[i][key] + ":";
    }
    tmp = tmp.substring(0, tmp.length - 1);
    specStr += tmp + " ";
  }
  console.log(specStr);
  return specStr;
}

export default {
  data() {
    return {
      refundId: this.$route.query.refundId,
      refundInfo: null,
      expressNo: "",
      simpleName: "",
      expName: "",
      refundStateMap: {
        1: "请等待商家处理",
        2: "商家已同意申请",
        3: "退款成功"
      },
      refundStateMap1: {
        1: "您已经成功发起退款申请，请耐心等待商家处理",
        2: "商家已同意退款申请,请填写快递单号"
      },
      actions: [],
      show: false,
      expStep: 1
    };
  },
  computed: {
    refundState() {
      if (this.refundInfo.isPay) {
        return "退款成功";
      } else {
        return this.refundInfo.sellerState === 1
          ? "请等待商家处理"
          : this.refundInfo.sellerState === 2
          ? "商家已同意申请"
          : "商家已拒绝";
      }
    },
    refundState1() {
      if (this.refundInfo.refundType === 1) {
        return this.refundInfo.sellerState === 1
          ? "请等待商家处理"
          : this.refundInfo.sellerState === 2
          ? "商家已同意，请耐心等待"
          : "商家已拒绝";
      } else {
        return this.refundInfo.sellerState === 1
          ? "请等待商家处理"
          : this.refundInfo.sellerState === 2
          ? "商家已同意退款申请,请填写快递单号"
          : "商家已拒绝";
      }
    }
  },
  created() {
    this._getRefundDetail();
  },
  methods: {
    back() {
      this.$router.replace({
        path: "/user/aftersale"
      });
      this.$router.isBack = true;
    },
    toggleShow() {
      this.show = !this.show;
    },
    subExp() {
      let params = {
        reExpressId: this.simpleName,
        reExpressName: this.expName,
        reInvoiceNo: this.expressNo,
        refundId: this.refundInfo.refundId
      };
      this._subRefundExpNo(params, () => {
        Toast({
          type: "success",
          message: "提交成功",
          duration: 800
        });
      });
      console.log(params);
    },
    onSelect(item) {
      console.log(item);
      this.expName = item.name;
      this.simpleName = item.simpleName;
      this.expStep = 3;
      this.toggleShow();
    },
    updataRefund() {
      this.setCurrentRefundGoods({
        orderId: this.refundInfo.orderId,
        goods: new SkuGoods({
          goodsId: this.refundInfo.goodsId,
          orderGoodsId: this.refundInfo.orderGoodsId,
          title: this.refundInfo.goodsName,
          desc: spec(this.refundInfo.spec),
          num: this.refundInfo.goodsNum,
          thumb: this.refundInfo.full
        })
      });
      this.$router.push({
        name: "refund"
      });
    },
    deleteRefund() {
      Dialog.confirm({
        title: "确定,撤销申请?"
      })
        .then(() => {
          let params = {
            refundId: this.refundInfo.refundId
          };
          console.log(params);
          this._delRefund(params, () => {
            this.$router.replace({
              path: "/user/aftersale"
            });
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    _subRefundExpNo(params, successCb) {
      subRefundExpNo(params).then(res => {
        if (res.code === 0) {
          if (res.data) {
            successCb();
          } else {
            Toast({
              type: "fail",
              message: "提交失败",
              duration: 800
            });
          }
        } else {
          Toast({
            type: "fail",
            message: "提交失败",
            duration: 800
          });
        }
      });
    },
    _getRefundDetail() {
      let params = {
        refundId: this.refundId
      };
      getRefundDetail(params).then(res => {
        console.log(res);
        if (res.code === 0) {
          this.refundInfo = res.data;
          this.expressNo = res.data.reInvoiceNo;
        }
      });
    },
    _delRefund(params, successCb) {
      delRefund(params).then(res => {
        if (res.data) {
          Toast.success("撤销成功");
          successCb && successCb();
        } else {
          Toast.fail(res.message);
        }
      });
    },
    _getExpressCompany() {
      let params = {
        expressNo: this.expressNo
      };
      getExpressCompany(params).then(res => {
        console.log(res);
        let express = JSON.parse(res.data);
        console.log(express);
        if (res.code === 0) {
          if (express.showapi_res_body.ret_code === 0) {
            express.showapi_res_body.data.forEach(item => {
              this.actions.push({
                name: item.expName,
                simpleName: item.simpleName
              });
            });
            this.expStep = 2;
          } else {
            Toast.fail({
              message: express.showapi_res_body.msg
            });
          }
        } else {
          Toast.fail({
            message: express.showapi_res_body.msg
          });
        }
      });
    },
    ...mapMutations({
      setCurrentRefundGoods: "SET_CURRENT_REFUND_GOODS"
    })
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      if (isAndroid_ios()) {
        date.setHours(date.getHours() - 8);
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  components: {
    [Card.name]: Card,
    [Button.name]: Button,
    [Dialog.name]: Dialog,
    [Toast.name]: Toast,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [ActionSheet.name]: ActionSheet,
    NavBar
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.refund-detail {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 21;
  background: $color-background;

  .refund-operation {
    padding: 10px;
    padding-bottom: 0;
    background: $color-background-w;

    .title {
      font-size: 14px;
      padding: 10px;
    }

    .content {
      .content-express {
        .comfirm {
          text-align: center;
          padding: 5px;
        }
      }
    }

    .content-footer {
      display: flex;
      flex-direction: row-reverse;
      padding: 10px;

      .van-button {
        margin: 0 10px;
      }
    }
  }

  .header {
    height: 100px;
    display: flex;
    background: linear-gradient(to right, rgb(255, 0, 0), rgb(220, 20, 60)) center center / cover no-repeat;

    .order-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 25px;
      color: $color-text-w;

      .order-staus {
        font-size: $font-size-medium-x;
        margin: 10px 0;
      }

      .order-desc {
        font-size: $font-size-small;
      }
    }
  }

  .refund-info {
    margin: 10px 0;
    padding: 10px;
    background: $color-background-w;

    .info-title {
      padding: 10px 0;
      font-size: 14px;
    }

    .info-content {
      .item {
        padding: 5px;
        font-size: 12px;
      }
    }
  }
}
</style>