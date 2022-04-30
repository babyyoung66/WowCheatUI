<template>
  <div class="RegisterContainer">
    <el-form
      :model="registerForm"
      status-icon
      :rules="registerRules"
      ref="registerForm"
    >
      <el-form-item
        label="用户昵称："
        :label-width="formLabelWidth"
        prop="name"
      >
        <el-input
          v-model="registerForm.name"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item label="Wow号：" :label-width="formLabelWidth" prop="wowId">
        <el-input
          v-model="registerForm.wowId"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item
        label="密码："
        :label-width="formLabelWidth"
        prop="password"
      >
        <el-input
          type="password"
          v-model="registerForm.password"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item
        label="确认密码："
        :label-width="formLabelWidth"
        prop="checkPass"
      >
        <el-input
          type="password"
          v-model="registerForm.checkPass"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item
        label="绑定邮箱："
        :label-width="formLabelWidth"
        prop="email"
      >
        <el-input
          type="email"
          v-model="registerForm.email"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item
        label="验证码："
        :label-width="this.formLabelWidth"
        prop="code"
      >
        <div style="display: flex; justify-content: space-between">
          <el-input
            :disabled="!this.EmailisOk"
            type="text"
            placeholder="请输入邮箱验证码"
            v-model="registerForm.code"
            maxlength="6"
            show-word-limit
            clearable
          >
          </el-input>
          <el-button
            @click="getEmailCode()"
            :disabled="
              requesting || !this.EmailisOk || this.Btntimer !== '获取验证码'
            "
            style="
              margin-left: 10px;
              padding: 12px 12px 12px 12px;
              width: 100px;
            "
            type="primary"
            >{{ Btntimer }}</el-button
          >
        </div>
      </el-form-item>
    </el-form>
    <div>
      <el-button
        type="primary"
        @click="ReturnForLogin"
        style="width: 45%; background-color: #fff; color: black"
        >返回登录</el-button
      >
      <el-button
        :disabled="requesting"
        type="primary"
        @click="submitRegisterForm('registerForm')"
        style="width: 40%"
        >注册</el-button
      >
    </div>
  </div>
</template>

<script>
export default {

  name: 'Register',
  data() {
    var checkName = (value, callback) => {
      //限制输入字符
      let regular = /^([^\`\+\~\!\#\$\%\^\&\*\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\|\}\{\=\"\'\`\！\?\:\<\>\“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\\\/\;\：\？\《\》\。\，\、\,]+.*)$/;
      if (regular.test(value)) {
        callback(new Error('存在特殊字符！'));
      }
    };

    var validateNickname = (rule, value, callback) => {
      checkName(value, callback)
      //检查昵称是否重复
      callback()

    };

    var passwordCheck = (value, callback) => {
      if (value !== "") {
        if (this.registerForm.checkPass !== '') {
          this.$refs.registerForm.validateField('checkPass');
        }
        let regular = /^[a-zA-Z0-9.!@#$%^&_;~,?]+$/
        if (!regular.test(value)) {
          callback(new Error('存在特殊字符！'));
        }
      }
    }
    var validatePass = (rule, value, callback) => {
      passwordCheck(value, callback)
      callback();
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

    var checkEail = (rule, value, callback) => {
      if (value !== "") {
        let regular = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/
        if (!regular.test(value)) {
          callback(new Error('邮箱格式错误！'));
        }
        let user = { "email": value }
        this.Api.postRequest("/register/isEmailHasRegister", user).then(res => {
          //console.log(res.data)
          if (res.data != null && res.data.success !== true) {
            this.EmailisOk = false
            callback(new Error(res.data.message));
          } else if (res.data != null && res.data.success === true) {
            this.EmailisOk = true
          }
          callback();
        })
      }

    };
    var checkWowId = (rule, value, callback) => {
      if (value !== "") {
        let regular = /^[a-zA-Z0-9.!@#$%^&_;~,?]+$/
        if (!regular.test(value)) {
          callback(new Error('存在特殊字符！'));
        }
        let user = { "wowId": value }
        this.Api.postRequest("/register/isIdHasRegister", user).then(res => {

          if (res.data.success !== true) {
            callback(new Error(res.data.message));
          }
          callback();
        })
      }

    };
    var checkEailCode = (rule, value, callback) => {
      if (value !== "" && value.length == 6) {
        if(this.EmailCodeIsCheck == true){
          return
        }
        let user = { "code": value, "email": this.registerForm.email }
        this.Api.postRequest("/register/checkEmailCode", user).then(res => {
          if (res.data != null && res.data.success !== true) {
            callback(new Error(res.data.message));
          } else if (res.data != null && res.data.success === true) {
            this.$notify(
              {
                title: res.data.message,
                message: '',
                type: 'success'
              })
            this.EmailCodeIsCheck = true
          }
          callback();
        })
      }
    }
    return {
      requesting: false,
      waitTime: 120,
      Btntimer: "获取验证码",
      uploadDisabled: false,
      //上传的文件信息列表
      fileList: [],
      EmailisOk: false,
      EmailCodeIsCheck: false,
      //注册表单相关
      formLabelWidth: '120px',
      registerForm: {
        name: '',
        wowId: '',
        password: '',
        checkPass: '',
        email: '',
        code: ''
      },


      registerRules: {
        name: [
          { required: true, message: '请输入名称!', trigger: 'blur' },
          { min: 1, max: 18, message: '长度在 1 到 18 个字符!', trigger: 'blur' },
          { validator: validateNickname, trigger: 'blur' }
        ],
        wowId: [
          { required: true, message: '请输入Wow号!', trigger: 'blur' },
          { min: 5, max: 18, message: '长度在 5 到 18 个字符!', trigger: 'blur' },
          { validator: checkWowId, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码!', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符!', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请再次输入确认密码!', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符!', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱!', trigger: 'blur' },
          { validator: checkEail, trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址!', trigger: 'blur' }

        ],
        code: [
          { required: true, message: '请输入验证码!', trigger: 'blur' },
          { min: 6, max: 6, message: '请输入6位数字!', trigger: 'blur' },
          { validator: checkEailCode, trigger: 'blur' }
        ],

      },

    }
  },
  methods: {

    cancelRegister() {
      this.registerForm = {//清空表单
        name: '',
        wowId: '',
        password: '',
        checkPass: '',
        email: '',
        code: ''
      };
      this.EmailisOk = false
      this.requesting = false
      this.EmailCodeIsCheck = false
    },

    //提交注册操作
    submitRegisterForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.requesting = true
          this.Api.postRequest("/register/", this.registerForm).then(res => {
            if (res.data != null && res.data.success === true) {
              this.$notify(
                {
                  title: res.data.message,
                  message: '',
                  type: 'success'
                })
              this.cancelRegister()
              this.ReturnForLogin()
            }
          }).finally(() => {
            this.requesting = false
          })
        } else {
          this.$message({
            message: '请检查相关信息是否正确！',
            type: 'error'
          });
          return false;
        }
      });

    },
    getEmailCode() {
      this.requesting = true
      this.Api.postRequest("/register/postEmailCode", this.registerForm).then(res => {
        //console.log(res.data)
        if (res.data != null && res.data.success === true) {
          this.$notify(
            {
              title: res.data.message,
              message: '',
              type: 'success'
            })
          this.setBtntimer()
        } else {
          this.requesting = false
        }
        //错误信息已在api.js全局拦截
      }).finally(() => {
        this.requesting = false
      })
    },

    //按钮计时器
    setBtntimer() {
      let j = this.waitTime
      let timer = setInterval(() => {
        this.Btntimer = j--
        if (j < 0) {
          clearInterval(timer)
          this.Btntimer = "获取验证码"
        }
      }, 1000);
    },

    ReturnForLogin() {
      this.$router.push({ path: '/login' })
    },


  },
}
</script>
<style >
.RegisterContainer {
  width: 400px;
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

.RegisterContainer .el-form {
  margin-right: 15px;
}
.RegisterContainer .el-input__suffix {
  /* top: -7px !important; */
  line-height: 40px !important;
}
</style>