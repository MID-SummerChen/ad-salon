<template>
  <div id="order">
    <div class="page-header">
      <h1>訂單管理</h1>
    </div>
    
    
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'Order',
  data() {
    return {
      orderList: []
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
