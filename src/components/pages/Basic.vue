<template>
  <div id="store">
    <div class="page-header">
      <h1>基本設定</h1>
    </div>

    <div class="col-sm-12">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="店家圖片">
          <input type="file" ref="fileSelector">
          <div v-if="form.imgSrc" style="margin-top: 20px">
            <img style="max-width: 100%" :src="form.imgSrc" alt="">
          </div>
        </el-form-item>
        <el-form-item label="店家編號" prop="noid">
          {{form.noid}}
        </el-form-item>
        <el-form-item label="店家名稱" prop="storeName">
          <el-input v-model="form.storeName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="店家簡述" prop="intro">
          <el-input v-model="form.intro" type="textarea" :rows="2"></el-input>
        </el-form-item> -->
        <el-form-item label="詳細介紹" prop="descr">
          <el-input v-model="form.descr" type="textarea" :rows="5"></el-input>
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
          {{form.package || '無方案'}}
        </el-form-item>
        <el-form-item label="公休日">
          <el-checkbox v-for="(d, i) in dates" v-model="form.restDates[i]" :true-label="1" :false-label="0">{{d}}</el-checkbox>
        </el-form-item>
        <el-form-item label="VIP卡">
          <el-switch v-model="form.vip" on-text="" off-text=""/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">確認送出</el-button>
        </el-form-item>
        
      </el-form>
    </div>

    
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { required, minLength, between } from 'vuelidate/lib/validators'
import globalMixin from '@/mixins/global'
export default {
  name: 'Basic',
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
  computed: {
    ...mapGetters([
      'loginInfo',
      'storeInfo',
    ])
  },
  watch: {
    storeInfo() {
      this.getEditData()
    }
  },
  mounted() {
    this._getCityList()
    this.getEditData()
    
  },
  methods: {
    ...mapActions([
      'modStore',
      'onCheckLogin',
      'uploadStorePic',
      'getCityList',
    ]),
    async _getCityList() {
      var res = await this.getCityList()
      if(res.code === 0) {
        this.cityList = res.data.city
      }
    },
    async getEditData() {
      var s = this.storeInfo
      var f = this.form
      f.id = this.loginInfo.acc
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
      f.imgSrc = s.pic
      f.restDates = _(s.rests).toArray().map(v => v-0).value()
      console.log(f.restDates)
      f.vip = s.vips == 1

      $(this.$refs.modal).modal('show')
      
    },
    async onSubmit() {
      this.$refs.form.validate(_validCallback.bind(this));
      async function _validCallback(valid) {
        if(valid) {
          var f = this.form
          var data = {
            storeGuid: this.storeInfo.storeGuid,
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
          _.forEach(data, (v, k) => formData.append(k, v))
          if(this.$refs.fileSelector.files[0]) {
            formData.append('pic', this.$refs.fileSelector.files[0])
          }
          var res = await this.modStore(formData)
          if(res.code === 0) {
            this.onCheckLogin({loginType: this.loginInfo.type, username: this.loginInfo.acc})
            this.$message({
              type: 'success',
              message: `更新成功!`
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
