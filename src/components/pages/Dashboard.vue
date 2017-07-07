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
          <a class="navbar-brand" href="#">AD Salon</a>
        </div>
        <!--<div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">Dashboard</a></li>
            <li><a href="#">Settings</a></li>
            <li><a href="#">Profile</a></li>
            <li><a href="#">Help</a></li>
          </ul>
          <form class="navbar-form navbar-right">
            <input type="text" class="form-control" placeholder="Search...">
          </form>
        </div>-->
      </div>
    </nav>
    <div v-if="loginInfo" class="app-sidebar" :class="{'active': sidebarShow}">
      <el-menu default-active="2" class="el-menu-vertical-demo" :router="true" @open="handleOpen" @close="handleClose">
          <el-menu-item index="/home"><i class="el-icon-menu"></i>首頁</el-menu-item>
          <el-menu-item v-if="loginInfo.type === 2" index="/basic"><i class="el-icon-menu"></i>基本設定</el-menu-item>
          <el-menu-item index="/ad"><i class="el-icon-menu"></i>廣告管理</el-menu-item>
          <el-menu-item index="/store"><i class="el-icon-menu"></i>店家管理</el-menu-item>
          <el-menu-item index="/designer"><i class="el-icon-menu"></i>設計師管理</el-menu-item>
          <el-menu-item index="/member"><i class="el-icon-menu"></i>會員管理</el-menu-item>
          <el-menu-item index="/order"><i class="el-icon-menu"></i>訂單管理</el-menu-item>
          <el-menu-item index="/work"><i class="el-icon-menu"></i>作品管理</el-menu-item>
          <el-menu-item index="/permission"><i class="el-icon-menu"></i>權限管理</el-menu-item>
          <!--<el-submenu index="/store">
            <template slot="title"><i class="el-icon-menu"></i>店家管理</template>
            <el-menu-item index="/store/detail">选项1</el-menu-item>
          </el-submenu>-->
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
      sidebarShow: false
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
  }
}
</script>

<style lang="stylus" scoped>
</style>
