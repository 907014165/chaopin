<template>
  <div class="search-box" @click="guide">
    <div class="slot-left-wrapper">
      <slot name="label"></slot>
    </div>
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      ref="searchBox"
      @blur="blur"
      @focus="focus"
    >
      <div slot="label"></div>
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
  </div>
</template>
<script>
import { Search } from "vant";
export default {
  props: {
    shape: {
      type: String,
      default: "square"
    },
    background: {
      type: String,
      default: "#f2f2f2"
    },
    leftIcon: {
      type: String,
      default: "search"
    },
    keywords: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      value: this.keywords,
      isFocus:this.$route.query.isFocus
    };
  },
  mounted() {
    if(this.$route.query.isFocus){
      this.focus()
    }
  },
  methods: {
    onSearch() {
      this.$emit("search");
    },
    //
    guide(){
      this.$emit('click')
    },
    focus(){
      this.$refs.searchBox.getElementsByClassName('van-field__control')[0].focus();
      this.$emit('focus')
    },
    blur(){
      this.$refs.searchBox.getElementsByClassName('van-field__control')[0].blur();
      this.$emit('blur')
    }
  },
  watch: {
    keywords(newval,oldval){
      this.value = newval
    },
    value(newval,oldval){
      this.$emit('change',newval)
    }
  },
  components: {
    [Search.name]: Search
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable.styl';

.search-box {
  display: flex;
  align-items: center;

  .slot-left-wrapper {
    background: $color-background-w;
    height: 54px;
    padding-left 10px
    display: flex;
    align-items: center;
    font-size: 24px;
  }

  .van-search {
    flex: 1;

    .van-search__action {
      background: #e93b3d;
      color: #fff;
    }
  }
}
</style>
