import * as apiClient from "~/api/apiClient";
import * as localApi from "~/helpers/cacheLocal-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";

export default async function(params, first=true) {
  let tmpParams = params;
  if (tmpParams.medical_department_code == 0) {
    tmpParams.medical_department_code = 1;
  }
  // if (tmpParams.karte_status == 0) {
  //   tmpParams.karte_status = 1;
  // } else if(tmpParams.karte_status == 1){
  //     tmpParams.karte_status = 3;
  // } else {
  //     tmpParams.karte_status = 2;
  // }
  tmpParams.requestType = 'onlyCurrentSoap';
  let first_karte_data = localApi.getObject(CACHE_LOCALNAMES.FIRST_KARTE_DATA);
  let res;
  let search_karte_data_flag = false;
  if(first_karte_data !== undefined && first_karte_data != null && first_karte_data[tmpParams.patient_id] !== undefined){
    let karte_data = first_karte_data[tmpParams.patient_id];
    // if(karte_data['karte_status'] !== tmpParams.karte_status || karte_data['medical_department_code'] !== tmpParams.medical_department_code){
    if(karte_data['medical_department_code'] !== tmpParams.medical_department_code){
      search_karte_data_flag = true;
    }
    if(search_karte_data_flag === false){
      res = karte_data['karte_data'];
    }
  } else {
    search_karte_data_flag = true;
  }
  if(search_karte_data_flag){
    await apiClient.get("/app/api/v2/karte/tree/search", {
      params: tmpParams
    }).then((result) => {
      res = result;
      if(first_karte_data == null || first_karte_data === undefined){
        first_karte_data = {};
      }
      first_karte_data[tmpParams.patient_id] = {};
      first_karte_data[tmpParams.patient_id]['karte_data'] = res;
      first_karte_data[tmpParams.patient_id]['medical_department_code'] = tmpParams.medical_department_code;
      localApi.setObject(CACHE_LOCALNAMES.FIRST_KARTE_DATA, first_karte_data);
    });
  }
  let nYear = -1;
  let nMonth = -1;
  let nDay = -1;
  let showDelete = false;
  let noData = true;
  let soapList = [];
  if (this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)) {
    showDelete = true;
  }
  let bOpenCurrentSoapLatest = true;
  let latest = undefined;
  if(Object.keys(res).length > 0){
    if(res.current_soap.latest !== undefined && Object.keys(res.current_soap.latest).length > 0){
      res.current_soap.latest = getLatestDataByCategory(res.current_soap.latest, res.all_dates);
      latest = res.current_soap.latest[Object.keys(res.current_soap.latest)[0]];
      if (latest != undefined) {
        noData = false;
        let soap_latest = res.current_soap.latest;
        if(soap_latest!== undefined && soap_latest != null && Object.keys(soap_latest).length > 0){
          Object.keys(soap_latest).map(date_data=>{
            soap_latest[date_data].data.map((soap) => {
              soap["openTag"] = 1;
              soap.class_name = "open";
              if (!showDelete) {
                if (soap.is_enabled == 1) {
                  soapList.push(soap);
                }
              } else {
                soapList.push(soap);
              }
            });
          });
        }
      }
    }
    if(res.current_soap.data !== undefined && Object.keys(res.current_soap.data).length > 0){
      bOpenCurrentSoapLatest = false;
      nYear = 0;
      nMonth = 0;
      nDay = 0;
      res.current_soap.data = getDataByCategory(res.current_soap.data, res.all_dates);
    }
  }
  soapList = noData ? [] : this.sortSoapList(soapList);
  let state_obj = {
    soapList,
    soapOriginalList: noData ? [] : latest.data,
    allDateList: Object.keys(res).length > 0 ? res.all_dates : [],
    allTags:Object.keys(res).length > 0 ? res.all_tags : [],
    soapTrees: {
      current_soap: Object.keys(res).length > 0 ? res.current_soap.data : [],
      current_soap_latest: Object.keys(res).length > 0 ? res.current_soap.latest : [],
    },
    selYear: nYear,
    selMonth: nMonth,
    selDay: nDay,
    bOpenCurrentSoap: true,
    bOpenAllSoap: false,
    bOpenAllExecuteOrder: false,
    bOpenAllOrder: false,
    bOpenAllExamination: false,
    bOpenGroupExamination: false,
    bOpenCurrentExamination: false,
    bOpenGlobalExamination: false,
    bOpenAllInspection: false,
    bOpenAllTreatment: false,
    bOpenCurrentSoapLatest,
    bOpenAllSoapLatest: true,
    bOpenAllExecuteOrderLatest: true,
    bOpenAllOrderLatest: true,
    bOpenAllExaminationLatest: true,
    bOpenCurrentExaminationLatest: true,
    bOpenGlobalExaminationLatest: true,
    bOpenAllTreatmentLatest: true,
    bOpenAllRehabilyLatest: true,
    bOpenAllRadiationLatest: true,
    bOpenAllSoapTagLatest: true,
    show_list_condition: {condition:'', date:''},
    next_reservation_visit_date: res.next_reservation_visit_date,
  };
  this.selected_date = res.selected_date;
  state_obj["isLoaded"] = first ? true : false;
  this.setState(state_obj);
  this.getAllKarteData = false;
  /*@cc_on _win = window; eval ( 'var window = _win') @*/
  window.sessionStorage.setItem('tree_scroll_top', 0);
  return res;
}

function getDataByNumbers(source, date, numbers = []){
  let result = [];
  if (numbers.length > 0 && source[date] !== undefined && source[date] != null && Object.keys(source[date]).length > 0) {
    Object.keys(source[date]).map(item=>{
      source[date][item].map(ele=>{
        if (numbers.includes(ele.number)) {
          result.push(ele);
        }
      });
    });
  }
  return result;
}

function getLatestDataByCategory(source, all_dates){
  Object.keys(source).map((item)=>{
    let tmp_data = getDataByNumbers(all_dates, item, source[item].numbers);
    source[item]["data"] = tmp_data;
  });
  return source;
}

function getDataByCategory(source, all_dates){
  Object.keys(source).map((item)=>{
    source[item].data.map(ele=>{
      ele.data.map(element=>{
        element.data = getDataByNumbers(all_dates, element.date, element.numbers);
      })
    });
  });
  
  return source;
}
