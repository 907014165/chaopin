import axios from 'axios'
export function getHotKey() {
    const url = '/api/getHotKey'
    const params = {

    }
    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function getGoodsListByKeyWords(keyWords) {
    const url = '/api/getGoodsListByKeyWords'

    let params = {
        keyWords
    }

    return axios.get(url, {
        params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}