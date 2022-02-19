<template >
  <div class="infocard">
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
            <img class="sexicon" v-if="userinfo.sex == 1" :src="sexIcons[1]" alt="" />
            <img class="sexicon" v-if="userinfo.sex == 0" :src="sexIcons[0]" alt="" />
         
        </div>
        <div class="idinfo">
          <el-tooltip
            popper-class="btnitem"
            effect="dark"
            :content="userinfo.id"
            placement="bottom"
          >
            <p>Wow号:　{{ userinfo.id }}</p>
          </el-tooltip>
        </div>
      </div>
      <!-- 头像 -->
      <div class="photo">
        <el-image :src="userinfo.photourl" :preview-src-list="previewSrcList">
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
  data() {
    return {
      // 图片预览url
      previewSrcList: ['http://127.0.0.1:8888/static/logo.png'],
      sexIcons: ["../static/icon_woman.png", "../static/icon_man.png"],
      userinfo: { "id": "1494927850762149888", "name": "Level6", "sex": 1, "photourl": "../static/logo.png", "address": "中国广西贵港市覃塘区" }
    }
  },
  methods: {



  },
}
</script>

<style scoped>
div,p{
  padding: 0;
  margin: 0;
}
.el-image {
  margin: 0 !important;
  width: 75px !important;
  height: 75px !important;
  border-radius: 0;
}
.infocard {
  width: 370px;
  height: 315px;
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
  padding: 26px 0 0 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: auto;
  width: auto;
  margin: 0;
}

.idname .name {
  margin: 0;
  margin-bottom: 0;
  height: auto;
}
.idname .name {
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;

  text-align: left;
  font-size: 24px;
  color: black;
}
.nameandicon {
  display: flex;
  
  text-align: center;
  align-items: center;
  padding: 0;
  margin: 0;
}
.sexicon {
  object-fit: cover;
  width: 21px;
  height: 24px;
  /* padding-top: 42px; */
}


.idname .idinfo p {
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 16px;
  margin-top: 0;
  text-align: left;
  padding-top: 6px;
  font-size: 17px;
  color: rgb(171, 172, 173);
}

.photo {
  padding: 34px 48px 0 24px;
}
.splice {
  border-top: solid rgb(217, 217, 217) 0.1mm;
  margin: 22px 48px 0 48px;
}
.address {
  width: auto;

  max-height: 90px;
  overflow: hidden;
  padding: 22px 40px 0 40px;
}
.addrTi {
  padding: 0 10px 0 0;
  width: auto;
  height: 90px;
  font-size: 18px;
  color: rgb(171, 172, 173);
  float: left;
}
.addrdetail {
  width: auto;
  height: auto;
  padding: 0 0 0 20px;
  font-size: 18px;
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
  padding: 0 40px 10px 40px;
}
.menue i {
  font-size: 30px;
  padding: 5px 5px 15px 5px;
}
/* 没有合适的图标，翻转使用 */
.menue .bi-reply::before {
  transform: rotateY(180deg);
  font-size: 40px;
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