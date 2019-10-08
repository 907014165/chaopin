import axios from 'axios'
const baseUrl = 'http://192.168.1.53:9097'
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

export function getGoodsListByKeyWords(params) {
    const url = `${baseUrl}/member/search/page`
    
    console.log(params)
    return axios({
        url: url,
        method: 'post',
        data:params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}
export function getSearchGoodsList(params){
    console.log(params)
    const url = `${baseUrl}/member/search/page`
    return axios({
        url: url,
        method: 'post',
        data:params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}