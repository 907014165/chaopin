import { loadSearch, getToken } from 'common/js/cache'
const state = {
    addressList: [],
    currentAddressIndex: 0,
    searchHistory: loadSearch(),
    token: getToken(),
    shopCart: [],
    shopCartList: [],
    isAddShopCart: false,
    currentCommentList: [],
    currentOrderDetail: {},
    isByGoods: false,
    currentRefundGoods: {},
    inPayment: {},
    userInfo: {
        //merberId: '18065855907'
    },
    socket: null,
    reconnection:false,
    UnreadMessage: 0,
    ThirdloginInfo: null
}

export default state