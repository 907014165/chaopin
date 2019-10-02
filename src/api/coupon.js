import axios from 'axios'

export function getCouponList(params) {
    const url = '/coupon/member/coupon/listByStatus'
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}