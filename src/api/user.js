import axios from './config'
//获得用户收藏列表
const baseUrl = 'http://192.168.1.53:9090'
const baseUrl1 = '/rongbin'
//用户收藏列表
export function getCollectList() {
    const url = `${baseUrl}/member/favorite/list`
    let params = {
    }
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

//取消用户收藏列表
export function deleteCollectList(params) {
    const url = `${baseUrl}/member/favorite/delete`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//获取用户收货地址
export function getUserAddressList(params) {
    const url = `${baseUrl1}/member-api/memberAddress/selectAddresslist`
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//用户默认收货地址
export function getDefaultAddr(params) {
    const url = `${baseUrl1}/member-api/memberAddress/selectDefault`
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//添加收货地址
export function addUserAddressList(params) {
    //console.log(params)
    const url = `${baseUrl1}/member-api/memberAddress/insertAddress`
    return axios({
        url: url,
        method: 'post',
        /* transformRequest: [function (params) {
            // 对 data 进行任意转换处理
            return Qs.stringify(params)
        }],
        headers: {
            'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        }, */
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

/* export function addUserAddressList(params){
    const url = '/rongbin/member-api/memberAddress/insertAddress'
    return axios({
        url: url,
        method: 'post',
        data:params
    }).then(res => {
        return Promise.resolve(res.data)
    })
} */
//更新收货地址
export function updataUserAddressList(params) {
    console.log(params)
    const url = `${baseUrl1}/member-api/memberAddress/updateAddress`
    return axios({
        url: url,
        method: 'post',
        /* headers: {
            'deviceCode': 'A95ZEF1-47B5-AC90BF3'
        }, */
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//删除用户收货地址
export function deleteUserAddressList(params) {
    console.log(params)
    const url = `${baseUrl1}/member-api/memberAddress/deleteAddress`
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

//用户信息

export function getUserInfo(params){
    const url = `${baseUrl1}/member-api/member/selectMemberlist`
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
/* //获取用户订单列表
export function getUserOrder(params) {
    //0:已取消 1:全部 10:未付款 20:已收货 30:已发货 40:已完成 50:已评价
    let urlMap = {
        0: '/api/getOderCancel',
        1: '/api/getOderAll',
        10: '/api/getOderPendingPay',
        20: '/api/getUserOder',
        30: '/api/getOderLogistics',
        40: '/api/getOderComplete'
    }
    const url = urlMap[params.status]
    return axios({
        url: url,
        method: 'get',
        params: params
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
//删除用户订单
export function deleteOrder(params) {
    const url = 'http://192.168.1.101:9092/order/member/purchase/delete'
    return axios.delete(url, {
        params
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
} */