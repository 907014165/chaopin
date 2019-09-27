import axios from 'axios'
export function getSkuById(params) {
    const url = "/api/member/search/spec"
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function getGoodsById(params) {
    const url = "/api/member/search/detail"
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//切换收藏
export function toggleFavorite(params) {
    const url = "/api/member/favorite/add"
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//添加商品到购物车
export function addShopCart(params) {
    const url = "/api/member/cart/add"
    return axios({
        url: url,
        method: 'get',
        params:params
    }).then(res => {
        return Promise.resolve(res.data)
    })
    /* return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    }) */
}