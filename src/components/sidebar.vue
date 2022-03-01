<template>
  <div class="sidebar">
    <div class="searchbox">
      <el-autocomplete
        prefix-icon="el-icon-search"
        v-model="state"
        value-key="name"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        :trigger-on-focus="false"
        @select="handleSelect"
        clearable
        @clear="afterClear"
      ></el-autocomplete>

      <el-button  icon="el-icon-plus"></el-button>
    </div>

    <!-- 列表区域 -->
    <div class="listbox">
      <ul v-if="list != null">
        <li
          v-for="(it, index) in list"
          :key="index"
          @click="SelectList(it, index)"
          :class="{ onSelect: it.selected === true || currentClik == index }"
        >
          <span
            v-if="setClikIndex(it.selected, index)"
            style="display: none"
          ></span>
          <!-- 消息红点 -->
          <el-badge :is-dot="it.uncheck" class="item">
            <!-- 头像 -->
            <el-image fit="cover" :src="avatarUrl"> </el-image>

            <!-- <el-avatar
              shape="square"
              :size="100"
              fit="cover"
              :src="avatarUrl"
            ></el-avatar> -->
          </el-badge>
          <!-- 名称、时间、最新一条记录 -->
          <div class="peopleinfo">
            <div class="namewithTime">
              <!-- 名称 -->
              <span class="name" style="font-size: 18px">{{ it.name }}</span>

              <!-- 时间，取最近一条记录的时间，判断与当前时间间隔，分别显示昨天、前天、七天内显示星期、七天以上显示具体年月日 -->
              <span class="time">15:44</span>
            </div>
            <div class="recMessage">
              <p class="mess">
                this is a recently message6666666666666666666666
              </p>
            </div>
          </div>
        </li>
      </ul>
      <ul v-if="ListType == 'friend'"></ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  data() {
    return {
      //记录当前已选li的index，用于改变样式
      currentClik: -1,
      avatarUrl: '../static/logo.png',
      ListData: [{ "id": "15", "name": "qqq12", "uncheck": true },
      { "id": "14", "name": "22", "uncheck": false },
      { "id": "16", "name": "123ww", "uncheck": true },
      { "id": "17", "name": "aa", "uncheck": true },
      { "id": "18", "name": "cc", "uncheck": true },
      { "id": "19", "name": "dddddddddddasda sdasdddd", "uncheck": false },
      { "id": "20", "name": "222aaaa", "uncheck": true },
      { "id": "21", "name": "ccccc", "uncheck": false },
      { "id": "22", "name": "wwwww", "uncheck": true },
      { "id": "23", "name": "222aaaa", "uncheck": false },
      { "id": "24", "name": "hhhhh", "uncheck": true },
      { "id": "13", "name": "7777", "uncheck": true },
      { "id": "12", "name": "黄军乐", "uncheck": false }
      ],
      state: '',
      // 列表类型，后续使用vuex动态切换
      //ListType:''
    }
  },
  methods: {
    querySearch(queryString, cb) {
      let restaurants = this.queryData;
      //获取一个查询数组
      let results = queryString ? restaurants.filter(this.fuzzyFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    // 模糊查询
    fuzzyFilter(queryString) {
      return (restaurant) => {
        //跟据name或id匹配查询结果 indexOf >= 0则模糊匹配，indexOf == 0则精确匹配
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) >= 0) || (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
      };
    },
    // 准确查询
    accurateFilter(queryString) {
      return (restaurant) => {
        //跟据name或id匹配查询结果 indexOf >= 0则模糊匹配，indexOf == 0则精确匹配
        return (restaurant.id.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    // 搜索内容选择后触发的事件,传入的是一个JSON对象
    handleSelect(item) {
      // 选中当前li，并将该值移到数组首位
      let select = { "selected": true }
      let unselect = { "selected": false }
      //将当前高亮的currentClik切到当前
      if (this.currentClik != -1) {
        Object.assign(this.list[this.currentClik], unselect)
      }
      this.moveToTop(item)
      this.currentClik = 0
      //清除未读状态
      if (item.uncheck == true) {
        this.list[0].uncheck = false
      }

      //移动滚动条到首位
      var scroll = document.querySelector(".listbox ul")
      if (scroll.scrollTop - 40 > 0) {
        scroll.scrollTo(0, 0)
      }
      //设置为选中
      this.SelectList(item, 0)

    },
    //将搜索内容放到li首位
    moveToTop(item) {
      let i = 0
      this.list.forEach(element => {
        if (element.id === item.id) {
          this.list.splice(i, 1)
          return
        }
        i++
      });

      this.list.unshift(item)
      //console.log(this.ListData)
    },

    //清除搜索内容时使输入框重新聚焦，因为不重新聚焦下次搜索时搜索建议会消失
    afterClear() {
      // document.activeElement获得了DOM中被聚焦的元素；.blur()取消聚焦
      let active = document.activeElement
      active.blur()
      active.focus()
    },

    // 选择列表内容时
    SelectList(data, index) {
      let select = { "selected": true }
      let unselect = { "selected": false }
      //将当前高亮的currentClik切到当前
      if (this.currentClik != -1) {
        Object.assign(this.list[this.currentClik], unselect)
      }
      //.selected = false
      Object.assign(this.list[index], select)
      //.selected = true
      this.list[index].uncheck = false
      this.currentClik = index
      //更新vuex数据
      this.$store.commit('list/setCurrentCheatObj', data)

    },
    //获取缓存中已标记选择的index
    setClikIndex(selected, index) {
      if (selected === true) {
        this.currentClik = index
        return
      } else {
        return
      }
    }

  },
  //绑定vuex数据
  computed: {
    //根据对话对象计算已选择位置

    ListType() {
      return this.$store.state['list'].ListType
    },
    checkdata() {
      return this.$store.getters['list/getListByType'](this.ListType)
    },
    list() {
      if (this.checkdata != null) {
        this.$store.commit('list/setCache', this.ListType)
        return this.$store.getters['list/getListByType'](this.ListType)
      } else {
        let type = this.$store.state['list'].cache
        return this.$store.getters['list/getListByType'](type)
      }

    },
    SelectedIndex() {
      return this.$store.getters['list/getSelectedIndex']
    },
    queryData() {
      return this.$store.getters['list/getQueryData']
    }

  },
  //初始化状态
  created() {
    // let dd = [{ "id": "dd", "name": "通讯1"},
    //   { "id": "aa", "name": "通讯2" },
    //   { "id": "ww", "name": "通讯3" },
    //   { "id": "qq", "name": "通讯4" },
    //   { "id": "ss", "name": "通讯4" }]
    // this.$store.commit('list/setMessageList',this.ListData) 
    // this.$store.commit('list/setFriendsList',dd) 
    // this.ListType = this.$store.state['common'].ListType

  },

}
</script>
<style scoped>
div,p{padding: 0;margin: 0;}
/* 查询栏父div */
.searchbox {
  height: 60px;
  /* border-bottom: solid 1px rgb(217, 217, 217); */
  background-color: rgb(247, 247, 247);
  display: flex;
  /* justify-content: start; */
  align-items: center;
  overflow: hidden;
}

/* 列表样式 */
.listbox {
  height: 91%;
  /* overflow: hidden; */
  border: solid 0.5px rgb(236, 236, 236);
  background-color: rgb(237, 234, 232);
}
/* 选中某个li时的样式 */
.onSelect {
  background-color: rgb(202, 200, 198);
}
/* 头像 */
.el-image {
  /* margin-top: 16px !important; */
  width: 35px !important;
  height: 35px !important;
  border-radius: 0;
}
.el-badge {
  padding: 0 0 0 10px;
}
.namewithTime {
  padding: 5px 0 0 0;
  display: flex;
  justify-content: space-between;
}
.mess{
  margin-bottom: 5px;
}

.listbox .peopleinfo {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* align-content: stretch; */
  width: 100%;
  height: 48px !important;
  overflow: hidden;
  padding: 0 0 0 14px;
}
.peopleinfo .time,
.mess {
  color: rgb(129, 129, 129);
  font-size: 12px;
}
.peopleinfo .time {
  width: auto;
  padding: 0 16px 0 0;
}
/* 超宽的名字和消息使用省略号 */
.name,
.recMessage .mess {
  width: auto;
  word-break: keep-all; /*不换行*/
  white-space: nowrap; /*不换行*/
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  padding: 0 25px 0 0;
}
</style>


<style>
/* 继承或覆盖父属性则放在此 */
/* 查询输入框 */
.el-autocomplete {
  padding: 0 8px 0 8px !important;
  width: 80%;
}
.searchbox .el-autocomplete .el-input__inner,
.el-input {
  border-radius: 6px !important;
  background-color: rgb(226, 226, 226);
  height: 25px;
}
/* 搜索图标及清空图标 */
.searchbox .el-input__prefix,.el-input__suffix {
  top: -7px;
}
.searchbox .el-autocomplete .el-input {
  font-size: 14px;
}

/* 加号 */
.searchbox .el-button {
  /* margin-top: 20px ; */
  padding: 0;
  width: 20px;
  height: 20px;
  background-color: rgb(226, 226, 226) !important;
}
.el-button .el-icon-plus {
  font-size: 14px !important;
  font-weight: bold;
}

/* 搜索框提示字体颜色 */
input::-webkit-input-placeholder {
  color: rgb(129, 129, 129) !important;
}
input:-moz-input-placeholder {
  color: rgb(129, 129, 129) !important;
}
input:-ms-input-placeholder {
  color: rgb(129, 129, 129) !important;
}
.listbox ul {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* 开启滚动条 */
  /* overlay 将滚动条浮动在元素上，不另外占用宽度（只兼容Chrome内核） */
  /* overflow:overlay ; */
}
/* 将滚动调设置成悬停出现 */
.listbox ul:hover {
  overflow: overlay;
}
/* ul列表滚动条样式 */
.listbox ul::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 7px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
  /* display: none; */
}
.listbox ul::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  background-color: rgba(185, 183, 180, 0.6);
}
/*滚动条里面轨道*/
.listbox ul::-webkit-scrollbar-track {
  /* box-shadow: inset 0 0 5px rgb(255, 255, 255);
  background: #ededed;
  border-radius: 10px; */
  display: none;
}

/* li样式 */
.listbox ul li {
  list-style: none;
  display: flex;
  justify-content: space-between;
  height: 55px;
  align-items: center;
  width: 100%;
  padding: 0;
}

/* li高亮设置 */
.listbox ul li:hover {
  background-color: rgb(214, 211, 209);
}
</style>