import Vue from 'vue'
import App from './App.vue'
import './common/stylus/index.styl'
import router from './router/router'
import store from './store/store'
import 'amfe-flexible';
import VueLazyload from 'vue-lazyload'
import './common/css/iconfont.css'
import moment from 'moment'


//定义全局 时间格式过滤器
Vue.filter('dateFormat', function (dateStr, pattern = "YYYY-MM-DD HH:mm:ss") {
  return moment(dateStr).format(pattern)
})


Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
