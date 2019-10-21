<template>
  <div class="rating-header">
    <div class="comment-title">
      <div class="info">
        <span class="info-text">评价</span>
        <span class="info-num" v-if="ratingTypeNum.length">{{ ratingTypeNum[0] }}</span>
      </div>
      <div class="goods-evaluation" @click="lookMoreComment">
        <span>{{ goodRate }}</span>
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>
<script>
import { Icon } from "vant";
import { getComentTypeNum } from "api/comment.js";
export default {
  data() {
    return {
      ratingTypeNum: []
    };
  },
  props: {
    goodsCommonId: {
      type: Number,
      default: 1
    }
  },
  created() {
    this._getComentTypeNum();
  },
  computed: {
    goodRate() {
      let rate = this.ratingTypeNum[1] / this.ratingTypeNum[0];
      if (rate) {
        return rate * 100 + "%";
      } else {
        return "";
      }
    }
  },
  methods: {
    lookMoreComment() {
      this.$emit("click");
    },
    _getComentTypeNum() {
      let params = {
        goodsCommonId: this.goodsCommonId
      };
      console.log(params);
      getComentTypeNum(params).then(res => {
        if (res.code === 0) {
          this.ratingTypeNum = res.data;
        }
      });
    }
  },
  components: {
    [Icon.name]: Icon
  }
};
</script>
<style lang="stylus">
.rating-header {
  .comment-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px;
    background: $color-background-w;

    .info {
      line-height: 18px;

      .info-text {
        padding: 0 6px;
        font-size: $font-size-medium-x;
        border-left: 4px solid red;
      }

      .info-num {
        font-size: $font-size-medium;
      }
    }

    .goods-evaluation {
      font-size: $font-size-medium;
      display: flex;
      align-items: center;
    }
  }
}
</style>