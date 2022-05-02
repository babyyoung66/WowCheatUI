<template>
  <div class="title">
    <el-popover
      :disabled="cheatObj.type == null"
      v-show="(cheatObj != null && remarks == null) || remarks == ''"
      popper-class="photoPopover"
      placement="bottom"
      width="200"
      trigger="click"
    >
      <!-- 个人信息卡片 -->
      <personal-card :userinfo="cheatObj"></personal-card>
      <span slot="reference" class="name">
        <p
          class="username"
          style="line-height: 25px"
          v-show="(cheatObj != null && remarks == null) || remarks == ''"
        >
          {{ cheatObj.name }}
        </p>
        <p
          style="line-height: 23px"
          v-show="cheatObj != null && cheatObj.uuid == currentUser.uuid"
        >
          (自己)
        </p>
      </span>
    </el-popover>

    <el-popover
      :disabled="cheatObj.type == null"
      v-if="cheatObj != null && remarks != null && remarks != ''"
      popper-class="photoPopover"
      placement="bottom"
      width="200"
      trigger="click"
    >
      <!-- 个人信息卡片 -->
      <personal-card :userinfo="cheatObj"></personal-card>
      <!-- 有备注则展示备注 -->
      <p
        slot="reference"
        class="name"
        v-if="cheatObj != null && remarks != null && remarks != ''"
      >
        {{ cheatObj.concatInfo.remarks }}
      </p>
    </el-popover>

    <el-popover
      popper-class="photoPopover"
      placement="right-start"
      width="200"
      trigger="click"
    >
      <!-- 个人信息卡片 -->
      <personal-card :userinfo="cheatObj"></personal-card>
      <i
        class="bi bi-three-dots cardIcon"
        slot="reference"
        v-show="
          this.$store.state['common'].ListType == 'talkList' &&
          cheatObj.uuid != null
        "
      ></i>
    </el-popover>
  </div>
</template>
<script>
import PersonalCard from '@/components/personalCard.vue'
export default {
  name: "cheatTitle",
  data() {
    return {

    }
  },
  components: {
    PersonalCard
  },
  methods: {

  },
  computed: {
    cheatObj() {
      return this.$store.getters['common/getCurrentCheatObj']
    },
    //获取备注
    remarks() {
      if (this.cheatObj != null && this.cheatObj.concatInfo != null) {
        let remarks = this.cheatObj.concatInfo.remarks
        return remarks == '' ? null : remarks
      }
      return null
    },
    listType() {
      return this.$store.state['common'].ListType
    },
    currentUser() {
      return this.$store.state['common'].currentUser.user
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
.title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.name {
  width: auto;
  padding: 8px 60px 0 24px;
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  font-size: 24px;
  color: black;
  cursor: pointer;
  display: flex;
  flex-direction: row;
}
.cardIcon {
  padding: 25px 10px 0 20px;
  font-size: 20px;
}
</style>