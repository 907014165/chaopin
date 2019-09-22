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
    const url = 'http://192.168.1.101:18052/admin/passport/login'
    let params = {
        password: '123',
        admin: 'xyy'
    }

    return axios.post(url, {
        password: '123',
        admin: 'xyy'
    }).then((res) => {
        return Promise.resolve(res.data)
    })
}