<template>
    <div class="home">
        <el-container>
            <el-header height="50px" class="bigHeader">
                <el-row>
                    <el-col :span="24"><div>运营分析平台</div><div><i class="el-icon-s-fold" @click="hidden_left"></i>欢迎进入国信运营数据分析平台</div></el-col>
                    <!-- <el-col :span="4"><div><i class="el-icon-user"></i>欢迎您,管理员</div><div><i class="el-icon-close"></i>退出登陆</div></el-col> -->
                </el-row>
            </el-header>
            <el-container class="container">
                <!-- 左侧菜单栏 -->
                <el-aside :class="[spread?'left_aside':'left_aside2']">
                    <el-row @click.native="dataScreening()" :class="['point',flag=='dataScreening'?'active':'']"><i class="el-icon-data-analysis"></i>数据总览</el-row>
                    <el-row @click.native="userData()" :class="['point',flag=='userData'?'active':'']"><i class="el-icon-user"></i>用户数据</el-row>
                    <el-row @click.native="drugAnalyse()" :class="['point',flag=='drugAnalyse'?'active':'']"><i class="el-icon-odometer"></i>药品分析</el-row>
                    <el-row :class="['point',flag=='evaluateAnalyse'?'active':'']" @click.native="evaluateAnalyse()"><i class="el-icon-chat-dot-square"></i>评价分析</el-row>
                    <el-row :class="['point',flag=='drugstoreManager'?'active':'']" @click.native="drugstoreManager()"><i class="el-icon-s-data"  :class="[flag=='drugstoreManager'?'active':'']"></i>药品库维护</el-row>
                </el-aside>
                <!-- 上部菜单栏 -->
                <el-main class=main>
                    <el-header>
                        <el-row>
                            <el-col :span="2" @click.native="dataScreening()" :class="['point',flag=='dataScreening'?'active':'']">数据总览</el-col>
                            <el-col :span="2" @click.native="userData()" :class="['point',flag=='userData'?'active':'']">用户数据</el-col>
                            <el-col :span="2" @click.native="drugAnalyse()" :class="['point',flag=='drugAnalyse'?'active':'']">药品分析</el-col>
                            <el-col :span="2" :class="['point',flag=='evaluateAnalyse'?'active':'']" @click.native="evaluateAnalyse()" >评价分析</el-col>
                            <el-col :span="2"  @click.native="drugstoreManager()" :class="['point',flag=='drugstoreManager'?'active':'']">药品库维护</el-col>
                        </el-row>
                    </el-header>
                    <iframe :src="address" frameborder="0" ></iframe>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
export default{
    data(){
        return{
            spread:true,
            flag:"dataScreening",                                                              //控制菜单选项样式
            // address:"https://drug.aqdpay.com/statistics/#/dataScreening"                           //加载的在线地址
            address:"https://drug.aqdpay.com/statistics/#/userData"                           //加载的在线地址
        }
    },
    methods:{ 
        // 点击‘欢迎进入国信运营数据分析平台的’左侧的按钮 触发
        hidden_left(){
            if(this.spread){
                this.spread = false
            }else{
                this.spread = true
            }
            console.log(this.spread)
        },
        // 点击数据总览触发
        dataScreening(){
            this.flag = "dataScreening";
            this.address = "https://drug.aqdpay.com/statistics/#/dataScreening"
        },
        // 点击用户数据触发
        userData(){
            this.flag = "userData";
            this.address = "https://drug.aqdpay.com/statistics/#/userData"
        },
        // 点击药品分析触发
        drugAnalyse(){
            this.flag = "drugAnalyse";
            this.address = "https://drug.aqdpay.com/statistics/#/drugAnalyse"
        },
        // 点击评价分析触发
        evaluateAnalyse(){
             this.flag = "evaluateAnalyse";
             alert("评价分析页面待开发")
        },
        // 点击药品库管理触发
        drugstoreManager(){
             this.flag = "drugstoreManager";
            this.address = "http://localhost:8082/#/drugstoreManager"
            // this.address = "https://drug.aqdpay.com/statistics/#/dataScreening"
        }
    }
    
}
</script>
<style lang="scss" scoped>
    .left_aside{
         width:200px!important;
        transition: width 0.5s;
        -moz-transition: width 0.5s; /* Firefox 4 */
        -webkit-transition: width 0.5s; /* Safari 和 Chrome */
        -o-transition: width 0.5s; /* Opera */
    }
    .left_aside2{
         width:0px!important;
    }
.point{
    cursor: pointer;
    overflow:hidden;
    white-space: nowrap;
}
    .home{
        
        background:#fff;
        .el-container{
            width:100%;
            .bigHeader{
                width:100%;
                padding:0;
                background:#409EFF;
                .el-row{
                    width:100%;
                    display:flex;
                    justify-content: space-between;
                    height:50px;
                    align-items: center;
                    .el-col{
                        display:flex;
                        color:#fff;
                        &:first-child{
                            div:first-child{
                                margin-left:20px;
                                margin-right:100px;
                            }
                            div:last-child{
                                i{
                                    margin-right:15px;
                                }
                            }
                        }
                         &:last-child{
                            i{
                                margin-right:5px;
                            }
                             div:last-child{
                                 margin-left:20px;
                             }
                         }
                    }
                }
            };
            .container{
                width:100%;
                height:790px;
                overflow: hidden;
                .el-aside{
                   
                    .el-row{
                        &.active{
                            color:#409EFF;
                        }
                        height:30px;
                        line-height: 30px;
                        margin:20px 30px;
                        font-size:16px;
                        i{
                            margin-right:15px;
                        }
                        &:first-child{
                            margin-top:60px;
                        }
                    }
                }
                .main{
                    padding:0;
                    overflow: hidden;
                    height:800px;
                    width:100%;
                    .el-header{
                        padding:0;
                        display:flex;
                        align-items: center;
                        .el-row{
                            display:flex;
                            width:100%;
                            height: 100%;
                            .el-col{
                                text-align: center;
                                height:100%;
                                border-bottom:3px solid #fff;
                                line-height: 60px;
                                &.active{
                                    border-color:#409EFF;
                                    color:#409EFF;
                                }
                            }
                        }
                    }
                }
                iframe{
                    width:100%;
                    height:820px;
                  
                }
            }
        }
    }
</style>  