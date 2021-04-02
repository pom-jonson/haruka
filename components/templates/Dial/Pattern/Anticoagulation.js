import React, { Component } from "react";
import styled from "styled-components";
import { surface } from "../../../_nano/colors";
import Button from "../../../atoms/Button";
import InputWithLabel from "../../../molecules/InputWithLabel";
import InputWithLabelBorder from "../../../molecules/InputWithLabelBorder";
import { Row } from "react-bootstrap";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import Checkbox from "../../../molecules/Checkbox";
import {
  formatDateLine,
  formatDateSlash,
  formatTime,
  formatTimePicker,
  formatJapan,
} from "~/helpers/date";
import DialSideBar from "../DialSideBar";
import * as apiClient from "~/api/apiClient";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialPatientNav from "../DialPatientNav";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import * as methods from "~/components/templates/Dial/DialMethods";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import PatternDeleteConfirmModal from "~/components/templates/Dial/modals/PatternDeleteConfirmModal";
import PatternUpdateConfirmModal from "~/components/templates/Dial/modals/PatternUpdateConfirmModal";
import CalcDial from "~/components/molecules/CalcDial";
import * as sessApi from "~/helpers/cacheSession-utils";
import { patternValidate } from "~/helpers/validate";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from 'jquery';
import {
  addRequiredBg,
  addRedBorder,
  removeRedBorder,
  removeRequiredBg,
  toHalfWidthOnlyNumber
} from '~/helpers/dialConstants';
import {getServerTime} from "~/helpers/constants";
import AntiHistoryModal from "./Modal/AntiHistoryModal";
import AntiConsentModal from "./Modal/AntiConsentModal";

const Card = styled.div`
  padding: 1.25rem;
  position: fixed;
  top: 70px;
  left: 200px;
  width: calc(100% - 390px);
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
    width: 18.25rem;
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
    height: calc(100% - 6rem);
    overflow-y: auto;
  }
  background-color: ${surface};
  button {
    margin-bottom: 0.625rem;
    margin-left: 0.625rem;
  }
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  height: 100%;
  float: left;
  width: 100%;
  .top-table {
    display: flex;
    height: calc(100% - 26rem);
  }
  .dial-list{
    width: calc(100% - 10rem);
    height: calc(100% - 1rem);
    margin-top: 0.625rem;
    border: solid 1px rgb(206, 212,218);
    overflow-y: hidden;
    overflow-x: hidden;
    .table-header {
      display: flex;
      width: calc(100% - 17px);
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
      .date {
        width: 13rem;
        text-align: center;
      }
      .weekday {
        width: 8.75rem;
        text-align: center;
      }
      .medicine {
        text-align: center;
        width: 10rem;
      }
      .medicine-group {
        display: flex;
        text-align: left;
        word-break: break-all;
        padding-left: 0.1rem;
        .unit-area {
          padding-top: 0.3rem;
          padding-left: 0.3rem;
        }
      }
      .medicine-amount {
        text-align: center;
        width: 6.25rem;
      }
      .pattern-title {
        width: calc(100% - 38rem);
        padding-left: 0.1rem;
        text-align: center;
      }
    }
  }

  .last-history{
    overflow: hidden;
    padding-left: 0.625rem;
    margin-top: -2rem;
    label {
        margin-top: 0.3rem;
        float: right;
        width: 9rem;
        font-size: 1rem;
    }
  }

  .dial-oper {
    align-items: flex-start;
    justify-content: space-between;
    display:flex;
    height: 25rem;
    margin-top: 0.625rem;
    .pullbox-select {
        font-size: 1rem;
    }
    .row {
        margin: 0;
    }    
    .col-md-6 {
        padding-left: 0;
    }
    .col-md-1 {
        max-width: 4rem;
        padding: 0;
    }
    .col-md-2 {
        padding-left: 0;
        max-width: 12%;
    }
    margin-right: 6px;
    .pattern-name {
      .pullbox-title {
        width: 4.5rem;
        line-height: 38px;
        font-size: 1rem;
        margin-right: 0.5rem;
        text-align: right;
      }
      .pullbox-label {
        max-width:calc(100% - 5rem);
      }
    }
    .medicine-area {
        display: flex;
    }
    .medicine-label {
        width: 5rem;
        padding-top: 1rem;
        label {
            width: 100%;
            font-size: 1rem;
        }
    }
    .medicine-name {
      margin-right: 1rem;
      .pullbox {
        width:100%;
        .pullbox-title {
            width: 0;
            margin:0;
        }        
        .pullbox-select {
          font-size: 1rem;            
        }
      }
    }
    .medicine-amount {
        width: 35%;
        .flex div:first-child {
            width: calc(100% - 3rem);
        }
    }
    .flex {
        display: flex;
        flex-wrap: wrap;
        label {
            width: 0;
        }        
    }
    .border-medicine {
        border-radius: 0.25rem;
        border-width: 1px;
        border-style: solid;
        border-color: rgb(206, 212, 218);
        height: 2.4rem;
        margin-top: 0.5rem;
        padding: 0.625rem 0 0 0.3rem;
    }
    .gender {
      font-size: 1rem;
      margin-top: 0.625rem;
      margin-bottom: 0.625rem;
      .gender-label {
        width: 4.5rem;
        text-align: right;
        font-size: 1rem;
        margin-right:0.5rem;
        margin-top: auto;
        margin-bottom: auto;
        line-height:38px;
        height:38px;
    }
  }
.form-control {
    margin-bottom: 0.5rem;
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
        width: 3.5rem;
    }
    .react-datepicker-wrapper {
        width: 7rem;
    }
    .state-date {
      .label-title {
        width:4.5rem;
        margin-right:0.5rem;
        margin-top:0;
        margin-bottom:0;
        line-height:2.4rem;
        font-size:1rem;
        text-align:right;
      }
    }
  }
  .input-data-area {
    .react-datepicker-wrapper {
        width: 7rem;
    }
    .react-datepicker-popper {
      left: -40px !important;
      .react-datepicker__triangle {
        left: 80px !important;
      }
    }
    label {
        text-align: right;
        width: 5rem;
        font-size: 1rem;
        margin-bottom: 0;
        line-height: 2.4rem;
        margin-top: 0;
        margin-right:0.5rem;
    }
    input {
        font-size: 1rem;
    }
    .input-time {
      margin-top: 8px;
      display: flex;
      label {
        margin-right: 0.5rem;
      }
    }
    .input-info {
      input {
        width: 15rem;
      }
      label {
        width: 5rem;
        text-align: right;
      }
    }
  }
  .remove-x-input {
    input {
        width: calc(100% - 5rem);
        height:2.4rem;
    }
  }
  .select-day-btn {
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    height: 38px;
    line-height: 38px;
    letter-spacing: -1px;
    border: 1px solid rgb(206, 212, 218);
    cursor: pointer;
  }
  .selet-day-check label {
    width: 100%;
    font-size: 1rem;
  }
  .check-schedule {
    padding: 0.625rem 0 0 3.5rem;
  }
  .area1 {
    .gender .radio-group-btn label{
        width: 1.875rem;
        font-size: 1rem;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 0.25rem;
        margin-right:0.5rem;
        margin-bottom:0;
        line-height:38px;
        height: 38px;
    }
    .area2{
      .gender-label {
          margin-right:0.5rem;
      }
    }
  }
    .medicine-group {
        display: flex;
        width:100%;
        .unit-area {
            padding-top: 0.3rem;
            padding-left: 0.3rem;
        }
    }
    .medicine-unit {
        width: 10rem;
        div {
          margin:0;
        }
        .label-title {
          width:0;
          margin:0;
        }
        input {
            font-size: 1rem;
            width:100%;
        }
    }
  .no-dial-day {
    width: 1.875rem;
    margin-right:0.5rem;
    display: inline-block;
  }
  .final-info {
    padding-left: 5rem;
    padding-top: 0.3rem
    font-size: 1rem;
  }
  .div_return_fail{
    color: #FF6633;
  }
  .final-input{
      padding-left:2rem;      
  }
  .pullbox-select{
    padding-right:1.5rem;
    width:auto;
    max-width:40rem;
  }
`;

const MethodBox = styled.div`
  width: 100%;
  font-size: 1rem;
  height: calc(100% - 1.5rem);
  overflow-y: scroll;
  .anticoagulation {
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
  }
  .anticoagulation:hover {
    background-color: rgb(246, 252, 253);
    cursor: pointer;
  }
  .row {
    margin: 0;
  }
  .row.selected {
    background: lightblue;
  }
  .row.selected: hover {
    background: lightblue;
  }
  .date {
    width: 6.5rem;
  }
  .weekday {
    width: 8.75rem;
  }
  .medicine {
    width: 10rem;
  }
  .medicine-group {
    display: flex;
    text-align: left;
    word-break: break-all;
    padding-left: 0.1rem;
    .unit-area {
      padding-top: 0.3rem;
      padding-left: 0.3rem;
    }
  }
  .medicine-amount {
    text-align: center;
    width: 6.25rem;
  }
  .pattern-title {
    width: calc(100% - 38rem);
    padding-left: 0.1rem;
  }
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0px;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    left: 1240px;
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
    top: 5rem;
    overflow: hidden;
    -webkit-box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    z-index: 200;
  }
  .context-menu li {
    clear: both;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
    font-size: 1rem;
    font-weight: normal;
    line-height: 1.5rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
        padding: 0.3rem 0.75rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 0.5rem;
  }
`;

const week_days = ["日", "月", "火", "水", "木", "金", "土"];

const ContextMenu = ({visible,x,y,item,parent,}) => {  
  if (visible) {
    return (
      <ContextMenuUl>
      <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
        <li onClick={() =>parent.showHistoryModal(item)}><div>変更履歴</div></li>        
      </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class Anticoagulation extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.state = {
      anticoagulation_pattern: [],
      final_week_days: 0,
      checkSchedule: false,
      checkAnotherDay: false,
      time_limit_from: "",
      time_limit_to: "",
      entry_date: '',
      entry_time: '',
      directer_name: "",
      showHistory: 1,
      patient_id: "",
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
      anticoagulation_master_pattern: [], //マスタデータ
      all_anti_items: [], //マスタデータ
      pattern_id: 0,
      number: 0,
      anti_items: [],
      patient_name: "",

      anticoagulation_code: 0,

      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isOverwriteConfirmModal: false,
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
      isReScheduleConfirm: false,
      isConfirmComplete: false,
      isUpdateScheduleConfirmModal: false,
      error_msg: [],
      isLoaded: false,
      isOpenCalcModal: false,
      isAddConfirmModal: false,
      isOpenMoveOtherPageConfirm: false,
      isClearConfirmModal: false,
      calcUnit: "",
      calcTitle: "",
      alert_message: '',
      confirm_alert_title:'',

      disabled_items:[],

      isOpenHistoryModal:false,
      isOpenConsentModal:false,
    };
    this.double_click = false;
    this.ex_weekday = 0;
    this.ex_time_limit_from = null;
    this.ex_time_limit_to = null;
    this.overwrite_flag = false;
    this.can_open_calc = false;
  }

  async UNSAFE_componentWillMount() {
    await this.getAllMasterAntiPattern();
    this.setState({
      isLoaded: true,
    });
    await this.getAllMasterAnti();
    await this.setDoctors();
    await this.getStaffs();
    if (this.context.selectedDoctor.code > 0) {
      this.setState({
        instruction_doctor_number: parseInt(this.context.selectedDoctor.code),
        directer_name: this.context.selectedDoctor.name,
      });
    }
  }

  async componentDidMount() {
    let server_time = await getServerTime();
    let state_data = {};
    state_data['entry_date'] = new Date(server_time);
    state_data['entry_time'] = new Date(server_time);
    this.setState(state_data);
  }

  getAnticoagulationMethod = (e) => {
    let new_anti_items = [];
    var disabled_items = [];

    if (e.target.id > 0) {
      this.state.anticoagulation_items[e.target.id].map((item) => {
        let new_item = {};
        Object.keys(item).map((idx) => {
          new_item[idx] = item[idx];
        });
        new_item.amount = "";
        new_anti_items.push(new_item);
        disabled_items.push(new_item.item_code);
      });
    }
    this.setChangeFlag(1);
    this.setState({
      anticoagulation_code: e.target.id,
      anti_items: new_anti_items,
      disabled_items,
    });
  };

  getCheckSchedule = (name, value) => {
    if (name === "schedule") this.setState({ checkSchedule: value });
  };

  getCheckAnotherDay = (name, value) => {
    if (name === "schedule") {
      if (value === 0) {
        this.getDialDays(this.state.system_patient_id);
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
      this.setState({ select_dial_days: !this.state.select_dial_days }, () => {
        if (this.state.select_dial_days) {
          var final_week_days = 0;
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

  getShowHistory = async(name, value) => {
    if (name === "schedule") {
      if (value == 0) {
        let server_time = await getServerTime();
        let tmp = [];
        let today = formatDateLine(new Date(server_time));
        tmp = this.getPatternListByDateCondition(this.state.anticoagulation_pattern,today,"time_limit_from","time_limit_to");
        this.setState({
          showHistory: value,
          anticoagulation_pattern: tmp,
        });
      } else {
        this.setState({
          showHistory: value,
          anticoagulation_pattern: this.state.origin_pattern_list,
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

  initRedBorder = () => {
    removeRedBorder('time_limit_from_id');
    removeRedBorder('time_limit_to_id');
    removeRedBorder('anticoagulation_code_id');
    removeRedBorder('anti_item_0');
    removeRedBorder('anti_item_1');
    removeRedBorder('anti_item_2');
    removeRedBorder('final_week_days_id');
    removeRedBorder("entry_time_id");
  }

  selectPatient = async(patient) => {
    let server_time = await getServerTime();
    this.initRedBorder();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
      number: 0,
      patient: patient,
      selected_number: "",
      patient_name: patient.patient_name,
      patient_id: patient.patient_number,
      system_patient_id: patient.system_patient_id,
      anticoagulation_code: 0,
      final_week_days: 0,
      time_limit_from: "",
      time_limit_to: "",
      entry_date: new Date(server_time),
      entry_time: new Date(server_time),
      pattern_id: "",
      anti_items: [],
      checkalldays: {
        0: false,
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      },
      patientInfo: patient,
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
      error_msg: [],
      select_dial_days: false,
      change_flag: false,
    });
    this.setChangeFlag(0);
    var init_call = true;
    this.getDialDays(patient.system_patient_id, init_call);
    await this.getAnticoagulationPatternInfo(patient.system_patient_id);
    this.setDoctors();
    this.overwrite_flag = false;
  };

  async getDialDays(patient_id, init_call = false) {
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
          this.setState(
            {
              checkAnotherDay: 0,
              checkdialdays,
              dialdays,
            },
            () => {
              if (init_call) this.selectDialDays();
            }
          );
        })
        .catch(() => {});
    }
  }

  async getAnticoagulationPatternInfo(system_patient_id) {
    let server_time = await getServerTime();
    let path = "/app/api/v2/dial/pattern/getAnticoagulationPattern";
    const post_data = {
      system_patient_id: system_patient_id,
    };
    this.can_open_calc = false;
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
            anticoagulation_pattern: tmp,
            origin_pattern_list: res,
          });
          this.can_open_calc = true;
        }
      })
      .catch(() => {});
  }

  add = () => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));

    if (this.state.system_patient_id == null) {
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
      window.sessionStorage.setItem(
        "alert_messages",
        "登録権限がありません。"
      );
      return;
    }
    if (this.state.instruction_doctor_number === "") {
      this.showDoctorList();
      return;
    }
    if (
      authInfo.doctor_number > 0 &&
      this.state.directer_name !== authInfo.name
    ) {
      window.sessionStorage.setItem(
        "alert_messages",
        "指示者を正確に選択してください。"
      );
      return;
    }
    let error_str_array = this.checkValidation();    

    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
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
      system_patient_id: this.state.system_patient_id,
      time_limit_from: this.state.time_limit_from
        ? formatDateLine(this.state.time_limit_from)
        : "",
      time_limit_to: this.state.time_limit_to
        ? formatDateLine(this.state.time_limit_to)
        : "",
      checkSchedule: this.state.checkSchedule,
      anticoagulation_code: this.state.anticoagulation_code,
      pattern_title:
        this.state.code_antianticoagulation_master_pattern != undefined &&
        this.state.code_antianticoagulation_master_pattern != null &&
        this.state.code_antianticoagulation_master_pattern[this.state.anticoagulation_code] != undefined 
          ? this.state.code_antianticoagulation_master_pattern[this.state.anticoagulation_code].name : "",
      pattern: this.state.anti_items,
      weekday: this.state.final_week_days,
      entry_date: this.state.entry_date ? formatDateLine(this.state.entry_date): "",
      entry_time: this.state.entry_time? formatTime(this.state.entry_time): "",
      instruction_doctor_number: this.state.instruction_doctor_number,

      overwrite: this.overwrite_flag,
    };

    let path = "/app/api/v2/dial/pattern/registerAnticoagulationPattern";
    this.openConfirmCompleteModal("保存中");
    if (this.double_click == true) return;
    this.double_click = true;
    apiClient.post(path, {params: new_pattern,})
      .then(async(res) => {
        this.setState({ isConfirmComplete: false });
        if (res.duplicate == true) {
          this.setState({
            isOverwriteConfirmModal: true,
            confirm_message: res.alert_message,
          });
          return;
        }
        this.setChangeFlag(0);
        var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了##";
        if (message.indexOf('登録') > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        this.overwrite_flag = false;
        await this.selectPatient(this.state.patient);
      })
      .catch(() => {
        this.setState({ isConfirmComplete: false });
        this.overwrite_flag = false;
      })
      .finally(() => {
        this.double_click = false;
      });
  };

  addDay = (value) => {
    let checkalldays = this.state.checkalldays;
    checkalldays[value] = !checkalldays[value];
    var final_week_days = this.state.final_week_days;
    var pval = Math.pow(2, value);
    final_week_days =
      (final_week_days >> value) & (pval > 0)
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

  getAntiItem = (index, e) => {
    var temp = this.state.anti_items;
    var disabled_items = [];    
    if (e.target.id > 0) {
      let anti_item = this.state.code_all_anti_items[e.target.id];
      temp[index] = anti_item;
      temp[index].amount = "";
    } else {
      temp[index] = null;
    }
    let error_msg = this.state.error_msg;
    error_msg[index] = "";

    if (temp.length > 0){
      temp.map(item => {
        if (item != null){
          disabled_items.push(item.code);
        }
      })
    }
    
    this.setState({
      error_msg,
      anti_items: temp,
      disabled_items
    });
    this.setChangeFlag(1);
  };

  getAmount = (index, e) => {
    var temp = this.state.anti_items;
    if (e.target.value != "") {
      temp[index].amount = (e.target.value);
    } else {
      temp[index].amount = '';
    }    
    this.setState({anti_items:temp})
  }

  getUnit = (index, e) => {
    var temp = this.state.anti_items;
    let error_msg = this.state.error_msg;
    if (temp[index].maxlength != 0 && e.target.value.toString().length > temp[index].maxlength) {
      let msg = temp[index].name + "は " + temp[index].maxlength + "文字以内で入力してください";
      error_msg[index] = msg;
      this.setState({ error_msg });
      return;
    }    
    if (e.target.value != "") {
      temp[index].amount = e.target.value;
    } else {
      temp[index].amount = '';
    }
    if (error_msg[index] != undefined && error_msg[index] != null && error_msg[index] != "") {
      error_msg[index] = "";
    }
    this.setState({
      anti_items: temp,
      error_msg,
    });
    this.setChangeFlag(1);
  };

  clear = () => {
    if (!this.change_flag) return;
    if (this.state.system_patient_id == null) {
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
    if (this.state.system_patient_id !== "") {
      this.setChangeFlag(0);
      await this.selectPatient(this.state.patient);
    }
  };

  checkEqual(data1, data2) {
    if (JSON.stringify(data1) == JSON.stringify(data2)) return true;
    return false;
  }

  updatePattern = async (re_schedule = true) => {
    this.confirmCancel();
    if (this.state.system_patient_id != null) {
      if (this.state.code_antianticoagulation_master_pattern[this.state.anticoagulation_code] != undefined) {
        var time_limit_from, time_limit_to, weekday;
        if (re_schedule) {
          time_limit_from = this.state.time_limit_from? formatDateLine(this.state.time_limit_from): "";
          time_limit_to = this.state.time_limit_to? formatDateLine(this.state.time_limit_to): "";
          weekday = this.state.final_week_days;
        } else {
          time_limit_from = formatDateLine(this.ex_time_limit_from);
          time_limit_to = formatDateLine(this.ex_time_limit_to);
          weekday = this.ex_weekday;
        }
        let new_pattern = {
          system_patient_id: this.state.system_patient_id,
          number: this.state.number,
          time_limit_from,
          time_limit_to,
          checkSchedule: this.state.checkSchedule,
          anticoagulation_code: this.state.anticoagulation_code,
          pattern_title: this.state.code_antianticoagulation_master_pattern[
            this.state.anticoagulation_code
          ].name,
          // pattern_title:this.state.pattern_title,
          pattern: this.state.anti_items,
          weekday,
          entry_date: this.state.entry_date
            ? formatDateLine(this.state.entry_date)
            : "",
          entry_time: this.state.entry_time
            ? formatTime(this.state.entry_time)
            : "",
          instruction_doctor_number: this.state.instruction_doctor_number,
          sch_all_remove: 1,

          overwrite: this.overwrite_flag,
        };

        let path = "/app/api/v2/dial/pattern/registerAnticoagulationPattern";
        this.openConfirmCompleteModal("保存中");
        await apiClient.post(path, {params: new_pattern})
          .then(async(res) => {
            this.setState({ isConfirmComplete: false });
            if (res.duplicate == true) {
              this.setState({
                isOverwriteConfirmModal: true,
                confirm_message: res.alert_message,
              });
              return;
            }
            this.setChangeFlag(0);
            var title = '';
            var message = res.alert_message;
            if (message.indexOf('変更') > -1) title = "変更完了##";
            if (message.indexOf('登録') > -1) title = "登録完了##";
            window.sessionStorage.setItem("alert_messages", title + res.alert_message);
            this.overwrite_flag = false;
            await this.selectPatient(this.state.patient);
          })
          .catch(() => {
            this.setState({ isConfirmComplete: false });
            this.overwrite_flag = false;
          });
      } else {
        window.sessionStorage.setItem("alert_messages","抗凝固剤を選択してください.");
      }
    } else {
      window.sessionStorage.setItem("alert_messages", "患者様を選択してください.");
    }    
  };
  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
  };
  deletePattern = async (type) => {
    if (this.state.number != 0) {
      let delete_pattern = {
        number: this.state.number,
        system_patient_id: this.state.system_patient_id,
        all_remove: type == true ? 1 : 0,
      };
      this.setChangeFlag(0);
      await this.deleteAnticoagulation(delete_pattern);
      await this.selectPatient(this.state.patient);
    }
    this.confirmCancel();
  };
  async deleteAnticoagulation(data) {
    let path = "/app/api/v2/dial/pattern/deleteAnticoagulationPattern";

    await apiClient
      .post(path, {
        params: data,
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", "削除完了##" +  res.alert_message);
      })
      .catch(() => {
        this.overwrite_flag = false;
      });
  }

  handleClick = (e, item) => {
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
      document
          .getElementById("pattern-box")
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu: { visible: false }
            });
            document
              .getElementById("pattern-box")
              .removeEventListener(`scroll`, onScrollOutside);
          });  
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX -200,
          y: e.clientY + window.pageYOffset - 70,
          item:item
        },
      });
    }
  }

  showHistoryModal = (item) => {        
    this.setState({
      isOpenHistoryModal:true,
      selected_history_item:item
    })
  }

  openConsentModal = () => {    
    this.setState({
      isOpenConsentModal:true
    })
  }

  editpatternConfirm = (item) => {
    if (this.change_flag === 1) {
      this.setState({
        isOpenMoveOtherPageConfirm: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_type: "edit_pattern",
        cur_anticoagulation_pattern: item,        
        confirm_alert_title:'入力中',
      });
    } else {
      this.setState({
        cur_anticoagulation_pattern: item,
      }, ()=> {
        this.editPattern();
      })
    }
  }
  editPattern = () => {    
    this.initRedBorder();
    let cur_anticoagulation_pattern = this.state.cur_anticoagulation_pattern;
    let final_week_days = {};
    let another_day = false;
    var weekday = parseInt(cur_anticoagulation_pattern.weekday);
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
      this.getDialDays(this.state.system_patient_id);
    }
    let create_at = cur_anticoagulation_pattern.updated_at;
    let input_day = create_at.split(" ");

    let anti_items_temp = [];
    var disabled_items = [];
    if (cur_anticoagulation_pattern.pattern != undefined) {
      cur_anticoagulation_pattern.pattern.map((item) => {
        let new_item = {};
        Object.keys(item).map((idx) => {
          new_item[idx] = item[idx];
        });
        anti_items_temp.push(new_item);
        disabled_items.push(new_item.item_code);
      });
    }
    this.ex_time_limit_from =
      cur_anticoagulation_pattern.time_limit_from !== undefined
        ? new Date(cur_anticoagulation_pattern.time_limit_from)
        : "";
    this.ex_time_limit_to =
      cur_anticoagulation_pattern.time_limit_to !== undefined &&
      cur_anticoagulation_pattern.time_limit_to !== null
        ? new Date(cur_anticoagulation_pattern.time_limit_to)
        : "";
    this.ex_weekday = weekday;

    this.ex_pattern = {
      system_patient_id: this.state.system_patient_id,
      time_limit_from:
        cur_anticoagulation_pattern.time_limit_from !== undefined
          ? cur_anticoagulation_pattern.time_limit_from
          : "",
      time_limit_to:
        cur_anticoagulation_pattern.time_limit_to !== undefined &&
        cur_anticoagulation_pattern.time_limit_to !== null
          ? cur_anticoagulation_pattern.time_limit_to
          : "",
      anticoagulation_code:
        cur_anticoagulation_pattern.anticoagulation_code != undefined
          ? cur_anticoagulation_pattern.anticoagulation_code
          : 0,
      pattern: anti_items_temp,
      weekday,
    };

    let _state = {      
      number: cur_anticoagulation_pattern.number,
      selected_number:cur_anticoagulation_pattern.number,
      final_week_days: weekday,
      time_limit_from:
        cur_anticoagulation_pattern.time_limit_from !== undefined
          ? new Date(cur_anticoagulation_pattern.time_limit_from)
          : "",
      time_limit_to:
        cur_anticoagulation_pattern.time_limit_to !== undefined &&
        cur_anticoagulation_pattern.time_limit_to !== null
          ? new Date(cur_anticoagulation_pattern.time_limit_to)
          : "",
      anticoagulation_code:
        cur_anticoagulation_pattern.anticoagulation_code != undefined
          ? cur_anticoagulation_pattern.anticoagulation_code
          : 0,
      anti_items: anti_items_temp,
      disabled_items,
      checkalldays: final_week_days,
      final_entry_date: formatDateSlash(new Date(input_day[0])),
      final_entry_time: formatTime(formatTimePicker(input_day[1])),
      final_entry_name:
        this.state.staff_list_by_number != undefined &&
        this.state.staff_list_by_number != null
          ? cur_anticoagulation_pattern.updated_by !== 0
            ? this.state.staff_list_by_number[
                cur_anticoagulation_pattern.updated_by
              ]
            : ""
          : "",
      final_doctor_name:
        cur_anticoagulation_pattern.instruction_doctor_number != null
          ? this.state.doctor_list_by_number[
              cur_anticoagulation_pattern.instruction_doctor_number
            ]
          : "",
    };

    let isAllCheckedOfDialDays = this.checkAllChekedOfDialDays(final_week_days);
    if (isAllCheckedOfDialDays) {
      _state.select_dial_days = true;
    } else {
      _state.select_dial_days = false;
    }

    this.setState(_state);
    this.setChangeFlag(0);
  };

  confirmCancel = () => {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isReScheduleConfirm: false,
      isUpdateScheduleConfirmModal: false,
      isAddConfirmModal: false,
      isOverwriteConfirmModal: false,
      isClearConfirmModal: false,
      isOpenMoveOtherPageConfirm: false,
      confirm_message: "",
      confirm_alert_title:'',

      isOpenHistoryModal:false,
      isOpenConsentModal:false,
    });
  }

  overwrite=async()=> {
    this.confirmCancel();
    this.overwrite_flag = true;
    if (this.state.number > 0) {
      await this.updatePattern();
    } else {
      await this.addPattern();
    }
  }

  checkDate(from, to) {
    from = new Date(from);
    to = new Date(to);
    if (from.getTime() > to.getTime()) return false;
    return true;
  }
  openScheduleConfirmModal = () => {
    this.setState({ isUpdateScheduleConfirmModal: true });
  };

  updatePatternSchedule =async(type) => {
    await this.updatePattern(true, type);
  };
  checkValidation = () => {    
    this.initRedBorder();

    let error_str_arr = [];
    let first_tag_id = '';
    let validate_data = patternValidate('dial_anticoagulation_pattern', this.state);
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr;
    }
    if (validate_data.first_tag_id != '') {
      first_tag_id = validate_data.first_tag_id;
    }
    this.state.anti_items.map((item,index) => {
      if (item != null && !(parseInt(item.amount) >= 0)) {
        if (
          item.amount == undefined ||
          parseInt(item.amount) < 1 ||
          item.amount == ''
        ) {
          error_str_arr.push(item.name + 'を入力してください。');
          addRedBorder('anti_item_' + index);
          if (first_tag_id == '') first_tag_id = 'anti_item_' + index;
        }
      }
    });
    if(this.state.entry_time == "" || this.state.entry_time == null){      
      error_str_arr.push("入力時間を選択してください。");
      if (first_tag_id == '') first_tag_id = "entry_time_id";
      addRedBorder("entry_time_id");
    }
    this.setState({ first_tag_id });
    if (
      this.state.time_limit_to != undefined &&
      this.state.time_limit_to != null &&
      this.state.time_limit_to != ''
    ) {
      if (!this.checkDate(this.state.time_limit_from, this.state.time_limit_to)) {
        error_str_arr.push('終了日は開始日以降の日付を選択してください。');
        addRedBorder('time_limit_to_id');
      }
    }
    if (error_str_arr.length > 0) {
      let weekday_error = error_str_arr.indexOf('曜日を選択してください。');
      if (weekday_error > -1) {
        error_str_arr.splice(weekday_error, 1);
        error_str_arr.push('曜日を選択してください。');
      }
      let date_error = error_str_arr.indexOf('期限を入力してください。');
      if (date_error > -1) {
        error_str_arr.splice(date_error, 1);
        error_str_arr.push('期限を入力してください。');
      }
    }
    return error_str_arr;
  }


  update = () => {
    if (this.state.system_patient_id == null) {
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
      window.sessionStorage.setItem(
        "alert_messages",
        "変更するパターンを選択してください。"
      );
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
      this.setState({
        isShowDoctorList: true,
      });
      return;
    }
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
    let flag = true;
    if (this.state.system_patient_id == null) {
      flag = false;
    } else if (this.state.number === 0) {
      flag = false;
    } else if (
      this.context.$canDoAction(
        this.context.FEATURES.DIAL_SYSTEM,
        this.context.AUTHS.DELETE
      ) === false
    ) {
      flag = false;
    }
    if (flag) {
      this.setState({
        isDeleteConfirmModal: true,
        // confirm_message: "パターン情報を削除しますか?",
      });
    }
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
        "anticogulation"
      );
    this.props.history.replace(url);
  };

  confirmReSchedule = () => {
    var start_date = formatJapan(this.state.time_limit_from);
    var end_date = this.state.time_limit_to
      ? formatJapan(this.state.time_limit_to)
      : "無期限";
    this.setState({
      isReScheduleConfirm: true,
      confirm_message:
        "対象日全てに変更を反映しますか" +
        "\n" +
        "期限 " +
        start_date +
        " ～ " +
        end_date,
    });
  };

  openCalc = (item) => {
    if (!this.can_open_calc) return;
    this.setState({
      calcInit:
        item.amount != null && item.amount != undefined ? item.amount : 0,
      calcValType: item.number,
      calcUnit: item.unit,
      calcTitle: item.name,
      calcDigits: item.maxlength,
      isOpenCalcModal: true,
    });
  };

  calcCancel = () => {
    this.setState({
      isOpenCalcModal: false,
      calcValType: "",
      calcUnit: "",
      calcTitle: "",
      calcInit: 0,
    });
  };

  calcConfirm = (val) => {    
    this.setChangeFlag(1);
    let _state = { isOpenCalcModal: false };

    let anti_items = this.state.anti_items;
    if (anti_items != null && anti_items != undefined && anti_items.length > 0) {
      anti_items.map((item) => {
        if (item != null && item.number == this.state.calcValType) {
          item.amount = val;
        }
      });
    }

    _state.calcValType = "";
    _state.calcInit = 0;
    _state.calcTitle = "";
    _state.calcUnit = "";
    _state.anti_items = anti_items;

    this.setState(_state);
  };
  setChangeFlag = (change_flag) => {
    this.change_flag = change_flag;
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "anti", 1);
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

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    patternValidate('dial_anticoagulation_pattern', this.state, 'background');
    removeRequiredBg("final_week_days_id");
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
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

  extractDisabled = (anti_item) => {
    var disabled_items = this.state.disabled_items;
    if (disabled_items == undefined || disabled_items.length==0) return '';
    var result_str = '';
    disabled_items.map(item => {
      if (anti_item != null && item != anti_item.code) result_str += item + ':';
      if (anti_item == null) result_str += item + ':';
    })
    if (result_str != '') result_str = result_str.substr(0, result_str.length-1);
    return result_str;
  }

  render() {    
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let conf_data = JSON.parse(window.sessionStorage.getItem("init_status")).conf_data;  
    let anticoagulation_pattern = [];
    let message;
    let anti_items = [];
    let can_delete = this.state.number != 0;
    anti_items = this.state.anti_items !== undefined && this.state.anti_items;
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

    if (this.state.anticoagulation_pattern.length > 0) {
      anticoagulation_pattern = this.state.anticoagulation_pattern.map(item => {
          let weekday = "";
          for (let i = 0; i < 7; i++) {
            weekday += item.weekday & Math.pow(2, i) ? week_days[i] : "";
          }
          return (
            <>
              <div className="anticoagulation">
                <Row className={this.state.selected_number == item.number ? "selected" : ""}
                  onClick={() => this.editpatternConfirm(item)} onContextMenu={e => this.handleClick(e, item)}
                >
                  <div className={"pattern-title bl-1p bt-1p bb-1p"}>
                    {item.pattern_title}
                  </div>
                  <div className={"medicine bl-1p bt-1p bb-1p"}>
                    {item.pattern !== undefined && item.pattern.length > 0 && item.pattern.map((item, index) => {
                      return (
                        <>
                          <div className={`medicine-group`}>
                            <div className="" key={index}>
                              {item.name}
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                  <div className={"medicine-amount bl-1p bt-1p bb-1p"}>
                    {item.pattern !== undefined && item.pattern.length > 0 && item.pattern.map((item, index) => {
                        return (
                          <>
                            <div className={`medicine-group`}>
                              <div className="text-right w-100 pr-1" key={index}>
                                {item.amount}
                                {item.unit}
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </div>
                  <div className={"weekday bl-1p bt-1p bb-1p"}>{weekday}</div>
                  <div className={"date bl-1p bt-1p bb-1p"}>
                    {item.time_limit_from !== undefined && item.time_limit_from !== "" ? formatDateSlash(item.time_limit_from): ""}
                  </div>
                  <div className={"date bl-1p bt-1p bb-1p br-1p"}>
                    {item.time_limit_to === undefined || item.time_limit_to === "" || item.time_limit_to == null ? "～ 無期限": formatDateSlash(item.time_limit_to)}
                  </div>
                </Row>
              </div>
            </>
          );
        }
      );
    } else {
      message = (
        <div className="no-result">
          <span>登録された抗凝固法パターンがありません。</span>
        </div>
      );
    }
    
    return (
      <>
        <DialSideBar
          onGoto={this.selectPatient}
          history = {this.props.history}          
        />
        <DialPatientNav
          patientInfo={this.state.patientInfo}
          history = {this.props.history}
        />
        {this.state.isLoaded ? (
          <Card>
            <div className={"flex"}>
              <div className="title">抗凝固法パターン</div>
              <div className={"other-pattern"}>
                <Button className="schedule-button" onClick={this.goOtherPattern.bind(this,"/dial/schedule/Schedule")}>スケジュール</Button>
                <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/dialPattern")}>透析</Button>
                <Button className="disable-button">抗凝固法</Button>
                <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/Dializer")}>ダイアライザ</Button>
                <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/injection")}>注射</Button>
                <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/prescription")}>処方</Button>
                <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/inspection")}>検査</Button>
                <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/dialPrescript")}>透析中処方</Button>
                <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/administrativefee")}>管理料</Button>
              </div>
            </div>
            <div className="bodywrap">
              <Wrapper>
                <div className="top-table flex">
                  <div className="dial-list">
                    <div className="table-header">
                      <div className={"pattern-title bl-1p bt-1p bb-1p"}>抗凝固法</div>
                      <div className={"medicine bl-1p bt-1p bb-1p"}>抗凝固剤</div>
                      <div className={"medicine-amount bl-1p bt-1p bb-1p"}>数量</div>
                      <div className={"weekday bl-1p bt-1p bb-1p"}>曜日</div>
                      <div className={"date bl-1p bt-1p bb-1p br-1p"}>期限</div>
                    </div>
                    <MethodBox id = 'pattern-box'>
                      {anticoagulation_pattern}
                      {message}
                    </MethodBox>
                  </div>
                  {conf_data.instruction_doctor_consent_is_enabled == "ON" && authInfo.doctor_number > 0 && (
                    <div style={{marginTop:'0.6rem'}}>
                      <Button type='mono' className='cancel-btn' onClick={this.openConsentModal.bind(this)}>未承認一覧</Button>
                    </div>
                  )}
                </div>
                <div className="last-history">                  
                  <Checkbox
                    label="期限切れも表示"
                    getRadio={this.getShowHistory.bind(this)}
                    value={this.state.showHistory}
                    isDisabled = {this.state.system_patient_id > 0 ? false: true}
                    name="schedule"
                  />
                </div>
                <div className="dial-oper">
                  <div className={``} style={{ width: "70%" }}>
                    <div className='pattern-name'>
                      <SelectorWithLabel
                        options={this.state.anticoagulation_master_pattern_list_select}
                        title="抗凝固剤"
                        getSelect={this.getAnticoagulationMethod}
                        departmentEditCode={this.state.anticoagulation_code}
                        id="anticoagulation_code_id"
                      />
                    </div>
                    <div className="medicine-area">
                      <div className="medicine-label">
                        <label></label>
                      </div>
                      <div style={{width: "calc(100% - 5rem)"}}>
                        {anti_items.length > 0 &&
                          anti_items.map((item, index) => {
                            var disabled_string = this.extractDisabled(item);
                            return (
                              <>
                                <div className={`medicine-group`}>
                                  <div className="medicine-name" key={index}>
                                    <SelectorWithLabel
                                      options={this.state.all_anti_items_list_select}
                                      title=""
                                      getSelect={this.getAntiItem.bind(this,index)}
                                      departmentEditCode={item != null ? item.item_code : 0}
                                      disabledValue = {disabled_string}
                                    />
                                  </div>
                                  <div className="medicine-unit">
                                    <InputWithLabelBorder
                                      label=""
                                      type="number"
                                      getInputText={this.getUnit.bind(this,index)}
                                      onBlur = {this.getAmount.bind(this, index)}
                                      diseaseEditData={item != null ? item.amount : ""}
                                      onClick={() => this.openCalc(item)}
                                      id={'anti_item_'+index}
                                    />
                                  </div>
                                  <div className="unit-area">
                                    {item != null && item.unit !== undefined
                                      ? item.unit
                                      : ""}
                                  </div>
                                </div>
                                {/* {this.state.error_msg[index] && (
                                  <div className="warning div_return_fail">
                                    <div className="div_notify" role="alert">
                                      {this.state.error_msg[index]}
                                    </div>
                                  </div>
                                )} */}
                              </>
                            );
                          })}
                      </div>
                    </div>
                    <div>
                      <div className="area1">
                        <div className="gender flex">
                          <div className="area2 flex">
                            <label className="gender-label" style={{cursor:"text"}}>曜日</label>
                            <div id='final_week_days_id' className='flex transparent-border'>
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
                              <div className="select-day-btn" onClick={this.selectDialDays}>透析曜日を選択</div>
                            </div>
                          </div>                          
                        </div>
                        <div className="flex">
                          <div style={{ width: "5.1rem" }}></div>
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
                          <div className="state-date">
                            <InputWithLabelBorder
                              label="期限"
                              type="date"
                              getInputText={this.getStartdate}
                              diseaseEditData={this.state.time_limit_from}                              
                              id='time_limit_from_id'
                              onBlur = {e => this.resetDatePicker(e)}
                            />
                          </div>
                          <div className="pd-15">～</div>
                          <InputWithLabelBorder
                            label=""
                            type="date"
                            getInputText={this.getEnddate}
                            id='time_limit_to_id'
                            diseaseEditData={this.state.time_limit_to}
                            onBlur = {e => this.resetDatePicker(e)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`ml-3`} style={{width:"25rem", marginLeft:"auto"}}>
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
                    <div className="input-data-area flex">
                      <InputWithLabelBorder
                        label="入力日"
                        type="date"
                        getInputText={this.getInputdate}
                        diseaseEditData={this.state.entry_date}
                        onBlur = {e => this.resetDatePicker(e)}
                      />
                      <div className="input-time">
                        <label style={{cursor:"text"}}>入力時間</label>
                        <DatePicker
                          selected={this.state.entry_time}
                          onChange={this.getInputTime}
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
                    <div className="input-data-area input-info remove-x-input">
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
                  confirmOk={this.clearPattern.bind(this)}
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
            {this.state.isDeleteConfirmModal !== false &&
              this.state.isConfirmComplete === false && (
                <PatternDeleteConfirmModal
                  title={"抗凝固法"}
                  closeModal={this.confirmCancel.bind(this)}
                  confirmOk={this.deletePattern.bind(this)}
                />
              )}
            {this.state.isUpdateScheduleConfirmModal !== false &&
              this.state.isConfirmComplete === false && (
                <PatternUpdateConfirmModal
                  title={"抗凝固法"}
                  closeModal={this.confirmCancel.bind(this)}
                  confirmOk={this.updatePatternSchedule.bind(this)}
                />
              )}
            {this.state.isReScheduleConfirm !== false &&
              this.state.isConfirmComplete === false && (
                <SystemConfirmJapanModal
                  hideConfirm={this.confirmCancel.bind(this)}
                  confirmCancel={this.updatePattern.bind(this, false)}
                  confirmOk={this.updatePattern.bind(this, true)}
                  confirmTitle={this.state.confirm_message}
                />
              )}
            {this.state.isOverwriteConfirmModal == true && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this, false)}
                confirmOk={this.overwrite.bind(this, true)}
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
            {this.state.isConfirmComplete !== false && (
              <CompleteStatusModal message={this.state.complete_message} />
            )}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}              
            />
            {this.state.isOpenHistoryModal && (
              <AntiHistoryModal
                closeModal = {this.confirmCancel}
                selected_history_item = {this.state.selected_history_item}
              />
            )}
            {this.state.isOpenConsentModal && (
              <AntiConsentModal
                closeModal = {this.confirmCancel}
                patientInfo = {this.state.patientInfo}
              />
            )}
            {this.state.isOpenCalcModal ? (
              <CalcDial
                calcConfirm={this.calcConfirm}
                units={this.state.calcUnit}
                calcCancel={this.calcCancel}
                daysSelect={false}
                numberDigits={this.state.calcDigits}
                daysInitial={0.0}
                daysLabel=""
                daysSuffix=""
                maxAmount={100000}
                calcTitle={this.state.calcTitle}
                calcInitData={this.state.calcInit}
              />
            ) : (
              ""
            )}
            {this.state.alert_message != "" && (
              <ValidateAlertModal
                handleOk={this.closeAlertModal}
                alert_meassage={this.state.alert_message}
              />
            )}
          </Card>
        ) : (
          <></>
        )}
      </>
    );
  }
}
Anticoagulation.contextType = Context;

Anticoagulation.propTypes = {
  history: PropTypes.object,
};

export default Anticoagulation;
