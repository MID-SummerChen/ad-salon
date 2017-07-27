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

  },
  computed: {

  },
  methods: {
    ...mapActions([
      'getStoreList',
      'getMemberList',
    ]),
  }
}
</script>

<style lang="stylus" scoped>

</style>
