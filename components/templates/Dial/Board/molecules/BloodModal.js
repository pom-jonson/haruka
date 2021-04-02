import React, { Component, useContext } from "react";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import Button from "~/components/atoms/Button";
import * as apiClient from "~/api/apiClient";
import Checkbox from "~/components/molecules/Checkbox";
import {CACHE_SESSIONNAMES, getServerTime} from "~/helpers/constants";
import * as sessApi from "~/helpers/cacheSession-utils";
import {
  formatDateTimeIE,
  formatDateTimeStr,
  formatTime
} from "../../../../../helpers/date";
import Spinner from "react-bootstrap/Spinner";
import BloodEditModal from "./BloodEditModal";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import InputBoxTag from "~/components/molecules/InputBoxTag";
import CalcDial from "~/components/molecules/CalcDial";
import ValidateAlertModal from '~/components/molecules/ValidateAlertModal'
import $ from 'jquery'
import {
  addRedBorder,
  addRequiredBg,
  removeRequiredBg,
  removeRedBorder,
  toHalfWidthOnlyNumber
} from '~/helpers/dialConstants'
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";

const Wrapper = styled.div`
  display: block;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  .flex {display:flex}
  .table-head {
    border:1px solid #dee2e6;
    width:100%;
    .menu {
      border-right:1px solid #dee2e6;
      text-align:center;
      height:2rem;
      line-height:2rem;
    }
    .td-last {
      width: 17px;
      border-right: none;
    }
  }
  .td-select {
    width:3rem;
    label{
      margin-right:0;
    }
    input{
      width:2rem!important;
      height:2rem;
      text-align:left!important;
    }
  }
  .td-time{
    width:5rem;
    padding: 0 !important;
    input{
      text-align:left!important;
    }
  }
  .td-max_blood_pressure{
    width:8.5rem;
  }
  .td-min_blood_pressure {
    width:8.5rem;
  }
  .td-pulse{
    width:8rem;
  }
  .table-body {
    width:100%;
    border:1px solid #dee2e6;
    border-top:none;
    overflow-y: scroll;
    height: 350px;
    .div-tr {
      width:100%;
      border-bottom:1px solid #dee2e6;
    }
    .deleted-tr {
      background-color: #f2f2f2;
    }
    .div-td {
      border-right:1px solid #dee2e6;
      padding: 0 0.25rem;
      word-break: break-all;
      vertical-align: middle;
      line-height: 2rem;
      div{margin-top:0;}
      input{
        font-size:1.5rem;
        text-align:right;        
      }
    }
    .td-staff {
      border-right: none;
    }
    .numeric-td {
      padding:0;
      input {
        width:4.5rem;
        height:2.5rem;
        ime-mode:inactive;
      }
    }
    .uint {
      margin-left: 0.3rem;
      line-height:2rem;
      padding-top:0.2rem;
    }
  }
  .label-title {
    display: none;
  }
  .label-unit {
    padding-top: 3px;
  }
  .react-datepicker__input-container {
    input {
      width: 100%;
      border: none;      
      height:2.3rem;
      padding-right:0.3rem;
    }
  }
  .no-result {
    padding: 120px;
    text-align: center;
    span {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item{
    padding:0;
  }
`;

const SpinnerWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContextMenuUl = styled.ul`
  margin-bottom: 0;
  .context-menu {
    animation-name: fadeIn;
    animation-duration: 0.4s;
    background-clip: padding-box;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: 0 2px 0.5rem rgba(0, 0, 0, 0.15);
    list-style-type: none;
    margin: 0;
    outline: none;
    padding: 0;
    position: absolute;
    text-align: left;
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
    padding: 0 1.25rem;
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
  .blue-text {
    color: blue;
  }
`;

const ContextMenu = ({ visible, x, y, parent, row_index }) => {
  if (visible) {
    const { $canDoAction, FEATURES, AUTHS } = useContext(Context);
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {/* {$canDoAction(FEATURES.DIAL_SYSTEM, AUTHS.EDIT) && (
                        <li><div onClick={() => parent.contextMenuAction(row_index,"edit")}>編集</div></li>
                    )} */}
          {$canDoAction(FEATURES.DIAL_SYSTEM, AUTHS.DELETE) && (
            <li onClick={() => parent.contextMenuAction(row_index, "delete")}><div>削除</div></li>
          )}
          {/* {$canDoAction(FEATURES.DIAL_SYSTEM, AUTHS.DELETE) && parent.state.rows[row_index].is_deleted == 1 && (
            <li onClick={() => parent.contextMenuAction(row_index, "delete_cancel")}><div>削除取りやめ</div></li>
          )} */}
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class BloodModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_loaded: false,
      // rows: this.props.rows_blood,
      rows:[],
      isOpenModal: false,
      isBackConfirmModal: false,
      isDeleteConfirmModal: false,
      confirmSaveModal: false,
      isOpenCalcModal: false,
      confirm_message: "",
      change_flag: false,
      confirm_alert_title:'',
      alert_message: '',
      alert_messages: '',
    };

    let authinfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    this.insert_blank_row = {
      input_time: new Date(),
      bp_pressure_max: "",
      bp_pressure_min: "",
      bp_pulse: "",
      staff: authinfo.name,
      updated_by: authinfo.user_number,
    };

    this.key_code = [];
    this.start_pos = [];
    this.double_click = false;
  }

  initialize=async(add_flag = true)=>{
    let server_time = await getServerTime();

    let authinfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    let current_date = sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"schedule_date");

    let dial_timezone = JSON.parse(window.sessionStorage.getItem("init_status")).dial_timezone["timezone"];
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
    var now = new Date(server_time);
    cur_date.setHours(now.getHours());
    cur_date.setMinutes(now.getMinutes());
    cur_date.setSeconds(0);

    if (this.base_time_object.getTime() > cur_date.getTime()) {
      cur_date.setDate(cur_date.getDate() + 1);
    }

    this.insert_blank_row = {
      input_time: cur_date,
      bp_pressure_max: "",
      bp_pressure_min: "",
      bp_pulse: "",
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
    if (this.props.schedule_id === undefined) {
      this.setState({
        is_loaded: true,
        rows: null,
        isDeleteConfirmModal: false,
        confirm_message: "",
      });
      return;
    }
    let path = "";
    path = "/app/api/v2/dial/board/get_console_blood_data";

    const post_data = {
      schedule_id: this.props.schedule_id,
      system_patient_id: this.props.system_patient_id,
      // get_blood_data: sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"get_blood_data"),
    };
    await apiClient
      .post(path, { params: post_data })
      .then((res) => {
        this.setState({
          rows: res.blood_data,
          is_loaded: true,
        });
      })
      .catch(() => {
        this.setState({
          rows: null,
          is_loaded: false,
        });
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

  manual_register = async () => {
    if (this.double_click) return;
    let temp_row = this.state.rows;
    let last_row = temp_row[temp_row.length - 1];
    if (
      temp_row.length > 0 && 
      last_row.is_deleted != 1 &&
      last_row != undefined &&
      last_row != null &&
      last_row.bp_pressure_max == "" &&
      last_row.bp_pressure_min == "" &&
      last_row.bp_pulse == ""
    )
      return;
    this.double_click = true;
    await this.initialize();
    this.double_click = false;
  };

  getConsole = async () => {
    if (this.props.schedule_id === undefined) {
      return;
    }
    let path = "/app/api/v2/dial/board/get_console_blood_data";
    const post_data = {
      schedule_id: this.props.schedule_id,
      system_patient_id: this.props.system_patient_id,
      // get_blood_data: sessApi.getObjectValue(CACHE_SESSIONNAMES.DIAL_BOARD,"get_blood_data"),
    };
    let data = await apiClient.post(path, { params: post_data });
    let blood_data = data.blood_data;
    if (blood_data != null && blood_data.length > 0) {
      this.setState({
        rows: blood_data,
        change_flag: true,
      });
      this.setState({alert_messages: "最新データで更新しました。"});
    } else {
      this.setState({alert_messages: "最新データがありません。"});
    }
  };
  getRadio = async (index, name, value) => {
    if (name === "get_data") {
      this.setState({ get_data: value, change_flag:true}, () => {
        sessApi.setObjectValue(
          CACHE_SESSIONNAMES.DIAL_BOARD,
          "get_blood_data",
          value
        );
      });
    } else if (name === "check") {
      let table_data = this.state.rows;
      if (table_data[index] != null) {
        table_data[index].is_enabled = value;
        this.setState({
          rows: table_data,
          change_flag:true,
        });
      }
    }
  };

  inputValue = (index) => {
    this.setState({
      isOpenModal: true,
      modal_data: this.state.rows[index],
      table_index: index,
    });
  };

  closeBloodModal = () => {
    this.setState({ isOpenModal: false });
  };

  handleBloodModal = (data) => {
    let table_data = this.state.rows;
    if (this.state.table_index != undefined && this.state.table_index != null) {
      table_data[this.state.table_index] = data;
      this.setState({
        isOpenModal: false,
        rows: table_data,
      });
    } else {
      this.closeBloodModal();
    }
  };

  handleClick = (e, index) => {
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
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("temperature_dlg").offsetLeft,
          // y:e.clientY +window.pageYOffset -document.getElementById("temperature_dlg").offsetTop -document.getElementsByClassName("modal-content")[0].offsetTop -120,
          y:e.clientY +window.pageYOffset -120,
        },
        row_index: index,
      });
    }
  };

  contextMenuAction = (index, type) => {
    if (type === "edit") {
      this.setState({
        isOpenModal: true,
        modal_data: this.state.rows[index],
        table_index: index,
      });
    } else if (type === "delete") {
      this.setState({
        selected_index: index,
        isDeleteConfirmModal: true,
        confirm_message: " この血圧情報を削除しますか？",
        confirm_alert_title:'削除確認'
      });
    } else if (type === "delete_cancel") {
      let { rows } = this.state;
      if (rows[index].is_deleted == 1) delete rows[index].is_deleted;
      this.setState({rows});
    }
  };

  deleteData = async() => {
    this.confirmCancel();
    let { rows, selected_index } = this.state;    
    rows[selected_index].is_deleted = 1;    
    this.setState({
      rows,       
      alert_messages:'血圧情報を削除しました。',
      confirm_alert_title:'削除完了'
    });
    let path = "/app/api/v2/dial/board/delete_blood";
    var post_data = {
      number:rows[selected_index].number,
    }
    await apiClient.post(path, { params: post_data });
  };

  confirmCancel = () => {
    this.setState({
      isBackConfirmModal: false,
      isDeleteConfirmModal: false,
      confirmSaveModal: false,
      confirm_message: "",
      confirm_alert_title:'',
      alert_messages:'',      
    });
  }

  onHide = () => {};

  setValue = (sub_key, index, e) => {
    let authinfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (sub_key == "staff") return;
    let rows = this.state.rows;
    var RegExp = /^\d*\.?\d*$/;
    if (!RegExp.test(e.target.value)) {
      return;
    }
    let value = parseFloat(e.target.value) < 0 ? 0 : e.target.value;
    // if (value<1000)
    var change_flag = rows[index][sub_key] != value;
    change_flag = this.state.change_flag | change_flag;
    rows[index][sub_key] = value;
    rows[index]["staff"] = authinfo.name;
    rows[index]["updated_by"] = authinfo.user_number;
    this.setState({
      rows,
      change_flag,
    });
  };

  setCalcValue = (sub_key, index, val) => {
    let authinfo = JSON.parse(window.sessionStorage.getItem("haruka"));
    if (sub_key == "staff") return;
    let rows = this.state.rows;
    var RegExp = /^\d*\.?\d*$/;
    if (!RegExp.test(val)) {
      return;
    }
    let value = parseFloat(val) < 0 ? 0 : val;
    // if (value<1000)
    var change_flag = rows[index][sub_key] != value;
    change_flag = this.state.change_flag | change_flag;
    rows[index][sub_key] = value;
    rows[index]["staff"] = authinfo.name;
    rows[index]["updated_by"] = authinfo.user_number;
    this.setState({
      rows,
      change_flag,
    });
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
    var change_flag = this.state.change_flag;
    rows[index]["updated_by"] = authinfo.user_number;
    rows[index]["staff"] = authinfo.name;
    if (e.target.value.length != 5) {
      change_flag = rows[index]["input_time"] != '';
      change_flag = this.state.change_flag | change_flag;
      rows[index]["input_time"] = '';
      rows[index]["input_time_value"] = '';
      this.setState({
        rows,
        change_flag
      });
      return;
    }
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];    
    if (hours > 23 || mins > 60){
      change_flag = rows[index]["input_time"] != '';
      change_flag = this.state.change_flag | change_flag;
      rows[index]["input_time"] = '';
      rows[index]["input_time_value"] = '';
      this.setState({
        rows,
        change_flag,
      })      
      return;
    }    
    value_time_object.setMinutes(mins);
    value_time_object.setHours(hours);
    if (this.base_time_object.getTime() > value_time_object.getTime()) {
      value_time_object.setDate(value_time_object.getDate() + 1);
    }
    change_flag = formatTime(rows[index]["input_time"]) != formatTime(value_time_object);    
    change_flag = this.state.change_flag | change_flag;
    rows[index]["input_time"] = value_time_object;
    this.setState({rows, change_flag})
  }

  handleOk = () => {
    let error_str_array = [];
    let first_tag_id = '';
    let save_data = [...this.state.rows];
    if (save_data == null || save_data.length == 0) {
      this.props.closeModal();
      return;
    }
    save_data.map((item, index) => {
      if (item.is_deleted != 1) {
        removeRedBorder("bp_pressure_min_" + index);
        removeRedBorder("bp_pressure_max_" + index);
        removeRedBorder("bp_pulse_" + index);
        if (item.input_time != null && item.input_time instanceof Date)
          item.input_time = formatDateTimeStr(item.input_time);
        if (parseInt(item.bp_pressure_max) > 1000) {
          error_str_array.push("最高血圧を3桁以内で入力してください。");
          addRedBorder("bp_pressure_max_" + index);
          if (first_tag_id == '') first_tag_id = "bp_pressure_max_" + index;
        }
        if (parseInt(item.bp_pressure_min) > 1000) {
          error_str_array.push("最低血圧を3桁以内で入力してください。");
          addRedBorder("bp_pressure_min_" + index);
          if (first_tag_id == '') first_tag_id = "bp_pressure_min" + index;
        }
        if (parseInt(item.bp_pulse) > 1000) {
          error_str_array.push("脈拍を3桁以内で入力してください。");
          addRedBorder("bp_pulse_" + index);
          if (first_tag_id == '') first_tag_id = "bp_pulse_" + index;
        }
        if (item.bp_pressure_max == '' && item.bp_pressure_min == '' && item.bp_pulse == '') {
          error_str_array.push("血圧値を入力してください。");
          addRedBorder("bp_pressure_min_" + index);
          addRedBorder("bp_pressure_max_" + index);
          addRedBorder("bp_pulse_" + index);
          if (first_tag_id == '') first_tag_id = "bp_pressure_max_" + index;
        }
        if (item.bp_pressure_max != '' && item.bp_pressure_min != '' && parseInt(item.bp_pressure_max) < parseInt(item.bp_pressure_min)) {
          error_str_array.push("値が正しいか確認してください。");
          addRedBorder("bp_pressure_min_" + index);
          addRedBorder("bp_pressure_max_" + index);
        }
      }
    });
    if (error_str_array.length > 0) {
      this.setState({ alert_message: error_str_array.join('\n') })
      return;
    }
    this.setState({
      confirmSaveModal: true,
      confirm_message: "変更内容を登録しますか？",
      confirm_alert_title:'登録確認',
    });
  };

  componentDidUpdate () {
    this.changeBackground();
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
      if (item.bp_pressure_max == '' && item.bp_pressure_min == '' && item.bp_pulse == '') {
        addRequiredBg("bp_pressure_max_" + index);
        addRequiredBg("bp_pressure_min_" + index);
        addRequiredBg("bp_pulse_" + index);
      } else {
        removeRequiredBg("bp_pressure_max_" + index);
        removeRequiredBg("bp_pressure_min_" + index);
        removeRequiredBg("bp_pulse_" + index);
      }
    });
  }

  closeConfirmModal = () => {
    this.confirmCancel();
    this.props.closeModal();
  };

  openCalc = (type, value, unit, index, title) => {
    let _state = {
      calcInit: value != null && value != undefined ? value : 0,
      calcValType: type,
      calcUnit: unit,
      calcTitle: title,
      calcDigits: 3,
      calcIndex: index,
      isOpenCalcModal: true,
    };
    this.setState(_state);
  }

  calcConfirm = (val) => {
    let _state = {isOpenCalcModal: false};
    switch(this.state.calcValType) {
      case "bp_pressure_max":
        this.setCalcValue("bp_pressure_max", this.state.calcIndex, val);
        break;
      case "bp_pressure_min":
        this.setCalcValue("bp_pressure_min", this.state.calcIndex, val);
        break;
      case "bp_pulse":
        this.setCalcValue("bp_pulse", this.state.calcIndex, val);
        break;
    }

    _state.calcValType = "";
    _state.calcInit = 0;
    _state.calcTitle = "";
    _state.calcUnit = "";
    // _state.anti_items = anti_items;

    this.setState(_state);
  }

  calcCancel = () => {
    this.setState({
      isOpenCalcModal: false,
      calcValType: "",
      calcUnit: "",
      calcTitle: "",
      calcInit: 0
    });
  }
  
  saveData = () => {
    this.confirmCancel();
    let save_data = [...this.state.rows];
    // let post_data = [];
    // save_data.map(item=>{
    //   if (item.is_enabled !== undefined && item.is_deleted == 1) {
    //     item.is_enabled = 0;
    //     delete item.is_deleted;
    //   }
    //   post_data.push(item);
    // });
    this.props.handleOk(save_data);
  }

  render() {
    let list_item = this.state.rows;
    let message;
    if (list_item == null || list_item.length == 0) {
      message = (
        <div className="no-result">
          <span>血圧データがありません</span>
        </div>
      );
    }
    return (
      <Modal
        show={true}
        onHide={this.onHide}
        id="temperature_dlg"
        className="master-modal auto-width-modal blood-modal first-view-modal"
      >
        <Modal.Header><Modal.Title style={{ fontSize: "25px" }}>{this.props.act == "from_console_blood" ? "血圧一覧" : "血圧編集"}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Wrapper>
            <div className={'table-head flex'}>
              {/* {this.props.act == "from_console_blood" && ( */}
                <div className={'menu td-select'}>選択</div>
              {/* )} */}
              <div className={'menu td-time'}>入力時間</div>
              <div className={'menu td-max_blood_pressure'}>最高血圧</div>
              <div className={'menu td-min_blood_pressure'}>最低血圧</div>
              <div className={'menu td-pulse'}>脈拍</div>
              <div className={'menu td-staff'}
              //  style={{width:this.props.act == "from_console_blood" ? "calc(100% - 17px - 38rem)" : "calc(100% - 17px - 35rem)"}}>
                 style={{width:"calc(100% - 17px - 32rem)"}}>
                 スタッフ
              </div>
              <div className={'menu td-last'}> </div>
            </div>
            <div className={'table-body'}>
              {this.state.is_loaded ? (
                <>
                  {list_item !== undefined && list_item !== null && list_item.length > 0 ? (
                    list_item.map((item, index) => {
                      // if (item.is_enabled == undefined ||item.is_enabled == 1) {
                        if (!(item.input_time instanceof Date)) {
                          item.input_time = formatDateTimeIE(item.input_time);
                        }
                        if (item.is_deleted != 1){
                          return (
                            <>
                              <div className={item.is_deleted == 1 ? 'deleted-tr div-tr flex' : 'div-tr flex'} onContextMenu={(e) =>this.handleClick(e, index)}>
                                {/* {this.props.act == "from_console_blood" && ( */}
                                  <div className="text-center div-td td-select">
                                    <Checkbox
                                      label=""
                                      getRadio={this.getRadio.bind(this,index)}
                                      value={item.is_enabled == 0?0:1}
                                      name="check"
                                    />
                                  </div>
                                {/* )} */}
                                <div className="text-center div-td td-time">
                                  <DatePicker
                                    selected={item.input_time}
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
                                    id = {"time_id_" + index}
                                  />
                                </div>
                                <div className="numeric-td text-center div-td td-max_blood_pressure">
                                  <div className="d-flex">
                                    <InputBoxTag
                                      label=""
                                      id={`bp_pressure_max_${index}`}
                                      type="numeric"
                                      getInputText={this.setValue.bind(this,"bp_pressure_max",index)}
                                      onClick={() =>this.openCalc("bp_pressure_max",item.bp_pressure_max,"mmHg",index,"最高血圧")}
                                      value={item.bp_pressure_max}
                                    />
                                    <div className={'uint'}>mmHg</div>
                                  </div>
                                </div>
                                <div className="numeric-td text-center div-td td-min_blood_pressure">
                                  <div className="d-flex">
                                    <InputBoxTag
                                      label=""
                                      id={`bp_pressure_min_${index}`}
                                      type="numeric"
                                      getInputText={this.setValue.bind(this,"bp_pressure_min",index)}
                                      onClick={() =>this.openCalc("bp_pressure_min",item.bp_pressure_min,"mmHg",index,"最低血圧")}
                                      value={item.bp_pressure_min}
                                    />
                                    <div className={'uint'}>mmHg</div>
                                  </div>
                                </div>
                                <div className="numeric-td text-center div-td td-pulse">
                                  <div className="d-flex">
                                    <InputBoxTag
                                      label=""
                                      id={`bp_pulse_${index}`}
                                      type="numeric"
                                      getInputText={this.setValue.bind(this,"bp_pulse",index)}
                                      onClick={() =>this.openCalc("bp_pulse",item.bp_pulse,"bpm",index,"脈拍")}
                                      value={item.bp_pulse}
                                    />
                                    <div className={'uint'}>bpm</div>
                                  </div>
                                </div>
                                <div className="div-td td-staff" 
                                  // style={{width:this.props.act == "from_console_blood" ? "calc(100% - 38rem)" : "calc(100% - 35rem)"}}
                                  style={{width:"calc(100% - 32rem)", paddingTop:'0.3rem'}}
                                >{item.staff}
                                </div>
                              </div>
                            </>
                          );
                        }                        
                      // }
                    })
                  ) : (
                    <div style={{width:'100%'}}>{message}</div>
                  )}
                </>
              ) : (
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </div>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <Button className="cancel-btn" onClick={this.closeModal}>キャンセル</Button>
          {this.props.act == "from_console_blood" && (
            <Button className="red-btn" onClick={this.getConsole.bind(this)}>コンソール取込</Button>
          )}
          {this.props.act != "from_console_blood" && (
            <Button className="red-btn" onClick={this.manual_register}>手入力</Button>
          )}
          {this.state.change_flag ? (
            <Button className="red-btn" onClick={this.handleOk}>登録</Button>
          ):(
            <Button className="disable-btn">登録</Button>
          )}
        </Modal.Footer>
        {this.state.isOpenModal && (
          <BloodEditModal
            title="血圧編集"
            closeModal={this.closeBloodModal}
            handleModal={this.handleBloodModal}
            modal_data={this.state.modal_data}
          />
        )}
        {this.state.isDeleteConfirmModal && (
          <ConfirmNoFocusModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.deleteData.bind(this)}
            confirmTitle={this.state.confirm_message}
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
        {this.state.confirmSaveModal && (
          <ConfirmNoFocusModal
            hideConfirm={this.confirmCancel.bind(this)}
            confirmCancel={this.confirmCancel.bind(this)}
            confirmOk={this.saveData}
            confirmTitle={this.state.confirm_message}
            title = {this.state.confirm_alert_title}
          />
        )}
        {this.state.isOpenCalcModal && (
          <CalcDial
            calcConfirm={this.calcConfirm}
            units={this.state.calcUnit}
            calcCancel={this.calcCancel}
            numberDigits={this.state.calcDigits}
            daysSelect={true}
            daysInitial={0}
            daysLabel=""
            daysSuffix=""
            maxAmount={100000}
            calcTitle={this.state.calcTitle}
            calcInitData={this.state.calcInit}
          />
        )}
        {this.state.alert_message != "" && (
          <ValidateAlertModal
            handleOk={this.closeAlertModal}
            alert_meassage={this.state.alert_message}
          />
        )}
        {this.state.alert_messages !== "" && (
          <AlertNoFocusModal
            hideModal= {this.confirmCancel}
            handleOk= {this.confirmCancel}
            showMedicineContent= {this.state.alert_messages}
            title = {this.state.confirm_alert_title}
          />
        )}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          row_index={this.state.row_index}
        />
      </Modal>
    );
  }
}

BloodModal.contextType = Context;

BloodModal.propTypes = {
  closeModal: PropTypes.func,
  handleOk: PropTypes.func,
  rows_blood: PropTypes.array,
  system_patient_id: PropTypes.number,
  schedule_id: PropTypes.number,
  only_show: PropTypes.bool,
  act: PropTypes.string,
  schedule_data: PropTypes.object,
  start_time: PropTypes.string,
};

export default BloodModal;
