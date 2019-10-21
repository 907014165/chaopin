<template>
  <div class="addresss-cart" @click="edit">
    <template v-if="!currentType">
      <van-icon name="location-o" />
      <div class="content">
        <h1 class="address">{{ addressData.address }}</h1>
        <div class="info">
          <span class="name">{{ addressData.name }}</span>
          <span class="tel">{{ addressData.tel }}</span>
        </div>
      </div>
      <van-icon :name="isLink?'arrow':''" />
    </template>
    <template v-if="currentType">
      <div class="add-address-wrapper">
        <van-icon name="add-square" />
        <span class="text">添加收货地址</span>
      </div>

      <van-icon name="arrow" />
    </template>
  </div>
</template>
<script>
import { Icon } from "vant";
export default {
  props: {
    id: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default: ""
    },
    tel: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    isLink: {
      type: Boolean,
      default: true
    },
    addressData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  computed: {
    currentType() {
      return JSON.stringify(this.addressData) == "{}" ? true : false;
    }
  },
  methods: {
    edit() {
      this.$emit("edit");
    }
  },
  components: {
    [Icon.name]: Icon
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.addresss-cart {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: $color-background-w;
  padding: 15px;

  &::before {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    content: '';
    background: repeating-linear-gradient(-45deg, #ff6c6c 0, #ff6c6c 20%, transparent 0, transparent 25%, #1989fa 0, #1989fa 45%, transparent 0, transparent 50%);
    background-image: repeating-linear-gradient(-45deg, rgb(255, 108, 108) 0px, rgb(255, 108, 108) 20%, transparent 0px, transparent 25%, rgb(25, 137, 250) 0px, rgb(25, 137, 250) 45%, transparent 0px, transparent 50%);
    background-position-x: initial;
    background-position-y: initial;
    background-size: 80px;
    background-repeat-x: initial;
    background-repeat-y: initial;
    background-attachment: initial;
    background-origin: initial;
    background-clip: initial;
    background-color: initial;
    background-size: 80px;
  }

  .content {
    flex: 1;
    padding: 0 12px;

    .address {
      margin-bottom: 5px;
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
    }

    .info {
      color: #7d7e80;
      font-size: 12px;

      .name {
        line-height: 16px;
      }

      .tel {
        line-height: 16px;
        margin-left: 10px;
      }
    }
  }

  .van-icon {
    font-size: $font-size-medium-x;

    &.van-icon-location-o {
      font-size: 24px;
      margin-left: 10px;
    }
  }

  .add-address-wrapper {
    .van-icon-add-square {
      color: #1989fa;
      font-size: 40px;
      vertical-align: middle;
    }

    .text {
      line-height: 40px;
      margin-left: 5px;
      font-size: 14px;
      vertical-align: middle;
    }
  }
}
</style>
