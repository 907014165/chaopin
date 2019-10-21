import axios from 'axios'
import { URL } from './config'
//const baseUrl = 'http://192.168.1.66:21002'
const baseUrl = `${URL}:21002`
export function getCode(params) {
    const url = `${baseUrl}/member-api/member/getCode`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function register(params) {
    const url = `${baseUrl}/member-api/member/insert`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function smLogin(params) {
    const url = `${baseUrl}/member-api/member/smslogin`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function login(params) {
    const url = `${baseUrl}/member-api/member/pwdlogin`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function weChatLogin(params) {
    const url = `${baseUrl}/member-api/member/weChatLogin`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function QQLogin(params) {
    const url = `${baseUrl}/member-api/member/QQLogin`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function updatePwd(params) {
    const url = `${baseUrl}/member-api/member/updatePwd`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

