import axios from 'axios'
const baseUrl = 'http://192.168.1.53:9090'
export function getShopCartList(params) {
    const url = `${baseUrl}/member/cart/list`
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function addShopCartList(params) {
    const url = ""
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function delShopCartList(params) {
    const url = `${baseUrl}/member/cart/delete`
    return axios({
        url: url,
        method: 'post',
        data:params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function updataShopCartList(params){
    console.log(params)
    const url = `${baseUrl}/member/cart/update`
    return axios({
        url: url,
        method: 'post',
        data:params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
