<template>
  <div class="personalCenter">
    <div
      class="photoUpload"
      v-loading="uploading"
      element-loading-text="上传中..."
    >
      <el-image
        style="width: 100px; height: 100px"
        :src="currentUser.photourl"
        fit="cover"
      ></el-image>
      <el-upload
        :action="uplaodUrl"
        :headers="headers"
        :show-file-list="false"
        :on-error="handleAvatarError"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :accept="imageType"
      >
        <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
        <i title="修改头像" class="bi bi-pencil-square edit"></i>
      </el-upload>
    </div>
    <el-form
      label-position="left"
      :model="userInfoForm"
      label-width="40px"
      :disabled="!edit"
      :rules="infoEditRules"
      ref="infoEditForm"
      :hide-required-asterisk="true"
    >
      <el-form-item label="昵称" prop="name">
        <div class="inputwidth">
          <el-input v-model="userInfoForm.name"></el-input>
        </div>
      </el-form-item>

      <el-form-item label="性别">
        <div class="inputwidth">
          <el-select v-model="userInfoForm.sex" placeholder="请选择">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="生日">
        <div class="inputwidth">
          <el-date-picker
            :picker-options="pickerOptions"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            v-model="userInfoForm.birthday"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="地区">
        <el-input
          type="textarea"
          placeholder="请输入地区"
          v-model="userInfoForm.address"
          maxlength="48"
          :show-word-limit="edit"
          resize="none"
          :autosize="{ minRows: 2, maxRows: 4 }"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <div class="btnBox">
      <el-button type="primary" size="mini" v-show="!edit" @click="edit = true"
        >修 改</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-show="edit"
        :disabled="requesting"
        @click="submitEdit"
        >保 存</el-button
      >
    </div>
  </div>
</template>
<script>
import constants from '@/utils/constans'
export default {
  name: 'personalCenter',

  data() {
    var checkName = (rule, value, callback) => {
      //限制输入字符
      let regular = /^([^\`\+\~\!\#\$\%\^\&\*\|\}\{\=\"\'\！\￥\……\（\）\——]*[\+\~\!\#\$\%\^\&\*\|\}\{\=\"\'\`\！\?\:\<\>\“\”\；\‘\‘\〈\ 〉\￥\……\（\）\——\｛\｝\【\】\\\/\;\：\？\《\》\。\，\、\,]+.*)$/;
      if (regular.test(value)) {
        callback(new Error('存在特殊字符！'));
      }
      callback()
    };
    return {
      requesting: false,
      uploading: false,
      edit: false,
      uplaodUrl: constants.apiBase + '/user/editPhoto',
      userInfoForm: {
        name: '',
        sex: '',
        birthday: '',
        address: ''
      },
      infoEditRules: {
        name: [
          { required: true, message: '请输入名称!', trigger: 'blur' },
          { min: 1, max: 18, message: '长度在 1 到 18 个字符!', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
      },
      sexOptions: [
        { value: '1', label: '男' },
        { value: '0', label: '女' },
        { value: '2', label: '隐藏' },
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      imageType: ".jpg,.jpeg,.png,.jfif,.tif,.gif,.svg,.bmp,.webp",

    }
  },
  methods: {
    initInfo() {
      this.userInfoForm.name = this.currentUser.name
      this.userInfoForm.sex = this.currentUser.sex.toString() //数字得转成字符类型，不然无法显示
      this.userInfoForm.birthday = this.currentUser.birthday
      this.userInfoForm.address = this.currentUser.address
    },
    infoHasChange() {
      if (this.userInfoForm.name != this.currentUser.name) {
        return true
      }
      if (this.userInfoForm.sex != this.currentUser.sex.toString()) {
        return true
      }
      if (this.userInfoForm.birthday != this.currentUser.birthday) {
        return true
      }
      if (this.userInfoForm.address != this.currentUser.address) {
        return true
      }
      return false
    },

    handleAvatarError(res, file) {
      this.uploading = false
      this.$message.warning(res.message);
    },
    handleAvatarSuccess(res, file) {
      if (res.success) {
        this.$message.success('修改成功！');
        //成功后更新本地信息
        this.currentUser.photourl = res.data.photourl
      } else {
        this.$message.warning(res.message);
      }
      this.uploading = false
    },
    beforeAvatarUpload(file) {
      if (file.type.indexOf('image') === -1) {
        this.$message.error('仅支持图片！');
        return false
      }
      let Regex = this.imageType
      let suffix = file.type.slice(file.type.lastIndexOf('/') + 1)
      let isTrue = Regex.indexOf(suffix.toLowerCase())
      if (isTrue === -1) {
        this.$message.error('不支持该类型文件哦！');
        return false
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!');
        return false
      }
      this.uploading = true
      return true
    },
    submitEdit() {
      if (!this.infoHasChange()) {
        this.edit = false
        return
      }
      this.$refs['infoEditForm'].validate((valid) => {
        if (valid) {
          this.requesting = true
          this.Api.postRequest('/user/editInfo', this.userInfoForm).then(res => {
            if (res.data.success && res.data.data != null) {
              this.$set(res.data.data, 'type', 'personal')
              this.$store.state['common'].currentUser.user = res.data.data
              this.$message.success('修改成功！');
            }
            this.edit = false
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
  computed: {
    currentUser() {
      return this.$store.state['common'].currentUser.user
    },
    headers() {
      return { "token": this.$store.state['common'].currentUser.token }
    }
  },
  mounted() {
    this.initInfo()
  },

}
</script>

<style scoped>
.personalCenter {
  width: 100%;
  height: 100%;
}
.birthdayInput {
  width: 40px;
}
.personalCenter .btnBox {
  text-align: left;
}
.personalCenter .btnBox button {
  margin: 0;
}
.personalCenter .photoUpload .el-image {
  border-radius: 50% !important;
}
.photoUpload {
  width: 120px !important;
  height: 120px !important;
  position: relative;
  text-align: center;
  margin: 0 0 0 30px;
}
.edit {
  font-size: 16px;
  position: absolute;
  bottom: 10px;
  right: 15px;
}
</style>
<style>
.personalCenter .el-form-item__content {
  text-align: left !important;
}
.personalCenter .inputwidth {
  width: 220px;
}
</style>