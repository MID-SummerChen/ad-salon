<template>
  <div id="login">
    LoginPage
    <div class="login-box">
      <el-select v-model="form.loginType">
        <el-option v-for="t in typeOpts" :label="t.label" :value="t.value"></el-option>
      </el-select>
      <el-input v-model="form.username"></el-input>
      <el-input v-model="form.pwd"></el-input>
      <div style="margin-top: 10px">
        <el-button type="primary" @click="onSubmit">登入</el-button>
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
        {label: "管理員", value: 1},
        {label: "店家", value: 2},
        {label: "設計師", value: 3},
      ],
      form: {
        loginType: 2,
        username: "",
        pwd: "",
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_LOGIN_INFO',
    ]),
    ...mapActions([
      'userLogin',
      'onCheckLogin',
    ]),
    async onSubmit() {
      console.log("submit")
      var f = this.form
      var data = {
        loginType: f.loginType,
        username: f.username,
        pwd: f.pwd,
      }
      var res = await this.userLogin(data)
      if(res.code === 0) {
        this.SET_LOGIN_INFO({type: f.loginType, acc: f.username})
        this.$router.push({name: 'Home'})
        this.onCheckLogin({loginType: f.loginType, username: f.username})
      }
    }
  }
}
</script>

<style lang="stylus">
.login-box 
  width: 300px 
  margin: 0 auto 
  margin-top: 10%
</style>

