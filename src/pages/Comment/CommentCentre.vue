<template>
  <div class="comment-centre">
    <nav-bar :title="'评价中心'" @back="back"></nav-bar>
    <van-tabs v-model="active">
      <van-tab title="待评论">
        <sku-group
          :seller="seller"
          v-for="(seller,index) in orderList"
          :key="index"
          :is-shop-cart="true"
          @comment="comment(index)"
        ></sku-group>
      </van-tab>
      <van-tab title="已评论">已评论商品</van-tab>
    </van-tabs>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import SkuGroup from "components/SkuGroup/SkuGroup";
import { getUserOrder } from "api/user.js";
import { Tab, Tabs } from "vant";
export default {
  data() {
    return {
      active: 0, //显示当前是属于那种状态
      orderList: []
    };
  },
  created() {
    this._getUserOrder();
  },
  methods: {
    back(){
      this.$router.back()
    },
    comment(index) {
      console.log("点击了评论按钮" + index);
      console.log(this.orderList[index])
      this.$router.push({
        path: "/testComment",
        query: {
          seller: this.orderList[index]
        }
      });
    },
    _getUserOrder() {
      let params = {
        status: 40
      };
      getUserOrder(params).then(res => {
        if (res.code === 0) {
          res.data.forEach(seller => {
            let obj = {
              sellerId: seller.sellerId,
              name: seller.name,
              status: seller.status,
              skuList: []
            };
            seller.orderList.forEach(sku => {
              obj.skuList.push({
                goodsId:sku.goodsId,
                skuId: sku.skuId,
                title: sku.title,
                desc: sku.desc,
                num: sku.num,
                price: sku.price,
                thumb: sku.thumb
              });
            });
            this.orderList.push(obj);
          });
        }
      });
    }
  },
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    NavBar,
    SkuGroup
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.comment-centre {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}
</style>