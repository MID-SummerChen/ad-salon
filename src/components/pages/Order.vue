<template>
  <div id="order">
    <div class="page-header">
      <h1>訂單管理</h1>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select style="width: 100%" v-model="searchForm.storeGuid">
            <el-option label="全部店家" value=""></el-option>
            <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select style="width: 100%" v-model="searchForm.memberGuid">
            <el-option label="全部會員" value=""></el-option>
            <el-option v-for="s in memberList" :label="s.nick" :value="s.memberGuid"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-input v-model="searchForm.username" placeholder="會員帳號"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="onSearch">搜尋</el-button>
          <el-button type="danger" @click="onCreate">新增訂單</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="orderList"
      style="width: 100%">
      <el-table-column
        width="130"
        prop="orderDate"
        label="訂購日期">
      </el-table-column>
      <el-table-column
        width="130"
        prop="doneDate"
        label="核銷日期">
      </el-table-column>
      <el-table-column
        label="會員">
        <template scope="scope">
          {{toMember(scope.row.memberGuid)}}
        </template>
      </el-table-column>
      <el-table-column label="店家">
        <template scope="scope">
          {{toStore(scope.row.storeGuid)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="gold"
        label="金額">
      </el-table-column>
      
      <el-table-column
        label="狀態">
        <template scope="scope">
          {{toStatus(scope.row.stats)}}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template scope="scope">
          
          <el-button @click="onEdit(scope.row.orderGuid)" type="text" size="small">编辑</el-button>
          <el-button @click="onDel(scope.row.orderGuid)" type="text" size="small">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px"></div>
    <el-pagination layout="prev, pager, next" :total="pagination.count" :page-size="pagination.perpage"></el-pagination>

    <!-- Modal -->
    <div ref="modal" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">訂單資訊</h4>
          </div>
          <div class="modal-body">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="訂購會員" prop="memberGuid">
                <el-select v-model="form.memberGuid">
                  <el-option v-for="m in memberList" :label="m.username" :value="m.memberGuid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所屬店家" prop="storeGuid">
                <el-select v-model="form.storeGuid" @change="_getDesignerList() && _getPriceList()">
                  <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="設計師" prop="designerGuid">
                <el-select v-model="form.designerGuid" :disabled="!form.storeGuid">
                  <el-option v-for="d in designerList" :label="d.nick" :value="d.designerGuid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="服務項目" prop="priceGuid">
                <el-select v-model="form.priceGuid" :disabled="!form.storeGuid" @change="onSelectedPrice">
                  <el-option v-for="p in priceList" :label="p.name" :value="p.priceGuid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="form.priceGuid" label="金額" prop="gold">
                {{form.gold}}
                <!--<el-input v-model="form.gold"></el-input>-->
              </el-form-item>
              <el-form-item v-if="form.priceGuid" label="所需時間" prop="gold">
                {{form.neededTime}} /hr
              </el-form-item>
              <el-form-item label="預約時間" prop="bookDate">
                <el-row :gutter="10">
                  <!--<el-col :span="10"><el-date-picker v-model="form.bookDate" type="date" style="width: 100%"></el-date-picker></el-col>
                  <el-col :span="10"><el-time-select v-model="form.startTime" :picker-options="timeSelectCfg" style="width: 100%"></el-time-select></el-col>-->
                  <el-col :span="8">
                    <el-select v-model="form.bookDate" style="width: 100%" @change="form.startTime = ''">
                      <el-option v-for="d in datesOfWeek" :value="d.date"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="8">
                    <el-select v-model="form.startTime" style="width: 100%" @change="onSelectedStartTime">
                      <el-option v-for="t in timesOfDate" :value="t.time"></el-option>
                    </el-select>
                  </el-col>
                  <!--<el-col :span="4">
                    {{form.endTime}} <br>
                  </el-col>-->
                  <el-col :span="24"><p v-if="overTime > 0.5" class="text-danger">所需作業時間超過服務時間範圍，請重新選擇時間！</p></el-col>
                </el-row>
                <!--{{form}}-->
              </el-form-item>
              <el-form-item label="有VIP卡" prop="vip">
                <el-checkbox v-model="form.vip" :true-value="1" :false-value="0"></el-checkbox>
                <!--<el-date-picker v-model="form.orderDate" type="date"></el-date-picker>-->
              </el-form-item>
              <el-form-item label="訂購日期" prop="orderDate">
                {{form.orderDate}}
                <!--<el-date-picker v-model="form.orderDate" type="date"></el-date-picker>-->
              </el-form-item>
              <el-form-item label="註銷日期" prop="doneDate">
                {{form.doneDate}}
                <!--<el-date-picker v-model="form.doneDate" type="date"></el-date-picker>-->
              </el-form-item>
              <el-form-item label="狀態">
                <el-radio-group v-model="form.status">
                  <el-radio v-for="s in statusOpts" :label="s.value">{{s.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
              
            </el-form>
          </div>
          <div class="modal-footer">
            <el-button type="primary" @click="onSubmit">確認送出</el-button>
            <el-button data-dismiss="modal">取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal -->

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { required, minLength, between } from 'vuelidate/lib/validators'
import globalMixin from '@/mixins/global'
export default {
  name: 'Order',
  mixins: [globalMixin],
  data() {
    return {
      orderList: [],
      memberList: [],
      storeList: [],
      designerList: [],
      priceList: [],
      datesOfWeek: [],
      timeSelectCfg: {
        start: '09:00',
        step: '00:30',
        end: '20:30'
      },
      statusOpts: [
        {label: "已核銷", value: "1"},
        {label: "未使用", value: "0"},
      ],
      searchForm: {
        storeGuid: "",
        memberGuid: "",
        username: "",
        orderDate: "",
        doneDate: "",
        status: "",
      },
      form: {
        id: "",
        memberGuid: "",
        storeGuid: "",
        designerGuid: "",
        priceGuid: "",
        neededTime: "",
        gold: "",
        bookDate: "",
        startTime: "",
        endTime: "",
        vip: 0,
        orderDate: "",
        doneDate: "",
        status: "0",
        weekType: 1,
      },
      rules: {
        storeGuid: [
          { required: true, message: '不可為空'}
        ],
        memberGuid: [
          { required: true, message: '不可為空'}
        ],
        // orderDate: [
        //   { required: true, message: '不可為空'}
        // ],
      }
    }
  },
  mounted() {
    this._getStoreList()
    this._getMemberList()
    this._getOrderList()
    
  },
  computed: {
    timesOfDate() {
      var i = _.findIndex(this.datesOfWeek, {date: this.form.bookDate})
      return i > -1 ? this.datesOfWeek[i].timeArr : []
    },
    overTime() {
      if(this.form.endTime) {
        var _etArr = this.form.endTime.split(":")
        var et = moment(this.form.bookDate).set('hour', _etArr[0]).set('minute', _etArr[1])
        var _ltArr = _.last(this.timesOfDate).time.split(":")
        var lt = moment(this.form.bookDate).set('hour', _ltArr[0]).set('minute', _ltArr[1])
        return (et - lt) / 1000 / 60 / 60
      }
      return ""
    }
  },
  methods: {
    ...mapActions([
      'getTimeTable',
      'bookAvailableTime',
      'getStoreList',
      'getPriceList',
      'getDesignerList',
      'getMemberList',
      'getOrderList',
      'modOrder',
    ]),
    _initOrder(order) {
      return {
        ...order,
      }
    },
    onSearch() {
      this._getOrderList()
    },
    onSelectedStartTime() {
      if(this.form.startTime) {
        var _t = this.form.startTime.split(":")
        this.form.endTime = moment(this.form.bookDate).set('hour', _t[0]).set('minute', _t[1]).add(this.form.neededTime-0, 'hour').format("HH:mm")
        // console.log(moment().set('hour', 12).set('minute', 30).add(1, 'h').format('HH:mm'))
      }
    },
    onSelectedPrice() {
      var i = _.findIndex(this.priceList, {priceGuid: this.form.priceGuid})
      if(i > -1) {
        this.form.gold = this.priceList[i].price
        this.form.neededTime = this.priceList[i].neededTime
        this._getTimeTable()
      }
    },
    async _getTimeTable() {
      var data1 ={
        designerGuid: this.form.designerGuid,
        searchDate: moment().add(1, 'd').format("YYYY-MM-DD")
      }
      var data2 ={
        designerGuid: this.form.designerGuid,
        searchDate: moment().add(9, 'd').format("YYYY-MM-DD")
      }
      var res1 = await this.getTimeTable(data1)
      var res2 = await this.getTimeTable(data2)
      if(res1.code === 0 && res2.code === 0) {
        this.datesOfWeek = _.concat(res1.data.timeTable, res2.data.timeTable)
      }
    },
    async _getStoreList() {
      var res = await this.getStoreList()
      if(res.code === 0) {
        this.storeList = res.data.storeList
      }
    },
    async _getDesignerList() {
      var data = {
        storeGuid: this.form.storeGuid
      }
      var res = await this.getDesignerList(data)
      if(res.code === 0) {
        this.designerList = res.data.designerList
      }
    },
    async _getPriceList() {
      var data = {
        storeGuid: this.form.storeGuid
      }
      var res = await this.getPriceList(data)
      if(res.code === 0) {
        this.priceList = res.data.priceList
      }
    },
    async _getMemberList() {
      var res = await this.getMemberList()
      if(res.code === 0) {
        this.memberList = res.data.memberList
      }
    },
    toStatus(id) {
      var i = this.statusOpts.findIndex(opt => opt.value === id)
      return i > -1 ? this.statusOpts[i].label : ''
    },
    toStore(id) {
      var i = this.storeList.findIndex(store => store.storeGuid === id)
      return i > -1 ? this.storeList[i].storeName : ''
    },
    toMember(id) {
      var i = this.memberList.findIndex(member => member.memberGuid === id)
      return i > -1 ? this.memberList[i].username : ''
    },
    clearForm() {
      this.$refs.form.resetFields()
      this.form = {
        id: "",
        memberGuid: "",
        storeGuid: "",
        designerGuid: "",
        priceGuid: "",
        neededTime: "",
        gold: "",
        bookDate: "",
        startTime: "",
        endTime: "",
        vip: 0,
        orderDate: "",
        doneDate: "",
        status: "0",
        weekType: 1
      }
    },
    async _getOrderList() {
      var data = {
        pageNo: this.pagination.page
      }
      var sf = this.searchForm
      if(sf.storeGuid) data.storeGuid = sf.storeGuid
      if(sf.memberGuid) data.memberGuid = sf.memberGuid
      if(sf.username) data.username = sf.username
      if(sf.orderDate) data.orderDate = sf.orderDate
      if(sf.doneDate) data.doneDate = sf.doneDate
      if(sf.status) data.stats = sf.status

      var res = await this.getOrderList(data)
      if(res.code === 0) {
        this.orderList = res.data.orderList.map(store => this._initOrder(store))
        this.pagination.page = res.data.pageNo
        this.pagination.count = this.orderList.length
      }
    },
    onDel(id) {
      this.$confirm('是否確定刪除？', '提示', {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var data = {
          orderGuid: id,
          del: 1
        }
        var res = await this.modOrder(data)
        if(res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this._getOrderList()
        }
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
      
    },
    onEdit(id) {
      this.clearForm()
      var f = this.form
      var i = this.orderList.findIndex(order => order.orderGuid === id)
      if(i > -1) {
        var s = this.orderList[i]
        f.id = id
        f.storeGuid = s.storeGuid
        f.memberGuid = s.memberGuid
        f.orderDate = s.orderDate
        f.doneDate = s.doneDate !== '-' ? s.doneDate : ''
        f.gold = s.gold
        f.status = s.stats
        $(this.$refs.modal).modal('show')
        console.log(id)
      }
      
    },
    onCreate() {
      this.clearForm()
      $(this.$refs.modal).modal('show')
    },
    async onSubmit() {
      this.$refs.form.validate(_validCallback.bind(this));
      async function _validCallback(valid) {
        if(valid) {
          var f = this.form
          var data = {
            orderGuid: f.id || -1,
            storeGuid: f.storeGuid,
            memberGuid: f.memberGuid,
            designerGuid: f.designerGuid,
            priceGuid: f.priceGuid,
            bookDate: f.bookDate,
            startTime: f.startTime,
            endTime: f.endTime,
            // orderDate: moment(f.orderDate).format('YYYY-MM-DD'),
            // doneDate: f.doneDate ? moment(f.doneDate).format('YYYY-MM-DD') : "",
            // gold: f.gold,
            vips: f.vip,
            stats: f.status,
          }

          var res = await this.modOrder(data)
          if(res.code === 0) {
            this._getOrderList()
            $(this.$refs.modal).modal('hide')
            this.$message({
              type: 'success',
              message: `${f.id ? '更新' : '新增'}成功!`
            });
          }
        }else {
          this.$message.error("表單資訊不完整")
        }
      }
      
    }
  }
}
</script>
