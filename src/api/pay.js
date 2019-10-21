import axios from 'axios'
import { URL } from './config'
const baseUrl = `${URL}:9092`
//const baseUrl = 'http://192.168.1.101:9092'
export function toPayWx(url, params) {
    return axios({
        url: url,
        method: "post",
        data: params
    }).then(res => {
        return Promise.resolve(res.data);
    });
}

export function toPayAliPay(url, params) {
    return axios({
        url: url,
        method: "post",
        data: params
    }).then(res => {
        return Promise.resolve(res.data);
    });
}

export function wxPayCb(params) {
    const url = `${baseUrl}/order/member/pay/wxpay/query`
    return axios({
        url: url,
        method: "post",
        data: params
    }).then(res => {
        return Promise.resolve(res.data);
    });
}

export function aliPayCb(params){
    const url = `${baseUrl}/order/member/pay/alipay/query`
    return axios({
        url: url,
        method: "post",
        data: params
    }).then(res => {
        return Promise.resolve(res.data);
    });
}