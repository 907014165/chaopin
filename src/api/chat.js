import axios from 'axios'
const baseUrl = 'http://218.193.110.247:9010'
//const baseUrl = '/chat'
export function fileUpload(params) {
    const url = `${baseUrl}/upload`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    }).catch(err => {
        let errStr = JSON.stringify(err)
        console.log(errStr)
    })
}

//获取聊天记录npm 

export function getChatMsgList(params) {
    let paramsStr = JSON.stringify(params)
    console.log(paramsStr)
    const url = `${baseUrl}/message`
    console.log(url)
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}