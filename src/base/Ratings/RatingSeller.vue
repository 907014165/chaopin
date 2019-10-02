<template>
  <div class="rating-seller">
    <nav-bar :title="'商品评论'" @back="back()" v-if="isAllRatings"></nav-bar>
    <rating-selected
      :ratings="ratings"
      :select-type="selectType"
      :onlyContent="onlyContent"
      @toggle-only="toggleOnly"
      @change-all="changeAll"
      @change-positive="changePositive"
      @change-negative="changeNegative"
      v-if="isAllRatings"
    ></rating-selected>
    <div class="rating-wrapper">
      <ul>
        <li
          class="rating-item van-hairline--bottom"
          v-for="(rating,index) in selectRating"
          :key="index"
        >
          <div class="avatar">
            <img :src="rating.avatar" alt />
          </div>
          <div class="content">
            <h1 class="name">{{ rating.username }}</h1>
            <div class="star-wrapper">
              <van-rate v-model="rating.score" readonly color="#f23030" />
            </div>
            <p class="text">{{ rating.text }}</p>
            <template v-if="rating.commentImgList.length">
              <img
                :src="img"
                alt
                v-for="(img,index) in rating.commentImgList"
                :key="index"
                @click="showImgPreview(rating.commentImgList,index)"
              />
            </template>
            <div class="time">{{ rating.rateTime|formatDate }}</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import RatingSelected from "./RatingSelected";
import { Rate, ImagePreview } from "vant";
import NavBar from 'base/NavBar/NavBar'
import moment from "moment";
import { getRatings } from "api/goods.js";
Vue.use(ImagePreview);
const ALL = 2;
const POSITIVE = 0;
const NEGATIVE = 1;
export default {
  data() {
    return {
      selectedType: this.selectType,
      onlycontent: this.onlyContent,
      ratings: [] //所有的评论列表
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
      default: 2
    },
    onlyContent: {
      type: true,
      default: false
    },
    isAllRatings:{
      type:Boolean,
      default:true
    }
  },
  created() {
    this._getRatings();
  },
  computed: {
    //当前选中的评论类型
    selectRating() {
      let ratings =  this.ratings.filter(rating => {
        if (this.selectedType === 2) {
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
      if(this.isAllRatings){
        return ratings
      }else{
        return ratings.splice(0,2)
      }
    }
  },
  methods: {
    //返回的回调
    back(){
      this.$router.back()
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
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  watch: {
    //当组件被 商品详情调用时 为了能让better-scroll重新计算dom 监听raging数组的变化让scroll重新计算高度
    ratings(){
      setTimeout(()=>{
        this.$emit('refresh')
      },20)
    }
  },
  components: {
    [Rate.name]: Rate,
    RatingSelected,
    NavBar
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl'
.rating-seller {
  background $color-background-w
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
          margin 0 1px
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
</style>