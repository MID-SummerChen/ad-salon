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
    storeInfo: {}
  },
  getters: {
    loginInfo: state => state.loginInfo,
    storeInfo: state => state.storeInfo,
  },
  mutations: {
    SWITCH_LOGIN_STATUS(state, status) {
      state.isLogin = status
    },
    GET_LOGIN_INFO(state) {
      state.loginInfo = getStorage("loginInfo")
    },
    SET_LOGIN_INFO(state, {type, acc}) {
      setStorage("loginInfo", {type, acc})
    },
    GOT_STORE_INFO(state, info) {
      state.storeInfo = info
    }
  },
  actions: {
    async onCheckLogin({ state, commit, dispatch, rootState }, data) {
      var res = await dispatch("checkLogin", data)
      if(res.code === 0) {
        commit("SWITCH_LOGIN_STATUS", true)
        commit("GOT_STORE_INFO", res.data)
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