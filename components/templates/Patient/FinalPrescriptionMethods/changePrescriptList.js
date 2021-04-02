import { SOAP_TREE_CATEGORY } from "~/helpers/constants";

export default function(departmentIndex, yearIndex = -1, monthIndex = -1, dateIndex = -1, nCategoryType = -1) {
  let result = {};
  let soapList = this.state.soapList;
  var strDate = yearIndex+"-"+monthIndex+"-"+dateIndex;
  var active_soap_latest = [];

  result.selYear = yearIndex;
  result.selMonth = monthIndex;
  result.selDay = dateIndex;
    // 処方ページの自科
    if (departmentIndex == SOAP_TREE_CATEGORY.CURRENT_ORDER || departmentIndex == SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST) {
        let currentOrder = this.state.soapTrees.current_order.map((item, index) => {
            item.class_name = "";
            if (index === yearIndex) {
                item.class_name = "open";
            }
            if (nCategoryType === SOAP_TREE_CATEGORY.CURRENT_ORDER) {
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
                    }
                    return data;
                })
                return monthItem;
            })
            return item;
        })
        if(departmentIndex == SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST){
            active_soap_latest = this.state.soapTrees.current_order_latest;
             Object.keys(active_soap_latest).forEach(function(key){
                if (key == strDate) {
                    active_soap_latest[key].class_name="open";
                } else {
                    active_soap_latest[key].class_name="";
                }
            });            
        }
        if (nCategoryType === SOAP_TREE_CATEGORY.CURRENT_ORDER) {
            result.soapTrees = this.state.soapTrees;
            result.soapTrees.current_order = currentOrder;
            result.soapTrees.current_order_latest = departmentIndex == SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST?active_soap_latest:this.state.soapTrees.current_order_latest;            
            result.soapList = soapList;
            result.categoryType = SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST;
        }else{
            result.soapTrees = this.state.soapTrees;
            result.soapTrees.current_order = currentOrder;
            result.soapTrees.current_order_latest = departmentIndex == SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST?active_soap_latest:this.state.soapTrees.current_order_latest;            
            result.soapList = soapList;
            result.categoryType = departmentIndex;
        }
    // 処方、注射ページの全科
    } else if(departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER || departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST) {
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
                    }
                    return data;
                })
                return monthItem;
            })
            return item;
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
        }
        if (nCategoryType === SOAP_TREE_CATEGORY.ALL_ORDER) {
            result.soapTrees = this.state.soapTrees;
            result.soapTrees.all_order = allOrder;
            result.soapTrees.all_order_latest = departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST?active_soap_latest:this.state.soapTrees.all_order_latest;            
            result.soapList = soapList;
            result.categoryType = SOAP_TREE_CATEGORY.ALL_ORDER_LATEST;
        }else{
            result.soapTrees = this.state.soapTrees;
            result.soapTrees.all_order = allOrder;
            result.soapTrees.all_order_latest = departmentIndex == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST?active_soap_latest:this.state.soapTrees.all_order_latest;            
            result.soapList = soapList;
            result.categoryType = departmentIndex;
        }        
    }
    return result;
  }
