import Goods from './goods'
export default class OrderGoods extends Goods {
    constructor({ goodsId, desc, imgUrl, price, oldPrice, discount, favoriteGoodsId, orderStatus }) {
        super({
            goodsId,
            desc,
            imgUrl,
            price,
            oldPrice,
            discount,
            favoriteGoodsId
        })
        this.orderStatus = orderStatus
    }
}