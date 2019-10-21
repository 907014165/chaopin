import axios from 'axios'
import { URL } from './config'
//const baseUrl = "http://192.168.1.53:9093"
const baseUrl = `${URL}:9093`
export function getCouponList(params) {
    const url = `${baseUrl}/member/coupon/listByStatus`
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
export function getUsefulCoupon(params) {
    const url = `${baseUrl}/member/coupon/getCoupon`
    return axios({
        url: url,
        method: "post",
        data: params
    }).then(res => {
        return Promise.resolve(res.data);
    });
}