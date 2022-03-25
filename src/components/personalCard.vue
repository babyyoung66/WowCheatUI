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
        <div class="idinfo">
          <el-tooltip
            popper-class="btnitem"
            effect="dark"
            :content="userinfo.wowId"
            placement="bottom"
          >
            <p>Wow号: {{ userinfo.wowId }}</p>
          </el-tooltip>
        </div>
      </div>
      <!-- 头像 -->
      <div class="photo">
        <el-image fit="cover" :src="userinfo.photourl" :preview-src-list="previewSrcList">
        </el-image>
        <!-- <el-avatar
          shape="square"
          :size="100"
          fit="cover"
          :src="userinfo.photourl"
          :preview-src-list="previewSrcList"
        ></el-avatar> -->
      </div>
    </div>
    <!-- 分割线 -->
    <div class="splice"></div>
    <!-- 备注 -->

    <div
      v-if="userinfo.concatInfo !=null && userinfo.concatInfo.remarks !=null && userinfo.uuid != currentUserUUid"
      class="remarks"
    >
      <div class="remarksLabel">备　注</div>
      <div class="remarks_Name"><p style="margin: 0">{{ userinfo.concatInfo.remarks }}</p></div>
    </div>
    <!-- 地址信息 -->
    <div class="address">
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
    <div class="menue">
      <i class="bi bi-reply"></i>

      <i class="bi bi-chat"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "personalCart",
  //由父组件在标签使用:userinfo="xxx"传入具体展示信息
  props: {
    userinfo: {}
  },
  data() {
    return {
      // 图片预览url
      //previewSrcList: ['http://127.0.0.1:8080/WowCheat/files/1.png'],
      sexIcons: ["../static/icon_woman.png", "../static/icon_man.png"],
      //userinfo: {} //改由父组件传入数据
    }
  },
  methods: {

  },
  computed: {
    // 设置图片预览
    previewSrcList() {
      var imags = []
      imags.push(this.userinfo.photourl)
      return imags
    },
    currentUserUUid(){
      return this.$store.state['common'].currentUser.user.uuid
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
.el-image {
  padding: 24px 32px 0 18px !important;
  width: 62px !important;
  height: 62px !important;
  border-radius: 0;
}
.infocard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: space-around;
}
.maininfo {
  overflow: hidden;
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
  object-fit: cover;
  width: 16px;
  height: 20px;
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
  margin: 8px 0 0 0 ;
  padding: 0 32px 0 32px;
}
.addrTi,
.remarksLabel {
  width: auto;
  height: 60px;
  font-size: 14px;
  color: rgb(171, 172, 173);
  float: left;
}
.addrdetail,.remarks_Name {
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
</style>

<style>
/* tooltip下弹出的箭头样式 */
.btnitem[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: transparent !important;
}
.btnitem[x-placement^="bottom"] .popper__arrow::after {
  border-bottom-color: rgba(37, 49, 57, 0.7) !important;
}
.btnitem.el-tooltip__popper {
  max-width: 200px !important;
}
</style>