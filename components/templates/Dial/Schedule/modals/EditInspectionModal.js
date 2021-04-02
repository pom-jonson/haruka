import React, { Component } from "react";
import * as methods from "~/components/templates/Dial/DialMethods";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SelectorWithLabelIndex from "~/components/molecules/SelectorWithLabelIndex";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {
  formatJapanDate,
  formatTime,
  formatDateLine,
} from "~/helpers/date";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";

import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import $ from "jquery";
registerLocale("ja", ja);
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import {
  makeList_code,
  sortTimingCodeMaster,
  makeList_codeName,
  sortByTiming,
  addRedBorder,
  addRequiredBg,
  removeRequiredBg,
  removeRedBorder,
  toHalfWidthOnlyNumber
} from "~/helpers/dialConstants";
import * as sessApi from "~/helpers/cacheSession-utils";
import InspectionPatternModal from "./InspectionPatternModal";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  height: 12.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Icon = styled(FontAwesomeIcon)`
  color: blue;
  font-size: 15px;
  margin-right: 5px;
`;

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  float: left;
  .dailysis_condition {
    display: flex;
  }
  .cursor-text-area{
    label{
      cursor: text !important;
    }
  }
  .react-datepicker-wrapper {
    width: 200px;
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

  .left {
    float: left;
    font-size: 17px;
  }

  .right {
    float: right;
    font-size: 15px;
    cursor: pointer;
  }
  .patient_id,
  .patient_name {
    font-size: 25px;
  }
  .schedule_date,
  .dialyser_table {
    margin-top: 15px;
    margin-bottom: 10px;
    font-size: 15px;
  }  
  input {
    width: 100%;
    font-size: 15px;
  }
  .dializer-code {
    .label-title {
      width: 0;
    }
    label {
      width: 100%;
      margin: 0;
      select {
        width: 100%;
      }
    }
  }
  table{
    margin-bottom:0px;
    thead{
      display:table;
      width:100%;
    }
    tbody{
      display:block;
      overflow-y: auto;
      max-height: 7.5rem;
      width:100%;
    }
    tr{
      display: table;
      width: 100%;
    }
    th{
      font-size:13px;
      padding-left:2px;
      padding-right:2px;
      text-align:center;
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }
    td{
      vertical-align:middle;    
      text-align:center;
      font-size:14px;    
      padding-left:2px;
      padding-right:2px;
      padding-top:1px;
      padding-bottom:1px;
      .label-title {
        width: 0;   
      }
      word-break: break-all;
      .pullbox-select{
        height: 2.5rem;
      }
    }
    .name-td{
      width:200px;
      .pullbox-label, .pullbox-select{
        width:195px;
      }
    }
    .amount-td{
      width:40px;
    }
    .popup-td{
      width:115px;
      .pullbox-label, .pullbox-select{
        width:110px;
      }
    }    
    .timing-td{
      width:180px;
      .pullbox-label, .pullbox-select{
        width:175px;
      }
    }    
    .done-td{
      width:35px;
      cursor: pointer;
    }
  }

  .done_dialyser {
    background-color: rgb(105, 200, 225);
  }
  .not_done_dialyser {
    background-color: lightgrey;
  }
  .checkbox_area {
    padding-left: 15px;
  }
  .register_info {
    display: flex;
    div {margin-top:0;}
    .label-title, label {
      text-align: right;
      font-size: 1rem;
      margin: 0;
      margin-right: 0.5rem;
      line-height: 2rem;
      width: 90px;
    }
    input {
      width: 210px;
      height: 2rem;
      font-size:1rem;
    }
    .react-datepicker-wrapper {
      input {
        width: 110px;
        height: 2rem;
        font-size:1rem;
      }
    }
  }
  .table-content {
    clear: both;
    margin-bottom: 10px;
  }

  input:disabled {
    color: black !important;
    background: white;
  }
  select:disabled {
    color: black !important;
    background: white;
    opacity:1;
  }
`;

const ContextMenuUl = styled.ul`
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #5ab0cc;
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
    color: white;
    cursor: pointer;
    font-size: 14px;
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
    color: black;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x, y, parent, item }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() => parent.stopSchedule(item)}>中止</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const ContextMenu_register = ({ visible, x, y, parent, item }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li>
            <div onClick={() => parent.showInspectPattern(true, item)}>
              編集
            </div>
          </li>
          <li>
            <div onClick={() => parent.stopSchedule(item)}>中止</div>
          </li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class EditInspectionModal extends Component {
  constructor(props) {
    super(props);
    Object.entries(methods).forEach(([name, fn]) =>
      name === "state" ? (this.state = fn()) : (this[name] = fn.bind(this))
    );
    let code_master = sessApi.getObjectValue(
      "dial_common_master",
      "code_master"
    );
    var timingCodeData = sortTimingCodeMaster(code_master["実施タイミング"]);
    let examinationCodeData = sessApi.getObjectValue(
      CACHE_SESSIONNAMES.COMMON_MASTER,
      "examination_master"
    );
    this.double_click = false;
    this.state = {
      isShowDoctorList: false,
      isShowStaffList: false,
      isShowInspectList: false,
      isShowInspectPattern: false,
      entry_date: '',
      entry_time: '',
      directer_name: "",
      temporary: this.props.temporary == 1 ? 1 : 0,
      examinationCodeData,
      examination_codes: makeList_code(examinationCodeData),
      examination_code_options:makeList_codeName(examinationCodeData, 1),
      timingCodeData,
      timing_codes: makeList_code(timingCodeData),
      timing_options: makeList_codeName(timingCodeData, 1),
      instruction_doctor_number: 0,
      popup: 0,

      moveConfirmModal: false,
      isShowTreatDoctorList: false,
      isUpdateConfirmModal:false,
      confirm_message: "",
      alert_message:'',
      confirm_alert_title:'',
      is_loaded: false,
    }
    this.change_flag = false;
  }

  getScheduleItmes = async (system_patient_id, schedule_date) => {
    let path = "/app/api/v2/dial/schedule/inspection_search";
    let post_data = {
      params: {
        schedule_date: schedule_date,
        patient_id: system_patient_id,
        is_temporary: this.state.temporary,
      },
    };
    await apiClient.post(path, post_data).then((res) => {
      if (res.length > 0) {
        this.setState({
          schedule_item: res,
        });
      } else {
        this.setState({
          schedule_item: [],
        });
      }
    });
    this.change_flag = false;
  };

  async componentDidMount() {
    await this.getScheduleItmes(this.props.system_patient_id,this.props.schedule_date);
    await this.setDoctors();
    await this.getStaffs();
    let server_time = await getServerTime();
    let state_data = {};
    state_data['entry_date'] = new Date(server_time);
    state_data['entry_time'] = new Date(server_time);
    state_data['is_loaded'] = true;
    if (this.context.selectedDoctor.code > 0) {
      state_data['instruction_doctor_number'] = parseInt(this.context.selectedDoctor.code);
      state_data['directer_name'] = this.context.selectedDoctor.name;
    }
    this.setState(state_data);
  }

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

  getInputdate = (value) => {
    this.setState({ entry_date: value });
  };

  change_not_done = (item) => {
    if (this.props.from_source == 'bedside') return;
    item.is_completed = 0;
    item.completed_by = null;
    if (item.is_temporary) item.temporary = 1;
    item.is_changed = true;
    this.setState({
      schedule_item: this.state.schedule_item,
    });
    this.change_flag = true;
  };

  change_done = (item) => {
    if (this.props.from_source == 'bedside') return;
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    item.is_completed = 1;
    item.completed_by = authInfo.user_number;
    if (item.is_temporary) item.temporary = 1;
    item.is_changed = true;
    this.setState({
      schedule_item: this.state.schedule_item,
    });
    this.change_flag = true;
  };

  showTreatDoctorList = (item) => {
    if (this.props.from_source == 'bedside') return;
    if (item.is_completed != 1) return;
    this.setState({
      isShowTreatDoctorList: true,
      selected_row_item: item,
    });
  };

  selectTreatDoctor = (doctor) => {
    if (this.props.from_source == 'bedside') return;
    var selected_item = this.state.selected_row_item;
    selected_item.completed_by = doctor.number;
    selected_item.is_changed = true;    
    if (selected_item.is_temporary) selected_item.temporary = 1;
    this.change_flag = true;
    this.closeModal();
  };

  showInspectList = () => {
    this.setState({ isShowInspectList: true });
  };

  stopSchedule = (item) => {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    item.is_canceled = 1;
    item.canceled_by = authInfo.user_number;
    item.is_changed = true;
    if (item.is_temporary) item.temporary = 1;
    this.setState({
      schedule_item: this.state.schedule_item,
    });
    this.change_flag = true;
  };

  handleClick = (e, item) => {
    if (this.props.from_source == 'bedside') return;
    // if (e.type === "contextmenu") {
    // e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        contextMenu: { visible: false },
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("dialyer-table")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false },
        });
        document
          .getElementById("dialyer-table")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    this.setState({
      contextMenu: {
        visible: true,
        x: e.clientX - $(".modal-dialog").offset().left,
        y: e.clientY - $(".modal-dialog").offset().top - 40,
        item: item,
      },
      contextMenu_register: { visible: false },
    });
    // }
  };

  handleClick_register = (e, item) => {
    if (this.props.from_source == 'bedside') return;
    // if (e.type === "contextmenu") {
    // e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ contextMenu_register: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        contextMenu_register: { visible: false },
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("dialyer-table")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_register: { visible: false },
        });
        document
          .getElementById("dialyer-table")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    this.setState({
      contextMenu_register: {
        visible: true,
        x: e.clientX - $(".modal-dialog").offset().left,
        y: e.clientY - $(".modal-dialog").offset().top - 40,
        item: item,
      },
      contextMenu: { visible: false },
    });
    // }
  };

  confirmSave = async() => {
    this.confirmCancel();
    let path = "/app/api/v2/dial/schedule/inspection_schedule_update";
    var schedule_item = this.state.schedule_item;
    if (schedule_item == undefined || schedule_item == null || schedule_item.length == 0) return;
    var temp = [];
    schedule_item.map(item => {
      if (item.is_changed) temp.push(item);
    })
    let update_data = {
      schedule_item: temp,
      entry_date: formatDateLine(this.state.entry_date),
      entry_time: formatTime(this.state.entry_time),
      instruction_doctor_number: this.state.instruction_doctor_number,
      temporary: this.state.temporary,
      from_source: this.props.from_source,
    };

    const post_data = {
      params: update_data,
    };

    if (this.double_click == true) return;
    this.double_click = true;
    await apiClient.post(path, post_data).then(res=>{
      
      if (this.props.from_source == 'dr_karte'){
        this.props.handleOk(res.alert_message);
      } else {
        var title = '';
        var message = res.alert_message;
        if (message.indexOf('変更') > -1) title = "変更完了##";
        if (message.indexOf('登録') > -1) title = "登録完了##";
        window.sessionStorage.setItem("alert_messages", title + res.alert_message);
        this.props.handleOk(this.state.schedule_item[0]);
      }
    }).finally(() => {
      this.double_click = false;
    });
    this.change_flag = false;    
  }

  checkValidation = () => {
    removeRedBorder("entry_time_id");
    let error_str_arr = [];
    let tag_ids = [];
    let first_tag_id = '';
    if (this.state.schedule_item != undefined && this.state.schedule_item != null && this.state.schedule_item.length > 0){
      var list = sortByTiming(this.state.schedule_item, this.state.timingCodeData);          
      list.map((item, index) => {
        removeRedBorder('examination_code_id' + index);
        removeRedBorder('timing_code_id' + index);
        if (!(item.examination_code>0)){
          error_str_arr.push('臨時検査名称を選択してください');
          addRedBorder('examination_code_id' + index);
          tag_ids.push('examination_code_id' + index);
        }

        if (!(item.timing_code>0)){
          error_str_arr.push('実施タイミングを選択してください');
          addRedBorder('timing_code_id' + index);
          tag_ids.push('timing_code_id' + index);          
        }
      })
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){      
      error_str_arr.push("入力時間を選択してください。");      
      addRedBorder("entry_time_id");
      tag_ids.push('entry_time_id');
    }
    if (tag_ids.length > 0) first_tag_id = tag_ids[0];
    this.setState({first_tag_id});
    return error_str_arr;
  }

  save = async () => {
    if (this.change_flag == false) return;
    if (this.context.$canDoAction(this.context.FEATURES.DIAL_SYSTEM,this.context.AUTHS.EDIT) === false) {
      window.sessionStorage.setItem("alert_messages", '変更権限がありません。');
      return;
    }
    if (this.state.instruction_doctor_number == "") {      
      this.showDoctorList();
      return;
    }
    let error_str_array = this.checkValidation();
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (authInfo.staff_category == 1 && this.state.directer_name != authInfo.name) {
      error_str_array.unshift("指示者を正確に選択してください。");      
    }
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }

    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }

    this.setState({
      isUpdateConfirmModal:true,
      confirm_message:'変更しますか？'
    })
  };

  selectDoctor = (doctor) => {
    this.setState({
      directer_name: doctor.name,
      instruction_doctor_number: doctor.number,
    });
    this.context.$updateDoctor(doctor.number, doctor.name);

    this.closeModal();
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

  closeModal = () => {
    this.setState({
      isShowDoctorList: false,
      isShowStaffList: false,
      isShowInspectList: false,
      isShowInspectPattern: false,
      isShowTreatDoctorList: false,
    });
  };

  getName = (e, item) => {
    item.examination_code = e.target.id;
    item.name = e.target.value;
    if (item.is_temporary) item.temporary = 1;
    item.is_changed = true;
    this.setState({ schedule_item: this.state.schedule_item });
    this.change_flag = true;
  };

  getTiming = (e, item) => {
    item.timing_code = e.target.id;
    if (item.is_temporary) item.temporary = 1;
    item.is_changed = true;
    this.setState({ schedule_item: this.state.schedule_item });
    this.change_flag = true;
  };

  getPopupDisplay = (e, item) => {
    item.is_require_confirmation_before_weight_measurement = e.target.id;
    if (item.is_temporary) item.temporary = 1;
    item.is_changed = true;
    this.setState({ schedule_item: this.state.schedule_item });
  };

  addInspect = (item) => {
    var temp = this.state.schedule_item;
    var add_item = {
      number: null,
      system_patient_id: this.props.system_patient_id,
      examination_code: item.code,
      name:item.name,
      timing_code: 1,
      schedule_date: this.props.schedule_date,
      is_temporary: 1,
      temporary:1,
      is_canceled: 0,
      canceled_by: null,
      canceled_at: null,
      is_completed: 0,
      completed_by: null,
      completed_at: null,
      is_changed:true,
    };
    if (temp == undefined) temp = [];
    temp.push(add_item);
    this.setState({
      schedule_item: temp,
      isShowInspectList: false,
    });
    this.change_flag = true;
  };

  showInspectPattern = (is_edit, item) => {
    if (this.change_flag) {
      this.setState({
        moveConfirmModal: true,
        confirm_message:
          "まだ登録していない内容があります。\n変更を破棄して移動しますか？",
        action: "add_or_edit",
        is_edit: is_edit,
        confirm_alert_title:'入力中',
        pattern_number: is_edit === true ? item.pattern_number : 0,
        selected_item: is_edit === true ? item : null,
      });
    } else {
      this.setState({
        isShowInspectPattern: true,
        is_edit: is_edit,
        pattern_number: is_edit === true ? item.pattern_number : 0,
        selected_item: is_edit === true ? item : null,
      });
    }
  };

  handleOk = () => {
    this.closeModal();
    this.getScheduleItmes(
      this.props.system_patient_id,
      this.props.schedule_date
    );
  };

  confirmCancel() {
    this.setState({
      moveConfirmModal: false,
      isUpdateConfirmModal:false,
      confirm_message: "",
      alert_message:'',
      confirm_alert_title:'',
    });
  }

  closeThisModal = () => {
    if (this.change_flag) {
      this.setState({
        moveConfirmModal: true,
        action: "close",
        confirm_message:
          "まだ登録していない内容があります。\n変更を破棄して移動しますか？",
        confirm_alert_title:'入力中',
      });
    } else {
      this.props.closeModal();
    }
  };

  moveOk(action) {
    this.confirmCancel();
    if (action == "close") {
      this.props.closeModal();
      this.change_flag = false;
    }
    if (action == "add_or_edit") {
      this.setState({
        isShowInspectPattern: true,
      });
    }
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
    if (this.state.schedule_item != undefined && this.state.schedule_item != null && this.state.schedule_item.length > 0){    
      var list = sortByTiming(this.state.schedule_item, this.state.timingCodeData);                  
      list.map((item, index) => {
        if (!(item.examination_code>0)){
          addRequiredBg('examination_code_id' + index);
        } else {
          removeRequiredBg('examination_code_id' + index);
        }
        if (!(item.timing_code>0)){
          addRequiredBg('timing_code_id' + index);
        } else {
          removeRequiredBg('timing_code_id' + index);
        }
      })
    }
    if(this.state.entry_time == "" || this.state.entry_time == null){
      addRequiredBg("entry_time_id");
    } else {
      removeRequiredBg("entry_time_id");
    }
  }

  onHide = () => {};

  render() {
    let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let {
      schedule_item,
      examination_codes,
      timing_codes,
      staff_list_by_number,
    } = this.state;
    schedule_item = sortByTiming(schedule_item, this.state.timingCodeData);    
    var popup_display = { 0: "無", 1: "有" };
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal dailysis-prescription-modal first-view-modal"
      >
        <Modal.Header>
          <Modal.Title>検査{this.props.from_source =='bedside'?'': this.props.add_flag ? "登録" : "編集"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className="modal_header">
              <div className="schedule_date">
                {formatJapanDate(this.props.schedule_date)}
              </div>
              <span className="patient_id">
                {this.props.patientInfo.patient_number} :{" "}
              </span>
              <span className="patient_name">
                {this.props.patientInfo.patient_name}
              </span>
            </div>
            {this.state.is_loaded ? (
              <div className="dialyser_table">
                {this.state.temporary != 1 && (
                  <>
                    <div className="left">定期検査</div>
                    {this.props.from_source != 'bedside' && this.props.add_flag != true && (
                      <div className="right" onClick={this.showInspectPattern.bind(this, false)}>
                        <Icon icon={faPlus} />
                        定期検査を追加
                      </div>
                    )}
                    <div className="table-content">
                      <table
                        className="table-scroll table table-bordered"
                        id="dialyer-table"
                      >
                        <thead>
                          <tr>
                            <th className='name-td'>検査名称</th>
                            <th className='timing-td'>実施タイミング</th>
                            <th className='popup-td'>ポップアップ表示</th>
                            <th className='done-td'>実施</th>
                            <th>実施者</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schedule_item !== undefined &&
                            schedule_item !== null &&
                            schedule_item.length > 0 &&
                            examination_codes !== undefined &&
                            timing_codes !== undefined &&
                            staff_list_by_number != undefined &&
                            schedule_item.map((item) => {
                              if (
                                item.is_canceled == 0 &&
                                item.is_temporary == 0
                              ) {
                                return (
                                  <>
                                    <tr onContextMenu={(e) => this.handleClick_register(e, item)}>
                                      <td className='name-td text-left'>{examination_codes[item.examination_code]}</td>
                                      <td className='timing-td text-left'>{timing_codes[item.timing_code]}</td>
                                      <td className='popup-td'>
                                        {timing_codes[item.timing_code] =="透析前" ||
                                        timing_codes[item.timing_code] =="透析終了後"?
                                         popup_display[item.is_require_confirmation_before_weight_measurement]
                                         : ""}
                                      </td>
                                      {item.is_completed === 1 && (
                                        <td className="text-center done_dialyser done-td" onClick={() => this.change_not_done(item)}>済</td>
                                      )}
                                      {item.is_completed === 0 && (
                                        <td className="text-center not_done_dialyser done-td" onClick={() => this.change_done(item)}>未</td>
                                      )}
                                      <td className="dializer-code" style={{cursor:'pointer'}} onClick={this.showTreatDoctorList.bind(this,item)}>
                                        {item.completed_by > 0? staff_list_by_number[item.completed_by]: ""}
                                      </td>
                                    </tr>
                                  </>
                                );
                              }
                            })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
                <div className="left">臨時検査</div>
                <div className="right" onClick={this.showInspectList}><Icon icon={faPlus} />臨時検査を追加</div>
                <div className="table-content">
                  <table className="table-scroll table table-bordered" id="dialyer-table">
                    <thead>
                      <tr>
                        <th className='name-td'>検査名称</th>
                        <th className='timing-td'>実施タイミング</th>
                        <th className='popup-td'>ポップアップ表示</th>
                        <th className='done-td'>実施</th>
                        <th>実施者</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule_item !== undefined &&
                        schedule_item !== null &&
                        schedule_item.length > 0 &&
                        examination_codes !== undefined &&
                        timing_codes !== undefined &&
                        staff_list_by_number != undefined &&
                        schedule_item.map((item, index) => {
                          if (item.is_canceled == 0 && item.is_temporary == 1) {
                            return (
                              <>
                                <tr
                                  onContextMenu={(e) => this.handleClick(e, item)}
                                >
                                  <td className="dializer-code name-td">
                                    <SelectorWithLabel
                                      options={this.state.examination_code_options}
                                      getSelect={(e) => this.getName(e, item)}
                                      departmentEditCode={item.examination_code}
                                      id = {'examination_code_id' + index}
                                      isDisabled = {this.props.from_source =='bedside' ? true : false}
                                    />
                                  </td>
                                  <td className="dializer-code timing-td">
                                    <SelectorWithLabel
                                      options={this.state.timing_options}
                                      getSelect={(e) => this.getTiming(e, item)}
                                      departmentEditCode={item.timing_code}
                                      id = {'timing_code_id' + index}
                                      isDisabled = {this.props.from_source =='bedside' ? true : false}
                                    />
                                  </td>
                                  <td className="dializer-code popup-td">
                                    {(timing_codes[item.timing_code] ==
                                      "透析前" ||
                                      timing_codes[item.timing_code] ==
                                        "透析終了後") && (
                                      <SelectorWithLabelIndex
                                        options={popup_display}
                                        getSelect={(e) =>this.getPopupDisplay(e, item)}
                                        departmentEditCode={item.is_require_confirmation_before_weight_measurement}
                                        isDisabled = {this.props.from_source =='bedside' ? true : false}
                                      />
                                    )}
                                  </td>
                                  {item.is_completed === 1 && (
                                    <td
                                      className="text-center done_dialyser done-td"
                                      onClick={() => this.change_not_done(item)}                                    
                                    >
                                      済
                                    </td>
                                  )}
                                  {item.is_completed === 0 && (
                                    <td
                                      className="text-center not_done_dialyser done-td"
                                      onClick={() => this.change_done(item)}
                                    >
                                      未
                                    </td>
                                  )}
                                  <td
                                    className="dializer-code"
                                    style={{cursor:'pointer'}}
                                    onClick={this.showTreatDoctorList.bind(this,item)}
                                  >
                                    {item.completed_by > 0 ? staff_list_by_number[item.completed_by]: ""}
                                  </td>
                                </tr>
                              </>
                            );
                          }
                        })}
                    </tbody>
                  </table>
                </div>

                {this.props.from_source != 'bedside' && (
                  <div className="register_info">
                    <div className="remove-x-input">
                      <InputWithLabel
                        label="入力日"
                        type="date"
                        getInputText={this.getInputdate}
                        diseaseEditData={this.state.entry_date}
                      />
                      <div className="cursor-text-area" style={{marginTop:"0.5rem"}}>
                        <InputBoxTag
                          label="入力者"
                          type="text"
                          placeholder=""
                          className="left"
                          isDisabled={true}
                          value={authInfo.name}
                        />
                      </div>
                    </div>
                    <div className={'remove-x-input'}>
                      <div>
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
                      <div style={{marginTop:"0.5rem"}}>
                        {authInfo != undefined && authInfo != null && authInfo.doctor_number > 0 ? (
                          <InputWithLabel
                            label="指示者"
                            type="text"
                            isDisabled={true}
                            diseaseEditData={this.state.directer_name}
                          />
                        ) : (
                          <div className="direct_man cursor-input" onClick={(e)=>this.showDoctorList(e).bind(this)}>
                            <InputWithLabel
                              label="指示者"
                              type="text"
                              isDisabled={true}
                              diseaseEditData={this.state.directer_name}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ):(
              <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
              </SpinnerWrapper>
            )}
            <ContextMenu
              {...this.state.contextMenu}
              parent={this}
              favouriteMenuType={this.state.favouriteMenuType}
            />
            <ContextMenu_register
              {...this.state.contextMenu_register}
              parent={this}
              favouriteMenuType={this.state.favouriteMenuType}
            />
            {this.state.isShowDoctorList !== false && (
              <DialSelectMasterModal
                selectMaster={this.selectDoctor}
                closeModal={this.closeModal}
                MasterCodeData={this.state.doctors}
                MasterName="医師"
              />
            )}
            {this.state.isShowTreatDoctorList !== false && (
              <DialSelectMasterModal
                selectMaster={this.selectTreatDoctor}
                closeModal={this.closeModal}
                MasterCodeData={this.state.staffs}
                MasterName="スタッフ"
              />
            )}
            {this.state.isShowInspectList !== false && (
              <DialSelectMasterModal
                selectMaster={this.addInspect}
                closeModal={this.closeModal}
                MasterCodeData={this.state.examinationCodeData}
                MasterName="検査"
              />
            )}
            {this.state.isShowInspectPattern && (
              <InspectionPatternModal
                closeModal={this.closeModal}
                system_patient_id={this.props.system_patient_id}
                schedule_date={this.props.schedule_date}
                is_edit={this.state.is_edit}
                handleOk={this.handleOk}
                edit_pattern_number={this.state.pattern_number}
                selected_item={this.state.selected_item}
              />
            )}

            {this.state.moveConfirmModal && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.moveOk.bind(this, this.state.action)}
                confirmTitle={this.state.confirm_message}
                title = {this.state.confirm_alert_title}
              />
            )}

            {this.state.isUpdateConfirmModal && (
              <SystemConfirmJapanModal
                hideConfirm={this.confirmCancel.bind(this)}
                confirmCancel={this.confirmCancel.bind(this)}
                confirmOk={this.confirmSave.bind(this)}
                confirmTitle={this.state.confirm_message}
              />
            )}
            {this.state.alert_message != "" && (
              <ValidateAlertModal
                handleOk={this.closeAlertModal}
                alert_meassage={this.state.alert_message}
              />
            )}
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeThisModal}>キャンセル</Button>
          {this.props.from_source != 'bedside' && (
            <Button className={this.change_flag?'red-btn':'disable-btn'} onClick={this.save}>変更</Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

EditInspectionModal.contextType = Context;

EditInspectionModal.propTypes = {
  closeModal: PropTypes.func,
  schedule_item: PropTypes.array,
  handleOk: PropTypes.func,
  schedule_date: PropTypes.string,
  system_patient_id: PropTypes.number,
  patientInfo: PropTypes.object,
  temporary: PropTypes.bool,
  add_flag: PropTypes.bool,
  from_source : PropTypes.string,
};

export default EditInspectionModal;
