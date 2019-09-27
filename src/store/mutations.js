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
    },
    //设置选中的购物车内容
    [types.SET_SHOP_CART](state,params){
        console.log(params)
        let index = state.shopCart.findIndex((item)=>{  
            console.log(item)
            return item.sellerId === params.sellerId
        })
        if(index>=0){
            //如果 这个存在 但是里面的skulist为空 那么就删除它
            if(params.skuList.length>0){
                state.shopCart.splice(index,1,params)
            }else{
                state.shopCart.splice(index,1)
            }
        }else{
            if(params.skuList.length>0){
                state.shopCart.push(params)
            }
        }
    },
    //删除被选中国的商城购物车商品
    [types.DEL_SLECT_SHOP_CART_ITEM](state){
        //console.log('delete')
        state.shopCart.splice(0)

        console.log(state.shopCart)
        /* state.shopCart.forEach((item,index)=>{
            //state.shopCart.splice(index,1)
            if(item.isSelectAll){
                state.shopCart.splice(index,1)
            }else{
                item.skuList.splice(0)
            }
        }) */
        
    },
    //设置购物车列表
    [types.SET_SHOP_CART_LIST](state,list){
        state.shopCartList = list
    },
    //设置是否 已经有添加购物车的动作
    [types.SET_IS_SHOP_CART](state,status){
        state.isAddShopCart = status
    }
}

export default mutations