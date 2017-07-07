<template>
  <div id="designer">
    <div class="page-header">
      <h1>設計師管理</h1>
      <el-row :gutter="10">
        <el-col :span="6">
          <el-select style="width: 100%" v-model="searchForm.storeGuid">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="onSearch">搜尋</el-button>
          <el-button type="danger" @click="onCreate">新增設計師</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="designerList"
      style="width: 100%">
      <el-table-column
        label="所屬店家">
        <template scope="scope">
          {{toStore(scope.row.storeGuid)}}
        </template>
      </el-table-column>
      <el-table-column
        label="設計師帳號"
        prop="username">
      </el-table-column>
      <el-table-column
        label="暱稱"
        prop="nick">
      </el-table-column>
      <el-table-column
        label="作品數"
        prop="workNum">
      </el-table-column>
      <el-table-column
        label="成交(總)"
        prop="orderDone">
      </el-table-column>
      <el-table-column
        label="成交(月)"
        prop="orderDoneMon">
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
          <el-button @click="onEdit(scope.row.designerGuid)" type="text" size="small">编辑</el-button>
          <el-button @click="onDel(scope.row.designerGuid)" type="text" size="small">刪除</el-button>
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
            <h4 class="modal-title">設計師資訊</h4>
          </div>
          <div class="modal-body">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="所屬店家" prop="store">
                <el-select v-model="form.store">
                  <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
                </el-select>
                
              </el-form-item>
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
              <el-form-item label="生日" prop="birth">
                <el-date-picker v-model="form.birth" type="date"></el-date-picker>
              </el-form-item>
              <el-form-item label="加入年份" prop="sinceYear">
                <el-date-picker v-model="form.sinceYear" type="year"></el-date-picker>
              </el-form-item>
              <el-form-item label="工作時間" prop="workingTime">
                <el-input v-model="form.workingTime"></el-input>
              </el-form-item>
              <el-form-item label="性別" prop="gender">
                <el-radio-group v-model="form.gender">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="狀態">
                <el-switch on-text="" off-text="" v-model="form.status"></el-switch>
              </el-form-item>
              <el-form-item label="描述" prop="desc">
                <el-input type="textarea" v-model="form.desc"></el-input>
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
  name: 'Designer',
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
      designerList: [],
      storeList: [],
      searchForm: {
        storeGuid: ""
      },
      form: {
        id: "",
        username: "",
        nick: "",
        pw: "",
        pw_c: "",
        status: true,
        store: "",
        birth: moment(),
        desc: "",
        workingTime: "",
        gender: "1",
        sinceYear: moment(),
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
    this._getStoreList()
    this._getDesignerList()

  },
  computed: {

  },
  methods: {
    ...mapActions([
      'getStoreList',
      'getDesignerList',
      'modDesigner',
    ]),
    _initDesigner(designer) {
      return {
        ...designer
      }
    },
    async onSearch() {
      this._getDesignerList()
    },
    toStore(id) {
      var i = this.storeList.findIndex(store => store.storeGuid === id)
      return i > -1 ? this.storeList[i].storeName : ''
    },
    clearForm() {
      this.$refs.form.resetFields()
      this.form = {
        id: "",
        username: "",
        nick: "",
        pw: "",
        pw_c: "",
        status: true,
        store: "",
        birth: moment(),
        desc: "",
        workingTime: "",
        gender: "1",
        sinceYear: moment(),
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
        pageNo: this.pagination.page
      }
      if(this.searchForm.storeGuid) data.storeGuid = this.searchForm.storeGuid

      var res = await this.getDesignerList(data)
      if(res.code === 0) {
        this.designerList = res.data.designerList.map(designer => this._initDesigner(designer))
        this.pagination.page = res.data.pageNo
        this.pagination.count = this.designerList.length
      }
    },
    onDel(id) {
      this.$confirm('是否確定刪除？', '提示', {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var data = {
          designerGuid: id,
          del: 1
        }
        var res = await this.modDesigner(data)
        if(res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this._getDesignerList()
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
      var i = this.designerList.findIndex(designer => designer.designerGuid === id)
      if(i > -1) {
        var s = this.designerList[i]
        f.id = id
        f.username = s.username
        f.nick = s.nick
        f.store = s.storeGuid
        f.birth = moment(s.dob)
        f.desc = s.description
        f.workingTime = s.workingTime
        f.gender = s.gender
        f.status = s.stats == 1
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
            designerGuid: f.id || -1,
            stats: f.status ? 1 : 2,
            username: f.username,
            pwd: f.pw,
            nick: f.nick,
            storeGuid: f.store,
            dob: moment(f.birth).format('YYYY-MM-DD'),
            description: f.desc,
            workingTime: f.workingTime,
            gender: f.gender,
            sinceYear: moment(f.sinceYear).format('YYYY'),
          }
          var res = await this.modDesigner(data)
          if(res.code === 0) {
            this._getDesignerList()
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
