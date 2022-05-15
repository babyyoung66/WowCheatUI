<template>
  <div id="toolBar">
    <!-- 头像及名称区域 -->
    <div v-if="userinfo != null" id="uinfo">
      <el-popover
        popper-class="photoPopover"
        placement="right-start"
        width="200"
        trigger="click"
      >
        <!-- 个人信息卡片 -->
        <personal-card :userinfo="userinfo"></personal-card>

        <el-image fit="cover" :src="userinfo.photourl" slot="reference"> </el-image>
      </el-popover>
    </div>
    <!-- 菜单区域 -->
    <div id="barBtn">
      <div class="toopBtnBar">
        <!-- 公告 -->
        <el-tooltip
          popper-class="btnitem"
          effect="dark"
          content="公告"
          placement="right"
        >
          <el-button class="toolBtn" @click="changeList('notice')"
            ><i
              class="bi bi-megaphone"
              :class="{ selected: ListType == 'notice' }"
            ></i>
          </el-button>
        </el-tooltip>

        <!-- 消息 -->
        <el-tooltip
          popper-class="btnitem"
          effect="dark"
          content="消息"
          placement="right"
        >
          <el-button @click="changeList('talkList')" class="toolBtn"
            ><i
              class="bi bi-chat-dots"
              :class="{ selected: ListType == 'talkList' }"
            ></i
          ></el-button>
        </el-tooltip>

        <!-- 好友列表 -->
        <el-tooltip
          popper-class="btnitem"
          effect="dark"
          content="通讯录"
          placement="right"
        >
          <el-button @click="changeList('friend')" class="toolBtn"
            ><i
              :class="{ selected: ListType == 'friend' }"
              class="bi bi-person-lines-fill"
            ></i
          ></el-button>
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
          <!-- @click="changeList('personCenter')"  -->
          <el-button @click="PersonalCenterDialog = true" class="toolBtn"><i class="bi bi-person-circle"></i></el-button>
        </el-tooltip>
        <!-- 个人中心界面 -->
        <el-dialog
          title="个人中心"
          :visible.sync="PersonalCenterDialog"
          width="450px"  
          custom-class="PersonalCenterDialog" 
          :destroy-on-close="true" 
        >
        <!-- :before-close="beforePersonalCenterClose" -->
          <personalCenter></personalCenter>
          <!-- <span slot="footer" class="dialog-footer">
            <el-button @click="PersonalCenterDialog = false">取 消</el-button>
          </span> -->
        </el-dialog>

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
              <li @click="editPassDialog = true">修改密码</li>
              <li>意见反馈</li>
              <li>清空聊天记录</li>
            </ul>

            <el-button slot="reference" class="toolBtn"
              ><i class="bi bi-list-ul"></i
            ></el-button>
          </el-popover>
        </el-tooltip>
        <!-- 修改密码界面 -->
        <el-dialog
          title="修改密码"
          :visible.sync="editPassDialog"
          width="450px"  
          custom-class="editPassDialog"    
          :destroy-on-close="true"    
        >
          <editPassword></editPassword>
        </el-dialog>

        <!-- 退出 -->
        <el-tooltip
          popper-class="btnitem"
          effect="dark"
          content="退出"
          placement="right"
        >
          <el-popconfirm title="确定注销登录？" @confirm="logout()">
            <el-button slot="reference" class="toolBtn"
              ><i class="bi bi-box-arrow-left"></i
            ></el-button>
          </el-popconfirm>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import PersonalCard from '@/components/personalCard.vue'
import personalCenter from '@/components/personalCenter.vue'
import editPassword from '@/components/editPassword.vue'
export default {
  name: "toolbar",
  data() {
    return {
      avatarUrl: '../static/logo.png',
      PersonalCenterDialog:false,
      editPassDialog:false
    }
  },

  methods: {
    logout() {
      this.Api.logoutRequest("/auth/logout")
      this.$router.push({ path: '/login' })

    },
    changeList(type) {
      this.$store.commit('common/setListType', type)
    },
    beforePersonalCenterClose(){

    }

  },
  computed: {
    userinfo() {
      return this.$store.state['common'].currentUser.user

    },
    ListType() {
      return this.$store.state['common'].ListType
    }

  },
  components: {
    PersonalCard,
    personalCenter,
    editPassword
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
  font-size: 22px;
  background-color: rgb(46, 46, 46);
  text-align: center;
}
.selected {
  color: rgb(76, 113, 217);
}
#toolBar .toolBtn {
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
  width: 35px !important;
  height: 35px !important;
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
  padding: 10px 15px 10px 15px;
  font-size: 14px;
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
  width: auto !important;
  min-width: 0 !important;
  /* margin: 0px; */
  margin-left: 10px;
  padding: 0px;
  overflow-x: hidden;
  overflow-y: hidden;
  /* background-color: rgba(37,49,57,0.7); */
  /* 设置透明，使用ul背景 */
  background-color: transparent;
  border: none;
  text-align: left !important;
}

/* topic字体大小 */
.el-tooltip__popper {
  font-size: 12px;
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


.PersonalCenterDialog {
  margin-top: 8vh !important;
  height: 560px !important;
  overflow: hidden;
}
.PersonalCenterDialog  .el-dialog__body{
  justify-content: left !important;
}
.PersonalCenterDialog .el-dialog__close{
  font-size: 22px !important;
}

.personalCenter .el-form-item__content,
.personalCenter .el-input__icon,
.personalCenter .el-input__prefix,
.personalCenter .el-input__suffix {
  line-height: 40px;
  height: auto;
}
</style>
  