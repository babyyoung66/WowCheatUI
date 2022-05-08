
<template>
  <div
    class="infocard"
    v-loading="groupInfo == null || !groupInfo"
    v-if="
      groupInfo != null && groupInfo.uuid != null && groupInfo.type == 'group'
    "
  >
    <!-- 右三点图标 -->
    <div class="header">
      <el-popover
        popper-class="infoCard_MENUE"
        placement="bottom"
        width="auto"
        trigger="click"
      >
        <!-- 相关菜单 -->
        <ul>
          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="rgb(239, 189, 102)"
            title="确定屏蔽该群聊吗？"
            @confirm="changeGroupStatus(1)"
          >
            <li
              v-show="groupInfo.concatInfo.notifyStatus == 0"
              slot="reference"
            >
              屏蔽群聊
            </li>
          </el-popconfirm>

          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="rgb(239, 189, 102)"
            title="确定取消屏蔽该群聊吗？"
            @confirm="changeGroupStatus(0)"
          >
            <li
              v-show="groupInfo.concatInfo.notifyStatus == 1"
              slot="reference"
            >
              取消屏蔽
            </li>
          </el-popconfirm>

          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="退出群聊后将会清除所有消息记录，确定退出该群聊吗？"
            @confirm="exitGroup"
          >
            <li slot="reference">退出群聊</li>
          </el-popconfirm>
        </ul>

        <i
          style="font-size: 20px"
          class="bi bi-three-dots cardIcon"
          slot="reference"
        ></i>
      </el-popover>
    </div>

    <div class="inner">
      <!-- 姓名、头像、id -->
      <div class="maininfo">
        <!-- 名称、id -->
        <div class="idname">
          <div class="nameandicon">
            <el-tooltip
              popper-class="btnitem"
              effect="dark"
              :content="groupInfo.name"
              placement="bottom"
            >
              <p class="name">{{ groupInfo.name }}</p>
            </el-tooltip>
          </div>
        </div>
        <!-- 头像 -->
        <div class="photo">
          <el-image
            fit="cover"
            :src="groupInfo.photourl"
            :preview-src-list="[groupInfo.photourl]"
          >
          </el-image>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="splice" style="margin: 40px 0 0 0"></div>

      <!-- 基本信息及成员 -->
      <el-form label-width="60px">
        <el-form-item label="备　注" v-if="groupInfo.uuid != currentUserUUid">
          <!-- <el-popover
            ref="editRemarks"
            placement="top"
            width="auto"
            trigger="click"
          >
            <div style="display: flex; align-items: center">
              <input
                type="text"
                style="height: 20px"
                placeholder="请输入备注（至多12位）"
                v-model="edit.remarks"
              />
              <button
                @click="editRemarks('editRemarks')"
                style="height: 25px; margin: 0 0 0 5px"
                type="button"
              >
                修改
              </button>
            </div>
            <span
              title="单击修改备注"
              class="addRemarks"
              slot="reference"
              @click="initRemarks"
              v-if="this.myutils.hasText(groupInfo.concatInfo, 'remarks')"
              >{{ groupInfo.concatInfo.remarks }}</span
            >
          </el-popover>

          <el-popover
            ref="addRemarks"
            placement="top"
            width="auto"
            trigger="click"
          >
            <div style="display: flex; align-items: center">
              <input
                style="height: 20px"
                type="text"
                placeholder="请输入备注（至多12位）"
                v-model="edit.remarks"
              />
              <button
                @click="editRemarks('addRemarks')"
                style="height: 25px; margin: 0 0 0 5px"
                type="button"
              >
                添加
              </button>
            </div>
            <span
              v-if="!this.myutils.hasText(groupInfo.concatInfo, 'remarks')"
              class="addRemarks"
              slot="reference"
              >点击添加备注</span
            >
          </el-popover> -->
          <div @click="editRemarksPrompt">
            <span
              title="单击修改备注"
              class="addRemarks"
              v-if="groupInfo.concatInfo != null && groupInfo.concatInfo.remarks != null && groupInfo.concatInfo.remarks.trim() != ''"
              >{{ groupInfo.concatInfo.remarks }}</span
            >
            <span
              v-if="
                groupInfo.concatInfo == null || groupInfo.concatInfo.remarks == null || groupInfo.concatInfo.remarks.trim() == ''
              "
              class="addRemarks"
              >点击添加备注</span
            >
          </div>
        </el-form-item>
        <!-- 群成员列表 -->
        <p style="text-align: left; color: rgb(129, 129, 129); font-size: 14px">
          群成员
        </p>
        <br />
        <div class="groupMemberBox">
          <span
            class="groupMemberAvatar"
            v-for="(uuid, index) in groupMemberIds"
            :key="index"
          >
            <el-popover
              popper-class="memberPhotoPopover"
              placement="right-start"
              width="200"
              trigger="click"
            >
              <personal-card :userinfo="getMemberInfo(uuid)"></personal-card>
              <div slot="reference">
                <!-- 头像 -->
                <el-image fit="cover" :src="getMemberInfo(uuid).photourl">
                </el-image>
                <el-tooltip
                  popper-class="btnitem"
                  effect="dark"
                  :content="getMemberInfo(uuid).name"
                  placement="right-end"
                >
                  <!-- 名字 -->
                  <p class="memberName ellipsisWord">
                    {{ getMemberInfo(uuid).name }}
                  </p>
                </el-tooltip>
              </div>
            </el-popover>
          </span>
          <!-- 尾部添加按钮 -->
          <span @click="inviteMember" class="groupMemberAvatar" style="">
            <i class="el-icon-plus"></i>
            <p class="memberName ellipsisWord">添加</p>
          </span>
        </div>
      </el-form>

      <!-- 分割线 -->
      <div class="splice" style="margin: 22px 0 0 0"></div>

      <!-- 菜单按钮 -->
      <div class="menue">
        <button @click="sendMessage" class="sendMessBtn">发消息</button>
      </div>
    </div>

    <el-dialog
      title="邀请好友"
      :visible.sync="inviteDialog"
      width="350px"
      custom-class="inviteDialog"
      :destroy-on-close="true"
    >
      <invite-grouop-member
        :groupInfo="groupInfo"
        :type="'invite'"
      ></invite-grouop-member>
    </el-dialog>
  </div>
</template>
<script>
import PersonalCard from '@/components/personalCard.vue'
import inviteGrouopMember from '@/components/inviteGrouopMember.vue'
export default {
  name: 'groupInfo',
  components: {
    PersonalCard,
    inviteGrouopMember
  },
  //父组件传入
  props: {
    groupInfo: null
  },
  data() {
    return {
      inviteDialog: false,
      sexIcons: ["./static/icon_women.gif", "./static/icon_man.gif"],
      edit: {
        remarks: ''
      }
    }
  },
  methods: {
    getMemberInfo(uuid) {
      return this.$store.getters['common/getGroupMemberInfoByuuid'](uuid)
    },
    sendMessage() {
      this.$store.commit('message/InitUserMessage', this.groupInfo)
      this.$store.state['common'].currentCheatObj = this.groupInfo
      this.$store.commit('common/setUserOnTopOfTalkList', this.groupInfo)
      this.$store.dispatch('common/upDateConcatTime', this.groupInfo)
      this.$store.state['common'].ListType = 'talkList'
      this.$store.state['common'].messageFormType = this.groupInfo.type
    },
    initRemarks() {
      if (this.myutils.hasText(this.groupInfo.concatInfo, 'remarks')) {
        this.edit.remarks = this.groupInfo.concatInfo.remarks
      } else {
        this.edit.remarks = ''
      }
    },
    editRemarksPrompt() {
      this.initRemarks()
      this.$prompt('请输入备注', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:this.edit.remarks,
      }).then(({ value }) => {
        if (value != null) {
          this.edit.remarks = value
        }
        this.editRemarks()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },
    editRemarks() {
      if (this.edit.remarks == this.groupInfo.concatInfo.remarks.trim()) {
        return
      }
      let group = { "groupUuid": this.groupInfo.uuid, "remarks": this.edit.remarks }
      this.Api.postRequest('/group/editRemarks', group).then(res => {
        if (res.data.success) {
          //更新本地remarks
          this.$store.state['common'].GroupsMap[this.groupInfo.uuid].concatInfo.remarks = this.edit.remarks
          this.groupInfo.concatInfo.remarks = this.edit.remarks
          this.edit.remarks = ''
          this.$message({
            message: '修改成功！',
            type: 'success'
          });
        }
      })
    },
    cleanEdit() {
      this.edit.remarks = ''
    },
    exitGroup() {
      let uuid = this.groupInfo.uuid
      let group = { "groupId": uuid }
      this.Api.postByXWForm('/group/exitGroup', group).then(res => {
        if (res.data.success) {
          //删除本地信息
          this.$store.commit('message/deleteMessageById', this.groupInfo.uuid)
          this.$store.commit('common/deleteGroup', this.groupInfo)
          this.$message({
            message: res.data.message,
            type: 'success'
          });
        }
      })
    },
    changeGroupStatus(status) {
      let group = { "groupUuid": this.groupInfo.uuid, "notifyStatus": status }
      this.Api.postRequest('/group/changeNotifyStatus', group).then(res => {
        if (res.data.success) {
          this.$store.state['common'].GroupsMap[this.groupInfo.uuid].concatInfo.notifyStatus = status
          this.groupInfo.concatInfo.notifyStatus = status
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          if (status == 3) {
            this.$store.state['common'].checkDetial = null
          }
        }

      })
    },
    inviteMember() {
      this.inviteDialog = true
    }
  },
  computed: {
    currentUserUUid() {
      return this.$store.state['common'].currentUser.user.uuid
    },
    groupMemberIds() {
      let uuid = this.groupInfo.uuid
      return this.$store.state['common'].GroupsMap[uuid].memberIds
    }

  },
  watch: {
    groupInfo: function () {
      this.cleanEdit()
    }
  }
}
</script>
<style scoped>
div,
p,
ul,
li {
  padding: 0;
  margin: 0;
}
.header {
  display: flex;
  justify-content: flex-end;
  padding: 25px 30px 0 0;
}
.header ul,
li {
  list-style: none;
  width: 75px;
  height: auto;
}
.header ul,
li:hover {
  cursor: pointer;
  background-color: rgb(225, 214, 214);
}
.header li {
  padding: 2px 0 2px 0;
}
.infocard .el-image {
  width: 62px !important;
  height: 62px !important;
  border-radius: 0;
}
.infocard {
  background: rgb(244, 242, 242);
  height: 100%;
  /* display: flex;
  flex-direction: column;
  align-content: space-around; */
}
.inner {
  padding: 70px 120px 90px 120px;
}
.maininfo {
  overflow: hidden;
  display: flex;
  width: 100%;
  height: auto;
  justify-content: space-between;
}
.idname {
  max-width: 70%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: auto;
  width: auto;
}

.idname .name {
  /* max-width: 70%;   */
  height: auto;
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;

  text-align: left;
  font-size: 20px;
  color: black;
}
.nameandicon {
  display: flex;
  text-align: center;
  align-items: center;
}

.splice {
  border-top: solid rgb(217, 217, 217) 0.1mm;
}

.menue {
  height: 68px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px 0 0 0;
}
.menue .sendMessBtn {
  background: rgb(26, 173, 25);
  border: none;
  color: rgb(255, 255, 255);
  width: 120px;
  height: 38px;
}
.menue .sendMessBtn:hover {
  background: rgb(18, 150, 17);
  color: rgb(255, 253, 253);
}
.addRemarks:hover {
  color: rgb(139, 203, 203);
  cursor: pointer;
}

.groupMemberBox {
  width: 100%;
  height: 180px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 60px);
  overflow: hidden;
  text-align: -webkit-center;
}
.groupMemberBox .el-image {
  /* margin-top: 16px !important; */
  width: 34px !important;
  height: 34px !important;
  border-radius: 0;
  padding: 0;
}
.groupMemberAvatar {
  height: fit-content;
}
.groupMemberAvatar .el-icon-plus {
  width: 31px;
  height: 31px;
  font-size: 28px;
  color: rgb(176, 171, 171);
  border: solid 2px rgb(208, 195, 187);
}

.memberName {
  width: auto;
  max-width: 52px;
  text-align: center;
  cursor: pointer;
  font-size: 10px;
}
/* 将滚动调设置成悬停出现 */
.groupMemberBox:hover {
  overflow: overlay !important;
}
/* 滚动条样式 */
.groupMemberBox::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  min-height: 45px;
  /* display: none; */
}
/*滚动条里面小方块*/
.groupMemberBox::-webkit-scrollbar-thumb {
  border-radius: 10px;
  min-height: 45px;
  background-color: rgba(185, 183, 180, 0.6);
}
/*滚动条里面轨道*/
.groupMemberBox::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 5px rgb(255, 255, 255);
  background: #ededed;
  border-radius: 10px; */
  display: none;
}
</style>

<style>
.inviteDialog {
  margin-top: 8vh !important;
}
.inviteDialog .el-dialog__header {
  padding: 12px 15px !important;
}
.inviteDialog .el-dialog__headerbtn {
  top: 6px;
  right: 6px;
}
.inviteDialog .el-dialog__headerbtn i {
  font-size: 18px;
}
.inviteDialog .el-dialog__body {
  padding: 15px 12px;
}

.el-popover.memberPhotoPopover {
  margin-left: -24px !important;
  margin-right: -22px !important;
  margin-top: 12px !important;
  border-radius: 0;
  width: 290px !important;
  height: 250px !important;
  padding: 0;
}

.infocard .inner .el-form {
  margin: 20px 0 0 0;
}
.infocard .inner .el-form-item__content {
  text-align: left !important;
  padding-left: 12px;
  color: #000;
  font-weight: 500;
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;
}
.el-popover.infoCard_MENUE {
  min-width: 0 !important;
  padding: 5px !important;
}

.infocard .inner .el-form-item__label {
  text-align: left;
  color: rgb(129, 129, 129);
}
</style>
