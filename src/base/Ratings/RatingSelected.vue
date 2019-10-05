<template>
  <div class="rating-selected">
    <div class="rating-type">
      <span class="block positive" :class="{'active':selectedType===3}" @click="changeRatingToAll">
        {{ desc.all }}
        <span class="count">{{ ratingTypeNum[0] }}</span>
      </span>
      <span
        class="block positive"
        :class="{'active':selectedType===0}"
        @click="changeRatingToPositive"
      >
        {{ desc.positive }}
        <span class="count">{{ ratingTypeNum[1] }}</span>
      </span>
      <span
        class="block positive"
        :class="{'active':selectedType===2}"
        @click="changeRatingToNegative"
      >
        {{ desc.negative }}
        <span class="count">{{ ratingTypeNum[3] }}</span>
      </span>
      <span
        class="block positive"
        :class="{'active':selectedType===1}"
        @click="changeRatingToMid"
      >
        {{ desc.mid }}
        <span class="count">{{ ratingTypeNum[2] }}</span>
      </span>
    </div>

    <div class="switch">
      <van-checkbox v-model="checked" @click="toggleOnlyContent" checked-color="#f23030">只查看内容评价</van-checkbox>
    </div>
  </div>
</template>
<script>
import { Checkbox } from "vant";
import { getComentTypeNum } from 'api/comment.js'
const ALL = 3;//所有
const POSITIVE = 0;//好评
const NEGATIVE = 2;//差评
const MID = 1;//中评
export default {
  data() {
    return {
      selectedType: this.selectType,
      onlycontent: this.onlyContent,
      checked: false,
      ratingTypeNum:[]
    };
  },
  props: {
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: "全部",
          positive: "好评",
          negative: "差评",
          mid:"还不错"
        };
      }
    }
  },
  created() {
    this._getComentTypeNum()
  },
  computed: {
    positives() {
      return this.ratings.filter(rating => {
        return rating.rateType === POSITIVE;
      });
    },
    negatives() {
      return this.ratings.filter(rating => {
        return rating.rateType === NEGATIVE;
      });
    },
    midComment(){
      return this.ratings.filter(rating => {
        return rating.rateType === MID;
      });
    }
  },
  methods: {
    toggleOnlyContent(e) {
      this.onlycontent = !this.onlycontent;
      this.$emit("toggle-only", e);
    },
    changeRatingToAll(e) {
      this.selectedType = ALL;
      this.$emit("change-all", e);
    },
    changeRatingToPositive(e) {
      this.selectedType = POSITIVE;
      this.$emit("change-positive", e);
    },
    changeRatingToNegative(e) {
      this.selectedType = NEGATIVE;
      this.$emit("change-negative", e);
    },
    changeRatingToMid(e) {
      this.selectedType = MID;
      this.$emit("change-mid", e);
    },
    _getComentTypeNum(){
      let params = {
        goodsCommonId:1
      }
      console.log(params)
      getComentTypeNum(params).then(res=>{
        if(res.code === 0){
          this.ratingTypeNum = res.data
        }
      })
    }
  },
  components: {
    [Checkbox.name]: Checkbox
  }
};
</script>
<style lang="stylus">
.rating-selected {
  .rating-type {
    padding: 18px 0;
    margin: 0 18px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  }

  .block {
    display: inline-block;
    padding: 8px 12px;
    margin-right: 8px;
    line-height: 16px;
    border-radius: 4px;
    font-size: 12px;
    color: rgb(77, 85, 93);

    .count {
      margin-left: 2px;
      font-size: 8px;
    }

    &.active {
      color: #fff;
    }

    &.positive {
      background: #fdf0f0;

      &.active {
        background: #e93b3d;
      }
    }

    &.negative {
      background: rgba(77, 85, 93, 0.2);

      &.active {
        background: rgb(77, 85, 93);
      }
    }
  }

  .switch {
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    color: rgb(147, 153, 159);

    .van-checkbox__label {
      color: #93999f;
      font-size: 14px;
    }
  }
}
</style>