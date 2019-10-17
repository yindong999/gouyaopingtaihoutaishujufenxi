<template>
    <el-container class="home">
        <el-header>
            <el-row>
              <!-- <el-col :span="3"  v-for="(item,index) in classify" :key="index">
                <span>{{item}}</span>
                <el-select v-model="value" placeholder="请选择" size="mini">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-col> -->
             <el-col :span="3" class="left_text">
          <span>区域</span>
          <el-select v-model="areaCode" placeholder="请选择" size="mini">
            <el-option v-for="item in areaArr" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="left_text">
          <span>品牌</span>
          <el-select v-model="orgId" placeholder="请选择" size="mini">
            <el-option v-for="(item,index) in brandArr" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="left_text">
          <span>门店</span>
          <el-select v-model="shopId" placeholder="请选择" size="mini">
            <el-option
              v-for="item in shopArr"
              :key="item.id"
              :label="item.shopName"
              :value="item.shopId"
            ></el-option>
          </el-select>
        </el-col>


              <el-col :span="7">
              </el-col>
              <el-col class="time" :class="[flag==1?'active':'']" @click.native="change_day(1)" :span="1">昨天</el-col>
              <el-col class="time" :class="[flag==6?'active':'']" @click.native="change_day(6)" :span="1">近7天</el-col>
              <el-col class="time" :class="[flag==29?'active':'']" @click.native="change_day(29)" :span="1">近30天</el-col>
              <el-col :span="2">
                <el-button type="primary" @click.native="query"><i class="el-icon-search"></i>查询</el-button>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click.native="reset_params"><i class="el-icon-refresh"></i>重置</el-button>
              </el-col>
            </el-row>
        </el-header>
        <el-table
          :data="tableData"
          border
          height="500px">
          <el-table-column
            align="center"
            label="编号"
            type="index"
            min-width=14%>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="药品名称"
            min-width=17.2%>
          </el-table-column>
          <el-table-column
            align="center"
            prop="address"
            label="销售额"
            min-width=17.2%>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="销额占比"
            min-width=17.2%>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="销售量"
            min-width=17.2%>
          </el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="销量占比"
            min-width=17.2%>
          </el-table-column>
        </el-table>
    </el-container>
</template>

<script>
export default {
   data() {
      return {
        flag:1,
        areaArr: [{ name: "全部", code: "" }],
      brandArr: { "": "全部" },
      params: {  // 请求参数
        //请求参数
        areaCode: "",
        endDate: "",
        itemId: 0,
        itemName: "",
        orgId: 0,
        queryFlag: 1,
        shopId: 0,
        skuId: 0,
        startDate: ""
      },
      shopArr: [{ shopName: "全部", shopId: "" }],
         flag:1, 
         areaCode: "",
         orgId: "",
         shopId: "",                                       //控制时间段选中样式
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        classify:["区域:","品牌:","门店:"],
        classify2:[
          {name:"营业总额",data:"231",point:""},
          {name:"有效订单数",data:"22131",point:""},
          {name:"客单价",data:"23211",point:""},
          {name:"无效订单",data:"2231",point:""},
          {name:"注册用户数",data:"2311",point:""},
        ],
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        } ]
      }
    },
     created(){
      this.getAreaList();
    this.getShopList();
    this.getOrgList();
     // 默认时间选择昨天
    this.change_day(1)
  },
    watch: {
    
    orgId: function() {
       this.shopId = ''
      //调用获取获取门店列表的方法
      this.getShopList();
    },
    areaCode: function() {   
      this.shopId = ''
      //调用获取获取门店列表的方法
      this.getShopList();
    }
  },
  methods:{
    // 点击查询触发
    query(){
      alert("查询")
    },
    // 点击重置触发 
    reset_params(){
      this.areaCode = ''   // 区域重置为默认值：全部
      this.orgId = ''    // 品牌重置为默认值：全部
      this.shopId = ''    // 门店重置为默认值：全部
      this.flag = 1
      // 时间重置为昨天
      this.change_day(1)
    },
      // 点击  昨天，近七天，近30天 触发，并获取开始时间和结束时间
    change_day(index) {
      this.flag = index;
      // 现在的时间
      var new_time = new Date()
      // 昨天 或者 近七天 或者 近30天 开始的时间点；
      var pre_time = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * index)
    //  开始时间点
     var start  = pre_time.getFullYear() + '-' + (pre_time.getMonth() + 1) + '-' + pre_time.getDate()
     var start_time = start + ' 00:00:00'
      // 结束时间点
     var end_time = new_time.getFullYear() + '-' + (new_time.getMonth() + 1) + '-' + new_time.getDate() + ' 23:59:59'
        // index==1 时，点击的是昨天，则开始时间和结束时间的年月日都是一样的；
     if(index==1){
         end_time = start + ' 23:59:59'
      }
     console.log(start_time,end_time)

    },
     //获取青岛市内区域列表
    getAreaList() {
      this.$get("areaList", { areaCode: "3702" }).then(res => {
        this.areaArr = this.areaArr.concat(res.data);
      });
    },
    //获取品牌列表
    getOrgList() {
      this.$get("orgList").then(res => {
        var org = res.data
        // 遍历品牌列表，只保留 医保城 的品牌
         for(let key in org){
           if(org[key]=='医保城'){
              var data = {};
               data[key] = org[key];
              Object.assign(this.brandArr, data);
           }
         }
          // Object.assign(this.brandArr, res.data);
       
      });
    },
    getShopList() {
      this.shopArr = [{ shopName: "全部", shopId: "" }];
      //获取门店列表
      this.$get("shopList", {
        areaCode: this.areaCode,
        orgId: this.orgId
      }).then(res => {
        this.shopArr = this.shopArr.concat(res.data);
      });
    },
  }


}
</script>
<style lang="scss" scoped>
  .home{
    margin:1%;
    height:700px;
    background:#fff;
    width:98%;
    .el-header{
      background:#fff;
      display:flex;
      align-items: center;
      .el-row{
        width:100%;
        height:100%;
        display:flex;
        align-items: center;
        .el-col{
          display:flex;
          align-items: center;
          height:100%;
          justify-content: center;
          .el-select{
            width:90px;
            margin-left:10px;
          };
          span{
            font-size:12px;
          }
          .el-button{
            width:90px;
            height:30px;
            line-height:30px;
            padding:0;
            margin-left:20px;
            i{
              margin-right:10px;
            }
          }
          &.time{
            margin:0 10px;
            border-bottom:3px solid #fff;
            font-size:12px;
            height:70%;
            cursor: pointer;
            &.active{
              border-color:#409EFF;
              color:#409EFF;
            }
          }
        }
          .left_text {
        justify-content: flex-start;
      }
      }
    };
    .el-table{
      width:98%;
      margin:1%;
    }
  }
</style>
