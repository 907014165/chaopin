<template>
  <div class="goods-list" :class="shapeType?'apps':''">
    <template v-if="shapeType">
      <goods-item
        v-for="(goods,index) in goodsList"
        :goods="goods"
        :key="index"
        @select="selectGoods"
      ></goods-item>
    </template>
    <template v-else>
      <goods-item-single
        v-for="(goods,index) in goodsList"
        :goods="goods"
        :key="index"
        @select="selectGoods"
        @add-shop-cart="addShopCart"
      ></goods-item-single>
    </template>
  </div>
</template>
<script>
import GoodsItem from "base/GoodsItem/GoodsItem";
import GoodsItemSingle from "base/GoodsItemSingle/GoodsItemSingle";
import { addShopCartList } from 'api/shopcart.js'
export default {
  name: "goodslist",
  data() {
    return {};
  },
  props: {
    goodsList: {
      type: Array,
      default() {
        return [];
      }
    },
    //shapeType为true时 两列布局 否则一列布局
    shapeType: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    selectGoods(goodsId) {
      console.log(goodsId);
      this.$emit('selected',goodsId)
    },
    addShopCart(){
      console.log('加入购物车')
    },
    _addShopCartList(goodsId){
      let params = {
        goodsId
      }
      addShopCartList().then(res=>{
        console.log(res)
      })
    }
  },

  components: {
    GoodsItem,
    GoodsItemSingle
  }
};
</script>
<style lang="stylus">
.goods-list {
  &.apps {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: 5px;
    grid-column-gap: 5px;
  }

  padding: 3px 10px;
}
</style>
