<template>
  <div id="price">
    <div class="page-header">
      <h1>價目表管理</h1>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select v-if="loginInfo.type === 1" style="width: 100%" v-model="searchForm.storeGuid">
            <el-option label="全部店家" value=""></el-option>
            <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button v-if="loginInfo.type === 1" type="primary" @click="onSearch">搜尋</el-button>
          <el-button type="danger" @click="onCreate">新增項目</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="priceList" style="width: 100%">
      <el-table-column v-if="loginInfo.type === 1" label="髮廊" width="150">
        <template scope="scope">
          {{toStore(scope.row.storeGuid)}}
        </template>
      </el-table-column>
      <el-table-column width="200" label="圖片">
        <template scope="scope">
          <img v-if="scope.row.pic" :src="scope.row.pic" alt="">
        </template>
      </el-table-column>
      <el-table-column prop="name" width="130" label="名稱"> </el-table-column>
      <el-table-column prop="price" width="130" label="價格"></el-table-column>
      <el-table-column prop="neededTime" width="130" label="需時"></el-table-column>
      </el-table-column>
      <el-table-column label="狀態">
        <template scope="scope">
          {{toStatus(scope.row.stats)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template scope="scope">
          <el-button @click="onEdit(scope.row.priceGuid)" type="text" size="small">编辑</el-button>
          <el-button @click="onDel(scope.row.priceGuid)" type="text" size="small">刪除</el-button>
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
            <h4 class="modal-title">價目資訊</h4>
          </div>
          <div class="modal-body">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="圖片">
                <input type="file" ref="fileSelector">
                <div v-if="form.imgSrc" style="margin-top: 20px">
                  <img :src="form.imgSrc" alt="">
                </div>
              </el-form-item>
              <el-form-item v-if="loginInfo.type === 1" label="髮廊" prop="storeGuid">
                <el-select v-model="form.storeGuid" style="width: 100%">
                  <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="名稱" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="所需時間" prop="neededTime">
                <el-input-number v-model="form.neededTime" :step="0.5"></el-input-number>
              </el-form-item>
              <el-form-item label="價格" prop="price">
                <el-input-number v-model="form.price" :controls="false"></el-input-number>
              </el-form-item>
              <el-form-item label="描述">
                <el-input type="textarea" v-model="form.descr"></el-input>
              </el-form-item>
              <el-form-item label="價格類型">
                <el-radio-group v-model="form.priceType">
                  <el-radio v-for="opt in priceTypeOpts" :label="opt.value">{{opt.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.priceType === 2" label="促銷期間">
                <el-date-picker type="date" v-model="form.startDate" placeholder="開始時間"></el-date-picker>
                ~
                <el-date-picker type="date" v-model="form.endDate" placeholder="結束時間"></el-date-picker>
              </el-form-item>
              
              <el-form-item label="狀態">
                <el-switch on-text="" off-text="" v-model="form.status"></el-switch>
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
  name: 'Price',
  mixins: [globalMixin],
  data() {
    var valideNeededTime = (rule, value, callback) => {
      if (this.form.neededTime % 0.5 !== 0) {
        callback(new Error('所需時間必須以0.5(半小時)為一個單位作設定,ex: 1.5 or 2'));
      }else {
        callback();
      }
        
    };
    return {
      priceList: [],
      storeList: [],
      priceTypeOpts: [
        {label: "一般項目", value: 1},
        {label: "促銷項目", value: 2},
      ],
      searchForm: {
        storeGuid: ""
      },
      form: {
        id: "",
        storeGuid: "",
        name: "",
        neededTime: "",
        price: "",
        priceType: 1,
        startDate: "",
        endDate: "",
        descr: "",
        pic: "",
        status: true,
        imgSrc: "",
      },
      rules: {
        storeGuid: [
          { required: true, message: '不可為空'}
        ],
        name: [
          { required: true, message: '不可為空'}
        ],
        neededTime: [
          { required: true, message: '不可為空'},
          { validator: valideNeededTime, trigger: 'change' }
        ],
        price: [
          { required: true, message: '不可為空'}
        ],
      }
    }
  },
  watch: {
  },
  computed: {
    ...mapGetters([
      'loginInfo',
      'storeInfo',
    ])
  },
  mounted() {
    if(this.loginInfo.type === 1) {
      this._getStoreList()
      this._getPriceList()
    }else if(this.loginInfo.type === 2){
      this._getSelfPriceList()
    }
    
    
  },
  methods: {
    ...mapActions([
      'getStoreList',
      'getPriceList',
      'modPrice',
      'uploadPricePic',
      'delPrice',
    ]),
    _initPrice(price) {
      return {
        ...price,
      }
    },
    clearForm() {
      this.$refs.form.resetFields()
      this.$refs.fileSelector.value = ""
      this.form = {
        id: "",
        storeGuid: "",
        name: "",
        neededTime: "",
        price: "",
        priceType: 1,
        startDate: "",
        endDate: "",
        descr: "",
        pic: "",
        status: true,
        imgSrc: "",
      }
    },
    toStore(id) {
      var i = this.storeList.findIndex(store => store.storeGuid === id)
      return i > -1 ? this.storeList[i].storeName : ''
    },
    onSearch() {
      this._getPriceList()
    },
    async _getStoreList() {
      var res = await this.getStoreList()
      if(res.code === 0) {
        this.storeList = res.data.storeList
      }
    },
    async _getPriceList() {
      var data = {
        pageNo: this.pagination.page
      }
      var sf = this.searchForm
      if(sf.storeGuid) data.storeGuid = sf.storeGuid

      var res = await this.getPriceList(data)
      if(res.code === 0) {
        this.priceList = res.data.priceList.map(price => this._initPrice(price))
        this.pagination.page = res.data.pageNo
        this.pagination.count = this.priceList.length
      }
    },
    async _getSelfPriceList() {
      var data = {
        pageNo: this.pagination.page,
        storeGuid: this.storeInfo.storeGuid
      }
      var res = await this.getPriceList(data)
      if(res.code === 0) {
        this.priceList = res.data.priceList.map(price => this._initPrice(price))
        this.pagination.page = res.data.pageNo
        this.pagination.count = this.priceList.length
      }
    },
    onDel(id) {
      this.$confirm('是否確定刪除？', '提示', {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var data = {
          priceGuid: id,
        }
        var res = await this.delPrice(data)
        if(res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this._getPriceList()
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
      var i = this.priceList.findIndex(price => price.priceGuid === id)
      if(i > -1) {
        var s = this.priceList[i]
        f.id = id
        f.storeGuid = s.storeGuid
        f.name = s.name
        f.neededTime = s.neededTime
        f.price = s.price
        f.addr = s.address
        f.descr = s.descr
        f.status = s.stats == 1
        f.imgSrc = s.pic
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
        console.log(valid)
        if(valid) {
          var f = this.form
          var data = {
            priceGuid: f.id || -1,
            storeGuid: f.storeGuid,
            name: f.name,
            neededTime: f.neededTime,
            price: f.price,
            descr: f.descr,
            openTime: f.openTime,
            contact: f.contact,
            mobile: f.mobile,
            stats: f.status ? 1 : 2,
            priceType: f.priceType,
            sdate: moment(f.startDate).startOf('day').format("YYYY-MM-DD HH:mm"),
            edate: moment(f.endDate).endOf('day').format("YYYY-MM-DD HH:mm"),
          }
          if(this.loginInfo.type === 2) {
            data.storeGuid = this.storeInfo.storeGuid
          }

          var formData = new FormData()
          formData.append('pic', this.$refs.fileSelector.files[0])
          _.forEach(data, (v, k) => formData.append(k, v))
          var res = await this.modPrice(formData)
          if(res.code === 0) {
            
            if(this.loginInfo.type === 1) {
              this._getPriceList()
            }else {
              this._getSelfPriceList()
            }
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
