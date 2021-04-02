import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import Button from "~/components/atoms/Button";
import ResevationCalendarBody from "~/components/templates/Patient/Modals/Common/ResevationCalendarBody";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatJapanDateSlash} from "~/helpers/date";
import SystemAlertModal from "~/components/molecules/SystemAlertModal";
import Checkbox from "~/components/molecules/Checkbox";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import * as karteApi from "~/helpers/cacheKarte-utils";
import Context from "~/helpers/configureStore";

const Wrapper = styled.div`  
  width: 100%;
  height: 100%;
  font-size: 1rem;
  .flex{display: flex;}
  .title {
    position:absolute;
    left: 0.5rem;
    top: -1rem;
    background-color: white;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    font-size: 1.2rem;
  }
  .state-div{
    border: solid 1px #999;
    width: 1rem;
    height: 1rem;
  }
  .left-area {
    position:relative;
    width: 60%;
    .re-search-btn {
      width:6rem;
      margin-left:0.5rem;
    }
    .btn1-area {
      margin-left: 4rem;
      button {
        width: 6rem;
        margin-right:0.5rem;
      } 
    }
    .calendar-area {
      align-items: flex-start;
      justify-content: space-between;
      button {
        margin-top: 6rem;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
      }
      .calendar {
        width: calc(100% - 60px);
      }
      .left-btn {
        padding: 0px 0.7rem 0 0rem;
      }
      .right-btn {
        padding: 0px 0 0 0.7rem;
      }
    }
  }
  .right-area {
    width: 38%;
    margin-left: 2%;
    height: 100%;
    .select-time-area {
      position:relative;
    }
    .label-title {
      width: 90px;
    }
    .react-numeric-input {
      input {
        width: 50px !important;
      } 
    }
    button {
      margin-right:10px;
      margin-bottom: 10px;
    }
    .time-table {
      height: 48%;
      overflow-y: auto;
      table {
        margin-bottom:0;
      }
    }
    .selected {
      background-color:#f7a081;
    }
    .tr-row {
      cursor: pointer;
    }
    .check-state {
      margin-left: 0.5rem;
      label {
        font-size:1rem;
        line-height:2rem;
      }
    }
    .btn-area {
      margin-top:0.5rem;
      margin-left:auto;
      margin-right:0;
      text-align: right;
      button {
        margin:0;
        margin-left:0.5rem;
      }
    }
    .selected-date-area {
      position:relative;
      margin-top: 1rem;
    }
  }
  .bottom-area {
    margin-top: 1.5rem;
    position:relative;
  }
 .block{
    background-color: #eee;
 }
 .label-title{
    font-size: 16px;
    width: 100px;
    margin-left: 10px;
 }
 .label-unit{
    font-size: 16px;
    width: 100px;
    margin-left: 20px;
 }
 .form-control{
  height: 34px;
 }
 .w-60 {
  width: 60%;
 }
 .w38{
  width:38%;
 } 
 .w-16{
    width: 20%;
    align-items: center;
 }
 .schedule-area {
    width: 100%;
    padding: 1rem 0.5rem 0.5rem 0.5rem;
    table {
      margin:0;
      tbody{
       display:block;
       overflow-y: scroll;
       height: calc(90vh - 41rem);
       width:100%;
       tr:nth-child(even) {background-color: #f2f2f2;}
       tr:hover{background-color:#e2e2e2 !important;}
      }
      tr{
       display: table;
       width: 100%;
      }
      thead{
       display:table;
       width:100%;
       border-bottom: 1px solid #dee2e6;
       tr{width: calc(100% - 17px);}
      }
      td {
       padding: 0 0.25rem;
       word-break: break-all;
       border-color: #dee2e6;
       button{
         float:right;
       }
       font-size:1rem;
      }
      th {
       position: sticky;
       text-align: center;
       padding: 0.15rem 0.25rem;
       white-space:nowrap;
       border:none;
       border-right:1px solid #dee2e6;
       font-size:1rem;
       border-color: #dee2e6;
      }
      .td-check {
        width:3rem;
        text-align: center;
        label {
          margin:0;
          input {margin:0;}
        }
      }
    }
  }
`;

const SpinnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class EndoscopeReservationModal extends Component {
  constructor(props) {
    super(props);
    let cur_date = (props.inspection_DATETIME !== null && props.inspection_DATETIME !== '') ? new Date(props.inspection_DATETIME) : new Date();
    let order_type = 1; //生理検査
    let target_table = "inspection_order";
    switch (props.reserve_type){
      case "inspection":
        if(props.inspection_id === 17){
          order_type = 2; //内視鏡検査
        }
        break;
      case "radiation":
        order_type = 3; //放射線検査
        target_table = "order";
        break;
      case "nutrition_guidance": //栄養指導依頼
        order_type = 4;
        target_table = "guidance_nutrition_request";
        break;
    }
    let selected_time_no = (props.reserve_time == null || props.reserve_time === "") ? 1 : 0;
    let multi_reserve_data = [];
    let multi_reserve_date_time_ids = [];
    if(props.enable_multi_reserve){
      let reserve_data = props.reserve_data;
      if(props.reserve_type === "inspection_middle"){
        reserve_data = [];
        props.reservation_info.reserve_data.map(time=>{
          time.old_data = 1;
          reserve_data.push(time);
        });
        if(props.reservation_info.inspection_id === 17){
          order_type = 2; //内視鏡検査
        }
      }
      if(props.reserve_type === "inspection_right"){
        if(props.reservation_info.inspection_id === 17){
          order_type = 2; //内視鏡検査
        }
        reserve_data = props.reservation_info.reserve_data;
      }
      if(reserve_data != null && reserve_data.length > 0){
        reserve_data.map(time=>{
          multi_reserve_date_time_ids.push(time.time_id);
          multi_reserve_data.push(time);
        });
        selected_time_no = 0;
      }
    }
    this.state = {
      is_loaded: false,
      load_flag: false,
      order_type,
      target_table,
      reservation_unit:1,
      cur_year:cur_date.getFullYear(),
      cur_month:cur_date.getMonth() + 1,
      selected_date:cur_date.getDate(),
      reserve_date:(props.inspection_DATETIME == null || props.inspection_DATETIME !== "") ? formatDateLine(props.inspection_DATETIME) : formatDateLine(new Date()),
      reserve_data:null,
      time_table:[],
      reserved_list:[],
      selected_time:props.reserve_time,
      selected_time_no,
      alert_messages:"",
      day_hold:false,
      reservation_status_data:[],
      multi_reserve_data,
      multi_reserve_date_time_ids,
      select_multi_reserve_date_time_ids:[],
    }
    this.authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
  }

  async componentDidMount() {
    await this.getTimeList();
    await this.getReserveList();
  }

  getTimeList=async()=>{
    if(this.state.load_flag){
      this.setState({load_flag:false});
    }
    let path = "/app/api/v2/master/inspection/getReservedTimes";
    let cur_month = this.state.cur_month > 9 ? this.state.cur_month : '0'+this.state.cur_month;
    let selected_date = this.state.selected_date > 9 ? this.state.selected_date : '0'+this.state.selected_date;
    let cur_date = new Date(this.state.cur_year+'-'+cur_month+'-'+selected_date);
    let week_day = cur_date.getDay();
    let inspection_id = this.props.inspection_id;
    if(this.props.reserve_type === "inspection_middle" || this.props.reserve_type === "inspection_right"){
      inspection_id = this.props.reservation_info.inspection_id;
    }
    let post_data = {
      order_type:this.state.order_type,
      inspection_id,
      target_table:this.state.target_table,
      weekday:week_day,
      cur_date:formatDateLine(cur_date),
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        this.setState({
          time_table:res[formatDateLine(cur_date)],
          reservation_status_data:res,
          is_loaded:true,
          load_flag:true,
        });
      })
      .catch(() => {
      })
  };

  getReserveList =async()=>{
    let path = "/app/api/v2/master/inspection/getReservedList";
    let post_data = {
      order_type:this.state.order_type,
      system_patient_id:this.props.system_patient_id,
      target_table:this.state.target_table,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        this.setState({reserved_list:res});
      })
      .catch(() => {
      })
  };

  getValue = (value) => {
    this.setState({reservation_unit: value});
  };

  getselectedtDate =(date)=>{
    this.setState({
      selected_date:date,
      load_flag:false,
      selected_time:"",
      reserve_date:null,
      reserve_data:null,
    }, ()=>{
      this.getTimeList();
    });
  };

  changeZIndex=(type=true)=>{
    let base_modal = document.getElementsByClassName("reserve-calendar-modal")[0];
    if(base_modal !== undefined && base_modal != null){
      base_modal.style['z-index'] = type ? 1040 : 1050;
    }
  }

  handleOk =()=> {
    if(this.props.reserve_type === "inspection_middle" || this.props.reserve_type === "inspection_right"){
      let order_data = this.props.reservation_info;
      order_data.reserve_data = this.state.multi_reserve_data;
      order_data.isForUpdate = 1;
      if(this.props.reserve_type === "inspection_middle"){
        order_data.last_doctor_code = order_data.doctor_code;
        order_data.last_doctor_name = order_data.doctor_name;
      }
      order_data.state = 0;
      order_data.open_flag = 1;
      order_data.doctor_code = this.authInfo.staff_category == 1 ? this.authInfo.doctor_code : this.context.selectedDoctor.code;
      order_data.doctor_name = this.authInfo.staff_category == 1 ? this.authInfo.name : this.context.selectedDoctor.name;
      if(this.authInfo.staff_category != 1){
        order_data.substitute_name = this.authInfo.name;
      }
      order_data.add_reserve = 1;
      let cache_data = karteApi.getVal(this.props.system_patient_id, CACHE_LOCALNAMES.INSPECTION_EDIT);
      let stampKey = new Date().getTime();
      if(cache_data !== undefined && cache_data != null) {
        Object.keys(cache_data).map((index) => {
          if(cache_data[index].number == order_data.number){
            stampKey = index;
          }
        });
      }
      karteApi.setSubVal(this.props.system_patient_id, CACHE_LOCALNAMES.INSPECTION_EDIT, stampKey, JSON.stringify(order_data), 'insert');
      // refresh soap page
      this.context.$setExaminationOrderFlag(1);
      this.props.closeModal();
      return;
    }
    if(this.state.day_hold){
      this.props.handleOk(null);
    } else {
      if(this.props.enable_multi_reserve && this.state.multi_reserve_data.length > 0){
        this.props.handleOk(null, null, this.state.multi_reserve_data, 1);
      } else {
        let month = this.state.cur_month > 9 ? this.state.cur_month : '0'+this.state.cur_month;
        let day_index = this.state.selected_date > 9 ? this.state.selected_date: '0'+this.state.selected_date;
        let date = this.state.cur_year+"-"+month+"-"+day_index;
        if(this.state.reserve_date !== "" && this.state.reservation_status_data[date] !== undefined && this.state.reservation_status_data[date].length > 0){
          if(this.state.selected_time_no) {
            let reserve_data = this.state.reservation_status_data[date][0];
            reserve_data.time_id = null;
            this.props.handleOk(date, null, reserve_data, 0);
          } else if(this.state.selected_time !=="") {
            this.props.handleOk(this.state.reserve_date, this.state.selected_time, this.state.reserve_data, 0);
          }
        } else {
          this.changeZIndex();
          this.setState({alert_messages:"この日には予約できません。"});
        }
      }
    }
  };

  selectTime = (item)=>{
    if(item.max_persons === 0 || (item.max_persons - item.reserve_count) === 0){
      this.changeZIndex();
      this.setState({alert_messages:"この時間には予約できません。"});
      return;
    }
    this.setState({
      selected_time:item.block_start_time,
      reserve_date:item.inspection_date,
      reserve_data:item,
      day_hold:false,
      selected_time_no: 0
    });
  };

  selectMonth = (type)=>{
    let cur_month = this.state.cur_month;
    let cur_year = this.state.cur_year;
    let selected_date = this.state.selected_date;
    if(type === 'prev'){
      if(cur_month === 1){
        cur_month = 12;
        cur_year--;
      } else {
        cur_month--;
      }
      let cur_date_time = new Date(cur_year + '/' + (cur_month > 9 ? cur_month : '0'+cur_month) + '/' + (selected_date > 9 ? selected_date : '0'+selected_date));
      if((cur_date_time.toString() === "Invalid Date") || (cur_date_time.getDate() != selected_date)){
        cur_date_time = new Date(cur_year, cur_month, 0);
        selected_date = cur_date_time.getDate();
      }
    } else {
      if(cur_month === 12){
        cur_month = 1;
        cur_year++;
      } else {
        cur_month++;
      }
      let cur_date_time = new Date(cur_year + '/' + (cur_month > 9 ? cur_month : '0'+cur_month) + '/' + (selected_date > 9 ? selected_date : '0'+selected_date));
      if((cur_date_time.toString() === "Invalid Date") || (cur_date_time.getDate() != selected_date)){
        cur_date_time = new Date(cur_year, cur_month, 0);
        selected_date = cur_date_time.getDate();
      }
    }
    this.setState({
      cur_month,
      cur_year,
      selected_date,
      load_flag:false,
    }, ()=>{
      this.getTimeList();
    });
  };

  confirmCancel=()=>{
    this.changeZIndex(false);
    this.setState({alert_messages:""});
  }

  setDate=(type=null, numWeeks=null)=>{
    let cur_year = this.state.cur_year;
    let cur_month = this.state.cur_month;
    let selected_date = this.state.selected_date;
    if(type === "week_later"){
      cur_month = parseInt(this.state.cur_month) > 9 ? parseInt(this.state.cur_month) : '0'+parseInt(this.state.cur_month);
      selected_date = parseInt(this.state.selected_date) > 9 ? parseInt(this.state.selected_date) : '0'+parseInt(this.state.selected_date);
      let cur_date = new Date(cur_year + '-' + cur_month + '-' + selected_date);
      cur_date.setDate(cur_date.getDate() + numWeeks * 7);
      cur_year = cur_date.getFullYear();
      cur_month = cur_date.getMonth() + 1;
      selected_date = cur_date.getDate();
    }
    if(type === "today"){
      let cur_date = new Date();
      cur_year = cur_date.getFullYear();
      cur_month = cur_date.getMonth() + 1;
      selected_date = cur_date.getDate();
    }
    this.setState({
      cur_year,
      cur_month:parseInt(cur_month),
      selected_date:parseInt(selected_date),
      load_flag:false,
      selected_time:"",
      reserve_date:null,
      reserve_data:null,
    }, ()=>{
      this.getTimeList();
    })
  }

  setDayHold=()=>{
    this.setState({
      day_hold:!this.state.day_hold,
      selected_time:"",
      selected_time_no:0,
    });
  }

  setTimeNull = (name, value) => {
    this.change_flag = 1;
    this.setState({
      [name]: value,
      selected_time:value == 1 ? "" : this.state.selected_time,
      day_hold:value == 1 ? 0 : this.state.day_hold,
    });
  }
  
  selectMultiReserveDates=(type)=>{
    let state_data = {};
    if(type === "add"){
      let multi_reserve_data = this.state.multi_reserve_data;
      let multi_reserve_date_time_ids = this.state.multi_reserve_date_time_ids;
      multi_reserve_date_time_ids.push(this.state.reserve_data.time_id);
      multi_reserve_data.push(this.state.reserve_data);
      state_data.multi_reserve_date_time_ids = multi_reserve_date_time_ids;
      state_data.multi_reserve_data = multi_reserve_data;
      state_data.selected_time = "";
      state_data.reserve_date = null;
      state_data.reserve_data = null;
    }
    if(type === "select_delete"){
      state_data.select_multi_reserve_date_time_ids = [];
      let multi_reserve_data = [];
      let multi_reserve_date_time_ids = [];
      this.state.multi_reserve_data.map(time=>{
        if(!(this.state.select_multi_reserve_date_time_ids.includes(time.time_id))){
          multi_reserve_data.push(time);
          multi_reserve_date_time_ids.push(time.time_id);
        }
      });
      state_data.multi_reserve_data = multi_reserve_data;
      state_data.multi_reserve_date_time_ids = multi_reserve_date_time_ids;
    }
    if(type === "delete"){
      let multi_reserve_data = [];
      let multi_reserve_date_time_ids = [];
      this.state.multi_reserve_data.map(time=>{
        if(time.old_data == 1){
          multi_reserve_data.push(time);
          multi_reserve_date_time_ids.push(time.time_id);
        }
      });
      state_data.multi_reserve_data = multi_reserve_data;
      state_data.multi_reserve_date_time_ids = multi_reserve_date_time_ids;
      state_data.select_multi_reserve_date_time_ids = [];
    }
    this.setState(state_data);
  }
  
  selectMultiReserveDateTimeId=(name, number)=>{
    if(name === "time_id"){
      let select_multi_reserve_date_time_ids = this.state.select_multi_reserve_date_time_ids;
      let index = select_multi_reserve_date_time_ids.indexOf(number);
      if(index === -1){
        select_multi_reserve_date_time_ids.push(number);
      } else {
        select_multi_reserve_date_time_ids.splice(index, 1);
      }
      this.setState({select_multi_reserve_date_time_ids});
    }
  }
  
  canReserveDataDeleteAll=(type)=>{
    if(this.state.multi_reserve_data.length === 0){
      return type === "class_name" ? 'disable-btn' : true;
    }
    let new_time_count = 0;
    this.state.multi_reserve_data.map(time=>{
      if(time.old_data != 1){
        new_time_count++;
      }
    });
    if(new_time_count == 0){
      return type === "class_name" ? 'disable-btn' : true;
    }
    return type === "class_name" ? '' : false;
  }

  render() {
    let can_register = ((this.state.reserve_date !== "" && this.state.selected_time !== "") || this.state.day_hold || this.state.selected_time_no);
    if(this.props.enable_multi_reserve){
      if(this.state.multi_reserve_data.length > 0){
        can_register = true;
      }
      if(this.props.reserve_type === "inspection_middle" || this.props.reserve_type === "inspection_right"){
        let exist_new_time = false;
        this.state.multi_reserve_data.map(time=>{
          if(time.old_data != 1){
            exist_new_time = true;
          }
        });
        can_register = exist_new_time;
      }
    }
    return (
      <>
        <Modal
          show={true}
          className="reserve-calendar-modal"
        >
          <Modal.Header><Modal.Title>予約枠名</Modal.Title></Modal.Header>
          <Modal.Body>
            <Wrapper>
              {this.state.is_loaded ? (
                <>
                  <div className={'flex'} style={{height:"25rem"}}>
                    <div className="left-area border">
                      <div className="title">予約カレンダ</div>
                      <div className={'flex'} style={{marginTop:"1.5rem"}}>
                        <Button type="common" className={'re-search-btn'} onClick={this.setDate.bind(this)}>最新表示</Button>
                        <div className="flex btn1-area">
                          <Button type="common" onClick={this.setDate.bind(this, 'today')}>直近</Button>
                          <Button type="common" onClick={this.setDate.bind(this, 'week_later', 2)}>2週間後</Button>
                          <Button type="common" onClick={this.setDate.bind(this, 'week_later', 4)}>4週間後</Button>
                        </div>
                      </div>
                      <div className="flex" style={{marginTop:"0.5rem"}}>
                        <div className={'re-search-btn'}> </div>
                        <div className={'btn1-area'}>
                          <Button type="common" onClick={this.setDate.bind(this, 'week_later', 8)}>8週間後</Button>
                          <Button type="common" onClick={this.setDate.bind(this, 'week_later', 12)}>12週間後</Button>
                          <Button type="common" onClick={this.setDate.bind(this, 'week_later', 24)}>24週間後</Button>
                        </div>
                      </div>
                      <div className="calendar-area flex border ml-2 mr-2 mt-2">
                        <Button type="common" className={'left-btn'} onClick={this.selectMonth.bind(this, 'prev')}>〈</Button>
                        <div className={'calendar'}>
                          <ResevationCalendarBody
                            selectDay={this.getselectedtDate.bind(this)}
                            year={this.state.cur_year}
                            month={this.state.cur_month}
                            date={this.state.selected_date}
                            reservation_status_data={this.state.reservation_status_data}
                          />
                        </div>
                        <Button type="common" className={'right-btn'} onClick={this.selectMonth.bind(this, 'next')}>〉</Button>
                      </div>
                      <div className="flex mt-2 ml-2">
                        <div className="w-16 flex">
                          <div className="state-div" style={{backgroundColor:"#008000"}}/>
                          <div className="ml-1">AM/PM空</div>
                        </div>
                        {/*<div className="w-16 flex">*/}
                          {/*<div className="state-div" style={{backgroundColor:"#76ffdb"}}/>*/}
                          {/*<div className="ml-1">PM空</div>*/}
                        {/*</div>*/}
                        <div className="w-16 flex">
                          <div className="state-div" style={{backgroundColor:"#808080"}}/>
                          <div className="ml-1">締切</div>
                        </div>
                        {/*<div className="w-16 flex">*/}
                          {/*<div className="state-div" style={{backgroundColor:"#dcdbd9"}}/>*/}
                          {/*<div className="ml-1">土曜日</div>*/}
                        {/*</div>*/}
                        {/*<div className="w-16 flex">*/}
                          {/*<div className="state-div" style={{backgroundColor:"#e8d1d2"}}/>*/}
                          {/*<div className="ml-1">日祝日</div>*/}
                        {/*</div>*/}
                      </div>
                      <div className="flex mt-2 ml-2">
                        {/*<div className="w-16 flex">*/}
                          {/*<div className="state-div" style={{backgroundColor:"#c6e67c"}}/>*/}
                          {/*<div className="ml-1">AM空</div>*/}
                        {/*</div>*/}
                        {/*<div className="w-16 flex">*/}
                          {/*<div className="state-div" style={{backgroundColor:"#eebfd9"}}/>*/}
                          {/*<div className="ml-1">空なし</div>*/}
                        {/*</div>*/}
                        <div className="w-16 flex">
                          <div className="state-div" style={{backgroundColor:"#fff"}}/>
                          <div className="ml-1">枠なし</div>
                        </div>
                        {/*<div className="w-16 flex">*/}
                          {/*<div className="state-div" style={{backgroundColor:"#f1f184"}}/>*/}
                          {/*<div className="ml-1">禁則(W)</div>*/}
                        {/*</div>*/}
                        {/*<div className="w-16 flex">*/}
                          {/*<div className="state-div" style={{backgroundColor:"#e43744"}}/>*/}
                          {/*<div className="ml-1">禁則(E)</div>*/}
                        {/*</div>*/}
                      </div>
                    </div>
                    <div className="right-area">
                      <div className={'select-time-area border'}>
                        <div className="title">{this.state.cur_year+'年'+this.state.cur_month+'月'+this.state.selected_date+'日'}</div>
                        <div className={'schedule-area'} style={{paddingBottom:0}}>
                          <table className="table-scroll table table-bordered">
                            <thead>
                            <tr>
                              <th style={{width:"6rem"}}>時間</th>
                              <th>取得人数</th>
                            </tr>
                            </thead>
                            <tbody style={{height:"6.5rem"}}>
                            {this.state.load_flag ? (
                              <>
                                {(this.state.time_table != null && this.state.time_table !== undefined && this.state.time_table.length > 0) && (
                                  this.state.time_table.map(item=>{
                                    return (
                                      <>
                                        <tr className={'tr-row'} onClick={this.selectTime.bind(this, item)}>
                                          <td style={{width:"6rem"}}>{item.block_start_time}-{item.block_end_time}</td>
                                          <td className={(((this.state.reserve_date === item.inspection_date) && (this.state.selected_time === item.block_start_time))
                                            || (this.state.multi_reserve_date_time_ids.includes(item.time_id))) ? 'selected' : ''}>
                                            {item.reserve_count}/{item.max_persons}
                                          </td>
                                        </tr>
                                      </>
                                    )
                                  })
                                )}
                              </>
                            ):(
                              <tr style={{height:"8rem"}}>
                                <td colSpan={'2'}>
                                  <SpinnerWrapper>
                                    <Spinner animation="border" variant="secondary" />
                                  </SpinnerWrapper>
                                </td>
                              </tr>
                            )}
                            </tbody>
                          </table>
                        </div>
                        {/*<div className="flex reservation-unit">*/}
                        {/*<NumericInputWithUnitLabel*/}
                        {/*label="取得単位数:"*/}
                        {/*unit="(加算表示)"*/}
                        {/*className="form-control"*/}
                        {/*value={this.state.reservation_unit}*/}
                        {/*getInputText={this.getValue.bind(this)}*/}
                        {/*min={0}*/}
                        {/*inputmode="numeric"*/}
                        {/*/>*/}
                        {/*</div>*/}
                        {/*<div className="flex ml-3 mt-2">*/}
                        {/*<div className="w-25 flex" style={{alignItems:"center"}}>*/}
                        {/*<div className="state-div" style={{backgroundColor:"#f7a081"}}/>*/}
                        {/*<div className="ml-1">選択中</div>*/}
                        {/*</div>*/}
                        {/*<div className="w-50 flex" style={{alignItems:"center"}}>*/}
                        {/*<div className="state-div" style={{backgroundColor:"#f7c57a"}}/>*/}
                        {/*<div className="ml-1">締め切り</div>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        {/*<div className="flex ml-3 mt-2">*/}
                        {/*<div className="w-25 flex" style={{alignItems:"center"}}>*/}
                        {/*<div className="state-div" style={{backgroundColor:"#e6e6e6"}}/>*/}
                        {/*<div className="ml-1">予約済</div>*/}
                        {/*</div>*/}
                        {/*<div className="w-50 flex" style={{alignItems:"center"}}>*/}
                        {/*<div className="state-div" style={{backgroundColor:"#bfbfbf"}}/>*/}
                        {/*<div className="ml-1">診療科優先枠</div>*/}
                        {/*</div>*/}
                        {/*</div>*/}
                        <div className={'check-state'}>
                          <Checkbox
                            label="時間未定"
                            getRadio={this.setTimeNull.bind(this)}
                            value={this.state.selected_time_no === 1}
                            name="selected_time_no"
                            isDisabled={this.state.multi_reserve_data.length > 0}
                          />
                        </div>
                      </div>
                      {this.props.enable_multi_reserve && (
                        <>
                          <div className={'btn-area'}>
                            <Button
                              type="common"
                              className={(this.state.reserve_data == null || (this.state.reserve_data != null && this.state.multi_reserve_date_time_ids.includes(this.state.reserve_data.time_id))) ? 'disable-btn' : ''}
                              isDisabled={(this.state.reserve_data == null || (this.state.reserve_data != null && this.state.multi_reserve_date_time_ids.includes(this.state.reserve_data.time_id)))}
                              onClick={this.selectMultiReserveDates.bind(this, 'add')}
                            >▼追加</Button>
                            <Button
                              type="common"
                              onClick={this.selectMultiReserveDates.bind(this, 'select_delete')}
                              className={this.state.select_multi_reserve_date_time_ids.length === 0 ? 'disable-btn' : ''}
                              isDisabled={this.state.select_multi_reserve_date_time_ids.length === 0}
                            >▲選択削除</Button>
                            <Button
                              type="common"
                              onClick={this.selectMultiReserveDates.bind(this, 'delete')}
                              className={this.canReserveDataDeleteAll('class_name')}
                              isDisabled={this.canReserveDataDeleteAll('disable')}
                            >✕全削除</Button>
                          </div>
                          <div className={'selected-date-area border'}>
                            <div className="title">選択中項目</div>
                            <div className={'schedule-area'}>
                              <table className="table-scroll table table-bordered">
                                <thead>
                                <tr>
                                  <th className={'td-check'}>削除</th>
                                  <th>日時</th>
                                </tr>
                                </thead>
                                <tbody style={{height:"6.5rem"}}>
                                  {(this.state.multi_reserve_data.length > 0) && (
                                    this.state.multi_reserve_data.map(time=>{
                                      return (
                                        <>
                                          <tr>
                                            <td className={'td-check'}>
                                              {time.old_data != 1 && (
                                                <Checkbox
                                                  getRadio={this.selectMultiReserveDateTimeId.bind(this)}
                                                  value={(this.state.select_multi_reserve_date_time_ids.includes(time.time_id))}
                                                  number={time.time_id}
                                                  name="time_id"
                                                />
                                              )}
                                            </td>
                                            <td>{formatJapanDateSlash(time.inspection_date) + " " + time.block_start_time}</td>
                                          </tr>
                                        </>
                                      )
                                    })
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bottom-area border flex">
                    <div  className="title">{this.props.patient_name}さんの予約状況</div>
                    <div className={'schedule-area pt-20'}>
                      <table className="table-scroll table table-bordered">
                        <thead>
                        <tr>
                          <th style={{width:"6rem"}}>予約日</th>
                          <th style={{width:"6rem"}}>予約時間</th>
                          <th style={{width:"15rem"}}>枠名</th>
                          <th>コメント</th>
                        </tr>
                        </thead>
                        <tbody>
                        {(this.state.reserved_list != null && this.state.reserved_list !== undefined && this.state.reserved_list.length > 0) && (
                          this.state.reserved_list.map(item=>{
                            return (
                              <>
                                <tr>
                                  <td style={{width:"6rem"}}>{item.inspection_date}</td>
                                  <td style={{width:"6rem"}}>{item.block_start_time == null ? "時間未定" : (item.block_start_time + "~" + item.block_end_time)}</td>
                                  <td style={{width:"15rem"}}>{item.inspection_type}</td>
                                  <td>{item.reserve_comment}</td>
                                </tr>
                              </>
                            )
                          })
                        )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <SpinnerWrapper>
                  <Spinner animation="border" variant="secondary" />
                </SpinnerWrapper>
              )}
            </Wrapper>
          </Modal.Body>
          <Modal.Footer>
            {this.props.use_day_hold == 1 && (
              <Button className={this.state.day_hold ? 'red-btn' : 'cancel-btn'} onClick={this.setDayHold}>日保留</Button>
            )}
            <Button className="cancel-btn" onClick={this.props.closeModal}>キャンセル</Button>
            <Button className={can_register ? 'red-btn' : 'disable-btn'} onClick={this.handleOk.bind(this)} isDisabled={!can_register}>確定</Button>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.confirmCancel.bind(this)}
              handleOk= {this.confirmCancel.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
        </Modal>
      </>
    );
  }
}

EndoscopeReservationModal.contextType = Context;
EndoscopeReservationModal.defaultProps = {
  enable_multi_reserve: false,
  reserve_data: null,
  inspection_DATETIME: null,
  reserve_time: null,
};
EndoscopeReservationModal.propTypes = {
  handleOk:PropTypes.func,
  system_patient_id:PropTypes.number,
  inspection_id:PropTypes.number,
  inspection_DATETIME:PropTypes.string,
  reserve_time:PropTypes.string,
  patient_name:PropTypes.string,
  closeModal: PropTypes.func,
  reserve_type: PropTypes.string,
  use_day_hold: PropTypes.number,
  enable_multi_reserve: PropTypes.bool,
  reserve_data: PropTypes.object,
  reservation_info: PropTypes.object,
};

export default EndoscopeReservationModal;
