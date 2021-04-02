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
import {
  formatDateLine,
  formatDateSlash,
  formatTime,
  formatTimePicker,
  formatJapan,
} from "~/helpers/date";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import DialSideBar from "../DialSideBar";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import * as apiClient from "~/api/apiClient";
registerLocale("ja", ja);
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import DialPatientNav from "../DialPatientNav";
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import Context from "~/helpers/configureStore";
import PropTypes from "prop-types";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import PatternDeleteConfirmModal from "~/components/templates/Dial/modals/PatternDeleteConfirmModal";
import PatternUpdateConfirmModal from "~/components/templates/Dial/modals/PatternUpdateConfirmModal";
import * as sessApi from "~/helpers/cacheSession-utils";
import { patternValidate } from '~/helpers/validate'
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal'
import $ from 'jquery'
import {
  addRequiredBg,
  addRedBorder,
  removeRedBorder,
  removeRequiredBg,
  toHalfWidthOnlyNumber
} from '~/helpers/dialConstants'
import {getServerTime} from "~/helpers/constants";
import DializerHistoryModal from "./Modal/DializerHistoryModal";
import DializerConsentModal from "./Modal/DializerConsentModal";

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
    font-size: 1.9rem;
    letter-spacing: -2px;
    padding-left: 0.5rem;
    border-left: solid 0.3rem #69c8e1;
    width: 21.25rem;
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
    height: calc(100% - 6rem);
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
  .flex {
    display: flex;
    flex-wrap: wrap;
    .padding {
      padding: 10rem 0px 0px 0.625rem;
    }
  }
  .label {
    padding-top: 0.5rem;
    margin-right: 0.625rem;
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
      .dialyzer-code {
        width: calc(100% - 21.5rem - 17px);
        text-align: center;
        padding-left: 0.1rem;
      }
      .pattern-week-day {
        width: 9rem;
        text-align: center;
      }
      .pattern-time_limit_from {
        text-align: center;
        width: 12.5rem;
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
    align-items: flex-start;
    justify-content: space-between;
    display:flex;
    margin-top: 0.625rem;
    .pattern-data {
      .pullbox-title {
        width:4.5rem;
        margin-right:0.5rem;
        line-height:38px;
        margin-bottom:0;
      }
      .pullbox-label {
        margin-bottom:0;
      }
    }
    .selet-day-check {
      label {
        width:11rem;
        margin: 0;
        text-align: left;
        margin-top:4px;
      }
    }
    label {
      width: 25rem;
      font-size: 1rem;
      text-align: right;
    }
    input {
      font-size: 1rem;
      width: 6.25rem;
    }
    .pullbox-select {
      font-size: 1rem;
      width: 25rem;
    }
  }
  .radio-btn label {
    font-size: 0.75rem;
    width: 4.7rem;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 0.25rem;
    padding: 0.25rem 0.3rem;
    text-align: center;
    margin-right: 0.3rem;
  }
  .label-title {
    width: 5rem;
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
      width: 4.5rem;
      margin-right:0.5rem;
      font-size: 1rem;
      margin-top: 0;
      margin-bottom: 0;
      line-height:2.4rem;
      text-align:right;
    }
  }
  .input-time {
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
  .pullbox .pullbox-label. pullbox-select {
    width: 23rem;
  }
  .checkbox-area label {
    width: 12.5rem;
  }

  .register_info {
    input {
      font-size: 1rem;
      width: calc(100% - 6rem);
      height:2.5rem;
    }
    label {
      width: 5rem;
      margin-right: 0.625rem;
      margin-top: 0;
      margin-bottom: 0;
      line-height: 2.5rem;
    }
    .react-datepicker-wrapper {
      width: 7rem;
    }
    .input-time div {
      margin-top:0;
    }
    .input-info {
      input {
        width: calc(100% - 5.625rem);
      }
      label {
        width: 5rem;
        text-align: right;
      }
    }
    .react-datepicker-popper {
      left: -40px !important;
    }
  }

  .gender {
    font-size: 0.75rem;
    margin-top: 0.625rem;
    margin-bottom: 0.625rem;
    .gender-label {
      width: 4.5rem;
      margin-right: 0.5rem;
      font-size: 1rem;
      margin-top: 0;
      margin-bottom: 0;
      line-height:38px;
      height:38px;
      text-align:right;
      margin-bottom: auto;
      margin-top: auto;
    }
  }
  .radio-group-btn label {
    width: 1.875rem;
    font-size: 1rem;
    border: solid 1px rgb(206, 212, 218);
    border-radius: 0.25rem;
    margin: 0;
    padding: 0;
    margin-right:0.5rem;
    height: 38px;
    text-align: center;
    line-height: 38px;
  }
  .select-day-btn {
    cursor: pointer;
    border: 1px solid rgb(206, 212, 218);
    // margin-top: 0.625rem;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
    height: 38px;
    font-size: 1rem;
    line-height: 38px;
  }
  .no-dial-day {
    width: 1.875rem;
    margin-right:0.5rem;
    display: inline-block;
  }
  .final-info {
    padding-left: 5rem;
    padding-top: 0.3rem;
    font-size: 1rem;
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
  .pattern-list: hover {
    background: #e2e2e2;
  }
  .pattern-list {
    cursor:pointer;
    display: flex;
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
    .dialyzer-code {
      width: calc(100% - 21.5rem);
      padding-left: 0.1rem;
    }
    .pattern-week-day {
      width: 9rem;
    }
    .pattern-time_limit_from {
      width: 6.25rem;
    }
    .pattern-time_limit_to {
      width: 6.25rem;
    }
  }
  .selected {
    background: lightblue;
  }
  .selected: hover {
    background: lightblue;
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

class Dializer extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );

    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let dializer_pattern = [];
    this.state = {
      dializer_pattern,
      name: 0,
      final_week_days: 0,
      time_limit_from: '',
      time_limit_to: "",
      entry_date: '',
      entry_time: '',
      directer_name: "",
      showHistory: 1,
      patient_id: "",
      checkAnotherDay: 0,
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
      pattern_table_id: "",
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
      isReScheduleConfirm: false,
      isUpdateScheduleConfirmModal: false,
      isConfirmComplete: false,
      isOverwriteConfirmModal: false,
      isAddConfirmModal: false,
      isOpenMoveOtherPageConfirm: false,
      isClearConfirmModal: false,
      alert_message: '',
      confirm_alert_title:'',

      isOpenHistoryModal:false,
      isOpenConsentModal:false,
    };
    this.double_click = false;
    this.ex_weekday = 0;
    this.ex_time_limit_from = null;
    this.ex_time_limit_to = null;
    this.overwrite_flag = false;
    this.sideBarRef = null;
  }

  async componentDidMount() {
    await this.getDialyzerCode();
    await this.setDoctors();
    await this.getStaffs();
    let server_time = await getServerTime();
    let state_data = {};
    state_data['time_limit_from'] = new Date(server_time);
    state_data['entry_date'] = new Date(server_time);
    state_data['entry_time'] = new Date(server_time);
    if (this.context.selectedDoctor.code > 0) {
      state_data['instruction_doctor_number'] = parseInt(this.context.selectedDoctor.code);
      state_data['directer_name'] = this.context.selectedDoctor.name;
    }
    this.setState(state_data);
  }

  openConfirmCompleteModal = (message) => {
    this.setState({
      isConfirmComplete: true,
      complete_message: message,
    });
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

  getName = (e) => {
    this.setChangeFlag(1);
    this.setState({ name: e.target.id });
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
        tmp = this.getPatternListByDateCondition(this.state.dializer_pattern,today,"time_limit_from","time_limit_to");
        this.setState({
          showHistory: value,
          dializer_pattern: tmp,
        });
      } else {
        this.setState({
          showHistory: value,
          dializer_pattern: this.state.origin_pattern_list,
        });
      }
    }
  };

  selectPatient =async(patientInfo) => {
    this.initRedBarder();
    await this.initializeInfo(patientInfo.system_patient_id);
    this.setState({
      patientInfo: patientInfo,
    });
    this.overwrite_flag = false;
  };

  initializeInfo = async(patient_id) => {
    let server_time = await getServerTime();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.setState({
      selected_number: "",
      pattern_table_id: "",
      patient_id: patient_id,
      name: 0,
      final_week_days: 0,
      time_limit_from: new Date(server_time),
      time_limit_to: "",
      entry_date: new Date(server_time),
      entry_time: new Date(server_time),
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
      change_flag: false,
      select_dial_days: false,
    });
    this.change_flag = 0;
    var init_call = true;
    this.setChangeFlag(0);
    this.getDialDays(patient_id, init_call);
    await this.getDializerPatternInfo(patient_id);
    this.setDoctors();
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

  async getDializerPatternInfo(patient_id) {
    let server_time = await getServerTime();
    let path = "/app/api/v2/dial/pattern/getDializerPattern";
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
            dializer_pattern: tmp,
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
      window.sessionStorage.setItem(
        "alert_messages",
        "登録権限がありません。"
      );
      return;      
    }
    
    if (this.state.instruction_doctor_number === "") {
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
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

  initRedBarder = () => {
    removeRedBorder('time_limit_from_id');
    removeRedBorder('final_week_days_id');
    removeRedBorder('time_limit_to_id');
    removeRedBorder('name_id');
    removeRedBorder("entry_time_id");
  }
  checkValidation = () => {
    this.initRedBarder();
    let error_str_arr = []
    let validate_data = patternValidate('dial_dialyzer_pattern', this.state)
    if (validate_data.error_str_arr.length > 0) {
      error_str_arr = validate_data.error_str_arr
    }
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
    if(this.state.entry_time == "" || this.state.entry_time == null){      
      error_str_arr.push("入力時間を選択してください。");
      if (validate_data.first_tag_id == undefined || validate_data.first_tag_id == '') {
        validate_data.first_tag_id = 'entry_time_id';
      } 
      addRedBorder("entry_time_id");
    }
    
    if (validate_data.first_tag_id != '') {
      this.setState({ first_tag_id: validate_data.first_tag_id })
    }
    return error_str_arr
  }

  componentDidUpdate () {
    this.changeBackground();
  }

  changeBackground = () => {
    patternValidate('dial_dialyzer_pattern', this.state, 'background');
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


  addPattern = async () => {
    this.confirmCancel();
    let new_pattern = {
      patient_id: this.state.patient_id,
      time_limit_from: this.state.time_limit_from
        ? formatDateLine(this.state.time_limit_from)
        : "",
      time_limit_to: this.state.time_limit_to
        ? formatDateLine(this.state.time_limit_to)
        : "",
      dialyzer_code: this.state.name,
      weekday: this.state.final_week_days,
      entry_date: this.state.entry_date
        ? formatDateLine(this.state.entry_date)
        : "",
      entry_time: this.state.entry_time
        ? formatTime(this.state.entry_time)
        : "",
      instruction_doctor_number: this.state.instruction_doctor_number,

      overwrite: this.overwrite_flag,
    };
    let path = "/app/api/v2/dial/pattern/registerDializerPattern";
    this.openConfirmCompleteModal("保存中");
    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient
      .post(path, {
        params: new_pattern,
      })
      .then(async(res) => {
        this.setState({ isConfirmComplete: false });
        if (res.duplicate == true) {
          this.setState({
            isOverwriteConfirmModal: true,
            confirm_message: res.alert_message,
          });
          return;
        }
        this.confirmCancel();
        await this.initializeInfo(this.state.patient_id);
        this.makeSchedule(res.pattern_number, new_pattern, 0);
        this.overwrite_flag = false;

        var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了##";
        if (message.indexOf('登録') > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
      })
      .catch(() => {
        this.overwrite_flag = false;
        this.confirmCancel();
      })
      .finally(() => {
        this.double_click = false;
        this.overwrite_flag = false;
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
    var selected_pattern_data = this.state.selected_pattern_data;
    this.initRedBarder();
    let create_at = selected_pattern_data.updated_at;
    let input_day = create_at.split(" ");
    let final_week_days = {};
    let another_day = false;
    var weekday = parseInt(selected_pattern_data.weekday);
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
      this.getDialDays(this.state.patient_id);
    }
    let _state = {
      selected_number:selected_pattern_data.number,
      pattern_table_id: selected_pattern_data.number,
      name: selected_pattern_data.dialyzer_code,
      final_week_days: weekday,
      checkalldays: final_week_days,
      time_limit_from: new Date(
        selected_pattern_data.time_limit_from
      ),
      time_limit_to:
        selected_pattern_data.time_limit_to == null
          ? null
          : new Date(selected_pattern_data.time_limit_to),
      final_entry_date: formatDateSlash(new Date(input_day[0])),
      final_entry_time: formatTime(formatTimePicker(input_day[1])),
      final_entry_name:
        this.state.staff_list_by_number != undefined &&
        this.state.staff_list_by_number != null &&
        selected_pattern_data.updated_by !== 0
          ? this.state.staff_list_by_number[
              selected_pattern_data.updated_by
            ]
          : "",
      final_doctor_name:
        selected_pattern_data.instruction_doctor_number != null
          ? this.state.doctor_list_by_number[
              selected_pattern_data.instruction_doctor_number
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
    this.ex_time_limit_from = new Date(
      selected_pattern_data.time_limit_from
    );
    this.ex_time_limit_to =
      selected_pattern_data.time_limit_to == null
        ? null
        : new Date(selected_pattern_data.time_limit_to);
    this.ex_weekday = weekday;

    this.ex_pattern = {
      patient_id: this.state.patient_id,
      time_limit_from: selected_pattern_data.time_limit_from,
      time_limit_to:
        selected_pattern_data.time_limit_to == null
          ? ""
          : selected_pattern_data.time_limit_to,
      dialyzer_code: selected_pattern_data.dialyzer_code,
      weekday,
    };
    this.setChangeFlag(0);
  };

  checkEqual(data1, data2) {
    if (JSON.stringify(data1) == JSON.stringify(data2)) return true;
    return false;
  }

  updatePattern = async (re_schedule = true) => {
    if (this.state.pattern_table_id != "") {
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
        time_limit_from = formatDateLine(this.ex_time_limit_from);
        time_limit_to = formatDateLine(this.ex_time_limit_to);
        weekday = this.ex_weekday;
      }
      let update_pattern = {
        number: this.state.pattern_table_id,
        patient_id: this.state.patient_id,
        time_limit_from,
        time_limit_to,
        entry_date: this.state.entry_date
          ? formatDateLine(this.state.entry_date)
          : "",
        entry_time: this.state.entry_time
          ? formatTime(this.state.entry_time)
          : "",
        dialyzer_code: this.state.name,
        weekday,
        sch_all_remove: 1,
        instruction_doctor_number: this.state.instruction_doctor_number,

        overwrite: this.overwrite_flag,
      };

      var new_updated_pattern = {
        patient_id: this.state.patient_id,
        time_limit_from,
        time_limit_to,
        dialyzer_code: this.state.name,
        weekday,
      };

      if (this.checkEqual(this.ex_pattern, new_updated_pattern)) {
        this.confirmCancel();
        window.sessionStorage.setItem(
          "alert_messages",
          "変更されたデータがありません。"
        );
        return;
      }

      let path = "/app/api/v2/dial/pattern/updateDializerPattern";
      this.openConfirmCompleteModal("保存中");

      await apiClient
        .post(path, {
          params: update_pattern,
        })
        .then(async(res) => {
          this.setState({ isConfirmComplete: false });
          if (res.duplicate == true) {
            this.setState({
              isOverwriteConfirmModal: true,
              confirm_message: res.alert_message,
            });
            return;
          }
          await this.initializeInfo(this.state.patient_id);
          this.makeSchedule(res.pattern_number, update_pattern, 1);
          var title = '';
          var message = res.alert_message;
          if (message.indexOf('変更') > -1) title = "変更完了##";
          if (message.indexOf('登録') > -1) title = "登録完了##";
          window.sessionStorage.setItem("alert_messages", title + res.alert_message);

          this.overwrite_flag = false;
          this.confirmCancel();
        })
        .catch(() => {
          this.overwrite_flag = false;
          this.confirmCancel();
        });
    }
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
    let path = "/app/api/v2/dial/pattern/makeDialyzerSchedule";
    apiClient.post(path, {
      params: post_data,
    });
  }

  deletePattern = async (type) => {
    if (this.state.pattern_table_id != "") {
      let delete_pattern = {
        number: this.state.pattern_table_id,
        system_patient_id: this.state.patient_id,
        all_remove: type == true ? 1 : 0,
      };
      await this.deleteDialPatternFromPost(delete_pattern);
      await this.initializeInfo(this.state.patient_id);
      this.overwrite_flag = false;
    }
  };

  async deleteDialPatternFromPost(data) {
    let path = "/app/api/v2/dial/pattern/deleteDializerPattern";
    this.openConfirmCompleteModal("削除中");
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
    this.confirmCancel();
  }

  confirmCancel = () => {
    this.setState({
      isUpdateConfirmModal: false,
      isDeleteConfirmModal: false,
      isReScheduleConfirm: false,
      isUpdateScheduleConfirmModal: false,
      isAddConfirmModal: false,
      isOverwriteConfirmModal: false,
      isConfirmComplete: false,
      isOpenMoveOtherPageConfirm: false,
      isClearConfirmModal: false,
      confirm_message: "",
      confirm_alert_title:'',

      isOpenHistoryModal:false,
      isOpenConsentModal:false,
    });
  }

  overwrite=async()=> {
    this.confirmCancel();
    this.overwrite_flag = true;
    if (this.state.pattern_table_id > 0) {
      await this.updatePattern();
    } else {
      await this.addPattern();
    }
  }

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
      window.sessionStorage.setItem(
        "alert_messages",
        "変更権限がありません。"
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

    if (this.state.instruction_doctor_number === "") {
      // window.sessionStorage.setItem("alert_messages", '指示者を選択してください。');
      this.showDoctorList();
      return;
    }

    let error_str_array = this.checkValidation()
    
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    this.setState({
      isUpdateConfirmModal: true,
      confirm_message: "パターン情報を変更しますか?",
    });
  };

  delete = () => {
    let flag = true;
    if (this.state.patient_id === "") {
      flag = false;
    } else if (this.state.pattern_table_id === "") {
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
      sessApi.setObjectValue("dial_schedule_table", "open_tab", "dialyzer");
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
  openScheduleConfirmModal = () => {
    this.setState({ isUpdateScheduleConfirmModal: true });
  };

  updatePatternSchedule = (type) => {
    this.updatePattern(true, type);
  };
  setChangeFlag = (change_flag) => {
    this.change_flag = change_flag;
    this.setState({ change_flag });
    if (change_flag) {
      sessApi.setObjectValue("dial_change_flag", "dialyzer", 1);
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

  resetDatePicker = (e) => {
    if (e.target.id == this.state.first_tag_id){
      addRedBorder(e.target.id);
    }
    this.forceUpdate();
  }

  openConsentModal = () => {    
    this.setState({
      isOpenConsentModal:true
    })
  }

  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));    
    let conf_data = JSON.parse(window.sessionStorage.getItem("init_status")).conf_data;  
    let dializers_options = [{id:0, vlaue:''}];
    var dializers = {};
    if (this.state.dialyzer_options_list != undefined) {
      dializers_options = this.state.dialyzer_options_list;
      dializers = this.state.dialyzerCodeData;

    }
    let message;
    let dializer_pattern = [];
    let can_delete = this.state.pattern_table_id != "";
    let del_tooltip = "";
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
    if (this.state.dializer_pattern.length) {
      dializer_pattern = this.state.dializer_pattern.map((item) => {
        let weekday = "";
        for (let i = 0; i < 7; i++) {
          weekday += item.weekday & Math.pow(2, i) ? week_days[i] : "";
        }

        return (
          <>
            <div onContextMenu={e => this.handleClick(e, item)}
              className={"pattern-list " + (this.state.selected_number === item.number ? "selected" : "")}
              onClick={this.editpatternConfirm.bind(this, item)}
            >
              <div className={"dialyzer-code bl-1p bt-1p bb-1p"}>
                {dializers[item.dialyzer_code] != undefined ? dializers[item.dialyzer_code]: ""}
              </div>
              <div className={"pattern-week-day bl-1p bt-1p bb-1p"}>
                {weekday}
              </div>
              <div className={"pattern-time_limit_from bl-1p bt-1p bb-1p"}>
                {formatDateSlash(item.time_limit_from)}
              </div>
              <div className={"pattern-time_limit_to bl-1p bt-1p bb-1p br-1p"}>
                {item.time_limit_to == null? "～ 無期限": formatDateSlash(item.time_limit_to)}
              </div>
            </div>
          </>
        );
      });
    } else {
      message = (
        <div className="no-result">
          <span>登録されたダイアライザパターンがありません。</span>
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
            <div className="title">ダイアライザパターン</div>
            <div className={"other-pattern"}>
              <Button className="schedule-button" onClick={this.goOtherPattern.bind(this,"/dial/schedule/Schedule")}>スケジュール</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/dialPattern")}>透析</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/anticoagulation")}>抗凝固法</Button>
              <Button className="disable-button">ダイアライザ</Button>
              <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/injection")}>注射</Button>
              <Button onClick={this.goOtherPattern.bind(this, "/dial/pattern/prescription")}>処方</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/inspection")}>検査</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/dialPrescript")}>透析中処方</Button>
              <Button onClick={this.goOtherPattern.bind(this,"/dial/pattern/administrativefee")}>管理料</Button>
            </div>
          </div>
          <div className="bodywrap">
            <Wrapper>
              <div className="top-table">
                <div className="dial-list">
                  <div className="table-header">
                    <div className={"dialyzer-code bl-1p bt-1p bb-1p"}>名称</div>
                    <div className={"pattern-week-day bl-1p bt-1p bb-1p"}>曜日</div>
                    <div className={"pattern-time_limit_from bl-1p bt-1p bb-1p br-1p"}>期限</div>
                  </div>
                  <PrescriptionBox id = 'pattern-box'>
                    {dializer_pattern}
                    {message}
                  </PrescriptionBox>
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
                  isDisabled = {this.state.patient_id > 0? false: true}
                  name="schedule"
                />
              </div>
              <div className="dial-oper">
                <div className='pattern-data'>
                  <SelectorWithLabel
                    options={dializers_options}
                    title="名称"
                    getSelect={this.getName.bind(this)}
                    departmentEditCode={this.state.name}
                    id="name_id"
                  />
                    <div className="gender flex">
                      <label className="gender-label" style={{cursor:"text"}}>曜日</label>
                      <div className="flex weekday_area transparent-border" id="final_week_days_id">
                      <>
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
                      </>
                      <div className="select-day-btn" onClick={this.selectDialDays}>透析曜日を選択</div>
                    </div>
                  </div>
                  <div className="selet-day-check flex">
                    <div style={{width:"5rem"}}></div>
                    <Checkbox
                      label="透析曜日以外も表示"
                      getRadio={this.getCheckAnotherDay.bind(this)}
                      value={this.state.checkAnotherDay}
                      name="schedule"
                    />
                  </div>
                  <div className="period">
                    <InputWithLabelBorder
                      label="期限"
                      type="date"
                      getInputText={this.getStartdate}
                      diseaseEditData={this.state.time_limit_from}
                      id='time_limit_from_id'
                      onBlur = {e => this.resetDatePicker(e)}
                    />
                    <div className="pd-15">～</div>
                    <div className='end-date'>
                      <InputWithLabelBorder
                        label=""
                        type="date"
                        getInputText={this.getEnddate}
                        diseaseEditData={this.state.time_limit_to}
                        id='time_limit_to_id'
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
                  <div className="input-info remove-x-input">
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
                          diseaseEditData={this.state.directer_name}
                          isDisabled={true}
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
                title={"ダイアライザ"}
                closeModal={this.confirmCancel.bind(this)}
                confirmOk={this.deletePattern.bind(this)}
              />
            )}
          {this.state.isUpdateScheduleConfirmModal !== false &&
            this.state.isConfirmComplete === false && (
              <PatternUpdateConfirmModal
                title={"ダイアライザ"}
                closeModal={this.confirmCancel.bind(this)}
                confirmOk={this.updatePatternSchedule.bind(this)}
              />
            )}
          {this.state.isReScheduleConfirm !== false && (
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
          {this.state.alert_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeAlertModal}
              alert_meassage={this.state.alert_message}
            />
          )}
          {this.state.isConfirmComplete !== false && (
            <CompleteStatusModal message={this.state.complete_message} />
          )}
          {this.state.isOpenHistoryModal && (
            <DializerHistoryModal
              closeModal = {this.confirmCancel}
              selected_history_item = {this.state.selected_history_item}
            />
          )}
          {this.state.isOpenConsentModal && (
            <DializerConsentModal
              closeModal = {this.confirmCancel}
              patientInfo = {this.state.patientInfo}
            />
          )}
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}              
          />
        </Card>
      </>
    );
  }
}
Dializer.contextType = Context;

Dializer.propTypes = {
  history: PropTypes.object,
};

export default Dializer;
