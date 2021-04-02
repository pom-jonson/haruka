import React, { Component } from "react";
import * as methods from "../DialMethods";
import styled from "styled-components";
import { surface } from "../../../_nano/colors";
import Button from "../../../atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Checkbox from "../../../molecules/Checkbox";
import InputWithLabel from "../../../molecules/InputWithLabel";
import InputWithLabelBorder from "../../../molecules/InputWithLabelBorder";
import {formatDateLine, formatTime, formatDateSlash} from "~/helpers/date"
import RadioGroupButton from "~/components/molecules/RadioGroup";
import * as apiClient from "~/api/apiClient";
import SelectorWithLabelIndex from "~/components/molecules/SelectorWithLabelIndex";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import {makeList_code, sortTimingCodeMaster, makeList_codeName, addRedBorder, removeRedBorder, removeRequiredBg,addRequiredBg, toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import DialMultiSelectPatientModal from "~/components/templates/Dial/Common/DialMultiSelectPatientModal";
import InspectionPatternListModal from "./Modal/InspectionPatternListModal";
import $ from 'jquery'
import { patternValidate } from "~/helpers/validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";

registerLocale("ja", ja);

const ContextMenu = ({
                       visible,
                       x,
                       y,
                       parent,
                       patient_info
                     }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x-100}px`, top: `${y}px`, border: `1px solid` }}>
          <li>
            <div onClick={() =>parent.gotoPattern(patient_info)}>検査パターンへ</div>
          </li>
          <li>
            <div onClick={() =>parent.showPatternList(patient_info)}>検査パターン確認</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
    
  } else {
    return null;
  }
};

const ContextMenuUl = styled.div`
  .context-border{
    .first-li{
      border-bottom: 1px solid;
    }
    span{
      padding-left: 20px;
    }
  }
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
    font-size: 0.875rem;
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
    img {
      width: 30px;
      height: 30px;
    }
    svg {
      width: 30px;
      margin: 8px 0;
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

const Card = styled.div`
  padding: 1.25rem;
  position: fixed;
  width: calc(100% - 190px);
  margin: 0px;
  height: 100vh;
  float: left;
  .flex {
    display: flex;
  }
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
  }
  .other-pattern {
    position:absolute;
    right:1.25rem;
    button {
        margin-left: 0.2rem;
        margin-bottom: 0px;
        margin-top: 0.3rem;
        padding: 8px 10px;
        min-width: 5rem;
    }
    span {
        font-size: 1rem;
    }
    .disable-button {
        background: rgb(101, 114, 117);
    }
    .schedule-button{
        margin-right: 0.5rem;
    }
  }
  .bodywrap {
      display: flex;
      overflow:hidden;
      overflow-y: auto;
      height: calc(100vh - 8.75rem);
  }
  .popup-area{
     .label-title{
        font-size: 0.75rem;
    }
  }
  .footer {
      text-align: right;
      margin-top:1rem;
      button {
        text-align: center;
        border-radius: 0.25rem;
        background: rgb(105, 200, 225);
        border: none;
        margin-right: 0.5rem;
      }
      
      span {
        color: white;
        font-size: 1.25rem;
      }
  }
  background-color: ${surface};
    button {
        margin-bottom: 0.625rem;
        margin-left: 0.625rem;
    }
`;

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  height: calc(100vh - 13rem);
  float: left;
  width: 100%;
  padding-top:5%;
  .flex {
    display: flex;
    flex-wrap: wrap;
    .padding {
        padding: 9.375rem 0px 0px 0.625rem;
    }
  }
  .label{
    padding-top:0.5rem;
    margin-right:0.625rem;
  }
  .dial-list{
      width: 100%;
      height: 30vh;
      margin-top: 0.625rem;
      border: solid 1px rgb(206, 212,218);
      padding: 0.625rem;
      overflow-y: auto;
      overflow-x: hidden;
      .row {
            width: 100%;
      }
      .row:hover {
        background-color: rgb(246, 252, 253);
        cursor: pointer;
      }
  }
  .last-history{
    overflow: hidden;
    label {
        margin-top: 0.3rem;
        float: right;
        width: 8.5rem;
        font-size: 1rem;
    }
  }
  .dial-oper {
    .row {
        margin: 0;
    }
    margin-top: 0.625rem;
    label{
        width: 4.7rem;
        font-size: 1rem;
        text-align:right;
    }
    input{
        font-size: 1rem;
        width:18rem;
    }
    .radio-group-btn label {
        font-size: 1rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin-left: 0.3rem;
        text-align: center;
    }
    .pullbox-select {
        font-size: 1rem;
    }
  }
  .radio-btn label{
    font-size: 1rem;
    width: 4.7rem;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 0.25rem;
    padding: 0.25rem 0.3rem;
    text-align:center;
    margin-right: 0.3rem;
  }
  .label-title{
    width:7rem;
    text-align:right;
    font-size: 1rem;
    line-height:38px;
  }
  .react-datepicker-wrapper {
    width: calc(100% - 5rem);
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 1rem;
        width: 7rem;
        height: 2.4rem;
        border-radius: 0.25rem;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        border-image: initial;
        padding: 0px 0.5rem;
      }
    }
  }
  .period {
    margin-bottom: 0.5rem;
    label {
        width: 0;
    }
    display: flex;
    .pd-15 {
        padding: 1rem 0 0 0.5rem;
    }
    .w55 {
        width: 3.4rem;
    }
    .react-datepicker-wrapper {
        width: 100%;
    }
  }
  .period div:first-child {
    .label-title {
        width: 7rem;
        font-size: 1rem;
        margin: 0;
        margin-right: 0.625rem;
        line-height: 2.4rem;
    }
    .react-datepicker-wrapper {
        width: 7rem;
    }
  }
  .input-time {
      margin-top: 0.625rem;
      display: flex;
  }
    .from-padding {
      padding-left: 1.25rem;
    }
  
  .pullbox{
    margin-top:0.625rem;
  }
  .label-title{
    margin-right:0.625rem;
  }
  .pullbox .pullbox-label, .pullbox-select{
    width: 22.5rem;
  }
  .checkbox-area label{
    width:12.5rem;
  }
  .register_info{
    margin-top: 0.8rem;
    margin-bottom: 0.8rem;
    div {
      margin:0;
    }
    .label-title {
      width:7rem;
      margin:0;
      margin-right:0.625rem;
      line-height:2.4rem
    }
    .react-datepicker-wrapper {
        width: 7rem;
    }
  }
  .input_man{
    margin-bottom:0.5rem;
  }
  .implementation {
      .implementation-label {
        width: 5rem;
        margin-right: 0.625rem;
        padding-left: 0.25rem;
        margin-top: 0.5rem;
        float: left;
        font-size: 1rem;
    }
      .radio-btn label{
        width: 7.5rem;
        font-size: 1rem;
      }
  }
  .implementation_interval {
        display: flex;
        width: 100%;
        margin-top: 0.8rem;
        margin-bottom: 0.8rem;
      .implementation_interval-label {
        width: 7rem;
        margin: 0;
        margin-right: 0.625rem;
        text-align: right;
        font-size: 1rem;
        line-height:38px;
      }
      .radio-group-btn label{
        width: 4.375rem;
        margin: 0;
        padding: 0;
        margin-right: 0.5rem;
        height:38px;
        line-height:38px;
      }
  }
  .implementation_month {
        display: flex;
        width: 100%;
        margin-top: 0.8rem;
        margin-bottom: 0.8rem;
      .implementation_month-label {
        width: 7rem;
        margin: 0;
        margin-right: 0.625rem;
        text-align: right;
        font-size: 1rem;
        line-height:38px;
      }
      .radio-group-btn label{
        width: 3rem;
        padding: 0;
        margin: 0;
        margin-right: 0.5rem;
        height:38px;
        line-height:38px;
      }
  }
    .gender {
      .gender-label {
        width: 7rem;
        margin: 0;
        margin-right: 0.625rem;
        font-size: 1rem;
        line-height:38px;
        height:38px;
        margin-top:auto;
        margin-bottom:auto;
      }
      .radio-group-btn label{
          width: 2rem;
          padding: 0;
          margin: 0;
          margin-right: 0.5rem;
          height:38px;
          line-height:38px;
      }
      .radio-group-btn:last-child {
        label {
          margin-right:0;
        }
      }
    }
  .select-day-btn {
    cursor: pointer;
    padding: 0.5rem 0.625rem 0.5rem 0.625rem;
    border: 1px solid rgb(206, 212, 218);
    height: 2.25rem;
    margin-left: 0.625rem;
  }
  .selet-day-check label {
    width: 100%;
    padding-top: 0.625rem;
    margin-top:4px;
  }
  .no-dial-day {
    width: 2.5rem;
    height: 2.5rem;
    display: inline-block;
  }
  .final-info {
    padding-left: 6.25rem;
    padding-top: 0.3rem;
    font-size: 1rem;
  }
  .patients{
      width: 100%;
      margin-left: 0.625rem;
      table {
        thead{
          display:table;
          width:100%;
        }
        tbody{
          display:block;
          overflow-y: auto;
          height: calc(100vh - 22rem);
          width:100%;
        }
        tr{
          display: table;
          width: 100%;
        }
        tr:hover{
            background-color:#e2e2e2 !important;
        }
        tr:nth-child(even) {background-color: #f2f2f2;}
        tr:hover{background-color:#e2e2e2 !important;}
        td {
          padding: 0.25rem;
        }
        th {
            position: sticky;
            text-align: center;
            padding: 0.3rem;
        }
     }
  }
  button{
      span{
          font-size:20px;
      }
  }
  .remove-x-input {
    div {
      margin:0;
    }
    .label-title {
      width:7rem;
      margin:0;
      margin-right:0.625rem;
      line-height:38px;
    }
  }
  .end-date{
    .label-title{
      width:0!important;
    }
  }
`;
const TooltipTitleMenuUl = styled.ul`
    margin-bottom: 0px !important;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 15px;
    position: absolute;
    text-align: left;
    overflow-y: auto;
    max-height: 40rem;
    -webkit-box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 200;
    width: 40rem;
    border: 2px solid #807f7f;
    border-radius: 12px;
    margin-bottom: 0px !important;
  }
  font-size: 1rem;
`;
const TooltipTitle = ({visible,x,y,title, patient}) => {
  let code_master = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"code_master");
  let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
  let examination_codes = makeList_code(examinationCodeData);
  let timing_codes = makeList_code(code_master['実施タイミング']);
  if (visible) {
    return (
      <TooltipTitleMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <div className='border-bottom' style={{fontSize:"1.25rem"}}>
            {patient.patient_number} {patient.patient_name}
          </div>
          {title.map((item)=>{
            let weekday = "";
            for (let i = 0; i < 7; i++) {
              weekday += item.weekday & Math.pow(2, i) ? week_days[i] : "";
            }
            return (
              <>
                <div className="d-flex w-100">
                  <div style={{width:"20%"}}>{ (examination_codes != undefined && examination_codes != null && examination_codes[item.examination_code] != undefined ) ? examination_codes[item.examination_code] : '' }</div>
                  <div style={{width:"20%"}}>{ (timing_codes != undefined && timing_codes != null && timing_codes[item.timing_code] != undefined ) ? timing_codes[item.timing_code] : '' }</div>
                  <div style={{width:"20%"}}>{weekday}</div>
                  <div style={{width:"20%"}}>{formatDateSlash(item.time_limit_from)}</div>
                  <div style={{width:"20%"}}>{item.time_limit_to == null ? "～ 無期限" : formatDateSlash(item.time_limit_to)}</div>
                </div>
              </>
            )
          })}
        </ul>
      </TooltipTitleMenuUl>
    );
  } else {
    return null;
  }
};
const week_days = ["日", "月", "火", "水", "木", "金", "土"];

const implementation_interval_types = ["毎週", "第1曜日", "第2曜日", "第3曜日", "第4曜日", "第5曜日"];

const implementation_months = ["毎月", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

class MultiInspection extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
    let code_master = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"code_master");
    var timingCodeData = sortTimingCodeMaster(code_master['実施タイミング']);
    this.dial_group_codes =  makeList_code(code_master['グループ']);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let examination_pattern = [];
    this.state = {
      examination_pattern,
      name:0,
      time_limit_from: "",
      time_limit_to: "",
      entry_date: "",
      entry_time: "",
      directer_name: "",
      showHistory: 1,
      patient_id: "",
      checkAnotherDay:"",
      timing_code:0,
      checkalldays: {0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
      checkdialdays: {0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
      check_enable_months: {0:true, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false},
      check_enable_weeks: {0:true, 1:false, 2:false, 3:false, 4:false, 5:false},
      dialdays:'',
      final_week_days: 0,
      monthly_enable_week_number: 1,
      enable_month: 1,
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message:"",
      pattern_table_id:'',
      patientInfo:[],
      selected_pattern_data:'',
      isShowDoctorList: false,
      entry_name: (authInfo !=undefined && authInfo != null) ? authInfo.name : '',
      instruction_doctor_number: "",
      final_entry_date:'',
      final_entry_time:'',
      final_entry_name:'',
      final_doctor_name:'',
      popup:0,
      isConfirmComplete:false,
      isConfirmMove:false,
      
      examinationCodeData,
      examination_codes:makeList_code(examinationCodeData),
      examination_code_option_list:makeList_codeName(examinationCodeData, 1),
      timingCodeData,
      timing_codes:makeList_code(timingCodeData),
      timing_options:makeList_codeName(timingCodeData, 1),
      isReScheduleConfirm: false,
      isClearConfirmModal:false,
      
      check_patient_status_array:{},
      selected_patient_list:[],
      isShowPatientList:false,
      isOpenMoveOtherPageConfirm:false,
      isShowPatternList:false,
      confirm_alert_title:'',
      alert_message:''
    };
    this.double_click = false;
    this.ex_weekday = 0;
    this.ex_time_limit_from = null;
    this.ex_time_limit_to = null;
    this.ex_enable_month = null;
    this.ex_monthly_enable_week_number = null;
  }
  
  async componentDidMount() {    
    await this.setDoctors();
    await this.getStaffs();
    await this.getExaminationPattern();
    let server_time = await getServerTime();
    let state_data = {};
    state_data['entry_date'] = new Date(server_time);
    state_data['entry_time'] = new Date(server_time);
    if (this.context.selectedDoctor.code > 0) {
      state_data['instruction_doctor_number'] = parseInt(this.context.selectedDoctor.code);
      state_data['directer_name'] = this.context.selectedDoctor.name;
    }
    this.setState(state_data);
    await this.getPatientList();
    this.changeBackground();
  }
  
  async getExaminationPattern(){
    let path = "/app/api/v2/dial/pattern/getExaminationPattern";
    const post_data = {
      all_patients: 1
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res){
          this.setState({
            examination_pattern_list : res,
          });
        }
      });
  }
  
  getName = e => {
    this.setChangeFlag(1);
    this.setState({name:e.target.id})
  };
  
  getStartdate = value => {
    this.setChangeFlag(1);
    this.setState({time_limit_from: value})
  };
  
  getEnddate = value => {
    this.setChangeFlag(1);
    this.setState({time_limit_to: value})
  };
  
  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }

  timeKeyEvent = (e) => {    
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;    
    this.key_code = key_code;
    this.start_pos = start_pos;
    var obj = document.getElementById('entry_time_id');

    let input_value = e.target.value;    
    
    if (start_pos == end_pos) {
      if (key_code == 37 && start_pos == 3){
        e.target.setSelectionRange(start_pos-1, start_pos-1);
      }
      if (key_code == 39 && start_pos == 2){
        e.target.setSelectionRange(start_pos+1, start_pos+1);
      }
    }

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (key_code == 9) {
      this.setTime(e);
      return;
    }
    
    if (key_code == 8){          
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        this.setState({input_time_value:input_value}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){        
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);        
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        this.setState({
          input_time_value:input_value,
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){        
        this.setState({input_time_value:''}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){          
          this.setState({
            input_time_value:input_value.slice(1,2),            
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){          
          this.setState({
            input_time_value:input_value.slice(0,1),            
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }    
    if (key_code != 8 && key_code != 46){
      this.setState({
        input_time_value:input_value,
      })
    }
  }

  getInputTime = (value, e) => {
    if (e == undefined){
      this.setState({
        entry_time:value,
        input_time_value:formatTime(value)
      })
      this.setChangeFlag(1);
      return;
    }
    var input_value = e.target.value;

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (input_value.length == 5) this.setTime(e);
    
    this.setState({
      input_time_value:input_value
    }, () => {
      var obj = document.getElementById('entry_time_id');
      if (this.key_code == 46){        
        obj.setSelectionRange(this.start_pos, this.start_pos);
      }
      if (this.key_code == 8){        
        obj.setSelectionRange(this.start_pos - 1, this.start_pos - 1);
      }
    })
  };

  setTime = (e) => {        
    if (e.target.value.length != 5) {      
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })
      this.setChangeFlag(1);
      return;
    }    
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];    
    if (hours > 23 || mins > 60){
      this.setState({
        entry_time:'',
        input_time_value:undefined
      })      
      return;
    }    
    var now = new Date();
    now.setHours(hours);
    now.setMinutes(mins);
    this.setState({entry_time:now})
    this.setChangeFlag(1);
  }
  
  getInputdate = value => {
    this.setChangeFlag(1);
    this.setState({entry_date: value});
  };
  
  getTimingList = e => {
    this.setChangeFlag(1);
    this.setState({timing_code:e.target.id});
  };
  
  initializeInfo =async() => {
    let server_time = await getServerTime();
    this.setChangeFlag(0);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
      selected_index:'',
      pattern_table_id:'',
      name:0,
      time_limit_from: new Date(server_time),
      time_limit_to: "",
      entry_date: new Date(server_time),
      entry_time: new Date(server_time),
      checkAnotherDay: false,
      checkalldays: {0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
      check_enable_months: {0:true, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false},
      check_enable_weeks: {0:true, 1:false, 2:false, 3:false, 4:false, 5:false},
      final_week_days: 0,
      timing_code:0,
      enable_month: 1,
      monthly_enable_week_number: 1,
      entry_name: (authInfo !=undefined && authInfo != null) ? authInfo.name : '',
      directer_name: this.context.selectedDoctor.code > 0 ? this.context.selectedDoctor.name : "",
      instruction_doctor_number: this.context.selectedDoctor.code > 0 ? parseInt(this.context.selectedDoctor.code) : "",
      isShowDoctorList: false,
      final_entry_date:'',
      final_entry_time:'',
      final_entry_name:'',
      final_doctor_name:'',
      change_flag: false,
    });
    this.change_flag = 0;
    this.setDoctors();
  };
  
  getPatientList = async () => {
    let path = "/app/api/v2/dial/patient/list_condition";
    var post_data = {
      sort_order:'kana_name',
    }
    await apiClient.post(path, {param:post_data})
      .then(res => {
        if (res != undefined && res != null){
          var check_patient_status_array = {};
          // var selected_patient_list = [];
          res.map(item => {
            check_patient_status_array[item.system_patient_id] = false;
            // selected_patient_list.push(item.system_patient_id)
          })
          this.setState({
            patientList:res,
            check_patient_status_array,
            // selected_patient_list,
          });
          this.all_patients = res;
        } else {
          this.setState({
            patientList:[],
            // selected_patient_list:[],
          });
        }
      });
  };
  
  addDay = (value) => {
    this.setChangeFlag(1);
    let checkalldays = this.state.checkalldays;
    checkalldays[value] = checkalldays[value] ? false : true;
    var final_week_days = parseInt(this.state.final_week_days);
    var pval = Math.pow(2, value);
    final_week_days = ((final_week_days & pval) > 0) ?  (final_week_days - pval) : (final_week_days + pval);
    this.setState({final_week_days, checkalldays});
  }
  
  SetImplementationMonth = value => {
    this.setChangeFlag(1);
    let check_enable_months = this.state.check_enable_months;
    var enable_month = parseInt(this.state.enable_month);
    if(value !== 0 && check_enable_months[0] === true){
      check_enable_months[0] = false;
      enable_month --;
    }
    if(value === 0){
      enable_month = 1;
      check_enable_months = {0:true, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false};
    } else {
      check_enable_months[value] = check_enable_months[value] ? false : true;
      var pval = Math.pow(2, value);
      enable_month = ((enable_month & pval) > 0) ? (enable_month - pval) : (enable_month + pval);
    }
    this.setState({enable_month, check_enable_months});
  };
  
  SetWeekInterval = value => {
    this.setChangeFlag(1);
    let check_enable_weeks = this.state.check_enable_weeks;
    var monthly_enable_week_number = parseInt(this.state.monthly_enable_week_number);
    if(value !== 0 && check_enable_weeks[0] === true){
      check_enable_weeks[0] = false;
      monthly_enable_week_number --;
    }
    if(value === 0){
      monthly_enable_week_number = 1;
      check_enable_weeks = {0:true, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false};
    } else {
      check_enable_weeks[value] = check_enable_weeks[value] ? false : true;
      var pval = Math.pow(2, value);
      monthly_enable_week_number = ((monthly_enable_week_number & pval) > 0) ?  (monthly_enable_week_number - pval) : (monthly_enable_week_number + pval);
    }
    this.setState({monthly_enable_week_number, check_enable_weeks});
  };
  
  initRedBorder = () => {
    removeRedBorder('name_id');
    removeRedBorder('timing_code_id');
    removeRedBorder('time_limit_from_id');
    removeRedBorder('time_limit_to_id');
    removeRedBorder('final_week_days_id');
    removeRedBorder("entry_time_id");
  }
  
  checkValidation = () => {
    this.initRedBorder();
    let error_str_arr = [];
    let validate_data = patternValidate('dial_inspection', this.state);
    if (
      this.state.time_limit_to != undefined &&
      this.state.time_limit_to != null &&
      this.state.time_limit_to != ""
    ) {
      if (
        !this.checkDate(this.state.time_limit_from, this.state.time_limit_to)
      ) {
        if (validate_data.error_str_arr.length > 0) {
          validate_data.error_str_arr.push("\n");
        }
        validate_data.error_str_arr.push("終了日は開始日以降の日付を選択してください。");
        addRedBorder("time_limit_to_id");
      }
    }
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){      
      error_str_arr.push("入力時間を選択してください。");
      if (validate_data.first_tag_id == undefined || validate_data.first_tag_id == '') {
        validate_data.first_tag_id = 'entry_time_id';
      } 
      addRedBorder("entry_time_id");
    }
    if (validate_data.first_tag_id != '') {
      this.setState({first_tag_id: validate_data.first_tag_id});
    }
    return error_str_arr;
  }
  
  
  add = () => {
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.REGISTER
      ) === false
    ){
      window.sessionStorage.setItem(
        "alert_messages",
        "登録権限がありません。"
      );
      return;
    }
    if(this.state.instruction_doctor_number === ''){
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    let error_str_array = this.checkValidation();
    
    var check_patient_status_array = this.state.check_patient_status_array;
    if (!(Object.keys(check_patient_status_array).length>0)){
      error_str_array.push('患者様を選択してください。');
    }
    var multi_patient_ids = [];
    Object.keys(check_patient_status_array).map(system_patient_id => {
      if (check_patient_status_array[system_patient_id]){
        multi_patient_ids.push(system_patient_id);
      }
    })
    
    if (multi_patient_ids.length == 0){
      error_str_array.push('患者様を選択してください。');
    }
    
    if (error_str_array.length > 0 ) {
      this.setState({alert_message:error_str_array.join('\n')});
      return;
    }
    
    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'チェックを入れた患者にパターンを一括登録しますか？'
    })
    
  };
  
  addPattern = () => {
    var check_patient_status_array = this.state.check_patient_status_array;
    var multi_patient_ids = [];
    Object.keys(check_patient_status_array).map(system_patient_id => {
      if (check_patient_status_array[system_patient_id]){
        multi_patient_ids.push(system_patient_id);
      }
    })
    
    let new_pattern = {
      multi_patient_ids,
      time_limit_from: this.state.time_limit_from ? formatDateLine(this.state.time_limit_from) : "",
      time_limit_to: this.state.time_limit_to ? formatDateLine(this.state.time_limit_to) : "",
      schedule_start_day: "",
      examination_code: this.state.name,
      timing_code:this.state.timing_code,
      weekday: this.state.final_week_days,
      monthly_enable_week_number: this.state.monthly_enable_week_number,
      enable_month: this.state.enable_month,
      entry_date: this.state.entry_date ? formatDateLine(this.state.entry_date) : "",
      entry_time: this.state.entry_time ? formatTime(this.state.entry_time) : "",
      instruction_doctor_number: this.state.instruction_doctor_number,
      is_require_confirmation_before_weight_measurement:this.state.popup,
    };
    
    let path = "/app/api/v2/dial/pattern/registerMultiExaminationPattern";
    this.openConfirmCompleteModal('保存中');
    if (this.double_click == true) return;
    this.double_click = true;
    apiClient.post(path, {
      params: new_pattern
    }).then((res) => {
      this.setState({isConfirmComplete:false});
      // this.makeSchedule(res.pattern_number, new_pattern, 0);
      var title = '';
      var message = res.alert_message;
      if (message.indexOf('変更') > -1) title = "変更完了##";
      if (message.indexOf('登録') > -1) title = "登録完了##";
      window.sessionStorage.setItem("alert_messages", title + res.alert_message);
      this.confirmCancel();
      this.setChangeFlag(0);
    }).catch(() => {
      this.setState({isConfirmComplete:false,})
      window.sessionStorage.setItem("alert_messages", '失敗しました');
      this.confirmCancel();
    }).finally(()=>{
      this.double_click=false;
      this.confirmCancel();
    });
    
  }
  
  checkDate(from, to){
    from = new Date(from);
    to = new Date(to);
    if (from.getTime() > to.getTime()) return false;
    return true;
  }
  
  makeSchedule(pattern_number, post_data, edit_flag) {
    post_data.pattern_number = pattern_number;
    post_data.edit_flag = edit_flag;
    let path = "/app/api/v2/dial/pattern/makeInspectionSchedule";
    apiClient.post(path, {
      params: post_data
    });
  }
  
  openConfirmCompleteModal =(message)=>{
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
  };
  
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isReScheduleConfirm: false,
      isConfirmComplete:false,
      isConfirmMove:false,
      isOpenMoveOtherPageConfirm:false,
      isClearConfirmModal:false,
      confirm_message: "",
      confirm_alert_title:'',
    });
  }
  
  selectDoctor = (doctor) => {
    this.setState({
      directer_name:doctor.name,
      instruction_doctor_number:doctor.number
    });
    this.context.$updateDoctor(doctor.number, doctor.name);
    this.setChangeFlag(1);
    this.closeDoctorSelectModal();
  }
  
  showDoctorList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if(authInfo.doctor_number > 0){
      this.setState({
        directer_name:authInfo.name,
        instruction_doctor_number:authInfo.doctor_number
      })
    } else {
      this.setState({
        isShowDoctorList:true
      });
    }
  }
  
  closeDoctorSelectModal = () => {
    this.setState({
      isShowDoctorList:false,
    });
  }
  
  goOtherPattern = (url) => {
    if(this.change_flag === 1){
      this.setState({
        isOpenMoveOtherPageConfirm:true,
        confirm_message: "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type:"other_tab",
        go_url:url,
        confirm_alert_title:'入力中',
      });
      return;
    }
    if(url == "/dial/schedule/Schedule")
      sessApi.setObjectValue("dial_schedule_table", "open_tab", 'inspection');
    this.props.history.replace(url);
  }
  
  clear = () => {
    this.setState({
      isClearConfirmModal:true,
      confirm_message:'入力中の内容を消去しますか？',
    })
  }
  
  clearPattern =async() => {
    this.confirmCancel();
    await this.initializeInfo();
    var check_patient_status_array = this.state.check_patient_status_array;
    Object.keys(check_patient_status_array).map(id => {
      check_patient_status_array[id] = false;
    })
    this.setState({check_patient_status_array});
  };
  
  getPopupDisplay = e => {
    this.setChangeFlag(1);
    this.setState({popup:e.target.id});
  };
  
  showPatientList = () => {
    this.setState({
      isShowPatientList:true
    });
  }
  
  selectPatients = (patients) => {
    var new_patient_list = [];
    var check_patient_status_array = {};
    var selected_patient_list = [];
    this.all_patients.map(item => {
      if (patients.includes(item.system_patient_id)) {
        new_patient_list.push(item);
        selected_patient_list.push(item.system_patient_id);
        check_patient_status_array[item.system_patient_id] = true;
      }
    })
    this.setState({
      patientList:new_patient_list,
      // selected_patient_list:patients,
      selected_patient_list,
      check_patient_status_array,
    })
    this.closeModal();
  }
  
  gotoPattern(patient){
    this.setState({
      isConfirmMove:true,
      selected_patient:patient,
      confirm_message:'入力内容を破棄してこの患者の検査パターン画面を開きますか？'
    })
  }
  
  MoveToPattern(){
    var url = '/dial/pattern/inspection';
    sessApi.delObjectValue("dial_setting","patient", "");
    sessApi.setObjectValue("dial_setting","patientById", this.state.selected_patient.system_patient_id);
    this.props.history.replace(url);
    this.confirmCancel();
  }
  
  showPatternList(patient){
    this.setState({
      isShowPatternList:true,
      selected_patient:patient,
    })
  }
  closeModal = () => {
    this.setState({
      isShowPatientList:false,
      isShowPatternList:false,
    })
  }
  
  checkPatient = (system_patient_id, name, value) => {
    if (name == 'patient'){
      var check_patient_status_array = this.state.check_patient_status_array;
      var selected_patient_list = [];
      if (system_patient_id ==  "all") {
        Object.keys(check_patient_status_array).map(key=>{
          check_patient_status_array[key] = value;
          if (value) selected_patient_list.push(parseInt(key));
        });
        this.setState({
          check_patient_status_array,
          selected_patient_list,
          all_check: value
        });
      } else {
        check_patient_status_array[system_patient_id] = value;
        Object.keys(check_patient_status_array).map(key=>{
          if (check_patient_status_array[key]) selected_patient_list.push(parseInt(key));
        })
        this.setState({
          check_patient_status_array,
          selected_patient_list,
        });
      }
      
      this.setChangeFlag(1);
    }
  }
  
  handleClick = (e, patient) => {
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX + 110,
          y: e.clientY + window.pageYOffset
        },
        tooltipTitle: {
          visible: false,
        },
        patient_info: patient
      });
    }
  }
  
  showTitle = (e, item) => {
    if (item == undefined || item == null || !(item.system_patient_id >0) ) return;
    let {examination_pattern_list} = this.state;
    let show_item = (examination_pattern_list !== undefined && examination_pattern_list != null) ?  examination_pattern_list[item.system_patient_id] : null;
    
    if (show_item == undefined || show_item == null || show_item.length == 0) return;
    let clientY = e.clientY;
    let clientX = e.clientX;
    this.setState({
      tooltipTitle: {
        visible: true,
        x: e.clientX,
        y: e.clientY + window.pageYOffset,
        title: show_item,
        patient:item,
      },
    }, ()=>{
      let menu_height = document.getElementsByClassName("context-menu")[0].offsetHeight;
      let menu_width = document.getElementsByClassName("context-menu")[0].offsetWidth;
      let window_height = window.innerHeight;
      let window_width = window.innerWidth;
      if (clientY + menu_height > window_height && clientX + menu_width + 200 > window_width) {
        this.setState({
          tooltipTitle: {
            visible: true,
            x: clientX-menu_width,
            y: clientY - menu_height,
            title: show_item,
            patient:item,
          },
        })
      } else if (clientY + menu_height > window_height && clientX + menu_width + 200 < window_width) {
        this.setState({
          tooltipTitle: {
            visible: true,
            x: clientX,
            y: clientY - menu_height,
            title: show_item,
            patient:item,
          },
        })
      } else if (clientY + menu_height < window_height && clientX + menu_width + 200 > window_width) {
        this.setState({
          tooltipTitle: {
            visible: true,
            x: clientX-menu_width,
            y: clientY + window.pageYOffset,
            title: show_item,
            patient:item,
          },
        })
      }
    });
  };
  
  hideTooltip = () => {
    this.setState({
      tooltipTitle: { visible: false}
    });
  };
  
  setChangeFlag=(change_flag)=>{
    this.change_flag = change_flag;
    this.setState({change_flag});
    if (change_flag){
      sessApi.setObjectValue('dial_change_flag', 'multi_inspect', 1)
    } else {
      sessApi.remove('dial_change_flag');
    }
  };
  
  moveOtherPage=()=>{
    this.setChangeFlag(0);
    let confirm_type = this.state.confirm_type;
    let patient_info = this.state.patient_info;
    let go_url = this.state.go_url;
    this.setState({
      isOpenMoveOtherPageConfirm:false,
      confirm_message: "",
      confirm_type:"",
      confirm_alert_title:'',
    },()=>{
      if(confirm_type === "select_other_patient"){
        this.selectPatient(patient_info);
      }
      if(confirm_type === "other_tab"){
        this.goOtherPattern(go_url);
      }
    });
  }
  
  resetDatePicker = (e) => {
    if (e.target.id == this.state.first_tag_id){
      addRedBorder(e.target.id);
    }
    this.forceUpdate();
  }
  
  componentDidUpdate() {
    this.changeBackground();
  }
  
  changeBackground = () => {
    patternValidate("dial_inspection", this.state, 'background');
    removeRequiredBg("final_week_days_id");
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
  };
  
  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }
  
  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let timing_codes = this.state.timing_codes;
    let examination_code_option_list = this.state.examination_code_option_list;
    var popup_display = {0:'無', 1:'有'};
    let clear_tooltip = this.state.change_flag ? "" : "変更した内容がありません";
    return (
      <>
        <Card>
          <div className="d-flex">
            <div className="title">検査パターン一括登録</div>
            <div className={'other-pattern'}>
              <Button className="schedule-button" onClick={this.goOtherPattern.bind(this, "/dial/pattern/inspection")}>個別検査パターン</Button>
              <Button className="schedule-button" onClick={this.goOtherPattern.bind(this, "/dial/schedule/Schedule")}>スケジュール</Button>
            </div>
          </div>
          <div className="bodywrap" style={{width:'100%', display:'flex'}}>
            <div style={{width:'40%'}}>
              <Wrapper>
                <div className="dial-oper">
                  <div className="left-area">
                    <SelectorWithLabel
                      options={examination_code_option_list}
                      title="検査名"
                      getSelect={this.getName.bind(this)}
                      departmentEditCode={this.state.name}
                      id="name_id"
                    />
                    <SelectorWithLabel
                      options={this.state.timing_options}
                      title="タイミング"
                      getSelect={this.getTimingList.bind(this)}
                      departmentEditCode={this.state.timing_code}
                      id = "timing_code_id"
                    />
                    {(timing_codes[this.state.timing_code] =='透析前' || timing_codes[this.state.timing_code] =='透析終了後') && (
                      <>
                        <div className='popup-area'>
                          <SelectorWithLabelIndex
                            options={popup_display}
                            title="ポップアップ表示"
                            getSelect={this.getPopupDisplay.bind(this)}
                            departmentEditCode={this.state.popup}
                          />
                        </div>
                      </>
                    )}
                    <div className="implementation_month">
                      <label className="implementation_month-label" style={{cursor:"text"}}>実施月</label>
                        <>
                          {implementation_months.map((item, key)=>{
                            if (key<7){
                              return (
                                <>
                                  <RadioGroupButton
                                    id={`implementation_month${key}`}
                                    value={key}
                                    label={item}
                                    name="implementation_month"
                                    getUsage={this.SetImplementationMonth.bind(this, key)}
                                    checked={this.state.check_enable_months[key]}
                                  />
                                </>
                              );
                            }
                            
                          })}
                        </>
                    </div>
                    <div className="implementation_month">
                      <label className="implementation_month-label"></label>
                        <>
                          {implementation_months.map((item, key)=>{
                            if (key>6){
                              return (
                                <>
                                  <RadioGroupButton
                                    id={`implementation_month${key}`}
                                    value={key}
                                    label={item}
                                    name="implementation_month"
                                    getUsage={this.SetImplementationMonth.bind(this, key)}
                                    checked={this.state.check_enable_months[key]}
                                  />
                                </>
                              );
                            }
                            
                          })}
                        </>
                    </div>
                    <div className="implementation_interval">
                      <label className="implementation_interval-label" style={{cursor:"text"}}>実施間隔</label>
                        <>
                          {implementation_interval_types.map((item, key)=>{
                            return (
                              <>
                                <RadioGroupButton
                                  id={`implementation_interval_type${key}`}
                                  value={key}
                                  label={item}
                                  name="implementation_interval_type"
                                  getUsage={this.SetWeekInterval.bind(this, key)}
                                  checked={this.state.check_enable_weeks[key]}
                                />
                              </>
                            );
                          })}
                        </>
                    </div>
                    <div className="flex weekday_area">
                      <div className="gender flex">
                        <label className="gender-label" style={{cursor:"text"}}>曜日</label>
                        <div id="final_week_days_id" className='transparent-border'>
                          {week_days.map((item, key)=>{
                            return (
                              <>
                                <RadioGroupButton
                                  id={`week_day_${key}`}
                                  value={key}
                                  label={item}
                                  name="week_day"
                                  getUsage={this.addDay.bind(this, key)}
                                  checked={this.state.checkalldays[key]}
                                />
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    
                    <div className="period">
                      <InputWithLabelBorder
                        label="期限"
                        type="date"
                        getInputText={this.getStartdate}
                        diseaseEditData={this.state.time_limit_from}
                        onBlur = {e => this.resetDatePicker(e)}
                        id="time_limit_from_id"
                      />
                      <div className="pd-15">～</div>
                      <div className='end-date'>
                        <InputWithLabelBorder
                          label=""
                          type="date"
                          getInputText={this.getEnddate}
                          diseaseEditData={this.state.time_limit_to}
                          onBlur = {e => this.resetDatePicker(e)}
                          id="time_limit_to_id"
                        />
                      </div>                      
                    </div>
                  </div>
                  { (this.state.final_entry_date !== '') && (
                    <div className={'flex final-info'}>{'最終入力日時：' + this.state.final_entry_date + ' ' + this.state.final_entry_time + '　' + '　入力者：' + this.state.final_entry_name + '　' + '　指示者：' + (this.state.final_doctor_name != undefined ? this.state.final_doctor_name: "")}</div>
                  )}
                  <div className="register_info flex">
                    <InputWithLabel
                      className="entry_date"
                      label="入力日"
                      type="date"
                      getInputText={this.getInputdate}
                      diseaseEditData={this.state.entry_date}
                      onBlur = {e => this.resetDatePicker(e)}
                    />
                    <div className="input-time">
                      <label className='label-title' style={{cursor:"text"}}>入力時間</label>
                      <DatePicker
                        selected={this.state.entry_time}
                        onChange={this.getInputTime.bind(this)}
                        onKeyDown = {this.timeKeyEvent}
                        onBlur = {this.setTime}
                        value = {this.state.input_time_value}
                        id='entry_time_id'
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={10}
                        dateFormat="HH:mm"
                        timeFormat="HH:mm"
                        timeCaption="時間"
                      />
                    </div>
                  </div>
                  <div className="input_man remove-x-input">
                    <InputWithLabel
                      label="入力者"
                      type="text"
                      placeholder = ""
                      isDisabled={true}
                      diseaseEditData={this.state.entry_name}
                    />
                  </div>
                  { (authInfo != undefined && authInfo != null && authInfo.doctor_number > 0) ? (
                    <div className='direct_man remove-x-input'>
                      <InputWithLabel
                        label="指示者"
                        type="text"
                        isDisabled={true}
                        diseaseEditData={this.state.directer_name}
                      />
                    </div>
                  ) : (
                    <>
                      <div className='direct_man cursor-input remove-x-input' onClick={(e)=>this.showDoctorList(e).bind(this)}>
                        <InputWithLabel
                          label="指示者"
                          type="text"
                          isDisabled={true}
                          diseaseEditData={this.state.directer_name}
                        />
                      </div>
                    </>
                  )}
                </div>
              </Wrapper>
            </div>
            <div style={{width:'58%'}}>
              <Wrapper>
                <Button onClick={this.showPatientList.bind(this)}>患者選択</Button>
                <div className="patients" style = {{width:'100%'}}>
                  <table className='table-scroll table table-bordered'>
                    <thead>
                    <th style={{width:'100px'}}>
                      <Checkbox
                        label={''}
                        getRadio={this.checkPatient.bind(this, "all")}
                        value = {this.state.all_check}
                        name="patient"
                      />
                    </th>
                    <th style={{width:'200px'}}>患者ID</th>
                    <th style={{width:'250px'}}>患者氏名</th>
                    <th>グループ</th>
                    </thead>
                    <tbody>
                    {this.state.patientList != undefined && this.state.patientList != null && this.state.patientList.length > 0 && (
                      this.state.patientList.map(patient => {
                        return(
                          <>
                            <tr onContextMenu={e => this.handleClick(e, patient)}
                                onMouseOver={e=>this.showTitle(e, patient)}
                                onMouseOut={this.hideTooltip}
                                onDoubleClick={()=>this.showPatternList(patient)}>
                              <td style={{width:'100px', textAlign:'center'}}>
                                <Checkbox
                                  label={''}
                                  getRadio={this.checkPatient.bind(this, patient.system_patient_id)}
                                  value = {this.state.check_patient_status_array[patient.system_patient_id]}
                                  name="patient"
                                />
                              </td>
                              <td style={{width:'200px'}}>{patient.patient_number}</td>
                              <td style={{width:'250px'}}>{patient.patient_name}</td>
                              <td>{patient.dial_group>0?this.dial_group_codes[patient.dial_group]:''}</td>
                            </tr>
                          </>
                        )
                      })
                    )}
                    </tbody>
                  
                  </table>
                </div>
              </Wrapper>
            </div>
          </div>
          <div className="footer-buttons">
            <Button className={this.state.change_flag? "" : "disable-btn"} onClick={this.clear} tooltip={clear_tooltip}>クリア</Button>
            <span className="right-btn">
                            <Button className='add-btn' onClick={this.add.bind(this)}>パターン追加</Button>
                        </span>
          </div>
          {this.state.isClearConfirmModal !== false &&  this.state.isConfirmComplete === false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.clearPattern.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isUpdateConfirmModal !== false && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.addPattern.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isShowDoctorList !== false && (
            <DialSelectMasterModal
              selectMaster = {this.selectDoctor}
              closeModal = {this.closeDoctorSelectModal}
              MasterCodeData = {this.state.doctors}
              MasterName = '医師'
            />
          )}
          {this.state.isShowPatientList !== false && (
            <DialMultiSelectPatientModal
              selectMasters = {this.selectPatients}
              closeModal = {this.closeModal}
              selected_masters_list = {this.state.selected_patient_list}
            />
          )}
          {this.state.isShowPatternList !== false && (
            <InspectionPatternListModal
              patient = {this.state.selected_patient}
              closeModal = {this.closeModal}
              // selected_masters_list = {this.state.patientList}
            />
          )}
          
          {this.state.isConfirmComplete !== false && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.isConfirmMove == true && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.MoveToPattern.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.isOpenMoveOtherPageConfirm && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.moveOtherPage.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            patient_info={this.state.patient_info}
          />
          <TooltipTitle
            {...this.state.tooltipTitle}
            parent={this}
          />
        </Card>
      </>
    )
  }
}
MultiInspection.contextType = Context;

MultiInspection.propTypes = {
  history: PropTypes.object
};

export default MultiInspection