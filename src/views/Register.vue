<template>
    <div class="RegisterContainer">
      <el-form :model="registerForm" status-icon :rules="registerRules" ref="registerForm" >
        <el-form-item label="用户昵称：" :label-width="formLabelWidth" prop="nickname">
          <el-input v-model=" registerForm.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登录用户名：" :label-width="formLabelWidth" prop="username">
            <el-input v-model="registerForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth" prop="password">
          <el-input type="password" v-model="registerForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" :label-width="formLabelWidth" prop="checkPass">
          <el-input type="password" v-model="registerForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        
      </el-form>
      <div >
        <el-button type="primary" @click="ReturnForLogin" style="width: 45%;background-color: #fff;color: black;">返回登录</el-button>
        <el-button type="primary" @click="submitRegisterForm('registerForm') " style="width: 40%">注册</el-button>
      </div>
    
    </div>
</template>

<script>
export default{
    
   
    name:'Register',
    data() {
      var checkName = (value,callback) =>{
        if (value === '') {
          callback(new Error('请输入信息！'));
        }
        //限制长度 ，先计算字符长度
        if (value.length > 16){
          callback(new Error('限制长度16字符！'));
        }
        //限制输入字符
        var regular = /^([^\`\+\~\!\#\$\%\^\&\*\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\|\}\{\=\"\'\`\！\?\:\<\>\尠“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\\\/\;\：\？\《\》\。\，\、\,]+.*)$/;
        if(regular.test(value)){
          callback(new Error('存在特殊字符！'));
        }
      };

      var validateNickname = (rule, value, callback) => {
       checkName(value,callback)
        //检查昵称是否重复
       callback() 
          
      };
      var validateUsername = (rule, value, callback) => {
        checkName(value,callback)
        //检查用户名是否重复，查询localStorage也可以查询后台接口
        let user = window.localStorage.getItem(value)
        if(user != null){  
           callback(new Error('用户名已存在')); 
        }else{
            callback()
        }

      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.registerForm.checkPass !== '') {
            this.$refs.registerForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
        return {
            //注册表单相关
        
        formLabelWidth: '120px',
        registerForm:{
          nickname:'',
          username:'',
          password:'',
          checkPass:''
        },
        registerRules: {
          nickname: [
            { validator: validateNickname, trigger: 'blur' }
          ],
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        },
        uploadDisabled:false,
        //上传的文件信息列表
        fileList:[],
        }
    },
    methods: {

      cancelRegister(){
        this.registerForm={//清空表单
        nickname:'',
        username:'',
        password:'',
        checkPass:'',
        userProfile:'',
        };
        },

      //提交注册操作
      submitRegisterForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
              //放入localstorage 模拟数据库
              window.localStorage.setItem(this.registerForm.username,JSON.stringify(this.registerForm))
              this.$notify(
                {
                title: '注册成功！',
                message: '',
                type: 'success' 
                })

              this.cancelRegister()

          } else {
            this.$message({
            message: '请输入相关信息！',
            type: 'error'
            });
            return false;
          }
        });

      },

      ReturnForLogin(){
          this.$router.push({path:'/login'})  
        }
    },
}
</script>
<style>
.RegisterContainer{
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
</style>