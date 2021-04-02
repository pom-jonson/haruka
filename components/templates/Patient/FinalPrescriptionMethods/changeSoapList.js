import { SOAP_TREE_CATEGORY } from "../../../../helpers/constants";
import {getWeekName} from "~/helpers/date";

export default async function(departmentIndex, yearIndex = -1, monthIndex = -1, dateIndex = -1, nCategoryType = -1) {    
  let show_list_condition = '';
  if(yearIndex > 0 && monthIndex > 0 && dateIndex > 0){
      let week_name = getWeekName(parseInt(yearIndex), parseInt(monthIndex), parseInt(dateIndex));
      show_list_condition = yearIndex+'/'+monthIndex+'/'+dateIndex+'('+week_name+'曜日)';
  }
  let showDelete = false;
  if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)){
    showDelete = true;
  }
  let nOpenTag = true;
  if (dateIndex == -1) {
    nOpenTag = false;
  }
  let soapList = this.state.soapList;
  var strDate = yearIndex+"-"+monthIndex+"-"+dateIndex;
  var soap_latest = [];
  var active_soap_latest = [];
  let allDateList = this.state.allDateList;
  let nIdx = 0; // first 3 open index
  let cur_department_code = this.context.department.code;
  // if ROOT_CATEGORY click
  // if (nCategoryType < 0) {
  this.setState({
    selYear: yearIndex,
    selMonth: monthIndex,
    selDay: dateIndex
  });
  // }
    if(departmentIndex == SOAP_TREE_CATEGORY.CURRENT_SOAP || departmentIndex == SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST){
        if(departmentIndex == SOAP_TREE_CATEGORY.CURRENT_SOAP){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
        let current_soap = this.state.soapTrees.current_soap.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            // if (nCategoryType === SOAP_TREE_CATEGORY.CURRENT_SOAP) {
            //     item.class_name = "";
            // }
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
        this.state.soapTrees.current_soap.map((item, index) => {
        if (index === yearIndex || yearIndex === -1) {
            item.data.map((monthItem, ind) => {
                if (ind === monthIndex || monthIndex === -1) {
                    monthItem.data.map((data, ind2) => {
                        if (ind2 === dateIndex || dateIndex === -1) {
                                if (nOpenTag) {
                                    //date
                                    var arrAllCategories = allDateList[data.date];
                                    if (Object.keys(arrAllCategories).length < 1) {
                                        return;
                                    }
                                    Object.keys(arrAllCategories).forEach(function(key){
                                        arrAllCategories[key].map((soap)=>{
                                            soap["openTag"] = 0;
                                            soap.class_name = "open";
                                            if (nOpenTag == true) {
                                                soap["openTag"] = 1;
                                            }
                                            if (cur_department_code == soap.medical_department_code || (cur_department_code == 0 && soap.medical_department_code == 1)) {
                                                if (!showDelete) {
                                                    if (soap.is_enabled == 1) {
                                                        soapList.push(soap);
                                                    }
                                                }else{
                                                    soapList.push(soap);
                                                }
                                            } else if (soap.target_table == "examination") {
                                                if (!showDelete) {
                                                    if (soap.is_enabled == 1) {
                                                        soapList.push(soap);
                                                    }
                                                }else{
                                                    soapList.push(soap);
                                                }
                                            }
                                        });
                                    });
                                }else{
                                    //year,month
                            data.data.map((soap) => {

                                // show detail
                                soap["openTag"] = 1;
                                soap.class_name="open";
                                if (nIdx > 2) {
                                    soap.class_name="";
                                }
                                nIdx ++;
                                // hide detail
                                // soap["openTag"] = 0;
                                if (nOpenTag == true) {
                                    soap["openTag"] = 1;
                                }
                                if (cur_department_code == soap.medical_department_code || (cur_department_code == 0 && soap.medical_department_code == 1)) {
                                    if (!showDelete) {
                                        if (soap.is_enabled == 1) {
                                            soapList.push(soap);
                                        }
                                    }else{
                                        soapList.push(soap);
                                    }
                                } else if (soap.target_table == "examination") {
                                    if (!showDelete) {
                                        if (soap.is_enabled == 1) {
                                            soapList.push(soap);
                                        }
                                    }else{
                                        soapList.push(soap);
                                    }
                                }
                            });
                        }
                            }
                    })
                }
            })
        }
    })

        if(departmentIndex == SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST || nCategoryType === SOAP_TREE_CATEGORY.CURRENT_SOAP){
            active_soap_latest = this.state.soapTrees.current_soap_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";
                } else {
                    active_soap_latest[key].class_name="";
                }
            });

            //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                active_soap_latest = this.state.soapTrees.current_soap_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    active_soap_latest[key].class_name="";
                });
            }
            soapList = [];
            var stateCurrentSoapLatest = this.state.soapTrees.current_soap_latest;
            Object.keys(stateCurrentSoapLatest).forEach(function(key){
                if (key == strDate) {
                    soap_latest = allDateList[strDate];
                    return false;
                }
            });

            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                stateCurrentSoapLatest = this.state.soapTrees.current_soap_latest;
                Object.keys(stateCurrentSoapLatest).forEach(function(key){
                    soap_latest.push(allDateList[key]);
                });
            }
            if (Object.keys(soap_latest).length < 1) {
                return;
            }
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                soap_latest.map(soap_order=>{
                    Object.keys(soap_order).forEach(function(key){
                        soap_order[key].map((soap)=>{
                            soapList.push(soap);
                        });
                    });
                });
            } else {
                Object.keys(soap_latest).forEach(function(key){
                    soap_latest[key].map((soap)=>{
                        soap["openTag"] = 1;
                        soap.class_name = "open";
                        if (cur_department_code == soap.medical_department_code || (cur_department_code == 0 && soap.medical_department_code == 1)) {
                            // add own department's data  ** this.context.department.code == 0 && soap.medical_department_code == 1 =>"内科"
                            if (!showDelete) {
                                if (soap.is_enabled == 1) {
                                    soapList.push(soap);
                                }
                            }else{
                                soapList.push(soap);
                            }
                        } else if (soap.target_table == "examination") {
                            if (!showDelete) {
                                if (soap.is_enabled == 1) {
                                    soapList.push(soap);
                                }
                            }else{
                                soapList.push(soap);
                            }
                        }
                    });
                });
            }


            //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
            // if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
            //     active_soap_latest = this.state.soapTrees.current_soap_latest;
            //      Object.keys(active_soap_latest).forEach(function(key){
            //         active_soap_latest[key].class_name="";
            //     });
            //     soapList = [];
            //     soap_latest = [];
            //     stateCurrentSoapLatest = this.state.soapTrees.current_soap_latest;
            //     Object.keys(stateCurrentSoapLatest).forEach(function(key){
            //         soap_latest.push(allDateList[key]);
            //     });
            //     Object.keys(soap_latest).forEach(function(key){
            //         soap_latest[key].map((soap)=>{
            //             // soap["openTag"] = 1;
            //             // soap.class_name = "open";
            //             // if (cur_department_code == soap.medical_department_code || (cur_department_code == 0 && soap.medical_department_code == 1)) {
            //             //     // add own department's data  ** this.context.department.code == 0 && soap.medical_department_code == 1 =>"内科"
            //             //     if (!showDelete) {
            //             //         if (soap.is_enabled == 1) {
            //             //             soapList.push(soap);
            //             //         }
            //             //     }else{
            //             //         soapList.push(soap);
            //             //     }
            //             // } else if (soap.target_table == "examination") {
            //             //     if (!showDelete) {
            //             //         if (soap.is_enabled == 1) {
            //             //             soapList.push(soap);
            //             //         }
            //             //     }else{
            //             //         soapList.push(soap);
            //             //     }
            //             // }
            //             soapList.push(soap);
            //         });
            //     });
            // }

        }
        if (nCategoryType === SOAP_TREE_CATEGORY.CURRENT_SOAP) {

            this.setState({
                soapTrees: {
                    ...this.state.soapTrees,
                    current_soap: current_soap,
                    current_soap_latest: departmentIndex == SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST?active_soap_latest:this.state.soapTrees.current_soap_latest,
                },
                soapList: this.sortSoapList(soapList),
                categoryType: SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST,
            });
        }else{
            this.setState({
                soapTrees: {
                            ...this.state.soapTrees,
                        current_soap: current_soap,
                        current_soap_latest: departmentIndex == SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST?active_soap_latest:this.state.soapTrees.current_soap_latest,
                },
                    soapList: this.sortSoapList(soapList),
                    categoryType: departmentIndex,
                    show_list_condition: show_list_condition === '' ?
                    '自科カルテ('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15日'
                    : '自科カルテ('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')'+show_list_condition,
            });
        }
    } else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP || departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_LATEST){
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
        let allSoap = this.state.soapTrees.all_soap.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            if (nCategoryType === SOAP_TREE_CATEGORY.ALL_SOAP) {
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
        this.state.soapTrees.all_soap.map((item, index) => {
            if (index === yearIndex || yearIndex === -1) {
                item.data.map((monthItem, ind) => {
                    if (ind === monthIndex || monthIndex === -1) {
                        monthItem.data.map((data, ind2) => {
                            if (ind2 === dateIndex || dateIndex === -1) {
                                if (nOpenTag) {
                                    //date
                                    var arrAllCategories = allDateList[data.date];
                                    if (Object.keys(arrAllCategories).length < 1) {
                                        return;
                                    }
                                    Object.keys(arrAllCategories).forEach(function(key){
                                        arrAllCategories[key].map((soap)=>{
                                            soap["openTag"] = 0;
                                            soap.class_name = "open";
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
                                    });
                                }else{
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
                                    soapList.push(soap);
                                });
                            }
                            }
                        })
                    }
                })
            }
        })

        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_LATEST){
            active_soap_latest = this.state.soapTrees.all_soap_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";
                } else {
                    active_soap_latest[key].class_name="";
                }
            });

            //------------- 全科カルテ最新15日 open tree and show 15day's data--------------------------//
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                active_soap_latest = this.state.soapTrees.all_soap_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    active_soap_latest[key].class_name="";
                });
            }
            soapList = [];

            var stateAllSoapLatest = this.state.soapTrees.all_soap_latest;
            Object.keys(stateAllSoapLatest).forEach(function(key){
                if (key == strDate) {
                    soap_latest = allDateList[strDate];
                    return false;
                }
            });
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                stateCurrentSoapLatest = this.state.soapTrees.all_soap_latest;
                Object.keys(stateCurrentSoapLatest).forEach(function(key){
                    soap_latest.push(allDateList[key]);
                });
            }
            if (Object.keys(soap_latest).length < 1) {
                return;
            }
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                soap_latest.map(soap_order=>{
                    Object.keys(soap_order).forEach(function(key){
                        soap_order[key].map((soap)=>{
                            soapList.push(soap);
                        });
                    });
                });
            } else {
                Object.keys(soap_latest).forEach(function(key){
                    soap_latest[key].map((soap)=>{
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
                });
            }
        }
        if (nCategoryType === SOAP_TREE_CATEGORY.ALL_SOAP) {
            this.setState({
                soapTrees: {
                    ...this.state.soapTrees,
                    all_soap: allSoap,
                    all_soap_latest: departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_LATEST?active_soap_latest:this.state.soapTrees.all_soap_latest,
                },
                soapList: this.sortSoapList(soapList),
                categoryType: SOAP_TREE_CATEGORY.ALL_SOAP_LATEST,
            });
        }else{
            this.setState({
            soapTrees: {
                    ...this.state.soapTrees,
                all_soap: allSoap,
                all_soap_latest: departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_LATEST?active_soap_latest:this.state.soapTrees.all_soap_latest,
            },
            soapList: this.sortSoapList(soapList),
            categoryType: departmentIndex,
            show_list_condition:show_list_condition === '' ?
                    '全科カルテ最新15日'
                    :'全科カルテ'+show_list_condition,
        });
        }
    } else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER || departmentIndex == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST){
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
        let allExecuteOrder = this.state.soapTrees.all_execute_order.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            if (nCategoryType === SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER) {
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
        this.state.soapTrees.all_execute_order.map((item, index) => {
            if (index === yearIndex || yearIndex === -1) {
                item.data.map((monthItem, ind) => {
                    if (ind === monthIndex || monthIndex === -1) {
                        monthItem.data.map((data, ind2) => {
                            if (ind2 === dateIndex || dateIndex === -1) {
                                // if (nOpenTag) {
                                //     //date
                                //     var arrAllCategories = allDateList[data.date];
                                //     if (Object.keys(arrAllCategories).length < 1) {
                                //         return;
                                //     }
                                //     Object.keys(arrAllCategories).forEach(function(key){
                                //         arrAllCategories[key].map((soap)=>{
                                //             soap["openTag"] = 0;
                                //             soap.class_name = "open";
                                //             if (nOpenTag == true) {
                                //                 soap["openTag"] = 1;
                                //             }
                                //             if (!showDelete) {
                                //                 if (soap.is_enabled == 1) {
                                //                     soapList.push(soap);
                                //                 }
                                //             }else{
                                //                 soapList.push(soap);
                                //             }
                                //         });
                                //     });
                                // }else{
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

        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST){
            active_soap_latest = this.state.soapTrees.all_execute_order_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";
                } else {
                    active_soap_latest[key].class_name="";
                }
            });

            //------------- 全科カルテ最新15日 open tree and show 15day's data--------------------------//
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                active_soap_latest = this.state.soapTrees.all_execute_order_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    active_soap_latest[key].class_name="";
                });
            }
            soapList = [];
            var stateAllExecuteOrderLatest = this.state.soapTrees.all_execute_order_latest;
            Object.keys(stateAllExecuteOrderLatest).forEach(function(key){
                if (key == strDate) {
                    // soap_latest = allDateList[strDate];
                    soap_latest = stateAllExecuteOrderLatest[strDate];
                    return false;
                }
            });
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                stateCurrentSoapLatest = this.state.soapTrees.all_execute_order_latest;
                Object.keys(stateCurrentSoapLatest).forEach(function(key){
                    // soap_latest.push(allDateList[key]);
                    soap_latest.push(stateAllExecuteOrderLatest[key]);
                });
            }
            if (Object.keys(soap_latest).length < 1) {
                return;
            }
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                // soap_latest.map(soap_order=>{
                //     Object.keys(soap_order).forEach(function(key){
                //         soap_order[key].map((soap)=>{
                //             soapList.push(soap);
                //         });
                //     });
                // });
                Object.keys(soap_latest).forEach(function(key){
                    soap_latest[key].data.map((soap)=>{
                        soapList.push(soap);
                    });
                });
            } else {
                // Object.keys(soap_latest).forEach(function(key){
                //     soap_latest[key].map((soap)=>{
                //         soap["openTag"] = 1;
                //         soap.class_name = "open";
                //         if (!showDelete) {
                //             if (soap.is_enabled == 1) {
                //                 soapList.push(soap);
                //             }
                //         }else{
                //             soapList.push(soap);
                //         }
                //     });
                // });
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
        if (nCategoryType === SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER) {
            this.setState({
                soapTrees: {
                    ...this.state.soapTrees,
                    all_execute_order: allExecuteOrder,
                    all_execute_order_latest: departmentIndex == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST?active_soap_latest:this.state.soapTrees.all_execute_order_latest,
                },
                soapList: this.sortSoapList(soapList),
                categoryType: SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST,
            });
        } else{
            this.setState({
                soapTrees: {
                        ...this.state.soapTrees,
                    all_execute_order: allExecuteOrder,
                    all_execute_order_latest: departmentIndex == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST?active_soap_latest:this.state.soapTrees.all_execute_order_latest,
                },
                soapList: this.sortSoapList(soapList),
                categoryType: departmentIndex,
                show_list_condition:show_list_condition === '' ?
                    'オーダー('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15日'
                    :'オーダー('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')'+show_list_condition,
            });
        }
    } else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER || departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST){
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
        let allOrder = this.state.soapTrees.all_order.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
                if (nCategoryType === SOAP_TREE_CATEGORY.ALL_ORDER) {
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
            this.state.soapTrees.all_order.map((item, index) => {
            if (index === yearIndex || yearIndex === -1) {
                item.data.map((monthItem, ind) => {
                    if (ind === monthIndex || monthIndex === -1) {
                        monthItem.data.map((data, ind2) => {
                            if (ind2 === dateIndex || dateIndex === -1) {
                                    // if (nOpenTag) {
                                    //     //date
                                    //     var arrAllCategories = allDateList[data.date];
                                    //     if (Object.keys(arrAllCategories).length < 1) {
                                    //         return;
                                    //     }
                                    //     Object.keys(arrAllCategories).forEach(function(key){
                                    //         arrAllCategories[key].map((soap)=>{
                                    //             soap["openTag"] = 0;
                                    //             soap.class_name = "open";
                                    //             if (nOpenTag == true) {
                                    //                 soap["openTag"] = 1;
                                    //             }
                                    //             if (!showDelete) {
                                    //                 if (soap.is_enabled == 1) {
                                    //                     soapList.push(soap);
                                    //                 }
                                    //             }else{
                                    //                 soapList.push(soap);
                                    //             }
                                    //         });
                                    //     });
                                    // }else{
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
            if(departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST){
                active_soap_latest = this.state.soapTrees.all_order_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    if (key == strDate) {
                        active_soap_latest[key].class_name="open";
                    } else {
                        active_soap_latest[key].class_name="";
                    }
                });

                //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
                if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                    active_soap_latest = this.state.soapTrees.all_order_latest;
                     Object.keys(active_soap_latest).forEach(function(key){
                        active_soap_latest[key].class_name="";
                    });
                }
                soapList = [];

                var stateAllOrderLatest = this.state.soapTrees.all_order_latest;
                Object.keys(stateAllOrderLatest).forEach(function(key){
                    if (key == strDate) {
                        // soap_latest = allDateList[strDate];
                        soap_latest = stateAllOrderLatest[strDate];
                        return false;
                    }
                });

                if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                    stateCurrentSoapLatest = this.state.soapTrees.all_order_latest;
                    Object.keys(stateCurrentSoapLatest).forEach(function(key){
                        soap_latest.push(stateAllOrderLatest[key]);
                    });
                }
                if (Object.keys(soap_latest).length < 1) {
                    return;
                }

                // Object.keys(soap_latest).forEach(function(key){
                //     soap_latest[key].map((soap)=>{
                //         soap["openTag"] = 1;
                //         soap.class_name = "open";
                //         if (!showDelete) {
                //             if (soap.is_enabled == 1) {
                //                 soapList.push(soap);
                //             }
                //         }else{
                //             soapList.push(soap);
                //         }
                //     });
                // });
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
            if (nCategoryType === SOAP_TREE_CATEGORY.ALL_ORDER) {
                this.setState({
                    soapTrees: {
                        ...this.state.soapTrees,
                        all_order: allOrder,
                        all_order_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST?active_soap_latest:this.state.soapTrees.all_order_latest
                    },
                    soapList: this.sortSoapList(soapList),
                    categoryType: SOAP_TREE_CATEGORY.ALL_ORDER_LATEST,
                });
            }else{
                this.setState({
                soapTrees: {
                        ...this.state.soapTrees,
                    all_order: allOrder,
                    all_order_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST?active_soap_latest:this.state.soapTrees.all_order_latest
                },
                soapList: this.sortSoapList(soapList),
                categoryType: departmentIndex,
                show_list_condition:show_list_condition === '' ?
                    '処方・注射('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15件'
                    :'処方・注射('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')'+show_list_condition,
            });
            }
    } else if(departmentIndex == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION || departmentIndex == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST){
        if(departmentIndex == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
        let currentExamination = this.state.soapTrees.current_examination.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            if (nCategoryType === SOAP_TREE_CATEGORY.CURRENT_EXAMINATION) {
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
        this.state.soapTrees.current_examination.map((item, index) => {
            if (index === yearIndex || yearIndex === -1) {
                item.data.map((monthItem, ind) => {
                    if (ind === monthIndex || monthIndex === -1) {
                        monthItem.data.map((data, ind2) => {
                            if (ind2 === dateIndex || dateIndex === -1) {
                                // if (nOpenTag) {
                                //     //date
                                //     var arrAllCategories = allDateList[data.date];
                                //     if (Object.keys(arrAllCategories).length < 1) {
                                //         return;
                                //     }
                                //     Object.keys(arrAllCategories).forEach(function(key){
                                //         arrAllCategories[key].map((soap)=>{
                                //             soap["openTag"] = 0;
                                //             soap.class_name = "open";
                                //             if (nOpenTag == true) {
                                //                 soap["openTag"] = 1;
                                //             }
                                //             if (!showDelete) {
                                //                 if (soap.is_enabled == 1) {
                                //                     soapList.push(soap);
                                //                 }
                                //             }else{
                                //                 soapList.push(soap);
                                //             }
                                //         });
                                //     });
                                // }else{
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
        if(departmentIndex == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST){
            active_soap_latest = this.state.soapTrees.current_examination_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";
                } else {
                    active_soap_latest[key].class_name="";
                }
            });

            //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                active_soap_latest = this.state.soapTrees.current_examination_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    active_soap_latest[key].class_name="";
                });
            }
            soapList = [];

            var stateCurrentExaminationLatest = this.state.soapTrees.current_examination_latest;
            Object.keys(stateCurrentExaminationLatest).forEach(function(key){
                if (key == strDate) {
                    // soap_latest = allDateList[strDate];
                    soap_latest = stateCurrentExaminationLatest[strDate];
                    return false;
                }
            });

            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                stateCurrentSoapLatest = this.state.soapTrees.current_examination_latest;
                Object.keys(stateCurrentSoapLatest).forEach(function(key){
                    soap_latest.push(stateCurrentExaminationLatest[key]);
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
                // Object.keys(soap_latest).forEach(function(key){
                //     soap_latest[key].map((soap)=>{
                //         soap["openTag"] = 1;
                //         soap.class_name = "open";
                //         if (!showDelete) {
                //             if (soap.is_enabled == 1) {
                //                 soapList.push(soap);
                //             }
                //         }else{
                //             soapList.push(soap);
                //         }
                //     });
                // });
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

        if (nCategoryType === SOAP_TREE_CATEGORY.CURRENT_EXAMINATION) {
            this.setState({
                soapTrees: {
                    ...this.state.soapTrees,
                    current_examination: currentExamination,
                    current_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.current_examination_latest,
                },
                soapList: this.sortSoapList(soapList),
                categoryType: SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST,
            });
        }else{
            this.setState({
            soapTrees: {
                        ...this.state.soapTrees,
                    current_examination: currentExamination,
                    current_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.current_examination_latest,
            },
                soapList: this.sortSoapList(soapList),
                categoryType: departmentIndex,
                show_list_condition:show_list_condition === '' ?
                    '結果・報告(自科)('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15日'
                    :'結果・報告(自科)('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')'+show_list_condition,
        });
        }
    } else if(departmentIndex == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION || departmentIndex == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST){
        if(departmentIndex == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
        let globalExamination = this.state.soapTrees.global_examination.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            if (nCategoryType === SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION) {
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
        this.state.soapTrees.global_examination.map((item, index) => {
            if (index === yearIndex || yearIndex === -1) {
                item.data.map((monthItem, ind) => {
                    if (ind === monthIndex || monthIndex === -1) {
                        monthItem.data.map((data, ind2) => {
                            if (ind2 === dateIndex || dateIndex === -1) {
                                // if (nOpenTag) {
                                //     //date
                                //     var arrAllCategories = allDateList[data.date];
                                //     if (Object.keys(arrAllCategories).length < 1) {
                                //         return;
                                //     }
                                //     Object.keys(arrAllCategories).forEach(function(key){
                                //         arrAllCategories[key].map((soap)=>{
                                //             soap["openTag"] = 0;
                                //             soap.class_name = "open";
                                //             if (nOpenTag == true) {
                                //                 soap["openTag"] = 1;
                                //             }
                                //             if (!showDelete) {
                                //                 if (soap.is_enabled == 1) {
                                //                     soapList.push(soap);
                                //                 }
                                //             }else{
                                //                 soapList.push(soap);
                                //             }
                                //         });
                                //     });
                                // }else{
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
        if(departmentIndex == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST){
            active_soap_latest = this.state.soapTrees.global_examination_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";
                } else {
                    active_soap_latest[key].class_name="";
                }
            });

            //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                active_soap_latest = this.state.soapTrees.global_examination_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    active_soap_latest[key].class_name="";
                });
            }
            soapList = [];

            var stateGlobalExaminationLatest = this.state.soapTrees.global_examination_latest;
            Object.keys(stateGlobalExaminationLatest).forEach(function(key){
                if (key == strDate) {
                    // soap_latest = allDateList[strDate];
                    soap_latest = stateGlobalExaminationLatest[strDate];
                    return false;
                }
            });

            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                stateCurrentSoapLatest = this.state.soapTrees.global_examination_latest;
                Object.keys(stateCurrentSoapLatest).forEach(function(key){
                    soap_latest.push(stateGlobalExaminationLatest[key]);
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
                // Object.keys(soap_latest).forEach(function(key){
                //     soap_latest[key].map((soap)=>{
                //         soap["openTag"] = 1;
                //         soap.class_name = "open";
                //         if (!showDelete) {
                //             if (soap.is_enabled == 1) {
                //                 soapList.push(soap);
                //             }
                //         }else{
                //             soapList.push(soap);
                //         }
                //     });
                // });
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

        if (nCategoryType === SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION) {
            this.setState({
                soapTrees: {
                    ...this.state.soapTrees,
                    global_examination: globalExamination,
                    global_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.global_examination_latest,
                },
                soapList: this.sortSoapList(soapList),
                categoryType: SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST,
            });
        }else{
            this.setState({
                soapTrees: {
                            ...this.state.soapTrees,
                        global_examination: globalExamination,
                        global_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.global_examination_latest,
                },
                    soapList: this.sortSoapList(soapList),
                    categoryType: departmentIndex,
                    show_list_condition:show_list_condition === '' ?
                        '「結果・報告」(全科)('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15件'
                        :'「結果・報告」(全科)('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')'+show_list_condition,
            });
        }
    } else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION || departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST){
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
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
                                // if (nOpenTag) {
                                //     //date
                                //     var arrAllCategories = allDateList[data.date];
                                //     if (Object.keys(arrAllCategories).length < 1) {
                                //         return;
                                //     }
                                //     Object.keys(arrAllCategories).forEach(function(key){
                                //         arrAllCategories[key].map((soap)=>{
                                //             soap["openTag"] = 0;
                                //             soap.class_name = "open";
                                //             if (nOpenTag == true) {
                                //                 soap["openTag"] = 1;
                                //             }
                                //             if (!showDelete) {
                                //                 if (soap.is_enabled == 1) {
                                //                     soapList.push(soap);
                                //                 }
                                //             }else{
                                //                 soapList.push(soap);
                                //             }
                                //         });
                                //     });
                                // }else{
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
                    // soap_latest = allDateList[strDate];
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
                // Object.keys(soap_latest).forEach(function(key){
                //     soap_latest[key].map((soap)=>{
                //         soap["openTag"] = 1;
                //         soap.class_name = "open";
                //         if (!showDelete) {
                //             if (soap.is_enabled == 1) {
                //                 soapList.push(soap);
                //             }
                //         }else{
                //             soapList.push(soap);
                //         }
                //     });
                // });
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
                soapList: this.sortSoapList(soapList),
                categoryType: SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST,
            });
        }else{
            this.setState({
            soapTrees: {
                        ...this.state.soapTrees,
                    all_examination: allExamination,
                    all_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.all_examination_latest,
            },
                soapList: this.sortSoapList(soapList),
                categoryType: departmentIndex,
                show_list_condition:show_list_condition === '' ?
                    '検査('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15件'
                    :'検査('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')'+show_list_condition,
        });
        }
    } else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_INSPECTION || departmentIndex == SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST){
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_INSPECTION){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
        let allInspection = this.state.soapTrees.all_inspection.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            if (nCategoryType === SOAP_TREE_CATEGORY.ALL_INSPECTION) {
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
        this.state.soapTrees.all_inspection.map((item, index) => {
            if (index === yearIndex || yearIndex === -1) {
                item.data.map((monthItem, ind) => {
                    if (ind === monthIndex || monthIndex === -1) {
                        monthItem.data.map((data, ind2) => {
                            if (ind2 === dateIndex || dateIndex === -1) {
                                // if (nOpenTag) {
                                //     //date
                                //     var arrAllCategories = allDateList[data.date];
                                //     if (Object.keys(arrAllCategories).length < 1) {
                                //         return;
                                //     }
                                //     Object.keys(arrAllCategories).forEach(function(key){
                                //         arrAllCategories[key].map((soap)=>{
                                //             soap["openTag"] = 0;
                                //             soap.class_name = "open";
                                //             if (nOpenTag == true) {
                                //                 soap["openTag"] = 1;
                                //             }
                                //             if (!showDelete) {
                                //                 if (soap.is_enabled == 1) {
                                //                     soapList.push(soap);
                                //                 }
                                //             }else{
                                //                 soapList.push(soap);
                                //             }
                                //         });
                                //     });
                                // }else{
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
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST){
            active_soap_latest = this.state.soapTrees.all_inspection_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";
                } else {
                    active_soap_latest[key].class_name="";
                }
            });


            //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                active_soap_latest = this.state.soapTrees.all_inspection_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    active_soap_latest[key].class_name="";
                });
            }
            soapList = [];

            var stateAllInspectionLatest = this.state.soapTrees.all_inspection_latest;
            Object.keys(stateAllInspectionLatest).forEach(function(key){
                if (key == strDate) {
                    // soap_latest = allDateList[strDate];
                    soap_latest = stateAllInspectionLatest[strDate];
                    return false;
                }
            });

            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                stateCurrentSoapLatest = this.state.soapTrees.all_inspection_latest;
                Object.keys(stateCurrentSoapLatest).forEach(function(key){
                    soap_latest.push(stateAllInspectionLatest[key]);
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
                // Object.keys(soap_latest).forEach(function(key){
                //     soap_latest[key].map((soap)=>{
                //         soap["openTag"] = 1;
                //         soap.class_name = "open";
                //         if (!showDelete) {
                //             if (soap.is_enabled == 1) {
                //                 soapList.push(soap);
                //             }
                //         }else{
                //             soapList.push(soap);
                //         }
                //     });
                // });
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

        if (nCategoryType === SOAP_TREE_CATEGORY.ALL_INSPECTION) {
            this.setState({
                soapTrees: {
                    ...this.state.soapTrees,
                    all_inspection: allInspection,
                    all_inspection_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST?active_soap_latest:this.state.soapTrees.all_inspection_latest,
                },
                soapList: this.sortSoapList(soapList),
                categoryType: SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST,
            });
        }else{
            this.setState({
            soapTrees: {
                        ...this.state.soapTrees,
                    all_inspection: allInspection,
                    all_inspection_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST?active_soap_latest:this.state.soapTrees.all_inspection_latest,
            },
                soapList: this.sortSoapList(soapList),
                categoryType: departmentIndex,
                show_list_condition:show_list_condition === '' ?
                    '検査('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15件'
                    :'検査('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')'+show_list_condition,
        });
        }
    } else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_TREATMENT || departmentIndex == SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST){
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_TREATMENT){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
        let allTreatment = this.state.soapTrees.all_treatment.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            if (nCategoryType === SOAP_TREE_CATEGORY.ALL_TREATMENT) {
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
        this.state.soapTrees.all_treatment.map((item, index) => {
            if (index === yearIndex || yearIndex === -1) {
                item.data.map((monthItem, ind) => {
                    if (ind === monthIndex || monthIndex === -1) {
                        monthItem.data.map((data, ind2) => {
                            if (ind2 === dateIndex || dateIndex === -1) {
                                // if (nOpenTag) {
                                //     //date
                                //     var arrAllCategories = allDateList[data.date];
                                //     if (Object.keys(arrAllCategories).length < 1) {
                                //         return;
                                //     }
                                //     Object.keys(arrAllCategories).forEach(function(key){
                                //         arrAllCategories[key].map((soap)=>{
                                //             soap["openTag"] = 0;
                                //             soap.class_name = "open";
                                //             if (nOpenTag == true) {
                                //                 soap["openTag"] = 1;
                                //             }
                                //             if (!showDelete) {
                                //                 if (soap.is_enabled == 1) {
                                //                     soapList.push(soap);
                                //                 }
                                //             }else{
                                //                 soapList.push(soap);
                                //             }
                                //         });
                                //     });
                                // }else{
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
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST){
            active_soap_latest = this.state.soapTrees.all_treatment_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";
                } else {
                    active_soap_latest[key].class_name="";
                }
            });

            //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                active_soap_latest = this.state.soapTrees.all_treatment_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    active_soap_latest[key].class_name="";
                });
            }
            soapList = [];

            var stateAllTreatmentLatest = this.state.soapTrees.all_treatment_latest;
            Object.keys(stateAllTreatmentLatest).forEach(function(key){
                if (key == strDate) {
                    // soap_latest = allDateList[strDate];
                    soap_latest = stateAllTreatmentLatest[strDate];
                    return false;
                }
            });

            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                stateCurrentSoapLatest = this.state.soapTrees.all_treatment_latest;
                Object.keys(stateCurrentSoapLatest).forEach(function(key){
                    soap_latest.push(stateAllTreatmentLatest[key]);
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
                // Object.keys(soap_latest).forEach(function(key){
                //     soap_latest[key].map((soap)=>{
                //         soap["openTag"] = 1;
                //         soap.class_name = "open";
                //         if (!showDelete) {
                //             if (soap.is_enabled == 1) {
                //                 soapList.push(soap);
                //             }
                //         }else{
                //             soapList.push(soap);
                //         }
                //     });
                // });
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

        if (nCategoryType === SOAP_TREE_CATEGORY.ALL_TREATMENT) {
            this.setState({
                soapTrees: {
                    ...this.state.soapTrees,
                    all_treatment: allTreatment,
                    all_treatment_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST?active_soap_latest:this.state.soapTrees.all_treatment_latest,
                },
                soapList: this.sortSoapList(soapList),
                categoryType: SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST,
            });
        }else{
            this.setState({
            soapTrees: {
                        ...this.state.soapTrees,
                    all_treatment: allTreatment,
                    all_treatment_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST?active_soap_latest:this.state.soapTrees.all_treatment_latest,
            },
                soapList: this.sortSoapList(soapList),
                categoryType: departmentIndex,
                show_list_condition:show_list_condition === ''?
                    '処置('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15件'
                    :'処置('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')'+show_list_condition,
        });
        }
    }
    // else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_HOSPITAL_ORDER){
    //     let allHospital =Object.keys(this.state.soapTrees.all_hospital).map((hospital_date, index) => {
    //         var item = this.state.soapTrees.all_hospital[hospital_date];
    //         item.class_name = "";
    //         if (index === yearIndex) {
    //             item.class_name = "open";
    //         }
    //         if (nCategoryType === SOAP_TREE_CATEGORY.ALL_HOSPITAL_ORDER) {
    //             item.class_name = "";
    //         }
    //         item = Object.keys(item).map((date, sub_index) => {
    //             var sub_item = item[date];
    //             sub_item =  sub_item.data.map((data, final_index) => {
    //                 data.class_name = '';
    //                 if (sub_index == monthIndex && final_index == dateIndex){
    //                     data.class_name = 'open'
    //                 }
    //                 return data;
    //             })
    //             return sub_item;
    //         })            
    //         return item;
    //     })
    
        // soapList = [];
        // this.state.soapTrees.all_hospital.map((item, index) => {
        //     if (index === yearIndex || yearIndex === -1) {
        //         item.data.map((monthItem, ind) => {
        //             if (ind === monthIndex || monthIndex === -1) {
        //                 monthItem.data.map((data, ind2) => {
        //                     if (ind2 === dateIndex || dateIndex === -1) {                                
        //                         data.data.map((soap) => {
        //                             soap["openTag"] = 1;
        //                             soap.class_name="open";
        //                             if (nIdx > 2) {
        //                                 soap.class_name="";
        //                             }
        //                             nIdx ++;
        //                             if (nOpenTag == true) {
        //                                 soap["openTag"] = 1;
        //                             }
        //                             if (!showDelete) {
        //                                 if (soap.is_enabled == 1) {
        //                                     soapList.push(soap);
        //                                 }
        //                             }else{
        //                                 soapList.push(soap);
        //                             }
        //                         });                            
        //                     }
        //                 })
        //             }
        //         })
        //     }
        // })
    //     this.setState({
    //         soapTrees: {
    //             ...this.state.soapTrees,
    //             all_hospital: allHospital,
    //             categoryType:SOAP_TREE_CATEGORY.ALL_HOSPITAL_ORDER,
    //         },
    //     })
    // }
    else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_REHABILY || departmentIndex == SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST){
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_REHABILY){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
        let allRehabily = this.state.soapTrees.all_rehabily.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            if (nCategoryType === SOAP_TREE_CATEGORY.ALL_REHABILY) {
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
        this.state.soapTrees.all_rehabily.map((item, index) => {
            if (index === yearIndex || yearIndex === -1) {
                item.data.map((monthItem, ind) => {
                    if (ind === monthIndex || monthIndex === -1) {
                        monthItem.data.map((data, ind2) => {
                            if (ind2 === dateIndex || dateIndex === -1) {
                                // if (nOpenTag) {
                                //     //date
                                //     var arrAllCategories = allDateList[data.date];
                                //     if (Object.keys(arrAllCategories).length < 1) {
                                //         return;
                                //     }
                                //     Object.keys(arrAllCategories).forEach(function(key){
                                //         arrAllCategories[key].map((soap)=>{
                                //             soap["openTag"] = 0;
                                //             soap.class_name = "open";
                                //             if (nOpenTag == true) {
                                //                 soap["openTag"] = 1;
                                //             }
                                //             if (!showDelete) {
                                //                 if (soap.is_enabled == 1) {
                                //                     soapList.push(soap);
                                //                 }
                                //             }else{
                                //                 soapList.push(soap);
                                //             }
                                //         });
                                //     });
                                // }else{
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
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST){
            active_soap_latest = this.state.soapTrees.all_rehabily_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";
                } else {
                    active_soap_latest[key].class_name="";
                }
            });

            //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                active_soap_latest = this.state.soapTrees.all_rehabily_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    active_soap_latest[key].class_name="";
                });
            }
            soapList = [];

            var stateAllRehabilyLatest = this.state.soapTrees.all_rehabily_latest;
            Object.keys(stateAllRehabilyLatest).forEach(function(key){
                if (key == strDate) {
                    // soap_latest = allDateList[strDate];
                    soap_latest = stateAllRehabilyLatest[strDate];
                    return false;
                }
            });

            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                stateCurrentSoapLatest = this.state.soapTrees.all_rehabily_latest;
                Object.keys(stateCurrentSoapLatest).forEach(function(key){
                    soap_latest.push(stateAllRehabilyLatest[key]);
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
                // Object.keys(soap_latest).forEach(function(key){
                //     soap_latest[key].map((soap)=>{
                //         soap["openTag"] = 1;
                //         soap.class_name = "open";
                //         if (!showDelete) {
                //             if (soap.is_enabled == 1) {
                //                 soapList.push(soap);
                //             }
                //         }else{
                //             soapList.push(soap);
                //         }
                //     });
                // });
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

        if (nCategoryType === SOAP_TREE_CATEGORY.ALL_REHABILY) {
            this.setState({
                soapTrees: {
                    ...this.state.soapTrees,
                    all_rehabily: allRehabily,
                    all_rehabily_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST?active_soap_latest:this.state.soapTrees.all_rehabily_latest,
                },
                soapList: this.sortSoapList(soapList),
                categoryType: SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST,
            });
        }else{
            this.setState({
            soapTrees: {
                        ...this.state.soapTrees,
                    all_rehabily: allRehabily,
                    all_rehabily_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST?active_soap_latest:this.state.soapTrees.all_rehabily_latest,
            },
                soapList: this.sortSoapList(soapList),
                categoryType: departmentIndex,
                show_list_condition:show_list_condition === '' ?
                    'リハビリ('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15件'
                    :'リハビリ('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')'+show_list_condition,
        });
        }
    } else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_RADIATION || departmentIndex == SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST){ //-----------------放射線-----------------------
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_RADIATION){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
        let allRadiation = this.state.soapTrees.all_radiation.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            if (nCategoryType === SOAP_TREE_CATEGORY.ALL_RADIATION) {
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
        this.state.soapTrees.all_radiation.map((item, index) => {
            if (index === yearIndex || yearIndex === -1) {
                item.data.map((monthItem, ind) => {
                    if (ind === monthIndex || monthIndex === -1) {
                        monthItem.data.map((data, ind2) => {
                            if (ind2 === dateIndex || dateIndex === -1) {
                                // if (nOpenTag) {
                                //     //date
                                //     var arrAllCategories = allDateList[data.date];
                                //     if (Object.keys(arrAllCategories).length < 1) {
                                //         return;
                                //     }
                                //     Object.keys(arrAllCategories).forEach(function(key){
                                //         arrAllCategories[key].map((soap)=>{
                                //             soap["openTag"] = 0;
                                //             soap.class_name = "open";
                                //             if (nOpenTag == true) {
                                //                 soap["openTag"] = 1;
                                //             }
                                //             if (!showDelete) {
                                //                 if (soap.is_enabled == 1) {
                                //                     soapList.push(soap);
                                //                 }
                                //             }else{
                                //                 soapList.push(soap);
                                //             }
                                //         });
                                //     });
                                // }else{
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
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST){
            active_soap_latest = this.state.soapTrees.all_radiation_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";
                } else {
                    active_soap_latest[key].class_name="";
                }
            });

            //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                active_soap_latest = this.state.soapTrees.all_radiation_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    active_soap_latest[key].class_name="";
                });
            }
            soapList = [];

            var stateAllRadiationLatest = this.state.soapTrees.all_radiation_latest;
            Object.keys(stateAllRadiationLatest).forEach(function(key){
                if (key == strDate) {
                    // soap_latest = allDateList[strDate];
                    soap_latest = stateAllRadiationLatest[strDate];
                    return false;
                }
            });

            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                stateCurrentSoapLatest = this.state.soapTrees.all_radiation_latest;
                Object.keys(stateCurrentSoapLatest).forEach(function(key){
                    soap_latest.push(stateAllRadiationLatest[key]);
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
                // Object.keys(soap_latest).forEach(function(key){
                //     soap_latest[key].map((soap)=>{
                //         soap["openTag"] = 1;
                //         soap.class_name = "open";
                //         if (!showDelete) {
                //             if (soap.is_enabled == 1) {
                //                 soapList.push(soap);
                //             }
                //         }else{
                //             soapList.push(soap);
                //         }
                //     });
                // });
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

        if (nCategoryType === SOAP_TREE_CATEGORY.ALL_RADIATION) {
            this.setState({
                soapTrees: {
                    ...this.state.soapTrees,
                    all_radiation: allRadiation,
                    all_radiation_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST?active_soap_latest:this.state.soapTrees.all_radiation_latest,
                },
                soapList: this.sortSoapList(soapList),
                categoryType: SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST,
            });
        }else{
            this.setState({
            soapTrees: {
                        ...this.state.soapTrees,
                    all_radiation: allRadiation,
                    all_radiation_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST?active_soap_latest:this.state.soapTrees.all_radiation_latest,
            },
                soapList: this.sortSoapList(soapList),
                categoryType: departmentIndex,
                show_list_condition:show_list_condition === '' ?
                    '放射線('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15件'
                    :'放射線('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')'+show_list_condition,
        });
        }
    } else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_TAG || departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST){ //-----------------放射線-----------------------
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_TAG){
            show_list_condition = getSelectedDate(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
        }
        let allSoapTag = this.state.soapTrees.all_soap_tag.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            if (nCategoryType === SOAP_TREE_CATEGORY.ALL_SOAP_TAG) {
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
        this.state.soapTrees.all_soap_tag.map((item, index) => {
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
                            }
                        })
                    }
                })
            }
        })
        if(departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST){
            active_soap_latest = this.state.soapTrees.all_soap_tag_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";
                } else {
                    active_soap_latest[key].class_name="";
                }
            });

            //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                active_soap_latest = this.state.soapTrees.all_soap_tag_latest;
                 Object.keys(active_soap_latest).forEach(function(key){
                    active_soap_latest[key].class_name="";
                });
            }
            soapList = [];

            let stateAllSoapTagLatest = this.state.soapTrees.all_soap_tag_latest;
            Object.keys(stateAllSoapTagLatest).forEach(function(key){
                if (key == strDate) {
                    soap_latest = stateAllSoapTagLatest[strDate];
                    return false;
                }
            });

            if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
                stateCurrentSoapLatest = this.state.soapTrees.all_soap_tag_latest;
                Object.keys(stateCurrentSoapLatest).forEach(function(key){
                    soap_latest.push(stateAllSoapTagLatest[key]);
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

        if (nCategoryType === SOAP_TREE_CATEGORY.ALL_SOAP_TAG) {
            this.setState({
                soapTrees: {
                    ...this.state.soapTrees,
                    all_soap_tag: allSoapTag,
                    all_soap_tag_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST ? active_soap_latest : this.state.soapTrees.all_soap_tag_latest,
                },
                soapList: this.sortSoapList(soapList),
                categoryType: SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST,
            });
        }else{
            this.setState({
            soapTrees: {
                        ...this.state.soapTrees,
                    all_soap_tag: allSoapTag,
                    all_soap_tag_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST ? active_soap_latest : this.state.soapTrees.all_soap_tag_latest,
            },
                soapList: this.sortSoapList(soapList),
                categoryType: departmentIndex,
                show_list_condition:show_list_condition === '' ?
                    '付箋ツリー('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')最新15件'
                    :'付箋ツリー('+ (this.context.department.name !== "" ? this.context.department.name : "内科") +')'+show_list_condition,
        });
        }
    }
  }

  function getSelectedDate(soapTree_data, yearIndex, monthIndex, dateIndex) {
      // select month
      if(dateIndex == -1 && monthIndex != -1){
          let month = soapTree_data[yearIndex]['data'][monthIndex].month;
          return month.split("-")[0]+'/'+month.split("-")[1];
      }

      // select year
      if(dateIndex == -1 && monthIndex == -1 && yearIndex != -1){
          return soapTree_data[yearIndex].year.toString();
      }
      let date = soapTree_data[yearIndex]['data'][monthIndex]['data'][dateIndex]['date'];
      let week_name = getWeekName(parseInt(date.split("-")[0]), parseInt(date.split("-")[1]), parseInt(date.split("-")[2]));
      return date.split("-")[0]+'/'+date.split("-")[1]+'/'+date.split("-")[2]+'('+week_name+'曜日)';
  }
