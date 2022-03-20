<template>
  <div
    id="app"
    v-loading="isInit != 0 && isInit != null"
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
      <div class="title" v-show="listType == 'talkList' || listType == 'notice'  " >
          <cheatTitle></cheatTitle>
        </div>
      <div
        class="cheatMain"
        v-show="listType == 'talkList' && this.$store.state['common'].currentCheatObj.uuid != null"
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

      <!-- 通讯录 -->
      <div
        class="friendsMain"
        v-show="listType == 'friend' && this.$store.state['common'].checkDetial !== null"
      >
        <h1>资料显示组件待开发</h1>
        <br>
        <h2>{{this.$store.state['common'].checkDetial}}</h2>
      </div>
      <!-- notice -->
      <div class="notice" v-show="listType =='notice'  ||  listType ==''  ">
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


export default {
  name: 'cheat',
  data() {
    return {

    }
  },
  computed: {
    currentuser() {
      return JSON.parse(localStorage.getItem("currentUser"))
    },
    isInit() {
      //0完成初始化，1则未完成
      return this.$store.getters['getInitStatus']
    },
    listType(){
      return this.$store.state['common'].ListType
    }
  },

  created() {
    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      // console.log("cheat" + this.$store.state['common'])
      this.$store.commit('saveState')
    });

  },
  // 导入组件，并扫描
  components: {
    toolbar,
    sidebar,
    cheatTitle,
    messageform,
    sendForm
  }
}

</script>
<style scoped>
div{
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
.toolbar {
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
.cheatMain{
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
<style>
/* 将头像，i标签的鼠标样式改为小手 */
.el-image__inner,i{
  cursor: pointer;
}
/* 去掉bootstrap图标的底部占位 */
.bi::before, [class^="bi-"]::before, [class*=" bi-"]::before{
  vertical-align: 0 !important;
}
</style>