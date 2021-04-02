import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import {formatDateLine, getWeekName} from "~/helpers/date";
import axios from "axios/index";
import {
  formatJapan,
  getNextDayByJapanFormat,
  getAfterDayByJapanFormat,
  getPrevDayByJapanFormat,
  formatDateTimeIE,
  formatTimeIE,
  formatTime,
} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Spinner from "react-bootstrap/Spinner";
import Checkbox from "~/components/molecules/Checkbox";
import renderHTML from 'react-render-html';
import VitalChart from "~/components/organisms/VitalChart";
import {toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import Button from "~/components/atoms/Button";
import * as localApi from "~/helpers/cacheLocal-utils";
import * as sessApi from "~/helpers/cacheSession-utils";
import { CACHE_SESSIONNAMES, filterShow} from "~/helpers/constants";
import ProgressChartSet from "../../Nurse/ProgressChart/ProgressChartSet";
import ProgressGraphChange from "../../Nurse/ProgressChart/ProgressGraphChange";
import ChartTitleModal from "../../Nurse/ProgressChart/ChartTitleModal";
import CreateFreeTitleModal from "../../Nurse/ProgressChart/CreateFreeTitleModal";
import ResultInsert from "../../Nurse/ProgressChart/ResultInsert";
import ElapsedResultHistoryModal from "../../Nurse/ProgressChart/ElapsedResultHistoryModal";
import BasicInfoInputModal from "../components/BasicInfoInputModal";
import ProgressPlanModal from "../../Nurse/ProgressChart/ProgressPlanModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import InspectionStartEndDateTimeRegister from "~/components/templates/Patient/Modals/Physiological/InspectionStartEndDateTimeRegister";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import OxygenCalculateModal from "~/components/templates/Patient/Modals/OutPatient/OxygenCalculateModal";
import SelectDoctorModal from "~/components/molecules/SelectDoctorModal";
import ProgressChartInspectionModal
  from "~/components/templates/Patient/Modals/Physiological/ProgressChartInspectionModal";
import InspectionDoneModal from "~/components/templates/OrderList/InspectionDoneModal";
import TreatDoneModal from "../../OrderList/TreatDoneModal";
import OutPatientModal from "../../Patient/Modals/OutPatient/OutPatientModal";
import {formatDateSlash} from "../../../../helpers/date";
import $ from "jquery";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  font-size:1rem;
  .flex {display: flex;}
  .check-box{
    margin-left: 0.5rem;
    label {
      font-size: 1rem;
      line-height:2rem;
    }
  }
  .pullbox-label {
    margin-bottom: 0;
    .pullbox-select {
      width: 10rem;
      height: 2rem;
    }
  }

  .search-patient-area{
    margin-left: 1rem;
  }
  .select-box {
    margin-left: 1rem;
    .pullbox-label {
      select {width:100%;}
    }
  }
  .select-ward {
    margin-left: 1rem;
    .label-title {
      width:3rem;
      margin:0;
      margin-left:0.5rem;
      line-height: 2rem;
      text-align:left;
      font-size: 1rem;
    }
    select {
      height: 2rem;
      font-size: 1rem;
    }
  }
  .border-style{
    border-bottom: 1px solid #aaa;
  }
  .label-title {
    width: 5rem;
    line-height: 2rem;
    margin: 0;
    font-size:1rem;
  }
  .btn-area{
    text-align:left;
    width:calc(100% - 30rem);
    button {
     height:2rem;
    }
  }
  .select-date {
    margin-bottom: 0.5rem;
    .date-label {
      height:2rem;
      line-height:2rem;
      margin-right:0.5rem;
    }
    button {
      height:2rem;
      margin-right:0.5rem;
    }
    .view-date {
      padding:0 0.3rem;
      height:2rem;
      line-height:2rem;
      border:1px solid #aaa;
    }
    .check-area {
      margin-top: 0.4rem;
    }
    .footer-buttons {
      button{
        padding: 0.2rem;
        span {
          font-size: 1rem;
        }
      }
    }
  }
  .select-schedule-date .label-title {
      text-align: left;
      width: 40px;
  }
  
  .calendar-area {
    width: 100%;
    height: calc(100% - 2.5rem);
    .wrapper {
      position: relative;
      border: 1px solid #aaa;
      white-space: nowrap;
      width: 100%;
      height: 100%;
    }
    #tbody-body{
      width:100%;
      height: calc(100vh - 120px - 11rem);
      overflow-y:scroll;
      display:block;    
      overflow-x: hidden;    
    }
    table {
      thead{
        display: table;
        width: calc(100% - 16px);
      }
      margin-bottom:0;
      tr{
        width: 100%;          
      }
      th {
        text-align: center;
        vertical-align: middle;
        padding:0;        
      }
      td {
        text-align:left;
        padding:0rem;
        vertical-align: middle;
        word-break: break-all;
        white-space: normal;
        .label-title {
          width: 0;
        }
        .pullbox{
          width:100%;
        }
        .pullbox-select, .pullbox-label {
          width: 100%;
        }
        textarea {
          width: 100%;
        }
      }
      .problem-td {
        width: 1.5rem;
        min-width: 1.5rem;
      }
      .plan-name-td {
        width: 7rem;
        min-width: 7rem;
      }
      .plan-class-td {
        width: 1.5rem;
        min-width: 1.5rem;
      }
    }
    .chat-image {
      canvas {width:100%;}
    }
    .sticky-col {
      position: sticky;
      position: -webkit-sticky;
      padding: 0;
      background: white;
      div {
        padding:0 0.2rem;
      }
    }
    .content-td{
      padding-left 0px;
    }
    .two-coloum {
      width: 6rem;
    }
    .three-coloum {
      min-width: 12.8rem;
    }
    .td-first {
      width: 2rem;
    }
    .td-second {
      width: 7rem;
    }
    .td-third {
      min-width: 9.7rem;        
    }
    .td-div-border {
      border-right:1px solid #dee2e6;
      line-height:2.5rem;
      width:100%;
    }
    .clickable{
      cursor:pointer;
    }
  }
  .custom-axis{
    width:100%;      
  }
  .axis-title{
    font-size:1rem;
    width: 25%;
    margin-bottom: 0px;
    text-align: center;
    margin-left:0;
    padding-right:5%;
  }
  .axis-y{
    font-size:0.9rem;
    width: 25%;
    margin-left:0;      
    display:flex;
    padding-left:3%;
    .y-line{
      height:18.5rem;
      background:black;
      width:1px;
      margin-top:0.7rem;
    }
    .axis-values{
      height:20rem;
    }
    .y-value{
      margin-bottom:3.2rem;
      text-align:right;
      font-size:0.95rem;
    }
  }
  .chat-image{
    div:first-child {
      left:-0.3rem;
    }
  }

  .disabled-td{
    background:lightgray;
  }
  .border-right-dot{
    border-right: 1px dotted #dee2e6;
    min-height:2.5rem;
  }
  .numeric-input{
    ime-mode:inactive;
  }
`;

const ContextMenuUl = styled.div`
  margin-bottom: 0;
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
    font-size: 14px;
    font-weight: normal;
    line-height: 1.125rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 1rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const SpinnerWrapper = styled.div`
    margin: auto;
    height:200px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ContextMenu = ({visible,x,y,item, cur_date, index,treat_detail_id,parent}) => {
  let can_write = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").progress_chart_is_writable_in_nursing_document;
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }} id = 'long-context-menu'>
          {item == 'title' && (<>
              {can_write == "ON" && (
                <>
                  <li onClick={() => parent.contextMenuAction('title_create', cur_date)}><div>観察項目追加</div></li>
                  {/* <li onClick={() => parent.contextMenuAction('free_title_create', cur_date)}><div>観察項目追加（フリー入力）</div></li> */}
                  {index.is_from_plan != true && (
                    <>
                    <li onClick={() => parent.contextMenuAction('title_edit', cur_date, index)}><div>観察項目編集</div></li>
                    <li onClick={() => parent.contextMenuAction('title_stop', cur_date, index)}><div>観察項目中止</div></li>
                    </>
                  )}
                </>
              )}
              <li onClick={() => parent.contextMenuAction('first', cur_date, index)}><div>一番上へ</div></li>
              <li onClick={() => parent.contextMenuAction('prev', cur_date, index)}><div>上へ</div></li>
              <li onClick={() => parent.contextMenuAction('next', cur_date, index)}><div>下へ</div></li>
              <li onClick={() => parent.contextMenuAction('last', cur_date, index)}><div>一番下へ</div></li>
              {/* {can_write == "ON" && index !== undefined && index.tier_3rd_id != null && index.tier_3rd_id > 0 && (
                <li onClick={() => parent.contextMenuAction('result_insert', cur_date, index)}><div>詳細</div></li>
              )} */}
            </>
          )}
          {item == 'free_title' && (
          <>
            {can_write == "ON" && (
              <>
                <li onClick={() => parent.contextMenuAction('title_create', cur_date)}><div>観察項目追加</div></li>
                <li onClick={() => parent.contextMenuAction('free_title_edit', cur_date, index)}><div>観察項目編集</div></li>
                <li onClick={() => parent.contextMenuAction('title_stop', cur_date, index)}><div>観察項目中止</div></li>
              </>
            )}
            <li onClick={() => parent.contextMenuAction('first', cur_date, index)}><div>一番上へ</div></li>
            <li onClick={() => parent.contextMenuAction('prev', cur_date, index)}><div>上へ</div></li>
            <li onClick={() => parent.contextMenuAction('next', cur_date, index)}><div>下へ</div></li>
            <li onClick={() => parent.contextMenuAction('last', cur_date, index)}><div>一番下へ</div></li>
          </>
          )}
          {(can_write == "ON") && (item == 'graph') && (<>
              <li onClick={() => parent.contextMenuAction('graph_change', cur_date)}><div>修正</div></li>
            </>
          )}
          {(can_write == "ON") && (item == 'treatment' && parent.getTreatData(cur_date) != '') && (
            <li onClick={() => parent.openTreatmentDetail(cur_date)}><div>{parent.getTreatState(cur_date) == 1 ? "詳細" : "実施"}</div></li>
          )}
          {can_write == "ON" && item === "multi_treatment" && (
            <>
              {index.end_date == null && (
                <>
                  {index.start_date != null && (new Date(index.start_date.split('-').join('/')).getTime() <= new Date(cur_date.split('-').join('/')).getTime()) && (
                    <><li onClick={() => parent.contextMenuAction('treatment_done', cur_date, index)}><div>実施</div></li>
                    <li onClick={() => parent.contextMenuAction('treatment_end_date_register', cur_date, index)}><div>終了日登録</div></li></>
                  )}
                </>
              )}
            </>
          )}
          {(can_write == "ON") && (item == 'treatment' || item == "multi_treatment" || item == "blank_title") && (
            <>
              <li onClick={() => parent.contextMenuAction('title_create', cur_date)}><div>観察項目追加</div></li>
              {/* <li onClick={() => parent.contextMenuAction('free_title_create', cur_date)}><div>観察項目追加（フリー入力）</div></li> */}
            </>
          )}
          {(can_write == "ON" && (item === "elapsed_treat" || item === "treatment")) && (
            <li onClick={() => parent.contextMenuAction('create_treatment', cur_date, index)}><div>オーダー代理入力</div></li>
          )}
          {(can_write == "ON") && (item === "tmp_inspection_data") && (
            <li onClick={() => parent.contextMenuAction('create_inspection', cur_date, index)}><div>オーダー代理入力</div></li>
          )}
          {(can_write == "ON") && (item === "inspection_data") && (
            <>
              {index.order_data.end_date === undefined ? (
                <>
                  {index.order_data.start_date === undefined ? (
                    <>
                      {(new Date(formatDateLine(new Date(index.order_data.inspection_DATETIME.split('-').join('/'))).split('-').join('/')).getTime() <= new Date(cur_date.split('-').join('/')).getTime()) && (
                        <li onClick={() => parent.contextMenuAction('inspection_start_date_register', cur_date, index)}><div>開始日時登録</div></li>
                      )}
                    </>
                  ):(
                    <>
                      {(new Date(cur_date.split('-').join('/')).getTime() >= new Date(formatDateLine(new Date(index.order_data.start_date.split('-').join('/'))).split('-').join('/')).getTime()) && (
                        <>
                          {(index.every_day_continue_type == 1) && (
                            <>
                              {(index.performed_multiple_times_type == 1) ? (
                                <li onClick={() => parent.contextMenuAction('inspection_continue_date_register_done', cur_date, index)}><div>実施日時登録</div></li>
                              ):(
                                <>
                                  {(index[cur_date] === undefined) && (new Date(cur_date.split('-').join('/')).getTime() > new Date(index.order_data.start_date.split('-').join('/')).getTime()) && (
                                    <li onClick={() => parent.contextMenuAction('inspection_continue_date_register', cur_date, index)}><div>継続登録</div></li>
                                  )}
                                </>
                              )}
                            </>
                          )}
                          <li onClick={() => parent.contextMenuAction('inspection_end_date_register', cur_date, index)}><div>終了日時登録</div></li>
                        </>
                      )}
                    </>
                  )}
                </>
              ):(
                <>
                  {(new Date(cur_date.split('-').join('/')).getTime() >= new Date((index.order_data.start_date.split(' ')[0]).split('-').join('/')).getTime()) && (new Date(cur_date.split('-').join('/')).getTime() <= new Date(index.order_data.end_date.split('-').join('/')).getTime()) && (
                    <li onClick={() => parent.contextMenuAction('inspection_detail', cur_date, index)}><div>詳細</div></li>
                  )}
                  {(index.is_available_order_from_elapsed_page == 1) && (new Date(cur_date.split('-').join('/')).getTime() > new Date(formatDateLine(new Date(index.order_data.end_date.split('-').join('/')))).getTime()) && (
                    <li onClick={() => parent.contextMenuAction('create_inspection', cur_date, index)}><div>オーダー代理入力</div></li>
                  )}
                </>
              )}
              {treat_detail_id != null && (
                <li onClick={() => parent.contextMenuAction('copy_inspection_result', cur_date, index, treat_detail_id)}><div>コピー</div></li>
              )}
            </>
          )}
          {(can_write == "ON") && (item == 'oxy') && (
            <>
              <li onClick={() => parent.contextMenuAction('oxy_edit', cur_date, index, treat_detail_id)}><div>編集</div></li>
              <li onClick={() => parent.contextMenuAction('from_before_oxy_edit', cur_date, index, treat_detail_id)}><div>前日継続</div></li>
            </>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

const ContextMenu_th = ({visible,x,y,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.changeRange(1)}>1日</div></li>
          <li><div onClick={() => parent.changeRange(2)}>3時間</div></li>
          <li><div onClick={() => parent.changeRange(3)}>1時間</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};
const ContextMenu_Graph = ({visible,x,y,measure_at,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.editGraphData(measure_at)}>修正</div></li>
          <li><div onClick={() => parent.deleteGraphData(measure_at)}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};
const ContextGraphMenu = ({visible,x,y,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li onClick={() => parent.insertVital("insert")}><div>追加</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class PatientProgressChart extends Component {
  constructor(props) {
    super(props);
    this.holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;
    this.ranges=[
      {id:0, value:''},
      {id:1, value:'1日'},
      {id:2, value:'3時間'},
      {id:3, value:'1時間'},
    ];
    this.max_x = null;
    this.min_x = null;
    let nursing_history = localApi.getObject("nursing_history");
    nursing_history = nursing_history === undefined ? null : nursing_history;
    let last_week = new Date();
    last_week.setDate(last_week.getDate() - 6);
    this.can_write = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS, "conf_data").progress_chart_is_writable_in_nursing_document;
    this.state = {
      range: 1,
      system_patient_id:props.patientId,
      search_date:(nursing_history != null && nursing_history.progress_chat != undefined && nursing_history.progress_chat.search_date != undefined)
        ? new Date(nursing_history.progress_chat.search_date) : last_week,
      view_date:(nursing_history != null && nursing_history.progress_chat != undefined && nursing_history.progress_chat.view_date != undefined)
        ? new Date(nursing_history.progress_chat.view_date) : new Date(),
      display_check:(nursing_history != null && nursing_history.progress_chat != undefined && nursing_history.progress_chat.display_check != undefined)
        ? nursing_history.progress_chat.display_check : 0,
      is_loaded: false,
      meal_data:[],
      graph_data: [],
      elapsed_result:[],
      elapsed_result_data: [],      
      hospital_data: [],
      treat_data: [],
      vital_data: [],
      nurse_instruction: [],
      inspection_data: [],
      tmp_inspection_data: [],
      result_changed: (nursing_history != null && nursing_history.progress_chat != undefined && nursing_history.progress_chat.result_changed != undefined)
        ? nursing_history.progress_chat.result_changed : false,
      meal_changed: (nursing_history != null && nursing_history.progress_chat != undefined && nursing_history.progress_chat.meal_changed != undefined)
        ? nursing_history.progress_chat.meal_changed : false,
      oxygen_changed: (nursing_history != null && nursing_history.progress_chat != undefined && nursing_history.progress_chat.oxygen_changed != undefined)
        ? nursing_history.progress_chat.oxygen_changed : false,
      confirm_message:"",
      alert_title:"",
      alert_messages:"",
      openTitleCreateModal: false,
      openFreeTitleCreateModal:false,
      openGraphChangeModal: false,
      setSelectModal: false,
      confirm_title: '',
      isOpenHistoryModal: false,
      isDeleteConfirmModal: false,
      isOpenInspectionStartEndDateTimeRegister: false,
      complete_message:"",
      isOpenOxygenModal:false,
      oxy_data:{},
      isOpenSelectDoctor:false,
      isOpenProgressChartInspectionModal:false,
      isOpenInspectionDoneModal:false,
      isOpenTreatDoneModal:false,
      multi_treatment: [],
      contextMenu:{visible:false},
      contextMenu_th:{visible:false},
      contextMenu_Graph:{visible:false},
      elapsed_treat: [],
      isOpenTreatmentModal:false,
      contextGraphMenu:{visible:false},

      isOpenTreatDetailModal:false,
    };
    this.movement_classification_options = {
      1:"入院",
      2:"退院",
      4:"転入",
      6:"加算区分",
      7:"主治医変更",
      8:"副担当医変更"
    };
    this.ChartRef = React.createRef();
    this.morning_meal_info = {};
    this.noon_meal_info = {};
    this.evening_meal_info = {};
    this.nurse_info = {};    
    this.canShowMenu = 1;
    
    this.holidays = undefined;
    this.staple_food_master = [];
    this.food_type_master = [];
    this.tier_master_2nd = [];
    this.tier_master_3rd = [];
    this.unit_master = [];
    this.elapsed_select_item_master = [];
    this.elapsed_timezone_master = [];
    this.max_min_constants = [];
    this.drink_master = [];
    this.elapsed_select_items = [];
    this.tier_3rd_number_data = [];
    this.inspection_data = [];
    this.vital_temp_data = [];
    this.doctors = sessApi.getDoctorList();

    //cell design const for design--------------------------------
    this.cell_width_1 = 7;  //rem for 1 day cell
    this.cell_width_2 = 6.0;  //rem for 3 hours cell
    this.cell_width_3 = 2;  //rem for 1 jourse cell
  }
  
  async componentDidMount () {
    let html_obj = document.getElementsByTagName("html")[0];
    let width = html_obj.offsetWidth;
    if(parseInt(width) < 1367){
      this.cell_width_1 = 7;  //rem for 1 day cell
      this.cell_width_2 = 6.0;  //rem for 3 hours cell
      this.cell_width_3 = 2;  //rem for 1 jourse cell
    } else if(parseInt(width) < 1441){
      this.cell_width_1 = 7;  //rem for 1 day cell
      this.cell_width_2 = 6.0;  //rem for 3 hours cell
      this.cell_width_3 = 2;  //rem for 1 jourse cell
    } else if(parseInt(width) < 1601){
      this.cell_width_1 = 7;  //rem for 1 day cell
      this.cell_width_2 = 6.0;  //rem for 3 hours cell
      this.cell_width_3 = 2;  //rem for 1 jourse cell
    } else if(parseInt(width) < 1681){
      this.cell_width_1 = 8.6;  //rem for 1 day cell
      this.cell_width_2 = 7.5;  //rem for 3 hours cell
      this.cell_width_3 = 2;  //rem for 1 jourse cell
    } else if(parseInt(width) > 1919){
      this.cell_width_1 = 8.6;  //rem for 1 day cell
      this.cell_width_2 = 7.5;  //rem for 3 hours cell
      this.cell_width_3 = 2;  //rem for 1 jourse cell
    }

    // eslint-disable-next-line consistent-this
    const that = this;
    $(document).ready(function(){
      $(window).resize(function(){
        let html_obj = document.getElementsByTagName("html")[0];
        let width = html_obj.offsetWidth;        
        if(parseInt(width) < 1367){
          that.cell_width_1 = 7;  //rem for 1 day cell
          that.cell_width_2 = 6.0;  //rem for 3 hours cell
          that.cell_width_3 = 2;  //rem for 1 jourse cell
        } else if(parseInt(width) < 1441){
          that.cell_width_1 = 7;  //rem for 1 day cell
          that.cell_width_2 = 6.0;  //rem for 3 hours cell
          that.cell_width_3 = 2;  //rem for 1 jourse cell
        } else if(parseInt(width) < 1601){
          that.cell_width_1 = 7;  //rem for 1 day cell
          that.cell_width_2 = 6.0;  //rem for 3 hours cell
          that.cell_width_3 = 2;  //rem for 1 jourse cell
        } else if(parseInt(width) < 1681){
          that.cell_width_1 = 8.6;  //rem for 1 day cell
          that.cell_width_2 = 7.5;  //rem for 3 hours cell
          that.cell_width_3 = 2;  //rem for 1 jourse cell
        } else if(parseInt(width) > 1919){
          that.cell_width_1 = 8.6;  //rem for 1 day cell
          that.cell_width_2 = 7.5;  //rem for 3 hours cell
          that.cell_width_3 = 2;  //rem for 1 jourse cell
        }
        that.forceUpdate();
      });
    });
    await this.getHolidays();
    await this.getMasterData();
    await this.getSearchResult();
  }
  
  async getHolidays(){
    let from_date = formatDateLine(this.state.search_date);
    let end_date = formatDateLine(this.state.view_date);
    let path = "/app/api/v2/dial/schedule/get_holidays";
    let post_data = {
      start_date: from_date,
      end_date,
    };
    await axios.post(path, {params: post_data}).then((res)=>{
      this.holidays = Object.keys(res.data);
    })
  }
  
  getMasterData = async() => {
    let path = "/app/api/v2/nurse/get_progress_chart";
    let post_data = {
      only_master: 1
    };
    await apiClient.post(path, post_data)
      .then((res) => {
        let elapsed_select_items = [];
        if (res.elapsed_select_item_master != null && res.elapsed_select_item_master.length > 0) {
          res.elapsed_select_item_master.map(item=>{
            elapsed_select_items[item.number] = item;
          })
        }
        let tier_3rd_number_data = [];
        if (res.tier_master_3rd != null && res.tier_master_3rd.length > 0) {
          res.tier_master_3rd.map(item=>{
            tier_3rd_number_data[item.number] = item;
          })
        }
        this.staple_food_master = res.staple_food_master;
        this.food_type_master = res.food_type_master;
        this.tier_master_2nd = res.tier_master_2nd;
        this.tier_master_3rd = res.tier_master_3rd;
        this.unit_master = res.unit_master;
        this.elapsed_select_item_master = res.elapsed_select_item_master;
        this.elapsed_timezone_master = res.elapsed_timezone_master;
        this.max_min_constants = res.max_min_constants;
        this.drink_master = res.drink_master;
        this.elapsed_select_items = elapsed_select_items;
        this.tier_3rd_number_data = tier_3rd_number_data;
        this.graph_max_min_constants = res.graph_max_min_constants;
      });
  }
  
  getSearchResult = async() => {
    if(this.state.is_loaded){
      this.setState({is_loaded: false});
    }
    let path = "/app/api/v2/nurse/get_progress_chart";
    let post_data = {
      search_date: formatDateLine(this.state.search_date),
      system_patient_id: this.state.system_patient_id,
      range: this.state.range,
    };
    await apiClient.post(path, post_data)
      .then((res) => {
        let graph_data = this.makeGraphData(res.vital_data);
        let elapsed_result = this.mergeElapsedResult(res.elapsed_result_data);        
        var meal_data = res.meal_data.length == 0?{}: res.meal_data;
        meal_data = this.mergeMealData(meal_data);
        var oxy_data = {};
        if (res.oxy_data != undefined){
          oxy_data = res.oxy_data.length == 0? {}:res.oxy_data;
          oxy_data = this.mergeOxyData(oxy_data);
        }        
        if (res){
          this.inspection_data = res.inspection_data;
          let inspection_data = [];
          if(this.inspection_data.length > 0){
            if(this.state.range == 1){
              inspection_data = JSON.parse(JSON.stringify(this.inspection_data));
            } else {
              this.inspection_data.map(inspection=>{
                if(inspection[formatDateLine(this.state.view_date)] !== undefined){
                  inspection_data.push(inspection);
                }
              })
            }
          }
          let vital_temp_data = res.vital_temp_data;
          this.vital_temp_data = res.vital_temp_data;
          if (this.vital_temp_data != null)
            vital_temp_data = this.filterVitalTempData(this.vital_temp_data);
          this.setState({
            hospital_data: res.hospital_data,
            meal_data,
            oxy_data,            
            treat_data: res.treat_data,
            vital_data: res.vital_data,
            elapsed_result_data: res.elapsed_result_data,
            nurse_instruction: res.nurse_instruction,
            tmp_inspection_data: res.tmp_inspection_data,
            elapsed_treat: res.elapsed_treat,
            multi_treatment: res.multi_treatment,
            inspection_data,
            elapsed_result,
            graph_data,
            vital_temp_data,
            is_loaded: true,
          });
        } else {
          this.setState({is_loaded: true});
        }
      }).finally(()=>{
        this.setState({is_loaded: true});
      });
  }
  
  filterVitalTempData = (temp_data) => {
    let ret_data = [];
    let {search_date} = this.state;
    let start_gettime, end_gettime;
    if (this.state.range == 1) {
      start_gettime = new Date(search_date).getTime();
      end_gettime = getAfterDayByJapanFormat(search_date, 7).getTime();
    } else {
      start_gettime = new Date(formatDateSlash(search_date) + " 00:00:00").getTime();
      end_gettime = new Date(formatDateSlash(search_date) + " 23:59:59").getTime();
    }
    temp_data.map(item=>{
      let gettime = new Date((item.x.split("-").join("/"))).getTime();
      if (gettime >= start_gettime && gettime < end_gettime) {
        ret_data.push(item);
      }
    });
    if (ret_data.length === 0) return null;
    return ret_data;
  }

  mergeOxyData = (second) =>{
    // let progress_chat_cache = localApi.getObject("progress_chat_cache");
    let result = JSON.parse(JSON.stringify(second));
    var first = this.state.oxy_data;
    // if (progress_chat_cache !== undefined && progress_chat_cache != null) first = progress_chat_cache.oxy_data;
    if (first === undefined || first == null || Object.keys(first).length === 0) return result;
    Object.keys(first).map(treat_detail_id=>{
      var item = first[treat_detail_id];
      if (Object.keys(item).length > 0){
        Object.keys(item).map(date => {
          if (result[treat_detail_id] == undefined) result[treat_detail_id] = {};
          if (result[treat_detail_id][date] == undefined) result[treat_detail_id][date] = {};
          result[treat_detail_id][date] = item[date];
        })
      }
    })
    return result;
  }

  mergeMealData = (second) => {
    let nursing_history = localApi.getObject("nursing_history");
    let result = JSON.parse(JSON.stringify(second));
    var first = this.state.meal_data;
    if (nursing_history !== undefined && nursing_history != null && nursing_history.progress_chat !== undefined)
      first = nursing_history.progress_chat.meal_data;
    if (first === undefined || first == null || Object.keys(first).length === 0) return result;
    Object.keys(first).map(date_index=>{
      var item = first[date_index];
      if (Object.keys(item).length > 0){
        Object.keys(item).map(time_index => {
          if (result[date_index] == undefined) result[date_index] = {};
          if (result[date_index][time_index] == undefined) result[date_index][time_index] = {};
          if (item[time_index].eaten_rate != undefined || item[time_index].side_food_eaten_rate != undefined){
            result[date_index][time_index] = item[time_index];
          }
        })
      }
    })
    return result;
  }
  
  mergeElapsedResult = (second) => {
    let nursing_history = localApi.getObject("nursing_history");
    let first = this.state.elapsed_result;
    if (nursing_history !== undefined && nursing_history != null && nursing_history.progress_chat !== undefined)
      first = nursing_history.progress_chat.elapsed_result;
    let result = JSON.parse(JSON.stringify(second));
    if (first === undefined || first.length == 0) return result;
    first.map(result_item=>{
      if (result_item.input_values !== undefined && result_item.input_values.length > 0) {
        result_item.input_values.map(sub_item=> {
          if (sub_item.is_new) {            
            let find_index = result.findIndex(x=>{
              if (x.title_id > 0 && x.title_id == result_item.title_id) return true;
              if (!(x.title_id> 0) && x.tier_3rd_id == result_item.tier_3rd_id) return true;          
            });
            if (find_index != -1) {
              if (result[find_index].input_values === undefined) {
                result[find_index].input_values = [sub_item];
              } else {
                let input_find_index = result[find_index].input_values.findIndex(x=>x.input_datetime == sub_item.input_datetime && x.timezone_id == sub_item.timezone_id);
                if (result[find_index].is_always_available){
                  input_find_index = result[find_index].input_values.findIndex(x=>x.input_datetime == sub_item.input_datetime);
                }
                if (input_find_index > -1) result[find_index].input_values[input_find_index] = sub_item;
                else result[find_index].input_values.push(sub_item);
              }
            }
          }
        })
      }
    });
    return result;
  };
  
  makeGraphData = (data) => {
    let graph_data = [
      { values: [], label: "体温" },
      { values: [], label: "脈拍" },
      { values: [], label: "低血圧" },
      { values: [], label: "高血圧" },
      { values: [], label: "呼吸数" },
    ];
    if (data == undefined || data.length == 0) return graph_data;
    data.map(item => {
      graph_data[0].values.push({x:item.measure_at, y:item.temperature});
      graph_data[1].values.push({x:item.measure_at, y:item.pluse});
      graph_data[2].values.push({x:item.measure_at, y:item.min_blood});
      graph_data[3].values.push({x:item.measure_at, y:item.max_blood});
      graph_data[4].values.push({x:item.measure_at, y:item.respiratory});
    });
    return graph_data;
  }
  
  moveDay = (type) => {
    if (!this.state.is_loaded) return;
    let now_day = this.state.view_date;
    if(now_day === ''){
      now_day = new Date();
    }
    let view_date = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    let search_date = new Date(view_date);
    search_date.setDate(search_date.getDate() - 6);
    this.setState({
      view_date,
      search_date,
      is_loaded:false,
      dbl_click_type:''
    }, async()=>{
      await this.getHolidays();
      await this.getSearchResult();
      this.saveCondition();
    });
  };
  
  saveCondition=()=>{
    let nursing_history = localApi.getObject("nursing_history");
    if(nursing_history === undefined || nursing_history == null){
      nursing_history = {};
    }
    if(nursing_history.progress_chat === undefined){
      nursing_history.progress_chat = {};
    }
    nursing_history.progress_chat.view_date = formatDateLine(this.state.view_date).split('-').join('/');
    nursing_history.progress_chat.search_date = formatDateLine(this.state.search_date).split('-').join('/');
    nursing_history.progress_chat.display_check = this.state.display_check;
    nursing_history.progress_chat.elapsed_result = JSON.parse(JSON.stringify(this.state.elapsed_result));
    nursing_history.progress_chat.result_changed = this.state.result_changed;
    nursing_history.progress_chat.meal_data = JSON.parse(JSON.stringify(this.state.meal_data));
    nursing_history.progress_chat.meal_changed = this.state.meal_changed;
    nursing_history.progress_chat.oxygen_changed = this.state.oxygen_changed;
    localApi.setObject("nursing_history", nursing_history);
  }

  resultFreeChange = (cur_date, result_item, timezone = 1, e) => {    
    var elapsed_result = this.state.elapsed_result;
    var input_value = {
      title_id:result_item.number,
      input_datetime: cur_date,
      elapsed_result_text:e.target.value,      
      timezone_id: timezone,
      is_new:true,
    };
    var free_row_index = elapsed_result.findIndex(x=>x.title_id == result_item.title_id);
    if (free_row_index == -1) return;
    if (elapsed_result[free_row_index].input_values == undefined){
      elapsed_result[free_row_index].input_values = [input_value];
    } else {
      var input_values = elapsed_result[free_row_index].input_values;
      let index = input_values.findIndex(x=>formatDateLine(formatDateTimeIE(x.input_datetime))==cur_date && x.timezone_id == timezone);
      if(index == -1) {
        input_values.push(input_value);
      } else {
        elapsed_result[free_row_index].input_values[index] = input_value;
      }    
    }    
    this.setState({
      elapsed_result,      
      result_changed:true
    }, () => {
      this.props.setChangeStatus(true);
      this.saveCondition();
    })
  }
  
  moveWeek = (type) => {
    if (!this.state.is_loaded) return;
    let now_week = this.state.view_date;
    let view_date = type === 'next' ? getAfterDayByJapanFormat(now_week, 7) : getAfterDayByJapanFormat(now_week, -7);
    let search_date = new Date(view_date);
    search_date.setDate(search_date.getDate() - 6);
    this.setState({
      view_date,
      search_date,
      is_loaded:false,
      dbl_click_type:''
    }, async()=>{
      await this.getHolidays();
      await this.getSearchResult();
      this.saveCondition();
    });
  };
  
  selectToday=()=>{
    if (!this.state.is_loaded) return;
    let search_date = new Date();
    search_date.setDate(search_date.getDate() - 6);
    this.setState({
      view_date: new Date(),
      search_date,
      is_loaded:false,
      dbl_click_type:''
    }, async()=>{
      await this.getHolidays();
      await this.getSearchResult();
      this.saveCondition();
    });
  };
  
  setBackcolor = (date, day_of_week) => {
    let holidays = this.state.holidays;
    if (holidays == undefined || holidays == null || holidays.length == 0 || !holidays.includes(date)){
      if (this.holidays_color.days[day_of_week] == undefined || this.holidays_color.days[day_of_week] == null){
        return this.holidays_color.default.schedule_date_cell_back;
      } else {
        return this.holidays_color.days[day_of_week].schedule_date_cell_back;
      }
    } else {
      return this.holidays_color.holiday.schedule_date_cell_back;
    }
  };
  
  setFontcolor = (date, day_of_week) => {
    let holidays = this.state.holidays;
    if (holidays == undefined || holidays == null || holidays.length > 0 || !holidays.includes(date)){
      if (this.holidays_color.days[day_of_week] == undefined || this.holidays_color.days[day_of_week] == null){
        return this.holidays_color.default.schedule_date_cell_font;
      } else {
        return this.holidays_color.days[day_of_week].schedule_date_cell_font;
      }
    } else {
      return this.holidays_color.holiday.schedule_date_cell_font;
    }
  };
  
  checkDate(from, to) {
    let from_date = from.substring(0, 10);
    let to_date = to.substring(0, 10);
    from_date = new Date(from_date);
    to_date = new Date(to_date);
    if (from_date.getTime() > to_date.getTime()) return false;
    return true;
  }
  
  findHospitalDataByDate = (cur_date) => {
    let {hospital_data} = this.state;
    let find_hos_data = [];
    if (hospital_data === undefined || hospital_data.length === 0) return null;
    hospital_data.map(item=> {
      if (item.date_and_time_of_hospitalization != null && this.checkDate(item.date_and_time_of_hospitalization, cur_date)) {
        if (item.discharge_date == null) {
          find_hos_data.push(item);
        } else {
          if (this.checkDate(cur_date, item.discharge_date)) {
            find_hos_data.push(item);
          }
        }
      }
    });
    if (find_hos_data.length > 0) return find_hos_data;
    else return null;
  }

  unselectTd = () => {    
    this.setState({
      dbl_click_type:'',
      editing_meal_time_kind:'',
      editing_meal_cur_date:'',
      editing_rate_type:''
    });
  }

  getAverageOxy = (oxygens_one_day) => {
    if (oxygens_one_day == undefined || oxygens_one_day == null || oxygens_one_day.length == 0) return '';
    // var total_time = 0;
    // var total_oxy = 0;    
    // oxygens_one_day.map(item => {      
    //   var time_diff = (formatDateTimeIE(item.end_time).getTime() - formatDateTimeIE(item.start_time).getTime())/60000;      
    //   total_time += time_diff;
    //   total_oxy += item.oxygen_flow * time_diff;      
    // })
    // if (total_time > 0) return parseFloat(total_oxy/total_time).toFixed(1);
    if (oxygens_one_day[0].oxygen_ratio_flag == 1) return '記';
    var res = ''
    oxygens_one_day.map(item => {
      res += '<div style="font-size:0.9rem">';
      res += formatTime(formatDateTimeIE(item.start_time));
      res +='~';
      res += formatTime(formatDateTimeIE(item.end_time));
      res +=' ';
      res += item.oxygen_flow+'L/分';
      res +='</div>'
    })
    return res == ''?'':renderHTML(res);
  }
  
  getTdState = (item = null,cur_date, cur_item, timezone = null, result_kind = 1) => {    
    if (item != null && item !== '' && this.state.system_patient_id > 0) {
      let {hospital_data} = this.state;
      if (hospital_data === undefined || hospital_data.length === 0) return '';
      let find_hos_data = this.findHospitalDataByDate(cur_date);
      if (item === 'hospital_dates') {
        if (find_hos_data == null) return '';
        let hospital_date = find_hos_data[0].date_and_time_of_hospitalization;
        return this.getDates(hospital_date, cur_date);
      } else if (item === 'surgery_day') {
        if (find_hos_data == null) return '';
        let surgery_day = find_hos_data[0].surgery_day;
        if (surgery_day == null || surgery_day === '') return '';
        return this.getDates(surgery_day, cur_date);
      } else if (item === "move_info") {
        if (find_hos_data == null) return '';
        let move_info = [];
        find_hos_data.map(hos_item=>{
          if (hos_item.moving_day != null && hos_item.moving_day !== "") {
            if (cur_date.substr(0, 10) === hos_item.moving_day.substr(0, 10)) {
              let movement_classification = hos_item.movement_classification;
              if (movement_classification > 0  && this.movement_classification_options[movement_classification] !== undefined) {
                move_info.push(this.movement_classification_options[movement_classification]);
              }
            }
          }
        });
        if (move_info.length === 0) return "";
        return move_info.join(",");
      } else if (item === "morning") {
        if (filterShow(this.state.meal_data) != '' && filterShow(this.state.meal_data[cur_date]) != '' && filterShow(this.state.meal_data[cur_date][1]) != ''){
          return filterShow(this.state.meal_data[cur_date][1]['food_type_name']);
        } else {
          return '';
        }        
      } else if (item === "noon") {
        if (filterShow(this.state.meal_data) != '' && filterShow(this.state.meal_data[cur_date]) != '' && filterShow(this.state.meal_data[cur_date][2]) != ''){
          return filterShow(this.state.meal_data[cur_date][2]['food_type_name']);
        } else {
          return '';
        }        
      } else if (item === "evening") {
        if (filterShow(this.state.meal_data) != '' && filterShow(this.state.meal_data[cur_date]) != '' && filterShow(this.state.meal_data[cur_date][3]) != ''){
          return filterShow(this.state.meal_data[cur_date][3]['food_type_name']);
        } else {
          return '';
        }        
      } else if(item == 'between_meal'){
        if (filterShow(this.state.meal_data) != '' && filterShow(this.state.meal_data[cur_date]) != '' && filterShow(this.state.meal_data[cur_date][4]) != ''){
          return filterShow(this.state.meal_data[cur_date][4]['food_type_name']);
        } else {
          return '';
        }
      } else if (item == 'eaten_rate' || item == 'side_food_eaten_rate'){
        // if (timezone == 4) return '-';
        if (filterShow(this.state.meal_data) != '' && filterShow(this.state.meal_data[cur_date]) != '' && filterShow(this.state.meal_data[cur_date][timezone]) != ''){
          var disable_flag_field = item + '_is_disabled';
          return filterShow(this.state.meal_data[cur_date][timezone][disable_flag_field]) == 0?filterShow(this.state.meal_data[cur_date][timezone][item]):'-';
        } else{
          return '';
        }
      } else if(item == 'oxy'){
        if (cur_item == undefined || cur_item == null) return '';
        return this.getAverageOxy(cur_item[cur_date]);
      } else if (item === "treatment") {
        return renderHTML(this.getTreatData(cur_date));
      } else if (item === "title" || item == 'always_title') {
        let {elapsed_result} = this.state;
        var elapsed_select_items = this.elapsed_select_items;
        if(elapsed_result == null || elapsed_result.length === 0) return "";
        let find_data = null;
        elapsed_result.map(item => {
          if (item.input_values != undefined && item.input_values.length > 0 && cur_item != undefined && cur_item != null 
            && ((item.title_id > 0 && item.title_id == cur_item.title_id) || (!(item.title_id>0) && item.tier_3rd_id == cur_item.tier_3rd_id))) {
            item.input_values.map(sub_item=>{
              if (item.is_once_a_day){
                if (formatDateLine(formatDateTimeIE(sub_item.input_datetime)) == formatDateLine(cur_date)){
                  find_data = sub_item;                
                }
              } else {
                if (sub_item.timezone_id == timezone && formatDateLine(formatDateTimeIE(sub_item.input_datetime)) == formatDateLine(cur_date)){
                  find_data = sub_item;                
                }
              }
            })
          }
        });
        
        if (find_data == null) return '';        
        if (find_data.result == 0 && find_data.elapsed_result_text == "") return "";
        let result = "";
        if (result_kind == 1){
          if (find_data.result > 0 && elapsed_select_items !== undefined && elapsed_select_items[find_data.result] !== undefined) result = elapsed_select_items[find_data.result].name;
          if (!(find_data.result > 0) && find_data.elapsed_result_text != "") result = find_data.elapsed_result_text;          
          if (find_data.comment == undefined || find_data.comment == null || find_data.comment == "")
            return result;
          else
            return renderHTML(result + "<br />" + find_data.comment + "");
        }
        if (result_kind == 2){
          if (find_data.result_2 > 0 && elapsed_select_items !== undefined && elapsed_select_items[find_data.result_2] !== undefined) result = elapsed_select_items[find_data.result_2].name;
          if (!(find_data.result_2 > 0) && find_data.elapsed_result_text_2 != "") result = find_data.elapsed_result_text_2;
          if (find_data.comment == undefined || find_data.comment == null || find_data.comment == "")
            return result;
          else
            return renderHTML(result + "<br />" + find_data.comment + "");
        }
      } else if (item == 'free_title') {
        var elapsed_result = this.state.elapsed_result;
        var free_row_data = elapsed_result.find(x=>x.title_id == cur_item.title_id);
        if (free_row_data == undefined) return '';
        if (free_row_data.input_values == undefined || free_row_data.input_values.length == 0) return '';
        var free_td_data = free_row_data.input_values.find(x => formatDateLine(formatDateTimeIE(x.input_datetime)) == formatDateLine(cur_date) && x.timezone_id == timezone);
        
        if (free_td_data != undefined && free_td_data != null && free_td_data.elapsed_result_text != undefined && free_td_data.elapsed_result_text != ''){
          return free_td_data.elapsed_result_text;
        } else {
          return '';
        }
      } else if (item === "nurse_instruction") {
        let {nurse_instruction} = this.state;
        delete this.nurse_info[cur_date];
        if (nurse_instruction === undefined || nurse_instruction.length === 0) return "";
        let instruction_array = [];
        nurse_instruction.map(item=>{
          if (this.state.range == 1) {
            if (item.schedule_dates !== undefined && Object.keys(item.schedule_dates).length > 0 && Object.keys(item.schedule_dates).indexOf(cur_date)>-1) {
              instruction_array.push(item.name);
            }
          } else {
            let day_val = cur_date.substr(0, 10);
            if (item.schedule_dates !== undefined && Object.keys(item.schedule_dates).length > 0 && Object.keys(item.schedule_dates).indexOf(day_val)>-1) {
              let time_array = item.schedule_dates[day_val];
              if (time_array != undefined && time_array.length > 0) {
                time_array.map(time_item=>{
                  let date_time = day_val + " " + time_item;
                  if (this.getTimeState(cur_date, date_time)) {
                    instruction_array.push(item.name);
                  }
                })
              }
            }
          }
        });
        if (instruction_array.length > 0) {
          this.nurse_info[cur_date] = instruction_array.join("、");
          return instruction_array.join("、");
        }
      } else if(item === "inspection_data"){
        if(cur_item[cur_date] === undefined){
          return "";
        }
        if(Array.isArray(cur_item[cur_date])){
          let html_data = [];
          html_data.push(
            <div style={{width:"100%", display:"flex", height:"3rem", lineHeight:"3rem"}}>
              {cur_item[cur_date][0] !== undefined ? (
                <div className={'border-right'} style={{width:"33%"}} id={'inspection_result-0'}>
                  {cur_item[cur_date][0]}
                </div>
              ):(
                <div className={'border-right'} style={{width:"33%"}}> </div>
              )}
              {cur_item[cur_date][1] !== undefined ? (
                <div className={'border-right'} style={{width:"34%"}} id={'inspection_result-1'}>
                  {cur_item[cur_date][1]}
                </div>
              ):(
                <div className={'border-right'} style={{width:"34%"}}> </div>
              )}
              {cur_item[cur_date][2] !== undefined ? (
                <div style={{width:"33%"}} id={'inspection_result-2'}>
                  {cur_item[cur_date][2]}
                </div>
              ):(
                <div style={{width:"33%"}}> </div>
              )}
            </div>
          );
          return html_data;
        } else {
          return cur_item[cur_date];
        }
      } else if (item === "multi_treatment") {
        if (cur_item.start_date == cur_date) {
          let order_data = cur_item.order_data.order_data;
          let done_numbers = order_data.detail[0].done_numbers;
          if (done_numbers === undefined || done_numbers[cur_date] === undefined || done_numbers[cur_date].length === 0) return "開始";
          return done_numbers[cur_date].length + "回";
        } else if (cur_item.end_date == cur_date) {
          return "終了";
        } else if (this.getDates(cur_item.start_date, cur_date) > 0) {
          let order_data = cur_item.order_data.order_data;
          let done_numbers = order_data.detail[0].done_numbers;
          if (done_numbers === undefined || done_numbers[cur_date] === undefined || done_numbers[cur_date].length === 0) return '';
          return done_numbers[cur_date].length + "回";
        }
      }
    }
    return '';
  }
  
  getTimeState = (cur_datetime, datetime) => {
    cur_datetime = cur_datetime.split("-").join("/");
    datetime = datetime.split("-").join("/");
    let {range} = this.state;
    if (range == 1) {
      let input_date = datetime.substr(0,10);
      if(input_date == cur_datetime) return true;
    } else if (range == 2) {
      let start_datetime = new Date(cur_datetime).getTime();
      let start_time = parseInt(cur_datetime.substr(11, 2));
      let end_time = start_time + 3;
      end_time = (end_time) < 10 ? '0' + (end_time) : (end_time);
      let end_datetime = cur_datetime.substr(0, 11) + end_time + ":00";
      end_datetime = new Date(end_datetime).getTime();
      datetime = new Date(datetime).getTime();
      if (datetime >= start_datetime && datetime < end_datetime) return true;
    } else if (range == 3) {
      let start_datetime = new Date(cur_datetime).getTime();
      let start_time = parseInt(cur_datetime.substr(11, 2));
      let end_time = start_time + 1;
      end_time = (end_time) < 10 ? '0' + (end_time) : (end_time);
      let end_datetime = cur_datetime.substr(0, 11) + end_time + ":00";
      end_datetime = new Date(end_datetime).getTime();
      datetime = new Date(datetime).getTime();
      if (datetime >= start_datetime && datetime < end_datetime) return true;
    }
    return false;
  }

  openTreatmentDetail = (cur_date) => {    
    let {treat_data} = this.state;
    cur_date = cur_date.substr(0, 10);
    if (treat_data == undefined || treat_data[cur_date] == undefined) return '';
    var selected_treat_data = treat_data[cur_date];
    selected_treat_data.patient_number = this.props.patientInfo.patient_number;
    selected_treat_data.patient_name = this.props.patientInfo.patient_name;
    this.setState({
      isOpenTreatDetailModal:true,
      selected_treat_data,
    })
  }
  
  getTreatData (cur_date) {
    let {treat_data} = this.state;
    cur_date = cur_date.substr(0, 10);
    if (treat_data == undefined || treat_data[cur_date] == undefined) return '';
    let order_data = treat_data[cur_date];
    if (order_data.order_data.detail == undefined) return '';
    let result = '';    
    order_data.order_data.detail.map((item)=>{
      if (item.practice_name != undefined && item.practice_name != ''){
        if (item.completed_at === undefined || item.completed_at === ""){
          var color = 'red';
          if (this.graph_max_min_constants != undefined && this.graph_max_min_constants != null && this.graph_max_min_constants.not_done_treat_color != undefined ){
            color = this.graph_max_min_constants.not_done_treat_color;
          }
          result = result + '<div style="color:'+ color +'">' +  item.practice_name + '</div>';
        } else {
          result = result + '<div>' +  item.practice_name + '</div>';
        }
      }
    });    
    return result;
  }
  
  getTreatState (cur_date)  {
    let {treat_data} = this.state;
    cur_date = cur_date.substr(0, 10);
    if (treat_data == undefined || treat_data[cur_date] == undefined) return;
    let order_data = treat_data[cur_date];
    if (order_data.order_data.detail == undefined) return;
    return order_data.order_data.header.state;
  }
  
  getMealInfoData = (_date, _start_time_classification) => {
    let meal_info = null;
    let meal_date = this.state.search_date;
    let break_flag = 0;
    for(let i = 1; i <= 7; i++){
      if(break_flag == 1) break;
      let str_date = formatDateLine(meal_date);
      for(let j = 1; j<= 3; j++){
        if(!this.state.meal_data[str_date]){
          if(str_date == _date && j == _start_time_classification) {
            break_flag = 1;
            break;
          }
          continue;
        }
        if(!this.state.meal_data[str_date][j]){
          if(str_date == _date && j == _start_time_classification) {
            break_flag = 1;
            break;
          }
          continue;
        }
        meal_info = this.state.meal_data[str_date][j];
        if(str_date == _date && j == _start_time_classification) {
          break_flag = 1;
          break;
        }
      }
      meal_date = getNextDayByJapanFormat(meal_date);
    }
    return meal_info;
  }
  
  getDates = (from_date, end_date) => {
    if (from_date == null || from_date == "" || end_date == null || end_date == "") return  "";
    let from = new Date(from_date.substring(0, 10));
    let to = new Date(end_date.substring(0, 10));
    if (to.getTime()>=from.getTime()) {
      return parseInt((to.getTime() - from.getTime())/(60 * 60 * 1000 * 24) + 1);
    }
    return null;
  }
  
  createTable = (type, item=null, index=null, treat_detail_id = null) => {
    let start_date =this.state.range == 1?new Date(this.state.search_date) : new Date(this.state.view_date);
    let now_year = start_date.getFullYear();
    let now_month = start_date.getMonth()+1;
    let date_number = start_date.getDate();
    let table_menu = [];
    let tmp_month = now_month < 10 ? '0' + now_month : now_month;
    let tmp_date = (date_number) < 10 ? '0' + (date_number) : (date_number);
    let tmp_cur_date = now_year + '-' + tmp_month + '-' + tmp_date;
    let tmp_new_date = new Date(tmp_cur_date);
    let yesterday = new Date(tmp_new_date.setDate(tmp_new_date.getDate()));
    let selectOptions = [{id: 0, value: '', unit: ''}];
    if(item != "inspection_data" && item != "tmp_inspection_data"){
      selectOptions = this.getResultOptions(index);
    }
    let elapsed_timezone_master = this.elapsed_timezone_master;
    let timezone_length = elapsed_timezone_master.length;
    let div_width = (100 / timezone_length) + "%";
    
    if(type === 'thead' || type === 'tbody'){
      let while_condition = 0;
      var cycle_max = 7;
      if (this.state.range == 2) cycle_max = 8;
      if (this.state.range == 3) cycle_max = 24;
      do {
        if (this.state.range == 1){       //1日----------------------------
          now_year = yesterday.getFullYear();
          now_month = yesterday.getMonth()+1;
          date_number = yesterday.getDate();
          div_width = (this.cell_width_1/timezone_length) + 'rem';
          if(getWeekName(now_year, (now_month), (date_number)) === undefined){
            date_number = 1;
            if(now_month == 12){
              now_month = 1;
              now_year++;
            } else {
              now_month++;
            }
          }
          let month = now_month < 10 ? '0' + now_month : now_month;
          let date = (date_number) < 10 ? '0' + (date_number) : (date_number);
          let cur_date = now_year + '-' + month + '-' + date;
          if(type === 'thead') {
            let week = new Date(cur_date).getDay();
            table_menu.push(
              <th onContextMenu={e => this.handleClick_th(e)}
                style={{background:this.setBackcolor(cur_date, week), color:this.setFontcolor(cur_date, week), width:'calc(' + this.cell_width_1 + 'rem' + ' + 1px)'}}>
                <div style={{textAlign:"center"}}>{month +'/'+date}</div>
                <div style={{textAlign:"center"}}>{'（'+getWeekName(now_year, now_month, (date_number))+'）'}</div>
              </th>
            )
          }
          if(type === 'tbody') {
            if (item == 'always_title' && index != null && index.is_once_a_day == 1){
              var always_result = '';
              var always_result_2 = '';
              var always_result_text = '';
              var always_result_text_2 = '';
              if (index.input_values != undefined && index.input_values.length > 0){
                index.input_values.map(sub_input_value => {
                  if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date)){
                    always_result = sub_input_value.result;
                    always_result_2 = sub_input_value.result_2;
                    always_result_text = sub_input_value.elapsed_result_text;
                    always_result_text_2 = sub_input_value.elapsed_result_text_2;
                  }
                })
              }
            }
            table_menu.push(
              <>
                {item != null ? (
                  <>
                    <td
                      onContextMenu={e => this.handleClick(e, item, cur_date, index, treat_detail_id)}
                      onDoubleClick={this.doubleClick.bind(this, item, cur_date, index, treat_detail_id)}
                      className="content-td"
                      style={{width:this.cell_width_1 + 'rem'}}
                    >
                      {this.state.editable_date == cur_date && this.state.editable_item == index && this.state.dbl_click_type == item ? (
                        <>
                          {item == 'always_title' && (
                            <>
                            <div className={"d-flex h-100"} style={{width:this.cell_width_1 + 'rem'}}>
                              {index.is_once_a_day == 1 ? (
                                <>
                                {index.result_2_is_enabled ? (
                                  <>
                                  <div style={{width:'50%'}} className="border-right-dot">
                                    {index.result_type != 0 ? (
                                      <>
                                        <input type="text" value={always_result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')} 
                                          onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                          onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                          onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)} autoFocus={true}/>
                                      </>
                                    ):(
                                      <>
                                        <SelectorWithLabel
                                          title=""
                                          options={selectOptions}
                                          getSelect={this.resultChange.bind(this, cur_date, index, "select", 1,1)}
                                          departmentEditCode = {always_result}
                                        />
                                      </>
                                    )}
                                  </div>
                                  <div style={{width:'50%'}}>
                                    {index.result_2_type != 0 ? (
                                      <>
                                        <input type="text" value={always_result_text_2} className={'w-100 ' + (index.result_2_type == 1?'':'numeric-input')} 
                                          onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', 1, 2)}
                                          onBlur = {this.setResult.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', 1, 2)}
                                          onChange={this.resultChange.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', 1, 2)} autoFocus={true}/>
                                      </>
                                    ):(
                                      <>
                                        <SelectorWithLabel
                                          title=""
                                          options={selectOptions}
                                          getSelect={this.resultChange.bind(this, cur_date, index, "select", 1, 2)}
                                          departmentEditCode = {always_result_2}
                                        />
                                      </>
                                    )}
                                  </div>
                                  </>
                                ) : (
                                  <>
                                  {index.result_type != 0 ? (
                                    <>
                                      <input type="text" value={always_result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')}
                                        onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                        onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                        onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)} autoFocus={true}/>
                                    </>
                                  ):(
                                    <>
                                      <SelectorWithLabel
                                        title=""
                                        options={selectOptions}
                                        getSelect={this.resultChange.bind(this, cur_date, index, "select", 1, 1)}
                                        departmentEditCode = {always_result}
                                      />
                                    </>
                                  )}
                                  </>
                                )}
                                </>
                              ):(
                                <>
                                {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                  let select_id = "timezone_" + timezone_item.number + "_" + index.tier_3rd_id;
                                  var result = '';
                                  var result_2 = '';
                                  var result_text = '';
                                  var result_text_2 = '';
                                  if (index != null && index.input_values != undefined && index.input_values.length > 0){
                                    index.input_values.map(sub_input_value => {
                                      if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date) && timezone_item.number == sub_input_value.timezone_id){                                    
                                        result = sub_input_value.result;
                                        result_2 = sub_input_value.result_2;
                                        result_text = sub_input_value.elapsed_result_text;
                                        result_text_2 = sub_input_value.elapsed_result_text_2;
                                      }
                                    })
                                  }                              
                                  return(
                                    <>
                                      <div className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} style={{width:div_width, minHeight:'2.5rem'}}>
                                      {this.state.editable_title_id == select_id ? (                                    
                                      <>
                                        {index.result_2_is_enabled ? (
                                          <>
                                          <div style={{width:'50%'}} className="border-right-dot">
                                            {index.result_type != 0 ? (
                                              <>
                                                <input type="text" value={result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')} 
                                                  onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                  onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                  onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                              </>
                                            ):(
                                              <>
                                                <SelectorWithLabel
                                                  title=""
                                                  options={selectOptions}
                                                  getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number,1)}
                                                  departmentEditCode = {result}
                                                />
                                              </>
                                            )}
                                          </div>
                                          <div style={{width:'50%'}}>
                                            {index.result_2_type != 0 ? (
                                              <>
                                                <input type="text" value={result_text_2} className={'w-100 ' + (index.result_2_type == 1?'':'numeric-input')} 
                                                  onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                                  onBlur = {this.setResult.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                                  onChange={this.resultChange.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)} autoFocus={true}/>
                                              </>
                                            ):(
                                              <>
                                                <SelectorWithLabel
                                                  title=""
                                                  options={selectOptions}
                                                  getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 2)}
                                                  departmentEditCode = {result_2}
                                                />
                                              </>
                                            )}
                                          </div>
                                          </>
                                        ) : (
                                          <>
                                          {index.result_type != 0 ? (
                                            <>
                                              <input type="text" value={result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')}
                                                onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                            </>
                                          ):(
                                            <>
                                              <SelectorWithLabel
                                                title=""
                                                options={selectOptions}
                                                getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 1)}
                                                departmentEditCode = {result}
                                              />
                                            </>
                                          )}
                                          </>
                                        )}
                                      </>
                                      ) : (
                                        <>
                                        {index.result_2_is_enabled ? (
                                          <>
                                          <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                            <div className="border-right-dot" style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                              {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                            </div>
                                            <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>{this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;</div>
                                          </div>
                                          </>
                                        ):(
                                          <>
                                          <div onClick={this.unselectTd.bind(this)} className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                            {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                          </div>
                                          </>
                                        )}
                                        </>
                                      )}
                                      </div>
                                    </>
                                  )
                                })}
                                </>
                              )}

                            </div>
                            </>
                          )}
                          {item == "title" && (
                            <>
                            <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                            {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                              let select_id = "timezone_" + timezone_item.number + "_" + index.title_id;
                              var result = '';
                              var result_2 = '';
                              var result_text = '';
                              var result_text_2 = '';
                              if (index != null && index.input_values != undefined && index.input_values.length > 0){
                                index.input_values.map(sub_input_value => {
                                  if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date) && timezone_item.number == sub_input_value.timezone_id){                                    
                                    result = sub_input_value.result;
                                    result_2 = sub_input_value.result_2;
                                    result_text = sub_input_value.elapsed_result_text;
                                    result_text_2 = sub_input_value.elapsed_result_text_2;
                                  }
                                })
                              }
                              return(
                                <>
                                  <div className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} style={{width:div_width, minHeight:'2.5rem'}}>
                                  {this.state.editable_title_id == select_id ? (                                    
                                  <>
                                    {index.result_2_is_enabled ? (
                                      <>
                                      <div style={{width:'50%'}} className="border-right-dot">
                                        {index.result_type != 0 ? (
                                          <>
                                            <input type="text" value={result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')} 
                                              onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                              onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                              onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                          </>
                                        ):(
                                          <>
                                            <SelectorWithLabel
                                              title=""
                                              options={selectOptions}
                                              getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number,1)}
                                              departmentEditCode = {result}
                                            />
                                          </>
                                        )}
                                      </div>
                                      <div style={{width:'50%'}}>
                                        {index.result_2_type != 0 ? (
                                          <>
                                            <input type="text" value={result_text_2} className={'w-100 ' + (index.result_2_type == 1?'':'numeric-input')} 
                                              onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                              onBlur = {this.setResult.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                              onChange={this.resultChange.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)} autoFocus={true}/>
                                          </>
                                        ):(
                                          <>
                                            <SelectorWithLabel
                                              title=""
                                              options={selectOptions}
                                              getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 2)}
                                              departmentEditCode = {result_2}
                                            />
                                          </>
                                        )}
                                      </div>
                                      </>
                                    ) : (
                                      <>
                                      {index.result_type != 0 ? (
                                        <>
                                          <input type="text" value={result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')}
                                            onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                            onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                            onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                        </>
                                      ):(
                                        <>
                                          <SelectorWithLabel
                                            title=""
                                            options={selectOptions}
                                            getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 1)}
                                            departmentEditCode = {result}
                                          />
                                        </>
                                      )}
                                      </>
                                    )}
                                  </>
                                  ) : (
                                    <>
                                    {index.result_2_is_enabled ? (
                                      <>
                                      <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} id={"timezone_" + timezone_item.number + "_" + index.title_id}>
                                        <div className="border-right-dot" style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                        </div>
                                        <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>{this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;</div>
                                      </div>
                                      </>
                                    ):(
                                      <>
                                      <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} onClick={this.unselectTd.bind(this)}
                                        id={"timezone_" + timezone_item.number + "_" + index.title_id}>
                                        {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                      </div>
                                      </>
                                    )}
                                    </>
                                  )}
                                  </div>
                                </>
                              )
                            })}
                            </div>
                            </>
                          )}
                          {item == "free_title" && (
                            <>
                            <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                            {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                              let select_id = "timezone_" + timezone_item.number + "_" + index.number;
                              var result = '';
                              if (index != null && index.input_values != undefined && index.input_values.length > 0){
                                index.input_values.map(sub_input_value => {
                                  if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date) && timezone_item.number == sub_input_value.timezone_id){
                                    result = sub_input_value.elapsed_result_text;
                                  }
                                })
                              }
                              return(
                                <>
                                  <div className={timezone_index==(timezone_length - 1)?"":"border-right"} style={{width:div_width, minHeight:'2.5rem'}}>
                                  {this.state.editable_title_id == select_id ? (
                                    <>
                                      <input type="text" value={result} className='w-100' onKeyDown = {this.checkKeyEvent.bind(this)}
                                        onChange={this.resultFreeChange.bind(this, cur_date, index, timezone_item.number)} autoFocus={true}/>
                                    </>
                                  ) : (
                                    <>
                                      <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} onClick={this.unselectTd.bind(this)}
                                        id={"timezone_" + timezone_item.number + "_" + index.number}>{this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;</div>
                                    </>
                                  )}
                                  </div>
                                </>
                              )
                            })}
                            
                            </div>
                            </>
                          )}
                          {(item == 'oxy') && (
                            <>
                            <div onClick={this.unselectTd.bind(this)}>
                              {this.getTdState(item, cur_date, index, 1) != ''?this.getTdState(item, cur_date, index, 1):renderHTML('&nbsp;')}
                            </div>
                            </>
                          )}
                        </>
                      ):(
                        <>
                        {item == 'always_title' && (
                          <>
                          {index.is_once_a_day == 1 ? (
                            <>
                            <div className={"d-flex w-100 h-100"}>
                            {index.result_2_is_enabled ? (                                    
                              <>
                              <div style={{fontSize:'0.9rem', width:'100%', minHeight:'2.5rem'}} className='d-flex'>
                                <div style={{width:'50%'}} className="border-right-dot" onClick={this.unselectTd.bind(this)}>
                                  {this.getTdState(item, cur_date, index, 1)}&nbsp;
                                </div>
                                <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                  {this.getTdState(item, cur_date, index, 1, 2)}&nbsp;
                                </div>
                              </div>
                              </>
                            ) : (
                              <>
                              <div style={{fontSize:'0.9rem', width:'100%', minHeight:'2.5rem'}} onClick={this.unselectTd.bind(this)}>
                                {this.getTdState(item, cur_date, index, 1)}&nbsp;
                              </div>
                              </>
                            )}
                            </div>
                            </>
                          ) : (                            
                            <>
                            <div className={"d-flex w-100 h-100"}>
                              {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                return (
                                  <>
                                  {index.result_2_is_enabled ? (                                    
                                    <>
                                    <div style={{fontSize:'0.9rem', width:div_width, minHeight:'2.5rem'}} className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                      <div style={{width:'50%'}} className="border-right-dot" onClick={this.unselectTd.bind(this)}>
                                        {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                      </div>
                                      <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                        {this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;
                                      </div>
                                    </div>
                                    </>
                                  ) : (
                                    <>
                                    <div style={{fontSize:'0.9rem', width:div_width, minHeight:'2.5rem'}} onClick={this.unselectTd.bind(this)}
                                       className={timezone_index==(timezone_length - 1)?"":"border-right"} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                      {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                    </div>
                                    </>
                                  )}
                                  </>
                                )
                              })}
                            </div>
                            </>
                          )}
                          </>
                        )}
                        {item == "title" && (
                          <>
                            <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                              {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                return (
                                  <>
                                  {index.result_2_is_enabled ? (                                    
                                    <>
                                    <div style={{fontSize:'0.9rem', width:div_width, minHeight:'2.5rem'}} className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} id={"timezone_" + timezone_item.number + "_" + index.title_id}>
                                      <div style={{width:'50%'}} className="border-right-dot" onClick={this.unselectTd.bind(this)}>
                                        {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                      </div>
                                      <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                        {this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;
                                      </div>
                                    </div>
                                    </>
                                  ) : (
                                    <>
                                    <div style={{fontSize:'0.9rem', width:div_width, minHeight:'2.5rem'}} onClick={this.unselectTd.bind(this)}
                                      className={timezone_index==(timezone_length - 1)?"":"border-right"} id={"timezone_" + timezone_item.number + "_" + index.title_id}>
                                      {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                    </div>
                                    </>
                                  )}
                                  </>
                                )
                              })}
                            </div>
                          </>
                        )}
                        {item == "free_title" && (
                          <>
                            <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                              {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                return (
                                  <>
                                    <div style={{fontSize:'0.9rem', width:div_width, minHeight:'2.5rem'}} onClick={this.unselectTd.bind(this)}
                                      className={timezone_index==(timezone_length - 1)?"":"border-right"} id={"timezone_" + timezone_item.number + "_" + index.number}>
                                        {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                    </div>
                                  </>
                                )
                              })}
                            </div>
                          </>
                        )}
                        {(item == 'eaten_rate' || item== 'side_food_eaten_rate') && (
                          <>
                          <div className={'d-flex w-100 h-100 ' + (this.checkAfterToday(cur_date)?'disabled-td':'')}>
                            <div className={'border-right'} onDoubleClick={this.mealDoubleClick.bind(this, item, 'morning', cur_date)} style={{width:this.cell_width_1/4 + 'rem', minHeight:'2.5rem'}}>
                              {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='morning' && this.state.editing_meal_cur_date == cur_date) ? (
                                <>
                                  <input className='w-100 numeric-input' autoFocus={true} style={{imeMode:'inactive'}}
                                    onKeyDown = {this.checkKeyEvent.bind(this)}
                                    onChange = {this.changeMealRate.bind(this,item,1, cur_date)}
                                    value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][1]) !='' ? this.state.meal_data[cur_date][1][item] :''}
                                  />
                                </>
                              ):(
                                <>
                                <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                  {this.getTdState(item, cur_date, index, 1) != ''?this.getTdState(item, cur_date, index, 1):renderHTML('&nbsp;')}
                                </div>
                                </>
                              )}
                            </div>
                            <div className='border-right' onDoubleClick={this.mealDoubleClick.bind(this,item, 'noon', cur_date)} style={{width:this.cell_width_1/4 + 'rem', minHeight:'2.5rem'}}>
                              {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='noon' && this.state.editing_meal_cur_date == cur_date) ? (
                                <>
                                  <input className='w-100 numeric-input' autoFocus={true} style={{imeMode:'inactive'}}
                                    onKeyDown = {this.checkKeyEvent.bind(this)}
                                    onChange = {this.changeMealRate.bind(this,item, 2, cur_date)}
                                    value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][2]) !='' ? this.state.meal_data[cur_date][2][item] :''}
                                  />
                                </>
                              ):(
                                <>
                                <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                  {this.getTdState(item, cur_date, index, 2) != ''?this.getTdState(item, cur_date, index, 2):renderHTML('&nbsp;')}
                                </div>
                                </>
                              )}
                            </div>
                            <div className='border-right' onDoubleClick={this.mealDoubleClick.bind(this, item,'between_meal', cur_date)} style={{width:this.cell_width_1/4 + 'rem', minHeight:'2.5rem'}}>
                              {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='between_meal' && this.state.editing_meal_cur_date == cur_date) ? (
                                <>
                                  <input className='w-100' autoFocus={true} style={{imeMode:'inactive'}}
                                    onKeyDown = {this.checkKeyEvent.bind(this)}
                                    onChange = {this.changeMealRate.bind(this,item, 4 , cur_date)}
                                    value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][4]) !='' ? this.state.meal_data[cur_date][4][item] :''}
                                  />
                                </>
                              ):(
                                <>
                                <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                  {this.getTdState(item, cur_date, index, 4) != ''?this.getTdState(item, cur_date, index, 4):renderHTML('&nbsp;')}
                                </div>
                                </>
                              )}
                            </div>
                            <div className='' onDoubleClick={this.mealDoubleClick.bind(this,item, 'evening', cur_date)} style={{width:this.cell_width_1/4 + 'rem', minHeight:'2.5rem'}}>
                              {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='evening' && this.state.editing_meal_cur_date == cur_date) ? (
                                <>
                                  <input className='w-100' autoFocus={true} style={{imeMode:'inactive'}}
                                    onKeyDown = {this.checkKeyEvent.bind(this)}
                                    onChange = {this.changeMealRate.bind(this,item, 3, cur_date)}
                                    value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][3]) !='' ? this.state.meal_data[cur_date][3][item] :''}
                                  />
                                </>
                              ):(
                                <>
                                <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                  {this.getTdState(item, cur_date, index, 3) != ''?this.getTdState(item, cur_date, index, 3):renderHTML('&nbsp;')}
                                </div>
                                </>
                              )}
                            </div>
                          </div>
                          </>
                        )}
                        {item != 'always_title' && item !='title' && item !='free_title' && item != 'eaten_rate' && item !='side_food_eaten_rate' && (
                          <>
                            <div onClick={this.unselectTd.bind(this)}>
                              {this.getTdState(item, cur_date, index, 1) != '' ? this.getTdState(item, cur_date, index, 1) : renderHTML('&nbsp;')}
                            </div>
                          </>
                        )}
                        </>
                      )}
                    </td>
                  </>
                ):(
                  <>
                    <td style={{width:this.cell_width_1 + 'rem'}}><div onClick={this.unselectTd.bind(this)}>&nbsp;</div></td>
                  </>
                )}
              </>
            );
          }
          date_number++;
          yesterday = new Date(yesterday.setDate(yesterday.getDate()+1));
        }
        if (this.state.range == 2){   //3時間
          if(type === 'thead'){
            table_menu.push(
              <th style={{width:this.cell_width_2 + 'rem'}} onContextMenu={e => this.handleClick_th(e)}>{while_condition * 3}時</th>
            )
          }
          if(type === 'tbody') {
            let hour_number = while_condition * 3;
            hour_number = (hour_number) < 10 ? '0' + (hour_number) : (hour_number);
            let cur_date = now_year + "-" + tmp_month + "-" + tmp_date;
            let cur_datetime = now_year + "-" + tmp_month + "-" + tmp_date + " " + hour_number + ":00";            

            if (item == 'always_title' && index != null && index.is_once_a_day == 1){
              always_result = '';
              always_result_2 = '';
              always_result_text = '';
              always_result_text_2 = '';
              if (index.input_values != undefined && index.input_values.length > 0){
                index.input_values.map(sub_input_value => {
                  if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date)){
                    always_result = sub_input_value.result;
                    always_result_2 = sub_input_value.result_2;
                    always_result_text = sub_input_value.elapsed_result_text;
                    always_result_text_2 = sub_input_value.elapsed_result_text_2;
                  }
                })
              }
            }

            table_menu.push(
              <>
                {item != null ? (
                  <>
                    {(item == 'always_title' || item == 'eaten_rate' || item =='side_food_eaten_rate' || item == 'oxy' || item == 'free_title' || item == 'title' || item == "hospital_dates" || item == "surgery_day" || item == "morning" || item == "noon" || item == "evening"
                      || item == 'between_meal' || item == "move_info" || item == "graph" || item == "treatment" || item == "inspection_data" || item == "tmp_inspection_data" || item == "multi_treatment" || item == "elapsed_treat") ? (
                      <>
                        {while_condition == 0 && (
                          <td style={{width:this.cell_width_2 + 'rem', height:"1rem"}} colSpan={8} className={`content-td`} onDoubleClick={this.doubleClick.bind(this, item, cur_date, index, treat_detail_id)} onContextMenu={e => this.handleClick(e, item, cur_date, index, treat_detail_id)}>
                            {this.state.editable_date == cur_date && this.state.editable_item == index && this.state.dbl_click_type == item ? (
                              <>
                                {item == 'always_title' && (
                                  <>
                                  <div className={"d-flex w-100 h-100"}>
                                    {index.is_once_a_day == 1 ? (
                                      <>
                                      {index.result_2_is_enabled ? (
                                        <>
                                        <div style={{width:'50%'}} className="border-right-dot">
                                          {index.result_type != 0 ? (
                                            <>
                                              <input type="text" value={always_result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')} 
                                                onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                                onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                                onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)} autoFocus={true}/>
                                            </>
                                          ):(
                                            <>
                                              <SelectorWithLabel
                                                title=""
                                                options={selectOptions}
                                                getSelect={this.resultChange.bind(this, cur_date, index, "select", 1,1)}
                                                departmentEditCode = {always_result}
                                              />
                                            </>
                                          )}
                                        </div>
                                        <div style={{width:'50%'}}>
                                          {index.result_2_type != 0 ? (
                                            <>
                                              <input type="text" value={always_result_text_2} className={'w-100 ' + (index.result_2_type == 1?'':'numeric-input')} 
                                                onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', 1, 2)}
                                                onBlur = {this.setResult.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', 1, 2)}
                                                onChange={this.resultChange.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', 1, 2)} autoFocus={true}/>
                                            </>
                                          ):(
                                            <>
                                              <SelectorWithLabel
                                                title=""
                                                options={selectOptions}
                                                getSelect={this.resultChange.bind(this, cur_date, index, "select", 1, 2)}
                                                departmentEditCode = {always_result_2}
                                              />
                                            </>
                                          )}
                                        </div>
                                        </>
                                      ) : (
                                        <>
                                        {index.result_type != 0 ? (
                                          <>
                                            <input type="text" value={always_result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')}
                                              onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                              onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                              onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)} autoFocus={true}/>
                                          </>
                                        ):(
                                          <>
                                            <SelectorWithLabel
                                              title=""
                                              options={selectOptions}
                                              getSelect={this.resultChange.bind(this, cur_date, index, "select", 1, 1)}
                                              departmentEditCode = {always_result}
                                            />
                                          </>
                                        )}
                                        </>
                                      )}
                                      </>
                                    ):(
                                      <>
                                      {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                        let select_id = "timezone_" + timezone_item.number + "_" + index.tier_3rd_id;
                                        var result = '';
                                        var result_2 = '';
                                        var result_text = '';
                                        var result_text_2 = '';
                                        if (index != null && index.input_values != undefined && index.input_values.length > 0){
                                          index.input_values.map(sub_input_value => {
                                            if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date) && timezone_item.number == sub_input_value.timezone_id){                                    
                                              result = sub_input_value.result;
                                              result_2 = sub_input_value.result_2;
                                              result_text = sub_input_value.elapsed_result_text;
                                              result_text_2 = sub_input_value.elapsed_result_text_2;
                                            }
                                          })
                                        }                              
                                        return(
                                          <>
                                            <div className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} style={{width:div_width, minHeight:'2.5rem'}}>
                                            {this.state.editable_title_id == select_id ? (                                    
                                            <>
                                              {index.result_2_is_enabled ? (
                                                <>
                                                <div style={{width:'50%'}} className="border-right-dot">
                                                  {index.result_type != 0 ? (
                                                    <>
                                                      <input type="text" value={result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')} 
                                                        onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                        onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                        onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                                    </>
                                                  ):(
                                                    <>
                                                      <SelectorWithLabel
                                                        title=""
                                                        options={selectOptions}
                                                        getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number,1)}
                                                        departmentEditCode = {result}
                                                      />
                                                    </>
                                                  )}
                                                </div>
                                                <div style={{width:'50%'}}>
                                                  {index.result_2_type != 0 ? (
                                                    <>
                                                      <input type="text" value={result_text_2} className={'w-100 ' + (index.result_2_type == 1?'':'numeric-input')} 
                                                        onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                                        onBlur = {this.setResult.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                                        onChange={this.resultChange.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)} autoFocus={true}/>
                                                    </>
                                                  ):(
                                                    <>
                                                      <SelectorWithLabel
                                                        title=""
                                                        options={selectOptions}
                                                        getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 2)}
                                                        departmentEditCode = {result_2}
                                                      />
                                                    </>
                                                  )}
                                                </div>
                                                </>
                                              ) : (
                                                <>
                                                {index.result_type != 0 ? (
                                                  <>
                                                    <input type="text" value={result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')}
                                                      onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                      onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                      onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                                  </>
                                                ):(
                                                  <>
                                                    <SelectorWithLabel
                                                      title=""
                                                      options={selectOptions}
                                                      getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 1)}
                                                      departmentEditCode = {result}
                                                    />
                                                  </>
                                                )}
                                                </>
                                              )}
                                            </>
                                            ) : (
                                              <>
                                              {index.result_2_is_enabled ? (
                                                <>
                                                <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                                  <div className="border-right-dot" style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                                    {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                                  </div>
                                                  <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>{this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;</div>
                                                </div>
                                                </>
                                              ):(
                                                <>
                                                <div onClick={this.unselectTd.bind(this)} className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                                  {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                                </div>
                                                </>
                                              )}
                                              </>
                                            )}
                                            </div>
                                          </>
                                        )
                                      })}
                                      </>
                                    )}

                                  </div>
                                  </>
                                )}
                                {item == "title" && (
                                  <>
                                    <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                                    {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                      let select_id = "timezone_" + timezone_item.number + "_" + index.title_id;
                                      var result = '';
                                      var result_2 = '';
                                      var result_text = '';
                                      var result_text_2 = '';
                                      if (index != null && index.input_values != undefined && index.input_values.length > 0){
                                        index.input_values.map(sub_input_value => {
                                          if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date) && timezone_item.number == sub_input_value.timezone_id){
                                            result = sub_input_value.result;
                                            result_2 = sub_input_value.result_2;
                                            result_text = sub_input_value.elapsed_result_text;
                                            result_text_2 = sub_input_value.elapsed_result_text_2;
                                          }
                                        })
                                      }
                                      return(
                                        <>
                                          <div className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} style={{width:div_width}}>
                                          {this.state.editable_title_id == select_id ? (
                                          <>
                                            {index.result_2_is_enabled ? (
                                              <>
                                                <div className="border-right-dot" style={{width:'50%'}}>
                                                  {index.result_type != 0 ? (
                                                    <>
                                                      <input type="text" value={result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')} 
                                                        onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                        onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                        onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                                    </>
                                                  ):(
                                                    <>
                                                      <SelectorWithLabel
                                                        title=""
                                                        options={selectOptions}
                                                        getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 1)}
                                                        departmentEditCode = {result}
                                                      />
                                                    </>
                                                  )}
                                                </div>
                                                <div style={{width:'50%'}}>
                                                  {index.result_2_type != 0 ? (
                                                    <>
                                                      <input type="text" value={result_text_2} className={'w-100 ' + (index.result_2_type == 1?'':'numeric-input')} 
                                                        onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                                        onBlur = {this.setResult.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                                        onChange={this.resultChange.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)} autoFocus={true}/>
                                                    </>
                                                  ):(
                                                    <>
                                                      <SelectorWithLabel
                                                        title=""
                                                        options={selectOptions}
                                                        getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 2)}
                                                        departmentEditCode = {result_2}
                                                      />
                                                    </>
                                                  )}
                                                </div>
                                              </>
                                            ):(
                                              <>
                                                {index.result_type != 0 ? (
                                                  <>
                                                    <input type="text" value={result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')} 
                                                      onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                      onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                      onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                                  </>
                                                ):(
                                                  <>
                                                    <SelectorWithLabel
                                                      title=""
                                                      options={selectOptions}
                                                      getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 1)}
                                                      departmentEditCode = {result}
                                                    />
                                                  </>
                                                )}
                                              </>
                                            )}
                                          </>
                                          ) : (
                                            <>
                                            {index.result_2_is_enabled ? (
                                              <>
                                              <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} id={"timezone_" + timezone_item.number + "_" + index.title_id}>
                                                <div className="border-right-dot" style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                                  {this.getTdState(item, cur_date, index, timezone_item.number, 1)}&nbsp;
                                                </div>
                                                <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                                  {this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;
                                                </div>                                                
                                              </div>
                                              </>
                                            ):(
                                              <>
                                              <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} onClick={this.unselectTd.bind(this)}
                                                id={"timezone_" + timezone_item.number + "_" + index.title_id}>{this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;</div>
                                              </>
                                            )}
                                            </>
                                          )}
                                          </div>
                                        </>
                                      )
                                    })}
                                    </div>
                                  </>
                                )}
                                {item == "free_title" && (
                                  <>
                                    <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                                    {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                      let select_id = "timezone_" + timezone_item.number + "_" + index.number;
                                      var result = '';
                                      if (index != null && index.input_values != undefined && index.input_values.length > 0){
                                        index.input_values.map(sub_input_value => {
                                          if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date) && timezone_item.number == sub_input_value.timezone_id){
                                            result = sub_input_value.elapsed_result_text;
                                          }
                                        })
                                      }
                                      return(
                                        <>
                                          <div className={timezone_index==(timezone_length - 1)?"":"border-right"} style={{width:div_width}}>
                                          {this.state.editable_title_id == select_id ? (
                                            <input type="text" value={result} className='w-100' onKeyDown = {this.checkKeyEvent.bind(this)}
                                              onChange={this.resultFreeChange.bind(this, cur_date, index, timezone_item.number)} autoFocus={true}/>
                                          ) : (
                                            <>
                                              <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} onClick={this.unselectTd.bind(this)}
                                                id={"timezone_" + timezone_item.number + "_" + index.number}>{this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;</div>
                                            </>
                                          )}
                                          </div>
                                        </>
                                      )
                                    })}
                                    </div>
                                  </>
                                )}
                                {item == 'oxy' && (
                                  <>
                                    <div onClick={this.unselectTd.bind(this)}>
                                      {this.getTdState(item, cur_date, index) != ''?this.getTdState(item, cur_date, index):renderHTML('&nbsp;')}
                                    </div>
                                  </>
                                )}
                              </>
                            ):(
                              <>
                                {item == 'always_title' && (
                                  <>
                                  {index.is_once_a_day == 1 ? (
                                    <>
                                    <div className={"d-flex w-100 h-100"}>
                                    {index.result_2_is_enabled ? (                                    
                                      <>
                                      <div style={{fontSize:'0.9rem', width:'100%', minHeight:'2.5rem'}} className='d-flex'>
                                        <div style={{width:'50%'}} className="border-right-dot" onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 1)}&nbsp;
                                        </div>
                                        <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 1, 2)}&nbsp;
                                        </div>
                                      </div>
                                      </>
                                    ) : (
                                      <>
                                      <div style={{fontSize:'0.9rem', width:'100%', minHeight:'2.5rem'}} onClick={this.unselectTd.bind(this)}>
                                        {this.getTdState(item, cur_date, index, 1)}&nbsp;
                                      </div>
                                      </>
                                    )}
                                    </div>
                                    </>
                                  ) : (                            
                                    <>
                                    <div className={"d-flex w-100 h-100"}>
                                      {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                        return (
                                          <>
                                          {index.result_2_is_enabled ? (                                    
                                            <>
                                            <div style={{fontSize:'0.9rem', width:div_width, minHeight:'2.5rem'}} className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                              <div style={{width:'50%'}} className="border-right-dot" onClick={this.unselectTd.bind(this)}>
                                                {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                              </div>
                                              <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                                {this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;
                                              </div>
                                            </div>
                                            </>
                                          ) : (
                                            <>
                                            <div style={{fontSize:'0.9rem', width:div_width, minHeight:'2.5rem'}} onClick={this.unselectTd.bind(this)}
                                              className={timezone_index==(timezone_length - 1)?"":"border-right"} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                              {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                            </div>
                                            </>
                                          )}
                                          </>
                                        )
                                      })}
                                    </div>
                                    </>
                                  )}
                                  </>
                                )}
                                {item == "title" && (
                                  <>
                                    <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                                      {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                        return (
                                          <>
                                          {index.result_2_is_enabled ? (
                                            <>
                                            <div className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} id={"timezone_" + timezone_item.number + "_" + index.title_id} style={{width:div_width}}>
                                              <div className="border-right-dot" style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                                {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                              </div>
                                              <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                                {this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;
                                              </div>                                              
                                            </div>
                                            </>
                                          ):(
                                            <>
                                            <div className={timezone_index==(timezone_length - 1)?"":"border-right"} onClick={this.unselectTd.bind(this)}
                                              id={"timezone_" + timezone_item.number + "_" + index.title_id} style={{width:div_width}}>
                                              {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                            </div>
                                            </>
                                          )}
                                          </>
                                        )
                                      })}
                                    </div>
                                  </>
                                )}
                                {item == "free_title" && (
                                  <>
                                    <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                                      {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                        return (
                                          <>
                                            <div className={timezone_index==(timezone_length - 1)?"":"border-right"} onClick={this.unselectTd.bind(this)}
                                              id={"timezone_" + timezone_item.number + "_" + index.number} style={{width:div_width}}>{this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;</div>
                                          </>
                                        )
                                      })}
                                    </div>
                                  </>
                                )}
                                {(item == 'eaten_rate' || item== 'side_food_eaten_rate') && (
                                  <>
                                  <div className={'d-flex w-100 h-100 ' + (this.checkAfterToday(cur_date)?'disabled-td':'')}>
                                    <div className={'border-right'} onDoubleClick={this.mealDoubleClick.bind(this, item, 'morning', cur_date)} style={{width:'25%'}}>
                                      {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='morning' && this.state.editing_meal_cur_date == cur_date) ? (
                                        <>
                                          <input className='w-100' autoFocus={true} 
                                            onKeyDown = {this.checkKeyEvent.bind(this)}
                                            onChange = {this.changeMealRate.bind(this,item,1, cur_date)}
                                            value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][1]) !='' ? this.state.meal_data[cur_date][1][item] :''}
                                          />
                                        </>
                                      ):(
                                        <>
                                        <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 1) != ''?this.getTdState(item, cur_date, index, 1):renderHTML('&nbsp;')}
                                        </div>
                                        </>
                                      )}
                                    </div>
                                    <div className='border-right' onDoubleClick={this.mealDoubleClick.bind(this,item, 'noon', cur_date)} style={{width:'25%'}}>
                                      {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='noon' && this.state.editing_meal_cur_date == cur_date) ? (
                                        <>
                                          <input className='w-100' autoFocus={true} 
                                            onKeyDown = {this.checkKeyEvent.bind(this)}
                                            onChange = {this.changeMealRate.bind(this,item, 2, cur_date)}
                                            value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][2]) !='' ? this.state.meal_data[cur_date][2][item] :''}
                                          />
                                        </>
                                      ):(
                                        <>
                                        <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 2) != ''?this.getTdState(item, cur_date, index, 2):renderHTML('&nbsp;')}
                                        </div>
                                        </>
                                      )}
                                    </div>
                                    <div className='border-right' onDoubleClick={this.mealDoubleClick.bind(this, item,'between_meal', cur_date)} style={{width:'25%'}}>
                                      {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='between_meal' && this.state.editing_meal_cur_date == cur_date) ? (
                                        <>
                                          <input className='w-100' autoFocus={true}
                                            onKeyDown = {this.checkKeyEvent.bind(this)}
                                            onChange = {this.changeMealRate.bind(this,item, 4 , cur_date)}
                                            value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][4]) !='' ? this.state.meal_data[cur_date][4][item] :''}
                                          />
                                        </>
                                      ):(
                                        <>
                                        <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 4) != ''?this.getTdState(item, cur_date, index, 4):renderHTML('&nbsp;')}
                                        </div>
                                        </>
                                      )}
                                    </div>
                                    <div className='' onDoubleClick={this.mealDoubleClick.bind(this,item, 'evening', cur_date)} style={{width:'25%'}}>
                                      {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='evening' && this.state.editing_meal_cur_date == cur_date) ? (
                                        <>
                                          <input className='w-100' autoFocus={true}
                                            onKeyDown = {this.checkKeyEvent.bind(this)}
                                            onChange = {this.changeMealRate.bind(this,item, 3, cur_date)}
                                            value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][3]) !='' ? this.state.meal_data[cur_date][3][item] :''}
                                          />
                                        </>
                                      ):(
                                        <>
                                        <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 3) != ''?this.getTdState(item, cur_date, index, 3):renderHTML('&nbsp;')}
                                        </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  </>
                                )}
                                {item != 'always_title' && item != 'title' && item != 'free_title' && item != 'eaten_rate' && item !='side_food_eaten_rate' && (
                                  <>
                                    <div onClick={this.unselectTd.bind(this)}>
                                      {this.getTdState(item, cur_date, index) != ''?this.getTdState(item, cur_date, index):renderHTML('&nbsp;')}
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        )}
                      </>
                    ):(
                      <td style={{width:this.cell_width_2 + 'rem'}} onDoubleClick={this.doubleClick.bind(this, item, cur_datetime, index, treat_detail_id)} onContextMenu={e => this.handleClick(e, item, cur_datetime, index, treat_detail_id)} className={` content-td`}>
                          <>
                          <div onClick={this.unselectTd.bind(this)}>
                            {this.getTdState(item, cur_datetime, index) != ''?this.getTdState(item, cur_date, index):renderHTML('&nbsp;')}                            
                          </div>
                          </>
                      </td>
                    )}
                  </>
                ):(
                  <>
                    <td style={{width:this.cell_width_2 + 'rem'}}><div onClick={this.unselectTd.bind(this)}>&nbsp;</div></td>
                  </>
                )}
              </>
            );
          }
        }
        if (this.state.range == 3){   //1時間
          if(type === 'thead'){
            table_menu.push(
              <th style={{width:this.cell_width_3  + 'rem'}} onContextMenu={e => this.handleClick_th(e)}>{while_condition}</th>
            )
          }
          if(type === 'tbody') {
            // if (while_condition == 0){
            let hour_number = while_condition * 1;
            hour_number = (hour_number) < 10 ? '0' + (hour_number) : (hour_number);
            let cur_date = now_year + "-" + tmp_month + "-" + tmp_date;
            let cur_datetime = now_year + "-" + tmp_month + "-" + tmp_date + " " + hour_number + ":00";
            let elapsed_timezone_master = this.elapsed_timezone_master;
            let timezone_length = elapsed_timezone_master.length;
            let div_width = (100 / timezone_length) + "%";

            if (item == 'always_title' && index != null && index.is_once_a_day == 1){
              always_result = '';
              always_result_2 = '';
              always_result_text = '';
              always_result_text_2 = '';
              if (index.input_values != undefined && index.input_values.length > 0){
                index.input_values.map(sub_input_value => {
                  if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date)){
                    always_result = sub_input_value.result;
                    always_result_2 = sub_input_value.result_2;
                    always_result_text = sub_input_value.elapsed_result_text;
                    always_result_text_2 = sub_input_value.elapsed_result_text_2;
                  }
                })
              }
            }

            table_menu.push(
              <>
                {item != null ? (
                  <>
                    {(item == 'always_title' || item == 'eaten_rate' || item =='side_food_eaten_rate' || item == 'oxy' || item == 'free_title' || item == 'title' || item == "hospital_dates" || item == "surgery_day" || item == "morning" || item == "noon" || item == "evening"
                      || item == 'between_meal' || item == "move_info" || item == "graph" || item == "treatment" || item == "inspection_data" || item == "tmp_inspection_data" || item == "multi_treatment" || item == "elapsed_treat") ? (
                      <>
                        {while_condition == 0 && (
                          <td style={{width:this.cell_width_3 + 'rem', height:"1rem"}} colSpan={24} className={`content-td`} onDoubleClick={this.doubleClick.bind(this, item, cur_date, index,treat_detail_id)} onContextMenu={e => this.handleClick(e, item, cur_date, index, treat_detail_id)}>
                            {this.state.editable_date == cur_date && this.state.editable_item == index && this.state.dbl_click_type == item ? (
                              <>
                                {item == 'always_title' && (
                                  <>
                                  <div className={"d-flex w-100 h-100"}>
                                    {index.is_once_a_day == 1 ? (
                                      <>
                                      {index.result_2_is_enabled ? (
                                        <>
                                        <div style={{width:'50%'}} className="border-right-dot">
                                          {index.result_type != 0 ? (
                                            <>
                                              <input type="text" value={always_result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')} 
                                                onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                                onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                                onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)} autoFocus={true}/>
                                            </>
                                          ):(
                                            <>
                                              <SelectorWithLabel
                                                title=""
                                                options={selectOptions}
                                                getSelect={this.resultChange.bind(this, cur_date, index, "select", 1,1)}
                                                departmentEditCode = {always_result}
                                              />
                                            </>
                                          )}
                                        </div>
                                        <div style={{width:'50%'}}>
                                          {index.result_2_type != 0 ? (
                                            <>
                                              <input type="text" value={always_result_text_2} className={'w-100 ' + (index.result_2_type == 1?'':'numeric-input')} 
                                                onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', 1, 2)}
                                                onBlur = {this.setResult.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', 1, 2)}
                                                onChange={this.resultChange.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', 1, 2)} autoFocus={true}/>
                                            </>
                                          ):(
                                            <>
                                              <SelectorWithLabel
                                                title=""
                                                options={selectOptions}
                                                getSelect={this.resultChange.bind(this, cur_date, index, "select", 1, 2)}
                                                departmentEditCode = {always_result_2}
                                              />
                                            </>
                                          )}
                                        </div>
                                        </>
                                      ) : (
                                        <>
                                        {index.result_type != 0 ? (
                                          <>
                                            <input type="text" value={always_result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')}
                                              onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                              onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)}
                                              onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', 1, 1)} autoFocus={true}/>
                                          </>
                                        ):(
                                          <>
                                            <SelectorWithLabel
                                              title=""
                                              options={selectOptions}
                                              getSelect={this.resultChange.bind(this, cur_date, index, "select", 1, 1)}
                                              departmentEditCode = {always_result}
                                            />
                                          </>
                                        )}
                                        </>
                                      )}
                                      </>
                                    ):(
                                      <>
                                      {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                        let select_id = "timezone_" + timezone_item.number + "_" + index.tier_3rd_id;
                                        var result = '';
                                        var result_2 = '';
                                        var result_text = '';
                                        var result_text_2 = '';
                                        if (index != null && index.input_values != undefined && index.input_values.length > 0){
                                          index.input_values.map(sub_input_value => {
                                            if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date) && timezone_item.number == sub_input_value.timezone_id){                                    
                                              result = sub_input_value.result;
                                              result_2 = sub_input_value.result_2;
                                              result_text = sub_input_value.elapsed_result_text;
                                              result_text_2 = sub_input_value.elapsed_result_text_2;
                                            }
                                          })
                                        }                              
                                        return(
                                          <>
                                            <div className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} style={{width:div_width, minHeight:'2.5rem'}}>
                                            {this.state.editable_title_id == select_id ? (                                    
                                            <>
                                              {index.result_2_is_enabled ? (
                                                <>
                                                <div style={{width:'50%'}} className="border-right-dot">
                                                  {index.result_type != 0 ? (
                                                    <>
                                                      <input type="text" value={result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')} 
                                                        onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                        onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                        onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                                    </>
                                                  ):(
                                                    <>
                                                      <SelectorWithLabel
                                                        title=""
                                                        options={selectOptions}
                                                        getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number,1)}
                                                        departmentEditCode = {result}
                                                      />
                                                    </>
                                                  )}
                                                </div>
                                                <div style={{width:'50%'}}>
                                                  {index.result_2_type != 0 ? (
                                                    <>
                                                      <input type="text" value={result_text_2} className={'w-100 ' + (index.result_2_type == 1?'':'numeric-input')} 
                                                        onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                                        onBlur = {this.setResult.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                                        onChange={this.resultChange.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)} autoFocus={true}/>
                                                    </>
                                                  ):(
                                                    <>
                                                      <SelectorWithLabel
                                                        title=""
                                                        options={selectOptions}
                                                        getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 2)}
                                                        departmentEditCode = {result_2}
                                                      />
                                                    </>
                                                  )}
                                                </div>
                                                </>
                                              ) : (
                                                <>
                                                {index.result_type != 0 ? (
                                                  <>
                                                    <input type="text" value={result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')}
                                                      onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                      onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                      onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                                  </>
                                                ):(
                                                  <>
                                                    <SelectorWithLabel
                                                      title=""
                                                      options={selectOptions}
                                                      getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 1)}
                                                      departmentEditCode = {result}
                                                    />
                                                  </>
                                                )}
                                                </>
                                              )}
                                            </>
                                            ) : (
                                              <>
                                              {index.result_2_is_enabled ? (
                                                <>
                                                <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                                  <div className="border-right-dot" style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                                    {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                                  </div>
                                                  <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>{this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;</div>
                                                </div>
                                                </>
                                              ):(
                                                <>
                                                <div onClick={this.unselectTd.bind(this)} className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                                  {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                                </div>
                                                </>
                                              )}
                                              </>
                                            )}
                                            </div>
                                          </>
                                        )
                                      })}
                                      </>
                                    )}

                                  </div>
                                  </>
                                )}
                                {item == "title" && (
                                  <>
                                    <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                                    {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                      let select_id = "timezone_" + timezone_item.number + "_" + index.title_id;
                                      var result = '';
                                      var result_2 = '';
                                      var result_text = '';
                                      var result_text_2 = '';
                                      if (index != null && index.input_values != undefined && index.input_values.length > 0){
                                        index.input_values.map(sub_input_value => {
                                          if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date) && timezone_item.number == sub_input_value.timezone_id){
                                            result = sub_input_value.result;
                                            result_2 = sub_input_value.result_2;
                                            result_text = sub_input_value.elapsed_result_text;
                                            result_text_2 = sub_input_value.elapsed_result_text_2;
                                          }
                                        })
                                      }
                                      return(
                                        <>
                                          <div className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} style={{width:div_width}}>
                                          {this.state.editable_title_id == select_id ? (
                                          <>
                                            {index.result_2_is_enabled ? (
                                              <>
                                                <div style={{width:'50%'}} className="border-right-dot">
                                                  {index.result_type != 0 ? (
                                                    <>
                                                      <input type="text" value={result_text} className={'w-100 ' + index.result_type == 1?'':'numeric-input'} 
                                                        onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                        onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                        onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                                    </>
                                                  ):(
                                                    <>
                                                      <SelectorWithLabel
                                                        title=""
                                                        options={selectOptions}
                                                        getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 1)}
                                                        departmentEditCode = {result}
                                                      />
                                                    </>
                                                  )}
                                                </div>
                                                <div style={{width:'50%'}}>
                                                  {index.result_2_type == 1 ? (
                                                    <>
                                                      <input type="text" value={result_text_2} className={'w-100 ' + (index.result_2_type == 1?'':'numeric-input')} 
                                                        onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                                        onBlur = {this.setResult.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)}
                                                        onChange={this.resultChange.bind(this, cur_date, index, index.result_2_type == 1?"text":'numeric', timezone_item.number, 2)} autoFocus={true}/>
                                                    </>
                                                  ):(
                                                    <>
                                                      <SelectorWithLabel
                                                        title=""
                                                        options={selectOptions}
                                                        getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 2)}
                                                        departmentEditCode = {result_2}
                                                      />
                                                    </>
                                                  )}
                                                </div>
                                              </>
                                            ) : (
                                              <>
                                              {index.result_type != 0 ? (
                                                <>
                                                  <input type="text" value={result_text} className={'w-100 ' + (index.result_type == 1?'':'numeric-input')}
                                                    onKeyDown = {this.checkEnterEvent.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                    onBlur = {this.setResult.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)}
                                                    onChange={this.resultChange.bind(this, cur_date, index, index.result_type == 1?"text":'numeric', timezone_item.number, 1)} autoFocus={true}/>
                                                </>
                                              ):(
                                                <>
                                                  <SelectorWithLabel
                                                    title=""
                                                    options={selectOptions}
                                                    getSelect={this.resultChange.bind(this, cur_date, index, "select", timezone_item.number, 1)}
                                                    departmentEditCode = {result}
                                                  />
                                                </>
                                              )}
                                              </>
                                            )}
                                          </>
                                          ) : (
                                            <>
                                            {index.result_2_is_enabled ? (
                                              <>
                                              <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} id={"timezone_" + timezone_item.number + "_" + index.title_id}>
                                                <div onClick={this.unselectTd.bind(this)} style={{width:'50%'}} className="border-right-dot">
                                                  {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                                </div>
                                                <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                                  {this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;
                                                </div>
                                              </div>
                                              </>
                                            ) : (
                                              <>
                                              <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} onClick={this.unselectTd.bind(this)}
                                                id={"timezone_" + timezone_item.number + "_" + index.title_id}>
                                                {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                              </div>
                                              </>
                                            )}
                                            </>
                                          )}
                                          </div>
                                        </>
                                      )
                                    })}
                                    </div>
                                  </>
                                )}
                                {item == "free_title" && (
                                  <>
                                    <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                                    {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                      let select_id = "timezone_" + timezone_item.number + "_" + index.number;
                                      var result = '';
                                      if (index != null && index.input_values != undefined && index.input_values.length > 0){
                                        index.input_values.map(sub_input_value => {
                                          if (formatDateLine(formatDateTimeIE(sub_input_value.input_datetime)) == formatDateLine(cur_date) && timezone_item.number == sub_input_value.timezone_id){
                                            result = sub_input_value.elapsed_result_text;
                                          }
                                        })
                                      }
                                      return(
                                        <>
                                          <div className={timezone_index==(timezone_length - 1)?"":"border-right"} style={{width:div_width}}>
                                          {this.state.editable_title_id == select_id ? (
                                          <>
                                            <input type="text" value={result} className='w-100' onKeyDown = {this.checkKeyEvent.bind(this)}
                                              onChange={this.resultFreeChange.bind(this, cur_date, index, timezone_item.number)} autoFocus={true}/>
                                          </>
                                          ) : (
                                            <>
                                              <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')} onClick={this.unselectTd.bind(this)}
                                                id={"timezone_" + timezone_item.number + "_" + index.number}>{this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;</div>
                                            </>
                                          )}
                                          </div>
                                        </>
                                      )
                                    })}
                                    </div>
                                  </>
                                )}
                                {item == 'oxy' && (
                                  <>
                                    <div onClick={this.unselectTd.bind(this)}>
                                      {this.getTdState(item, cur_date, index) != ''?this.getTdState(item, cur_date, index):renderHTML('&nbsp;')}
                                    </div>
                                  </>
                                )}
                              </>
                            ):(
                              <>
                                {item == 'always_title' && (
                                  <>
                                  {index.is_once_a_day == 1 ? (
                                    <>
                                    <div className={"d-flex w-100 h-100"}>
                                    {index.result_2_is_enabled ? (                                    
                                      <>
                                      <div style={{fontSize:'0.9rem', width:'100%', minHeight:'2.5rem'}} className='d-flex'>
                                        <div style={{width:'50%'}} className="border-right-dot" onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 1)}&nbsp;
                                        </div>
                                        <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 1, 2)}&nbsp;
                                        </div>
                                      </div>
                                      </>
                                    ) : (
                                      <>
                                      <div style={{fontSize:'0.9rem', width:'100%', minHeight:'2.5rem'}} onClick={this.unselectTd.bind(this)}>
                                        {this.getTdState(item, cur_date, index, 1)}&nbsp;
                                      </div>
                                      </>
                                    )}
                                    </div>
                                    </>
                                  ) : (                            
                                    <>
                                    <div className={"d-flex w-100 h-100"}>
                                      {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                        return (
                                          <>
                                          {index.result_2_is_enabled ? (                                    
                                            <>
                                            <div style={{fontSize:'0.9rem', width:div_width, minHeight:'2.5rem'}} className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                              <div style={{width:'50%'}} className="border-right-dot" onClick={this.unselectTd.bind(this)}>
                                                {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                              </div>
                                              <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                                {this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;
                                              </div>
                                            </div>
                                            </>
                                          ) : (
                                            <>
                                            <div style={{fontSize:'0.9rem', width:div_width, minHeight:'2.5rem'}} onClick={this.unselectTd.bind(this)}
                                              className={timezone_index==(timezone_length - 1)?"":"border-right"} id={"timezone_" + timezone_item.number + "_" + index.tier_3rd_id}>
                                              {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                            </div>
                                            </>
                                          )}
                                          </>
                                        )
                                      })}
                                    </div>
                                    </>
                                  )}
                                  </>
                                )}
                                {item == "title" && (
                                  <>
                                    <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                                      {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                        return (
                                          <>
                                          {index.result_2_is_enabled ? (
                                            <>
                                            <div className={timezone_index==(timezone_length - 1)?"flex":"border-right flex"} id={"timezone_" + timezone_item.number + "_" + index.title_id} style={{width:div_width}}>
                                              <div style={{width:'50%'}} className="border-right-dot" onClick={this.unselectTd.bind(this)}>
                                                {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                              </div>
                                              <div style={{width:'50%'}} onClick={this.unselectTd.bind(this)}>
                                                {this.getTdState(item, cur_date, index, timezone_item.number, 2)}&nbsp;
                                              </div>
                                            </div>
                                            </>
                                          ) : (
                                            <>
                                            <div className={timezone_index==(timezone_length - 1)?"":"border-right"} id={"timezone_" + timezone_item.number + "_" + index.title_id} style={{width:div_width}}>
                                              {this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;
                                            </div>
                                            </>
                                          )}
                                          </>
                                        )
                                      })}
                                    </div>
                                  </>
                                )}
                                {item == "free_title" && (
                                  <>
                                    <div className={"d-flex w-100 h-100 " + (this.checkEnableDate(cur_date, index)?'':'disabled-td')}>
                                      {elapsed_timezone_master.map((timezone_item, timezone_index)=>{
                                        return (
                                          <>
                                            <div className={timezone_index==(timezone_length - 1)?"":"border-right"} onClick={this.unselectTd.bind(this)}
                                              id={"timezone_" + timezone_item.number + "_" + index.number} style={{width:div_width}}>{this.getTdState(item, cur_date, index, timezone_item.number)}&nbsp;</div>
                                          </>
                                        )
                                      })}
                                    </div>
                                  </>
                                )}
                                {(item == 'eaten_rate' || item== 'side_food_eaten_rate') && (
                                  <>
                                  <div className={'d-flex w-100 h-100 ' + (this.checkAfterToday(cur_date)?'disabled-td':'')}>
                                    <div className={'border-right'} onDoubleClick={this.mealDoubleClick.bind(this, item, 'morning', cur_date)} style={{width:'25%'}}>
                                      {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='morning' && this.state.editing_meal_cur_date == cur_date) ? (
                                        <>
                                          <input className='w-100' autoFocus={true} 
                                            onKeyDown = {this.checkKeyEvent.bind(this)}
                                            onChange = {this.changeMealRate.bind(this,item,1, cur_date)}
                                            value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][1]) !='' ? this.state.meal_data[cur_date][1][item] :''}
                                          />
                                        </>
                                      ):(
                                        <>
                                        <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 1) != ''?this.getTdState(item, cur_date, index, 1):renderHTML('&nbsp;')}
                                        </div>
                                        </>
                                      )}
                                    </div>
                                    <div className='border-right' onDoubleClick={this.mealDoubleClick.bind(this,item, 'noon', cur_date)} style={{width:'25%'}}>
                                      {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='noon' && this.state.editing_meal_cur_date == cur_date) ? (
                                        <>
                                          <input className='w-100' autoFocus={true} 
                                            onKeyDown = {this.checkKeyEvent.bind(this)}
                                            onChange = {this.changeMealRate.bind(this,item, 2, cur_date)}
                                            value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][2]) !='' ? this.state.meal_data[cur_date][2][item] :''}
                                          />
                                        </>
                                      ):(
                                        <>
                                        <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 2) != ''?this.getTdState(item, cur_date, index, 2):renderHTML('&nbsp;')}
                                        </div>
                                        </>
                                      )}
                                    </div>
                                    <div className='border-right' onDoubleClick={this.mealDoubleClick.bind(this, item,'between_meal', cur_date)} style={{width:'25%'}}>
                                      {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='between_meal' && this.state.editing_meal_cur_date == cur_date) ? (
                                        <>
                                          <input className='w-100' autoFocus={true}
                                            onKeyDown = {this.checkKeyEvent.bind(this)}
                                            onChange = {this.changeMealRate.bind(this,item, 4 , cur_date)}
                                            value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][4]) !='' ? this.state.meal_data[cur_date][4][item] :''}
                                          />
                                        </>
                                      ):(
                                        <>
                                        <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 4) != ''?this.getTdState(item, cur_date, index, 4):renderHTML('&nbsp;')}
                                        </div>
                                        </>
                                      )}
                                    </div>
                                    <div className='' onDoubleClick={this.mealDoubleClick.bind(this,item, 'evening', cur_date)} style={{width:'25%'}}>
                                      {(this.state.editing_rate_type == item && this.state.editing_meal_time_kind =='evening' && this.state.editing_meal_cur_date == cur_date) ? (
                                        <>
                                          <input className='w-100' autoFocus={true}
                                            onKeyDown = {this.checkKeyEvent.bind(this)}
                                            onChange = {this.changeMealRate.bind(this,item, 3, cur_date)}
                                            value = {filterShow(this.state.meal_data[cur_date]) !='' && filterShow(this.state.meal_data[cur_date][3]) !='' ? this.state.meal_data[cur_date][3][item] :''}
                                          />
                                        </>
                                      ):(
                                        <>
                                        <div className="h-100 w-100" onClick={this.unselectTd.bind(this)}>
                                          {this.getTdState(item, cur_date, index, 3) != ''?this.getTdState(item, cur_date, index, 3):renderHTML('&nbsp;')}
                                        </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  </>
                                )}
                                {item != 'always_title' || item != 'title' && item != 'free_title' && item != 'eaten_rate' && item !='side_food_eaten_rate' && (
                                  <>
                                    <div onClick={this.unselectTd.bind(this)}>
                                      {this.getTdState(item, cur_date, index) != ''?this.getTdState(item, cur_date, index):renderHTML('&nbsp;')}
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </td>
                        )}
                      </>
                    ):(
                      <td style={{width:this.cell_width_3 + 'rem'}} onDoubleClick={this.doubleClick.bind(this, item, cur_datetime, index, treat_detail_id)} onContextMenu={e => this.handleClick(e, item, cur_datetime, index, treat_detail_id)} className={`content-td`}>
                        <>
                        <div onClick={this.unselectTd.bind(this)}>
                          {this.getTdState(item, cur_datetime, index) != ''?this.getTdState(item, cur_date, index):renderHTML('&nbsp;')}
                        </div>
                        </>
                      </td>
                    )}
                  </>
                ):(
                  <>
                    <td style={{width: this.cell_width_3 + 'rem'}}><div onClick={this.unselectTd.bind(this)}>&nbsp;</div></td>
                  </>
                )}
              </>
            );
          }
          // }
        }
        while_condition ++;
      } while (while_condition < cycle_max);
    }
    return table_menu;
  };

  changeMealRate = (rate_type, meal_time_kind,cur_date,  e) => {    
    var meal_data = this.state.meal_data;
    let regx = /^([-ー]{1}|[0-9０-９]+)$/;
    
    if (e.target.value != "" && !regx.test(e.target.value)) return;
    var input_value = e.target.value;    
    if (input_value != "") {
      input_value = parseInt(toHalfWidthOnlyNumber(input_value));
      if (isNaN(input_value)) input_value = '-';
    }
    if (input_value > 10 || input_value < 0){
      this.setState({
        alert_messages:'摂取割合は0以上・10以下の値を入力してください。'
      })
      return;
    }
    if (meal_data[cur_date] == undefined)  meal_data[cur_date] = {};
    if (meal_data[cur_date][meal_time_kind] == undefined) meal_data[cur_date][meal_time_kind] = {};
    meal_data[cur_date][meal_time_kind][rate_type] = input_value;
    if (input_value >= 0 && input_value <= 10) meal_data[cur_date][meal_time_kind][rate_type+'_is_disabled'] = 0;
    meal_data[cur_date][meal_time_kind].is_changed = 1;

    this.setState({
      meal_data, 
      meal_changed:true,
    }, () => {
      this.saveCondition();
      this.props.setChangeStatus(true);
    });
  }

  checkKeyEvent = (e) => {
    if (e.keyCode == 13 || e.keyCode == 9){
      this.setState({
        dbl_click_type:'',
        editing_meal_cur_date:'',
        editing_meal_time_kind:'',
        editing_rate_type:''
      })
    }
  }

  checkEnterEvent = (cur_date = null, result_item = null, type = "text",timezone = 1, result_kind = 1, e) => {
    var obj = null;
    if (result_item != null){
      obj = e.target;
    }    
    if (e.keyCode == 13  || e.keyCode == 9){
      this.setState({
        dbl_click_type:'',
        editing_meal_cur_date:'',
        editing_meal_time_kind:'',
        editing_rate_type:''
      }, () => {
        if (result_item == null) return;        
        var result_value = '';        
        result_value = obj.value;
        var result_val_len = 0;    
        if (type == 'numeric' && result_value != ''){
          result_value = parseFloat(result_value);      
          if (isNaN(result_value)) {
            result_value = '';
          } else {
            result_val_len = result_value.toString().length;
          }
        }
        if (type == 'text' && result_value != ''){
          result_val_len = result_value.length;
        }    
        if (result_kind == 1){
          if (result_item.result_length > 0 && result_val_len > result_item.result_length){
            this.setState({alert_messages:'最大文字数以上入力しました。'})
            obj.focus();
            obj.setSelectionRange(obj.value.length -1, obj.value.length -1);
            return;
          }
        } else {
          if (result_item.result_2_length > 0 && result_val_len > result_item.result_2_length){
            this.setState({alert_messages:'最大文字数以上入力しました。'});
            obj.focus();
            obj.setSelectionRange(obj.value.length -1, obj.value.length -1);
            return;
          }
        }
        let {elapsed_result} = this.state;
        let find_index = elapsed_result.findIndex(x=>{
          if (x.title_id > 0 && x.title_id == result_item.title_id) return true;
          if (!(x.title_id> 0) && x.tier_3rd_id == result_item.tier_3rd_id) return true;          
        });
        if (find_index != -1) {
          let input_value = {
            title_id:result_item.title_id,
            tier_3rd_id:result_item.tier_3rd_id,
            input_datetime: cur_date,        
            comment:result_item.comment,
            is_new: true,
            timezone_id: timezone
          };
          if (result_kind == 1){        
            input_value.elapsed_result_text = result_value;
          } else {        
            input_value.elapsed_result_text_2 = result_value;
          }
          if (elapsed_result[find_index].input_values === undefined) {
            elapsed_result[find_index].input_values = [input_value];
          } else {
            var input_values = elapsed_result[find_index].input_values;        
            let index = input_values.findIndex(x=>x.input_datetime==cur_date && x.timezone_id == timezone);        
            if(index == -1) {
              input_values.push(input_value);
            } else {          
              if (result_kind == 1){
                input_value.result_2 = elapsed_result[find_index].input_values[index].result_2;
                input_value.elapsed_result_text_2 = elapsed_result[find_index].input_values[index].elapsed_result_text_2;
              } else {
                input_value.result = elapsed_result[find_index].input_values[index].result;
                input_value.elapsed_result_text = elapsed_result[find_index].input_values[index].elapsed_result_text;
              }
              elapsed_result[find_index].input_values[index] = input_value;
            }        
          }
        }
        this.setState({
          elapsed_result,
          editable_date: undefined,
          editable_item: undefined,
          result_changed:true,
        }, () => {
          this.saveCondition();
          this.props.setChangeStatus(true);
        });
      });
    }
  }
  
  getResultOptions = (item) => {
    let find_elapsed_select_items = [{id: 0, value: '', unit: ''}];
    if (this.elapsed_select_item_master !== undefined && this.elapsed_select_item_master != null && this.elapsed_select_item_master.length > 0) {
      this.elapsed_select_item_master.map((select_item)=>{
        if (item != null && select_item.tier_2nd_id == item.tier_2nd_id && select_item.tier_3rd_id == item.tier_3rd_id) {
          let find_unit = this.unit_master.find(x=>x.number == select_item.unit_id);
          find_elapsed_select_items.push({id:select_item.number, value:select_item.name, unit: find_unit != undefined ? find_unit.name : ""});
        }
      })
    }
    return find_elapsed_select_items;
  }  

  setResult  = (cur_date, result_item, type = "text",timezone = 1, result_kind = 1, e) => {    
    var result_value = '';
    if (e.target == null && e.currentTarget == null) return;
    result_value = e.target != null? e.target.value:e.currentTarget.value;
    var result_val_len = 0;    
    if (type == 'numeric' && result_value != ''){
      result_value = parseFloat(result_value);      
      if (isNaN(result_value)) {
        result_value = '';
      } else {
        result_val_len = result_value.toString().length;
      }
    }
    if (type == 'text' && result_value != ''){
      result_val_len = result_value.length;
    }    
    if (result_kind == 1){
      if (result_item.result_length > 0 && result_val_len > result_item.result_length){
        this.setState({alert_messages:'最大文字数以上入力しました。'})
        e.target.focus();
        e.target.setSelectionRange(e.target.value.length -1, e.target.value.length -1);
        return;
      }
    } else {
      if (result_item.result_2_length > 0 && result_val_len > result_item.result_2_length){
        this.setState({alert_messages:'最大文字数以上入力しました。'});
        e.target.focus();
        e.target.setSelectionRange(e.target.value.length -1, e.target.value.length -1);
        return;
      }
    }
    let {elapsed_result} = this.state;
    let find_index = elapsed_result.findIndex(x=>{
      if (x.title_id > 0 && x.title_id == result_item.title_id) return true;
      if (!(x.title_id>0) && x.tier_3rd_id == result_item.tier_3rd_id) return true;      
    });
    if (find_index != -1) {
      let input_value = {
        title_id:result_item.title_id,
        tier_3rd_id:result_item.tier_3rd_id,
        input_datetime: cur_date,        
        comment:result_item.comment,
        is_new: true,
        timezone_id: timezone
      };
      if (result_kind == 1){        
        input_value.elapsed_result_text = result_value;
      } else {        
        input_value.elapsed_result_text_2 = result_value;
      }
      if (elapsed_result[find_index].input_values === undefined) {
        elapsed_result[find_index].input_values = [input_value];
      } else {
        var input_values = elapsed_result[find_index].input_values;        
        let index = input_values.findIndex(x=>x.input_datetime==cur_date && x.timezone_id == timezone);        
        if(index == -1) {
          input_values.push(input_value);
        } else {          
          if (result_kind == 1){
            input_value.result_2 = elapsed_result[find_index].input_values[index].result_2;
            input_value.elapsed_result_text_2 = elapsed_result[find_index].input_values[index].elapsed_result_text_2;
          } else {
            input_value.result = elapsed_result[find_index].input_values[index].result;
            input_value.elapsed_result_text = elapsed_result[find_index].input_values[index].elapsed_result_text;
          }
          elapsed_result[find_index].input_values[index] = input_value;
        }        
      }
    }
    this.setState({
      elapsed_result,
      // editable_date: undefined,
      // editable_item: undefined,
      result_changed:true,
    }, () => {
      this.saveCondition();
      this.props.setChangeStatus(true);
    });
  }
  
  resultChange = (cur_date, result_item, type = "select",timezone = 1, result_kind = 1, e) => {
    if (type == 'numeric'){
      // let regx = /^[-]{1}|[0-9]\d*(\.\d+)?$/;
      let regx = /^([-]{1}[0-9]|[0-9.])+$/;
      if (e.target.value != "" && e.target.value != '-' && !regx.test(e.target.value)) return;
    }

    let {elapsed_result} = this.state;
    let find_index = elapsed_result.findIndex(x=>{
      if (x.title_id > 0 && x.title_id == result_item.title_id) return true;
      if (!(x.title_id>0) && x.tier_3rd_id == result_item.tier_3rd_id) return true;      
    });
    if (find_index != -1) {
      let input_value = {
        title_id:result_item.title_id,
        tier_3rd_id:result_item.tier_3rd_id,
        input_datetime: cur_date,        
        comment:result_item.comment,
        is_new: true,
        timezone_id: timezone
      };
      if (result_kind == 1){
        input_value.result = type == "select" ? e.target.id: 0;
        input_value.elapsed_result_text = type != "select" ? e.target.value : "";        
      } else {
        input_value.result_2 = type == "select" ? e.target.id: 0;
        input_value.elapsed_result_text_2 = type != "select" ? e.target.value : "";
      }      
      if (elapsed_result[find_index].input_values === undefined) {
        elapsed_result[find_index].input_values = [input_value];
      } else {
        var input_values = elapsed_result[find_index].input_values;        
        let index = input_values.findIndex(x=>x.input_datetime==cur_date && x.timezone_id == timezone);        
        if(index == -1) {
          input_values.push(input_value);
        } else {          
          if (result_kind == 1){
            input_value.result_2 = elapsed_result[find_index].input_values[index].result_2;
            input_value.elapsed_result_text_2 = elapsed_result[find_index].input_values[index].elapsed_result_text_2;
          } else {
            input_value.result = elapsed_result[find_index].input_values[index].result;
            input_value.elapsed_result_text = elapsed_result[find_index].input_values[index].elapsed_result_text;
          }
          elapsed_result[find_index].input_values[index] = input_value;
        }        
      }
    }
    
    this.setState({
      elapsed_result,
      // editable_date: undefined,
      // editable_item: undefined,
      result_changed:true,
    }, () => {
      this.props.setChangeStatus(true);
      this.saveCondition();
    });
  }

  showGraphMenu = (e, measure_at) => {
    if (this.can_write != "ON") return;
    this.props.closeRightClickMenu('left');
    setTimeout(() => {
      this.setState({
        contextMenu_Graph: {
          visible: true,
          x: e.x + document.getElementsByClassName("chat-image-td")[0].offsetLeft + 10,
          y: e.y + document.getElementsByClassName("calendar-area")[0].offsetTop + document.getElementsByClassName("graph-tr")[0].offsetTop - document.getElementById("tbody-body").scrollTop,
          measure_at:measure_at
        },
      }, () => {
        // setTimeout(() => {
        // eslint-disable-next-line consistent-this
        const that = this;
        document.addEventListener(`click`, function onClickOutside() {
          that.setState({ contextMenu_Graph: { visible: false } });
          document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu_Graph: { visible: false }
          });
          window.removeEventListener(`scroll`, onScrollOutside);
        });
        document
          .getElementById("tbody-body")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu_Graph: { visible: false }
            });
            document
              .getElementById("tbody-body")
              .removeEventListener(`scroll`, onScrollOutside);
          });
        // }, 1000);
      })
    }, 500);
  }
  
  showRangeMenu = (e) => {
    if (this.canShowMenu == 0) return;
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        if (that.canShowMenu == 1) {
          return;
        }
        that.canShowMenu = 1;
        that.setState({contextMenu_th: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      document
        .getElementById("tbody-body")
        .addEventListener("scroll", function onScrollOutside() {          
          that.setState({
            contextMenu_th: {visible: false}
          });
          document
            .getElementById("tbody-body")
            .removeEventListener(`scroll`, onScrollOutside);
        });
    this.canShowMenu = 0;
    this.props.closeRightClickMenu('left');
    this.setState({
      contextMenu_th: {
        visible: true,
        x: e.clientX,
        y: e.clientY,
      },
    })
  }
  
  handleClick_th = (e) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu_th: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_th: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("tbody-body")
        .addEventListener("scroll", function onScrollOutside() {          
          that.setState({
            contextMenu_th: {visible: false}
          });
          document
            .getElementById("tbody-body")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.props.closeRightClickMenu('left');
      this.setState({
        contextMenu_th: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
        },
      })
    }
  }
  
  handleClick=(e, item, cur_date, index, treat_detail_id = null)=>{
    if (item == "graph") {
      if (this.state.vital_data == null || this.state.vital_data.length == 0) return;
      let graph_exitst = false;
      this.state.vital_data.map(item=> {
        let measure_date = item.measure_at.substr(0, 10);
        cur_date = cur_date.substr(0, 10);
        if (measure_date == cur_date) graph_exitst = true;
      });
      if (!graph_exitst) return;
    }
    if(item == "inspection_data"){
      let cell_id = e.target.id;
      if(cell_id !== undefined && cell_id != null && cell_id.split('-')[0] === 'inspection_result'){
        treat_detail_id = cell_id.split('-')[1];
      }
    }
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("tbody-body")
        .addEventListener("scroll", function onScrollOutside() {          
          that.setState({ 
            contextMenu: { visible: false },            
           });
          document
            .getElementById("tbody-body")
            .removeEventListener(`scroll`, onScrollOutside);
        });

      var clientX = e.clientX;
      var clientY = e.clientY;
      this.props.closeRightClickMenu('left');
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
          item,
          cur_date,
          index,
          treat_detail_id
        },
        cur_date
      }, () => {
        var long_menu = document.getElementById('long-context-menu');
        if (clientY + long_menu.offsetHeight > window.innerHeight){
          this.setState({
            contextMenu: {
              visible: true,
              x: clientX,
              y: clientY - long_menu.offsetHeight,
              item,
              cur_date,
              index,
              treat_detail_id
            },
          })
        }
      })
    }
  };
  handleGraphClick=(e)=>{
    if (this.can_write != "ON") return;
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextGraphMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextGraphMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("tbody-body")
        .addEventListener("scroll", function onScrollOutside() {          
          that.setState({ 
            contextGraphMenu: { visible: false },            
           });
          document
            .getElementById("tbody-body")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.props.closeRightClickMenu('left');
      this.setState({
        contextGraphMenu: {
          visible: true,
          x: e.clientX,
          y: e.clientY,
        },
      })
    }
  };
  
  changeRange = (value) => {
    let inspection_data = [];
    if(this.inspection_data.length > 0){
      if(value == 1){
        inspection_data = JSON.parse(JSON.stringify(this.inspection_data));
      } else {
        this.inspection_data.map(inspection=>{
          if(inspection[formatDateLine(this.state.view_date)] !== undefined){
            inspection_data.push(inspection);
          }
        })
      }
    }
    let vital_temp_data = null;
    if (this.vital_temp_data != null)
      vital_temp_data = this.filterVitalTempData(this.vital_temp_data);
    this.setState({
      range:value,
      vital_temp_data,
      inspection_data
    });
  }
  
  deleteGraphData = (measure_at) => {
    this.setState({
      isDeleteConfirmModal:true,
      confirm_message:'削除しますか？',
      measure_at:measure_at})
  }
  
  confirmDelete = async() => {
    this.closeModal();
    let path = "/app/api/v2/patients/basic_data/delete_vital";
    var post_data = {
      system_patient_id:this.state.system_patient_id,
      measure_at:this.state.measure_at
    }
    await apiClient.post(path, post_data)
      .then(() => {
        this.setState({alert_messages:'削除しました。'});
        this.getSearchResult();
      })
  }
  
  editGraphData = (measure_at) => {
    this.setState({
      openGraphChangeModal:true,
      measure_at:measure_at,
    })
  }
  
  contextMenuAction = (act, date, index, treat_detail_id = null) => {
    if (this.state.hospital_data === undefined || this.state.hospital_data.length === 0) {
      this.setState({alert_messages: "入院中の患者を選択してください。"});
      return;
    }
    let {elapsed_result} = this.state;
    if (act == 'title_create') {
      this.setState({
        openTitleCreateModal: true,
        from_source: "title"
      });
    } else if (act == 'free_title_create') {
      this.setState({
        openFreeTitleCreateModal: true,
        selected_free_title:null,
        selected_title:null,
        title_act:act
      });
    } else if (act == 'free_title_edit') {
      this.setState({
        openFreeTitleCreateModal: true,
        selected_free_title:index,
        selected_title:null,
        title_act:act
      });
    } else if (act == 'title_edit') {
      this.setState({
        openFreeTitleCreateModal: true,
        selected_title:index,
        selected_free_title:null,
        title_act:act
      });
    } else if (act == 'title_stop') {
      if (elapsed_result.length == 0) return;
      if(index.tier_3rd_name === undefined) return;
      this.setState({
        openFreeTitleCreateModal:true,
        selected_title:index,
        selected_free_title:null,
        title_act:act
      })
      // let find_index = elapsed_result.findIndex(x=>x.tier_3rd_id == index.tier_3rd_id);
      // let tier_3rd_name = index.tier_3rd_name;
      // var tier_2nd_name = index.tier_2nd_name;
      // this.setState({
      //   confirm_message: tier_3rd_name + "を削除しますか？",
      //   del_tier_index: find_index,
      //   confirm_action: "title_stop"
      // })

    } else if (act == "prev") {
      if (elapsed_result.length == 0 || elapsed_result.length == 1) return;
      let find_index = elapsed_result.findIndex(x=>x.title_id == index.title_id);
      if (find_index == 0) return;
      let moved_array = this.moveArrayItemToNewIndex(elapsed_result, find_index, find_index-1);
      this.setState({elapsed_result: moved_array});
    } else if (act == "first") {
      if (elapsed_result.length == 0 || elapsed_result.length == 1) return;
      let find_index = elapsed_result.findIndex(x=>x.title_id == index.title_id);
      if (find_index == 0) return;
      let moved_array = this.moveArrayItemToNewIndex(elapsed_result, find_index, 0);
      this.setState({elapsed_result: moved_array});
    } else if (act == "next") {
      if (elapsed_result.length == 0 || elapsed_result.length == 1) return;
      let find_index = elapsed_result.findIndex(x=>x.title_id == index.title_id);
      if (find_index == (elapsed_result.length-1)) return;
      let moved_array = this.moveArrayItemToNewIndex(elapsed_result, find_index, find_index+1);
      this.setState({elapsed_result: moved_array});
    } else if (act == "last") {
      if (elapsed_result.length == 0 || elapsed_result.length == 1) return;
      let find_index = elapsed_result.findIndex(x=>x.title_id == index.title_id);
      if (find_index == (elapsed_result.length-1)) return;
      let moved_array = this.moveArrayItemToNewIndex(elapsed_result, find_index, elapsed_result.length-1);
      this.setState({elapsed_result: moved_array});
    } else if (act == 'graph_change') {
      this.setState({
        openGraphChangeModal: true,
        measure_at: date
      });
    } else if (act == "result_insert") {
      this.setState({
        openCreateModal: true,
        cur_datetime: date,
        selected_tier: index
      })
    } else if (act == 'oxy_edit'){
      this.setState({
        isOpenOxygenModal:true,
        cur_datetime:date,
        selected_oxygen_items:index[date],
        practice_name:index.name,
        select_practice:index,
        selected_treat_detail_id:treat_detail_id,
        selected_treat_id:index.treat_id,
      })
    } else if (act == 'from_before_oxy_edit'){      
      var before_date = new Date(date);
      before_date.setDate(before_date.getDate() - 1);      
      var selected_oxygen_items = index[formatDateLine(before_date)];
      var origin_oxygen_items = index[date];      
      if (selected_oxygen_items != undefined && selected_oxygen_items != null && selected_oxygen_items.length > 0 ){
        selected_oxygen_items.map(val => {
          val.number = 0;
        })
      }
      this.setState({
        isOpenOxygenModal:true,
        cur_datetime:date,
        selected_oxygen_items,
        origin_oxygen_items,
        selected_treat_detail_id:treat_detail_id,
        selected_treat_id:index.treat_id,
        practice_name:index.name,
        select_practice:index,
      })
    } else if(act === "inspection_start_date_register" || act === "inspection_end_date_register" || act === "inspection_continue_date_register_done"){
      let inspection_info = index;
      if(inspection_info.order_data.patientInfo === undefined){
        inspection_info.order_data.patientInfo = {};
        inspection_info.order_data.patientInfo.receId = this.props.patientInfo.receId;
        inspection_info.order_data.patientInfo.name = this.props.patientInfo.name;
      }
      this.setState({
        isOpenInspectionStartEndDateTimeRegister:true,
        inspection_info,
        modal_type:act === "inspection_start_date_register" ? "start_date" : (act === "inspection_end_date_register" ? "end_date" : "done_continue_date"),
      });
    } else if(act == "inspection_continue_date_register"){
      this.setState({
        confirm_action:act,
        confirm_title:"登録確認",
        confirm_message:"この日付で継続登録しますか？",
        confirm_value:date,
        inspection_info:index,
      })
    } else if(act == "create_inspection"){
      if (this.state.hospital_data === undefined || this.state.hospital_data.length === 0) {
        this.setState({alert_messages: "入院中の患者を選択してください。"});
        return;
      }
      if (this.state.result_changed || this.state.meal_changed || this.state.oxygen_changed) {
        this.setState({
          confirm_message: "登録していない内容があります。\nオーダー保存結果反映時に変更内容は破棄されますが、このままオーダーを開きますか？",
          confirm_action: "open_inspection_modal",
          confirm_alert_title:'入力中',
          inspection_id:index.inspection_id,
          inspection_name:index.name,
          inspection_DATETIME:date
        });
        return;
      }
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.setState({
          isOpenSelectDoctor: true,
          inspection_id:index.inspection_id,
          inspection_name:index.name,
          inspection_DATETIME:date,
          close_action: "inspection"
        });
      } else {
        this.setState({
          isOpenProgressChartInspectionModal:true,
          inspection_id:index.inspection_id,
          inspection_name:index.name,
          inspection_DATETIME:date
        });
      }
    } else if(act === "inspection_detail"){
      let inspection_modal_data = JSON.parse(JSON.stringify(index));
      inspection_modal_data.patient_number = this.props.patientInfo.receId;
      inspection_modal_data.patient_name = this.props.patientInfo.name;
      inspection_modal_data.order_data = {};
      inspection_modal_data.order_data.order_data = index.order_data;
      this.setState({
        isOpenInspectionDoneModal:true,
        inspection_modal_data,
      });
    } else if (act === "treatment_done") {
      let treatment_data = index;
      treatment_data.patient_number = this.props.patientInfo.patient_number;
      treatment_data.patient_name = this.props.patientInfo.patient_name;
      this.setState({
        isOpenTreatDoneModal: true,
        treatment_data: index,
        treatment_done_date: date,
        treatment_end_date: undefined
      })
    } else if (act === "treatment_end_date_register") {
      let treatment_data = index;
      treatment_data.patient_number = this.props.patientInfo.patient_number;
      treatment_data.patient_name = this.props.patientInfo.patient_name;
      this.setState({
        isOpenTreatDoneModal: true,
        treatment_data: index,
        treatment_end_date: date,
        treatment_done_date: undefined
      })
    } else if (act === "copy_inspection_result") {
      let passing_of_time = index.name + '：' + index[date][treat_detail_id] + index.result_suffix;
      if (window.clipboardData) {
        window.clipboardData.setData ("Text", passing_of_time);
      }
    } else if(act == "create_treatment"){
      if (this.state.hospital_data.length === 0) {
        this.setState({alert_messages: "入院中の患者を選択してください。"});
        return;
      }
      if (this.state.result_changed || this.state.meal_changed || this.state.oxygen_changed) {
        this.setState({
          confirm_message: "登録していない内容があります。\nオーダー保存結果反映時に変更内容は破棄されますが、このままオーダーを開きますか？",
          confirm_action: "open_treat_modal",
          confirm_alert_title:'入力中',
          elapsed_treatment_data:index,
          treat_date:date
        });
        return;
      }
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.setState({
          isOpenSelectDoctor: true,
          elapsed_treatment_data:index,
          treat_date:date,
          close_action: "treat"
        });
      } else {
        this.setState({
          isOpenTreatmentModal:true,
          elapsed_treatment_data:index,
          treat_date:date
        });
      }
    }
  };
  
  moveArrayItemToNewIndex = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  };
  
  closeModal=(act=null)=>{
    if(act === "register_inspection" || act === "treatment_change"){
      let nursing_history = localApi.getObject("nursing_history");
      if(nursing_history !== undefined && nursing_history != null && nursing_history.progress_chat !== undefined){
        nursing_history.progress_chat.result_changed = false;
        nursing_history.progress_chat.meal_changed = false;
        nursing_history.progress_chat.oxygen_changed = false;
      }
    }
    this.setState({
      confirm_message:"",
      setSelectModal: false,
      openGraphChangeModal: false,
      openTitleCreateModal: false,
      openFreeTitleCreateModal:false,
      isDeleteConfirmModal: false,
      openCreateModal: false,      
      openVitalModal: false,
      isOpenPlanModal: false,
      confirm_type:"",
      alert_title:"",
      alert_messages:"",
      isOpenInspectionStartEndDateTimeRegister: false,
      isOpenOxygenModal:false,
      isOpenSelectDoctor: false,
      isOpenProgressChartInspectionModal: false,
      isOpenInspectionDoneModal: false,
      isOpenTreatDoneModal: false,
      isOpenTreatmentModal: false,
      isOpenTreatDetailModal:false,
    }, ()=>{
      if(act === "refresh" || act === "register_inspection" || act === "treatment_change"){
        this.getSearchResult();
      }
    });
  };
  
  confirmOk=()=>{
    this.closeModal();
    if (this.state.confirm_action == "title_stop" && this.state.del_tier_index >= 0) {
      let {elapsed_result} = this.state;
      elapsed_result.splice(this.state.del_tier_index,1);
      this.setState({elapsed_result});
    } else if (this.state.confirm_action == "title_delete_all") {
      let {elapsed_result} = this.state;
      elapsed_result = elapsed_result.filter(x => x.is_from_plan == true);
      this.setState({elapsed_result});      
    } else if (this.state.confirm_action == "result_insert") {
      this.registerResult();
    } else if(this.state.confirm_action == "inspection_continue_date_register"){
      this.inspectionContinueDateRegister(this.state.confirm_value, this.state.inspection_info);
    } else if(this.state.confirm_action == "open_inspection_modal"){
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.setState({isOpenSelectDoctor: true, close_action: "inspection"});
      } else {
        this.setState({isOpenProgressChartInspectionModal:true});
      }
    } else if(this.state.confirm_action == "open_treat_modal"){
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      if (authInfo.staff_category !== 1 && this.context.selectedDoctor.code <= 0) {
        this.setState({isOpenSelectDoctor: true, close_action: "treat"});
      } else {
        this.setState({isOpenTreatmentModal:true});
      }
    }
  };
  
  inspectionContinueDateRegister=async(continue_date, inspection_info)=>{
    this.setState({
      confirm_action:"",
      confirm_title:"",
      confirm_message:"",
      confirm_value:null,
      complete_message:"登録中",
    });
    let path = "/app/api/v2/order/inspection/start_end_date/register";
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let order_data = inspection_info.order_data;
    if(order_data.continue_date === undefined){
      order_data.continue_date = [];
    }
    order_data.continue_date.push({date:continue_date, user_number:authInfo.user_number});
    let post_data = {
      order_data
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        this.setState({
          complete_message:"",
          alert_title:"登録確認",
          alert_messages:res.alert_messages,
        }, ()=>{
          this.getSearchResult();
        });
      })
      .catch(() => {
      });
  }
  
  registerResult = async () => {
    let path = "/app/api/v2/nurse/progress_chart/register_result";
    let post_data = {
      system_patient_id: this.state.system_patient_id,
      hospitalization_id: this.props.hospitalization_id,
    };
    if (this.state.result_changed) {
      post_data.elapsed_result = this.state.elapsed_result;
    }    
    if (this.state.meal_changed){
      var meal_data = this.state.meal_data;
      if (meal_data.length == 0) {
        post_data.meal_data = this.state.meal_data;
      } else {
        var changed_meal = {};
        Object.keys(meal_data).map(date => {          
          return(
            Object.keys(meal_data[date]).map(timing => {
              var item = meal_data[date][timing];
              if (item.is_changed) {
                if (changed_meal[date] == undefined) changed_meal[date] = {};
                changed_meal[date][timing] = item;                
              }
            })
          )
        })
        if (changed_meal == {}) changed_meal = [];
        post_data.meal_data = changed_meal;
      }
      
    }
    if (this.state.oxygen_changed){
      post_data.oxy_data = this.state.oxy_data;
    }
    await apiClient.post(path, post_data).then(res=>{
      if (res) {
        this.setState({
          alert_messages: res.alert_message,
          result_saved: true,
          result_changed: false,
          meal_changed:false,
          oxygen_changed:false,          
        }, () => {
          this.props.setChangeStatus(false);
          this.saveCondition();
        });
      }
    })
  }
  onHide= () => {};
  
  getDisplayCheck = (name,value) => {
    if (name == 'check')
      this.setState({display_check:value});
  };
  
  graphChange = (check_array, check_show) => {
    this.closeModal();
    let graph_data = [];
    let {vital_data} = this.state;
    if (check_array === undefined || check_array.length === 0) return;
    check_array.map((item, index)=>{
      if (index == 0) {
        if (item.values.length > 0) {
          item.values.map((sub_val, sub_index)=>{
            let insert_item = {
              measure_at: vital_data[sub_index].measure_at,
              max_blood: null,
              min_blood: null,
              pluse: check_show == 1 ? (item.line_check == 1 ? sub_val : null) : sub_val,
              temperature: null,
              respiratory: null,
            }
            graph_data.push(insert_item);
            vital_data[sub_index].pluse = sub_val;
          })
        }
      } else if (index == 1) {
        item.values.map((sub_val, sub_index)=>{
          graph_data[sub_index].min_blood = check_show == 1 ? (item.line_check == 1 ? sub_val : null) : sub_val;
          vital_data[sub_index].min_blood = sub_val;
        });
      } else if (index == 2) {
        item.values.map((sub_val, sub_index)=>{
          graph_data[sub_index].max_blood = check_show == 1 ? (item.line_check == 1 ? sub_val : null) : sub_val;
          vital_data[sub_index].max_blood = sub_val;
        });
      } else if (index == 3) {
        item.values.map((sub_val, sub_index)=>{
          graph_data[sub_index].temperature = check_show == 1 ? (item.line_check == 1 ? sub_val : null) : sub_val;
          vital_data[sub_index].temperature = sub_val;
        });
      } else if (index == 4) {
        item.values.map((sub_val, sub_index)=>{
          graph_data[sub_index].respiratory = check_show == 1 ? (item.line_check == 1 ? sub_val : null) : sub_val;
          vital_data[sub_index].respiratory = sub_val;
        });
      }
    });
    let new_graph_data = this.makeGraphData(graph_data);
    this.registerVital(vital_data);
    this.setState({
      graph_data: new_graph_data,
      vital_data,
    });
  }
  registerVital = async (vital_data) => {
    let path = "/app/api/v2/nurse/progress_chart/register_vital";
    let post_data = {
      system_patient_id: this.state.system_patient_id,
      vital_data,
    };
    await apiClient.post(path, post_data);
  }

  handletitleOk = async (title_data) => {
    this.closeModal();
    let path = "/app/api/v2/nurse/progress_chart/register_elapsed_title";
    if (!(title_data.length > 0)) title_data = [title_data];
    
    await apiClient.post(path, {
      params:{
        system_patient_id:this.state.system_patient_id,
        title_data:title_data
        }
      })
      .then(() => {
        this.getSearchResult(true);
      })
  }
  
  setElapsedTitle=(data)=>{
    this.closeModal();
    if (data != null && data.length > 0) {
      let {elapsed_result} = this.state;
      data.map(item=>{
        let find_3rd_index = elapsed_result.findIndex(x=>x.tier_3rd_id == item.tier_3rd_id);
        if (find_3rd_index == -1) {
          let insert_data = {
            tier_1st_id: item.tier_1st_id,
            tier_2nd_id: item.tier_2nd_id,
            tier_3rd_id: item.tier_3rd_id,
            tier_2nd_name: item.tier_2nd_name,
            tier_3rd_name: item.tier_3rd_name,
            tier_3rd_free_comment: item.tier_3rd_free_comment != undefined ? item.tier_3rd_free_comment : '',
            input_datetime: null,
            elapsed_select_item_id: 0,
            comment: '',
            result_type: item.result_type
          };
          elapsed_result.push(insert_data);
        }
      });
      this.setState({elapsed_result});
    }
  }
  insertPlanTitle = (item) => {
    this.closeModal();
    let {planlist} = this.state;
    let insert_data = {
      nurse_plan_master_id: item.nurse_plan_master_id,
      tier_2nd_id: item.tier_2nd_id,
      tier_2nd_name: item.tier_2nd_name,
      tier_3rd_id: item.tier_3rd_id,
      tier_3rd_name: item.tier_3rd_name,
      is_linked: 0,
    };
    if (Object.keys(planlist).indexOf(item.tier_2nd_id) > -1) {
      Object.keys(planlist).map(index=> {
        if (index == item.tier_2nd_id) {
          let plan_item = planlist[index];
          let find_3rd_index = plan_item.findIndex(x=>x.tier_3rd_id == item.tier_3rd_id);
          if (find_3rd_index == -1) {
            planlist[index].push(insert_data);
          }
        }
      });
    } else {
      planlist[item.tier_2nd_id] = [insert_data];
    }
    this.setState({planlist});
  }
  
  resultInsert = (data) => {
    this.closeModal();
    let {elapsed_result} = this.state;
    if (data.length > 0) {
      data.map(item=> {
        let find_index = elapsed_result.findIndex(x=>x.tier_3rd_id == item.tier_3rd_id);
        if (find_index != -1) {
          let input_value = {
            input_datetime: item.input_datetime,
            result:item.result,
            elapsed_result_text:item.elapsed_result_text,
            comment:item.comment,
            is_new: true
          };
          if (elapsed_result[find_index].input_values === undefined) {
            elapsed_result[find_index].input_values = [input_value];
          } else {
            elapsed_result[find_index].input_values.push(input_value);
          }
        }
      });
      this.setState({elapsed_result, result_changed: true});
    }
  };
  
  insertVital = (act) => {
    if(act === "insert") {
      this.setState({openVitalModal: true});
    }
  }
  
  doubleClick = (type, cur_date, cur_item, treat_detail_id = null, e) => {    
    if (type == "inspection_data" || type == "inspection_data") {return;}
    if (type == 'title' || type == 'free_title'){
      if (!this.checkEnableDate(cur_date, cur_item)) return;
    }
    let {hospital_data} = this.state;
    if (hospital_data === undefined || hospital_data.length === 0) {
      this.setState({alert_messages: "入院中の患者を選択してください。"});
      return;
    }
    var editable_title_id = '';
    if (e.target.id != undefined && e.target.id != "" && e.target.id.includes("timezone")) {      
      editable_title_id = e.target.id;
    } else {
      var parent_obj = e.target.parentElement;
      if (parent_obj.id != undefined && parent_obj.id != "" && parent_obj.id.includes("timezone")) {
        editable_title_id = parent_obj.id;
      }
    }
    if (type == "title" || type == 'free_title' || type == 'always_title'
      //  || type == "morning" || type == "noon" || type == "evening" || type == "between_meal"
    ) {
      this.setState({
        dbl_click_type:type,
        editable_date: cur_date,
        editable_item: cur_item,
        editable_title_id
      });
    }

    if (type == 'oxy'){
      this.setState({
        isOpenOxygenModal:true,
        cur_datetime:cur_date,
        selected_oxygen_items:cur_item[cur_date],
        practice_name:cur_item.name,
        select_practice:cur_item,
        show_days:1,
        selected_treat_detail_id:treat_detail_id,
        selected_treat_id:cur_item.treat_id,
      })
    }
  }

  checkAfterToday = (date) => {
    if (date == undefined || date == null || date == '') return false;
    var now = new Date();
    now.setDate(now.getDate() + 1);
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    if (new Date(date).getTime() >= now.getTime()) return true;
    return false;
  }

  checkEnableDate = (cur_date, item) => {    
    if (cur_date == undefined || cur_date == null || cur_date == '') return false;
    if (item == undefined || item == null || item == '') return false;
    if (item.start_date == undefined || item.start_date == null || item.start_date == '') return false;
    if (new Date(cur_date).getTime() < new Date(item.start_date).getTime()) return false;
    if (item.end_date != undefined && item.end_date != null && item.end_date != ''){
      if (new Date(cur_date).getTime() > new Date(item.end_date).getTime()) return false;
    }
    return true;
  }

  mealDoubleClick = (rate_type, meal_time_kind, cur_date) => {
    if (this.can_write != "ON") return;
    if (this.checkAfterToday(cur_date)) return;
    // if (meal_time_kind == 'between_meal') return;
    this.setState({
      editing_rate_type:rate_type,
      editing_meal_time_kind:meal_time_kind,
      editing_meal_cur_date:cur_date,
    })
  }

  mainRegister = () => {
    if (this.state.result_changed || this.state.meal_changed || this.state.oxygen_changed) {
      this.setState({
        confirm_message: "入力結果を登録しますか？",
        confirm_action: "result_insert",
      });
      return;
    }
  };
  refresh = (msg="") => {
    this.closeModal();
    if (msg != "") {
      this.setState({alert_messages: msg});
    }
    this.getSearchResult();
  };

  extractUniq2ndMasterID = (data) => {
    var result = [];
    if (data == undefined || data == null || data.length == 0) return result;
    data.map(item => {
      if (item.tier_2nd_name != null && !result.includes(item.tier_2nd_name)) result.push(item.tier_2nd_name);
      if (item.free_category != null && !result.includes(item.free_category)) result.push(item.free_category);
      if (item.free_category == null && item.tier_2nd_name == null && !result.includes(item.title)) result.push(item.title);
    })
    return result;
  }

  handleOxygenOk = (data, check_duplicate_flag_whole) => {
    this.closeModal();    
    if (check_duplicate_flag_whole == true){
      this.setState({
        alert_messages:'既に登録されている時間帯があります。重ならない時間のみ反映しました。',
        alert_title:'登録済みエラー'
      }); 
    }    
    data.map(item=>{
      item.start_time = formatDateLine(item.start_date) +' ' + formatTimeIE(item.start_time) + ':00';
      item.end_time = formatDateLine(item.start_date) +' ' + formatTimeIE(item.end_time) + ':00';
      item.start_date = formatDateLine(item.start_date);    
      item.treat_detail_id = this.state.selected_treat_detail_id;
      item.treat_id = this.state.selected_treat_id;
    });
    var oxy_data = this.state.oxy_data;    
    var cur_datetime = this.state.cur_datetime;
    var selected_treat_detail_id = this.state.selected_treat_detail_id;    
    oxy_data[selected_treat_detail_id][cur_datetime] = data;
    this.setState({
      oxy_data,
      oxygen_changed:true
    }, () => {
      this.props.setChangeStatus(true);
      this.saveCondition();
    });
  }
  
  getDoctor = e => {
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  }
  
  selectDoctorFromModal = (id, name) => {
    let department_name = "その他";
    this.doctors.map(doctor => {
      if (doctor.doctor_code === parseInt(id)) {
        if (doctor.diagnosis_department_name !== "") {
          department_name = doctor.diagnosis_department_name;
        }
      }
    });
    if (this.state.close_action == "treat") {
      this.setState({
        isOpenSelectDoctor:false,
        isOpenTreatmentModal:true,
      });
    } else if (this.state.close_action == "inspection") {
      this.setState({
        isOpenSelectDoctor:false,
        isOpenProgressChartInspectionModal:true,
      });
    }
    this.context.$updateDoctor(id, name, department_name);
  }
  
  closeRightClickMenu=()=>{
    if(this.state.contextMenu.visible || this.state.contextMenu_th.visible || this.state.contextMenu_Graph.visible || this.state.contextGraphMenu.visible){
      this.setState({
        contextMenu:{visible:false},
        contextMenu_th:{visible:false},
        contextMenu_Graph:{visible:false},
        contextGraphMenu:{visible:false},
      });
    }
  }
  
  showVitalModal = (data) => {
    this.setState({
      openVitalModal: true,
      measure_at: data
    });
  }
  
  render() {    
    let {elapsed_result,  multi_treatment, elapsed_treat} = this.state;
    var always_displya_data = elapsed_result.filter(x => x.is_always_available == 1);
    var ordinary_elapsed_result = elapsed_result.filter(x => x.is_always_available != 1);
    var uniq_2nd_IDs = this.extractUniq2ndMasterID(ordinary_elapsed_result);

    // var uniq_2nd_IDs = this.extractUniq2ndMasterID(elapsed_result);
    // var total_2nd_length = 0;
    // if (uniq_2nd_IDs.length > 0) {
    //   uniq_2nd_IDs.map(id=>{
    //     var elapsed_result_items = elapsed_result.filter(x => {
    //       return (x.tier_2nd_name == id || x.free_category == id || (x.tier_2nd_name == null && x.free_category == null && x.title == id));
    //     });
    //     total_2nd_length += elapsed_result_items.length;
    //   })
    // }
    switch(parseInt(this.state.range)){
      case 1:
        this.min_x = this.state.search_date;
        this.min_x.setHours(0);
        this.min_x.setMinutes(0);
        this.min_x.setSeconds(0);
        this.max_x = new Date(this.min_x.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 2:
        this.min_x = this.state.view_date;
        this.min_x.setHours(0);
        this.min_x.setMinutes(0);
        this.min_x.setSeconds(0);
        this.max_x = new Date(this.min_x.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 3:
        this.min_x = this.state.view_date;
        this.min_x.setHours(0);
        this.min_x.setMinutes(0);
        this.min_x.setSeconds(0);
        this.max_x = new Date(this.min_x.getTime() + 24 * 60 * 60 * 1000);
        break;
    }
    var oxy_data = this.state.oxy_data;

    let graph_max_min_constants = this.graph_max_min_constants;
    let temperature_max = graph_max_min_constants !== undefined && graph_max_min_constants.temperature_max_limit !== "" && graph_max_min_constants.temperature_max_limit >= 0 ? parseInt(graph_max_min_constants.temperature_max_limit) : 40;
    let temperature_min = graph_max_min_constants !== undefined && graph_max_min_constants.temperature_min_limit !== "" && graph_max_min_constants.temperature_min_limit >= 0 ? parseInt(graph_max_min_constants.temperature_min_limit) : 36;
    let temperature_interval = parseInt(((temperature_max-temperature_min) / 4));
    let pulse_max = graph_max_min_constants !== undefined && graph_max_min_constants.pulse_max_limit !== "" && graph_max_min_constants.pulse_max_limit >= 0 ? parseInt(graph_max_min_constants.pulse_max_limit) : 240;
    let pulse_min = graph_max_min_constants !== undefined && graph_max_min_constants.pulse_min_limit !== "" && graph_max_min_constants.pulse_min_limit >= 0 ? parseInt(graph_max_min_constants.pulse_min_limit) : 0;
    let pulse_interval = parseInt(((pulse_max-pulse_min) / 4));
    let blood_max = graph_max_min_constants !== undefined && graph_max_min_constants.blood_max_limit !== "" && graph_max_min_constants.blood_max_limit >= 0 ? parseInt(graph_max_min_constants.blood_max_limit) : 240;
    let blood_min = graph_max_min_constants !== undefined && graph_max_min_constants.blood_min_limit !== "" && graph_max_min_constants.blood_min_limit >= 0 ? parseInt(graph_max_min_constants.blood_min_limit) : 0;
    let blood_interval = parseInt(((blood_max-blood_min) / 4));
    let respiratory_max = graph_max_min_constants !== undefined && graph_max_min_constants.respiratory_max_limit !== "" && graph_max_min_constants.respiratory_max_limit >= 0 ? parseInt(graph_max_min_constants.respiratory_max_limit) : 35;
    let respiratory_min = graph_max_min_constants !== undefined && graph_max_min_constants.respiratory_min_limit !== "" && graph_max_min_constants.respiratory_min_limit >= 0 ? parseInt(graph_max_min_constants.respiratory_min_limit) : 15;
    let respiratory_interval = parseInt(((respiratory_max-respiratory_min) / 4));
    return (
      <>
        <Wrapper id="progress-modal">
          <div className={'select-date flex'}>
            <div className="w-75 flex">
              <div className={'date-label'}>日付</div>
              <Button type="common" onClick={this.moveWeek.bind(this, 'prev')}>{'<<'}</Button>
              <Button type="common" onClick={this.moveDay.bind(this, 'prev')}>{'<'}</Button>
              <Button type="common" onClick={this.selectToday}>{'本日'}</Button>
              <Button type="common" onClick={this.moveDay.bind(this, 'next')}>{'>'}</Button>
              <Button type="common" onClick={this.moveWeek.bind(this, 'next')}>{'>>'}</Button>
              <div className={'view-date'}>{formatJapan(this.state.view_date)}</div>
              <div className={'check-box'}>
                <Checkbox
                  label='バイタル以上のブロックを固定'
                  id={`display_check`}
                  getRadio={this.getDisplayCheck.bind(this)}
                  value={this.state.display_check}
                  name="check"
                />
              </div>
            </div>
          </div>
          <div className={'calendar-area flex'}>
            {this.state.is_loaded ? (
              <div className="wrapper">
                {this.state.display_check ? (
                  <>
                  <table className="table-scroll table table-bordered">
                    <thead>
                    <tr>
                      {/* <th className="sticky-col two-coloum text-center" colSpan="2">日時</th> */}
                      <th className="sticky-col td-third text-center">日時/{this.state.search_date.getFullYear()}年</th>
                      {this.createTable('thead')}
                    </tr>
                    <tr>
                    <td className="sticky-col" colSpan="1" style={this.state.range == 2 ?{background:"lightgray"}:{background:"lightgray"}}>入院日数</td>
                      {this.createTable('tbody', 'hospital_dates')}
                    </tr>
                    <tr>
                    <td className="sticky-col" colSpan="1" style={{background:"lightgray"}}>術後日数</td>
                      {this.createTable('tbody', 'surgery_day')}
                    </tr>
                    <tr>
                    <td className="sticky-col" colSpan="1" style={{background:"lightgray"}}>移動情報</td>
                      {this.createTable('tbody', 'move_info')}
                    </tr>
                    <tr>
                    <td className="sticky-col" colSpan="1" style={{background:"lightgray"}}>入力フォーマット</td>
                      {this.createTable('tbody')}
                    </tr>
                    <tr style={{background:"lightyellow"}}>
                      <td className='td-third text-right' colSpan='1' style={{border:'none'}}>
                        <div style={{width:'100%'}}>
                          <label className='axis-title'>BT</label>
                          <label className='axis-title'>HR</label>
                          <label className='axis-title'>BP</label>
                          <label className='axis-title'>RR</label>
                        </div>
                        <div style={{width:'100%'}}>
                          <label className='axis-title'><span style={{color:"#00f", fontSize:'10px'}}>■</span></label>
                          <label className='axis-title'><span style={{color:"green", fontSize:'15px'}}>●</span></label>
                          <label className='axis-title'><span style={{color:"red", fontSize:'10px'}}>▼▲</span></label>
                          <label className='axis-title'><span style={{fontSize:'15px'}}>×</span></label>
                        </div>
                      </td>
                      <td colSpan= {this.state.range == 1?'7':this.state.range==2?'8':'24'} style={{border:'none'}} className='text-right'></td>
                    </tr>
                    <tr style={{background:"lightyellow"}} className='graph-tr'>
                      <td className='td-third' colSpan='1' style={{border:'none'}}>
                          <div className='flex custom-axis'>
                            <div className='axis-y'>
                              <div className='axis-values'>
                                <div className='y-value'>{temperature_max}-</div>
                                <div className='y-value'>{temperature_max-temperature_interval}-</div>
                                <div className='y-value'>{temperature_max-temperature_interval*2}-</div>
                                <div className='y-value'>{temperature_max-temperature_interval*3}-</div>
                                <div className='text-right'>{temperature_min}-</div>
                              </div>
                              <div className='y-line'></div>
                            </div>
                            <div className='axis-y'>
                              <div className='axis-values'>
                                <div className='y-value'>{pulse_max}-</div>
                                <div className='y-value'>{pulse_max-pulse_interval}-</div>
                                <div className='y-value'>{pulse_max-pulse_interval*2}-</div>
                                <div className='y-value'>{pulse_max-pulse_interval*3}-</div>
                                <div className='text-right'>{pulse_min}-</div>
                              </div>
                              <div className='y-line'></div>
                            </div>
                            <div className='axis-y'>
                              <div className='axis-values'>
                                <div className='y-value'>{blood_max}-</div>
                                <div className='y-value'>{blood_max-blood_interval}-</div>
                                <div className='y-value'>{blood_max-blood_interval*2}-</div>
                                <div className='y-value'>{blood_max-blood_interval*3}-</div>
                                <div className='text-right'>{blood_min}-</div>
                              </div>
                              <div className='y-line'></div>
                            </div>
                            <div className='axis-y'>
                              <div className='axis-values'>
                                <div className='y-value'>{respiratory_max}-</div>
                                <div className='y-value'>{respiratory_max-respiratory_interval}-</div>
                                <div className='y-value'>{respiratory_max-respiratory_interval*2}-</div>
                                <div className='y-value'>{respiratory_max-respiratory_interval*3}-</div>
                                <div className='text-right'>{respiratory_min}-</div>
                              </div>
                              <div className='y-line'></div>
                            </div>
                        </div>
                      </td>
                      <td colSpan= {this.state.range == 1?'7':this.state.range==2?'8':'24'} style={{border:'none'}} className='chat-image-td'>
                        <div className='w-100 h-100 chat-image' onContextMenu={e => this.handleGraphClick(e)}>
                          {this.state.graph_data != undefined && this.state.graph_data.length > 0 ? (
                            <VitalChart
                              showData={this.state.graph_data}
                              vital_temp_data={this.state.vital_temp_data}
                              height={20}
                              min_y={15}
                              max_y={200}
                              x_range = {this.state.range}
                              min_x = {this.min_x}
                              max_x = {this.max_x}
                              showMenu = {this.showGraphMenu}
                              showVitalModal = {this.showVitalModal}
                              ref = {this.ChartRef}
                              titleFontColor="lightyellow"
                              graph_max_min_constants = {this.graph_max_min_constants}
                          />
                          ):(<></>)}
                        </div>
                      </td>
                    </tr>
                    <tr style={{background:"lightyellow"}} className='range-button'>
                      <td className="sticky-col td-third" colSpan="1" style={{background:"lightyellow"}}>
                        <label className='border-right'>
                          <button onClick={this.showRangeMenu.bind(this)} style={{background:"lightpink"}} className="w-100">レンジ切替</button>
                        </label>
                      </td>
                      {this.createTable('tbody', "graph")}
                    </tr>
                    </thead>
                  </table>
                  <div style={this.state.range == 1 ? {height:"calc(100vh - 120px - 43.5rem)"}:{height: "calc(100vh - 120px - 41.5rem)"}} id = 'tbody-body'>
                  <table className="table-scroll table table-bordered">                          
                  {oxy_data != undefined && oxy_data != null && Object.keys(oxy_data).length > 0 && 
                    Object.keys(oxy_data).map((treat_detail_id, index) => {
                      var oxygens = oxy_data[treat_detail_id];
                      return (
                        <>
                        {index == 0 && (
                          <tr>
                            <td className="sticky-col td-third" colSpan="1" rowSpan = {Object.keys(oxy_data).length}>
                              <label className='border-right' style={{background:"yellow"}}>酸素流量</label>
                            </td>
                            {this.createTable('tbody', 'oxy', oxygens, treat_detail_id)}
                          </tr>
                        )}
                        {index != 0 && (
                          <tr>                                  
                            {this.createTable('tbody', 'oxy', oxygens, treat_detail_id)}
                          </tr>
                        )}
                        </>
                      )
                    })}
                    {always_displya_data.length > 0 && (
                      always_displya_data.map(always_item => {
                        var surfix = '';
                        if (always_item.side != null && always_item.side != '') surfix += '(' + always_item.side;
                        if (always_item.part != null && always_item.part != '') {
                          if (surfix =='') surfix += '(';
                          surfix += always_item.part;
                        }
                        if (surfix != '') surfix += ')';
                        return(
                          <>
                          <tr>
                            <td className='td-third'>{always_item.title + surfix }</td>
                            {this.createTable('tbody','always_title', always_item)}
                          </tr>
                          </>
                        )
                      })
                    )}
                    <tr>
                      {/* <td onClick={this.unselectTd.bind(this)} className="sticky-col td-first text-center" rowSpan="6" style={{background:"lightgray"}}>食<br/><br/>事</td> */}
                      {/* <td onClick={this.unselectTd.bind(this)} className="sticky-col td-second text-center" rowSpan='4'>食種</td> */}
                      <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">食事（朝）</td>
                      {this.createTable('tbody', 'morning')}
                    </tr>
                    <tr>
                      <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">食事（昼）</td>
                      {this.createTable('tbody','noon')}
                    </tr>
                    <tr>
                      <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">食事（夕）</td>
                      {this.createTable('tbody', 'evening')}
                    </tr>
                    <tr>
                      <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">間食</td>
                      {this.createTable('tbody', 'between_meal')}
                    </tr>
                    <tr>
                      {/* <td onClick={this.unselectTd.bind(this)} className="sticky-col td-second text-center" rowSpan='2'>摂取量</td> */}
                      <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">主食</td>
                      {this.createTable('tbody', 'eaten_rate')}
                    </tr>
                    <tr>                            
                      <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">副食</td>
                      {this.createTable('tbody', 'side_food_eaten_rate')}
                    </tr>                    
                    {uniq_2nd_IDs.length > 0 && uniq_2nd_IDs.map((id) => {
                      var elapsed_result_items = ordinary_elapsed_result.filter(x => {
                        return (x.tier_2nd_name == id || x.free_category == id || (x.tier_2nd_name == null && x.free_category == null && x.title == id));
                      });
                      return (
                        <>
                          {elapsed_result_items.length > 0 && elapsed_result_items.map((result_item, result_index)=>{
                            var surfix = '';
                            if (result_item.side != null && result_item.side != '') surfix += '(' + result_item.side;
                            if (result_item.part != null && result_item.part != '') {
                              if (surfix =='') surfix += '(';
                              surfix += result_item.part;
                            }
                            if (surfix != '') surfix += ')';
                            return (
                              <>
                                {result_index == 0 ? (
                                  <>
                                    <tr>
                                      {result_item.tier_2nd_name != null || result_item.free_category != null ? (
                                        <>
                                          {/* {index == 0 && (
                                            <td className="sticky-col td-first text-center" rowSpan={total_2nd_length} style={{background:"lightgray"}}>観<br/>察</td>
                                          )} */}
                                          {/* <td className="sticky-col text-center td-second" rowSpan={elapsed_result_items.length} style={{background:"lightgray"}}>
                                            {result_item.tier_2nd_name != null ? result_item.tier_2nd_name: result_item.free_category}
                                          </td> */}
                                          <td className='td-third'>
                                            {result_item.title + surfix }
                                          </td>
                                        </>
                                      ):(
                                        <>
                                          {/* {index == 0 && (
                                            <td className="sticky-col td-first text-center" rowSpan={total_2nd_length} style={{background:"lightgray"}}>観<br/>察</td>
                                          )} */}
                                          <td colSpan="1" className='td-third'>
                                            {result_item.title + surfix }
                                          </td>
                                        </>
                                      )}
                                      {this.createTable('tbody',result_item.tier_3rd_name == null? 'free_title' : 'title', result_item)}
                                    </tr>
                                  </>
                                ) : (
                                  <>
                                    <tr>
                                      <td className='td-third' >{result_item.title + surfix}</td>
                                      {this.createTable('tbody',result_item.tier_3rd_name == null? 'free_title' : 'title', result_item)}
                                    </tr>
                                  </>
                                )}
                              </>
                            )
                          })}
                        </>
                      )
                    })}
                    {uniq_2nd_IDs.length == 0  && (
                      <tr>
                        <td className="sticky-col td-third">観察</td>
                        {/* <td className="sticky-col td-second" colSpan={2}/> */}
                        {this.createTable('tbody','blank_title')}
                      </tr>
                    )}
                    <tr>
                      {/* <td className="sticky-col td-first text-center" style={{background:"lightgray"}} rowSpan={multi_treatment.length + elapsed_treat.length + Object.keys(oxy_data).length + 1}>処</td>
                      <td className="sticky-col td-second text-center border-left border-right" rowSpan={multi_treatment.length + elapsed_treat.length + Object.keys(oxy_data).length + 1}>処置</td> */}
                      <td className="sticky-col td-third" style={{borderRight:"solid 1px lightgray"}}>処置</td>
                      {this.createTable('tbody','treatment')}
                    </tr>
                    {multi_treatment.length > 0 && multi_treatment.map(item=>{
                      return(
                        <tr key={item}>
                          <td className="sticky-col td-third" style={{borderRight:"solid 1px lightgray"}}>{item.practice_name}</td>
                          {this.createTable('tbody','multi_treatment', item)}
                        </tr>
                      )
                    })}
                    {elapsed_treat.length > 0 && elapsed_treat.map(item=>{
                      return(
                        <tr key={item}>
                          <td className="sticky-col td-third" style={{borderRight:"solid 1px lightgray"}}>{item.practice_name}</td>
                          {this.createTable('tbody','elapsed_treat', item)}
                        </tr>
                      )
                    })}
                    {oxy_data != undefined && oxy_data != null && Object.keys(oxy_data).length > 0 && 
                    Object.keys(oxy_data).map((treat_detail_id) => {
                      var oxygens = oxy_data[treat_detail_id];
                      return (
                        <>
                          <tr>
                          <td className="sticky-col td-third" style={{borderRight:"solid 1px lightgray"}}>{oxygens.name}</td>
                            {this.createTable('tbody', 'oxy', oxygens, treat_detail_id)}
                          </tr>                              
                        </>
                      )
                    })}
                    <tr>
                      {/* <td className="sticky-col td-first" style={{background:"lightgray"}}>看<br/>護</td>
                      <td className="sticky-col td-second text-center">看護<br/>ケア</td> */}
                      <td className="sticky-col td-third" style={{borderRight:"solid 1px lightgray"}}>看護ケア</td>
                      {this.createTable('tbody', 'nurse_instruction')}
                    </tr>
                    {this.state.inspection_data.length > 0 && (
                      this.state.inspection_data.map((inspection)=>{
                        return (
                          <>
                            <tr>
                              {/* {inspection_idx == 0 && (
                                <td className="sticky-col td-first" rowSpan={this.state.inspection_data.length} style={{background:"lightgray"}}>検<br/>査</td>
                              )} */}
                              <td className="sticky-col td-third" colSpan="1" style={{padding: "0 0.2rem"}}>
                                {inspection.order_data.classification1_name + (inspection.result_suffix != "" ? "(" + inspection.result_suffix + ")" : "")}
                              </td>
                              {this.createTable('tbody', 'inspection_data', inspection)}
                            </tr>
                          </>
                        )
                      })
                    )}
                    {this.state.tmp_inspection_data.length > 0 && (
                      this.state.tmp_inspection_data.map((inspection)=>{
                        return (
                          <>
                            <tr>
                              {/* {inspection_idx == 0 && (
                                <td className="sticky-col td-first text-center" rowSpan={this.state.tmp_inspection_data.length} style={{background:"lightgray"}}>検<br/>査</td>
                              )} */}
                              <td className="sticky-col td-third" colSpan="1" style={{padding: "0 0.2rem"}}>
                                {inspection.name + (inspection.result_suffix != "" ? "(" + inspection.result_suffix + ")" : "")}
                              </td>
                              {this.createTable('tbody', 'tmp_inspection_data', inspection)}
                            </tr>
                          </>
                        )
                      })
                    )}
                  </table>
                  </div>
                  </>
                ):(
                  <>
                  <table className="table-scroll table table-bordered">
                    <thead>
                      <tr>
                        {/* <th className="sticky-col two-coloum text-center" colSpan="2">日時</th> */}
                        <th className="sticky-col td-third text-center">日時/{this.state.search_date.getFullYear()}年</th>
                        {this.createTable('thead')}
                      </tr>
                    </thead>
                  </table>
                  <div style={this.state.range == 1 ? {height:"calc(100vh - 120px - 10.5rem)"}:{height: "calc(100vh - 120px - 9rem)"}}
                    id = 'tbody-body'>
                    <table className="table-scroll table table-bordered">
                        <tr>
                        <td className="sticky-col td-third" colSpan="1" style={this.state.range == 2 ?{background:"lightgray"}:{background:"lightgray"}}>入院日数</td>
                          {this.createTable('tbody', 'hospital_dates')}
                        </tr>
                        <tr>
                          <td className="sticky-col td-third" colSpan="1" style={{background:"lightgray"}}>術後日数</td>
                          {this.createTable('tbody', 'surgery_day')}
                        </tr>
                        <tr>
                          <td className="sticky-col td-third" colSpan="1" style={{background:"lightgray"}}>移動情報</td>
                          {this.createTable('tbody', 'move_info')}
                        </tr>
                        <tr>
                          <td className="sticky-col td-third" colSpan="1" style={{background:"lightgray"}}>入力フォーマット</td>
                          {this.createTable('tbody')}
                        </tr>
                        <tr style={{background:"lightyellow"}}>
                          <td className='td-third text-right' colSpan='1' style={{border:'none'}}>
                            <div style={{width:'100%'}}>
                              <label className='axis-title'>BT</label>
                              <label className='axis-title'>HR</label>
                              <label className='axis-title'>BP</label>
                              <label className='axis-title'>RR</label>
                            </div>
                            <div style={{width:'100%'}}>
                              <label className='axis-title'><span style={{color:"#00f", fontSize:'10px'}}>■</span></label>
                              <label className='axis-title'><span style={{color:"green", fontSize:'15px'}}>●</span></label>
                              <label className='axis-title'><span style={{color:"red", fontSize:'10px'}}>▼▲</span></label>
                              <label className='axis-title'><span style={{fontSize:'15px'}}>×</span></label>
                            </div>
                          </td>
                          <td colSpan= {this.state.range == 1?'7':this.state.range==2?'8':'24'} style={{border:'none'}} className='text-right'></td>
                        </tr>
                        <tr style={{background:"lightyellow"}} className='graph-tr'>
                          <td className='td-third' colSpan='1' style={{border:'none'}}>
                              <div className='flex custom-axis'>
                                <div className='axis-y'>
                                  <div className='axis-values'>
                                    <div className='y-value'>{temperature_max}-</div>
                                    <div className='y-value'>{temperature_max-temperature_interval}-</div>
                                    <div className='y-value'>{temperature_max-temperature_interval*2}-</div>
                                    <div className='y-value'>{temperature_max-temperature_interval*3}-</div>
                                    <div className='text-right'>{temperature_min}-</div>
                                  </div>
                                  <div className='y-line'></div>
                                </div>
                                <div className='axis-y'>
                                  <div className='axis-values'>
                                    <div className='y-value'>{pulse_max}-</div>
                                    <div className='y-value'>{pulse_max-pulse_interval}-</div>
                                    <div className='y-value'>{pulse_max-pulse_interval*2}-</div>
                                    <div className='y-value'>{pulse_max-pulse_interval*3}-</div>
                                    <div className='text-right'>{pulse_min}-</div>
                                  </div>
                                  <div className='y-line'></div>
                                </div>
                                <div className='axis-y'>
                                  <div className='axis-values'>
                                    <div className='y-value'>{blood_max}-</div>
                                    <div className='y-value'>{blood_max-blood_interval}-</div>
                                    <div className='y-value'>{blood_max-blood_interval*2}-</div>
                                    <div className='y-value'>{blood_max-blood_interval*3}-</div>
                                    <div className='text-right'>{blood_min}-</div>
                                  </div>
                                  <div className='y-line'></div>
                                </div>
                                <div className='axis-y'>
                                  <div className='axis-values'>
                                    <div className='y-value'>{respiratory_max}-</div>
                                    <div className='y-value'>{respiratory_max-respiratory_interval}-</div>
                                    <div className='y-value'>{respiratory_max-respiratory_interval*2}-</div>
                                    <div className='y-value'>{respiratory_max-respiratory_interval*3}-</div>
                                    <div className='text-right'>{respiratory_min}-</div>
                                  </div>
                                  <div className='y-line'></div>
                                </div>
                            </div>
                          </td>
                          <td colSpan= {this.state.range == 1?'7':this.state.range==2?'8':'24'} style={{border:'none'}} className='chat-image-td'>
                            <div className='w-100 h-100 chat-image' onContextMenu={e => this.handleGraphClick(e)}>
                              {this.state.graph_data != undefined && this.state.graph_data.length > 0 ? (
                                <VitalChart
                                  showData={this.state.graph_data}
                                  vital_temp_data={this.state.vital_temp_data}
                                  height={20}
                                  min_y={15}
                                  max_y={200}
                                  x_range = {this.state.range}
                                  min_x = {this.min_x}
                                  max_x = {this.max_x}
                                  showMenu = {this.showGraphMenu}
                                  showVitalModal = {this.showVitalModal}
                                  ref = {this.ChartRef}
                                  titleFontColor="lightyellow"
                                  graph_max_min_constants = {this.graph_max_min_constants}
                              />
                              ):(<></>)}
                            </div>
                          </td>
                        </tr>
                        <tr style={{background:"lightyellow"}} className='range-button'>
                          <td className="sticky-col td-third" colSpan="1" style={{background:"lightyellow"}}>
                            <label className='text-center border-right'>
                              <button onClick={this.showRangeMenu.bind(this)} style={{background:"lightpink"}} className="w-100">レンジ切替</button>
                            </label>
                          </td>
                          {this.createTable('tbody', "graph")}
                        </tr>
                        {oxy_data != undefined && oxy_data != null && Object.keys(oxy_data).length > 0 && 
                        Object.keys(oxy_data).map((treat_detail_id, index) => {
                          var oxygens = oxy_data[treat_detail_id];
                          return (
                            <>
                            {index == 0 && (
                              <tr>
                                <td className="sticky-col td-third" colSpan="1" rowSpan = {Object.keys(oxy_data).length}>
                                  <label className='border-right' style={{background:"yellow"}}>酸素流量</label>
                                </td>
                                {this.createTable('tbody', 'oxy', oxygens, treat_detail_id)}
                              </tr>
                            )}
                            {index != 0 && (
                              <tr>                                  
                                {this.createTable('tbody', 'oxy', oxygens, treat_detail_id)}
                              </tr>
                            )}
                            </>
                          )
                        })}
                        {always_displya_data.length > 0 && (
                          always_displya_data.map(always_item => {
                            var surfix = '';
                            if (always_item.side != null && always_item.side != '') surfix += '(' + always_item.side;
                            if (always_item.part != null && always_item.part != '') {
                              if (surfix =='') surfix += '(';
                              surfix += always_item.part;
                            }
                            if (surfix != '') surfix += ')';
                            return(
                              <>
                              <tr>
                                <td className='td-third'>{always_item.title + surfix }</td>
                                {this.createTable('tbody','always_title', always_item)}
                              </tr>
                              </>
                            )
                          })
                        )}
                        <tr>
                          {/* <td onClick={this.unselectTd.bind(this)} className="sticky-col td-first text-center" rowSpan="6" style={{background:"lightgray"}}>食<br/><br/>事</td>
                          <td onClick={this.unselectTd.bind(this)} className="sticky-col td-second text-center" rowSpan='4'>食種</td> */}
                          <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">食事（朝）</td>
                          {this.createTable('tbody', 'morning')}
                        </tr>
                        <tr>
                          <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">食事（昼）</td>
                          {this.createTable('tbody','noon')}
                        </tr>
                        <tr>
                          <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">食事（夕）</td>
                          {this.createTable('tbody', 'evening')}
                        </tr>
                        <tr>
                          <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">間食</td>
                          {this.createTable('tbody', 'between_meal')}
                        </tr>
                        <tr>
                          {/* <td onClick={this.unselectTd.bind(this)} className="sticky-col td-second" rowSpan='2'>摂取量</td> */}
                          <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">主食</td>
                          {this.createTable('tbody', 'eaten_rate')}
                        </tr>
                        <tr>                            
                          <td onClick={this.unselectTd.bind(this)} className="sticky-col td-third">副食</td>
                          {this.createTable('tbody', 'side_food_eaten_rate')}
                        </tr>
                        {uniq_2nd_IDs.length > 0 && uniq_2nd_IDs.map((id) => {
                          var elapsed_result_items = ordinary_elapsed_result.filter(x => {                               
                            return (x.tier_2nd_name == id || x.free_category == id || (x.tier_2nd_name == null && x.free_category == null && x.title == id));
                          });
                          return (
                            <>
                            {elapsed_result_items.length > 0 && elapsed_result_items.map((result_item, result_index)=>{
                              var surfix = '';
                              if (result_item.side != null && result_item.side != '') surfix += '(' + result_item.side;
                              if (result_item.part != null && result_item.part != '') {
                                if (surfix =='') surfix += '(';
                                surfix += result_item.part;
                              }
                              if (surfix != '') surfix += ')';                                 
                                return (
                                  <>
                                    {result_index == 0 ? (
                                      <>
                                      <tr>
                                        {result_item.tier_2nd_name != null || result_item.free_category != null ? (
                                          <>
                                            {/* {index == 0 && (
                                              <td className="sticky-col td-first text-center" rowSpan={total_2nd_length} style={{background:"lightgray"}}>観<br/>察</td>
                                            )} */}
                                          {/* <td className="sticky-col text-center td-second" rowSpan={elapsed_result_items.length} style={{background:"lightgray"}}>
                                            {result_item.tier_2nd_name != null ? result_item.tier_2nd_name: result_item.free_category}
                                          </td> */}
                                          <td className='td-third'>
                                            {result_item.title + surfix }
                                          </td>
                                          </>
                                        ):(
                                          <>
                                            {/* {index == 0 && (
                                              <td className="sticky-col td-first text-center" rowSpan={total_2nd_length} style={{background:"lightgray"}}>観<br/>察</td>
                                            )} */}
                                          <td colSpan="1" className='td-third'>
                                            {result_item.title + surfix }
                                          </td>
                                          </>
                                        )}
                                        {this.createTable('tbody',result_item.tier_3rd_name == null? 'free_title' : 'title', result_item)}
                                      </tr>
                                      </>
                                    ) : (
                                      <>
                                      <tr>                                          
                                        <td className='td-third' >{result_item.title + surfix}</td>
                                        {this.createTable('tbody',result_item.tier_3rd_name == null? 'free_title' : 'title', result_item)}
                                      </tr>
                                      </>
                                    )}
                                  </>
                                )
                              })}
                            </>
                          )
                        })}
                        {uniq_2nd_IDs.length == 0  && (
                          <tr>
                            <td className="sticky-col td-third">観察</td>
                            {/* <td className="sticky-col td-second text-center" colSpan={2}/> */}
                            {this.createTable('tbody','blank_title')}
                          </tr>
                        )}
                        <tr>
                          {/* <td className="sticky-col td-first text-center" style={{background:"lightgray"}} rowSpan={multi_treatment.length + elapsed_treat.length + Object.keys(oxy_data).length + 1}>処</td>
                          <td className="sticky-col td-second text-center border-left border-right" rowSpan={multi_treatment.length + elapsed_treat.length + Object.keys(oxy_data).length + 1}>処置</td> */}
                          <td className="sticky-col td-third" style={{borderRight:"solid 1px lightgray"}}>処置</td>
                          {this.createTable('tbody','treatment')}
                        </tr>
                        {multi_treatment.length > 0 && multi_treatment.map(item=>{
                          return(
                            <tr key={item}>
                              <td className="sticky-col td-third" style={{borderRight:"solid 1px lightgray"}}>{item.practice_name}</td>
                              {this.createTable('tbody','multi_treatment', item)}
                            </tr>
                          )
                        })}
                        {elapsed_treat.length > 0 && elapsed_treat.map(item=>{
                          return(
                            <tr key={item}>
                              <td className="sticky-col td-third" style={{borderRight:"solid 1px lightgray"}}>{item.practice_name}</td>
                              {this.createTable('tbody','elapsed_treat', item)}
                            </tr>
                          )
                        })}
                        {oxy_data != undefined && oxy_data != null && Object.keys(oxy_data).length > 0 && 
                        Object.keys(oxy_data).map((treat_detail_id) => {
                          var oxygens = oxy_data[treat_detail_id];
                          return (
                            <>
                              <tr>
                              <td className="sticky-col td-third" style={{borderRight:"solid 1px lightgray"}}>{oxygens.name}</td>
                                {this.createTable('tbody', 'oxy', oxygens, treat_detail_id)}
                              </tr>                              
                            </>
                          )
                        })}
                        <tr>
                          {/* <td className="sticky-col td-first text-center" style={{background:"lightgray"}}>看<br/>護</td>
                          <td className="sticky-col td-second text-center">看護<br/>ケア</td> */}
                          <td className="sticky-col td-third" style={{borderRight:"solid 1px lightgray"}}>看護ケア</td>
                          {this.createTable('tbody', 'nurse_instruction')}
                        </tr>
                        {this.state.inspection_data.length > 0 && (
                          this.state.inspection_data.map((inspection)=>{
                            return (
                              <>
                                <tr>
                                  {/* {inspection_idx == 0 && (
                                    <td className="sticky-col td-first text-center" rowSpan={this.state.inspection_data.length} style={{background:"lightgray"}}>検<br/>査</td>
                                  )} */}
                                  <td className="sticky-col td-third" colSpan="1" style={{padding: "0 0.2rem"}}>
                                    {inspection.order_data.classification1_name + (inspection.result_suffix != "" ? "(" + inspection.result_suffix + ")" : "")}
                                  </td>
                                  {this.createTable('tbody', 'inspection_data', inspection)}
                                </tr>
                              </>
                            )
                          })
                        )}
                        {this.state.tmp_inspection_data.length > 0 && (
                          this.state.tmp_inspection_data.map((inspection)=>{
                            return (
                              <>
                                <tr>
                                  {/* {inspection_idx == 0 && (
                                    <td className="sticky-col td-first text-center" rowSpan={this.state.tmp_inspection_data.length} style={{background:"lightgray"}}>検<br/>査</td>
                                  )} */}
                                  <td className="sticky-col td-third" colSpan="1" style={{padding: "0 0.2rem"}}>
                                    {inspection.name + (inspection.result_suffix != "" ? "(" + inspection.result_suffix + ")" : "")}
                                  </td>
                                  {this.createTable('tbody', 'tmp_inspection_data', inspection)}
                                </tr>
                              </>
                            )
                          })
                        )}
                    </table>
                  </div>
                  </>
                )}
              </div>
            ):(
              <SpinnerWrapper>
                <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
          </div>
        </Wrapper>
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
        />
        <ContextMenu_th
          {...this.state.contextMenu_th}
          parent={this}
        />
        <ContextMenu_Graph
          {...this.state.contextMenu_Graph}
          parent={this}
        />
        <ContextGraphMenu
          {...this.state.contextGraphMenu}
          parent={this}
        />
        {this.state.confirm_message !== "" && (
          <ConfirmNoFocusModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmOk.bind(this)}
            confirmTitle= {this.state.confirm_message}
            title={this.state.confirm_title}
          />
        )}
        {this.state.isDeleteConfirmModal !== false && (
          <ConfirmNoFocusModal
            hideConfirm= {this.closeModal.bind(this)}
            confirmCancel= {this.closeModal.bind(this)}
            confirmOk= {this.confirmDelete.bind(this)}
            confirmTitle= {this.state.confirm_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.closeModal.bind(this)}
            handleOk= {this.closeModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title= {this.state.alert_title}
          />
        )}
        {this.state.setSelectModal && (
          <ProgressChartSet
            closeModal={this.closeModal}
            setElapsedTitle={this.setElapsedTitle}
          />
        )}
        {this.state.openGraphChangeModal && (
          <ProgressGraphChange
            closeModal={this.closeModal}
            handleOk={this.graphChange}
            system_patient_id={this.state.system_patient_id}
            cur_date={formatDateLine(formatDateTimeIE(this.state.measure_at))}
            max_min_constants={this.max_min_constants}
          />
        )}
        {this.state.openTitleCreateModal && (
          <ChartTitleModal
            closeModal={this.closeModal}
            handletitleOk={this.handletitleOk}            
            from_source={this.state.from_source}
          />
        )}
        {this.state.openFreeTitleCreateModal && (
          <CreateFreeTitleModal
            closeModal={this.closeModal}
            handletitleOk={this.handletitleOk}
            selected_free_title = {this.state.selected_free_title}
            selected_title = {this.state.selected_title}
            act = {this.state.title_act}
          />
        )}
        {this.state.openCreateModal && (
          <ResultInsert
            closeModal={this.closeModal}
            handleOk={this.resultInsert}
            tier_master_3rd={this.tier_master_3rd}
            selected_tier={this.state.selected_tier}
            elapsed_select_item_master={this.elapsed_select_item_master}
            unit_master={this.unit_master}
            elapsed_result={this.state.elapsed_result}
            cur_datetime = {this.state.cur_datetime}
            range={this.state.range}
          />
        )}
        {this.state.isOpenHistoryModal && (
          <ElapsedResultHistoryModal
            closeModal={this.closeModal}
            history_data={this.state.elapsed_result_data}
            tier_3rd_number_data={this.tier_3rd_number_data}
          />
        )}
        {this.state.openVitalModal && (
          <BasicInfoInputModal
            closeModal={this.closeModal}
            handleOk={this.refresh}
            patientId={this.state.system_patient_id}
            modal_type={1}
            from_page="progress_chart"
            max_min_constants = {this.max_min_constants}
            measure_at={this.state.measure_at}
            inspection_data={this.state.inspection_data}
            patient_number={this.props.patientInfo.receId}
            patient_name={this.props.patientInfo.name}
          />
        )}
        {this.state.isOpenPlanModal && (
          <ProgressPlanModal
            closeModal={this.closeModal}
            handleOk={this.refresh}
            patientId={this.state.system_patient_id}
            nurse_plan_item={this.state.plan_item}
            nurse_plan_date={this.state.plan_date}
          />
        )}
        {this.state.isOpenInspectionStartEndDateTimeRegister && (
          <InspectionStartEndDateTimeRegister
            closeModal={this.closeModal}
            modal_data={this.state.inspection_info}
            modal_type={this.state.modal_type}
          />
        )}
        {this.state.isOpenOxygenModal && (
          <OxygenCalculateModal
            closeModal = {this.closeModal}
            modal_data = {this.state.selected_oxygen_items}
            origin_oxygen_items = {this.state.origin_oxygen_items}
            from_source = 'progress_chart'
            selected_oxygen_date = {formatDateTimeIE(this.state.cur_datetime)}
            practice_name = {this.state.practice_name}
            select_practice = {this.state.select_practice}
            handleOk = {this.handleOxygenOk}
          />
        )}
        {this.state.complete_message !== '' && (
          <CompleteStatusModal
            message = {this.state.complete_message}
          />
        )}
        {this.state.isOpenSelectDoctor && (
          <SelectDoctorModal
            closeDoctor={this.closeModal}
            getDoctor={this.getDoctor}
            selectDoctorFromModal={this.selectDoctorFromModal}
            doctors={this.doctors}
          />
        )}
        {this.state.isOpenProgressChartInspectionModal && (
          <ProgressChartInspectionModal
            closeModal={this.closeModal}
            inspectionId={this.state.inspection_id}
            modalName={this.state.inspection_name}
            patientId={this.state.system_patient_id}
            patientInfo={this.props.patientInfo}
            inspection_DATETIME={this.state.inspection_DATETIME}
          />
        )}
        {this.state.isOpenTreatmentModal && (
          <OutPatientModal
            closeModal={this.closeModal}
            patientId={this.state.system_patient_id}
            patientInfo={this.props.patientInfo}
            is_hospital={1}
            treat_date={this.state.treat_date}
            from_source="progress_chart"
          />
        )}
        {this.state.isOpenInspectionDoneModal && (
          <InspectionDoneModal
            closeModal={this.closeModal}
            modal_title={this.state.inspection_modal_data.category}
            modal_data={this.state.inspection_modal_data}
            from_page={'progress_chart'}
          />
        )}
        {this.state.isOpenTreatDoneModal && (
          <TreatDoneModal
            closeModal={this.closeModal}
            modal_data={this.state.treatment_data}
            done_date={this.state.treatment_done_date}
            end_date={this.state.treatment_end_date}
            from_page="progress_chart"
          />
        )}
        {this.state.isOpenTreatDetailModal && (
          <TreatDoneModal
            closeModal={this.closeModal}
            modal_data={this.state.selected_treat_data}
            from_page="progress_chart"
          />
        )}
      </>
    );
  }
}

PatientProgressChart.contextType = Context;
PatientProgressChart.propTypes = {
  patientId: PropTypes.number,
  hospitalization_id: PropTypes.number,
  patientInfo:PropTypes.object,
  closeRightClickMenu: PropTypes.func,
  setChangeStatus: PropTypes.func,
};

export default PatientProgressChart;