import axios from 'axios'
const config = {
    headers: {"Content-Type":"multipart/form-data"}
}
export function fileUpload(params){
    const url = '/dindang/member/file/add'
    return axios.post(url,params).then(res=>{
        return Promise.resolve(res.data)
    })
}

export function reportComment(params){
    console.log(params)
    const url = '/dindang/member/comment/add'
    return axios({
        url: url,
        method: 'post',
        data: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function fileUpload22(params){
    const url = 'http://172.30.203.227:9010/upload'
    return axios.post(url,params).then(res=>{
        return Promise.resolve(res.data)
    })
}