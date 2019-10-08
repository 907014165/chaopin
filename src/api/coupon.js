import axios from 'axios'
const baseUrl = "http://192.168.1.53:9093"
export function getCouponList(params) {
    const url = `${baseUrl}/member/coupon/listByStatus`
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}