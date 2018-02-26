import axios from 'axios';
var baseURL;
if(typeof(apiDomain) == "undefined" || typeof(apiDomain) == "null"){
  baseURL = 'http://local.duocai.cn';
}else{
  baseURL = apiDomain;
}
var qs = require('qs');
var instance = axios.create({
  baseURL: baseURL,
  headers: {'X-Requested-With': 'XMLHttpRequest'}
});
var city;
if(typeof(cityList) == "undefined" || typeof(cityList) == "null"){
    city = [
      {"cityCode":"1001","cityName":"北京市"},
      {"cityCode":"1073","cityName":"上海市"},
      {"cityCode":"1074","cityName":"南京市"},
      {"cityCode":"1078","cityName":"苏州市"},
      {"cityCode":"1152","cityName":"郑州市"},
      {"cityCode":"1169","cityName":"武汉市"},
      {"cityCode":"1199","cityName":"深圳市"},
      {"cityCode":"1234","cityName":"重庆市"}];
  }else{
    city = cityList;
  }
//城市列表
export const cities = city;
//图片上传地址
export const actionURL = baseURL + "/dcim/dcim/uploadImg";

//服务管理

export const getServiceItemList = params => { return instance.get(`/dcim/service/serviceManage`, { params: params }); };//获取服务项信息数据地址

export const deleteServiceItem = params => { return instance.post(`/dcim/service/serviceOffline`, qs.stringify({ id: params.id})); };//服务下线地址

export const getServiceInfo = params => { return instance.get(`/dcim/service/getServiceInfo`, { params: params }); };//获取服务项编辑信息数据地址

export const saveServiceItem = params => { return instance.post(`/dcim/service/saveServiceItem`, qs.stringify({ id: params.id ,name:params.name,erpId: params.erpId,unit: params.unit,isAloneSale: params.isAloneSale,serviceType:params.serviceType,measureType:params.measureType,cityCode:params.cityCode,serviceSystemTypeId:params.serviceSystemTypeId})); };//保存编辑信息地址

//工艺体系管理

export const getCraftSuitList = params => { return instance.get(`/dcim/craftsuit/craftSuitManage`, { params: params }); };//获取工艺体系数据地址

export const deleteCraftSuit = params => { return instance.post(`/dcim/craftsuit/craftSuitOffline`, qs.stringify({ id: params.id})); };//工艺体系下线地址

export const getCraftSuitInfo = params => { return instance.get(`/dcim/craftsuit/getCraftSuitInfo`, { params: params }); };//获取工艺体系项编辑信息数据地址

export const saveCraftSuit = params => { return instance.post(`/dcim/craftsuit/saveCraftSuit`, qs.stringify({ id: params.id ,name:params.name,cityCode:params.cityCode})); };//保存编辑信息地址

//工艺管理
export const getCraftList = params => { return instance.get(`/dcim/craft/getCraftList`, { params: params }); };//获取工艺数据地址

export const deleteCraft = params => { return instance.post(`/dcim/craft/craftOffline`, qs.stringify({ id: params.id})); };//工艺下线地址

export const saveCraft = params => { return instance.post(`/dcim/craft/saveCraft`, qs.stringify({ id: params.id ,name:params.name})); };//保存编辑信息地址

//类别管理

export const getCategoryList = params => { return instance.get(`/dcim/category/categoryManage`, { params: params }); };//获取类别数据地址

export const deleteCategory = params => { return instance.post(`/dcim/category/categoryOffline`, qs.stringify({ id: params.id})); };//类别下线地址

export const getCategoryInfo = params => { return instance.get(`/dcim/category/getCategoryInfo`, { params: params }); };//获取类别编辑信息数据地址

export const saveCategory = params => { return instance.post(`/dcim/category/saveCategory`, qs.stringify({ id: params.id ,name:params.name,cityCode:params.cityCode})); };//保存编辑信息地址

//品牌管理

export const getBrandList = params => { return instance.get(`/dcim/brand/getBrandList`, { params: params }); };//获取类别数据地址

export const deleteBrand = params => { return instance.post(`/dcim/brand/brandOffline`, qs.stringify({ id: params.id})); };//类别下线地址

export const getBrandInfo = params => { return instance.get(`/dcim/brand/getBrandInfo`, { params: params }); };//获取类别编辑信息数据地址

export const saveBrand = params => { return instance.post(`/dcim/brand/saveBrand`, qs.stringify({ id: params.id ,name:params.name,logo:params.logo,intro:params.intro})); };//保存编辑信息地址
