import axios from 'axios'
//获得用户收藏列表
export function getCollectList() {
    const url = '/api/member/favorite/list'
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
    const url = '/api/member/favorite/delete'
    return axios({
        url:url,
        method:'post',
        data:params
    }).then(res=>{
        return Promise.resolve(res.data)
    })
}
//获取用户收货地址
export function getUserAddressList(params) {
    const url = '/rongbin/member-api/memberAddress/selectAddresslist'
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//添加收货地址
export function addUserAddressList(params) {
    //console.log(params)
    const url = '/rongbin/member-api/memberAddress/insertAddress'
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
    const url = '/rongbin/member-api/memberAddress/updateAddress'
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
export function deleteUserAddressList(params) {
    console.log(params)
    const url = '/rongbin/member-api/memberAddress/deleteAddress'
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//获取用户订单列表
export function getUserOrder(params){
    //0:已取消 1:全部 10:未付款 20:已收货 30:已发货 40:已完成
    let urlMap = {
        0:'/api/getOderCancel',
        1:'/api/getOderAll',
        10:'/api/getOderPendingPay',
        20:'/api/getUserOder',
        30:'/api/getOderLogistics',
        40:'/api/getOderComplete'
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