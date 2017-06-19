<template>
  <div id="order">
    <div class="page-header">
      <h1>訂單管理</h1>
      <el-button type="primary" @click="onCreate">新增訂單</el-button>
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
                <el-select v-model="form.storeGuid">
                  <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="金額" prop="gold">
                <el-input v-model="form.gold"></el-input>
              </el-form-item>
              <el-form-item label="訂購日期" prop="orderDate">
                <el-date-picker v-model="form.orderDate" type="date"></el-date-picker>
              </el-form-item>
              <el-form-item label="註銷日期" prop="doneDate">
                <el-date-picker v-model="form.doneDate" type="date"></el-date-picker>
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
      statusOpts: [
        {label: "已核銷", value: "1"},
        {label: "未使用", value: "0"},
      ],
      form: {
        id: "",
        memberGuid: "",
        storeGuid: "",
        gold: "",
        orderDate: "",
        doneDate: "",
        status: "0",
      },
      rules: {
        storeGuid: [
          { required: true, message: '不可為空'}
        ],
        memberGuid: [
          { required: true, message: '不可為空'}
        ],
        orderDate: [
          { required: true, message: '不可為空'}
        ],
      }
    }
  },
  mounted() {
    this._getStoreList()
    this._getMemberList()
    this._getOrderList()
  },
  methods: {
    ...mapActions([
      'getStoreList',
      'getMemberList',
      'getOrderList',
      'modOrder',
    ]),
    _initOrder(order) {
      return {
        ...order,
      }
    },
    async _getStoreList() {
      var res = await this.getStoreList()
      if(res.code === 0) {
        this.storeList = res.data.storeList
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
        gold: "",
        orderDate: "",
        doneDate: "",
        status: "0",
      }
    },
    async _getOrderList() {
      var res = await this.getOrderList()
      if(res.code === 0) {
        this.orderList = res.data.orderList.map(store => this._initOrder(store))
      }
    },
    onDel(id) {
      this.$confirm('是否確定刪除？', '提示', {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var data = {
          storeGuid: id,
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
            orderDate: moment(f.orderDate).format('YYYY-MM-DD'),
            doneDate: f.doneDate ? moment(f.doneDate).format('YYYY-MM-DD') : "",
            gold: f.gold,
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
