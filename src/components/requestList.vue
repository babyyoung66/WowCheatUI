<template>
  <div class="requestInfo">
    <!-- <span style="display: none">{{ checkDetial }}</span> -->
    <ul class="requestul">
      <li
        class="requestli"
        v-for="(it, index) in requestList"
        :key="index"
        :class="{ selected: currentSelectIndex == index }"
        @click="selectLi(index)"
      >
        <div style="width:45%;padding: 0 0 0 10px;">
          <el-popover
            popper-class="photoPopover requestListPopover"
            placement="right-start"
            width="200"
            trigger="click"
          >
            <personal-card
              :userinfo="it.userInfo"
              :showFooter="it.requestStatus == 1"
            ></personal-card>
            <div class="info" slot="reference">
              <!-- 头像 -->
              <el-image
                fit="cover"
                style="padding: 0 0 0 10px"
                :src="it.userInfo.photourl"
              >
              </el-image>
              <span
                class="name"
                style="font-size: 16px; padding: 0 30px 0 15px"
              >
                {{ it.userInfo.name }}
              </span>
            </div>
          </el-popover>
        </div>

        <div class="btnbox">
          <span
            title="点击查看"
            @click="showRequestMessage(it)"
            v-if="it.requestUuid == currentUser.uuid && it.requestStatus != 1"
            style="color: rgb(129, 129, 129); font-size: 13 px"
            >等待验证中...</span
          >
          <span
            title="点击查看"
            @click="showRequestMessage(it)"
            v-if="it.receiverUuid == currentUser.uuid && it.requestStatus == 1"
            style="color: rgb(22, 170, 81); font-size: 13 px"
            >已通过请求</span
          >
          <span
            title="点击查看"
            @click="showRequestMessage(it)"
            v-if="it.receiverUuid !== currentUser.uuid && it.requestStatus == 1"
            style="color: rgb(22, 170, 81); font-size: 13 px"
            >对方已通过</span
          >
          <span
            title="点击查看"
            @click="showRequestMessage(it)"
            v-if="it.receiverUuid == currentUser.uuid && it.requestStatus == 2"
            style="color: rgb(238, 82, 48); font-size: 13 px"
            >已拒绝请求</span
          >
          <div
            v-if="it.receiverUuid == currentUser.uuid && it.requestStatus == 0"
          >
            <el-button
              @click="showRequestMessage(it)"
              plain
              type="primary"
              size="mini"
              >查看请求消息</el-button
            >
          </div>
        </div>
      </li>
    </ul>
    <el-dialog
      title=""
      :visible.sync="requestMessagedialogVisible"
      width="360px"
      :modal="false"
      :before-close="handleClose"
      custom-class="requestMessageDialog"
    >
      <div v-if="currentCheck != null" style="text-align: left; width: 100%">
        请求时间：{{ currentCheck.requestTime }}
      </div>
      <div style="text-align: left; width: 100%">请求信息：</div>
      <div v-if="currentCheck != null" class="message">
        <p>{{ currentCheck.requestMessage }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <div
          v-show="
            currentCheck != null &&
            currentCheck.receiverUuid == currentUser.uuid &&
            currentCheck.requestStatus == 0
          "
        >
          <el-button
            :disabled="requesting"
            @click="setRequestStatus(1)"
            type="primary"
            size="mini"
            plain
            >接 受</el-button
          >
          <el-button
            :disabled="requesting"
            @click="setRequestStatus(2)"
            type="primary"
            size="mini"
            plain
            >拒 绝</el-button
          >
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import PersonalCard from '@/components/personalCard.vue'
export default {
  name: "requestList",
  components: {
    PersonalCard
  },
  data() {
    return {
      //requestList: [],
      currentSelectIndex: -1,
      requestMessagedialogVisible: false,
      requesting: false,
      currentCheck: null
    }
  },
  methods: {
    getList() {
      this.Api.postRequest('/friend/getRequestList', {}).then(res => {
        if (res.data.success && res.data.data != null) {
          this.requestList = res.data.data
        }
      })
    },
    selectLi(index) {
      this.currentSelectIndex = index
    },
    showRequestMessage(item) {
      this.requestMessagedialogVisible = true
      this.currentCheck = item
    },
    handleClose() {
      this.requestMessagedialogVisible = false
      this.currentCheck = null
      this.requesting = false
    },
    setRequestStatus(status) {
      //设置请求状态，1同意，2拒绝
      if (this.currentCheck == null) {
        return
      }
      this.requesting = true
      this.currentCheck.requestStatus = status
      this.Api.postRequest('/friend/setRequestStatus', this.currentCheck).then(res => {
        if (res.data.success) {
          //同意时socket会返回好友信息

          this.requestList[this.currentSelectIndex] = this.currentCheck
          this.handleClose()
        }
      }).finally(() => {
        this.requesting = false
      })
    },
  },
  computed: {
    requestList() {
      return this.$store.state['common'].FriendRequestList
    },
    currentUser() {
      return this.$store.state['common'].currentUser.user
    },
  },
  created() {

  },
}
</script>


<style scoped>
div,
ul,
li,
p {
  padding: 0;
  margin: 0;
}
.requestInfo {
  height: 100%;
  width: 100%;
}
.requestInfo .info {
  display: flex;
  justify-content: start;
  align-items: center;
  cursor: pointer;
}
.requestInfo ul {
  width: auto;
}
.requestInfo li {
  list-style: none;
  display: flex;
  justify-content: space-between;
  height: auto;
  padding: 10px;
  align-items: center;
  width: auto;
  /* border: solid 0.1px rgb(68, 180, 200); */
  /* background: rgb(238, 230, 230); */
}
.requestInfo li:hover {
  background-color: rgb(214, 211, 209);
}
.requestInfo .selected {
  background-color: rgb(214, 210, 209);
}
.requestInfo .name {
  width: auto;
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  padding: 0 25px 0 0;
}
.requestInfo .el-image {
  /* margin-top: 16px !important; */
  width: 34px !important;
  height: 34px !important;
  border-radius: 0;
  padding: 0;
}
.requestInfo .btnbox {
  width: auto;
  padding: 0 10px 0 10px;
  width: 100px;
  text-align: left;
}
.requestInfo .btnbox span:hover {
  cursor: pointer;
  color: rgb(64, 158, 255) !important;
}
.requestInfo .message {
  border: 0.1px solid rgb(213, 208, 208);
  border-radius: 2px;
  min-height: 80px;
  height: auto;
  width: 100%;
  text-align: left;
}
.requestInfo .message p {
  padding: 0 4px;
}

</style>
<style>
.el-popper.requestListPopover{
  margin-left: -20% !important;
  margin-right: -22px !important;
}
.requestMessageDialog .el-dialog {
  min-width: 0;
}
.requestMessageDialog .el-dialog__header {
  padding: 5px 10px 10px 0;
  text-align: center;
}
.requestMessageDialog .el-dialog__headerbtn {
  top: 6px;
  right: 6px;
}
.requestMessageDialog .el-dialog__body {
  padding: 5px 25px 15px 25px;
  text-align: center;
  flex-direction: column;
}
.requestMessageDialog .el-dialog__footer {
  text-align: right;
  padding: 10px 25px 20px 25px;
}
.requestMessageDialog .el-input__inner,
.el-input {
  border-radius: 6px;
  background-color: rgb(226, 226, 226);
  height: 28px;
}
.requestMessageDialog .el-form-item__content,
.el-input__icon,
.el-input__prefix,
.el-input__suffix {
  line-height: 28px;
}
.requestMessageDialog .el-form-item__content {
  display: flex;
  justify-content: space-between;
}
.requestMessageDialog .el-input__prefix,
.el-input__suffix {
  top: 0;
}
</style>