<template>
  <div class="comment">
    <nav-bar title="发表评论" :right-text="'发布'" @onClickRight="complete" @back="back"></nav-bar>
    <!-- <div class="comment-header">
      <img :src="`https://img.yzcdn.cn/vant/t-thirt.jpg`" class="goods-img" alt />
      <span class="related-desc">描述相符</span>
      <van-rate v-model="rateGoods" color="#f23030" />
    </div>
    <div class="comment-content van-hairline--surround">
      <van-field
        v-model="message"
        type="textarea"
        placeholder="宝贝满足你的期待吗?说说你的使用心得，分享给想买的他们吧"
        rows="1"
        :border="false"
        :autosize="{minHeight: 60}"
      />
      <div class="file-uploader">
        <van-uploader v-model="fileList" multiple :max-count="5" />
        <div class="anonymity van-hairline--top">
          <van-checkbox v-model="isAnonymity" checked-color="#f23030" @change="change">匿名</van-checkbox>
          <span class="anonymity-text">{{ anonymityText }}</span>
        </div>
      </div>
    </div>-->
    <div class="comment-content">
      <comment-goods v-for="(item,index) in seller.skuList" :current-index="index" :key="index"></comment-goods>
      <span class="split"></span>
      <div class="seller-comment">
        <h2 class="title">店铺评价</h2>
        <div class="rateLogistics">
          <span class="related-desc">物流服务</span>
          <van-rate v-model="rateLogistics" color="#f23030" />
        </div>
        <div class="rateCourtesy">
          <span class="related-desc">服务态度</span>
          <van-rate v-model="rateCourtesy" color="#f23030" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "base/NavBar/NavBar";
import CommentGoods from "./CommentGoods";
import Scroll from "base/Scroll/Scroll";
import { Rate, Field, Uploader, Checkbox, Toast } from "vant";
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      rateLogistics: 0, //物流评价
      rateCourtesy: 0, //商家服务态度评价
      seller:this.$route.query.seller,//待评价的商家以及带评价的商品列表
    };
  },
  props: {
    /* seller: {
      type: Object,
      default() {
        return {
          sellerId: 1,
          name: "潮品商城",
          status: 10,
          skuList: [
            {
              skuId: 1,
              title:
                "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
              desc: "颜色:傻白 尺码:42",
              num: 3,
              price: 2,
              thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
            },
            {
              skuId: 1,
              title:
                "商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题商品标题",
              desc: "颜色:傻白 尺码:42",
              num: 3,
              price: 2,
              thumb: "https://img.yzcdn.cn/vant/t-thirt.jpg"
            }
          ]
        };
      }
    } */
  },
  computed: {
    ...mapGetters({
      getCurrentCommentList:'currentCommentList'
    })
  },
  methods: {
    back() {
      this.$router.back();
    },
    complete() {
      if (!this.rateLogistics) {
        Toast("请对物流服务进行评分");
        return;
      }
      if (!this.rateCourtesy) {
        Toast("请对服务态度进行评分");
        return;
      }
      console.log("发表评论");
      console.log(this.getCurrentCommentList)
    }
  },
  components: {
    [Rate.name]: Rate,
    [Field.name]: Field,
    [Uploader.name]: Uploader,
    [Checkbox.name]: Checkbox,
    [Toast.name]: Toast,
    NavBar,
    CommentGoods,
    Scroll
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.comment {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  background: $color-background-w;
  overflow-y: scroll;

  .nav-bar {
    .van-nav-bar__right {
      .van-nav-bar__text {
        color: $color-text-red;
        font-size: $font-size-medium-x;
      }
    }
  }

  .split {
    display: block;
    height: 15px;
    background: $color-background;
  }

  .seller-comment {
    .title {
      font-size: $font-size-medium-x;
      padding: 10px 15px;
    }

    .related-desc {
      font-size: $font-size-medium-x;
      margin-right: 15px;
    }

    .rateLogistics {
      display: flex;
      align-items: center;
      padding: 10px 15px;
    }

    .rateCourtesy {
      display: flex;
      align-items: center;
      padding: 10px 15px;
    }
  }
}
</style>