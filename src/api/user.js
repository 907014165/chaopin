import axios from 'axios'
import Qs from 'qs'
//获得用户收藏列表
export function getCollectList() {
    const url = '/api/getGoodsListByKeyWords'
    let params = {
    }
    return axios.get(url, {
        params
    }).then(res => {
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