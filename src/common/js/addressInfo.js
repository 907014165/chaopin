class AddressInfo {
    constructor({ id, name, tel, province, city, county, addressDetail, areaCode, postalCode, isDefault }) {
        this.id = id
        this.name = name
        this.tel = tel
        this.province = province
        this.city = city
        this.county = county
        this.addressDetail = addressDetail
        this.areaCode = areaCode
        this.postalCode = postalCode
        this.isDefault = isDefault
        this.address = province + city + county + ' ' + addressDetail
    }
}

export default AddressInfo