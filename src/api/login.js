import axios from 'axios'
export function getCode(params) {
    const url = '/rongbin/member-api/member/getCode'
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function register(params) {
    const url = '/rongbin/member-api/member/insert'
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function smLogin(params) {
    const url = '/rongbin/member-api/member/smslogin'
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function login(params) {
    const url = '/rongbin/member-api/member/pwdlogin'
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}


