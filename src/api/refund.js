import axios from 'axios'
export function getRefundReason() {
    const url = 'http://192.168.1.53:9092/order/member/refund/reason'
    return axios({
        url: url,
        method: 'get'
    }).then(res => {
        return Promise.resolve(res.data)
    })
}