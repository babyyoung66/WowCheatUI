<template>
  <div id="toolBar">
    <!-- 头像及名称区域 -->
    <div id="uinfo"> 
      <el-avatar
        shape="square"
        :size="100"
        fit="cover"
        :src="avatarUrl"
      ></el-avatar>
    </div>

    <!-- 菜单区域 -->
    <div id="barBtn">
      <div class="toopBtnBar">
        <!-- 消息 -->
        <el-tooltip
          class="item"
          effect="dark"
          content="消息"
          placement="right"
        >
          <el-button><i class="bi bi-chat-dots"></i></el-button>
        </el-tooltip>

        <!-- 好友列表 -->
        <el-tooltip
          class="item"
          effect="dark"
          content="通讯录"
          placement="right"
        >
          <el-button><i class="bi bi-person-lines-fill"></i></el-button>
        </el-tooltip>

        <!-- 群聊列表 -->
        <!-- <el-tooltip
          class="item"
          effect="dark"
          content="群聊列表"
          placement="right"
        >
          <el-button><i class="bi bi-people-fill"></i></el-button>
        </el-tooltip> -->
      </div>

      <!-- 底部菜单 -->
      <div class="bottomBtnBar">
        <!-- 个人中心 -->
        <el-tooltip
          class="item"
          effect="dark"
          content="个人中心"
          placement="right"
        >
          <el-button><i class="bi bi-person-circle"></i></el-button>
        </el-tooltip>

        <!-- 更多 -->
        <el-tooltip class="item" effect="dark" content="更多..." placement="right">
          <el-popover
            placement="right"
            width="180"
            trigger="click"
            popper-class="moreListPopoverClass"
          >
            <ul id="moreList">
              <li>意见反馈</li>
              <li>举报</li>
              <li>清空聊天记录</li>
            </ul>
            <el-button slot="reference"
              ><i class="bi bi-list-ul"></i
            ></el-button>
          </el-popover>
        </el-tooltip>

        <!-- 退出 -->
        <el-tooltip class="item" effect="dark" content="退出" placement="right">
          <el-button><i class="bi bi-box-arrow-left"></i></el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "toolbar",
  data() {
    return {
      avatarUrl: '../static/logo.png',
    }
  },

  methods: {

  },

}
</script>

<style scoped >
#toolBar {
  height: 100%;
  width: 100%;
  text-align: center;
  background-color: rgb(46, 46, 46);
  /* display: flex;
  flex-direction: column; */
}

#toolBar i {
  font-size: 30px;
  background-color: rgb(46, 46, 46);
  text-align: center;
}

#toolBar button {
  background-color: rgb(46, 46, 46);
  border: none;
  padding: 2px !important;
  text-align: center;
  margin-left: 0px !important;
  margin-top: 10px !important;
}

#barBtn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 87% !important;
}

#uinfo {
  width: 45px;
  height: auto;
  padding: 12px;
}

.el-avatar {
  margin-top: 16px !important;
  width: 45px !important;
  height: 45px !important;
}
.el-menu {
  height: 100%;
  width: auto;
}

#moreList {
  margin: 0px;
  padding: 0px;
  background-color: rgb(41, 41, 42);
}
#moreList li {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  font-size: 18px;
  color: rgb(214, 211, 211);
  list-style: none;
  cursor: pointer;
}
#moreList li:hover {
  background-color: #abaaaa;
}
</style>

<style>
/* 更多弹出框列表的样式 */
/* el-popover是和app同级的，所以scoped的局部属性设置了无效 */
/* 需要设置全局style */
.el-popover.moreListPopoverClass {
  height: 150px;
  width: 150px;
  /* margin: 0px; */
  margin-left: 10px;
  padding: 0px;
  overflow-x: hidden;
  overflow-y: hidden;
  background-color: rgb(41, 41, 42);
  border: none;
}

/* topic字体大小 */
.el-tooltip__popper {
  font-size: 14px;
}
</style>
  