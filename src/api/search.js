import axios from 'axios'
/* const baseUrl = 'http://192.168.1.53:9097'
const baseUrlTwo = 'http://192.168.1.101:18051' */
import { URL } from './config'
const baseUrl = `${URL}:9097`
const baseUrlTwo = `${URL}:18051`
export function getHotKey() {
    const url = `${baseUrlTwo}/system/public/keywords`
    const params = {

    }
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function getGoodsListByKeyWords(params) {
    const url = `${baseUrl}/member/search/page`

    console.log(params)
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
export function getSearchGoodsList(params) {
    console.log(params)
    const url = `${baseUrl}/member/search/page`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}