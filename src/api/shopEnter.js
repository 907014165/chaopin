import axios from 'axios'
//import { baseUrl } from './config'
const baseUrl = 'http://192.168.1.53:9094'
export function shopEnter(params) {
    const url = `${baseUrl}/member/entry/add`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}