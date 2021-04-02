import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import MonthCalendar from "~/components/templates/Patient/SOAP/components/MonthCalendar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome/index";
import {onSurface} from "~/components/_nano/colors";
import { faAngleDown } from "@fortawesome/pro-regular-svg-icons";
import $ from "jquery";
import {formatDateLine} from "~/helpers/date";
import * as localApi from "~/helpers/cacheLocal-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import * as apiClient from "~/api/apiClient";

const Wrapper = styled.div`
  width: 100%;
  background-color: white;
  font-size:${props=>(props.font_props != undefined?0.9*props.font_props + 'rem':'0.9rem')};
  margin-top: 5px;
  .flex{
    display: flex;
  }
  .pt-20 {
    padding-top: 20px;
  }
  .table-area {
    width: 98%;
    margin: auto;
  }
  .state-div{
    border: solid 1px #999;
    width: 15px;
    height: 15px;
    margin-top: 3px;
  }
  .karte-calendar {
    width: 100%;
    border-bottom: 1px solid #aaa;
    .btn1-area {
      width: 270px;
      margin: auto;
      button {
        padding: 0;
        margin: 0;
        width: 90px;
      }
    }
    .calendar-header {
        background: linear-gradient(#9aa6b3, #cee0f2, #cee0f2);
        display:flex;
        cursor:pointer;
    }
    .title {
        width: calc(100% - 80px);
        padding-left:3px;
        padding-right:3px;
        font-size:${props=>(props.font_props != undefined?1.25*props.font_props + 'rem':'1.25rem')};
        line-height: 30px;
        height: 30px;
    }
    .view-karte-calendar {
        font-size:${props=>(props.font_props != undefined?1.5*props.font_props + 'rem':'1.5rem')};
        position:relative;
        width:30px;
        svg {
            top:3px;
        }
    }
    .open {
        transform: rotate(180deg);
    }
    .select-today {
        background-color:white;
        border: 1px solid #aaa;
        width: 40px;
        text-align: center;
        cursor:pointer;
        height: 30px;
        line-height: 30px;
    }
    .calendar-area {
        width: 100%;
    }
  }
  
 .table {
    tr{
      height: 25px;
    }
    td{
      padding:3px;
      border-color:#222;
      background: white;
    }
    th{
      padding:3px;
      border-color:#222;
    }
  }
 .block{
    background-color: #eee;
 }
 .label-title{
    // font-size: 16px;
    font-size:${props=>(props.font_props != undefined?props.font_props + 'rem':'1rem')};
    width: 100px;
    margin-left: 10px;
 }
 .label-unit{
    // font-size: 16px;
    font-size:${props=>(props.font_props != undefined?0.9 * props.font_props + 'rem':'0.9rem')};
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
 }
 button{
  padding: 4px 8px;
  span{
    color: black;
    font-size:${props=>(props.font_props != undefined?props.font_props + 'rem':'1rem')};
    font-weight: 100;
  }
 }
`;

const Angle = styled(FontAwesomeIcon)`
  color: ${onSurface};
  cursor: pointer;
  display: inline-block;
  font-size: 25px;
  position: absolute;
  top: 0px;
  right: 8px;
  bottom: 0px;
  margin: auto;
`;

class KarteCalendar extends Component {
  constructor(props) {
    super(props);
    let cur_date = new Date();
    let middle_year = cur_date.getFullYear();
    let middle_month = cur_date.getMonth() + 1;
    let left_year = middle_year;
    let left_month = middle_month - 1;
    let right_year = middle_year;
    let right_month = middle_month + 1;
    if((middle_month - 1) === 0){
      left_month = 12;
      left_year = middle_year - 1;
    }
    if((middle_month + 1) === 13){
      right_month = 1;
      right_year = middle_year + 1;
    }
    let all_karte_date={};
    if(props.allDateList !== undefined && props.allDateList != null && Object.keys(props.allDateList).length > 0){
      Object.keys(props.allDateList).map(date=>{
        all_karte_date[date] = true;
      });
    }
    let view_karte_date={};
    if(props.soapList !== undefined && props.soapList != null && Object.keys(props.soapList).length > 0){
      Object.keys(props.soapList).map(index=>{
        view_karte_date[props.soapList[index]['treatment_date']] = true;
      });
    }
    this.state = {
      middle_year,
      middle_month,
      left_year,
      left_month,
      right_year,
      right_month,
      all_karte_date,
      view_karte_date,
      all_soap_data:props.all_soap_data
    };
  }
  
  async componentDidMount() {
    await this.getHolidays();
  }
  
  UNSAFE_componentWillReceiveProps(nextProps) {
    let all_karte_date={};
    if(nextProps.allDateList !== undefined && nextProps.allDateList != null && Object.keys(nextProps.allDateList).length > 0){
      Object.keys(nextProps.allDateList).map(date=>{
        all_karte_date[date] = true;
      });
    }
    let view_karte_date={};
    if(nextProps.soapList !== undefined && nextProps.soapList != null && Object.keys(nextProps.soapList).length > 0){
      Object.keys(nextProps.soapList).map(index=>{
        view_karte_date[nextProps.soapList[index]['treatment_date']] = true;
      });
    }
    this.setState({
      all_soap_data:nextProps.all_soap_data,
      all_karte_date,
      view_karte_date,
    });
  }
  
  getHolidays=async()=>{
    let get_karte_holiday_flag = localApi.getValue("get_karte_holiday");
    if(get_karte_holiday_flag == 1){
      let cache_name = this.state.middle_year+'-'+this.state.middle_month;
      let holidays = localApi.getObject(CACHE_LOCALNAMES.KARTE_HOLIDAYS);
      if(holidays !== undefined && holidays != null && holidays[cache_name] !== undefined){
        this.setState({holidays:holidays[cache_name]});
      } else {
        let from_date = formatDateLine(new Date(this.state.left_year, this.state.left_month - 1, 1));
        let end_date = formatDateLine(new Date(this.state.right_year, this.state.right_month, 0));
        let path = "/app/api/v2/dial/schedule/get_holidays";
        let post_data = {
          start_date: from_date,
          end_date:end_date,
        };
        await apiClient._post(
          path,
          {params: post_data})
          .then((res) => {
            let holidays = {};
            holidays[cache_name] = [];
            if(Object.keys(res).length > 0){
              holidays[cache_name] = Object.keys(res);
            }
            localApi.setObject(CACHE_LOCALNAMES.KARTE_HOLIDAYS, holidays);
            this.setState({holidays:holidays[cache_name]});
          })
          .catch(() => {
          });
      }
    }
  }
  
  getselectedtDate =(year, month, date)=>{
    if(this.state.all_soap_data !== undefined && this.state.all_soap_data != null && this.state.all_soap_data.length > 0){
      let year_key = '';
      let month_key = '';
      let date_key = '';
      this.state.all_soap_data.map((year_data, year_index)=>{
        if(year_data['year'] == year){
          year_key = year_index;
          year_data['data'].map((month_data, month_index)=>{
            if(month_data['month'] == year + '-' + (month > 9 ? month : '0'+month)){
              month_key = month_index;
              month_data['data'].map((date_data, date_index)=>{
                if(date_data['date'] == year + '-' + (month > 9 ? month : '0' + month) + '-' + (date > 9 ? date : '0' + date)){
                  date_key = date_index;
                  return;
                }
              })
              return;
            }
          });
          return;
        }
      });
      if(year_key !== '' && month_key !== '' && date_key !== ''){
        this.props.changeSoapList(2, year_key, month_key, date_key, -1);
      }
    }
  }
  
  selectMonth = (type)=>{
    let middle_month = this.state.middle_month;
    let middle_year = this.state.middle_year;
    if(type === 'prev'){
      if(middle_month === 1){
        middle_month = 12;
        middle_year--;
      } else {
        middle_month--;
      }
    } else {
      if(middle_month === 12){
        middle_month = 1;
        middle_year++;
      } else {
        middle_month++;
      }
    }
    let left_year = middle_year;
    let left_month = middle_month - 1;
    let right_year = middle_year;
    let right_month = middle_month + 1;
    if((middle_month - 1) === 0){
      left_month = 12;
      left_year = middle_year - 1;
    }
    if((middle_month + 1) === 13){
      right_month = 1;
      right_year = middle_year + 1;
    }
    this.setState({
      middle_year,
      middle_month,
      left_year,
      left_month,
      right_year,
      right_month,
    }, async()=>{
      await this.getHolidays();
    });
  }
  
  viewKarteCalendar=()=>{
    let calendar_area = document.getElementsByClassName("calendar-area")[0];
    let obj = $(".view-karte-calendar");
    if(obj.hasClass("open")){
      localApi.setValue("view_karte_calendar", "none");
      obj.removeClass("open");
      calendar_area.style['display'] = "none";
    } else {
      localApi.setValue("view_karte_calendar", "flex");
      obj.addClass("open");
      calendar_area.style['display'] = "flex";
    }
    let calendar_height = document.getElementsByClassName("karte-calendar")[0].offsetHeight;
    let list_condition_height = document.getElementsByClassName("list-condition")[0].offsetHeight;
    let visit_date_obj = document.getElementsByClassName("next-reservation-visit-date");
    let next_visit_date_height = 0;
    if(visit_date_obj !== undefined){
      next_visit_date_height = visit_date_obj[0].offsetHeight;
    }
    let all_close_open_height = document.getElementsByClassName("all-close-open")[0].offsetHeight;
    let order_area_height = "calc(100vh - " + (calendar_height + list_condition_height + all_close_open_height + next_visit_date_height + 182)+"px)";
    document.getElementById("soap_list_wrapper").style.height = order_area_height;
  }
  
  render() {
    let view_karte_calendar = localApi.getValue('view_karte_calendar');
    if(view_karte_calendar == undefined || view_karte_calendar == null){
      view_karte_calendar = "none";
    }
    return (
      <Wrapper font_props = {this.props.font_props}>
        <>
          <div className="karte-calendar">
            <div className={'calendar-header'}>
              <div className="title" onClick={this.viewKarteCalendar.bind(this)}>カルテカレンダー</div>
              <div className={'select-today'} onClick={this.getselectedtDate.bind(this, new Date().getFullYear(), (new Date().getMonth() + 1), new Date().getDate())}>本曰</div>
              <div className={'view-karte-calendar'} onClick={this.viewKarteCalendar.bind(this)}>
                <Angle className={'angle'} icon={faAngleDown} />
              </div>
            </div>
            <div className="calendar-area" style={{display:view_karte_calendar}}>
              <MonthCalendar
                selectDay={this.getselectedtDate.bind(this)}
                year={this.state.left_year}
                month={this.state.left_month}
                type={'left'}
                selectMonth={this.selectMonth}
                holidays={this.state.holidays}
                view_karte_date={this.state.view_karte_date}
                all_karte_date={this.state.all_karte_date}
              />
              <MonthCalendar
                selectDay={this.getselectedtDate.bind(this)}
                year={this.state.middle_year}
                month={this.state.middle_month}
                type={'middle'}
                holidays={this.state.holidays}
                view_karte_date={this.state.view_karte_date}
                all_karte_date={this.state.all_karte_date}
              />
              <MonthCalendar
                selectDay={this.getselectedtDate.bind(this)}
                year={this.state.right_year}
                month={this.state.right_month}
                type={'right'}
                selectMonth={this.selectMonth}
                holidays={this.state.holidays}
                view_karte_date={this.state.view_karte_date}
                all_karte_date={this.state.all_karte_date}
              />
            </div>
          </div>
        </>
      </Wrapper>
    );
  }
}

KarteCalendar.propTypes = {
  soapList:PropTypes.array,
  allDateList:PropTypes.array,
  all_soap_data:PropTypes.array,
  changeSoapList:PropTypes.func,
  font_props:PropTypes.number,
};

export default KarteCalendar;
