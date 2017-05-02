<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'app',
  data() {
    return {
      
    }
  },
  mounted() {
    // this.getStoreList({aa:123})
    this.getMemberList({aa:123})

  },
  computed: {

  },
  methods: {
    ...mapActions([
      'getStoreList',
      'getMemberList',
    ])
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
