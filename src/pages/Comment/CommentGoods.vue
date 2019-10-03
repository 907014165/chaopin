<template>
  <div class="comment-goods">
    <div class="comment-header">
      <img :src="`https://img.yzcdn.cn/vant/t-thirt.jpg`" class="goods-img" alt />
      <span class="related-desc">描述相符</span>
      <van-rate v-model="rateGoods" color="#f23030" @change="changeRate" />
    </div>
    <div class="comment-content van-hairline--surround">
      <van-field
        v-model.lazy="message"
        type="textarea"
        placeholder="宝贝满足你的期待吗?说说你的使用心得，分享给想买的他们吧"
        rows="1"
        :border="false"
        @blur="blur"
        :autosize="{minHeight: 60}"
      />
      <div class="file-uploader">
        <van-uploader v-model="fileList" multiple :max-count="5" @delete="fileListDelete" />
        <div class="anonymity van-hairline--top">
          <van-checkbox v-model="isAnonymity" checked-color="#f23030" @change="change">匿名</van-checkbox>
          <span class="anonymity-text">{{ anonymityText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Rate, Field, Uploader, Checkbox } from "vant";
import { mapMutations } from "vuex";
import { fileUpload, fileUpload22 } from "api/comment.js";
export default {
  data() {
    return {
      rateGoods: 5,
      message: "",
      isAnonymity: true,
      fileList: [],
      anonymityText: "你写的评论将以匿名的方式展现",
      imgList:[]
    };
  },
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    goodsId: {
      type: Number,
      default: 11
    }
  },
  computed: {
    comment() {
      return {
        scores: this.rateGoods,
        content: this.message,
        isAnonymous: this.isAnonymity?1:0,
        commentImageList: this.imgList,
        goodsId: this.goodsId
      };
    }
  },
  methods: {
    change(value) {
      if (value) {
        this.anonymityText = "你写的评论将以匿名的方式展现";
      } else {
        this.anonymityText = "公开的评价会展示在个人主页哟";
      }
    },
    fileListDelete(file, detail) {
      console.log(file);
      console.log(detail);
      this.imgList.splice(detail.index,1)
      let params = {
        index: this.currentIndex,
        comment: this.comment
      };
      this.setCurrentCommentList(params);
    },
    changeRate(score) {
      console.log(score);
      let params = {
        index: this.currentIndex,
        comment: this.comment
      };
      this.setCurrentCommentList(params);
    },
    blur() {
      console.log("fds");
      let params = {
        index: this.currentIndex,
        comment: this.comment
      };
      this.setCurrentCommentList(params);
    },
    _fileUpload(file) {
      fileUpload(file).then(res => {
        console.log(res);
        this.imgList.push(res.data)
      });
    },

    ...mapMutations({
      setCurrentCommentList: "SET_CURRENT_COMMENT_LIST"
    })
  },
  watch: {
    isAnonymity() {
      console.log("是否匿名发生改变");
      let params = {
        index: this.currentIndex,
        comment: this.comment
      };
      this.setCurrentCommentList(params);
    },
    fileList(newval, oldval) {
      if (newval.length > oldval.length) {
        console.log('add')
        let formdata = new FormData();
        formdata.append(
          "img",
          this.fileList[0].file,
          this.fileList[0].file.name
        );
        console.log(formdata.get("img"));
        this._fileUpload(formdata);
        let params = {
          index: this.currentIndex,
          comment: this.comment
        };
        this.setCurrentCommentList(params);
      }

      /* let arr = []
      arr.push() */

      /* formdata.append('img',this.fileList[0].file,this.fileList[0].file.name)
      formdata.append('img',this.fileList[0].file,this.fileList[0].file.name) */

      /* fileUpload22(formdata).then(res=>{
        console.log(res)
      }) */
    }
  },
  components: {
    [Rate.name]: Rate,
    [Field.name]: Field,
    [Uploader.name]: Uploader,
    [Checkbox.name]: Checkbox
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.comment-goods {
  .comment-header {
    display: flex;
    align-items: center;
    padding: 10px 15px;

    .related-desc {
      font-size: $font-size-medium-x;
      margin: 0 15px;
    }

    .goods-img {
      height: 40px;
      width: 40px;
    }
  }

  .comment-content {
    .file-uploader {
      padding-left: 15px;
      padding-top: 10px;

      .van-uploader {
        .van-icon.van-icon-delete {
          font-size: 16px;
        }
      }

      .anonymity {
        padding: 10px 0;
        font-size: $font-size-medium;
        display: flex;
        align-items: center;
        line-height: 14px;

        .anonymity-text {
          flex: 1;
          font-size: $font-size-small;
          color: $color-text-gray;
          text-align: right;
          padding-right: 15px;
        }
      }
    }
  }
}
</style>