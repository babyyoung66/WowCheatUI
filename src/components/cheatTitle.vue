<template>
  <div class="title">
    <p class="name" v-if="cheatObj != null">{{ cheatObj.name }}</p>
    <el-popover
      popper-class="photoPopover"
      placement="right-start"
      width="200"
      trigger="click"
    >
      <!-- 个人信息卡片 -->
      <personal-card :userinfo="cheatObj"></personal-card>
      <i class="bi bi-three-dots cardIcon" slot="reference"></i>
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
      // console.log(this.$store.state['common'].currentCheatObj)
      return this.$store.state['common'].currentCheatObj
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
  width: 60%;
  padding: 25px 60px 0 24px;
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  font-size: 24px;
  color: black;
}
.cardIcon {
  padding: 25px 10px 0 20px;
  font-size: 20px;
}
</style>