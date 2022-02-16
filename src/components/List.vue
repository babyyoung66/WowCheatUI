<template>
  <div class="sidebar">
    <div class="searchbox">
      <el-autocomplete
        
        v-model="state"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        
        @select="handleSelect"
      ></el-autocomplete>
    </div>
    <div class="listbox"></div>
  </div>
</template>

<script>
export default {
  name: "List",
  data() {
    return {
      restaurants: [],
      state1: '',
      state: ''
    }
  },
  methods: {
    querySearch(queryString, callback) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      callback(results);
    },
    createFilter(queryString) {
        
      return (restaurant) => {
        return (restaurant.nikname.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    getData() {
        // 获取数据方法，可以在初始加载的时候缓存在localStorage中，然后再从中获取
      return [
        { "id": "13", "nikname": "覃曦" },
        { "id": "13", "nikname": "覃曦2" },
        { "id": "13", "nikname": "覃曦3" },
        { "id": "12", "nikname": "黄军乐" }
      ];
    },
    //   选择后触发的事件
    handleSelect(item) {
      console.log(item);
    }

  },
  mounted() {
    this.restaurants = this.getData();
  }
}
</script>
<style scoped>
.searchbox {
  height: 80px;
  /* border-bottom: solid 1px rgb(217, 217, 217); */
  background-color: rgb(247, 247, 247);
}
.listbox {
  height: 90%;
  border: solid 0.5px rgb(236, 236, 236);
  background-color: rgb(234, 232, 231);
}
</style>