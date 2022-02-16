<style scoped>

    .router-link-active {
                text-decoration: none;
                
            }
    .el-container{
        display: flex;
        flex-direction: column;
        width: 100%;
    }        
   .el-header{
        background-color: transparent;    
        border: solid 1px #8b8888;
        text-align: center;
        display: flex;              
        align-items: center;
        justify-content: space-between;
                
        position: relative;
        width: 100%;
        height: 60px;      
  
                
    } 

    #head-top{
        background: rgb(233, 227, 227);
        height: 600px;
        width: 100%;
        position: absolute;
        
    }
    .el-main{
        width: 100%;
    }

</style>
<template>
    <div>
        <div id="head-top">
            <el-header :style="headStyle" >
                <!-- 签名 -->
                <div id="sign">
                    <router-link to="/">
                        <strong style="color: #fff;font-size: 1.25rem;">CinLe~</strong>
                    </router-link>
                </div>
                <!-- 工具栏 -->
                <div id="navbar-collaspe">
                    <ul>

                    </ul>
                </div>
            </el-header> 
        </div>    
        
        <div style="height:1800px; width:500px ; color: rgba(255, 255, 255, 1) ;"></div>
    </div>    

</template>

<script>
export default {
    name:'home_v2',
    data() {
        return {


            headStyle: {
                background: "",
                height:''
                 
            }
        }
    },

    mounted() {
        window.addEventListener("scroll", this.handleScroll); //监听页面滚动
     },

    methods: {
        
        // 页面移动导航栏改变颜色
        handleScroll() {
        let scrollTop =
            window.pageYOffset ||
            document.documentElement.scrollTop ||
            document.body.scrollTop;
        //设置背景颜色的透明度
        if (scrollTop) {
            this.headStyle.background = "#2f4154";
            this.headStyle.height = "45px"
            
        } else if (scrollTop == 0) {
            this.headStyle.background = "transparent";
            this.headStyle.height = "60px"  
        }

    }
    },
        beforeDestroy() {
            window.removeEventListener("scroll", this.handleScroll);
        }


}
</script>

<style>

</style>