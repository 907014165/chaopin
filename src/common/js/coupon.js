export default class Coupon {
    constructor({id,name,condition,startAt,endAt,description,reason,value,valueDesc,unitDesc}){
        this.id = id
        this.name = name
        this.condition = condition
        this.startAt = startAt 
        this.endAt = endAt
        this.description = description
        this.reason = reason
        this.value = value
        this.valueDesc = valueDesc
        this.unitDesc = unitDesc
    }
}