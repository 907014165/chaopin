<template>
  <div class="user-favorite">
    <nav-bar title="我的收藏" :right-text="editText" @back="back" @onClickRight="edit"></nav-bar>
    <scroll class="collect-scroll" :data="collectList">
      <div class="collect-list-wrapper">
        <van-checkbox-group v-model="result">
          <van-checkbox
            v-for="goods in collectList"
            :key="goods.id"
            :name="goods"
            :class="showFooter?'':'hidden'"
            checked-color="#ee0a24"
          >
            <goods-item-single :goods="goods" @select="selectGoods"></goods-item-single>
          </van-checkbox>
        </van-checkbox-group>
      </div>
    </scroll>
    <div class="footer" v-show="showFooter">
      <van-checkbox v-model="checked" @click="toggleSelectAll" checked-color="#ee0a24">全选</van-checkbox>
      <van-button round type="info" size="small" color="#ee0a24" @click="del">删除</van-button>
    </div>
  </div>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import GoodsItemSingle from "base/GoodsItemSingle/GoodsItemSingle";
import GoodsList from "components/GoodsList/GoodsList";
import Scroll from "base/Scroll/Scroll";
import Goods from "common/js/goods.js";
import { ERR_OK } from "api/config";
import { getCollectList,deleteCollectList } from "api/user";
import { Checkbox, CheckboxGroup, Button } from "vant";
import _ from "lodash";
export default {
  data() {
    return {
      collectList: [], //收藏列表
      result: [], //选择列表结果集
      checked: false,
      checkedAll: false,
      showFooter: false,
      memberId: null,
      editText: "管理"
    };
  },
  created() {
    this._getCollectList();
  },
  methods: {
    back() {
      this.$router.back();
    },
    edit() {
      this.editText = this.editText === "完成" ? "管理" : "完成";
      this.showFooter = !this.showFooter;
      if (!this.showFooter) {
        this.init();
      }
      console.log("编辑");
    },
    init() {
      this.checked = false;
      this.checkedAll = false;
      this.result.splice(0);
    },
    toggleSelectAll() {
      this.checkedAll = !this.checkedAll;
    },
    del() {
      console.log("删除商品");
      this.result.forEach(item => {
        let index = _.findIndex(this.collectList, item);
        this.collectList.splice(index, 1);
      });
      this._deleteCollectList();
    },
    selectGoods(goodsId){
      console.log(goodsId)
    },
    //选择商品
    selectGoods(goodsId) {
      this.$router.push({
        path: `/search/goodsDetail/${goodsId}`,
        query: {
          ParentPath: "search"
        }
      });
    },
    _getCollectList() {
      getCollectList().then(res => {
        if (res.code === ERR_OK) {
          //this.memberId = res.data.list[0].memberId;
          console.log(res)
          res.data.list.forEach(goods => {
            this.collectList.push(
              new Goods({
                goodsId: goods.goodsCommonId,
                favoriteGoodsId:goods.favoriteGoodsId,
                desc: goods.goodsName,
                imgUrl: goods.image,
                price: goods.sellPrice,
                oldPrice: "",
                discount: goods.discount
              })
            );
          });
        }
      });
    },
    _deleteCollectList(){
      let params = []
      this.result.forEach(item=>{
        params.push(item.favoriteGoodsId)
      })
      console.log(params)
      deleteCollectList(params).then(res=>{
        console.log(res)
        if(res.data){
          this.result.splice(0);
        }
      })
    }
  },
  watch: {
    checkedAll(newval, oldval) {
      console.log("全选");
      if (newval) {
        console.log("全选");
        this.result.splice(0);
        this.checked = true;
        this.collectList.forEach((item, index) => {
          console.log(item);
          this.result.push(item);
        });
      } else {
        console.log("取消全选");
        this.result.splice(0);
        this.checked = false;
      }
    },
    checked(newval, oldval) {
      //console.log('fff')
      //如果全选高亮 并且此时 全选状态为false
      if (newval && !this.checkedAll) {
        this.toggleSelectAll();
      } else {
      }
    },
    //如果列表全选 让全选按钮高亮
    result() {
      console.log(this.result);
      if (this.result.length === this.collectList.length&&this.result.length!==0) {
        /* //满足条件让全选置为true
        this.isSelectAll = true; */
        //并且高亮为true
        this.checked = true;
      } else {
        //否则高亮为false
        this.checked = false;
      }
    }
  },
  components: {
    [CheckboxGroup.name]: CheckboxGroup,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button,
    NavBar,
    GoodsItemSingle,
    GoodsList,
    Scroll
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.user-favorite {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  background: $color-background-w;

  .nav-bar {
    .van-nav-bar__text {
      color: $color-text;
    }
  }

  .collect-scroll {
    position: fixed;
    top: 46px;
    right: 0;
    bottom: 0;
    left: 0;

    .collect-list-wrapper {
      padding: 5px 10px;

      .van-checkbox-group {
        .van-checkbox {
          &.hidden {
            .van-checkbox__icon.van-checkbox__icon--round {
              display: none;
            }
          }

          .van-checkbox__label {
            width: 100%;
          }
        }
      }
    }
  }

  .footer {
    height: 40px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 10px;
    z-index: 10;
    background: $color-background;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .van-checkbox__label {
      font-size: 14px;
    }
  }
}
</style>
