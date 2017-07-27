<template>
  <div id="dashboard">
     <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" @click="sidebarShow = !sidebarShow">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <router-link class="navbar-brand" :to="{name: 'Home'}">AD Salon 管理系統</router-link>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <!--<li><a href="#">Dashboard</a></li>
            <li><a href="#">Settings</a></li>
            <li><a href="#">Profile</a></li>-->
            <li v-if="loginInfo.type === 1"><router-link :to="{name: 'Manager'}">管理員設定</router-link></li>
            <!--<li><router-link :to="{name: 'Login'}">登出  <i class="fa fa-sign-out"></i></router-link></li>-->
            <li><a href="#" @click="onLogout">登出  <i class="fa fa-sign-out"></i></a></li>
          </ul>
          <!--<form class="navbar-form navbar-right">
            <input type="text" class="form-control" placeholder="訂單查詢" 
            @keyup.enter="$router.push({name: 'Order', query: {}})">
          </form>-->
        </div>
      </div>
    </nav>
    <div v-if="loginInfo.role" class="app-sidebar" :class="{'active': sidebarShow}">
      <el-menu default-active="2" class="el-menu-vertical-demo" :router="true" @open="handleOpen" @close="handleClose">
        <el-menu-item v-for="m in menu[loginInfo.role]" :index="m.link">{{m.name}}</el-menu-item>
        <!--<el-menu-item index="/home"><i class="el-icon-menu"></i>首頁</el-menu-item>
        <el-menu-item v-if="loginInfo.type === 2" index="/basic"><i class="el-icon-menu"></i>基本設定</el-menu-item>
        <el-menu-item v-if="loginInfo.type === 2" index="/service"><i class="el-icon-menu"></i>價目表管理</el-menu-item>
        <el-menu-item index="/ad"><i class="el-icon-menu"></i>廣告管理</el-menu-item>
        <el-menu-item v-if="loginInfo.type === 1" index="/store"><i class="el-icon-menu"></i>店家管理</el-menu-item>
        <el-menu-item index="/designer"><i class="el-icon-menu"></i>設計師管理</el-menu-item>
        <el-menu-item v-if="loginInfo.type !== 1" index="/schedule"><i class="el-icon-menu"></i>預約行事曆</el-menu-item>
        <el-menu-item v-if="loginInfo.type === 1" index="/member"><i class="el-icon-menu"></i>會員管理</el-menu-item>
        <el-menu-item index="/order"><i class="el-icon-menu"></i>訂單管理</el-menu-item>
        <el-menu-item v-if="loginInfo.type !== 1" index="/work"><i class="el-icon-menu"></i>作品管理</el-menu-item>-->
      </el-menu>
    </div>
    <div class="app-content">
      <router-view></router-view>
    </div>
    
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'dashboard',
  data() {
    return {
      sidebarShow: false,
      menu: {
        admin: [
          {name: '首頁', link: '/home'},
          {name: '店家管理', link: '/store'},
          {name: '會員管理', link: '/member'},
          {name: '訂單管理', link: '/order'},
          {name: '廣告管理', link: '/ad'},
        ],
        manager: [
          {name: '首頁', link: '/home'},
          {name: '基本設定', link: '/basic'},
          {name: '設計師管理', link: '/designer'},
          {name: '價目表管理', link: '/service'},
          {name: '作品管理', link: '/work'},
          {name: '訂單管理', link: '/order'},
          {name: '預約行事曆', link: '/schedule'},
          {name: '廣告管理', link: '/ad'},
        ],
        designer: [
          {name: '首頁', link: '/home'},
          {name: '基本資料', link: '/designer/basic'},
          {name: '作品管理', link: '/work'},
          {name: '預約行事曆', link: '/schedule'},
        ],
      }
    }
  },
  mounted() {
    this.GET_LOGIN_INFO()

  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  methods: {
    ...mapMutations([
      'GET_LOGIN_INFO'
    ]),
    ...mapActions([
      'onLogout'
    ]),
  }
}
</script>

<style lang="stylus" scoped>
</style>
