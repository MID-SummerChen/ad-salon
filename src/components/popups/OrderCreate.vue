<template>
  <div class="modal fade">
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
            <!--<el-form-item v-else label="訂購會員">[會員名稱]</el-form-item>-->
            <el-form-item v-if="loginInfo.type === 1" label="髮廊" prop="storeGuid">
              <el-select v-model="form.storeGuid" @change="onSelectedStore">
                <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="設計師" prop="designerGuid">
              <el-select v-model="form.designerGuid" :disabled="!form.storeGuid">
                <el-option v-for="d in designerList" :label="d.nick" :value="d.designerGuid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.designerGuid" label="服務項目" prop="priceGuid">
              <el-select v-model="form.priceGuid" :disabled="!form.storeGuid" @change="onSelectedPrice">
                <el-option v-for="p in priceList" :label="p.name" :value="p.priceGuid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.priceGuid" label="金額" prop="gold">
              {{form.gold}}
              <!--<el-input v-model="form.gold"></el-input>-->
            </el-form-item>
            <el-form-item v-if="form.priceGuid" label="所需時間" prop="neededTime">
              {{form.neededTime}} /hr
            </el-form-item>
            <el-form-item label="預約時間" prop="bookDate">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-select v-model="form.bookDate" style="width: 100%">
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
                <el-col :span="24"><p v-if="isOverTime" class="text-danger">所需作業時間超過服務時間範圍，請重新選擇時間！</p></el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="有VIP卡" prop="vip">
              <el-checkbox v-model="form.vip" :true-value="true" :false-value="false"></el-checkbox>
              <!--<el-date-picker v-model="form.orderDate" type="date"></el-date-picker>-->
            </el-form-item>
            
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button type="primary" @click="onSubmit">確認新增</el-button>
          <el-button data-dismiss="modal">關閉</el-button>
        </div>
      </div>
    </div>
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
      datesOfWeek: [],
      designerList: [],
      priceList: [],
      statusOpts: [
        {label: "已取消", value: "2"},
        {label: "已核銷", value: "1"},
        {label: "未使用", value: "0"},
      ],
      form: {
        id: "",
        memberGuid: "",
        storeGuid: "",
        designerGuid: "",
        priceGuid: "",
        priceGuids: [],
        neededTime: "",
        gold: "",
        bookDate: "",
        startTime: "",
        endTime: "",
        vip: false,
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
    
  },
  computed: {
    ...mapState([
      'storeList',
      'memberList',
    ]),
    timesOfDate() {
      var i = _.findIndex(this.datesOfWeek, {date: this.form.bookDate})
      return i > -1 ? this.datesOfWeek[i].timeArr : []
    },
    isOverTime() {
      if(this.form.endTime) {
        var _etArr = this.form.endTime.split(":")
        var et = moment(this.form.bookDate).set('hour', _etArr[0]).set('minute', _etArr[1]).subtract(30, 'minutes').format("HH:mm")
        return _.findIndex(this.timesOfDate, {time: et}) === -1
      }
      return ""
    }
  },
  methods: {
    ...mapActions([
      'getTimeTable',
      'bookAvailableTime',
      'getPriceList',
      'getDesignerList',
    ]),
    initForm() {
      this.$refs.form.resetFields()
      this.form = _.assign({}, this.form, {
        id: "",
        memberGuid: "",
        storeGuid: "",
        designerGuid: "",
        priceGuid: "",
        priceGuids: [],
        neededTime: "",
        gold: "",
        bookDate: "",
        startTime: "",
        endTime: "",
        vip: false,
        orderDate: "",
        doneDate: "",
        status: "0",
        weekType: 1,
      })
    },
    onSelectedStore() {
      this._getDesignerList()
      this._getPriceList()
    },
    async _getDesignerList() {
      var data = {
        storeGuid: this.form.storeGuid
      }
      if(this.loginInfo.type !== 1) data.storeGuid = this.storeInfo.storeGuid
      var res = await this.getDesignerList(data)
      if(res.code === 0) {
        this.designerList = res.data.designerList
      }
    },
    async _getPriceList() {
      var data = {
        storeGuid: this.form.storeGuid
      }
      if(this.loginInfo.type !== 1) data.storeGuid = this.storeInfo.storeGuid
      console.log(data)
      var res = await this.getPriceList(data)
      if(res.code === 0) {
        this.priceList = res.data.priceList
        // var targetPriceIndex = _.findIndex(this.priceList, {priceGuid: this.form.priceGuid})
        // if(targetPriceIndex > -1) {
        //   this.form.neededTime = this.priceList[targetPriceIndex].neededTime
        // }
      }
    },
    onSelectedPrice() {
      if(!this.form.id) {
        var i = _.findIndex(this.priceList, {priceGuid: this.form.priceGuid})
        if(i > -1) {
          this.form.gold = this.priceList[i].price
          this.form.neededTime = this.priceList[i].neededTime
          this._getTimeTable()
        }
      }else {
        this.form.gold = _(this.priceList)
          .filter(p => this.form.priceGuids.indexOf(p.priceGuid) > -1)
          .map(p => ({...p, price: p.price-0}))
          .sumBy("price")
          // .value()
          console.log(this.form.gold)
        this._getTimeTable()
        
      }
      
    },

    onSelectedStartTime() {
      if(this.form.startTime) {
        var _t = this.form.startTime.split(":")
        this.form.endTime = moment(this.form.bookDate).set('hour', _t[0]).set('minute', _t[1]).add(this.form.neededTime-0, 'hour').format("HH:mm")
        // console.log(moment().set('hour', 12).set('minute', 30).add(1, 'h').format('HH:mm'))
      }
    },
    async _getTimeTable() {
      var data1 ={
        designerGuid: this.form.designerGuid,
        searchDate: moment().format("YYYY-MM-DD")
      }
      var data2 ={
        designerGuid: this.form.designerGuid,
        searchDate: moment().add(8, 'd').format("YYYY-MM-DD")
      }
      var res1 = await this.getTimeTable(data1)
      var res2 = await this.getTimeTable(data2)
      if(res1.code === 0 && res2.code === 0) {
        this.datesOfWeek = _(res1.data.timeTable).concat(res2.data.timeTable).map(d => {
          d.timeArr = _.filter(d.timeArr, {status: "1"})
          return d
        }).value()
        // this.form.startTime = ""
      }
    },
    async onSubmit() {
      this.$refs.form.validate(_validCallback.bind(this));
      async function _validCallback(valid) {
        if(valid) {
          var f = this.form
          var data = {
            del: f.id ? 2 : 0,
            orderGuid: f.id || -1,
            storeGuid: f.storeGuid,
            memberGuid: f.memberGuid,
            designerGuid: f.designerGuid,
            service: JSON.stringify([f.priceGuid]),
            bookDate: f.bookDate,
            startTime: f.startTime,
            endTime: f.endTime,
            // orderDate: moment(f.orderDate).format('YYYY-MM-DD'),
            // doneDate: f.doneDate ? moment(f.doneDate).format('YYYY-MM-DD') : "",
            // gold: f.gold,
            vips: f.vip ? 1 : 0,
            stats: f.status,
          }

          var res = await this.bookAvailableTime(data)
          if(res.code === 0) {
            this.$parent._getOrderList()
            $(this.$el).modal('hide')
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
