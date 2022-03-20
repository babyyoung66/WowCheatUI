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

      <el-button icon="el-icon-plus"></el-button>
    </div>

    <!-- 列表区域 -->
    <div class="listbox">
      <ul v-if="list != null && ListType == 'talkList'">
        <li
          v-for="(it, index) in list"
          :key="index"
          @click="SelectList(it, index)"
          :class="{
            onSelect:
              TalkSelectIndex == index ||
              it.uuid == $store.state['common'].currentCheatObj.uuid,
          }"
          @contextmenu="rightClik(index, it, $event)"
        >
          <span v-if="setClikIndex(it, index)" style="display: none"></span>
          <!-- 消息红点 -->
          <el-badge :is-dot="it.uncheck" class="item">
            <!-- 头像 -->
            <el-image fit="cover" :src="it.photourl" lazy> </el-image>
          </el-badge>
          <!-- 名称、时间、最新一条记录 -->
          <div class="peopleinfo">
            <div class="namewithTime">
              <!-- 名称 -->
              <span
                v-if="it.friendsInfo == null || it.friendsInfo.remarks == null"
                class="name"
                style="font-size: 18px"
                >{{ it.name }}</span
              >
              <!-- 有备注则显示备注 -->
              <span
                v-if="it.friendsInfo != null && it.friendsInfo.remarks != null"
                class="name"
                style="font-size: 18px"
                >{{ it.friendsInfo.remarks }}</span
              >

              <!-- 时间，取最近一条记录的时间，判断与当前时间间隔，分别显示昨天、前天、七天内显示星期、七天以上显示具体年月日 -->
              <span class="time" v-show="getLastMess(it.uuid) != null">{{
                switchTime(getLastMess(it.uuid)["time"])
              }}</span>
            </div>
            <div class="recMessage">
              <p class="mess" v-show="getLastMess(it.uuid) != null">
                <!-- this is a recently message6666666666666666666666 -->
                {{ getLastMess(it.uuid)["content"] }}
              </p>
            </div>
          </div>
        </li>
      </ul>
      <!-- 通讯录 -->
      <ul v-show="ListType == 'friend'">
        <li
          v-for="(it, index) in list"
          :key="index"
          @click="checkDetial(it, index)"
          :class="{
            onSelect:
              FriendSelectIndex == index ||
              ($store.state['common'].checkDetial != null &&
                it.uuid == $store.state['common'].checkDetial.uuid),
          }"
          :ref="index"
          style="justify-content: start"
        >
          <!-- @contextmenu="rightClik(index, it, $event)" -->
          <span v-if="setClikIndex(it, index)" style="display: none"></span>
          <!-- 头像 -->
          <el-image fit="cover" style="padding: 0 0 0 10px" :src="it.photourl">
          </el-image>
          <span
            v-if="it.friendsInfo == null || it.friendsInfo.remarks == null"
            class="name"
            style="font-size: 18px; padding: 0 30px 0 15px"
          >
            {{ it.name }}
          </span>
          <!-- 备注 -->
          <span
            v-if="it.friendsInfo != null && it.friendsInfo.remarks != null"
            class="name"
            style="font-size: 18px; padding: 0 30px 0 15px"
          >
            {{ it.friendsInfo.remarks }}
          </span>
        </li>
      </ul>
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

<script scope="this api replaced by slot-scope in 2.5.0+">
import TimeUtils from '@/utils/TimeUtils'
export default {
  name: "sidebar",
  data() {
    return {
      rightClikIndex: -1,
      contextMenuVisible: false,
      left: 0,
      top: 0,

      //记录当前已选li的index，用于改变样式
      TalkSelectIndex: -1,
      FriendSelectIndex: -1,
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
        let remarksInfo = restaurant.friendsInfo != null && restaurant.friendsInfo.remarks != null ? restaurant.friendsInfo.remarks : null
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
      this.Api.postRequest('/message/getByPage', { "to": item.uuid }).then(res => {
        if (res.data.success) {
          let messDta = { "uuid": item.uuid, "message": res.data.data }
          // console.log(messDta)
          this.$store.commit('message/setMessageMapByUUID', messDta)
        }
      })

      this.moveToTop(item)
      //清除未读状态
      if (item.uncheck == true) {
        this.list[0].uncheck = false
      }
      //移动滚动条到首位
      if (scroll.scrollTop > 0) {
        this.MyscrollTo(0)
      }
      //设置为选中
      this.SelectList(item, 0)
    },

    FriendSelect(item) {

      //获取元素在list中的位置
      let index = this.list.findIndex(it => it.uuid == item.uuid)
      //设置为选中
      this.SelectList(item, index)
      //根据设置refs获取对应的元素
      let target = this.$refs[index]['0']
      let targetOffset = target.offsetTop

      // console.log(document.querySelector(".onSelect"))
      //定位到具体位置
      this.MyscrollTo(targetOffset)
      this.$store.commit('common/setCheckDetial', item)
    },

    //将搜索内容放到li首位
    moveToTop(item) {
      this.$store.commit('common/setUserOnTopOfTalkList', item)
      // let i = 0
      // if (this.list != null) {
      //   this.list.forEach(element => {
      //     if (element.uuid === item.uuid) {
      //       this.list.splice(i, 1)
      //       return
      //     }
      //     i++
      //   });
      // }
      // this.list.unshift(item)
      //console.log(this.ListData)
    },

    // 选择列表内容时
    SelectList(item, index) {
      if (this.ListType == '' || this.ListType == null) {
        this.$store.commit('common/setListType', 'talkList')
      }
      if (this.ListType == 'talkList') {
        this.TalkSelectIndex = index
        this.list[index].uncheck = false
        this.$store.commit('common/setCurrentCheatObj', item)
      }
      if (this.ListType == 'friend') {
        this.FriendSelectIndex = index
      }
      //切换聊天框类型
      this.changeMessageFormType(item)
    },
    //根据当前聊天对象设置已选
    setClikIndex(item, index) {
      if (item.uuid == this.$store.state['common'].currentCheatObj.uuid) {
        this.TalkSelectIndex = index
      }
      if (this.$store.state['common'].checkDetial != null && item.uuid == this.$store.state['common'].checkDetial.uuid) {
        this.FriendSelectIndex = index
      }
      return

    },
    //获取当前选择查看的对象index及更新到store
    checkDetial(item, index) {
      this.SelectList(item, index)
      this.$store.commit('common/setCheckDetial', item)
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

    //在选择列表对象，或者搜索到的对象时，根据对象type更改当前聊天框类型
    changeMessageFormType(item){
        this.$store.commit('common/setmessageFormType',item.type)
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
      this.rightClikIndex = index
    },
    closeMenu() {
      this.contextMenuVisible = false;
      this.rightClikIndex = -1
    },
    //删除聊天
    delfromList() {
      if (this.rightClikIndex != -1) {
        this.list.splice(this.rightClikIndex, 1)
        this.$store.commit('common/setCurrentCheatObj', {})
        this.rightClikIndex = -1
      }
    },



  },
  //绑定vuex数据
  computed: {
    //根据对话对象计算已选择位置

    ListType() {
      return this.$store.getters['common/getListType']
    },
    checkdata() {
      return this.$store.getters['common/getListByType'](this.ListType)
    },
    list() {
      return this.$store.getters['common/getListByType'](this.ListType)
    },
    queryData() {
      return this.$store.getters['common/getQueryData']
    },


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
.el-image {
  /* margin-top: 16px !important; */
  width: 35px !important;
  height: 35px !important;
  border-radius: 0;
}
.listbox .el-badge {
  padding: 5px 0 0 10px;
  align-items: center;
}
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
.mess {
  color: rgb(129, 129, 129);
  font-size: 12px;
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
</style>


<style>
/* 继承或覆盖父属性则放在此 */
/* 查询输入框 */
.el-autocomplete {
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
  top: -7px;
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

/* li样式 */
.listbox ul li {
  list-style: none;
  display: flex;
  justify-content: space-between;
  height: 55px;
  align-items: center;
  width: 100%;
}

/* li高亮设置 */
.listbox ul li:hover {
  background-color: rgb(214, 211, 209);
}
</style>

<style >
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
</style>