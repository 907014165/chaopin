<template>
  <div class="goods-item-single" @click="selecItem" @click.stop>
    <div class="goods-photo">
      <img v-lazy="`http://192.168.1.53:9090/${goods.img}`" alt class="photo" />
    </div>
    <div class="goods-info van-hairline--bottom">
      <div class="goods-info-title">{{ goods.desc }}</div>
      <div class="goods-info-content">
        <span class="goods-info-price">￥{{ goods.price }}</span>
        <div class="goods-add-cart" @click.stop="addShopCart">
          <van-icon name="cart-circle-o" />
        </div>
      </div>
      <div class="goods-info-other"></div>
    </div>
  </div>
</template>
<script>
import { Icon } from 'vant'
export default {
  data() {
    return {};
  },
  props: {
    goods: {
      type: Object,
      default() {
        return {
          desc:
            "童装男童夏装套装2019新款中大童男孩夏季儿童洋气运动短袖工装五分裤两件套韩版潮 桔色 160码适合身高145-155CM",
          img:
            "//img12.360buyimg.com/mobilecms/s372x372_jfs/t1/62649/21/382/99774/5ce9607fEe4165306/dbb69a6f5141deb6.jpg!q70.dpg.webp",
          price: 105
        };
      }
    }
  },
  methods: {
    selecItem() {
      this.$emit("select",this.goods.goodsId);
    },
    addShopCart(){
      this.$emit('add-shop-cart')
      //console.log('加入购物车')
    }
  },
  components:{
    [Icon.name]:Icon
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.goods-item-single {
  display: flex;
  margin: 5px 0;

  .goods-photo {
    flex: 0 0 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
    }
  }

  .goods-info {
    flex: 1;
    height: 120px;
    padding-left: 8px;

    .goods-info-title {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 38px;
      word-break: break-all;
      margin-top: 8px;
      color: #333;
      line-height: 1.36;
      font-size: $font-size-medium;
    }

    .goods-info-content {
      margin-top 4px
      height 28px
      display flex
      justify-content space-between
      align-items center
      .goods-info-price {
        margin-right: 2px;
        display: inline-block;
        height: 18px;
        font-weight: 400;
        font-size: 18px;
        color: $color-text-red;
      }
      .goods-add-cart {
        padding-left 6px
        
      }
    }
  }
}
</style>
