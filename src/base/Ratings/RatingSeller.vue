<template>
  <transition name="van-fade">
    <div class="rating-seller">
      <nav-bar :title="'商品评论'" @back="back()" v-if="isAllRatings"></nav-bar>
      <scroll
        :class="isAllRatings?'rating-seller-scroll':''"
        :data="selectRating"
        :has-more="hasMore"
        :pull-up="true"
        @load="loadMore"
        ref="scroll"
      >
        <rating-selected
          :ratings="ratings"
          :select-type="selectedType"
          :goods-common-id="goodsCommonId1"
          :onlyContent="onlyContent"
          @toggle-only="toggleOnly"
          @change-all="changeAll"
          @change-positive="changePositive"
          @change-negative="changeNegative"
          @change-mid="changeMid"
          v-if="isAllRatings"
        ></rating-selected>
        <transition name="van-fade">
          <div class="rating-wrapper" v-show="ratings.length">
            <li
              class="rating-item van-hairline--bottom"
              v-for="(rating,index) in selectRating"
              :key="index"
            >
              <div class="avatar">
                <img v-lazy="rating.avatar" alt />
              </div>
              <div class="content">
                <h1 class="name">{{ rating.username }}</h1>
                <div class="star-wrapper">
                  <van-rate v-model="rating.score" readonly color="#f23030" />
                </div>
                <p class="text">{{ rating.text }}</p>
                <template v-if="rating.commentImgList.length">
                  <img
                    v-lazy="img"
                    alt
                    v-for="(img,index) in rating.commentImgList"
                    :key="index"
                    @click="showImgPreview(rating.commentImgList,index)"
                  />
                </template>
                <div class="sku-spec">{{ rating.desc }}</div>
                <div class="time">{{ rating.rateTime|formatDate }}</div>
              </div>
            </li>
          </div>
        </transition>
      </scroll>
      <div class="no-rating" v-show="!ratings.length">暂无评论...</div>
    </div>
  </transition>
</template>
<script>
import Vue from "vue";
import RatingSelected from "./RatingSelected";
import { Rate, ImagePreview } from "vant";
import NavBar from "base/NavBar/NavBar";
import Scroll from "base/Scroll/Scroll";
import moment from "moment";
import { isAndroid_ios } from 'common/js/util.js'
import { getRatings } from "api/goods.js";
import { getComments } from "api/comment.js";
import GoodsComment from "common/js/goodsComment.js";
Vue.use(ImagePreview);
//0 1 2
const ALL = 3; //所有
const POSITIVE = 0; //好评
const NEGATIVE = 2; //差评
const MID = 1; //中评
export default {
  name: "ratings",
  data() {
    return {
      selectedType: this.selectType,
      onlycontent: this.onlyContent,
      ratings: [1, 2], //评论列表
      currentPage: 1,
      hasMore: true,
      goodsCommonId1: this.$route.query.goodsCommonId
        ? parseInt(this.$route.query.goodsCommonId)
        : this.goodsCommonId
    };
  },
  props: {
    /* ratings: {
      type: Array,
      default() {
        return [];
      }
    }, */
    selectType: {
      type: Number,
      default: 3
    },
    onlyContent: {
      type: true,
      default: false
    },
    isAllRatings: {
      type: Boolean,
      default: true
    },
    goodsCommonId: {
      type: Number,
      default: 1
    }
  },
  created() {
    //this._getRatings();
    this.ratings.splice(0);
    this._getComments(null, () => {
      setTimeout(() => {
        console.log("update");
        this.ratings = this.ratings.slice(0);
      }, 300);
    });
  },
  mounted() {},
  computed: {
    //当前选中的评论类型
    selectRating() {
      let ratings = this.ratings.filter(rating => {
        if (this.selectedType === ALL) {
          if (this.onlycontent) {
            return rating.text !== "" ? true : false;
          } else {
            return true;
          }
        } else {
          if (this.onlycontent) {
            return rating.rateType === this.selectedType && rating.text !== "";
          } else {
            return rating.rateType === this.selectedType;
          }
        }
      });
      if (this.isAllRatings) {
        return ratings;
      } else {
        return ratings.splice(0, 2);
      }
    }
  },
  methods: {
    //返回的回调
    back() {
      this.$router.back();
    },
    //只看有内容的评论
    toggleOnly() {
      this.onlycontent = !this.onlycontent;
    },
    //切换为全部
    changeAll() {
      this.selectedType = ALL;
    },
    //切换为好评
    changePositive() {
      this.selectedType = POSITIVE;
    },
    //切换为差评
    changeNegative() {
      this.selectedType = NEGATIVE;
    },
    //切换为中评
    changeMid() {
      this.selectedType = MID;
    },
    //图片预览
    showImgPreview(imgList, startIndex) {
      ImagePreview({
        images: imgList,
        startPosition: startIndex,
        onClose() {
          // do something
        }
      });
    },
    //获得评论列表
    _getRatings() {
      getRatings().then(res => {
        console.log(res.data);
        if (res.code === 0) {
          this.ratings = res.data.ratings;
        }
      });
    },
    loadMore(finishPullup) {
      this.currentPage++;
      this._getComments(finishPullup, () => {
        setTimeout(() => {
          this.ratings = this.ratings.slice(0);
        }, 300);
      });
    },
    _getComments(finishPullup, scrollCallBack) {
      let params = {
        current: this.currentPage,
        goodsCommonId: this.goodsCommonId1,
        type: this.selectedType === ALL ? null : this.selectedType
      };
      getComments(params).then(res => {
        console.log(res);
        if (res.code === 0) {
          if (!res.data.length) {
            this.hasMore = false;
          }
          //let tmp = this.ratings.slice(0);
          res.data.forEach(comment => {
            let commentImgList = comment.commentImageList;
            let goodsComment = new GoodsComment({
              username: comment.nickname,
              rateTime: comment.createTime,
              score: comment.scores,
              rateType: comment.type,
              desc: comment.spec,
              text: comment.content,
              avatar: comment.fullAvatar,
              commentImgList: comment.full
            });
            this.ratings.push(goodsComment);
          });
          //this.ratings = tmp;
        }

        if (finishPullup) {
          console.log("33");
          this.$nextTick(() => {
            finishPullup();
          });
        }
        this.$nextTick(() => {
          scrollCallBack && scrollCallBack();
        });
      });
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      if (isAndroid_ios()) {
        date.setHours(date.getHours() - 8);
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {
    //当组件被 商品详情调用时 为了能让better-scroll重新计算dom 监听raging数组的变化让scroll重新计算高度
    ratings() {
      setTimeout(() => {
        this.$emit("refresh");
        //this.$refs.scroll.refresh();
      }, 30);
    },
    //监听selectedType 的变化根据不同的selectedType 请求对应的数据
    selectedType() {
      this.currentPage = 1;
      this.hasMore = true;
      this.ratings.splice(0);
      this._getComments(null, () => {
        setTimeout(() => {
          console.log("dd");
          this.ratings = this.ratings.slice(0);
        }, 300);
      });
    }
  },
  components: {
    [Rate.name]: Rate,
    RatingSelected,
    NavBar,
    Scroll
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.rating-seller {
  background: $color-background-w;

  .rating-seller-scroll {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 46px;
    background: $color-background-w;
  }

  .rating-wrapper {
    padding: 0 18px;

    .rating-item {
      display: flex;
      padding: 18px 0;

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

        .sku-spec {
          font-size: 12px;
          color: rgb(147, 153, 159);
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

  .no-rating {
    text-align: center;
    font-size: 14px;
    color: $color-text-gray;
  }
}
</style>