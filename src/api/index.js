import axios from 'axios'
const baseUrl = 'http://192.168.1.53:9090'
export function getSlideImages() {
    //const url = '${baseUrl}/getSlideImages'
    const url = '/jiahao/system/index/carousel'
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
    const url = `${baseUrl}/member/search/page`
    return axios({
        url: url,
        method: 'post',
        data:params
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