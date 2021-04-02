import * as apiClient from "~/api/apiClient";

export default async function(params) {
  let tmpParams = params;
  if (tmpParams.medical_department_code == 0) {
    tmpParams.medical_department_code = 1;    
  }
  await apiClient.get("/app/api/v2/karte/tree/searchInspectionTree", {
    params: tmpParams
  }).then((res) => {

    res.all_soap.data = getDataByCategory(res.all_soap.data, res.all_dates);

    // 検査

    res.all_examination.latest = getLatestDataByCategory(res.all_examination.latest, res.all_dates);
    res.all_examination.data = getDataByCategory(res.all_examination.data, res.all_dates);

    let latest = res.all_examination.latest[Object.keys(res.all_examination.latest)[0]];
    let nYear = -1;
    let nMonth = -1;
    let nDay = -1;
    let showDelete = false;
    let noData = true;
    var soapList = [];
    if (this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)) {
      showDelete = true;
    }
    if (latest != undefined) {
      noData = false;

      var soap_latest = res.all_examination.latest;
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
    this.setState({
      soapList: noData ? [] : this.sortSoapList(soapList),
      allDateList: res.all_dates,
      allTags:res.all_tags,
      soapTrees: {
        all_soap: res.all_soap.data,
        all_examination: res.all_examination.data,
        all_examination_latest: res.all_examination.latest,
      },
      selYear: nYear,
      selMonth: nMonth,
      selDay: nDay,
      bOpenAllExamination: true,
      bOpenAllExaminationLatest: true,
      isLoaded: true,
    });
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