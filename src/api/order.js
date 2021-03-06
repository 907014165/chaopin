import axios from 'axios'
import { URL } from './config'
//用户通过购物车下单 
//const baseUrl = 'http://192.168.1.101:9092'
const baseUrl = `${URL}:9092`
export function createOrderByShopCart(params) {
    const url = `${baseUrl}/order/member/purchase/add`
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
    const url = `${baseUrl}/order/member/purchase/immediately`
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
    const url = `${baseUrl}/order/member/purchase/delete`
    return axios.delete(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//用户确认收货
export function signOrder(params) {
    const url = `${baseUrl}/order/member/purchase/sign`
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
    const url = `${baseUrl}/order/member/purchase/list`
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
    const url = `${baseUrl}/order/member/purchase/list`
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
    const url = `${baseUrl}/order/member/purchase/list/status`
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
    const url = `${baseUrl}/order/member/purchase/cancel`
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
    const url = `${baseUrl}/order/member/purchase/express`
    console.log(params)
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

//获取用户订单统计

export function getOrderCount() {
    const url = `${baseUrl}/order/member/purchase/count`
    return axios({
        url: url,
        method: 'get'
    }).then(res => {
        return Promise.resolve(res.data)
    })
}


export function getOrderPrice(params) {
    const url = `${baseUrl}/order/member/purchase/calculate`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function getRefundStatus(params) {
    const url = `${baseUrl}/order/member/refund/order`
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}




