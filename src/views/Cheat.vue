<template>
  <div id="app">
    <!-- 头像信息 -->
    <div class="toolbar">
      <toolbar></toolbar>
    </div>
    <!-- 好友、群聊列表 -->
    <div class="sidebar">
      <!-- <div class="searchbox"></div>
      <div class="listbox"></div> -->
      <list></list>
    </div>
    <!-- 聊天内容显示区域 -->
    <div class="main">
      <div class="title"></div>
      <div class="textbox">
        <div class="message"></div>
        <div class="cheatText"></div>
      </div>
    </div>
  </div>
</template>
<script>
import toolbar from '@/components/toolbar.vue'
import List from '@/components/List.vue'

export default {
  name: 'cheat',
  data() {
    return {

    }
  },

// 导入组件，并扫描
  components: {
    toolbar,
    List
  }
}

</script>
<style scoped>
#app {
  margin: 20px auto !important;
  width: 1150px !important;
  height: 800px !important;
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
  width: 65px;
}
.sidebar {
  float: left;
  color: #000000;
  /* background-color: rgb(234,232,231); */
  width: 300px;
  /* overflow: hidden; */
  height: 100%;
  border-right:  solid 0.5px rgb(217, 217, 217);

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
  height: 718px;
  display: flex;
  flex-direction: column;
  align-content: space-between;
}
/* main测试样式 */
.title {
  height: 81px !important;
  background-color: rgb(245, 245, 245);
  border-bottom: solid 0.5px rgb(217, 217, 217);
}

.message {
  height: 90% !important;
  background-color: rgb(245, 245, 245);
  border-bottom: solid 0.5px rgb(217, 217, 217);
}
.cheatText {
  height: 30%;
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