import axios from 'axios'
import { URL } from './config'
//const baseUrl = 'http://192.168.1.53:9090'
const baseUrl = `${URL}:9090`
export function getCategoryList(params) {
    const url = `${baseUrl}/member/class/list2`
    return axios.get(url, {
        params
    }).then((res) => {
        //console.log(res)
        return Promise.resolve(res.data)
    })
}

export function getBrands(params) {
    const url = `${baseUrl}/member/brand/listByIds`
    let paramsStr = params.brands.join(',')
    
    console.log(paramsStr)
    return axios({
        method: 'post',
        url: `${baseUrl}/member/brand/listByIds`,
        data: params.brands
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}