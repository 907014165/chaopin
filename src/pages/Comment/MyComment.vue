<template>
  <transition name="van-fade">
    <div class="my-comment">
      <nav-bar :title="'我的评价'" @back="back"></nav-bar>
      <scroll :data="commentlist" class="my-comment-scroll">
        <div class="rating-wrapper">
          <li
            class="rating-item van-hairline--bottom"
            v-for="(rating,index) in commentlist"
            :key="index"
          >
            <div class="avatar">
              <img :src="rating.rating.avatar" alt />
            </div>
            <div class="content">
              <h1 class="name">{{ rating.rating.username }}</h1>
              <div class="star-wrapper">
                <van-rate v-model="rating.rating.score" readonly color="#f23030" />
              </div>
              <p class="text">{{ rating.rating.text }}</p>
              <template v-if="rating.rating.commentImgList.length">
                <img
                  :src="img"
                  alt
                  v-for="(img,index) in rating.rating.commentImgList"
                  :key="index"
                  @click="showImgPreview(rating.rating.commentImgList,index)"
                />
              </template>
              <div class="time">{{ rating.rating.rateTime|formatDate }}</div>
              <sku-item :sku="rating.goodsInfo" :is-footer="true">
                <div class style="color:#f23030">{{ commentGrade(rating.rating.rateType) }}</div>
              </sku-item>
            </div>
          </li>
        </div>
      </scroll>
    </div>
  </transition>
</template>
<script>
import NavBar from "base/NavBar/NavBar";
import SkuGoods from "common/js/skuGoods.js";
import SkuItem from "components/SkuItem/SkuItem";
import Scroll from "base/Scroll/Scroll";
import { getCompleteComments } from "api/comment.js";
import moment from "moment";
import { Rate, ImagePreview } from "vant";
import Vue from "vue";
Vue.use(ImagePreview);
export default {
  data() {
    return {
      commentlist: []
    };
  },
  created() {
    this._getCompleteComments();
  },
  methods: {
    back() {
      this.$router.back();
    },
    showImgPreview(imgList, startIndex) {
      ImagePreview({
        images: imgList,
        startPosition: startIndex,
        onClose() {
          // do something
        }
      });
    },
    commentGrade(grade) {
      let gradeMap = {};
      const POSITIVE = 0; //好评
      const NEGATIVE = 2; //差评
      const MID = 1; //中评
      gradeMap[POSITIVE] = "好评";
      gradeMap[NEGATIVE] = "差评";
      gradeMap[MID] = "中评";
      return gradeMap[grade];
    },
    _getCompleteComments() {
      getCompleteComments().then(res => {
        if (res.code === 0) {
          this.init(res);
        }
      });
    },
    init(res) {
      res.data.forEach(ratings => {
        let rating = {
          username: ratings.nickname,
          rateTime: new Date(ratings.createTime).getTime(),
          score: ratings.scores,
          rateType: ratings.type,
          desc: ratings.spec,
          text: ratings.content,
          avatar: ratings.fullAvatar,
          commentImgList: ratings.full
        };
        let goodsInfo = new SkuGoods({
          goodsId: ratings.goodsId,
          title: ratings.goodsName,
          desc: ratings.spec,
          price: ratings.price,
          thumb: ratings.fullImage
        });
        let comment = {
          rating: rating,
          goodsInfo: goodsInfo
        };
        this.commentlist.push(comment);
      });
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  components: {
    [Rate.name]: Rate,
    NavBar,
    SkuItem,
    Scroll
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.my-comment {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 100;
  background: $color-background;

  .my-comment-scroll {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 46px;

    .rating-wrapper {
      .rating-item {
        display: flex;
        padding: 18px 18px;
        background: #fff;

        .avatar {
          flex: 0 0 28px;
          height: 28px;
          margin-right: 12px;

          img {
            border-radius: 50%;
            height: 28px;
            width: 28px;
          }
        }

        .content {
          position: relative;
          flex: 1;

          .van-card {
            padding: 0;
            margin-top: 20px;
          }

          img {
            height: 96px;
            width: 96px;
            margin: 0 1px;
            object-fit: cover;
          }

          .name {
            line-height: 12px;
            font-size: 10px;
            color: rgb(7, 17, 27);
          }

          .star-wrapper {
            margin-bottom: 6px;

            .van-rate__icon {
              font-size: 14px;
            }

            .delivery {
              display: inline-block;
              vertical-align: top;
              line-height: 12px;
              font-size: 10px;
              color: rgb(147, 153, 159);
            }
          }

          .text {
            margin-bottom: 8px;
            line-height: 18px;
            color: rgb(7, 17, 27);
            font-size: 12px;
          }

          .recommend {
            line-height: 16px;

            .icon-thumb_up, .item {
              display: inline-block;
              margin: 0 8px 4px 0;
              font-size: 9px;
            }

            .icon-thumb_up {
              color: rgb(0, 160, 220);
            }

            .item {
              padding: 0 6px;
              border: 1px solid rgba(7, 17, 27, 0.1);
              border-radius: 1px;
              color: rgb(147, 153, 159);
              background: #fff;
            }
          }

          .time {
            position: absolute;
            top: 0;
            right: 0;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }
}
</style>