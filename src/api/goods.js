import axios from 'axios'
const baseUrl = 'http://192.168.1.53:9090'
export function getSkuById(params) {
    const url = `${baseUrl}/member/search/spec`
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function getGoodsById(params) {
    const url = `${baseUrl}/member/search/detail`
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//切换收藏
export function toggleFavorite(params) {
    const url = `${baseUrl}/member/favorite/add`
    return axios({
        url: url,
        method: 'post',
        data:params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//添加商品到购物车
export function addShopCart(params) {
    const url = `${baseUrl}/member/cart/add`
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

//获取 评论列表
export function getRatings(){
    const url = 'api/getRatings'
    let params = {

    }
    return axios.get(url,{
        params
    }).then(res=>{
        return Promise.resolve(res.data)
    })
}