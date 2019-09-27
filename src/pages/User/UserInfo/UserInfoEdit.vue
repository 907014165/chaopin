<template>
  <transition name="van-slide-right">
    <div class="user-info-edit">
      <div class="user-info-edit-content">
        <van-nav-bar
          title="标题"
          left-text="取消"
          right-text="完成"
          @click-left="onClickLeft"
          @click-right="onClickRight"
        />
        <div class="avatar">
          <img
            src="http://static.iocoder.cn/1553652151601.jpg?imageView2/2/w/308/h/210/interlace/1/q/100"
            alt
          />
          <van-uploader>
            <span class="edit-text">更换头像</span>
          </van-uploader>
          
        </div>
        <van-cell-group title=" ">
          <van-field v-model="username" clearable label="会员名" placeholder="请输入用户名" />
          <van-field
            v-model="phone"
            label="手机号"
            placeholder="请输入手机号"
            :error-message="errorMessage"
          />
          <van-field :value="sex" label="性别" disabled is-link @click="toggleSexSelect" />
        </van-cell-group>
        <van-action-sheet title="修改性别" v-model="show" :actions="actions" @select="onSelect" />
      </div>
    </div>
  </transition>
</template>
<script>
import { NavBar, Field, CellGroup, Cell, ActionSheet , Uploader } from "vant";

export default {
  data() {
    return {
      username: "阮受涣",
      phone: "18065855907",
      errorMessage: "",
      sex: "男",
      show: false,
      actions: [{ name: "男" }, { name: "女" }]
    };
  },
  methods: {
    onClickLeft() {
      this.$router.back();
      console.log("取消");
    },
    onClickRight() {
      console.log("完成");
      this.$router.back();
    },
    toggleSexSelect() {
      this.show = !this.show;
    },
    onSelect(item) {
      console.log(item);
      this.sex = item.name;
      this.toggleSexSelect();
    }
  },
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [ActionSheet.name]: ActionSheet,
    [Uploader.name]:Uploader
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.user-info-edit {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0px;
  left: 0;
  z-index: 40;
  background: $color-background;

  .user-info-edit-content {
    background: $color-background-w;

    .avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      img {
        height: 100px;
        width: 100px;
        border-radius: 50%;
      }

      .edit-text {
        margin: 10px 0;
        color: $color-text-red;
        font-size: $font-size-medium-x;
      }
    }

    .van-nav-bar {
      .van-nav-bar__left {
        .van-nav-bar__text {
          color: $color-text;
        }
      }

      .van-nav-bar__right {
        .van-nav-bar__text {
          color: $color-text-red;
        }
      }
    }
  }
}
</style>