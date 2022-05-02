<template >
  <div
    class="infocard"
    v-loading="userinfo == null || !userinfo"
    v-if="userinfo != null"
  >
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
          <div v-show="userinfo.type !== 'group'">
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
        <div class="idinfo" v-show="userinfo.type !== 'group'">
          <el-tooltip
            popper-class="btnitem"
            effect="dark"
            :content="userinfo.wowId"
            placement="bottom"
          >
            <p>wowId: {{ userinfo.wowId }}</p>
          </el-tooltip>
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
    <div class="splice"></div>
    <!-- 备注 -->

    <div v-show="userinfo.uuid != currentUserUUid" class="remarks">
      <div
        v-if="
          userinfo.concatInfo != null &&
          userinfo.concatInfo.remarks != null &&
          userinfo.concatInfo.remarks != ''
        "
        class="remarksLabel"
      >
        备　注
      </div>
      <div class="remarks_Name">
        <p
          v-if="
            userinfo.concatInfo != null &&
            userinfo.concatInfo.remarks != null &&
            userinfo.concatInfo.remarks != ''
          "
          style="margin: 0"
        >
          {{ userinfo.concatInfo.remarks }}
        </p>
      </div>
    </div>
    <!-- 地址信息 -->
    <div class="address" v-show="userinfo.type !== 'group'">
      <div class="addrTi">地　区</div>

      <div class="addrdetail">
        <el-tooltip
          popper-class="btnitem"
          effect="dark"
          :content="userinfo.address"
          placement="bottom"
        >
          <p style="margin: 0">{{ userinfo.address }}</p>
        </el-tooltip>
      </div>
    </div>
    <!-- 菜单按钮 -->
    <div class="menue" v-show="showFooter">
      <i class="bi bi-reply"></i>

      <i @click="sendMessage" class="bi bi-chat"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "personalCart",
  //由父组件在标签使用:userinfo="xxx"传入具体展示信息
  props: {
    userinfo: {
      required: true
    },
    //是否显示底部图标按钮,默认显示
    showFooter: {
      default: true
    },
  },
  data() {
    return {
      sexIcons: ["./static/icon_women.gif", "./static/icon_man.gif"],
      //userinfo: {} //改由父组件传入数据
    }
  },
  methods: {
    sendMessage() {
      if (this.userinfo == null) {
        return
      }
      let info = null
      if(this.userinfo.type == 'personal'){
        info = this.$store.state['common'].FriendsMap[this.userinfo.uuid]
      }
      if(this.userinfo.type == 'group'){
        info = this.$store.state['common'].GroupsMap[this.userinfo.uuid]
      }
      if (info != null) {
        //为好友时
        this.$store.commit('message/InitUserMessage', info)
        this.$store.state['common'].currentCheatObj = info
        this.$store.dispatch('common/upDateConcatTime', info)
        this.$store.commit('common/setUserOnTopOfTalkList', info)
        this.$store.state['common'].ListType = 'talkList'
        this.$store.state['common'].messageFormType = info.type
      } else {
        this.$message.warning({
          message: '未添加好友或群聊！',
          duration: 2500
        });
      }


    }
  },
  computed: {
    // 设置图片预览
    previewSrcList() {
      var imags = []
      imags.push(this.userinfo.photourl)
      return imags
    },
    currentUserUUid() {
      return this.$store.state['common'].currentUser.user.uuid
    },
    talkList() {
      return this.$store.state['common'].talkList
    }
  }


}
</script>

<style scoped>
div,
p {
  padding: 0;
  margin: 0;
}
.maininfo .el-image {
  padding: 24px 32px 0 18px !important;
  width: 62px !important;
  height: 62px !important;
  border-radius: 0;
}
.infocard {
  /* width: 100%; */
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: space-around;
}
.maininfo {
  /* overflow: hidden; */
  display: flex;
  width: 100%;
  height: auto;
  justify-content: space-between;
  border: 0mm;
}
.idname {
  overflow: hidden;
  padding: 18px 0 0 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: auto;
  width: auto;
}

.idname .name {
  margin-bottom: 0;
  height: auto;
}
.idname .name {
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;

  text-align: left;
  font-size: 18px;
  color: black;
}
.nameandicon {
  display: flex;

  text-align: center;
  align-items: center;
}
.sexicon {
  object-fit: fill;
  width: 16px;
  height: 16px;
  padding: 0 3px 0 3px;
  /* padding-top: 42px; */
}

.idname .idinfo p {
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 14px;
  text-align: left;
  padding-top: 6px;
  font-size: 14px;
  color: rgb(171, 172, 173);
}

.splice {
  border-top: solid rgb(217, 217, 217) 0.1mm;
  margin: 22px 40px 0 40px;
}

.remarks {
  width: auto;
  height: auto;
  padding: 20px 32px 0 32px;
}
.remarksLabel {
  height: auto !important;
}

.address {
  width: auto;
  max-height: 60px;
  overflow: hidden;
  margin: 8px 0 0 0;
  padding: 0 32px 0 32px;
}
.address p {
  display: inline;
}
.addrTi,
.remarksLabel {
  width: auto;
  height: 60px;
  font-size: 14px;
  color: rgb(171, 172, 173);
  float: left;
}
.addrdetail,
.remarks_Name {
  width: auto;
  height: auto;
  padding: 0 0 0 12px;
  font-size: 14px;
  color: black;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-align: left;
}
.menue {
  height: 68px;

  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  padding: 0 32px 10px 32px;
}
.menue i {
  font-size: 24px;
  padding: 5px 5px 15px 5px;
}
/* 没有合适的图标，翻转使用 */
.menue .bi-reply::before {
  transform: rotateY(180deg);
  font-size: 28px;
}
.menue .bi.bi-chat:hover {
  color: rgb(216, 212, 212);
}
</style>

