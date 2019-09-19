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
    component: () => import('pages/ShopCart/ShopCart.vue')
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
        component: () => import('components/Coupon/Coupon.vue')
      },
      {
        path: 'address',
        component: () => import('pages/User/UserAddress/UserAddressList.vue')
      },
      {
        path: 'addAddress',
        component: () => import('pages/User/UserAddress/UserAddressEdit.vue')
      },
      {
        path: 'aftersale',
        component: () => import('pages/User/UserAfterSale/UserAfterSale.vue')
      },
      {
        path: 'favorite',
        component: () => import('pages/User/UserFavorite/UserFavorite.vue')
      },
      {
        path: 'userinfo',
        component: () => import('pages/User/UserInfo/UserInfo.vue')
      },
      {
        path: 'order/:id',
        component: () => import('pages/User/UserOrder/UserOrder.vue')
      }
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
    component: ()=>import('pages/Chat/Chat.vue')
  },
  {
    path: '/goodsDetail/:id',
    name: 'goodsDetail',
    component: () => import('components/GoodsDetail/GoodsDetail.vue')
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


