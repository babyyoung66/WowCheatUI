<template>
  <div id="toolBar">
    <!-- 头像及名称区域 -->
    <div id="uinfo">
      <el-popover
        popper-class="photoPopover"
        placement="right-start"
        width="200"
        trigger="click"
      >
        <!-- 个人信息卡片 -->
        <personal-card></personal-card>

        <el-image :src="avatarUrl" slot="reference"> </el-image>
      </el-popover>
    </div>
    <!-- 菜单区域 -->
    <div id="barBtn">
      <div class="toopBtnBar">
        <!-- 消息 -->
        <el-tooltip
          popper-class="btnitem"
          effect="dark"
          content="消息"
          placement="right"
        >
          <el-button><i class="bi bi-chat-dots"></i></el-button>
        </el-tooltip>

        <!-- 好友列表 -->
        <el-tooltip
          popper-class="btnitem"
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
          popper-class="btnitem"
          effect="dark"
          content="个人中心"
          placement="right"
        >
          <el-button><i class="bi bi-person-circle"></i></el-button>
        </el-tooltip>

        <!-- 更多 -->
        <el-tooltip
          popper-class="btnitem"
          effect="dark"
          content="更多..."
          placement="right"
        >
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
        <el-tooltip
          popper-class="btnitem"
          effect="dark"
          content="退出"
          placement="right"
        >
          <el-button><i class="bi bi-box-arrow-left"></i></el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalCard from '@/components/personalCard.vue'
export default {
  name: "toolbar",
  data() {
    return {
      avatarUrl: '../static/logo.png',
    }
  },

  methods: {

  },
  components: {
    PersonalCard
  }

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
  width: 90%;
}

#barBtn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 85% !important;
  padding-top: 15px;
}

#uinfo {
  width: 45px;
  height: auto;
  /* padding: 12px; */
  margin: auto;
  padding-top: 15px;
}

.el-image {
  margin-top: 16px !important;
  width: 45px !important;
  height: 45px !important;
  border-radius: 0;
}
.el-menu {
  height: 100%;
  width: auto;
}

#moreList {
  margin: 0px;
  padding: 0px;
  background-color: rgba(37, 49, 57, 0.7);
  height: 100%;
}
#moreList li {
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 15px;
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
  height: auto;
  width: 150px;
  /* margin: 0px; */
  margin-left: 10px;
  padding: 0px;
  overflow-x: hidden;
  overflow-y: hidden;
  /* background-color: rgba(37,49,57,0.7); */
  /* 设置透明，使用ul背景 */
  background-color: transparent;
  border: none;
}

/* topic字体大小 */
.el-tooltip__popper {
  font-size: 14px;
  background-color: rgba(37, 49, 57, 0.7) !important;
}

/* 修改tooltip右边弹出的箭头 有两层一个是:after 
    设置颜色需要将其中一个transparent设置透明掉，不然重叠在一起颜色不对
*/
.btnitem[x-placement^="right"] .popper__arrow {
  border-right-color: transparent !important;
}
.btnitem[x-placement^="right"] .popper__arrow:after {
  border-right-color: rgba(37, 49, 57, 0.7) !important;
}

/* 修改指定popover类 */
.el-popover.photoPopover {
  margin-left: -34px !important;
  margin-top: 24px !important;
  border-radius: 0;
  width: 370px !important;
  height: 315px !important;
  padding: 0;
}

.el-popover.photoPopover .popper__arrow {
  display: none;
}
.el-popover .popper__arrow {
  display: none;
}
</style>
  