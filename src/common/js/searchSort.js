export class SearchSort {
    constructor({ brandId = null, byDefault = null, byDiscount = null, byPrice = null, bySaleNum = null, current = 1, goodsClassId = null, keyWord = '', size = 5 }) {
        this.brandId = brandId
        this.byDefault = byDefault
        this.byDiscount = byDiscount
        this.byPrice = byPrice
        this.bySaleNum = bySaleNum
        this.current = current
        this.goodsClassId = goodsClassId
        this.keyWord = keyWord
        this.size = size
    }
}