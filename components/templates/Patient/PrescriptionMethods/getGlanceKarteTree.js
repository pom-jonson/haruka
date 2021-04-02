import * as apiClient from "~/api/apiClient";

export default async function(params) {
	let tmpParams = params;
  if (tmpParams.medical_department_code == 0) {
    tmpParams.medical_department_code = 1;    
  }
  // tmpParams.requestType = "onlyCurrentSoap";
  await apiClient.get("/app/api/v2/karte/tree/search", {
    params: tmpParams
  }).then((res) => {
    let latest = res.current_soap.latest[Object.keys(res.current_soap.latest)[0]];
    let defaultSoap = [];
    let nYear = -1;
    let nMonth = -1;
    let nDay = -1;
    let strDate;
    let showDelete = false;
    let noData = true;
    var soapList = [];
    if (this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)) {
      showDelete = true;
    }
    if (latest != undefined) {
      defaultSoap = latest.data[0];      
      noData = false;
      if (defaultSoap.treatment_datetime !== "" && defaultSoap.treatment_datetime !== undefined) {
        nYear = defaultSoap.treatment_datetime.substr(0, 4);
        nMonth = defaultSoap.treatment_datetime.substr(5, 2);
        nDay = defaultSoap.treatment_datetime.substr(8, 2);
        strDate = defaultSoap.treatment_datetime.substr(0, 10);
      } else {
        nYear = defaultSoap.treatment_date.substr(0, 4);
        nMonth = defaultSoap.treatment_date.substr(5, 2);
        nDay = defaultSoap.treatment_date.substr(8, 2);
        strDate = defaultSoap.treatment_date.substr(0, 10);
      }
      defaultSoap.class_name = "open";
      defaultSoap.openTag = 1;
      var active_soap_latest = res.current_soap.latest;
      Object.keys(active_soap_latest).forEach(function(key) {
        if (key == strDate) {
          active_soap_latest[key].class_name = "open";
        } else {
          active_soap_latest[key].class_name = "";
        }
      });       
      var soap_latest = res.current_soap.latest[strDate];
      
      soap_latest.data.map((soap) => {
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
    }
    this.setState({
      soapList: noData ? [] : soapList,
      soapOriginalList: noData ? [] : latest.data,
      allDateList: res.all_dates,
      soapTrees: {
        current_soap: res.current_soap.data,
        current_soap_latest: res.current_soap.latest,
        all_soap: res.all_soap.data,
        all_soap_latest: res.all_soap.latest,
        all_examination: res.all_examination.data,
        all_examination_latest: res.all_examination.latest,
        all_order: res.all_order.data,
        all_order_latest: res.all_order.latest
      },
      selYear: nYear,
      selMonth: nMonth,
      selDay: nDay,
      bOpenCurrentSoap: true,
      bOpenAllSoap: false,
      bOpenAllOrder: false,
      bOpenAllExamination: false,
      bOpenCurrentSoapLatest: true,
      bOpenAllSoapLatest: true,
      bOpenAllOrderLatest: true,
      bOpenAllExaminationLatest: true,
      isLoaded: true,
    });    
    // this.getKarteTree(params);
    return res;
  });
}