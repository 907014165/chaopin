import * as types from './mutation-types'
import { saveSearch, clearSearch, deleteSearch, setToken, removeToken } from 'common/js/cache'

const mutations = {
    [types.SET_ADDRESS_LIST](state, addressList) {
        state.addressList = addressList
        console.log(state.addressList)
    },
    [types.CHANGE_ADDRESS](state, params) {
        console.log(params.index)
        console.log(params.address)
        state.addressList.splice(params.index, 1, params.address)
    },
    [types.CHANGE_CURRENT_ADDRESS_INDEX](state, currentIndex) {
        state.currentAddressIndex = currentIndex
    },
    [types.ADD_ADDRESS](state, address) {
        console.log(address)
        state.addressList.push(address)
    },
    [types.DELETE_ADDRESS](state, index1) {
        console.log(index1)
        //state.addressList = state.addressList.splice(index1,1)
        state.addressList.splice(index1, 1)
        //state.addressList = state.addressList.concat(state.addressList)
        console.log(state.addressList)
    },
    //设置历史搜索
    [types.SET_SEARCH_HISTORY](state, history) {
        state.searchHistory = saveSearch(history)
    },
    //清除历史搜索记录
    [types.CLEAR_SEARCH_HISTORY](state) {
        state.searchHistory = clearSearch()
    },
    //删除某个搜索记录
    [types.DELETE_SEARCH_HISTORY](state, query) {
        state.searchHistory = deleteSearch(query)
    },
    //设置token
    [types.SET_TOKEN](state, token) {
        state.token = token
        setToken(token)
    },
    //清除token
    [types.REMOVE_TOKEN](state) {
        state.token = null
        removeToken()
    }
}

export default mutations