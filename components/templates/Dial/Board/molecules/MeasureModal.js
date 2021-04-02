import React, { Component } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import {
  formatDateTimeStr,
  formatDateTimeIE,
  formatTime
} from "../../../../../helpers/date";
import * as apiClient from "~/api/apiClient";
import $ from "jquery";
import {CACHE_SESSIONNAMES,
   // getServerTime
} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import { Modal } from "react-bootstrap";
import NumericInputWithUnitLabel from "../../../../molecules/NumericInputWithUnitLabel";
import DatePicker  from "react-datepicker";
import Checkbox from "~/components/molecules/Checkbox";
import CalcDialWithAlert from "~/components/molecules/CalcDialWithAlert";
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal'
import {
  addRedBorder,
  addRequiredBg,
  removeRequiredBg,
  removeRedBorder,
  toHalfWidthOnlyNumber
} from '~/helpers/dialConstants'
import Spinner from "react-bootstrap/Spinner";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width:100%;
  height:100%;
  font-size:1rem;
  overflow-x:auto;
  overflow-y: hidden;
  .flex {display:flex;}
  .td-select {
    width:3rem;
  }
  .td-time{
    width:5rem;
  }
  .td-ms_target_drainage{
    width:6rem;
  }
  .td-ms_drainage_cur_speed {
    width:5rem;
  }
  .td-ms_cur_drainage{
    width:6rem;
  }
  .td-ms_blood_target_flow{
    width:6rem;
  }
  .td-ms_blood_cur_flow {
    width:4rem;
  }
  .td-ms_syringe_speed {
    width:12rem;
  }
  .td-ms_venous_pressure{
    width:4rem;
  }
  .td-ms_fluid_pressure{
    width:5rem;
  }
  .td-ms_syringe_value {
    width:5rem;
  }
  .td-ms_dialysate_target_temperature {
    width:8rem;
  }
  .td-ms_dialysate_cur_temperature {
    width:6rem;
  }
  .td-ms_dialysate_target_concentration {
    width:8rem;
  }
  .td-ms_dialysate_cur_concentration {
    width:6rem;
  }
  .td-ms_tmp {
    width:4rem;
  }
  .td-ms_dializer_pressure {
    width:12rem;
  }
  .td-ms_arterial_pressure {
    width:4rem;
  }
  .td-ms_fluid_target_amount {
    width:6rem;
  }
  .td-ms_fluid_speed {
    width:5rem;
  }
  .td-ms_fluid_cur_amount {
    width:6rem;
  }
  .td-ms_fluid_target_temperature {
    width:7rem;
  }
  .td-ms_fluid_cur_temperature {
    width:5rem;
  }
  .td-ms_hdf_count {
    width:5rem;
  }
  .td-ms_hdf_amount {
    width:6rem;
  }
  .td-ms_emergency_amount {
    width:7rem;
  }
  .table-head {
    border:1px solid #dee2e6;
    .menu {
      border-right:1px solid #dee2e6;
      font-weight: 600;
    }
    .td-last {
      width: 17px;
      border-right: none;
    }
    .menu-title {
      height:2rem;
      line-height:2rem;
      border-bottom:1px solid #dee2e6;
      text-align:center;
    }
    .menu-unit {
      height:2rem;
      line-height:2rem;
      text-align:center;
    }
  }
  .table-body {
    border:1px solid #dee2e6;
    border-top:none;
    overflow-y: scroll;
    height: 450px;
    .div-tr {
      border-bottom:1px solid #dee2e6;
    }
    .div-td {
      border-right:1px solid #dee2e6;
      padding: 0.2rem;
      word-break: break-all;
      vertical-align: middle;
      div{margin-top:0;}
      input {
        text-align: right;
        font-size: 1rem;
      }
    }
    .td-staff {
      border-right: none;
      line-height: 2.3rem;
    }
    .react-datepicker-wrapper {
      .react-datepicker__input-container {
        input {
          width: 100%;
          border: solid 1px lightgray;
          height: 2.3rem;
          padding-left: 0.3rem;

        }
      }
    }
  }
  .table-check{
    width:3rem;
    input{
      width: 2rem !important;
      height: 2rem;
      &:before {
        left:0px;
      }
    }
    label {
      margin-right: 0;
    }
  }
  .numeric-td{
      position:relative;
      text-align:center;
      div{
        margin-top:0px;
        width: 100%;
      }
      b{
        display:none!important;
      }
    }
  .label-title {display: none;}
  .label-unit {display:none;}
  .react-numeric-input {
    width:100%;
    input {
      width: 100% !important;
      height:2.3rem;
    }
  }
  .table{
    width: 100%;
  }
  .no-result {
    padding-top: 15%;
    padding-bottom: 15%;
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .disabled-tr{
    background:lightgray;
  }  
`;

const ContextMenuUl = styled.ul`
  margin-bottom:0;
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
    line-height: 22px;
    margin: 0;
    padding: 0 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 10px;
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

const ContextMenu = ({ visible, x,  y,  parent, row_index, selected_item}) => {
  // let send_request = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"send_request");
  // let is_send = 0;
  // if (send_request != undefined && send_request != null && send_request === 1) is_send= 1;
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>          
          {parent.props.open_act != "from_console" && selected_item.is_saved && !(selected_item.ms_number>0) && (
            <li><div onClick={() => parent.contextMenuAction(row_index, "delete")}>{selected_item.is_enabled ==1?'削除':'削除取りやめ'}</div></li>
          )}
          {parent.props.open_act != "from_console" && selected_item.is_saved != 1 && !(selected_item.ms_number>0) && (
            <li><div onClick={() => parent.contextMenuAction(row_index, "new_delete")}>{'新規登録取りやめ'}</div></li>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class MeasureModal extends Component {
  constructor(props) {
    super(props);
    let rows = this.props.rows_measure;

    this.key_code = [];
    this.start_pos = [];
    
    this.state = {
      rows,
      send_request: 0,
      isDeleteConfirmModal: false,
      isBackConfirmModal: false,
      isOpenCalcModal: false,
      daysSelect: true,
      confirm_message: "",
      change_flag: false,
      alert_message: '',
      confirm_alert_title:'',
      top_warning_message:'',
      is_loaded:false,
      alert_messages: '',
      isSaveConfirmModal:false,
    };    
    this.measure_display_first_time = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").measure_display_first_time;
    this.measure_display_period_offset = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").measure_display_period_offset;
    this.dial_init_machine_get_time = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").dial_init_machine_get_time;
    this.measure_display_period = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").measure_display_period;
    this.dial_manual_import_restriction_unit_time = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").dial_manual_import_restriction_unit_time;
    this.dial_manual_import_restriction_times = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").dial_manual_import_restriction_times;
    if (this.measure_display_first_time == undefined) this.measure_display_first_time = 300;
    if (this.measure_display_period_offset == undefined) this.measure_display_period_offset = 0;
    if (this.dial_init_machine_get_time == undefined) this.dial_init_machine_get_time = 30;
    if (this.measure_display_period == undefined) this.measure_display_period = 60;
    if (this.dial_manual_import_restriction_times == undefined) this.dial_manual_import_restriction_times = 3;
    if (this.dial_manual_import_restriction_unit_time == undefined) this.dial_manual_import_restriction_unit_time = 30;
    this.double_click = false;
    
    this.graph_table_show = {
      ms_target_drainage: "ON",
      ms_drainage_cur_speed: "ON",
      ms_cur_drainage: "ON",
      ms_blood_cur_flow: "ON",
      ms_venous_pressure: "ON",
      ms_fluid_pressure: "ON",
      ms_dialysate_cur_temperature: "ON",
      ms_fluid_speed: "ON",
      ms_fluid_cur_amount: "ON",
      ms_hdf_count: "ON",
      ms_hdf_amount: "ON",
      input_time: "ON",
    }
    var graph_table_show = sessApi.getObjectValue(CACHE_SESSIONNAMES.INIT_STATUS,"conf_data").graph_table_show;
    if(graph_table_show != undefined && graph_table_show != null) this.graph_table_show = graph_table_show;
    this.table_width = 25;
    if(this.props.open_act == "from_console"){
      this.table_width += 3;
    }
    if(this.graph_table_show.ms_target_drainage == 'ON'){
      this.table_width += 6;
    }
    if(this.graph_table_show.ms_drainage_cur_speed == 'ON'){
      this.table_width += 5;
    }
    if(this.graph_table_show.ms_cur_drainage == 'ON'){
      this.table_width += 6;
    }
    if(this.graph_table_show.ms_blood_target_flow == 'ON'){
      this.table_width += 6;
    }
    if(this.graph_table_show.ms_blood_cur_flow == 'ON'){
      this.table_width += 4;
    }
    if(this.graph_table_show.ms_syringe_speed == 'ON'){
      this.table_width += 12;
    }
    if(this.graph_table_show.ms_venous_pressure == 'ON'){
      this.table_width += 4;
    }
    if(this.graph_table_show.ms_fluid_pressure == 'ON'){
      this.table_width += 5;
    }
    if(this.graph_table_show.ms_syringe_value == 'ON'){
      this.table_width += 5;
    }
    if(this.graph_table_show.ms_dialysate_target_temperature == 'ON'){
      this.table_width += 8;
    }
    if(this.graph_table_show.ms_dialysate_cur_temperature == 'ON'){
      this.table_width += 6;
    }
    if(this.graph_table_show.ms_dialysate_target_concentration == 'ON'){
      this.table_width += 8;
    }
    if(this.graph_table_show.ms_dialysate_cur_concentration == 'ON'){
      this.table_width += 6;
    }
    if(this.graph_table_show.ms_tmp == 'ON'){
      this.table_width += 4;
    }
    if(this.graph_table_show.ms_dializer_pressure == 'ON'){
      this.table_width += 12;
    }
    if(this.graph_table_show.ms_arterial_pressure == 'ON'){
      this.table_width += 4;
    }
    if(this.graph_table_show.ms_fluid_target_amount == 'ON'){
      this.table_width += 6;
    }
    if(this.graph_table_show.ms_fluid_speed == 'ON'){
      this.table_width += 5;
    }
    if(this.graph_table_show.ms_fluid_cur_amount == 'ON'){
      this.table_width += 6;
    }
    if(this.graph_table_show.ms_fluid_target_temperature == 'ON'){
      this.table_width += 7;
    }
    if(this.graph_table_show.ms_fluid_cur_temperature == 'ON'){
      this.table_width += 5;
    }
    if(this.graph_table_show.ms_hdf_count == 'ON'){
      this.table_width += 5;
    }
    if(this.graph_table_show.ms_hdf_amount == 'ON'){
      this.table_width += 6;
    }
    if(this.graph_table_show.ms_emergency_amount == 'ON'){
      this.table_width += 7;
    }

    let authinfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.insert_blank_row = {
      input_time: new Date(),
      ms_target_drainage: "",
      ms_blood_cur_flow: "",
      ms_cur_drainage: "",
      ms_blood_target_flow: '',
      ms_drainage_cur_speed: "",
      ms_syringe_speed: '',
      ms_syringe_value: '',
      ms_venous_pressure: "",
      ms_fluid_pressure: "",
      ms_dialysate_target_temperature:'',
      ms_dialysate_cur_temperature: "",
      ms_dialysate_target_concentration:'',
      ms_dialysate_cur_concentration:'',
      ms_tmp:'',
      ms_dializer_pressure: '',
      ms_arterial_pressure:'',
      ms_fluid_target_amount:'',
      ms_fluid_speed: "",
      ms_fluid_cur_amount: "",
      ms_fluid_target_temperature:'',
      ms_fluid_cur_temperature:'',
      ms_hdf_count: "",
      ms_hdf_amount: "",
      ms_emergency_amount:'',
      staff: authinfo.name,
      updated_by: authinfo.user_number,
    };
  }
  
  initialize=async(add_flag = true)=>{
    // let server_time = await getServerTime();
    var schedule_data = this.props.schedule_data;
    var current_date = schedule_data.schedule_date;
    let authinfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let dial_timezone = JSON.parse(window.sessionStorage.getItem("init_status"))
      .dial_timezone["timezone"];
    let base_value =
      dial_timezone != undefined &&
      dial_timezone != null &&
      dial_timezone[1] != undefined &&
      dial_timezone["1"] != null &&
      dial_timezone[1]["start"] != null &&
      dial_timezone[1]["start"] != ""
        ? dial_timezone[1]["start"]
        : "08:00";
    var base_hour = base_value.split(":")[0];
    var base_mins = base_value.split(":")[1];
    
    this.base_time_object = new Date(current_date);
    this.base_time_object.setHours(parseInt(base_hour));
    this.base_time_object.setMinutes(parseInt(base_mins));
    
    var cur_date = new Date(current_date);
    // var now = new Date(server_time);
    var now = new Date();
    cur_date.setHours(now.getHours());
    cur_date.setMinutes(now.getMinutes());
    cur_date.setSeconds(0);
    this.cur_date = cur_date;
    
    if (this.base_time_object.getTime() > cur_date.getTime()) {
      cur_date.setDate(cur_date.getDate() + 1);
    }
    
    var schedule_start_datetime = '';
    if (schedule_data.start_date != null) {
      schedule_start_datetime = schedule_data.start_date;
    } else {
      if(schedule_data.console_start_date != null) {
        schedule_start_datetime = schedule_data.console_start_date;
      }
    }
    
    this.schedule_start_datetime = new Date(formatDateTimeIE(schedule_start_datetime));    
    this.insert_blank_row = {
      input_time: cur_date,
      ms_target_drainage: "",
      ms_blood_cur_flow: "",
      ms_cur_drainage: "",
      ms_blood_target_flow: '',
      ms_drainage_cur_speed: "",
      ms_syringe_speed: '',
      ms_syringe_value: '',
      ms_venous_pressure: "",
      ms_fluid_pressure: "",
      ms_dialysate_target_temperature:'',
      ms_dialysate_cur_temperature: "",
      ms_dialysate_target_concentration:'',
      ms_dialysate_cur_concentration:'',
      ms_tmp:'',
      ms_dializer_pressure: '',
      ms_arterial_pressure:'',
      ms_fluid_target_amount:'',
      ms_fluid_speed: "",
      ms_fluid_cur_amount: "",
      ms_fluid_target_temperature:'',
      ms_fluid_cur_temperature:'',
      ms_hdf_count: "",
      ms_hdf_amount: "",
      ms_emergency_amount:'',
      staff: authinfo.name,
      updated_by: authinfo.user_number,
    };
    if (add_flag) {
      var temp = this.state.rows;
      temp.push(this.insert_blank_row);
      this.setState({rows:temp});
    }
  }
  
  async componentDidMount() {
    this.initialize(false);
    let schedule_data = this.props.schedule_data;
    if (schedule_data === undefined) {
      this.setState({is_loaded:true});
      return;
    }
    
    let path = "";
    if (this.props.open_act == "from_console") {
      path = "/app/api/v2/dial/board/get_console_measure_data";
    } else {
      path = "/app/api/v2/dial/board/get_console_measure_data";
      // path = "/app/api/v2/dial/board/get_request_data";
    }
    
    const post_data = {
      schedule_id: schedule_data.number,
      system_patient_id: schedule_data.system_patient_id,
      cur_day: schedule_data.schedule_date,
      // send_request:1
    };
    // if (this.props.open_act == "from_console") {
    //   post_data.send_request = 1;
    // }
    // let data = await apiClient.post(path, { params: post_data });
    await apiClient.post(path, { params: post_data }).then((res)=>{
      if (res) {
        let ms_data = res.ms_data;
        if (ms_data != undefined && ms_data != null && ms_data.length > 0){
          ms_data.map(item => {
            item.is_saved = 1;
          })
        }
        ms_data = this.remakeMeasureData(ms_data);
        this.setState({
          rows: ms_data,
          is_loaded: true
        })
      }
    }).catch(()=>{
      this.setState({is_loaded:true});
    }).finally(()=>{
      this.setState({is_loaded:true});
    });
  }
  
  remakeMeasureData = (ms_data) => {
    if (ms_data == undefined || ms_data == null || ms_data.length == 0) return ms_data;
    var count = 0;
    var first_check_count = 0;    
    ms_data.map(item => {
      if (this.props.open_act == "from_console"){
        if (!(item.input_time instanceof Date)) {
          item.input_time = formatDateTimeIE(item.input_time);
        }
        
        if (item.is_enabled == 1) item.yellow_data = 1;
        
        if (this.checkMeasureTime(item.input_time, ms_data)){
          item.first_data = 1;
        }

        if (item.input_time < this.schedule_start_datetime.getTime() + this.measure_display_first_time * 1000 && item.ms_number > 0){
          item.check_disabled = 1;
        }
        
        if ((item.input_time >= this.schedule_start_datetime.getTime() && item.ms_number == 0) ||
          (item.input_time >= this.schedule_start_datetime.getTime() + this.measure_display_first_time * 1000)){
          first_check_count++;
          if (first_check_count == 1) item.first_data = 1;
        }
        
        if (item.input_time >= this.schedule_start_datetime.getTime() + this.dial_init_machine_get_time *60*1000 - this.measure_display_period_offset * 1000){
          count++;
          if (count == 1) {
            item.first_data = 1;
          }
        }
        
      }
    })
    return ms_data;
  }
  
  getConsole = async () => {
    if (this.double_click == true) return;
    let schedule_data = this.props.schedule_data;
    if (schedule_data === undefined) {
      this.setState({is_loaded:true})
      return;
    }
    this.setState({is_loaded:false})
    let path = "/app/api/v2/dial/board/get_console_measure_data";
    const post_data = {
      schedule_id: schedule_data.number,
      system_patient_id: schedule_data.system_patient_id,
      cur_day: schedule_data.schedule_date,
      send_request: 1,
    };
    this.double_click = true;
    let data = await apiClient.post(path, { params: post_data }).finally(()=>{
      this.double_click = false;
    });
    if (data == undefined) {
      this.setState({is_loaded: true});
      return;
    }
    let ms_data = data.ms_data;
    let save_request = data.save_request;
    let new_data_count = data.new_data_count;
    if (save_request == true) {
      if (new_data_count != undefined && new_data_count == 0) {
        this.setState({
          is_loaded: true,
          // resend_request:true,
          alert_messages: 'コンソールへの計測値リクエストを登録しました。',
          alert_title: 'リクエスト登録完了'
        });
      } else {
        this.setState({
          alert_messages: 'コンソールへの計測値リクエストを登録しました。',
          alert_title: 'リクエスト登録完了',
          resend_request: false,
          is_loaded:true,
        });
        
      }
      return;
    } else {
      window.sessionStorage.setItem("alert_messages",  'リクエスト回数超過##' + '受信データの確認・取得のみ行いました。'+ '\n' +
        `手動リクエストは${this.dial_manual_import_restriction_unit_time}分間に${this.dial_manual_import_restriction_times}回まで登録できます。`);
    }
    if (ms_data == undefined || ms_data == null || ms_data.length == 0) {
      this.setState({is_loaded: true});
      return;
    }
    
    ms_data = this.remakeMeasureData(ms_data);
    
    this.setState({ rows: ms_data, change_flag:true, is_loaded:true });
  };
  getConsoleAndSaveData = async () => {
    let schedule_data = this.props.schedule_data;
    if (schedule_data === undefined) {
      return;
    }
    this.setState({is_loaded:false})
    let path = "/app/api/v2/dial/board/get_console_measure_data";
    const post_data = {
      schedule_id: schedule_data.number,
      system_patient_id: schedule_data.system_patient_id,
      cur_day: schedule_data.schedule_date,
      save_data: 1,
    };
    let data = await apiClient.post(path, { params: post_data });
    if (data == undefined) {
      this.setState({is_loaded: true});
      return;
    }
    let ms_data = data.ms_data;
    if (data.new_data_count != undefined && data.new_data_count == 0) {
      this.setState({resend_request: true});
    }
    if (ms_data == undefined || ms_data == null || ms_data.length == 0) {
      this.setState({is_loaded: true});
      return;
    }
    var count = 0;
    var first_check_count = 0;
    ms_data.map(item => {
      if (this.props.open_act == "from_console"){
        if (!(item.input_time instanceof Date)) {
          item.input_time = formatDateTimeIE(item.input_time);
        }
        
        if (item.is_enabled == 1) item.yellow_data = 1;
        
        if (this.checkMeasureTime(item.input_time, ms_data)){
          item.first_data = 1;
        }

        if (item.input_time < this.schedule_start_datetime.getTime() + this.measure_display_first_time * 1000 && item.ms_number > 0){
          item.check_disabled = 1;
        }
        
        if ((item.input_time >= this.schedule_start_datetime.getTime() && item.ms_number == 0) ||
          (item.input_time >= this.schedule_start_datetime.getTime() + this.measure_display_first_time * 1000)){
          first_check_count++;
          if (first_check_count == 1) item.first_data = 1;
        }
        
        if (item.input_time >= this.schedule_start_datetime.getTime() + this.dial_init_machine_get_time *60*1000 - this.measure_display_period_offset * 1000){
          count++;
          if (count == 1) {
            item.first_data = 1;
          }
        }
      }
    })
    this.setState({ rows: ms_data, change_flag:true, is_loaded:true });
  };
  
  getResendConsole = async () => {
    let schedule_data = this.props.schedule_data;
    if (schedule_data === undefined) {
      return;
    }
    this.setState({is_loaded:false})
    let path = "/app/api/v2/dial/board/get_console_measure_data";
    const post_data = {
      schedule_id: schedule_data.number,
      system_patient_id: schedule_data.system_patient_id,
      cur_day: schedule_data.schedule_date,
      send_request: 1,
    };
    let data = await apiClient.post(path, { params: post_data });
    if (data == undefined) {
      this.setState({is_loaded: true});
      return;
    }
    let ms_data = data.ms_data;
    
    if (ms_data == undefined || ms_data == null || ms_data.length == 0) {
      this.setState({is_loaded: true});
      return;
    }
    
    ms_data = this.remakeMeasureData(ms_data);
    
    this.setState({ rows: ms_data, change_flag:true, is_loaded:true });
  };
  
  getRadio = async (index, name, value) => {
    if (name === "check") {
      let table_data = this.state.rows;
      if (table_data[index] != null) {
        if (!(table_data[index].yellow_data == 1)){
          table_data[index].new_yellow = value;
        }
        table_data[index].is_enabled = value;
        this.setState({ rows: table_data, change_flag:true });
      }
    }
  };
  
  register = () => {
    let temp_row = this.state.rows;
    let last_row = temp_row[temp_row.length - 1];
    if (
      last_row != undefined &&
      last_row != null &&
      last_row.ms_target_drainage == "" &&
      last_row.ms_blood_cur_flow == "" &&
      last_row.ms_cur_drainage == "" &&
      last_row.ms_blood_target_flow == "" &&
      last_row.ms_syringe_speed == '' &&
      last_row.ms_syringe_value == '' &&
      last_row.ms_drainage_cur_speed == "" &&
      last_row.ms_venous_pressure == "" &&
      last_row.ms_fluid_pressure == "" &&
      last_row.ms_dialysate_target_temperature == "" &&
      last_row.ms_dialysate_cur_temperature == "" &&
      last_row.ms_dialysate_target_concentration == "" &&
      last_row.ms_dialysate_cur_concentration == "" &&
      last_row.ms_tmp == '' &&
      last_row.ms_dializer_pressure == '' &&
      last_row.ms_arterial_pressure == '' &&
      last_row.ms_fluid_target_amount == '' &&
      last_row.ms_fluid_speed == "" &&
      last_row.ms_fluid_cur_amount == "" &&
      last_row.ms_fluid_target_temperature == '' &&
      last_row.ms_fluid_cur_temperature == '' &&
      last_row.ms_hdf_count == "" &&
      last_row.ms_hdf_amount == "" &&
      last_row.ms_emergency_amount == ''
    )
      return;
    
    this.initialize();    
    this.setState({ change_flag: true });
    
  };
  handleOk = () => {
    if (this.state.change_flag != true) return;    
    let error_str_array = [];
    let save_data = [...this.state.rows];
    if (save_data == null || save_data.length == 0) {
      // this.props.closeModal();
      return;
    }
    let first_tag_id = '';
    // var check_data_before_schedule = false;
    this.save_rows = [];
    save_data.map((item, index) => {
      // if (item.input_time.getTime() < this.schedule_start_datetime.getTime()) {
      //   check_data_before_schedule = true;
      // } else {
        this.save_rows.push(item);
      // }

      Object.keys(this.insert_blank_row).map(key=>{
        if (key != "input_time" || key != "staff" || key != "updated_by" || key != 'input_time_value') {
          removeRedBorder( key + "_" + index);
        }
      });
      if (item.input_time != null && item.input_time instanceof Date)
        item.input_time = formatDateTimeStr(item.input_time);
      let all_null = 1;
      Object.keys(this.insert_blank_row).map(key=>{
        if (key != "input_time" && key != "staff" && key != "updated_by" && key !='input_time_value') {
          if (item[key] != '') all_null = 0;
        }
      });
      if (all_null === 1) {
        Object.keys(this.insert_blank_row).map(key=>{
          if (key != "input_time" && key != "staff" && key != "updated_by" && key !='input_time_value') {
            addRedBorder( key + "_" + index);
            if (first_tag_id == '') first_tag_id = key + "_" + index;
          }
        });
        error_str_array.push("計測値を入力してください。");
      }
    });
    if (first_tag_id != "") {
      this.setState({ first_tag_id: first_tag_id });
    }
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }

    this.setState({
      isSaveConfirmModal:true,
      // confirm_message:check_data_before_schedule
      //   ?'このまま変更内容を登録しますか？\n（開始時刻以前の手入力値は計測値一覧に表示されません）'
      //   :'変更内容を登録しますか？',
      confirm_alert_title:'登録確認',
      confirm_message:'変更内容を登録しますか？',
      // top_warning_message:check_data_before_schedule?'開始より前の時刻の行があります。':''
    })
  };

  confirmSaveOk = () => {
    this.props.handleOk(this.save_rows);
    window.sessionStorage.setItem("alert_messages",  '登録完了##' + '登録しました。');
  }
  
  handleClick = (e, index, item) => {
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
          contextMenu: { visible: false },
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      document
        .getElementById("state-get-body")
        .addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu: { visible: false },
          });
          document
            .getElementById("state-get-body")
            .removeEventListener(`scroll`, onScrollOutside);
        });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - $("#state-get-body").offset().left,
          y: e.clientY - $("#state-get-body").offset().top - 40,
        },
        row_index: index,
        selected_item:item,
      });
    }
  };
  
  contextMenuAction = (index, type) => {    
    if (type === "delete") {
      var rows = this.state.rows;
      var item = rows[index];
      this.setState({
        context_action_type:type,
        selected_index: index,        
        isDeleteConfirmModal: true,
        confirm_message: item.is_enabled? "削除しますか？" :'削除取りやめしますか？',
      });
    }
    if (type == 'new_delete'){
      this.setState({
        context_action_type:type,
        selected_index: index,        
        isDeleteConfirmModal: true,
        confirm_message: '登録を取りやめて行を削除しますか？',
        confirm_alert_title:'削除確認'
      });      
    }
  };
  confirmCancel() {
    this.setState({
      isBackConfirmModal: false,
      isDeleteConfirmModal: false,
      isSaveConfirmModal:false,
      confirm_message: "",
      confirm_alert_title:'',
      top_warning_message:''
    });
  }
  closeModal = () => {
    if (this.state.change_flag) {
      this.setState({
        isBackConfirmModal: true,
        confirm_message:
          "登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_alert_title:'入力中'
      });
    } else {
      this.props.closeModal();
    }
  };
  deleteData = () => {
    this.confirmCancel();
    let {context_action_type, rows, selected_index } = this.state;
    if (context_action_type == 'delete'){
      if (rows[selected_index].is_enabled == 1) {
        rows[selected_index].is_enabled = 0;
      } else {        
        rows[selected_index].is_enabled = 1;
      }
    }
    if (context_action_type == 'new_delete'){
      rows.splice(selected_index, 1);
    }
    this.setState({ rows });
    this.setState({ change_flag: true });
  };
  
  onHide = () => {};
  
  setValue = (sub_key, index, value) => {
    let authinfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (sub_key == "staff") return;
    if (sub_key != "ms_venous_pressure" && sub_key != "ms_fluid_pressure") {
      value = parseFloat(value) < 0 ? 0 : value;
    }
    let rows = this.state.rows;
    rows[index][sub_key] = value;
    rows[index]["updated_by"] = authinfo.user_number;
    rows[index]["staff"] = authinfo.name;
    this.setState({ rows });
    this.setState({change_flag: true});
  };

  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }

  setDate = (index, value, e) => {       
    let authinfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");    
    let rows = this.state.rows;
    var value_time_object = new Date(schedule_date);
    if (e == undefined){
      value_time_object.setMinutes(value.getMinutes());
      value_time_object.setHours(value.getHours());
      if (this.base_time_object.getTime() > value_time_object.getTime()) {
        value_time_object.setDate(value_time_object.getDate() + 1);
      }
  
      rows[index]["input_time"] = value_time_object;
      rows[index]["input_time_value"] = formatTime(value_time_object);
      rows[index]["updated_by"] = authinfo.user_number;
      rows[index]["staff"] = authinfo.name;
      this.setState({
        rows,
        change_flag: true,
      });
      return;
    }

    var input_value = e.target.value;

    input_value = input_value.replace(/[^0-9０-９]/g, '');
    if (input_value.length > 4) return;
    input_value = toHalfWidthOnlyNumber(input_value);    

    if(input_value.length >= 2 ){
      input_value = this.insertStrTimeStyle(input_value);
    }

    if (input_value.length == 5) this.setTime(index, e);
    
    rows[index]['input_time_value'] = input_value;
    this.setState({
      rows
    }, () => {
      var obj = document.getElementById('time_id_' + index);
      if (this.key_code[index] == 46){        
        obj.setSelectionRange(this.start_pos[index], this.start_pos[index]);
      }
      if (this.key_code[index] == 8){        
        obj.setSelectionRange(this.start_pos[index] - 1, this.start_pos[index] - 1);
      }
    })    
  };

  timeKeyEvent = (index, e) => {    
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;    
    this.key_code[index] = key_code;
    this.start_pos[index] = start_pos;
    var obj = document.getElementById('time_id_' + index);

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
      this.setTime(index, e);
      return;
    }

    var rows = this.state.rows;
    
    if (key_code == 8){          
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        rows[index]['input_time_value'] = ''
        this.setState({rows}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        rows[index]['input_time_value'] = input_value;
        this.setState({rows}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){        
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);
        rows[index]['input_time_value'] = input_value;
        this.setState({
          rows
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        rows[index]['input_time_value'] = input_value;
        this.setState({
          rows
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){        
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        rows[index]['input_time_value'] = input_value;
        this.setState({
          rows
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){
        rows[index]['input_time_value'] = '';
        this.setState({rows}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){
          rows[index]['input_time_value'] = input_value.slice(1,2);
          this.setState({
            rows
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){
          rows[index]['input_time_value'] = input_value.slice(0,1);
          this.setState({
            rows
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }    
    if (key_code != 8 && key_code != 46){
      rows[index]['input_time_value'] = input_value;
      this.setState({
        rows
      })
    }
  }

  setTime = (index, e) => {
    let authinfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let schedule_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");    
    let rows = this.state.rows;
    var value_time_object = new Date(schedule_date);
      
    rows[index]["updated_by"] = authinfo.user_number;
    rows[index]["staff"] = authinfo.name;    
    if (e.target.value.length != 5) {
      rows[index]["input_time"] = this.cur_date;
      rows[index]["input_time_value"] = formatTime(this.cur_date);
      this.setState({
        rows,
        change_flag: true,
      });
      return;
    }
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];    
    if (hours > 23 || mins > 60){
      rows[index]["input_time"] = this.cur_date;
      rows[index]["input_time_value"] = formatTime(this.cur_date);
      this.setState({
        rows,
        change_flag: true,
      })      
      return;
    }    
    value_time_object.setMinutes(mins);
    value_time_object.setHours(hours);
    if (this.base_time_object.getTime() > value_time_object.getTime()) {
      value_time_object.setDate(value_time_object.getDate() + 1);
    }
  
    rows[index]["input_time"] = value_time_object;
    this.setState({rows, change_flag:true})
  }
  
  openCalc = (type, title, val, maxLength, index, daysSelect, decimalPointDigits = 0) => {
    let minus_type = false;
    if (type == "ms_venous_pressure" || type == "ms_fluid_pressure")
      minus_type = true;
    this.setState({
      calcInit: val != undefined && val != null ? val : 0,
      calcValType: type,
      calcTitle: title,
      calcUnit: "",
      calcIndex: index,
      calcDigits: maxLength,
      daysSelect: daysSelect,
      isOpenCalcModal: true,
      minus_type,
      decimalPointDigits
    });
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
    if (this.state.calcValType == "") {
      _state.amount = val;
    }
    let rows = this.state.rows;
    rows[this.state.calcIndex][this.state.calcValType] = val;
    _state.rows = rows;
    _state.calcValType = "";
    _state.calcTitle = "";
    _state.calcUnit = "";
    _state.calcInit = 0;
    this.setState(_state);
    this.setState({ change_flag: true });
  };
  
  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };
  
  componentDidUpdate () {
    this.changeBackground();
    // $('.yellow td').css('background-color', 'yellow');
    // $('.first-data td').css('background-color', '#FFE3E8');
    $('div.yellow').css('background-color', '#FFE3E8');
    $('div.first-data').css('background-color', 'yellow');    
  }
  closeAlertModal = () => {
    this.setState({alert_message: ''});
    if(this.state.first_tag_id  != ''){
      let first_tag_id = this.state.first_tag_id;
      $("#" + first_tag_id).focus();
    }
  }
  changeBackground = () => {
    let save_data = [...this.state.rows];
    if (save_data == null || save_data.length == 0) {
      return;
    }
    save_data.map((item, index) => {
      let all_null = 1;
      if (this.insert_blank_row != undefined && this.insert_blank_row != null){
        Object.keys(this.insert_blank_row).map(key=>{
          if (key != "input_time" && key != "staff" && key != "updated_by" && key!= 'input_time_value') {
            if (item[key] != '') {
              all_null = 0;
            }
          }
        });
        if (all_null === 1) {
          Object.keys(this.insert_blank_row).map(key=>{
            if (key != "input_time" && key != "staff" && key != "updated_by" ) {
              addRequiredBg( key + "_" + index);
            }
          });
        } else {
          Object.keys(this.insert_blank_row).map(key=>{
            if (key != "input_time" && key != "staff" && key != "updated_by" ) {
              removeRequiredBg( key + "_" + index);
            }
          });
        }
      }
      
    });
  }
  
  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };
  
  checkMeasureTime = (input_time, ms_data) => {
    if (input_time.getTime() < this.schedule_start_datetime.getTime()) return 0;
    var difference_hours = (input_time.getTime() - this.schedule_start_datetime.getTime() + this.measure_display_period_offset * 1000)/(this.measure_display_period*60*1000) + 1;
    difference_hours = Math.floor(difference_hours);
    if ((difference_hours-1) * 60 < this.measure_display_period) return 0;
    var criteria = this.schedule_start_datetime.getTime() + (difference_hours - 1) * this.measure_display_period * 60 * 1000 - this.measure_display_period_offset * 1000;
    var rows = ms_data;
    var index = 0;
    rows.map(item => {
      if (!(item.input_time instanceof Date)) {
        item.input_time = formatDateTimeIE(item.input_time);
      }
      if (item.input_time.getTime() >= criteria && item.input_time.getTime() <= input_time.getTime()){
        index++;
      }
    })
    if (index == 1) return 1; else return 0;
  }
  
  async closeSystemAlertModal () {
    this.setState({alert_messages: ''});
    // 新データがなかった場合に、計測値モーダルを開いたままなら3秒後と6秒後に1回、キュー登録をしない装置状態テーブル取得を行うように。2020-09-03
    await this.getConsoleAndSaveData();
    if (this.state.resend_request == true) {
      setTimeout(()=>{
        if(document.getElementsByClassName("measure-modal")[0] != undefined)
          this.getResendConsole();
      }, 3000);
      setTimeout(()=>{
        if(document.getElementsByClassName("measure-modal")[0] != undefined)
          this.getResendConsole();
      }, 6000);
      this.setState({
        resend_request: false,
      })
    }
  }
  
  render() {
    const { open_act } = this.props;
    let { rows } = this.state;    
    // let message;
    // if (rows == null || rows.length == 0) {
    //   message = (
    //     <div className="no-result">
    //       <span>計測値データがありません</span>
    //     </div>
    //   );
    // }
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        className="master-modal measure-modal first-view-modal"
        id="state-get-body"
      >
        <Modal.Header>
          <Modal.Title>
            {open_act == "from_console" ? "計測値一覧" : "計測値入力"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'table-head flex'} style={{width:this.table_width+"rem"}}>
              {this.props.open_act == "from_console" && (
                <div className="menu td-select">
                  <div className={'menu-title'}>選択</div>
                  <div className={'menu-unit'}> </div>
                </div>
              )}
              <div className="menu td-time">
                <div className={'menu-title'}>入力時間</div>
                <div className={'menu-unit'}> </div>
              </div>
              {this.graph_table_show.ms_target_drainage == 'ON' && (
                <div className="menu td-ms_target_drainage">
                  <div className={'menu-title'}>除水量設定</div>
                  <div className={'menu-unit'}>L</div>
                </div>
              )}
              {this.graph_table_show.ms_drainage_cur_speed == 'ON' && (
                <div className="menu td-ms_drainage_cur_speed">
                  <div className={'menu-title'}>除水速度</div>
                  <div className={'menu-unit'}>L/h</div>
                </div>
              )}
              {this.graph_table_show.ms_cur_drainage == 'ON' && (
                <div className="menu td-ms_cur_drainage">
                  <div className={'menu-title'}>除水量積算</div>
                  <div className={'menu-unit'}>L</div>
                </div>
              )}
              {this.graph_table_show.ms_blood_target_flow == 'ON' && (
                <div className="menu td-ms_blood_target_flow">
                  <div className={'menu-title'}>血流量設定</div>
                  <div className={'menu-unit'}>mL/min</div>
                </div>
              )}
              {this.graph_table_show.ms_blood_cur_flow == 'ON' && (
                <div className="menu td-ms_blood_cur_flow">
                  <div className={'menu-title'}>血流量</div>
                  <div className={'menu-unit'}>mL/min</div>
                </div>
              )}
              {this.graph_table_show.ms_syringe_speed == 'ON' && (
                <div className="menu td-ms_syringe_speed">
                  <div className={'menu-title'}>シリンジポンプ速度設定</div>
                  <div className={'menu-unit'}>mL/h</div>
                </div>
              )}
              {this.graph_table_show.ms_venous_pressure == 'ON' && (
                <div className="menu td-ms_venous_pressure">
                  <div className={'menu-title'}>静脈圧</div>
                  <div className={'menu-unit'}>mmHg</div>
                </div>
              )}
              {this.graph_table_show.ms_fluid_pressure == 'ON' && (
                <div className="menu td-ms_fluid_pressure">
                  <div className={'menu-title'}>透析液圧</div>
                  <div className={'menu-unit'}>mmHg</div>
                </div>
              )}
              {this.graph_table_show.ms_syringe_value == 'ON' && (
                <div className="menu td-ms_syringe_value">
                  <div className={'menu-title'}>SP積算</div>
                  <div className={'menu-unit'}>mL</div>
                </div>
              )}
              {this.graph_table_show.ms_dialysate_target_temperature == 'ON' && (
                <div className="menu td-ms_dialysate_target_temperature">
                  <div className={'menu-title'}>透析液温度設定</div>
                  <div className={'menu-unit'}>℃</div>
                </div>
              )}
              {this.graph_table_show.ms_dialysate_cur_temperature == 'ON' && (
                <div className="menu td-ms_dialysate_cur_temperature">
                  <div className={'menu-title'}>透析液温度</div>
                  <div className={'menu-unit'}>℃</div>
                </div>
              )}
              {this.graph_table_show.ms_dialysate_target_concentration == 'ON' && (
                <div className="menu td-ms_dialysate_target_concentration">
                  <div className={'menu-title'}>透析液濃度設定</div>
                  <div className={'menu-unit'}>mS/cm</div>
                </div>
              )}
              {this.graph_table_show.ms_dialysate_cur_concentration == 'ON' && (
                <div className="menu td-ms_dialysate_cur_concentration">
                  <div className={'menu-title'}>透析液濃度</div>
                  <div className={'menu-unit'}>mS/cm</div>
                </div>
              )}
              {this.graph_table_show.ms_tmp == 'ON' && (
                <div className="menu td-ms_tmp">
                  <div className={'menu-title'}>TMP</div>
                  <div className={'menu-unit'}>mmHg</div>
                </div>
              )}
              {this.graph_table_show.ms_dializer_pressure == 'ON' && (
                <div className="menu td-ms_dializer_pressure">
                  <div className={'menu-title'}>ダイアライザ血液入口圧</div>
                  <div className={'menu-unit'}>mmHg</div>
                </div>
              )}
              {this.graph_table_show.ms_arterial_pressure == 'ON' && (
                <div className="menu td-ms_arterial_pressure">
                  <div className={'menu-title'}>脱血圧</div>
                  <div className={'menu-unit'}>mmHg</div>
                </div>
              )}
              {this.graph_table_show.ms_fluid_target_amount == 'ON' && (
                <div className="menu td-ms_fluid_target_amount">
                  <div className={'menu-title'}>目標補液量</div>
                  <div className={'menu-unit'}>L</div>
                </div>
              )}
              {this.graph_table_show.ms_fluid_speed == 'ON' && (
                <div className="menu td-ms_fluid_speed">
                  <div className={'menu-title'}>補液速度</div>
                  <div className={'menu-unit'}>mL/min</div>
                </div>
              )}
              {this.graph_table_show.ms_fluid_cur_amount == 'ON' && (
                <div className="menu td-ms_fluid_cur_amount">
                  <div className={'menu-title'}>補液量積算</div>
                  <div className={'menu-unit'}>L</div>
                </div>
              )}
              {this.graph_table_show.ms_fluid_target_temperature == 'ON' && (
                <div className="menu td-ms_fluid_target_temperature">
                  <div className={'menu-title'}>補液温度設定</div>
                  <div className={'menu-unit'}>℃</div>
                </div>
              )}
              {this.graph_table_show.ms_fluid_cur_temperature == 'ON' && (
                <div className="menu td-ms_fluid_cur_temperature">
                  <div className={'menu-title'}>補液温度</div>
                  <div className={'menu-unit'}>℃</div>
                </div>
              )}
              {this.graph_table_show.ms_hdf_count == 'ON' && (
                <div className="menu td-ms_hdf_count">
                  <div className={'menu-title'}>補液回数</div>
                  <div className={'menu-unit'}>回</div>
                </div>
              )}
              {this.graph_table_show.ms_hdf_amount == 'ON' && (
                <div className="menu td-ms_hdf_amount">
                  <div className={'menu-title'}>総補液積算</div>
                  <div className={'menu-unit'}>L</div>
                </div>
              )}
              {this.graph_table_show.ms_emergency_amount == 'ON' && (
                <div className="menu td-ms_emergency_amount">
                  <div className={'menu-title'}>緊急総補液量</div>
                  <div className={'menu-unit'}>mL</div>
                </div>
              )}
              <div className={'menu td-staff'} style={{width:("calc(20rem - 17px)")}}>
                <div className={'menu-title'}>スタッフ</div>
                <div className={'menu-unit'}> </div>
              </div>
              <div className={'menu td-last'}> </div>
            </div>
            <div className={'table-body'} style={{width:this.table_width+"rem"}}>
              {this.state.is_loaded == true ? (
                <>
                  {rows !== undefined && rows != null && rows.length > 0 && (
                    rows.map((item, index) => {
                      if (!(item.input_time instanceof Date)) {
                        item.input_time = formatDateTimeIE(item.input_time);
                      }
                      var display_flag = false;
                      if (item.input_time.getTime() >= this.schedule_start_datetime.getTime() && open_act == 'from_console') display_flag = true;
                      if (open_act != 'from_console') display_flag = true;
                      if (display_flag){
                        var tr_class = '';                        
                        if (item.new_yellow) tr_class = 'yellow';
                        if (item.yellow_data) tr_class = 'yellow';
                        if (item.first_data) tr_class = 'first-data';
                        if (open_act != 'from_console' && item.is_enabled != 1 && !(item.ms_number>0)) tr_class = 'disabled-tr';                        
                        return (
                          <div key={index} onContextMenu={(e) => this.handleClick(e, index, item)} className={"div-tr flex " + tr_class}>
                            {this.props.open_act == "from_console" && (
                              <div className="div-td text-center td-select table-check">
                                <Checkbox
                                  label=""
                                  getRadio={this.getRadio.bind(this, index)}
                                  value={item.is_enabled == 1 && !item.check_disabled}
                                  name="check"
                                  isDisabled = {item.check_disabled}
                                />
                              </div>
                            )}
                            <div className="div-td td-time">
                              <DatePicker
                                selected={item["input_time"]}
                                onChange={this.setDate.bind(this,index)}
                                onKeyDown = {this.timeKeyEvent.bind(this, index)}
                                onBlur = {this.setTime.bind(this, index)}
                                value = {item.input_time_value}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption="時間"
                                disabled = {item.check_disabled || item.ms_number > 0}
                                id = {"time_id_" + index}
                              />
                            </div>
                            {this.graph_table_show.ms_target_drainage == 'ON' && (
                              <div className="div-td td-ms_target_drainage numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  inputmode="numeric"
                                  precision = {2}
                                  step={0.1}
                                  min={0}
                                  value={rows[index]["ms_target_drainage"]}
                                  unit = 'L'
                                  onClickEvent={() =>this.openCalc("ms_target_drainage","除水量設定",rows[index]["ms_target_drainage"],4,index,false,2,)}
                                  getInputText={this.setValue.bind(this,"ms_target_drainage",index)}
                                  id={"ms_target_drainage_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_drainage_cur_speed == 'ON' && (
                              <div className="div-td td-ms_drainage_cur_speed numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision = {2}
                                  min={0}
                                  step={0.1}
                                  inputmode="numeric"
                                  value={rows[index]["ms_drainage_cur_speed"]}
                                  unit = 'L/h'
                                  onClickEvent={() =>this.openCalc("ms_drainage_cur_speed","除水速度",rows[index]["ms_drainage_cur_speed"],4,index,false,2)}
                                  getInputText={this.setValue.bind(this,"ms_drainage_cur_speed",index)}
                                  id={"ms_drainage_cur_speed_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_cur_drainage == 'ON' && (
                              <div className="div-td td-ms_cur_drainage numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision = {2}
                                  min={0}
                                  step={0.1}
                                  inputmode="numeric"
                                  value={rows[index]["ms_cur_drainage"]}
                                  unit = 'L'
                                  onClickEvent={() =>this.openCalc("ms_cur_drainage","除水量積算",rows[index]["ms_cur_drainage"],4,index,false,2)}
                                  getInputText={this.setValue.bind(this,"ms_cur_drainage",index)}
                                  id={"ms_cur_drainage_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_blood_target_flow == 'ON' && (
                              <div className='div-td td-ms_blood_target_flow numeric-td'>
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision={0}
                                  min={0}
                                  inputmode="numeric"
                                  value={rows[index]["ms_blood_target_flow"]}
                                  unit = 'mL/min'
                                  onClickEvent={() =>this.openCalc("ms_blood_target_flow","血流量設定",rows[index]["ms_blood_target_flow"],3,index,false,)}
                                  getInputText={this.setValue.bind(this,"ms_blood_target_flow",index)}
                                  id={"ms_blood_target_flow_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_blood_cur_flow == 'ON' && (
                              <div className="div-td td-ms_blood_cur_flow numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision={0}
                                  min={0}
                                  inputmode="numeric"
                                  value={rows[index]["ms_blood_cur_flow"]}
                                  unit = 'mL/min'
                                  onClickEvent={() =>this.openCalc("ms_blood_cur_flow","血流量",rows[index]["ms_blood_cur_flow"],3,index,false,)}
                                  getInputText={this.setValue.bind(this,"ms_blood_cur_flow",index)}
                                  id={"ms_blood_cur_flow_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_syringe_speed == 'ON' && (
                              <div className="div-td td-ms_syringe_speed numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision={1}
                                  min={0}
                                  step={0.1}
                                  inputmode="numeric"
                                  value={rows[index]["ms_syringe_speed"]}
                                  unit = 'mL/h'
                                  onClickEvent={() =>this.openCalc("ms_syringe_speed","シリンジポンプ速度設定",rows[index]["ms_syringe_speed"],3,index,false,)}
                                  getInputText={this.setValue.bind(this,"ms_syringe_speed",index)}
                                  id={"ms_syringe_speed_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_venous_pressure == 'ON' && (
                              <div className="div-td td-ms_venous_pressure numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  inputmode="numeric"
                                  precision={0}
                                  value={rows[index]["ms_venous_pressure"]}
                                  unit = 'mmHg'
                                  onClickEvent={() =>this.openCalc("ms_venous_pressure","静脈圧",rows[index]["ms_venous_pressure"],4,index,true,0)}
                                  getInputText={this.setValue.bind(this,"ms_venous_pressure",index)}
                                  id={"ms_venous_pressure_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_fluid_pressure == 'ON' && (
                              <div className="div-td td-ms_fluid_pressure numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision={0}
                                  inputmode="numeric"
                                  value={rows[index]["ms_fluid_pressure"]}
                                  unit = 'mmHg'
                                  onClickEvent={() =>this.openCalc("ms_fluid_pressure","透析液圧",rows[index]["ms_fluid_pressure"],6,index,true)}
                                  getInputText={this.setValue.bind(this,"ms_fluid_pressure",index)}
                                  id={"ms_fluid_pressure_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_syringe_value == 'ON' && (
                              <div className="div-td td-ms_syringe_value numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision={1}
                                  min={0}
                                  step={0.1}
                                  inputmode="numeric"
                                  value={rows[index]["ms_syringe_value"]}
                                  unit = 'mL'
                                  onClickEvent={() =>this.openCalc("ms_syringe_value","SP積算",rows[index]["ms_syringe_value"],3,index,false,1)}
                                  getInputText={this.setValue.bind(this,"ms_syringe_value",index)}
                                  id={"ms_syringe_value_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_dialysate_target_temperature == 'ON' && (
                              <div className="div-td td-ms_dialysate_target_temperature numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision={1}
                                  step={0.1}
                                  inputmode="numeric"
                                  value={rows[index]["ms_dialysate_target_temperature"]}
                                  unit = '℃'
                                  onClickEvent={() =>this.openCalc("ms_dialysate_target_temperature","透析液温度設定",rows[index]["ms_dialysate_target_temperature"],4,index,false,1)}
                                  getInputText={this.setValue.bind(this,"ms_dialysate_target_temperature",index)}
                                  id={"ms_dialysate_target_temperature_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_dialysate_cur_temperature == 'ON' && (
                              <div className="div-td td-ms_dialysate_cur_temperature numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision = {1}
                                  inputmode="numeric"
                                  unit = '℃'
                                  value={rows[index]["ms_dialysate_cur_temperature"]}
                                  onClickEvent={() =>this.openCalc("ms_dialysate_cur_temperature","透析液温度",rows[index]["ms_dialysate_cur_temperature"],4,index,false,1)}
                                  min={0}
                                  step={0.1}
                                  getInputText={this.setValue.bind(this,"ms_dialysate_cur_temperature",index)}
                                  id={"ms_dialysate_cur_temperature_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_dialysate_target_concentration == 'ON' && (
                              <div className="div-td td-ms_dialysate_target_concentration numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision = {1}
                                  inputmode="numeric"
                                  unit = 'mS/cm'
                                  value={rows[index]["ms_dialysate_target_concentration"]}
                                  onClickEvent={() =>this.openCalc("ms_dialysate_target_concentration","透析液濃度設定",rows[index]["ms_dialysate_target_concentration"],4,index,false,1)}
                                  min={0}
                                  step={0.1}
                                  getInputText={this.setValue.bind(this,"ms_dialysate_target_concentration",index)}
                                  id={"ms_dialysate_target_concentration_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_dialysate_cur_concentration == 'ON' && (
                              <div className="div-td td-ms_dialysate_cur_concentration numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision = {1}
                                  inputmode="numeric"
                                  unit = 'mS/cm'
                                  value={rows[index]["ms_dialysate_cur_concentration"]}
                                  onClickEvent={() =>this.openCalc("ms_dialysate_cur_concentration","透析液濃度",rows[index]["ms_dialysate_cur_concentration"],4,index,false,1)}
                                  min={0}
                                  step={0.1}
                                  getInputText={this.setValue.bind(this,"ms_dialysate_cur_concentration",index)}
                                  id={"ms_dialysate_cur_concentration_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_tmp == 'ON' && (
                              <div className="div-td td-ms_tmp numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision = {0}
                                  inputmode="numeric"
                                  unit = 'mmHg'
                                  value={rows[index]["ms_tmp"]}
                                  onClickEvent={() =>this.openCalc("ms_tmp","TMP",rows[index]["ms_tmp"],4,index,false)}
                                  min={0}
                                  // step={0.1}
                                  getInputText={this.setValue.bind(this,"ms_tmp",index)}
                                  id={"ms_tmp_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_dializer_pressure == 'ON' && (
                              <div className="div-td td-ms_dializer_pressure numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision = {0}
                                  inputmode="numeric"
                                  unit = 'mmHg'
                                  value={rows[index]["ms_dializer_pressure"]}
                                  onClickEvent={() =>this.openCalc("ms_dializer_pressure","ダイアライザ血液入口圧",rows[index]["ms_dializer_pressure"],4,index,false)}
                                  min={0}
                                  // step={0.1}
                                  getInputText={this.setValue.bind(this,"ms_dializer_pressure",index)}
                                  id={"ms_dializer_pressure_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_arterial_pressure == 'ON' && (
                              <div className="div-td td-ms_arterial_pressure numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  // precision = {1}
                                  inputmode="numeric"
                                  unit = 'mmHg'
                                  value={rows[index]["ms_arterial_pressure"]}
                                  onClickEvent={() =>this.openCalc("ms_arterial_pressure","脱血圧",rows[index]["ms_arterial_pressure"],4,index,false)}
                                  min={0}
                                  // step={0.1}
                                  getInputText={this.setValue.bind(this,"ms_arterial_pressure",index)}
                                  id={"ms_arterial_pressure_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_fluid_target_amount == 'ON' && (
                              <div className="div-td td-ms_fluid_target_amount numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision = {2}
                                  inputmode="numeric"
                                  unit = 'L'
                                  value={rows[index]["ms_fluid_target_amount"]}
                                  onClickEvent={() =>this.openCalc("ms_fluid_target_amount","目標補液量",rows[index]["ms_fluid_target_amount"],4,index,false,2)}
                                  min={0}
                                  step={0.1}
                                  getInputText={this.setValue.bind(this,"ms_fluid_target_amount",index)}
                                  id={"ms_fluid_target_amount_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_fluid_speed == 'ON' && (
                              <div className="div-td td-ms_fluid_speed numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  inputmode="numeric"
                                  precision = {2}
                                  step={0.1}
                                  unit = 'mL/min'
                                  min={0}
                                  value={rows[index]["ms_fluid_speed"]}
                                  onClickEvent={() =>this.openCalc("ms_fluid_speed","補液速度",rows[index]["ms_fluid_speed"],4,index,false,2)}
                                  getInputText={this.setValue.bind(this,"ms_fluid_speed",index)}
                                  id={"ms_fluid_speed_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_fluid_cur_amount == 'ON' && (
                              <div className="div-td td-ms_fluid_cur_amount numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision = {2}
                                  min={0}
                                  step={0.1}
                                  unit = 'L'
                                  inputmode="numeric"
                                  value={rows[index]["ms_fluid_cur_amount"]}
                                  onClickEvent={() =>this.openCalc("ms_fluid_cur_amount","補液量積算",rows[index]["ms_fluid_cur_amount"],4,index,false,2)}
                                  getInputText={this.setValue.bind(this,"ms_fluid_cur_amount",index)}
                                  id={"ms_fluid_cur_amount_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_fluid_target_temperature == 'ON' && (
                              <div className="div-td td-ms_fluid_target_temperature numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision = {1}
                                  min={0}
                                  step={0.1}
                                  unit = '℃'
                                  inputmode="numeric"
                                  value={rows[index]["ms_fluid_target_temperature"]}
                                  onClickEvent={() =>this.openCalc("ms_fluid_target_temperature","補液温度設定",rows[index]["ms_fluid_target_temperature"],4,index,false,1)}
                                  getInputText={this.setValue.bind(this,"ms_fluid_target_temperature",index)}
                                  id={"ms_fluid_target_temperature_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_fluid_cur_temperature == 'ON' && (
                              <div className="div-td td-ms_fluid_cur_temperature numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  precision = {1}
                                  min={0}
                                  step={0.1}
                                  unit = '℃'
                                  inputmode="numeric"
                                  value={rows[index]["ms_fluid_cur_temperature"]}
                                  onClickEvent={() =>this.openCalc("ms_fluid_cur_temperature","補液温度",rows[index]["ms_fluid_cur_temperature"],4,index,false,1)}
                                  getInputText={this.setValue.bind(this,"ms_fluid_cur_temperature",index)}
                                  id={"ms_fluid_cur_temperature_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_hdf_count == 'ON' && (
                              <div className="div-td td-ms_hdf_count numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  inputmode="numeric"
                                  value={rows[index]["ms_hdf_count"]}
                                  unit = '回'
                                  onClickEvent={() =>this.openCalc("ms_hdf_count","補液回数",rows[index]["ms_hdf_count"],2,index,false)}
                                  min={0}
                                  getInputText={this.setValue.bind(this,"ms_hdf_count",index)}
                                  id={"ms_hdf_count_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_hdf_amount == 'ON' && (
                              <div className="div-td td-ms_hdf_amount numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  inputmode="numeric"
                                  value={rows[index]["ms_hdf_amount"]}
                                  unit = 'L'
                                  onClickEvent={() =>this.openCalc("ms_hdf_amount","総補液積算",rows[index]["ms_hdf_amount"],4,index,false,1)}
                                  precision = {1}
                                  min={0}
                                  getInputText={this.setValue.bind(this,"ms_hdf_amount",index)}
                                  id={"ms_hdf_amount_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            {this.graph_table_show.ms_emergency_amount == 'ON' && (
                              <div className="div-td td-ms_emergency_amount numeric-td">
                                <NumericInputWithUnitLabel
                                  label=""
                                  inputmode="numeric"
                                  value={rows[index]["ms_emergency_amount"]}
                                  unit = 'mL'
                                  onClickEvent={() =>this.openCalc("ms_emergency_amount","緊急総補液量",rows[index]["ms_emergency_amount"],4,index,false,2)}
                                  precision = {2}
                                  min={0}
                                  getInputText={this.setValue.bind(this,"ms_emergency_amount",index)}
                                  id={"ms_emergency_amount_"+index}
                                  disabled = {item.check_disabled || item.ms_number > 0}
                                />
                              </div>
                            )}
                            <div className={'div-td td-staff'} style={{width: "calc(20rem - 17px)", paddingLeft:"0.3rem"}}>{rows[index]["staff"]}</div>
                          </div>
                        );
                      }
                    })
                  )}
                </>
              ):(
                <div style={{width:"100%", height:"100%"}}>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
              )}
            </div>
          </Wrapper>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
            row_index={this.state.row_index}
            selected_item = {this.state.selected_item}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
          {open_act === "from_console" ? (
            <Button className="red-btn" onClick={this.getConsole.bind(this)}>コンソール取込</Button>
          ) : (
            <Button className="red-btn" onClick={this.register.bind(this)}>手入力</Button>
          )}
          <Button className={this.state.change_flag?'red-btn':'disable-btn'} onClick={this.handleOk}>登録</Button>
        </Modal.Footer>
        {this.state.isDeleteConfirmModal && (
          <ConfirmNoFocusModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.deleteData.bind(this)}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isBackConfirmModal && (
          <ConfirmNoFocusModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.closeConfirmModal}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isSaveConfirmModal && (
          <ConfirmNoFocusModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.confirmSaveOk}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
            top_warning_message ={this.state.top_warning_message}
          />
        )}
        {this.state.isOpenCalcModal && (
          <CalcDialWithAlert
            calcConfirm={this.calcConfirm}
            units={this.state.calcUnit}
            calcCancel={this.calcCancel}
            daysSelect={false}
            daysInitial={0}
            daysLabel=""
            daysSuffix=""
            maxAmount={10000000}
            numberDigits={this.state.calcDigits}
            calcTitle={this.state.calcTitle}
            calcInitData={this.state.calcInit}
            needAlertMessage={true}
            minus_type = {this.state.minus_type}
            decimalPointDigits = {this.state.decimalPointDigits}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <SystemAlertModal
            hideModal= {this.closeSystemAlertModal.bind(this)}
            handleOk= {this.closeSystemAlertModal.bind(this)}
            showMedicineContent= {this.state.alert_messages}
            title={this.state.alert_title}
          />
        )}
      </Modal>
    );
  }
}

MeasureModal.contextType = Context;

MeasureModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  rows_measure: PropTypes.array,
  schedule_data: PropTypes.array,
  open_act: PropTypes.string,
  start_time:PropTypes.string,
};

export default MeasureModal;