import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import ja from "date-fns/locale/ja";
import { registerLocale } from "react-datepicker";
registerLocale("ja", ja);
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
import {formatDateLine, getWeekName} from "~/helpers/date";
import axios from "axios/index";
import {formatJapan, getNextDayByJapanFormat, getNextMonthByJapanFormat, getPrevDayByJapanFormat, getPrevMonthByJapanFormat} from "~/helpers/date";
import * as apiClient from "~/api/apiClient";
import NutritionGuidance from "../Patient/Modals/Guidance/NutritionGuidance";
import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Button from "~/components/atoms/Button";
import GuidanceNutritionRequestDoneModal from "~/components/templates/OrderList/GuidanceNutritionRequestDoneModal";
import Spinner from "react-bootstrap/Spinner";

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  font-size:1rem;
  .flex {display: flex;}
  .pullbox-label {
    margin-bottom: 0;
    .pullbox-select {
      width: 10rem;
      height: 2rem;
    }
  }
  .label-title {
    width: auto;
    line-height: 2rem;
    margin: 0;
    font-size:1rem;
    margin-right: 0.5rem;
  }
  .btn-area{
    text-align:right;
    margin-left: 0.5rem;
    button {
     height:2rem;
    }
  }
  .select-date {
    .date-label {
      height:2rem;
      line-height:2rem;
      margin-right:0.5rem;
    }
    button {
      height:2rem;
      margin-right:0.5rem;
    }
    .view-date {
      padding:0 0.3rem;
      height:2rem;
      line-height:2rem;
      border:1px solid #aaa;
    }
  }
  .view-content {
      width: 300px;
      margin:auto;
      .view-box {
          border:1px solid #aaa;
      }
      .div-width {
          width: 40px;
          margin-right: 10px;
          margin-left: 10px;
      }
  }
  .select-schedule-date {
  }
  .select-check {
      width: 310px;
  }
  .select-schedule-date .label-title {
      text-align: left;
      width: 40px;
  }
  .calendar-area {
    margin: auto;
    width: 100%;
    height: calc(100% - 6rem);
    overflow:hidden;
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
        min-width:4rem;
      }
      td {
        padding:0 0.2rem;
        vertical-align: middle;
        height:3.5rem;
      }
    }
    .sticky-col {
      position: sticky;
      position: -webkit-sticky;
      background-color: white;
      padding: 0;
      div {
        padding:0 0.2rem;
      }
    }
    .ward-name {
      width: 5rem;
      min-width: 5rem;
      max-width: 5rem;
      left: 0px;
      div{
        width: 5rem;
        min-width: 5rem;
        max-width: 5rem;
      }
    }
    .department-name {
      width: 9rem;
      min-width: 9rem;
      max-width: 9rem;
      left: 5rem;
      div{
        width: 9rem;
        min-width: 9rem;
        max-width: 9rem;
      }
    }
    .patient-id {
      width: 10rem;
      min-width: 10rem;
      max-width: 10rem;
      left: 14rem;
      div{
        width: 10rem;
        min-width: 10rem;
        max-width: 10rem;
      }
    }
    .patient-name {
      width: 20rem;
      min-width: 20rem;
      max-width: 20rem;
      left: 24rem;
      div{
        width: 20rem;
        min-width: 20rem;
        max-width: 20rem;
      }
    }
    .td-div-border {
      border-right:1px solid #dee2e6;
      height:3rem;
      line-height:3rem;
      width:100%;
    }
  }
  .left-table {
    width:44rem;
  }
  .right-table {
    width:calc(100% - 44rem);
    overflow-x:scroll;
  }
  
  table {
    table-layout: fixed;
    border-spacing: 0px;
    width:100%;
  }
  
  td, th {
    padding:0;
    vertical-align: middle;
    font-size:1rem;
  }
  td {padding:0 0.3rem;}
  
  .tr_shaded:nth-child(even) {
    // background: #e0e0e0;
    background: rgb(242, 242, 242);
    div {
      background: rgb(242, 242, 242) !important;
    }
  }
  
  .tr_shaded:nth-child(odd) {
    background: #ffffff;
  }
  .tr_shaded:hover {
    background: rgb(226, 226, 226)
  }
  .scrolly_table {
    white-space: nowrap;
    overflow: auto;
    width: 100%;
    height: calc(100% - 6rem);
    border: 1px solid #dee2e6;
  }
  .fixed.freeze {
    z-index: 10;
    position: relative;
  }
  .fixed.freeze_vertical {
    z-index: 5;
    position: relative;
  }
  .fixed.freeze_horizontal {
    z-index: 1;
    position: relative;
  }
  .ward-name {
    width: 5rem;
    div {
      background: #ffffff;
    }
  }
  .department-name {
    width: 9rem;
    div {
      background: #ffffff;
    }
  }
  .patient-id {
    width: 10rem;
    div {
      background: #ffffff;
    }
  }
  .patient-name {
    width: 20rem;
    div {
      background: #ffffff;
    }
  }
  th div {
    border: 1px solid #dee2e6;
    width: 100%;
    text-align: center;
    padding:0 0.3rem
  }
  .td-div {
    border: 1px solid #dee2e6;
    width: 100%;
    height: 100%;
    text-align: center;
    padding:0 0.3rem;
  }
`;

const ContextMenuUl = styled.div`
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
    padding: 0px;
    transition: all 0.3s;
    white-space: nowrap;
    -webkit-transition: all 0.3s;
    div {
      padding: 5px 12px;
      font-size: 16px;
    }
    img {
      width: 2.2rem;
      height: 2.2rem;
    }
    svg {
      width: 2.2rem;
      margin: 8px 0;
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

const ContextMenu = ({visible,x,y,patient_info,order_data,parent}) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          {order_data == null ? (
            <>
              <li><div onClick={() => parent.contextMenuAction('create', patient_info, null)}>新規作成</div></li>
            </>
          ):(
            <>
              <li><div onClick={() => parent.contextMenuAction('create', patient_info, null)}>新規作成</div></li>
              <li><div onClick={() => parent.contextMenuAction('edit', patient_info, order_data)}>修正</div></li>
              <li><div onClick={() => parent.contextMenuAction('delete', patient_info, order_data)}>削除</div></li>
              <li><div onClick={() => parent.contextMenuAction('copy', patient_info, order_data)}>コピー</div></li>
              {order_data.order_data.done_order == 0 && (
                <li><div onClick={() => parent.contextMenuAction('order_done', patient_info, order_data)}>実施</div></li>
              )}
            </>
          )}
        </ul>
      </ContextMenuUl>
    );
  } else { return null; }
};

class NutritionGuidanceSchedule extends Component {
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
    this.state = {
      guidance_date:(props.guidance_date !== undefined && props.guidance_date != null) ? new Date(props.guidance_date) : new Date(),
      department_id:0,
      department_codes,
      ward_master:[],
      first_ward_id:1,
      table_data:[],
      openNutritionGuidance:false,
      isOpenGuidanceNutritionRequestDoneModal:false,
      confirm_message:"",
      alert_messages:"",
      load_flag:false,
    };
  }

  async componentDidMount() {
    await this.getWardMaster();
    await this.getHolidays();
  }

  componentDidUpdate() {
    let i, parent_div_id, parent_tr, table_i, scroll_div;
    // let scrolling_table_div_ids = ["scrolling_table_1", "scrolling_table_2"];
    let scrolling_table_div_ids = ["scrolling_table_1"];

// This array will let us keep track of even/odd rows:
    let scrolling_table_tr_counters = [];
    for (i = 0; i < scrolling_table_div_ids.length; i++) {
      scrolling_table_tr_counters.push(0);
    }

// Append the parent div id to the class of each frozen element:
    let fixed_elements = document.getElementsByClassName("fixed");
    for (i = 0; i < fixed_elements.length; i++) {
      fixed_elements[i].className += " " + this.parent_id("DIV", fixed_elements[i]);
    }

// Set background colours of row headers, alternating according to
// even_odd_color(), which should have the same values as those
// defined in the CSS for the tr_shaded class.
    let fixed_horizontal_elements = document.getElementsByClassName("freeze_horizontal");
    for (i = 0; i < fixed_horizontal_elements.length; i++) {
      parent_div_id = this.parent_id("DIV", fixed_horizontal_elements[i]);
      table_i = scrolling_table_div_ids.indexOf(parent_div_id);
      if (table_i >= 0) {
        parent_tr = this.parent_elt("TR", fixed_horizontal_elements[i]);
        if (parent_tr.className.match("tr_shaded")) {
          // fixed_horizontal_elements[i].style.backgroundColor = this.even_odd_color(scrolling_table_tr_counters[table_i]);
          scrolling_table_tr_counters[table_i]++;
        }
      }
    }

// Add event listeners.
    for (i = 0; i < scrolling_table_div_ids.length; i++) {
      scroll_div = document.getElementById(scrolling_table_div_ids[i]);
      scroll_div.addEventListener("scroll", this.freeze_pane_listener(scroll_div, scrolling_table_div_ids[i]));
    }
  }

  freeze_pane_listener(what_is_this, table_class) {
    // Wrapping a function so that the listener can be defined
    // in a loop over a set of scrolling table id's.
    // Cf. http://stackoverflow.com/questions/750486/javascript-closure-inside-loops-simple-practical-example
    return function() {
      let i;
      let translate_y = "translate(0," + what_is_this.scrollTop + "px)";
      let translate_x = "translate(" + what_is_this.scrollLeft + "px,0px)";
      let translate_xy = "translate(" + what_is_this.scrollLeft + "px," + what_is_this.scrollTop + "px)";
      let fixed_vertical_elts = document.getElementsByClassName(table_class + " freeze_vertical");
      let fixed_horizontal_elts = document.getElementsByClassName(table_class + " freeze_horizontal");
      let fixed_both_elts = document.getElementsByClassName(table_class + " freeze");
      // The webkitTransforms are for a set of ancient smartphones/browsers,
      // one of which I have, so I code it for myself:
      for (i = 0; i < fixed_horizontal_elts.length; i++) {
        fixed_horizontal_elts[i].style.webkitTransform = translate_x;
        fixed_horizontal_elts[i].style.transform = translate_x;
      }
      for (i = 0; i < fixed_vertical_elts.length; i++) {
        fixed_vertical_elts[i].style.webkitTransform = translate_y;
        fixed_vertical_elts[i].style.transform = translate_y;
      }
      for (i = 0; i < fixed_both_elts.length; i++) {
        fixed_both_elts[i].style.webkitTransform = translate_xy;
        fixed_both_elts[i].style.transform = translate_xy;
      }
    }
  }

  // even_odd_color(i) {
  even_odd_color() {
    // if (i % 2 == 0) {
      return "#e0e0e0";
    // } else {
    //   return "#ffffff";
    // }
  }

  parent_id(wanted_node_name, elt) {
    // Function to work up the DOM until it reaches
    // an element of type wanted_node_name, and return
    // that element's id.
    let wanted_parent = this.parent_elt(wanted_node_name, elt);
    if ((wanted_parent == undefined) || (wanted_parent.nodeName == null)) {
      // Sad trombone noise.
      return "";
    } else {
      return wanted_parent.id;
    }
  }

  parent_elt(wanted_node_name, elt) {
    // Function to work up the DOM until it reaches
    // an element of type wanted_node_name, and return
    // that element.
    let this_parent = elt.parentElement;
    if ((this_parent == undefined) || (this_parent.nodeName == null)) {
      // Sad trombone noise.
      return null;
    } else if (this_parent.nodeName == wanted_node_name) {
      // Found it:
      return this_parent;
    } else {
      // Recurse:
      return this.parent_elt(wanted_node_name, this_parent);
    }
  }

  async getWardMaster () {
    let path = "/app/api/v2/ward/get/ward_master";
    let post_data = {
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        let ward_master = this.state.ward_master;
        if(res.length > 0){
          res.map(ward=>{
            ward_master.push({id:ward.number, value:ward.name});
          });
        }
        this.setState({ward_master});
      })
      .catch(() => {

      });
  }

  async getScheduleData(holidays){
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/nutrition_guidance/get_schedule_data";
    let start_date = new Date(this.state.guidance_date);
    start_date.setDate(start_date.getDate() - 1);
    let post_data = {
      first_ward_id:this.state.first_ward_id,
      department_id:this.state.department_id,
      start_date:formatDateLine(start_date),
      end_date:formatDateLine(getNextMonthByJapanFormat(this.state.guidance_date)),
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          holidays,
          table_data:res,
          load_flag:true,
        });
      })
      .catch(() => {

      });
  }

  moveDay = (type) => {
    let now_day = this.state.guidance_date;
    if(now_day === ''){
      now_day = new Date();
    }
    let cur_day = type === 'next' ? getNextDayByJapanFormat(now_day) : getPrevDayByJapanFormat(now_day);
    this.setState({
      guidance_date: cur_day,
      is_loaded: false,
    },()=>{
      this.getHolidays();
    });
  };

  moveMonth = (type) => {
    let now_month = this.state.guidance_date;
    let cur_month = type === 'next' ? getNextMonthByJapanFormat(now_month) : getPrevMonthByJapanFormat(now_month);
    this.setState({
      guidance_date: cur_month,
      is_loaded: false,
    },()=>{
      this.getHolidays();
    });
  };

  selectToday=()=>{
    this.setState({guidance_date: new Date()},()=>{
      this.getHolidays();
    });
  }

  getDepartment = e => {
    this.setState({
      department_id:e.target.id,
      load_flag:false,
    },()=>{
      this.getScheduleData(this.state.holidays);
    });
  };

  setWard=(e)=>{
    this.setState({
      first_ward_id:parseInt(e.target.id),
      load_flag:false
    },()=>{
      this.getScheduleData(this.state.holidays);
    });
  };

  async getHolidays(){
    let start_date = new Date(this.state.guidance_date);
    start_date.setDate(start_date.getDate() - 1);
    let end_date = getNextMonthByJapanFormat(this.state.guidance_date);
    let path = "/app/api/v2/dial/schedule/get_holidays";
    let post_data = {
      start_date:formatDateLine(start_date),
      end_date:formatDateLine(end_date),
    };
    let holidays = this.state.holidays;
    await axios.post(path, {params: post_data}).then((res)=>{
      holidays = Object.keys(res.data);
    });
    await this.getScheduleData(holidays);
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

  createTable = (type, item=null, index=null) => {
    let start_date = new Date(this.state.guidance_date);
    start_date.setDate(start_date.getDate() - 1);
    let end_date = getNextMonthByJapanFormat(this.state.guidance_date);
    let now_year = start_date.getFullYear();
    let now_month = start_date.getMonth()+1;
    let date_number = start_date.getDate();
    let table_menu = [];
    if(type === 'thead' || type === 'tbody'){
      do {
        let month = now_month < 10 ? '0' + now_month : now_month;
        let date = date_number < 10 ? '0' + date_number : date_number;
        let cur_date = now_year + '-' + month + '-' + date;
        if(type === 'thead'){
          let week = new Date(cur_date).getDay();
          table_menu.push(
            <th style={{background:this.setBackcolor(cur_date, week), color:this.setFontcolor(cur_date, week), width:"4rem"}} className="fixed freeze_vertical">
              <div style={{textAlign:"center", height:"2rem", lineHeight:"2rem"}}>{month +'/'+date}</div>
              <div style={{textAlign:"center", height:"2rem", lineHeight:"2rem"}}>{'（'+getWeekName(now_year, now_month, date_number)+'）'}</div>
            </th>
          )
        }
        if(type === 'tbody') {
          let date_key = now_year+'-'+month+'-'+date;
          table_menu.push(
            <>
              {item[date_key] !== undefined ? (
                <>
                  <td
                    style={{width:"4rem"}}
                    className={date_key+'-'+index}
                    onContextMenu={e => this.handleClick(e, item, item[date_key]['order_data'], (date_key+'-'+index) )}
                  >
                    {item[date_key]['order_data']['order_data']['done_order'] == 1 ? "実施済" : "依頼"}
                  </td>
                </>
              ):(
                <>
                  <td style={{width:"4rem"}} className={date_key+'-'+index} onContextMenu={e => this.handleClick(e, item, null, (date_key+'-'+index))}></td>
                </>
              )}
            </>
          );
        }
        month = now_month < 10 ? '0' + now_month : now_month;
        date = (date_number + 1) < 10 ? '0' + (date_number + 1) : (date_number + 1);
        let cur_date_time = new Date(now_year + '/' + month + '/' + date);
        if((cur_date_time.toString() === "Invalid Date") || (cur_date_time.getDate() != (date_number + 1))){
          date_number = 1;
          if(now_month == 12){
            now_month = 1;
            now_year++;
          } else {
            now_month++;
          }
          month = now_month < 10 ? '0' + now_month : now_month;
          date = date_number < 10 ? '0' + date_number : date_number;
        } else {
          date_number++;
        }
      } while (
        new Date(now_year + '/' + (now_month > 9 ? now_month : '0'+now_month) + '/' + (date_number > 9 ? date_number : '0'+date_number)).getTime() < end_date.getTime()
      );
    }
    return table_menu;
  };

  handleClick=(e, patient_info, order_data, class_name)=>{
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
      let tr_height = document.getElementsByClassName(class_name)[0].offsetHeight;
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX - document.getElementById("nutrition_guidance_schedule").offsetLeft,
          y: e.clientY + window.pageYOffset - tr_height,
          patient_info,
          order_data
        },
      })
    }
  };

  contextMenuAction = (act, patient_info, order_data) => {
    if(act === "order_done"){
      let done_modal_data = order_data.order_data;
      done_modal_data.patient_number = patient_info.patient_number;
      done_modal_data.patient_name = patient_info.patient_name;
      this.setState({
        isOpenGuidanceNutritionRequestDoneModal:true,
        done_modal_data,
      });
      return;
    }
    if(act !== "delete"){
      let patientInfo = {};
      patientInfo.receId = patient_info.patient_number;
      patientInfo.name = patient_info.patient_name;
      patientInfo.sex = patient_info.gender;
      patientInfo.age = patient_info.age;
      patientInfo.age_month = patient_info.age_month;
      if(act === "copy"){
        order_data['order_data']['number'] = 0;
        order_data['order_data']['done_order'] = 0;
        order_data['order_data']['reserve_data'] = null;
        order_data['order_data']['reserve_datetime'] = "";
      }
      this.setState({
        openNutritionGuidance:true,
        patientInfo,
        patientId:patient_info.patient_id,
        order_data,
      });
    } else {
      this.setState({
        confirm_message:"栄養指導依頼オーダーを削除しますか？",
        confirm_type:"delete_schedule",
        order_data,
      })
    }
  }

  closeModal=(act=null)=>{
    this.setState({
      openNutritionGuidance:false,
      isOpenGuidanceNutritionRequestDoneModal:false,
      confirm_message:"",
      confirm_type:"",
      alert_messages:act == "order_done" ? "実施しました。" : "",
    }, ()=>{
      if(act == "order_done"){
        this.getScheduleData(this.state.holidays);
      }
    });
  }

  confirmOk=()=>{
    if(this.state.confirm_type == "delete_schedule"){
      this.closeModal();
      this.deleteNutrition(this.state.order_data.order_data.number);
    }
  }

  deleteNutrition=async(guidance_nutrition_id)=>{
    let path = "/app/api/v2/nutrition_guidance/delete_schedule";
    let post_data = {
      guidance_nutrition_id,
    };
    await apiClient
      .post(path, {
        params: post_data
      })
      .then((res) => {
        this.setState({
          alert_messages:res.alert_message,
          load_flag:false,
        },()=>{
          this.getScheduleData(this.state.holidays);
        });
      })
      .catch(() => {

      });
  }

  render() {
    return (
      <>
        <Modal show={true} className="custom-modal-sm nutrition-guidance-schedule first-view-modal" id="nutrition_guidance_schedule">
          <Modal.Header><Modal.Title>栄養指導カレンダー</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              <div className={'select-date flex'} style={{marginBottom:"0.5rem"}}>
                <div className={'date-label'}>日付</div>
                <Button type="common" onClick={this.moveMonth.bind(this, 'prev')}>{'<<'}</Button>
                <Button type="common" onClick={this.moveDay.bind(this, 'prev')}>{'<'}</Button>
                <Button type="common" onClick={this.selectToday}>本日</Button>
                <Button type="common" onClick={this.moveDay.bind(this, 'next')}>{'>'}</Button>
                <Button type="common" onClick={this.moveMonth.bind(this, 'next')}>{'>>'}</Button>
                <div className={'view-date'}>{formatJapan(this.state.guidance_date)}</div>
              </div>
              <div className={'flex'} style={{marginBottom:"0.5rem"}}>
                <div className={'select-ward'}>
                  <SelectorWithLabel
                    title="病棟"
                    options={this.state.ward_master}
                    getSelect={this.setWard}
                    departmentEditCode={this.state.first_ward_id}
                  />
                </div>
                <div className={'select-department'} style={{marginLeft:"0.5rem"}}>
                  <SelectorWithLabel
                    title="診療科"
                    options={this.state.department_codes}
                    getSelect={this.getDepartment}
                    departmentEditCode={this.state.department_id}
                  />
                </div>
                <div className={'btn-area'}>
                  <Button type="common" onClick={this.getScheduleData.bind(this, this.state.holidays)}>検索</Button>
                </div>
              </div>
              <div id="scrolling_table_1" className="scrolly_table">
                <table className="table-scroll table table-bordered" id="code-table">
                  <tr>
                    <th style={{backgroundColor:"white", height:"4rem"}} className="fixed freeze ward-name"><div style={{lineHeight:"4rem"}}>病室</div></th>
                    <th style={{backgroundColor:"white", height:"4rem"}} className="fixed freeze department-name"><div style={{lineHeight:"4rem"}}>診療科</div></th>
                    <th style={{backgroundColor:"white", height:"4rem"}} className="fixed freeze patient-id"><div style={{lineHeight:"4rem"}}>患者ID</div></th>
                    <th style={{backgroundColor:"white", height:"4rem"}} className="fixed freeze patient-name"><div style={{lineHeight:"4rem"}}>患者氏名</div></th>
                    {this.createTable('thead')}
                  </tr>
                  {this.state.load_flag ? (
                    <>
                      {this.state.table_data.length > 0 && (
                        this.state.table_data.map((item, index)=>{
                          return (
                            <>
                              <tr className="tr_shaded">
                                <td className="fixed freeze_horizontal ward-name" style={{padding:0}}><div className={'td-div'} style={{textAlign:"left"}}>{item.room_name}</div></td>
                                <td className="fixed freeze_horizontal department-name" style={{padding:0}}><div className={'td-div'} style={{textAlign:"left"}}>{this.diagnosis[item.department_id]}</div></td>
                                <td className="fixed freeze_horizontal patient-id" style={{textAlign:"right", padding:0}}><div className={'td-div'} style={{textAlign:"right"}}>{item.patient_number}</div></td>
                                <td className="fixed freeze_horizontal patient-name" style={{padding:0}}><div className={'td-div'} style={{textAlign:"left"}}>{item.patient_name}</div></td>
                                {this.createTable('tbody', item, index)}
                              </tr>
                            </>
                          )
                        })
                      )}
                    </>
                  ):(
                    <tr>
                      <td colSpan={'17'} style={{height:"50vh"}}>
                        <SpinnerWrapper>
                          <Spinner animation="border" variant="secondary" />
                        </SpinnerWrapper>
                      </td>
                    </tr>
                  )}
                </table>
              </div>

              {/*<div className={'calendar-area flex'}>*/}
                {/*<div className={'left-table'}>*/}
                  {/*<table className="table-scroll table table-bordered">*/}
                    {/*<thead>*/}
                    {/*<tr>*/}
                      {/*<th className="sticky-col ward-name">*/}
                        {/*<div className="td-div-border">病室</div>*/}
                      {/*</th>*/}
                      {/*<th className="sticky-col department-name">*/}
                        {/*<div className="td-div-border">診療科</div>*/}
                      {/*</th>*/}
                      {/*<th className="sticky-col patient-id">*/}
                        {/*<div className="td-div-border">患者ID</div>*/}
                      {/*</th>*/}
                      {/*<th className="sticky-col patient-name">*/}
                        {/*<div className="td-div-border">患者氏名</div>*/}
                      {/*</th>*/}
                    {/*</tr>*/}
                    {/*</thead>*/}
                    {/*<tbody>*/}
                    {/*{this.state.table_data.length > 0 && (*/}
                      {/*this.state.table_data.map((item)=>{*/}
                        {/*return (*/}
                          {/*<>*/}
                            {/*<tr>*/}
                              {/*<td className="sticky-col ward-name">*/}
                                {/*<div className="td-div-border">{item.room_name}</div>*/}
                              {/*</td>*/}
                              {/*<td className="sticky-col department-name">*/}
                                {/*<div className="td-div-border">{this.diagnosis[item.department_id]}</div>*/}
                              {/*</td>*/}
                              {/*<td className="sticky-col patient-id" style={{textAlign:"right"}}>*/}
                                {/*<div className="td-div-border">{item.patient_number}</div>*/}
                              {/*</td>*/}
                              {/*<td className="sticky-col patient-name">*/}
                                {/*<div className="td-div-border">{item.patient_name}</div>*/}
                              {/*</td>*/}
                            {/*</tr>*/}
                          {/*</>*/}
                        {/*)*/}
                      {/*})*/}
                    {/*)}*/}
                    {/*</tbody>*/}
                  {/*</table>*/}
                {/*</div>*/}
                {/*<div className={'right-table'}>*/}
                  {/*<table className="table-scroll table table-bordered" id="code-table">*/}
                    {/*<thead>*/}
                    {/*<tr>*/}
                      {/*{this.createTable('thead')}*/}
                    {/*</tr>*/}
                    {/*</thead>*/}
                    {/*<tbody>*/}
                    {/*{this.state.table_data.length > 0 && (*/}
                      {/*this.state.table_data.map((item, index)=>{*/}
                        {/*return (*/}
                          {/*<>*/}
                            {/*<tr>*/}
                              {/*{this.createTable('tbody', item, index)}*/}
                            {/*</tr>*/}
                          {/*</>*/}
                        {/*)*/}
                      {/*})*/}
                    {/*)}*/}
                    {/*</tbody>*/}
                  {/*</table>*/}
                {/*</div>*/}
              {/*</div>*/}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            <Button className="cancel-btn" onClick={this.props.closeModal}>閉じる</Button>
          </Modal.Footer>
          <ContextMenu
            {...this.state.contextMenu}
            parent={this}
          />
          {this.state.openNutritionGuidance && (
            <NutritionGuidance
              patientId={this.state.patientId}
              patientInfo={this.state.patientInfo}
              closeModal={this.closeModal}
              order_data={this.state.order_data}
            />
          )}
          {this.state.confirm_message !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.closeModal.bind(this)}
              confirmCancel= {this.closeModal.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.isOpenGuidanceNutritionRequestDoneModal && (
            <GuidanceNutritionRequestDoneModal
              closeModal={this.closeModal}
              modal_data={this.state.done_modal_data}
            />
          )}
        </Modal>
      </>
    );
  }
}

NutritionGuidanceSchedule.contextType = Context;
NutritionGuidanceSchedule.propTypes = {
  closeModal: PropTypes.func,
  guidance_date: PropTypes.string,
};

export default NutritionGuidanceSchedule;
