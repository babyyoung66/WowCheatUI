
<template>
    <div id="vue">
            <el-container>
                <!-- 头部导航 -->
                <el-header height="50px" >
                
                  <!-- 右侧导航 -->
                  <el-row id="headleft"  :gutter= '60' >
                    
                      <el-col :xs="0" :sm="14" :md="8" :lg="8" :xl="1" >
                        <el-breadcrumb separator="/">
                          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                          <el-breadcrumb-item :to="{ path: '/note' }">公告</el-breadcrumb-item>
                          <el-breadcrumb-item :to="{ path: '/www.baidu.com' }">社区论坛</el-breadcrumb-item>
                          <el-breadcrumb-item :to="{ path: '/www.baidu.com' }">博文创作</el-breadcrumb-item>
                         
                        </el-breadcrumb>
                      </el-col>

                      <el-col :xs="24" :sm="9" :md="6" :lg="6" :xl="3">
                        <el-form id="search-form" @submit.native.prevent>
                          <el-input
                            placeholder="请输入搜索内容"
                            prefix-icon="el-icon-search"
                            v-model="search" 
                            :clearable = true
                            @keyup.enter.native="searchinfo"
                           
                            >
                          </el-input>
                        </el-form>
                      </el-col>
                      
              
                  </el-row>
                  
                  <el-dropdown  @command="handleCommand">
                   
                    <span class="el-dropdown-link">
                      <i style="font-size: 40px" class="el-icon-arrow-down el-icon-user" ></i>
                      <p>{{user.username}}</p>
                    </span>
                    <el-dropdown-menu slot="dropdown" @submit.native.prevent>
                      <router-link to="/login"><el-dropdown-item v-if="!loginStatus" >登录</el-dropdown-item> </router-link>
                      <el-dropdown-item v-if="!loginStatus"  command="Register">注册</el-dropdown-item>
                      <el-dropdown-item v-if="loginStatus" command="c">个人中心</el-dropdown-item>
                      <el-dropdown-item v-if="loginStatus"  command="d">博客文章</el-dropdown-item>
                      <el-dropdown-item v-if="loginStatus" command="logout" divided>退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  

                <!--   
                  <el-row class="hidden-md-and-down" id="headright" style="margin-right: 50px;">
                  
                      <el-col  :xs="0" :sm="5" :md="5" :lg="5" :xl="5" >
                      <el-button v-if="!loginStatus" type="primary"   @click="login">登录</el-button>
                      <el-button v-if="!loginStatus" type="primary">注册</el-button>
                      <el-button v-if="loginStatus" type="primary" @click="loginout">注销</el-button>
                    </el-col>
                  </el-row>
                   
                  -->
                      
                </el-header>
              <el-container id="asideDiv">
                <!-- 侧边栏 -->
                <el-aside style="width: auto;" >
                  <el-menu
                  :collapse="isCollapse"
                  default-active="2"
                  class="el-menu-vertical-demo"
                  background-color="#545c64"
                  text-color="#fff"
                  active-text-color="#ffd04b">

                  <el-submenu index="1">
                    <template slot="title">
                      <i class="el-icon-location"></i>
                      <span>导航一</span>
                    </template>
                    <el-menu-item-group>
                      <template slot="title">分组一</template>
                      <el-menu-item index="1-1">选项1</el-menu-item>
                      <el-menu-item index="1-2">选项2</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group title="分组2">
                      <el-menu-item index="1-3">选项3</el-menu-item>
                    </el-menu-item-group>
                    <el-submenu index="1-4">
                      <template slot="title">选项4</template>
                      <el-menu-item index="1-4-1">选项1</el-menu-item>
                    </el-submenu>
                  </el-submenu>
                  <el-menu-item index="2">
                    <i class="el-icon-menu"></i>
                    <span slot="title">导航二</span>
                  </el-menu-item>
                  <el-menu-item index="3" disabled>
                    <i class="el-icon-document"></i>
                    <span slot="title">导航三</span>
                  </el-menu-item>
                  <el-menu-item index="4">
                    <i class="el-icon-setting"></i>
                    <span slot="title">导航四</span>
                  </el-menu-item>
                </el-menu>
                </el-aside>
                <div >
                  <el-button  v-if="!isCollapse" @click="ChanceNavStatus" style="height: 20px; width: 18px; padding: 0; background-color: rgba(240, 234, 234, 0.842);" icon="el-icon-d-arrow-left"  ></el-button>
                  <el-button  v-if="isCollapse" @click="ChanceNavStatus"  style="height: 20px; width: 18px; padding: 0; background-color: rgba(240, 234, 234, 0.842);" icon="el-icon-d-arrow-right" ></el-button>  
                </div>
                 <el-container>
                    <!-- 中部消息 -->
                    <el-main>
                        <el-dialog
                            title="提示"
                            :visible.sync="Logindialog"
                            width="30%"
                            >                           
                       </el-dialog>
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
        </div>
</template>
<script>
    export default{
        name:'home_v1',
        data(){
      return{
       isCollapse:false,
       search:'',
       info:'',
       drawer: true,
       user:'',
       loginStatus:false,
       Logindialog: false
      };
            
    },
    created() {
      /* 初始化数据方法 */
      let UseerSession = window.sessionStorage.getItem('userinfo') 
      if(UseerSession != null){
           this.loginStatus = true
           this.user = JSON.parse(UseerSession)
           
      }
       
     },
    methods: {
     searchinfo(){
         this.info = '数据查询到：' +this.search
         },
     
     loginout(){
       window.sessionStorage.removeItem("userinfo")
       window.location.reload()
     },
     Register(){
       /* 注册方法 */
     },
     ChanceNavStatus(){
         let st = this.isCollapse
         if(st){
           this.isCollapse = false
         }else{
           this.isCollapse = true
         }
     },
     handleCommand(command) {
       /* 登录下拉框 */
       
         if(command == 'longin'){
           this.login()
         }
         if(command == 'Register'){
           this.Register()
         }
         if(command == 'logout'){
           this.loginout()
         }
       } 
   },  
    }
</script>
<style scoped>
            #vue {
                height: 100%;
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                }
           
            .el-header{
                border: solid 1px #e6e6e6;
                text-align: center;
                display: flex;              
                align-items: center;
                justify-content: space-between;
            }

            .el-container,.el-container,.el-container {
            width: 100%;
            min-height: 100%;
            display: flex;
            align-content:space-between;
            }
            .el-main {
            height: 100%;
            overflow: hidden;
            }
            
            
        
            /* 搜索框样式 */
             .el-input /deep/ .el-input__inner {
               border-radius: 25px !important;
            }
 

           /* 顶栏相关样式 */
            #headleft{
              /* 顶部左侧面包屑及搜索栏 */
              text-align: center;
              display: flex;
              align-items: center;
              
            }
            #headright{
                /* 顶部右侧登录相关按钮 */
                display: flex;
                flex-flow: row nowrap;
            }
            .el-row div:nth-child(3) {
              justify-self: flex-end;
            }
            
            .el-col{  
              /* 设置为flex会导致栅栏格式失效 
              display: flex;
              align-items: center;
              flex-wrap: nowrap;*/
              width: auto;
            } 
            
           
            .el-breadcrumb__inner {
              font-size: large;
            
            }

            .el-breadcrumb{
              /* 面包屑导航 */
              display: flex;
              flex-flow:row wrap;

            }

          

            /* 以下为侧边栏样式修改 */
            .el-aside ul{
              margin-block-start: 0px;
              margin-block-end: 0px;
              margin-inline-start: 0px;
              margin-inline-end: 0px;
              padding-inline-start: 0px;
            }
            .el-tooltip{
              /* !important element.style内联样式使用次方法才会生效 */
              padding: 0px 10px 0px 10px !important;
              width: auto;   
            }
            .el-submenu__title {
              padding: 0px 10px 0px 10px !important; 
              width: auto;  
            }
            .el-menu-item{
              padding: 0px 10px 0px 10px !important; 
            }
            .el-menu--collapse {
              width: auto;
            }
            .el-aside{
                background-color:rgb(2, 31, 48);
                line-height: 100%;
                overflow: hidden;
                color: rgb(250, 249, 249);
                
            }
            .el-aside span {
                min-width: 100%;
                height: 30px;
                text-align: center;
                line-height: 30px;
            }
            /* 登录下拉框相关，小屏时显示 */
            .el-dropdown{
              font-size: 14px !important;
              margin-right: 15px !important;
            }
            .el-dropdown-link{
                display: flex;
                
            }
            
            a {
                text-decoration: none;
            }
            
            .router-link-active {
                text-decoration: none;
                
            }
</style>