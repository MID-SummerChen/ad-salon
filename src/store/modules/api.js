import axios from 'axios'
import Qs from 'querystring'
import md5 from 'md5'





export default {
  state: {
    host: "adsalon.v6.zmtuaa.com", 
    path: "api/adsalon",
    apiVersion: "v1",
    isLoading: false,
    loadingApis: []
  },
  getters: {
  },
  mutations: {
    pushLoadingApi(state, apiUrl) {
      state.isLoading = true
      state.loadingApis = state.loadingApis.concat([apiUrl])
      
    },
    pullLoadingApi(state, apiUrl) {
      state.loadingApis = state.loadingApis.filter(url => url !== apiUrl)
      if(state.loadingApis.length === 0) {
        state.isLoading = false
      }
    }
  },
  actions: {
    handleError,
    getStoreList: async (store, data) => await apiInit(store, "POST", `getStoreList.php`, data),
  }
}

function getToken() {
  var Timestamp = moment().unix()
  var Time_md5 = md5(Timestamp)
  var Token = Time_md5.substring(3, 7) + Time_md5.substring(10, 14) + Time_md5.substring(19, 25)

  return {
    Timestamp,
    Token
  }
}


async function apiInit({state, commit, dispatch}, method, route, data, showErrMsg = true) {
  var headers = {
    "Content-Type": "application/json"
  }

  var url = `http://${state.host}/${state.path}/${state.apiVersion}/${route}`

  commit('pushLoadingApi', url)

  console.log({
    method,
    url,
    headers,
    data: {
      ...getToken(),
      ...data
    },
    withCredentials: true
  })

  var response = await axios({
    method,
    url,
    headers,
    data: {
      ...getToken(),
      ...data
    },
    withCredentials: true
  });

  commit('pullLoadingApi', url)

  var myRes = new Response(response)
  if(myRes.code !== 0 && showErrMsg) {
    dispatch('handleError', myRes)
  }

  return myRes


}


class Response {
  constructor(response) {
    this.code = response.data.errorcode
    this.data = response.data
  }
}

function handleError(store, res) {

}