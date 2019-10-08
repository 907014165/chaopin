import axios from 'axios'
export function toPay(url, params) {
    return axios({
        url: url,
        method: "post",
        data: params
    }).then(res => {
        return Promise.resolve(res.data);
    });
}