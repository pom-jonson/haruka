import React, { Component } from "react";
import styled from "styled-components";
import {
  surface
} from "../../../../_nano/colors";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import { SOAP_TREE_CATEGORY, TREE_FLAG } from "../../../../../helpers/constants";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/pro-solid-svg-icons";
import SearchConditionModal from "../../Modals/SearchCondition/SearchConditionModal";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import KarteSealPrint from "~/components/templates/Patient/SOAP/components/KarteSealPrint";

const Icon = styled(FontAwesomeIcon)`
  color: black;
  font-size:${props=>(props.font_props != undefined?props.font_props + 'rem':'1rem')};
  margin-right: 5px;
`;

const Col = styled.div`
    min-width: 200px;
    width: 100%;
    flex-grow: 1;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;

  background-color: ${surface};
  height: calc(100vh - 182px);
  max-height: calc(100vh - 182px);
  overflow-y: auto;
  -ms-overflow-style: auto;
  .tree_open{

  }
  .tree_close{
    display:none;
  }
  nav ul li{
    padding-right: 0 !important;
    font-size:${props=>(props.font_props != undefined?0.875 * props.font_props + 'rem':'0.875rem')};
  }
  .hospitalize-ico{
    margin-bottom: 0px;
    color: #FF1493;
    border: 1px solid #FF1493;
    // width: 20px;
    text-align: center;
    margin-right: 2px;
    // margin-right: 0.2rem;
    // line-height: 18px;
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

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 84px;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 16px;
    font-weight: normal;
    line-height: 22px;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x,  y, tree_category, tree_date, condition_number,  parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {tree_category == null ? (
            <>
              <li><div onClick={() => parent.contextMenuAction("register")}>追加</div></li>
              {condition_number !== undefined && (
                <li><div onClick={() => parent.contextMenuAction("unsearch")}>検索を解除</div></li>
              )}
            </>
          ):(
            <li><div onClick={() => parent.contextMenuAction("karte_seal_print", tree_category, tree_date)}>シール印刷</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const weekDayOptions = ['日','月','火','水','木','金','土'];

class LeftBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contextMenu: {visible: false},
      selYear:props.selYear,
      selMonth:props.selMonth,
      selDay:props.selDay,
      openSearchDetailModal: false,
      soapTrees:props.soapTrees,
      allDateList:props.allDateList,
      allTags:props.allTags,
      search_condition_number:props.search_condition_number,
      categoryType:props.categoryType,
      bOpenCurrentSoap:props.bOpenCurrentSoap,
      bOpenCurrentSoapLatest:props.bOpenCurrentSoapLatest,
      bOpenAllSoap:props.bOpenAllSoap,
      bOpenAllSoapLatest:props.bOpenAllSoapLatest,
      bOpenAllSoapTag:props.bOpenAllSoapTag,
      bOpenAllSoapTagLatest:props.bOpenAllSoapTagLatest,
      bOpenAllExecuteOrder:props.bOpenAllExecuteOrder,
      bOpenAllExecuteOrderLatest:props.bOpenAllExecuteOrderLatest,
      bOpenGroupExamination:props.bOpenGroupExamination,
      bOpenCurrentExamination:props.bOpenCurrentExamination,
      bOpenCurrentExaminationLatest:props.bOpenCurrentExaminationLatest,
      bOpenGlobalExamination:props.bOpenGlobalExamination,
      bOpenGlobalExaminationLatest:props.bOpenGlobalExaminationLatest,
      bOpenAllOrder:props.bOpenAllOrder,
      bOpenAllOrderLatest:props.bOpenAllOrderLatest,
      bOpenAllExamination:props.bOpenAllExamination,
      bOpenAllExaminationLatest:props.bOpenAllExaminationLatest,
      bOpenAllInspection:props.bOpenAllInspection,
      bOpenAllInspectionLatest:props.bOpenAllInspectionLatest,
      bOpenAllTreatment:props.bOpenAllTreatment,
      bOpenAllTreatmentLatest:props.bOpenAllTreatmentLatest,
      bOpenAllRehabily:props.bOpenAllRehabily,
      bOpenAllRehabilyLatest:props.bOpenAllRehabilyLatest,
      bOpenAllRadiation:props.bOpenAllRadiation,
      bOpenAllRadiationLatest:props.bOpenAllRadiationLatest,
      bOpenAllProgressLatest:props.bOpenAllProgressLatest,
      bOpenSearchCondition:props.bOpenSearchCondition,
      bOpenAllHospital:props.bOpenAllHospital,
      bOpenAllProgress:props.bOpenAllProgress,
      isOpenKarteSealPrint:false,
    };
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  }
  
  componentDidMount() {
    document
      .getElementById("soapTreeView")
      .addEventListener("scroll", this.handleScroll);
    let treeScrollTop = window.sessionStorage.getItem('tree_scroll_top') !== undefined ? parseInt(window.sessionStorage.getItem('tree_scroll_top')) : 0;
    $("#soapTreeView").scrollTop(!isNaN(treeScrollTop) ? treeScrollTop : 0);
  }
  
  handleScroll = () => {
    window.sessionStorage.setItem('tree_scroll_top', $("#soapTreeView").scrollTop());
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
  
  getCurCategoryStatus = (nType) => {
    if (this.state.categoryType == nType) {
      return true;
    }
    return false;
  }
  
  changeSoapList = (e, department, year = -1, month = -1, date = -1, nCategoryType = -1) => {
    this.handleScroll();
    e.preventDefault();
    e.stopPropagation();
    this.props.changeSoapList(department, year, month, date, nCategoryType);
    if (month == -1 && date == -1) {
      var nType;
      switch(department){
        case SOAP_TREE_CATEGORY.CURRENT_SOAP:
          nType = SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_SOAP:
          nType = SOAP_TREE_CATEGORY.ALL_SOAP_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER:
          nType = SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST;
          break;
        case SOAP_TREE_CATEGORY.CURRENT_EXAMINATION:
          nType = SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST;
          break;
        case SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION:
          nType = SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_ORDER:
          nType = SOAP_TREE_CATEGORY.ALL_ORDER_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
          nType = SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_INSPECTION:
          nType = SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_TREATMENT:
          nType = SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_REHABILY:
          nType = SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_RADIATION:
          nType = SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_SOAP_TAG:
          nType = SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST;
          break;
      }
    }
    
    // open category
    if (nCategoryType > 0) {
      switch(nCategoryType){
        case SOAP_TREE_CATEGORY.CURRENT_SOAP:
          nType = SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_SOAP:
          nType = SOAP_TREE_CATEGORY.ALL_SOAP_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER:
          nType = SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST;
          break;
        case SOAP_TREE_CATEGORY.CURRENT_EXAMINATION:
          nType = SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST;
          break;
        case SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION:
          nType = SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_ORDER:
          nType = SOAP_TREE_CATEGORY.ALL_ORDER_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
          nType = SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_INSPECTION:
          nType = SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_TREATMENT:
          nType = SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_REHABILY:
          nType = SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_RADIATION:
          nType = SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST;
          break;
        case SOAP_TREE_CATEGORY.ALL_SOAP_TAG:
          nType = SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST;
          break;
      }
      this.props.setOpenClose(nType, TREE_FLAG.OPEN_TREE);
    }
  }
  
  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return weekDayOptions[weekday];
  }
  
  generateLatestTrees = (department, trees) => {
    return Object.keys(trees).map(function(key){
      <ul key={key}>
        <li onClick={e => this.changeSoapList(e, department, key)}>
          <span>{trees[key].sdate}</span>
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
    let soapTrees = this.state.soapTrees;
    switch(nType){
      case SOAP_TREE_CATEGORY.CURRENT_SOAP:
        if (soapTrees.current_soap_latest != null && soapTrees.current_soap_latest!= undefined) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP:
        if (soapTrees.all_soap_latest != null && soapTrees.all_soap_latest!= undefined) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_SOAP_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER:
        if (soapTrees.all_execute_order_latest != null && soapTrees.all_execute_order_latest!= undefined) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.CURRENT_EXAMINATION:
        if (soapTrees.current_examination_latest != null && soapTrees.current_examination_latest!= undefined) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION:
        if (soapTrees.global_examination_latest != null && soapTrees.global_examination_latest!= undefined) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_ORDER:
        if (soapTrees.all_order_latest != null && soapTrees.all_order_latest!= undefined) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_PROGRESS:
        if(soapTrees.all_progress_latest != null && soapTrees.all_progress_latest != undefined){
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
        if (soapTrees.all_examination_latest != null && soapTrees.all_examination_latest!= undefined) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_INSPECTION:
        if (soapTrees.all_inspection_latest != null && soapTrees.all_inspection_latest!= undefined) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_TREATMENT:
        if (soapTrees.all_treatment_latest != null && soapTrees.all_treatment_latest!= undefined) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_REHABILY:
        if (soapTrees.all_rehabily_latest!= undefined && soapTrees.all_rehabily_latest != null) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_RADIATION:
        if (soapTrees.all_radiation_latest != undefined && soapTrees.all_radiation_latest!= null) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP_TAG:
        if (soapTrees.all_soap_tag_latest !== undefined && soapTrees.all_soap_tag_latest != null) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST:
        if (soapTrees.current_soap_latest != null && soapTrees.current_soap_latest!= undefined) {
          //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
          this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP_LATEST:
        if (soapTrees.all_soap_latest != null && soapTrees.all_soap_latest!= undefined) {
          //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_SOAP_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST:
        if (soapTrees.all_execute_order_latest != null && soapTrees.all_execute_order_latest!= undefined) {
          //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST:
        if (soapTrees.all_progress_latest != null && soapTrees.all_progress_latest!= undefined) {
          //------------- 自科カルテ最新15日 open tree and show 15day's data--------------------------//
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST:
        if (soapTrees.current_examination_latest != null && soapTrees.current_examination_latest!= undefined) {
          //------------- 「結果・報告」(自科)最新15日 open tree and show 15day's data--------------------------//
          this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST:
        if (soapTrees.global_examination_latest != null && soapTrees.global_examination_latest!= undefined) {
          //------------- 「結果・報告」(全科)最新15日 open tree and show 15day's data--------------------------//
          this.changeSoapList(e, SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_ORDER_LATEST:
        if (soapTrees.all_order_latest != null && soapTrees.all_order_latest!= undefined) {
          // this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, arr[0].date.substring(0, 4), arr[0].date.substring(5, 7), arr[0].date.substring(8, 10));
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST:
        if (soapTrees.all_examination_latest != null && soapTrees.all_examination_latest!= undefined) {
          // this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST, arr[0].date.substring(0, 4), arr[0].date.substring(5, 7), arr[0].date.substring(8, 10));
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST:
        if (soapTrees.all_inspection_latest != null && soapTrees.all_inspection_latest!= undefined) {
          // this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST, arr[0].date.substring(0, 4), arr[0].date.substring(5, 7), arr[0].date.substring(8, 10));
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST:
        if (soapTrees.all_treatment_latest != null && soapTrees.all_treatment_latest!= undefined) {
          // this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST, arr[0].date.substring(0, 4), arr[0].date.substring(5, 7), arr[0].date.substring(8, 10));
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST:
        if (soapTrees.all_rehabily_latest != null && soapTrees.all_rehabily_latest!= undefined) {
          // this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST, arr[0].date.substring(0, 4), arr[0].date.substring(5, 7), arr[0].date.substring(8, 10));
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST:
        if (soapTrees.all_radiation_latest != null && soapTrees.all_radiation_latest!= undefined) {
          // this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST, arr[0].date.substring(0, 4), arr[0].date.substring(5, 7), arr[0].date.substring(8, 10));
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST, -1, -1, -1);
        }
        break;
      case SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST:
        if (soapTrees.all_soap_tag_latest != null && soapTrees.all_soap_tag_latest!= undefined) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST, -1, -1, -1);
        }
        break;
    }
  }
  
  canAddPrefix = (category = SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST) => {
    return category == SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST || category == SOAP_TREE_CATEGORY.CURRENT_SOAP || category == SOAP_TREE_CATEGORY.ALL_SOAP_LATEST || category == SOAP_TREE_CATEGORY.ALL_SOAP;
  }
  
  getCategoryInfoByDate = (_date=null) => {
    let result = {};
    if (_date == null || _date == "") return result;
    let allDateList = this.state.allDateList;
    if (allDateList == undefined || allDateList == null || allDateList.length < 1) return result;
    let order = allDateList[_date];
    if (order != null) {
      result.category = order.category
    }
  }
  
  generateHospitalTrees = (department, trees, nOpen) => {
    var trees_data = [];
    if(trees !== undefined && Object.keys(trees).length > 0){
      trees_data = Object.keys(trees).map((hospital_date, index) => {
        var item = trees[hospital_date];
        return (
          <>
            <ul>
              <li>
                <span
                  onClick={e => this.changeSoapList(e, department, index)}
                  className={item.class_name !== undefined ? nOpen && index == this.state.selYear ? item.class_name+" sel_open":item.class_name : ""}
                >
                  {(item.class_name == "open") ? (<Icon font_props = {this.props.font_props} icon={faMinus} />
                  ) : (<Icon font_props = {this.props.font_props} icon={faPlus} />)}
                  {hospital_date}
                </span>
                {(item.class_name !== undefined && item.class_name.includes("open")) && (
                  <>
                    <ul>
                      {item.map((sub_item, sub_index) => {
                        let existPrefixDate = this.handleExistPrefixDate(sub_item.data);
                        return(
                          <>
                            {/* {sub_item.data.map((data, final_index) => {
                          return (
                          <> */}
                            <li>
                              <div
                                onClick={e => this.changeSoapList(e, department, index, sub_index)}
                                className={sub_item.class_name !== undefined ? nOpen && (sub_index == this.state.selMonth) ? sub_item.class_name+" sel_open":sub_item.class_name : ""}
                              >
                                {this.getPrefixOfDate("all", department, sub_item, existPrefixDate)}
                                <label style={{marginBottom:'0px'}}>
                                  {sub_item.sdate}
                                </label>
                                <label style={{marginBottom:'0px'}}>
                                  {this.canAddPrefix(SOAP_TREE_CATEGORY.ALL_SOAP) ? sub_item.prefix:''}
                                  {this.getFlagIcon(sub_item.numbers)}
                                </label>
                              </div>
                            </li>
                            {/* </>
                          )
                        })}                         */}
                          </>
                        )
                      })}
                    </ul>
                  </>
                )}
              </li>
            </ul>
          </>
        )
      })
    }
    return trees_data;
  }
  
  generateTrees = (department, trees, nOpen) => {
    let trees_data = [];
    if(trees !== undefined && trees != null && trees.length > 0){
      trees_data =  trees.map((item, itemIndex) => {
        if (item.show != 0) {
          return (
            <ul key={item.year}>
              {item.data.length > 0 && (
                <li>
                <span
                  onClick={e => this.changeSoapList(e, department, itemIndex)}
                  className={item.class_name !== undefined ? nOpen && itemIndex == this.state.selYear ? item.class_name+" sel_open":item.class_name : ""}
                >
                  {(item.class_name == "open") ? (
                    <Icon font_props = {this.props.font_props} icon={faMinus} />
                  ) : (
                    <Icon font_props = {this.props.font_props} icon={faPlus} />
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
                                className={monthItem.class_name !== undefined ? nOpen && monthItemIndex == this.state.selMonth ? monthItem.class_name+" sel_open":monthItem.class_name : ""}
                              >
                                  {(monthItem.class_name == "open") ? (
                                    <Icon font_props = {this.props.font_props} icon={faMinus} />
                                  ) : (
                                    <Icon font_props = {this.props.font_props} icon={faPlus} />
                                  )}
                                {monthItem.month.substring(5, 7)}月
                              </span>
                                {(monthItem.class_name !== undefined && monthItem.class_name.includes("open") && (
                                  <ul>
                                    {monthItem.data.map((data, dateIndex) => {
                                      return (
                                        <>
                                          <li key={data.number}>
                                            <div
                                              onClick={e => this.changeSoapList(e, department, itemIndex, monthItemIndex, dateIndex)}
                                              className={data.class_name !== undefined ? nOpen && (monthItemIndex == this.state.selMonth && dateIndex == this.state.selDay) ? data.class_name+" sel_open":data.class_name : ""}
                                              onContextMenu={e => this.handleClick(e, department, data.date)}
                                            >
                                              {this.getPrefixOfDate("all", department, data, existPrefixDate)}
                                              <label style={{marginBottom:'0px'}}>
                                                {(department === SOAP_TREE_CATEGORY.CURRENT_EXAMINATION || department === SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION) ? this.getReadStatus(data.date, data.numbers):''}
                                                {data.sdate}
                                              </label>
                                              <label style={{marginBottom:'0px'}}>
                                                {this.canAddPrefix(SOAP_TREE_CATEGORY.ALL_SOAP) ? data.prefix:''}
                                                {this.getFlagIcon(data.numbers)}
                                              </label>
                                            </div>
                                          </li>
                                        </>
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
    return trees_data;
  }
  
  getFlagIcon=(karte_numbers)=>{
    let flag_icon = {};
    karte_numbers.map(number=>{
      if(this.state.allTags[number] !== undefined){
        Object.keys(this.state.allTags[number]).map(index=>{
          let item = this.state.allTags[number][index];//updated_by
          if(item['is_enabled'] === 1 && item['sticky_note_type_id'] > 0){
            if(item['public_range'] === 0 || (item['public_range'] === 1 && item['updated_by'] === this.authInfo.user_number)){
              if(flag_icon[item['sticky_note_type_id']] === undefined){
                flag_icon[item['sticky_note_type_id']] = item['color'];
              }
            }
          }
        })
      }
    });
    if(Object.keys(flag_icon).length > 0){
      let flag_data = Object.keys(flag_icon).map((index)=>{
        return (
          <span key={index} style={{paddingLeft:"5px", color:flag_icon[index]}}>
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="flag"
              className="svg-inline--fa fa-flag fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="currentColor"
                d="M349.565 98.783C295.978 98.783 251.721 64 184.348 64c-24.955 0-47.309 4.384-68.045 12.013a55.947 55.947 0 0 0 3.586-23.562C118.117 24.015 94.806 1.206 66.338.048 34.345-1.254 8 24.296 8 56c0 19.026 9.497 35.825 24 45.945V488c0 13.255 10.745 24 24 24h16c13.255 0 24-10.745 24-24v-94.4c28.311-12.064 63.582-22.122 114.435-22.122 53.588 0 97.844 34.783 165.217 34.783 48.169 0 86.667-16.294 122.505-40.858C506.84 359.452 512 349.571 512 339.045v-243.1c0-23.393-24.269-38.87-45.485-29.016-34.338 15.948-76.454 31.854-116.95 31.854z"
              ></path>
            </svg>
          </span>
        )
      });
      return (<>{flag_data}</>);
    } else {
      return '';
    }
  }
  
  getReadStatus=(treatment_date, karte_numbers)=>{
    let read_flag_icon = {green:0,gray:0};
    let allDateList = this.state.allDateList;
    let exam_data = allDateList[treatment_date];
    Object.keys(exam_data).map(target_table=>{
      Object.keys(exam_data[target_table]).map(index=>{
        if(karte_numbers.includes(exam_data[target_table][index]['number'])){
          if(exam_data[target_table][index]['read_flag'] === 0 && exam_data[target_table][index]['updated_by'] === this.authInfo.user_number){
            read_flag_icon['green'] = 1;
          }
          if(exam_data[target_table][index]['read_flag'] === 0 && exam_data[target_table][index]['updated_by'] !== this.authInfo.user_number){
            read_flag_icon['gray'] = 1;
          }
        }
      });
    });
    let result = [];
    if(read_flag_icon['green'] === 1){
      result.push(<span style={{border:"1px solid", borderColor:"green", color:"green", marginRight:"2px"}}>未</span>);
    }
    if(read_flag_icon['gray'] === 1){
      result.push(<span style={{border:"1px solid", borderColor:"gray", color:"gray", marginRight:"2px"}}>未</span>);
    }
    if(read_flag_icon['green'] === 0 && read_flag_icon['gray'] === 0){
      result.push(<span style={{marginRight:"2px", paddingLeft:"15px"}}> </span>);
    }
    return (<>{result}</>);
  }
  
  openSearchDetail = () => {
    this.setState({openSearchDetailModal: true});
  };
  
  closeModal = () => {
    this.setState({
      openSearchDetailModal: false,
      isOpenKarteSealPrint: false,
    });
  }
  
  setAllKarteData=(soapTrees, allDateList, allTags, search_condition_number, selected_date_key)=>{
    if(selected_date_key != null){
      let selYear = selected_date_key.split(':')[0];
      let selMonth = selected_date_key.split(':')[1];
      let selDay = selected_date_key.split(':')[2];
      this.setState({
        soapTrees,
        allDateList,
        allTags,
        search_condition_number,
        selYear,
        selMonth,
        selDay,
      });
    } else {
      this.setState({
        soapTrees,
        allDateList,
        allTags,
        search_condition_number,
      });
    }
  }
  
  setChangeSoapData=(selYear, selMonth, selDay, soapTrees, allDateList, categoryType)=>{
    this.setState({
      selYear,
      selMonth,
      selDay,
      soapTrees,
      allDateList,
      categoryType
    });
  }
  
  setChangeTree=(key, value)=>{
    this.setState({[key]:value});
  }
  
  handleClick = (e, tree_category=null, tree_date=null) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextMenu: { visible: false }});
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      let clientX = e.clientX;
      let clientY = e.clientY;
      this.props.closeRightClickMenu('left');
      let state_data = {};
      state_data.contextMenu = {
        visible: true,
        x: clientX,
        y: clientY + window.pageYOffset - 120,
        tree_category,
        tree_date,
      };
      this.setState(state_data, ()=>{
        /*@cc_on _d = document; eval ( 'var document = _d') @*/
        /*@cc_on _win = window; eval ( 'var window = _win') @*/
        let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
        let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
        let window_height = window.innerHeight - 182;
        let tree_width = document.getElementsByClassName("soapTreeView")[0].offsetWidth;
        if (((clientY + menu_height) > window_height) && ((clientX + menu_width) > tree_width)) {
          state_data.contextMenu.x = clientX - menu_width;
          state_data.contextMenu.y = clientY - menu_height + window.pageYOffset - 120;
          this.setState(state_data);
        } else if (((clientY + menu_height) > window_height) && ((clientX + menu_width) < tree_width)) {
          state_data.contextMenu.y = clientY - menu_height + window.pageYOffset - 120;
          this.setState(state_data);
        } else if (((clientY + menu_height) < window_height) && ((clientX + menu_width) > tree_width)) {
          state_data.contextMenu.x = clientX - menu_width;
          this.setState(state_data);
        }
      });
    }
  };
  
  contextMenuAction = (type, tree_category, tree_date) => {
    if (type === "register"){
      this.setState({openSearchDetailModal: true});
      return;
    }
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    if (type === "unsearch"){
      let params = {
        patient_id:current_system_patient_id,
        medical_department_code: this.context.department.code
      };
      this.props.getAllKarteTree(params);
    }
    if(type === "karte_seal_print"){
      let seal_print_info = {};
      let patient_info = karteApi.getVal(current_system_patient_id, CACHE_LOCALNAMES.PATIENT_INFORMATION);
      seal_print_info.date = tree_date;
      seal_print_info.patient_id = current_system_patient_id;
      seal_print_info.patient_name = patient_info.name;
      seal_print_info.patient_number = patient_info.receId;
      if(tree_category == SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST || tree_category == SOAP_TREE_CATEGORY.CURRENT_SOAP){
        seal_print_info.department_id = this.context.department.code == 0 ? 1 : this.context.department.code;
      }
      this.setState({
        isOpenKarteSealPrint:true,
        seal_print_info
      });
    }
  };
  
  getKarteTreeByCondition = (e,condition) =>{
    let current_system_patient_id = localApi.getValue("current_system_patient_id");
    current_system_patient_id = (current_system_patient_id != undefined && current_system_patient_id != null) ? current_system_patient_id : 0;
    let params = {
      patient_id:current_system_patient_id,
      condition:condition,
      medical_department_code: this.context.department.code
    };
    this.props.getAllKarteTree(params);
  };
  
  getPrefixOfDate = (_type, _department, _data, _emptyPrefix=false) => {
    let categoryStatus = true;
    if (_type =="all") {
      if (_department == SOAP_TREE_CATEGORY.ALL_SOAP_TAG ||
        _department == SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST ||
        _department == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION ||
        _department == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION ) {
        categoryStatus = false;
      }
    }
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
  
  closeRightClickMenu=()=>{
    if(this.state.contextMenu.visible){
      this.setState({contextMenu: {visible: false}});
    }
  }
  
  render() {
    const { soapTrees } = this.state;
    var arr = [];
    let currentSoapLatest= [];
    let selDate = this.state.selYear + "-" + this.state.selMonth + "-" + this.state.selDay;
    if (soapTrees.current_soap_latest != null && soapTrees.current_soap_latest!= undefined) {
      Object.keys(soapTrees.current_soap_latest).forEach(function(key){
        arr.push(soapTrees.current_soap_latest[key]);
      });
      // ■YJ62 ツリーの入院アイコンの調整
      // check has must show prefix Date
      let existPrefixDate = this.handleExistPrefixDate(arr);
      currentSoapLatest = arr.map((item, key)=>{
        return <li key={key}>
          <div
            onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))}
            className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST)?item.class_name+" sel_open":item.class_name : ""}
            onContextMenu={e => this.handleClick(e, SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST, item.date)}
          >
            {this.getPrefixOfDate("", "", item, existPrefixDate)}
            <label style={{marginBottom:0}}>
              {item.sdate}
            </label>
            <label style={{marginBottom:0}}>
              {item.prefix}{this.getFlagIcon(item.numbers)}
            </label>
          </div>
        </li>;
      });
    }
    arr = [];
    let allSoapLatest= [];
    if(soapTrees.all_soap_latest != null && soapTrees.all_soap_latest !== undefined) {
      Object.keys(soapTrees.all_soap_latest).forEach(function(key){
        arr.push(soapTrees.all_soap_latest[key]);
      });
      let existPrefixDate = this.handleExistPrefixDate(arr);
      allSoapLatest = arr.map((item, key)=>{
        return (
          <li key={key}>
            <div
              onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_SOAP_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))}
              className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_SOAP_LATEST)?item.class_name+" sel_open":item.class_name : ""}
              onContextMenu={e => this.handleClick(e, SOAP_TREE_CATEGORY.ALL_SOAP_LATEST, item.date)}
            >
              {this.getPrefixOfDate("", "", item, existPrefixDate)}
              <label style={{marginBottom:0}}>
                {item.sdate}
              </label>
              <label style={{marginBottom:0}}>
                {item.prefix}{this.getFlagIcon(item.numbers)}
              </label>
            </div>
          </li>
        );
      });
    }
    
    // 【プログレスノート】
    arr = [];
    var allProgressLatest = [];
    if (soapTrees.all_progress_latest != null && soapTrees.all_progress_latest!= undefined) {
      Object.keys(soapTrees.all_progress_latest).forEach(function(key){
        arr.push(soapTrees.all_progress_latest[key]);
      });
      let existPrefixDate = this.handleExistPrefixDate(arr);
      allProgressLatest = arr.map((item, key)=>{
        return <li key={key}><div onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST)?item.class_name+" sel_open":item.class_name : ""}>
          {this.getPrefixOfDate("", "", item, existPrefixDate)}
          <label style={{marginBottom:0}}>
            {item.sdate}
          </label>
          <label style={{marginBottom:0}}>
            {item.prefix}{this.getFlagIcon(item.numbers)}
          </label>
        </div></li>;
      });
    }
    // 「オーダ」
    arr = [];
    let allExecuteOrderLatest= [];
    if (soapTrees.all_execute_order_latest != null && soapTrees.all_execute_order_latest!= undefined) {
      Object.keys(soapTrees.all_execute_order_latest).forEach(function(key){
        arr.push(soapTrees.all_execute_order_latest[key]);
      });
      let existPrefixDate = this.handleExistPrefixDate(arr);
      allExecuteOrderLatest = arr.map((item, key)=>{
        return <li key={key}><div onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST)?item.class_name+" sel_open":item.class_name : ""}>
          {this.getPrefixOfDate("", "", item, existPrefixDate)}
          <label style={{marginBottom:0}}>
            {item.sdate}
          </label>
          <label style={{marginBottom:0}}>
            {item.prefix}{this.getFlagIcon(item.numbers)}
          </label>
        </div></li>;
      });
    }
    // 「結果・報告」(自科)
    arr = [];
    let currentExaminationLatest= [];
    if (soapTrees.current_examination_latest != null && soapTrees.current_examination_latest!= undefined) {
      Object.keys(soapTrees.current_examination_latest).forEach(function(key){
        arr.push(soapTrees.current_examination_latest[key]);
      });
      currentExaminationLatest = arr.map((item, key)=>{
        return (
          <li key={key}>
            <div
              onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))}
              className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST)?item.class_name+" sel_open":item.class_name : ""}
            >
              <label style={{marginBottom:0}}>
                {this.getReadStatus(item.date, item.numbers)}
                {item.sdate}
              </label>
              <label style={{marginBottom:0}}>
                {item.prefix}{this.getFlagIcon(item.numbers)}
              </label>
            </div>
          </li>
        );
      });
    }
    // 「結果・報告」(全科)
    arr = [];
    let globalExaminationLatest= [];
    if (soapTrees.global_examination_latest != null && soapTrees.global_examination_latest!= undefined) {
      Object.keys(soapTrees.global_examination_latest).forEach(function(key){
        arr.push(soapTrees.global_examination_latest[key]);
      });
      globalExaminationLatest = arr.map((item, key)=>{
        return <li key={key}>
          <idv
            onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))}
            className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST)?item.class_name+" sel_open":item.class_name : ""}
          >
            <label style={{marginBottom:0}}>
              {this.getReadStatus(item.date, item.numbers)}
              {item.sdate}
            </label>
            <label style={{marginBottom:0}}>
              {item.prefix}{this.getFlagIcon(item.numbers)}
            </label>
          </idv>
        </li>;
      });
    }
    
    arr = [];
    let allOrderLatest= [];
    if (soapTrees.all_order_latest != null && soapTrees.all_order_latest!= undefined) {
      Object.keys(soapTrees.all_order_latest).forEach(function(key){
        arr.push(soapTrees.all_order_latest[key]);
      });
      let existPrefixDate = this.handleExistPrefixDate(arr);
      allOrderLatest = arr.map((item, key)=>{
        return <li key={key}><div onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_ORDER_LATEST)?item.class_name+" sel_open":item.class_name : ""}>
          {this.getPrefixOfDate("", "", item, existPrefixDate)}
          <label style={{marginBottom:0}}>
            {item.sdate}
          </label>
          <label style={{marginBottom:0}}>
            {this.getFlagIcon(item.numbers)}
          </label>
        </div></li>;
      });
    }
    
    // 検査
    arr = [];
    let allExaminationLatest= [];
    if (soapTrees.all_examination_latest != null && soapTrees.all_examination_latest!= undefined) {
      Object.keys(soapTrees.all_examination_latest).forEach(function(key){
        arr.push(soapTrees.all_examination_latest[key]);
      });
      
      let existPrefixDate = this.handleExistPrefixDate(arr);
      
      allExaminationLatest = arr.map((item, key)=>{
        return <li key={key}><div onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST)?item.class_name+" sel_open":item.class_name : ""}>
          {this.getPrefixOfDate("", "", item, existPrefixDate)}
          <label style={{marginBottom:0}}>
            {item.sdate}
          </label>
          <label style={{marginBottom:0}}>
            {this.getFlagIcon(item.numbers)}
          </label>
        </div></li>;
      });
    }
    
    // 生理
    arr = [];
    let allInspectionLatest= [];
    if (soapTrees.all_inspection_latest != null && soapTrees.all_inspection_latest!= undefined) {
      Object.keys(soapTrees.all_inspection_latest).forEach(function(key){
        arr.push(soapTrees.all_inspection_latest[key]);
      });
      
      let existPrefixDate = this.handleExistPrefixDate(arr);
      
      allInspectionLatest = arr.map((item, key)=>{
        return <li key={key}><div onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST)?item.class_name+" sel_open":item.class_name : ""}>
          {this.getPrefixOfDate("", "", item, existPrefixDate)}
          <label style={{marginBottom:0}}>
            {item.sdate}
          </label>
          <label style={{marginBottom:0}}>
            {this.getFlagIcon(item.numbers)}
          </label>
        </div></li>;
      });
    }
    
    // 処置
    arr = [];
    let allTreatmentLatest= [];
    if (soapTrees.all_treatment_latest != null && soapTrees.all_treatment_latest!= undefined) {
      Object.keys(soapTrees.all_treatment_latest).forEach(function(key){
        arr.push(soapTrees.all_treatment_latest[key]);
      });
      
      let existPrefixDate = this.handleExistPrefixDate(arr);
      
      allTreatmentLatest = arr.map((item, key)=>{
        return <li key={key}><div onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST)?item.class_name+" sel_open":item.class_name : ""}>
          {this.getPrefixOfDate("", "", item, existPrefixDate)}
          <label style={{marginBottom:0}}>
            {item.sdate}
          </label>
          <label style={{marginBottom:0}}>
            {this.getFlagIcon(item.numbers)}
          </label>
        </div></li>;
      });
    }
    // リハビリ
    arr = [];
    let allRehabilyLatest= [];
    if (soapTrees.all_rehabily_latest != null && soapTrees.all_rehabily_latest!= undefined) {
      Object.keys(soapTrees.all_rehabily_latest).forEach(function(key){
        arr.push(soapTrees.all_rehabily_latest[key]);
      });
      
      let existPrefixDate = this.handleExistPrefixDate(arr);
      
      allRehabilyLatest = arr.map((item, key)=>{
        return <li key={key}><div onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST)?item.class_name+" sel_open":item.class_name : ""}>
          {this.getPrefixOfDate("", "", item, existPrefixDate)}
          <label style={{marginBottom:0}}>
            {item.sdate}
          </label>
          <label style={{marginBottom:0}}>
            {this.getFlagIcon(item.numbers)}
          </label>
        </div></li>;
      });
    }
    // 処置
    arr = [];
    let allRadiationLatest= [];
    if (soapTrees.all_radiation_latest != null && soapTrees.all_radiation_latest!= undefined) {
      Object.keys(soapTrees.all_radiation_latest).forEach(function(key){
        arr.push(soapTrees.all_radiation_latest[key]);
      });
      
      let existPrefixDate = this.handleExistPrefixDate(arr);
      
      allRadiationLatest = arr.map((item, key)=>{
        return <li key={key}><div onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST)?item.class_name+" sel_open":item.class_name : ""}>
          {this.getPrefixOfDate("", "", item, existPrefixDate)}
          <label style={{marginBottom:0}}>
            {item.sdate}
          </label>
          <label style={{marginBottom:0}}>
            {this.getFlagIcon(item.numbers)}
          </label>
        </div></li>;
      });
    }
    
    // 付箋ツリー
    arr = [];
    let allSoapTagLatest= [];
    if (soapTrees.all_soap_tag_latest != null && soapTrees.all_soap_tag_latest !== undefined) {
      Object.keys(soapTrees.all_soap_tag_latest).forEach(function(key){
        arr.push(soapTrees.all_soap_tag_latest[key]);
      });
      
      allSoapTagLatest = arr.map((item, key)=>{
        return <li key={key}><div onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST)?item.class_name+" sel_open":item.class_name : ""}>
          <label style={{marginBottom:0}}>
            {item.sdate}
          </label>
          <label style={{marginBottom:0}}>
            {this.getFlagIcon(item.numbers)}
          </label>
        </div></li>;
      });
    }
    
    arr = [];
    let allConditionList= [];
    if (soapTrees.search_condition !== undefined && soapTrees.search_condition != null) {
      Object.keys(soapTrees.search_condition).forEach(function(key){
        arr.push(soapTrees.search_condition[key]);
      });
      allConditionList = arr.map((item, key)=>{
        return <li key={key}>
                <span
                  onClick={e => this.getKarteTreeByCondition(e, item)}
                  className={(this.state.search_condition_number !== undefined && this.state.search_condition_number === item.number) ? "sel_open" : ""}
                >
                    {item.search_condition_name}
                </span>
        </li>;
      });
    }
    
    const currentSoap = soapTrees.current_soap !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.CURRENT_SOAP, soapTrees.current_soap, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.CURRENT_SOAP)) : "";
    
    const allSoap = soapTrees.all_soap !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.ALL_SOAP, soapTrees.all_soap, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_SOAP)) : "";
    
    const allHospital = soapTrees.all_hospital != undefined ?
      this.generateHospitalTrees(SOAP_TREE_CATEGORY.ALL_HOSPITAL_ORDER, soapTrees.all_hospital, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_HOSPITAL_ORDER)):'';
    
    const allProgress = soapTrees.all_progress !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.ALL_PROGRESS, soapTrees.all_progress, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_PROGRESS)) : "";
    
    const allExecuteOrder = soapTrees.all_execute_order !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER, soapTrees.all_execute_order, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER)) : "";
    
    const currentExamination = soapTrees.current_examination !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.CURRENT_EXAMINATION, soapTrees.current_examination, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.CURRENT_EXAMINATION)) : "";
    
    const globalExamination = soapTrees.global_examination !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION, soapTrees.global_examination, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION)) : "";
    
    const allOrder = soapTrees.all_order !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.ALL_ORDER, soapTrees.all_order, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_ORDER)) : "";
    
    const allExamination = soapTrees.all_examination !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.ALL_EXAMINATION, soapTrees.all_examination, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_EXAMINATION)) : "";
    
    const allInspection = soapTrees.all_inspection !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.ALL_INSPECTION, soapTrees.all_inspection, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_INSPECTION)) : "";
    
    const allTreatment = soapTrees.all_treatment !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.ALL_TREATMENT, soapTrees.all_treatment, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_TREATMENT)) : "";
    
    const allRadiation = soapTrees.all_radiation !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.ALL_RADIATION, soapTrees.all_radiation, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_RADIATION)) : "";
    
    const allRehabily = soapTrees.all_rehabily !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.ALL_REHABILY, soapTrees.all_rehabily, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_REHABILY)) : "";
    
    const allSoapTag = soapTrees.all_soap_tag !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.ALL_SOAP_TAG, soapTrees.all_soap_tag, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_SOAP_TAG)) : "";
    {/*
    const allSoap = soapTrees.all_soap !== undefined ?
      soapTrees.all_soap.map(department => {
        return (
          <ul key={department.department}>
            {department.data.length > 0 && (
              <li onClick={e => this.changeSoapList(e, department.department)}>
                <span className={department.class_name !== undefined ? department.class_name : ""}>{this.getDepartment(department.department)}</span>
                {(department.class_name !== undefined
                  && department.class_name.includes("open")) && (
                    this.generateTrees(department.department, department.data)
                  )}
              </li>
            )}
          </ul>
        )
      }) : "";
*/}
    
    return (
      <Col id="soapTreeView" font_props = {this.props.font_props} className={'soapTreeView'}>
        <nav>
          <ul>
            <li className={this.state.bOpenCurrentSoap?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_SOAP, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />自科カルテ({this.props.departmentStr})</span>
            </li>
            <li className={this.state.bOpenCurrentSoap?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_SOAP, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />自科カルテ({this.props.departmentStr})</span>
              {currentSoapLatest.length > 0 && (
                <>
                  <ul>
                    <li className={this.state.bOpenCurrentSoapLatest?"tree_close":""}>
                      <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15日</span>
                    </li>
                    <li className={this.state.bOpenCurrentSoapLatest?"":"tree_close"}>
                      <span className={this.state.categoryType == SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST || this.state.categoryType == -1 ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_SOAP_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15日</span>
                      <ul>
                        {currentSoapLatest}
                      </ul>
                    </li>
                  </ul>
                  {currentSoap}
                </>
              )}
            </li>
            <li className={this.state.bOpenAllSoap?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_SOAP, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />全科カルテ</span>
            </li>
            <li className={this.state.bOpenAllSoap?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_SOAP, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />全科カルテ</span>
              <ul>
                <li className={this.state.bOpenAllSoapLatest?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_SOAP_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15日</span>
                </li>
                <li className={this.state.bOpenAllSoapLatest?"":"tree_close"}>
                  <span className={this.state.categoryType == SOAP_TREE_CATEGORY.ALL_SOAP_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_SOAP_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15日</span>
                  <ul>{allSoapLatest}</ul>
                </li>
              </ul>
              {allSoap}
            </li>
            <li className={this.state.bOpenAllHospital?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_HOSPITAL_ORDER, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />入院</span>
            </li>
            <li className={this.state.bOpenAllHospital?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_HOSPITAL_ORDER, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />入院</span>
              {allHospital}
            </li>
            <li className={this.state.bOpenAllProgress?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_PROGRESS, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />SOAP</span>
            </li>
            <li className={this.state.bOpenAllProgress?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_PROGRESS, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />SOAP</span>
              <ul>
                <li className={this.state.bOpenAllProgressLatest?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15日</span>
                </li>
                <li className={this.state.bOpenAllProgressLatest?"":"tree_close"}>
                  <span className={this.state.categoryType == SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_PROGRESS_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15日</span>
                  <ul>
                    {allProgressLatest}
                  </ul>
                </li>
              </ul>
              {allProgress}
            </li>
            <li className={this.state.bOpenAllExecuteOrder?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />オーダー</span>
            </li>
            <li className={this.state.bOpenAllExecuteOrder?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />オーダー</span>
              <ul>
                <li className={this.state.bOpenAllExecuteOrderLatest?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15日</span>
                </li>
                <li className={this.state.bOpenAllExecuteOrderLatest?"":"tree_close"}>
                  <span className={this.state.categoryType == SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXECUTE_ORDER_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15日</span>
                  <ul>
                    {allExecuteOrderLatest}
                  </ul>
                </li>
              </ul>
              {allExecuteOrder}
            </li>
            <li className={this.state.bOpenGroupExamination?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.GROUP_EXAMINATION, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />結果・報告</span>
            </li>
            <li className={this.state.bOpenGroupExamination?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.GROUP_EXAMINATION, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />結果・報告</span>
              <ul>
                <li className={this.state.bOpenCurrentExamination?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_EXAMINATION, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />自科({this.props.departmentStr})</span>
                </li>
                <li className={this.state.bOpenCurrentExamination?"":"tree_close"}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_EXAMINATION, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />自科({this.props.departmentStr})</span>
                  <ul className="test">
                    <li className={this.state.bOpenCurrentExaminationLatest?"tree_close":""}>
                      <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15日</span>
                    </li>
                    <li className={this.state.bOpenCurrentExaminationLatest?"":"tree_close"}>
                      <span className={this.state.categoryType == SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.CURRENT_EXAMINATION_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15日</span>
                      <ul>
                        {currentExaminationLatest}
                      </ul>
                    </li>
                  </ul>
                  {currentExamination}
                </li>
                <li className={this.state.bOpenGlobalExamination?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />全科</span>
                </li>
                <li className={this.state.bOpenGlobalExamination?"":"tree_close"}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />全科</span>
                  <ul>
                    <li className={this.state.bOpenGlobalExaminationLatest?"tree_close":""}>
                      <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15日</span>
                    </li>
                    <li className={this.state.bOpenGlobalExaminationLatest?"":"tree_close"}>
                      <span className={this.state.categoryType == SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.GLOBAL_EXAMINATION_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15日</span>
                      <ul>
                        {globalExaminationLatest}
                      </ul>
                    </li>
                  </ul>
                  {globalExamination}
                </li>
              </ul>
            </li>
            <li className={this.state.bOpenAllOrder?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_ORDER, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />処方・注射</span>
            </li>
            <li className={this.state.bOpenAllOrder?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_ORDER, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />処方・注射</span>
              <ul>
                <li className={this.state.bOpenAllOrderLatest?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15件</span>
                </li>
                <li className={this.state.bOpenAllOrderLatest?"":"tree_close"}>
                  <span className={this.state.categoryType == SOAP_TREE_CATEGORY.ALL_ORDER_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_ORDER_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15件</span>
                  <ul>
                    {allOrderLatest}
                  </ul>
                </li>
              </ul>
              {allOrder}
            </li>
            <li className={this.state.bOpenAllExamination?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />検査</span>
            </li>
            <li className={this.state.bOpenAllExamination?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />検査</span>
              <ul>
                <li className={this.state.bOpenAllExaminationLatest?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15件</span>
                </li>
                <li className={this.state.bOpenAllExaminationLatest?"":"tree_close"}>
                  <span className={this.state.categoryType == SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15件</span>
                  <ul>
                    {allExaminationLatest}
                  </ul>
                </li>
              </ul>
              {allExamination}
            </li>
            <li className={this.state.bOpenAllInspection?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_INSPECTION, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />生理</span>
            </li>
            <li className={this.state.bOpenAllInspection?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_INSPECTION, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />生理</span>
              <ul>
                <li className={this.state.bOpenAllInspectionLatest?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15件</span>
                </li>
                <li className={this.state.bOpenAllInspectionLatest?"":"tree_close"}>
                  <span className={this.state.categoryType == SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_INSPECTION_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15件</span>
                  <ul>
                    {allInspectionLatest}
                  </ul>
                </li>
              </ul>
              {allInspection}
            </li>
            <li className={this.state.bOpenAllTreatment?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_TREATMENT, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />処置</span>
            </li>
            <li className={this.state.bOpenAllTreatment?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_TREATMENT, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />処置</span>
              <ul>
                <li className={this.state.bOpenAllTreatmentLatest?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15件</span>
                </li>
                <li className={this.state.bOpenAllTreatmentLatest?"":"tree_close"}>
                  <span className={this.state.categoryType == SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_TREATMENT_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15件</span>
                  <ul>
                    {allTreatmentLatest}
                  </ul>
                </li>
              </ul>
              {allTreatment}
            </li>
            <li className={this.state.bOpenAllRehabily?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_REHABILY, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />リハビリ</span>
            </li>
            <li className={this.state.bOpenAllRehabily?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_REHABILY, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />リハビリ</span>
              <ul>
                <li className={this.state.bOpenAllRehabilyLatest?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15件</span>
                </li>
                <li className={this.state.bOpenAllRehabilyLatest?"":"tree_close"}>
                  <span className={this.state.categoryType == SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_REHABILY_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15件</span>
                  <ul>
                    {allRehabilyLatest}
                  </ul>
                </li>
              </ul>
              {allRehabily}
            </li>
            <li className={this.state.bOpenAllRadiation?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_RADIATION, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />放射線</span>
            </li>
            <li className={this.state.bOpenAllRadiation?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_RADIATION, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />放射線</span>
              <ul>
                <li className={this.state.bOpenAllRadiationLatest?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15件</span>
                </li>
                <li className={this.state.bOpenAllRadiationLatest?"":"tree_close"}>
                  <span className={this.state.categoryType == SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_RADIATION_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15件</span>
                  <ul>
                    {allRadiationLatest}
                  </ul>
                </li>
              </ul>
              {allRadiation}
            </li>
            <li className={this.state.bOpenSearchCondition?"tree_close":""} onContextMenu={e => this.handleClick(e)}>
              <span className={this.state.search_condition_number !== undefined ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.SEARCH_CONDITION, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />詳細検索</span>
            </li>
            <li className={this.state.bOpenSearchCondition?"":"tree_close"} onContextMenu={e => this.handleClick(e)}>
              <span className={this.state.search_condition_number !== undefined ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.SEARCH_CONDITION, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />詳細検索</span>
              <ul>{allConditionList}</ul>
            </li>
            <li className={this.state.bOpenAllSoapTag?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_SOAP_TAG, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />付箋ツリー</span>
            </li>
            <li className={this.state.bOpenAllSoapTag?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_SOAP_TAG, TREE_FLAG.CLOSE_TREE)}><Icon font_props = {this.props.font_props} icon={faMinus} />付箋ツリー</span>
              <ul>
                <li className={this.state.bOpenAllSoapTagLatest?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST, TREE_FLAG.OPEN_TREE)}><Icon font_props = {this.props.font_props} icon={faPlus} />最新15件</span>
                </li>
                <li className={this.state.bOpenAllSoapTagLatest?"":"tree_close"}>
                  <span className={this.state.categoryType == SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST ? "sel_open" : ""} onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_SOAP_TAG_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon font_props = {this.props.font_props} icon={faMinus} />最新15件</span>
                  <ul>
                    {allSoapTagLatest}
                  </ul>
                </li>
              </ul>
              {allSoapTag}
            </li>
          </ul>
        </nav>
        {this.state.openSearchDetailModal && (
          <SearchConditionModal
            closeModal={this.closeModal}
            searchExecute={this.getKarteTreeByCondition}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          condition_number={this.state.search_condition_number}
          parent={this}
        />
        {this.state.isOpenKarteSealPrint && (
          <KarteSealPrint
            closeModal={this.closeModal}
            search_condition={this.state.seal_print_info}
          />
        )}
      </Col>
    );
  }
}
LeftBox.contextType = Context;

LeftBox.propTypes = {
  soapTrees: PropTypes.array,
  changeSoapList: PropTypes.func,
  departmentStr: PropTypes.string,
  bOpenCurrentSoap: PropTypes.boolean,
  bOpenAllSoap: PropTypes.boolean,
  bOpenAllExecuteOrder: PropTypes.boolean,
  bOpenGroupExamination: PropTypes.boolean,
  bOpenCurrentExamination: PropTypes.boolean,
  bOpenGlobalExamination: PropTypes.boolean,
  bOpenAllOrder: PropTypes.boolean,
  bOpenAllExamination: PropTypes.boolean,
  bOpenAllInspection: PropTypes.boolean,
  bOpenAllTreatment: PropTypes.boolean,
  bOpenAllRehabily: PropTypes.boolean,
  bOpenAllRadiation: PropTypes.boolean,
  bOpenAllSoapTag: PropTypes.boolean,
  bOpenCurrentSoapLatest: PropTypes.boolean,
  bOpenAllSoapLatest: PropTypes.boolean,
  bOpenAllExecuteOrderLatest: PropTypes.boolean,
  bOpenCurrentExaminationLatest: PropTypes.boolean,
  bOpenGlobalExaminationLatest: PropTypes.boolean,
  bOpenAllOrderLatest: PropTypes.boolean,
  bOpenAllExaminationLatest: PropTypes.boolean,
  bOpenAllInspectionLatest: PropTypes.boolean,
  bOpenAllTreatmentLatest: PropTypes.boolean,
  bOpenAllRadiationLatest: PropTypes.boolean,
  bOpenAllSoapTagLatest: PropTypes.boolean,
  bOpenAllRehabilyLatest: PropTypes.boolean,
  bOpenSearchCondition: PropTypes.boolean,
  bOpenAllHospital:PropTypes.boolean,
  bOpenAllProgress: PropTypes.boolean,
  bOpenAllProgressLatest: PropTypes.boolean,
  setOpenClose: PropTypes.func,
  categoryType: PropTypes.number,
  selYear: PropTypes.number,
  selMonth: PropTypes.number,
  selDay: PropTypes.number,
  allTags: PropTypes.array,
  allDateList: PropTypes.array,
  getAllKarteTree:PropTypes.func,
  search_condition_number:PropTypes.number,
  font_props:PropTypes.number,
  closeRightClickMenu:PropTypes.func,
}

export default LeftBox;
