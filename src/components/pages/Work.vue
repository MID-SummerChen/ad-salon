<template>
  <div id="work">
    <div class="page-header">
      <h1>作品管理</h1>
      <el-button type="primary" @click="onCreate">新增作品</el-button>
    </div>
    <el-table
      :data="workList"
      style="width: 100%">
      <el-table-column
        width="200"
        label="作品圖">
        <template scope="scope">
          <img v-if="scope.row.pic1" :src="'http://' + host + scope.row.pic1" alt="">
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        prop="workName"
        label="作品名稱">
      </el-table-column>
      <el-table-column
        label="設計師">
        <template scope="scope">
          {{toDesigner(scope.row.designerGuid)}}
        </template>
      </el-table-column>
      <el-table-column
        label="髮廊">
        <template scope="scope">
          {{toStore(scope.row.storeGuid)}}
        </template>
      </el-table-column>
      <el-table-column
        label="性別">
        <template scope="scope">
          {{toGender(scope.row.gender)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="價格">
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
          
          <el-button @click="onEdit(scope.row.workGuid)" type="text" size="small">编辑</el-button>
          <el-button @click="onDel(scope.row.workGuid)" type="text" size="small">刪除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Modal -->
    <div ref="modal" class="modal fade">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">作品資訊</h4>
          </div>
          <div class="modal-body">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="作品圖片1">
                <input type="file" ref="pic1">
                <div v-if="form.pic1" style="margin-top: 20px">
                  <img :src="form.pic1" alt="">
                </div>
              </el-form-item>
              <el-form-item label="作品圖片2">
                <input type="file" ref="pic2">
                <div v-if="form.pic2" style="margin-top: 20px">
                  <img :src="form.pic2" alt="">
                </div>
              </el-form-item>
              <el-form-item label="作品圖片3">
                <input type="file" ref="pic3">
                <div v-if="form.pic3" style="margin-top: 20px">
                  <img :src="form.pic3" alt="">
                </div>
              </el-form-item>
              <el-form-item label="作品圖片4">
                <input type="file" ref="pic4">
                <div v-if="form.pic4" style="margin-top: 20px">
                  <img :src="form.pic4" alt="">
                </div>
              </el-form-item>
              
              <el-form-item label="作品名稱">
                <el-input v-model="form.workName"></el-input>
              </el-form-item>
              <el-form-item label="髮廊">
                <el-select v-model="form.storeGuid">
                  <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="設計師">
                <el-select v-model="form.designerGuid">
                  <el-option v-for="d in designerList" :label="d.nick" :value="d.designerGuid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="價格">
                <el-input v-model="form.price"></el-input>
              </el-form-item>
              <el-form-item label="描述">
                <el-input v-model="form.descr" type="textarea" :rows="2"></el-input>
                
              </el-form-item>
              <el-form-item label="髮色">
                <el-input v-model="form.hColor"></el-input>
              </el-form-item>
              <el-form-item label="髮長">
                <el-input v-model="form.hLength"></el-input>
              </el-form-item>
              <el-form-item label="風格">
                <el-input v-model="form.style"></el-input>
              </el-form-item>
              <el-form-item label="性別">
                <el-radio-group v-model="form.gender">
                  <el-radio v-for="opt in genderOpts" :label="opt.value">{{opt.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="完成日期">
                <el-date-picker type="date" placeholder="ex: 2017-5-20" v-model="form.workdate" style="width: 100%;"></el-date-picker>
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
  name: 'Work',
  mixins: [globalMixin],
  data() {
    return {
      workList: [],
      storeList: [],
      designerList: [],
      genderOpts: [
        {label: "男", value: "1"},
        {label: "女", value: "2"},
      ],
      form: {
        id: "",
        storeGuid: "",
        designerGuid: "",
        workName: "",
        price: 200,
        descr: "",
        hColor: "",
        hLength: "",
        style: "",
        workdate: "",
        gender: "1",
        status: true,
        pic1: "",
        pic2: "",
        pic3: "",
        pic4: "",
      },
      rules: {
        workName: [
          { required: true, message: '不可為空'}
        ],
        noid: [
          { required: true, message: '不可為空'}
        ],
      }
    }
  },
  mounted() {
    this._getStoreList()
    this._getDesignerList()
    this._getWorkList()
  },
  methods: {
    ...mapActions([
      'getStoreList',
      'getDesignerList',
      'getWorkList',
      'modWork',
      'uploadWorkPic',
    ]),
    _initWork(work) {
      return {
        ...work,
      }
    },
    async _getStoreList() {
      var res = await this.getStoreList()
      if(res.code === 0) {
        this.storeList = res.data.storeList
      }
    },
    async _getDesignerList() {
      var res = await this.getDesignerList()
      if(res.code === 0) {
        this.designerList = res.data.designerList
      }
    },
    toGender(val) {
      var i = this.genderOpts.findIndex(opt => opt.value === val)
      return i > -1 ? this.genderOpts[i].label : ""
    },
    toStore(id) {
      var i = this.storeList.findIndex(store => store.storeGuid === id)
      return i > -1 ? this.storeList[i].storeName : ''
    },
    toDesigner(id) {
      var i = this.designerList.findIndex(store => store.designerGuid === id)
      return i > -1 ? this.designerList[i].nick : ''
    },
    clearForm() {
      this.$refs.form.resetFields()
      this.form = {
        id: "",
        storeGuid: "",
        designerGuid: "",
        workName: "",
        price: 200,
        descr: "",
        hColor: "",
        hLength: "",
        style: "",
        workdate: "",
        gender: "1",
        status: true,
        pic1: "",
        pic2: "",
        pic3: "",
        pic4: "",
      }
    },
    async _getWorkList() {
      var res = await this.getWorkList()
      if(res.code === 0) {
        this.workList = res.data.workList.map(work => this._initWork(work))
      }
    },
    onDel(id) {
      this.$confirm('是否確定刪除？', '提示', {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var data = {
          workGuid: id,
          del: 1
        }
        var res = await this.modWork(data)
        if(res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this._getWorkList()
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
      var i = this.workList.findIndex(work => work.workGuid === id)
      if(i > -1) {
        var s = this.workList[i]
        f.id = id
        f.storeGuid = s.storeGuid
        f.designerGuid = s.designerGuid
        f.workName = s.workName
        f.price = s.price
        f.descr = s.descr
        f.descr = s.descr
        f.hColor = s.hColor
        f.hLength = s.hLength
        f.style = s.style
        f.workdate = s.workdate !== '-' && s.workdate !== '0000-00-00' ? s.workdate : ''
        f.gender = s.gender
        f.status = s.stats == 1
        f.pic1 = s.pic1 ? `http://${this.host}${s.pic1}` : ""
        f.pic2 = s.pic2 ? `http://${this.host}${s.pic2}` : ""
        f.pic3 = s.pic3 ? `http://${this.host}${s.pic3}` : ""
        f.pic4 = s.pic4 ? `http://${this.host}${s.pic4}` : ""
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
            workGuid: f.id || -1,
            storeGuid: f.storeGuid,
            designerGuid: f.designerGuid,
            workName: f.workName,
            price: f.price,
            descr: f.descr,
            hColor: f.hColor,
            hLength: f.hLength,
            style: f.style,
            workdate: f.workdate ? moment(f.workdate).format('YYYY-MM-DD') : "",
            gender: f.gender,
            stats: f.status ? 1 : 2,
          }

          var formData = new FormData()
          formData.append('pic1', this.$refs.pic1.files[0])
          formData.append('pic2', this.$refs.pic2.files[0])
          formData.append('pic3', this.$refs.pic3.files[0])
          formData.append('pic4', this.$refs.pic4.files[0])
          _.forEach(data, (v, k) => formData.append(k, v))
          var res = await this.modWork(formData)
          if(res.code === 0) {
            this._getWorkList()
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
