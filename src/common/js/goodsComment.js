export default class GoodsComment {
    constructor({username,rateTime,score,rateType,desc,text,avatar,commentImgList}){
            this.username=username
            this.rateTime=rateTime
            this.score=score
            this.rateType=rateType
            this.desc = desc
            this.text = text
            this.avatar= avatar
            this.commentImgList = commentImgList
    }
}