<template>
  <div id="adv">
    <div class="page-header">
      <h1>廣告管理</h1>
      <el-row :gutter="10">
        <!--<el-col v-if="loginInfo.type === 1" :span="6">
          <el-select style="width: 100%" v-model="searchForm.storeGuid">
            <el-option label="總管理後台" value=""></el-option>
            <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
          </el-select>
        </el-col>-->
        <el-col :span="6">
          <!--<el-button v-if="loginInfo.type === 1" type="primary" @click="onSearch">搜尋</el-button>-->
          <el-button type="danger" @click="onCreate">新增廣告</el-button>
          <!--<el-button v-if="loginInfo.type === 1 || advList.length < 3" type="danger" @click="onCreate">新增廣告</el-button>-->
        </el-col>
      </el-row>
    </div>
    <el-table :data="advList" style="width: 100%">
      <el-table-column width="180" prop="advName" label="廣告名稱"></el-table-column>
      <el-table-column width="200" label="圖片">
        <template scope="scope">
          <img v-if="scope.row.pic" :src="scope.row.pic" alt="">
        </template>
      </el-table-column>
      <el-table-column width="150" prop="sDate" label="開始時間"></el-table-column>
      <el-table-column width="150" prop="eDate" label="結束時間"></el-table-column>
      <el-table-column label="狀態">
        <template scope="scope">
          {{toStatus(scope.row.stats)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template scope="scope">
          <el-button @click="onEdit(scope.row.advGuid)" type="text" size="small">编辑</el-button>
          <el-button @click="onDel(scope.row.advGuid)" type="text" size="small">刪除</el-button>
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
            <h4 class="modal-title">廣告資訊</h4>
          </div>
          <div class="modal-body">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="廣告圖片">
                <input type="file" ref="fileSelector">
                <div v-if="form.imgSrc" style="margin-top: 20px">
                  <img :src="form.imgSrc" alt="">
                </div>
              </el-form-item>
              <!--<el-form-item v-if="loginInfo.type === 1" label="廣告目標" prop="storeGuid">
                <el-select v-model="form.storeGuid" style="width: 100%">
                  <el-option label="總管理後台" value=""></el-option>
                  <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
                </el-select>
              </el-form-item>-->
              <el-form-item label="廣告名稱" prop="advName">
                <el-input v-model="form.advName"></el-input>
              </el-form-item>
              <el-form-item label="廣告連結" prop="url">
                <el-input v-model="form.url"></el-input>
              </el-form-item>
              <el-form-item label="廣告期間">
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="開始時間" v-model="form.sDate" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col :span="2" style="text-align: center">-</el-col>
                <el-col :span="11">
                  <el-date-picker type="date" placeholder="結束時間" v-model="form.eDate" style="width: 100%;"></el-date-picker>
                </el-col>
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
  name: 'Adv',
  mixins: [globalMixin],
  data() {
    return {
      storeList: [],
      advList: [],
      searchForm: {
        storeGuid: ""
      },
      form: {
        id: "",
        storeGuid: "",
        advName: "",
        url: "",
        sDate: moment(),
        eDate: moment(),
        status: true,
        imgSrc: ""
      },
      rules: {
        advName: [
          { required: true, message: '不可為空'}
        ],
      }
    }
  },
  mounted() {
    if(this.loginInfo.type === 1) {
      this._getStoreList()
      this._getAdvList()
    }else {
     this._getAdvList() 
    }
    

  },
  computed: {
  },
  methods: {
    ...mapActions([
      'getStoreList',
      'getAdvList',
      'modAdv',
    ]),
    _initAdv(adv) {
      return {
        ...adv,
      }
    },
    clearForm() {
      this.$refs.form.resetFields()
      this.$refs.fileSelector.value = ""
      this.form = {
        id: "",
        storeGuid: "",
        advName: "",
        url: "",
        sDate: moment(),
        eDate: moment(),
        status: true,
        imgSrc: ""
      }
    },
    toStore(id) {
      var i = this.storeList.findIndex(store => store.storeGuid === id)
      return i > -1 ? this.storeList[i].storeName : ''
    },
    onSearch() {
      this._getAdvList()
    },
    async _getStoreList() {
      var res = await this.getStoreList()
      if(res.code === 0) {
        this.storeList = res.data.storeList
      }
    },
    async _getAdvList() {
      var data = {
        pageNo: this.pagination.page,
      }
      var sf = this.searchForm
      if(sf.storeGuid) data.storeGuid = sf.storeGuid
      if(this.loginInfo.type !== 1) data.storeGuid = this.storeInfo.storeGuid

      var res = await this.getAdvList(data)
      if(res.code === 0) {
        this.advList = res.data.advList.map(adv => this._initAdv(adv))
        this.pagination.page = res.data.pageNo
        this.pagination.count = this.advList.length
      }
    },
    onDel(id) {
      this.$confirm('是否確定刪除？', '提示', {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var data = {
          advGuid: id,
          del: 1
        }
        var res = await this.modAdv(data)
        if(res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this._getAdvList()
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
      var i = this.advList.findIndex(adv => adv.advGuid === id)
      if(i > -1) {
        var s = this.advList[i]
        f.id = id
        f.advName = s.advName
        f.url = s.url
        f.storeGuid = s.storeGuid
        f.sDate = s.sDate
        f.eDate = s.eDate
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
        if(valid) {
          var f = this.form
          var data = {
            advGuid: f.id || -1,
            storeGuid: f.storeGuid,
            advName: f.advName,
            url: f.url,
            sDate: moment(f.sDate).format('YYYY-MM-DD'),
            eDate: moment(f.eDate).format('YYYY-MM-DD'),
            stats: f.status ? 1 : 2,
          }
          if(this.loginType !== 1) {
            data.storeGuid = this.storeInfo.storeGuid
          }

          var formData = new FormData()
          formData.append('pic', this.$refs.fileSelector.files[0])
          _.forEach(data, (v, k) => formData.append(k, v))
          var res = await this.modAdv(formData)
          if(res.code === 0) {
            
            this._getAdvList()
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
