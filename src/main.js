// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/zh-TW'
import Vuelidate from 'vuelidate'
import 'uikit'
import 'normalize.css'
import 'element-ui/lib/theme-default/index.css'
Vue.use(Vuelidate)
Vue.use(ElementUI, {locale})

Vue.config.productionTip = false
Vue.config.silent = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
