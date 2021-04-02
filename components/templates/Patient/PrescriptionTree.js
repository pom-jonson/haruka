import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import { SOAP_TREE_CATEGORY, TREE_FLAG } from "~/helpers/constants";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/pro-solid-svg-icons";

const Icon = styled(FontAwesomeIcon)`
  color: black;
  font-size: 15px;
  margin-right: 5px;
`;

const Col = styled.div`
  background-color: ${surface};
  width: 100%;  
  height: calc(100vh - 182px);
  max-height: calc(100vh - 182px);
  overflow-y: auto;
  -ms-overflow-style: auto;
  .tree_open{

  }
  .tree_close{
    display:none;
  }
  .hospitalize-ico{
    margin-bottom: 0px;
    color: #FF1493;
    border: 1px solid #FF1493;
    text-align: center;
    margin-right: 2px;
  }
  .hospitalize-empty-ico{
    margin-bottom: 0px;
    color: #FF1493;
    border: none;
    text-align: center;
    margin-right: 2px;
    padding-left: 15px;
  }
`;

const weekDayOptions = ['日','月','火','水','木','金','土'];

class PrescriptionTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            soapTrees:props.soapTrees,
            bOpenCurrentSoap:props.bOpenCurrentSoap,
            bOpenAllSoap:props.bOpenAllSoap,
            bOpenAllOrder:props.bOpenAllOrder,
            bOpenCurrentOrder:props.bOpenCurrentOrder,
            bOpenAllExamination:props.bOpenAllExamination,
            bOpenAllInspection:props.bOpenAllInspection,
            bOpenAllTreatment:props.bOpenAllTreatment,
            bOpenCurrentSoapLatest:props.bOpenCurrentSoapLatest,
            bOpenAllSoapLatest:props.bOpenAllSoapLatest,
            bOpenAllOrderLatest:props.bOpenAllOrderLatest,
            bOpenCurrentOrderLatest:props.bOpenCurrentOrderLatest,
            bOpenAllExaminationLatest:props.bOpenAllExaminationLatest,
            bOpenAllInspectionLatest:props.bOpenAllInspectionLatest,
            bOpenAllTreatmentLatest:props.bOpenAllTreatmentLatest,
            curScrollTop:props.curScrollTop,
            categoryType:props.categoryType,
            selYear:props.selYear,
            selMonth:props.selMonth,
            selDay:props.selDay,
        };
        this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    }

    componentDidMount() {
        $("#soapTreeView").scrollTop(this.state.curScrollTop);
    }

    getDepartment = id => {
        let departmentStr = "";
        this.departmentOptions.map(item => {
            if (item.id === id) {
                departmentStr = item.value;
            }
        });

        return departmentStr;
    }

    getOffset = (el) => {
        var rect = el.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }

    getCurCategoryStatus = (nType) => {
        if (this.state.categoryType == nType) {
            return true;
        }
        return false;
    }

    changeSoapList = (e, department, year = -1, month = -1, date = -1, nCategoryType = -1, type = "") => {
        e.preventDefault();
        e.stopPropagation();
        this.props.changeSoapList(department, year, month, date, nCategoryType, type);
        if (month == -1 && date == -1) {
            var nType;
            switch(department){
                case SOAP_TREE_CATEGORY.CURRENT_ORDER:
                    nType = SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST;
                    break;
                case SOAP_TREE_CATEGORY.ALL_ORDER:
                    nType = SOAP_TREE_CATEGORY.ALL_ORDER_LATEST;
                    break;
            }
            this.props.setOpenClose(nType, TREE_FLAG.CLOSE_TREE);
        }

        // open category
        if (nCategoryType > 0) {
            switch(nCategoryType){
                case SOAP_TREE_CATEGORY.CURRENT_ORDER:
                    nType = SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST;
                    break;
                case SOAP_TREE_CATEGORY.ALL_ORDER:
                    nType = SOAP_TREE_CATEGORY.ALL_ORDER_LATEST;
                    break;
            }
            this.props.setOpenClose(nType, TREE_FLAG.OPEN_TREE);
        }
        const elHight = $(e.target).height();
        const paHeight = $("#soapTreeView").height();
        const tmp = this.getOffset(e.target);
        let nVal = tmp.top - (paHeight - elHight) / 2;

        this.props.setCurScrollTop(nVal);

    }

    getWeekDay = dateStr => {
        let weekday = new Date(dateStr).getDay();
        return weekDayOptions[weekday];
    }

    generateLatestTrees = (department, trees) => {
        return Object.keys(trees).map(function(key){
            <ul key={key}>
                <li>
                    <span onClick={e => this.changeSoapList(e, department, key)}>{trees[key].sdate}</span>
                </li>
            </ul>
        });
    }

    setOpenClose = (e, nType, nTreeStatus, nCategoryType = -1) => {
        if (nCategoryType > 0) {
            this.props.setOpenClose(nCategoryType, TREE_FLAG.OPEN_TREE);
        } else {
            this.props.setOpenClose(nType, nTreeStatus);
        }
        if (nTreeStatus != TREE_FLAG.OPEN_TREE) {
            return;
        }
        var soapTrees = this.state.soapTrees;
        // var arr = [];
        switch(nType){
            case SOAP_TREE_CATEGORY.CURRENT_ORDER:
                if (soapTrees.current_order_latest != null && soapTrees.current_order_latest!= undefined) {
                    // Object.keys(soapTrees.current_order_latest).forEach(function(key){
                    //     arr.push(soapTrees.current_order_latest[key]);
                    // });

                    // this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST, arr[0].date.substring(0, 4), arr[0].date.substring(5, 7), arr[0].date.substring(8, 10), SOAP_TREE_CATEGORY.CURRENT_ORDER);
                    this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST, -1, -1, -1);
                }
                break;
            case SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST:
                if (soapTrees.current_order_latest != null && soapTrees.current_order_latest!= undefined) {
                    // Object.keys(soapTrees.current_order_latest).forEach(function(key){
                    //     arr.push(soapTrees.current_order_latest[key]);
                    // });

                    // this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST, arr[0].date.substring(0, 4), arr[0].date.substring(5, 7), arr[0].date.substring(8, 10), -1, "date");
                    this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST, -1, -1, -1);
                }
                break;
            case SOAP_TREE_CATEGORY.ALL_ORDER:
                if (soapTrees.all_order_latest != null && soapTrees.all_order_latest!= undefined) {
                    // Object.keys(soapTrees.all_order_latest).forEach(function(key){
                    //     arr.push(soapTrees.all_order_latest[key]);
                    // });

                    // this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, arr[0].date.substring(0, 4), arr[0].date.substring(5, 7), arr[0].date.substring(8, 10), SOAP_TREE_CATEGORY.ALL_ORDER);
                    this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, -1, -1, -1);
                }
                break;
            case SOAP_TREE_CATEGORY.ALL_ORDER_LATEST:
                if (soapTrees.all_order_latest != null && soapTrees.all_order_latest!= undefined) {
                    // Object.keys(soapTrees.all_order_latest).forEach(function(key){
                    //     arr.push(soapTrees.all_order_latest[key]);
                    // });

                    // this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, arr[0].date.substring(0, 4), arr[0].date.substring(5, 7), arr[0].date.substring(8, 10), -1, "date");
                    this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, -1, -1, -1);
                }
                break;
        }
    }

    canAddPrefix = (category = SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST) => {
        return category == SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST || category == SOAP_TREE_CATEGORY.CURRENT_SOAP || category == SOAP_TREE_CATEGORY.ALL_SOAP_LATEST || category == SOAP_TREE_CATEGORY.ALL_SOAP;
    }

    generateTrees = (department, trees, nOpen) => {
        return trees.map((item, itemIndex) => {
            if (item.show != 0) {
                return (
                    <ul key={item.year}>
                        {item.data.length > 0 && (
                            <li>
                                <span
                                    onClick={e => this.changeSoapList(e, department, itemIndex)}
                                    className={item.class_name !== undefined ? nOpen && itemIndex == this.state.selYear?item.class_name+" sel_open":item.class_name : ""}
                                >
                                    {(item.class_name !== undefined && nOpen && itemIndex == this.state.selYear) ? (
                                        <Icon icon={faMinus} />
                                    ) : (
                                        <Icon icon={faPlus} />
                                    )}
                                    {item.year}年
                                </span>
                                {(item.class_name !== undefined && item.class_name.includes("open") && (
                                    <ul>
                                        {item.data.map((monthItem, monthItemIndex) => {
                                            let existPrefixDate = this.handleExistPrefixDate(monthItem.data);
                                            return (
                                                <>
                                                    {monthItem.data.length > 0 && (
                                                        <li key={monthItem.month}>
                                                            <span
                                                                onClick={e => this.changeSoapList(e, department, itemIndex, monthItemIndex)}
                                                                className={monthItem.class_name !== undefined ? nOpen && monthItemIndex == this.state.selMonth?monthItem.class_name+" sel_open":monthItem.class_name : ""}
                                                            >
                                                                {(monthItem.class_name !== undefined && nOpen && monthItemIndex == this.state.selMonth) ? (
                                                                    <Icon icon={faMinus} />
                                                                ) : (
                                                                    <Icon icon={faPlus} />
                                                                )}
                                                                {monthItem.month.substring(5, 7)}月
                                                            </span>
                                                            {(monthItem.class_name !== undefined && monthItem.class_name.includes("open") && (
                                                                <ul>
                                                                    {monthItem.data.map((data, dateIndex) => {
                                                                        return (
                                                                            <li key={data.number}>
                                                                                <span onClick={e => this.changeSoapList(e, department, itemIndex, monthItemIndex, dateIndex, -1, "date_index")} className={data.class_name !== undefined ? nOpen && dateIndex == this.state.selDay?data.class_name+" sel_open":data.class_name : ""}>
                                                                                {this.getPrefixOfDate(data, existPrefixDate)} 
                                                                                {data.sdate} {this.canAddPrefix(SOAP_TREE_CATEGORY.ALL_SOAP) ? data.prefix:''}
                                                                                </span>
                                                                            </li>
                                                                        )
                                                                    })}
                                                                </ul>
                                                            ))}
                                                        </li>
                                                    )}
                                                </>
                                            )
                                        })}
                                    </ul>
                                ))}
                            </li>
                        )}
                    </ul>
                )
            }
        })
    }

    testTreeRender = (props_state) => {
        this.setState({
            soapTrees:props_state.soapTrees,
            bOpenCurrentSoap:props_state.bOpenCurrentSoap,
            bOpenAllSoap:props_state.bOpenAllSoap,
            bOpenAllOrder:props_state.bOpenAllOrder,
            bOpenCurrentOrder:props_state.bOpenCurrentOrder,
            bOpenAllExamination:props_state.bOpenAllExamination,
            bOpenAllInspection:props_state.bOpenAllInspection,
            bOpenAllTreatment:props_state.bOpenAllTreatment,
            bOpenCurrentSoapLatest:props_state.bOpenCurrentSoapLatest,
            bOpenAllSoapLatest:props_state.bOpenAllSoapLatest,
            bOpenAllOrderLatest:props_state.bOpenAllOrderLatest,
            bOpenCurrentOrderLatest:props_state.bOpenCurrentOrderLatest,
            bOpenAllExaminationLatest:props_state.bOpenAllExaminationLatest,
            bOpenAllInspectionLatest:props_state.bOpenAllInspectionLatest,
            bOpenAllTreatmentLatest:props_state.bOpenAllTreatmentLatest,
            curScrollTop:props_state.curScrollTop,
            categoryType:props_state.categoryType,
            selYear:props_state.selYear,
            selMonth:props_state.selMonth,
            selDay:props_state.selDay,
        });
    }

    handleExistPrefixDate = (_arr) => {
      let result = false;
      if (_arr == undefined || _arr == null || _arr.length < 1) return result;

      let categoryStatus = true;

      _arr.map(item=>{
        if(categoryStatus &&
          item.countDischargeOrder != undefined && 
          item.countDischargeOrder != null && 
          item.countDischargeOrder > 0){
            result = true;
        }
  
        if(categoryStatus && 
          item.countHospitalizeOrders != undefined && 
          item.countHospitalizeOrders != null && 
          item.countHospitalizeOrders > 0){
            result = true;
        }
      });

      return result;
    }

    getPrefixOfDate = (_data, _emptyPrefix=false) => {
        let categoryStatus = true;
        // if (_type =="all") {
        //   if (_department == SOAP_TREE_CATEGORY.ALL_SOAP_TAG || 
        //     _department == SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST || 
        //     _department == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION || 
        //     _department == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION ) {          
        //       categoryStatus = false;
        //   }
        // }
        if(categoryStatus &&
          _data.countDischargeOrder != undefined && 
          _data.countDischargeOrder != null && 
          _data.countDischargeOrder > 0){
            return <span className="hospitalize-ico" style={{marginBottom:'0px'}}>退</span>;
        }
  
        if(categoryStatus && 
          _data.countHospitalizeOrders != undefined && 
          _data.countHospitalizeOrders != null && 
          _data.countHospitalizeOrders > 0){
            return <span className="hospitalize-ico" style={{marginBottom:'0px'}}>入</span>;
        }      
  
        if (_emptyPrefix == true) {
          return <span className="hospitalize-empty-ico" style={{marginBottom:'0px'}}></span>;
        }
      }    

    render() {
        const { soapTrees } = this.state;
        var arr = [];
        let currentOrderLatest= [];
        let allOrderLatest= [];
        let selDate = this.state.selYear + "-" + this.state.selMonth + "-" + this.state.selDay;
        // 処方の自科
        if (soapTrees.current_order_latest != null && soapTrees.current_order_latest!= undefined) {
            Object.keys(soapTrees.current_order_latest).forEach(function(key){
                arr.push(soapTrees.current_order_latest[key]);
            });

            let existPrefixDate = this.handleExistPrefixDate(arr);

            currentOrderLatest = arr.map((item, key)=>{
                if(this.state.categoryType < 0 && key == 0){
                    return <li key={key}>
                    <span onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10), -1, "date")} className="open sel_open">
                        {this.getPrefixOfDate(item, existPrefixDate)}                        
                        {item.sdate}
                    </span></li>;
                }else{
                    return <li key={key}>
                    <span onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10), SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST, "date")} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST)?item.class_name+" sel_open":item.class_name : ""}>
                        {this.getPrefixOfDate(item, existPrefixDate)}
                        {item.sdate}
                    </span></li>;
                }
            });
        }
        const currentOrder = soapTrees.current_order !== undefined ?
            this.generateTrees(SOAP_TREE_CATEGORY.CURRENT_ORDER, soapTrees.current_order, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.CURRENT_ORDER)) : "";

        // 処方ページの全科
        arr = [];
        if (soapTrees.all_order_latest != null && soapTrees.all_order_latest!= undefined) {
            Object.keys(soapTrees.all_order_latest).forEach(function(key){
                arr.push(soapTrees.all_order_latest[key]);
            });

            let existPrefixDate = this.handleExistPrefixDate(arr);

            allOrderLatest = arr.map((item, key)=>{
                if(this.state.categoryType < 0 && key == 0){
                    return <li key={key}>
                        <span onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10), -1, "date")} className="open sel_open">
                            {this.getPrefixOfDate(item, existPrefixDate)}
                            {item.sdate}
                        </span>
                        </li>;
                }else{
                    return <li key={key}>
                    <span onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10), SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, "date")} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_ORDER_LATEST)?item.class_name+" sel_open":item.class_name : ""}>
                    {this.getPrefixOfDate(item, existPrefixDate)}
                    {item.sdate}
                    </span></li>;
                }
            });
        }
        const allOrder = soapTrees.all_order !== undefined ?
            this.generateTrees(SOAP_TREE_CATEGORY.ALL_ORDER, soapTrees.all_order, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_ORDER)) : "";

        return (
            <Col id="soapTreeView">
                <nav>
                    <ul>
                        <li className={this.state.bOpenCurrentOrder?"tree_close":""}>
                            <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_ORDER, TREE_FLAG.OPEN_TREE)}><Icon icon={faPlus} />自科処方</span>
                        </li>
                        <li className={this.state.bOpenCurrentOrder?"":"tree_close"}>
                            <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_ORDER, TREE_FLAG.CLOSE_TREE)}><Icon icon={faMinus} />自科処方</span>
                            <ul>
                                <li className={this.state.bOpenCurrentOrderLatest?"tree_close":""}>
                                    <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST, TREE_FLAG.OPEN_TREE)}><Icon icon={faPlus} />最新15件</span>
                                </li>
                                <li className={this.state.bOpenCurrentOrderLatest?"":"tree_close"}>
                                    <span className={this.state.categoryType == SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_ORDER_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon icon={faMinus} />最新15件</span>
                                    <ul>
                                        {currentOrderLatest}
                                    </ul>
                                </li>
                            </ul>
                            {currentOrder}
                        </li>
                        <li className={this.state.bOpenAllOrder?"tree_close":""}>
                            <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_ORDER, TREE_FLAG.OPEN_TREE)}><Icon icon={faPlus} />全科処方</span>
                        </li>
                        <li className={this.state.bOpenAllOrder?"":"tree_close"}>
                            <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_ORDER, TREE_FLAG.CLOSE_TREE)}><Icon icon={faMinus} />全科処方</span>
                            <ul>
                                <li className={this.state.bOpenAllOrderLatest?"tree_close":""}>
                                    <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, TREE_FLAG.OPEN_TREE)}><Icon icon={faPlus} />最新15件</span>
                                </li>
                                <li className={this.state.bOpenAllOrderLatest?"":"tree_close"}>
                                    <span className={this.state.categoryType == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon icon={faMinus} />最新15件</span>
                                    <ul>
                                        {allOrderLatest}
                                    </ul>
                                </li>
                            </ul>
                            {allOrder}
                        </li>
                    </ul>
                </nav>
            </Col>
        );
    }
}
PrescriptionTree.contextType = Context;

PrescriptionTree.propTypes = {
    soapTrees: PropTypes.array,
    changeSoapList: PropTypes.func,
    departmentStr: PropTypes.string,
    bOpenCurrentSoap: PropTypes.boolean,
    bOpenAllSoap: PropTypes.boolean,
    bOpenAllOrder: PropTypes.boolean,
    bOpenCurrentOrder: PropTypes.boolean,
    bOpenAllExamination: PropTypes.boolean,
    bOpenAllInspection: PropTypes.boolean,
    bOpenAllTreatment: PropTypes.boolean,
    bOpenCurrentSoapLatest: PropTypes.boolean,
    bOpenAllSoapLatest: PropTypes.boolean,
    bOpenAllOrderLatest: PropTypes.boolean,
    bOpenCurrentOrderLatest: PropTypes.boolean,
    bOpenAllExaminationLatest: PropTypes.boolean,
    bOpenAllInspectionLatest: PropTypes.boolean,
    bOpenAllTreatmentLatest: PropTypes.boolean,
    curScrollTop: PropTypes.number,
    setOpenClose: PropTypes.func,
    setCurScrollTop: PropTypes.func,
    categoryType: PropTypes.number,
    selYear: PropTypes.number,
    selMonth: PropTypes.number,
    selDay: PropTypes.number,

}

export default PrescriptionTree;
