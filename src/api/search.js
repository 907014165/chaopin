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

export function getGoodsListByKeyWords(params) {
    const url = '/search/member/search/page'
    
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
    const url = '/search/member/search/page'
    return axios({
        url: url,
        method: 'post',
        data:params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}