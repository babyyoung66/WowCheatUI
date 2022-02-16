<template>
<el-container>
    <el-header >
      <el-button v-if="!loginForm.isAdmin" @click="chanceRole" icon="el-icon-d-arrow-right" style="float: right;border: none" >管理端登录</el-button>
      <el-button v-if="loginForm.isAdmin" @click="chanceRole" icon="el-icon-d-arrow-right" style="float: right;border: none" >普通用户登录</el-button>
    </el-header>
    <el-main>
      
      <div class="loginContainer">
        <el-button @click="getQRcode" icon="el-icon-d-arrow-right" style="float: right;border: none" >扫码登录</el-button>
        <el-form ref="loginForm" :rules="rules" :model="loginForm" label-width="80px">
          <h3 v-if="!loginForm.isAdmin" class="loginTitle">Blog~</h3>
          <h3 v-if="loginForm.isAdmin" class="loginTitle">管理员登录</h3>
          <el-form-item label="用户名:" prop="username">
            <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input type="password"  v-model="loginForm.password" auto-complete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
          <!-- <el-form-item label="验证码:" prop="code">
            <el-input type="text" @keydown.enter.native="submitLogin" v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码" style="width:150px;"></el-input>
            <img :src="verifyCode" title="点击切换验证码" @click="changeverifyCode" />
          </el-form-item> -->
          
          <el-checkbox v-model="rememberme" class="loginRemember"></el-checkbox><span> 记住我一周</span>
          <div>
            <el-button @click="Register" style="width:45% ;margin-right: 15px">注册</el-button>
            <el-button type="primary" style="width:45% ;" @click="submitLogin"  v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
          </div>
        </el-form> 
      </div>
    </el-main>
    <el-dialog
      title="扫码登录"
      :visible.sync="DialogVisible"
      width="400px" 
      center>
      <!-- 二维码 -->
        <!-- <img :src="QRCode" > -->
        <vue-qr :logoSrc="imageUrl" :text="QRtext" :size="320"></vue-qr>
      <span slot="footer" class="dialog-footer">
        <el-button @click="getQRcode" icon="el-icon-refresh">刷新</el-button>
      </span>
    </el-dialog>
  </el-container>

</template>

<script>
  import vueQr from 'vue-qr'
  export default {   
    components: { 
        vueQr 
  
    },
    name: "Login",
    data(){
      return{
        DialogVisible: false,
        QRCode:'',
        QRtext:'', //二维码内容
        imageUrl:require('../assets/logo.png'), //二维码logo
        sum:0,
        
        loginForm:{
           username:'',
           password:'',
           isAdmin:false
        },
        rememberme:true,
        rules: {
          username:[{required:true,message:'请输入用户名',trigger:'blur'}],
          password:[{required:true,message: '请输入密码',trigger:'blur'}]
        },
        fullscreenLoading:false,
        
      };
    },
    methods:{
      getQRcode(){
          this.sum++
          this.QRtext = 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=vue-qr%E6%97%A0%E6%B3%95%E5%AF%BC%E5%85%A5&oq=webpack%25E7%25AB%25AF%25E5%258F%25A3&rsv_pq=c8400a6f0006fb50&rsv_t=16704QrDloT87jCaAKSrr6ltxZFHbdcxaN7d38OwUQMSSb5hs%2BTb2xMAuqg&rqlang=cn&rsv_enter=1&rsv_dl=tb&rsv_btype=t&inputT=10180&rsv_sug3=55&rsv_sug1=49&rsv_sug7=100&rsv_sug2=0&rsv_sug4=10181'

          // this.CreateQRCode('/getCodeImage').then((result) => {
          //    /* 使用URL.createObjectURL方法获取blob对象的url地址 */
          //    this.QRCode = URL.createObjectURL(result.data)
             
          // }).catch((err) => {
            
          // });
          
          this.DialogVisible = true
      },
      submitLogin(){
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
              
              let struser = window.localStorage.getItem(this.loginForm.username)
              const user = JSON.parse(struser) //转成JSON
              
              if(user != null){
                  const pwd = user.password
                  if(pwd == this.loginForm.password ){
                        window.sessionStorage.setItem('userinfo',struser) //放入session
                        this.$notify(
                          {
                          title: '登录成功！',
                          message: '',
                          type: 'success'
                          })
                        this.$router.push({path:'/'})
                  }else{
                      this.$message({
                      message: '密码错误！',
                      type: 'error'
                      });
                      return false;  
                  }

                }else{
                  this.$message({
                  message: '用户不存在！',
                  type: 'error'
                  });
                  return false;
                }
              
            
          } else {

            this.$message({
            message: '请输入用户名及密码！',
            type: 'error'
            });
            return false;
          }
        });
      },
     
      Register(){
        this.$router.push({path:'/Register'})
      },
      
      chanceRole(){
          if(this.loginForm.isAdmin){
              this.loginForm.isAdmin = false
          }else{
              this.loginForm.isAdmin = true
          }
          
      }

    }
  }
</script>

<style>
  .disabled .el-upload--picture-card{
    display: none;
  }
  .loginContainer{
    width: 350px;
    margin: 100px auto;
    border-radius:15px ;
    border: 1px solid #eaeaea;
    /*添加阴影 h-shadow(水平阴影位置)，v-shadow(垂直阴影位置)，blur(阴影大小)，color(颜色)*/
    box-shadow: 10px 10px 35px #cac6c6;
    background: #fff;
    /*background-clip——规定背景的绘制区域*/
    /*border-box：背景被裁剪到边框盒*/
    /*padding-box：背景被裁剪到内边距框*/
    /*content-box：背景被裁剪到内容框*/
    background-clip: padding-box;
    padding: 25px 35px 25px 35px;
  }
  .loginTitle{
    margin: 10px auto 30px auto;
    text-align: center;
    color:#505458;
  }
  .loginRemember{
    margin: 5px auto 35px 80px;
  }
 
.el-dialog .el-dialog__body{
      width: auto !important;
      height: auto !important;
      display: flex;
      justify-content: center;
      align-items: center;
}
.el-dialog {
    min-width: 360px;
}
  /*.el-form-item__content{*/
  /* display: flex;*/
  /*  align-items: center*/
  /*}*/
</style>
