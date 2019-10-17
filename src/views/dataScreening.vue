<template>
 
  <el-container class="home" style="overflow-y: visible;"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.4)"
  >
    <el-header>
      <el-row class="header_txt">
        <el-col :span="3">
          <p>药店总数</p>
          <p>{{businessData.shopTotalCount}}</p>
        </el-col>
        <el-col :span="3">
          <p>药品总数</p>
          <p>{{businessData.productTotalCount}}</p>
        </el-col>
        <el-col :span="4"> 
          <p>注册用户数</p>
          <p>{{businessData.userTotalCount}}</p>
        </el-col>
      </el-row>
    </el-header>
    <el-header>
      <el-row>
        <el-col :span="3" class="left">
          <span>区域</span>
          <el-select v-model="areaCode" placeholder="请选择" size="mini">
            <el-option v-for="item in areaArr" :key="item.id" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="left">
          <span>品牌</span>
          <el-select v-model="orgId" placeholder="请选择" size="mini">
            <el-option v-for="(item,index) in brandArr" :key="index" :label="item" :value="index"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3" class="left">
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
        <el-col :span="1"></el-col>
        <el-col
          class="time"
          :class="[flag==1?'active':'']"
          @click.native="get_account_data(1)"
          :span="1"
        >
        昨天 
        </el-col>
        <el-col
          class="time"
          :class="[flag==2?'active':'']"
          @click.native="get_account_data(2)"
          :span="1"
        >近7天</el-col>
        <el-col
          class="time"
          :class="[flag==3?'active':'']"
          @click.native="get_account_data(3)"
          :span="1"
        >近30天</el-col>
        <el-col class="time" :span="3">
          <el-date-picker v-model="week" @change="clearWeek" type="week" format="yyyy 第 WW 周" placeholder="选择周" size="mini"></el-date-picker>
        </el-col>
        <el-col class="time" :span="3">
          <el-date-picker v-model="month" @change="clearWeek" type="month" placeholder="选择月" size="mini"></el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click.native="search">
            <i class="el-icon-search"></i>查询
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click.native="reset_params">
            <i class="el-icon-refresh"></i>重置
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row class="userClass">
        <el-col :span="5" @click.native="changeData('营业总额分析','totalPrice')">
          <p>
            <span :class="[select_txt=='营业总额分析'?'txt_color':'']">营业总额</span>
            <i @mouseleave="isShow = 0" @mouseenter="isShow=1" :class="['el-icon-question',select_txt=='营业总额分析'?'txt_color':'']"></i>
          </p>
          <div class="intro" v-if="isShow == 1">统计时间内，包含商品销售、包装、配送在内的总费用</div>
          <p :class="[select_txt=='营业总额分析'?'txt_color':'']">{{businessData.totalPrice | totalPrice}}</p>
        </el-col>
        <el-col :span="5" @click.native="changeData('有效订单数分析','validOrderNum')">
          <p>
            <span :class="[select_txt=='有效订单数分析'?'txt_color':'']">有效订单数</span>
            <i @mouseleave="isShow = 0" @mouseenter="isShow=2" :class="['el-icon-question',select_txt=='有效订单数分析'?'txt_color':'']"></i>
          </p>
          <div class="intro" v-if="isShow == 2">统计时间内，未取消且未发生退款的订单量</div>
          <p :class="[select_txt=='有效订单数分析'?'txt_color':'']">{{businessData.validOrderNum || 0}}</p>
        </el-col>
        <el-col :span="5" @click.native="changeData('客单价分析','pricePerOrder')">
          <p>
            <span :class="[select_txt=='客单价分析'?'txt_color':'']">客单价</span>
            <i  @mouseleave="isShow = 0" @mouseenter="isShow=3" :class="['el-icon-question',select_txt=='客单价分析'?'txt_color':'']"></i>
          </p>
          <div class="intro" v-if="isShow == 3">统计时间内，平均每张未取消且未发生退款订单的实际收入金额，营业总额/订单总数</div>
          <p :class="[select_txt=='客单价分析'?'txt_color':'']">{{businessData.pricePerOrder | totalPrice}}</p>
        </el-col>
        <el-col :span="5" @click.native="changeData('无效订单分析','invalidOrderNum')">
          <p>
            <span :class="[select_txt=='无效订单分析'?'txt_color':'']">无效订单</span>
            <i @mouseleave="isShow = 0" @mouseenter="isShow=4" :class="['el-icon-question',select_txt=='无效订单分析'?'txt_color':'']"></i>
          </p>
          <div class="intro" v-if="isShow == 4">统计时间内，用户支付成功且推给本连锁店（未被风控拦截）后，发生取消或发生退款的订单量</div>
          <p :class="[select_txt=='无效订单分析'?'txt_color':'']">{{businessData.invalidOrderNum || 0}}</p>
        </el-col>
        <el-col :span="5" @click.native="changeData('平台服务费分析','serverMoney')">
          <p>
            <span :class="[select_txt=='平台服务费分析'?'txt_color':'']">平台服务费</span>
            <i @mouseleave="isShow = 0" @mouseenter="isShow=5" :class="['el-icon-question',select_txt=='平台服务费分析'?'txt_color':'']"></i>
          </p>
          <div class="intro" v-if="isShow == 5">统计时间内，商品总价的3%的费用</div>
          <p
            :class="[select_txt=='平台服务费分析'?'txt_color':'']"
          >{{(businessData.totalPrice) -(businessData.totalFreight) | serverPrice }}</p>
        </el-col>
      </el-row>
    </el-main>
    <section class="chartContainer">
      <div id="chart" :style="{opacity:length}"></div>
      <img class="image" :style="{opacity:Number(!length)}" src="../../public/noDate.png" alt="">
    </section> 
  </el-container>
 
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      loading:true,
      isShow:0,
      flag: 1, //控制时间段选中样式
      areaCode: "",  
      shopId: "",
      week: "",
      month: "",
      orgId: "",
      areaArr: [{ name: "全部", code: "" }],
      brandArr: { "": "全部" },
      shopArr: [{ shopName: "全部", shopId: "" }],
      businessData: {},
      yesterday:0,
      params: {
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
      time: [], //横坐标时间
      mineData: [], //纵坐标数据
      myChart: {}, //echarts对象
      select_txt: "营业总额分析",
     
      length:0, // 返回的统计数据的数组的长度
      text:["1111","2222","3333","4444","5555"]
    };
  },
  filters:{
    totalPrice:function(val){
      if(val){
        return (val / 100).toFixed(2)
      }else{
        return 0
      }
    }, 
    serverPrice:function(val){
      if(val){
        return ((val / 100) * 0.03).toFixed(2)
      }else{
        return 0
      }
    }
  },
  created() {
    var endDate = new Date();
    var startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);

    // 获取昨日的开始和结束日期
    var init_start_time =
      startDate.getFullYear() +
      "-" +
      (Number(startDate.getMonth()) + 1) +
      "-" +
      startDate.getDate();

    this.params.endDate = init_start_time + " 23:59:59"; // 结束时间
    this.params.startDate = init_start_time + " 00:00:00"; // 开始时间

    this.getAreaList();
    this.getShopList();
    this.getOrgList();
    this.search();
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("chart"), "light");
    this.myChart.option = {
      title: {
        text: "营业总额分析",
        x: "20px",
        y: "20px"
      },
      animation:false,
      tooltip: {
        show: true,
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985"
          }
        }
      },
      //折线代表的意义说明
      // legend: {
      //     icon:"rect",
      //     itemWidth: 40,
      //     itemHeight: 5,
      //     itemGap:50,
      //     data:['我的',"比前七日"],
      //     x:"200px",
      //     y:"25px"
      // },
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisLabel: { interval: 0 }
      },
      yAxis: {
        type: "value" 
      }, 
      //图表的主体部分
      grid: {
        left: "5%",
        right: "5%",
        bottom: "12%",
        top: "15%",
        containLabel: true
      }
    };
    this.myChart.setOption(this.myChart.option);
  },
  methods: {
    // 点击重置按钮触发
    reset_params(){
      this.areaCode = ''   // 区域重置为默认值：全部
      this.orgId = ''    // 品牌重置为默认值：全部
      this.shopId = ''    // 门店重置为默认值：全部
      this.flag = 1                   //  时间重置为默认值：昨天
      this.select_txt = '营业总额分析'
       sessionStorage.setItem('str','营业总额分析')
      sessionStorage.setItem('params','totalPrice')
      this.params.queryFlag = 1   // 请求标志设置为1，昨天；
      this.get_account_data(1)  // 调用方法改变请求参数的开始时间和结束时间
      this.$router.go(0)
      // this.search()
    },
    clearWeek(){
      this.flag = 4
    },
     
    //
    changeData(str, params) {
      // 改变data中的select_txt数据
      this.select_txt = str;
      sessionStorage.setItem('str',str)
      sessionStorage.setItem('params',params)
      //过滤不同的数据
      var all_list = this.businessData.subDataListYesterday;
      this.yesterday = all_list.length
      // 清空横坐标轴
     this.time = []

      var filter_data = []; 
      // 过滤数据
        // 如果点击的不是平台服务费 
      if (params != "serverMoney") { 
          all_list.forEach(item => {
          filter_data.push(item[params]); 
            this.time.push(item.statisticsTime);
        }); 
      }else{
        // 如果点击的是平台服务费
        filter_data = all_list.map(item => {
           this.time.push(item.statisticsTime);
          return ((item.totalPrice - item. totalFreight) * 0.03).toFixed(2)
           });
      }
      if(this.time.length==0){
          this.time.push(0)
      }
      if(filter_data.length==0){
        filter_data.push(0)
      }
      this.myChart.setOption({
        title: {
          text: str
        },
          xAxis: {
            data: this.time
          },
      series: [
        {
          name: str.substring(0, str.length-2),
          type: "line",
          areaStyle: {},
          data:  filter_data
        } 
      ]
      });
    },
    // 点击 昨日， 近7天， 近30天  的时候触发
    get_account_data(flag) {
      this.flag = flag;
       this.week = "";
         this.month = "";
      if (flag == 1) {
        this.params.queryFlag = 1;
        this.get_time_day(1);
      } else if (flag == 2) {
        this.params.queryFlag = 2;
        this.get_time_day(6);
      } else if (flag == 3) {
        this.params.queryFlag = 3;
        this.get_time_day(29);
      }
        
    },
    // 用于获取近多少天  的开始时间和结束日期
    get_time_day(num) {
      var time2 = new Date();
      var time = new Date(time2.getTime() - 24 * 60 * 60 * 1000 * num);
      console.log("time.getMonth()",time.getMonth())
      var s_time =
        time.getFullYear() +
        "-" +
        (Number(time.getMonth()) + 1) +
        "-" +
        time.getDate();
      // 开始的时间
      var start_time = s_time + " 00:00:00";
      // 结束的时间
      var end_time;
      if (num == 1) {
        end_time = s_time + " 23:59:59";
      } else {
        end_time =
          time2.getFullYear() +
          "-" +
          (Number(time2.getMonth()) + 1) +
          "-" +
          time2.getDate() +
          " 23:59:59";
      }
  
      this.params.startDate = start_time;
      this.params.endDate = end_time;
      this.params.areaCode = this.areaCode;
      this.params.shopId = this.shopId;
     
      // this.search();
    },
    // 点击获取 某一周或者某一个月的时候触发
    // time: 选中的周或者月的开始日期； num:  1,表示周，2，表示月
    get_time_week_month(time, num) {
      
      if (num == 1) {
        this.params.queryFlag = 4;
        this.start_to_end_time(time, 6);
      } else if (num == 2) {
        var res = new Date(time);
        //  获取当前月有多少天
        var acc = new Date(res.getFullYear(), res.getMonth() + 1, 0).getDate();
        this.params.queryFlag = 5;
        this.start_to_end_time(time, acc - 1);
      }
    },
    start_to_end_time(time, day) {
      var week_time2 = new Date(new Date(time).getTime());

      var week_time = new Date(
        new Date(time).getTime() + 24 * 60 * 60 * 1000 * day
      );
      // 某一周或某一月的开始时间
      var start_week_time =  week_time2.getFullYear() +  "-" + (Number(week_time2.getMonth()) + 1) +  "-" +  week_time2.getDate() + " 00:00:00";
      // 某一周或某一月的结束时间
      var end_week_time = week_time.getFullYear() + "-" + (Number(week_time.getMonth()) + 1) + "-" +  week_time.getDate() +  " 23:59:59";

      this.params.startDate = start_week_time;
      this.params.endDate = end_week_time;
      this.params.areaCode = this.areaCode;
      this.params.shopId = this.shopId;

      // this.search();
    },
    //获取营业数据
    search() {
      this.loading = true
      this.params.areaCode = this.areaCode;
      this.params.shopId = this.shopId;
      this.params.orgId = this.orgId;

      this.$post("businessData", this.params).then(res => { 
     this.loading = false
      // 从缓存中取出str,  params
     let str =  sessionStorage.getItem('str')  // 
     let params =  sessionStorage.getItem('params')  // 
        this.businessData = Object.assign({},res.data)
        if(res.data.subDataListYesterday.length){
          this.length = 1;
        }else{
          this.length = 0;
        };
        if(res.data.subDataListYesterday.length>0){
          // 清空x,y坐标轴数据
           this.time = [];
            this.mineData = [];

            res.data.subDataListYesterday.forEach(item => {
              this.time.push(item.statisticsTime);
            });
            res.data.subDataListYesterday.forEach(item => {
              this.mineData.push(parseInt(item.validOrderNum));
            });
        } 
        
        this.myChart.setOption({
          xAxis: {
            data: this.time
          },
          series: [
            {
              name: "我的",
              type: "line",
              data: this.mineData,
              smooth: true,
              lineStyle: {
                normal: {
                  color: "#409EFF",
                  width: 3
                }
              }
            }
          ]
        });

        if(str && params){
          this.changeData(str, params) 
        }else{
           this.changeData('营业总额分析', 'totalPrice') 
        }
        
      });
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
    //把日期转换成年月日的形式
    changeDate(date, item) {
  
      var select_data = new Date(date);

      //  item==1,表示选择的是周
      if (item == 1) {
       
        select_data = new Date(select_data.getTime() - 24 * 60 * 60 * 1000);
        return (
          select_data.getFullYear() +
          "-" +
          (Number(select_data.getMonth()) + 1) +
          "-" +
          select_data.getDate()
        );
      } else if (item == 2) {
     
        // item==2，表示选择的是月
        return (
          select_data.getFullYear() +
          "-" +
          (Number(select_data.getMonth()) + 1) +
          "-" +
          select_data.getDate()
        );
      }
    }
  },
  watch: {
    // 侦听周的变化
    week: function(val) {
      this.params.queryFlag = 4;
      // this.flag = 4
       if(val){
         this.month = "";
           this.get_time_week_month(this.changeDate(val, 1), 1);
       }
    },
    // 侦听月的变化
    month: function(val) {
      this.params.queryFlag = 4;
      //  this.flag = 5  
         if(val){
           this.week = "";
           this.get_time_week_month(this.changeDate(val, 2), 2);
         }
    },
    orgId: function() {
      this.shopId = ''
      // 调用方法获取门店列表
      this.getShopList();
    },
    areaCode: function() {
      this.shopId = ''
       // 调用方法获取门店列表
      this.getShopList();
    }
  }
};
</script>
<style lang="scss" scoped>
.txt_color {
  color: #409eff;
}
.left{
  display: flex;
  justify-content: flex-start!important;
  align-items: center;
}
.home {
  margin: 15px;
  height: 790px;
  overflow: hidden;
  width:calc(100%-20px);
  flex:0;
  .el-header:first-of-type {
    background: #fff;
    display: flex;
    .el-row {
      display: flex;
      width: 100%;
      height: 100%;
      .el-col {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size:12px;
        p:nth-of-type(2){
          color:#409eff;
          margin-left:24px;
        }
      }
    }
  }
  .el-header:last-of-type {
    background: #fff;
    display: flex;
    align-items: center;
    margin-top:10px;
    .el-row {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      .el-col {
        display: flex;
        align-items: center;
        height: 70%;
        justify-content: space-around;
        .el-select {
          width: 90px;
          margin-left: 10px;
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
          font-size:12px;
          
        
          &:hover {
            cursor: pointer;
          }
          &.active {
            border-color: #409eff;
            color: #409eff;
            // font-size:12px;
          }
        }
      }
    }
  }
  .el-main {
    height: 100px;
    flex-grow: 0;
    padding: 0;
    margin-top: 15px;
    .userClass {
      // height: 100%;
      display: flex;
      justify-content: space-between;
      .el-col {
        background: #fff;
        margin-right: 15px;
        height: 100px;
        position:relative;
        .intro{
          position:absolute;
          top:35px;
          right:0;
          z-index: 10;
          padding:5px;
          font-size:12px;
          background:#fff;
          border-radius:5px;
        }
        &:hover {
          cursor: pointer;
        }
        &:last-child {
          margin: 0;
        }
        p:first-of-type {
          display: flex;
          justify-content: space-between;
          margin: 12px 25px;
          color: #666;
          align-items: center;
          height: 20px;
          span{
            font-size:12px;
          }
        }
        div{
          border:1px solid #ccc;
        }
        p:last-of-type {
          font-size: 28px;
          margin: 0 25px;
        }
      }
    }
  }
  .chartContainer {
    padding: 0;
    // height: 450px;
    flex-grow: 1;
    margin-top: 10px;
    width: 100%;
    height:500px;
    position:relative;
    #chart {
      position:absolute;
      left:0;
      top:0;
      width: 100%;
      height: 500px;
      background: #fff;
    }
    .image{
      position: absolute;
      top:50%;
      left:50%;
      margin-top:-130px;
      margin-left:-150px;
    }
  }
}
</style>
