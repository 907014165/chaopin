import axios from 'axios'
//用户通过购物车下单 
export function createOrderByShopCart(params) {
    const url = 'http://192.168.1.101:9092/order/member/purchase/add'
    console.log(params)
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//用户立即下单
export function createOrderImmediately(params) {
    const url = 'http://192.168.1.101:9092/order/member/purchase/immediately'
    console.log(params)
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//用户删除订单
export function deleteOrder(params) {
    const url = 'http://192.168.1.101:9092/order/member/purchase/delete'
    return axios.delete(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//用户确认收货
export function signOrder(params) {
    const url = 'http://192.168.1.101:9092/order/member/purchase/sign'
    console.log(params)
    return axios({
        url: url,
        method: 'put',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//获取用户单个订单的详情
export function getUserOrderDetail(params) {
    console.log(params)
    const url = 'http://192.168.1.101:9092/order/member/purchase/list'
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//获取用户所有订单
export function getUserAllOrder(params) {
    console.log(params)
    const url = 'http://192.168.1.101:9092/order/member/purchase/list'
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//根据状态获取用户订单
export function getUserOrderByStatus(params) {
    console.log(params)
    const url = 'http://192.168.1.101:9092/order/member/purchase/list/status'
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

//取消用户订单
export function cancelOrder(params) {
    const url = 'http://192.168.1.101:9092/order/member/purchase/cancel'
    console.log(params)
    return axios({
        url: url,
        method: 'put',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function getLogistics(params) {
    const url = 'http://192.168.1.101:9092/order/member/purchase/express'
    console.log(params)
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}




