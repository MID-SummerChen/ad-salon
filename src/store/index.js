import Vue from 'vue'
import Vuex from 'vuex'
import api from './modules/api'
import Router from '../router'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    api,
  },
  state: {
    isLogin: false,
    loginInfo: null,
    storeInfo: {},
    storeList: [],
    memberList: [],
    typeOpts: [
      {label: "總後台", value: 1, role: 'admin'},
      {label: "髮廊登入", value: 2, role: 'manager'},
      {label: "設計師登入", value: 3, role: 'designer'},
    ]
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
    SET_LOGIN_INFO(state, {type, acc, role}) {
      setStorage("loginInfo", {type, acc, role})
    },
    GOT_STORE_INFO(state, info) {
      state.storeInfo = info
    },
    CLEAR_LOGIN_DATA(state) {
      state.storeInfo = {}
      state.loginInfo = null
    },
    GOT_ALL_STORES(state, list) {
      state.storeList = list
    },
    GOT_ALL_MEMBERS(state, list) {
      state.memberList = list
    },
  },
  actions: {
    async v_getMemberList({ state, commit, dispatch, rootState }) {
      var res = await dispatch("getMemberList")
      if(res.code === 0) {
        commit("GOT_ALL_MEMBERS", res.data.memberList)
      }
    },
    async v_getStoreList({ state, commit, dispatch, rootState }) {
      var res = await dispatch("getStoreList")
      if(res.code === 0) {
        commit("GOT_ALL_STORES", res.data.storeList)
      }
    },
    async onCheckLogin({ state, commit, dispatch, rootState }, data) {
      var res = await dispatch("checkLogin", data)
      if(res.code === 0) {
        commit("SWITCH_LOGIN_STATUS", true)
        commit("GOT_STORE_INFO", res.data)
      }else {
        commit("SWITCH_LOGIN_STATUS", false)
        commit("CLEAR_LOGIN_DATA")
      }
    },
    async onLogout({ state, commit, dispatch, rootState }) {
      if(state.loginInfo) {
        var data = {
          loginType: state.loginInfo.type,
          username: state.loginInfo.acc
        }
        await dispatch("userLogout", data)
      }
      commit("SWITCH_LOGIN_STATUS", false)
      commit("CLEAR_LOGIN_DATA")
      
    },
    async onLogin({ state, commit, dispatch, rootState }, {loginType, username, pwd}) {
      dispatch("onLogout")
      var i = _.findIndex(state.typeOpts, {value: loginType})
      if(i > -1) {
        var res = await dispatch("userLogin", {loginType, username, pwd})
        if(res.code === 0) {
          commit("SET_LOGIN_INFO", {type: loginType, acc: username, role: state.typeOpts[i].role})
          // this.SWITCH_LOGIN_STATUS(true)
          console.log(Router)
          Router.push({name: 'Home'})
          // this.onCheckLogin({loginType: f.loginType, username: f.username})
        }
      }
    }
  }
})


function setStorage(storageName, data) {
  sessionStorage.setItem(storageName, JSON.stringify(data))
}
function getStorage(storageName) {
  return JSON.parse(sessionStorage.getItem(storageName))
}