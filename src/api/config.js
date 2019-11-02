import Vue from 'vue'
import axios from 'axios'
import store from '../store/store'
import router from '../router/router'
import { Toast } from 'vant';
Vue.use(Toast)
axios.defaults.timeout = 5000
//axios.defaults.baseURL = 'https://api.github.com'
//axios.defaults.baseURL = 'http://192.168.1.101:18052'
axios.interceptors.request.use(
    config => {
        if (store.state.token) {
            config.headers.Authorization = `Bearer ${store.state.token}`
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error.response) {
            console.log(error)
            switch (error.response.status) {
                case 401:
                    store.dispatch('LOGIN_OUT')
                    Toast('用户身份过期...')
                    router.currentRoute.path !== 'login' &&
                        router.replace({
                            path: '/login',
                            query: { redirect: router.currentRoute.path },
                        }); break;
                case 500:
                    console.log('reefd')
            }

        }
        if (!error.response) {
            if (window.plus && plus.networkinfo.getCurrentType() === plus.networkinfo.CONNECTION_NONE) {
                Toast('网络似乎已断开连接')
                return;
            }
        }
        return Promise.reject(error.response)
    }
)
export default axios
export const URL = 'http://218.193.110.245'
export const ERR_OK = 0
