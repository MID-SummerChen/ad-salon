<template>
  <div id="schedule">
    <div class="page-header">
      <h1>預約行事曆</h1>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select v-if="loginInfo.type === 1" style="width: 100%" v-model="searchForm.storeGuid" @change="_getDesignerList">
            <el-option label="請選擇髮廊" value=""></el-option>
            <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
          </el-select>
        </el-col>
        <el-col v-if="loginInfo.type <= 2" :span="6">
          <el-select style="width: 100%" v-model="searchForm.designerGuid">
            <el-option label="請選擇設計師" value=""></el-option>
            <el-option v-for="d in designerList" :label="d.nick" :value="d.designerGuid"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-radio-group v-model="searchForm.weekType">
            <el-radio :label="1">本週</el-radio>
            <el-radio :label="2">下週</el-radio>
          </el-radio-group>
        </el-col>
        <el-col v-if="loginInfo.type <= 2" :span="6">
          <el-button type="primary" @click="onSearch" :disabled="!searchForm.designerGuid">搜尋</el-button>
        </el-col>
      </el-row>
    </div>

    <template v-if="datesOfWeek.length > 0">
      <el-button type="primary" @click="onSubmit">送出班表</el-button>
      <el-button type="danger" @click="onReset">重設</el-button>
      <div style="margin-top: 10px"></div>
      <el-button size="small" v-for="d in datesOfWeek" @click="selectDate(d)">{{d | date}}</el-button>
      <div style="margin-top: 10px"></div>
      <el-table :data="timesOfDay" border height="500" style="width: 100%">
        <el-table-column prop="time" label="時間" fixed width="180"></el-table-column>
        <template v-for="d in datesOfWeek">
          <el-table-column :label="d | date" width="100">
            <template scope="scope">
              <div style="background-color: #eee" v-if="isPastTime(d, scope.row.time) && avaliableTime.findIndex(t => t.date === d && t.time === scope.row.time) === -1"></div>
              <div v-if="avaliableTime.findIndex(t => t.date === d && t.time === scope.row.time) === -1" @click="addToAvaliable(d, scope.row.time)"></div>
              <div class="timeScope text-success bg-success" v-if="avaliableTime.findIndex(t => t.date === d && t.time === scope.row.time && t.status == 1) > -1" @click="addToAvaliable(d, scope.row.time)">可預約</div>
              <div class="timeScope text-info bg-info" v-if="avaliableTime.findIndex(t => t.date === d && t.time === scope.row.time && t.status == 2) > -1" @click="getOrder(d, scope.row.time)">已預訂</div>
              <div class="timeScope text-warning bg-warning" v-if="avaliableTime.findIndex(t => t.date === d && t.time === scope.row.time && t.status == 0) > -1">已取消</div>
              <div class="timeScope text-danger bg-danger" v-if="avaliableTime.findIndex(t => t.date === d && t.time === scope.row.time && t.status == 3) > -1">失效</div>
            </template>
          </el-table-column>
        </template>
      </el-table>
      <div style="margin-top: 10px"></div>
      <el-button type="primary" @click="onSubmit">送出班表</el-button>
      <el-button type="danger" @click="onReset">重設</el-button>
    </template>
    
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import globalMixin from '@/mixins/global'
export default {
  name: 'Schedule',
  mixins: [globalMixin],
  data() {
    var leftTimes = []
    var st_t = moment().set('hour', 9).set('minute', 0)
    var ed_t = moment().set('hour', 9).set('minute', 0).add(13, 'hours')
    pushTime()
    function pushTime () {
      if(ed_t > st_t) {
        leftTimes.push(st_t.format("HH:mm"))
        st_t = st_t.add(30, "m")
        pushTime()
      }
    }
    // var datesOfWeek = []
    // var st_d = moment().add(1, 'd')
    // var ed_d = moment().add(8, 'd')
    // pushDate()
    // function pushDate () {
    //   if(ed_d > st_d) {
    //     datesOfWeek.push(st_d.format("YYYY-MM-DD"))
    //     // datesOfWeek.push(st_d.format("MM/DD (dd)"))
    //     st_d = st_d.add(1, "d")
    //     pushDate()
    //   }
    // }

    return {
      timesOfDay: _.map(leftTimes, v => ({time: v})),
      datesOfWeek: [],
      storeList: [],
      designerList: [],
      currentWeek: 1,
      _avaliableTime: [],
      avaliableTime: [],
      searchForm: {
        storeGuid: "",
        designerGuid: "",
        weekType: 1,
      },
    }
  },
  mounted() {
    if(this.loginInfo.type === 1) {
      this._getStoreList()
    }else if(this.loginInfo.type === 2){
      this._getDesignerList()
    }else if(this.loginInfo.type === 3){
      this.onSearch()
    }
    
  },
  computed: {
    ...mapGetters([
    ]),
  },
  filters: {
    date(val) {
      return moment(val).format('MM/DD (dd)')
    }
  },
  methods: {
    ...mapActions([
      'getTimeTable',
      'getStoreList',
      'getOrderList',
      'getDesignerList',
      'addAvailableTime',
    ]),
    async getOrder(date, time) {
      var i = _.findIndex(this.avaliableTime, {date, time})
      if(i > -1) {
        var id = this.avaliableTime[i].orderGuid
        this.$router.push({name: "Order", query: {id}})
      }
    },
    isPastTime(date, time) {
      return moment().isAfter(`${date} ${time}`)
    },
    selectDate(date) {
      var count = _.filter(this.avaliableTime, t => t.date == date && (t.status == 1 || t.status == undefined) && !this.isPastTime(t.date, t.time)).length
      if(count > 0) {
        _.each(this.timesOfDay, dt => {
          var i = _.findIndex(this.avaliableTime, {date, time: dt.time})
          if(i > -1 && !this.isPastTime(date, dt.time) && (this.avaliableTime[i].status == 1 || this.avaliableTime[i].status == undefined)) {
            this.avaliableTime = _.filter(this.avaliableTime, t => !(t.date === date && t.time === dt.time))
          }
        })
      }else {
        _.each(this.timesOfDay, dt => {
          var i = _.findIndex(this.avaliableTime, {date, time: dt.time})
          if(i === -1 && !this.isPastTime(date, dt.time)) {
            this.avaliableTime = this.avaliableTime.concat([{date, time: dt.time, status: '1'}])
          }
        })
      }
      
      
    },
    addToAvaliable(date, time) {
      var i = _.findIndex(this.avaliableTime, {date, time})
      if(i > -1) {
        this.avaliableTime = _.filter(this.avaliableTime, t => !(t.date === date && t.time === time))
      }else {
        this.avaliableTime = this.avaliableTime.concat([{date, time, status: '1'}])
      }
      // console.log(date, time)
      // this.avaliableTime = this.avaliableTime.concat([{date, time}])
      
    },
    async _getStoreList() {
      var res = await this.getStoreList()
      if(res.code === 0) {
        this.storeList = res.data.storeList
      }
    },
    async _getDesignerList() {
      var data = {
        storeGuid: this.searchForm.storeGuid
      }
      if(this.loginInfo.type !== 1) data.storeGuid = this.storeInfo.storeGuid

      this.designerList = []
      this.searchForm.designerGuid = ""
      var res = await this.getDesignerList(data)
      if(res.code === 0) {
        this.designerList = _(res.data.designerList).filter({stats: 1}).orderBy("appoint", "desc").value()
      }
    },
    async onSearch() {
      var data = {
        designerGuid: this.searchForm.designerGuid,
        searchDate: this.searchForm.weekType === 1 ? moment().format("YYYY-MM-DD") : moment().add(7, 'd').format("YYYY-MM-DD")
      }
      if(this.loginInfo.type === 3) {
        data.designerGuid = this.storeInfo.designerGuid
      }
      var res = await this.getTimeTable(data)
      if(res.code === 0) {
        this.datesOfWeek = _.map(res.data.timeTable, "date")
        this._avaliableTime = []
        _.each(res.data.timeTable, d => {
          this._avaliableTime = this._avaliableTime.concat(_.map(d.timeArr, t => ({...t, date: d.date, time: t.time, status: t.status})))
        })
        this.avaliableTime = _.clone(this._avaliableTime)
        // console.log(this.avaliableTime)
      }
    },
    onReset() {
      this.avaliableTime = _.clone(this._avaliableTime)
    },
    async onSubmit() {
      var times = _.clone(this.avaliableTime)
      _.each(this._avaliableTime, dt => {
        var i = _.findIndex(times, dt)
        if(i === -1) {
          times.push(_.extend(dt, {del: 1}))
        }
      })
      var data = {
        designerGuid: this.searchForm.designerGuid,
        avaliableTime: JSON.stringify(_.orderBy(times, ['date', 'time']))
      }
      if(this.loginInfo.type === 3) {
        data.designerGuid = this.storeInfo.designerGuid
      }
      console.log(data)
      var res = await this.addAvailableTime(data)
      if(res.code === 0) {
        this.$message("修改成功")
        this.onSearch()
        
      }

    }
  }
}
</script>
<style lang="stylus">
#schedule
  .el-radio-group
    line-height: 32px 
    // margin-left: 10px
  .el-table
    th, td 
      height: 30px
      .timeScope 
        text-align: center
  .el-table .cell
    padding: 0 10px
    height: 100%
    line-height: 30px
    > div 
      height: 100%
      margin: 0 -18px
      > p 
        margin: 0
        // padding: 0 10px
        // text-align: center
</style>