<template>
  <div id="designer">
    <div class="page-header">
      <h1>設計師管理</h1>
    </div>

    <el-table
      :data="designerList"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="名稱">
      </el-table-column>
      <el-table-column
        prop="nick"
        label="暱稱">
      </el-table-column>
      <el-table-column
        prop="gender"
        label="性別">
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
          
          <el-button @click="onEdit(scope.designerGuid)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import globalMixin from '@/mixins/global'
export default {
  name: 'Designer',
  mixins: [globalMixin],
  data() {
    return {
      designerList: []
    }
  },
  mounted() {
    this._getDesignerList()
  },
  computed: {
  },
  methods: {
    ...mapActions([
      'getDesignerList',
    ]),
    _initDesigner(designer) {
      return {
        ...designer,
      }
    },
    async _getDesignerList() {
      var res = await this.getDesignerList()
      if(res.code === 0) {
        this.designerList = res.data.memberList.map(designer => this._initDesigner(designer))
      }
    },
    onEdit(id) {
      console.log(id)
    },
  }
}
</script>
