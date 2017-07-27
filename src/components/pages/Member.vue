<template>
  <div id="member">
    <div class="page-header">
      <h1>會員管理</h1>
      <el-row v-if="loginInfo" :gutter="10">
        <el-col :span="6">
          <el-input v-model="searchForm.username" placeholder="會員帳號"></el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="onSearch">搜尋</el-button>
          <el-button type="danger" @click="onCreate">新增會員</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="memberList" style="width: 100%">
      <el-table-column label="會員帳號" prop="username" width="120"></el-table-column>
      <el-table-column label="暱稱" prop="nick" width="120"></el-table-column>
      <el-table-column label="手機" prop="mobile" width="120"></el-table-column>
      <el-table-column label="近一月消費金額" width="100" prop="orderGold"></el-table-column>
      <el-table-column label="剩餘紅利" width="100" prop="bonus"></el-table-column>
      <el-table-column label="訂購日期" width="180" prop="orderDate"></el-table-column>

      <el-table-column label="狀態">
        <template scope="scope">
          {{toStatus(scope.row.stats)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template scope="scope">
          <el-button @click="onEdit(scope.row.memberGuid)" type="text" size="small">编辑</el-button>
          <el-button @click="onDel(scope.row.memberGuid)" type="text" size="small">刪除</el-button>
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
            <h4 class="modal-title">會員資訊</h4>
          </div>
          <div class="modal-body">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="帳號" prop="username">
                <el-input v-model="form.username"></el-input>
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
              <el-form-item label="信箱" prop="email">
                <el-input v-model="form.email"></el-input>
              </el-form-item>
              <el-form-item label="手機" prop="mobile">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="紅利">
                <el-input v-model="form.bonus"></el-input>
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
  name: 'Member',
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
      memberList: [],
      searchForm: {
        username: ""
      },
      form: {
        id: "",
        username: "",
        nick: "",
        email: "",
        mobile: "",
        gender: 1,
        bonus: 0,
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
    this._getMemberList()

  },
  computed: {

  },
  methods: {
    ...mapActions([
      'getMemberList',
      'modMember',
    ]),
    _initMember(member) {
      return {
        ...member,
      }
    },
    clearForm() {
      this.$refs.form.resetFields()
      this.form = {
        id: "",
        username: "",
        nick: "",
        email: "",
        mobile: "",
        gender: 1,
        bonus: 0,
        pw: "",
        pw_c: "",
        status: true,
      }
    },
    onSearch() {
      this._getMemberList()
    },
    async _getMemberList() {
      var data = {
        pageNo: this.pagination.page
      }
      if(this.searchForm.username) data.username = this.searchForm.username
      var res = await this.getMemberList(data)
      if(res.code === 0) {
        this.memberList = res.data.memberList.map(member => this._initMember(member))
        this.pagination.page = res.data.pageNo
        this.pagination.count = this.memberList.length
      }
    },
    onDel(id) {
      this.$confirm('是否確定刪除？', '提示', {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var data = {
          memberGuid: id,
          del: 1
        }
        var res = await this.modMember(data)
        if(res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this._getMemberList()
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
      var i = this.memberList.findIndex(member => member.memberGuid === id)
      if(i > -1) {
        var s = this.memberList[i]
        f.id = id
        f.username = s.username
        f.nick = s.nick
        f.email = s.email
        f.mobile = s.mobile
        f.gender = s.gender - 0
        f.addDate = s.addDate
        f.bonus = s.bonus
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
            memberGuid: f.id || -1,
            stats: f.status ? 1 : 2,
            username: f.username,
            pwd: f.pw,
            nick: f.nick,
            email: f.email,
            mobile: f.mobile,
            gender: f.gender,
            bonus: f.bonus,
          }
          var res = await this.modMember(data)
          if(res.code === 0) {
            this._getMemberList()
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
