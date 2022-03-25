<template>
  <div class="sendForm">
    <!-- 工具栏 -->
    <div class="toolBar">
      <span>
        <el-popover
          placement="top"
          width="380"
          trigger="click"
          popper-class="emojiPopover"
        >
          <div class="emojiList">
            <a
              href="javascript:void(0);"
              v-for="(it, key, index) in Emojis"
              :key="'emoji' + index"
              @click="selectEmoji(key)"
            >
              {{ it }}
            </a>
            <!-- <a  href=""></a> -->
          </div>

          <div class="emojiType">
            <i @click="changeEmojiType('face')" :class="{ onSelect: emojiType == 'face' }">😀</i>
            <i @click="changeEmojiType('people')" :class="{ onSelect: emojiType == 'people' }">👩</i>
            <i @click="changeEmojiType('foods')" :class="{ onSelect: emojiType == 'foods' }">🍔</i>
            <i @click="changeEmojiType('animal')" :class="{ onSelect: emojiType == 'animal' }">🐜</i>
          </div>

          <i slot="reference" class="bi bi-emoji-laughing"></i>
        </el-popover>
      </span>
      <span><i class="bi bi-folder2"></i></span>
      <span><i class="bi bi-image"></i></span>
    </div>

    <!-- 输入框 -->
    <div class="inputBox">
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="content"
        maxlength="150"
        :show-word-limit="content.length > 0"
        resize="none"
        @keyup.ctrl.18.native="sendTextMessage"
      >
      </el-input>
    </div>

    <!-- 底部工具 -->
    <div class="footBar">
      <span class="sendTip">按 Ctrl + Alt 发送 </span>
      <button @click="sendTextMessage" class="sendBtn" type="button">发送(S)</button>
    </div>
  </div>
</template>
<script>
import faceEmojis from '../utils/emoji/faceEmojis'
import peopleEmoji from '../utils/emoji/PeopleEmojis'
import animalEmoji from '../utils/emoji/animalEmojis'
import foodEmoji from '../utils/emoji/foodEmojis'
import TimeUtils from '@/utils/TimeUtils'
export default {
  name: 'sendForm',
  data() {
    return {
      content: '',
      Emojis: faceEmojis,
      emojiType: 'face'

    }
  },
  methods: {
    changeEmojiType(type) {
      switch (type) {
        case 'face': 
          this.Emojis = faceEmojis   
          this.emojiType = 'face'       
          break;
        case 'people': 
          this.Emojis = peopleEmoji
          this.emojiType = 'people' 
          break;  
        case 'animal': 
          this.Emojis = animalEmoji
          this.emojiType = 'animal' 
          break;
        case 'foods': 
          this.Emojis = foodEmoji
          this.emojiType = 'foods' 
          break;  
        default: 
          this.Emojis = faceEmojis
          this.emojiType = 'face' 
          break;
      }
    },
    selectEmoji(value) {
      // console.log(this.Emojis[value])
      // this.content += this.Emojis[value]
      var textArea = document.querySelector('.inputBox textarea');
      //将选中的表情插入到输入文本的光标之后
      function changeSelectedText(obj, str) {
        if (window.getSelection) {
          // 非IE浏览器
          textArea.setRangeText(str);
          // 在未选中文本的情况下，重新设置光标位置
          textArea.selectionStart += str.length;
          textArea.focus()
        } else if (document.selection) {
          // IE浏览器
          obj.focus();
          var sel = document.selection.createRange();
          sel.text = str;
        }
      }
      changeSelectedText(textArea, this.Emojis[value]);
      this.content = textArea.value;// 要同步data中的数据
      return;
    },

    sendTextMessage(){
      if(this.content.trim() == ''){
        return
      }
      let currentCheat = this.currentCheatObj   
      let mess = this.myutils.deepClone(this.$store.state['message'].defaultMess)
      mess.content = this.content.trim()
      mess.to = currentCheat.uuid
      mess.from = this.currentUserUUid
      mess.msgType = 'personal'
     // mess.time = TimeUtils.dateForMat("yyyy-MM-dd hh:mm:ss.S",new Date())
      let msgData = { "user": currentCheat, "message": mess }
      // this.Api.postRequest('').then(res => {
      //   if(res.data.success){
      //     //发送成功，更新本地信息

      //   }
      // });

      this.$store.state['stompSocket'].stomp.send("/socket/sendMessage",{},JSON.stringify(mess))
      //测试方法
     // this.$store.commit('message/pushOneMessageByUUID',msgData)
      this.content = ''

    },
    

  },
  computed: {
    currentCheatObj(){
       return this.$store.state['common'].currentCheatObj
    },
    currentUserUUid() {
      return this.$store.state['common'].currentUser.user.uuid
    },
    messageForm(){
      return {"uuid": this.currentCheatObj().uuid, 
                      "message": {"from":this.currentUserUUid(), "to": this.currentCheatObj().uuid,}
                      }

    }
  },
  created() {
   
  },
}
</script>

<style scoped>
p,
div,
span,
input,
textarea,
i,
a {
  padding: 0;
  margin: 0;
}
.sendForm {
  height: 100%;
  background: rgb(255, 255, 255);
  /* border-bottom: solid 1px rgb(217,217,217); */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.toolBar {
  height: 30px;
  /* border: solid 1px black; */
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 3px 30px 0 30px;
}
.toolBar i {
  font-size: 18px;
  margin: 0 5px 0 5px;
  line-height: 1.5;
}
.toolBar i:hover {
  /* background: rgb(191, 235, 238); */
  /* 悬停时的鼠标样式 改成小手 */
  color: rgb(39, 168, 50);
  cursor: pointer;
}

.inputBox {
  height: 98%;
  /* border: solid 1px black; */
  margin: 0 25px 2px 30px;
}

.footBar {
  height: 30px;
  /* border: solid 1px black; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 30px 5px 30px;
}
.footBar .sendBtn {
  height: auto;
  font-size: 14px;
  color: rgb(129, 129, 129);
  border: solid 0.1px rgb(217, 217, 217);
  font-weight: 300;
  /* margin: 0 30px 0 0; */
}
.footBar .sendBtn:hover {
  background: rgb(18, 150, 17);
  color: rgb(255, 253, 253);
}
.sendTip {
  font-size: 12px;
  color: rgb(129, 129, 129);
  font-weight: 200;
}
</style>
<style>
.inputBox .el-textarea {
  height: 100%;
}
.inputBox .el-textarea .el-textarea__inner {
  overflow: hidden;
  height: 100%;
  padding: 0 !important;
  border: none;
  font-size: 16px !important;
  color: #000;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
.inputBox .el-textarea .el-input__count {
  right: 2px;
  bottom: -8px;
  background: none;
}
/* 将滚动调设置成悬停出现 */
.inputBox textarea:hover {
  overflow: overlay !important;
}
/* 滚动条样式 */
.inputBox textarea::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  /* display: none; */
}
.inputBox textarea::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: rgba(185, 183, 180, 0.6);
}
/*滚动条里面轨道*/
.inputBox textarea::-webkit-scrollbar-track {
  display: none;
}
.emojiPopover {
  padding: 0 !important;
  border-radius: 8px !important;
}
.emojiList {
  /* 改用grid布局 */
  display: grid;
  grid-template-columns: repeat(auto-fill, 46px);
  /* justify-content: space-around;
  flex-wrap: wrap; */
  width: auto;
  height: 300px;
  overflow: overlay;
  margin: 10px 4px 0 4px !important;
}

.emojiList a {
  font-size: 24px;
  width: auto;
  text-decoration: none;
  padding: 0 6px 5px 6px;
  width: 35px;
  height: 35px;
  text-align: center;
  vertical-align: middle;
}
.emojiType {
  height: 45px !important;
  border-top: solid rgb(237, 234, 232) 0.1ex;
  display: flex;
  justify-content: start;
  margin: 0 10px 0 10px !important;
}
.emojiType i {
  font-size: 24px;
  line-height: 1.2;
  text-align: center !important;
  border-radius: 5px;
  margin: 8px 4px 6px 4px !important;
  font-style: normal;
}
.onSelect {
  background-color: rgb(179, 233, 233);
}
/* 滚动条样式 */
.emojiList::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  /* display: none; */
}
.emojiList::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: rgba(185, 183, 180, 0.6);
}
/*滚动条里面轨道*/
.emojiList::-webkit-scrollbar-track {
  display: none;
}
</style>
