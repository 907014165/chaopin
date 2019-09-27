import axios from 'axios'

export function getShopCartList(params) {
    const url = "/api/member/cart/list"
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
    const url = "/api/member/cart/delete"
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
    const url = "/api/member/cart/update"
    return axios({
        url: url,
        method: 'post',
        data:params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
