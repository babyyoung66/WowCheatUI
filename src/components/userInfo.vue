<template>
  <div
    class="infocard"
    v-loading="userinfo == null || !userinfo"
    v-if="
      userinfo != null && userinfo.uuid != null && userinfo.type == 'personal'
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
            icon-color="red"
            title="确定拉黑该好友吗？"
            @confirm="changeFriendStatus(3)"
          >
            <li slot="reference">拉黑好友</li>
          </el-popconfirm>

          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="rgb(239, 189, 102)"
            title="确定屏蔽该好友吗？"
            @confirm="changeFriendStatus(2)"
          >
            <li v-show="userinfo.concatInfo.status != 2" slot="reference">
              屏蔽好友
            </li>
          </el-popconfirm>

          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="rgb(239, 189, 102)"
            title="确定取消屏蔽该好友吗？"
            @confirm="changeFriendStatus(1)"
          >
            <li v-show="userinfo.concatInfo.status == 2" slot="reference">
              取消屏蔽
            </li>
          </el-popconfirm>

          <el-popconfirm
            confirm-button-text="确定"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="删除好友后将清空所有消息记录，确定删除该好友吗？"
            @confirm="deleteFriend"
          >
            <li slot="reference">删除好友</li>
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
              :content="userinfo.name"
              placement="bottom"
            >
              <p class="name">{{ userinfo.name }}</p>
            </el-tooltip>
            <!-- 性别图标 -->
            <img
              class="sexicon"
              v-if="userinfo.sex == 1"
              :src="sexIcons[1]"
              alt=""
            />
            <img
              class="sexicon"
              v-if="userinfo.sex == 0"
              :src="sexIcons[0]"
              alt=""
            />
          </div>
        </div>
        <!-- 头像 -->
        <div class="photo">
          <el-image
            fit="cover"
            :src="userinfo.photourl"
            :preview-src-list="[userinfo.photourl]"
          >
          </el-image>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="splice" style="margin: 40px 0 0 0"></div>

      <el-form label-width="60px">
        <el-form-item label="备　注" v-if="userinfo.uuid != currentUserUUid">
          <div @click="editRemarksPrompt">
            <span
              title="单击修改备注"
              class="addRemarks"
              v-if="userinfo.concatInfo != null && userinfo.concatInfo.remarks != null && userinfo.concatInfo.remarks.trim() != ''"
              >{{ userinfo.concatInfo.remarks }}</span
            >
            <span
              v-if="
                userinfo.concatInfo == null || userinfo.concatInfo.remarks == null || userinfo.concatInfo.remarks.trim() == ''
              "
              class="addRemarks"
              >点击添加备注</span
            >
          </div>
        </el-form-item>

        <el-form-item label="wowId"> {{ userinfo.wowId }} </el-form-item>

        <!-- <el-form-item label="地　区">
          </el-form-item> -->
        <div class="addressBox">
          <p
            style="
              text-align: left;
              color: rgb(129, 129, 129);
              font-size: 14px;
              width: 12%;
            "
          >
            地　区
          </p>
          <el-tooltip
            popper-class="btnitem"
            effect="dark"
            :content="userinfo.address"
            placement="bottom"
          >
            <!-- ellipsisWord -->
            <p class="address">
              {{ userinfo.address }}
            </p>
          </el-tooltip>
        </div>
      </el-form>

      <!-- 分割线 -->
      <div class="splice" style="margin: 22px 0 0 0"></div>

      <!-- 菜单按钮 -->
      <div class="menue">
        <button @click="sendMessage" class="sendMessBtn">发消息</button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'userInfo',
  //父组件传入
  props: {
    userinfo: null
  },
  data() {
    return {
      sexIcons: ["../static/icon_women.gif", "../static/icon_man.gif"],
      edit: {
        remarks: ''
      }
    }
  },
  methods: {
    sendMessage() {
      this.$store.commit('message/InitUserMessage', this.userinfo)
      this.$store.state['common'].currentCheatObj = this.userinfo
      this.$store.commit('common/setUserOnTopOfTalkList', this.userinfo)
      this.$store.dispatch('common/upDateConcatTime', this.userinfo)
      this.$store.state['common'].ListType = 'talkList'
      this.$store.state['common'].messageFormType = this.userinfo.type
    },
    initRemarks() {
      if (this.myutils.hasText(this.userinfo.concatInfo, 'remarks')) {
        this.edit.remarks = this.userinfo.concatInfo.remarks
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
        if(value != null){
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
      if (this.edit.remarks == this.userinfo.concatInfo.remarks.trim()) {
        return
      }
      let friend = { "fUuid": this.userinfo.uuid, "remarks": this.edit.remarks }
      this.Api.postRequest('/friend/editRemarks', friend).then(res => {
        if (res.data.success) {
          //更新本地remarks
          this.$store.state['common'].FriendsMap[this.userinfo.uuid].concatInfo.remarks = this.edit.remarks
          this.userinfo.concatInfo.remarks = this.edit.remarks
          this.edit.remarks = ''
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        }
      })
    },
    cleanEdit() {
      this.edit.remarks = ''
    },
    deleteFriend() {
      let uuid = this.userinfo.uuid
      let friend = { "fUuid": uuid }
      this.Api.postRequest('/friend/delete', friend).then(res => {
        if (res.data.success) {
          //删除本地信息
          this.$store.commit('message/deleteMessageById', this.userinfo.uuid)
          this.$store.commit('common/deleteUser', this.userinfo)
          this.$message({
            message: res.data.message,
            type: 'success'
          });
        }
      })
    },
    changeFriendStatus(status) {
      let friend = { "fUuid": this.userinfo.uuid, "status": status }
      this.Api.postRequest('/friend/changeStatus', friend).then(res => {
        if (res.data.success) {
          this.$store.state['common'].FriendsMap[this.userinfo.uuid].concatInfo.status = status
          this.userinfo.concatInfo.status = status
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          if (status == 3) {
            this.$store.state['common'].checkDetial = null
          }
        }

      })
    }
  },
  computed: {
    currentUserUUid() {
      return this.$store.state['common'].currentUser.user.uuid
    },
    cheatObj() {
      return this.$store.getters['common/getCurrentCheatObj']
    },
  },
  watch: {
    userinfo: function () {
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
.sexicon {
  object-fit: cover;
  width: 16px;
  height: 18px;
  padding: 3px 3px 0 8px;
  /* padding-top: 42px; */
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

.addressBox {
  display: flex;
  flex-direction: row;
}
.addressBox .address {
  max-width: 80%;
  width: fit-content;
  height: auto;
  /* border: solid #000; */
  overflow: hidden;
  margin-left: 27px;
  display: list-item;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-align: left;
}
</style>

<style>
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