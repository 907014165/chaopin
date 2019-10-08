export const getAddressList = state => state.addressList

export const getCurrentAddress = state => state.addressList[state.currentAddressIndex]

export const searchHistory = state => state.searchHistory

export const shopCart = state => state.shopCart

export const shopCartList = state => state.shopCartList

export const isAddShopCart = state => state.isAddShopCart

export const currentCommentList = state => state.currentCommentList

export const currentOrderDetail = state => state.currentOrderDetail

export const isByGoods = state => state.isByGoods

export const currentRefundGoods = state => state.currentRefundGoods

export const inPayment = state => state.inPayment