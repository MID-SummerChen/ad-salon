<template>
  <div id="login">
    <div class="login-box">
      <el-select v-model="form.loginType" style="width: 100%">
        <el-option v-for="t in typeOpts" :label="t.label" :value="t.value"></el-option>
      </el-select>
      <el-input v-model="form.username" placeholder="請輸入帳號"></el-input>
      <el-input v-model="form.pwd" @keyup.enter="onSubmit" placeholder="請輸入密碼"></el-input>
      <div style="margin-top: 10px">
        <el-button type="primary" style="width: 100%" @click="onSubmit">登入</el-button>
      </div>
      
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { required, minLength, between } from 'vuelidate/lib/validators'
import globalMixin from '@/mixins/global'
export default {
  name: 'login',
  mixins: [globalMixin],
  data () {
    return {
      typeOpts: [
        {label: "總後台", value: 1, role: 'admin'},
        {label: "髮廊登入", value: 2, role: 'manager'},
        {label: "設計師登入", value: 3, role: 'designer'},
      ],
      form: {
        loginType: 2,
        username: "",
        pwd: "",
      }
    }
  },
  mounted() {
    // this.onLogout()
  },
  methods: {
    ...mapMutations([
      'SET_LOGIN_INFO',
    ]),
    ...mapActions([
      'onLogout',
      'userLogin',
      'onCheckLogin',
      'onLogin',
    ]),
    async onSubmit() {
      this.onLogin(this.form)
      // console.log("submit")
      // var f = this.form
      // var i = _.findIndex(this.typeOpts, {value: f.loginType})
      // if(i > -1) {
      //   var data = {
      //     loginType: f.loginType,
      //     username: f.username,
      //     pwd: f.pwd,
      //   }
      //   var res = await this.userLogin(data)
      //   if(res.code === 0) {
      //     this.SET_LOGIN_INFO({type: f.loginType, acc: f.username, role: this.typeOpts[i].role})
      //     // this.SWITCH_LOGIN_STATUS(true)
      //     this.$router.push({name: 'Home'})
      //     // this.onCheckLogin({loginType: f.loginType, username: f.username})
      //   }
      // }
      
    }
  }
}
</script>

<style lang="stylus">
#login 
  background-color: #eee
  height: 100vh
.login-box 
  width: 300px 
  margin: 0 auto 
  padding-top: 10%
  .el-button 
    height: 38px
  .el-input 
    margin-bottom: 10px
  .el-input__inner
    height: 45px
</style>

