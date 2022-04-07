<template>
  <div class="sidebar">
    <div class="searchbox">
      <el-autocomplete
        prefix-icon="el-icon-search"
        v-model="state"
        value-key="name"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        :trigger-on-focus="false"
        @select="handleSelect"
        clearable
        @clear="afterClear"
      ></el-autocomplete>

      <el-button @click="plusDialogVisible = true" icon="el-icon-plus"></el-button>  
    </div>
    <el-dialog
       :visible.sync="plusDialogVisible"
        width="240px"
        center
        :modal="false"
        :close-on-click-modal="false"
        custom-class="plusDialog"
      >
        <!-- 加号菜单组件 -->
        <plus-menue></plus-menue>
        <span slot="footer" class="dialog-footer">
          <el-button plain type="primary" size="mini" @click="plusDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>

    <!-- 列表区域 -->
    <div class="listbox">
      <!-- 消息列表 -->
      <ul v-if="TalkList != null && ListType == 'talkList'">
        <li
          class="userli"
          style="padding: 10px 0 6px 0"
          v-for="(it, index) in TalkList"
          :key="'message' + index"
          @click="SelectList(it, index)"
          :class="{
            onSelect: it.uuid == $store.state['common'].currentCheatObj.uuid,
          }"
          @contextmenu="rightClik(index, it, $event)"
        >
          <!-- 消息红点 -->
          <el-badge
            :is-dot="
              it.concatInfo != null &&
              it.concatInfo.unReadTotal != null &&
              it.concatInfo.unReadTotal != 0
            "
            class="dotitem"
          >
            <!-- 头像 -->
            <el-image fit="cover" :src="it.photourl"> </el-image>
          </el-badge>
          <!-- 名称、时间、最新一条记录 -->
          <div class="peopleinfo">
            <div class="namewithTime">
              <!-- 名称 -->
              <span
                v-if="
                  it.concatInfo == null ||
                  it.concatInfo.remarks == null ||
                  it.concatInfo.remarks == ''
                "
                class="name"
                style="font-size: 16px"
                >{{ it.name }}</span
              >
              <!-- 有备注则显示备注 -->
              <span
                v-if="
                  it.concatInfo != null &&
                  it.concatInfo.remarks != null &&
                  it.concatInfo.remarks != ''
                "
                class="name"
                style="font-size: 16px"
                >{{ it.concatInfo.remarks }}</span
              >

              <!-- 时间，取最近一条记录的时间，判断与当前时间间隔，分别显示昨天、前天、七天内显示星期、七天以上显示具体年月日 -->
              <span class="time" v-if="getLastMess(it.uuid) != null">{{
                switchTime(getLastMess(it.uuid)["time"])
              }}</span>
            </div>
            <div class="recMessage">
              <p
                class="unReadTotal"
                v-if="
                  it.concatInfo != null &&
                  it.concatInfo.unReadTotal != null &&
                  it.concatInfo.unReadTotal != 0
                "
              >
                [{{ it.concatInfo.unReadTotal }}条]
              </p>
              <!-- 最后一条消息记录 -->
              <p
                class="mess"
                v-if="
                  getLastMess(it.uuid) != null &&
                  getLastMess(it.uuid)['contentType'] == 'text'
                "
              >
                {{ getLastMess(it.uuid)["content"] }}
              </p>
              <p
                v-if="
                  getLastMess(it.uuid) != null &&
                  getLastMess(it.uuid)['contentType'] == 'file' &&
                  getLastMess(it.uuid)['fileDetail'].fileType == 'image'
                "
                class="mess"
              >
                [图片]{{ getLastMess(it.uuid)["fileDetail"].fileName }}
              </p>
              <p
                v-if="
                  getLastMess(it.uuid) != null &&
                  getLastMess(it.uuid)['contentType'] == 'file' &&
                  getLastMess(it.uuid)['fileDetail'].fileType == 'video'
                "
                class="mess"
              >
                [视频]{{ getLastMess(it.uuid)["fileDetail"].fileName }}
              </p>
              <p
                v-if="
                  getLastMess(it.uuid) != null &&
                  getLastMess(it.uuid)['contentType'] == 'file' &&
                  getLastMess(it.uuid)['fileDetail'].fileType == 'file'
                "
                class="mess"
              >
                [文件]{{ getLastMess(it.uuid)["fileDetail"].fileName }}
              </p>
            </div>
          </div>
        </li>
      </ul>
      <!-- 通讯录 -->

      <ul v-show="ListType == 'friend'">
        <li class="typeLabel">#新的朋友</li>
        <!-- 好友请求列表 -->
        <li
          @click="checkFriendRequest"
          class="userli"
          style="justify-content: start"
          :class="{
            onSelect:
              $store.state['common'].checkDetial != null &&
              $store.state['common'].checkDetial.type == 'friendsRequest',
          }"
        >
          <!-- 头像 -->
          <el-image
            fit="cover"
            style="padding: 0 0 0 10px"
            src="../static/newFriendPic.png"
          >
          </el-image>
          <span class="name" style="font-size: 16px; padding: 0 30px 0 15px">
            新的朋友
          </span>
        </li>

        <li
          class="typeLabel"
          style="border-top: 0.1px solid rgb(197, 195, 194)"
        >
          #群聊
        </li>
        <div
          style="height: 40px"
          v-if="GroupsList == null || GroupsList.length == 0"
        ></div>
        <!-- 群聊 -->
        <li
          class="userli"
          v-for="(it, index) in GroupsList"
          :key="'group' + index"
          @click="SelectList(it, index)"
          :class="{
            onSelect:
              $store.state['common'].checkDetial != null &&
              it.uuid == $store.state['common'].checkDetial.uuid,
          }"
          :ref="it.uuid"
          style="justify-content: start"
          v-show="it.uuid != currentUser.uuid"
        >
          <!-- @contextmenu="rightClik(index, it, $event)" -->
          <!-- 头像 -->
          <el-image fit="cover" style="padding: 0 0 0 10px" :src="it.photourl">
          </el-image>
          <span
            v-if="
              it.concatInfo == null ||
              it.concatInfo.remarks == null ||
              it.concatInfo.remarks == ''
            "
            class="name"
            style="font-size: 16px; padding: 0 30px 0 15px"
          >
            {{ it.name }}
          </span>
          <!-- 备注 -->
          <span
            v-if="
              it.concatInfo != null &&
              it.concatInfo.remarks != null &&
              it.concatInfo.remarks != ''
            "
            class="name"
            style="font-size: 16px; padding: 0 30px 0 15px"
          >
            {{ it.concatInfo.remarks }}
          </span>
        </li>

        <li
          class="typeLabel"
          style="border-top: 0.1px solid rgb(197, 195, 194)"
        >
          #好友
        </li>
        <!-- 好友 -->
        <li
          class="userli"
          v-for="(it, index) in FriendsList"
          :key="'personal' + index"
          @click="SelectList(it, index)"
          :class="{
            onSelect:
              $store.state['common'].checkDetial != null &&
              it.uuid == $store.state['common'].checkDetial.uuid,
          }"
          :ref="it.uuid"
          style="justify-content: start"
          v-show="it.uuid != currentUser.uuid"
        >
          <!-- @contextmenu="rightClik(index, it, $event)" -->
          <!-- 头像 -->
          <el-image fit="cover" style="padding: 0 0 0 10px" :src="it.photourl">
          </el-image>
          <span
            v-if="
              it.concatInfo == null ||
              it.concatInfo.remarks == null ||
              it.concatInfo.remarks == ''
            "
            class="name"
            style="font-size: 16px; padding: 0 30px 0 15px"
          >
            {{ it.name }}
          </span>
          <!-- 备注 -->
          <span
            v-if="
              it.concatInfo != null &&
              it.concatInfo.remarks != null &&
              it.concatInfo.remarks != ''
            "
            class="name"
            style="font-size: 16px; padding: 0 30px 0 15px"
          >
            {{ it.concatInfo.remarks }}
          </span>
        </li>
      </ul>

      <!-- notice公告 -->
    </div>

    <!-- 右键弹出框 -->
    <div v-show="contextMenuVisible">
      <ul
        :style="{
          left: left + 'px',
          top: top + 'px',
        }"
        class="contextmenu"
      >
        <li>
          <el-button @click="delfromList" type="text" size="mini"
            >删除聊天</el-button
          >
        </li>
        <li><el-button type="text" size="mini">举报聊天</el-button></li>
      </ul>
    </div>
  </div>
</template>

<script scoped>
import TimeUtils from '@/utils/TimeUtils'
import plusMenue from './plusMenue.vue';
export default {
  components: { plusMenue },
  name: "sidebar",
  data() {
    return {
      plusDialogVisible:false,
      //右键选中的用户
      rightClikObj: null,
      contextMenuVisible: false,
      left: 0,
      top: 0,
      state: '',
    }
  },
  methods: {
    querySearch(queryString, cb) {
      let restaurants = this.queryData;
      //获取一个查询数组
      let results = queryString ? restaurants.filter(this.fuzzyFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 模糊查询
    fuzzyFilter(queryString) {
      return (restaurant) => {
        let remarksInfo = restaurant.concatInfo != null && restaurant.concatInfo.remarks != null ? restaurant.concatInfo.remarks : null
        //跟据name或id匹配查询结果 indexOf >= 0则模糊匹配，indexOf == 0则精确匹配
        return (remarksInfo != null && remarksInfo.toLowerCase().indexOf(queryString.toLowerCase()) >= 0) || (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0) || (restaurant.wowId.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
      };
    },
    // 准确查询
    accurateFilter(queryString) {
      return (restaurant) => {
        //跟据name或id匹配查询结果 indexOf >= 0则模糊匹配，indexOf == 0则精确匹配
        return (restaurant.wowId.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 搜索内容选择后触发的事件,传入的是一个JSON对象
    handleSelect(item) {
      if (this.ListType == 'talkList') {
        this.TalkSelect(item)
      }
      if (this.ListType == 'friend') {
        this.FriendSelect(item)
      }
    },

    //聊天列表时的方法
    TalkSelect(item) {
      // 查询聊天记录
      this.$store.commit('message/InitUserMessage', item)
     
      //设置为选中
      this.SelectList(item, 0)
      this.moveToTop(item)
      //移动滚动条到首位
      if (scroll.scrollTop > 0) {
        this.MyscrollTo(0)
      }
    },

    FriendSelect(item) {

      //设置为选中
      this.SelectList(item, index)
      //根据设置refs获取对应的元素
      let target = this.$refs[item.uuid]['0']
      let targetOffset = target.offsetTop

      // console.log(document.querySelector(".onSelect"))
      //定位到具体位置
      this.MyscrollTo(targetOffset)
      this.$store.commit('common/setCheckDetial', item)
    },

    //将搜索内容放到li首位
    moveToTop(item) {
      this.$store.commit('common/setUserOnTopOfTalkList', item)
    },

    // 选择列表内容时
    SelectList(item, index) {

      //切换聊天框类型
      this.changeMessageFormType(item)
      if (this.ListType == '' || this.ListType == null) {
        this.$store.commit('common/setListType', 'talkList')
      }
      if (this.ListType == 'talkList') {
        this.$store.commit('common/setCurrentCheatObj', item)
        //更新好友联系时间
        this.$store.dispatch('common/upDateConcatTime', item)
        return
      }
      if (this.ListType == 'friend') {
        this.$store.commit('common/setCheckDetial', item)
        return
      }

    },
    //在选择列表对象，或者搜索到的对象时，根据对象type更改当前聊天框类型
    changeMessageFormType(item) {
      this.$store.commit('common/setmessageFormType', item.type)
    },
  
    //根据id读取列表(talkList是复制的一份，后续数据是更新FriendMap，所有得从FriendMap读取)
    getUserInfo(uuid) {
      return this.$store.getters['common/getUserByuuid'](uuid)
    },

  
    // 获取最新的一条记录
    getLastMess(uuid) {
      if (this.$store.state['message'].messageMap != null) {
        return this.$store.getters['message/getlastMessage'](uuid)
      }
    },
    //转换显示时间
    switchTime(t) {
      return TimeUtils.formatForSimpleView(t)
    },


    MyscrollTo(num) {
      this.$nextTick(() => {
        let scroll = document.querySelector(".listbox ul")
        if (scroll != null) {
          scroll.scrollTo(0, num)
        }

      })
    },
    //清除搜索内容时使输入框重新聚焦，因为不重新聚焦下次搜索时搜索建议会消失
    afterClear() {
      // document.activeElement获得了DOM中被聚焦的元素；.blur()取消聚焦
      let active = document.activeElement
      active.blur()
      active.focus()
    },



    //右击列表内容时
    rightClik(index, data, clickEvent) {

      //修改整个ul的右键
      let ul = clickEvent.currentTarget.parentElement
      ul.preventDefault //关闭浏览器右键默认事件
      ul.oncontextmenu = function () { //整个页面的js事件
        return false; //阻止默认右键弹窗
      }
      this.contextMenuVisible = true;
      this.left = clickEvent.clientX;
      this.top = clickEvent.clientY + 5;
      this.rightClikObj = data
    },
    closeMenu() {
      this.contextMenuVisible = false;
      this.rightClikObj = null
    },
    //删除聊天
    delfromList() {
      if (this.rightClikObj != null) {
        let usr = this.rightClikObj
        this.$store.commit('common/removeFromTalkList', usr)
      }
    },
    //查看好友请求列表
    checkFriendRequest() {
      let item = { "name": '新的朋友', "type": 'friendsRequest' }
      this.$store.commit('common/setCheckDetial', item)
    }

  },
  //绑定vuex数据
  computed: {
    ListType() {
      return this.$store.getters['common/getListType']
    },
    GroupsList() {
      return this.$store.getters['common/getGroupsList']
    },
    FriendsList() {
      return this.$store.getters['common/getFriendsList']
    },
    TalkList() {
      return this.$store.getters['common/getTalkList']
    },
    NoticeList() {
      return this.$store.getters['common/getNoticeList']
    },

    queryData() {
      return this.$store.getters['common/getQueryData']
    },
    currentUser() {
      return this.$store.state['common'].currentUser.user
    }


  },
  //初始化状态
  created() {
    //  this.$store.commit('message/INIT_Message',this.state['list'].talkList)

  },
  watch: {
    //关闭右键按钮菜单
    contextMenuVisible() {
      document.body.addEventListener('click', this.closeMenu)

    }
  },

}

</script>
<style scoped>
div,
p,
li,
ul {
  padding: 0;
  margin: 0;
}

/* 查询栏父div */
.searchbox {
  height: 60px;
  background-color: rgb(247, 247, 247);
  display: flex;
  /* justify-content: start; */
  align-items: center;
  overflow: hidden;
}

/* 列表样式 */
.listbox {
  height: 90.7%;
  width: 100%;
  background-color: rgb(237, 234, 232);
}
/* 选中某个li时的样式 */
.onSelect {
  background-color: rgb(202, 200, 198);
}
/* 头像 */
.listbox .el-image {
  /* margin-top: 16px !important; */
  width: 34px !important;
  height: 34px !important;
  border-radius: 0;
  padding: 0 0 0 10px;
}
/* .listbox .el-badge {
  margin: 5px 0 0 10px;
  align-items: center;
} */
.namewithTime {
  /* padding: 5px 0 0 0; */
  display: flex;
  justify-content: space-between;
}

.listbox .peopleinfo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* align-content: stretch; */
  width: 100%;
  height: auto !important;
  overflow: hidden;
  padding: 0 0 0 14px;
}
.peopleinfo .time,
.mess,
.unReadTotal {
  color: rgb(129, 129, 129);
  font-size: 12px;
}
.mess {
  line-height: 19px;
}
.peopleinfo .time {
  width: auto;
  padding: 0 16px 0 0;
}

/* 超宽的名字和消息使用省略号 */
.name,
.recMessage .mess {
  width: auto;
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  padding: 0 25px 0 0;
}

.recMessage {
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
}
.unReadTotal {
  width: auto;
  white-space: nowrap;
  padding: 0 4px 0 0;
}

.listbox ul {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* 开启滚动条 */
  /* overlay 将滚动条浮动在元素上，不另外占用宽度（只兼容Chrome内核） */
  /* overflow:overlay ; */
}
/* li样式 */
.listbox .userli {
  list-style: none;
  display: flex;
  justify-content: space-between;
  height: auto;
  padding: 10px 0 10px 0;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

/* li高亮设置 */
.listbox .userli:hover {
  background-color: rgb(214, 211, 209);
}
/* 将滚动调设置成悬停出现 */
.listbox ul:hover {
  overflow: overlay;
}
/* ul列表滚动条样式 */
.listbox ul::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  /* display: none; */
}
.listbox ul::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: rgba(185, 183, 180, 0.6);
}
/*滚动条里面轨道*/
.listbox ul::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 5px rgb(255, 255, 255);
  background: #ededed;
  border-radius: 10px; */
  display: none;
}
.listbox .typeLabel {
  text-align: left;
  font-size: 13px;
  padding: 15px 0 2px 10px;
  color: rgb(148, 145, 145);
}
</style>


<style>
/* 继承或覆盖父属性则放在此 */
/* 查询输入框 */
.searchbox .el-autocomplete {
  padding: 0 8px 0 8px !important;
  width: 80%;
}
.searchbox .el-autocomplete .el-input__inner,
.el-input {
  border-radius: 6px !important;
  background-color: rgb(226, 226, 226);
  height: 25px;
}
/* 搜索图标及清空图标 */
.searchbox .el-input__prefix,
.el-input__suffix {
  /* top: -7px !important; */
  top: 2px !important;
}
.searchbox .el-input__icon {
  /* top: -7px !important; */
  line-height: 14px;
  top: 2px;
}
.searchbox .el-autocomplete .el-input {
  font-size: 14px;
}

/* 加号 */
.searchbox .el-button {
  /* margin-top: 20px ; */
  padding: 0;
  width: 20px;
  height: 20px;
  background-color: rgb(226, 226, 226) !important;
}
.el-button .el-icon-plus {
  font-size: 14px !important;
  font-weight: bold;
}

/* 搜索框提示字体颜色 */
input::-webkit-input-placeholder {
  color: rgb(129, 129, 129) !important;
}
input:-moz-input-placeholder {
  color: rgb(129, 129, 129) !important;
}
input:-ms-input-placeholder {
  color: rgb(129, 129, 129) !important;
}

.contextmenu {
  width: 100px;
  margin: 0;
  border: 1px solid #ccc;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);
}
.contextmenu li {
  margin: 0;
  padding: 0px 22px;
}
.contextmenu li:hover {
  background: #f2f2f2;
  cursor: pointer;
}
.contextmenu li button {
  color: #2c3e50;
}
.plusDialog .el-dialog__header{
  padding: 5px 10px 10px 0 !important;
}
/* .plusDialog .el-dialog__title{
  display: none !important;
} */
.plusDialog .el-dialog__headerbtn{
  top: 6px !important;
  right: 6px !important ;
}
.plusDialog .el-dialog__body{
  padding: 25px 25px 15px 25px !important ;
}
.plusDialog .el-dialog__footer{
  text-align: right !important;
  padding: 10px 25px 20px 25px !important;
}
</style>
