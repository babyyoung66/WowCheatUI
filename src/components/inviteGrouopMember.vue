<template>
  <div class="invateMember">
    <div class="friendList">
      <ul>
        <!-- <li v-for="(it,index) in friendList" :key="index">
                {{it.name}}
            </li> -->
        <!-- 好友 -->
        <li
          class="userli"
          v-for="(it, index) in friendList"
          :key="'personal' + index"
          :ref="it.uuid"
          style="justify-content: start"
          :class="{ onSelect: memberIds.indexOf(it.uuid) !== -1 }"
          @click="selectMember(it.uuid)"
        >
          <!-- @contextmenu="rightClik(index, it, $event)" -->
          <!-- 头像 -->
          <el-image fit="cover" style="padding: 0 0 0 10px" :src="it.photourl">
          </el-image>
          

          <div class="nameAndChecked">
            <!-- 原名称 -->
          <span
            v-if="
              it.concatInfo == null ||
              it.concatInfo.remarks == null ||
              it.concatInfo.remarks == ''
            "
            class="name ellipsisWord"
        
          >
            {{ it.name }}
          </span>
            <!-- 备注 -->
            <span
              v-if="
                it.concatInfo != null &&
                it.concatInfo.remarks != null &&
                it.concatInfo.remarks != ''
              "
              class="name ellipsisWord"
            
            >
              {{ it.concatInfo.remarks }}
            </span>
            <span style="width: 20px">
              <i
                v-show="memberIds.indexOf(it.uuid) !== -1"
                class="bi bi-check2-square"
              ></i>
            </span>
          </div>
        </li>
      </ul>
    </div>

    <div class="Btn">
      <span v-if="type == 'invite'"
        ><el-button
          :disabled="requesting || requestSuccess"
          type="primary"
          size="small"
          @click="inviteMember"
          element-loading-text="请求中..."
          :loading="requesting"
          >邀请加入</el-button
        ></span
      >
      <span v-if="type == 'create'"
        ><el-button
          :disabled="requesting || requestSuccess"
          type="primary"
          size="small"
          element-loading-text="请求中..."
          :loading="requesting"
          >创建群聊</el-button
        >
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "inviteGroupMember",
  props: {
    //类型，邀请(invite)或创建(create)
    type: {
      type: String, //类型
      required: true, //必要性
      validator: (value) => {
        // 这个值必须匹配下列字符串中的一个
        return ['invite', 'create'].indexOf(value) !== -1
      }
    },
    //type 为邀请时必填
    groupInfo: null

  },
  data() {
    return {
      requesting: false,
      requestSuccess: false,
      memberIds: []
    }
  },
  methods: {
    selectMember(uuid) {
      let index = this.memberIds.indexOf(uuid)
      if (index !== -1) {
        //已存在，说明需要移除
        this.memberIds.splice(index, 1)
      } else {
        this.memberIds.push(uuid)
      }
    },
    onselect(uuid) {
      return this.memberIds.indexOf(uuid) !== -1
    },
    inviteMember() {
      if (this.requesting) {
        return
      }
      if (this.groupInfo == null) {
        this.$message.warning({
          message: '请选择群聊！',
          duration: 2000
        })
        return
      }
      if (this.memberIds.length == 0) {
        this.$message.warning({
          message: '请选择好友！',
          duration: 2000
        })
        return
      }
      this.requesting = true
      let info = { "groupId": this.groupInfo.uuid, "memberIds": this.memberIds }
      this.Api.postRequest('/group/inviteMembers', info).then(res => {
        if (res.data.success) {
          let result = res.data.data
          if (result != null) {
            //拼接邀请结果
            let message = ''
            result.forEach(element => {
              let info = element.name
              if (info == null) {
                info = element.uuid
              }
              if (info.length > 6) {
                info = info.slice(0, 6) + '...'

              }
              if (element.success) {
                message += '成功邀请【<span class="inviteResult">' + info + '</span>】加入群聊<br>'
              } else {

                message += '【<span class="inviteResult">' + info + '</span>】邀请失败，原因：' + element.message + '<br>'
              }
            });
            this.$alert(message, {
              dangerouslyUseHTMLString: true,
              title: '邀请结果',
            });

            // this.$message.info({
            //   dangerouslyUseHTMLString: true,
            //   title: '邀请结果',
            //   message: message,
            //   duration: 0,
            //   showClose: true
            // })
          }
        }

      }).finally(() => {
        this.requesting = false
      })
    }
  },
  computed: {
    friendList() {
      return this.$store.getters['common/getFriendsList']
    }
  }
}

</script>

<style scoped>
.nameAndChecked{
  padding: 0 6px 0 12px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 76%;
}
.name {
  font-size: 16px; 
  max-width: 70%;
}
.invateMember {
  text-align: -webkit-center;
}
.friendList {
  width: 85%;
  height: 300px;
}
.friendList ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* li样式 */
.friendList .userli {
  list-style: none;
  display: flex;
  justify-content: space-between;
  height: auto;
  padding: 4px 0;
  align-items: center;
  width: 100%;
  cursor: pointer;
}

/* 头像 */
.friendList .el-image {
  /* margin-top: 16px !important; */
  width: 34px !important;
  height: 34px !important;
  border-radius: 0;
  padding: 0 0 0 10px;
}
.onSelect {
  background-color: rgb(202, 200, 198);
}
.Btn {
  margin: 8px 0 0 0;
}
/* li高亮设置 */
.friendList li:hover {
  background-color: rgb(214, 211, 209);
}
/* 将滚动调设置成悬停出现 */
.friendList ul:hover {
  overflow: overlay;
}
/* ul列表滚动条样式 */
.friendList ul::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  /* display: none; */
}
.friendList ul::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: rgba(185, 183, 180, 0.6);
}
/*滚动条里面轨道*/
.friendList ul::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 5px rgb(255, 255, 255);
  background: #ededed;
  border-radius: 10px; */
  display: none;
}
</style>

<style>
/* 邀请结果提示姓名样式 */
.inviteResult {
  width: 120px;
  word-break: keep-all;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>