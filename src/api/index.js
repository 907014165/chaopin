import axios from 'axios'

export function getSlideImages() {
    const url = '/api/getSlideImages'
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
    const url = '/api/getRecommendList'
    let params = {}
    return axios.get(url, {
        params
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}

export function getGoodsList(params) {
    //const url = '/api/member/search/page'
    //let params = {}
    const url = '/api/member/search/page'
    return axios({
        url: url,
        method: 'post',
        data:params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}


export function getClassList() {
    const url = '/api/member/class/list'
    let params = {}
    return axios.get(url, {
        params
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}


export function getTest() {
    const url = '/api/test'
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
    const url = 'api/member/cart/test'
    return axios.get(url, {
        params
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}