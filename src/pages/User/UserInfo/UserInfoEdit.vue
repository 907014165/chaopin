<template>
  <transition :name="slideDirection">
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
          <img :src="msgImgList[0]" alt @click="showPreImg" />
          <van-uploader :after-read="afterRead" :before-read="beforeRead">
            <span class="edit-text">更换头像</span>
          </van-uploader>
        </div>
        <van-cell-group title=" ">
          <van-field v-model="userInfo.memberName" clearable label="会员名" placeholder="请输入用户名" />
          <van-field
            v-model="userInfo.mobile"
            label="手机号"
            placeholder="请输入手机号"
            :error-message="errorMessage"
            :readonly="true"
          />
          <van-field
            :value="sex[userInfo.sex]"
            label="性别"
            disabled
            is-link
            @click="toggleSexSelect"
          />
        </van-cell-group>
        <van-action-sheet title="修改性别" v-model="show" :actions="actions" @select="onSelect" />
      </div>
      <van-image-preview v-model="showPreview" :images="msgImgList"></van-image-preview>
    </div>
  </transition>
</template>
<script>
import Vue from "vue";
import { updateUserInfo, getUserInfo, updateAvatar } from "api/user.js";
import { mapMutations } from "vuex";
import {
  NavBar,
  Field,
  CellGroup,
  Cell,
  ActionSheet,
  Uploader,
  ImagePreview,
  Toast
} from "vant";
Vue.use(ImagePreview);

export default {
  data() {
    return {
      userInfo: {}, //用户信息
      username: "阮受涣",
      phone: "18065855907",
      errorMessage: "",
      sex: {
        0: "保密",
        1: "男",
        2: "女"
      },
      show: false,
      actions: [
        { name: "保密", alias: 0 },
        { name: "男", alias: 1 },
        { name: "女", alias: 2 }
      ],
      slideDirection: "van-slide-right",
      showPreview: false, //展示预览组件
      msgImgList: [
        "http://static.iocoder.cn/1553652151601.jpg?imageView2/2/w/308/h/210/interlace/1/q/100"
      ] //预览展示图地址列表
    };
  },
  created() {
    this._getUserInfo();
  },
  methods: {
    onClickLeft() {
      this.$router.goBack();
      this.$router.isBack = true;
      console.log("取消");
    },
    onClickRight() {
      console.log("完成");
      this._updateUserInfo();
      this.$router.goBack();
      this.$router.isBack = true;
    },
    toggleSexSelect() {
      this.show = !this.show;
    },
    onSelect(item) {
      console.log(item);
      //this.sex = item.name;
      this.userInfo["sex"] = item.alias;
      this.toggleSexSelect();
    },
    showPreImg() {
      this.showPreview = !this.showPreview;
    },
    //文件读取完毕后的回调函数
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
      //清空数组
      this.msgImgList.splice(0, 1, file.content);
      let formdata = new FormData();
      formdata.append("img", file.file, file.file.name);
      formdata.append("memberId", 1);
      console.log(formdata.get("img"));
      this._updateAvatar(formdata);
      //this.msgImgList.push()
    },
    //简单的图片上传检测
    beforeRead(file) {
      if (file.type !== "image/jpeg") {
        Toast("请上传 jpg 格式图片");
        return false;
      }
      return true;
    },
    test() {
      console.log("托尔斯泰");
    },
    _getUserInfo() {
      /* let params = {
        memberId: "1"
      }; */
      getUserInfo().then(res => {
        this.userInfo = res.data;
        this.msgImgList[0] = res.data.avatar;
      });
    },
    //更改用户头像
    _updateAvatar(params) {
      updateAvatar(params).then(res => {
        console.log(res);
        if (res.code === 0) {
          this.userInfo.avatar = this.msgImgList[0];
          this.setUserInfo(this.userInfo);
          console.log("修改成功");
        }
      });
    },
    //更新用户信息
    _updateUserInfo() {
      let params = {
        nickName: this.userInfo.memberName,
        memberName: this.userInfo.memberName,
        sex: this.userInfo.sex
      };
      updateUserInfo(params).then(res => {
        if (res.code === 0) {
          //console.log(res);
          //console.log("修改成功");
          //console.log(this.userInfo);
          this.setUserInfo(this.userInfo);
        }
      });
    },
    ...mapMutations({
      setUserInfo: "SET_USER_INFO"
    })
  },
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [ActionSheet.name]: ActionSheet,
    [Uploader.name]: Uploader,
    [Toast.name]: Toast
    //[ImagePreview.name]: ImagePreview
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
        font-size: $font-size-medium;
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