<template>
  <div id="app" v-if="currentuser != null">
    <!-- 头像信息 -->
    <div class="toolbar">
      <toolbar></toolbar>
    </div>
    <!-- 好友、群聊列表 -->
    <div class="sidebar">
      <!-- <div class="searchbox"></div>
      <div class="listbox"></div> -->
      <sidebar></sidebar>
    </div>
    <!-- 聊天内容、列表好友资料显示区域 -->
    <div class="main">
      <div
        class="cheatMain"
        v-if="this.$store.state['list'].ListType == 'message'"
      >
        <div class="title">
          <cheatTitle></cheatTitle>
        </div>

        <div class="message"></div>
        <div class="cheatText"></div>
        
      </div>

      <div
        class="friendsMain"
        v-if="this.$store.state['list'].ListType == 'friend'"
      >
        <h1>资料显示组件待开发</h1>
      </div>
    </div>
  </div>
</template>
<script>
import toolbar from '@/components/toolbar.vue'
import sidebar from '@/components/sidebar.vue'
import cheatTitle from '@/components/cheatTitle.vue'

export default {
  name: 'cheat',
  data() {
    return {

    }
  },
  computed: {
    currentuser() {
      return JSON.parse(localStorage.getItem("currentUser"))
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
    cheatTitle
  }
}

</script>
<style scoped>
#app {
  margin: 20px auto !important;
  width: 920px !important;
  height: 640px !important;
  overflow: hidden;
  border-radius: 10px;
  border: solid 1px rgb(217, 217, 217);
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

  /* 测试样式 */
  /* display: flex;
      flex-direction: column;
      align-content: space-around; */
}
.main {
  position: relative;
  overflow: hidden;
  background-color: #eee;
  height: 100%;

  /* 临时测试样式 */
  /* display: flex;
      flex-direction: column;
      align-content: space-around; */
}

.textbox {
  height: auto;
  display: flex;
  flex-direction: column;
  align-content: space-between;
  justify-items: auto;
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
  border-bottom: solid 0.5px rgb(217, 217, 217);
}
.cheatText {
  padding: 0;
  margin: 0;
  height: 150px;
  background: rgb(255, 255, 255);
  /* border-bottom: solid 1px rgb(217,217,217); */
}

/* sidebar 测试样式 */
.searchbox {
  height: 80px;
  /* border-bottom: solid 1px rgb(217, 217, 217); */
  background-color: rgb(247, 247, 247);
}
.listbox {
  height: 100%;
  border: solid 0.5px rgb(236, 236, 236);
  background-color: rgb(234, 232, 231);
}
</style>