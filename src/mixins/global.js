import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {
      statusOpts: [
        {label: "ON", value: 1},
        {label: "OFF", value: 2},
      ],
      genderOpts: [
        {label: "男", value: 1},
        {label: "女", value: 2},
      ],
    }
  },
  computed: {
    ...mapState({
      host: state => state.api.host
    })
  },
  methods: {
    toStatus(val) {
      var i = this.statusOpts.findIndex(opt => opt.value === val-0)
      return i > -1 ? this.statusOpts[i].label : ""
    },
    toGender(gender) {
      var i = _.findIndex(this.genderOpts, {value: gender-0})
      return i > -1 ? this.genderOpts[i].label : '其他'
    },
  }
}