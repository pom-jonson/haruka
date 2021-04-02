import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import InputWithLabel from "~/components/molecules/InputWithLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import {formatDateLine, getWeekName} from "~/helpers/date";
import axios from "axios/index";
import GuidancePatientList from "~/components/templates/Patient/Medication/GuidancePatientList";
import LeaveHospitalGuidanceReport from "~/components/templates/Patient/Medication/LeaveHospitalGuidanceReport";
import MedicineReservationModal from "~/components/templates/Patient/Medication/MedicineReservationModal";
import * as apiClient from "~/api/apiClient";
import * as sessApi from "~/helpers/cacheSession-utils";
import Button from "~/components/atoms/Button";
import DatePicker  from "react-datepicker";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import Spinner from "react-bootstrap/Spinner";
import MedGuidanceCalculateModal from "~/components/templates/OrderList/MedGuidanceCalculateModal";
import DetailedPatient from "~/components/molecules/DetailedPatient";
import MedicineInjectionHistoryModal from "~/components/organisms/MedicineInjectionHistoryModal";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
const renderTooltip = (props) => <Tooltip {...props}>{props}</Tooltip>;

const SpinnerWrapper = styled.div`
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: absolute;
`;

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    font-size: 1rem;
    .flex {
        display: flex;
    }
    .div-button{
        border: 2px solid rgb(126, 126, 126) !important;
        margin: 0px;
        padding: 0px;
        width: 100%;
        height: 2rem;
        line-height: 2rem;    
        background: rgb(239, 239, 239);
        cursor: pointer;
        text-align: center;
    }
    .select-radio {
        label {
            line-height: 30px;
            font-size: 1rem;;
            width: 100px;
        }
    }
    .view-content {
        width: 300px;
        margin:auto;
        margin-top: -1rem;
        .view-box {
            border:1px solid #aaa;    
        }
        .div-width {
            width: 40px;
            margin-right: 10px;
            margin-left: 10px;
        }
    }
    .pullbox-label {
        margin-bottom: 0;
        .pullbox-select {
            width: 8rem;
            height: 30px;   
        }
    }
    .label-title {
        width: 7rem;
        text-align: right;
        line-height: 30px;
        margin-top: 0;
        margin-right: 10px;
        margin-bottom: 0;
        font-size: 1rem;
    }
    .select-doctor {
      .pullbox-select {
        width: 15rem;
      }
    }
    .select-check {
        width: 30rem;
        label {
            font-size: 1rem;
        }
    }
    .select-schedule-date .label-title {
        text-align: left;
        width: 3.5rem;
        .react-datepicker__input-container input {
          width: 7rem;
          height: 30px;
        }
    }
    
    .calendar-area {
      margin-top: 10px;
      width: 100%;
      height: calc(100% - 18.5rem);
      overflow-y: auto;
      overflow-x: auto;
      table {
        margin-bottom: 0;
        .order-number {
          width: 6rem;
          min-width: 6rem;
          left:0;
        }
        .room-name {
          width: 4rem;
          min-width: 4rem;
          left: 6rem;
        }
        .department {
          width: 8rem;
          min-width: 8rem;
          left: 10rem;
        }
        .patient-id {
          min-width: 5rem;
          width: 5rem;
          left: 18rem;
        }
        .patient-name {
          min-width: 9rem;
          width: 9rem;
          left: 23rem;
        }
        .gray-td {
          background: lightgray !important;
        }
        .button-td {
          min-width: 3rem;
          width: 3rem;
          left: 32rem;
          div {
            border-right: solid 1px lightgray;
            margin-right: -1px;
            width: calc(100% + 2px);
          }
        }
        .red-font {
          .status-box {
            color: red;
          }
        }
        .sticky-col {
          position: sticky;
          position: -webkit-sticky;
          padding: 0;
          background: white;
          height: 2rem;
          div {
            border-left: solid 1px lightgray;
            margin-left: -1px;
            width: calc(100% + 1px);
            padding: 0 0.2rem;
            height: 2rem;
          }
        }
        .report-div {
          padding-left: 2px;
          text-align: left;
          letter-spacing: -1.5px;
        }
        td {
          text-align: center;
          font-size: 1rem;
          vertical-align: middle;
          padding: 0;
        }
        th {
          text-align: center;
          font-size: 1rem;
          font-weight: normal;
          vertical-align: middle;
          padding: 0;
          height: 3.2rem;
          div {
            height: 2rem;
            line-height: 2rem;
          }
        }
      }
      .selected{
        background:lightblue!important;      
      }
    }
    .status-box {
        height: 2rem !important;
        width: 2rem !important;
        border: dashed 1px lightgray;
        borer-botttom: none;
        border-top: none;
        cursor:pointer;
        line-height: 2rem;
    }
    .header-btn-group {
        display: flex;
        .btn-group {
            margin-left: auto;
            display: flex;
        }
    }
`;
const ContextMenuUl = styled.div`
  margin-bottom: 0;
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
    line-height: 1.125rem;
    margin: 0;
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 1rem;
    }
  }
  .context-menu li:hover {
    background-color: #e6f7ff;
  }
  .context-menu li > i {
    margin-right: 8px;
  }
`;

const ContextMenu = ({visible,x,y,item, cur_date,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.contextMenuAction('reservation',item, cur_date)}>予約</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class MedicationGuidanceSchedule extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    let diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      diagnosis[parseInt(department.id)] = department.value;
    });
    let cache_ward_master = JSON.parse(window.sessionStorage.getItem("init_status")).ward_master;
    let ward_master = [{id:0, value:"全病棟"}];
    let ward_names = {};
    if (cache_ward_master != undefined && ward_master.length > 0){
      cache_ward_master.map(ward=>{
        ward_master.push({id:ward.number, value: ward.name});
        ward_names[parseInt(ward.number)] = ward.name;
      });
    }
    this.morning_time = "06:00";
    this.noon_time = "12:00";
    this.evening_time = "17:00";
    this.holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;
    this.medical_reservation_timezone = JSON.parse(window.sessionStorage.getItem("init_status")).medical_reservation_timezone;
    this.state = {
      collected_date:new Date(),
      department_id:0,
      department_codes,
      diagnosis,
      ward_master,
      first_ward_id:0,
      doctor_id:0,
      status:'',
      drug_instruction_flag_yes:0,
      drug_instruction_flag_no:0,
      home_instruction_flag:0,
      openGuidancePatientList:false,
      openLeaveHospitalGuidance:false,
      isOpenPlanModal:false,
      search_month: new Date(),
      is_loaded: false,
      table_list: [],
      select_order: null,
      select_patient_id:0,
      alert_messages:"",
      reservation_list: [],
      done_list: [],
      calculate_list: [],
      report_list: [],
      isOpenCalculateModal: false,
      isOpenPatientInfo: false,
      isOpenMedicineHistory: false,
      confirm_message: '',
    };
    this.departmentOptions = departmentOptions;
    this.focus = true;
    this.doctor_list = [];
    let doctor_code_list = [];
    let doctor_data = sessApi.getDoctorList();
    doctor_data.map(doctor=>{
      let index = doctor_code_list.indexOf(doctor.doctor_code);
      if(index === -1){
        doctor_code_list.push(doctor.doctor_code);
        doctor.id = doctor.number;
        doctor.value = doctor.name;
        this.doctor_list.push(doctor);
      }
    });
    this.doctor_list.unshift({id:0,value:''});
  }

  async UNSAFE_componentWillMount () {
    await this.getHolidays();
    await this.getSchedulePatient();
  }

  async componentDidMount() {
  }

  async getSchedulePatient () {
    let params = {
      search_date: formatDateLine(this.state.collected_date),
      doctor_id: this.state.doctor_id,
      department_id: this.state.department_id,
      home_instruction_flag: this.state.home_instruction_flag,
      drug_instruction_flag_yes: this.state.drug_instruction_flag_yes,
      drug_instruction_flag_no: this.state.drug_instruction_flag_no,
      first_ward_id: this.state.first_ward_id
    }
    await apiClient.post("/app/api/v2/secure/medicine_guidance_schedule/search?", params)
      .then((res) => {
        this.setState({
          is_loaded: true,
          table_list: res.order_list != undefined ? res.order_list : [],
          reservation_list: res.reservation_list != undefined ? res.reservation_list : [],
          report_list: res.report_list != undefined ? res.report_list : [],
          select_patient_id:0,
        })
      });
  }

  getDate = value => {
    this.setState({
      collected_date: value,
    });
  };

  getDepartment = e => {
    this.setState({
      department_id:e.target.id,
    })
  };

  setWard=(e)=>{
    this.setState({first_ward_id:e.target.id});
  };

  setStaffId=(e)=>{
    this.setState({doctor_id:e.target.id});
  };

  setStatus = (e) => {
    this.setState({status:parseInt(e.target.value)});
  };

  setCheck = (name, value) => {
    if (name === "drug_instruction_flag_yes"){
      this.setState({
        drug_instruction_flag_yes: value,
      });
    }
    if (name === "drug_instruction_flag_no"){
      this.setState({
        drug_instruction_flag_no: value,
      });
    }
    if (name === "home_instruction_flag"){
      this.setState({
        home_instruction_flag: value,
      });
    }
  };

  async getHolidays(){
    let now_date = this.state.search_month;
    let year = now_date.getFullYear();
    let month = now_date.getMonth();
    let from_date = formatDateLine(new Date(year, month, 1));
    let end_date = formatDateLine(new Date(year, month+1, 0));
    let path = "/app/api/v2/dial/schedule/get_holidays";
    let post_data = {
      start_date: from_date,
      end_date:end_date,
    };
    await axios.post(path, {params: post_data}).then((res)=>{
      this.setState({holidays:Object.keys(res.data)});
    })
  }

  setBackcolor = (date, day_of_week) => {
    let holidays = this.state.holidays;
    if (holidays == undefined || holidays == null || holidays.length == 0 || !holidays.includes(date)){
      if (this.holidays_color.days[day_of_week] == undefined || this.holidays_color.days[day_of_week] == null){
        return this.holidays_color.default.schedule_date_cell_back;
      } else {
        return this.holidays_color.days[day_of_week].schedule_date_cell_back;
      }
    } else {
      return this.holidays_color.holiday.schedule_date_cell_back;
    }
  };

  setFontcolor = (date, day_of_week) => {
    let holidays = this.state.holidays;
    if (holidays == undefined || holidays == null || holidays.length > 0 || !holidays.includes(date)){
      if (this.holidays_color.days[day_of_week] == undefined || this.holidays_color.days[day_of_week] == null){
        return this.holidays_color.default.schedule_date_cell_font;
      } else {
        return this.holidays_color.days[day_of_week].schedule_date_cell_font;
      }
    } else {
      return this.holidays_color.holiday.schedule_date_cell_font;
    }
  };

  createTable = (type, item = null, act_type = '') => {
    let start_date = new Date(this.state.collected_date);
    // let start_date = getPrevMonthByJapanFormat(this.state.collected_date);
    // let end_date = getNextMonthByJapanFormat(this.state.collected_date);
    let now_year = start_date.getFullYear();
    let now_month = start_date.getMonth()+1;
    let date_number = start_date.getDate();
    let tmp_month = now_month < 10 ? '0' + now_month : now_month;
    let tmp_date = (date_number) < 10 ? '0' + (date_number) : (date_number);
    let tmp_cur_date = now_year + '-' + tmp_month + '-' + tmp_date;
    let tmp_new_date = new Date(tmp_cur_date);
    let yesterday = new Date(tmp_new_date.setDate(tmp_new_date.getDate()-1));
    let table_menu = [];
    if(type === 'thead' || type === 'tbody'){
      let while_condition = 0;
      do {
        if(getWeekName(now_year, (now_month), (date_number)) === undefined){
          date_number = 1;
          if(now_month == 12){
            now_month = 1;
            now_year++;
          } else {
            now_month++;
          }
        }
        let month = now_month < 10 ? '0' + now_month : now_month;
        let date = (date_number) < 10 ? '0' + (date_number) : (date_number);
        let cur_date = now_year + '-' + month + '-' + date;
        if(type === 'thead'){
          let week = new Date(cur_date).getDay();
          table_menu.push(
            <th style={{background:this.setBackcolor(cur_date, week), color:this.setFontcolor(cur_date, week)}}>
              <div className="border-bottom">
                {month +'/'+date+'（'+getWeekName(now_year, now_month, (date_number))+'）'}
              </div>
              <div className="flex">
                <div className={'status-box'}>朝</div>
                <div className={'status-box'}>昼</div>
                <div className={'status-box'}>夕</div>
              </div>
            </th>
          )
        }
        if(type === 'tbody') {
          table_menu.push(
            <td onContextMenu={e => this.handleClick(e, item, cur_date, act_type)}>
              <div className={'flex'}>
                <div className={'status-box'} onClick={this.selectOrderItem.bind(this, item, cur_date, act_type, "morning")} onDoubleClick={this.openPlanModal.bind(this, item, cur_date, act_type)}>{this.getState(item, cur_date, act_type, "morning")}</div>
                <div className={'status-box'} onClick={this.selectOrderItem.bind(this, item, cur_date, act_type, "noon")} onDoubleClick={this.openPlanModal.bind(this, item, cur_date, act_type)}>{this.getState(item, cur_date, act_type, "noon")} </div>
                <div className={'status-box'} onClick={this.selectOrderItem.bind(this, item, cur_date, act_type, "evening")} onDoubleClick={this.openPlanModal.bind(this, item, cur_date, act_type)}>{this.getState(item, cur_date, act_type, "evening")} </div>
              </div>

            </td>
          );
        }
        date_number++;
        yesterday = new Date(yesterday.setDate(yesterday.getDate()+1));
        while_condition ++;
      } while (while_condition < 30);

    }
    return table_menu;
  };

  handleClick=(e, item, cur_date, act_type)=>{
    if (act_type != "reservation") return;
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("medication-guidance-schedule").offsetLeft,
          y: e.clientY + window.pageYOffset,
          item,
          cur_date
        },
        cur_date
      })
    }
  };
  contextMenuAction = (act, item, cur_date) => {
    if (act == 'reservation') {
      this.openPlanModal0(item, cur_date, "reservation");
    }
  };

  openGuidancePatientList=()=>{
    this.setState({openGuidancePatientList:true});
  };

  closeModal=()=>{
    this.setState({
      openGuidancePatientList:false,
      openLeaveHospitalGuidance:false,
      isOpenPlanModal:false,
      isOpenCalculateModal:false,
      isOpenPatientInfo:false,
      isOpenMedicineHistory:false,
      alert_messages:"",
      confirm_message:"",
    });
  };
  openLeaveHospitalGuidance = () => {
    if(this.state.select_patient_id == 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    this.setState({openLeaveHospitalGuidance:true});
  }
  getDoctor = (e) => {
    this.setState({doctor_id: e.target.id});
  };

  getDepartmentName = id => {
    let departmentStr = "";
    this.departmentOptions.map(item => {
      if (parseInt(item.id) === parseInt(id)) {
        departmentStr = item.value;
      }
    });
    return departmentStr;
  }
  openPlanModal = (order_item, date, action) => {
    if (action != "reservation") return;
    this.setState({
      select_date: date,
      isOpenPlanModal: true,
      select_order: order_item
    });
  };

  selectOrderItem = (order_item, date, action, timezone) => {
    if (order_item == undefined || order_item == null) return;
    let {done_list, reservation_list, calculate_list} = this.state;
    if (action == "reservation") {
      if (this.getState(order_item, date, "reservation", timezone) == "") return;
      let find_index = reservation_list.findIndex(x=>x.guidance_medication_request_id == order_item.number && x.guidance_date == date);
      if (find_index == -1) return;
      let category = (reservation_list[find_index].category + 1)%4
      reservation_list[find_index].category = category;
      let done_find_index = done_list.findIndex(x=>x.guidance_medication_request_id == order_item.number && x.guidance_date == date);
      if (done_find_index != -1) done_list[done_find_index].category = category
      let calculate_find_index = calculate_list.findIndex(x=>x.guidance_medication_request_id == order_item.number && x.guidance_date == date);
      if (calculate_find_index != -1) calculate_list[calculate_find_index].category = category
      if(category == 0) {
        reservation_list.splice(find_index, 1);
        if (done_find_index != -1) done_list.splice(done_find_index, 1);
        if (calculate_find_index != -1) calculate_list.splice(calculate_find_index, 1);
      }
      this.setState({reservation_list, done_list, calculate_list});
    } else if (action == "done") {
      if (this.getState(order_item, date, "reservation", timezone) == "") return;
      let insert_data = reservation_list.find(x=>x.guidance_medication_request_id == order_item.number && x.guidance_date == date);
      let exist_data = done_list.find(x=>x.guidance_medication_request_id == order_item.number && x.guidance_date == date);
      if (insert_data == undefined || exist_data != undefined) return;
      done_list.push(insert_data);
      this.setState({done_list});
    } else if (action == "calculate") {
      if (this.getState(order_item, date, "done", timezone) == "") return;
      if (reservation_list.findIndex(x=>x.guidance_medication_request_id == order_item.number && x.guidance_date == date) == -1) return;
      let insert_data = done_list.find(x=>x.guidance_medication_request_id == order_item.number && x.guidance_date == date);
      let exist_data = calculate_list.find(x=>x.guidance_medication_request_id == order_item.number && x.guidance_date == date);
      if (insert_data == undefined || exist_data != undefined) return;
      insert_data.order_data = order_item.order_data;
      insert_data.patient_name = order_item.patient_name;
      insert_data.patient_number = order_item.patient_number;
      this.setState({
        modal_data: insert_data,
        isOpenCalculateModal: true
      });
    }
  }

  getState = (item, date, action, timezone) => {
    if (item == undefined || item == null) return '';
    if(action == "reservation") {
      let {reservation_list} = this.state;
      if (reservation_list.length > 0) {
        let find_data = reservation_list.find(x=>x.guidance_medication_request_id == item.number && x.guidance_date == date);
        if (find_data == undefined) return "";
        if (this.isTimeZone(timezone, find_data.start_time)){
          if (find_data.category == 1) return "〇";
          else if (find_data.category == 2) return "□";
          else if (find_data.category == 3) return "Δ";
          else return "";
        }
      }
    } else if (action == 'done') {
      let {done_list, reservation_list} = this.state;
      if (done_list.length > 0) {
        let find_data = done_list.find(x=>x.guidance_medication_request_id == item.number && x.guidance_date == date);
        let reservation_find_data = reservation_list.find(x=>x.guidance_medication_request_id == item.number && x.guidance_date == date);
        if (find_data == undefined) return "";
        if (this.isTimeZone(timezone, find_data.start_time)){
          if (reservation_find_data.category == 1) return "●";
          else if (reservation_find_data.category == 2) return "■";
          else if (reservation_find_data.category == 3) return "▲";
          else return "";
        } 
      }
    } else if (action == "calculate") {
      let {calculate_list, reservation_list} = this.state;
      if (calculate_list.length > 0) {
        let find_data = calculate_list.find(x=>x.guidance_medication_request_id == item.number && x.guidance_date == date);
        let reservation_find_data = reservation_list.find(x=>x.guidance_medication_request_id == item.number && x.guidance_date == date);
        if (find_data == undefined) return "";
        if (this.isTimeZone(timezone, find_data.start_time)) {
          if (reservation_find_data.category == 1) return "●";
          else if (reservation_find_data.category == 2) return "■";
          else if (reservation_find_data.category == 3) return "▲";
          else return "";
        }
      }
    }
    return '';
  }

  isTimeZone = (timezone, start_time) => {
    if (timezone == 'morning' && this.getTimezone(start_time) == 'morning') {
      return true;
    }
    if (timezone == 'noon' && this.getTimezone(start_time) == 'noon') {
      return true;
    }
    if (timezone == 'evening' && this.getTimezone(start_time) == 'evening') {
      return true;
    }
    return false;
  }


  getTimezone = (start_time) => {
    let timezone = this.medical_reservation_timezone;
    if (timezone == undefined) {
      timezone = {
        "1": { "name": "朝", "start": "06:00", "end": "12:00"},
        "2": { "name": "昼", "start": "12:00", "end": "17:00"},
        "3": { "name": "夕", "start": "17:00", "end": "06:00"}
      }
    }
    var dt = new Date();
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var dt_str;
    var today = y+"/"+m+"/"+d;
    var compare_dt_str = today + " " + start_time;
    var compare_dt = new Date(compare_dt_str);
    dt_str = today + " " + timezone[3].end;
    var morning_start = new Date(dt_str);
    dt_str = today + " " + timezone[1].end;
    var morning_end = new Date(dt_str);
    dt_str = today + " " + timezone[2].end;
    var after_end =  new Date(dt_str);

    if(compare_dt.getTime() >= morning_start.getTime() && compare_dt.getTime() < morning_end.getTime()) {
        return "morning";
    } else if(compare_dt.getTime() >= morning_end.getTime() && compare_dt.getTime() < after_end.getTime()) {
        return "noon";
    } else {
        return "evening";
    }
  }

  selectPatient = async (patient_id, department_id, report_order_data=null) => {
    this.setState({
      select_patient_id : patient_id,
      select_patient_department_id:department_id,
      report_order_data,
    });
    const patientInfoResponse = {
      data: await axios.get("/app/api/v2/karte/patient_datailed", {
        // パラメータ
        params: {
          systemPatientId: patient_id
        }
      })
    };
    this.setState({
      detailedPatientInfo: patientInfoResponse.data.data
    });
  }

  reservation = (data) => {
    this.closeModal();
    let {reservation_list} = this.state;
    let find_index = reservation_list.findIndex(x=>x.guidance_medication_request_id == data.guidance_medication_request_id && x.guidance_date == data.guidance_date);
    if (find_index == -1) {
      reservation_list.push(data);
    } else {
      reservation_list[find_index] = data;
    }
    this.setState({reservation_list});
  };
  calculate = (data) => {
    this.closeModal();
    let {calculate_list} = this.state;
    calculate_list.push(data);
    this.setState({calculate_list});
  };

  saveData = () => {
    if (this.state.reservation_list.length == 0 && this.state.done_list.length == 0 && this.state.calculate_list.length == 0) return;
    this.setState({
      confirm_message: "確認しますか？",
      confirm_action: "save"
    });
  };
  openPatientModal = () => {
    if(this.state.select_patient_id == 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    this.setState({isOpenPatientInfo:true});
  }
  openMedicineHistoryModal = () => {
    if(this.state.select_patient_id == 0){
      this.setState({alert_messages: "患者様を選択してください。"});
      return;
    }
    this.setState({isOpenMedicineHistory:true});
  };
  confirmOk = async () => {
    if (this.state.confirm_action == 'save') {
      let params = {
        reservation_list: this.state.reservation_list,
        done_list: this.state.done_list,
        calculate_list: this.state.calculate_list,
      }
      await apiClient.post("/app/api/v2/secure/medicine_guidance_schedule/registerSchedule", params)
      .then((res) => {
        if (res) {
          this.props.closeModal();
        }
      });
    } else if (this.state.confirm_action == "print") {
      this.print();
    } else if (this.state.confirm_action == "print_list") {
      this.printList();
    }
  };
  confirmPrint=()=>{
    let base_modal = document.getElementsByClassName("medication-guidance-schedule")[0];
    if(base_modal !== undefined && base_modal != null){
        base_modal.style['z-index'] = 1040;
    }
    if(this.state.table_list.length > 0){
      this.setState({
        confirm_message:"帳票印刷しますか？",
        confirm_action:"print"
      });
    }
  }
  confirmPrintList=()=>{
    let base_modal = document.getElementsByClassName("medication-guidance-schedule")[0];
    if(base_modal !== undefined && base_modal != null){
        base_modal.style['z-index'] = 1040;
    }
    if(this.state.table_list.length > 0 || this.state.report_list.length > 0){
      this.setState({
        confirm_message:"一覧印刷しますか？",
        confirm_action: "print_list"
      });
    }
  };
  print = () => {
    this.setState({
      confirm_message:"",
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/secure/medicine_guidance_schedule/print/guidance_preview_list";
    let print_data = {};
    print_data.table_data = this.state.table_list;
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({complete_message:""});
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, '服薬指導スケジュール帳票.pdf');
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '服薬指導スケジュール帳票.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    })
      .catch(() => {
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  }
  printList = () => {
    this.setState({
      confirm_message:"",
      complete_message:"印刷中"
    });
    let path = "/app/api/v2/secure/medicine_guidance_schedule/print/guidance_schedule_list";
    let print_data = {
      table_list: this.state.table_list,
      report_list: this.state.report_list,
      reservation_list: this.state.reservation_list,
      done_list: this.state.done_list,
      calculate_list: this.state.calculate_list,
      collected_date: formatDateLine(this.state.collected_date)
    };
    axios({
      url: path,
      method: 'POST',
      data:{print_data},
      responseType: 'blob', // important
    }).then((response) => {
      this.setState({complete_message:""});
      const blob = new Blob([response.data], { type: 'application/octet-stream' });
      if(window.navigator.msSaveOrOpenBlob) {
        //IE11 & Edge
        window.navigator.msSaveOrOpenBlob(blob, '服薬指導スケジュール一覧.pdf');
      }
      else{
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', '服薬指導スケジュール一覧.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
      }
    })
      .catch(() => {
        this.setState({
          complete_message:"",
          alert_messages:"印刷失敗",
        });
      })
  }

  render() {
    let {ward_master,table_list, report_list} = this.state;
    let disable = false;
    if (this.state.reservation_list.length == 0 && this.state.done_list.length == 0 && this.state.calculate_list.length == 0) disable = true;
    const ExampleCustomInput = ({ onClick }) => (
      <div className="cur-date example-custom-input" onClick={onClick}>
        <Button type="common" style={{marginLeft:"10px"}}>カレンダー</Button>
      </div>
    );
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal medication-guidance-schedule first-view-modal" id="medication-guidance-schedule">
          <Modal.Header><Modal.Title>服薬指導スケジュール</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className="header-btn-group">
                  <div className="btn-group">
                    <Button type="common" onClick={this.openLeaveHospitalGuidance.bind(this)}>退院時指導レポート</Button>
                    <div className="calendar-btn">
                      <DatePicker
                        locale="ja"
                        selected={this.state.collected_date}
                        onChange={this.getDate.bind(this)}
                        dateFormat="yyyy/MM/dd"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        customInput={<ExampleCustomInput />}
                        dayClassName = {date => setDateColorClassName(date)}
                      />
                    </div>
                    <Button type="common" style={{marginLeft:"10px"}} onClick={this.openMedicineHistoryModal}>薬歴情報</Button>
                    <Button type="common" style={{marginLeft:"10px"}} onClick={this.openPatientModal}>患者情報</Button>
                    <Button type="common" style={{marginLeft:"10px"}} onClick={this.openGuidancePatientList}>指導患者一覧</Button>
                  </div>
                </div>
                <div className={'flex'} style={{paddingTop:"5px"}}>
                  <div className="select-schedule-date" style={{marginTop:"-0.5rem"}}>
                    <InputWithLabel
                      label="処理日"
                      type="date"
                      getInputText={this.getDate.bind(this)}
                      diseaseEditData={this.state.collected_date}
                    />
                  </div>
                  <div className={'select-doctor'}>
                    <SelectorWithLabel
                      title="担当薬剤師"
                      options={this.doctor_list}
                      getSelect={this.setStaffId}
                      departmentEditCode={this.state.doctor_id}
                    />
                  </div>
                  <div className={'select-department'}>
                    <SelectorWithLabel
                      title="診療科"
                      options={this.state.department_codes}
                      getSelect={this.getDepartment}
                      departmentEditCode={this.state.department_id}
                    />
                  </div>
                  <div className={'select-ward'}>
                    <SelectorWithLabel
                      title="病棟"
                      options={ward_master}
                      getSelect={this.setWard}
                      departmentEditCode={this.state.first_ward_id}
                    />
                  </div>
                </div>
                <div className={'flex'} style={{paddingTop:"10px"}}>
                  <div className={'select-radio flex'} style={{marginTop: "-0.5rem"}}>
                    <Radiobox
                      label={'通常'}
                      value={0}
                      getUsage={this.setStatus.bind(this)}
                      checked={this.state.status === 0}
                      disabled={true}
                      name={`radio_type`}
                    />
                    <Radiobox
                      label={'緊急'}
                      value={1}
                      getUsage={this.setStatus.bind(this)}
                      checked={this.state.status === 1}
                      disabled={true}
                      name={`radio_type`}
                    />
                  </div>
                  <div className={'select-check'}>
                    <Checkbox
                      label="麻薬指導あり"
                      getRadio={this.setCheck.bind(this)}
                      value={this.state.drug_instruction_flag_yes}
                      name="drug_instruction_flag_yes"
                    />
                    <Checkbox
                      label="麻薬指導なし"
                      getRadio={this.setCheck.bind(this)}
                      value={this.state.drug_instruction_flag_no}
                      name="drug_instruction_flag_no"
                    />
                    <Checkbox
                      label="在宅指導なし"
                      getRadio={this.setCheck.bind(this)}
                      value={this.state.home_instruction_flag}
                      name="home_instruction_flag"
                    />
                  </div>
                  <div style={{textAlign:"right", width:"calc(100% - 530px)"}}>
                    <Button type="common" onClick={this.getSchedulePatient.bind(this)}>検索</Button>
                  </div>
                </div>
                <div style={{textAlign:"right", marginTop:"10px"}}>
                  {/*<Button type"common style={{marginLeft:"10px"}} onClick={this.confirmPrint}>帳票印刷</button>*/}
                </div>
                <div className={'view-content'}>
                  <div>表示内容</div>
                  <div className={'view-box'}>
                    <div className={'flex'}>
                      <div className={'div-width'}> </div>
                      <div className={'div-width'}>注射</div>
                      <div className={'div-width'}>内服</div>
                      <div>その他</div>
                    </div>
                    <div className={'flex'}>
                      <div className={'div-width'}>予定</div>
                      <div className={'div-width'} style={{fontSize:10}}>○</div>
                      <div className={'div-width'} style={{marginTop:"-0.4rem"}}>□</div>
                      <div style={{fontSize:"10px"}}>Δ</div>
                      <div>（レポート）</div>
                    </div>
                    <div className={'flex'}>
                      <div className={'div-width'}>実施</div>
                      <div className={'div-width'} style={{marginTop:"-0.3rem"}}>●</div>
                      <div className={'div-width'} style={{fontSize:"10px"}}>■</div>
                    </div>
                    <div className={'flex'}>
                      <div className={'div-width'}>算定</div>
                      <div className={'div-width'} style={{color:"red",marginTop:"-0.3rem"}}>●</div>
                      <div className={'div-width'} style={{color:"red",fontSize:"10px"}}>■</div>
                      <div style={{color:"red",fontSize:"10px"}}>▲</div>
                    </div>
                  </div>
                </div>
                <div className={'calendar-area'}>
                  <table className="table-scroll table table-bordered" id="code-table">
                    <thead>
                    <tr>
                      <th className="order-number sticky-col"><div>オーダーID</div></th>
                      <th className="room-name sticky-col"><div>病室</div></th>
                      <th className="department sticky-col"><div>診療科</div></th>
                      <th className="patient-id sticky-col"><div>患者ID</div></th>
                      <th className="patient-name sticky-col"><div>氏名</div></th>
                      <th className="button-td sticky-col"></th>
                      {this.createTable('thead')}
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.is_loaded ? (
                        <>
                          {table_list != null && table_list.length > 0 && table_list.map((item, index)=>{
                              return (
                              <>
                                  <tr key={index}>
                                  <td className="text-right order-number sticky-col"><div>{item.number}</div></td>
                                  <td className={"text-left room-name sticky-col" + (item.is_carried_out_of_hospitalization != 1 ? " gray-td" : "")}>
                                    {item.is_carried_out_of_hospitalization != 1 ? (
                                      <OverlayTrigger overlay={renderTooltip("入院未実施のため予定病室")}>
                                        <div>{item.room_name}</div>
                                      </OverlayTrigger>
                                    ):(
                                      <div>{item.room_name}</div>
                                    )}
                                  </td>
                                  <td className="text-left department sticky-col"><div>{this.getDepartmentName(item.department_id)}</div></td>
                                  <td className="text-right patient-id sticky-col"><div>{item.patient_number}</div></td>
                                  <td className="text-left patient-name sticky-col" style={{cursor:"pointer"}}>
                                      <div onClick={this.selectPatient.bind(this, item.patient_id, item.department_id)} className={this.state.select_patient_id == item.patient_id ? "selected" : ""}>
                                      {item.patient_name}
                                      </div>
                                  </td>
                                  <td style={{cursor:"pointer"}} className="button-td sticky-col"><div className="div-button">予定</div></td>
                                  {this.createTable('tbody',item, "reservation")}
                                  </tr>
                                  <tr>
                                  <td className="text-right order-number sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left room-name sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left department sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-right patient-id sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left patient-name sticky-col"><div>&nbsp;</div></td>
                                  <td style={{cursor:"pointer"}} className="button-td sticky-col"><div className="div-button">実施</div></td>
                                  {this.createTable('tbody', item, "done")}
                                  </tr>
                                  <tr className='red-font'>
                                  <td className="text-right order-number sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left room-name sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left department sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-right patient-id sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left patient-name sticky-col"><div>&nbsp;</div></td>
                                  <td style={{cursor:"pointer"}} className="button-td sticky-col"><div className="div-button">算定</div></td>
                                  {this.createTable('tbody', item, "calculate")}
                                  </tr>
                              </>
                              )
                          })}
                          {report_list != null && report_list.length > 0 && report_list.map((item, index)=>{
                              return (
                              <>
                                  <tr key={index}>
                                  <td className="text-right order-number sticky-col"><div className="report-div">退院指導レポ</div></td>
                                  <td className="text-left room-name sticky-col"><div>{item.room_name}</div></td>
                                  <td className="text-left department sticky-col"><div>{this.getDepartmentName(item.department_id)}</div></td>
                                  <td className="text-right patient-id sticky-col"><div>{item.patient_number}</div></td>
                                  <td className="text-left patient-name sticky-col" style={{cursor:"pointer"}}>
                                      <div onClick={this.selectPatient.bind(this, item.patient_id, item.department_id, item.order_data)} className={this.state.select_patient_id == item.patient_id ? "selected" : ""}>
                                      {item.patient_name}
                                      </div>
                                  </td>
                                  <td style={{cursor:"pointer"}} className="button-td sticky-col"><div className="div-button">予定</div></td>
                                  {this.createTable('tbody')}
                                  </tr>
                                  <tr>
                                  <td className="text-right order-number sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left room-name sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left department sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-right patient-id sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left patient-name sticky-col"><div>&nbsp;</div></td>
                                  <td style={{cursor:"pointer"}} className="button-td sticky-col"><div className="div-button">実施</div></td>
                                  {this.createTable('tbody')}
                                  </tr>
                                  <tr className='red-font'>
                                  <td className="text-right order-number sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left room-name sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left department sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-right patient-id sticky-col"><div>&nbsp;</div></td>
                                  <td className="text-left patient-name sticky-col"><div>&nbsp;</div></td>
                                  <td style={{cursor:"pointer"}} className="button-td sticky-col"><div className="div-button">算定</div></td>
                                  {this.createTable('tbody')}
                                  </tr>
                              </>
                              )
                          })}
                        </>
                    ):(
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                    )}
                    </tbody>
                  </table>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={disable ? "disable-btn":"red-btn"} onClick={this.saveData}>確認</Button>
            <Button className={this.state.table_list.length > 0 || this.state.report_list.length > 0 ? "red-btn" :"disable-btn"} onClick={this.confirmPrintList}>一覧印刷</Button>
          </Modal.Footer>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          {this.state.openGuidancePatientList && (
            <GuidancePatientList
              closeModal={this.closeModal}
              ward_master={ward_master}
              doctor_list={this.doctor_list}
            />
          )}
          {this.state.openLeaveHospitalGuidance && (
            <LeaveHospitalGuidanceReport
              closeModal={this.closeModal}
              patientId={this.state.select_patient_id}
              department_id={this.state.select_patient_department_id}
              report_order_data={this.state.report_order_data}
            />
          )}
          {this.state.isOpenPlanModal && (
            <MedicineReservationModal
              closeModal={this.closeModal}
              select_order={this.state.select_order}
              select_date={this.state.select_date}
              handleOk={this.reservation}
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.isOpenCalculateModal && (
            <MedGuidanceCalculateModal
              closeModal={this.closeModal}
              handleOk={this.calculate}
              modal_title={'服薬指導算定'}
              modal_data={this.state.modal_data}
              from_source = {'schedule_modal'}
            />
          )}
          {this.state.isOpenPatientInfo && (
            <DetailedPatient
              id="modal-sample"
              tabIndex={1}
              closeModal={this.closeModal}
              patientId={this.state.select_patient_id}
              getSelected={this.getSelected}
              detailedPatientInfo={this.state.detailedPatientInfo}
            />
          )}
          {this.state.isOpenMedicineHistory && (
            <MedicineInjectionHistoryModal
              closeModal={this.closeModal}
              patientId={this.state.select_patient_id}
              search_date={this.state.collected_date}
              fromPatient={true}
            />
          )}
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
        </Modal>
      </>
    );
  }
}

MedicationGuidanceSchedule.contextType = Context;
MedicationGuidanceSchedule.propTypes = {
  closeModal: PropTypes.func,
};

export default MedicationGuidanceSchedule;