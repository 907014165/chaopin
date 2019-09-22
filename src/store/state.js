import { loadSearch, getToken } from 'common/js/cache'
const state = {
    addressList: [],
    currentAddressIndex: 0,
    searchHistory: loadSearch(),
    token: getToken(),
    shopCart:[]
}

export default state