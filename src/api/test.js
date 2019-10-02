import axios from 'axios'

export function testSendDate(){
    const url = 'http://192.168.1.101:9092/order/admin/manage/page'
    return axios.get(url,{
        params
    }).then(res=>{
        return Promise.resolve(res.data)
    })
}