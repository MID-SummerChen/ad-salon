<template>
  <div id="store">
    <div class="page-header">
      <h1>店家管理</h1>
      <el-button type="primary" @click="onCreate">新增店家</el-button>
    </div>
    <el-table
      :data="storeList"
      style="width: 100%">
      <el-table-column
        prop="noid"
        label="店家編號">
      </el-table-column>
      <el-table-column
        prop="storeName"
        label="店家名稱">
      </el-table-column>
      <el-table-column
        prop="designer"
        label="設計師">
      </el-table-column>
      <el-table-column
        prop="commision"
        label="紅利累計">
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
          
          <el-button @click="onEdit(scope.row.storeGuid)" type="text" size="small">编辑</el-button>
          <el-button @click="onDel(scope.row.storeGuid)" type="text" size="small">刪除</el-button>
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
            <h4 class="modal-title">店家資訊</h4>
          </div>
          <div class="modal-body">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-form-item label="店家圖片">
                <input type="file" ref="fileSelector">
                <div v-if="form.imgSrc" style="margin-top: 20px">
                  <img :src="form.imgSrc" alt="">
                </div>
              </el-form-item>
              <el-form-item label="店家編號" prop="noid">
                <el-input v-model="form.noid" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="店家名稱" prop="storeName">
                <el-input v-model="form.storeName"></el-input>
              </el-form-item>
              <el-form-item label="店家簡述" prop="intro">
                <el-input v-model="form.intro"></el-input>
              </el-form-item>
              <el-form-item label="詳細介紹" prop="descr">
                <el-input v-model="form.descr"></el-input>
              </el-form-item>
              <el-form-item label="密碼" prop="pwd">
                <el-input v-model="form.pwd"></el-input>
              </el-form-item>
              <el-form-item label="電話">
                <el-input v-model="form.phone"></el-input>
              </el-form-item>
              <el-form-item label="城市">
                <el-select v-model="form.city">
                  <el-option v-for="(c, i) in cityList" :label="c" :value="i"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="地址">
                <el-input v-model="form.addr"></el-input>
              </el-form-item>
              <el-form-item label="營業時間">
                <el-input v-model="form.openTime"></el-input>
              </el-form-item>
              <el-form-item label="負責人">
                <el-input v-model="form.contact"></el-input>
              </el-form-item>
              <el-form-item label="負責人手機">
                <el-input v-model="form.mobile"></el-input>
              </el-form-item>
              <el-form-item label="方案">
                <el-select v-model="form.package">
                  <el-option v-for="(pkg, i) in pkgList" :label="pkg" :value="pkg"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="公休日">
                <el-checkbox v-for="(d, i) in dates" v-model="form.restDates[i]" :true-label="1" :false-label="0">{{d}}</el-checkbox>
              </el-form-item>
              <el-form-item label="VIP卡">
                <el-switch v-model="form.vip" on-text="" off-text=""/>
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
  name: 'Store',
  mixins: [globalMixin],
  data() {
    return {
      cityList: [],
      pkgList: [],
      storeList: [],
      dates: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'],
      form: {
        id: "",
        noid: "",
        pwd: "",
        package: "",
        storeName: "",
        intro: "",
        descr: "",
        phone: "",
        city: "",
        addr: "",
        openTime: "",
        mobile: "",
        contact: "",
        mobile: "",
        status: true,
        imgSrc: "",
        vip: false,
        restDates: [0,0,0,0,0,0,0],
      },
      rules: {
        storeName: [
          { required: true, message: '不可為空'}
        ],
      }
    }
  },
  mounted() {
    this._getCityList()
    this._getPackageList()
    this._getStoreList()
  },
  methods: {
    ...mapActions([
      'getCityList',
      'getPackageList',
      'getStoreList',
      'modStore',
      'uploadStorePic',
    ]),
    _initStore(store) {
      return {
        ...store,
      }
    },
    clearForm() {
      this.$refs.form.resetFields()
      this.form = Object.assign({}, this.form, {
        id: "",
        noid: "",
        pwd: "",
        package: "",
        storeName: "",
        intro: "",
        descr: "",
        phone: "",
        city: "",
        addr: "",
        openTime: "",
        contact: "",
        mobile: "",
        status: true,
        imgSrc: "",
        vip: false,
        restDates: [0,0,0,0,0,0,0],
      })
    },
    async _getCityList() {
      var res = await this.getCityList()
      if(res.code === 0) {
        this.cityList = res.data.city
      }
    },
    async _getPackageList() {
      var res = await this.getPackageList()
      if(res.code === 0) {
        this.pkgList = res.data.package
      }
    },
    async _getStoreList() {
      var res = await this.getStoreList()
      if(res.code === 0) {
        this.storeList = res.data.storeList.map(store => this._initStore(store))
        this.pagination.page = res.data.pageNo
        this.pagination.count = this.storeList.length
      }
    },
    onDel(id) {
      this.$confirm('是否確定刪除？', '提示', {
        confirmButtonText: '確認刪除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        var data = {
          storeGuid: id,
          del: 1
        }
        var res = await this.modStore(data)
        if(res.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this._getStoreList()
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
      var i = this.storeList.findIndex(store => store.storeGuid === id)
      if(i > -1) {
        var s = this.storeList[i]
        f.id = id
        f.noid = s.noid
        f.storeName = s.storeName
        f.intro = s.intro
        f.descr = s.descr
        f.phone = s.phone
        f.package = s.package
        f.city = s.city-0
        f.addr = s.address
        f.openTime = s.openTime
        f.contact = s.contact
        f.mobile = s.mobile
        f.status = s.stats == 1
        f.imgSrc = s.pic ? `http://${this.host}${s.pic}` : ""
        f.restDates = _(s.rests).toArray().map(v => v-0).value()
        console.log(f.restDates)
        f.vip = f.vip - 0

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
            storeGuid: f.id || -1,
            pwd: f.pwd,
            storeName: f.storeName,
            intro: f.intro,
            descr: f.descr,
            phone: f.phone,
            city: f.city,
            address: f.addr,
            package: f.package,
            openTime: f.openTime,
            contact: f.contact,
            mobile: f.mobile,
            stats: f.status ? 1 : 2,
            rests: f.restDates.toString().replace(/\,/g, ''),
            vips: f.vip ? 1 : 0
          }

          var formData = new FormData()
          formData.append('pic', this.$refs.fileSelector.files[0])
          _.forEach(data, (v, k) => formData.append(k, v))
          var res = await this.modStore(formData)
          if(res.code === 0) {
            this._getStoreList()
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
