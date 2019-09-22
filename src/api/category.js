import axios from 'axios'

export function getCategoryList(params) {
    const url = 'api/member/class/list2'
    return axios.get(url, {
        params
    }).then((res) => {
        //console.log(res)
        return Promise.resolve(res.data)
    })
}

export function getBrands(params) {
    const url = 'api/member/brand/listByIds'

    let paramsStr = params.brands.join(',')
    
    console.log(paramsStr)
    return axios({
        method: 'post',
        url: 'api/member/brand/listByIds',
        data: {
            brands:params.brands
        }
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