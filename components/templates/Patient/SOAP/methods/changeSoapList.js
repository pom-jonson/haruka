import { SOAP_TREE_CATEGORY } from "~/helpers/constants";
import {getWeekName} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";

export default async function(departmentIndex, yearIndex = -1, monthIndex = -1, dateIndex = -1, nCategoryType = -1, number = null) {
  let show_list_condition = {condition:'', date:''};
  let cur_selected_date = '';
  if(yearIndex > 0 && monthIndex > 0 && dateIndex > 0){
    let week_name = getWeekName(parseInt(yearIndex), parseInt(monthIndex), parseInt(dateIndex));
    show_list_condition.condition = yearIndex+'/'+monthIndex+'/'+dateIndex+'('+week_name+'曜日)';
    show_list_condition.date = yearIndex+'/'+monthIndex+'/'+dateIndex;
    cur_selected_date = yearIndex+'-'+monthIndex+'-'+dateIndex;
  }
  let showDelete = false;
  if(this.context.$canDoAction(this.context.FEATURES.SOAP, this.context.AUTHS.SHOW_DELETE)){
    showDelete = true;
  }
  let nOpenTag = true;
  if(dateIndex == -1) {
    nOpenTag = false;
  }
  let soapList = this.state.soapList;
  var strDate = yearIndex+"-"+monthIndex+"-"+dateIndex;
  var soap_latest = [];
  var active_soap_latest = [];
  let allDateList = this.state.allDateList;
  let nIdx = 0; // first 3 open index
  let cur_department_code = this.context.department.code;
  let state_data = {};
  state_data = {
    selYear: yearIndex,
    selMonth: monthIndex,
    selDay: dateIndex
  };
  let cur_department_name = this.context.department.name == "" ? "内科" : this.context.department.name;
  if(departmentIndex == SOAP_TREE_CATEGORY.CURRENT_SOAP || departmentIndex == SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST){
    if(departmentIndex == SOAP_TREE_CATEGORY.CURRENT_SOAP){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.current_soap, yearIndex, monthIndex, dateIndex);
    }
    let current_soap = this.state.soapTrees.current_soap.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
          } else {
            data.class_name = "";
          }
          return data;
        });
        return monthItem;
      });
      return item;
    });
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
                } else{
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
    });
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
    }
    if (nCategoryType === SOAP_TREE_CATEGORY.CURRENT_SOAP) {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        current_soap: current_soap,
        current_soap_latest: departmentIndex == SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST?active_soap_latest:this.state.soapTrees.current_soap_latest,
      };
      state_data['soapList'] = this.sortSoapList(soapList);
      state_data.categoryType = SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST;
    } else{
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        current_soap: current_soap,
        current_soap_latest: departmentIndex == SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST?active_soap_latest:this.state.soapTrees.current_soap_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? '自科カルテ('+ cur_department_name +')最新15日' : '自科カルテ('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP || departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_LATEST){
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.all_soap, yearIndex, monthIndex, dateIndex);
    }
    let allSoap = this.state.soapTrees.all_soap.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
          }
          return data;
        })
        return monthItem;
      })
      return item;
    });
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
                } else {
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
            });
          }
        })
      }
    });
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
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_soap: allSoap,
        all_soap_latest: departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_LATEST?active_soap_latest:this.state.soapTrees.all_soap_latest,
      };
      state_data['soapList'] = this.sortSoapList(soapList);
      state_data['categoryType'] = SOAP_TREE_CATEGORY.ALL_SOAP_LATEST;
    } else {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_soap: allSoap,
        all_soap_latest: departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_LATEST?active_soap_latest:this.state.soapTrees.all_soap_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? '全科カルテ最新15日' : '全科カルテ'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_PROGRESS || departmentIndex == SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST){
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_PROGRESS){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.all_progress, yearIndex, monthIndex, dateIndex);
    }
    let allProgress = this.state.soapTrees.all_progress.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
          }
          return data;
        })
        return monthItem;
      })
      return item;
    })
    soapList = [];
    this.state.soapTrees.all_progress.map((item, index) => {
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
    
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST){
      active_soap_latest = this.state.soapTrees.all_progress_latest;
      Object.keys(active_soap_latest).forEach(function(key){
        if (key == strDate) {
          active_soap_latest[key].class_name="open";
        } else {
          active_soap_latest[key].class_name="";
        }
      });
      //------------- 全科カルテ最新15日 open tree and show 15day's data--------------------------//
      if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
        active_soap_latest = this.state.soapTrees.all_progress_latest;
        Object.keys(active_soap_latest).forEach(function(key){
          active_soap_latest[key].class_name="";
        });
      }
      soapList = [];
      var stateAllProgressLatest = this.state.soapTrees.all_progress_latest;
      Object.keys(stateAllProgressLatest).forEach(function(key){
        if (key == strDate) {
          soap_latest = stateAllProgressLatest[strDate];
          return false;
        }
      });
      if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
        stateCurrentSoapLatest = this.state.soapTrees.all_progress_latest;
        Object.keys(stateCurrentSoapLatest).forEach(function(key){
          soap_latest.push(stateAllProgressLatest[key]);
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
    if (nCategoryType === SOAP_TREE_CATEGORY.ALL_PROGRESS) {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_progress: allProgress,
        all_progress_latest: departmentIndex == SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST?active_soap_latest:this.state.soapTrees.all_progress_latest,
      };
      state_data['soapList'] = this.sortSoapList(soapList);
      state_data['categoryType'] = SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST;
    } else {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_progress: allProgress,
        all_progress_latest: departmentIndex == SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST?active_soap_latest:this.state.soapTrees.all_progress_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? 'オーダー('+ cur_department_name +')最新15日' :'オーダー('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER || departmentIndex == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST){
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.all_execute_order, yearIndex, monthIndex, dateIndex);
    }
    let allExecuteOrder = this.state.soapTrees.all_execute_order.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
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
          soap_latest = stateAllExecuteOrderLatest[strDate];
          return false;
        }
      });
      if (yearIndex == -1 && monthIndex == -1 && dateIndex == -1) {
        stateCurrentSoapLatest = this.state.soapTrees.all_execute_order_latest;
        Object.keys(stateCurrentSoapLatest).forEach(function(key){
          soap_latest.push(stateAllExecuteOrderLatest[key]);
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
    if (nCategoryType === SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER) {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_execute_order: allExecuteOrder,
        all_execute_order_latest: departmentIndex == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST?active_soap_latest:this.state.soapTrees.all_execute_order_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST;
    } else {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_execute_order: allExecuteOrder,
        all_execute_order_latest: departmentIndex == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST?active_soap_latest:this.state.soapTrees.all_execute_order_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? 'オーダー('+ cur_department_name +')最新15日' :'オーダー('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER || departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST){
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.all_order, yearIndex, monthIndex, dateIndex);
    }
    let allOrder = this.state.soapTrees.all_order.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
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
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_order: allOrder,
        all_order_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST?active_soap_latest:this.state.soapTrees.all_order_latest
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = SOAP_TREE_CATEGORY.ALL_ORDER_LATEST;
    } else {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_order: allOrder,
        all_order_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST?active_soap_latest:this.state.soapTrees.all_order_latest
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? '処方・注射('+ cur_department_name +')最新15日' : '処方・注射('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION || departmentIndex == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST){
    if(departmentIndex == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.current_examination, yearIndex, monthIndex, dateIndex);
      cur_selected_date = getCurSelectedDate(this.state.soapTrees.current_examination, yearIndex, monthIndex, dateIndex);
    }
    let currentExamination = this.state.soapTrees.current_examination.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
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
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        current_examination: currentExamination,
        current_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.current_examination_latest,
      };
      state_data['soapList'] = this.sortSoapList(soapList);
      state_data['categoryType'] = SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST;
    } else {
      if(cur_selected_date !== ''){
        let res_data = changeReadStatus(soapList, allDateList, cur_selected_date, number);
        soapList = res_data['soapList'];
        allDateList = res_data['allDateList'];
      }
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        current_examination: currentExamination,
        current_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.current_examination_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.allDateList = allDateList;
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? '結果・報告(自科)('+ cur_department_name +')最新15日' : '結果・報告(自科)('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION || departmentIndex == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST){
    if(departmentIndex == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.global_examination, yearIndex, monthIndex, dateIndex);
      cur_selected_date = getCurSelectedDate(this.state.soapTrees.global_examination, yearIndex, monthIndex, dateIndex);
    }
    let globalExamination = this.state.soapTrees.global_examination.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
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
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        global_examination: globalExamination,
        global_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.global_examination_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST;
    } else {
      if(cur_selected_date !== ''){
        let res_data = changeReadStatus(soapList, allDateList, cur_selected_date, number);
        soapList = res_data.soapList;
        allDateList = res_data.allDateList;
      }
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        global_examination: globalExamination,
        global_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.global_examination_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.allDateList = allDateList;
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? '「結果・報告」(全科)('+ cur_department_name +')最新15日' : '「結果・報告」(全科)('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION || departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST){
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.all_examination, yearIndex, monthIndex, dateIndex);
    }
    let allExamination = this.state.soapTrees.all_examination.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
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
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_examination: allExamination,
        all_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.all_examination_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST;
    } else {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_examination: allExamination,
        all_examination_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST?active_soap_latest:this.state.soapTrees.all_examination_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? '検査('+ cur_department_name +')最新15日' : '検査('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_INSPECTION || departmentIndex == SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST){
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_INSPECTION){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.all_inspection, yearIndex, monthIndex, dateIndex);
    }
    let allInspection = this.state.soapTrees.all_inspection.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
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
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_inspection: allInspection,
        all_inspection_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST?active_soap_latest:this.state.soapTrees.all_inspection_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST;
    } else {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_inspection: allInspection,
        all_inspection_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST?active_soap_latest:this.state.soapTrees.all_inspection_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? '検査('+ cur_department_name +')最新15日' : '検査('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_TREATMENT || departmentIndex == SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST){
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_TREATMENT){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.all_treatment, yearIndex, monthIndex, dateIndex);
    }
    let allTreatment = this.state.soapTrees.all_treatment.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
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
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_treatment: allTreatment,
        all_treatment_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST?active_soap_latest:this.state.soapTrees.all_treatment_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST;
    } else {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_treatment: allTreatment,
        all_treatment_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST?active_soap_latest:this.state.soapTrees.all_treatment_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? '処置('+ cur_department_name +')最新15日' : '処置('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_REHABILY || departmentIndex == SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST){
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_REHABILY){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.all_rehabily, yearIndex, monthIndex, dateIndex);
    }
    let allRehabily = this.state.soapTrees.all_rehabily.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
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
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_rehabily: allRehabily,
        all_rehabily_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST?active_soap_latest:this.state.soapTrees.all_rehabily_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST;
    } else {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_rehabily: allRehabily,
        all_rehabily_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST?active_soap_latest:this.state.soapTrees.all_rehabily_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? 'リハビリ('+ cur_department_name +')最新15日' : 'リハビリ('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_RADIATION || departmentIndex == SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST){ //-----------------放射線-----------------------
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_RADIATION){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.all_radiation, yearIndex, monthIndex, dateIndex);
    }
    let allRadiation = this.state.soapTrees.all_radiation.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
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
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_radiation: allRadiation,
        all_radiation_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST?active_soap_latest:this.state.soapTrees.all_radiation_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST;
    } else {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_radiation: allRadiation,
        all_radiation_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST?active_soap_latest:this.state.soapTrees.all_radiation_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? '放射線('+ cur_department_name +')最新15日' : '放射線('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_TAG || departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST){ //-----------------放射線-----------------------
    if(departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_TAG){
      show_list_condition = getSelectedDateTree(this.state.soapTrees.all_soap_tag, yearIndex, monthIndex, dateIndex);
    }
    let allSoapTag = this.state.soapTrees.all_soap_tag.map((item, index) => {
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.data = item.data.map((monthItem, ind) => {
        if (ind === monthIndex && index === yearIndex) {
          if(monthItem.class_name == "open" && dateIndex == -1){
            monthItem.class_name = "";
          } else {
            monthItem.class_name = "open";
          }
        }
        monthItem.data = monthItem.data.map((data, ind2) => {
          data.class_name = "";
          if (ind2 === dateIndex && ind === monthIndex && index === yearIndex) {
            data.class_name = "open";
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
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_soap_tag: allSoapTag,
        all_soap_tag_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST ? active_soap_latest : this.state.soapTrees.all_soap_tag_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST;
    } else {
      state_data['soapTrees'] = {
        ...this.state.soapTrees,
        all_soap_tag: allSoapTag,
        all_soap_tag_latest:departmentIndex == SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST ? active_soap_latest : this.state.soapTrees.all_soap_tag_latest,
      };
      state_data.soapList = this.sortSoapList(soapList);
      state_data.categoryType = departmentIndex;
      show_list_condition.condition = show_list_condition.condition === '' ? '付箋ツリー('+ cur_department_name +')最新15日' : '付箋ツリー('+ cur_department_name +')'+show_list_condition.condition;
      state_data.show_list_condition = show_list_condition;
    }
  }
  else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_HOSPITAL_ORDER){
    var allHospital = this.state.soapTrees.all_hospital;
    Object.keys(allHospital).map((hospital_date, index) => {
      var item = allHospital[hospital_date];
      if (index === yearIndex) {
        if(item.class_name == "open" && monthIndex == -1 && dateIndex == -1){
          item.class_name = "";
        } else {
          item.class_name = "open";
        }
      }
      item.map((sub_item, sub_index) => {
        sub_item.class_name = '';
        if (sub_index == monthIndex){
          sub_item.class_name = 'open';
        }
      })
    })
    
    soapList = [];
    Object.keys(this.state.soapTrees.all_hospital).map((hospital_date, index) => {
      var item = this.state.soapTrees.all_hospital[hospital_date];
      if (index === yearIndex || yearIndex === -1) {
        item.map((sub_item, sub_index) => {
          if (sub_index === monthIndex || monthIndex === -1) {
            sub_item['openTag'] = 1;
            sub_item.class_name="open";
            sub_item.data.map((data) => {
              if (!showDelete) {
                if (data.is_enabled == 1) {
                  soapList.push(data);
                }
              } else {
                soapList.push(data);
              }
            })
          }
        })
      }
    })
    state_data['soapTrees'] = {
      ...this.state.soapTrees,
      all_hospital: allHospital,
    };
    state_data.soapList = this.sortSoapList(soapList);
    state_data.categoryType = SOAP_TREE_CATEGORY.ALL_HOSPITAL_ORDER;
  }
  
  this.leftBoxRef.current.setChangeSoapData(
    state_data.selYear, state_data.selMonth, state_data.selDay, state_data.soapTrees,
    (state_data.allDateList === undefined ? this.state.allDateList : state_data.allDateList),
    state_data.categoryType
  );
  this.middleRef.current.setChangeSoapData(
    state_data.selYear, state_data.selMonth, state_data.selDay, state_data.soapTrees, state_data.soapList,
    (state_data.allDateList === undefined ? this.state.allDateList : state_data.allDateList),
    state_data.categoryType, state_data.show_list_condition
  );
  this.rightRef.current.setAllKarteData(state_data.soapList);
  this.changeSoapListFlag = true;
  this.setState(state_data);
}

function getSelectedDateTree(soapTree_data, yearIndex, monthIndex, dateIndex) {
  let ret_data = {condition:'', date:''};
  // select month
  if(dateIndex == -1 && monthIndex != -1){
    let month = soapTree_data[yearIndex]['data'][monthIndex].month;
    ret_data.condition = month.split("-")[0]+'/'+month.split("-")[1];
    return ret_data;
  }
  // select year
  if(dateIndex == -1 && monthIndex == -1 && yearIndex != -1){
    ret_data.condition = soapTree_data[yearIndex].year.toString();
    return ret_data;
  }
  let date = soapTree_data[yearIndex]['data'][monthIndex]['data'][dateIndex]['date'];
  let week_name = getWeekName(parseInt(date.split("-")[0]), parseInt(date.split("-")[1]), parseInt(date.split("-")[2]));
  ret_data.condition = date.split("-").join('/')+'('+week_name+'曜日)';
  ret_data.date = date.split("-").join('/');
  return ret_data;
}

function getCurSelectedDate(soapTree_data, yearIndex, monthIndex, dateIndex) {
  // select month
  if(dateIndex == -1 && monthIndex != -1){
    return "";
  }
  // select year
  if(dateIndex == -1 && monthIndex == -1 && yearIndex != -1){
    return "";
  }
  return soapTree_data[yearIndex]['data'][monthIndex]['data'][dateIndex]['date'];
}

function changeReadStatus(soapList, allDateList, cur_selected_date, number=null) {
  let res_data = {soapList, allDateList};
  if (number== null) return res_data;
  let karte_numbers = [];
  soapList.map((item, index)=>{
    if(item.read_flag === 0){
      karte_numbers.push(item.number);
      soapList[index]['read_flag'] = 1;
    }
  });
  res_data['soapList'] = soapList;
  if(karte_numbers.length > 0){
    let exam_data = allDateList[cur_selected_date];
    Object.keys(exam_data).map(target_table=>{
      Object.keys(exam_data[target_table]).map(index=>{
        if(exam_data[target_table][index]['number'] == number && karte_numbers.includes(exam_data[target_table][index]['number'])) {
          allDateList[cur_selected_date][target_table][index]['read_flag'] = 1;
        }
      });
    });
    changeReadStatusDB(karte_numbers);
    res_data['allDateList'] = allDateList;
    return res_data;
  }
  return res_data;
}

async function changeReadStatusDB(karte_numbers) {
  let path = "/app/api/v2/karte/tree/changeReadStatus";
  await apiClient._post(
    path,
    {karte_numbers,})
    .then(() => {
    })
    .catch(() => {
    });
}
