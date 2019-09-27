<template>
  <div class="goods-item" @click="selecItem">
    <div class="photo">
      <img v-lazy="`http://192.168.1.53:9090/${goods.img}`" alt width="100%">
    </div>
    <div class="text">{{ goods.desc }}</div>
    <div class="info">
      <div class="price">
        <span class="new_price">￥{{ goods.price }}</span>
        <span class="old_price"></span>
      </div>
      <div class="discount">
        4.6折
      </div>
    </div>
  </div>
</template>
<script>
import { Tag } from "vant";
export default {
  props: {
    goods: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  methods: {
    selecItem() {
      this.$emit("select", this.goods.goodsId);
    }
  },
  components: {
    [Tag.name]: Tag
  }
};
</script>
<style lang="stylus" scoped>
.goods-item {
  background: rgb(255, 255, 255);
  border-radius: 12px;

  .photo {
    position: relative;
    width: 100%;
    padding-top: 100%;

    img {
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 12px 12px 0 0;
    }
  }

  .text {
    box-sizing: border-box;
    height: 31px;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-word;
    color: #232326;
    margin-top: 5px;
    line-height: 16px;
    margin-bottom: 3px;
    padding: 0 10px;
  }

  .info {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    height: 26px;
    padding: 0 10px;

    .price {
      .new_price {
        color: #f23030;
        font-weight: bold;
        line-height: 26px;
      }

      .old_price {
        color: rgb(248, 248, 248);
        text-decoration: line-through;
      }
    }

    .discount {
      line-height 26px
      font-size 13px
    }
  }
}
</style>
