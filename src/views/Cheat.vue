<template>
  <div
    id="app"
    v-loading="isInit == null || !isInit"
    element-loading-text="正在初始化数据..."
  >
    <!-- 头像信息 -->
    <div class="toolbar">
      <toolbar></toolbar>
    </div>
    <!-- 好友、群聊列表 -->
    <div class="sidebar">
      <sidebar></sidebar>
    </div>
    <!-- 聊天内容、列表好友资料显示区域 -->
    <div class="main">

      <!-- 顶部昵称 -->
      <div
        class="title"
        v-if="
          listType == 'talkList' ||
          listType == 'notice' ||
          cheatObj.type == 'friendsRequest'
        "
      >
        <cheatTitle></cheatTitle>
      </div>
      <div
        class="cheatMain"
        v-if="
          listType == 'talkList' &&
          this.$store.state['common'].currentCheatObj.uuid != null
        "
      >
        <!-- 消息栏 -->
        <div class="message">
          <messageform></messageform>
        </div>
        <!-- 发送栏 -->
        <div class="sendForm">
          <sendForm></sendForm>
        </div>
      </div>

      <!-- 通讯录好友信息展示 -->
      <div
        class="infoCard"
        v-if="
          listType == 'friend' &&
          checkDetial != null &&
          checkDetial.type == 'personal'
        "
      >
        <user-info-card
          :userinfo="checkDetial"
        ></user-info-card>
      </div>

      <!-- 通讯录群聊信息展示 -->
      <div
        class="infoCard"
        v-if="
          listType == 'friend' &&
          checkDetial != null &&
          checkDetial.type == 'group'
        "
      >
      <group-info-card :groupInfo="checkDetial">
      </group-info-card>
      </div>

      <!-- 新朋友列表 -->
      <div
        class="infoCard"
        v-if="
          listType == 'friend' &&
          checkDetial != null &&
          checkDetial.type == 'friendsRequest'
        "
      >
        <request-list></request-list>
      </div>

      <!-- notice -->
      <div class="notice" v-show="listType == 'notice' || listType == ''">
        <h1>Notice</h1>
      </div>
    </div>
  </div>
</template>
<script>
import toolbar from '@/components/toolbar.vue'
import sidebar from '@/components/sidebar.vue'
import cheatTitle from '@/components/cheatTitle.vue'
import messageform from '@/components/MessageForm.vue'
import sendForm from '@/components/SendForm.vue'
import UserInfoCard from '@/components/userInfoCard.vue'
import RequestList from '@/components/requestList.vue'
import GroupInfoCard from '@/components/groupInfoCard.vue'


export default {
  name: 'cheat',
  data() {
    return {

    }
  },
  computed: {
    currentuser() {
      return this.$store.state['common'].currentUser
    },
    cheatObj() {
      return this.$store.getters['common/getCurrentCheatObj']
    },
    checkDetial(){
      return this.$store.state['common'].checkDetial
    },
    isInit() {
      //0完成初始化，1则未完成
      return this.$store.getters['getInitStatus']
    },
    listType() {
      return this.$store.state['common'].ListType
    }
  },

  created() {

    //刷新后重连socket
    if (this.isInit != null && this.isInit) {
      this.$store.dispatch('stompSocket/connect');
    }
    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      // console.log("cheat" + this.$store.state['common'])
      this.$store.commit('saveState')
    });

  },
  beforeDestroy() {
    //离开前关闭socket
    if (this.$store.state['stompSocket'].stomp != null) {
      this.$store.state['stompSocket'].stomp.disconnect()
    }
  },
  // 导入组件，并扫描
  components: {
    toolbar,
    sidebar,
    cheatTitle,
    messageform,
    sendForm,
    UserInfoCard,
    RequestList,
    GroupInfoCard
  }
}

</script>
<style scoped>
div {
  padding: 0;
  margin: 0;
}
#app {
  margin: 20px auto !important;
  width: 920px !important;
  height: 640px !important;
  /* overflow: hidden; */
  border-radius: 5px;
  border: solid 1px rgb(237, 234, 232);
}
#app .sidebar,
.main,
.toolbar,
.infoCard {
  height: 100%;
}
.toolbar {
  float: left;
  color: #f4f4f4;
  background-color: #2e3238;
  width: 55px;
}
.sidebar {
  float: left;
  color: #000000;
  /* background-color: rgb(234,232,231); */
  width: 250px;
  /* overflow: hidden; */
  height: 100%;
  border-right: solid 0.1px rgb(217, 217, 217);
}
.main {
  position: relative;
  overflow: hidden;
  background-color: #eee;
  height: 100%;
}
.cheatMain {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* main测试样式 */
.title {
  height: 60px;
  background-color: rgb(245, 245, 245);
  border-bottom: solid 0.1px rgb(217, 217, 217);
}

.message {
  height: 450px;
  background-color: rgb(245, 245, 245);
  border-bottom: solid 0.1px rgb(217, 217, 217);
}
.sendForm {
  height: 128px;
  background: rgb(255, 255, 255);
  /* border-bottom: solid 1px rgb(217,217,217); */
}
</style>

/**
  全局样式
 */
<style>
/* 头像弹出层 */
.el-popover.photoPopover {
  margin-left: -18px !important;
  margin-right: -22px !important;
  margin-top: 12px !important;
  border-radius: 0;
  width: 290px !important;
  height: 250px !important;
  padding: 0;
}

.el-popover.photoPopover .popper__arrow {
  display: none;
}
.el-popover .popper__arrow {
  display: none;
}

/* 鼠标样式改为小手 */
.el-image__inner,
i,
button {
  cursor: pointer;
}
/* 去掉bootstrap图标的底部占位 */
.bi::before,
[class^="bi-"]::before,
[class*=" bi-"]::before {
  vertical-align: 0 !important;
}
.el-popover .el-popover,
.el-popper {
  text-align: center !important;
}
/* 去除最小宽度限制 */
.el-dialog{
    min-width: 0 !important;
}
/* 文字不换行且显示省略号 */
.ellipsisWord {
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
/* tooltip下弹出的箭头样式 */
.btnitem[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: transparent !important;
}
.btnitem[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: rgba(37, 49, 57, 0.7) !important;
}
.btnitem[x-placement^="top"] .popper__arrow {
  border-top-color: transparent !important;
}
.btnitem[x-placement^="top"] .popper__arrow::after {
  border-top-color: rgba(37, 49, 57, 0.7) !important;
}
.btnitem[x-placement^="right"] .popper__arrow {
  border-right-color: transparent !important;
}
.btnitem[x-placement^="right"] .popper__arrow::after {
  border-right-color: rgba(37, 49, 57, 0.7) !important;
}
.btnitem.el-tooltip__popper {
  max-width: 200px !important;
}
</style>