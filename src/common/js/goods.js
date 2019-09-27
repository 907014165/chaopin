export default class Goods {
    constructor({ goodsId, desc, imgUrl, price, oldPrice, discount }) {
        this.goodsId = goodsId
        this.img = imgUrl
        this.desc = desc
        this.price = price
        this.oldPrice = oldPrice
        this.discount = discount
    }
}