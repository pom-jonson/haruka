import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
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
import RadioButton from "~/components/molecules/RadioInlineButton";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DialSideBar from "../DialSideBar";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
registerLocale("ja", ja);
import DialPatientNav from "../DialPatientNav";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import {
  makeList_code,
  sortTimingCodeMaster,
  makeList_codeName,
  addRequiredBg,
  addRedBorder,
  removeRedBorder,
  removeRequiredBg,
  toHalfWidthOnlyNumber
} from "~/helpers/dialConstants";
import NumericInputWithUnitLabel from "~/components/molecules/NumericInputWithUnitLabel";
import PatternDeleteConfirmModal from "~/components/templates/Dial/modals/PatternDeleteConfirmModal";
import PatternUpdateConfirmModal from "~/components/templates/Dial/modals/PatternUpdateConfirmModal";
import CalcDial from "~/components/molecules/CalcDial";
import { patternValidate } from "~/helpers/validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';
import {getServerTime} from "~/helpers/constants";

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
    letter-spacing: -2px;
    border-left: solid 0.3rem #69c8e1;
    width: 20rem;
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
      font-size: 1rem;
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
    display: block;
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
  overflow: hidden;
  display: block;
  align-items: flex-start;
  justify-content: space-between;
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
    .sortation_name {
      width: 6.25rem;
    }
    .medicine_amount {
      width: 6rem;
    }
    .weekday {
      width: 9rem;
    }
    .limit_date {
      width: 12.5rem;
    }
    .timing_codes {
      width: 14rem;
      text-align: left;
      padding-left: 0.1rem;
    }
    .medicine_name {
      width: calc(100% - 47.75rem - 17px);
      text-align: left;
      padding-left: 0.1rem;
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
    width: 100%;
    margin-top: 0.625rem;
    display:flex;
    align-items: flex-start;
    justify-content: space-between;
    label {
      width: 6rem;
      font-size: 1rem;
      text-align: right;
      line-height:38px;
      margin:0;
      margin-right:0.625rem;
      padding:0;
    }
    input {
      font-size: 1rem;
      width: 6.25rem;
    }
    .pullbox-select {
      font-size: 1rem;
    }
  }
  .radio-btn label {
    font-size: 1rem;
    width: 6rem;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 0.25rem;
    text-align: center;
    padding:0;
    margin:0;
    margin-right: 0.5rem;
    line-height:38px;
    height:38px;
  }
  .label-title {
    width: 6rem;
    text-align: right;
    font-size: 1rem;
  }
  .dZZuAe {
    .label-title {
      width: 3rem;
    }
    input {
      width: 5rem !important;
    }
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
  }
  .period div:first-child {
    .label-title {
      width: 6rem;
      font-size: 1rem;
      margin: 0;
      margin-right: 0.625rem;
      line-height:2.4rem;
    }
  }
  .input-time {
    display: flex;
    label {
      width: 5rem;
      font-size: 1rem;
      line-height:2.5rem;
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
  .pullbox .pullbox-label,
  .pullbox-select {
    width: 23rem;
  }
  .checkbox-area label {
    width: 9rem;
    margin:0;
    text-align:left;
  }
  .row {
    margin: 0;
  }
  .register_info {
    width: 24rem;
    label {
      width: 5rem;
      margin-right: 0.625rem;
      margin-bottom: 0;
      padding-top: 0px;
    }
    .input-time {
      label {
        width: 5rem;
      }
      .react-datepicker-wrapper {
        width: 7rem;
      }
    }
    .remove-x-input {
      label {
        width: 5rem;
        line-height:2.5rem;
      }
      input {
        width: calc(100% - 5.625rem);
        height:2.5rem;
      }
    }
    .react-datepicker-popper {
      left: -40px !important;
      .react-datepicker__triangle {
        left: 80px !important;
      }
    }
  }
  .gender {
    font-size: 1rem;
    margin-bottom: 0.625rem;
    margin-top: 0.625rem;
    .gender-label {
      width: 6rem;
      font-size: 1rem;
      margin: 0;
      margin-right: 0.625rem;
      line-height:38px;
      height:38px;
      margin-bottom: auto;
      margin-top: auto;
    }
  }
  .radio-group-btn label {
    width: 1.875rem;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 0.25rem;
    text-align:center;
    margin: 0 ;
    padding: 0;
    margin-right:0.5rem;
    font-size: 1rem;
    line-height:38px;
    height:38px;
  }
  .select-day-btn {
    cursor: pointer;
    border: 1px solid rgb(206, 212, 218);
    padding-left:0.3rem;
    padding-right:0.3rem;
    height: 38px;
    line-height: 38px;
  }
  .selet-day-check label {
    width: 100%;
    margin-top: 0.625rem;
    margin-top:13px;
  }
  .no-dial-day {
    width: 1.875rem;
    margin-right:0.5rem;
    display: inline-block;
  }
  .final-info {
    padding-left: 6.25rem;
    padding-top: 0.3rem;
    font-size: 1rem;
  }
  .time_label {
    padding-top: 0.5rem;
    margin-right: 0.5rem;
    line-height:2.5rem;
  }
  .label-unit {
    text-align: left!important;
  }
  .final-input {
    padding-left: 2rem;
  }
  .end-date{
    .label-title{
      width:0!important;
    }
  }
`;

const PrescriptionBox = styled.div`
  width: 100%;
  font-size: 1rem;
  height: calc(100% - 1.5rem);
  overflow-y: scroll;
  .selected {
    background: lightblue;
  }  
  .pattern-list: hover {
    background: #e2e2e2;
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
    .sortation_name {
      width: 6.25rem;
    }
    .medicine_amount {
      width: 6rem;
    }
    .weekday {
      width: 9rem;
    }
    .limit_date {
      width: 6.25rem;
    }
    .timing_codes {
      width: 14rem;
      text-align: left;
      padding-left: 0.1rem;
    }
    .medicine_name {
      width: calc(100% - 47.75rem);
      text-align: left;
      padding-left: 0.1rem;
    }
  }
`;

const week_days = ["日", "月", "火", "水", "木", "金", "土"];

const sortations = ["内服", "頓服", "外用", "処置", "麻酔", "インスリン"];

class DialPrescript extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let code_master = sessApi.getObjectValue("dial_common_master","code_master");
    var medicineList = sessApi.getObjectValue('dial_common_master', 'medicine_master');
    var timingCodeData = sortTimingCodeMaster(code_master["実施タイミング"]);
    this.state = {
      number: 0,
      dial_prescription_pattern: [],
      patient: "",
      type: 0,
      medicine_code: "",
      medicineList,
      medicine_list_select:makeList_codeName(medicineList, 1),
      medicine_list:makeList_code(medicineList),
      timing_code: 0,
      enable_accounting: 0,
      final_week_days: 0,
      time_limit_from: "",
      time_limit_to: "",
      entry_date: '',
      entry_time: '',
      created_by: 0,
      showHistory: 1,
      patient_id: "",
      checkAnotherDay: "",
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
      dialdays: "",
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      confirm_message: "",
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
      select_dial_days: false,
      isOpenMoveOtherPageConfirm: false,
      confirm_alert_title:'',
      
      isConfirmComplete: false,
      isUpdateScheduleConfirmModal: false,
      isAddConfirmModal: false,
      isReScheduleConfirm: false,
      isClearConfirmModal: false,
      
      timingCodeData,
      timing_codes: makeList_code(timingCodeData),
      timing_options: makeList_codeName(timingCodeData, 1),
      isOpenCalcModal: false,
      calcUnit: "",
      calcTitle: "",
      alert_message: "",
    };
    this.double_click = false;
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
  
  selectPatient =async(patient_info) => {
    this.initRedBorder();
    this.setState({
      patientInfo: patient_info,
      patient_id: patient_info.system_patient_id,
      select_dial_days: false,
      change_flag: false,
    });
    this.setChangeFlag(0);
    await this.clearPattern(patient_info);
    this.getDialDays(patient_info.system_patient_id);
  };
  
  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
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
  
  getPatientPatterns =async(patient_id) => {
    let server_time = await getServerTime();
    let path = "/app/api/v2/dial/pattern/getDialPrescriptionPattern";
    apiClient
      .post(path, {
        params: {
          system_patient_id: patient_id,
          is_enabled: 1,
        },
      })
      .then((res) => {
        if (res) {
          let tmp = res;
          if (this.state.showHistory == 0) {
            let today = formatDateLine(new Date(server_time));
            tmp = this.getPatternListByDateCondition(res,today,"time_limit_from","time_limit_to");
          }
          this.setState({
            dial_prescription_pattern: tmp,
            origin_pattern_list: res,
          });
        }
      })
      .catch(() => {});
  };
  
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
  
  getShowHistory =async(name, value) => {
    if (name === "schedule") {
      if (value == 0) {
        let server_time = await getServerTime();
        let tmp = [];
        let today = formatDateLine(new Date(server_time));
        tmp = this.getPatternListByDateCondition(this.state.dial_prescription_pattern,today,"time_limit_from","time_limit_to");
        this.setState({
          showHistory: value,
          dial_prescription_pattern: tmp,
        });
      } else {
        this.setState({
          showHistory: value,
          dial_prescription_pattern: this.state.origin_pattern_list,
        });
      }
    }
  };
  
  checkDate(from, to) {
    from = new Date(from);
    to = new Date(to);
    if (from.getTime() > to.getTime()) return false;
    return true;
  }
  
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
    if (this.state.instruction_doctor_number === "") {
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }
    // if (this.state.type === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "区分を選択してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.amount == undefined ||
    //   this.state.amount == null ||
    //   !(this.state.amount > 0)
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "数量を0より大きい値で入力してください。"
    //   );
    //   return;
    // }
    // if (this.state.medicine_code === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "薬剤を選択してください。"
    //   );
    //   return;
    // }
    // if (this.state.timing_code === 0) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "タイミングを選択してください。"
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
  
  addPattern = async () => {
    this.confirmCancel();
    await this.openConfirmCompleteModal("保存中");
    let new_pattern = {
      patient_id: this.state.patient_id,
      time_limit_from: this.state.time_limit_from
        ? formatDateLine(this.state.time_limit_from)
        : "",
      time_limit_to: this.state.time_limit_to
        ? formatDateLine(this.state.time_limit_to)
        : "",
      type: this.state.type != null && this.state.type != undefined && this.state.type != "" ? this.state.type : 0,
      medicine_code: this.state.medicine_code,
      amount: this.state.amount,
      timing_code: this.state.timing_code,
      enable_accounting: this.state.enable_accounting,
      weekday: this.state.final_week_days,
      entry_date: this.state.entry_date
        ? formatDateLine(this.state.entry_date)
        : "",
      entry_time: this.state.entry_time
        ? formatTime(this.state.entry_time)
        : "",
      created_by: this.state.created_by,
      instruction_doctor_number: this.state.instruction_doctor_number,
    };
    let path = "/app/api/v2/dial/pattern/registerDialPrescriptionPattern";
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, {
        params: new_pattern,
      })
      .then(async(res) => {
        this.confirmCancel();
        this.setChangeFlag(0);
        var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了##";
        if (message.indexOf('登録') > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        await this.selectPatient(this.state.patientInfo);
      })
      .catch(() => {
        this.confirmCancel();
      })
      .finally(() => {
        this.double_click = false;
      });
    this.confirmCancel();
  };
  
  changeMedicineKind = (value) => {
    this.setChangeFlag(1);
    if (value == null || value == undefined || value == "") value = 0;
    this.setState({ type: value }, () => {
      //------------------------ get medicine list with kind-------------------
      // ------------------------------------------------------------------
    });
  };
  
  getUnit(medicine_code) {
    var all_medicines = this.state.medicineList;
    var medicine = all_medicines.filter((item) => item.code == medicine_code);
    var unit =
      medicine != undefined && medicine != null && medicine.length > 0
        ? medicine[0].unit
        : "";
    return unit;
  }
  
  getMedicineValue = (e) => {
    this.setChangeFlag(1);
    this.setState({
      medicine_code: e.target.id,
      medicine_unit: this.getUnit(e.target.id),
    });
  };
  
  getMedicineAmount = (e) => {
    if (parseFloat(e) < 0) e = 0;
    this.setChangeFlag(1);
    this.setState({ amount: parseFloat(e) });
  };
  
  getTimingList = (e) => {
    this.setChangeFlag(1);
    this.setState({ timing_code: e.target.id });
  };
  
  getCheckedvalue = (name, value) => {
    if (name == "sending") {
      this.setState({ enable_accounting: value });
    }
  };
  
  editpatternConfirm = (item) => {
    if (this.change_flag === 1) {
      this.setState({
        isOpenMoveOtherPageConfirm: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type: "edit_pattern",
        edit_pattern_item: item,
        confirm_alert_title:'入力中',
      });
    } else {
      this.setState({
        edit_pattern_item: item
      }, ()=> {
        this.editPattern();
      })
    }
  }
  editPattern = () => {
    let item = this.state.edit_pattern_item;
    
    this.initRedBorder();
    let week_nums = parseInt(item.weekday);
    let final_week_days = {};
    let another_day = false;
    for (var i = 0; i < 7; i++) {
      var pval = Math.pow(2, i);
      if ((week_nums & pval) > 0) {
        final_week_days[i] = true;
        if (this.state.dialdays[i] === false) {
          another_day = true;
        }
      } else {
        final_week_days[i] = false;
      }
    }
    if (another_day === true) {
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
    
    let _state = {
      selected_row: item.number,
      number: item.number,
      patient_id: item.system_patient_id,
      time_limit_from: new Date(item.time_limit_from),
      time_limit_to: item.time_limit_to != null ? new Date(item.time_limit_to) : null,
      type: parseInt(item.type),
      medicine_code: item.medicine_code,
      amount: item.amount,
      medicine_unit: this.getUnit(item.medicine_code),
      timing_code: item.timing_code,
      enable_accounting: item.enable_accounting,
      checkalldays: final_week_days,
      final_week_days: week_nums,
      created_by: item.created_by,
      final_entry_date: formatDateSlash(
        new Date(item.updated_at.split(" ")[0])
      ),
      final_entry_time: formatTime(
        formatTimePicker(item.updated_at.split(" ")[1])
      ),
      final_entry_name:
        this.state.staff_list_by_number != undefined &&
        this.state.staff_list_by_number != null
          ? item.updated_by !== 0
          ? this.state.staff_list_by_number[item.updated_by]
          : ""
          : "",
      final_doctor_name:
        item.instruction_doctor_number != null
          ? this.state.doctor_list_by_number[item.instruction_doctor_number]
          : "",
    };
    let isAllCheckedOfDialDays = this.checkAllChekedOfDialDays(final_week_days);
    if (isAllCheckedOfDialDays) {
      _state.select_dial_days = true;
    } else {
      _state.select_dial_days = false;
    }
    
    this.setState(_state);
    
    this.ex_pattern = {
      patient_id: this.state.patient_id,
      time_limit_from: item.time_limit_from,
      time_limit_to: item.time_limit_to == null ? "" : item.time_limit_to,
      type: parseInt(item.type),
      medicine_code: item.medicine_code,
      amount: item.amount,
      timing_code: item.timing_code,
      enable_accounting: item.enable_accounting,
      weekday: item.weekday,
    };
    this.ex_time_limit_from = item.time_limit_from;
    this.ex_time_limit_to =
      item.time_limit_to == null ? "" : item.time_limit_to;
    this.ex_weekday = item.weekday;
    this.setChangeFlag(0);
  };
  
  checkEqual(data1, data2) {
    if (JSON.stringify(data1) == JSON.stringify(data2)) return true;
    return false;
  }
  
  confirmReSchedule = () => {
    var time_limit_from = formatJapan(this.state.time_limit_from);
    var time_limit_to = this.state.time_limit_to
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
      time_limit_from +
      " ～ " +
      time_limit_to +
      "\n  （" +
      weekday +
      "）",
    });
  };
  
  reScheduleCancel = () => {
    this.confirmCancel();
    this.updatePattern(false);
  };
  
  updatePattern = async (re_schedule = true) => {
    var time_limit_from, time_limit_to, weekday;
    if (re_schedule) {
      time_limit_from = this.state.time_limit_from
        ? formatDateLine(this.state.time_limit_from)
        : "";
      time_limit_to = this.state.time_limit_to
        ? formatDateLine(this.state.time_limit_to)
        : "";
      weekday = this.state.final_week_days;
    } else {
      time_limit_from = this.ex_time_limit_from;
      time_limit_to = this.ex_time_limit_to;
      weekday = this.ex_weekday;
    }
    let new_pattern = {
      number: this.state.number,
      patient_id: this.state.patient_id,
      time_limit_from: time_limit_from,
      time_limit_to: time_limit_to,
      type: this.state.type,
      medicine_code: this.state.medicine_code,
      amount: this.state.amount,
      timing_code: this.state.timing_code,
      enable_accounting: this.state.enable_accounting,
      weekday: weekday,
      entry_date: this.state.entry_date
        ? formatDateLine(this.state.entry_date)
        : "",
      entry_time: this.state.entry_time
        ? formatTime(this.state.entry_time)
        : "",
      created_by: this.state.created_by,
      sch_all_remove: 1,
      instruction_doctor_number: this.state.instruction_doctor_number,
    };
    
    var updated_pattern_data = {
      patient_id: this.state.patient_id,
      time_limit_from: this.state.time_limit_from
        ? formatDateLine(this.state.time_limit_from)
        : "",
      time_limit_to: this.state.time_limit_to
        ? formatDateLine(this.state.time_limit_to)
        : "",
      type: this.state.type,
      medicine_code: this.state.medicine_code,
      amount: this.state.amount,
      timing_code: this.state.timing_code,
      enable_accounting: this.state.enable_accounting,
      weekday: this.state.final_week_days,
    };
    if (this.checkEqual(this.ex_pattern, updated_pattern_data)) {
      this.confirmCancel();
      window.sessionStorage.setItem(
        "alert_messages",
        "変更されたデータがありません。"
      );
      return;
    }
    
    await this.openConfirmCompleteModal("保存中");
    let path = "/app/api/v2/dial/pattern/registerDialPrescriptionPattern";
    
    await apiClient
      .post(path, {
        params: new_pattern,
      })
      .then(async(res) => {
        this.setChangeFlag(0);
        var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了##";
        if (message.indexOf('登録') > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        await this.selectPatient(this.state.patientInfo);
      })
      .catch(() => {});
    this.confirmCancel();
  };
  
  deletePattern = (type) => {
    this.openConfirmCompleteModal("削除中");
    let path = "/app/api/v2/dial/pattern/deleteDialPrescriptionPattern";
    apiClient
      .post(path, {
        params: {
          number: this.state.number,
          system_patient_id: this.state.patient_id,
          all_remove: type == true ? 1 : 0,
        },
      })
      .then(async(res) => {
        this.setChangeFlag(0);
        window.sessionStorage.setItem("alert_messages", "削除完了##"+res.alert_message);
        await this.selectPatient(this.state.patientInfo);
      })
      .catch(() => {});
    this.confirmCancel();
  };
  
  confirmCancel() {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isConfirmComplete: false,
      isUpdateScheduleConfirmModal: false,
      isAddConfirmModal: false,
      isReScheduleConfirm: false,
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
    if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.EDIT
      ) === false
    ) {
      window.sessionStorage.setItem("alert_messages", "変更権限がありません。");
      return;
    }
    if (this.state.number === 0) {
      window.sessionStorage.setItem(
        "alert_messages",
        "変更するパターンを選択してください。"
      );
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
    // if (this.state.type === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "区分を選択してください。"
    //   );
    //   return;
    // }
    // if (this.state.medicine_code === "") {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "薬剤を選択してください。"
    //   );
    //   return;
    // }
    // if (
    //   this.state.amount == undefined ||
    //   this.state.amount == null ||
    //   !(this.state.amount > 0)
    // ) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "数量を0より大きい値で入力してください。"
    //   );
    //   return;
    // }
    // if (this.state.timing_code === 0) {
    //   window.sessionStorage.setItem(
    //     "alert_messages",
    //     "タイミングを選択してください。"
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
    if (this.state.number === 0) {
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
  
  clearPattern =async(patientInfo) => {
    let server_time = await getServerTime();
    this.confirmCancel();
    this.setChangeFlag(0);
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
        selected_row: "",
        number: 0,
        time_limit_from: "",
        time_limit_to: "",
        type: 0,
        medicine_code: "",
        amount: "",
        timing_code: 0,
        enable_accounting: 0,
        final_week_days: 0,
        entry_date: new Date(server_time),
        entry_time: new Date(server_time),
        created_by: 0,
        checkalldays: {
          0: false,
          1: false,
          2: false,
          3: false,
          4: false,
          5: false,
          6: false,
        },
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
      },async() => {
        await this.getPatientPatterns(patientInfo.system_patient_id);
      }
    );
    this.setDoctors();
    removeRedBorder('medicine_code_id');
    removeRedBorder('amount_id');
    removeRedBorder('timing_code_id');
    removeRedBorder('time_limit_from_id');
    removeRedBorder('time_limit_to_id');
    removeRedBorder('final_week_days_id');
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
      sessApi.setObjectValue(
        "dial_schedule_table",
        "open_tab",
        "dialPrescription"
      );
    this.props.history.replace(url);
  };
  
  openCalc = (type, val) => {
    let _state = {
      calcInit: val != undefined && val != null && val > 0 ? val : 0,
      calcValType: type,
      isOpenCalcModal: true,
    };
    
    let medicine_list = this.state.medicine_list;
    if (
      medicine_list != undefined &&
      medicine_list != null &&
      medicine_list[this.state.medicine_code] != undefined &&
      medicine_list[this.state.medicine_code] != null
    ) {
      _state.calcTitle = medicine_list[this.state.medicine_code];
    }
    if (
      this.state.medicine_unit != null &&
      this.state.medicine_unit != undefined &&
      this.state.medicine_unit != ""
    ) {
      _state.calcUnit = this.state.medicine_unit;
    }
    
    this.setState(_state);
  };
  
  calcCancel = () => {
    this.setState({
      isOpenCalcModal: false,
      calcValType: "",
      calcTitle: "",
      calcUnit: "",
      calcInit: 0,
    });
  };
  
  calcConfirm = (val) => {
    let _state = { isOpenCalcModal: false };
    if (this.state.calcValType == "amount") {
      _state.amount = val;
    }
    _state.calcValType = "";
    _state.calcTitle = "";
    _state.calcUnit = "";
    _state.calcInit = 0;
    this.setState(_state);
  };
  setChangeFlag = (change_flag) => {
    this.change_flag = change_flag;
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "dialprescript", 1);
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
    patternValidate('dial_prescript', this.state, 'background');
    removeRequiredBg("final_week_days_id");
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
  }
  
  initRedBorder = () => {
    removeRedBorder('medicine_code_id');
    removeRedBorder('amount_id');
    removeRedBorder('timing_code_id');
    removeRedBorder('time_limit_from_id');
    removeRedBorder('time_limit_to_id');
    removeRedBorder('final_week_days_id');
    removeRedBorder("entry_time_id");
  }
  
  checkValidation = () => {
    this.initRedBorder();
    
    let error_str_arr = [];
    let validate_data = patternValidate('dial_prescript', this.state);
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
        addRedBorder('time_limit_to_id');
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
    let { dial_prescription_pattern, timing_codes, medicine_list } = this.state;
    let registered_patterns = "";
    let message;
    let can_delete = this.state.number != "";
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
    if (
      dial_prescription_pattern.length > 0 &&
      timing_codes != undefined &&
      timing_codes != null
    ) {
      registered_patterns = this.state.dial_prescription_pattern.map((item) => {
        let weekday = "";
        for (let i = 0; i < 7; i++) {
          weekday += item.weekday & Math.pow(2, i) ? week_days[i] : "";
        }
        return (
          <>
            <div
              className={
                "pattern-list " +
                (this.state.selected_row == item.number ? "selected" : "")
              }
              onClick={this.editpatternConfirm.bind(this, item)}
            >
              <div className={"sortation_name bl-1p bt-1p bb-1p"}>
                {sortations[parseInt(item.type)]}
              </div>
              <div className={"medicine_name bl-1p bt-1p bb-1p"}>
                {medicine_list != undefined &&
                medicine_list != null &&
                medicine_list[item.medicine_code] != undefined &&
                medicine_list[item.medicine_code] != null
                  ? medicine_list[item.medicine_code]
                  : ""}
              </div>
              <div className={"medicine_amount bl-1p bt-1p bb-1p text-right pr-1"}>
                {item.amount}
                {this.getUnit(item.medicine_code)}
              </div>
              <div className={"timing_codes bl-1p bt-1p bb-1p"}>
                {timing_codes != undefined &&
                timing_codes != null &&
                timing_codes[item.timing_code] != undefined &&
                timing_codes[item.timing_code] != null
                  ? timing_codes[item.timing_code]
                  : ""}
              </div>
              <div className={"weekday bl-1p bt-1p bb-1p"}>{weekday}</div>
              <div className={"limit_date bl-1p bt-1p bb-1p"}>
                {formatDateSlash(item.time_limit_from)}
              </div>
              <div className={"limit_date bl-1p bt-1p bb-1p br-1p"}>
                {item.time_limit_to == null
                  ? "～ 無期限"
                  : formatDateSlash(item.time_limit_to)}
              </div>
            </div>
          </>
        );
      });
    } else {
      message = (
        <div className="no-result">
          <span>登録された透析中処方パターンがありません。</span>
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
        {this.state.timingCodeData != undefined && (
          <Card>
            <div className={"flex"}>
              <div className="title">透析中処方パターン</div>
              <div className={"other-pattern"}>
                <Button
                  className="schedule-button"
                  onClick={this.goOtherPattern.bind(
                    this,
                    "/dial/schedule/Schedule"
                  )}
                >
                  スケジュール
                </Button>
                <Button
                  onClick={this.goOtherPattern.bind(
                    this,
                    "/dial/pattern/dialPattern"
                  )}
                >
                  透析
                </Button>
                <Button
                  onClick={this.goOtherPattern.bind(
                    this,
                    "/dial/pattern/anticoagulation"
                  )}
                >
                  抗凝固法
                </Button>
                <Button
                  onClick={this.goOtherPattern.bind(
                    this,
                    "/dial/pattern/Dializer"
                  )}
                >
                  ダイアライザ
                </Button>
                <Button
                  onClick={this.goOtherPattern.bind(
                    this,
                    "/dial/pattern/injection"
                  )}
                >
                  注射
                </Button>
                <Button
                  onClick={this.goOtherPattern.bind(
                    this,
                    "/dial/pattern/prescription"
                  )}
                >
                  処方
                </Button>
                <Button
                  onClick={this.goOtherPattern.bind(
                    this,
                    "/dial/pattern/inspection"
                  )}
                >
                  検査
                </Button>
                <Button className="disable-button">透析中処方</Button>
                <Button
                  onClick={this.goOtherPattern.bind(
                    this,
                    "/dial/pattern/administrativefee"
                  )}
                >
                  管理料
                </Button>
              </div>
            </div>
            <div className="bodywrap">
              <Wrapper>
                <div className="top-table">
                  <div className="dial-list">
                    <div className="table-header">
                      <div className={"sortation_name text-center bl-1p bt-1p bb-1p"}>
                        区分
                      </div>
                      <div className={"medicine_name text-center bl-1p bt-1p bb-1p"}>
                        薬剤
                      </div>
                      <div className={"medicine_amount text-center bl-1p bt-1p bb-1p"}>
                        数量
                      </div>
                      <div className={"timing_codes bl-1p bt-1p bb-1p text-center"}>
                        タイミング
                      </div>
                      <div className={"weekday bl-1p bt-1p bb-1p text-center"}>曜日</div>
                      <div className={"limit_date bl-1p bt-1p bb-1p text-center br-1p"}>期限</div>
                    </div>
                    <PrescriptionBox>
                      {registered_patterns}
                      {message}
                    </PrescriptionBox>
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
                  <div className={"left-area"}>
                    <div className="flex kind">
                      <label className="label" style={{cursor:"text"}}>区分</label>
                      <>
                        {sortations.map((item, key) => {
                          return (
                            <>
                              <RadioButton
                                id={`sortation${key}`}
                                value={key}
                                label={item}
                                name="sortation"
                                getUsage={this.changeMedicineKind.bind(
                                  this,
                                  key
                                )}
                                checked={
                                  this.state.type === key ? true : false
                                }
                              />
                            </>
                          );
                        })}
                      </>
                    </div>
                    <div className="flex">
                      <SelectorWithLabel
                        id="medicine_code_id"
                        options={this.state.medicine_list_select}
                        title="薬剤"
                        getSelect={this.getMedicineValue.bind(this)}
                        departmentEditCode={
                          medicine_list != undefined &&
                          medicine_list != null &&
                          medicine_list[this.state.medicine_code] !=
                          undefined &&
                          medicine_list[this.state.medicine_code] != null
                            ? this.state.medicine_code
                            : ""
                        }
                      />
                      <NumericInputWithUnitLabel
                        id="amount_id"
                        label="数量"
                        value={this.state.amount}
                        getInputText={this.getMedicineAmount.bind(this)}
                        inputmode="numeric"
                        unit={this.state.medicine_unit}
                        onClickEvent={() =>
                          this.openCalc("amount", this.state.amount)
                        }
                        min={0}
                      />
                    </div>
                    
                    <SelectorWithLabel
                      id="timing_code_id"
                      options={this.state.timing_options}
                      title="タイミング"
                      getSelect={this.getTimingList.bind(this)}
                      departmentEditCode={this.state.timing_code}
                    />
                    <div className="flex weekday_area">
                      <div className="gender flex">
                        <label className="gender-label" style={{cursor:"text"}}>曜日</label>
                        <div id="final_week_days_id" className='flex transparent-border'>
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
                              return <div className={"no-dial-day"}></div>;
                            }
                          })}
                          <div className="select-day-btn" onClick={this.selectDialDays}>透析曜日を選択</div>
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
                    {/*<div className="checkbox-area flex">*/}
                    {/*  <div style={{width:"6rem", marginRight:"0.625rem"}}></div>*/}
                    {/*  <Checkbox*/}
                    {/*    label="医事送信を行う"*/}
                    {/*    getRadio={this.getCheckedvalue.bind(this)}*/}
                    {/*    value={this.state.enable_accounting}*/}
                    {/*    name="sending"*/}
                    {/*  />*/}
                    {/*</div>*/}
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
                  <div className="register_info" style={{width:"25.25rem", marginLeft:"auto"}}>
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
                      <div className="input-time">
                        <InputWithLabel
                          className="entry_date"
                          label="入力日"
                          type="date"
                          getInputText={this.getInputdate}
                          diseaseEditData={this.state.entry_date}
                          onBlur = {e => this.resetDatePicker(e)}
                        />
                      </div>
                      <div
                        className="input-time"
                        style={{ marginTop: "8px" }}>
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
                confirmOk={this.clearPattern.bind(
                  this,
                  this.state.patientInfo
                )}
                confirmTitle={this.state.confirm_message}
              />
            )}
            
            {this.state.isAddConfirmModal !== false &&
            this.state.isConfirmComplete === false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.addPattern.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            
            {this.state.isUpdateConfirmModal !== false &&
            this.state.isConfirmComplete === false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmReSchedule.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isReScheduleConfirm !== false && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.reScheduleCancel.bind(this)}
                confirmOk={this.updatePattern.bind(this, true)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.isDeleteConfirmModal !== false &&
            this.state.isConfirmComplete === false && (
              <PatternDeleteConfirmModal
                title={"透析中処方"}
                closeModal={this.confirmCancel.bind(this)}
                confirmOk={this.deletePattern.bind(this)}
              />
            )}
            {this.state.isUpdateScheduleConfirmModal !== false &&
            this.state.isConfirmComplete === false && (
              <PatternUpdateConfirmModal
                title={"透析中処方"}
                closeModal={this.confirmCancel.bind(this)}
                confirmOk={this.updatePatternSchedule.bind(this)}
              />
            )}
            {this.state.isShowDoctorList && (
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
            {this.state.isOpenCalcModal && (
              <CalcDial
                calcConfirm={this.calcConfirm}
                units={this.state.calcUnit}
                calcCancel={this.calcCancel}
                daysSelect={false}
                daysInitial={0}
                daysLabel=""
                daysSuffix=""
                maxAmount={100000}
                calcTitle={this.state.calcTitle}
                calcInitData={this.state.calcInit}
              />
            )}
          </Card>
        )}
      </>
    );
  }
}
DialPrescript.contextType = Context;

DialPrescript.propTypes = {
  history: PropTypes.object,
};

export default DialPrescript;
