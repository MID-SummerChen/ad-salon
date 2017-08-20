<template>
  <div id="home">
    <!-- <h1>首頁</h1> -->
    <div v-if="loginInfo.type === 2">
      <h4>月成交數: {{storeInfo.orderDone}} 筆</h4>
      <h4>月成交金額: {{storeInfo.orderGold}} 元</h4>
      <h4>月紅利: {{storeInfo.commisionMon}} 點</h4>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import globalMixin from '@/mixins/global'
export default {
  name: 'Home',
  mixins: [globalMixin],
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
    ]),
  }
}
</script>
<style lang="stylus">
  #home
    padding: 30px 0
    h4 
      margin: 20px 0
</style>
