<template>
  <div class="address-edit">
    <nav-bar title="地址编辑" @back="back"></nav-bar>
    <van-address-edit
      :area-list="areaList"
      show-postal
      show-delete
      show-set-default
      show-search-result
      :search-result="searchResult"
      :address-info="addressInfo"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>
<script>
import { AddressEdit } from "vant";
import NavBar from "base/NavBar/NavBar";
import areaList from "../../../../mock/area.js";
import AddressInfo from "common/js/addressInfo";
import {
  addUserAddressList,
  updataUserAddressList,
  deleteUserAddressList
} from "api/user.js";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      areaList,
      searchResult: [],
      addressInfo: this.$route.query.item
    };
  },
  computed: {
    addressType() {
      return this.addressInfo !== undefined ? "edit" : "add";
    }
  },
  methods: {
    back() {
      console.log(this.AddressInfo);
      //this.$router.back();
      this.$router.goBack();
    },
    onSave(item) {
      //Toast("save");
      console.log(item)
      const address = new AddressInfo({ ...item });

      console.log(this.$route.query.index);

      if (this.addressType === "edit") {
        console.log(address);
        let params = {
          index: this.$route.query.index,
          address
        };
        
        let addrParams = {
          memberAddressId:parseInt(address.id),
          address: address.addressDetail,
          areaId: address.areaCode,
          cityId: address.areaCode.substring(0, 4) + "00",
          consignee: address.name,
          isDefault: address.isDefault,
          mobile: address.tel,
          pcaInfo: address.province + " " + address.city + " " + address.county,
          provinceId: address.areaCode.substring(0, 2) + "0000",
          zipCode: address.postalCode
        };

        console.log(addrParams)
        this._updataUserAddressList(addrParams);
        this.changeAddress(params);
        //this.$router.back();
      } else {
        this.addAdress(address);
        let params = {
          address: address.addressDetail,
          areaId: address.areaCode,
          cityId: address.areaCode.substring(0, 4) + "00",
          consignee: address.name,
          isDefault: address.isDefault,
          mobile: address.tel,
          pcaInfo: address.province + " " + address.city + " " + address.county,
          provinceId: address.areaCode.substring(0, 2) + "0000",
          zipCode: address.postalCode
        };
        console.log(params);
        this._addUserAddressList(params);
        //this.$router.back();
      }
    },
    onDelete(content) {
      console.log(content);
      //console.log("ff" + this.$route.query.index);
      //this.deleteAddress(this.$route.query.index);
      //this.$router.back();
      let params = {
        memberAddressId: content.id
      };
      this._deleteUserAddressList(params);
    },
    _addUserAddressList(params) {
      console.log(params);
      addUserAddressList(params).then(res => {
        if(res.data){
          this.$router.back()
        }
      });
    },
    _updataUserAddressList(params) {
      updataUserAddressList(params).then(res => {
        if(res.data){
          this.$router.back()
        }
      });
    },
    _deleteUserAddressList(params) {
      deleteUserAddressList(params).then(res => {
        if(res.data){
          this.$router.back()
        }
      });
    },
    /* onChangeDetail(val) {
      if (val) {
        this.searchResult = [
          {
            name: "黄龙万科中心",
            address: "杭州市西湖区"
          }
        ];
      } else {
        this.searchResult = [];
      }
    }, */
    ...mapMutations({
      changeAddress: "CHANGE_ADDRESS",
      addAdress: "ADD_ADDRESS",
      deleteAddress: "DELETE_ADDRESS"
    })
  },
  components: {
    [AddressEdit.name]: AddressEdit,
    NavBar
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.address-edit {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 25;
  background: $color-background;
}
</style>
