<template>
  <div class="editPass">
    <el-form
      :model="passEditForm"
      status-icon
      :rules="passEditRules"
      ref="passEditForm"
      :hide-required-asterisk="true"
    >
      <el-form-item
        label="原密码："
        label-width="120px"
        prop="oldPassword"
      >
        <el-input
          type="password"
          v-model="passEditForm.oldPassword"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item
        label="新密码："
        label-width="120px"
        prop="password"
      >
        <el-input
          type="password"
          v-model="passEditForm.password"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>

      <el-form-item
        label="确认密码："
        label-width="120px"
        prop="checkPass"
      >
        <el-input
          type="password"
          v-model="passEditForm.checkPass"
          autocomplete="off"
          clearable
        ></el-input>
      </el-form-item>
    </el-form>
    <div>
      <el-button :disabled="requesting" type="primary" @click="submitEdit"
        >确定</el-button
      >
      <el-button plain type="primary" @click="cancelEditPass">取消</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "editPassword",
  data() {

    var passwordCheck = (value, callback) => {
      if (value !== "") {
        if (this.passEditForm.checkPass !== '') {
          this.$refs.passEditForm.validateField('checkPass');
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
      } else if (value !== this.passEditForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      requesting: false,
      passEditForm: {
        oldPassword: '',
        password: '',
        checkPass: ''
      },
      passEditRules: {
        oldPassword: [
          { required: true, message: '请输入密码!', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符!', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
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
      }
    }
  },
  methods: {
    cancelEditPass() {
      this.$refs['passEditForm'].clearValidate()
      this.passEditForm.oldPassword = ''
      this.passEditForm.password = ''
      this.passEditForm.checkPass = ''
    },
    submitEdit() {
      if (this.requesting) {
        return
      }
      this.$refs['passEditForm'].validate((valid) => {
        if (valid) {
          this.requesting = true
          this.Api.postByXWForm("/user/editPassword", this.passEditForm).then(res => {
            if (res.data.success) {
              this.cancelEditPass()
              //返回登录页面，重新登录
              this.$store.commit('removeState')
              this.$router.push({ path: '/login' })
              this.$message.success('密码修改成功，请重新登录！');
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

      })
    }
  },
}
</script>