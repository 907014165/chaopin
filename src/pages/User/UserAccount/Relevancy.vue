<template>
  <div class="relevancy-wrapper">
    <nav-bar :title="'关联账号'" @back="back"></nav-bar>
    <div class="user-info-one">
      <div class="avatar">
        <img
          v-if="getThirdloginInfo.fromType === 'weixin'"
          :src="getThirdloginInfo.userInfo.headimgurl?getThirdloginInfo.userInfo.headimgurl:'http://static.iocoder.cn/1553652151601.jpg?imageView2/2/w/308/h/210/interlace/1/q/100'"
          alt
        />
        <img
          v-if="getThirdloginInfo.fromType === 'qq'"
          :src="getThirdloginInfo.userInfo.figureurl_2?getThirdloginInfo.userInfo.figureurl_2:'http://static.iocoder.cn/1553652151601.jpg?imageView2/2/w/308/h/210/interlace/1/q/100'"
          alt
        />
      </div>
      <div class="nickname">
        {{ getThirdloginInfo.userInfo.nickname }}
        <!-- {{ userInfo.nickname }} -->
      </div>
      <div class="relevancy-text">
        您的
        {{ getThirdloginInfo.fromType==='qq'?'QQ':'微信' }}
        尚未关联潮品账号
      </div>
    </div>
    <div class="operation">
      <van-button
        size="large"
        round
        type="primary"
        :to="{name:'register',query:{title:'绑定账号'}}"
        replace
      >关联到新账号</van-button>
      <van-button
        size="large"
        round
        type="default"
        :to="{name:'passwordlogin',query:{title:'注册绑定'}}"
        replace
      >关联到已有账号</van-button>
    </div>
  </div>
</template>
<script>
import { Button } from "vant";
import NavBar from "base/NavBar/NavBar";
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  props: {},
  created() {},
  computed: {
    ...mapGetters({
      getThirdloginInfo: "ThirdloginInfo"
    })
  },
  methods: {
    back() {
      this.$router.back();
    }
  },
  components: {
    [Button.name]: Button,
    NavBar
  }
};
</script>

<style lang="stylus">
@import '~common/stylus/variable.styl';

.relevancy-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 41;
  background: $color-background;

  .user-info-one {
    padding: 0 15px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      overflow: hidden;
      margin: 15px 0;

      img {
        width: 100%;
      }
    }

    .nickname {
      font-size: 14px;
      margin: 15px 0;
    }

    .relevancy-text {
      font-size: 14px;
      margin: 15px 0;
    }
  }

  .operation {
    padding: 0 15px;

    .van-button {
      margin: 10px 0;
    }
  }
}
</style>