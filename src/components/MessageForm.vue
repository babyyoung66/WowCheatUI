<template>
  <div class="messageForm">
    <!-- 无显示意义，仅用于触发compute属性从而触发方法 -->
    <span style="display: none">{{ currentTalkUUid }}</span>

    <ul ref="MessageContainer" @scroll="&quot;MessageScroll&quot;;">
      <li v-show="currentScrollTop <= 1 || this.currentScrollheight == this.ScrollclientHeight" class="showmore">
        <el-button @click="showMoreMessage" type="text"
          >查看更多消息...</el-button
        >
      </li>
      <li
        v-for="(message, index) in messageData"
        :key="index"
        :ref="'msg' + index"
      >
        <!-- 时间线，十分钟内不显示，一天内显示时分，超过两天显示昨天/前天 + 时分，三天以上显示年月日时分... -->
        <span class="time">{{ message.time }}</span>

        <!-- 消息主体 -->
        <div
          class="messageli"
          :class="{
            messageli_self: message.from == currentUserUUid,
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
                :src="$store.state['list'].FriendsMap[message.from].photourl"
                slot="reference"
              >
              </el-image>
            </el-popover>
          </div>
          <!-- 消息及姓名 -->
          <div class="message">
            <!-- 群聊时才显示名称 -->
            <p
              v-if="$store.state['list'].messageFormType == 'group'"
              class="name"
              :class="{
                name_self: message.from == currentUserUUid,
              }"
            >
              {{ getUserInfo(message.from).name }}
            </p>
            <div
              class="contentBox"
              :class="{
                contentBox_self: message.from == currentUserUUid,
              }"
            >
              <p class="content">
                {{ message.content }}
              </p>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import PersonalCard from '@/components/personalCard.vue'
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
    }
  },
  methods: {
    getUserInfo(uuid) {
      return this.$store.getters['list/getUserByuuid'](uuid)
    },
    //请求更多记录
    showMoreMessage() {
      // 暂存前面一条信息位置
      // let lastPremess = this.$refs['msg' + 0]['0']
      let firstmess = {}
      if (this.messageData != null) {
        firstmess = this.messageData[0]
      }
      //防止为空时好友id不存在
      this.$set(firstmess, "to", this.currentTalkUUid)
      this.Api.postRequest('/message/getByPage', firstmess).then(res => {
        if (res.data.success) {
          let mess = res.data.data
          if (mess != null && mess.length > 0) {
            let msgData = { "uuid": this.currentTalkUUid, "message": mess }
            this.$store.commit('message/pushMessageArryByUUIDOnTop', msgData)
            // this.scrollToTop()
          } else {
            this.$message({
              message: '没有更多消息了!',
              type: 'info'
            });
          }
          this.MyscrollTo(20)
        }

        // this.MyscrollTo(lastPremess.offsetTop )
      })
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
      this.$nextTick(() => {
        let ele = this.$refs['MessageContainer']
        if (!this.isNull(ele)) {
          ele.scrollTop = ele.scrollHeight + 20;
        }
      })
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
      if (!this.scrollTimeIsOpen && isNeedScrool) {
        this.scrollTimeIsOpen = true
        // console.log("打开定时器")
        var scrollTimer = setInterval(() => {
          let isNeed = this.isNeedToScroll()
          if (isNeed) {
            this.scrollToBottom()
          }else {
            //不在底部时，关闭定时器
            clearInterval(scrollTimer)
            this.scrollTimeIsOpen = false
            // console.log("关闭定时器")
          }
        }, 400)
      }
    },
    isNeedToScroll() {
      //整个可滑动高度
      let height = this.$refs['MessageContainer'].scrollHeight
      // 滑块顶部
      let top = this.$refs['MessageContainer'].scrollTop
      //可视化区域
      let clientHeight = this.$refs['MessageContainer'].clientHeight
      let count = top + clientHeight
      //暂存当前位置
      this.currentScrollTop = top
      this.currentScrollheight = height
      this.ScrollclientHeight = clientHeight
      if(clientHeight == height){
        return false
      }
      if (count >= height ) {
        return true
      }  
      return false
    }

  },
  computed: {
    messageData() {
      return this.$store.getters['message/getMessagesByuuid'](this.$store.state['list'].currentCheatObj.uuid)
    },
    currentUserUUid() {
      return sessionStorage.getItem('uuid')
    },
    currentTalkUUid() {
      //切换聊天对象时，将滑块置底
      this.scrollToBottom()
      return this.$store.state['list'].currentCheatObj.uuid
    },

  },
  created() {
    // this.$store.commit('list/setObj')
    //console.log(this.$store.state['list'].messageList)
    //  this.ScrollElement = this.$refs['MessageContainer']

  },
  watch: {


  },
  mounted() {


    //添加滚动事件
    window.addEventListener('scroll', this.handleScroll, true);
  },
  destroyed() {
    //离开页面时移除事件
    window.removeEventListener('scroll', this.handleScroll, true);

  },
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
  padding: 10px 0 10px 0;
  list-style: none;
  display: flex;
  flex-direction: column;
}
.showmore {
  padding: 5px 0 0 0 !important;
}
.showmore .el-button--text {
  font-size: 12px;
  padding: 0;
  margin: 0;
}
.time {
  color: rgb(129, 129, 129);
  font-size: 12px;
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
.el-image {
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
  margin: 8px 6px 0 6px;
  background-color: rgb(255, 255, 255);
  border-radius: 6px;
  border: solid 0.01px rgb(230, 225, 225);
}
/* 自身发言 */
.contentBox_self {
  background-color: rgb(158, 234, 106) !important;
}
.content {
  padding: 6px 12px 6px 12px;
  font-weight: 400;
  text-align: justify;
}

/* 将滚动调设置成悬停出现 */
.messageForm ul:hover {
  overflow: overlay;
}
/* ul列表滚动条样式 */
.messageForm ul::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  /* display: none; */
}
.messageForm ul::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
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