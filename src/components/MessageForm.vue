<template>
  <div class="messageForm">
    <!-- 为了触发compute属性切换用户，无显示意义 -->
    <span style="display: none">{{ currentTalkObj }}</span>

    <ul ref="MessageContainer" @scroll="handleScroll">
      <li
        v-show="
          currentScrollTop <= 1 ||
          this.currentScrollheight == this.ScrollclientHeight
        "
        class="showmore"
      >
        <el-button @click="showMoreMessage" type="text"
          >查看更多消息...</el-button
        >
      </li>

      <li
        v-for="(message, index) in messageData"
        :key="message._id"
        :ref="message._id"
      >
        <!-- 时间线，十分钟内不显示，一天内显示时分，超过两天显示昨天/前天 + 时分，三天以上显示年月日时分... -->
        <div style="text-align: center">
          <span
            v-show="message.showtime != null && message.showtime != false"
            class="time"
            >{{ formatTime(message.time) }}</span
          >
        </div>

        <!-- 用于计算未包含showtime属性的消息 -->
        <span
          v-if="message.showtime == null && showTheTime(index)"
          style="dispaly: none"
        ></span>
        <!-- 消息主体 -->
        <div
          class="messageli"
          :class="{
            messageli_self: message.from == currentUser.uuid,
          }"
        >
          <!-- 头像 -->
          <div class="presoninfo">
            <el-popover
              popper-class="photoPopover"
              placement="right-start"
              width="200"
              trigger="click"
            >
              <!-- 个人信息卡片 -->
              <personal-card
                :userinfo="getUserInfo(message.from)"
              ></personal-card>
              <el-image
                :src="getUserInfo(message.from).photourl"
                slot="reference"
              >
              </el-image>
            </el-popover>
          </div>
          <!-- 消息及姓名 -->
          <div class="message">
            <!-- 群聊时才显示名称,以及自身名称不显示 -->
            <p
              v-show="
                ($store.state['common'].messageFormType == 'group' &&
                  message.from != currentUser.uuid) ||
                message.from != currentUser.uuid
              "
              class="name"
              :class="{
                name_self: message.from == currentUser.uuid,
              }"
            >
              <span
                v-show="
                  getUserInfo(message.from).concatInfo == null ||
                  getUserInfo(message.from).concatInfo.remarks == null
                "
                >{{ getUserInfo(message.from).name }}</span
              >
              <span
                v-if="
                  getUserInfo(message.from).concatInfo != null &&
                  getUserInfo(message.from).concatInfo.remarks != null
                "
                >{{ getUserInfo(message.from).concatInfo.remarks }}</span
              >
            </p>
            <!-- 文本消息 -->
            <div
              v-if="message.contentType == 'text'"
              class="contentBox"
              :class="{
                contentBox_self: message.from == currentUser.uuid,
              }"
            >
              <!-- 消息 -->
              <p v-if="message.contentType == 'text'" class="TextContent">
                {{ message.content }}
              </p>
              <!-- 侧边小箭头 -->
              <div
                :class="{
                  container__arrow_rt: message.from == currentUser.uuid,
                  shelfColor: message.from == currentUser.uuid,
                  container__arrow_lt: message.from != currentUser.uuid,
                }"
                class="container__arrow"
              ></div>
            </div>

            <!-- 图片、文件消息 -->
            <div
              v-if="message.contentType == 'file' && message.fileDetail != null"
              :class="{ fileBox_shelf: message.from == currentUser.uuid }"
            >
              <div
                v-if="message.fileDetail.fileType == 'image'"
                class="ImageContent"
              >
                <el-image
                  :ref="'image' + message._id"
                  :src="message.fileDetail.fileUrl"
                  fit="scale-down"
                  :preview-src-list="[message.fileDetail.fileUrl]"
                  lazy
                  @error="ImageloadError($event,'image' + message._id)"
                  @load="ImageloadSuccess($event,'image' + message._id)"
                ></el-image>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>

import PersonalCard from '@/components/personalCard.vue'
import TimeUtils from '@/utils/TimeUtils'

export default {
  name: 'MessageForm',
  components: {
    PersonalCard
  },
  data() {
    return {
      currentScrollTop: 0,
      currentScrollheight: 0,
      ScrollclientHeight: 0,
      //保证只开启了一个定时器
      scrollTimeIsOpen: false,
      NeedScrool: false,
      //上一个显示的时间
      lastShowTime: '',
      changeTalk: true,
      //动态追加消息，
      messageListSize: 0,
      //每次追加消息的数量
      messageLimit: 20,
      //已尝试获取的图片url
      restImageList: []
    }
  },
  methods: {
    getUserInfo(uuid) {
      return this.$store.getters['common/getUserByuuid'](uuid)
    },
    //请求更多记录
    showMoreMessage() {
      //暂存当前ul总高度
      let scrollHeigh = this.currentScrollheight
      let firstmess = {"to":''}
      if (this.messageData != null) {
        firstmess = this.messageData[0]
      }
      //防止为空时好友id不存在
      this.$set(firstmess, "to", this.currentTalkObj.uuid)
      this.Api.postRequest('/message/getByPage', firstmess).then(res => {
        if (res.data.success) {
          let mess = res.data.data
          if (mess != null && mess.length > 0) {
            let msgData = { "user": this.currentTalkObj, "message": mess }
            this.$store.commit('message/pushMessageArryByUUIDOnTop', msgData)
          } else {
            this.$message({
              message: '没有更多消息了!',
              type: 'info'
            });
          }
          //this.MyscrollTo(this.currentScrollHeigh - scrollHeigh )        
        }
        this.$nextTick(() => {
          let ele = this.$refs['MessageContainer']
          let newHeigh = ele.scrollHeight
          if (!this.isNull(ele)) {
            // console.log(num)
            ele.scrollTo(0, newHeigh - scrollHeigh)
          }
        })
      })
    },

    formatTime(time) {
      return TimeUtils.formatForDetial(time)
    },
    //是否显示时间，与上个显示的时间差大于等于5分钟则显示
    showTheTime(index) {

      let isShow = this.messageData[index].showtime
      //已标记则直接返回
      if (isShow != null && isShow != 'undefined') {
        //记录当前显示时间
        if (this.messageData[index].showtime) {
          this.lastShowTime = this.messageData[index].time
        }
        return this.messageData[index].showtime
      }

      if (index == 0) {
        this.lastShowTime = this.messageData[0].time
        //设置显示时间标识
        this.$set(this.messageData[0], "showtime", true)
        return true
      }
      //防止刷新后 lastShowTime 消失
      if (this.lastShowTime == '' || this.lastShowTime == null) {
        //倒序遍历消息列表,取出倒数第一个设置为显示的时间
        let len = this.messageData.length
        for (let i = len - 1; i >= 0; i--) {
          if (this.messageData[i].showtime) {
            this.lastShowTime = this.messageData[i].time
            break
          }

        }
      }
      let suffix = this.messageData[index]
      let diff = TimeUtils.ComputeDiffMinutes(this.lastShowTime, suffix.time)
      if (diff >= 5) {
        this.lastShowTime = this.messageData[index].time
        this.$set(this.messageData[index], "showtime", true)
        return true
      } else {
        //与上一显示时间差不足5分钟则不显示
        this.$set(this.messageData[index], "showtime", false)
        return false
      }

    },

    //是否为NULL
    isNull(value) {
      if (value == null || typeof (value) == 'undefined' || value == undefined) {
        return true;
      }
      return false;
    },
    // 滚动条定位到底部
    scrollToBottom() {
      let ele = this.$refs['MessageContainer']
      let top = ele.scrollTop
      let height = ele.scrollHeight
      if (this.isNull(ele) || top == height) {
        return
      }
      if (!this.scrollTimeIsOpen) {
        let timer = setInterval(() => {
          this.$nextTick(() => {
            this.MyscrollTo(ele.scrollHeight + 2000)
            if (document.readyState === 'complete') {
              clearInterval(timer)
              this.changeTalk = false
            }
          })
        }, 90)
      } else {
        let ele = this.$refs['MessageContainer']
        this.MyscrollTo(ele.scrollHeight + 2000)
      }

      // console.log("aaa")

    },
    MyscrollTo(num) {
      this.$nextTick(() => {
        let ele = this.$refs['MessageContainer']
        if (!this.isNull(ele)) {
          // console.log(num)
          ele.scrollTo(0, num)
        }
      })
    },

    handleScroll() {
      let isNeedScrool = this.isNeedToScroll()
      //当前滑块高度小于15%时，设置列表大小，请求追加新数据
      let diff = this.currentScrollTop / this.currentScrollheight
      if (diff <= 0.15) {
        this.messageListSize = this.messageListSize + this.messageLimit
      }
      if (!this.scrollTimeIsOpen && isNeedScrool) {
        this.scrollTimeIsOpen = true
        //console.log("打开定时器")
        var scrollTimer = setInterval(() => {
          //console.log("定时器运行中")
          let isNeed = this.isNeedToScroll()
          if (isNeed) {
            this.scrollToBottom()
          } else {
            //不在底部时，关闭定时器
            clearInterval(scrollTimer)
            this.scrollTimeIsOpen = false
            //console.log("关闭定时器")
          }
        }, 400)
      }
    },
    isNeedToScroll() {
      let MessageContainer = this.$refs['MessageContainer']
      //防止页面未加载，找不到属性
      if (MessageContainer == null || MessageContainer == undefined) {
        return
      }
      //整个可滑动高度
      let height = MessageContainer.scrollHeight
      // 滑块顶部
      let top = MessageContainer.scrollTop
      //可视化区域
      let clientHeight = MessageContainer.clientHeight
      let count = top + clientHeight
      //暂存当前位置
      this.currentScrollTop = top
      this.currentScrollheight = height
      this.ScrollclientHeight = clientHeight
      if (clientHeight == height) {
        return false
      }
      if (count >= height - 40) {
        this.NeedScrool = true
        return true
      }
      this.NeedScrool = false
      return false
    },
    //设置置底状态标志为true，同时初始化消息列表数量
    changeTalkStatus() {
      this.scrollTimeIsOpen = false
      this.changeTalk = true
      this.messageListSize = 0
    },
    //图加载失败时,尝试重新获取几次
    ImageloadError(e,imgid) {
      //console.log(this.$refs[imgid])   
      if(this.imagIstryed(imgid)){
        return
      }
      let target = e.currentTarget
      let targetId = imgid
      this.restImageList.push(imgid)
      let times = 0
      let tryImage = setInterval(() => {
        //尝试5秒,通过refs时候或img标签的error状态
        if (times >= 10 || this.$refs[targetId][0].error == false) {
          clearInterval(tryImage)
          //清空控制台错误内容
          console.clear()
          return
        }
        target.src = target.src
        times++
      }, 500)
    },
    imagIstryed(imgid) {
      let res = false
      this.restImageList.forEach(element => {
          if(element == imgid){
            res = true
            return
          }
      });
      return res
    },
    ImageloadSuccess(e,imgid) {
      //console.log(this.$refs[imgid])
    }

  },
  computed: {
    messageData() {
      //数据变动时，判断是否需要滚动
      if (this.NeedScrool) {
        this.scrollToBottom()
      }
      return this.$store.getters['message/getMessagesByuuid'](this.$store.state['common'].currentCheatObj.uuid, this.messageListSize)
    },
    currentUser() {
      return this.$store.state['common'].currentUser.user
    },
    currentTalkObj() {
      //切换聊天对象时，将滑块置底  
      return this.$store.state['common'].currentCheatObj
    },
    currentScrollHeigh() {
      return this.$refs['MessageContainer'].scrollHeight
    },
    NeedScroll() {
      return this.$store.state['common'].MessageFormScroll
    },
    ImageIsLoaded() {
      console.log(document.readyState === 'complete')
      return document.readyState === 'complete'
    }

  },
  watch: {
    //变化时消息框置底
    NeedScroll: function () {
      this.scrollToBottom()
    },
    currentTalkObj: function (a, b) {
      if (a.uuid != b.uuid) {
        this.changeTalkStatus()
        this.scrollToBottom()
      }
    }
  },
  mounted() {
    this.scrollToBottom()

    //添加滚动事件 已使用@scroll="handleScroll"在ul标签设置
    // window.addEventListener('scroll', this.handleScroll, true);
    // this.$on('MessageFormScrollToBottom',()=>{
    //   this.scrollToBottom()
    // })
  }
}
</script>


<style  scoped>
p,
div,
ul,
li {
  padding: 0;
  margin: 0;
}
.messageForm {
  width: 100%;
  height: 100%;
}
.messageForm ul {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.messageForm li {
  /* border: solid black 1px; */
  margin: 0 28px 0 28px;
  padding: 5px 0 5px 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}
/* 查询更多聊天记录 */
.showmore {
  padding: 5px 0 0 0 !important;
}
.showmore .el-button--text {
  font-size: 12px;
  padding: 0;
  margin: 0;
}
/* 时间 */
.time {
  color: rgb(129, 129, 129);
  font-size: 12px;
  background: rgb(218, 218, 218);
  padding: 1px 4px 1px 4px;
  border-radius: 2px;
}
.messageli {
  display: flex;
  justify-content: flex-start;
}
/* 自身发言时的样式 */
.messageli_self {
  display: flex;
  flex-direction: row-reverse;
}
.presoninfo .el-image {
  width: 34px !important;
  height: 34px !important;
  border-radius: 0;
  padding: 8px 2px 0 0;
}

.message {
  display: flex;
  flex-direction: column;
  max-width: 56%;
}
.name {
  padding: 0 8px 0 8px;
  text-align: left;
  font-size: 12px;
  font-weight: 400;
  color: rgb(104, 100, 100);
}
/* 自身发言时 */
.name_self {
  text-align: right;
}
.contentBox {
  margin: 4px 6px 0 6px;
  background-color: rgb(255, 255, 255);
  border-radius: 4px;
  border: solid 0.01px rgb(230, 225, 225);
}
/* 自身发言 */
.contentBox_self {
  margin: 12px 6px 0 6px;
  background-color: rgb(158, 234, 106) !important;
}
.TextContent {
  padding: 6px;
  font-weight: 450;
  text-align: justify;
}
/* 设置小箭头 */
.contentBox {
  position: relative;
}
.container__arrow {
  /* Size */
  height: 6px;
  width: 6px;
  background-color: rgb(255, 255, 255);
  position: absolute;
}
.shelfColor {
  background-color: rgb(158, 234, 106) !important;
}
/* 右小箭头 */
.container__arrow_rt {
  /* Position at the right top corner */
  right: 0;
  top: 8px;
  /* Border */
  border-right: solid 0.01px rgb(230, 225, 225);
  border-top: solid 0.01px rgb(230, 225, 225);
  transform: translate(50%, 50%) rotate(45deg);
}

/* 左小箭头 */
.container__arrow_lt {
  /* Position at the right top corner */
  left: 0;
  top: 2px;
  /* Border */
  border-left: solid 0.01px rgb(230, 225, 225);
  border-bottom: solid 0.01px rgb(230, 225, 225);
  transform: translate(-50%, 50%) rotate(45deg);
}
.fileBox_shelf {
  margin: 15px 0 0 8px;
}
.ImageContent {
  padding: 6px 8px 4px 8px;
}
.ImageContent .el-image {
  padding: 0 !important;
  width: auto !important;
  height: auto !important;
  max-width: 170px !important;
  max-height: 240px !important;
  /* 以下样式解决element懒加载无法显示问题 */
  display: block !important;
  min-height: 30px !important;
  min-width: 30px !important;
  overflow: auto !important;
}

/* 将滚动调设置成悬停出现 */
.messageForm ul:hover {
  overflow: overlay;
}
/* ul列表滚动条样式 */
.messageForm ul::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  min-height: 45px;
  /* display: none; */
}
/*滚动条里面小方块*/
.messageForm ul::-webkit-scrollbar-thumb {
  border-radius: 10px;
  min-height: 45px;
  background-color: rgba(185, 183, 180, 0.6);
}
/*滚动条里面轨道*/
.messageForm ul::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 5px rgb(255, 255, 255);
  background: #ededed;
  border-radius: 10px; */
  display: none;
}
</style>