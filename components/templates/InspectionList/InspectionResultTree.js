import React, { Component } from "react";
import styled from "styled-components";
import {
  surface
} from "../../_nano/colors";
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
  width: 410px;
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
  }
`;

const weekDayOptions = [
  '日',
  '月',
  '火',
  '水',
  '木',
  '金',
  '土'
];

class InspectionResultTree extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
  }

  componentDidMount() {
    $("#soapTreeView").scrollTop(this.props.curScrollTop);     
  }

  getDepartment = id => {
    let departmentStr = "";
    this.departmentOptions.map(item => {
      if (item.id === id) {
        departmentStr = item.value;
      }
    });

    return departmentStr;
  };

  getOffset = (el) => {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
  };

  getCurCategoryStatus = (nType) => {
      return  this.props.categoryType === nType;
  };

  changeSoapList = (e, department, year = -1, month = -1, date = -1, nCategoryType = -1) => {   
    e.preventDefault();
    e.stopPropagation();
    this.props.changeSoapList(department, year, month, date, nCategoryType);
    if (month == -1 && date == -1) {
      var nType;
      switch(department){        
        case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
          nType = SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST;
          break;        
      }
      this.props.setOpenClose(nType, TREE_FLAG.CLOSE_TREE);
    } 

    // open category
    if (nCategoryType > 0) {
      switch(nCategoryType){        
        case SOAP_TREE_CATEGORY.ALL_EXAMINATION:
          nType = SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST;
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
    var soapTrees = this.props.soapTrees;
    switch(nType){      
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION:  
        if (soapTrees !== undefined && soapTrees.all_examination_latest!= undefined && soapTrees.all_examination_latest != null) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST, -1, -1, -1);
        }      
        break;      
      case SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST:
        if (soapTrees !== undefined && soapTrees.all_examination_latest!= undefined && soapTrees.all_examination_latest != null) {
          this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST, -1, -1, -1);
        }        
        break;      
    }
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
                  className={item.class_name !== undefined ? nOpen && itemIndex == this.props.selYear?item.class_name+" sel_open":item.class_name : ""}
              >
                  {(item.class_name !== undefined && nOpen && itemIndex == this.props.selYear) ? (
                      <Icon icon={faMinus} />
                  ) : (
                      <Icon icon={faPlus} />
                  )}
                  {item.year}年
              </span>
                {(item.class_name !== undefined && item.class_name.includes("open") && (
                  <ul>
                    {item.data.map((monthItem, monthItemIndex) => {
                      return (
                        <>
                        {monthItem.data.length > 0 && (
                          <li key={monthItem.month}>
                            <span
                                onClick={e => this.changeSoapList(e, department, itemIndex, monthItemIndex)}
                                className={monthItem.class_name !== undefined ? nOpen && monthItemIndex == this.props.selMonth?monthItem.class_name+" sel_open":monthItem.class_name : ""}
                            >
                                {(monthItem.class_name !== undefined && nOpen && monthItemIndex == this.props.selMonth) ? (
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
                                        <span
                                            onClick={e => this.changeSoapList(e, department, itemIndex, monthItemIndex, dateIndex)}
                                            className={data.class_name !== undefined ? nOpen && dateIndex == this.props.selDay?data.class_name+" sel_open":data.class_name : ""}
                                        >
                                            {data.sdate}
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

  render() {
    const { soapTrees } = this.props;

    var arr = [];
    let selDate = this.props.selYear + "-" + this.props.selMonth + "-" + this.props.selDay;   

    // 検査
    arr = [];
    let allExaminationLatest= [];
      if (soapTrees !== undefined && soapTrees != null && soapTrees.all_examination_latest !== undefined && soapTrees.all_examination_latest != null && Object.keys(soapTrees.all_examination_latest).length > 0) {
      Object.keys(soapTrees.all_examination_latest).forEach(function(key){
        arr.push(soapTrees.all_examination_latest[key]);
      });

      allExaminationLatest = arr.map((item, key)=>{
        return <li key={key}><span onClick={e => this.changeSoapList(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST, item.date.substring(0, 4), item.date.substring(5, 7), item.date.substring(8, 10))} className={item.class_name !== undefined ? item.date == selDate && this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST)?item.class_name+" sel_open":item.class_name : ""}>{item.sdate}</span></li>;
      });      
    }
    
    const allExamination = soapTrees !== undefined && soapTrees.all_examination !== undefined ?
      this.generateTrees(SOAP_TREE_CATEGORY.ALL_EXAMINATION, soapTrees.all_examination, this.getCurCategoryStatus(SOAP_TREE_CATEGORY.ALL_EXAMINATION)) : "";
    
    return (
      <Col id="soapTreeView">      
        <nav>
          <ul>            
            <li className={this.props.bOpenAllExamination?"tree_close":""}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION, TREE_FLAG.OPEN_TREE)}><Icon icon={faPlus} />検査</span>
            </li>
            <li className={this.props.bOpenAllExamination?"":"tree_close"}>
              <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION, TREE_FLAG.CLOSE_TREE)}><Icon icon={faMinus} />検査</span>
              <ul>
                <li className={this.props.bOpenAllExaminationLatest?"tree_close":""}>
                  <span onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST, TREE_FLAG.OPEN_TREE)}><Icon icon={faPlus} />最新15件</span>
                </li>
                <li className={this.props.bOpenAllExaminationLatest?"":"tree_close"}>
                  <span className="sel_open" onClick={e => this.setOpenClose(e, SOAP_TREE_CATEGORY.ALL_EXAMINATION_LATEST, TREE_FLAG.CLOSE_LATEST)}><Icon icon={faMinus} />最新15件</span>
                  <ul>
                  {allExaminationLatest}             
                  </ul>
                </li>
              </ul>              
              {allExamination}
            </li>            
          </ul>
        </nav>
      </Col>
    );
  }
}
InspectionResultTree.contextType = Context;

InspectionResultTree.propTypes = {
  soapTrees: PropTypes.array,
  changeSoapList: PropTypes.func,
  departmentStr: PropTypes.string,
  bOpenCurrentSoap: PropTypes.boolean,
  bOpenAllSoap: PropTypes.boolean,
  bOpenAllOrder: PropTypes.boolean,
  bOpenAllExamination: PropTypes.boolean,
  bOpenAllInspection: PropTypes.boolean,
  bOpenAllTreatment: PropTypes.boolean,
  bOpenAllRehabily: PropTypes.boolean,
  bOpenAllRadiation: PropTypes.boolean,
  bOpenCurrentSoapLatest: PropTypes.boolean,
  bOpenAllSoapLatest: PropTypes.boolean,
  bOpenAllOrderLatest: PropTypes.boolean,
  bOpenAllExaminationLatest: PropTypes.boolean,
  bOpenAllInspectionLatest: PropTypes.boolean,
  bOpenAllTreatmentLatest: PropTypes.boolean,
  bOpenAllRadiationLatest: PropTypes.boolean,
  bOpenAllRehabilyLatest: PropTypes.boolean,
  curScrollTop: PropTypes.number,
  setOpenClose: PropTypes.func,
  setCurScrollTop: PropTypes.func,
  categoryType: PropTypes.number,
  selYear: PropTypes.number,
  selMonth: PropTypes.number,
  selDay: PropTypes.number,

}

export default InspectionResultTree;
