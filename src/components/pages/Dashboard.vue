<template>
  <div id="dashboard">
    <div class="app-sidebar">
      <el-menu default-active="2" class="el-menu-vertical-demo" :router="true" @open="handleOpen" @close="handleClose">
          <el-menu-item index="/home"><i class="el-icon-menu"></i>首頁</el-menu-item>
          <el-menu-item index="/ad"><i class="el-icon-menu"></i>廣告管理</el-menu-item>
          <el-menu-item index="/store"><i class="el-icon-menu"></i>店家管理</el-menu-item>
          <el-menu-item index="/designer"><i class="el-icon-menu"></i>設計師管理</el-menu-item>
          <el-menu-item index="/member"><i class="el-icon-menu"></i>會員管理</el-menu-item>
          <el-menu-item index="/order"><i class="el-icon-menu"></i>訂單管理</el-menu-item>
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
      
    }
  },
  mounted() {

  },
  computed: {

  },
  methods: {
    ...mapActions([
      'getStoreList',
      'getMemberList',
    ]),
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
  }
}
</script>

<style lang="stylus" scoped>

</style>
