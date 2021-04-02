import * as apiClient from "~/api/apiClient";
import * as localApi from "~/helpers/cacheLocal-utils";
// import RJSON from "~/helpers/rjson";

export default async function(params) {
  localApi.remove('isCallFirstKarteData');
  let tmpParams = params;
  if (tmpParams.medical_department_code == 0) {
    tmpParams.medical_department_code = 1;
  }
  // if (tmpParams.karte_status == 0) {
  //     tmpParams.karte_status = 1;
  // } else if(tmpParams.karte_status == 1){
  //     tmpParams.karte_status = 3;
  // } else {
  //     tmpParams.karte_status = 2;
  // }
  await apiClient.get("/app/api/v2/karte/tree/search", {
    params: tmpParams
  }).then((res) => {
    // let res = RJSON.unpack(_res);
    // console.log(res);
    if(Object.keys(res).length > 0){
      let state_obj = {};
      // 自科カルテ
      res.current_soap.latest = getLatestDataByCategory(res.current_soap.latest, res.all_dates);
      res.current_soap.data = getDataByCategory(res.current_soap.data, res.all_dates);
      // 全科カルテ
      res.all_soap.latest = getLatestDataByCategory(res.all_soap.latest, res.all_dates);
      res.all_soap.data = getDataByCategory(res.all_soap.data, res.all_dates);
      //入院
      res.all_hospital.data = getHospitalDataByCategory(res.all_hospital.data, res.all_dates);
      //プログレスノート
      res.all_progress.latest = getLatestDataByCategory(res.all_progress.latest, res.all_dates);
      res.all_progress.data = getDataByCategory(res.all_progress.data, res.all_dates);
      // オーダ
      res.all_execute.latest = getLatestDataByCategory(res.all_execute.latest, res.all_dates);
      res.all_execute.data = getDataByCategory(res.all_execute.data, res.all_dates);
      // 結果・報告(current department)
      res.current_examination.latest = getLatestDataByCategory(res.current_examination.latest, res.all_dates);
      res.current_examination.data = getDataByCategory(res.current_examination.data, res.all_dates);
      // 処方・注射
      res.all_order.latest = getLatestDataByCategory(res.all_order.latest, res.all_dates);
      res.all_order.data = getDataByCategory(res.all_order.data, res.all_dates);
      // 検査 [ 結果・報告(all department)]
      res.all_examination.latest = getLatestDataByCategory(res.all_examination.latest, res.all_dates);
      res.all_examination.data = getDataByCategory(res.all_examination.data, res.all_dates);
      // 生理
      res.all_inspection.latest = getLatestDataByCategory(res.all_inspection.latest, res.all_dates);
      res.all_inspection.data = getDataByCategory(res.all_inspection.data, res.all_dates);
      // 処置
      res.all_treatment.latest = getLatestDataByCategory(res.all_treatment.latest, res.all_dates);
      res.all_treatment.data = getDataByCategory(res.all_treatment.data, res.all_dates);
      // 既往歴・アレルギー
      // res.all_hospital.latest = getLatestDataByCategory(res.all_hospital.latest, res.all_dates);
      // res.all_hospital.data = getDataByCategory(res.all_hospital.data, res.all_dates);
      // リハビリ
      res.all_rehabily.latest = getLatestDataByCategory(res.all_rehabily.latest, res.all_dates);
      res.all_rehabily.data = getDataByCategory(res.all_rehabily.data, res.all_dates);
      // 放射線
      res.all_radiation.latest = getLatestDataByCategory(res.all_radiation.latest, res.all_dates);
      res.all_radiation.data = getDataByCategory(res.all_radiation.data, res.all_dates);
      // 付箋ツリー
      res.all_soap_tag.latest = getLatestDataByCategory(res.all_soap_tag.latest, res.all_dates);
      res.all_soap_tag.data = getDataByCategory(res.all_soap_tag.data, res.all_dates);
      let latest = undefined;
      if(res.current_soap.latest != null && Object.keys(res.current_soap.latest).length > 0){
        latest = res.current_soap.latest[Object.keys(res.current_soap.latest)[0]];
      }
      let showDelete = false;
      let noData = true;
      let soapList = [];
      if (this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)) {
        showDelete = true;
      }
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
      soapList = noData ? [] : this.sortSoapList(soapList);
      state_obj = {
        soapList,
        soapOriginalList: noData ? [] : latest.data,
        allDateList: res.all_dates,
        allTags:res.all_tags,
        soapTrees: {
          current_soap: res.current_soap.data,
          current_soap_latest: res.current_soap.latest,
          all_soap: res.all_soap.data,
          all_soap_latest: res.all_soap.latest,
          all_hospital:res.all_hospital.data,
          all_progress:res.all_progress.data,
          all_progress_latest:res.all_progress.latest,
          all_execute_order: res.all_execute.data,
          all_execute_order_latest: res.all_execute.latest,
          current_examination: res.current_examination.data,
          current_examination_latest: res.current_examination.latest,
          global_examination: res.all_examination.data,
          global_examination_latest: res.all_examination.latest,
          all_examination: res.all_examination.data,
          all_examination_latest: res.all_examination.latest,
          all_inspection: res.all_inspection.data,
          all_inspection_latest: res.all_inspection.latest,
          all_treatment: res.all_treatment.data,
          all_treatment_latest: res.all_treatment.latest,
          all_rehabily: res.all_rehabily.data,
          all_rehabily_latest: res.all_rehabily.latest,
          all_radiation: res.all_radiation.data,
          all_radiation_latest: res.all_radiation.latest,
          all_soap_tag: res.all_soap_tag.data,
          all_soap_tag_latest: res.all_soap_tag.latest,
          all_order: res.all_order.data,
          all_order_latest: res.all_order.latest,
          search_condition:res.search_condition,
        },
        show_list_condition: {condition:'', date:''},
        recently_updated_datetime:res.recently_updated_at,
        search_condition_number:res.search_condition_number,
      };
      this.getAllKarteData = true;
      this.setState(state_obj);
    }
    return res;
  });
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
  if(source !== undefined && source != null && Object.keys(source).length > 0){
    Object.keys(source).map((item)=>{
      let tmp_data = getDataByNumbers(all_dates, item, source[item].numbers);
      source[item]["data"] = tmp_data;
    });
    return source;
  } else {
    return null;
  }
}

function getDataByCategory(source, all_dates){
  if(source !== undefined && source != null && Object.keys(source).length > 0){
    Object.keys(source).map((item)=>{
      source[item].data.map(ele=>{
        ele.data.map(element=>{
          element.data = getDataByNumbers(all_dates, element.date, element.numbers);
        })
      });
    });
    return source;
  } else {
    return null;
  }
}

function getHospitalDataByCategory(source, all_dates){
  if (source != undefined && source != null && Object.keys(source).length > 0){
    Object.keys(source).map((hospital_date) => {
      var item = source[hospital_date];
      if(item.length > 0){
        item.map(sub_item => {
          sub_item.data = getDataByNumbers(all_dates, sub_item.date, sub_item.numbers);
        })
      }
    })
    return source;
  } else {
    return null;
  }
}
