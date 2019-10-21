import axios from './config'
//获得用户收藏列表
import { URL } from './config'

/* const baseUrl = 'http://192.168.1.53:9090'
const baseUrl1 = 'http://192.168.1.66:21002' */

const baseUrl = `${URL}:9090`
const baseUrl1 = `${URL}:21002`
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

export function getUserInfo(params) {
    const url = `${baseUrl1}/member-api/member/selectMemberlist`
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//更新 用户信息
export function updateUserInfo(params) {
    const url = `${baseUrl1}/member-api/member/updateMember`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

//更新 用户头像

export function updateAvatar(params) {
    const url = `${baseUrl1}/member-api/member/updateAvatar`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}