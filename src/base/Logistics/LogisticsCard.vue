<template>
  <div class="logistics-card van-hairline--bottom">
    <van-icon name="logistics" color="#298EFF" />
    <div class="content">
      <h1
        class="info"
      >[三明市]快件已在三明三元签收 签收人：本人,如有疑问请电联：13906552892 / 17750678039, 您的快递已经妥投。风里来雨里去, 只为客官您满意。上有老下有小, 赏个好评好不好？【请在评价快递员处帮忙点亮五颗星星哦~】</h1>
      <div class="time">2019-09-25 11:28:25</div>
    </div>
    <van-icon name="arrow" />
  </div>
</template>
<script>
import { Icon } from "vant";
export default {
  data() {
    return {};
  },
  components: {
    [Icon.name]: Icon
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl'
.logistics-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px;
  padding-left: 30px;
  background: $color-background-w;

  .content {
    padding: 0 10px;

    .info {
      box-sizing: border-box;
      height: 31px;
      font-size: 13px;
      color: #298EFF;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-word;
      margin-top: 5px;
      line-height: 16px;
      margin-bottom: 6px;
    }

    .time {
      font-size: 13px;
    }
  }

  .van-icon {
    font-size: 24px;

    &.van-icon-arrow {
      font-size: 18px;
    }
  }
}
</style>