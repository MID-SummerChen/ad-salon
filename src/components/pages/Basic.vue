<template>
  <div id="store">
    <div class="page-header">
      <h1>基本設定</h1>
    </div>

    <div class="col-sm-8">
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
          <el-input v-model="form.intro" type="textarea" :rows="2"></el-input>
        </el-form-item>
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
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  mounted() {
    if(this.loginInfo) {
      this.getEditData(this.loginInfo.type)
    }else {
      setTimeout(() => {
        this.getEditData(this.loginInfo.type)
      }, 200)
    }
    
  },
  methods: {
    ...mapActions([
      'getStoreList',
      'modStore',
      'uploadStorePic',
    ]),
    async getEditData(id) {
      var res = await this.getStoreList({noid_mask: id})
      if(res.code === 0) {
        var f = this.form
        var s = res.data.storeList[0]
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
        f.imgSrc = s.pic
        f.restDates = _(s.rests).toArray().map(v => v-0).value()
        console.log(f.restDates)
        f.vip = f.vip - 0

        $(this.$refs.modal).modal('show')
        console.log(id)
      }
      
      
    },
    async onSubmit() {
      this.$refs.form.validate(_validCallback.bind(this));
      async function _validCallback(valid) {
        if(valid) {
          var f = this.form
          var data = {
            // storeGuid: f.id || -1,
            noid: f.noid,
            storeName: f.storeName,
            phone: f.phone,
            address: f.addr,
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
