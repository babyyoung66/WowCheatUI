
<template>
  <div>
    <div class="plusMenue">
      <el-button @click="SearchFriendDialog = true" type="primary" size="mini"
        >添加好友</el-button
      >
      <el-button @click="CreateGroupDialog = true" type="primary" size="mini"
        >创建群聊</el-button
      >
    </div>
    <!-- 查找好友窗 -->
    <el-dialog
      title="添加好友"
      :visible.sync="SearchFriendDialog"
      width="320px"
      :modal="false"
      :close-on-click-modal="false"
      custom-class="innerDialog"
      :before-close="cleanSearch"
    >
      <el-form
        ref="searchWowIdForm"
        :model="searchWowIdForm"
        :rules="searchRules"
      >
        <el-form-item prop="searchWowId">
          <el-input
            placeholder="请输入WowId"
            prefix-icon="el-icon-search"
            v-model="searchWowIdForm.searchWowId"
            clearable
          >
          </el-input>
          <!-- 搜索按钮 -->
          <el-button
            @click="seachUser"
            :disabled="requesting"
            style="margin: 0 0 0 5px"
            icon="el-icon-search"
            type="primary"
            size="mini"
            circle
            plain
          ></el-button>
        </el-form-item>
      </el-form>

      <!-- 查询结果 -->
      <div class="searchResult" v-if="searchResult != null">
        <el-popover
          popper-class="photoPopover"
          placement="left-start"
          width="200"
          trigger="click"
        >
          <personal-card
            :userinfo="searchResult"
            :showFooter="false"
          ></personal-card>
          <div class="userinfo" slot="reference">
            <el-image
              fit="cover"
              style="padding: 0 0 0 10px"
              :src="searchResult.photourl"
            >
            </el-image>
            <span class="name" style="font-size: 16px; padding: 0 30px 0 15px">
              {{ searchResult.name }}
            </span>
          </div>
        </el-popover>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button
          v-show="searchResult != null"
          @click="sendRequestDialog = true"
          :disabled="alreadySend || requesting"
          type="primary"
          size="mini"
          >发送好友请求</el-button
        >

        <el-button plain type="primary" size="mini" @click="cancelSearch"
          >取 消</el-button
        >
      </span>
    </el-dialog>

    <!-- 创建群聊窗 -->
    <el-dialog
      title="创建群聊"
      :visible.sync="CreateGroupDialog"
      width="30%"
      :modal="false"
      :close-on-click-modal="false"
      custom-class="innerDialog"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button
          plain
          type="primary"
          size="mini"
          @click="CreateGroupDialog = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>

    <!-- 发送好友请求 -->
    <el-dialog
      title="发送验证消息"
      :visible.sync="sendRequestDialog"
      width="340px"
      :modal="false"
      :close-on-click-modal="false"
      custom-class="innerDialog"
    >
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="requestMessage"
        maxlength="48"
        :show-word-limit="requestMessage.length > 0"
        resize="none"
        :autosize="{ minRows: 2, maxRows: 3 }"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="sendFriendRequest" :disabled="requesting || alreadySend"
          >发 送</el-button
        >

        <el-button plain type="primary" size="mini" @click="cancelSendRequest"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template> 
<script>
import PersonalCard from '@/components/personalCard.vue'
export default {
  name: "plusMenue",
  components: {
    PersonalCard
  },
  data() {
    var checkWowId = (rule, value, callback) => {
      if (value !== "") {
        let regular = /^[a-zA-Z0-9.!@#$%^&_;~,?]+$/
        if (!regular.test(value)) {
          callback(new Error('存在特殊字符！'));
        }
        callback();
      }

    };
    return {
      SearchFriendDialog: false,
      CreateGroupDialog: false,
      sendRequestDialog: false,
      alreadySend: false,
      requesting: false,
      searchResult: null,
      searchWowIdForm: {
        searchWowId: '',
      },
      requestMessage: '',

      searchRules: {
        searchWowId: [
          { required: true, message: '请输入Wow号!', trigger: 'blur' },
          { min: 5, max: 18, message: '长度在 5 到 18 个字符!', trigger: 'blur' },
          { validator: checkWowId, trigger: 'blur' }
        ],
      },

    }

  },
  methods: {
    cleanSearch() {
      this.SearchFriendDialog = false
      this.searchWowIdForm.searchWowId = ''
      this.searchResult = null
      this.requesting = false
      this.alreadySend = false
    },
    cancelSearch() {
      this.cleanSearch()
    },
    cancelSendRequest() {
      this.sendRequestDialog = false
      this.requestMessage = ''
      this.requesting = false
    },
    seachUser() {
      //信息未改变不允许查询
      if (this.searchResult != null && this.searchResult.wowId == this.searchWowIdForm.searchWowId) {
        return
      }
      if(this.searchWowIdForm.searchWowId == this.currentUser.wowId){
        this.$message({
                message: '小伙汁，自己的信息就不用查了吧^~^',
                type: 'warning'
              });
        return      
      }
      this.$refs['searchWowIdForm'].validate((valid) => {
        if (valid) {
          this.searchResult = null
          this.requesting = true
          this.Api.postByXWForm('/user/queryUser', { "wowId": this.searchWowIdForm.searchWowId }).then(res => {
            if (res.data.success && res.data.data != null) {
              this.searchResult = res.data.data
            } else {
              this.$message({
                message: '不存在用户信息！',
                type: 'warning'
              });

            }
          }).finally(() => {
            this.requesting = false
          })

        } else {
          this.$message({
            message: '请输入正确信息！',
            type: 'warning'
          });
          return false;
        }
      })
    },
    sendFriendRequest() {
      if (this.searchResult == null) {
        return
      }
      let reg = /<[^>]+>+$/
      if(reg.test(this.requestMessage)){
        this.$message({
            message: '请勿输入特殊字符！',
            type: 'warning'
          });
        return
      }
      //先锁定按钮
      this.requesting = true
      this.Api.postRequest('/friend/sendRequest', { "receiverUuid": this.searchResult.uuid, "requestMessage": this.requestMessage }).then(res => {
        if (res.data.success) {
          this.$message({
            message: '发送成功！',
            type: 'success'
          });
          this.alreadySend = true
          this.sendRequestDialog = false
        } else {
          //请求失败时恢复按钮
          this.alreadySend = false
        }
      }).finally(() => {
        this.requesting = false
      })
    }
  },
  computed: {
    currentUser() {
      return this.$store.state['common'].currentUser.user
    }
  }
}
</script>


<style scoped>
div,
ul,
li {
  padding: 0;
  margin: 0;
}
.plusMenue {
  display: flex;
  justify-content: space-between;
}
.searchResult {
  text-align: left;
  width: 100%;
}
.searchResult .userinfo {
  height: auto;
  margin: 15px 0 0 0;
  padding: 5px 0 5px 0;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: rgb(241, 237, 237);
}
.searchResult .name {
  width: auto;
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  padding: 0 25px 0 0;
}
.searchResult .el-image {
  /* margin-top: 16px !important; */
  width: 34px !important;
  height: 34px !important;
  border-radius: 0;
  padding: 0;
}
</style>
<style>
.innerDialog .el-dialog__header {
  padding: 5px 10px 10px 0 !important;
  text-align: center !important;
}
.innerDialog .el-dialog__headerbtn {
  top: 6px !important;
  right: 6px !important ;
}
.innerDialog .el-dialog__body {
  padding: 5px 25px 15px 25px !important ;
  text-align: center !important;
  display: flex;
  flex-direction: column !important;
}
.innerDialog .el-dialog__footer {
  text-align: right !important;
  padding: 10px 25px 20px 25px !important;
}
.innerDialog .el-input__inner,
.el-input {
  border-radius: 6px !important;
  background-color: rgb(226, 226, 226) !important;
  height: 28px !important;
}
.innerDialog .el-form-item__content,
.el-input__icon,
.el-input__prefix,
.el-input__suffix {
  line-height: 28px !important;
}
.innerDialog .el-form-item__content {
  display: flex;
  justify-content: space-between;
}
.innerDialog .el-input__prefix,
.el-input__suffix {
  top: 0 !important;
}
</style>