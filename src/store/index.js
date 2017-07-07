import Vue from 'vue'
import Vuex from 'vuex'
import api from './modules/api'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    api,
  },
  state: {
    isLogin: false,
    loginInfo: null,
  },
  getters: {
    loginInfo: state => state.loginInfo
  },
  mutations: {
    switchLoginStatus(state, status) {
      state.isLogin = status
    },
    GET_LOGIN_INFO(state) {
      state.loginInfo = getStorage("loginInfo")
    },
    SET_LOGIN_INFO(state, {type, acc}) {
      setStorage("loginInfo", {type, acc})
    }
  },
  actions: {
    async onCheckLogin({ state, commit, dispatch, rootState }, data) {
      var res = await dispatch("checkLogin", data)
      if(res.code === 0) {

      }
    },
    async onLogout({ state, commit, dispatch, rootState }) {
    },
    async onLogin({ state, commit, dispatch, rootState }, data) {
      
    }
  }
})


function setStorage(storageName, data) {
  sessionStorage.setItem(storageName, JSON.stringify(data))
}
function getStorage(storageName) {
  return JSON.parse(sessionStorage.getItem(storageName))
}