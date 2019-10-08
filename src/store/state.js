import { loadSearch, getToken } from 'common/js/cache'
const state = {
    addressList: [],
    currentAddressIndex: 0,
    searchHistory: loadSearch(),
    token: getToken(),
    shopCart:[],
    shopCartList:[],
    isAddShopCart:false,
    currentCommentList:[],
    currentOrderDetail:{},
    isByGoods:false,
    currentRefundGoods:{},
    inPayment:{}
}

export default state