<template>
  <el-container class="home"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-header>
      <el-row>
        <!-- 一级下拉框 -->
        <el-col :span="2" class="left_text">
          <span>一级</span>
          <el-select class="sel" v-model="areaCode" placeholder="请选择" size="mini">
            <el-option v-for="item in areaArr" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-col>
        <!-- 二级下拉框 -->
        <el-col :span="2" class="left_text">
          <span>二级</span>
          <el-select class="sel" v-model="orgId" placeholder="请选择" size="mini">
            <el-option v-for="(item,index) in brandArr" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-col>
        <!-- 三级下拉框 -->
        <el-col :span="2" class="left_text">
          <span>三级</span>
          <el-select  class="sel" v-model="shopId" placeholder="请选择" size="mini">
            <el-option
              v-for="item in shopArr"
              :key="item.id"
              :label="item.shopName"
              :value="item.shopId"
            ></el-option>
          </el-select>
        </el-col>
        <!-- 药品名称输入框 -->
        <el-col :span="4" class="left_text">
          <span class="four_txt">药品名称</span>
          <el-input v-model="drug_name"  placeholder="请输入名称" size="mini"></el-input>
        </el-col>
        <!-- 药品编码输入框 -->
        <el-col :span="4" class="left_text">
          <span class="four_txt">药品编码</span>
          <el-input v-model="drug_code"   placeholder="请输入编码" size="mini"></el-input>
        </el-col>
        <!-- 查询按钮 -->
        <el-col :span="2">
          <el-button type="primary" @click.native="query">
            <i class="el-icon-search"></i>查询
          </el-button>
        </el-col>
        <!-- 重置按钮 -->
        <el-col :span="2">
          <el-button type="primary" @click.native="reset_params">
            <i class="el-icon-refresh"></i>重置
          </el-button>
        </el-col>
        <!-- 药品新增按钮 -->
        <el-col :span="2">
          <el-button type="primary" @click.native="drug_dialog('药品新增','','')">药品新增</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-table
      :data="tableData"
      border
      height="500px"
      width="100%"
      :header-cell-style="{fontSize:'12px',background:'#fafafa',color:'#0f0f0f'}"
    >
      <el-table-column
        align="center"
        label="编号"
        type="index"
        style="color:#0f0f0f;"
        min-width="14%"
      ></el-table-column>
      <el-table-column align="center" prop="product_images" label="药品图片" min-width="17.2%">
        <template slot-scope="scope">
          <img :src="scope.row.product_images" min-width="70" height="70" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="product_name" label="产品名称" min-width="17.2%"></el-table-column>
      <el-table-column align="center" prop="guid" label="药品编码" min-width="17.2%"></el-table-column>
      <el-table-column align="center" prop="c1_id" label="一级分类" min-width="17.2%"></el-table-column>
      <el-table-column align="center" prop="c2_id" label="二级分类" min-width="17.2%"></el-table-column>
      <el-table-column align="center" prop="c3_id" label="三级分类" min-width="17.2%"></el-table-column>
      <el-table-column align="center" prop="approval_number" label="批准文号" min-width="17.2%"></el-table-column>
      <el-table-column align="center" prop="specification" label="规格" min-width="17.2%"></el-table-column>
      <el-table-column align="center" prop="otc_or_rx" label="是否为OTC" min-width="17.2%"></el-table-column>
      <el-table-column align="center" prop="otc_level" label="OTC级别" min-width="17.2%"></el-table-column>
      <el-table-column align="center" prop="indication" label="功能主治" min-width="17.2%"></el-table-column>
      <el-table-column align="center" prop="dosage" label="用法用量" min-width="17.2%"></el-table-column>
      <el-table-column align="center" prop="opaerate" label="操作" min-width="17.2%">
        <template slot-scope="scope">
          <el-button
            size="mini"
            style="background:#d4eaff;border:none;color:#2f71fb;"
            @click="drug_dialog('药品编辑',scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            style="background:#d4eaff;border:none;color:#2f71fb;margin:5px 0 0 0!important;"
            @click="drug_delete(scope.$index, scope.row)"
          >删除</el-button>
          <!--  @click.native="drug_dialog('药品编辑')" -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 药品新增或者编辑的提示框 -->
    <el-dialog
      :center="true"
      :title="drug_style"
      :visible.sync="dialogVisible"
      width="65%"
      :before-close="handleClose"
      class="two_dialog"
      style="padding-bottom:50px;"
    >
      <!-- 点击药品新增 或者 编辑 时，dialog 弹出框表单内容 start-->
      <el-form
        :inline="true"
        :rules="rules"
        label-position="right"
        label-class-name="workOrderStyle"
        label-width="100px"
          ref="ruleForm"
        :hide-required-asterisk="false"
        :model="title_val"
        style="display:flex;flex-direction:row;align-items:flex-start; flex-wrap: wrap;"
      >
        <el-form-item
          :label="item[Object.keys(item)[0]]"
          v-for="(item,index) in title_arr"
          :key="index" 
          :status-icon="true"
          :prop="Object.keys(item)[0]"
        >
          <el-select v-if="Object.keys(item)[0] === 'is_external_used'" v-model="title_val[Object.keys(item)[0]]" style="width:300px;" placeholder="请选择是否外用药">
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="2"></el-option>
          </el-select>
          <el-select v-else-if="Object.keys(item)[0] === 'otc_or_rx'" v-model="title_val[Object.keys(item)[0]]" style="width:300px;" placeholder="请选择是否OTC">
            <el-option label="外服" value="1"></el-option>
            <el-option label="内用" value="2"></el-option>
          </el-select>
          <el-select v-else-if="Object.keys(item)[0] === 'otc_level'" v-model="title_val[Object.keys(item)[0]]" style="width:300px;" placeholder="请选择OTC级别">
            <el-option label="一级" value="1"></el-option>
            <el-option label="二级" value="2"></el-option>
            <el-option label="三级" value="3"></el-option>
          </el-select> 
          <el-select v-else-if="Object.keys(item)[0] === 'type'" v-model="title_val[Object.keys(item)[0]]" style="width:300px;" placeholder="请选择药品类型">
            <el-option label="药品" value="1"></el-option>
            <el-option label="医疗器械" value="2"></el-option>
          </el-select>
          <el-select v-else-if="Object.keys(item)[0] === 'c1_id'" v-model="title_val[Object.keys(item)[0]]" style="width:300px;" placeholder="请选择一级分类">
            <el-option label="a" value="1"></el-option>
            <el-option label="b" value="2"></el-option>
          </el-select>
          <el-select v-else-if="Object.keys(item)[0] === 'c2_id'" v-model="title_val[Object.keys(item)[0]]" style="width:300px;" placeholder="请选择二级分类">
            <el-option label="c" value="1"></el-option>
            <el-option label="d" value="2"></el-option>
          </el-select>
          <el-select v-else-if="Object.keys(item)[0] === 'c3_id'" v-model="title_val[Object.keys(item)[0]]" style="width:300px;" placeholder="请选择三级分类">
            <el-option label="e" value="1"></el-option>
            <el-option label="f" value="2"></el-option>
          </el-select>
           <el-input v-else v-model="title_val[Object.keys(item)[0]]" style="width:300px" :placeholder="'请输入'+item[Object.keys(item)[0]]"></el-input>
        </el-form-item>

        <el-form-item label="孕妇及哺乳期妇女用药" class="itemList" >
          <el-input v-model="pregnant_and_lactating_women" style="width:300px" placeholder="请输入孕妇及哺乳期妇女用药说明"></el-input>
        </el-form-item>
      </el-form>
         <!-- 点击药品新增 或者 编辑 时，dialog 弹出框表单内容 end  -->
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :limit="5"
        :before-upload="beforeAvatarUpload"
        :on-remove="handleRemove"
      >
        <i class="el-icon-upload"></i>
      </el-upload>
      <el-dialog :visible.sync="visible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
      <el-row class="intro" style="margin-top:10px;">只支持JPG,JPEG,PNG格式，大小不超过10M。</el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submit_drug_msg('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data() { 
    return {
        rules: { // 校验规则
        // 唯一码校验规则
          guid: [
            { required: true,min: 1, message: '请输入唯一码', trigger: 'blur' }
          ],
          // 通用名称校验规则
          common_name: [
            { required: true, message: '请输入通用名称', trigger: 'blur' }
          ],
          // 产品名称校验规则
           product_name:[
           { required: true, message: '请输入产品名称', trigger: 'blur' }
          ],
          // 是否外用药校验规则
           is_external_used:[
           { required: true, message: '请选择是否外用药', trigger: 'change' }
          ],
          // 药品类型校验规则
           type:[
           { required: true, message: '请选择药品类型', trigger: 'change' }
          ],
          // 是否OTC校验规则
           otc_or_rx:[
           { required: true, message: '请选择是否OTC', trigger: 'change' }
          ],
          // OTC级别校验规则
           otc_level:[
           { required: true, message: '请选择OTC级别', trigger: 'change' }
          ],
          // 一级校验规则
           c1_id:[
           { required: true, message: '请选择一级分类', trigger: 'change' }
          ],
          // 二级校验规则
           c2_id:[
           { required: true, message: '请选择二级分类', trigger: 'change' }
          ],
          // 三级校验规则
           c3_id:[
           { required: true, message: '请选择三级分类', trigger: 'change' }
          ],
        },
      
      loading:true, // loading 图打开或者关闭的标志
      screenWidth: document.body.clientWidth, // 窗口宽度
      pregnant_and_lactating_women: "", // 孕妇及哺乳期妇女用药
      visible: false,
      dialogVisible2: true,
      dialogImageUrl: "",
      title_val: {
         guid: "" ,
         common_name: "" ,
         full_pinyin: "" ,
         pinyin_short_code: "" ,
         english_name: "" ,
         product_name: "" ,
         effect_category: "" ,
         brand: "" ,
         tags: "" ,
         price: "" ,
         approval_number: "" ,
         executive_standard: "" ,
         manufacturer: "" ,
         product_images: "" ,
         specification: "" ,
         validity_period: "" ,
         formulation: "" ,
         indication: "" ,
         dosage: "" ,
         adverse_reactions: "" ,
         tips: "" ,
         ingredient: "" ,
         traits: "" ,
         taboo: "" ,
         precautions: "" ,
         medicine_interactions: "" ,
         pharmacological_action: "" ,
         pharmacology_and_toxicology: "" ,
         overdose: "" ,
         pharmacokinetics: "" ,
         clinical_trials: "" ,
         caveat: "" ,
         storage: "" ,
         subpackage: "" ,
         child_medication: "" ,
         elderly_patients_medication: "" ,
         instruction_manual: "" ,
         original_url: "" ,
         pregnant_and_lactating_women: "" ,
         is_external_used: "" ,
         type: "" ,
         otc_or_rx: "" ,
         otc_level: "" ,
         c1_id: "" ,
         c1_name: "" ,
         c2_id: "" ,
         c2_name: "" ,
         c3_id: "" ,
         c3_name: "" 
      },
      title_arr: [ // table 的表头文字；（不可删除）
        { guid: "唯一码" },
        { common_name: "通用名称" },
        { full_pinyin: "汉语拼音" },
        { pinyin_short_code: "拼音简码" },
        { english_name: "英文名称" },
        { product_name: "产品名称" },
        { effect_category: "作用类别" },
        { brand: "品牌" },
        { tags: "标签" },
        { price: "价格" },
        { approval_number: "批准文号" },
        { executive_standard: "执行标准" },
        { manufacturer: "生产厂家" },
        { product_images: "产品图片" },
        { specification: "规格型号" },
        { validity_period: "有效期限" },
        { formulation: "剂型" },
        { indication: "适应症" },
        { dosage: "用法用量" },
        { adverse_reactions: "不良反应" },
        { tips: "温馨提示" },
        { ingredient: "成份" },
        { traits: "性状" },
        { taboo: "禁忌" },
        { precautions: "注意事项" },
        { medicine_interactions: "药物相互作用" },
        { pharmacological_action: "药理作用" },
        { pharmacology_and_toxicology: "药理毒理" },
        { overdose: "药物过量" },
        { pharmacokinetics: "药代动力学" },
        { clinical_trials: "临床试验" },
        { caveat: "警告" },
        { storage: "贮藏" },
        { subpackage: "包装" },
        { child_medication: "儿童用药" },
        { elderly_patients_medication: "老年患者用药" },
        { instruction_manual: "说明书" },
        { original_url: "原地址" },
        // { pregnant_and_lactating_women: "孕妇及哺乳期妇女用药" },
        { is_external_used: "是否外用药" },
        { type: "药品类型" },
        { otc_or_rx: "是否OTC" },
        { otc_level: "OTC级别" },
        { c1_id: "一级分类" },
        // { c1_name: "一级分类" },
        { c2_id: "二级分类" },
        // { c2_name: "二级分类" },
        { c3_id: "三级分类" },
        // { c3_name: "三级分类" }
      ],

      drug_style: "药品新增",
      newDrug: {
        code: "", // 编号
        name: "", // 药品名称
        drugCode: "", // 药品编码
        oneCate: "", // 一级分类
        twoCate: "", // 二级分类
        threeCate: "", // 三级分类
        ratify: "", // 批准文号
        style: "", // 规格
        isOTC: "", // 是否为OTC
        grade: "", // OTC级别
        func: "", // 功能主治
        usage: "" // 用法用量
      },
      dialogVisible: false, // 提示框是否显示的标志
      drug_name: "", // 药品名称
      drug_code: "", // 药品编码
      flag: 1,
      areaArr: [{ name: "全部", code: "" }],
      brandArr: { "": "全部" },
      params: {  // 查询参数
         product_name:'', // 药品名称

      },
      shopArr: [{ shopName: "全部", shopId: "" }],
      flag: 1,
      areaCode: "",
      orgId: "",
      shopId: "", //控制时间段选中样式
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        } 
      ],
      value: "",
      classify: ["区域:", "品牌:", "门店:"],
      tableData: [  // 存储药品列表数据（目前是写死的数据；）
         {
         guid: "1" ,
         common_name: "999感冒灵" ,
         full_pinyin: "999ganmaoling" ,
         pinyin_short_code: "" ,
         english_name: "" ,
         product_name: "含笑半步颠" ,
         effect_category: "" ,
         brand: "" ,
         tags: "" ,
         price: "" ,
         approval_number: "按照规定执行" ,
         executive_standard: "" ,
         manufacturer: "" ,
         product_images: require("../../public/a.jpg") ,
         specification: "一袋1万斤" ,
         validity_period: "" ,
         formulation: "" ,
         indication: "专治感冒" ,
         dosage: "冲水吃" ,
         adverse_reactions: "" ,
         tips: "" ,
         ingredient: "" ,
         traits: "" ,
         taboo: "" ,
         precautions: "" ,
         medicine_interactions: "" ,
         pharmacological_action: "" ,
         pharmacology_and_toxicology: "" ,
         overdose: "" ,
         pharmacokinetics: "" ,
         clinical_trials: "" ,
         caveat: "" ,
         storage: "" ,
         subpackage: "" ,
         child_medication: "" ,
         elderly_patients_medication: "" ,
         instruction_manual: "专治疑难杂症" ,
         original_url: "" ,
         pregnant_and_lactating_women: "" ,
         is_external_used: "" ,
         type: "" ,
         otc_or_rx: "是" ,
         otc_level: "一级" ,
         c1_id: "ss" ,
         c1_name: "" ,
         c2_id: "dd" ,
         c2_name: "" ,
         c3_id: "ff" ,
         c3_name: "" 
      },
       {
         guid: "3" , 
         common_name: "六味地黄丸" ,
         full_pinyin: "999ganmaoling" ,
         pinyin_short_code: "" ,
         english_name: "" ,
         product_name: "健脑补肾丸" ,
         effect_category: "" ,
         brand: "" ,
         tags: "" ,
         price: "" ,
         approval_number: "按照规定执行" ,
         executive_standard: "" ,
         manufacturer: "" ,
         product_images: require("../../public/a.jpg") ,
         specification: "一袋2万斤" ,
         validity_period: "" ,
         formulation: "" ,
         indication: "专治感冒" ,
         dosage: "冲水吃" ,
         adverse_reactions: "" ,
         tips: "" ,
         ingredient: "" ,
         traits: "" ,
         taboo: "" ,
         precautions: "" ,
         medicine_interactions: "" ,
         pharmacological_action: "" ,
         pharmacology_and_toxicology: "" ,
         overdose: "" ,
         pharmacokinetics: "" ,
         clinical_trials: "" ,
         caveat: "" ,
         storage: "" ,
         subpackage: "" ,
         child_medication: "" ,
         elderly_patients_medication: "" ,
         instruction_manual: "专治疑难杂症" ,
         original_url: "" ,
         pregnant_and_lactating_women: "" ,
         is_external_used: "" ,
         type: "" ,
         otc_or_rx: "是" ,
         otc_level: "3级" ,
         c1_id: "ss" ,
         c1_name: "" ,
         c2_id: "dd" ,
         c2_name: "" ,
         c3_id: "ff" ,
         c3_name: "" 
      }
        
      ]
    };
  },
  created() {
    this.getAreaList();
    this.getShopList();
    this.getOrgList();
    // 默认时间选择昨天
  },
    mounted () {
        const that = this
        window.onresize = () => {
            return (() => {
                that.screenWidth = document.body.clientWidth
            })()
        }
        // 关闭loading图
        this.loading = false;
    },
  watch: {
        screenWidth (val) {
              this.screenWidth = val
          },
    orgId: function() {
      this.shopId = "";
      //调用获取获取门店列表的方法
      this.getShopList();
    },
    areaCode: function() {
      this.shopId = "";
      //调用获取获取门店列表的方法
      this.getShopList();
    }
  },
  methods: {
    beforeAvatarUpload(file) {
      console.log("文件类型", file);
      const isJPG = file.type == "image/jpg" || "image/jpeg" || "image/png";
      const isJPG2 = file.type ==  "image/png";
      const isLt2M = file.size / 1024 / 10240 < 10;
      console.log("wenjianleix ", isJPG);
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG,PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
      }
      return isJPG && isLt2M;
    },
    handleRemove() {},
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.visible = true;
      document.getElementsByClassName("v-modal")[0].style.display = "none";
    },
    // 点击取消或者叉号按钮的时候触发
    handleClose(formName) {
      this.$confirm("确认关闭？")
        .then(_ => {
          this.dialogVisible = false;
          this.isError = false;
           this.$refs[formName].resetFields();
        })
        .catch(_ => {});
    },
    // 点击确定触发
    submit_drug_msg(formName) {
       
      this.$refs[formName].validate((valid) => {
       
          if (valid) {
            alert('submit!');
             this.tableData.push(this.title_val)
            // 需要判断是点击药品新增按钮触发的弹窗还是点击编辑触发的
            this.dialogVisible = false; // 关闭弹窗
          } else {
             alert('error submit!');
            return false;
          }
        });
      

    },
    // 点击药品新增触发
    drug_dialog(flag, param1, param2) {
       this.dialogVisible = true;
        this.drug_style = flag;
      if(flag==="药品新增"){
            console.log("liebiao :",this.title_val)
      }else if(flag==="药品编辑"){
         this.title_val = param2;
         console.log("---------",param2)
        
      }
    },
    // 点击删除触发
    drug_delete(val1,val2){
       // 数组原型上添加一个方法用于删除某一个元素
      Array.prototype.remove = function(val) {
          this.splice(val, 1);
      };
       this.tableData.remove(val1)

    },
    // 点击查询触发
    query() {
      alert("查询");
      // this.drug_name
    },
    // 点击重置触发
    reset_params() {
      this.areaCode = ""; // 一级重置为默认值：全部
      this.orgId = ""; // 二级重置为默认值：全部
      this.shopId = ""; // 三级重置为默认值：全部
      this.flag = 1;
      this.drug_name = "";
      this.drug_code = "";
    },
    //获取一级列表
    getAreaList() {
      this.$get("areaList", { areaCode: "3702" }).then(res => {
        this.areaArr = this.areaArr.concat(res.data);
      });
    },
    //获取二级列表
    getOrgList() {
      this.$get("orgList").then(res => {
        var org = res.data;
        // 遍历品牌列表，只保留 医保城 的品牌
        for (let key in org) {
          if (org[key] == "医保城") {
            var data = {};
            data[key] = org[key];
            Object.assign(this.brandArr, data);
          }
        }
      });
    },
    //获取三级列表
    getShopList() {
      this.shopArr = [{ shopName: "全部", shopId: "" }];
      this.$get("shopList", {
        areaCode: this.areaCode,
        orgId: this.orgId
      }).then(res => {
        this.shopArr = this.shopArr.concat(res.data);
      });
    }
  }
};
</script>
<style lang="scss"  >
.itemList > .el-form-item__label {
  height: 20px !important;
  line-height: 20px !important;
  
}
.home {
  margin: 1%;
  height: 700px;
  background: #fff;
  width: 98%;
  .el-table th > .cell {
    color: #000;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .el-header {
    background: #fff;
    display: flex;
    align-items: center;
    padding:0;
    .el-row {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-col {
        display: flex;
        align-items: center;
        height: 100%;
        justify-content: flex-start;
        .el-select {
          width: 90px;
          margin-left: 24px;
        }
        span {
          font-size: 12px;
        }
        .el-button {
          width: 90px;
          height: 30px;
          line-height: 30px;
          padding: 0;
          margin-left: 20px;
          i {
            margin-right: 10px;
          }
        }
        &.time {
          margin: 0 10px;
          border-bottom: 3px solid #fff;
          font-size: 12px;
          height: 70%;
          cursor: pointer;
          &.active {
            border-color: #409eff;
            color: #409eff;
          }
        }
      }
      .left_text {
        justify-content: flex-start;
        span{
          width:30px;
          
        }
        .ele_input{
          width:150px;
        }
         .sel{
           margin-left:10px!important;
         }
        .four_txt {
          width: 70px;
          margin-right: 5px;
        }
      }
    }
  }
  .el-table {
    width: 98%;
    margin: 1%;
  }
  
}
</style>
