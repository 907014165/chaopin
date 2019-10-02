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
            @change-num="changeNum"
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
import {
  getShopCartList,
  delShopCartList,
  updataShopCartList
} from "api/shopcart.js";
import { getTest1 } from "api/index.js";
import { PullRefresh, NavBar, SubmitBar, Checkbox, Icon, Dialog } from "vant";
import { mapGetters, mapMutations } from "vuex";

let scrolldom = null;
let shopcartdom = null;

let vue_this = null

/* window.onbeforeunload = onbeforeunload_handler;
window.onunload = onunload_handler;
function onbeforeunload_handler() {
  var warning = "确认退出?";
  return warning;
}

function onunload_handler() {
  //alert('jjj')
  console.log('jjj')
  vue_this._updataShopCartList()
} */

export default {
  name:'shopcart',
  data() {
    return {
      showStepper: true,
      isLoading: false, //是否下拉刷新，
      checked: false, //购物栏 全选按钮的 高亮样式
      checkedAll: false,
      scrollDom: null,
      shopCartDom: null,
      shopCartList1: [
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
      ],
      shopCartList: []
    };
  },
  created() {
    console.log("111");
    this._getShopCartList();
  },
  mounted() {
    //this.observeShopCartDOM();
    vue_this = this
  },
  beforeDestroy() {
    getTest1();
    this._updataShopCartList();
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
    selectPrice() {
      let price = 0;
      this.getShopCart.forEach(seller => {
        seller.skuList.forEach(sku => {
          price += sku.price * sku.num;
        });
      });
      return price;
    },
    ...mapGetters({
      getShopCart: "shopCart",
      getIsAddShopCart: "isAddShopCart",
      getVueShopCartList: "shopCartList"
    })
  },
  methods: {
    //下拉刷新执行的回调
    onRefresh() {
      console.log("下拉刷新");
      this._updataShopCartList();
      /* this.shopCartList.splice(0)
      this._getShopCartList() */

      /* setTimeout(() => {
        this.isLoading = false;
      }, 500); */
    },
    changeNum(num) {
      this.setShopCartList(this.shopCartList);
    },
    //提交
    onSubmit() {
      console.log(this)
      console.log(vue_this)
    },
    //切换全选按钮的 转态
    toggleSelect() {
      this.checkedAll = !this.checkedAll;
    },
    //删除购物车的选中商品
    deleteShopCartItem() {
      //删除dom 要监听 它的高度 让shopcartdom 自适应

      let _this = this;
      this.getShopCart.forEach((item, itemIndex) => {
        let isSelectAll = item.isSelectAll;
        let index = this.shopCartList.findIndex(seller => {
          return item.sellerId == seller.sellerId;
        });
        console.log(index);
        if (index >= 0) {
          if (isSelectAll) {
            console.log("true");
            _this.shopCartList.splice(index, 1);
          } else {
            let sku = _this.getShopCart[itemIndex].skuList.slice(0);
            sku.forEach(item => {
              //console.log(item);
              let index1 = _this.shopCartList[index].skuList.findIndex(
                item1 => {
                  return item1.skuId == item.skuId;
                }
              );
              if (index1 >= 0) {
                _this.shopCartList[index].skuList.splice(index1, 1);
              }
            });
          }
        }
      });
    },
    //删除商品
    delSku() {
      let _this = this;
      //提示 删除 弹出框
      let delText =
        this.getShopCart.length == 0 ? "请选择商品" : "确认要删除该商品吗？";
      Dialog.confirm({
        title: delText
        /* message: "" */
      })
        .then(() => {
          // on confirm
          this.deleteShopCartItem();
          this._delShopCartList();
          _this.$nextTick(() => {
            //this.observeShopCartDOM();
            this.delShopCartItem();
            this.setShopCartList(this.shopCartList);
          });
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
        console.log("wo de ma ya");
        shopcartdom.style.height = scrolldomHeight + "px";
      }
      console.log(scrolldomHeight);
      console.log(shopcartdomHeight);
    },
    //获取购物车列表
    _getShopCartList() {
      getShopCartList().then(res => {
        if (res.code === 0) {
          console.log(res);
          res.data.forEach(seller => {
            let obj = {
              sellerId: seller.storeId,
              name: seller.storeName,
              skuList: []
            };
            seller.cartList.forEach(sku => {
              obj.skuList.push({
                skuId: sku.goodsId,
                title: sku.goodsName,
                desc: sku.spec,
                num: sku.buyNum,
                price: sku.price,
                thumb: sku.image,
                storageNum: sku.storageNum,
                cartId: sku.cartId
              });
            });
            this.shopCartList.push(obj);
          });
        } else {
          alert(res.message);
        }
        this.setShopCartList(this.shopCartList);
      });
    },
     //删除购物车列表
    _delShopCartList() {
      let params = [];
      this.getShopCart.forEach(seller => {
        seller.skuList.forEach(sku => {
          params.push(sku.cartId);
        });
      });
      console.log(params);
      delShopCartList(params).then(res => {
        if (res.code === 0) {
          console.log(res);
        }
      });
    },
     //更新购物车
    _updataShopCartList() {
      let params = [];
      //console.log(this.getVueShopCartList)
      this.getVueShopCartList.forEach(seller => {
        console.log(seller);
        seller.skuList.forEach(sku => {
          params.push({
            buyNum: sku.num,
            cartId: sku.cartId
          });
        });
      });
      console.log(params);
      updataShopCartList(params).then(res => {
        if (res.code) {
          if (res.data) {
            console.log("刷新成功");
          } else {
            console.log("刷新失败");
          }
        } else {
        }
        this.isLoading = false;
      });
    },
    ...mapMutations({
      delShopCartItem: "DEL_SLECT_SHOP_CART_ITEM",
      setShopCartList: "SET_SHOP_CART_LIST",
      setIsAddShopCart: "SET_IS_SHOP_CART"
    })
  },
  watch: {
    //监听 checked 转态
    checked(newval) {
      //如果全选样式状态checked 为true 并且 全选状态为false 时
      //触发 toggleSelect 函数
      if (newval && !this.checkedAll) {
        this.toggleSelect();
      } else if (!newval) {
        this.checkedAll = false;
      }
    },
    //监听选择状态的个数
    checkAllNum(newval) {
      //如果 被选择的商家个数等于 this.shopCartList.length长度 此时 为全选状态
      if (newval == this.shopCartList.length && newval != 0) {
        this.checked = true;
      } else {
        //console.log(newval);
        this.checked = false;
      }
    },
    //监听路由 如果路由发生变化 将购物车数据发给后端
    $route(to, from) {
      if (to.path === "/shopcart") {
        console.log("进入购物车");
        //进入购物车时 重新请求购物车数据
        //this._getShopCartList()
        if (this.getIsAddShopCart) {
          this.isSelectAll = false;
          this.checked = false;
          this.delShopCartItem();
          this.shopCartList.splice(0);
          this._getShopCartList();
          this.setIsAddShopCart(false);
        }
      } else {
        console.log("离开购物车");
        //离开购物车时 将购物车数据发给后端数据发给后端
        this._updataShopCartList()
      }
      //console.log("route change");
    },
    shopCartDom() {
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
