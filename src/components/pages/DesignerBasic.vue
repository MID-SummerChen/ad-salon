<template>
  <div id="store">
    <div class="page-header">
      <h1>基本設定</h1>
    </div>

    <div class="col-sm-8">

      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="帳號" prop="username">
          <el-input v-model="form.username" :disabled="!!form.id"></el-input>
        </el-form-item>
        <el-form-item label="暱稱" prop="nick">
          <el-input v-model="form.nick"></el-input>
        </el-form-item>
        <el-form-item label="密碼" prop="pw">
          <el-input type="password" v-model="form.pw"></el-input>
        </el-form-item>
        <el-form-item label="密碼確認" prop="pw_c">
          <el-input type="password" v-model="form.pw_c"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birth">
          <el-date-picker v-model="form.birth" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item label="資歷(since)" prop="sinceYear">
          <el-date-picker v-model="form.sinceYear" type="year"></el-date-picker>
        </el-form-item>
        <el-form-item label="工作時間" prop="workingTime">
          <el-input v-model="form.workingTime"></el-input>
        </el-form-item>
        <el-form-item label="性別" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="狀態">
          <el-switch on-text="" off-text="" v-model="form.status"></el-switch>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">確認送出</el-button>
        </el-form-item>
        
      </el-form>

        

        
        
    </div>

    
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { required, minLength, between } from 'vuelidate/lib/validators'
import globalMixin from '@/mixins/global'
export default {
  name: 'Basic',
  mixins: [globalMixin],
  data() {
    var validPw = (rule, value, cb) => {
      if(this.form.id) {
        cb();
      } else if(value === '') {
        cb(new Error('不可為空'));
      } else {
        cb();
      }
    };
    var validPwConfirm = (rule, value, cb) => {
      if(this.form.id) {
        cb();
      } else if(value === '') {
        cb(new Error('不可為空'));
      } else if (value != this.form.pw) {
        cb(new Error('密碼不同!'));
      } else {
        cb();
      }
    };
    return {
      form: {
        id: "",
        username: "",
        nick: "",
        pw: "",
        pw_c: "",
        status: true,
        store: "",
        birth: moment(),
        desc: "",
        workingTime: "",
        gender: "1",
        sinceYear: moment(),
      },
      rules: {
        username: [
          { required: true, message: '不可為空'}
        ],
        nick: [
          { required: true, message: '不可為空'}
        ],
        pw: [
          { validator: validPw},
        ],
        pw_c: [
          { validator: validPwConfirm},
        ],
      }
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo',
      'storeInfo',
    ])
  },
  watch: {
    storeInfo() {
      this.getEditData()
    }
  },
  mounted() {
    this.getEditData()
    
  },
  methods: {
    ...mapActions([
      'modDesigner',
      'onCheckLogin',
    ]),
    async getEditData() {
      var s = this.storeInfo
      var f = this.form
      f.id = s.designerGuid
      f.username = s.username
      f.nick = s.nick
      f.store = s.storeGuid
      f.birth = moment(s.dob)
      f.desc = s.description
      f.workingTime = s.workingTime
      f.gender = s.gender
      f.status = s.stats == 1

      
    },
    async onSubmit() {
      var f = this.form
      this.$refs.form.validate(_validCallback.bind(this))

      async function _validCallback(valid) {
        if(valid) {
          var data = {
            designerGuid: f.id || -1,
            stats: f.status ? 1 : 2,
            username: f.username,
            pwd: f.pw,
            nick: f.nick,
            storeGuid: f.store,
            dob: moment(f.birth).format('YYYY-MM-DD'),
            description: f.desc,
            workingTime: f.workingTime,
            gender: f.gender,
            sinceYear: moment(f.sinceYear).format('YYYY'),
          }
          if(this.loginInfo.type !== 1) data.storeGuid = this.storeInfo.storeGuid
          var res = await this.modDesigner(data)
          if(res.code === 0) {
            this.onCheckLogin({loginType: this.loginInfo.type, username: this.loginInfo.acc})
            this.$message({
              type: 'success',
              message: `更新成功!`
            });
          }

        }else {
          this.$message.error("表單資訊不完整")
        }
      }
      
    }
  }
}
</script>
