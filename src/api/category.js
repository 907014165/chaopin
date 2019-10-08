import axios from 'axios'
const baseUrl = 'http://192.168.1.53:9090'
export function getCategoryList(params) {
    const url = `${baseUrl}/member/class/list2`
    return axios.get(url, {
        params
    }).then((res) => {
        //console.log(res)
        return Promise.resolve(res.data)
    })
}

export function getBrands(params) {
    const url = `${baseUrl}/member/brand/listByIds`

    let paramsStr = params.brands.join(',')
    
    console.log(paramsStr)
    return axios({
        method: 'post',
        url: `${baseUrl}/member/brand/listByIds`,
        data: params.brands
    }).then((res) => {
        return Promise.resolve(res.data)
    })

    /* return axios.get(url, {
        params:{
            brands:paramsStr
        }
    }).then((res) => {
        //console.log(res)
        return Promise.resolve(res.data)
    }) */
    /* console.log(params.brands)
    return axios.post(url, {
        brands:params.brands
    }).then((res) => {
        //console.log(res)
        return Promise.resolve(res.data)
    }) */
}