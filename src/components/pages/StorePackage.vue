<template>
  <div id="Package">
    <div class="page-header">
      <h1>方案設定</h1>
      <el-button type="danger" @click="onCreate">新增方案</el-button>
    </div>
    <el-table :data="PackageList" style="width: 100%">
      <el-table-column label="方案名稱" prop="name"></el-table-column>
      <el-table-column label="指定設計師" prop="appoint"></el-table-column>
      <el-table-column label="不指定設計師" prop="nappoint"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template scope="scope">
          <el-button @click="onEdit(scope.row.packageGuid)" type="text" size="small">编辑</el-button>
          <el-button @click="onDel(scope.row.packageGuid)" type="text" size="small">刪除</el-button>
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
            <h4 class="modal-title">方案資訊</h4>
          </div>
          <div class="modal-body">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="方案名稱" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
              <el-form-item label="方案說明" prop="descr">
                <el-input v-model="form.descr"></el-input>
              </el-form-item>
              <el-form-item label="指定設計師數量" prop="descr">
                <el-input-number v-model="form.appoint" :min="1" :max="10"></el-input-number>
              </el-form-item>
              <el-form-item label="不指定設計師數量" prop="descr">
                <el-input-number v-model="form.nappoint" :min="1" :max="10"></el-input-number>
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
import { required, minLength, between, sameAs } from 'vuelidate/lib/validators'
import globalMixin from '@/mixins/global'
export default {
  name: 'Package',
  mixins: [globalMixin],
  data() {
    var validPw = (rule, value, cb) => {
      if(this.form.id) {
        cb();
      } else if(value === '') {
        cb(new Error('不可為空'));
      } else {
        cb();
      }
    };
    var validPwConfirm = (rule, value, cb) => {
      if(this.form.id) {
        cb();
      } else if(value === '') {
        cb(new Error('不可為空'));
      } else if (value != this.form.pw) {
        cb(new Error('密碼不同!'));
      } else {
        cb();
      }
    };
    return {
      PackageList: [],
      storeList: [],
      searchForm: {
        name: ""
      },
      form: {
        id: "",
        name: "",
        descr: "",
        appoint: "",
        nappoint: "",
      },
      rules: {
        name: [
          { required: true, message: '不可為空'}
        ],
        appoint: [
          { required: true, message: '不可為空'}
        ],
        nappoint: [
          { required: true, message: '不可為空'}
        ],
      }
    }
  },
  mounted() {
    this._getPackageList()
  },
  computed: {

  },
  methods: {
    ...mapActions([
      'getStoreList',
      'getPackageList',
      'modPackage',
    ]),
    _initPackage(Package) {
      return {
        ...Package
      }
    },
    async onSearch() {
      this._getPackageList()
    },
    toStore(id) {
      var i = this.storeList.findIndex(store => store.storeGuid === id)
      return i > -1 ? this.storeList[i].storeName : ''
    },
    clearForm() {
      this.$refs.form.resetFields()
      this.form = _.assign({}, this.form, {
        id: "",
        name: "",
        descr: "",
        appoint: "",
        nappoint: "",
      })
    },
    async _getStoreList() {
      var res = await this.getStoreList()
      if(res.code === 0) {
        this.storeList = res.data.storeList
      }
    },
    async _getPackageList() {
      var data = {
        pageNo: this.pagination.page
      }
      if(this.searchForm.name) data.name = this.searchForm.name

      var res = await this.getPackageList(data)
      if(res.code === 0) {
        this.PackageList = res.data.package.map(Package => this._initPackage(Package))
        this.pagination.page = res.data.pageNo
        this.pagination.count = this.PackageList.length
      }
    },
    onDel(id) {
      this.$confirm('是否確定刪除？', '提示', {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var data = {
          packageGuid: id,
          del: 1
        }
        var res = await this.modPackage(data)
        if(res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this._getPackageList()
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
      var i = this.PackageList.findIndex(Package => Package.packageGuid === id)
      if(i > -1) {
        var s = this.PackageList[i]
        f.id = id
        f.name = s.name
        f.descr = s.descr
        f.nappoint = s.nappoint
        f.appoint = s.appoint
        $(this.$refs.modal).modal('show')
      }
      
    },
    onCreate() {
      this.clearForm()
      $(this.$refs.modal).modal('show')
    },
    async onSubmit() {
      var f = this.form
      this.$refs.form.validate(_validCallback.bind(this))

      async function _validCallback(valid) {
        if(valid) {
          var data = {
            packageGuid: f.id || -1,
            name: f.name,
            descr: f.descr,
            nappoint: f.nappoint,
            appoint: f.appoint,
          }
          var res = await this.modPackage(data)
          if(res.code === 0) {
            this._getPackageList()
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
