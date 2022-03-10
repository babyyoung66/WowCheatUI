<template>
  <div>
    <div v-show="contextMenue.contextMenuVisible">
      <ul
        :style="{
          left: contextMenue.left + 'px',
          top: contextMenue.top + 'px',
        }"
        class="contextmenu"
      >
        <li><el-button type="text" @click="this.$emit(delfunc)" size="mini">删除聊天</el-button></li>
        <li><el-button type="text" @click="this.$emit(closefunc)" size="mini">关闭所有</el-button></li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: "contextmenu",
  props: {
    contextMenuVisible: false,
    delfunc:'',
    closefunc:''

  },
  data() {
    return {

      top: 0,
      left: 0
    }
  },
  methods: {
    openMenu(e) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY - 60 // fix 位置bug
      this.visible = true
    },
    closeMenu() {
      this.visible = false
    }

  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
}
</script>
<style scoped >
.contextmenu {
  width: 100px;
  margin: 0;
  border: 1px solid #ccc;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.2);
}
.contextmenu li {
  margin: 0;
  padding: 0px 22px;
}
.contextmenu li:hover {
  background: #f2f2f2;
  cursor: pointer;
}
.contextmenu li button {
  color: #2c3e50;
}
</style>