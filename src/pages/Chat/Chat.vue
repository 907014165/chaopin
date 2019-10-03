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
        @scroll="onScroll"
      >
        <div class="msg-list" ref="msgList" @click="inputBlur">
          <div class="row" v-for="(row,index) in msgList" :key="index" :id="'msg'+row.id">
            <div class="my" v-if="row.uid==myuid">
              <div class="left">
                <div class="bubble" v-if="row.type=='text'">
                  <div v-html="row.msg.content"></div>
                </div>
                <div class="bubble img" v-if="row.type=='img'">
                  <img
                    :src="row.msg.url"
                    @click="showPreviewImg(row.msg.url)"
                    alt
                    :style="{'width': row.msg.w+'px','height': row.msg.h+'px'}"
                  >
                </div>
              </div>
              <div class="right">
                <img src="./face.jpg" alt>
              </div>
            </div>
            <div class="other" v-if="row.uid!=myuid">
              <div class="left">
                <img src="./logo.png" alt>
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
                    alt
                    :style="{'width': row.msg.w+'px','height': row.msg.h+'px'}"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </scroll>
      <div class="input-box van-hairline--bottom" :class="showEmji">
        <div class="more" @click="pickImg">
          <van-icon name="photo-o"/>
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
            <van-icon name="smile-o"/>
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
              <img :src="em.url" alt>
            </div>
          </van-swipe-item>
        </van-swipe>
      </div>
      <van-action-sheet
        v-model="show"
        :actions="actions"
        cancel-text="取消"
        @select="onSelect"
        @cancel="onCancel"
      />
      <van-image-preview v-model="showPreview" :images="msgImgList" @change="onChange" :start-position="startPosition"></van-image-preview>
    </div>
  </transition>
</template>
<script>
import Vue from 'vue'
import NavBar from "base/NavBar/NavBar";
import Scroll from "base/Scroll/Scroll";
import {
  Swipe,
  SwipeItem,
  Icon,
  Button,
  ActionSheet,
  Uploader,
  ImagePreview
} from "vant";
Vue.use(ImagePreview)
export default {
  name: "chat",
  data() {
    return {
      show: false,
      showPreview:false,
      startPosition:0,
      imgSrc: "",
      actions: [{ name: "从相册中选取", value: 1 }, { name: "拍照", value: 2 }],
      publicPath: process.env.BASE_URL,
      textMsg: "",
      msgList: [],
      msgImgList: [],
      myuid: 0,
      emojiList: [
        [
          { url: require("../../common/image/emoji/100.gif"), alt: "[微笑]" },
          { url: require("../../common/image/emoji/101.gif"), alt: "[伤心]" },
          { url: require("../../common/image/emoji/102.gif"), alt: "[美女]" },
          { url: require("../../common/image/emoji/103.gif"), alt: "[发呆]" },
          { url: require("../../common/image/emoji/104.gif"), alt: "[墨镜]" },
          { url: require("../../common/image/emoji/105.gif"), alt: "[哭]" },
          { url: require("../../common/image/emoji/106.gif"), alt: "[羞]" },
          { url: require("../../common/image/emoji/107.gif"), alt: "[哑]" },
          { url: require("../../common/image/emoji/108.gif"), alt: "[睡]" },
          { url: require("../../common/image/emoji/109.gif"), alt: "[哭]" },
          { url: require("../../common/image/emoji/110.gif"), alt: "[囧]" },
          { url: require("../../common/image/emoji/111.gif"), alt: "[怒]" },
          { url: require("../../common/image/emoji/112.gif"), alt: "[调皮]" },
          { url: require("../../common/image/emoji/113.gif"), alt: "[笑]" },
          { url: require("../../common/image/emoji/114.gif"), alt: "[惊讶]" },
          { url: require("../../common/image/emoji/115.gif"), alt: "[难过]" },
          { url: require("../../common/image/emoji/116.gif"), alt: "[酷]" },
          { url: require("../../common/image/emoji/117.gif"), alt: "[汗]" },
          { url: require("../../common/image/emoji/118.gif"), alt: "[抓狂]" },
          { url: require("../../common/image/emoji/119.gif"), alt: "[吐]" },
          { url: require("../../common/image/emoji/120.gif"), alt: "[笑]" },
          { url: require("../../common/image/emoji/121.gif"), alt: "[快乐]" },
          { url: require("../../common/image/emoji/122.gif"), alt: "[奇]" },
          { url: require("../../common/image/emoji/123.gif"), alt: "[傲]" }
        ],
        [
          { url: require("../../common/image/emoji/124.gif"), alt: "[饿]" },
          { url: require("../../common/image/emoji/125.gif"), alt: "[累]" },
          { url: require("../../common/image/emoji/126.gif"), alt: "[吓]" },
          { url: require("../../common/image/emoji/127.gif"), alt: "[汗]" },
          { url: require("../../common/image/emoji/128.gif"), alt: "[高兴]" },
          { url: require("../../common/image/emoji/129.gif"), alt: "[闲]" },
          { url: require("../../common/image/emoji/130.gif"), alt: "[努力]" },
          { url: require("../../common/image/emoji/131.gif"), alt: "[骂]" },
          { url: require("../../common/image/emoji/132.gif"), alt: "[疑问]" },
          { url: require("../../common/image/emoji/133.gif"), alt: "[秘密]" },
          { url: require("../../common/image/emoji/134.gif"), alt: "[乱]" },
          { url: require("../../common/image/emoji/135.gif"), alt: "[疯]" },
          { url: require("../../common/image/emoji/136.gif"), alt: "[哀]" },
          { url: require("../../common/image/emoji/137.gif"), alt: "[鬼]" },
          { url: require("../../common/image/emoji/138.gif"), alt: "[打击]" },
          { url: require("../../common/image/emoji/139.gif"), alt: "[bye]" },
          { url: require("../../common/image/emoji/140.gif"), alt: "[汗]" },
          { url: require("../../common/image/emoji/141.gif"), alt: "[抠]" },
          { url: require("../../common/image/emoji/142.gif"), alt: "[鼓掌]" },
          { url: require("../../common/image/emoji/143.gif"), alt: "[糟糕]" },
          { url: require("../../common/image/emoji/144.gif"), alt: "[恶搞]" },
          { url: require("../../common/image/emoji/145.gif"), alt: "[什么]" },
          { url: require("../../common/image/emoji/146.gif"), alt: "[什么]" },
          { url: require("../../common/image/emoji/147.gif"), alt: "[累]" }
        ],
        [
          { url: require("../../common/image/emoji/148.gif"), alt: "[看]" },
          { url: require("../../common/image/emoji/149.gif"), alt: "[难过]" },
          { url: require("../../common/image/emoji/150.gif"), alt: "[难过]" },
          { url: require("../../common/image/emoji/151.gif"), alt: "[坏]" },
          { url: require("../../common/image/emoji/152.gif"), alt: "[亲]" },
          { url: require("../../common/image/emoji/153.gif"), alt: "[吓]" },
          { url: require("../../common/image/emoji/154.gif"), alt: "[可怜]" },
          { url: require("../../common/image/emoji/155.gif"), alt: "[刀]" },
          { url: require("../../common/image/emoji/156.gif"), alt: "[水果]" },
          { url: require("../../common/image/emoji/157.gif"), alt: "[酒]" },
          { url: require("../../common/image/emoji/158.gif"), alt: "[篮球]" },
          { url: require("../../common/image/emoji/159.gif"), alt: "[乒乓]" },
          { url: require("../../common/image/emoji/160.gif"), alt: "[咖啡]" },
          { url: require("../../common/image/emoji/161.gif"), alt: "[美食]" },
          { url: require("../../common/image/emoji/162.gif"), alt: "[动物]" },
          { url: require("../../common/image/emoji/163.gif"), alt: "[鲜花]" },
          { url: require("../../common/image/emoji/164.gif"), alt: "[枯]" },
          { url: require("../../common/image/emoji/165.gif"), alt: "[唇]" },
          { url: require("../../common/image/emoji/166.gif"), alt: "[爱]" },
          { url: require("../../common/image/emoji/167.gif"), alt: "[分手]" },
          { url: require("../../common/image/emoji/168.gif"), alt: "[生日]" },
          { url: require("../../common/image/emoji/169.gif"), alt: "[电]" },
          { url: require("../../common/image/emoji/170.gif"), alt: "[炸弹]" },
          { url: require("../../common/image/emoji/171.gif"), alt: "[刀子]" }
        ],
        [
          { url: require("../../common/image/emoji/172.gif"), alt: "[足球]" },
          { url: require("../../common/image/emoji/173.gif"), alt: "[瓢虫]" },
          { url: require("../../common/image/emoji/174.gif"), alt: "[翔]" },
          { url: require("../../common/image/emoji/175.gif"), alt: "[月亮]" },
          { url: require("../../common/image/emoji/176.gif"), alt: "[太阳]" },
          { url: require("../../common/image/emoji/177.gif"), alt: "[礼物]" },
          { url: require("../../common/image/emoji/178.gif"), alt: "[抱抱]" },
          { url: require("../../common/image/emoji/179.gif"), alt: "[拇指]" },
          { url: require("../../common/image/emoji/180.gif"), alt: "[贬低]" },
          { url: require("../../common/image/emoji/181.gif"), alt: "[握手]" },
          { url: require("../../common/image/emoji/182.gif"), alt: "[剪刀手]" },
          { url: require("../../common/image/emoji/183.gif"), alt: "[抱拳]" },
          { url: require("../../common/image/emoji/184.gif"), alt: "[勾引]" },
          { url: require("../../common/image/emoji/185.gif"), alt: "[拳头]" },
          { url: require("../../common/image/emoji/186.gif"), alt: "[小拇指]" },
          { url: require("../../common/image/emoji/187.gif"), alt: "[拇指八]" },
          { url: require("../../common/image/emoji/188.gif"), alt: "[食指]" },
          { url: require("../../common/image/emoji/189.gif"), alt: "[ok]" },
          { url: require("../../common/image/emoji/190.gif"), alt: "[情侣]" },
          { url: require("../../common/image/emoji/191.gif"), alt: "[爱心]" },
          { url: require("../../common/image/emoji/192.gif"), alt: "[蹦哒]" },
          { url: require("../../common/image/emoji/193.gif"), alt: "[颤抖]" },
          { url: require("../../common/image/emoji/194.gif"), alt: "[怄气]" },
          { url: require("../../common/image/emoji/195.gif"), alt: "[跳舞]" }
        ],
        [
          { url: require("../../common/image/emoji/196.gif"), alt: "[发呆]" },
          { url: require("../../common/image/emoji/197.gif"), alt: "[背着]" },
          { url: require("../../common/image/emoji/198.gif"), alt: "[伸手]" },
          { url: require("../../common/image/emoji/199.gif"), alt: "[耍帅]" },
          { url: require("../../common/image/emoji/200.png"), alt: "[微笑]" },
          { url: require("../../common/image/emoji/201.png"), alt: "[生病]" },
          { url: require("../../common/image/emoji/202.png"), alt: "[哭泣]" },
          { url: require("../../common/image/emoji/203.png"), alt: "[吐舌]" },
          { url: require("../../common/image/emoji/204.png"), alt: "[迷糊]" },
          { url: require("../../common/image/emoji/205.png"), alt: "[瞪眼]" },
          { url: require("../../common/image/emoji/206.png"), alt: "[恐怖]" },
          { url: require("../../common/image/emoji/207.png"), alt: "[忧愁]" },
          { url: require("../../common/image/emoji/208.png"), alt: "[眨眉]" },
          { url: require("../../common/image/emoji/209.png"), alt: "[闭眼]" },
          { url: require("../../common/image/emoji/210.png"), alt: "[鄙视]" },
          { url: require("../../common/image/emoji/211.png"), alt: "[阴暗]" },
          { url: require("../../common/image/emoji/212.png"), alt: "[小鬼]" },
          { url: require("../../common/image/emoji/213.png"), alt: "[礼物]" },
          { url: require("../../common/image/emoji/214.png"), alt: "[拜佛]" },
          { url: require("../../common/image/emoji/215.png"), alt: "[力量]" },
          { url: require("../../common/image/emoji/216.png"), alt: "[金钱]" },
          { url: require("../../common/image/emoji/217.png"), alt: "[蛋糕]" },
          { url: require("../../common/image/emoji/218.png"), alt: "[彩带]" },
          { url: require("../../common/image/emoji/219.png"), alt: "[礼物]" }
        ]
      ],
      showEmji: "",
      isFocus: false,
      socket: null,
    };
  },
  created() {
    this.getMsgList()
    this._connect()
  },
  methods: {
    back() {
      this.$router.back();
    },
    showPreviewImg(imgUrl){
      let index = this.msgImgList.findIndex((item)=>{
        return item === imgUrl
      })
      console.log(index)
      this.showPreview = true
      this.startPosition = index
    },
    //预览图 切换图片时 回调
    onChange(index) {
      this.index = index;
    },
    //当屏幕滚动时的回调函数
    onScroll(pos) {
      this.showEmji = ""
      //console.log(pos)
      /* if (this.isFocus) {
        this.inputFoucs();
      } */
    },
    //相机拍照
    captureImage() {
      let _this = this;
      var cmr = plus.camera.getCamera();
      cmr.captureImage(
        function(p) {
          plus.zip.compressImage(
            {
              src: p,
              dst: `_doc/${_this.getUuid()}.jpg`,
              width: "50%",
              quality: 50,
              overwrite: true
            },
            function(event) {
              console.log("压缩成功");
              console.log(event.target);
              console.log(event.height);
              console.log(event.width);
              //此处应该
              let msg = { url: event.target, w: event.width, h: event.height };
              _this.sendMsg(msg, "img");
            },
            function(error) {
              console.log("压缩失败");
            }
          );
        },
        function(err) {}
      );
    },
    //相册中选取
    galleryImg() {
      let _this = this;
      plus.gallery.pick(
        function(p) {
          plus.zip.compressImage(
            {
              src: p,
              dst: `_doc/${_this.getUuid()}.jpg`,
              width: "50%",
              quality: 50,
              overwrite: true
            },
            function(event) {
              console.log("压缩成功");
              console.log(event.target);
              console.log(event.height);
              console.log(event.width);
              let msg = { url: event.target, w: event.width, h: event.height };
              _this.sendMsg(msg, "img");
            },
            function(error) {
              console.log("压缩失败");
            }
          );
        },
        function(err) {},
        null
      );
    },
    //垃圾UUID
    getUuid() {
      let myDate = new Date();
      return myDate.getTime();
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
    },
    //让消息输入框聚焦
    inputFoucs() {
      //console.log('test')
      let tmp = this.$refs.inputBox.focus();
      this.isFocus = true;
      //console.log(tmp)
    },
    //让消息输入框失去焦点
    inputBlur() {
      if (this.textMsg) {
        return;
      }
      this.isFocus = false;
      this.showEmji = ""
    },
    //滚动到底部
    scrollEnd() {
      let clientHeight = this.$refs.msgList.clientHeight;
      this.$refs.scroll.scrollTo(0, -clientHeight, 1000);
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
      //从长连接处转发给这个方法，进行筛选处理
      console.log(msg)
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
      this.$nextTick(function() {
        this.scrollEnd();
        //this.$refs.scroll.scrollTo(0, -clientHeight, 1000);
        //console.log(clientHeight)
      });
    },
    //发送消息
    sendText() {
      if (!this.textMsg) {
        return;
      }
      //构造消息
      let msg11 = {
        "type":"private",
        "uid":'chat-kefu-admin',
        "content":this.textMsg,
        "from_uid":"251525",
        "chat_type":"text"
      }
      this.socket.emit("message",msg11)
      let content = this.replaceEmoji(this.textMsg);
      let msg = { content: content };
      this.sendMsg(msg, "text");
      this.textMsg = "";
      if (this.isFocus) {
        this.inputFoucs();
      }
    },
    //替换表情符号为图片
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
              //let imgstr = `<img src="${EM.url}">`;
              let imgstr = `<img src="http://192.168.1.50:9010/emoji/dist/img/qq/39.gif">`;
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
      if (type === "img") {
        if (content.width == 0 || content.height == 0) {
          let img = document.createElement("img");
          img.src = tmpPath;
          content.w = img.width;
          content.h = img.height;
        }
      }
      var nowDate = new Date();
      let lastid = this.msgList[this.msgList.length - 1].id;
      lastid++;
      let msg = {
        id: lastid,
        uid: 0,
        username: "大黑哥",
        face: "/static/img/face.jpg",
        time:
          nowDate.getHours() + ":" + nowDate.getMinutes() + "".padStart(2, "0"),
        type: type,
        msg: content
      };
      this.screenMsg(msg);
      // 定时器模拟对方回复,三秒
      setTimeout(() => {
        lastid = this.msgList[this.msgList.length - 1].id;
        lastid++;
        msg = {
          id: lastid,
          uid: 1,
          username: "售后客服008",
          face: "/static/img/im/face/face_2.jpg",
          time: nowDate.getHours() + ":" + nowDate.getMinutes(),
          type: type,
          msg: content
        };
        this.screenMsg(msg);
      }, 3000);
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
    //获取聊天记录
    getMsgList(){
      let list = [
        {
          id: 0,
          uid: 0,
          username: "大黑哥",
          face: "./logo.png",
          time: "12:56",
          type: "text",
          msg: { content: "为什么bug这么多？" }
        },
        {
          id: 4,
          uid: 0,
          username: "大黑哥",
          face: "/static/img/face.jpg",
          time: "13:05",
          type: "img",
          msg: { url: require("../../common/image/test1.png"), w: 200, h: 200 }
        },
        {
          id: 4,
          uid: 1,
          username: "大黑哥",
          face: "/static/img/face.jpg",
          time: "13:05",
          type: "img",
          msg: { url: require("../../common/image/test1.png"), w: 200, h: 200 }
        },
        {
          id: 1,
          uid: 1,
          username: "售后客服008",
          face: "./logo.png",
          time: "12:57",
          type: "text",
          msg: {
            content: "这个bug呢，程序员写几个bug那是正常的"
          }
        },
        {
          id: 0,
          uid: 0,
          username: "大黑哥",
          face: "./logo.png",
          time: "12:56",
          type: "text",
          msg: { content: "影响我正常使用啊" }
        },
        {
          id: 1,
          uid: 1,
          username: "售后客服008",
          face: "./logo.png",
          time: "12:57",
          type: "text",
          msg: {
            content: "亲这个呢，你先别急，我杀个程序员祭天就好了"
          }
        },
        {
          id: 0,
          uid: 0,
          username: "大黑哥",
          face: "./logo.png",
          time: "12:56",
          type: "text",
          msg: { content: "要不要多杀两个？" }
        },
        {
          id: 1,
          uid: 1,
          username: "售后客服008",
          face: "./logo.png",
          time: "12:57",
          type: "text",
          msg: {
            content: "不可以前端就只有两个。。。"
          }
        },
        {
          id: 0,
          uid: 0,
          username: "大黑哥",
          face: "./logo.png",
          time: "12:56",
          type: "text",
          msg: { content: "这样" }
        },
        {
          id: 1,
          uid: 1,
          username: "售后客服008",
          face: "./logo.png",
          time: "12:57",
          type: "text",
          msg: {
            content: "好吧！我编不下去了"
          }
        },
        {
          id: 0,
          uid: 0,
          username: "大黑哥",
          face: "./logo.png",
          time: "12:56",
          type: "text",
          msg: { content: "占位！！！" }
        },
        {
          id: 1,
          uid: 1,
          username: "售后客服008",
          face: "./logo.png",
          time: "12:57",
          type: "text",
          msg: {
            content: "占位！！！"
          }
        }
      ];
      this.msgList = list;
      for(let i=0;i<list.length;i++){
        if(list[i].type=='img'){
						list[i] = this.setPicSize(list[i]);
						//console.log("list[i]: " + JSON.stringify(list[i]));
						this.msgImgList.push(list[i].msg.url);
				}
      }
    },
    _connect(){
      console.log('test')

      this.socket = require("socket.io-client")('http://172.30.203.227:9010',{
        "transports":['websocket', 'polling']
      });
      let msg = {
        "uid":'251525',
      }
      //客户端上线
      this.socket.emit('login',msg)

      //服务端连接
      this.socket.on('message',msg => {
        console.log(msg)
        let msg1 = {
          id: 6,
          uid: 1,
          username: "大黑哥",
          face: "/static/img/face.jpg",
          time:'',
          type: msg.chat_type,
          msg: {
            content:msg.content
          }
        }
        this.screenMsg(msg1)
      })
    }
  },
  components: {
    NavBar,
    Scroll,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Icon.name]: Icon,
    [Button.name]: Button,
    [ActionSheet.name]: ActionSheet,
    [Uploader.name]: Uploader,
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
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 50px;
    background: $color-background-w;
    overflow: hidden;
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
              max-width: 175px;
              max-height: 175px;
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
      height: 35px;
      align-self: center;
      align-items: center;
      overflow: hidden;

      .box {
        width: 100%;
        padding-left: 15px;
        height: 35px;
        display: flex;
        align-items: center;

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
