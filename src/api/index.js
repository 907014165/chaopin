import axios from 'axios'
import { URL } from './config'
/* const baseUrl = 'http://192.168.1.53:9090'
const baseUrlTwo = 'http://192.168.1.53:9097'
const baseUrlThree = 'http://192.168.1.101:18051' */


const baseUrl = `${URL}:9090`
const baseUrlTwo = `${URL}:9097`
const baseUrlThree = `${URL}:18051`
export function getSlideImages() {
    //const url = '${baseUrl}/getSlideImages'
    const url = `${baseUrlThree}/system/public/banner`
    //const url = 'api/getImg'
    //const url = 'api/admins/getDo/getImg'
    let params = {}
    return axios.get(url, {
        params
    }).then((res) => {
        //console.log(res)
        return Promise.resolve(res.data)
    })
}

export function getRecommendList() {
    const url = `${baseUrl}/getRecommendList`
    let params = {}
    return axios.get(url, {
        params
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getGoodsList(params) {
    //const url = '${baseUrl}/member/search/page'
    //let params = {}
    const url = `${baseUrlTwo}/member/search/page`
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}


export function getClassList() {
    const url = `${baseUrl}/member/class/list`
    let params = {}
    return axios.get(url, {
        params
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}


export function getTest() {
    const url = `${baseUrl}/test`
    let params = {
        name: 'rsh'
    }
    return axios.get(url, {
        params
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getTest1() {
    const url = `api/member/cart/test`
    return axios.get(url, {
        params
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}