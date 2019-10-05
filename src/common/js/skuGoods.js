export default class SkuGoods {
    constructor({
        skuId,
        goodsId,
        title,
        desc,
        num,
        price,
        thumb
    }){
        this.skuId = skuId
        this.goodsId = goodsId
        this.title = title
        this.desc = desc
        this.num = num
        this.price = price
        this.thumb = thumb
    }
}