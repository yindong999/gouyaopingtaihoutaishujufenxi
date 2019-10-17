<template>
  <el-container class="home">
    <el-header>
      <el-row>
        <!-- <el-col class="left_text" :span="3" v-for="(item,index) in classify" :key="index">
          <span>{{item}}</span>
          <el-select v-model="value" placeholder="全部" size="mini">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
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



        <el-col :span="5"></el-col>
        <el-col
          class="time"
          :class="[flag==1?'active':'']"
          @click.native="change_day(1)"
          :span="1"
        >昨天</el-col>
        <el-col
          class="time"
          :class="[flag==6?'active':'']"
          @click.native="change_day(6)"
          :span="1"
        >近7天</el-col>
        <el-col
          class="time"
          :class="[flag==29?'active':'']"
          @click.native="change_day(29)"
          :span="1"
        >近30天</el-col>
        <!-- <el-col class="time" :class="[flag==3?'active':'']" @click.native="flag=3" :span="1">按周</el-col>
        <el-col class="time" :class="[flag==4?'active':'']" @click.native="flag=4" :span="1">按月</el-col>-->
        <el-col class="time" :span="3">
          <el-date-picker
            v-model="week"
            @change="clearWeek"
            type="week"
            format="yyyy 第 WW 周"
            placeholder="选择周"
            size="mini"
          ></el-date-picker>
        </el-col>
        <el-col class="time" :span="3">
          <el-date-picker
            v-model="month"
            @change="clearWeek"
            type="month"
            placeholder="选择月"
            size="mini"
          ></el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="query">
            <i class="el-icon-search"></i>查询
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="reset_params">
            <i class="el-icon-refresh"></i>重置
          </el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-row class="userClass">
        <el-col
          :span="5"
          v-for="(item,index) in classify2"
          :key="index"
          @click.native="change_tab(index,item.name)"
          :class="[tab==index?'blue':'']"
        >
          <p>
            <span :class="[tab==index?'blue':'']">{{item.name}}</span>
            <i
              :class="[tab==index?'blue':'']"
              @mouseenter="isShow=index"
              @mouseleave="isShow = 9"
              class="el-icon-question"
            ></i>
          </p>
          <div
            style="padding:5px;background:#fff;color:#000; font-size:12px; border-radius:5px;"
            v-if="isShow==index"
          >{{item.text}}</div>
          <p>{{item.data}}</p>
        </el-col>
      </el-row>
    </el-main>
    <section>
      <div id="chart"></div>
    </section>
  </el-container>
</template>

<script>
import echarts from "echarts";
export default {
  data() {
    return {
      areaArr: [{ name: "全部", code: "" }],
      brandArr: { "": "全部" },
      shopArr: [{ shopName: "全部", shopId: "" }],
      shopId: "",
       orgId: "",
        areaCode: "",
      tab: 0,
      week: "",
      month: "",
      isShow: 9,
      flag: 1, //控制时间段选中样式
      options: [
        { name: "全部", code: "" } 
      ],
      value: "",
      classify: ["区域:", "品牌:", "门店:"],
      classify2: [
        {
          text: "统计时间内，未取消且未发生退款的下单顾客数",
          name: "全部下单用户",
          data: "231",
          point: ""
        },
        {
          text: "统计时间内，在本平台有过2次及以上下单的顾客数",
          name: "复购用户数",
          data: "22131",
          point: ""
        },
        {
          text: "在本平台最后一次下单时间在0-20天内的用户数",
          name: "活跃用户数",
          data: "23211",
          point: ""
        },
        {
          text: "在本平台最后一次下单时间在21-40天内的用户数",
          name: "沉睡用户",
          data: "2231",
          point: ""
        },
        {
          text: "在本平台最后一次下单时间在41-60天内的用户数",
          name: "流失用户",
          data: "2311",
          point: ""
        }
      ],
      myChart: {} ,//echarts对象
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
      }
    };
  },
  created(){
      this.getAreaList();
    this.getShopList();
    this.getOrgList();
    // 默认时间选择昨天
    this.change_day(1)
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("chart"), "light");
    this.myChart.option = {
      title: {
        text: "全部下单用户分析",
        x: "20px",
        y: "20px"
      },
      //折线代表的意义说明
      legend: {
        icon: "rect",
        itemWidth: 40,
        itemHeight: 5,
        itemGap: 50,
        data: ["我的"],
        x: "200px",
        y: "25px"
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      },
      yAxis: {
        type: "value",
        axisLine: {
          show: false
        }
      },
      //图表的主体部分
      grid: {
        left: "5%",
        right: "5%",
        bottom: "3%",
        top: "15%",
        containLabel: true
      },
      series: [
        {
          name: "我的",
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          smooth: true,
          lineStyle: {
            normal: {
              color: "#409EFF",
              width: 3
            }
          }
        } 
      ]
    };
    this.myChart.setOption(this.myChart.option);
  },
  // 侦听器
  watch: {
    // 侦听周的变化
    week: function(val) {
     
      if (val) {
        this.month = "";
      }
       var time_week = new Date(val.getTime() - 24 * 60 * 60 * 1000);
       var time_week2 = new Date(val.getTime() + 24 * 60 * 60 * 1000 * 5);
      //  选中的某一周的开始时间
     var st_time =  time_week.getFullYear() + '-' + (time_week.getMonth() + 1) + '-' + (time_week.getDate()) + ' 00:00:00'
      //  选中的某一周的结束时间
     var en_time =  time_week2.getFullYear() + '-' + (time_week2.getMonth() + 1) + '-' + (time_week2.getDate()) + ' 23:59:59'
     
     console.log(st_time,en_time);
    },
    // 侦听月的变化
    month: function(val) {
      console.log(val);
      if (val) {
        this.week = "";
      }
       //  选中的某月的开始时间
     var st_time =  val.getFullYear() + '-' + (val.getMonth() + 1) + '-' + val.getDate() +' 00:00:00'
    // 获取某个月有多少天
    var acc = new Date(val.getFullYear(), val.getMonth() + 1, 0).getDate(); 
    var time_week2 = new Date(val.getTime() + 24 * 60 * 60 * 1000 * (acc-1));
      //  选中的某月的结束时间
     var en_time =  time_week2.getFullYear() + '-' + (time_week2.getMonth() + 1) + '-' + (time_week2.getDate()) + ' 23:59:59'
    
    console.log(st_time,en_time);
      
    },
    orgId: function() {
      this.shopId = ''
       //调用获取门店列表的方法
      this.getShopList();
    },
    areaCode: function() {
      this.shopId = ''
      //调用获取门店列表的方法
      this.getShopList();
    }
  },
  methods: {
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
    // 点击周/月的时候触发
    change_week_month(t){
       console.log(t)
    },
    // 点击查询的时候触发
    query() {
      alert("查询");
    },
    // 点击重置的时候触发
    reset_params() {
      this.areaCode = ''   // 区域重置为默认值：全部
      this.orgId = ''    // 品牌重置为默认值：全部
      this.shopId = ''    // 门店重置为默认值：全部
      this.params.queryFlag = 1   // 请求标志设置为1，昨天；
      this.flag = 1
      this.tab = 0
      this.change_day(1)
    },
    // 选择周或者月的时候点击叉号按钮触发
    clearWeek() {
      this.flag = 4;
    },
    // 点击  全部下单用户/复购用户数/活跃用户数/沉睡用户/流失用户 tab时触发；index: 传过来的数组的序号；name:传过来的数组中的name值；
    change_tab(index, name) {
      this.tab = index;
      console.log(name);
      this.myChart.setOption({
        title: {
          text: name + "分析",
          x: "20px",
          y: "20px"
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.blue {
  color: #409eff;
}
.home {
  margin: 15px;
  height: 700px;
  .el-header {
    background: #fff;
    display: flex;
    align-items: center;
    .el-row {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      .el-col {
        display: flex;
        align-items: center;
        height: 70%;
        justify-content: center;
        align-items: center;
        span {
          font-size: 12px;
        }
        .el-select {
          width: 90px;
          margin-left: 10px;
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
          margin: 0 5px;

          cursor: pointer;
          height: 70%;
          border-bottom: 3px solid #fff;
          font-size: 12px;
          &.active {
            border-color: #409eff;
            color: #409eff;
          }
        }
      }
      .left_text {
        justify-content: flex-start;
      }
    }
  }
  .el-main {
    height: 100px;
    padding: 0;
    margin-top: 15px;
    flex-grow: 0;
    .userClass {
      height: 100%;
      display: flex;
      justify-content: space-between;
      .el-col {
        background: #fff;
        margin-right: 15px;
        height: 100%;
        position: relative;
        cursor: pointer;
        &:last-child {
          margin: 0;
        }
        p:first-of-type {
          display: flex;
          justify-content: space-between;
          margin: 12px 20px;
          color: #666;
          align-items: center;
          height: 20px;
          span {
            font-size: 12px;
          }
        }
        div {
          position: absolute;
          right: 0;
          top: 35px;
          border: 1px solid #ccc;
        }
        p:last-of-type {
          font-size: 28px;
          margin: 0 25px;
        }
      }
    }
  }
  section {
    padding: 0;
    height: 500px;
    margin-top: 10px;
    width: 100%;
    #chart {
      width: 100%;
      height: 500px;
      background: #fff;
    }
  }
}
</style>
