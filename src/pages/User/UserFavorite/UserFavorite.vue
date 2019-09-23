<template>
  <div class="user-favorite">
    <nav-bar title="我的收藏" @back="back"></nav-bar>
    <scroll class="collect-scroll" :data="collectList">
      <goodsList :goods-list="collectList" :shape-type="false" @selected="selectGoods"></goodsList>
    </scroll>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import GoodsItemSingle from "base/GoodsItemSingle/GoodsItemSingle";
import GoodsList from "components/GoodsList/GoodsList";
import Scroll from "base/Scroll/Scroll";
import { ERR_OK } from "api/config";
import { getCollectList } from "api/user";
export default {
  data() {
    return {
      collectList: []
    };
  },
  created() {
    this._getCollectList();
  },
  methods: {
    back() {
      this.$router.back();
    },
    //选择商品 
    selectGoods(goodsId){
      this.$router.push({
        path: `/search/goodsDetail/${goodsId}`,
        query:{
          ParentPath:'search'
        }
      })
    },
    _getCollectList() {
      getCollectList().then(res => {
        if (res.code === ERR_OK) {
          this.collectList = res.data;
        }
      });
    }
  },
  components: {
    NavBar,
    GoodsItemSingle,
    GoodsList,
    Scroll
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.user-favorite {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  background: $color-background-w;

  .collect-scroll {
    position fixed
    top 46px
    right 0
    bottom 0
    left  0
  }
}
</style>
