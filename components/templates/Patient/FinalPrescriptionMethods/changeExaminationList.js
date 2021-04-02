import { SOAP_TREE_CATEGORY } from "~/helpers/constants";

export default function(departmentIndex, yearIndex = -1, monthIndex = -1, dateIndex = -1, nCategoryType = -1) {
  let showDelete = false;
  if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)){
    showDelete = true;
  }
  let nOpenTag = true;
  if (dateIndex == -1) {
    nOpenTag = false;
  }
  let soapList = this.state.soapList;
  var soap_latest = [];
  var stateCurrentSoapLatest = [];
  var strDate = yearIndex+"-"+monthIndex+"-"+dateIndex;
  // var soap_latest = [];
  let nIdx = 0; // first 3 open index
  var active_soap_latest = [];
  this.setState({
    selYear: yearIndex,
    selMonth: monthIndex,
    selDay: dateIndex
  });
    // 処方ページの自科
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION || departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST){    
        let allExamination = this.state.soapTrees.all_examination.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            if (nCategoryType === SOAP_TREE_CATEGORY.ALL_EXAMINATION) {
                item.class_name = "";
            }
            item.data = item.data.map((monthItem, ind) => {
                monthItem.class_name = "";
                if (ind === monthIndex && index === yearIndex) {
                    monthItem.class_name = "open";
                }
                monthItem.data = monthItem.data.map((data, ind2) => {
                    data.class_name = "";
                    if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
                        data.class_name = "open";
                        soapList = data.data.map((soap, soapIndex) => {
                            if (soapIndex < 0) {
                                soap.class_name = "";
                            } else {
                                soap.class_name = "open";
                            }
                            return soap;
                        });
                    }
                    return data;
                })
                return monthItem;
            })
            return item;
        })

        soapList = [];
        this.state.soapTrees.all_examination.map((item, index) => {
            if (index === yearIndex || yearIndex === -1) {
                item.data.map((monthItem, ind) => {
                    if (ind === monthIndex || monthIndex === -1) {
                        monthItem.data.map((data, ind2) => {
                            if (ind2 === dateIndex || dateIndex === -1) {                                
                                data.data.map((soap) => {
                                    soap["openTag"] = 1;
                                    soap.class_name="open";
                                    if (nIdx > 2) {
                                        soap.class_name="";
                                    }
                                    nIdx ++;
                                    if (nOpenTag == true) {
                                        soap["openTag"] = 1;    
                                    } 
                                    if (!showDelete) {
                                        if (soap.is_enabled == 1) {
                                            soapList.push(soap);
                                        }
                                    }else{
                                        soapList.push(soap);
                                    }                                   
                                });
                            // }
                            }
                        })
                    }
                })
            }
        })
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST){
            active_soap_latest = this.state.soapTrees.all_examination_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";    
                } else {
                    active_soap_latest[key].class_name="";    
                }                
            });

            //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                active_soap_latest = this.state.soapTrees.all_examination_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    active_soap_latest[key].class_name="";    
                }); 
            }
            soapList = [];            
            
            var stateAllExaminationLatest = this.state.soapTrees.all_examination_latest;
            Object.keys(stateAllExaminationLatest).forEach(function(key){
                if (key == strDate) {
                    soap_latest = stateAllExaminationLatest[strDate];
                    return false;
                }
            });

            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                stateCurrentSoapLatest = this.state.soapTrees.all_examination_latest;
                Object.keys(stateCurrentSoapLatest).forEach(function(key){
                    soap_latest.push(stateAllExaminationLatest[key]);
                });
            }
            if (Object.keys(soap_latest).length < 1) {
                return;
            }
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                Object.keys(soap_latest).forEach(function(key){
                    soap_latest[key].data.map((soap)=>{
                        soapList.push(soap);           
                    });
                });    
            } else {                
                if (soap_latest.data == null || soap_latest.data == undefined || soap_latest.data.length < 1) {
                    return;
                }                        
                soap_latest.data.map((soap)=>{
                    soap["openTag"] = 1; 
                    soap.class_name = "open";                   
                    if (!showDelete) {
                        if (soap.is_enabled == 1) {
                            soapList.push(soap);
                        }
                    }else{
                        soapList.push(soap);
                    }
                });
            }
        }

        if (nCategoryType === SOAP_TREE_CATEGORY.ALL_EXAMINATION) {            
            this.setState({
                soapTrees: {
                    ...this.state.soapTrees, 
                    all_examination: allExamination,               
                    all_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.all_examination_latest,                
                },
                soapList: soapList,
                categoryType: SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST
            }); 
        }else{            
        this.setState({
            soapTrees: {
                        ...this.state.soapTrees, 
                    all_examination: allExamination,
                    all_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.all_examination_latest,
            },
                soapList: soapList,
                categoryType: departmentIndex
        });
    }
    }
  }
