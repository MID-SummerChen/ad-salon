<template>
  <div id="order">
    <div class="page-header">
      <h1>訂單管理</h1>
      <el-row v-if="loginInfo.type === 1" :gutter="10">
        <el-col :span="6">
          <el-select style="width: 100%" v-model="searchForm.storeGuid" filterable>
            <el-option label="全部店家" value=""></el-option>
            <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select style="width: 100%" v-model="searchForm.memberGuid" filterable>
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
    <el-table :data="orderList" style="width: 100%">
      <el-table-column width="180" prop="orderDate" label="訂購日期"></el-table-column>
      <el-table-column width="180" prop="bookTime" label="預定日期"></el-table-column>
      <el-table-column width="180" prop="doneDate" label="核銷日期"></el-table-column>
      <el-table-column width="150" label="會員" prop="memberNick"></el-table-column>
      <el-table-column v-if="loginInfo.type === 1" label="店家" width="150">
        <template scope="scope">
          {{toStore(scope.row.storeGuid)}}
        </template>
      </el-table-column>
      <el-table-column prop="gold" label="金額"></el-table-column>
      
      <el-table-column label="狀態">
        <template scope="scope">
          <span :class="{'text-danger': scope.row.stats == 2, 'text-success': scope.row.stats == 1}">{{toStatus(scope.row.stats)}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template scope="scope">
          <el-button v-if="loginInfo.type != 3 && scope.row.stats != 0" @click="onSetQuery(scope.row.orderGuid)" type="text" size="small">編輯</el-button>
          <el-button v-if="scope.row.stats == 0" @click="onSetQuery(scope.row.orderGuid)" type="text" size="small">核銷</el-button>
          <el-button v-if="scope.row.stats == 0 || scope.row.stats == 1" @click="onCancel(scope.row.orderGuid)" type="text" size="small">取消</el-button>
          <!--<el-button @click="onDel(scope.row.orderGuid)" type="text" size="small">刪除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 10px"></div>
    <el-pagination layout="prev, pager, next" :total="pagination.count" :page-size="pagination.perpage"></el-pagination>

    <!-- Modals -->
    <order-create ref="createPopup"></order-create>
    <order-edit ref="editPopup"></order-edit>
    

  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { required, minLength, between } from 'vuelidate/lib/validators'
import globalMixin from '@/mixins/global'
import OrderCreate from '@/components/popups/OrderCreate'
import OrderEdit from '@/components/popups/OrderEdit'
export default {
  name: 'Order',
  mixins: [globalMixin],
  components: {
    OrderCreate,
    OrderEdit,
  },
  data() {
    return {
      orderList: [],
      memberList: [],
      designerList: [],
      priceList: [],
      datesOfWeek: [],
      statusOpts: [
        {label: "已過期", value: "3"},
        {label: "已取消", value: "2"},
        {label: "已核銷", value: "1"},
        {label: "未使用", value: "0"},
      ],
      searchForm: {
        storeGuid: "",
        designerGuid: "",
        memberGuid: "",
        username: "",
        orderDate: "",
        doneDate: "",
        status: "",
      },
    }
  },
  async mounted() {
    if(this.loginInfo.type === 1) {
      this.v_getStoreList()
      this.v_getMemberList()
      await this._getOrderList()
    }else {
      await this._getOrderList()
      // this._getDesignerList()
      // this._getPriceList()
    }


    if(this.$route.query.id) {
      this.onEdit(this.$route.query.id)
    }


    $(this.$refs.editPopup.$el).on("hidden.bs.modal", () => {
      this.$router.push({name: "Order"})
    })
    
  },
  watch: {
    $route() {
      if(this.$route.query.id) {
        this.onEdit(this.$route.query.id)
      }
    }
  },
  computed: {
    ...mapState([
      'storeList',
    ]),
  },
  methods: {
    ...mapActions([
      'getTimeTable',
      'bookAvailableTime',
      'getPriceList',
      'getDesignerList',
      'getOrderList',
      'modOrder',

      'v_getStoreList',
      'v_getMemberList',
    ]),
    _initOrder(order) {
      return {
        ...order,
      }
    },
    onSearch() {
      this._getOrderList()
    },
    toStatus(id) {
      var i = this.statusOpts.findIndex(opt => opt.value === id)
      return i > -1 ? this.statusOpts[i].label : ''
    },
    toStore(id) {
      var i = this.storeList.findIndex(store => store.storeGuid === id)
      return i > -1 ? this.storeList[i].storeName : ''
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

      if(this.loginInfo.type === 2) data.storeGuid = this.storeInfo.storeGuid
      if(this.loginInfo.type === 3) data.designerGuid = this.storeInfo.designerGuid

      var res = await this.getOrderList(data)
      if(res.code === 0) {
        this.orderList = res.data.orderList.map(store => this._initOrder(store))
        this.pagination.page = res.data.pageNo
        this.pagination.count = this.orderList.length
      }
      return
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
    onSetQuery(id) {
      this.$router.push({name: "Order", query: {id}})
    },
    onEdit(id) {
      var f = this.$refs.editPopup.form
      var i = this.orderList.findIndex(order => order.orderGuid === id)
      if(i > -1) {
        var s = this.orderList[i]
        f.id = id
        f.storeGuid = s.storeGuid
        f.memberGuid = s.memberGuid
        f.memberName = s.memberUser
        f.designerGuid = s.designerGuid
        f.designerName = s.designerNick
        f.priceGuids = _.map(s.priceGuid.split(","), _.trim)
        
        f.orderDate = s.orderDate
        f.doneDate = s.doneDate !== '-' ? s.doneDate : ''
        f.bookDate = moment(s.bookTime).format("YYYY-MM-DD")
        f.startTime = moment(s.bookTime).format("HH:mm")
        f.gold = s.gold
        f.status = s.stats
        f.vip = s.vips == 1
        $(this.$refs.editPopup.$el).modal('show')
        console.log(id)
      }
      
    },
    onCreate() {
      this.$refs.createPopup.initForm()
      $(this.$refs.createPopup.$el).modal('show')
    },
    async onVerify(verifyType) {
      var f = this.form
      var data = {
        del: 2,
        orderGuid: f.id,
        service: f.priceGuids,
        vips: f.vip ? 1 : 0,
        stats: 1,
      }

      var res = await this.bookAvailableTime(data)
      if(res.code === 0) {
        this._getOrderList()
        $(this.$refs.modal.$el).modal('hide')
        this.$message({
          type: 'success',
          message: `核銷成功`
        });
      }
    },
    onCancel(orderGuid) {
      this.$confirm('是否確認取消訂單?', '提示', {
        confirmButtonText: '取消訂單',
        cancelButtonText: '關閉',
        type: 'warning'
      }).then(async () => {
        var data = {
          del: 1,
          orderGuid,
        }
        var res = await this.bookAvailableTime(data)
        if(res.code === 0) {
          this._getOrderList()
          this.$message({
            type: 'success',
            message: `已取消訂單`
          });
        }
      }).catch(() => false);
      
    },
  }
}
</script>
