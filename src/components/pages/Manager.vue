<template>
  <div id="manager">
    <div class="page-header">
      <h1>管理員設定</h1>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-input v-model="searchForm.username" placeholder="管理員帳號"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button v-if="loginInfo.type === 1" type="primary" @click="onSearch">搜尋</el-button>
          <el-button type="danger" @click="onCreate">新增管理員</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="managerList" style="width: 100%">
      <el-table-column label="管理員帳號" prop="username"></el-table-column>
      <el-table-column label="暱稱" prop="nick"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150">
        <template scope="scope">
          <el-button @click="onEdit(scope.row.adminid)" type="text" size="small">编辑</el-button>
          <el-button @click="onDel(scope.row.adminid)" type="text" size="small">刪除</el-button>
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
            <h4 class="modal-title">管理員資訊</h4>
          </div>
          <div class="modal-body">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="帳號" prop="username">
                <el-input v-model="form.username" :disabled="!!form.id"></el-input>
              </el-form-item>
              <el-form-item label="暱稱" prop="nick">
                <el-input v-model="form.nick"></el-input>
              </el-form-item>
              <el-form-item label="密碼" prop="pw">
                <el-input type="password" v-model="form.pw"></el-input>
              </el-form-item>
              <el-form-item label="密碼確認" prop="pw_c">
                <el-input type="password" v-model="form.pw_c"></el-input>
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
  name: 'Manager',
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
      managerList: [],
      storeList: [],
      searchForm: {
        username: ""
      },
      form: {
        id: "",
        username: "",
        nick: "",
        pw: "",
        pw_c: "",
        status: true,
      },
      rules: {
        username: [
          { required: true, message: '不可為空'}
        ],
        nick: [
          { required: true, message: '不可為空'}
        ],
        pw: [
          { validator: validPw},
        ],
        pw_c: [
          { validator: validPwConfirm},
        ],
      }
    }
  },
  mounted() {
    this._getManagerList()
  },
  computed: {

  },
  methods: {
    ...mapActions([
      'getStoreList',
      'getManagerList',
      'modManager',
    ]),
    _initManager(manager) {
      return {
        ...manager
      }
    },
    async onSearch() {
      this._getManagerList()
    },
    toStore(id) {
      var i = this.storeList.findIndex(store => store.storeGuid === id)
      return i > -1 ? this.storeList[i].storeName : ''
    },
    clearForm() {
      this.$refs.form.resetFields()
      this.form = _.assign({}, this.form, {
        id: "",
        username: "",
        nick: "",
        pw: "",
        pw_c: "",
        status: true,
      })
    },
    async _getStoreList() {
      var res = await this.getStoreList()
      if(res.code === 0) {
        this.storeList = res.data.storeList
      }
    },
    async _getManagerList() {
      var data = {
        pageNo: this.pagination.page
      }
      if(this.searchForm.username) data.username = this.searchForm.username

      var res = await this.getManagerList(data)
      if(res.code === 0) {
        this.managerList = res.data.adminList.map(manager => this._initManager(manager))
        this.pagination.page = res.data.pageNo
        this.pagination.count = this.managerList.length
      }
    },
    onDel(id) {
      this.$confirm('是否確定刪除？', '提示', {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var data = {
          adminid: id,
          del: 1
        }
        var res = await this.modManager(data)
        if(res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this._getManagerList()
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
      var i = this.managerList.findIndex(manager => manager.adminid === id)
      if(i > -1) {
        var s = this.managerList[i]
        f.id = id
        f.username = s.username
        f.nick = s.nick
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
            adminid: f.id || -1,
            username: f.username,
            pwd: f.pw,
            nick: f.nick,
          }
          var res = await this.modManager(data)
          if(res.code === 0) {
            this._getManagerList()
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
