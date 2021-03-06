import * as apiClient from "~/api/apiClient";

export default async function(params, first=true) {
  let tmpParams = params;
  if (tmpParams.medical_department_code == 0) {
    tmpParams.medical_department_code = 1;    
  }
  await apiClient.get("/app/api/v2/karte/tree/search", {
    params: tmpParams
  }).then((res) => {   
    // 自科カルテ
    res.current_soap.latest = getLatestDataByCategory(res.current_soap.latest, res.all_dates);
    res.current_soap.data = getDataByCategory(res.current_soap.data, res.all_dates);    

    // 全科カルテ

    res.all_soap.latest = getLatestDataByCategory(res.all_soap.latest, res.all_dates);
    res.all_soap.data = getDataByCategory(res.all_soap.data, res.all_dates);   
    

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

    // let latest = res.current_soap.latest[Object.keys(res.current_soap.latest)[0]];
    let latest = res.current_soap.latest[Object.keys(res.current_soap.latest)[0]];
    // let defaultSoap = [];
    let nYear = -1;
    let nMonth = -1;
    let nDay = -1;
    // let strDate;
    let showDelete = false;
    let noData = true;
    var soapList = [];
    if (this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)) {
      showDelete = true;
    }
    if (latest != undefined) {     
      // defaultSoap = latest.data[0];
      noData = false;
      // if (defaultSoap.treatment_datetime !== "" && defaultSoap.treatment_datetime !== undefined) {
      //   // nYear = defaultSoap.treatment_datetime.substr(0, 4);
      //   // nMonth = defaultSoap.treatment_datetime.substr(5, 2);
      //   // nDay = defaultSoap.treatment_datetime.substr(8, 2);
      //   strDate = defaultSoap.treatment_datetime.substr(0, 10);
      // } else {
      //   // nYear = defaultSoap.treatment_date.substr(0, 4);
      //   // nMonth = defaultSoap.treatment_date.substr(5, 2);
      //   // nDay = defaultSoap.treatment_date.substr(8, 2);
      //   strDate = defaultSoap.treatment_date.substr(0, 10);
      // }
      // defaultSoap.class_name = "open";
      // defaultSoap.openTag = 1;
      // var active_soap_latest = res.current_soap.latest;
      // Object.keys(active_soap_latest).forEach(function(key) {
      //   if (key == strDate) {
      //     active_soap_latest[key].class_name = "open";
      //   } else {
      //     active_soap_latest[key].class_name = "";
      //   }
      // });       
      // var soap_latest = res.current_soap.latest[strDate];

      var soap_latest = res.current_soap.latest;
      // if (soap_latest.data != null && soap_latest.data != undefined && soap_latest.data.length > 0) {        
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
      // }
    }
    let state_obj = {
      soapList: noData ? [] : this.sortSoapList(soapList),
      soapOriginalList: noData ? [] : latest.data,
      allDateList: res.all_dates,
      allTags:res.all_tags,
      soapTrees: {
        current_soap: res.current_soap.data,
        current_soap_latest: res.current_soap.latest,
        all_soap: res.all_soap.data,
        all_soap_latest: res.all_soap.latest,        
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
        // ---------------------------------
        // all_hospital: res.all_hospital.data,
        // all_hospital_latest: res.all_hospital.latest,
        // ---------------------------------
        all_rehabily: res.all_rehabily.data,
        all_rehabily_latest: res.all_rehabily.latest,
        all_radiation: res.all_radiation.data,
        all_radiation_latest: res.all_radiation.latest,
        all_soap_tag: res.all_soap_tag.data,
        all_soap_tag_latest: res.all_soap_tag.latest,

        all_order: res.all_order.data,
        all_order_latest: res.all_order.latest
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
      bOpenCurrentSoapLatest: true,
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
      show_list_condition: '',
    };
    if(first){
      state_obj["isLoaded"] = true;
    }
    this.setState(state_obj);
    return res;
  });
}

function getDataByNumbers(source, date, numbers = []){  
  let result = [];  
  if (numbers.length > 0) {
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