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
  },
  getters: {
  },
  mutations: {
    switchLoginStatus(state, status) {
      state.isLogin = status
    },

  },
  actions: {
    async onCheckLogin({ state, commit, dispatch, rootState }) {
    },
    async onLogout({ state, commit, dispatch, rootState }) {
    },
    async onLogin({ state, commit, dispatch, rootState }, data) {
      
    }
  }
})
