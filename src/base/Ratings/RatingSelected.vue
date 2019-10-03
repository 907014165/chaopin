<template>
  <div class="rating-selected">
    <div class="rating-type">
      <span class="block positive" :class="{'active':selectedType===2}" @click="changeRatingToAll">
        {{ desc.all }}
        <span class="count">{{ ratings.length }}</span>
      </span>
      <span
        class="block positive"
        :class="{'active':selectedType===0}"
        @click="changeRatingToPositive"
      >
        {{ desc.positive }}
        <span class="count">{{ positives.length }}</span>
      </span>
      <span
        class="block positive"
        :class="{'active':selectedType===1}"
        @click="changeRatingToNegative"
      >
        {{ desc.negative }}
        <span class="count">{{ negatives.length }}</span>
      </span>
    </div>

    <div class="switch">
      <van-checkbox v-model="checked" @click="toggleOnlyContent" checked-color="#f23030">只查看内容评价</van-checkbox>
    </div>
  </div>
</template>
<script>
import { Checkbox } from "vant";
const ALL = 3;//说有
const POSITIVE = 0;//好评
const NEGATIVE = 1;//差评
const MID = 2;//中评
export default {
  data() {
    return {
      selectedType: this.selectType,
      onlycontent: this.onlyContent,
      checked: false
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
          positive: "满意",
          negative: "不满意"
        };
      }
    }
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