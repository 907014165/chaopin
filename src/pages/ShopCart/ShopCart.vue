<template>
  <div class="shop-cart-content">
    <van-nav-bar title="购物车">
      <van-icon
        class-prefix="iconfont"
        name="icon-del"
        color="#1E1E1E"
        slot="right"
        @click="delSku"
      />
    </van-nav-bar>
    <scroll class="shop-cart-scroll" :data="shopCartList" id="scrolldom">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="shop-cart" id="shopcartdom">
          <!-- <no-result desc="暂无商品" size="middle">
          <img src="./cart-no-result.png" alt="">
          </no-result>-->
          <sku-group
            :has-footer="false"
            :seller="seller"
            :sku-list="seller.skuList"
            :is-show-stepper="showStepper"
            :select-all="checkedAll"
            v-for="(seller) in shopCartList"
            :key="seller.sellerId"
          ></sku-group>
          <div class="occupation"></div>
        </div>
      </van-pull-refresh>
    </scroll>

    <van-submit-bar :price="selectPrice*100" button-text="提交订单" @submit="onSubmit">
      <van-checkbox v-model="checked" checked-color="#ee0a24" @click="toggleSelect">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>
<script>
import NoResult from "base/NoResult/NoResult";
import SkuGroup from "components/SkuGroup/SkuGroup";
import SkuItem from "components/SkuItem/SkuItem";
import Scroll from "base/Scroll/Scroll";
import DomSize from "wd-domsize-monitor";
import { PullRefresh, NavBar, SubmitBar, Checkbox, Icon, Dialog } from "vant";
import { mapGetters, mapMutations } from "vuex";

let scrolldom = null;
let shopcartdom = null;

export default {
  data() {
    return {
      showStepper: true,
      isLoading: false, //是否下拉刷新，
      checked: false, //购物栏 全选按钮的 高亮样式
      checkedAll: false,
      scrollDom: null,
      shopCartDom: null,
      shopCartList: [
        {
          sellerId: 1,
          name: "潮品商城",
          skuList: [
            {
              skuId: 1,
              title:
                "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
              desc: "颜色:傻白 尺码:41",
              price: 1.0,
              num: 3,
              thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
            },
            {
              skuId: 2,
              title:
                "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
              desc: "颜色:傻白 尺码:42",
              price: 2.0,
              num: 3,
              thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
            },
            {
              skuId: 3,
              title:
                "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
              desc: "颜色:傻白 尺码:43",
              price: 3.0,
              num: 3,
              thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
            }
          ]
        },
        {
          sellerId: 2,
          name: "卖苹果啦",
          skuList: [
            {
              skuId: 1,
              title:
                "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
              desc: "颜色:傻白 尺码:41",
              price: 1.0,
              num: 3,
              thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
            },
            {
              skuId: 2,
              title:
                "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
              desc: "颜色:傻白 尺码:42",
              price: 2.0,
              num: 3,
              thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
            },
            {
              skuId: 3,
              title:
                "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
              desc: "颜色:傻白 尺码:43",
              price: 3.0,
              num: 3,
              thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
            }
          ]
        },
        {
          sellerId: 3,
          name: "瑶瑶的店铺",
          skuList: [
            {
              skuId: 1,
              title:
                "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
              desc: "颜色:傻白 尺码:41",
              price: 1.0,
              num: 3,
              thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
            },
            {
              skuId: 2,
              title:
                "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
              desc: "颜色:傻白 尺码:42",
              price: 2.0,
              num: 3,
              thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
            },
            {
              skuId: 3,
              title:
                "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
              desc: "颜色:傻白 尺码:43",
              price: 3.0,
              num: 3,
              thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.observeShopCartDOM();
  },
  destroyed() {
    clearInterval(timer);
  },
  computed: {
    //计算 购物车中已经被选的 商品个数（商家的商品）
    checkAllNum() {
      let num = 0;
      this.getShopCart.forEach(item => {
        if (item.isSelectAll) {
          num++;
        }
      });
      return num;
    },
    selectPrice(){
      let price = 0;
      this.getShopCart.forEach((seller)=>{
        seller.skuList.forEach((sku)=>{
          price += sku.price
        })
      })
      return price
    },
    ...mapGetters({
      getShopCart: "shopCart"
    })
  },
  methods: {
    //下拉刷新执行的回调
    onRefresh() {
      console.log("下拉刷新");
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    },
    //提交
    onSubmit() {
      console.log("提交");
    },
    //切换全选按钮的 转态
    toggleSelect() {
      this.checkedAll = !this.checkedAll;
    },
    //删除函数
    deleteShopCartItem() {
      //删除dom 要监听 它的高度 让shopcartdom 自适应
      
      let _this = this;
      this.getShopCart.forEach(item => {
        let isSelectAll = item.isSelectAll;
        let index = this.shopCartList.findIndex(seller => {
          return item.sellerId == seller.sellerId;
        });
        if (index >= 0) {
          if (isSelectAll) {
            _this.shopCartList.splice(index, 1);
          } else {
            let sku = _this.getShopCart[0].skuList.slice(0);
            sku.forEach(item => {
              console.log(item);
              let index1 = _this.shopCartList[index].skuList.findIndex(
                item1 => {
                  return item1.skuId == item.skuId;
                }
              );
              if (index1 >= 0) {
                console.log(index1);
                console.log(
                  _this.shopCartList[index].skuList.splice(index1, 1)
                );
              }
            });
          }
        }
      });
    },
    //删除商品
    delSku() {
      let _this = this
      //提示 删除 弹出框
      Dialog.confirm({
        title: "确认要删除该商品吗？"
        /* message: "" */
      })
        .then(() => {
          // on confirm
          this.deleteShopCartItem();
          this.delShopCartItem();
          _this.$nextTick(()=>{
            this.observeShopCartDOM()
          })
          console.log("确认删除");
        })
        .catch(() => {
          // on cancel
          console.log("取消删除");
        });
    },
    //监听shopcart dom的变化 做高U盾自适应
    observeShopCartDOM() {
      scrolldom = document.getElementById("scrolldom");
      shopcartdom = document.getElementById("shopcartdom");
      let scrolldomHeight = scrolldom.clientHeight;
      let shopcartdomHeight = shopcartdom.clientHeight;
      if (scrolldomHeight > shopcartdomHeight) {
        console.log('wo de ma ya')
        shopcartdom.style.height = scrolldomHeight + 'px';
      }
      console.log(scrolldomHeight);
      console.log(shopcartdomHeight);
    },
    ...mapMutations({
      delShopCartItem: "DEL_SLECT_SHOP_CART_ITEM"
    })
  },
  watch: {
    //监听 checked 转态
    checked(newval) {
      //如果全选样式状态checked 为true 并且 全选状态为false 时
      //触发 toggleSelect 函数
      if (newval && !this.checkedAll) {
        this.toggleSelect();
      }
    },
    //监听选择状态的个数
    checkAllNum(newval) {
      //如果 被选择的商家个数等于 this.shopCartList.length长度 此时 为全选状态
      if (newval == this.shopCartList.length && newval != 0) {
        this.checked = true;
      } else {
        console.log(newval);
        this.checked = false;
      }
    },
    shopCartDom() {
      /* if(this.shopCartDom.clientHeight<this.scrollDom.clientHeight){
        console.log('mei cuo jiu shi ')
      } */
      console.log(this.shopCartDom);
    }
  },
  components: {
    [PullRefresh.name]: PullRefresh,
    [NavBar.name]: NavBar,
    [SubmitBar.name]: SubmitBar,
    [Checkbox.name]: Checkbox,
    [Icon.name]: Icon,
    [Dialog.name]: Dialog,
    NoResult,
    Scroll,
    SkuGroup,
    SkuItem
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.shop-cart-content {
  .shop-cart-scroll {
    position: fixed;
    left: 0;
    right: 0;
    top: 46px;
    bottom: 100px;
    overflow: hidden;

    .van-pull-refresh {
      .van-pull-refresh__track {
        .shop-cart {
          .iconfont-icon-del {
            font-size: $font-size-large;
          }
        }
      }
    }
  }

  .van-submit-bar {
    padding-left: 10px;
    bottom: 50px;
  }
}
</style>
