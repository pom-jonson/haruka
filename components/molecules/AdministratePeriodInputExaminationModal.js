import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatDateSlash, formatTime, formatTimePicker, getAfterDayByJapanFormat} from "~/helpers/date";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import {setDateColorClassName, toHalfWidthOnlyNumber} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import * as karteApi from "~/helpers/cacheKarte-utils";
import {CACHE_LOCALNAMES, EXAMINATION_TYPE} from "~/helpers/constants";

const Wrapper = styled.div`  
    width: 100%;
    font-size: 1rem;
    display: flex;
    height: 100%;
    .block-left{
      width: 30%;
      height: 100%;
      .table-area {
        height: calc(100% - 3rem);
        margin-top: 0.5rem;
      }
      .div-head {
        width: calc(100% - 17px);
      }
      .selected{
        background: lightblue;
      }
      .div-th{
        border: solid 1px lightgray;
        font-weight: bold;
        background: #a0ebff;
        text-align: center;
        line-height: 2rem;
      }
      .div-td{
        border: solid 1px lightgray;
        text-align: left;
      }
      .date-td {
        border-right: none;
        width: 70%;
        .react-datepicker{
          width: 150% !important;
        }
        input {
          width; 8rem;
        }
      }
      .time-td {
        width: 30%;
        input {
          width: 4rem;
        }
      }
      .time-th {
        width: calc(30% + 19px);
      }
      .div-tbody{
        height: 56vh;
        border:solid 1px lightgray;
        overflow-y: scroll;
      }
      .cancel-btn {
        height: 2.37rem;
        padding: 0;
        border: solid 2px #000000;
        background: #ffffff;
        span {
          color: #000000;
          font-size: 1rem;
          font-weight: normal;
        }
      }
      .cancel-btn:hover {
        background: #ffffff;
        border: solid 2px #7e7e7e;
        span {
          color: #7e7e7e;
          font-weight: normal;
        }
      }
    }
    .block-right{
      width: calc(70% - 6rem);
    }
    .block-middle {
      width: 6rem;
      height: 100%;
      padding-top: 26%;
      padding-left: 0.5rem;
      padding-right: 0.5rem;
    }
    .usage-select-area{
      .pullbox-title{
        width: 5rem;
        font-size: 1rem;
        line-height: 2rem;
      }
      .pullbox-select{
        width: 5rem;
        font-size: 1rem;
        height: 2rem;
      }
    }
    .count-time{
      margin-bottom: 0.2rem;
      .count-label{
        width: 5rem;
        font-size: 1rem;
        line-height: 2rem;
      }
      label{
        font-size: 1rem;
      }
      input{
        width: 5rem;
      }
      .react-datepicker-wrapper{
        input{
          width: 5rem;
          height: 2rem;
        }
      }
    }
    .date-setting-area{
      display: flex;
      justify-content: space-between;
    }
    .setting-area{
      margin-top: 0.5rem;
      label{
        font-size: 1rem;
      }
      .alert-label{
        font-size: 1rem;
      }
    }
    .flex{
        display: flex;
    }
    .period-date-cls{
      width: 100%;      
      text-align: center;
      margin: 0px auto;     
    }
    .react-datepicker{
      width: 100% !important;
    }
    .calendar-area{
      width: 100%;
      margin: 0px auto;
    }
    .select-time-zone{
      margin-top: 1rem;      
    }    
    .block-area{
      width: 50rem;
      padding: 1rem;
      border: 1px solid #aaa;
      display: flex;
      justify-content: space-between;
    }
    .week-area{
      width: 20rem;
      padding: 1rem;
      border: 1px solid #aaa;
      display: flex;
      justify-content: space-between;
    }
    .add-btn{
      padding: 0;
      min-width: 5rem;
      height: 2.375rem;
      span{
        font-size: 1rem;
        font-weight: normal;
      }
    }
`;

class AdministratePeriodInputExaminationModal extends Component {
  constructor(props) {
    super(props);
    
    let week_days = [
      {name:"日", value: 0, checked: false},
      {name:"月", value: 1, checked: false},
      {name:"火", value: 2, checked: false},
      {name:"水", value: 3, checked: false},
      {name:"木", value: 4, checked: false},
      {name:"金", value: 5, checked: false},
      {name:"土", value: 6, checked: false},
    ];
  
    this.period_start_date = new Date();
    let period_end_date = new Date();
    period_end_date.setDate(period_end_date.getDate() + 1);
    let period_type = 0;
    let period_category = 0;
    this.blank_item={date:null, time:null, time_value:"", is_new: true};
    let done_daytimes = [{...this.blank_item}];
    
    if(props.administrate_period != undefined && props.administrate_period != null){
      this.period_start_date = new Date(props.administrate_period.period_start_date);
      period_end_date = new Date(props.administrate_period.period_end_date);
      period_type = props.administrate_period.period_type;
      period_category = props.administrate_period.period_category;
      
      if(props.administrate_period.period_week_days != undefined && props.administrate_period.period_week_days != null && props.administrate_period.period_week_days.length > 0){
        props.administrate_period.period_week_days.map(day=>{
          if(week_days.find((x) => x.value == day) != undefined){
            week_days.find((x) => x.value == day).checked = true;
          }
        })
      }
      if (props.administrate_period.done_daytimes !== undefined && props.administrate_period.done_daytimes.length > 0) {
        done_daytimes = [];
        props.administrate_period.done_daytimes.map(item=>{
          if (item.time != null && item.time != "") item.time = formatTimePicker(item.time);
          if (item.date != null && item.date != "") item.date = new Date(item.date);
          done_daytimes.push(item);
        });
        done_daytimes.push({...this.blank_item});
      }
    }
    
    if(props.modal_data !== undefined && props.modal_data.data.order_data.order_data !== undefined) {
      let order_data = props.modal_data.data.order_data.order_data;
       if (order_data.administrate_period != undefined && order_data.administrate_period != null){
        this.period_start_date = getAfterDayByJapanFormat(order_data.administrate_period.max_date, 7);
        period_end_date = new Date(order_data.administrate_period.period_end_date);
        period_type = order_data.administrate_period.period_type;
        period_category = order_data.administrate_period.period_category;
        
        if(order_data.administrate_period.period_week_days != undefined && order_data.administrate_period.period_week_days != null && order_data.administrate_period.period_week_days.length > 0){
          order_data.administrate_period.period_week_days.map(day=>{
            if(week_days.find((x) => x.value == day) != undefined){
              week_days.find((x) => x.value == day).checked = true;
            }
          })
        }
        if (order_data.administrate_period.done_daytimes !== undefined && order_data.administrate_period.done_daytimes.length > 0) {
          done_daytimes = [];
          order_data.administrate_period.done_daytimes.map(item=>{
            if (item.time != null && item.time != "") item.time = formatTimePicker(item.time);
            if (item.date != null && item.date != "") item.date = new Date(item.date);
            done_daytimes.push(item);
          });
          done_daytimes.push({...this.blank_item});
        }
      }
    }
    
    this.state = {
      period_start_date:this.period_start_date,
      period_end_date,
      week_days,
      period_type,
      period_category,
      alert_messages:"",
      done_daytimes,
      select_index_array:[]
    };
    this.double_click = false;
    this.key_code = [];
    this.start_pos = [];
  }

  async componentDidMount() {
  }

  getPeriodStartDate = (value) => {
    this.setState({
      period_start_date:value,
    })
  }

  getPeriodEndDate = (value) => {
    this.setState({
      period_end_date:value,
    })
  }

  confirmClose = () => {
    this.props.closeModal();
  }

  getCheckbox(name, value, pos) {
    let week_days = this.state.week_days;
    week_days.map(item=>{
      if (pos == item.value) {
        item.checked = !item.checked;
      }
    });
    this.setState({week_days});
  }

  allSelect = () => {

    if (this.state.period_type == 0) return;
    
    let week_days = this.state.week_days;
    week_days.map(item=>{
      item.checked = true;
    });
    this.setState({week_days});
  };

  allDeSelect = () => {

    if (this.state.period_type == 0) return;
    
    let week_days = this.state.week_days;
    week_days.map(item=>{
      item.checked = false;
    });
    this.setState({week_days});
  };

  setPeriodType = (e) => {
    this.setState({period_type:parseInt(e.target.value)});
  };

  setPeriodCategory = (e) => {
    this.setState({period_category:parseInt(e.target.value)});
  };
  
  saveCheck = () => {
    let result = false;
    if (this.state.done_daytimes === undefined || this.state.done_daytimes.length === 0) return false;
    if (this.state.done_daytimes.length > 0) {
      this.state.done_daytimes.map(item=>{
        if (item.is_new && item.date != null && item.date !== "") result = true;
      });
    }
    return result;
  }

  confirmOk = async () => {
    if (!this.saveCheck()) return;
    if(this.state.period_start_date == null && this.state.period_start_date == ''){
      this.setState({alert_messages:"実施開始日を選択してください。"});
      return;
    }
    if(this.state.period_end_date == null || this.state.period_end_date == ''){
      this.setState({alert_messages:"実施終了日を選択してください。"});
      return;
    }
    if(this.state.period_end_date.getTime() <= this.state.period_start_date.getTime()){
      this.setState({alert_messages:"実施終了日を実施開始日以降の日付を選択してください。"});
      return;
    }
    let same_time_exist = 0;
    same_time_exist = this.getExistTime();
    
    if(same_time_exist == 1){
      this.setState({alert_messages:"同じ実施時間を入力することはできません。"});
      return;
    }
    let _state = {};
    _state.period_start_date = formatDateLine(this.state.period_start_date);
    _state.period_end_date = formatDateLine(this.state.period_end_date);
    _state.period_type = this.state.period_type;
    _state.period_category = this.state.period_category;
    _state.max_date = this.getMinMaxDate(false);
    _state.min_date = this.getMinMaxDate(true);
    _state.done_days = this.getDoneDays();
    let filterd = this.state.done_daytimes.filter(x=>x.date != null && x.date != "");
    filterd.map(item=>{
      item.date = formatDateLine(item.date);
    })
    _state.done_daytimes = filterd;
    
    let result = [];
    this.state.week_days.map(item=>{
      if (item.checked == true) {
        result.push(item.value);
      }
    });
    _state.period_week_days = result;
    
    if (this.props.modal_data !== undefined) {
      let {modal_data} = this.props;
      let exam_cache = modal_data.data.order_data.order_data;
      exam_cache.created_at = modal_data.created_at;
      exam_cache.administrate_period.period_start_date = _state.period_start_date;
      exam_cache.administrate_period.period_end_date = _state.period_end_date;
      exam_cache.administrate_period.period_type = _state.period_type;
      exam_cache.administrate_period.period_category = this.state.period_category;
      exam_cache.administrate_period.max_date = _state.max_date;
      exam_cache.administrate_period.min_date = _state.min_date;
      exam_cache.administrate_period.done_days = _state.done_days;
      exam_cache.administrate_period.done_daytimes = _state.done_daytimes;
      exam_cache.administrate_period.period_week_days = _state.period_week_days;
      exam_cache.last_doctor_code = exam_cache.doctor_code;
      exam_cache.last_doctor_name = exam_cache.doctor_name;
      exam_cache.increasePeriod = 1;
      exam_cache.isForUpdate = 1;
  
      let examination_type = exam_cache.examination_type;
      if (examination_type == EXAMINATION_TYPE.EXAMINATION) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.EXAM_EDIT, JSON.stringify(exam_cache), 'insert');
      } else if(examination_type == EXAMINATION_TYPE.CYTOLOGY) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.CYTOLOGY_EXAM_EDIT, JSON.stringify(exam_cache), 'insert');
      } else if(examination_type == EXAMINATION_TYPE.PATHOLOGY) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.PATHOLOGY_EXAM_EDIT, JSON.stringify(exam_cache), 'insert');
      } else if(examination_type == EXAMINATION_TYPE.BACTERIAL) {
        karteApi.setVal(this.props.patientId, CACHE_LOCALNAMES.BACTERIAL_EXAM_EDIT, JSON.stringify(exam_cache), 'insert');
      }
      this.props.handleOk();
    } else {
      this.props.saveAdministratePeriod(_state);
    }

  }

  closeModal=()=>{
    this.setState({alert_messages:""});
  }

  getExistTime = () => {
    let result = 0;
    let {done_daytimes} = this.state;
    done_daytimes.map((first_item, first_index)=>{
      done_daytimes.map((second_item, second_index)=>{
        if (first_item.date != null && first_item.time != null && second_item.date != null && first_item.time != null) {
          if (formatDateLine(first_item.date) == formatDateLine(second_item.date) && second_item.time_value == first_item.time_value && first_index !== second_index){
            result = 1;
          }
        }
      })
    });
    return result;
  }

  getMinMaxDate = (is_min) => {
    let {done_daytimes} = this.state;
    if (done_daytimes.length === 0) return;
    var filtered = done_daytimes.filter(x=>x.date != null && x.date != "");
    var dates = filtered.map(function(x) { return new Date(x.date); });
    var latest = new Date(Math.max.apply(null,dates));
    var earliest = new Date(Math.min.apply(null,dates));
    if (is_min) return formatDateLine(earliest);
    else return formatDateLine(latest);
  }
  
  getDoneDays = () => {
    let {done_daytimes} = this.state;
    if (done_daytimes.length === 0) return;
    let date_array = [];
    done_daytimes.map(item=> {
      if (item.date != null && date_array.indexOf(formatDateLine(item.date)) === -1) {
        date_array.push(formatDateLine(item.date));
      }
    });
    return date_array;
  }

  addDate = async () => {
    if (this.double_click) return;
    let _state = {};
    _state.period_start_date = formatDateLine(this.state.period_start_date);
    _state.period_end_date = formatDateLine(this.state.period_end_date);
    _state.period_type = this.state.period_type;
    _state.period_category = this.state.period_category;
    
    let result = [];
    this.state.week_days.map(item=>{
      if (item.checked == true) {
        result.push(item.value);
      }
    });
    let {done_daytimes} = this.state;
    _state.period_week_days = result;
    this.double_click = true;
    let path = "/app/api/v2/order/injection/getAdministratePeriod";
    await apiClient
      ._post(path, {
        params: _state
      })
      .then((res) => {
        if (res && res.length > 0) {
          _state.days = res.length;
        
          let done_days = [];
          res.map(item=>{
            done_days.push(item);
            let insert_item = {date:item, time:null, time_value:"", is_new:true};
            done_daytimes.push({...insert_item});
          });
          _state.done_days = done_days;
          this.setState({done_daytimes});
        }
      })
      .catch(() => {
        return false;
      });
    this.double_click = false;
  }
  delItem = () => {
    let {select_index_array, done_daytimes} = this.state;
    if (select_index_array.length == 0) return;
    select_index_array.map(item=>{
      done_daytimes[item].is_deleted = 1;
    });
    done_daytimes = done_daytimes.filter(x=>x.is_deleted != 1);
    this.setState({done_daytimes, select_index_array:[]});
  }
  
  setDate = async (value, key) => {
    let {done_daytimes} = this.state;
    done_daytimes[key].date = value;
    this.setState({done_daytimes});
  }
  
  timeKeyEvent = (key, index, e) => {
    let key_value = "time_value";
    var start_pos = e.target.selectionStart;
    var end_pos = e.target.selectionEnd;
    var key_code = e.keyCode;
    this.key_code[index] = key_code;
    this.start_pos[index] = start_pos;
    var obj = document.getElementById('start_time_id_' + index);
    
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
      this.setTime(key, index, e);
      return;
    }
    
    var rows = this.state.done_daytimes;
    if (rows.length > 0) {
      rows.map(item=>{
        if (item.date != undefined && item.date != null && item.date != "") {
          item.date = new Date(item.date);
        }
        if (item.time != undefined && item.time != null && item.time != "") {
          item.time = new Date(item.time);
        }
      });
    }
    
    if (key_code == 8){
      if (input_value.length == 1 && start_pos == 1 && start_pos == end_pos){
        rows[index][key_value] = ''
        this.setState({done_daytimes: rows}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (input_value.length == 3 && start_pos == 1 && start_pos == end_pos){
        input_value = input_value.slice(1.2);
        rows[index][key_value] = input_value;
        this.setState({done_daytimes: rows}, () => {
          obj.setSelectionRange(0,0);
        });
        e.preventDefault();
      }
      if (start_pos == end_pos && start_pos == 3){
        input_value = input_value.slice(0,1) + input_value.slice(3, input_value.length);
        rows[index][key_value] = input_value;
        this.setState({
          done_daytimes: rows
        }, () => {
          obj.setSelectionRange(1, 1);
        })
        e.preventDefault();
      }
      
      if (start_pos != end_pos){
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        rows[index][key_value] = input_value;
        this.setState({
          done_daytimes: rows
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
    }
    if (key_code == 46){
      if (start_pos != end_pos){
        input_value = input_value.slice(0, start_pos) + input_value.slice(end_pos, input_value.length);
        rows[index][key_value] = input_value;
        this.setState({
          done_daytimes: rows
        }, () => {
          obj.setSelectionRange(start_pos, start_pos);
        })
        e.preventDefault();
      }
      if (input_value.length == 1 && start_pos == 0 && start_pos == end_pos){
        rows[index][key_value] = '';
        this.setState({done_daytimes: rows}, () => {
          obj.setSelectionRange(0, 0);
        })
        e.preventDefault();
      }
      if (start_pos == end_pos && input_value.length == 3){
        if (start_pos == 0){
          rows[index][key_value] = input_value.slice(1,2);
          this.setState({
            done_daytimes: rows
          }, () => {
            obj.setSelectionRange(0, 0);
          })
          e.preventDefault();
        }
        if (start_pos == 1){
          rows[index][key_value] = input_value.slice(0,1);
          this.setState({
            done_daytimes: rows
          }, () => {
            obj.setSelectionRange(1, 1);
          })
          e.preventDefault();
        }
      }
    }
    if (key_code != 8 && key_code != 46){
      rows[index][key_value] = input_value;
      this.setState({
        done_daytimes: rows
      })
    }
  }
  
  setTime = (key, index, e) => {
    let {done_daytimes} = this.state;
    this.setState({done_daytimes});
    
    let key_value = "time_value";
    if (e.target.value.length != 5) {
      done_daytimes[index][key] = null;
      done_daytimes[index][key_value] = "";
      this.setState({
        done_daytimes,
        change_flag: true,
      });
      return;
    }
    
    var input_value = e.target.value;
    var hours = input_value.split(':')[0];
    var mins = input_value.split(':')[1];
    if (hours > 23 || mins > 60){
      done_daytimes[index][key] = null;
      done_daytimes[index][key_value] = "";
      this.setState({
        done_daytimes: done_daytimes,
        change_flag: true,
      })
      return;
    }
    
    done_daytimes[index][key] = new Date(formatDateSlash(done_daytimes[index]['date']) + " " + e.target.value + ":00");
    done_daytimes[index][key_value] = e.target.value;
    
    this.setState({
      done_daytimes
    });
    
  }
  
  insertStrTimeStyle=(input)=>{
    return input.slice(0, 2) + ':' + input.slice(2,input.length);
  }
  
  getTimeValue = (key, index, value, e) => {
    let key_value = "time_value";
    
    let rows = this.state.done_daytimes;
    if (rows.length > 0) {
      rows.map(item=>{
        if (item.date != undefined && item.date != null && item.date != "") {
          item.date = new Date(item.date);
        }
        if (item.time != undefined && item.time != null && item.time != "") {
          item.time = new Date(item.time);
        }
      });
    }
    if (e == undefined){
      rows[index][key] = new Date(rows[index]['date'].getFullYear(), rows[index]['date'].getMonth(), rows[index]['date'].getDate(), value.getHours(), value.getMinutes());
      rows[index][key_value] = formatTime(new Date(rows[index]['date'].getFullYear(), rows[index]['date'].getMonth() + 1, rows[index]['date'].getDate(), value.getHours(), value.getMinutes()));
  
      this.setState({
        done_daytimes: rows,
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
    
    if (input_value.length == 5) this.setTime(key, index, e);
    
    rows[index][key_value] = input_value;
    this.setState({
      done_daytimes: rows
    }, () => {
      var obj = document.getElementById('start_time_id_' + index);
      if (this.key_code[index] == 46){
        obj.setSelectionRange(this.start_pos[index], this.start_pos[index]);
      }
      if (this.key_code[index] == 8){
        obj.setSelectionRange(this.start_pos[index] - 1, this.start_pos[index] - 1);
      }
    })
  };
  
  addDayTime = () =>{
    let {done_daytimes} = this.state;
    let insert_item = {time:null,date:null, time_value:"", is_new:true};
    done_daytimes.push(insert_item);
    this.setState({done_daytimes});
  }
  
  selectItem = (index, e) => {
    if(e.target.tagName === "INPUT") return;
    let {select_index_array, done_daytimes} = this.state;
    if (done_daytimes[index] !== undefined && !done_daytimes[index].is_new) return;
    let indexof = select_index_array.indexOf(index);
    if (indexof > -1) select_index_array.splice(indexof, 1);
    else select_index_array.push(index);
    this.setState({select_index_array});
  }

  render() {
    let alert_text_01 = "実施間隔指定：実施開始日から実施終了日の間で指定された間隔でオーダを実行します。";
    let alert_text_02 = "曜 日 指 定：実施開始日から実施終了日の間で指定された曜日にオーダを実行します。";
    let radio_text = "実施間隔指定";
    let {done_daytimes} = this.state;
    let can_save = this.saveCheck();
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal exam-administrate_group_modal first-view-modal">
          <Modal.Header>
            <Modal.Title>実施期間入力</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className="block-left">
                  <Button className="cancel-btn" onClick={this.delItem}>選択削除</Button>
                  <div className="table-area w-100 pr-1">
                    <div className="div-header d-flex w-100">
                      <div className="div-th date-td">日付</div>
                      <div className="div-th time-td time-th">時刻</div>
                    </div>
                    <div className="div-tbody">
                      {done_daytimes.map((item, index)=>{
                        return (
                          <div className={`div-tr w-100 d-flex ${(this.state.select_index_array.indexOf(index) > -1) ? "selected":""}`} style={{cursor:"pointer"}} onClick={this.selectItem.bind(this, index)} key={item} >
                            <div className="div-td date-td">
                              <DatePickerBox>
                                <DatePicker
                                  locale="ja"
                                  selected={item.date != null ? new Date(item.date) : ""}
                                  onChange={(e)=>this.setDate(e, index)}
                                  dateFormat="yyyy/MM/dd"
                                  placeholderText="年/月/日"
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  dayClassName = {date => setDateColorClassName(date)}
                                  minDate={new Date()}
                                  disabled={!item.is_new}
                                />
                              </DatePickerBox>
                            </div>
                            <div className="div-td time-td">
                              <DatePicker
                                selected={item.time}
                                onChange={this.getTimeValue.bind(this,"time",index)}
                                onKeyDown = {this.timeKeyEvent.bind(this,"time", index)}
                                onBlur = {this.setTime.bind(this,"time", index)}
                                value = {item.time_value}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={10}
                                dateFormat="HH:mm"
                                timeFormat="HH:mm"
                                timeCaption="時刻"
                                id = {"start_time_id_" + index}
                              />
                            </div>
                          </div>
                        )
                      })}
                      <div className="div-tr border-left border-right border-bottom text-center w-100" style={{cursor:"pointer"}} onClick={this.addDayTime}>行追加</div>
                    </div>
                  </div>
                </div>
                <div className="block-middle">
                  <Button className="add-btn" onClick={this.addDate}>←追加</Button>
                </div>
                <div className="block-right">
                  <div className="date-setting-area">
                    <div className="left-col" style={{width:"45%"}}>
                      <div className="period-date-cls">実施開始日</div>
                      <div className='calendar-area'>
                        <DatePicker
                            showPopperArrow={false}
                            locale="ja"
                            selected={this.state.period_start_date}
                            onChange={this.getPeriodStartDate}
                            dateFormat="yyyy/MM/dd"
                            inline
                            minDate={this.props.modal_data !== undefined ? new Date() : this.period_start_date}
                            dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                    </div>
                    <div className="right-col" style={{width:"45%"}}>
                      <div className="period-date-cls">実施終了日</div>
                      <div className='calendar-area'>
                        <DatePicker
                            showPopperArrow={false}
                            locale="ja"
                            selected={this.state.period_end_date}
                            onChange={this.getPeriodEndDate}
                            dateFormat="yyyy/MM/dd"
                            inline
                            minDate={this.state.period_start_date}
                            dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="setting-area">
                    <div className="alert-label">{alert_text_01}</div>                
                    <div className="alert-label">{alert_text_02}</div>
                    <div className={'select-time-zone flex'}>
                      <div style={{padding:"1rem",width:"12rem"}}>
                        <Radiobox
                          label={radio_text}
                          value={0}
                          getUsage={this.setPeriodType.bind(this)}
                          checked={this.state.period_type === 0}
                          name={`period_type`}
                        />
                      </div>
                      <div className="week-area">
                        <Radiobox
                          label={'日'}
                          value={0}
                          getUsage={this.setPeriodCategory.bind(this)}
                          checked={this.state.period_category === 0}
                          isDisabled={this.state.period_type !== 0}
                          name={`period_category`}
                        />
                        <Radiobox
                          label={'週'}
                          value={1}
                          getUsage={this.setPeriodCategory.bind(this)}
                          checked={this.state.period_category === 1}
                          isDisabled={this.state.period_type !== 0}
                          name={`period_category`}
                        />
                        <Radiobox
                          label={'月'}
                          value={2}
                          getUsage={this.setPeriodCategory.bind(this)}
                          checked={this.state.period_category === 2}
                          isDisabled={this.state.period_type !== 0}
                          name={`period_category`}
                        />
                      </div>
                    </div>
                    <div className={'select-time-zone flex'}>
                      <div style={{padding:"1rem",width:"12rem"}}>
                        <Radiobox
                          label={'曜 日 指 定'}
                          value={1}
                          getUsage={this.setPeriodType.bind(this)}
                          checked={this.state.period_type === 1}
                          name={`period_type`}
                        />
                      </div>
                      <div className={'block-area'}>
                        <>
                          {this.state.week_days.map((item, index)=>{
                            return (
                              <>
                                <Checkbox
                                  label={item.name}
                                  getRadio={this.getCheckbox.bind(this, index)}
                                  number={index}
                                  value={item.checked}
                                  name={`select_weekdays`}
                                  isDisabled={this.state.period_type !== 1}
                                />
                              </>
                            );
                          })}
                        </>
                        <div>
                          <Button type="common" onClick={this.allSelect} style={{marginRight:"0.2rem"}}>全選択</Button>
                          <Button type="common" onClick={this.allDeSelect}>全解除</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <div
              onClick={this.confirmClose}
              className={"custom-modal-btn cancel-btn"}
              style={{cursor:"pointer"}}
              id='cancel_btn'
            >
              <span>キャンセル</span>
            </div>
            <div
              onClick={this.confirmOk}
              className={`custom-modal-btn ${can_save ? "red-btn":"disable-btn"}`}
              style={{cursor:"pointer"}}
            >
              <span>確定</span>
            </div>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

AdministratePeriodInputExaminationModal.contextType = Context;
AdministratePeriodInputExaminationModal.propTypes = {
  closeModal: PropTypes.func,
  saveAdministratePeriod: PropTypes.func,
  administrate_period: PropTypes.object,
  type: PropTypes.string,
  modal_data: PropTypes.object,
  patientId: PropTypes.number,
  patientInfo: PropTypes.Object,
  handleOk:PropTypes.func,
};

export default AdministratePeriodInputExaminationModal;