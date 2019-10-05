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

export function getComments(params){
    console.log(params)
    const url = '/dindang/member/comment/page'
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}

export function getComentTypeNum(params){
    const url = '/dindang/member/comment/getNum'
    return axios.get(url,{
        params
    }).then(res=>{
        return Promise.resolve(res.data)
    })
}

export function getCompleteComments(params){
    console.log(params)
    const url = '/dindang/member/comment/list'
    return axios({
        url: url,
        method: 'get',
        params: params
    }).then(res => {
        return Promise.resolve(res.data)
    })
}


export function fileUpload22(params){
    const url = 'http://192.168.1.52:9010/upload'
    return axios.post(url,params).then(res=>{
        return Promise.resolve(res.data)
    })
}