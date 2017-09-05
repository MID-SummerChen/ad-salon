<template>
  <div id="work">
    <div class="page-header">
      <h1>作品管理</h1>
      <el-row :gutter="10">
        <el-col v-if="loginInfo.type === 1" :span="6">
          <el-select style="width: 100%" v-model="searchForm.storeGuid" @change="onStoreChanged">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
          </el-select>
        </el-col>
        <el-col v-if="loginInfo.type === 1" :span="6">
          <el-select style="width: 100%" v-model="searchForm.designerGuid">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="d in designerList" :label="d.nick" :value="d.designerGuid"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button v-if="loginInfo.type === 1" type="primary" @click="onSearch">搜尋</el-button>
          <el-button type="danger" @click="onCreate">新增作品</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="workList" style="width: 100%">
      <el-table-column width="200" label="作品圖">
        <template scope="scope">
          <img v-if="scope.row.pic1" :src="scope.row.pic1" alt="">
        </template>
      </el-table-column>
      <el-table-column width="200" prop="workName" label="作品名稱"></el-table-column>
      <el-table-column label="設計師" width="120">
        <template scope="scope">
          {{toDesigner(scope.row.designerGuid)}}
        </template>
      </el-table-column>
      <el-table-column v-if="loginInfo.type === 1" label="髮廊" width="150">
        <template scope="scope">
          {{toStore(scope.row.storeGuid)}}
        </template>
      </el-table-column>
      <el-table-column label="性別">
        <template scope="scope">
          {{toGender(scope.row.gender)}}
        </template>
      </el-table-column>
      <el-table-column prop="service_name" label="服務" width="150"></el-table-column>
      <el-table-column prop="service_price" label="價格" width="100"></el-table-column>
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
    <div style="margin-top: 10px"></div>
    <el-pagination layout="prev, pager, next" :total="pagination.count" :page-size="pagination.perpage"></el-pagination>


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
              <el-form-item label="正面照片">
                <input type="file" ref="pic1">
                <div v-if="form.pic1" style="margin-top: 20px">
                  <img :src="form.pic1" alt="">
                </div>
              </el-form-item>
              <el-form-item label="側面照片">
                <input type="file" ref="pic2">
                <div v-if="form.pic2" style="margin-top: 20px">
                  <img :src="form.pic2" alt="">
                </div>
              </el-form-item>
              <el-form-item label="背面照片">
                <input type="file" ref="pic3">
                <div v-if="form.pic3" style="margin-top: 20px">
                  <img :src="form.pic3" alt="">
                </div>
              </el-form-item>
              
              <el-form-item label="作品名稱" prop="workName">
                <el-input v-model="form.workName"></el-input>
              </el-form-item>
              <el-form-item v-if="loginInfo.type === 1" label="髮廊" prop="storeGuid">
                <el-select v-model="form.storeGuid" style="width: 100%">
                  <el-option v-for="s in storeList" :label="s.storeName" :value="s.storeGuid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="loginInfo.type !== 3" label="設計師" prop="designerGuid">
                <el-select v-model="form.designerGuid" style="width: 100%">
                  <el-option v-for="d in designerList" :label="d.nick" :value="d.designerGuid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="服務項目" prop="priceGuid">
                <el-select v-model="form.priceGuid" style="width: 100%" @change="onServiceChanged">
                  <el-option v-for="p in priceList" :label="p.name" :value="p.priceGuid"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="價格" prop="price">
                {{form.price}}
              </el-form-item>
              <el-form-item label="描述" prop="descr">
                <el-input v-model="form.descr" type="textarea" :rows="2"></el-input>
                
              </el-form-item>
              <!-- <el-form-item label="髮色" prop="hColor">
                <el-select v-model="form.hColor" style="width: 100%">
                  <el-option v-for="h in hairColorList" :value="h"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="髮長" prop="hLength">
                <el-select v-model="form.hLength" style="width: 100%">
                  <el-option v-for="h in hairLenList" :value="h"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="風格" prop="style">
                <el-select v-model="form.style" style="width: 100%">
                  <el-option v-for="h in hairStyleList" :value="h"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="性別" prop="gender">
                <el-radio-group v-model="form.gender">
                  <el-radio v-for="opt in genderOpts" :label="opt.value">{{opt.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="完成日期" prop="workdate">
                <el-date-picker type="date" placeholder="ex: 2017-5-20" v-model="form.workdate" style="width: 100%;"></el-date-picker>
              </el-form-item>
              
              <el-form-item label="狀態" prop="status">
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
      priceList: [],
      workList: [],
      storeList: [],
      designerList: [],
      hairColorList: [],
      hairLenList: [],
      hairStyleList: [],
      genderOpts: [
        {label: "男", value: "1"},
        {label: "女", value: "2"},
      ],
      searchForm: {
        storeGuid: "",
        designerGuid: "",
      },
      form: {
        id: "",
        storeGuid: "",
        designerGuid: "",
        priceGuid: "",
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
      },
      rules: {
        workName: [
          { required: true, message: '不可為空'}
        ],
        storeGuid: [
          { required: true, message: '不可為空'}
        ],
        designerGuid: [
          { required: true, message: '不可為空'}
        ],
        priceGuid: [
          { required: true, message: '不可為空'}
        ],
        noid: [
          { required: true, message: '不可為空'}
        ],
        price: [
          { required: true, message: '不可為空'}
        ],
        descr: [
          { required: true, message: '不可為空'}
        ],
        hLength: [
          { required: true, message: '不可為空'}
        ],
        workdate: [
          { required: true, message: '不可為空'}
        ],
        gender: [
          { required: true, message: '不可為空'}
        ],
        status: [
          { required: true, message: '不可為空'}
        ],
      }
    }
  },
  mounted() {
    this._getBasic()
    if(this.loginInfo.type === 1) {
      this._getStoreList()
    }
    if(this.loginInfo.type === 2) {
      this._getDesignerList()
    }
    
    this._getWorkList()
    this._getPriceList()
  },
  methods: {
    ...mapActions([
      'getBasic',
      'getStoreList',
      'getPriceList',
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
    onSearch() {
      this._getWorkList()
    },
    onStoreChanged() {
      if(this.searchForm.storeGuid) {
        this._getDesignerList()
        this._getWorkList()
        this._getPriceList()
      }
    },
    onServiceChanged() {
      if(this.form.priceGuid) {
        var i = _.findIndex(this.priceList, {priceGuid: this.form.priceGuid})
        if(i > -1) {
          this.form.price = this.priceList[i].price
        }
      }
    },
    async _getPriceList() {
      var data = {}
      var sf = this.searchForm
      if(sf.storeGuid) data.storeGuid = sf.storeGuid
      if(this.loginInfo.type !== 1) data.storeGuid = this.storeInfo.storeGuid

      var res = await this.getPriceList(data)
      if(res.code === 0) {
        this.priceList = res.data.priceList
      }
    },
    async _getBasic() {
      var res = await this.getBasic()
      if(res.code === 0) {
        this.hairStyleList = res.data.style
        this.hairLenList = res.data.hLength
        this.hairColorList = res.data.hColor
      }
    },
    async _getStoreList() {
      var res = await this.getStoreList()
      if(res.code === 0) {
        this.storeList = res.data.storeList
      }
    },
    async _getDesignerList() {
      var data = {}
      var sf = this.searchForm
      if(sf.storeGuid) data.storeGuid = sf.storeGuid
      if(this.loginInfo.type !== 1) data.storeGuid = this.storeInfo.storeGuid

      var res = await this.getDesignerList(data)
      if(res.code === 0) {
        this.designerList = _(res.data.designerList).filter({appoint: 1}).value()
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
        priceGuid: "",
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
      }
    },
    async _getWorkList() {
      var data = {
        pageNo: this.pagination.page
      }
      var sf = this.searchForm
      if(sf.storeGuid) data.storeGuid = sf.storeGuid
      if(sf.designerGuid) data.designerGuid = sf.designerGuid
      if(this.loginInfo.type !== 1) data.storeGuid = this.storeInfo.storeGuid
      if(this.loginInfo.type === 3) data.designerGuid = this.storeInfo.designerGuid

      var res = await this.getWorkList(data)
      if(res.code === 0) {
        this.workList = res.data.workList.map(work => this._initWork(work))
        this.pagination.page = res.data.pageNo
        this.pagination.count = this.workList.length
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
        f.priceGuid = s.priceGuid
        f.workName = s.workName
        f.price = s.service_price
        f.descr = s.descr
        f.descr = s.descr
        f.hColor = s.hColor
        f.hLength = s.hLength
        f.style = s.style
        f.workdate = s.workdate !== '-' && s.workdate !== '0000-00-00' ? s.workdate : ''
        f.gender = s.gender
        f.status = s.stats == 1
        f.pic1 = s.pic1
        f.pic2 = s.pic2
        f.pic3 = s.pic3
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
            priceGuid: f.priceGuid,
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
          if(this.loginInfo.type !== 1) data.storeGuid = this.storeInfo.storeGuid
          if(this.loginInfo.type === 3) data.designerGuid = this.storeInfo.designerGuid

          var formData = new FormData()
          formData.append('pic1', this.$refs.pic1.files[0])
          formData.append('pic2', this.$refs.pic2.files[0])
          formData.append('pic3', this.$refs.pic3.files[0])
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
