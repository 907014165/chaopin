


import axios from 'axios'
import store from '../store/store'
import router from '../router/router'

axios.defaults.timeout = 5000
//axios.defaults.baseURL = 'https://api.github.com'
//axios.defaults.baseURL = 'http://192.168.1.101:18052'
axios.interceptors.request.use(
    config => {
        if (store.state.token) {
            config.headers.Authorization = `token ${store.state.token}`
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
                    store.commit('REMOVE_TOKEN')
                    router.currentRoute.path !== 'login' &&
                        router.replace({
                            path: 'login',
                            query: { redirect: router.currentRoute.path },
                        }); break;
                case 500:
                    console.log('reefd')
            }
        }
        return Promise.reject(error.response.data)
    }
)
export default axios

export const ERR_OK = 0
