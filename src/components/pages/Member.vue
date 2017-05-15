<template>
  <div id="member">
    <div class="page-header">
      <h1>會員管理</h1>
    </div>
    
    <el-table
    :data="memberList"
    style="width: 100%">
    <!--<el-table-column type="expand">
      <template scope="props">
        <el-form inline>
          <el-form-item label="會員帳號">
            <span>{{ props.row.username }}</span>
          </el-form-item>
          <el-form-item label="暱稱">
            <span>{{ props.row.nick }}</span>
          </el-form-item>
          <el-form-item label="手機">
            <span>{{ props.row.mobile }}</span>
          </el-form-item>
          <el-form-item label="Email">
            <span>{{ props.row.email }}</span>
          </el-form-item>
          <el-form-item label="性別">
            <span>{{ props.row.gender }}</span>
          </el-form-item>
          <el-form-item label="剩餘紅利">
            <span>{{ props.row.bonus }}</span>
          </el-form-item>
          <el-form-item label="加入日期">
            <span>{{ props.row.addDate }}</span>
          </el-form-item>
          <el-form-item label="最新訂購日期">
            <span>{{ props.row.orderDate }}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>-->
    <el-table-column
      label="會員帳號"
      prop="username">
    </el-table-column>
    <el-table-column
      label="暱稱"
      prop="nick">
    </el-table-column>
    <el-table-column
      label="手機"
      prop="mobile">
    </el-table-column>
    <el-table-column
      label="剩餘紅利"
      prop="bonus">
    </el-table-column>
    <el-table-column
      label="最新訂購日期"
      prop="orderDate">
    </el-table-column>
  </el-table>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'Member',
  data() {
    return {
      memberList: []
    }
  },
  mounted() {
    this._getMemberList()
  },
  computed: {

  },
  methods: {
    ...mapActions([
      'getMemberList'
    ]),
    _initMember(member) {
      return {
        ...member,
        gender: _.toNumber(member.gender),
        stats: _.toNumber(member.stats),
        bonus: _.toNumber(member.bonus),
      }
    },
    async _getMemberList() {
      var res = await this.getMemberList()
      if(res.code === 0) {
        this.memberList = res.data.memberList.map(member => this._initMember(member))
      }
    },
  }
}
</script>
