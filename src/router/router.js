import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/store'

Vue.use(Router)

let routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('pages/Home/Home.vue'),
    children: [
      {
        path: 'goodsDetail/:spuid',
        name: 'HomeGoodsDetail',
        component: () => import('components/GoodsDetail/GoodsDetail.vue'),
        children: [
          {
            path: 'confirmOrder/:skuid',
            component: () => import('pages/ConfirmOrder/ConfirmOrder.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('pages/Category/Category.vue')
  },
  {
    path: '/shopcart',
    name: 'shopcart',
    component: () => import('pages/ShopCart/ShopCart.vue'),
    children: [
      {
        path: 'confirmOder',
        name: 'shopCartComfirmOder',
        component: () => import('pages/ConfirmOrder/ConfirmOrder.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('pages/User/User.vue'), meta: {
      //requireAuth: true,
    },
    children: [
      {
        path: 'coupon',
        name: 'userCoupon',
        component: () => import('components/Coupon/Coupon.vue')
      },
      {
        path: 'address',
        name: 'userAddress',
        component: () => import('pages/User/UserAddress/UserAddressList.vue')
      },
      {
        path: 'addAddress',
        name: 'userAddAddress',
        component: () => import('pages/User/UserAddress/UserAddressEdit.vue')
      },
      {
        path: 'aftersale',
        name: 'userAfterSale',
        component: () => import('pages/User/UserAfterSale/UserAfterSale.vue')
      },
      {
        path: 'myComment',
        name: 'myComment',
        component: () => import('pages/Comment/MyComment.vue')
      },
      {
        path: 'favorite',
        name: 'userFavorite',
        component: () => import('pages/User/UserFavorite/UserFavorite.vue')
      },
      {
        path: 'userinfo',
        name: 'userinfo',
        component: () => import('pages/User/UserInfo/UserInfo.vue'),
        children: [
          {
            path: 'userInfoEdit',
            name: 'userInfoEdit',
            component: () => import('pages/User/UserInfo/UserInfoEdit.vue')
          },
        ]
      },
      /* {
        path: 'userInfoEdit',
        name: 'userInfoEdit',
        component: () => import('pages/User/UserInfo/UserInfoEdit.vue')
      }, */
      {
        path: 'order/:id',
        name: 'userorder',
        component: () => import('pages/User/UserOrder/UserOrder.vue'),
        children: [
          {
            path: 'orderDetail/:orderId',
            name: 'orderDetail',
            component: () => import('pages/User/UserOrder/UserOrderDetail.vue')
          }
        ]
      },

    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('pages/Search/Search.vue'),
    children: [
      {
        path: 'goodsDetail/:spuid',
        name: 'SearchGoodsDetail',
        component: () => import('components/GoodsDetail/GoodsDetail.vue'),
        children: [
          {
            path: 'confirmOrder/:skuid',
            component: () => import('pages/ConfirmOrder/ConfirmOrder.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/User/UserAccount/Login.vue'),
    children: [
      {
        path: 'password',
        name: 'passwordlogin',
        component: () => import('pages/User/UserAccount/Password.vue')
      },
      {
        path: 'phonelogin',
        name: 'phonelogin',
        component: () => import('pages/User/UserAccount/PhoneLogin.vue')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import('pages/User/UserAccount/Register.vue')
      }
    ]
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('pages/Chat/Chat.vue')
  },
  {
    path: '/searchCategory',
    component: () => import('pages/SearchCategory/SearchCategory.vue'),
    children: [
      {
        path: 'goodsDetail/:spuid',
        name: 'searchCategoryGoodsDetail',
        component: () => import('components/GoodsDetail/GoodsDetail.vue'),
        children: [
          {
            path: 'confirmOrder/:skuid',
            component: () => import('pages/ConfirmOrder/ConfirmOrder.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/goodsDetail/:id',
    name: 'goodsDetail',
    component: () => import('components/GoodsDetail/GoodsDetail.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('pages/User/UserOrder/UserOrderDetail.vue')
  },
  {
    path: '/logisticsDetail',
    name: 'logisticsDetail',
    component: () => import('base/Logistics/LogisticsDetail.vue')
  },
  {
    path: '/ratings',
    name: 'ratings',
    component: () => import('base/Ratings/RatingSeller.vue')
  },
  {
    path: '/refund',
    name: 'refund',
    component: () => import('pages/Refund/Refund.vue')
  },
  {
    path: '/testComment',
    name: 'testComment',
    component: () => import('pages/Comment/Comment.vue')
  },
  {
    path: '/commentCentre',
    name: 'commentCentre',
    component: () => import('pages/Comment/CommentCentre.vue')
  },
  {
    path: '/testSkeleton',
    name: 'testSkeleton',
    component: () => import('base/Skeleton/Skeleton.vue')
  }
]


const router = new Router({
  base: process.env.BASE_URL,
  routes
})



router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (store.state.token) {
      next();
    }
    else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  else {
    next();
  }
})

export default router


