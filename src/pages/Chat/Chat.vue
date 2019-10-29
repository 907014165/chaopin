<template>
  <transition name="van-slide-right">
    <div class="chat">
      <nav-bar title="联系客服" @back="back"></nav-bar>

      <scroll
        class="content"
        :data="msgList"
        :pull-top="true"
        ref="scroll"
        :listenScroll="true"
        :probeType="3"
        :pull-down="true"
        @scroll="onScroll"
        @pull-down-handler="loadMoreMsg"
      >
        <div class="msg-list" ref="msgList1" @click="inputBlur">
          <div class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.id">
            <div class="my" v-if="row.uid==myuid">
              <div class="left">
                <div class="bubble" v-if="row.type=='text'">
                  <div
                    v-html="row.msg.content"
                    @touchstart="gtouchstart($event)"
                    @touchmove="gtouchmove"
                    @touchend="gtouchend"
                  ></div>
                </div>
                <div class="bubble img" v-if="row.type=='img'">
                  <img
                    :src="row.msg.url"
                    @click="showPreviewImg(row.msg.url)"
                    @load="imgLoad(row.InSending)"
                    alt
                  />
                </div>
              </div>
              <div class="right">
                <img :src="row.face" alt />
              </div>
            </div>
            <div class="other" v-if="row.uid==kefuuid">
              <div class="left">
                <img :src="row.face" alt />
              </div>
              <div class="right">
                <div class="username">
                  <div class="name">{{ row.username }}</div>
                  <div class="time">{{ row.time }}</div>
                </div>
                <div class="bubble" v-if="row.type=='text'">
                  <div v-html="row.msg.content"></div>
                </div>
                <div class="bubble img" v-if="row.type=='img'">
                  <img
                    :src="row.msg.url"
                    @click="showPreviewImg(row.msg.url)"
                    @load="imgLoad(row.InSending)"
                    alt
                  />
                </div>
              </div>
            </div>
            <div class="goods" v-if="row.uid===goodsuid">
              <goods-item-single :goods="row.msg"></goods-item-single>
            </div>
          </div>
        </div>
      </scroll>
      <div class="input-box van-hairline--bottom" :class="showEmji">
        <div class="more">
          <van-uploader :after-read="afterRead">
            <van-icon name="photo-o" />
          </van-uploader>
        </div>

        <div class="textbox">
          <div class="box">
            <textarea
              auto-height="true"
              v-model="textMsg"
              @focus="inputFoucs"
              @blur="inputBlur"
              id="textMsg"
              ref="inputBox"
            />
          </div>
          <div class="em" @click="chooseEmoji">
            <van-icon name="smile-o" />
          </div>
        </div>

        <div class="send" @click="sendText">
          <div class="btn">发送</div>
        </div>
      </div>
      <div class="emoji-box" v-if="showEmji" :class="showEmji">
        <van-swipe indicator-color="black">
          <van-swipe-item v-for="(page,pid) in emojiList" :key="pid">
            <div class="emoji" v-for="(em,eid) in page" :key="eid" @click="addEmoji(em)">
              <img :src="em.url" alt />
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- <van-action-sheet
        v-model="show"
        :actions="actions"
        cancel-text="取消"
        @select="onSelect"
        @cancel="onCancel"
      />-->
      <van-image-preview
        v-model="showPreview"
        :images="msgImgList"
        @change="onChange"
        :start-position="startPosition"
      ></van-image-preview>

      <div class="long-press-dom">

      </div>
    </div>
  </transition>
</template>
<script>
import Vue from "vue";
import NavBar from "base/NavBar/NavBar";
import Scroll from "base/Scroll/Scroll";
import GoodsItemSingle from "base/GoodsItemSingle/GoodsItemSingle";
import { fileUpload, getChatMsgList } from "api/chat.js";
import { mapGetters, mapMutations } from "vuex";
import { getServeMsg } from "./chat.js";
import moment from "moment";
import {
  Swipe,
  SwipeItem,
  Icon,
  Button,
  ActionSheet,
  Uploader,
  ImagePreview
} from "vant";
Vue.use(ImagePreview);
//客户端 消息 格式
class ChatMsg {
  constructor({ id, uid, username, face, time, type, msg, InSending }) {
    this.id = id;
    this.uid = uid;
    this.username = username;
    this.face = face;
    this.time = time;
    this.type = type;
    this.msg = msg;
    this.InSending = InSending;
  }
}
//服务端消息格式
class ChatMsgServer {
  constructor({ type, avatar, uid, content, from_uid, chat_type }) {
    this.type = type;
    this.avatar = avatar;
    this.uid = uid;
    this.content = content;
    this.from_uid = from_uid;
    this.chat_type = chat_type;
  }
}
export default {
  name: "chat",
  beforeRouteEnter(to, from, next) {
    console.log("进入");
    next(vm => {
      vm.msgList.splice(0);
      vm.msgImgList.splice(0);
      vm.currentPage = 1;
      vm.pageSize = 15;
      vm._getChatMsgList(() => {
        vm.$nextTick(() => {
          vm.scrollEnd();
        });
      });
    });
  },
  data() {
    return {
      show: false,
      showPreview: false,
      startPosition: 0,
      imgSrc: "",
      actions: [{ name: "从相册中选取", value: 1 }, { name: "拍照", value: 2 }],
      publicPath: process.env.BASE_URL,
      textMsg: "",
      msgList: [],
      msgImgList: [],
      myuid: 0,
      emojiList: [
        [
          {
            url: require("../../common/image/emoji/100.gif"),
            alt: "[微笑]",
            alias: "1.gif"
          },
          {
            url: require("../../common/image/emoji/101.gif"),
            alt: "[伤心]",
            alias: "2.gif"
          },
          {
            url: require("../../common/image/emoji/102.gif"),
            alt: "[美女]",
            alias: "3.gif"
          },
          {
            url: require("../../common/image/emoji/103.gif"),
            alt: "[发呆]",
            alias: "4.gif"
          },
          {
            url: require("../../common/image/emoji/104.gif"),
            alt: "[墨镜]",
            alias: "5.gif"
          },
          {
            url: require("../../common/image/emoji/105.gif"),
            alt: "[哭]",
            alias: "6.gif"
          },
          {
            url: require("../../common/image/emoji/106.gif"),
            alt: "[羞]",
            alias: "7.gif"
          },
          {
            url: require("../../common/image/emoji/107.gif"),
            alt: "[哑]",
            alias: "8.gif"
          },
          {
            url: require("../../common/image/emoji/108.gif"),
            alt: "[睡]",
            alias: "9.gif"
          },
          {
            url: require("../../common/image/emoji/109.gif"),
            alt: "[哭]",
            alias: "10.gif"
          },
          {
            url: require("../../common/image/emoji/110.gif"),
            alt: "[囧]",
            alias: "11.gif"
          },
          {
            url: require("../../common/image/emoji/111.gif"),
            alt: "[怒]",
            alias: "12.gif"
          },
          {
            url: require("../../common/image/emoji/112.gif"),
            alt: "[调皮]",
            alias: "13.gif"
          },
          {
            url: require("../../common/image/emoji/113.gif"),
            alt: "[笑]",
            alias: "14.gif"
          },
          {
            url: require("../../common/image/emoji/114.gif"),
            alt: "[惊讶]",
            alias: "15.gif"
          },
          {
            url: require("../../common/image/emoji/115.gif"),
            alt: "[难过]",
            alias: "16.gif"
          },
          {
            url: require("../../common/image/emoji/116.gif"),
            alt: "[酷]",
            alias: "17.gif"
          },
          {
            url: require("../../common/image/emoji/117.gif"),
            alt: "[汗]",
            alias: "18.gif"
          },
          {
            url: require("../../common/image/emoji/118.gif"),
            alt: "[抓狂]",
            alias: "19.gif"
          },
          {
            url: require("../../common/image/emoji/119.gif"),
            alt: "[吐]",
            alias: "20.gif"
          },
          {
            url: require("../../common/image/emoji/120.gif"),
            alt: "[笑]",
            alias: "21.gif"
          },
          {
            url: require("../../common/image/emoji/121.gif"),
            alt: "[快乐]",
            alias: "22.gif"
          },
          {
            url: require("../../common/image/emoji/122.gif"),
            alt: "[奇]",
            alias: "23.gif"
          },
          {
            url: require("../../common/image/emoji/123.gif"),
            alt: "[傲]",
            alias: "24.gif"
          }
        ],
        [
          {
            url: require("../../common/image/emoji/124.gif"),
            alt: "[饿]",
            alias: "25.gif"
          },
          {
            url: require("../../common/image/emoji/125.gif"),
            alt: "[累]",
            alias: "26.gif"
          },
          {
            url: require("../../common/image/emoji/126.gif"),
            alt: "[吓]",
            alias: "27.gif"
          },
          {
            url: require("../../common/image/emoji/127.gif"),
            alt: "[汗]",
            alias: "28.gif"
          },
          {
            url: require("../../common/image/emoji/128.gif"),
            alt: "[高兴]",
            alias: "29.gif"
          },
          {
            url: require("../../common/image/emoji/129.gif"),
            alt: "[闲]",
            alias: "30.gif"
          },
          {
            url: require("../../common/image/emoji/130.gif"),
            alt: "[努力]",
            alias: "31.gif"
          },
          {
            url: require("../../common/image/emoji/131.gif"),
            alt: "[骂]",
            alias: "32.gif"
          },
          {
            url: require("../../common/image/emoji/132.gif"),
            alt: "[疑问]",
            alias: "33.gif"
          },
          {
            url: require("../../common/image/emoji/133.gif"),
            alt: "[秘密]",
            alias: "34.gif"
          },
          {
            url: require("../../common/image/emoji/134.gif"),
            alt: "[乱]",
            alias: "35.gif"
          },
          {
            url: require("../../common/image/emoji/135.gif"),
            alt: "[疯]",
            alias: "36.gif"
          },
          {
            url: require("../../common/image/emoji/136.gif"),
            alt: "[哀]",
            alias: "37.gif"
          },
          {
            url: require("../../common/image/emoji/137.gif"),
            alt: "[鬼]",
            alias: "38.gif"
          },
          {
            url: require("../../common/image/emoji/138.gif"),
            alt: "[打击]",
            alias: "39.gif"
          },
          {
            url: require("../../common/image/emoji/139.gif"),
            alt: "[bye]",
            alias: "40.gif"
          },
          {
            url: require("../../common/image/emoji/140.gif"),
            alt: "[汗]",
            alias: "41.gif"
          },
          {
            url: require("../../common/image/emoji/141.gif"),
            alt: "[抠]",
            alias: "42.gif"
          },
          {
            url: require("../../common/image/emoji/142.gif"),
            alt: "[鼓掌]",
            alias: "43.gif"
          },
          {
            url: require("../../common/image/emoji/143.gif"),
            alt: "[糟糕]",
            alias: "44.gif"
          },
          {
            url: require("../../common/image/emoji/144.gif"),
            alt: "[恶搞]",
            alias: "45.gif"
          },
          {
            url: require("../../common/image/emoji/145.gif"),
            alt: "[什么]",
            alias: "46.gif"
          },
          {
            url: require("../../common/image/emoji/146.gif"),
            alt: "[什么]",
            alias: "47.gif"
          },
          {
            url: require("../../common/image/emoji/147.gif"),
            alt: "[累]",
            alias: "48.gif"
          }
        ],
        [
          {
            url: require("../../common/image/emoji/148.gif"),
            alt: "[看]",
            alias: "49.gif"
          },
          {
            url: require("../../common/image/emoji/149.gif"),
            alt: "[难过]",
            alias: "50.gif"
          },
          {
            url: require("../../common/image/emoji/150.gif"),
            alt: "[难过]",
            alias: "51.gif"
          },
          {
            url: require("../../common/image/emoji/151.gif"),
            alt: "[坏]",
            alias: "52.gif"
          },
          {
            url: require("../../common/image/emoji/152.gif"),
            alt: "[亲]",
            alias: "53.gif"
          },
          {
            url: require("../../common/image/emoji/153.gif"),
            alt: "[吓]",
            alias: "54.gif"
          },
          {
            url: require("../../common/image/emoji/154.gif"),
            alt: "[可怜]",
            alias: "55.gif"
          },
          {
            url: require("../../common/image/emoji/155.gif"),
            alt: "[刀]",
            alias: "56.gif"
          },
          {
            url: require("../../common/image/emoji/156.gif"),
            alt: "[水果]",
            alias: "57.gif"
          },
          {
            url: require("../../common/image/emoji/157.gif"),
            alt: "[酒]",
            alias: "58.gif"
          },
          {
            url: require("../../common/image/emoji/158.gif"),
            alt: "[篮球]",
            alias: "59.gif"
          },
          {
            url: require("../../common/image/emoji/159.gif"),
            alt: "[乒乓]",
            alias: "60.gif"
          },
          {
            url: require("../../common/image/emoji/160.gif"),
            alt: "[咖啡]",
            alias: "61.gif"
          },
          {
            url: require("../../common/image/emoji/161.gif"),
            alt: "[美食]",
            alias: "62.gif"
          },
          {
            url: require("../../common/image/emoji/162.gif"),
            alt: "[动物]",
            alias: "63.gif"
          },
          {
            url: require("../../common/image/emoji/163.gif"),
            alt: "[鲜花]",
            alias: "64.gif"
          },
          {
            url: require("../../common/image/emoji/164.gif"),
            alt: "[枯]",
            alias: "65.gif"
          },
          {
            url: require("../../common/image/emoji/165.gif"),
            alt: "[唇]",
            alias: "66.gif"
          },
          {
            url: require("../../common/image/emoji/166.gif"),
            alt: "[爱]",
            alias: "67.gif"
          },
          {
            url: require("../../common/image/emoji/167.gif"),
            alt: "[分手]",
            alias: "68.gif"
          },
          {
            url: require("../../common/image/emoji/168.gif"),
            alt: "[生日]",
            alias: "69.gif"
          },
          {
            url: require("../../common/image/emoji/169.gif"),
            alt: "[电]",
            alias: "70.gif"
          },
          {
            url: require("../../common/image/emoji/170.gif"),
            alt: "[炸弹]",
            alias: "71.gif"
          },
          {
            url: require("../../common/image/emoji/171.gif"),
            alt: "[刀子]",
            alias: "72.gif"
          }
        ],
        [
          {
            url: require("../../common/image/emoji/172.gif"),
            alt: "[足球]",
            alias: "73.gif"
          },
          {
            url: require("../../common/image/emoji/173.gif"),
            alt: "[瓢虫]",
            alias: "74.gif"
          },
          {
            url: require("../../common/image/emoji/174.gif"),
            alt: "[翔]",
            alias: "75.gif"
          },
          {
            url: require("../../common/image/emoji/175.gif"),
            alt: "[月亮]",
            alias: "76.gif"
          },
          {
            url: require("../../common/image/emoji/176.gif"),
            alt: "[太阳]",
            alias: "77.gif"
          },
          {
            url: require("../../common/image/emoji/177.gif"),
            alt: "[礼物]",
            alias: "78.gif"
          },
          {
            url: require("../../common/image/emoji/178.gif"),
            alt: "[抱抱]",
            alias: "79.gif"
          },
          {
            url: require("../../common/image/emoji/179.gif"),
            alt: "[拇指]",
            alias: "80.gif"
          },
          {
            url: require("../../common/image/emoji/180.gif"),
            alt: "[贬低]",
            alias: "81.gif"
          },
          {
            url: require("../../common/image/emoji/181.gif"),
            alt: "[握手]",
            alias: "82.gif"
          },
          {
            url: require("../../common/image/emoji/182.gif"),
            alt: "[剪刀手]",
            alias: "83.gif"
          },
          {
            url: require("../../common/image/emoji/183.gif"),
            alt: "[抱拳]",
            alias: "84.gif"
          },
          {
            url: require("../../common/image/emoji/184.gif"),
            alt: "[勾引]",
            alias: "85.gif"
          },
          {
            url: require("../../common/image/emoji/185.gif"),
            alt: "[拳头]",
            alias: "86.gif"
          },
          {
            url: require("../../common/image/emoji/186.gif"),
            alt: "[小拇指]",
            alias: "87.gif"
          },
          {
            url: require("../../common/image/emoji/187.gif"),
            alt: "[拇指八]",
            alias: "88.gif"
          },
          {
            url: require("../../common/image/emoji/188.gif"),
            alt: "[食指]",
            alias: "89.gif"
          },
          {
            url: require("../../common/image/emoji/189.gif"),
            alt: "[ok]",
            alias: "90.gif"
          },
          {
            url: require("../../common/image/emoji/190.gif"),
            alt: "[情侣]",
            alias: "91.gif"
          },
          {
            url: require("../../common/image/emoji/191.gif"),
            alt: "[爱心]",
            alias: "92.gif"
          },
          {
            url: require("../../common/image/emoji/192.gif"),
            alt: "[蹦哒]",
            alias: "93.gif"
          },
          {
            url: require("../../common/image/emoji/193.gif"),
            alt: "[颤抖]",
            alias: "94.gif"
          },
          {
            url: require("../../common/image/emoji/194.gif"),
            alt: "[怄气]",
            alias: "95.gif"
          },
          {
            url: require("../../common/image/emoji/195.gif"),
            alt: "[跳舞]",
            alias: "96.gif"
          }
        ],
        [
          {
            url: require("../../common/image/emoji/196.gif"),
            alt: "[发呆]",
            alias: "97.gif"
          },
          {
            url: require("../../common/image/emoji/197.gif"),
            alt: "[背着]",
            alias: "98.gif"
          },
          {
            url: require("../../common/image/emoji/198.gif"),
            alt: "[伸手]",
            alias: "99.gif"
          },
          {
            url: require("../../common/image/emoji/199.gif"),
            alt: "[耍帅]",
            alias: "100.gif"
          },
          {
            url: require("../../common/image/emoji/200.png"),
            alt: "[微笑]",
            alias: "101.png"
          },
          {
            url: require("../../common/image/emoji/201.png"),
            alt: "[生病]",
            alias: "102.png"
          },
          {
            url: require("../../common/image/emoji/202.png"),
            alt: "[哭泣]",
            alias: "103.png"
          },
          {
            url: require("../../common/image/emoji/203.png"),
            alt: "[吐舌]",
            alias: "104.png"
          },
          {
            url: require("../../common/image/emoji/204.png"),
            alt: "[迷糊]",
            alias: "105.png"
          },
          {
            url: require("../../common/image/emoji/205.png"),
            alt: "[瞪眼]",
            alias: "106.png"
          },
          {
            url: require("../../common/image/emoji/206.png"),
            alt: "[恐怖]",
            alias: "107.png"
          },
          {
            url: require("../../common/image/emoji/207.png"),
            alt: "[忧愁]",
            alias: "108.png"
          },
          {
            url: require("../../common/image/emoji/208.png"),
            alt: "[眨眉]",
            alias: "109.png"
          },
          {
            url: require("../../common/image/emoji/209.png"),
            alt: "[闭眼]",
            alias: "110.png"
          },
          {
            url: require("../../common/image/emoji/210.png"),
            alt: "[鄙视]",
            alias: "111.png"
          },
          {
            url: require("../../common/image/emoji/211.png"),
            alt: "[阴暗]",
            alias: "112.png"
          },
          {
            url: require("../../common/image/emoji/212.png"),
            alt: "[小鬼]",
            alias: "113.png"
          },
          {
            url: require("../../common/image/emoji/213.png"),
            alt: "[礼物]",
            alias: "114.png"
          },
          {
            url: require("../../common/image/emoji/214.png"),
            alt: "[拜佛]",
            alias: "115.png"
          },
          {
            url: require("../../common/image/emoji/215.png"),
            alt: "[力量]",
            alias: "116.png"
          },
          {
            url: require("../../common/image/emoji/216.png"),
            alt: "[金钱]",
            alias: "117.png"
          },
          {
            url: require("../../common/image/emoji/217.png"),
            alt: "[蛋糕]",
            alias: "118.png"
          },
          {
            url: require("../../common/image/emoji/218.png"),
            alt: "[彩带]",
            alias: "119.png"
          },
          {
            url: require("../../common/image/emoji/219.png"),
            alt: "[礼物]",
            alias: "120.png"
          }
        ]
      ],
      showEmji: "",
      isFocus: false,
      socket: null,
      goodsInfo: this.$route.query.goodsInfo,
      goodsuid: 3,
      kefuuid: 1,
      currentPage: 1,
      pageSize: 15,
      avatar: "",
      longPressDomShow: false
    };
  },
  beforeRouteLeave(to, from, next) {
    console.log("离开聊天界面");
    this.removeUnreadMessage();
    next();
  },
  created() {
    this._connect();
  },
  mounted() {},
  computed: {
    ...mapGetters({
      getSocket: "socket",
      getUserInfo: "userInfo"
    })
  },
  methods: {
    back() {
      this.$router.goBack();
    },
    //开始触摸
    gtouchstart(event) {
      this.timeOutEvent = setTimeout(() => {
        this.longPress(event);
      }, 600);
    },
    //手释放，如果在500毫秒内就释放，则取消长按事件，此时可以执行onclick应该执行的事件
    gtouchend(item) {
      clearTimeout(this.timeOutEvent); //清除定时器
      if (this.timeOutEvent != 0) {
        //这里写要执行的内容（尤如onclick事件）
      }
      return false;
    },
    //如果手指有移动，则取消所有事件，此时说明用户只是要移动而不是长按
    gtouchmove() {
      clearTimeout(this.timeOutEvent); //清除定时器
      this.timeOutEvent = 0;
    },

    //真正长按后应该执行的内容
    longPress(event) {
      this.timeOutEvent = 0;
      this.vibrate();
      console.log(event);
      let element = event.target;
      let offsetLeft = element.offsetLeft;
      let offsetTop = element.offsetTop;
      //let offTop = element
      //执行长按要执行的内容，如弹出菜单
      //$api.css($api.dom(".Popup"), "display:block");
    },
    //设备震动
    vibrate() {
      window.plus && plus.device.vibrate(500);
    },
    //判断 是什么系统
    isAndroid_ios() {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //android终端或者uc浏览器
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      return isiOS == true ? true : false;
    },
    //图片加载时 重新计算 scroll 组件的高度
    imgLoad(inSending) {
      this.$refs.scroll.refresh();
      //console.log(inSending);
      //insending 是否是正在发送的消息
      if (inSending) {
        //console.log(inSending);
        this.scrollEnd();
      }
    },
    //聊天图片预览
    showPreviewImg(imgUrl) {
      let index = this.msgImgList.findIndex(item => {
        return item === imgUrl;
      });
      console.log(index);
      this.showPreview = true;
      this.startPosition = index;
    },
    //预览图 切换图片时 回调
    onChange(index) {
      this.index = index;
    },
    //当屏幕滚动时的回调函数
    onScroll(pos) {
      this.showEmji = "";
      //console.log(pos)
      /* if (this.isFocus) {
        this.inputFoucs();
      } */
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
      let formdata = new FormData();
      formdata.append("file", file.file, file.file.name);
      let msg = { url: file.content, w: 500, h: 500 };
      //对应刘莉老师的图片上床接口
      fileUpload(formdata)
        .then(res => {
          //处理 上传图片后的数据 然后 将消息发送
          console.log(res);
          msg.url = `http://218.193.110.247:9010${res.path}`;
          console.log(msg);
          this.sendMsg(msg, "img");
        })
        .catch(err => {
          console.log("err");
          let errStr = JSON.stringify(err);
          console.log(errStr);
          this.sendMsg(msg, "img");
        });
    },
    onSelect(item) {
      console.log(item);
      this.show = false;
      if (item.value === 1) {
        this.$nextTick(() => {
          this.galleryImg();
        });
      } else {
        this.$nextTick(() => {
          this.captureImage();
        });
      }
    },
    onCancel() {},
    //选图
    pickImg() {
      this.show = !this.show;
      console.log("xuan 图");
    },
    addFile() {},
    //让消息输入框聚焦
    inputFoucs() {
      //console.log('test')
      let tmp = this.$refs.inputBox.focus();
      if (this.isAndroid_ios()) {
        console.log("ios");
        let _this = this;
      } else {
        console.log("android");
      }
      this.isFocus = true;
      console.log("focus");
    },
    //让消息输入框失去焦点
    inputBlur() {
      window.scroll(0, 0);
      if (this.textMsg) {
        return;
      }
      this.isFocus = false;
      this.showEmji = "";
      console.log("bulr");
    },
    //滚动到底部
    scrollEnd() {
      console.log("滚动到底部");
      this.$refs.scroll.scrollEnd();
    },
    //点击输入框的表情触发回调函数
    chooseEmoji() {
      console.log("test");
      this.showEmji = this.showEmji == "showEmoji" ? "hideEmoji" : "showEmoji";
    },
    //添加表情
    addEmoji(em) {
      this.textMsg += em.alt;
    },
    //设置图片尺寸
    setPicSize(row) {
      let maxW = 175;
      let maxH = 175;
      if (row.msg.w > maxW || row.msg.h > maxH) {
        let scale = row.msg.w / row.msg.h;
        if (row.msg.w > row.msg.h) {
          row.msg.w = maxW;
          row.msg.h = row.msg.w / scale;
        } else {
          row.msg.h = maxH;
          row.msg.w = row.msg.h * scale;
        }
      }
      return row;
    },
    //接受消息(筛选处理)
    screenMsg(msg) {
      //console.log(msg);
      //处理 客户端
      switch (msg.type) {
        case "text":
          this.addTextMsg(msg);
          break;
        case "voice":
          this.addVoiceMsg(msg);
          break;
        case "img":
          this.addImgMsg(msg);
          break;
      }
      //滚动到底部
      this.$nextTick(() => {
        this.scrollEnd();
      });
    },
    //发送消息
    sendText() {
      if (!this.textMsg) {
        return;
      }

      //构造消息

      let content = this.replaceEmoji(this.textMsg);
      let msg = { content: content };
      this.sendMsg(msg, "text");
      this.textMsg = "";
      if (this.isFocus && this.isAndroid_ios()) {
        this.inputFoucs();
      }
    },
    //替换表情符号为图片 返回的是个dom 字符串
    replaceEmoji(str) {
      let replacedStr = str.replace(/\[([^(\]|\[)]*)\]/g, (item, index) => {
        console.log("item: " + item);
        for (let i = 0; i < this.emojiList.length; i++) {
          let row = this.emojiList[i];
          for (let j = 0; j < row.length; j++) {
            let EM = row[j];
            if (EM.alt == item) {
              console.log(EM.alt);
              //在线表情路径，图文混排必须使用网络路径
              //let onlinePath = "https://s2.ax1x.com/2019/04/12/";
              console.log(EM);
              /* let imgstr = `<img src="${EM.url}">`; */
              let imgstr = `<img src="http://218.193.110.247:9010/emoji/dist/img/qq/${EM.alias}">`;
              console.log("imgstr: " + imgstr);
              return imgstr;
            }
          }
        }
      });
      return '<div class="msg">' + replacedStr + "</div>";
    },
    // 发送消息
    sendMsg(content, type) {
      //实际应用中，此处应该提交长连接，模板仅做本地处理。
      switch (type) {
        case "text":
          console.log(content);
          let msgTxt = new ChatMsgServer({
            type: "private",
            avatar: this.getUserInfo.avatar,
            uid: "潮品客服",
            content: content.content,
            from_uid: this.getUserInfo.mobile,
            chat_type: "text"
          });
          this.getSocket.emit("message", msgTxt);
          break;
        case "img":
          let msgImg = new ChatMsgServer({
            type: "private",
            avatar: this.getUserInfo.avatar,
            uid: "潮品客服",
            content: content.url,
            from_uid: this.getUserInfo.mobile,
            chat_type: "image"
          });
          console.log(msgImg);
          this.getSocket.emit("message", msgImg);
          break;
      }
      var nowDate = new Date();
      /* let lastid = this.msgList[this.msgList.length - 1].id;
      lastid++; */
      let msg = new ChatMsg({
        id: 1,
        uid: 0,
        username: "大黑哥",
        face: this.getUserInfo.avatar,
        time:
          nowDate.getHours() + ":" + nowDate.getMinutes() + "".padStart(2, "0"),
        type: type,
        msg: content,
        InSending: true
      });
      console.log(msg);
      this.screenMsg(msg);
    },
    // 处理文字消息
    addTextMsg(msg) {
      this.msgList.push(msg);
    },
    // 处理语音消息
    addVoiceMsg(msg) {
      this.msgList.push(msg);
    },
    // 处理图片消息
    addImgMsg(msg) {
      msg = this.setPicSize(msg);
      this.msgImgList.push(msg.msg.url);
      this.msgList.push(msg);
    },
    //获取更多的聊天记录
    loadMoreMsg(finishPullDown) {
      this.currentPage++;
      let params = {
        uid: this.getUserInfo.mobile,
        page: this.currentPage,
        size: this.pageSize
      };
      getChatMsgList(params).then(res => {
        //console.log(res);
        finishPullDown && finishPullDown();
        if (res.code === 200) {
          let msglist = this.initMsg(res.data);
          msglist.forEach(msg => {
            this.msgList.unshift(msg);
          });
          console.log(msglist);
        }

        //this.msgList = this.initMsg(res.data);
      });
    },
    formatDate(time) {
      if (!time) {
        let date = new Date();
        if (this.isAndroid_ios()) {
          date.setHours(date.getHours() - 8);
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
      }
      let date = new Date(time);
      if (this.isAndroid_ios()) {
        date.setHours(date.getHours() - 8);
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    //根据服务器的消息类型判断是服务端数据还是自己的数据（恶心的代码都是我写 我很不服）
    fromUid(from_uid) {
      return from_uid === "潮品客服" ? 1 : 0;
    },
    //获取img都没 的src
    getImgSrc(arg) {
      let img = this.parseDom(arg);
      return img[0].attributes.src.value;
    },
    //将服务器来的消息转化为我所需要的消息结构
    formatMsg(msg, inSending) {
      let chatmsg = null;
      if (msg.chat_type === "image") {
        chatmsg = new ChatMsg({
          id: msg.id,
          uid: this.fromUid(msg.from_uid ? msg.from_uid : msg.uid),
          username: msg.from_uid ? msg.from_uid : msg.uid,
          face: msg.avatar,
          time: this.formatDate(msg.time),
          type: "img",
          msg: {
            url: msg.content,
            w: 175,
            h: 175
          },
          InSending: inSending
        });
        this.msgImgList.unshift(msg.content);
      } else {
        chatmsg = new ChatMsg({
          id: msg.id,
          uid: this.fromUid(msg.from_uid ? msg.from_uid : msg.uid),
          username: msg.from_uid ? msg.from_uid : msg.uid,
          face: msg.avatar,
          time: this.formatDate(msg.time),
          type: msg.chat_type,
          msg: {
            content: msg.content
          }
        });
      }
      return chatmsg;
    },
    //将dom字符串转dom结点
    parseDom(arg) {
      var objE = document.createElement("div");
      objE.innerHTML = arg;
      return objE.childNodes;
    },
    initMsg(data) {
      let msgList = [];
      data.forEach(msg => {
        msgList.push(this.formatMsg(msg));
      });
      return msgList;
    },
    _connect() {
      console.log("test");

      /* this.socket = require("socket.io-client")("http://218.193.110.247:9010", {
        transports: ["websocket", "polling"]
      });
      //客户端上线所需要的数据
      let msg = {
        uid: this.getUserInfo.mobile
        //头像
        //id
      };
      //客户端上线
      //this.socket.emit("login", msg);
      this.socket.on("connect", () => {
        this.socket.emit("login", msg);
      }); */
      //从vuex 获取socket
      /* 
        this.getSocket.on()
      */
      //服务端连接 处理服务端过来的数据
      this.getSocket.on("message", msg => {
        //console.log(msg);
        //msg 是老师传递过来的消息数据
        let msgServer = this.formatMsg(msg);
        console.log(msgServer);
        this.screenMsg(msgServer);
      });
      /*  this.getSocket.on("message", getServeMsg(this)); */
    },
    _getChatMsgList(successCallBack) {
      let params = {
        uid: this.getUserInfo.mobile,
        page: this.currentPage,
        size: this.pageSize
      };
      let paramsStr = JSON.stringify(params);
      console.log(paramsStr);
      getChatMsgList(params)
        .then(res => {
          //console.log(res);
          console.log("获取聊天记录结点");
          let str = JSON.stringify(res);
          let msglist = this.initMsg(res.data);
          msglist.forEach(msg => {
            this.msgList.unshift(msg);
          });
          this.$nextTick(() => {
            successCallBack && successCallBack();
          });
        })
        .catch(err => {
          console.log("出错啦");
        });
    },
    ...mapMutations({
      removeUnreadMessage: "REMOVE_UNREAD_MESSAGE"
    })
  },
  components: {
    NavBar,
    Scroll,
    GoodsItemSingle,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Icon.name]: Icon,
    [Button.name]: Button,
    [ActionSheet.name]: ActionSheet,
    [Uploader.name]: Uploader
  }
};
</script>
<style lang="stylus">
@import '~common/stylus/variable.styl';

@keyframes showEM {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-180px);
  }
}

@keyframes hideEM {
  0% {
    transform: translateY(-180px);
  }

  100% {
    transform: translateY(0);
  }
}

.chat {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  background: $color-background;

  .content {
    position: fixed;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 50px;
    background: $color-background-w;
    overflow-y: scroll;
    padding: 0 8px;

    .msg-list {
      width: 100%;

      .row {
        &:first-child {
          margin-top: 10px;
        }

        padding: 10px 0;

        .my .left, .other .right {
          width: 100%;
          display: flex;

          .bubble {
            max-width: 70%;
            min-height: 25px;
            border-radius: 5px;
            padding: 8px 10px;
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 800;
            word-break: break-all;

            .msg {
              img {
                height: 24px;
                width: 24px;
                vertical-align: middle;
              }
            }

            &.img {
              background-color: transparent;
              padding: 0;
              overflow: hidden;
              object-fit: cover;
              max-width: 175px;
              max-height: 175px;

              img {
                width: 100%;
              }
            }
          }
        }

        .my .right, .other .left {
          flex-shrink: 0;
          width: 40px;
          height: 40px;

          img {
            width: 40px;
            height: 40px;
            border-radius: 5px;
          }
        }

        .my {
          width: 100%;
          display: flex;
          justify-content: flex-end;

          .left {
            min-height: 40px;
            align-items: center;
            justify-content: flex-end;

            .bubble {
              background-color: #12B7F5;
              color: #fff;
            }
          }

          .right {
            margin-left: 8px;
          }
        }

        .other {
          width: 100%;
          display: flex;

          .left {
            margin-right: 8px;
          }

          .right {
            flex-wrap: wrap;

            .username {
              width: 100%;
              height: 23px;
              font-size: 12px;
              display: flex;

              .name {
                margin-right: 25px;
              }
            }

            .bubble {
              background-color: #E5E5E5;
              color: #333;
            }
          }
        }
      }
    }
  }

  .emoji-box {
    position: fixed;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 20;
    height: 180px;
    background: $color-background;

    &.hideEmoji {
      animation: hideEM 0.15s linear both;
    }

    &.showEmoji {
      animation: showEM 0.15s linear both;
    }

    .van-swipe {
      height: 100%;
      width: 100%;

      .van-swipe-item {
        display: flex;
        flex-wrap: wrap;

        .emoji {
          width: 45px;
          height: 45px;
          display: flex;
          justify-content: center;

          img {
            width: 60%;
            height: 60%;
          }
        }
      }
    }
  }

  .input-box {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    display: flex;
    align-items: center;
    background: $color-background;

    &.hideEmoji {
      animation: hideEM 0.15s linear both;
    }

    &.showEmoji {
      animation: showEM 0.15s linear both;
    }

    .more {
      flex: 0 0 50px;
      height: 50px;
      text-align: center;

      .van-icon-photo-o {
        line-height: 50px;
        font-size: 30px;
      }
    }

    .textbox {
      display: flex;
      flex: 1;
      background-color: #fff;
      border-radius: 20px;
      align-self: center;
      align-items: center;

      .box {
        width: 100%;
        padding-left: 15px;
        display: flex;
        align-items: center;
        height: 32px;

        textarea {
          width: 100%;
          height: 16px;
          flex: 1;
          border: none;
          font-size: 16px;
        }
      }

      .em {
        flex: 0 0 30px;
        height: 30px;
        align-items: center;

        .van-icon-smile-o {
          font-size: 30px;
        }
      }
    }

    .send {
      flex: 0 0 50px;
      padding-left: 10px;

      .btn {
        width: 45px;
        height: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(to right, #f09b37, #eb632c);
        color: #fff;
        border-radius: 3px;
        font-size: 12px;
      }
    }
  }
}
</style>
