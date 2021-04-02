import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import {formatDateLine, formatTimeIE, getWeekName} from "~/helpers/date";
import axios from "axios/index";
import {
  getNextDayByJapanFormat,
  getAfterDayByJapanFormat,
  getPrevDayByJapanFormat,
  formatDateTimeIE
} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import Button from "~/components/atoms/Button";
import Spinner from "react-bootstrap/Spinner";
import ProgressGraphChange from "./ProgressGraphChange";
import ChartTitleModal from "./ChartTitleModal";
import renderHTML from 'react-render-html';
import VitalChart from "~/components/organisms/VitalChart";
import ResultInsert from "./ResultInsert"
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import DialSelectMasterModal from "~/components/templates/Dial/Common/DialSelectMasterModal";
import {addRedBorder, removeRedBorder, setDateColorClassName} from '~/helpers/dialConstants'
import ValidateAlertModal from "~/components/molecules/ValidateAlertModal";
import $ from "jquery";
import PassingTimeList from "~/components/templates/Nurse/soap_focus/PassingTimeList";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    font-size:1rem;
    .flex {display: flex;}
    .pullbox-label {
      margin-bottom: 0;
      .pullbox-select {
        width: 10rem;
        height: 2.3rem;   
      }
    }
    .border-style{
      border-bottom: 1px solid #aaa;
    }
    .label-title {
      width: 5rem;
      line-height: 2.3rem;
      margin: 0;
      font-size:1rem;
    }
    .pullbox {
      .label-title{
        width: 0;
      }
    }
    .btn-area{
      text-align:left;
      width:calc(100% - 30rem);
      button {
       height:2.3rem;
      }
    }
    .select-date {
      .date-label {
        line-height:2rem;
        margin-right:0.5rem;
      }
      button {
        margin-right:0.5rem;
      }
      .view-date {
        margin-right:0.5rem;
        .react-datepicker{
          width: 130% !important;
          font-size: 1.25rem;
          .react-datepicker__month-container{
            width:79% !important;
            height:24.375rem;
          }
          .react-datepicker__navigation--next--with-time{
            right: 6rem;
          }
          .react-datepicker__time-container{
            width:21% !important;
          }
          .react-datepicker__time-box{
            width:auto !important;
          }
          .react-datepicker__current-month{
            font-size: 1.25rem;
          }
          .react-datepicker__day-names, .react-datepicker__week{
            display: flex;
            justify-content: space-between;
          }
          .react-datepicker__month{
            .react-datepicker__week{
              margin-bottom:0.25rem;
            }
          }
        }
        .react-datepicker-wrapper {
          input {
            text-align:center;
            width: 10rem;
            height: 2rem;
          }
        }
      }
      .select-user {
        .user-title{
          width:5rem;
          text-align:right;
          margin-right:0.5rem;
          line-height: 2rem;
        }
        .user-value {
          width:20rem;
          height: 2rem;
          line-height: 2rem;
          border:1px solid #aaa;
          cursor:pointer;
          padding-left: 0.2rem;
        }
        .clear-btn {
          min-width: 2rem;
          height: 2rem;
          line-height: 2rem;
          padding: 0.05rem 0 0 0.2rem;
          margin-left: 0.5rem;
          span {font-size:1rem;}
        }
      }
    }
    .select-schedule-date .label-title {
        text-align: left;
        width: 40px;
    }
    
    .calendar-area {
      width: 70%;
      height: calc(100% - 2rem);
      margin-top:2rem;
      .wrapper {
        position: relative;
        overflow: auto;
        border: 1px solid #aaa;
        white-space: nowrap;
        width: 100%;
      }
      table {
        margin-bottom:0;
        th {
          text-align: center;
          vertical-align: middle;
          padding:0;
        }
        td {
          padding:0rem;
          vertical-align: middle;
          word-break: break-all;
          white-space: normal;
        }
      }
      .sticky-col {
        position: sticky;
        position: -webkit-sticky;
        padding: 0;
        background: white;
        div {
          padding:0 0.2rem;
        }
      }
      .content-td{
        padding-left 2px;
      }
      .td-first {
        width: 2rem;
        min-width: 2rem;
        max-width: 2rem;
        left: 0px;
        div{
          width: 2rem;
          min-width: 2rem;
          max-width: 2rem;
        }
      }
      .two-coloum {
        width: 3.5rem;
        min-width: 2.5rem;
        max-width: 4.5rem;
        left: 0px;
        div{
          width: 3.5rem;
          min-width: 2.5rem;
          max-width: 4.5rem;
        }
      }
      .three-coloum {
        width: 10rem;
        min-width: 10rem;
        max-width: 14rem;
        left: 0px;
        div{
          width: 10rem;
          min-width: 10rem;
          max-width: 14rem;
        }
        label {
          width: 3.3rem;
          margin-bottom:0;
          text-align: center;
        }
      }
      .td-second {
        width: 3rem;
        min-width: 2rem;
        max-width: 5rem;
        left: 2rem;
        
        div{
          width: 4rem;
          min-width: 4rem;
          max-width: 5rem;
        }
      }
      .td-third {
        width: 5rem;
        min-width: 5rem;
        max-width: 7rem;
        left: 5rem;
        div{
          width: 5rem;
          min-width: 5rem;
          max-width: 7rem;
        }
      }
      .td-div-border {
        border-right:1px solid #dee2e6;
        line-height:2.5rem;
        width:100%;
      }      
      .clickable{
        cursor:pointer;
      }
    }
    .patient-area {
      width: 28%;
      margin-left: 2%;
      height: 100%;
      .record-input {
        width:100%;
        height: calc(100% - 2rem);
        border: solid 1px gray;
        overflow-y: auto;
        textarea {
          width:100%;
          height:100%;
          overflow:hidden;
        }
      }
    }
    .axis-title{
      padding-left:6px;
      padding-right:11px;
      font-size:14px;
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

const SpinnerWrapper = styled.div`
    margin: auto;
    height:200px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ContextMenu = ({visible,x,y,item, cur_date, index,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {item == 'title' && (<>
              <li onClick={() => parent.contextMenuAction('title_create', cur_date)}><div>タイトル追加</div></li>
              <li onClick={() => parent.contextMenuAction('title_delete', cur_date, index)}><div>タイトル削除</div></li>
              <li onClick={() => parent.contextMenuAction('first', cur_date, index)}><div>一番上へ</div></li>
              <li onClick={() => parent.contextMenuAction('prev', cur_date, index)}><div>上へ</div></li>
              <li onClick={() => parent.contextMenuAction('next', cur_date, index)}><div>下へ</div></li>
              <li onClick={() => parent.contextMenuAction('last', cur_date, index)}><div>一番下へ</div></li></>
          )}
          {item == 'graph' && (<>
              <li onClick={() => parent.contextMenuAction('graph_change', cur_date)}><div>修正</div></li>
              <li onClick={() => parent.contextMenuAction('graph_delete', cur_date)}><div>削除</div></li>
            </>
          )}
          {(item == 'morning' ||item == 'noon' ||item == 'evening') ? (<>
              <li onClick={() => parent.contextMenuAction('meal_order_viewer', cur_date, item)}><div>オーダビューア</div></li>
            </>
          ):(<></>)}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

const ContextMenu_th = ({visible,x,y,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.changeRange(1)}>1日</div></li>
          <li><div onClick={() => parent.changeRange(2)}>3時間</div></li>
          <li><div onClick={() => parent.changeRange(3)}>1時間</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};
const ContextMenu_Graph = ({visible,x,y,measure_at,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() => parent.editGraphData(measure_at)}>修正</div></li>
          <li><div onClick={() => parent.deleteGraphData(measure_at)}>削除</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class PassingTimeRecord extends Component {
  constructor(props) {
    super(props);
    let departmentOptions = JSON.parse(window.sessionStorage.getItem("init_status")).diagnosis_treatment_department;
    let department_codes = [{id:0, value:"全て"}];
    this.diagnosis = {};
    departmentOptions.map(department=>{
      department_codes.push(department);
      this.diagnosis[parseInt(department.id)] = department.value;
    });
    this.holidays_color = JSON.parse(window.sessionStorage.getItem("init_status")).dial_schedule_date_color;
    this.ranges=[
      {id:0, value:''},
      {id:1, value:'1日'},
      {id:2, value:'3時間'},
      {id:3, value:'1時間'},
    ];
    this.max_x = null;
    this.min_x = null;
    this.state = {
      system_patient_id:props.patientId,
      search_date:new Date(),
      created_name:"",
      created_by:0,
      confirm_action:"",
      confirm_message:"",
      alert_type:"",
      alert_messages:"",
      passing_of_time:"",
      check_message:"",
      hos_number:0,
      isOpenPassingTimeList:false,
      
      
      department_id:0,
      department_codes,
      ward_master:[],
      first_ward_id:1,
      table_data:[],
      openTitleCreateModal: false,
      openGraphChangeModal: false,
      confirm_title: '',
      end_date: new Date(),
      patient_list:[],
      is_loaded: false,
      hospital_data_array: [],
      meal_data:[],
      staple_food_master: [],
      food_type_master: [],
      display_show: false,
      range: 3,
      chart_type: 0,
      graph_data: [],
      tier_master_2nd: [],
      tier_master_3rd: [],
      elapsed_result:[],
      isDeleteConfirmModal:false,
      openCreateModal:false,
      elapsed_select_items: [],
      elapsed_result_data: [],
      meal_order_view: false,
      complete_message: '',
    };
    this.movement_classification_options = {
      1:"入院",
      2:"退院",
      4:"転入",
      6:"加算区分",
      7:"主治医変更",
      8:"副担当医変更"
    };
    this.ChartRef = React.createRef();
    this.morning_meal_info = {};
    this.noon_meal_info = {};
    this.evening_meal_info = {};
    this.nurse_info = {};
    this.first_tag_id = "";
  }
  
  async UNSAFE_componentWillMount () {
    await this.getStaffList();
    await this.getHolidays();
    await this.getMasterData();
    await this.getSearchResult();
  }
  
  getSearchResult = async() => {
    let path = "/app/api/v2/nurse/get_progress_chart";
    let post_data = {
      search_date: formatDateLine(this.state.search_date),
      system_patient_id: this.state.system_patient_id,
      range: this.state.range,
      from_mode:"passing_time"
    };
    this.setState({is_loaded: false});
    await apiClient.post(path, post_data)
      .then((res) => {
        if(res.error_message != undefined){
          this.setState({
            alert_messages:res.error_message,
            alert_type:"modal_close",
          });
        } else {
          let graph_data = this.makeGraphData(res.vital_data);
          this.setState({
            hos_number: res.hos_number,
            hospital_data: res.hospital_data,
            meal_data: res.meal_data,
            treat_data: res.treat_data,
            vital_data: res.vital_data,
            elapsed_result_data: res.elapsed_result_data,
            nurse_instruction: res.nurse_instruction,
            graph_data,
            is_loaded: true,
          });
        }
      });
  }
  
  getMasterData = async() => {
    let path = "/app/api/v2/nurse/get_progress_chart";
    let post_data = {
      only_master: 1
    };
    this.setState({is_loaded: false});
    await apiClient.post(path, post_data)
      .then((res) => {
        let elapsed_select_items = [];
        if (res.elapsed_select_item_master != null && res.elapsed_select_item_master.length > 0) {
          res.elapsed_select_item_master.map(item=>{
            elapsed_select_items[item.number] = item;
          })
        }
        let tier_3rd_number_data = [];
        if (res.tier_master_3rd != null && res.tier_master_3rd.length > 0) {
          res.tier_master_3rd.map(item=>{
            tier_3rd_number_data[item.number] = item;
          })
        }
        this.setState({
          staple_food_master: res.staple_food_master,
          food_type_master: res.food_type_master,
          tier_master_2nd:res.tier_master_2nd,
          tier_master_3rd:res.tier_master_3rd,
          unit_master:res.unit_master,
          elapsed_select_item_master:res.elapsed_select_item_master,
          max_min_constants:res.max_min_constants,
          elapsed_select_items,
          tier_3rd_number_data,
          drink_master: res.drink_master
        })
      });
  }
  
  makeGraphData = (data) => {
    let graph_data = [
      { values: [], label: "体温" },
      { values: [], label: "脈拍" },
      { values: [], label: "低血圧" },
      { values: [], label: "高血圧" },
      { values: [], label: "呼吸数" },
    ];
    if (data == undefined || data.length == 0) return graph_data;
    data.map(item => {
      graph_data[0].values.push({x:item.measure_at, y:item.temperature});
      graph_data[1].values.push({x:item.measure_at, y:item.pluse});
      graph_data[2].values.push({x:item.measure_at, y:item.min_blood});
      graph_data[3].values.push({x:item.measure_at, y:item.max_blood});
      graph_data[4].values.push({x:item.measure_at, y:item.respiratory});
    });
    return graph_data;
  }
  
  moveDay = (type) => {
    if (!this.state.is_loaded) return;
    let now_day = this.state.search_date;
    let now_hour = now_day.getHours();
    let now_minutes = now_day.getMinutes();
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    cur_day.setHours(now_hour);
    cur_day.setMinutes(now_minutes);
    this.setState({
      search_date: cur_day,
    }, ()=>{
      this.getSearchResult();
    });
  };
  
  moveWeek = (type) => {
    if (!this.state.is_loaded) return;
    let now_week = this.state.search_date;
    let now_hour = now_week.getHours();
    let now_minutes = now_week.getMinutes();
    let cur_week = type === 'next' ? getAfterDayByJapanFormat(now_week, 7) : getAfterDayByJapanFormat(now_week, -7);
    cur_week.setHours(now_hour);
    cur_week.setMinutes(now_minutes);
    this.setState({
      search_date: cur_week,
    }, ()=>{
      this.getSearchResult();
    });
  };
  
  async getHolidays(){
    let now_date = this.state.search_date;
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
  checkDate(from, to) {
    let from_date = from.substring(0, 10);
    let to_date = to.substring(0, 10);
    from_date = new Date(from_date);
    to_date = new Date(to_date);
    if (from_date.getTime() > to_date.getTime()) return false;
    return true;
  }
  findHospitalDataByDate = (cur_date) => {
    let {hospital_data} = this.state;
    let find_hos_data = [];
    if (hospital_data === undefined || hospital_data.length === 0) return null;
    hospital_data.map(item=> {
      if (item.date_and_time_of_hospitalization != null && this.checkDate(item.date_and_time_of_hospitalization, cur_date)) {
        if (item.discharge_date == null) {
          find_hos_data.push(item);
        } else {
          if (this.checkDate(cur_date, item.discharge_date)) {
            find_hos_data.push(item);
          }
        }
      }
    });
    if (find_hos_data.length > 0) return find_hos_data;
    else return null;
  }
  
  getTdState = (item = null,cur_date, cur_item) => {
    if (item != null && item !== '' && this.state.system_patient_id > 0) {
      let {hospital_data} = this.state;
      if (hospital_data === undefined || hospital_data.length === 0) return '';
      let find_hos_data = this.findHospitalDataByDate(cur_date);
      if (item === 'hospital_dates') {
        if (find_hos_data == null) return '';
        let hospital_date = find_hos_data[0].date_and_time_of_hospitalization;
        return this.getDates(hospital_date, cur_date);
      } else if (item === 'surgery_day') {
        if (find_hos_data == null) return '';
        let surgery_day = find_hos_data[0].surgery_day;
        if (surgery_day == null || surgery_day === '') return '';
        return this.getDates(surgery_day, cur_date);
      } else if (item === "move_info") {
        if (find_hos_data == null) return '';
        let move_info = [];
        find_hos_data.map(hos_item=>{
          if (hos_item.moving_day != null && hos_item.moving_day !== "") {
            if (cur_date.substr(0, 10) === hos_item.moving_day.substr(0, 10)) {
              let movement_classification = hos_item.movement_classification;
              if (movement_classification > 0  && this.movement_classification_options[movement_classification] !== undefined) {
                move_info.push(this.movement_classification_options[movement_classification]);
              }
            }
          }
        });
        if (move_info.length === 0) return "";
        return move_info.join(",");
      } else if (item === "morning") {
        this.morning_meal_info[cur_date] = this.getMealInfoByCategory('morning', cur_date);
        return renderHTML(this.getMealInfoByCategory('morning', cur_date));
      } else if (item === "noon") {
        this.noon_meal_info[cur_date] = this.getMealInfoByCategory('noon', cur_date);
        return renderHTML(this.getMealInfoByCategory('noon', cur_date));
      } else if (item === "evening") {
        this.evening_meal_info[cur_date] = this.getMealInfoByCategory('evening', cur_date);
        return renderHTML(this.getMealInfoByCategory('evening', cur_date));
      } else if (item === "treatment") {
        return renderHTML(this.getTreatData(cur_date));
      } else if (item === "title") {
        let {elapsed_result, elapsed_select_items} = this.state;
        if(elapsed_result == null || elapsed_result.length === 0) return "";
        let find_data = null;
        elapsed_result.map(item => {
            if (item.input_datetime != null && item.input_datetime != '' && cur_item != undefined && cur_item != null && item.tier_3rd_id == cur_item.tier_3rd_id) {
            if(this.getTimeState(cur_date, item.input_datetime)) find_data = item;
          }
        });
        if (find_data == null) return '';
        if (find_data.result == undefined || find_data.result == "") return '';
        if (elapsed_select_items[find_data.result] == undefined) return '';
        if (find_data.comment == undefined || find_data.comment == null || find_data.comment == "")
          return elapsed_select_items[find_data.result].name;
        else
          return renderHTML(elapsed_select_items[find_data.result].name + "<br />" + find_data.comment + "");
      } else if (item === "nurse_instruction") {
        let {nurse_instruction} = this.state;
       delete this.nurse_info[cur_date];
        if (nurse_instruction === undefined || nurse_instruction.length === 0) return "";
        let instruction_array = [];
        nurse_instruction.map(item=>{
          if (this.state.range == 1) {
            if (item.schedule_dates !== undefined && Object.keys(item.schedule_dates).length > 0 && Object.keys(item.schedule_dates).indexOf(cur_date)>-1) {
              instruction_array.push(item.name);
            }
          } else {
            let day_val = cur_date.substr(0, 10);
            if (item.schedule_dates !== undefined && Object.keys(item.schedule_dates).length > 0 && Object.keys(item.schedule_dates).indexOf(day_val)>-1) {
              let time_array = item.schedule_dates[day_val];
              if (time_array != undefined && time_array.length > 0) {
                time_array.map(time_item=>{
                  let date_time = day_val + " " + time_item;
                  if (this.getTimeState(cur_date, date_time)) {
                    instruction_array.push(item.name);
                  }
                })
              }
            }
          }
        });
        if (instruction_array.length > 0) {
          this.nurse_info[cur_date] = instruction_array.join("、");
          return instruction_array.join("、");
        }
      }
    }
    return '';
  }
  
  getTimeState = (cur_datetime, datetime) => {
    cur_datetime = cur_datetime.split("-").join("/");
    datetime = datetime.split("-").join("/");
    let {range} = this.state;
    if (range == 1) {
      let input_date = datetime.substr(0,10);
      if(input_date == cur_datetime) return true;
    } else if (range == 2) {
      let start_datetime = new Date(cur_datetime).getTime();
      let start_time = parseInt(cur_datetime.substr(11, 2));
      let end_time = start_time + 3;
      end_time = (end_time) < 10 ? '0' + (end_time) : (end_time);
      let end_datetime = cur_datetime.substr(0, 11) + end_time + ":00";
      end_datetime = new Date(end_datetime).getTime();
      datetime = new Date(datetime).getTime();
      if (datetime >= start_datetime && datetime < end_datetime) return true;
    } else if (range == 3) {
      let start_datetime = new Date(cur_datetime).getTime();
      let start_time = parseInt(cur_datetime.substr(11, 2));
      let end_time = start_time + 1;
      end_time = (end_time) < 10 ? '0' + (end_time) : (end_time);
      let end_datetime = cur_datetime.substr(0, 11) + end_time + ":00";
      end_datetime = new Date(end_datetime).getTime();
      datetime = new Date(datetime).getTime();
      if (datetime >= start_datetime && datetime < end_datetime) return true;
    }
    return false;
  }
  getTreatData (cur_date) {
    let {treat_data} = this.state;
    cur_date = cur_date.substr(0, 10);
    if (treat_data == undefined || treat_data[cur_date] == undefined) return '';
    let order_data = treat_data[cur_date];
    if (order_data.order_data.detail == undefined) return '';
    let result = '';
    order_data.order_data.detail.map((item, index)=>{
      if (item.practice_name != undefined && item.practice_name != ''){
        result = result + item.practice_name;
        if (index < order_data.order_data.length - 1) result += '<br />';
      }
    });
    return result;
  }
  
  getMealInfoData = (_date, _start_time_classification) => {
    let meal_info = null;
    let meal_date = this.state.search_date;
    let break_flag = 0;
    for(let i = 1; i <= 7; i++){
      if(break_flag == 1) break;
      let str_date = formatDateLine(meal_date);
      for(let j = 1; j<= 3; j++){
        if(!this.state.meal_data[str_date]){
          if(str_date == _date && j == _start_time_classification) {
            break_flag = 1;
            break;
          }
          continue;
        }
        if(!this.state.meal_data[str_date][j]){
          if(str_date == _date && j == _start_time_classification) {
            break_flag = 1;
            break;
          }
          continue;
        }
        meal_info = this.state.meal_data[str_date][j];
        if(str_date == _date && j == _start_time_classification) {
          break_flag = 1;
          break;
        }
      }
      meal_date = getNextDayByJapanFormat(meal_date);
    }
    return meal_info;
  }
  getDateFormat = (_date) => {
    let now_year = _date.getFullYear();
    let now_month = _date.getMonth()+1;
    let date_number = _date.getDate();
    
    let tmp_month = now_month < 10 ? '0' + now_month : now_month;
    let tmp_date = (date_number) < 10 ? '0' + (date_number) : (date_number);
    let tmp_cur_date = now_year + '-' + tmp_month + '-' + tmp_date;
    let tmp_new_date = new Date(tmp_cur_date);
    
    return tmp_new_date;
  }
  getBeforeAndAfterDate = (_date, nDays) => {
    return new Date(_date.setDate(_date.getDate() + parseInt(nDays)));
  }
  
  getMealInfoByCategory = (category, cur_date) => {
    let category_num = category == "morning" ? 1 : category == "noon" ? 2 : category == "evening" ? 3: 0;
    if(category_num == 0) return;
    
    let meal_info = null;
    meal_info = this.getMealInfoData(cur_date, category_num);
    if (meal_info == null || meal_info == undefined){
      return "";
    }
    
    let _date = this.getDateFormat(new Date(cur_date));
    let before_date = this.getBeforeAndAfterDate(_date, -1);
    let meal_before_info = null;
    if(category_num == 1){
      meal_before_info = this.getMealInfoData(formatDateLine(before_date), 3);// get before date and evening's info
    } else {
      meal_before_info = this.getMealInfoData(cur_date, category_num - 1);// get cur date and before time's info
    }
    let str_from_date_line = formatDateLine(this.state.search_date);
    if (cur_date == str_from_date_line && category == "morning") {
      meal_before_info = null;
    }
    
    let staple_food_id = meal_info.staple_food_id_morning;
    if (category == "noon") {
      staple_food_id = meal_info.staple_food_id_noon;
    } else if(category == "evening") {
      staple_food_id = meal_info.staple_food_id_evening;
    }
    
    if (staple_food_id == null) return "";
    if (meal_before_info != null && meal_before_info != undefined) {
      let staple_food_id_before = meal_before_info.staple_food_id_evening;
      if (category == "noon") {
        staple_food_id_before = meal_before_info.staple_food_id_morning;
      } else if(category == "evening") {
        staple_food_id_before = meal_before_info.staple_food_id_noon;
      }
      if (staple_food_id_before == staple_food_id) {
        return "";
      } else {
        if (cur_date == str_from_date_line) {
          return "→" + this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(staple_food_id) + ">";
        } else {
          return this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(staple_food_id) + ">";
        }
      }
    } else {
      if (cur_date == str_from_date_line) {
        return "→" + this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(staple_food_id) + ">";
      } else {
        return this.getFoodTypeName(meal_info.food_type_id) + "<br/>" + "<" + this.getStapleFoodName(staple_food_id) + ">";
      }
    }
  }
  
  getFoodTypeName = (id) => {
    let result = "";
    let food_type_master = this.state.food_type_master;
    if (food_type_master != null && food_type_master != undefined && food_type_master.length > 0) {
      food_type_master.map(item=>{
        if (id == item.number) {
          result = item.name;
        }
      });
    }
    return result;
  }
  
  // 主食マスタ.名称 from 食事テーブル.主食ID
  getStapleFoodName = (id) => {
    let result = "";
    let staple_food_master = this.state.staple_food_master;
    if (staple_food_master != null && staple_food_master != undefined && staple_food_master.length > 0) {
      staple_food_master.map(item=>{
        if (id == item.number) {
          result = item.name;
        }
      });
    }
    return result;
  }
  getDrinkName = (id) => {
    let result = "";
    let {drink_master} = this.state;
    if (drink_master != null && drink_master != undefined && drink_master.length > 0) {
      drink_master.map(item=>{
        if (id == item.number) {
          result = item.name;
        }
      });
    }
    return result;
  }
  
  getDates(from_date, end_date) {
    if (from_date == null || from_date == "" || end_date == null || end_date == "") return  "";
    let from = new Date(from_date.substring(0, 10));
    let to = new Date(end_date.substring(0, 10));
    if (to.getTime()>=from.getTime()) {
      return parseInt((to.getTime() - from.getTime())/(60 * 60 * 1000 * 24) + 1);
    }
    return null;
  }
  getDate = (key,value) => {
    this.setState({[key]: value});
  }
  createTable = (type, item=null, index=null) => {
    let start_date = new Date(this.state.search_date);
    let now_year = start_date.getFullYear();
    let now_month = start_date.getMonth()+1;
    let date_number = start_date.getDate();
    let table_menu = [];
    
    let tmp_month = now_month < 10 ? '0' + now_month : now_month;
    let tmp_date = (date_number) < 10 ? '0' + (date_number) : (date_number);
    let tmp_cur_date = now_year + '-' + tmp_month + '-' + tmp_date;
    let tmp_new_date = new Date(tmp_cur_date);
    let yesterday = new Date(tmp_new_date.setDate(tmp_new_date.getDate()));
    if(type === 'thead' || type === 'tbody'){
      let while_condition = 0;
      var cycle_max = 7;
      if (this.state.range == 2) cycle_max = 8;
      if (this.state.range == 3) cycle_max = 24;
      do {
        if (this.state.range == 1){       //1日----------------------------
          now_year = yesterday.getFullYear();
          now_month = yesterday.getMonth()+1;
          date_number = yesterday.getDate();
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
              <th onContextMenu={e => this.handleClick_th(e)}
                  style={{background:this.setBackcolor(cur_date, week), color:this.setFontcolor(cur_date, week), width:'7.5rem'}}>
                <div style={{textAlign:"center"}}>{month +'/'+date}</div>
                <div style={{textAlign:"center"}}>{'（'+getWeekName(now_year, now_month, (date_number))+'）'}</div>
              </th>
            )
          }
          if(type === 'tbody') {
            table_menu.push(
              <>
                {item != null ? (
                  <>
                    <td onContextMenu={e => this.handleClick(e, item, cur_date, index)} onClick={this.openResultModal.bind(this, item, index, cur_date)} className="text-center content-td" style={{width:'7.5rem'}}>
                      {this.getTdState(item, cur_date, index)}
                    </td>
                  </>
                ):(
                  <>
                    <td style={{width: '7.5rem'}}/>
                  </>
                )}
              </>
            );
          }
          date_number++;
          yesterday = new Date(yesterday.setDate(yesterday.getDate()+1));
        }
        if (this.state.range == 2){   //3時間
          if(type === 'thead'){
            table_menu.push(
              <th style={{width:'6.5rem'}} onContextMenu={e => this.handleClick_th(e)}>{while_condition * 3}時</th>
            )
          }
          if(type === 'tbody') {
            let hour_number = while_condition * 3;
            hour_number = (hour_number) < 10 ? '0' + (hour_number) : (hour_number);
            let cur_date = now_year + "-" + tmp_month + "-" + tmp_date;
            let cur_datetime = now_year + "-" + tmp_month + "-" + tmp_date + " " + hour_number + ":00";
            table_menu.push(
              <>
                {item != null ? (
                  <>
                    {(item == "hospital_dates" || item == "surgery_day" || item == "morning" || item == "noon" || item == "evening" || item == "move_info" || item == "graph" || item == "treatment") ? (
                      <>
                        {while_condition == 0 && (
                          <td colSpan={8} className={`content-td`}>
                            {this.getTdState(item, cur_date)}
                          </td>
                        )}
                      </>
                    ):(
                      <td onContextMenu={e => this.handleClick(e, item, cur_datetime, index)} className={` content-td`} onClick={this.openResultModal.bind(this, item, index, cur_datetime)}>
                        {this.getTdState(item, cur_datetime, index)}
                      </td>
                    )}
                  </>
                ):(
                  <>
                    <td>&nbsp;</td>
                  </>
                )}
              </>
            );
          }
        }
        if (this.state.range == 3){   //1時間
          if(type === 'thead'){
            table_menu.push(
              <th style={{width:'2.2rem'}} onContextMenu={e => this.handleClick_th(e)}>{while_condition}</th>
            )
          }
          if(type === 'tbody') {
            // if (while_condition == 0){
            let hour_number = while_condition * 1;
            hour_number = (hour_number) < 10 ? '0' + (hour_number) : (hour_number);
            let cur_date = now_year + "-" + tmp_month + "-" + tmp_date;
            let cur_datetime = now_year + "-" + tmp_month + "-" + tmp_date + " " + hour_number + ":00";
            table_menu.push(
              <>
                {item != null ? (
                  <>
                    {(item == "hospital_dates" || item == "surgery_day" || item == "morning" || item == "noon" || item == "evening" || item == "move_info" || item == "graph" || item == "treatment") ? (
                      <>
                        {while_condition == 0 && (
                          <td colSpan={24} className={`content-td`}>
                            {this.getTdState(item, cur_date)}
                          </td>
                        )}
                      </>
                    ):(
                      <td onContextMenu={e => this.handleClick(e, item, cur_datetime, index)} className={`content-td`} onClick={this.openResultModal.bind(this, item, index, cur_datetime)}>
                        {this.getTdState(item, cur_datetime, index)}
                      </td>
                    )}
                  </>
                ):(
                  <>
                    <td></td>
                  </>
                )}
              </>
            );
          }
          // }
        }
        while_condition ++;
      } while (while_condition < cycle_max);
    }
    return table_menu;
  };
  
  showGraphMenu = (e, measure_at) => {
    if (this.state.system_patient_id == undefined || this.state.system_patient_id == null) return;
    setTimeout(() => {
      this.setState({
        contextMenu_Graph: {
          visible: true,
          x: e.x + document.getElementsByClassName("chat-image")[0].offsetLeft + 10,
          y: e.y + document.getElementsByClassName("calendar-area")[0].offsetTop + document.getElementsByClassName("graph-tr")[0].offsetTop - document.getElementsByClassName("wrapper")[0].scrollTop + 70,
          measure_at:measure_at
        },
      }, () => {
        // setTimeout(() => {
        // eslint-disable-next-line consistent-this
        const that = this;
        document.addEventListener(`click`, function onClickOutside() {
          that.setState({ contextMenu_Graph: { visible: false } });
          document.removeEventListener(`click`, onClickOutside);
        });
        window.addEventListener("scroll", function onScrollOutside() {
          that.setState({
            contextMenu_Graph: { visible: false }
          });
          window.removeEventListener(`scroll`, onScrollOutside);
        });
        document
          .getElementsByClassName("wrapper")[0]
          .addEventListener("scroll", function onScrollOutside() {
            that.setState({
              contextMenu_Graph: { visible: false }
            });
            document
              .getElementsByClassName("wrapper")[0]
              .removeEventListener(`scroll`, onScrollOutside);
          });
        // }, 1000);
      })
    }, 500);
  }
  
  showRangeMenu = (e) => {
    if (this.state.system_patient_id == undefined || this.state.system_patient_id == null) return;
    // setTimeout(() => {
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({contextMenu_th: {visible: false}});
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        contextMenu_th: {visible: false}
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    this.setState({
      contextMenu_th: {
        visible: true,
        x: e.clientX - document.getElementById("progress-modal").offsetLeft,
        y: e.clientY + window.pageYOffset,
      },
    })
  }
  
  handleClick_th = (e) => {
    if (this.state.system_patient_id == undefined || this.state.system_patient_id == null) return;
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({contextMenu_th: {visible: false}});
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu_th: {visible: false}
        });
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      this.setState({
        contextMenu_th: {
          visible: true,
          x: e.clientX - document.getElementById("progress-modal").offsetLeft,
          y: e.clientY + window.pageYOffset,
        },
      })
    }
  }
  handleClick=(e, item, cur_date, index)=>{
    if(item == "title"){ return;}
    if (item == "morning" || item == "noon" || item == "evening") {
      return;
      // if (this.getMealInfoByCategory(item, cur_date) == "") return;
    }
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
          x: e.clientX - document.getElementById("progress-modal").offsetLeft,
          y: e.clientY + window.pageYOffset,
          item,
          cur_date,
          index
        },
        cur_date
      })
    }
  };
  changeRange = (value) => {
    this.setState({range:value});
  }
  
  deleteGraphData = (measure_at) => {
    this.setState({
      isDeleteConfirmModal:true,
      confirm_message:'削除しますか？',
      measure_at:measure_at})
  }
  
  confirmDelete = async() => {
    this.closeModal();
    let path = "/app/api/v2/patients/basic_data/delete_vital";
    var post_data = {
      system_patient_id:this.state.system_patient_id,
      measure_at:this.state.measure_at
    }
    await apiClient.post(path, post_data)
      .then(() => {
        this.setState({alert_messages:'削除しました。'});
        this.getSearchResult();
      })
  }
  
  editGraphData = (measure_at) => {
    this.setState({
      openGraphChangeModal:true,
      measure_at:measure_at,
    })
  }
  
  contextMenuAction = (act, date, index) => {
    let {elapsed_result} = this.state;
    if (act == 'title_create') {
      this.setState({
        openTitleCreateModal: true,
      });
    } else if (act == 'title_delete') {
      if (elapsed_result.length == 0) return;
      let tier_3rd_name = elapsed_result[index].tier_3rd_name;
      this.setState({
        confirm_message: tier_3rd_name + "を削除しますか？",
        del_tier_index: index,
        confirm_action: "title_delete"
      })
    } else if (act == "prev") {
      if (elapsed_result.length == 0 || elapsed_result.length == 1) return;
      let moved_array = this.moveArrayItemToNewIndex(elapsed_result, index, index-1);
      this.setState({elapsed_result: moved_array});
    } else if (act == "first") {
      if (elapsed_result.length == 0 || elapsed_result.length == 1) return;
      let moved_array = this.moveArrayItemToNewIndex(elapsed_result, index, 0);
      this.setState({elapsed_result: moved_array});
    } else if (act == "next") {
      if (elapsed_result.length == 0 || elapsed_result.length == 1) return;
      if (index == (elapsed_result.length-1)) return;
      let moved_array = this.moveArrayItemToNewIndex(elapsed_result, index, index+1);
      this.setState({elapsed_result: moved_array});
    } else if (act == "last") {
      if (elapsed_result.length == 0 || elapsed_result.length == 1) return;
      if (index == (elapsed_result.length-1)) return;
      let moved_array = this.moveArrayItemToNewIndex(elapsed_result, index, elapsed_result.length-1);
      this.setState({elapsed_result: moved_array});
    } else if (act == 'graph_change') {
      this.setState({
        openGraphChangeModal: true,
      });
    } else if (act == "meal_order_viewer") {
      let meal_info = null;
      if (index == "morning") {
        meal_info = this.getMealInfoData(date,1);
      } else if (index == "noon") {
        meal_info = this.getMealInfoData(date, 2);
      } else if (index == "evening") {
        meal_info = this.getMealInfoData(date, 3);
      }
      if (meal_info !== undefined && meal_info != null)
      this.setState({meal_order_viewer: true, meal_info});
    }
  };
  moveArrayItemToNewIndex = (arr, old_index, new_index) => {
    if (new_index >= arr.length) {
      var k = new_index - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr;
  };
  
  openResultModal = (type, selected_tier, cur_datetime) => {
    if (type == "title") {
      if(selected_tier == undefined || selected_tier == null || selected_tier.tier_3rd_id == 0) return;
      this.setState({
        selected_tier,
        cur_datetime,
        openCreateModal: true
      });
    }
  }
  
  closeModal=()=>{
    let alert_type = this.state.alert_type;
    if(alert_type == "modal_close"){
      this.props.closeModal();
    } else {
      this.setState({
        isOpenStaffList: false,
        alert_messages:"",
        check_message: "",
        alert_type: "",
        confirm_message:"",
        isOpenPassingTimeList: false,
  
        openGraphChangeModal: false,
        openTitleCreateModal: false,
        isDeleteConfirmModal: false,
        openCreateModal: false,
        meal_order_viewer: false,
      });
    }
    if(this.first_tag_id != ""){
      $("#" + this.first_tag_id).focus();
      this.first_tag_id = "";
    }
  };
  
  confirmOk=()=>{
    if(this.state.confirm_action == "close_modal"){
      this.props.closeModal('move_soap_focus', null);
    }
    if(this.state.confirm_action == "register_passing_time"){
      this.registerPassingTime();
      return;
    }
    this.closeModal();
    if (this.state.confirm_action == "title_delete" && this.state.del_tier_index >= 0) {
      let {elapsed_result} = this.state;
      elapsed_result.splice(this.state.del_tier_index,1);
      this.setState({elapsed_result});
      return;
    }
    if (this.state.confirm_action == "result_insert") {
      this.registerResult();
      return;
    }
    if (this.state.confirm_action == "clear_user") {
      this.setState({
        created_by:0,
        created_name:'',
        confirm_message:"",
        confirm_action:"",
      });
      return;
    }
  };
  
  registerResult = async () => {
    let path = "/app/api/v2/nurse/progress_chart/register_result";
    let post_data = {
      system_patient_id: this.state.system_patient_id,
      elapsed_result: this.state.elapsed_result
    };
    await apiClient.post(path, post_data).then(res=>{
      if (res) {
        this.setState({
          alert_messages: res.alert_message,
          result_saved: true,
        });
      }
    })
  }
  
  maincloseModal = () => {
    if (this.state.passing_of_time != ""){
      this.setState({
        confirm_message:"登録していない内容があります。\n変更内容を破棄して移動しますか？",
        confirm_action:"close_modal",
        confirm_alert_title:'入力中',
      });
      return;
    }
    // if (this.state.elapsed_result != undefined && this.state.elapsed_result != null && this.state.elapsed_result.length > 0 && this.state.result_saved != true) {
    //   this.setState({
    //     confirm_message: "登録していない内容があります。\n入力結果を登録しますか？",
    //     confirm_action: "result_insert",
    //     confirm_alert_title:'入力中',
    //   });
    //   return;
    // }
    this.props.closeModal();
  };
  
  onHide= () => {};
  
  setRange = (e) => {
    this.setState({range: e.target.id});
  }
  
  setChartType = (chart_type) => {
    if (chart_type == 1){
      this.setState({
        chart_type,
        range:2,
      });
    } else {
      this.setState({
        chart_type,
        range:1
      });
    }
  }
  
  graphChange = (check_array, check_show) => {
    this.closeModal();
    let graph_data = [];
    let {vital_data} = this.state;
    if (check_array === undefined || check_array.length === 0) return;
    check_array.map((item, index)=>{
      if (index == 0) {
        if (item.values.length > 0) {
          item.values.map((sub_val, sub_index)=>{
            let insert_item = {
              measure_at: vital_data[sub_index].measure_at,
              max_blood: null,
              min_blood: null,
              pluse: check_show == 1 ? (item.line_check == 1 ? sub_val : null) : sub_val,
              temperature: null,
              respiratory: null,
            }
            graph_data.push(insert_item);
            vital_data[sub_index].pluse = sub_val;
          })
        }
      } else if (index == 1) {
        item.values.map((sub_val, sub_index)=>{
          graph_data[sub_index].min_blood = check_show == 1 ? (item.line_check == 1 ? sub_val : null) : sub_val;
          vital_data[sub_index].min_blood = sub_val;
        });
      } else if (index == 2) {
        item.values.map((sub_val, sub_index)=>{
          graph_data[sub_index].max_blood = check_show == 1 ? (item.line_check == 1 ? sub_val : null) : sub_val;
          vital_data[sub_index].max_blood = sub_val;
        });
      } else if (index == 3) {
        item.values.map((sub_val, sub_index)=>{
          graph_data[sub_index].temperature = check_show == 1 ? (item.line_check == 1 ? sub_val : null) : sub_val;
          vital_data[sub_index].temperature = sub_val;
        });
      } else if (index == 4) {
        item.values.map((sub_val, sub_index)=>{
          graph_data[sub_index].respiratory = check_show == 1 ? (item.line_check == 1 ? sub_val : null) : sub_val;
          vital_data[sub_index].respiratory = sub_val;
        });
      }
    });
    let new_graph_data = this.makeGraphData(graph_data);
    this.registerVital(vital_data);
    this.setState({
      graph_data: new_graph_data,
      vital_data,
    });
  }
  
  registerVital = async (vital_data) => {
    let path = "/app/api/v2/nurse/progress_chart/register_vital";
    let post_data = {
      system_patient_id: this.state.system_patient_id,
      vital_data,
    };
    await apiClient.post(path, post_data);
  }
  
  setElapsedTitle=(data)=>{
    this.closeModal();
    if (data != null && data.length > 0) {
      let {elapsed_result} = this.state;
      data.map(item=>{
        let find_3rd_index = elapsed_result.findIndex(x=>x.tier_3rd_id == item.tier_3rd_id);
        if (find_3rd_index == -1) {
          let insert_data = {
            tier_1st_id: item.tier_1st_id,
            tier_2nd_id: item.tier_2nd_id,
            tier_3rd_id: item.tier_3rd_id,
            tier_3rd_name: item.tier_3rd_name,
            tier_3rd_free_comment: item.tier_3rd_free_comment != undefined ? item.tier_3rd_free_comment : '',
            input_datetime: null,
            elapsed_select_item_id: 0,
            comment: ''
          };
          elapsed_result.push(insert_data);
        }
      });
      this.setState({elapsed_result});
    }
  }
  
  resultInsert = (data) => {
    this.closeModal();
    let {elapsed_result} = this.state;
    if (data.length > 0) {
      data.map(item=> {
        let find_index = elapsed_result.findIndex(x=>x.tier_3rd_id == item.tier_3rd_id);
        if (find_index != -1) {
          elapsed_result[find_index].input_datetime = item.input_datetime;
          elapsed_result[find_index].result = item.result;
          elapsed_result[find_index].comment = item.comment;
        }
        
      });
      this.setState({elapsed_result});
    }
  };
  
  setDateValue = (key,value) => {
    if(value == "" || value == null){
      value = new Date();
    }
    this.setState({[key]:value}, ()=>{
      this.getSearchResult();
    });
  };
  
  // openStaffList = () => {
  //   this.setState({isOpenStaffList: true});
  // };
  //
  // selectStaff=(staff)=>{
  //   this.setState({
  //     created_by:staff.number,
  //     created_name:staff.name,
  //     isOpenStaffList:false,
  //   });
  // }
  
  confirmClearUser=()=>{
    if(this.state.created_by == 0){
      return;
    }
    this.setState({
      confirm_message:"作成者をクリアしますか？",
      confirm_action:"clear_user",
      confirm_title:"クリア確認"
    });
  }
  
  getStaffList=async()=>{
    await apiClient.get("/app/api/v2/secure/staff/search?")
      .then((res) => {
        this.setState({
          staffs: res,
        });
      });
  }
  
  setTextValue = (key,e) => {
    removeRedBorder("passing_of_time_id");
    this.setState({[key]: e.target.value});
  }
  
  confirmSave=()=>{
    if(this.state.passing_of_time == ""){
      return;
    }
    if(this.state.passing_of_time.length > 1000){
      addRedBorder("passing_of_time_id");
      this.first_tag_id = "passing_of_time_id";
      this.setState({
        check_message:"経時記録は1000文字以内で入力してください。",
      });
      return;
    }
    this.setState({
      confirm_message:"経時記録を登録しますか？",
      confirm_action:"register_passing_time",
      confirm_title:"登録確認"
    });
  }
  
  registerPassingTime=async()=>{
    this.setState({
      confirm_message:"",
      confirm_action:"",
      confirm_title:"",
      complete_message:"登録中"
    });
    let path = "/app/api/v2/nurse/progress_chart/register_passing_time";
    let post_data = {
      hospitalization_id:this.state.hos_number,
      passing_of_time:this.state.passing_of_time,
      record_date: formatDateLine(this.state.search_date)+' '+formatTimeIE(this.state.search_date),
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          complete_message:"",
          alert_messages:res.error_message != undefined ? res.error_message : res.success_message,
          alert_type:res.success_message != undefined ? "modal_close" : "",
        });
      })
      .catch(() => {
      
      });
  }
  
  openPassingTimeList=()=>{
    this.setState({isOpenPassingTimeList:true});
  }
  
  render() {
    let {tier_master_2nd, elapsed_result} = this.state;
    let search_date = new Date(this.state.search_date);
    switch(parseInt(this.state.range)){
      case 1:
        this.min_x = search_date;
        this.min_x.setHours(0);
        this.min_x.setMinutes(0);
        this.min_x.setSeconds(0);
        this.max_x = new Date(this.min_x.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 2:
        this.min_x = search_date;
        this.min_x.setHours(0);
        this.min_x.setMinutes(0);
        this.min_x.setSeconds(0);
        this.max_x = new Date(this.min_x.getTime() + 24 * 60 * 60 * 1000);
        break;
      case 3:
        this.min_x = search_date;
        this.min_x.setHours(0);
        this.min_x.setMinutes(0);
        this.min_x.setSeconds(0);
        this.max_x = new Date(this.min_x.getTime() + 24 * 60 * 60 * 1000);
        break;
    }
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal medication-guidance-schedule first-view-modal" id="progress-modal" onHide={this.onHide}>
          <Modal.Header><Modal.Title>経時記録</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className={'flex'}>
                  <div className={'flex'}>
                    <div>患者ID : &nbsp;</div>
                    <div style={{minWidth:"6rem"}}> {this.props.patientInfo.receId}</div>
                    <div>患者氏名 : &nbsp;</div>
                    <div> {this.props.patientInfo.name}</div>
                </div>
                  <div style={{marginLeft:"auto", marginRight:0}}>
                    <button onClick={this.openPassingTimeList}>経時記録一覧</button>
                  </div>
                </div>
                <div className={'select-date flex'} style={{marginTop:"0.5rem"}}>
                  <div className={'date-label'}>記録日時</div>
                  <button onClick={this.moveWeek.bind(this, 'prev')}>{'<<'}</button>
                  <button onClick={this.moveDay.bind(this, 'prev')}>{'<'}</button>
                  <div className={'view-date'}>
                    <DatePicker
                      locale="ja"
                      selected={this.state.search_date}
                      onChange={this.setDateValue.bind(this,"search_date")}
                      dateFormat="yyyy/MM/dd HH:mm"
                      timeCaption="時間"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={10}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </div>
                  <button onClick={this.moveDay.bind(this, 'next')}>{'>'}</button>
                  <button onClick={this.moveWeek.bind(this, 'next')}>{'>>'}</button>
                  {/*<div className={'select-user flex'}>*/}
                    {/*<div className={'user-title'}>作成者</div>*/}
                    {/*<div className='user-value' onClick={this.openStaffList.bind(this)}>*/}
                      {/*{this.state.created_name == "" ? "クリックで選択" : this.state.created_name}*/}
                    {/*</div>*/}
                    {/*<Button type={'mono'} className={'clear-btn'} onClick={this.confirmClearUser.bind(this)}>C</Button>*/}
                  {/*</div>*/}
                </div>
                <div className="w-100 d-flex" style={{height:"calc(100% - 6rem)"}}>
                  <div className={'calendar-area flex'}>
                    {this.state.is_loaded?(
                      <div className="wrapper">
                        <table className="table-scroll table table-bordered" id="code-table">
                          <thead>
                          <tr>
                            <th className="sticky-col two-coloum text-center" colSpan="2">日時</th>
                            <th className="sticky-col td-third text-center">{this.state.search_date.getFullYear()}年</th>
                            {this.createTable('thead')}
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                            <td className="sticky-col three-coloum text-center" colSpan="3" style={{background:"lightgray"}}>入院日数</td>
                            {this.createTable('tbody', 'hospital_dates')}
                          </tr>
                          <tr>
                            <td className="sticky-col three-coloum text-center" colSpan="3" style={{background:"lightgray"}}>術後日数</td>
                            {this.createTable('tbody', 'surgery_day')}
                          </tr>
                          <tr>
                            <td className="sticky-col three-coloum text-center" colSpan="3" style={{background:"lightgray"}}>移動情報</td>
                            {this.createTable('tbody', 'move_info')}
                          </tr>
                          <tr>
                            <td className="sticky-col three-coloum text-center" colSpan="3" style={{background:"lightgray"}}>入力フォーマット</td>
                            {this.createTable('tbody')}
                          </tr>
                          <tr style={{background:"lightyellow"}}>
                            <td colSpan= {this.state.range == 1?'10':this.state.range==2?'11':'27'} className='text-left' style={{paddingLeft:'1.2rem'}}>
                              <label className='axis-title'>BT<br/><span style={{color:"#00f", fontSize:'10px'}}>■</span></label>
                              <label className='axis-title'>HR<br/><span style={{color:"#f00", fontSize:'15px'}}>●</span></label>
                              <label className='axis-title'>BP<br/><span style={{color:"#0f0", fontSize:'10px'}}>▼▲</span></label>
                              <label className='axis-title'>RR<br/><span style={{fontSize:'15px'}}>×</span></label>
                            </td>
                          </tr>
                          <tr style={{background:"lightyellow"}} className='graph-tr'>
                            <td style={{paddingLeft:'1rem'}} colSpan= {this.state.range == 1?'10':this.state.range==2?'11':'27'}>
                              <div className='w-100 h-100 chat-image'>
                                {this.state.graph_data != undefined && this.state.graph_data.length > 0 ? (
                                  <VitalChart
                                    showData={this.state.graph_data}
                                    height={30}
                                    min_y={15}
                                    max_y={200}
                                    x_range = {this.state.range}
                                    min_x = {this.min_x}
                                    max_x = {this.max_x}
                                    showMenu = {this.showGraphMenu}
                                    ref = {this.ChartRef}
                                  />
                                ):(<></>)}
                              </div>
                            </td>
                          </tr>
                          <tr style={{background:"lightyellow"}} className='range-button'>
                            <td className="sticky-col three-coloum" colSpan="3" style={{background:"lightyellow"}}>
                              <label className='w-75 text-center border-right'>
                                <button onClick={this.showRangeMenu.bind(this)} style={{background:"lightpink"}} className="w-100">レンジ切替</button>
                              </label>
                            </td>
                            {this.createTable('tbody', 'graph')}
                          </tr>
                          <tr>
                            <td className="sticky-col three-coloum" colSpan="3">
                              <label className='w-50 text-centter border-right' style={{background:"yellow"}}>酸素流量</label>
                            </td>
                            {this.createTable('tbody')}
                          </tr>
                          <tr>
                            <td className="sticky-col td-first text-center" rowSpan="4" style={{background:"lightgray"}}>食<br/><br/>事</td>
                            <td className="sticky-col text-center" colSpan="2" style={{left: "2rem"}}>食事（朝）</td>
                            {this.createTable('tbody', 'morning')}
                          </tr>
                          <tr>
                            <td className="sticky-col text-center" colSpan="2" style={{left: "2rem"}}>食事（昼）</td>
                            {this.createTable('tbody','noon')}
                          </tr>
                          <tr>
                            <td className="sticky-col text-center" colSpan="2" style={{left: "2rem"}}>食事（夕）</td>
                            {this.createTable('tbody', 'evening')}
                          </tr>
                          <tr>
                            <td className="sticky-col text-center" colSpan="2" style={{left: "2rem"}}>間食</td>
                            {this.createTable('tbody')}
                          </tr>
                          {tier_master_2nd != undefined && tier_master_2nd.length > 0 && tier_master_2nd.map((item, index)=>{
                            let elapsed_result_items = [];
                            if (elapsed_result != undefined && elapsed_result != null && elapsed_result.length > 0) {
                              elapsed_result.map(sub_item=>{
                                if (sub_item.tier_2nd_id == item.number) {
                                  elapsed_result_items.push(sub_item);
                                }
                              });
                            }
                            if (elapsed_result_items.length == 0) {
                              let blank_item = {
                                tier_1st_id: item.tier_1st_id,
                                tier_2nd_id: item.number,
                                tier_3rd_id: 0,
                                tier_3rd_name: '',
                                tier_3rd_free_comment: '',
                                input_datetime: null,
                                elapsed_select_item_id: 0,
                                comment: ''
                              };
                              elapsed_result_items.push(blank_item);
                            }
                            return (
                              <>
                                {elapsed_result_items.map((result_item, result_index)=>{
                                  return (
                                    <>
                                      {result_index == 0 ? (
                                        <tr key={index}>
                                          <td className="sticky-col two-coloum text-center" colSpan="2" rowSpan={elapsed_result_items.length} style={{background:"lightgray"}}>{item.name}</td>
                                          <td style={{left:"7rem"}}>{result_item.tier_3rd_name}</td>
                                          {this.createTable('tbody','title', result_item)}
                                        </tr>
                                      ) : (
                                        <tr>
                                          <td style={{left:"7rem"}}>{result_item.tier_3rd_name}</td>
                                          {this.createTable('tbody','title', result_item)}
                                        </tr>
                                      )}
                                    </>
                                  )
                                })}
                              </>
                            )
                          })}
                          <tr>
                            <td className="sticky-col td-first text-center" style={{background:"lightgray"}}>処</td>
                            <td className="sticky-col td-second text-center border-left border-right">処置</td>
                            <td className="sticky-col td-third text-center" style={{borderRight:"solid 1px lightgray"}}>処置</td>
                            {this.createTable('tbody','treatment')}
                          </tr>
                          <tr>
                            <td className="sticky-col td-first text-center" style={{background:"lightgray"}} rowSpan="2">看<br/>護</td>
                            <td className="sticky-col td-second text-center">看護<br/>処置</td>
                            <td className="sticky-col td-third text-center" style={{borderRight:"solid 1px lightgray"}}>看護処置</td>
                            {this.createTable('tbody', 'nurse_instruction')}
                          </tr>
                          </tbody>
                        </table>
                      </div>
                    ):(
                      <SpinnerWrapper>
                        <Spinner animation="border" variant="secondary" />
                      </SpinnerWrapper>
                    )}
                  </div>
                  <div className="patient-area">
                    <div style={{lineHeight:"2rem"}}>経時記録</div>
                    <div className={'record-input'}>
                      <textarea
                        value={this.state.passing_of_time}
                        id={'passing_of_time_id'}
                        onChange={this.setTextValue.bind(this, 'passing_of_time')}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.maincloseModal}>キャンセル</Button>
            <Button className={this.state.passing_of_time == "" ? "disable-btn" : "red-btn"} onClick={this.confirmSave} >確定</Button>
          </Modal.Footer>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          <ContextMenu_th
            {...this.state.contextMenu_th}
            parent={this}
          />
          <ContextMenu_Graph
            {...this.state.contextMenu_Graph}
            parent={this}
          />
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
              title={this.state.confirm_title}
            />
          )}
          {this.state.isDeleteConfirmModal !== false && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmDelete.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.openGraphChangeModal && (
            <ProgressGraphChange
              closeModal={this.closeModal}
              handleOk={this.graphChange}
              system_patient_id={this.state.system_patient_id}
              cur_date={formatDateLine(formatDateTimeIE(this.state.measure_at))}
              max_min_constants={this.state.max_min_constants}
            />
          )}
          {this.state.openTitleCreateModal && (
            <ChartTitleModal
              closeModal={this.closeModal}
              setElapsedTitle={this.setElapsedTitle}
            />
          )}
          {this.state.openCreateModal && (
            <ResultInsert
              closeModal={this.closeModal}
              handleOk={this.resultInsert}
              tier_master_3rd={this.state.tier_master_3rd}
              selected_tier={this.state.selected_tier}
              elapsed_select_item_master={this.state.elapsed_select_item_master}
              unit_master={this.state.unit_master}
              elapsed_result={this.state.elapsed_result}
              cur_datetime = {this.state.cur_datetime}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.isOpenStaffList && (
            <DialSelectMasterModal
              selectMaster = {this.selectStaff}
              closeModal = {this.closeModal}
              MasterCodeData = {this.state.staffs}
              MasterName = 'スタッフ'
            />
          )}
          {this.state.check_message != "" && (
            <ValidateAlertModal
              handleOk={this.closeModal}
              alert_meassage={this.state.check_message}
            />
          )}
          {this.state.isOpenPassingTimeList && (
            <PassingTimeList
              hos_number={this.state.hos_number}
              closeModal={this.closeModal}
            />
          )}
        </Modal>
      </>
    );
  }
}

PassingTimeRecord.contextType = Context;
PassingTimeRecord.propTypes = {
  closeModal: PropTypes.func,
  patientInfo: PropTypes.object,
  patientId: PropTypes.number
};
export default PassingTimeRecord;