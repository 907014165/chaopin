<template>
  <div class="address-list">
    <nav-bar title="地址列表" @back="back"></nav-bar>
    <van-address-list
      v-model="chosenAddressId"
      :list="getAddressList"
      :class="isSelect?'':'hideselect'"
      @edit="onEdit"
      @select="onSelect"
      ref="addrList"
    ></van-address-list>
    <van-button type="danger" size="large" class="addAddress" @click="onAdd">添加地址</van-button>
  </div>
</template>
<script>
import { AddressList, Button, Toast, Tag } from "vant";
import NavBar from "base/NavBar/NavBar";
import Scroll from "base/Scroll/Scroll";
import myAreaList from "../../../../mock/myAreaList.js";
import AddressInfo from "common/js/addressInfo.js";
import { getUserAddressList } from "api/user";
import { mapMutations, mapGetters } from "vuex";

console.log(myAreaList);
export default {
  data() {
    return {
      chosenAddressId: this.$route.query.id+'',
      isSelect: this.$route.query.isSelect ? true : false,
      list: myAreaList,
      addrList: []
    };
  },
  created() {
    this._getAddressList();
  },
  mounted() {},
  computed: {
    ...mapGetters({
      getAddressList: "getAddressList"
    })
  },
  methods: {
    back() {
      //this.$router.back();
      this.$router.goBack();
    },
    onAdd() {
      this.$router.push({
        path: "/user/addAddress"
      });
      //Toast("新增地址");
    },
    onEdit(item, index) {
      console.log(typeof index);
      //Toast("编辑地址:" + index);
      this.$router.push({
        path: "/user/addAddress",
        query: {
          item,
          index
        }
      });
    },
    onSelect(item, index) {
      if (!this.isSelect) {
        return;
      }
      this.setCurrentAddrIndex(index);
      this.$router.back();
    },
    setDefaultAddr() {
      let addrlistDom = this.$refs.addrList;
      let tmp = addrlistDom
        .getElementsByClassName("van-address-item")[0]
        .getElementsByClassName("van-address-item__name")[0];
      let default_addr_dom = document.createElement("span");
      default_addr_dom.className = "van-tag van-tag--danger";
      default_addr_dom.innerHTML = "默认";
      tmp.appendChild(default_addr_dom);
    },
    _getAddressList() {
      getUserAddressList().then(res => {
        console.log(res);
        if (res.code === 0) {
          res.data.list.forEach(addr => {
            this.addrList.push(
              new AddressInfo({
                id: addr.memberAddressId,
                name: addr.consignee,
                tel: addr.mobile,
                province: addr.province,
                city: addr.city,
                county: addr.area,
                addressDetail: addr.address,
                areaCode: addr.areaCode + "",
                postalCode: addr.zipCode,
                isDefault: addr.isDefault
              })
            );
          });
          this.setAddressList(this.addrList);
        }
        if (this.addrList.length) {
          this.$nextTick(() => {
            this.setDefaultAddr();
          });
        }
      });
    },
    ...mapMutations({
      setAddressList: "SET_ADDRESS_LIST",
      setCurrentAddrIndex: "CHANGE_CURRENT_ADDRESS_INDEX"
    })
  },
  components: {
    [AddressList.name]: AddressList,
    NavBar,
    Scroll,
    [Button.name]: Button,
    [Toast.name]: Toast,
    [Tag.name]: Tag
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.address-list {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  background: $color-background;

  .default-addr {
    position: absolute;
    left: 175px;
    top: 14px;
    z-index: 30;
  }

  .van-address-list {
    height: auto;

    &.hideselect {
      &>.van-radio-group {
        color: red;

        &>.van-cell {
          color: black;

          &>.van-cell__value {
            color: green;

            &>.van-radio {
              color: orange;

              &>.van-radio__icon {
                display: none;
                color: pink;
              }
            }
          }
        }
      }
    }

    .van-address-list__add {
      display: none;
    }
  }

  .addAddress {
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
</style>
