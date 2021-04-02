import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";

import styled from "styled-components";
import { surface } from "~/components/_nano/colors";
import Button from "~/components/atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Checkbox from "~/components/molecules/Checkbox";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import { Modal, Row, Col  } from "react-bootstrap";
import {formatDateLine, formatDateSlash,  formatTime, formatTimePicker, formatJapan} from "~/helpers/date"
import RadioGroupButton from "~/components/molecules/RadioGroup";
import * as apiClient from "~/api/apiClient";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SelectorWithLabelIndex from "~/components/molecules/SelectorWithLabelIndex";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import {makeList_code, sortTimingCodeMaster, makeList_codeName, addRequiredBg, removeRequiredBg, addRedBorder, removeRedBorder, toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import { patternValidate } from "~/helpers/validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';

registerLocale("ja", ja);

const Card = styled.div`
  padding: 20px;
  margin: 0px;
  height: 70vh;
  float: left;
  overflow: auto;
  width:100%;
  .flex {
    display: flex;
  }
  .title {
    font-size: 2rem;
    padding-left: 7px;
    border-left: solid 5px #69c8e1;
    width: 260px;
  }
  
  .bodywrap {
      display: flex;
      overflow:hidden;
      overflow-y: auto;
      height: 100%;
  }
  background-color: ${surface};
    button {
        margin-bottom: 10px;
        margin-left: 10px;
    }
    .disabled{
        background:lightgrey;
    }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 14px;
  height: 100%;
  float: left;
  width: 100%;
  .flex {
    display: flex;
    flex-wrap: wrap;
    .padding {
        padding: 150px 0px 0px 10px;
    }
  }
  .label{
    padding-top:8px;
    margin-right:10px;
  }
  
  .dial-list{
      width: 100%;
      height: 20vh;
      margin-top: 10px;
      border: solid 1px rgb(206, 212,218);
      padding: 10px;
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
  .dial-oper {
  .row {
    margin: 0;
  }
    margin-top: 10px;
    .last-history label {
        float: right;
        width: 120px;
    }
    label{
        width: 75px;
        font-size: 14px;
        text-align:right;
    }
    input{
      width:100px;
    }
  }
  .radio-btn label{
    font-size: 12px;
    width: 75px;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 4px;
    padding: 4px 5px;
    text-align:center;
    margin-right: 5px;
  }
  .label-title{
    width:75px;
    text-align:right;
    font-size: 14px;
  }

.react-datepicker-wrapper {
    width: calc(100% - 82px);
    .react-datepicker__input-container {
        width: 100%;
        input {
            font-size: 14px;
            width: 100%;
            height: 38px;
            border-radius: 4px;
            border-width: 1px;
            border-style: solid;
            border-color: rgb(206, 212, 218);
            border-image: initial;
            padding: 0px 8px;
        }
    }
}
.period {
    label {
        width: 0;
    }
    display: flex;
    .pd-15 {
        padding: 15px 0 0 7px;
    }
    .w55 {
        width: 55px;
    }
    .react-datepicker-wrapper {
        width: 100%;
    }
  }
.period div:first-child {
    .label-title {
        padding-left: 18px;
        width: 75px;
        font-size: 14px;
    }
}
  .input-time {
      margin-top: 10px;
      display: flex;
      label {
        width: 80px;
        font-size: 14px;
      }
      .hvMNwk{
        width:100%;
      }
  }
    .from-padding {
      padding-left: 20px;
    }
  
  .label-title{
    margin-right:10px;
  }
  .pullbox .pullbox-label{
    width: 370px;
  }
  .checkbox-area label{
    width:203px;
  }

  .select-inline{
    .pullbox-label, .pullbox-select{
        width:200px;
        margin-right:15px;
    }
    .pullbox-title{
        width:75px;
    }
    .popup{
      .pullbox-title{
        width:10rem;
      }
      .pullbox-label, .pullbox-select{
        width:4rem;
      }
    }
  }
  .register_info{
    input{
        width: calc(100% - 82px);
    }
    .time_label{
      margin-top: 10px;
      margin-right: 10px;
    }
    label{
        width:82px;
        margin-right:10px;
    }
    .history-label{
      width: 105px;
      margin-right: 10px;
      font-size: 14px;
      text-align: right;
      display: inline-block;
    }
    .history-label-content{
      width: calc(100% - 120px);
      display: inline-block;
      padding: 0;
      border: 0;
    }
  }
  
    .implementation {
      .implementation-label {
        width: 75px;
        margin-right: 10px;
        padding-left: 4px;
        margin-top: 8px;
        float: left;
        font-size: 14px;
    }
      .radio-btn label{
        width: 90px;
      }
  }
    .implementation_interval {
      margin-bottom:0.5rem;
      .implementation_interval-label {
        width: 75px;
        margin-right: 10px;
        padding-left: 4px;
        margin-top: 8px;
        float: left;
        font-size: 14px;
      }
      .radio-group-btn label{
          width: 60px;
        }
      .radio-btn label{
        width: 90px;
      }
  }
    .implementation_month {
      margin-bottom:0.5rem;
      .implementation_month-label {
        width: 75px;
        margin-right: 10px;
        padding-left: 4px;
        margin-top: 8px;
        float: left;
        font-size: 14px;
    }
      .radio-btn label{
        width: 40px;
      }
  }
    .gender {
      display:flex;
      .gender-label {
        width: 75px;
        margin: 0;
        margin-right: 10px;
        font-size: 14px;
        line-height:38px;
        height:38px;
        margin-top: auto;
        margin-bottom: auto;
    }
  }
    .radio-group-btn label{
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin: 0;
        margin-right: 0.5rem;
        width: 40px;
        padding: 0;
        font-size:1rem;
        text-align: center;
        height:38px;
        line-height:38px;
    }
  .select-day-btn {
    cursor: pointer;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    border: 1px solid rgb(206, 212, 218);
    height: 38px;
    line-height:38px;
  }
  .selet-day-check label {
    width: 100%;
    padding-top: 10px;
    margin-top:4px!important;
  }
  .left-area {
    width: 70%;
  }
  .right-area {
    width: 30%;
  }
  .no-dial-day {
    width: 40px;
    margin-right: 0.5rem;
    height: 40px;
    display: inline-block;
  }
  #time_limit_from_id, #time_limit_to_id{
    width:150px;
  }
`;

const AdministrativefeeBox = styled.div`
    width: 100%;
      .row {
            width: 100%;
      }
    .row:hover {
        background-color: rgb(246, 252, 253);
        cursor: pointer;
    }

    .row.selected{
        background: lightblue;
    }
    .row.selected: hover{
        background:lightblue;
    }
`;

const week_days = ["日", "月", "火", "水", "木", "金", "土"];

const implementation_interval_types = ["毎週", "第1曜日", "第2曜日", "第3曜日", "第4曜日", "第5曜日"];

const implementation_months = ["毎月", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

class InspectionPatternModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let examination_pattern = [];
    let examinationCodeData = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"examination_master");
    let code_master = sessApi.getObjectValue(CACHE_SESSIONNAMES.COMMON_MASTER,"code_master");
    var timingCodeData = sortTimingCodeMaster(code_master['実施タイミング']);
    this.state = {
      patient_id: this.props.system_patient_id,
      examination_pattern,
      name:0,
      time_limit_from: (this.props.schedule_date),
      time_limit_to: "",
      entry_date: '',
      entry_time: '',
      directer_name: "",
      showHistory: 1,
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
      isAddConfirmModal:false,
      isMakeScheduleModal:false,
      moveConfirmModal:false,
      confirm_message:"",
      pattern_table_id:'',
      patientInfo:[],
      selected_pattern_data:'',
      isShowDoctorList: false,
      entry_name: (authInfo !=undefined && authInfo != null) ? authInfo.name : '',
      instruction_doctor_number: "",
      examinationCodeData,
      examination_codes:makeList_code(examinationCodeData),
      examination_code_option_list:makeList_codeName(examinationCodeData, 1),
      timingCodeData,
      timing_codes:makeList_code(timingCodeData),
      timing_options:makeList_codeName(timingCodeData, 1),
      popup:0,
      isConfirmComplete:false,
      select_dial_days:false,
      pass_flag:false,
      confirm_alert_title:'',
      alert_message:''
    };
    this.change_flag = false;
  }
  
  async componentDidMount() {
    await this.setDoctors();
    await this.getStaffs();
    await this.getExaminationPattern(this.props.system_patient_id);
    let server_time = await getServerTime();
    let state_data = {};
    state_data['entry_date'] = new Date(server_time);
    state_data['entry_time'] = new Date(server_time);
    if (this.context.selectedDoctor.code > 0) {
      state_data['instruction_doctor_number'] = parseInt(this.context.selectedDoctor.code);
      state_data['directer_name'] = this.context.selectedDoctor.name;
    }
    this.setState(state_data);
  }
  
  getName = e => {
    this.setState({name:e.target.id})
    this.change_flag = true;
  };
  
  getShowHistory =async(name, value) => {
    let server_time = await getServerTime();
    if (name === "schedule"){
      if (value == 0) {
        let tmp = [];
        let today = formatDateLine(new Date(server_time));
        tmp = this.getPatternListByDateCondition(this.state.examination_pattern, today, 'time_limit_from', 'time_limit_to');
        this.setState({
          showHistory: value,
          examination_pattern: tmp
        });
      } else {
        this.setState({
          showHistory: value,
          examination_pattern: this.state.origin_pattern_list
        });
      }
    }
  };
  
  SetImplementationMonth = value => {
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
    this.change_flag = true;
  };
  
  SetWeekInterval = value => {
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
    this.change_flag = true;
  };
  
  getEnddate = value => {
    this.setState({time_limit_to: value})
    this.change_flag = true;
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
      this.change_flag = true;
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
      this.change_flag = true;
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
    this.change_flag = true;
  }
  getInputdate = value => {
    this.setState({entry_date: value});
    this.change_flag = true;
  };
  
  getInputMan = e => {
    this.setState({entry_name: e.target.value})
    this.change_flag = true;
  };
  
  getDirectMan = e => {
    this.setState({directer_name: e.target.value})
    this.change_flag = true;
  };
  
  getCheckAnotherDay = (name, value) => {
    if (name === "schedule"){
      if(value === 0){
        this.getDialDays(this.state.patient_id);
      } else {
        this.setState({
          checkAnotherDay: value,
          checkdialdays:{0:true, 1:true, 2:true, 3:true, 4:true, 5:true, 6:true},
        });
      }
    }
  };
  
  selectDialDays = () => {
    if(this.state.dialdays !== ''){
      let checkalldays = {0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false};
      var final_week_days = 0;
      this.setState({select_dial_days:!this.state.select_dial_days}, ()=> {
        if (this.state.select_dial_days){
          Object.keys(this.state.dialdays).map((index)=>{
            if(this.state.dialdays[index] === true ){
              checkalldays[index] = true;
              var pval = Math.pow(2, index);
              final_week_days = final_week_days + pval;
            }
          });
          this.setState({final_week_days, checkalldays});
        } else {
          this.setState({
            final_week_days:0,
            checkalldays
          })
        }
      })
    }
  }
  
  getTimingList = e => {
    this.setState({timing_code:e.target.id});
    this.change_flag = true;
  };
  
  initializeInfo = async(patient_id) => {
    let server_time = await getServerTime();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
      selected_number:this.props.is_edit===true?this.props.edit_pattern_number:'',
      patient_id: patient_id,
      pattern_table_id:this.props.is_edit===true?this.props.edit_pattern_number:'',
      name:0,
      time_limit_from: (this.props.schedule_date),
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
      isShowDoctorList: false,
      select_dial_days:false,
    });
    this.change_flag = false;
    await this.getDialDays(patient_id);
    await this.setDoctors();
    if (this.props.edit_pattern_number !== 0){
      this.setState({
        edit_pattern_index: 0
      }, () => {
        this.editPattern();
      });
    }
  };
  
  getExamIndex = (number) => {
    if (this.state.examination_pattern != undefined && this.state.examination_pattern != null && this.state.examination_pattern.length > 0){
      for (var i = 0; i<this.state.examination_pattern.length;i++){
        if (number == this.state.examination_pattern[i].number) return i;
      }
    } else {
      return 0;
    }
  }
  
  async getDialDays(patient_id){
    if(patient_id !== ''){
      let path = "/app/api/v2/dial/pattern/getDialDays";
      const post_data = {
        system_patient_id:patient_id
      };
      await apiClient
        ._post(path, {
          params: post_data
        })
        .then((res) => {
          let checkdialdays = {0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false};
          let dialdays = {0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false};
          if (res.length > 0){
            res.map((item)=>{
              checkdialdays[item.day] = true;
              dialdays[item.day] = true;
            })
          }
          this.setState({
            checkAnotherDay:0,
            checkdialdays,
            dialdays,
          });
        })
        .catch(() => {
        });
    }
  }
  
  async getExaminationPattern(patient_id){
    let server_time = await getServerTime();
    let path = "/app/api/v2/dial/pattern/getExaminationPattern";
    const post_data = {
      patient_id:patient_id
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if (res){
          let tmp = res;
          if (this.state.showHistory == 0) {
            let today = formatDateLine(new Date(server_time));
            tmp = this.getPatternListByDateCondition(res, today, 'time_limit_from', 'time_limit_to');
          }
          this.setState({
            examination_pattern : tmp,
            origin_pattern_list: res,
          });
        }
      })
      .catch(() => {
      
      });
    await this.initializeInfo(patient_id);
  }
  
  addDay = (value) => {
    let checkalldays = this.state.checkalldays;
    checkalldays[value] = checkalldays[value] ? false : true;
    var final_week_days = parseInt(this.state.final_week_days);
    var pval = Math.pow(2, value);
    final_week_days = ((final_week_days & pval) > 0) ?  (final_week_days - pval) : (final_week_days + pval);
    this.setState({final_week_days, checkalldays});
    this.change_flag = true;
  }
  
  checkDate(from, to){
    from = new Date(from);
    to = new Date(to);
    if (from.getTime() > to.getTime()) return false;
    return true;
  }
  
  add = () => {
    if (this.change_flag == false) return;
    if(this.state.instruction_doctor_number === ''){
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    if(this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.REGISTER) === false) {
      window.sessionStorage.setItem("alert_messages", '変更権限がありません。');
      return;
    }
    let error_str_array = this.checkValidation();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if(authInfo.doctor_number > 0 && this.state.directer_name !== authInfo.name){
      error_str_array.unshift('指示者を正確に選択してください。');
    }
    if (error_str_array.length > 0 ) {
      this.setState({alert_message:error_str_array.join('\n')});
      return;
    }
    
    this.setState({
      isAddConfirmModal:true,
      confirm_message:'登録しますか？'
    })
  };
  
  addPattern = () => {
    this.confirmCancel();
    let new_pattern = {
      patient_id: this.state.patient_id,
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
    
    let path = "/app/api/v2/dial/pattern/registerExaminationPattern";
    this.setState({eventType:'add'});
    // this.setState({eventType:'add'}, () => {
    if (this.state.pass_flag || this.checkPeriodValidate()){
      this.openConfirmCompleteModal('保存中');
      apiClient.post(path, {
        params: new_pattern
      }).then(async(res) => {
        await this.initializeInfo(this.state.patient_id);
        this.makeScheduleFromPattern(res.pattern_number, new_pattern, 0);
        var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了##";
        if (message.indexOf('登録') > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
      }).catch(() => {
        this.setState({isConfirmComplete:false,})
        window.sessionStorage.setItem("alert_messages", '失敗しました');
      });
      this.setState({pass_flag:false});
    }
    // })
  }
  
  openConfirmCompleteModal =(message)=>{
    this.setState({
      isConfirmComplete:true,
      complete_message: message,
    });
  };
  
  checkPeriodValidate = () => {
    var week = new Date(this.props.schedule_date).getDay();
    if (this.state.checkalldays[week] === true){
      return true;
    } else {
      this.setState({
        isMakeScheduleModal:true,
        confirm_message:formatJapan(this.props.schedule_date)+"が\n" + "対象外となっております。\n" +"保存して良いですか？",
      });
      return false;
    }
  }
  
  makeScheduleFromPattern(pattern_number, post_data, edit_flag) {
    post_data.pattern_number = pattern_number;
    post_data.edit_flag = edit_flag;
    let path = "/app/api/v2/dial/pattern/makeInspectionSchedule";
    apiClient.post(path, {
      params: post_data
    }).then(() => {
      this.setState({isConfirmComplete:false});
      this.props.handleOk();
    });
  }
  
  
  makeSchedule = () => {
    this.setState({pass_flag:true}, () => {
      if (this.state.eventType =='add'){
        this.addPattern();
      } else if(this.state.eventType =='update') {
        this.updatePattern();
      }
    })
    this.confirmCancel();
  }
  
  editPatternConfirm = (index) => {
    if (this.change_flag == true) {
      this.setState({
        moveConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type: "edit_pattern",
        edit_pattern_index: index,
        confirm_alert_title:'入力中',
      });
    } else {
      this.setState({
        edit_pattern_index: index
      }, ()=> {
        this.editPattern();
      })
    }
  }
  editPattern = () => {
    let index = this.state.edit_pattern_index;
    let pattern_data = this.state.examination_pattern[index];
    let final_week_days = {};
    let another_day = false;
    var weekday = parseInt(pattern_data.weekday);
    for(var i=0; i < 7; i++){
      var pval = Math.pow(2, i);
      if( (weekday & pval) > 0){
        final_week_days[i] = true;
        if(this.state.dialdays[i] === false){
          another_day = true;
        }
      } else {
        final_week_days[i] = false;
      }
    }
    if(another_day === true ){
      this.setState({
        checkAnotherDay: 1,
        checkdialdays:{0:true, 1:true, 2:true, 3:true, 4:true, 5:true, 6:true},
      });
    } else {
      this.getDialDays(this.state.patient_id);
    }
    var enable_month = pattern_data.enable_month;
    let check_enable_months = {0:true, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false};
    if(enable_month === 1 || enable_month === 0){
      check_enable_months[0] = true
    } else {
      for(i=1; i < 13; i++){
        pval = Math.pow(2, i);
        if( (enable_month & pval) > 0){
          check_enable_months[i] = true;
        } else {
          check_enable_months[i] = false;
        }
      }
    }
    var monthly_enable_week_number = pattern_data.monthly_enable_week_number;
    let check_enable_weeks = {0:true, 1:false, 2:false, 3:false, 4:false, 5:false};
    if(monthly_enable_week_number === 1 || monthly_enable_week_number === 0){
      check_enable_weeks[0] = true;
    } else {
      for(i=1; i < 13; i++){
        pval = Math.pow(2, i);
        if( (monthly_enable_week_number & pval) > 0){
          check_enable_weeks[i] = true;
        } else {
          check_enable_weeks[i] = false;
        }
      }
    }
    this.setState({
      selected_number:pattern_data.number,
      pattern_table_id: pattern_data.number,
      name: pattern_data.examination_code,
      enable_month,
      monthly_enable_week_number,
      final_week_days: weekday,
      checkalldays: final_week_days,
      check_enable_months,
      check_enable_weeks,
      timing_code: pattern_data.timing_code,
      time_limit_from: new Date(pattern_data.time_limit_from),
      time_limit_to: pattern_data.time_limit_to == null ? null : new Date(pattern_data.time_limit_to),
      popup:pattern_data.is_require_confirmation_before_weight_measurement,
      confirm_type: ''
    });
    this.change_flag = false;
  };
  
  updatePattern = () => {
    this.confirmCancel();
    if(this.state.pattern_table_id != ""){
      let update_pattern = {
        number: this.state.pattern_table_id,
        patient_id: this.state.patient_id,
        time_limit_from: this.state.time_limit_from ? formatDateLine(this.state.time_limit_from) : "",
        time_limit_to: this.state.time_limit_to ? formatDateLine(this.state.time_limit_to) : "",
        timing_code:this.state.timing_code,
        examination_code: this.state.name,
        weekday: this.state.final_week_days,
        enable_month: this.state.enable_month,
        monthly_enable_week_number: this.state.monthly_enable_week_number,
        entry_date: this.state.entry_date ? formatDateLine(this.state.entry_date) : "",
        entry_time: this.state.entry_time ? formatTime(this.state.entry_time) : "",
        instruction_doctor_number: this.state.instruction_doctor_number,
        is_require_confirmation_before_weight_measurement:this.state.popup,
      };
      
      let path = "/app/api/v2/dial/pattern/updateExaminationPattern";
      this.setState({eventType:'update'});
      if (this.state.pass_flag || this.checkPeriodValidate()){
        this.openConfirmCompleteModal('保存中');
        apiClient.post(path, {
          params: update_pattern
        }).then(async(res) => {
          await this.initializeInfo(this.state.patient_id);
          this.makeScheduleFromPattern(res.pattern_number, update_pattern, 1);
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        }).catch(()=>{
          this.setState({isConfirmComplete:false,})
          window.sessionStorage.setItem("alert_messages", '失敗しました');
        });
        this.setState({pass_flag:false});
      }
    }
    
  }
  
  deletePattern =async() => {
    if(this.state.pattern_table_id != ""){
      let delete_pattern = {
        number: this.state.pattern_table_id,
      };
      this.deleteDialPatternFromPost(delete_pattern);
      await this.initializeInfo(this.state.patient_id);
    }
    this.confirmCancel();
  }
  
  async deleteDialPatternFromPost(data){
    let path = "/app/api/v2/dial/pattern/deleteExaminationPattern";
    
    await apiClient
      .post(path, {
        params: data
      }).then((res) => {
        window.sessionStorage.setItem("alert_messages", "削除完了##" + res.alert_message);
      }).catch(() => {
      });
  }
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isMakeScheduleModal: false,
      isAddConfirmModal:false,
      moveConfirmModal:false,
      confirm_message: "",
      confirm_alert_title:'',
    });
  }
  
  update = () => {
    if (this.change_flag == false) return;
    if(this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.EDIT) === false) {
      window.sessionStorage.setItem("alert_messages", '変更権限がありません。');
      return;
    }
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if(this.state.instruction_doctor_number === ''){
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    let error_str_array = this.checkValidation();
    if(authInfo.doctor_number > 0 && this.state.directer_name !== authInfo.name){
      error_str_array.unshift('指示者を正確に選択してください。');
    }
    if(this.state.pattern_table_id === ''){
      error_str_array.unshift('変更するパターンを選択してください。');
    }
    
    if (error_str_array.length > 0 ) {
      this.setState({alert_message:error_str_array.join('\n')});
      return;
    }
    
    this.setState({
      isUpdateConfirmModal : true,
      confirm_message: "パターン情報を変更しますか?",
    });
  }
  
  delete = () => {
    if(this.state.patient_id === ""){
      window.sessionStorage.setItem("alert_messages", '患者様を選択してください。');
      return;
    }
    if(this.state.pattern_table_id === ''){
      window.sessionStorage.setItem("alert_messages", '削除するパターンを選択してください。');
      return;
    }
    if(this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM, this.context.AUTHS.DELETE) === false) {
      window.sessionStorage.setItem("alert_messages", '削除権限がありません。');
      return;
    }
    this.setState({
      isDeleteConfirmModal : true,
      confirm_message: "パターン情報を削除しますか?",
    });
  }
  
  selectDoctor = (doctor) => {
    this.setState({
      directer_name:doctor.name,
      instruction_doctor_number:doctor.number
    });
    this.context.$updateDoctor(doctor.number, doctor.name);
    this.change_flag = true;
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
  
  getPopupDisplay = e => {
    this.setState({popup:e.target.id});
    this.change_flag = true;
  };
  
  closeThisModal = () => {
    if (this.change_flag) {
      this.setState({
        moveConfirmModal: true,
        action: "close",
        confirm_message:"まだ登録していない内容があります。\n変更を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      });
    } else {
      this.confirmClose();
    }
  };
  
  confirmClose = () => {
    this.confirmCancel();
    this.change_flag = false;
    if (this.state.confirm_type == "edit_pattern") {
      this.editPattern();
      return;
    }
    this.props.closeModal();
  }
  
  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }
  
  componentDidUpdate () {
    this.changeBackground();
  }
  
  changeBackground = () => {
    if (this.state.name == "" || this.state.name == null || this.state.name == undefined || this.state.name == 0) {
      addRequiredBg("name_id");
    } else {
      removeRequiredBg("name_id");
    }
    if (this.state.timing_code == 0) {
      addRequiredBg("timing_code_id");
    } else {
      removeRequiredBg("timing_code_id");
    }
    if (this.state.time_limit_from == null || this.state.time_limit_from == undefined || this.state.time_limit_from == "") {
      addRequiredBg("time_limit_from_id");
    } else {
      removeRequiredBg("time_limit_from_id");
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
  }
  
  checkValidation = () => {
    removeRedBorder('name_id');
    removeRedBorder('timing_code_id');
    removeRedBorder('time_limit_from_id');
    removeRedBorder('time_limit_to_id');
    removeRedBorder('final_week_days_id');
    removeRedBorder('entry_time_id');
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
      addRedBorder("entry_time_id");
      if (validate_data.first_tag_id == undefined || validate_data.first_tag_id == ''){
        validate_data.first_tag_id = 'entry_time_id';
      }
    }
    if (validate_data.first_tag_id != '') {
      this.setState({first_tag_id: validate_data.first_tag_id});
    }
    return error_str_arr;
  }
  
  onHide=()=>{}
  
  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let timing_codes = this.state.timing_codes;
    let examination_codes = this.state.examination_codes;
    var popup_display = {0:'無', 1:'有'};
    let message = "";
    let examination_pattern = [];
    if (this.state.examination_pattern.length > 0) {
      examination_pattern = this.state.examination_pattern.map((item, index) => {
        let weekday = "";
        for (let i = 0; i < 7; i++) {
          weekday += item.weekday & Math.pow(2, i) ? week_days[i] : "";
        }
        return (
          <>
            <Row className = {this.state.selected_number === item.number?"selected":""} onClick={this.editPatternConfirm.bind(this, index)}>
              <Col md="2">{ (examination_codes != undefined && examination_codes != null && examination_codes[item.examination_code] != undefined ) ? examination_codes[item.examination_code] : '' }</Col>
              <Col md="2">{ (timing_codes != undefined && timing_codes != null && timing_codes[item.timing_code] != undefined ) ? timing_codes[item.timing_code] : '' }</Col>
              <Col md="2">{weekday}</Col>
              <Col md="2">{formatDateSlash(item.time_limit_from)}</Col>
              <Col md="2">{item.time_limit_to == null ? "～ 無期限" : formatDateSlash(item.time_limit_to)}</Col>
            </Row>
          </>
        )
      });
    }else {
      message = <div className="no-result"><span>登録された検査パターンがありません。</span></div>;
    }
    
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="wordPattern-modal master-modal edit-injection-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>
            定期検査{this.props.is_edit ? "編集" : "追加"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card>
            <div className="bodywrap">
              <Wrapper>
                <div className="dial-list">
                  <AdministrativefeeBox>
                    {examination_pattern}
                    {message}
                  </AdministrativefeeBox>
                </div>
                <div className="dial-oper">
                  <div className="last-history">
                    <Checkbox
                      label="期限切れも表示"
                      getRadio={this.getShowHistory.bind(this)}
                      value={this.state.showHistory}
                      name="schedule"
                    />
                  </div>
                  <br />
                  <Row>
                    <div className="left-area">
                      <SelectorWithLabel
                        options={this.state.examination_code_option_list}
                        title="検査名"
                        getSelect={this.getName.bind(this)}
                        departmentEditCode={this.state.name}
                        id ="name_id"
                      />
                      <div
                        style={{ display: "flex" }}
                        className="select-inline"
                      >
                        <SelectorWithLabel
                          options={this.state.timing_options}
                          title="タイミング"
                          getSelect={this.getTimingList.bind(this)}
                          departmentEditCode={this.state.timing_code}
                          id = 'timing_code_id'
                        />
                        {(timing_codes[this.state.timing_code] ==
                          "透析前" ||
                          timing_codes[this.state.timing_code] ==
                          "透析終了後") && (
                          <>
                            <div className="popup">
                              <SelectorWithLabelIndex
                                options={popup_display}
                                title="ポップアップ表示"
                                getSelect={this.getPopupDisplay.bind(this)}
                                departmentEditCode={this.state.popup}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      
                      <div className="implementation_month">
                        <label className="implementation_month-label" style={{cursor:"text"}}>
                          実施月
                        </label>
                          <>
                            {implementation_months.map((item, key) => {
                              return (
                                <>
                                  <RadioGroupButton
                                    id={`implementation_month${key}`}
                                    value={key}
                                    label={item}
                                    name="implementation_month"
                                    getUsage={this.SetImplementationMonth.bind(
                                      this,
                                      key
                                    )}
                                    checked={
                                      this.state.check_enable_months[key]
                                    }
                                  />
                                </>
                              );
                            })}
                          </>
                      </div>
                      
                      <div className="implementation_interval">
                        <label className="implementation_interval-label" style={{cursor:"text"}}>
                          実施間隔
                        </label>
                          <>
                            {implementation_interval_types.map(
                              (item, key) => {
                                return (
                                  <>
                                    <RadioGroupButton
                                      id={`implementation_interval_type${key}`}
                                      value={key}
                                      label={item}
                                      name="implementation_interval_type"
                                      getUsage={this.SetWeekInterval.bind(
                                        this,
                                        key
                                      )}
                                      checked={
                                        this.state.check_enable_weeks[key]
                                      }
                                    />
                                  </>
                                );
                              }
                            )}
                          </>
                      </div>
                      
                      <div className="flex weekday_area">
                        <div className="gender flex">
                          <label className="gender-label" style={{cursor:"text"}}>曜日</label>
                          <div  id="final_week_days_id" className='flex transparent-border'>
                            {week_days.map((item, key) => {
                              if (this.state.checkdialdays[key] === true) {
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
                              } else {
                                return (
                                  <div className={"no-dial-day"}></div>
                                );
                              }
                            })}
                            <div
                              className="select-day-btn"
                              onClick={this.selectDialDays}
                            >
                              透析曜日を選択
                            </div>
                          </div>
                        </div>
                        
                        <div className="selet-day-check">
                          <Checkbox
                            label="透析曜日以外も表示"
                            getRadio={this.getCheckAnotherDay.bind(this)}
                            value={this.state.checkAnotherDay}
                            name="schedule"
                          />
                        </div>
                      </div>
                      
                      <div className="period">
                        <InputWithLabelBorder
                          label="期限"
                          type="text"
                          // getInputText={this.getStartdate}
                          diseaseEditData={formatDateSlash(
                            this.state.time_limit_from
                          )}
                          isDisabled={true}
                          className="disabled"
                          id="time_limit_from_id"
                        />
                        <div className="pd-15">～</div>
                        <InputWithLabelBorder
                          label=""
                          type="date"
                          getInputText={this.getEnddate}
                          diseaseEditData={this.state.time_limit_to}
                          id="time_limit_to_id"
                        />
                      </div>
                    </div>
                    <div className="right-area register_info">
                      {this.props.edit_pattern_number > 0 &&
                      this.state.examination_pattern != null &&
                      this.state.examination_pattern != undefined &&
                      this.state.examination_pattern.length > 0 && (
                        <div>
                          <div className="history-item">
                            <label className="history-label">
                              最終入力日時：
                            </label>
                            <div className="history-label-content">
                              {formatDateSlash(
                                this.state.examination_pattern[0].updated_at.split(
                                  " "
                                )[0]
                              ) +
                              " " +
                              formatTime(
                                formatTimePicker(
                                  this.state.examination_pattern[0].updated_at.split(
                                    " "
                                  )[1]
                                )
                              )}
                            </div>
                          </div>
                          <div className="history-item">
                            <label className="history-label">
                              入力者：
                            </label>
                            <div className="history-label-content">
                              {this.state.examination_pattern[0]
                                .updated_by !== 0 &&
                              this.state.staff_list_by_number != undefined
                                ? this.state.staff_list_by_number[
                                  this.state.examination_pattern[0]
                                    .updated_by
                                  ]
                                : ""}
                            </div>
                          </div>
                          <div className="history-item">
                            <label className="history-label">
                              指示者：
                            </label>
                            <div className="history-label-content">
                              {this.state.examination_pattern[0]
                                .instruction_doctor_number != null &&
                              this.state.examination_pattern[0]
                                .instruction_doctor_number !== 0 &&
                              this.state.doctor_list_by_number !=
                              undefined &&
                              this.state.doctor_list_by_number[
                                this.state.examination_pattern[0]
                                  .instruction_doctor_number
                                ] != undefined
                                ? this.state.doctor_list_by_number[
                                  this.state.examination_pattern[0]
                                    .instruction_doctor_number
                                  ]
                                : ""}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="input-time">
                        <InputWithLabel
                          className="entry_date"
                          label="入力日"
                          type="date"
                          getInputText={this.getInputdate}
                          diseaseEditData={this.state.entry_date}
                        />
                      </div>
                      <div
                        className="input-time">
                        <label className="time_label" style={{cursor:"text"}}>入力時間</label>
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
                      <div className="remove-x-input">
                        <InputWithLabel
                          label="入力者"
                          type="text"
                          placeholder=""
                          isDisabled={true}
                          diseaseEditData={this.state.entry_name}
                        />
                        {authInfo != undefined &&
                        authInfo != null &&
                        authInfo.doctor_number > 0 &&
                        this.state.pattern_table_id === "" ? (
                          <InputWithLabel
                            label="指示者"
                            type="text"
                            isDisabled={true}
                            diseaseEditData={this.state.directer_name}
                          />
                        ) : (
                          <>
                            <div
                              className="direct_man cursor-input"
                              onClick={(e)=>this.showDoctorList(e).bind(this)}
                            >
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
                    </div>
                  </Row>
                </div>
              </Wrapper>
            </div>
            {this.state.isAddConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.addPattern.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isUpdateConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.updatePattern.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isDeleteConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.deletePattern.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.moveConfirmModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmClose.bind(this)}
                confirmTitle={this.state.confirm_message}
                title = {this.state.confirm_alert_title}
              />
            )}
            {this.state.isMakeScheduleModal !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.makeSchedule.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isShowDoctorList !== false && (
              <DialSelectMasterModal
                selectMaster={this.selectDoctor}
                closeModal={this.closeDoctorSelectModal}
                MasterCodeData={this.state.doctors}
                MasterName="医師"
              />
            )}
            {this.state.isConfirmComplete !== false && (
              <CompleteStatusModal message={this.state.complete_message} />
            )}
            
            {this.state.alert_message != "" && (
              <ValidateAlertModal
                handleOk={this.closeAlertModal}
                alert_meassage={this.state.alert_message}
              />
            )}
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeThisModal}>キャンセル</Button>
          {this.props.is_edit === false && (
            <Button
              onClick={this.add.bind(this)}
              className={this.change_flag?"red-btn":"disable-btn"}
            >
              追加
            </Button>
          )}
          {this.props.is_edit === true && (
            <Button
              onClick={this.update.bind(this)}
              className={this.change_flag?"red-btn":"disable-btn"}
            >
              変更
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}
InspectionPatternModal.contextType = Context;

InspectionPatternModal.propTypes = {
  closeModal: PropTypes.func,
  schedule_date: PropTypes.string,
  system_patient_id: PropTypes.number,
  is_edit: PropTypes.bool,
  handleOk: PropTypes.func,
  edit_pattern_number:PropTypes.number,
  selected_item:PropTypes.object,
};

export default InspectionPatternModal