<template>
  <el-container >
    <!-- <el-header>
      <el-button
        v-if="!loginForm.isAdmin"
        @click="chanceRole"
        icon="el-icon-d-arrow-right"
        style="float: right; border: none"
        >管理端登录</el-button
      >
      <el-button
        v-if="loginForm.isAdmin"
        @click="chanceRole"
        icon="el-icon-d-arrow-right"
        style="float: right; border: none"
        >普通用户登录</el-button
      >
    </el-header> -->

    <el-main>
      <div class="loginContainer">
        <el-button
          @click="getQRcode"
          icon="el-icon-d-arrow-right"
          style="float: right; border: none"
          >扫码登录</el-button
        >
        <el-form
          ref="loginForm"
          :rules="rules"
          :model="loginForm"
          label-width="80px"
        >
          <h3 v-if="!loginForm.isAdmin" class="loginTitle">WowCheat~</h3>
          <!-- <h3 v-if="loginForm.isAdmin" class="loginTitle">管理员登录</h3> -->
          <el-form-item label="Wow号:" prop="wowId">
            <el-input
              type="text"
              v-model="loginForm.wowId"
              auto-complete="off"
              placeholder="请输入Wow号"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="password">
            <el-input
              @keydown.enter.native="submitLogin"
              type="password"
              v-model="loginForm.password"
              auto-complete="off"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="验证码:" prop="code">
            <el-input type="text" @keydown.enter.native="submitLogin" v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码" style="width:150px;"></el-input>
            <img :src="verifyCode" title="点击切换验证码" @click="changeverifyCode" />
          </el-form-item> -->

          <el-checkbox
            v-model="loginForm.rememberMe"
            class="loginRemember"
          ></el-checkbox
          ><span> 记住我一周</span>
          <div>
            <el-button @click="Register" style="width: 45%; margin-right: 15px"
              >注册</el-button
            >
            <el-button
              type="primary"
              style="width: 45%"
              @click="submitLogin"
              v-loading="Sumiting"
              :disabled="Sumiting"
              >登录</el-button
            >
          </div>
        </el-form>
      </div>
    </el-main>
    <el-dialog
      title="扫码登录"
      :visible.sync="DialogVisible"
      width="400px"
      center
    >
      <!-- 二维码 -->
      <!-- <img :src="QRSrc" > :logoSrc="imageUrl" -->
      <vue-qr  :text="QRtext" :size="320" :logoSrc="imageUrl" :correctLevel="0"></vue-qr>
      <span slot="footer"  class="dialog-footer">
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
  data() {
    return {
      Sumiting:false,
      DialogVisible: false,
      //二维码链接
      QRSrc: '',
      //二维码内容
      QRtext: '', 
      imageUrl: require('../assets/cheat.png'), //二维码logo
      sum: 0,

      loginForm: {
        wowId: '',
        password: '',
        rememberMe: false

      },

      rules: {
        wowId: [{ required: true, message: '请输入Wow号！', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码！', trigger: 'blur' }]
      },
      Sumiting: false,

    };
  },
  methods: {
    getQRcode() {

      this.QRtext = '敬请期待！'
      // this.CreateQRCode('/getCodeImage').then((result) => {
      //    /* 使用URL.createObjectURL方法获取blob对象的url地址 */
      //    this.QRSrc = URL.createObjectURL(result.data)

      // }).catch((err) => {

      // });

      this.DialogVisible = true
    },
    submitLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid && !this.Sumiting) {
          this.Sumiting = true
          //console.log(this.loginForm)
          this.Api.postRequest('/auth/login', this.loginForm).then(result => {
           
            if ( result != null && result.data.success == true) {
              localStorage.setItem("remember", this.loginForm.rememberMe)
              this.$store.commit('DATA_INIT',result.data.data)
              //是否记住用户
              if(this.loginForm.rememberMe){
                  localStorage.setItem("currentUser", JSON.stringify(result.data.data))
              }
              this.$message({
                message: '登录成功!',
                type: 'success',
                duration: 2000
              });
              this.$router.push({ path: '/cheat' })
            }

          }).finally(()=>{
            this.Sumiting = false
          })
          

        } else {
          this.$message({
            message: '请输入Wow号及密码！',
            type: 'error'
          });
          return false;
        }
      });
    },

    Register() {
      this.$router.push({ path: '/Register' })
    },
 

  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
.loginContainer {
  width: 350px;
  margin: 100px auto;
  border-radius: 15px;
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
.loginTitle {
  margin: 10px auto 30px auto;
  text-align: center;
  color: #505458;
}
.loginRemember {
  margin: 5px auto 35px 80px;
}

.el-dialog .el-dialog__body {
  width: auto !important;
  height: auto !important;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* .el-dialog {
  min-width: 360px;
} */
/*.el-form-item__content{*/
/* display: flex;*/
/*  align-items: center*/
/*}*/
</style>
