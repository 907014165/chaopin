import axios from 'axios'
import { URL } from './config'
const baseUrl = `${URL}:9094`
export function shopEnter(params) {
    const url = `${baseUrl}/member/entry/add`
    console.log(url)
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}