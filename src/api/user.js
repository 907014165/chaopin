import axios from 'axios'

export function getCollectList(){
    const url = '/api/getGoodsListByKeyWords'
    let params = {
    }
    return axios.get(url,{
        params
    }).then(res=>{
        return Promise.resolve(res.data)
    })
}