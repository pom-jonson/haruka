import React, { Component } from "react";
import * as methods from "../DialMethods";
import styled from "styled-components";
import { surface } from "../../../_nano/colors";
import Button from "../../../atoms/Button";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import Checkbox from "../../../molecules/Checkbox";
import InputWithLabel from "../../../molecules/InputWithLabel";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import {
  formatDateLine,
  formatDateSlash,
  formatTime,
  formatTimePicker,
  formatJapan,
} from "~/helpers/date";
import DialSideBar from "../DialSideBar";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import * as apiClient from "~/api/apiClient";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialPatientNav from "../DialPatientNav";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import * as sessApi from "~/helpers/cacheSession-utils";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import {
  makeList_code,
  sortTimingCodeMaster,
  makeList_codeName,
  toHalfWidthOnlyNumber,
  addRequiredBg,
  addRedBorder,
  removeRedBorder,
  removeRequiredBg
} from "~/helpers/dialConstants";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import PatternDeleteConfirmModal from "~/components/templates/Dial/modals/PatternDeleteConfirmModal";
import PatternUpdateConfirmModal from "~/components/templates/Dial/modals/PatternUpdateConfirmModal";
import { patternValidate } from "~/helpers/validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';

registerLocale("ja", ja);

const Card = styled.div`
  padding: 1.25rem;
  position: fixed;
  width: calc(100% - 390px);
  top: 70px;
  left: 200px;
  margin: 0px;
  height: calc(100vh - 70px);
  float: left;
  .flex {
    display: flex;
  }
  .title {
    font-size: 2rem;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
    width: 16.25rem;
  }
  .other-pattern {
    position: absolute;
    right: 1.25rem;
    button {
      margin-left: 0.2rem;
      margin-bottom: 0px;
      margin-top: 0.3rem;
      padding: 8px 10px;
      min-width: 5rem;
    }
    span {
      font-size: 0.9rem;
    }
    .disable-button {
      background: rgb(101, 114, 117);
      cursor: auto;
    }
    .schedule-button {
      margin-right: 0.5rem;
    }
  }
  .bodywrap {
    display: flex;
    overflow: hidden;
    overflow-y: auto;
    height: calc(100% - 6rem);
  }
  
  .footer {
    text-align: right;
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
  height: 100%;
  float: left;
  width: 100%;
  .flex {
    display: flex;
    flex-wrap: wrap;
    .padding {
      padding: 9.375rem 0px 0px 0.625rem;
    }
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .top-table {
    display: flex;
    height: calc(100% - 26rem);
  }
  .label {
    padding-top: 0.5rem;
    margin-right: 0.625rem;
  }
  .top-table {
    display: flex;
    height: calc(100% - 26rem);
  }

  .dial-list {
    width: calc(100% - 11rem);
    height: calc(100% - 1rem);
    margin-top: 0.625rem;
    border: solid 1px rgb(206, 212, 218);
    overflow-y: hidden;
    overflow-x: hidden;
    .row {
      width: 100%;
    }
    .row:hover {
      background-color: rgb(246, 252, 253);
      cursor: pointer;
    }
    .table-header {
      display: flex;
      width: 100%;
      margin-top: -1px;
      .bt-1p {
        border-top: 1px solid #aaa;
      }
      .br-1p {
        border-right: 1px solid #aaa;
      }
      .bb-1p {
        border-bottom: 1px solid #aaa;
      }
      .bl-1p {
        border-left: 1px solid #aaa;
      }
      .examination_code {
        width: calc(100% - 37rem - 17px);
        padding-left: 0.1rem;
        text-align: center;
      }
      .pattern-time {
        width: 14rem;
        text-align: center;
      }
      .pattern-week-day {
        width: 9rem;
        text-align: center;
      }
      .pattern-time_limit_from {
        text-align: center;
        width: 14rem;
      }
      .pattern-time_limit_to {
        text-align: center;
        width: 7rem;
      }
    }
  }
  .last-history {
    overflow: hidden;
    margin-top: -2rem;
    padding-left: 0.625rem;
    label {
      margin-top: 0.3rem;
      float: right;
      width: 9rem;
      font-size: 1rem;
    }
  }
  .dial-oper {
    .row {
      margin: 0;
    }
    margin-top: 0.625rem;
    label {
      width: 4.7rem;
      font-size: 1rem;
      text-align: right;
    }
    input {
      font-size: 1rem;
      width: 6.25rem;
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
  .radio-btn label {
    font-size: 1rem;
    width: 4.7rem;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 0.25rem;
    padding: 0.25rem 0.3rem;
    text-align: center;
    margin-right: 0.3rem;
  }
  .label-title {
    width: 6rem;
    text-align: right;
    font-size: 1rem;
  }
  .react-datepicker-wrapper {
    width: 7rem;
    .react-datepicker__input-container {
      width: 100%;
      input {
        font-size: 1rem;
        width: 100%;
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
      width: 7rem;
    }
  }
  .period div:first-child {
    .label-title {
      width: 6rem;
      margin:0;
      font-size: 1rem;
      margin-right: 0.625rem;
      line-height:2.5rem;
    }
    .react-datepicker-wrapper {
      width: 7rem;
    }
  }
  .input-time {
    margin-top: 0.625rem;
    display: flex;
    label {
      width: 5rem;
      font-size: 1rem;
    }
    .hvMNwk {
      width: 100%;
    }
  }
  .from-padding {
    padding-left: 1.25rem;
  }

  .pullbox {
    margin-top: 0.625rem;
  }
  .label-title {
    margin-right: 0.625rem;
  }
  .pullbox .pullbox-label, .pullbox-select {
    width: 22.5rem;
    margin-bottom:0;
  }
  .checkbox-area label {
    width: 12.5rem;
  }
  .register_info {
    .react-datepicker-wrapper {
      width: 6.5rem;
    }
    .d-flex div {
      margin-top:0;
    }
    label {
      text-align: right;
      font-size: 1rem;
      margin-right: 0.5rem;
      width: 4.5rem;
      margin-top: 0;
      margin-bottom: 0;
      line-height:2.5rem;
    }
    .react-datepicker-popper {
      left: -60px !important;
      .react-datepicker__triangle {
        left: 80px !important;
      }
    }
  }
  .remove-x-input {
    input {
      width: calc(100% - 5rem);
      height:2.5rem;
    }
  }
  .implementation {
    .implementation-label {
      width: 5rem;
      margin-right: 0.625rem;
      margin-top: 0.5rem;
      font-size: 1rem;
    }
    .radio-btn label {
      width: 7.5rem;
      font-size: 1rem;
    }
  }
  .implementation_interval {
    display: flex;
    width: 100%;
    margin-top: 0.3rem;
    margin-bottom: 0.3rem;
    .implementation_interval-label {
      width: 6rem;
      margin-right: 0.625rem;
      text-align: right;
      font-size: 1rem;
      margin-top: 0;
      margin-bottom: 0;
      line-height:38px;
    }
    .radio-group-btn label {
      width: 4.375rem;
      padding: 0;
      margin: 0;
      margin-right:0.5rem;
      height:38px;
      line-height:38px;
    }
  }
  .implementation_month {
    display: flex;
    width: 100%;
    margin-top:0.5rem;
    .implementation_month-label {
      width: 6rem;
      margin-right: 0.625rem;
      text-align: right;
      font-size: 1rem;
      margin-top: 0;
      margin-bottom: 0;
      line-height:38px;
    }
    .radio-group-btn label {
      width: 3rem;
      margin:0;
      padding:0;
      margin-right:0.5rem;
      line-height:38px;
      height:38px;
    }
  }
  .gender {
    .gender-label {
      width: 6rem;
      margin: 0;
      margin-right: 0.625rem;
      font-size: 1rem;
      line-height:38px;
      height:38px;
      margin-bottom: auto;
      margin-top: auto;
    }
  }
  .gender .radio-group-btn label {
    width: 2rem;
    padding: 0;
    margin: 0;
    height:38px;
    line-height:38px;
    margin-right:0.5rem;
  }
  .select-day-btn {
    cursor: pointer;
    border: 1px solid rgb(206, 212, 218);
    height: 38px;
    margin-left: 0.625rem;
    line-height:38px;
    padding-left:0.3rem;
    padding-right:0.3rem;
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
  .final-input {
    padding-left: 2rem;
  }
  .popup-area {
    .pullbox-title{
      width:10rem;
    }
    .pullbox-label, .pullbox-select{
      width:4rem;
    }
  }
  .end-date{
    .label-title{
      width:0!important;
    }
  }
`;

const AdministrativefeeBox = styled.div`
  width: 100%;
  font-size: 1rem;
  height: calc(100% - 1.5rem);
  overflow-y: scroll;
  .pattern-list:hover {
    background-color: rgb(246, 252, 253);
    cursor: pointer;
  }
  .selected {
    background: lightblue;
  }
  .selected: hover {
    background: lightblue;
  }
  .pattern-list {
    display: flex;
    width: 100%;
    margin-top: -1px;
    .bt-1p {
      border-top: 1px solid #aaa;
    }
    .br-1p {
      border-right: 1px solid #aaa;
    }
    .bb-1p {
      border-bottom: 1px solid #aaa;
    }
    .bl-1p {
      border-left: 1px solid #aaa;
    }
    .examination_code {
      width: calc(100% - 37rem);
      padding-left: 0.3rem;
    }
    .pattern-time {
      padding-left: 0.3rem;
      width: 14rem;
    }
    .pattern-week-day {
      width: 9rem;
      padding-left: 0.3rem;
    }
    .pattern-time_limit_from {
      padding-left: 0.3rem;
      width: 7rem;
    }
    .pattern-time_limit_to {
      padding-left: 0.3rem;
      width: 7rem;
    }
  }
`;

const week_days = ["日", "月", "火", "水", "木", "金", "土"];

const implementation_interval_types = [
  "毎週",
  "第1曜日",
  "第2曜日",
  "第3曜日",
  "第4曜日",
  "第5曜日",
];

const implementation_months = [
  "毎月",
  "1月",
  "2月",
  "3月",
  "4月",
  "5月",
  "6月",
  "7月",
  "8月",
  "9月",
  "10月",
  "11月",
  "12月",
];

class Inspection extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    
    let examinationCodeData = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.COMMON_MASTER,
      "examination_master"
    );
    let code_master = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.COMMON_MASTER,
      "code_master"
    );
    var timingCodeData = sortTimingCodeMaster(code_master["実施タイミング"]);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let examination_pattern = [];
    this.state = {
      examination_pattern,
      name: "",
      time_limit_from: "",
      time_limit_to: "",
      entry_date: "",
      entry_time: "",
      directer_name: "",
      showHistory: 1,
      patient_id: "",
      checkAnotherDay: "",
      timing_code: 0,
      checkalldays: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
      checkdialdays: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
      check_enable_months: {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
      },
      check_enable_weeks: {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      },
      dialdays: "",
      final_week_days: 0,
      monthly_enable_week_number: 1,
      enable_month: 1,
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
      pattern_table_id: "",
      patientInfo: [],
      selected_pattern_data: "",
      isShowDoctorList: false,
      entry_name:
        authInfo != undefined && authInfo != null ? authInfo.name : "",
      instruction_doctor_number: "",
      final_entry_date: "",
      final_entry_time: "",
      final_entry_name: "",
      final_doctor_name: "",
      popup: 0,
      isConfirmComplete: false,
      select_dial_days: false,
      isOpenMoveOtherPageConfirm: false,
      confirm_alert_title:'',
      
      examinationCodeData,
      examination_codes: makeList_code(examinationCodeData),
      examination_code_option_list:makeList_codeName(examinationCodeData, 1),
      timingCodeData,
      timing_codes: makeList_code(timingCodeData),
      timing_options: makeList_codeName(timingCodeData, 1),
      isUpdateScheduleConfirmModal: false,
      isReScheduleConfirm: false,
      isAddConfirmModal: false,
      isClearConfirmModal: false,
      alert_message: "",
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
    let server_time = await getServerTime();
    let state_data = {};
    state_data['entry_date'] = new Date(server_time);
    state_data['entry_time'] = new Date(server_time);
    if (this.context.selectedDoctor.code > 0) {
      state_data['instruction_doctor_number'] = parseInt(this.context.selectedDoctor.code);
      state_data['directer_name'] = this.context.selectedDoctor.name;
    }
    this.setState(state_data);
    this.changeBackground();
  }
  
  componentDidUpdate () {
    this.changeBackground();
  }
  
  getName = (e) => {
    this.setChangeFlag(1);
    let val = e.target.id;
    if (e.target.id == 0 || e.target.id == "0") val = "";
    this.setState({ name: val });
  };
  
  getShowHistory =async(name, value) => {
    if (name === "schedule") {
      if (value == 0) {
        let server_time = await getServerTime();
        let tmp = [];
        let today = formatDateLine(new Date(server_time));
        tmp = this.getPatternListByDateCondition(this.state.examination_pattern,today,"time_limit_from","time_limit_to");
        this.setState({
          showHistory: value,
          examination_pattern: tmp,
        });
      } else {
        this.setState({
          showHistory: value,
          examination_pattern: this.state.origin_pattern_list,
        });
      }
    }
  };
  
  getStartdate = (value) => {
    this.setChangeFlag(1);
    this.setState({ time_limit_from: value });
  };
  
  getEnddate = (value) => {
    this.setChangeFlag(1);
    this.setState({ time_limit_to: value });
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
  
  getInputdate = (value) => {
    this.setChangeFlag(1);
    this.setState({ entry_date: value });
  };
  
  getInputMan = (e) => {
    this.setChangeFlag(1);
    this.setState({ entry_name: e.target.value });
  };
  
  getDirectMan = (e) => {
    this.setChangeFlag(1);
    this.setState({ directer_name: e.target.value });
  };
  
  getCheckAnotherDay = (name, value) => {
    if (name === "schedule") {
      if (value === 0) {
        this.getDialDays(this.state.patient_id);
      } else {
        this.setState({
          checkAnotherDay: value,
          checkdialdays: {
            0: true,
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            6: true,
          },
        });
      }
    }
  };
  
  selectDialDays = () => {
    if (this.state.dialdays !== "") {
      let checkalldays = {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      };
      var final_week_days = 0;
      this.setState({ select_dial_days: !this.state.select_dial_days }, () => {
        if (this.state.select_dial_days) {
          Object.keys(this.state.dialdays).map((index) => {
            if (this.state.dialdays[index] === true) {
              checkalldays[index] = true;
              var pval = Math.pow(2, index);
              final_week_days = final_week_days + pval;
            }
          });
          this.setState({ final_week_days, checkalldays });
        } else {
          this.setState({
            final_week_days: 0,
            checkalldays,
          });
        }
      });
    }
  };
  
  getTimingList = (e) => {
    this.setChangeFlag(1);
    this.setState({ timing_code: e.target.id });
  };
  
  selectPatient =async(patientInfo) => {
    this.initRedBorder();
    await this.initializeInfo(patientInfo.system_patient_id);
    this.setState({
      patientInfo: patientInfo,
    });
  };
  
  initializeInfo =async(patient_id) => {
    let server_time = await getServerTime();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
      selected_number: "",
      patient_id: patient_id,
      pattern_table_id: "",
      name: "",
      time_limit_from: new Date(server_time),
      time_limit_to: "",
      entry_date: new Date(server_time),
      entry_time: new Date(server_time),
      checkAnotherDay: false,
      checkalldays: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
      check_enable_months: {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
      },
      check_enable_weeks: {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      },
      final_week_days: 0,
      timing_code: 0,
      enable_month: 1,
      monthly_enable_week_number: 1,
      entry_name:
        authInfo != undefined && authInfo != null ? authInfo.name : "",
      directer_name:
        this.context.selectedDoctor.code > 0
          ? this.context.selectedDoctor.name
          : "",
      instruction_doctor_number:
        this.context.selectedDoctor.code > 0
          ? parseInt(this.context.selectedDoctor.code)
          : "",
      isShowDoctorList: false,
      final_entry_date: "",
      final_entry_time: "",
      final_entry_name: "",
      final_doctor_name: "",
      select_dial_days: false,
      change_flag: false,
    });
    this.setChangeFlag(0);
    this.getDialDays(patient_id);
    await this.getExaminationPattern(patient_id);
    this.setDoctors();
    removeRedBorder('name_id');
    removeRedBorder('timing_code_id');
    removeRedBorder('time_limit_from_id');
    removeRedBorder('time_limit_to_id');
    removeRedBorder('final_week_days_id');
  };
  
  async getDialDays(patient_id) {
    if (patient_id !== "") {
      let path = "/app/api/v2/dial/pattern/getDialDays";
      const post_data = {
        system_patient_id: patient_id,
      };
      await apiClient
        ._post(path, {
          params: post_data,
        })
        .then((res) => {
          let checkdialdays = {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
          };
          let dialdays = {
            0: false,
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
          };
          if (res.length > 0) {
            res.map((item) => {
              checkdialdays[item.day] = true;
              dialdays[item.day] = true;
            });
          }
          this.setState({
            checkAnotherDay: 0,
            checkdialdays,
            dialdays,
          });
        })
        .catch(() => {});
    }
  }
  
  async getExaminationPattern(patient_id) {
    let server_time = await getServerTime();
    let path = "/app/api/v2/dial/pattern/getExaminationPattern";
    const post_data = {
      patient_id: patient_id,
    };
    await apiClient
      ._post(path, {
        params: post_data,
      })
      .then((res) => {
        if (res) {
          let tmp = res;
          if (this.state.showHistory == 0) {
            let today = formatDateLine(new Date(server_time));
            tmp = this.getPatternListByDateCondition(res,today,"time_limit_from","time_limit_to");
          }
          this.setState({
            examination_pattern: tmp,
            origin_pattern_list: res,
          });
        }
      })
      .catch(() => {});
  }
  
  addDay = (value) => {
    let checkalldays = this.state.checkalldays;
    checkalldays[value] = checkalldays[value] ? false : true;
    var final_week_days = parseInt(this.state.final_week_days);
    var pval = Math.pow(2, value);
    final_week_days =
      (final_week_days & pval) > 0
        ? final_week_days - pval
        : final_week_days + pval;
    this.setChangeFlag(1);
    
    let isAllCheckedOfDialDays = this.checkAllChekedOfDialDays(checkalldays);
    if (isAllCheckedOfDialDays) {
      this.setState({
        final_week_days,
        checkalldays,
        select_dial_days: true,
      });
    } else {
      this.setState({ final_week_days, checkalldays });
    }
  };
  
  checkAllChekedOfDialDays = (checkalldays) => {
    let result = 0;
    Object.keys(this.state.dialdays).map((item) => {
      if (this.state.dialdays[item] == checkalldays[item]) {
        result += 1;
      }
    });
    
    if (result == 7) return true;
    else return false;
  };
  
  SetImplementationMonth = (value) => {
    let check_enable_months = this.state.check_enable_months;
    var enable_month = parseInt(this.state.enable_month);
    if (value !== 0 && check_enable_months[0]) {
      check_enable_months[0] = false;
      enable_month--;
    }
    if (value == 0) {
      enable_month = 1;
      check_enable_months = {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
      };
    } else {
      check_enable_months[value] = check_enable_months[value] ? false : true;
      var pval = Math.pow(2, value);
      enable_month =
        (enable_month & pval) > 0 ? enable_month - pval : enable_month + pval;
    }
    this.setChangeFlag(1);
    this.setState({ enable_month, check_enable_months });
  };
  
  SetWeekInterval = (value) => {
    let check_enable_weeks = this.state.check_enable_weeks;
    var monthly_enable_week_number = parseInt(
      this.state.monthly_enable_week_number
    );
    if (value !== 0 && check_enable_weeks[0]) {
      check_enable_weeks[0] = false;
      monthly_enable_week_number--;
    }
    if (value == 0) {
      monthly_enable_week_number = 1;
      check_enable_weeks = {
        0: true,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
        10: false,
        11: false,
        12: false,
      };
    } else {
      check_enable_weeks[value] = check_enable_weeks[value] ? false : true;
      var pval = Math.pow(2, value);
      monthly_enable_week_number =
        (monthly_enable_week_number & pval) > 0
          ? monthly_enable_week_number - pval
          : monthly_enable_week_number + pval;
    }
    this.setChangeFlag(1);
    this.setState({ monthly_enable_week_number, check_enable_weeks });
  };
  
  add = () => {
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.REGISTER
      ) === false
    ) {
      window.sessionStorage.setItem("alert_messages", "登録権限がありません。");
      return;
    }
    // if (
    //   this.state.time_limit_from == undefined ||
    //   this.state.time_limit_from == null ||
    //   this.state.time_limit_from == ""
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "期限を入力してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.time_limit_to != undefined &&
    //   this.state.time_limit_to != null &&
    //   this.state.time_limit_to != ""
    // ) {
    //   if (
    //     !this.checkDate(this.state.time_limit_from, this.state.time_limit_to)
    //   ) {
    //     window.sessionStorage.setItem(
    //       "alert_messages",
    //       "期限を正しく入力してください。"
    //     );
    //     return;
    //   }
    // }
    // if (
    //   this.state.name == undefined ||
    //   this.state.name == null ||
    //   this.state.name == ""
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "検査名を入力して下さい。"
    //   );
    //   return;
    // }
    if (this.state.instruction_doctor_number === "") {
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    // if (this.state.final_week_days === 0) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "曜日を選択してください。"
    //   );
    //   return;
    // }
    // if (this.state.timing_code == null || this.state.timing_code == 0) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "タイミングを選択してください。"
    //   );
    //   return;
    // }
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
      this.setState({alert_message:error_str_array.join('\n')});
      return;
    }
    this.setState({
      isAddConfirmModal: true,
      confirm_message: "パターンを追加しますか？",
    });
  };
  
  addPattern = () => {
    this.confirmCancel();
    let new_pattern = {
      patient_id: this.state.patient_id,
      time_limit_from: this.state.time_limit_from
        ? formatDateLine(this.state.time_limit_from)
        : "",
      time_limit_to: this.state.time_limit_to
        ? formatDateLine(this.state.time_limit_to)
        : "",
      schedule_start_day: "",
      examination_code: this.state.name,
      timing_code: this.state.timing_code,
      weekday: this.state.final_week_days,
      monthly_enable_week_number: this.state.monthly_enable_week_number,
      enable_month: this.state.enable_month,
      entry_date: this.state.entry_date
        ? formatDateLine(this.state.entry_date)
        : "",
      entry_time: this.state.entry_time
        ? formatTime(this.state.entry_time)
        : "",
      instruction_doctor_number: this.state.instruction_doctor_number,
      is_require_confirmation_before_weight_measurement: this.state.popup,
    };
    
    let path = "/app/api/v2/dial/pattern/registerExaminationPattern";
    this.openConfirmCompleteModal("保存中");
    if (this.double_click == true) return;
    this.double_click = true;
    apiClient
      .post(path, {
        params: new_pattern,
      })
      .then(async(res) => {
        this.setState({ isConfirmComplete: false });
        await this.initializeInfo(this.state.patient_id);
        this.makeSchedule(res.pattern_number, new_pattern, 0);
        window.sessionStorage.setItem("alert_messages", "登録完了##" + res.alert_message);
      })
      .catch(() => {
        this.setState({ isConfirmComplete: false });
        window.sessionStorage.setItem("alert_messages", "失敗しました");
      })
      .finally(() => {
        this.double_click = false;
      });
  };
  
  editpatternConfirm = (item) => {
    if (this.change_flag === 1) {
      this.setState({
        isOpenMoveOtherPageConfirm: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type: "edit_pattern",
        selected_pattern_data:item,        
        confirm_alert_title:'入力中',
      });
    } else {
      this.setState({
        selected_pattern_data:item,        
      }, ()=> {
        this.editPattern();
      })
    }
  }
  editPattern = () => {    
    this.initRedBorder();
    let pattern_data = this.state.selected_pattern_data;
    let create_at = pattern_data.updated_at;
    let input_day = create_at.split(" ");
    let final_week_days = {};
    let another_day = false;
    var weekday = parseInt(pattern_data.weekday);
    for (var i = 0; i < 7; i++) {
      var pval = Math.pow(2, i);
      if ((weekday & pval) > 0) {
        final_week_days[i] = true;
        if (this.state.dialdays[i] === false) {
          another_day = true;
        }
      } else {
        final_week_days[i] = false;
      }
    }
    if (another_day) {
      this.setState({
        checkAnotherDay: 1,
        checkdialdays: {
          0: true,
          1: true,
          2: true,
          3: true,
          4: true,
          5: true,
          6: true,
        },
      });
    } else {
      this.getDialDays(this.state.patient_id);
    }
    var enable_month = pattern_data.enable_month;
    let check_enable_months = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
      6: false,
      7: false,
      8: false,
      9: false,
      10: false,
      11: false,
      12: false,
    };
    if (enable_month === 1 || enable_month === 0) {
      check_enable_months[0] = true;
    } else {
      for (i = 1; i < 13; i++) {
        pval = Math.pow(2, i);
        if ((enable_month & pval) > 0) {
          check_enable_months[i] = true;
        } else {
          check_enable_months[i] = false;
        }
      }
    }
    var monthly_enable_week_number = pattern_data.monthly_enable_week_number;
    let check_enable_weeks = {
      0: false,
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    };
    if (monthly_enable_week_number === 1 || monthly_enable_week_number === 0) {
      check_enable_weeks[0] = true;
    } else {
      for (i = 1; i < 13; i++) {
        pval = Math.pow(2, i);
        if ((monthly_enable_week_number & pval) > 0) {
          check_enable_weeks[i] = true;
        } else {
          check_enable_weeks[i] = false;
        }
      }
    }
    let _state = {  
      selected_number: pattern_data.number,
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
      time_limit_to:
        pattern_data.time_limit_to == null
          ? null
          : new Date(pattern_data.time_limit_to),
      final_entry_date: formatDateSlash(new Date(input_day[0])),
      final_entry_time: formatTime(formatTimePicker(input_day[1])),
      final_entry_name:
        this.state.staff_list_by_number != undefined &&
        this.state.staff_list_by_number != null
          ? pattern_data.updated_by !== 0
          ? this.state.staff_list_by_number[pattern_data.updated_by]
          : ""
          : "",
      final_doctor_name:
        pattern_data.instruction_doctor_number != null &&
        this.state.doctor_list_by_number != undefined
          ? this.state.doctor_list_by_number[
            pattern_data.instruction_doctor_number
            ]
          : "",
      popup: pattern_data.is_require_confirmation_before_weight_measurement,
    };
    let isAllCheckedOfDialDays = this.checkAllChekedOfDialDays(final_week_days);
    if (isAllCheckedOfDialDays) {
      _state.select_dial_days = true;
    } else {
      _state.select_dial_days = false;
    }
    
    this.setState(_state);
    this.ex_time_limit_from = new Date(pattern_data.time_limit_from);
    this.ex_time_limit_to =
      pattern_data.time_limit_to == null
        ? null
        : new Date(pattern_data.time_limit_to);
    this.ex_weekday = weekday;
    this.ex_monthly_enable_week_number = monthly_enable_week_number;
    this.ex_enable_month = enable_month;
    
    this.ex_pattern = {
      patient_id: this.state.patient_id,
      time_limit_from: pattern_data.time_limit_from,
      time_limit_to:
        pattern_data.time_limit_to == null ? "" : pattern_data.time_limit_to,
      timing_code: pattern_data.timing_code,
      examination_code: pattern_data.examination_code,
      weekday: weekday,
      enable_month: enable_month,
      monthly_enable_week_number: monthly_enable_week_number,
      is_require_confirmation_before_weight_measurement:
      pattern_data.is_require_confirmation_before_weight_measurement,
    };
    this.setChangeFlag(0);
  };
  
  checkEqual(data1, data2) {
    if (JSON.stringify(data1) == JSON.stringify(data2)) return true;
    return false;
  }
  
  updatePattern = async (re_schedule = true) => {
    if (this.state.pattern_table_id !== "") {
      var time_limit_from,
        time_limit_to,
        weekday,
        monthly_enable_week_number,
        enable_month;
      if (re_schedule) {
        time_limit_from = this.state.time_limit_from
          ? formatDateLine(this.state.time_limit_from)
          : "";
        time_limit_to = this.state.time_limit_to
          ? formatDateLine(this.state.time_limit_to)
          : "";
        weekday = this.state.final_week_days;
        monthly_enable_week_number = this.state.monthly_enable_week_number;
        enable_month = this.state.enable_month;
      } else {
        time_limit_from = formatDateLine(this.ex_time_limit_from);
        time_limit_to = formatDateLine(this.ex_time_limit_to);
        weekday = this.ex_weekday;
        monthly_enable_week_number = this.ex_monthly_enable_week_number;
        enable_month = this.ex_enable_month;
      }
      let update_pattern = {
        number: this.state.pattern_table_id,
        patient_id: this.state.patient_id,
        time_limit_from,
        time_limit_to,
        timing_code: this.state.timing_code,
        examination_code: this.state.name,
        weekday,
        enable_month,
        monthly_enable_week_number,
        entry_date: this.state.entry_date
          ? formatDateLine(this.state.entry_date)
          : "",
        entry_time: this.state.entry_time
          ? formatTime(this.state.entry_time)
          : "",
        instruction_doctor_number: this.state.instruction_doctor_number,
        is_require_confirmation_before_weight_measurement: this.state.popup,
        sch_all_remove: 1,
      };
      
      var new_updated_pattern = {
        patient_id: this.state.patient_id,
        time_limit_from: time_limit_from,
        time_limit_to: time_limit_to,
        timing_code: this.state.timing_code,
        examination_code: this.state.name,
        weekday: weekday,
        enable_month: enable_month,
        monthly_enable_week_number: monthly_enable_week_number,
        is_require_confirmation_before_weight_measurement: this.state.popup,
      };
      
      if (this.checkEqual(this.ex_pattern, new_updated_pattern)) {
        this.confirmCancel();
        window.sessionStorage.setItem(
          "alert_messages",
          "変更されたデータがありません。"
        );
        return;
      }
      let path = "/app/api/v2/dial/pattern/updateExaminationPattern";
      this.openConfirmCompleteModal("保存中");
      await apiClient
        .post(path, {
          params: update_pattern,
        })
        .then(async(res) => {
          this.setState({ isConfirmComplete: false });
          await this.initializeInfo(this.state.patient_id);
          this.makeSchedule(res.pattern_number, update_pattern, 1);
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        })
        .catch(() => {
          this.setState({ isConfirmComplete: false });
          window.sessionStorage.setItem("alert_messages", "失敗しました");
        });
    }
    this.confirmCancel();
  };
  
  checkDate(from, to) {
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
      params: post_data,
    });
  }
  
  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
  };
  
  deletePattern = async (type) => {
    if (this.state.pattern_table_id !== "") {
      let delete_pattern = {
        number: this.state.pattern_table_id,
        system_patient_id: this.state.patient_id,
        all_remove: type == true ? 1 : 0,
      };
      await this.deleteDialPatternFromPost(delete_pattern);
      await this.initializeInfo(this.state.patient_id);
    }
    this.confirmCancel();
  };
  
  async deleteDialPatternFromPost(data) {
    let path = "/app/api/v2/dial/pattern/deleteExaminationPattern";
    
    await apiClient
      .post(path, {
        params: data,
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", "削除完了##" +  res.alert_message);
      })
      .catch(() => {});
  }
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isReScheduleConfirm: false,
      isUpdateScheduleConfirmModal: false,
      isAddConfirmModal: false,
      isConfirmComplete: false,
      isOpenMoveOtherPageConfirm: false,
      isClearConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',
    });
  }
  openScheduleConfirmModal = () => {
    this.setState({ isUpdateScheduleConfirmModal: true });
  };
  
  updatePatternSchedule = (type) => {
    this.updatePattern(true, type);
  };
  update = () => {
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    if (this.state.pattern_table_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "変更するパターンを選択してください。"
      );
      return;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.EDIT
      ) === false
    ) {
      window.sessionStorage.setItem("alert_messages", "変更権限がありません。");
      return;
    }
    if (this.state.instruction_doctor_number === "") {
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    // if (
    //   this.state.time_limit_from == undefined ||
    //   this.state.time_limit_from == null ||
    //   this.state.time_limit_from == ""
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "期限を入力してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.time_limit_to != undefined &&
    //   this.state.time_limit_to != null &&
    //   this.state.time_limit_to != ""
    // ) {
    //   if (
    //     !this.checkDate(this.state.time_limit_from, this.state.time_limit_to)
    //   ) {
    //     window.sessionStorage.setItem(
    //       "alert_messages",
    //       "期限を正しく入力してください。"
    //     );
    //     return;
    //   }
    // }
    // if (
    //   this.state.name == undefined ||
    //   this.state.name == null ||
    //   this.state.name == ""
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "検査名を入力して下さい。"
    //   );
    //   return;
    // }
    // if (this.state.final_week_days === 0) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "曜日を選択してください。"
    //   );
    //   return;
    // }
    // if (this.state.timing_code == null || this.state.timing_code == 0) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "タイミングを選択してください。"
    //   );
    //   return;
    // }
    let error_str_array = this.checkValidation();
    if (error_str_array.length > 0 ) {
      this.setState({alert_message:error_str_array.join('\n')});
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "パターン情報を変更しますか?",
    });
  };
  
  delete = () => {
    if (this.state.patient_id === "") {
      return;
    }
    if (this.state.pattern_table_id === "") {
      return;
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.DELETE
      ) === false
    ) {
      return;
    }
    this.setState({
      isDeleteConfirmModal: true,
      // confirm_message: "パターン情報を削除しますか?",
    });
  };
  
  selectDoctor = (doctor) => {
    this.setState({
      directer_name: doctor.name,
      instruction_doctor_number: doctor.number,
    });
    this.context.$updateDoctor(doctor.number, doctor.name);
    this.setChangeFlag(1);
    this.closeDoctorSelectModal();
  };
  
  showDoctorList = (e) => {

    // ■DN601 入力者関連のラベルのカーソルの統一
    if (e != undefined && (e.target.type == undefined || e.target.type != "text")) return;
    
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.doctor_number > 0) {
      this.setState({
        directer_name: authInfo.name,
        instruction_doctor_number: authInfo.doctor_number,
      });
    } else {
      this.setState({
        isShowDoctorList: true,
      });
    }
  };
  
  closeDoctorSelectModal = () => {
    this.setState({
      isShowDoctorList: false,
    });
  };
  
  goOtherPattern = (url) => {
    if (this.change_flag === 1) {
      this.setState({
        isOpenMoveOtherPageConfirm: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type: "other_tab",
        go_url: url,
        confirm_alert_title:'入力中',
      });
      return;
    }
    if (url == "/dial/schedule/Schedule")
      sessApi.setObjectValue("dial_schedule_table", "open_tab", "inspection");
    this.props.history.replace(url);
  };
  
  clear = () => {
    if (!this.change_flag) return;
    if (this.state.patient_id === "") {
      window.sessionStorage.setItem(
        "alert_messages",
        "患者様を選択してください。"
      );
      return;
    }
    this.setState({
      isClearConfirmModal: true,
      confirm_message: "入力中の内容を消去しますか？",
    });
  };
  
  clearPattern =async() => {
    this.confirmCancel();
    if (this.state.patient_id !== "") {
      await this.initializeInfo(this.state.patient_id);
    }
  };
  
  getPopupDisplay = (e) => {
    this.setState({ popup: e.target.id });
  };
  confirmReSchedule = () => {
    var start_date = formatJapan(this.state.time_limit_from);
    var end_date = this.state.time_limit_to
      ? formatJapan(this.state.time_limit_to)
      : "無期限";
    let weekday = "";
    for (let i = 0; i < 7; i++) {
      weekday +=
        this.state.final_week_days & Math.pow(2, i) ? week_days[i] : "";
    }
    this.setState({
      isReScheduleConfirm: true,
      confirm_message:
      "対象日全てに変更を反映しますか" +
      "\n" +
      "期限 " +
      start_date +
      " ～ " +
      end_date +
      "\n  （" +
      weekday +
      "）",
    });
  };
  setChangeFlag = (change_flag) => {
    this.change_flag = change_flag;
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "inspection", 1);
    } else {
      sessApi.remove("dial_change_flag");
    }
  };
  
  moveOtherPage = () => {
    this.setChangeFlag(0);
    let confirm_type = this.state.confirm_type;
    let go_url = this.state.go_url;
    this.setState(
      {
        isOpenMoveOtherPageConfirm: false,
        confirm_message: "",
        confirm_type: "",
        confirm_alert_title:'',
      },
      () => {
        if (confirm_type === "other_tab") {
          this.goOtherPattern(go_url);
        } else if (confirm_type == "edit_pattern") {
          this.editPattern();
        }
      }
    );
  };
  
  changeBackground = () => {
    patternValidate('dial_inspection', this.state, 'background');
    removeRequiredBg("final_week_days_id");
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
  }
  
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
  
  closeAlertModal = () => {
    this.setState({ alert_message: '' });
    let first_tag_id = this.state.first_tag_id;
    if (first_tag_id != undefined && first_tag_id != null){
      $('#' + first_tag_id).focus()
    }
  }
  
  resetDatePicker = (e) => {
    if (e.target.id == this.state.first_tag_id){
      addRedBorder(e.target.id);
    }
    this.forceUpdate();
  }
  
  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let timing_codes = this.state.timing_codes;
    let examination_codes = this.state.examination_codes;
    var popup_display = [{id:0, value:"無"}, {id:1, value:'有'}];
    let message = "";
    let examination_pattern = [];
    let can_delete = this.state.pattern_table_id != "";
    let del_tooltip = "";
    if (this.state.patient_id === "") {
      del_tooltip = "患者様を選択してください。";
    }
    if (this.state.pattern_table_id === "") {
      del_tooltip = "削除するパターンを選択してください。";
    }
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.DELETE
      ) === false
    ) {
      del_tooltip = "削除権限がありません。";
    }
    let clear_tooltip = this.state.change_flag
      ? ""
      : "変更した内容がありません";
    if (this.state.examination_pattern.length) {
      examination_pattern = this.state.examination_pattern.map(
        (item) => {
          let weekday = "";
          for (let i = 0; i < 7; i++) {
            weekday += item.weekday & Math.pow(2, i) ? week_days[i] : "";
          }
          return (
            <>
              <div
                className={
                  "pattern-list " +
                  (this.state.selected_number === item.number ? "selected" : "")
                }
                onClick={this.editpatternConfirm.bind(this, item)}
              >
                <div className={"examination_code bl-1p bt-1p bb-1p"}>
                  {examination_codes != undefined &&
                  examination_codes != null &&
                  examination_codes[item.examination_code] != undefined
                    ? examination_codes[item.examination_code]
                    : ""}
                </div>
                <div className={"pattern-time bl-1p bt-1p bb-1p"}>
                  {timing_codes != undefined &&
                  timing_codes != null &&
                  timing_codes[item.timing_code] != undefined
                    ? timing_codes[item.timing_code]
                    : ""}
                </div>
                <div className={"pattern-week-day bl-1p bt-1p bb-1p"}>
                  {weekday}
                </div>
                <div className={"pattern-time_limit_from bl-1p bt-1p bb-1p"}>
                  {formatDateSlash(item.time_limit_from)}
                </div>
                <div
                  className={"pattern-time_limit_to bl-1p bt-1p bb-1p br-1p"}
                >
                  {item.time_limit_to == null
                    ? "～ 無期限"
                    : formatDateSlash(item.time_limit_to)}
                </div>
              </div>
            </>
          );
        }
      );
    } else {
      message = (
        <div className="no-result">
          <span>登録された検査パターンがありません。</span>
        </div>
      );
    }
    return (
      <>
        <DialSideBar
          onGoto={this.selectPatient}
          ref={(ref) => (this.sideBarRef = ref)}
          history = {this.props.history}
        />
        <DialPatientNav
          patientInfo={this.state.patientInfo}
          history = {this.props.history}
        />
        <Card>
          <div className={"flex"}>
            <div className="title">検査パターン</div>
            <div className={"other-pattern"}>
              <Button className="schedule-button" onClick={this.goOtherPattern.bind(this, "/dial/pattern/multi_inspection")}>一括登録</Button>
              <Button className="schedule-button" onClick={this.goOtherPattern.bind(this, "/dial/schedule/Schedule")}>スケジュール</Button>
              <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/dialPattern")}>透析</Button>
              <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/anticoagulation")}>抗凝固法</Button>
              <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/Dializer")}>ダイアライザ</Button>
              <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/injection")}>注射</Button>
              <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/prescription")}>処方</Button>
              <Button className="disable-button">検査</Button>
              <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/dialPrescript")}>透析中処方</Button>
              <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/administrativefee")}>管理料</Button>
            </div>
          </div>
          <div className="bodywrap">
            <Wrapper>
              <div className="top-table">
                <div className="dial-list">
                  <div className="table-header">
                    <div className={"examination_code bl-1p bt-1p bb-1p"}>
                      検査名
                    </div>
                    <div className={"pattern-time bl-1p bt-1p bb-1p"}>
                      タイミング
                    </div>
                    <div className={"pattern-week-day bl-1p bt-1p bb-1p"}>
                      曜日
                    </div>
                    <div
                      className={"pattern-time_limit_from bl-1p bt-1p bb-1p br-1p"}
                    >
                      期限
                    </div>
                  </div>
                  <AdministrativefeeBox>
                    {examination_pattern}
                    {message}
                  </AdministrativefeeBox>
                </div>
              </div>
              <div className="last-history">
                <Checkbox
                  label="期限切れも表示"
                  getRadio={this.getShowHistory.bind(this)}
                  value={this.state.showHistory}
                  isDisabled = {this.state.patient_id > 0? false: true}
                  name="schedule"
                />
              </div>
              <div className="dial-oper">
                <div className="left-area">
                  <SelectorWithLabel
                    id="name_id"
                    options={this.state.examination_code_option_list}
                    title="検査名"
                    getSelect={this.getName.bind(this)}
                    departmentEditCode={this.state.name}
                  />
                  <div className="d-flex justify-content">
                    <div>
                      <div className="d-flex">
                        <SelectorWithLabel
                          id="timing_code_id"
                          options={this.state.timing_options}
                          title="タイミング"
                          getSelect={this.getTimingList.bind(this)}
                          departmentEditCode={this.state.timing_code}
                        />
                        {(timing_codes[this.state.timing_code] == "透析前" ||
                          timing_codes[this.state.timing_code] ==
                          "透析終了後") && (
                          <>
                            <div className="popup-area">
                              <SelectorWithLabel
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
                                  checked={this.state.check_enable_months[key]}
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
                          {implementation_interval_types.map((item, key) => {
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
                                  checked={this.state.check_enable_weeks[key]}
                                />
                              </>
                            );
                          })}
                        </>
                      </div>
                      <div className="flex weekday_area">
                        <div className="flex">
                          <div className="gender flex">
                            <label className="gender-label" style={{cursor:"text"}}>曜日</label>
                            <div id="final_week_days_id" className='flex transparent-border'>
                              {week_days.map((item, key) => {
                                if (this.state.checkdialdays[key]) {
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
                                  return <div className={"no-dial-day"}></div>;
                                }
                              })}
                              <div className="select-day-btn" onClick={this.selectDialDays}>透析曜日を選択</div>
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
                          id="time_limit_from_id"
                          label="期限"
                          type="date"
                          getInputText={this.getStartdate}
                          diseaseEditData={this.state.time_limit_from}
                          onBlur = {e => this.resetDatePicker(e)}
                        />
                        <div className="pd-15">～</div>
                        <div className='end-date'>
                          <InputWithLabelBorder
                            id="time_limit_to_id"
                            label=""
                            type="date"
                            getInputText={this.getEnddate}
                            diseaseEditData={this.state.time_limit_to}
                            onBlur = {e => this.resetDatePicker(e)}
                          />
                        </div>
                        
                      </div>
                    </div>
                    <div className="register_info" style={{width:"23rem", marginLeft:"auto"}}>
                      {this.state.final_entry_date !== "" && (
                        <div className={"final-input"}>
                          <div>最終入力日時：{this.state.final_entry_date}</div>
                          <div>入力者：{this.state.final_entry_name}</div>
                          <div>
                            指示者：
                            {this.state.final_doctor_name != undefined
                              ? this.state.final_doctor_name
                              : ""}
                          </div>
                        </div>
                      )}
                      <div className="d-flex">
                        <InputWithLabel
                          className="entry_date"
                          label="入力日"
                          type="date"
                          getInputText={this.getInputdate}
                          diseaseEditData={this.state.entry_date}
                          onBlur = {e => this.resetDatePicker(e)}
                        />
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
                      </div>
                      <div className="remove-x-input input-info">
                        <InputWithLabel
                          label="入力者"
                          type="text"
                          isDisabled={true}
                          placeholder=""
                          diseaseEditData={this.state.entry_name}
                        />
                        {authInfo != undefined &&
                        authInfo != null &&
                        authInfo.doctor_number > 0 ? (
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
                  </div>
                </div>
              </div>
            </Wrapper>
          </div>
          <div className="footer-buttons">
            <Button
              className={can_delete ? "delete-btn" : "disable-btn"}
              onClick={this.delete.bind(this)}
              tooltip={del_tooltip}
            >
              削除
            </Button>
            <Button
              className={this.state.change_flag ? "cancel-btn" : "disable-btn"}
              onClick={this.clear}
              tooltip={clear_tooltip}
            >
              クリア
            </Button>
            <Button className="change-btn" onClick={this.update.bind(this)}>
              変更
            </Button>
            <Button className="add-btn" onClick={this.add.bind(this)}>
              追加
            </Button>
          </div>
          {this.state.isClearConfirmModal !== false &&
          this.state.isConfirmComplete === false && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.clearPattern.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          
          {this.state.isAddConfirmModal && !this.state.isConfirmComplete && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.addPattern.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          
          {this.state.isUpdateConfirmModal && !this.state.isConfirmComplete && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.confirmReSchedule.bind(this)}
              confirmTitle={this.state.confirm_message}
            />
          )}
          {this.state.isDeleteConfirmModal && !this.state.isConfirmComplete && (
            <PatternDeleteConfirmModal
              title={"検査"}
              closeModal={this.confirmCancel.bind(this)}
              confirmOk={this.deletePattern.bind(this)}
            />
          )}
          {this.state.isUpdateScheduleConfirmModal &&
          !this.state.isConfirmComplete && (
            <PatternUpdateConfirmModal
              title={"検査"}
              closeModal={this.confirmCancel.bind(this)}
              confirmOk={this.updatePatternSchedule.bind(this)}
            />
          )}
          {this.state.isReScheduleConfirm && !this.state.isConfirmComplete && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.updatePattern.bind(this, false)}
              confirmOk={this.updatePattern.bind(this, true)}
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
          {this.state.isOpenMoveOtherPageConfirm && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.moveOtherPage.bind(this)}
              confirmTitle={this.state.confirm_message}
              title = {this.state.confirm_alert_title}
            />
          )}
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          {this.state.isConfirmComplete !== false && (
            <CompleteStatusModal message={this.state.complete_message} />
          )}
        </Card>
      </>
    );
  }
}
Inspection.contextType = Context;

Inspection.propTypes = {
  history: PropTypes.object,
};

export default Inspection;
