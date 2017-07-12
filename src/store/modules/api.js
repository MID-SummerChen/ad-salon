import axios from 'axios'
import Qs from 'query-string'
import md5 from 'md5'
import '@/assets/style.styl'
import ElementUI from 'element-ui'




export default {
  state: {
    host: "www.tommydawu.com", 
    path: "adsalon/api/adsalon",
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

    userLogin: async (store, data) => await apiInit(store, "POST", "form", `userLogin.php`, data),
    checkLogin: async (store, data) => await apiInit(store, "POST", "form", `chkLogin.php`, data),
    getPriceList: async (store, data) => await apiInit(store, "POST", "form", `getPriceList.php`, data),
    modPrice: async (store, data) => await apiInit(store, "POST", "multi", `modPrice.php`, data),
    delPrice: async (store, data) => await apiInit(store, "POST", "form", `modPrice.php`, _.extend(data, {del: 1})),
    getOrderList: async (store, data) => await apiInit(store, "POST", "form", `getOrderList.php`, data),
    modOrder: async (store, data) => await apiInit(store, "POST", "form", `modOrder.php`, data),
    getWorkList: async (store, data) => await apiInit(store, "POST", "form", `getWorkList.php`, data),
    modWork: async (store, data) => await apiInit(store, "POST", "form", `modWork.php`, data),
    getStoreList: async (store, data) => await apiInit(store, "POST", "form", `getStoreList.php`, data),
    modStore: async (store, data) => await apiInit(store, "POST", "form", `modStore.php`, data),
    getMemberList: async (store, data) => await apiInit(store, "POST", "form", `getMemberList.php`, data),
    modMember: async (store, data) => await apiInit(store, "POST", "form", `modMember.php`, data),
    getAdvList: async (store, data) => await apiInit(store, "POST", "form", `getAdvList.php`, data),
    modAdv: async (store, data) => await apiInit(store, "POST", "form", `modAdv.php`, data),
    getDesignerList: async (store, data) => await apiInit(store, "POST", "form", `getDesignerList.php`, data),
    modDesigner: async (store, data) => await apiInit(store, "POST", "form", `modDesigner.php`, data),
    getCityList: async (store, data) => await apiInit(store, "POST", "form", `getCity.php`, data),
    getPackageList: async (store, data) => await apiInit(store, "POST", "form", `getPackage.php`, data),
    getBasic: async (store, data) => await apiInit(store, "POST", "form", `getBasic.php`, data),
    getTimeTable: async (store, data) => await apiInit(store, "POST", "form", `getTimeTable.php`, data),
    bookAvailableTime: async (store, data) => await apiInit(store, "POST", "form", `bookAvailableTime.php`, data),
    addAvailableTime: async (store, data) => await apiInit(store, "POST", "form", `addAvailableTime.php`, data),
  }
}


function getToken() {
  var Timestamp = moment().unix().toString()
  var Time_md5 = md5(Timestamp)
  var Token = Time_md5.substring(3, 8) + Time_md5.substring(10, 15) + Time_md5.substring(19, 26)
  return {
    Timestamp,
    Token,
  }
}


async function apiInit({state, commit, dispatch}, method, contentType, route, data, showErrMsg = true) {
  var headers = {}
  // if(contentType === 'multi') {
  //   headers['Content-Type'] = 'multipart/form-data'
  // }else {
  //   headers['Content-Type'] = 'application/x-www-form-urlencoded'
  // }
  headers['Content-Type'] = 'application/x-www-form-urlencoded'

  var url = `http://${state.host}/${state.path}/${state.apiVersion}/${route}`

  commit('pushLoadingApi', url)

  var TimeToken = getToken()

  // var _data = {
  //     ...data,
  //     ...TimeToken
  //   }

  console.log(Qs.stringify(data))

  var response = await axios({
    method,
    url,
    headers,
    data: Qs.stringify(data) || data,
    // withCredentials: true
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
    this.errMsg = response.data.desc || ""
  }
}

function handleError(store, res) {
  console.log(res)
  ElementUI.Message.error(res.errMsg)

}