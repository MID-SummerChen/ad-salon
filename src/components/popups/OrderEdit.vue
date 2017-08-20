<template>
  <div class="modal fade">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">訂單核銷</h4>
        </div>
        <div class="modal-body">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="訂購會員">
              {{form.memberName}}
            </el-form-item>
            <!--<el-form-item v-else label="訂購會員">[會員名稱]</el-form-item>-->
            <el-form-item v-if="loginInfo.type === 1" label="髮廊" prop="storeGuid">
              <el-select v-model="form.storeGuid" @change="onSelectedStore" disabled>
                <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="設計師">
              {{form.designerName}}
            </el-form-item>
            <el-form-item v-if="form.designerGuid" label="服務項目">
              <el-select v-model="form.priceGuids" @change="onSelectedPrice" multiple style="width: 100%">
                <el-option v-for="p in priceList" :label="p.name" :value="p.priceGuid"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="form.gold" label="金額" prop="gold">
              {{form.gold}}
              <!--<el-input v-model="form.gold"></el-input>-->
            </el-form-item>
            <el-form-item v-if="form.neededTime" label="所需時間" prop="neededTime">
              {{form.neededTime}} /hr
            </el-form-item>
            <el-form-item label="預約時間" prop="bookDate">
              {{form.bookDate}} {{form.startTime}}
            </el-form-item>
            <el-form-item label="有VIP卡" prop="vip">
              <el-checkbox v-model="form.vip" :true-value="true" :false-value="false"></el-checkbox>
              <!--<el-date-picker v-model="form.orderDate" type="date"></el-date-picker>-->
            </el-form-item>
            
          </el-form>
        </div>
        <div class="modal-footer">
          <el-button type="primary" @click="onSubmit">確認核銷</el-button>
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
        memberName: "",
        storeGuid: "",
        designerGuid: "",
        designerName: "",
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
    }
  },
  mounted() {
    this.onSelectedStore()
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
        memberName: "",
        storeGuid: "",
        designerGuid: "",
        designerName: "",
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
      }
    },
    onSelectedPrice() {
      this.form.gold = _(this.priceList)
          .filter(p => this.form.priceGuids.indexOf(p.priceGuid) > -1)
          .map(p => ({...p, price: p.price-0}))
          .sumBy("price")
          // .value()
          console.log(this.form.gold)
      this._getTimeTable()
      
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
        searchDate: moment().add(0, 'd').format("YYYY-MM-DD")
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
      var f = this.form
      var data = {
        del: 2,
        orderGuid: f.id,
        gold: f.gold,
        service: JSON.stringify(f.priceGuids),
        vips: f.vip ? 1 : 0,
        stats: 1,
      }
      console.log(data)

      var res = await this.bookAvailableTime(data)
      if(res.code === 0) {
        this.$parent._getOrderList()
        $(this.$el).modal('hide')
        this.$message({
          type: 'success',
          message: `核銷成功`
        });
      }
      
    }
  }
}
</script>
