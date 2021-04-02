import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import RadioGroupButton from "~/components/molecules/RadioGroup";
import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatTimeIE} from "~/helpers/date";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import Radiobox from "~/components/molecules/Radiobox";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
import MonthCalendar from "./MonthCalendar";
import axios from "axios/index";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import GroupScheduleRegisterConfirmModal from "./GroupScheduleRegisterConfirmModal";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import Spinner from "react-bootstrap/Spinner";
import * as sessApi from "~/helpers/cacheSession-utils";

const Wrapper = styled.div`  
    width: 100%;
    height: 100%;
    font-size: 1rem;
    overflow-y:auto;
    .flex{
        display: flex;
    }
    .label-title {
        font-size: 1rem;
        text-align: right;
        padding-right: 0.5rem;
        width: 6rem;
        line-height: 2.3rem;
    }
    .radio-group-btn label {
        font-size: 16px;
        border: solid 1px rgb(206, 212, 218);
        border-radius: 4px;
        margin-left: 5px;
        text-align:center!important;
    }
 
    .implementation_month {
        display: flex;
        width: 100%;
        .implementation_month-label {
            text-align: right;
            width: 80px;
            padding-right: 5px;
            float: left;
            font-size: 1rem;
            margin: 0;
            line-height: 38px;
        }
        .radio-group-btn label{
            width: 50px;
            padding: 5px 0px 2px 0px;
        }
    }
    .implementation_interval {
        display: flex;
        width: 100%;
        .implementation_interval-label {
            text-align: right;
            width: 80px;
            padding-right: 5px;
            font-size: 1rem;
            margin: 0;
            line-height: 38px;
        }
        .radio-group-btn label{
            width: 70px;
            padding: 5px 0px 2px 0px;
        }
    }
    
    .react-datepicker-wrapper {
        width: calc(100% - 60px);
        .react-datepicker__input-container {
            width: 100%;
            input {
                font-size: 1rem;
                width: 100%;
                height: 2.3rem;
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
        display: flex;
        div {margin-top:0;}
        label {
            width: 0;
            padding-right: 0;
        }
        .pd-15 {
          padding: 0 0.5rem;
          line-height: 2.3rem;
        }
        .w55 {
            width: 55px;
        }
        .react-datepicker-wrapper {
            width: 8rem;
        }
        .label-title {margin: 0;}
    }
    .period div:first-child {
        .label-title {
            width: 6rem;
            text-align: right;
            padding-right: 0.5rem;
            font-size: 1rem;
            line-height: 2.3rem;
        }
    }
    .no-label .label-title {
      display:none;
    }
    .selet-day-check {
        label {
            padding-left: 95px;
            font-size: 16px;
            margin-top: 10px;
        }
    }
    .week-label {
        text-align: right;
        width: 80px;
        padding-right: 5px;
        font-size: 1rem;
        margin: 0;
        line-height: 38px;
    }
    .week-area .radio-group-btn label{
        width: 34px;
        padding: 3px 0px 2px 0px;
        margin-bottom: 0;
    }
    .block-area {
        border: 1px solid #aaa;
        margin-top: 1rem;
        padding: 10px;
        padding-bottom: 0.5rem;
        position: relative;
    }
    .block-title {
        position: absolute;
        top: -12px;
        left: 10px;
        font-size: 18px;
        background-color: white;
        padding-left: 5px;
        padding-right: 5px;
    }
    .select-time-zone {
        width: 500px;
        .label-title {
          padding-right: 0;
          width: 4.5rem;
          text-align: left;
        }
        label {
          line-height: 2.3rem;
          font-size: 1rem;
          margin-bottom: 0;
        }
    }
    .set-scheduled-doctor {
        .label-title {
          line-height: 2.3rem;
          margin-top: 8px;
          width: 4.5rem;
          padding-right: 0;
          text-align: left;
        }
        .scheduled-doctor-name {
            border:1px solid rgb(206, 212, 218);
            cursor:pointer;
            margin-top: 8px;
            margin-bottom: 8px;
            line-height: 2.3rem;
            height: 2.3rem;
            width: 21rem;
            padding-left: 5px;
        }
        .clear-btn {
          height: 2.3rem;
          margin-top: 8px;
        }
    }
    .set-scheduled-departure-time {
      .label-title {
        width:7rem;
        margin-bottom: 0;
      }
      .react-datepicker-wrapper {width: 130px;}
    }
    .clear-btn {
        height: 2.3rem;
        text-align: center;
        margin-left: 5px;
        min-width: 2.3rem;
        background-color: buttonface;
        border: 1px solid #7e7e7e;
        padding: 0;
        span{
          color:black;   
          font-size: 1rem;     
        }
    }
    .calendar-area {
        width: 250px;
        overflow-y: auto;
    }
    .condition-area {
        width: calc(100% - 250px);
        .select-visit-place {padding-top: 0.5rem;}
        padding-left: 0.5rem;
        .pullbox-select {
          width: 70rem;
          font-size: 1rem;
          height: 2.3rem;
        }
    }
`;

const SpinnerWrapper = styled.div`
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const implementation_interval_types = ["毎週", "第1曜日", "第2曜日", "第3曜日", "第4曜日", "第5曜日"];

const implementation_months = ["毎月", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

const week_days = ["日", "月", "火", "水", "木", "金", "土"];

class VisitTreatmentGroupModal extends Component {
  constructor(props) {
    super(props);
    let now_date = new Date();
    let next_month_date = new Date(now_date.getFullYear(), now_date.getMonth() + 2, 0);
    this.state = {
      visit_group : [{id: 0, value: "" }],
      visit_group_id:(props.visit_group_id !== undefined && props.visit_group_id != null) ? props.visit_group_id : 0,
      visit_group_name:'',
      check_enable_months: {0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false},
      check_enable_weeks: {0:false, 1:false, 2:false, 3:false, 4:false, 5:false},
      checkalldays: {0:false, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false},
      monthly_enable_week_number: 0,
      week_interval: 0,
      final_week_days: 0,
      time_limit_from:new Date(),
      time_limit_to:next_month_date,
      last_schedule_delete_flag:0,
      confirm_message:'',
      complete_message:'',
      visit_place : [{ id: 0, value: "" },],
      visit_place_id:(props.visit_place_id !== undefined && props.visit_place_id != null) ? props.visit_place_id : 0,
      visit_place_name:'',
      scheduled_time_zone:0,
      scheduled_doctor_number:null,
      scheduled_doctor_name:"",
      scheduled_departure_time:'',
      openSelectDoctorModal:false,
      calendar_months:[],
      schedule_data:{},
      alert_messages:'',
      openGroupScheduleRegisterConfirmModal:false,
      isCloseConfirm:false,
      load_flag:false,
    };
    this.schedule_color_info = null;
    this.change_flag = 0;
    this.group_master = [];
    this.doctors = sessApi.getDoctorList();
  }

  async componentDidMount() {
    await this.getScheduleColorInfo();
    await this.getHolidays();
    await this.getVisitGroup();
    await this.getPlaceGroup();
  }

  async getScheduleColorInfo(){
    let path = "/app/api/v2/visit/schedule/getColorInfo";
    let post_data = {
    };
    await axios.post(path, {params: post_data}).then((res)=>{
      this.schedule_color_info = res.data;
    })
  }

  async getHolidays(){
    let start_year = this.state.time_limit_from.getFullYear();
    let start_month = this.state.time_limit_from.getMonth() + 1;
    let end_year = this.state.time_limit_to.getFullYear();
    let end_month = this.state.time_limit_to.getMonth() + 1;
    let from_date = formatDateLine(new Date(start_year, start_month - 1, 1));
    let end_date = formatDateLine(new Date(end_year, end_month, 0));
    let path = "/app/api/v2/dial/schedule/get_holidays";
    let post_data = {
      start_date: from_date,
      end_date:end_date,
    };
    await axios.post(path, {params: post_data}).then((res)=>{
      this.getCalendarMonths(Object.keys(res.data));
    })
  }

  getCalendarMonths=(holidays)=>{
    let calendar_months = [];
    let year = this.state.time_limit_from.getFullYear();
    let month = this.state.time_limit_from.getMonth() + 1;
    let calendar_month = {year, month};
    calendar_months.push(calendar_month);
    do {
      if(month == 12){
        year++;
        month = 1;
      } else {
        month++;
      }
      if(new Date(year + '-' + (month > 9 ? month : '0'+month) + '-01').getTime() > new Date(formatDateLine(this.state.time_limit_to)).getTime()){
        break;
      } else {
        let calendar_month = {year, month}
        calendar_months.push(calendar_month);
      }
    } while (calendar_months.length > 0);
    this.setState({holidays, calendar_months});
  }

  getPlaceGroup =async()=>{
    let path = "/app/api/v2/visit/get/visit_place";
    let post_data = {
      is_enabled:1,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          let visit_place = this.state.visit_place;
          res.map(item=>{
            let place = {};
            place.id = item.visit_place_id;
            place.value = item.name;
            visit_place.push(place);
          })
          this.setState({
            visit_place,
            load_flag:true,
          });
        }
      })
      .catch(() => {
      });
  }

  getVisitGroup =async()=>{
    let path = "/app/api/v2/visit/get/visit_group";
    let post_data = {
      is_enabled:1,
    };
    await apiClient
      ._post(path, {
        params: post_data
      })
      .then((res) => {
        if(res.length > 0){
          this.group_master = res;
          if(this.state.visit_place_id != 0){
            let visit_group = [{id:0, value:""}];
            if(this.group_master.length > 0){
              this.group_master.map(group=>{
                if(this.state.visit_place_id == group.visit_place_id){
                  visit_group.push({id:group.visit_group_id, value:group.name});
                }
              });
              this.setState({visit_group});
            }
          }
        }
      })
      .catch(() => {
      });
  }

  getGroupSelect = e => {
    if(parseInt(e.target.id) !== this.state.visit_group_id){
      this.change_flag = 1;
      let select_obj = document.getElementsByClassName('select-visit-group')[0].getElementsByTagName("select")[0];
      if(select_obj != undefined && select_obj != null){
        if(e.target.value.length > 65){
          select_obj.style.fontSize = "0.65rem";
        } else {
          select_obj.style.fontSize = "1rem";
        }
      }
      this.setState({
        visit_group_id: parseInt(e.target.id),
        visit_group_name: e.target.value,
        schedule_data:{},
      });
    }
  };

  SetImplementationMonth = value => {
    this.change_flag = 1;
    let check_enable_months = this.state.check_enable_months;
    var monthly_enable_week_number = parseInt(this.state.monthly_enable_week_number);
    if(value !== 0 && check_enable_months[0] === true){
      check_enable_months[0] = false;
      monthly_enable_week_number --;
    }
    if(value === 0){
      monthly_enable_week_number = 1;
      check_enable_months = {0:true, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false};
    } else {
      check_enable_months[value] = check_enable_months[value] ? false : true;
      var pval = Math.pow(2, value);
      monthly_enable_week_number = ((monthly_enable_week_number & pval) > 0) ? (monthly_enable_week_number - pval) : (monthly_enable_week_number + pval);
    }
    this.setState({monthly_enable_week_number, check_enable_months});
  };

  SetWeekInterval = value => {
    this.change_flag = 1;
    let check_enable_weeks = this.state.check_enable_weeks;
    var week_interval = parseInt(this.state.week_interval);
    if(value !== 0 && check_enable_weeks[0] === true){
      check_enable_weeks[0] = false;
      week_interval --;
    }
    if(value === 0){
      week_interval = 1;
      check_enable_weeks = {0:true, 1:false, 2:false, 3:false, 4:false, 5:false, 6:false, 7:false, 8:false, 9:false, 10:false, 11:false, 12:false};
    } else {
      check_enable_weeks[value] = check_enable_weeks[value] ? false : true;
      var pval = Math.pow(2, value);
      week_interval = ((week_interval & pval) > 0) ?  (week_interval - pval) : (week_interval + pval);
    }
    this.setState({week_interval, check_enable_weeks});
  };

  addDay = (value) => {
    this.change_flag = 1;
    let checkalldays = this.state.checkalldays;
    checkalldays[value] = checkalldays[value] ? false : true;
    var final_week_days = parseInt(this.state.final_week_days);
    var pval = Math.pow(2, value);
    final_week_days = ((final_week_days & pval) > 0) ?  (final_week_days - pval) : (final_week_days + pval);
    this.setState({final_week_days, checkalldays});
  }

  getStartdate = (value) => {
    if(new Date(formatDateLine(new Date())).getTime() > new Date(formatDateLine(value)).getTime()){
      return;
    }
    this.change_flag = 1;
    this.setState({time_limit_from: value}, ()=>{
      this.getHolidays();
    });
  };

  getEnddate = value => {
    if(new Date(formatDateLine(new Date())).getTime() > new Date(formatDateLine(value)).getTime()){
      return;
    }
    this.change_flag = 1;
    this.setState({time_limit_to: value}, ()=>{
      this.getHolidays();
    });
  };

  register =async(register_type)=>{
    this.confirmCancel();
    this.setState({complete_message:'登録中'});
    let path = "/app/api/v2/visit/schedule/add_group";
    let post_data = {
      schedule_data:this.state.schedule_data,
      visit_place_id:this.state.visit_place_id,
      visit_group_id:this.state.visit_group_id,
      register_type,
      time_limit_from:formatDateLine(this.state.time_limit_from),
      time_limit_to:formatDateLine(this.state.time_limit_to),
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        window.sessionStorage.setItem("alert_messages", res.alert_message);
        this.props.closeModal('save');
      })
      .catch(() => {

      });
    this.setState({complete_message: ""});
  }

  confirmOk=()=> {
    if(this.state.confirm_type === 'force'){
      this.forceSaveSchedule();
    }
    if(this.state.confirm_type == "scheduled_doctor_number"){
      this.clearScheduledDoctor();
    }
    if(this.state.confirm_type == "scheduled_departure_time"){
      this.clearScheduledDepartureTime();
    }
  }

  confirmCancel=()=> {
    this.setState({
      confirm_message: "",
      confirm_type: "",
      openGroupScheduleRegisterConfirmModal: false,
      isCloseConfirm: false,
    });
  }

  openConfirmModal =(act)=>{
    let confirm_message = "";
    if(act === 'force'){
      confirm_message = "カレンダーに追加した予定の医師・時間枠・出発予定時刻を上書きしますか？";
      this.setState({
        confirm_message,
        confirm_type:act,
      });
    }
    if(act === 'all_save'){
      if(Object.keys(this.state.schedule_data).length > 0){
        this.setState({openGroupScheduleRegisterConfirmModal:true});
      } else {
        this.setState({alert_messages:"スケジュールを登録してください。"});
      }
    }
  }

  getPlaceSelect = (e) => {
    this.change_flag = 1;
    let select_obj = document.getElementsByClassName('select-visit-place')[0].getElementsByTagName("select")[0];
    if(select_obj != undefined && select_obj != null){
      if(e.target.value.length > 65){
        select_obj.style.fontSize = "0.65rem";
      } else {
        select_obj.style.fontSize = "1rem";
      }
    }
    let visit_place_id = parseInt(e.target.id);
    let visit_group = [{id:0, value:""}];
    if(this.group_master.length > 0){
      this.group_master.map(group=>{
        if(visit_place_id == group.visit_place_id){
          visit_group.push({id:group.visit_group_id, value:group.name});
        }
      })
    }
    this.setState({
      visit_place_id,
      visit_place_name: e.target.value,
      visit_group_id: 0,
      visit_group,
      schedule_data:{},
    });
  };

  setScheduledTimeZone = (e) => {
    this.change_flag = 1;
    this.setState({scheduled_time_zone:parseInt(e.target.value)});
  };

  setScheduledDepartureTime = value => {
    this.change_flag = 1;
    this.setState({scheduled_departure_time: value});
  };

  openSelectDoctorModal=()=>{
    this.change_flag = 1;
    this.setState({openSelectDoctorModal:true});
  }

  getDoctor = e => {
    this.change_flag = 1;
    this.selectDoctorFromModal(e.target.id, e.target.getAttribute("label"));
  };

  selectDoctorFromModal = (id, name) => {
    this.change_flag = 1;
    this.setState({
      scheduled_doctor_number: id,
      scheduled_doctor_name: name,
      openSelectDoctorModal: false,
    });
  };

  confirmClear=(type)=>{
    let confirm_message = "";
    if(type == "scheduled_doctor_number"){
      if(this.state.scheduled_doctor_number == null){
        return;
      }
      confirm_message = "予定医師を削除しますか？";
    }
    if(type == "scheduled_departure_time"){
      if(this.state.scheduled_departure_time == ""){
        return;
      }
      confirm_message = "出発予定時刻を削除しますか？";
    }
    this.setState({
      confirm_message,
      confirm_type:type
    });
  }

  clearScheduledDoctor=()=>{
    this.change_flag = 1;
    this.setState({
      scheduled_doctor_number: null,
      scheduled_doctor_name: "",
      confirm_type:"",
      confirm_message:""
    });
  }

  clearScheduledDepartureTime=()=>{
    this.change_flag = 1;
    this.setState({
      scheduled_departure_time: '',
      confirm_type:"",
      confirm_message:""
    });
  }

  closeModal = () => {
    this.setState({
      openSelectDoctorModal: false,
      alert_messages: "",
    });
  }

  getselectedtDate =(year, month, date)=>{
    let schedule_data = this.state.schedule_data;
    if(schedule_data[year+'-'+month+'-'+date] !== undefined){
      delete schedule_data[year+'-'+month+'-'+date];
    } else {
      if(this.state.visit_place_id === 0){
        this.setState({alert_messages:"施設を選択してください。"});
        return;
      }
      if(this.state.visit_group_id === 0){
        this.setState({alert_messages:"グループを選択してください。"});
        return;
      }
      schedule_data[year+'-'+month+'-'+date] = {};
      schedule_data[year+'-'+month+'-'+date]['scheduled_time_zone'] = this.state.scheduled_time_zone;
      schedule_data[year+'-'+month+'-'+date]['scheduled_doctor_number'] = this.state.scheduled_doctor_number;
      schedule_data[year+'-'+month+'-'+date]['scheduled_doctor_name'] = this.state.scheduled_doctor_name;
      schedule_data[year+'-'+month+'-'+date]['scheduled_departure_time'] = (this.state.scheduled_departure_time != null && this.state.scheduled_departure_time != "") ? formatTimeIE(this.state.scheduled_departure_time) : "";
    }
    this.change_flag = 1;
    this.setState({schedule_data});
  }

  saveSchedule=()=>{
    if(this.state.visit_place_id === 0){
      this.setState({alert_messages:"施設を選択してください。"});
      return;
    }
    if(this.state.visit_group_id === 0){
      this.setState({alert_messages:"グループを選択してください。"});
      return;
    }
    let schedule_data = this.state.schedule_data;
    let year = this.state.time_limit_from.getFullYear();
    let month = this.state.time_limit_from.getMonth() + 1;
    let day = this.state.time_limit_from.getDate();
    let while_condition = 1;
    do {
      if(new Date(year + '-' + (month > 9 ? month : '0'+month) + '-'+ (day > 9 ? day : '0'+day)).getTime() > new Date(formatDateLine(this.state.time_limit_to)).getTime()){
        break;
      } else {
        let validate_date = true;
        if(this.state.monthly_enable_week_number !== 0 && this.state.monthly_enable_week_number !== 1){
          let pmonth = Math.pow(2, month);
          if((this.state.monthly_enable_week_number & pmonth) > 0) {
            validate_date = true;
          } else {
            validate_date = false;
          }
        }
        if(validate_date === true){
          if(this.state.week_interval !== 0 && this.state.week_interval !== 1){
            let month_of_week = parseInt(day/7);
            if(parseInt(day%7) > 0){
              month_of_week++;
            }
            let pmonth_of_week = Math.pow(2, month_of_week);
            if((this.state.week_interval & pmonth_of_week) > 0) {
              validate_date = true;
            } else {
              validate_date = false;
            }
          }
        }
        if(validate_date === true){
          if(this.state.final_week_days !== 0){
            let cur_weekday = new Date(year + '-' + (month > 9 ? month : '0'+month) + '-'+ (day > 9 ? day : '0'+day)).getDay();
            let pval = Math.pow(2, cur_weekday);
            if((this.state.final_week_days & pval) > 0) {
              validate_date = true;
            } else {
              validate_date = false;
            }
          }
        }
        if(validate_date === true){
          schedule_data[year+'-'+month+'-'+day] = {};
          schedule_data[year+'-'+month+'-'+day]['scheduled_time_zone'] = this.state.scheduled_time_zone;
          schedule_data[year+'-'+month+'-'+day]['scheduled_doctor_number'] = this.state.scheduled_doctor_number;
          schedule_data[year+'-'+month+'-'+day]['scheduled_doctor_name'] = this.state.scheduled_doctor_name;
          schedule_data[year+'-'+month+'-'+day]['scheduled_departure_time'] = (this.state.scheduled_departure_time != null && this.state.scheduled_departure_time != "") ? formatTimeIE(this.state.scheduled_departure_time) : "";
        }
      }
      let month_last_day = new Date(year, month, 0);
      if(day == month_last_day.getDate()){
        day = 1;
        month++;
        if(month == 13){
          month = 1;
          year++;
        }
      } else {
        day++
      }
    } while (while_condition > 0);
    this.setState({schedule_data});
  }

  forceSaveSchedule=()=>{
    let schedule_data = this.state.schedule_data;
    Object.keys(schedule_data).map(date=>{
      schedule_data[date]['scheduled_time_zone'] = this.state.scheduled_time_zone;
      schedule_data[date]['scheduled_doctor_number'] = this.state.scheduled_doctor_number;
      schedule_data[date]['scheduled_doctor_name'] = this.state.scheduled_doctor_name;
      schedule_data[date]['scheduled_departure_time'] = (this.state.scheduled_departure_time != null && this.state.scheduled_departure_time != "") ? formatTimeIE(this.state.scheduled_departure_time) : "";
    });
    this.setState({
      schedule_data,
      confirm_message: "",
      confirm_type: "",
    });
  }

  changeSchedule=(schedule_date, key)=>{
    let schedule_data = this.state.schedule_data;
    if(key === "scheduled_doctor_number"){
      schedule_data[schedule_date][key] = this.state.scheduled_doctor_number;
      schedule_data[schedule_date]["scheduled_doctor_name"] = this.state.scheduled_doctor_name;
    }
    if(key === "scheduled_departure_time"){
      schedule_data[schedule_date][key] = (this.state.scheduled_departure_time != null && this.state.scheduled_departure_time != "") ? formatTimeIE(this.state.scheduled_departure_time) : "";
    }
  }

  confirmClose=()=>{
    if(this.change_flag == 1){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        isCloseConfirm:true,
      });
    } else {
      this.props.closeModal();
    }
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal treatment_group_modal first-view-modal">
          <Modal.Header>
            <Modal.Title>訪問診療グループスケジュール登録</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.load_flag ? (
                <div className={'flex'} style={{height:"100%"}}>
                  <div className={'calendar-area'} id={'calendar_area'}>
                    {this.state.calendar_months.length > 0 && (
                      this.state.calendar_months.map(calendar_month=>{
                        return (
                          <>
                            <MonthCalendar
                              selectDay={this.getselectedtDate.bind(this)}
                              changeSchedule={this.changeSchedule.bind(this)}
                              year={calendar_month.year}
                              month={calendar_month.month}
                              holidays={this.state.holidays}
                              schedule_color_info={this.schedule_color_info}
                              time_limit_from={this.state.time_limit_from}
                              time_limit_to={this.state.time_limit_to}
                              schedule_data={this.state.schedule_data}
                            />
                          </>
                        )
                      })
                    )}

                  </div>
                  <div className={'condition-area'}>
                    <div className={'select-visit-place'}>
                      <SelectorWithLabel
                        options={this.state.visit_place}
                        title="施設"
                        getSelect={this.getPlaceSelect}
                        departmentEditCode={this.state.visit_place_id}
                      />
                    </div>
                    <div className={'select-visit-group'}>
                      <SelectorWithLabel
                        options={this.state.visit_group}
                        title="グループ名"
                        getSelect={this.getGroupSelect}
                        departmentEditCode={this.state.visit_group_id}
                        isDisabled={this.state.visit_place_id === 0}
                      />
                    </div>
                    <div className="period flex">
                      <div className="start-date">
                        <InputWithLabel
                          label="期間"
                          type="date"
                          getInputText={this.getStartdate}
                          diseaseEditData={this.state.time_limit_from}
                        />
                      </div>
                      <div className="pd-15">～</div>
                      <div className={'no-label'}>
                        <InputWithLabel
                          label=""
                          type="date"
                          getInputText={this.getEnddate}
                          diseaseEditData={this.state.time_limit_to}
                        />
                      </div>
                    </div>
                    <div className={'flex'} style={{marginTop:"0.5rem"}}>
                      <div className={'block-area'} style={{width:"100%"}}>
                        <div className={'block-title'}>訪問診療条件</div>
                        <div className={'set-scheduled-doctor flex'}>
                          <label className={'label-title'}>予定医師</label>
                          <div className={'scheduled-doctor-name'} onClick={this.openSelectDoctorModal}>{this.state.scheduled_doctor_name !== '' ? this.state.scheduled_doctor_name : 'クリックで選択'}</div>
                          <Button className='clear-btn' onClick={this.confirmClear.bind(this, "scheduled_doctor_number")}>C</Button>
                        </div>
                        <div className={'flex'}>
                          <div className={'select-time-zone flex'}>
                            <label className={'label-title'}>時間枠</label>
                            <Radiobox
                              label={'時間枠なし'}
                              value={0}
                              getUsage={this.setScheduledTimeZone.bind(this)}
                              checked={this.state.scheduled_time_zone === 0}
                              disabled={true}
                              name={`scheduled_time_zone`}
                            />
                            <Radiobox
                              label={'午前'}
                              value={1}
                              getUsage={this.setScheduledTimeZone.bind(this)}
                              checked={this.state.scheduled_time_zone === 1}
                              disabled={true}
                              name={`scheduled_time_zone`}
                            />
                            <Radiobox
                              label={'午後'}
                              value={2}
                              getUsage={this.setScheduledTimeZone.bind(this)}
                              checked={this.state.scheduled_time_zone === 2}
                              disabled={true}
                              name={`scheduled_time_zone`}
                            />
                          </div>
                          <div className={'set-scheduled-departure-time flex'}>
                            <label className={'label-title'}>出発予定時刻</label>
                            <DatePicker
                              locale="ja"
                              selected={this.state.scheduled_departure_time}
                              onChange={this.setScheduledDepartureTime}
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={10}
                              dateFormat="HH:mm"
                              timeFormat="HH:mm"
                              timeCaption="出発予定時刻"
                            />
                            <Button className='clear-btn' onClick={this.confirmClear.bind(this, "scheduled_departure_time")}>C</Button>
                          </div>
                        </div>
                        <div>クリックした日付に反映、再度クリックで削除</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right", paddingTop:"10px"}}>
                      <Button
                        type="common"
                        isDisabled={Object.keys(this.state.schedule_data).length === 0}
                        className={Object.keys(this.state.schedule_data).length === 0 ? 'disable-btn' : ''}
                        onClick={this.openConfirmModal.bind(this, 'force')}
                      >{'< 現在の条件で全て上書き'}</Button>
                    </div>
                    <div className={'flex'} style={{marginTop:"0.5rem"}}>
                      <div className={'block-area'} style={{width:"100%"}}>
                        <div className={'block-title'}>実施月・間隔・曜日で一括追加</div>
                        <div className={'flex'}>
                          <div style={{width:"80px", textAlign:"center", marginTop:"64px"}}>
                            <Button type="common" onClick={this.saveSchedule}>{'< 追加'}</Button>
                          </div>
                          <div style={{width:"calc(100% - 80px)", marginTop:"10px"}}>
                            <div className="implementation_month">
                              <label className="implementation_month-label">実施月</label>
                              <>
                                {implementation_months.map((item, key)=>{
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
                                })}
                              </>
                            </div>
                            <div className="implementation_interval">
                              <label className="implementation_interval-label">実施間隔</label>
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
                            <div className={'week-area flex'}>
                              <label className="week-label">曜日</label>
                              <>
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
                              </>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ):(
                <div style={{width:"100%"}}>
                  <SpinnerWrapper>
                    <Spinner animation="border" variant="secondary" />
                  </SpinnerWrapper>
                </div>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <div onClick={this.confirmClose} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}} id='cancel_btn'>
              <span>キャンセル</span>
            </div>
            <div onClick={this.openConfirmModal.bind(this, 'all_save')} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}>
              <span>確定</span>
            </div>
          </Modal.Footer>
          {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.doctors != null && this.state.openSelectDoctorModal && (
            <SelectDoctorModal
              closeDoctor={this.closeModal}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.doctors}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.openGroupScheduleRegisterConfirmModal && (
            <GroupScheduleRegisterConfirmModal
              closeModal= {this.confirmCancel.bind(this)}
              visit_place_name={this.state.visit_place_name}
              visit_group_name={this.state.visit_group_name}
              time_limit_from={formatDateLine(this.state.time_limit_from)}
              time_limit_to={formatDateLine(this.state.time_limit_to)}
              handleOk={this.register.bind(this)}
            />
          )}
          {this.state.isCloseConfirm && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.props.closeModal}
              confirmTitle={this.state.confirm_message}
            />
          )}
        </Modal>
      </>
    );
  }
}

VisitTreatmentGroupModal.contextType = Context;
VisitTreatmentGroupModal.propTypes = {
  closeModal: PropTypes.func,
  visit_place_id: PropTypes.number,
  visit_group_id: PropTypes.number,
};

export default VisitTreatmentGroupModal;
