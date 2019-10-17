var url = 'https://drugapi.aqdpay.com'

export default{
    "areaList": url + "/drugstore/api/statistics/getAreaCodeList",      //获取区域列表
    "shopList": url + "/drugstore/api/statistics/getAllShopList",       //获取门店列表
    "businessData": url + "/drugstore/api/statistics/businessTotal",     //获取营业数据 
    "orgList": url + "/drugstore/api/statistics/getOrgList"              //获取品牌列表
}