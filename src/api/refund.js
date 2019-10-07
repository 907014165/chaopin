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

//申请退款
export function applyRefund(params) {
    console.log(params)
    const url = 'http://192.168.1.101:9092/order/member/refund/add'
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//获取用户售后列表
export function getRefundList(params) {
    console.log(params)
    const url = 'http://192.168.1.101:9092/order/member/refund/list'
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//获取退货订单详情
export function getRefundDetail(params) {
    console.log(params)
    const url = 'http://192.168.1.101:9092/order/member/refund/get'
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//撤销申请

export function delRefund(params) {
    const url = 'http://192.168.1.101:9092/order/member/refund/delete'
    return axios.delete(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

//获取快递公司
export function getExpressCompany(params) {
    console.log(params)
    const url = 'http://192.168.1.101:9092/order/member/refund/express/company'
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
//用户退单提交物流快递单号

export function subRefundExpNo(params) {
    const url = 'http://192.168.1.101:9092/order/member/refund/express'
    console.log(params)
    return axios({
        url: url,
        method: 'put',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}