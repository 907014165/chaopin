<template>
  <div class="filter">
    <div
      class="item"
      v-for="(item,index) in filters"
      :key="index"
      @click="changeSort($event,index)"
      :class="activeIndex==index?'text-red':'text-gray'"
    >
      <span class="text-df" v-if="item.filterType!=2">{{ item.title }}</span>
      <span class="text-df" v-else>{{ activeOption && activeOption.name || item.title }}</span>
      <van-icon name="arrow-down" v-if="item.filterType==2" />
      <template v-if="item.filterType!=0">
        <img src="./sort0.png" alt="排序0" v-if="activeIndex!=index" />
        <img src="./sort2.png" alt="排序2" v-else-if="activeIndex==index && activeAscState" />
        <img src="./sort1.png" alt="排序1" v-else-if="activeIndex==index" />
      </template>
    </div>
    <div class="shape">
      <span class="iconfont" :class="curShapeValue?'icon-apps':'icon-list3'" @click="changeShape"></span>
    </div>
  </div>
</template>
<script>
import { Icon } from "vant";
export default {
  data() {
    return {
      // 当前激活索引
      activeIndex: 0,
      // 默认升序
      activeAscState: true,
      //默认两列布局图标
      curShapeValue: true,
      showOption: false,
      activeOption: null
    };
  },
  props: {
    filters: {
      type: Array,
      default() {
        return [
          { title: "默认", value: 0, filterType: 0 },
          { title: "销量", value: 1, filterType: 1 },
          { title: "价格", value: 2, filterType: 1 },
          { title: "折扣", value: 3, filterType: 1, initAscState: true }
        ];
      }
    }
  },
  methods: {
    changeSort(event, index) {
      console.log(index);
      let curActiveItem = this.filters[index];
      console.log(curActiveItem.value);
      let filterType = curActiveItem.filterType || 0;

      this.activeIndex = index;

      // 点击索引等于自身
      if (this.activeIndex == index) {
        //禁用升降序，则直接返回无需处理
        if (filterType == 0) return;
      }

      // 升降序
      if (filterType == 1) {
        if (this.activeIndex == index) {
          //排序顺序颠倒
          this.activeAscState = !this.activeAscState;
        } else {
          this.activeAscState = curActiveItem.initAscState || false;
        }
      }
      let data = {
        sort: curActiveItem.value,
        order: this.activeAscState ? 1 : 2
      };
      console.log(data);
      this.$emit("sortChanged", data);
    },
    changeShape() {
      this.curShapeValue = !this.curShapeValue;
      this.$emit("shapeChanged", this.curShapeValue);
    }
  },
  components: {
    [Icon.name]: Icon
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

.filter {
  display: flex;
  width: 100%;
  background: $color-background-w;
  box-sizing: border-box;
  font-size: 15px;
  line-height: 1.8;

  .item {
    height: 45px;
    line-height: 45px;
    flex: 2;
    text-align: center;

    &.text-red {
      color: #e54d42;
    }

    &.text-gray {
      color: #aaaaaa;
    }

    .text-df {
      font-size: 15px;
    }

    img {
      display: inline-block;
      height: 20px;
      width: 20px;
      vertical-align: middle;
      margin-left: 5px;
    }
  }

  .shape {
    flex: 1;
    height: 45px;
    text-align: center;

    .iconfont {
      font-size: 20px;
      line-height: 45px;
    }
  }
}
</style>
