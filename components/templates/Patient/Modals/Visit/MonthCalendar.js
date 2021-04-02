import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import {formatDateLine} from "~/helpers/date";
import $ from "jquery";

const Calendar = styled.div`
    border-bottom: 1px solid black;
    width: 211px;
    margin: 0.2rem;
    .flex {
        display: flex;
    }
    .div-row {
        font-size: 0.8rem;
        font-weight:bold;
        border-left: 1px solid black;
    }
    .year {
        font-size: 1rem;
        display: flex;
    }
    .date-cell {
        text-align: center;
        cursor:pointer;
        width: 30px;
        border-right: 1px solid black;
        border-top: 1px solid black;
    }
    .date-number {
      height:1.2rem;    
      line-height: 1.2rem;
      border-bottom:1px solid #aaa
    }
    .treat-info {
      height: 1.5rem;
      line-height: 1.5rem;
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
    }
    img {
      width: 30px;
      height: 30px;
    }
    svg {
      width: 30px;
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

const ContextMenu = ({
                       visible,
                       x,
                       y,
                       parent,
                       schedule_date,
                     }) => {
  //
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div onClick={() =>parent.contextMenuAction("change_scheduled_doctor_number", schedule_date)}>予定医師変更</div></li>
          <li><div onClick={() =>parent.contextMenuAction("change_scheduled_departure_time", schedule_date)}>出発予定時刻変更</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

const HoverMenu = ({
                     visible,
                     x,
                     y,
                     cur_schedule_data,
                   }) => {
  if (visible) {
    return (
      <ContextMenuUl>
        <ul className="context-menu hover-menu" style={{ left: `${x}px`, top: `${y}px` }}>
          <li><div>{'予定医師 : '+(cur_schedule_data['scheduled_doctor_name'] !== undefined ? cur_schedule_data['scheduled_doctor_name'] : "")}</div></li>
          <li><div>{'出発予定時刻 : '+(cur_schedule_data['scheduled_departure_time'] !== undefined ? cur_schedule_data['scheduled_departure_time'] : "")}</div></li>
        </ul>
      </ContextMenuUl>
    );
  } else {
    return null;
  }
};

class MonthCalendar extends Component {
  constructor(props) {
    super(props);
    let cur_week = 0;
    let last_day = 0;
    let cur_date = new Date(this.props.year + '-' + (this.props.month > 9 ? this.props.month : '0'+this.props.month) + '-01');
    cur_week = cur_date.getDay();
    let last_date = new Date(this.props.year, this.props.month, 0);
    last_day = last_date.getDate();
    this.state = {
      cur_week,
      last_day,
      year:props.year,
      month:props.month,
      holidays:props.holidays,
      time_limit_from:props.time_limit_from,
      time_limit_to:props.time_limit_to,
      schedule_data:props.schedule_data,
      schedule_color_info:props.schedule_color_info,
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let cur_week = 0;
    let last_day = 0;
    let cur_date = new Date(nextProps.year + '-' + (nextProps.month > 9 ? nextProps.month : '0'+nextProps.month) + '-01');
    cur_week = cur_date.getDay();
    let last_date = new Date(nextProps.year, nextProps.month, 0);
    last_day = last_date.getDate();
    this.setState({
      cur_week,
      last_day,
      year:nextProps.year,
      month:nextProps.month,
      holidays:nextProps.holidays,
      time_limit_from:nextProps.time_limit_from,
      time_limit_to:nextProps.time_limit_to,
      schedule_data:nextProps.schedule_data,
    });
  }

  selectDay =(day)=>{
    if(day === ''){
      return;
    }
    let month_last_date = new Date(this.state.year, this.state.month, 0);
    if(month_last_date.getDate() < day){
      return;
    }
    let start_date_time = new Date(formatDateLine(this.state.time_limit_from)).getTime();
    let end_date_time = new Date(formatDateLine(this.state.time_limit_to)).getTime();
    let cur_date_time = new Date(this.state.year+'-'+(this.state.month > 9? this.state.month : '0'+this.state.month)+'-'+(day > 9 ? day : '0'+day)).getTime();
    if(start_date_time <= cur_date_time && cur_date_time <= end_date_time){
      this.props.selectDay(this.state.year, this.state.month, day);
    } else {
      return;
    }
  }

  setFontcolor = (day, day_of_week) => {
    if(day === ''){
      return;
    }
    let holidays = this.state.holidays;
    let date = this.state.year+ '-' + (this.state.month > 9 ? this.state.month : '0'+this.state.month) + '-' + (day > 9 ? day : '0' + day);
    if (holidays !== undefined && holidays != null && holidays.length > 0 && holidays.includes(date)){
      return 'red';
    } else {
      if(day_of_week === 0){
        return 'red';
      } else if(day_of_week === 6){
        return 'blue';
      } else {
        return '';
      }
    }
  }

  setBackgroundColor = (day) => {
    if(day === ''){
      return '';
    }
    let month_last_date = new Date(this.state.year, this.state.month, 0);
    if(month_last_date.getDate() < day){
      return '';
    }
    let start_date_time = new Date(formatDateLine(this.state.time_limit_from)).getTime();
    let end_date_time = new Date(formatDateLine(this.state.time_limit_to)).getTime();
    let cur_date_time = new Date(this.state.year+'-'+(this.state.month > 9? this.state.month : '0'+this.state.month)+'-'+(day > 9 ? day : '0'+day)).getTime();
    if(start_date_time <= cur_date_time && cur_date_time <= end_date_time){
      if(this.state.schedule_color_info != null && this.state.schedule_data[this.state.year+'-'+this.state.month+'-'+day] !== undefined){
        return this.state.schedule_color_info[this.state.schedule_data[this.state.year+'-'+this.state.month+'-'+day]['scheduled_time_zone']]['cell_back'];
      } else {
        return '';
      }
    } else {
      return '#808080';
    }
  }

  getCellColor = (day) => {
    if(day === ''){
      return '';
    }
    let month_last_date = new Date(this.state.year, this.state.month, 0);
    if(month_last_date.getDate() < day){
      return '';
    }
    let start_date_time = new Date(formatDateLine(this.state.time_limit_from)).getTime();
    let end_date_time = new Date(formatDateLine(this.state.time_limit_to)).getTime();
    let cur_date_time = new Date(this.state.year+'-'+(this.state.month > 9? this.state.month : '0'+this.state.month)+'-'+(day > 9 ? day : '0'+day)).getTime();
    if(start_date_time <= cur_date_time && cur_date_time <= end_date_time){
      if(this.state.schedule_color_info != null && this.state.schedule_data[this.state.year+'-'+this.state.month+'-'+day] !== undefined){
        return this.state.schedule_color_info[this.state.schedule_data[this.state.year+'-'+this.state.month+'-'+day]['scheduled_time_zone']]['cell_font'];
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  getScheduleInfo = (day) => {
    if(day === ''){
      return '';
    }
    let month_last_date = new Date(this.state.year, this.state.month, 0);
    if(month_last_date.getDate() < day){
      return '';
    }
    if(this.state.schedule_color_info != null && this.state.schedule_data[this.state.year+'-'+this.state.month+'-'+day] !== undefined){
      let scheduled_time_zone = this.state.schedule_data[this.state.year+'-'+this.state.month+'-'+day]['scheduled_time_zone'];
      return scheduled_time_zone == 0 ? '訪' : (scheduled_time_zone == 1 ? 'AM' : 'PM');
    } else {
      return '';
    }
  }

  handleClick=(e)=>{
    let day = e.target.getAttribute("day");
    let schedule_date = this.state.year+'-'+this.state.month+ '-' + day;
    if(this.state.schedule_data[schedule_date] === undefined){
      return;
    }
    if (e.type === "contextmenu") {
      e.preventDefault();
      // eslint-disable-next-line consistent-this
      const that = this;
      document.addEventListener(`click`, function onClickOutside() {
        that.setState({ contextMenu: { visible: false } });
        document.removeEventListener(`click`, onClickOutside);
      });
      window.addEventListener("scroll", function onScrollOutside() {
        that.setState({contextMenu: { visible: false }});
        window.removeEventListener(`scroll`, onScrollOutside);
      });
      this.setState({
        contextMenu: {
          visible: true,
          x: e.clientX-100,
          y: e.clientY + window.pageYOffset-150,
        },
        schedule_date,
        hoverMenu: {
          visible: false,
        },
      });
    }
  }

  handleHover = (e) => {
    let day = e.target.getAttribute("day");
    let schedule_date = this.state.year+'-'+this.state.month+ '-' + day;
    if(this.state.schedule_data[schedule_date] === undefined){
      return;
    }
    let cur_schedule_data = this.state.schedule_data[schedule_date];
    e.preventDefault();
    // eslint-disable-next-line consistent-this
    const that = this;
    document.addEventListener(`click`, function onClickOutside() {
      that.setState({ hoverMenu: { visible: false } });
      document.removeEventListener(`click`, onClickOutside);
    });
    window.addEventListener("scroll", function onScrollOutside() {
      that.setState({
        hoverMenu: { visible: false }
      });
      window.removeEventListener(`scroll`, onScrollOutside);
    });
    document
      .getElementById("calendar_area")
      .addEventListener("scroll", function onScrollOutside() {
        that.setState({
          contextMenu: { visible: false }
        });
        document
          .getElementById("calendar_area")
          .removeEventListener(`scroll`, onScrollOutside);
      });
    let cell_left = document.getElementsByClassName(schedule_date)[0].offsetLeft;
    let cell_width = document.getElementsByClassName(schedule_date)[0].offsetWidth;
    let cell_top = document.getElementsByClassName(schedule_date)[0].offsetTop;
    let scrollTop = $(".calendar-area").scrollTop();
    let state_data = {};
    state_data.cur_schedule_data = cur_schedule_data;
    state_data.hoverMenu = {
      visible: true,
      x: cell_left + cell_width,
      y: cell_top - scrollTop,
    };
    state_data.contextMenu = {
      visible: false,
    };
    this.setState(state_data, ()=>{
      let calendar_top = document.getElementsByClassName("calendar-area")[0].offsetTop;
      let calendar_height = document.getElementsByClassName("calendar-area")[0].offsetHeight;
      let menu_height = document.getElementsByClassName("hover-menu")[0].offsetHeight;
      if((menu_height + cell_top - scrollTop) > calendar_height){
        state_data['hoverMenu']['y'] = calendar_top + calendar_height - menu_height;
        this.setState(state_data);
      }
      if(menu_height > (cell_top - scrollTop)){
        state_data['hoverMenu']['y'] = calendar_top;
        this.setState(state_data);
      }
    });
  }

  contextMenuAction = (type, schedule_date) => {
    if(type === "change_scheduled_doctor_number"){
      this.props.changeSchedule(schedule_date, 'scheduled_doctor_number');
    }
    if(type === "change_scheduled_departure_time"){
      this.props.changeSchedule(schedule_date, 'scheduled_departure_time');
    }
  };
  
  closeHoverMenu=()=>{
    let hoverMenu = this.state.hoverMenu;
    if(hoverMenu !== undefined && hoverMenu.visible){
      this.setState({
        hoverMenu: {
          visible: false,
        }
      });
    }
  }

  render() {
    const {year, month} = this.state;
    let days = 0;
    let first_week = [];
    for (let i = 0; i < 7; i++) {
      if(this.state.cur_week === i){
        first_week.push(
          <div
            className={'date-cell'}
            onClick={this.selectDay.bind(this, days + 1)}
            style={{color:this.setFontcolor((days + 1), i)}}
          >
            <div
              className={'date-number '+(year+'-'+month+'-'+(days + 1))}
              day={days + 1}
              onContextMenu={e => this.handleClick(e, days + 1)}
              onMouseOver={e => this.handleHover(e)}
              onMouseOut={e => {this.closeHoverMenu(e)}}
            >{days + 1}</div>
            <div
              className={'treat-info'}
              day={days + 1}
              onContextMenu={e => this.handleClick(e, days + 1)}
              onMouseOver={e => this.handleHover(e)}
              onMouseOut={e => {this.closeHoverMenu(e)}}
              style={{backgroundColor:this.setBackgroundColor(days + 1), color:this.getCellColor(days + 1)}}
            >{this.getScheduleInfo(days + 1)}</div>
          </div>
        );
        days++;
      } else {
        if(days === 0){
          first_week.push(
            <div className={'date-cell'}>
              <div className={'date-number'}></div>
              <div className={'treat-info'}></div>
            </div>
          );
        } else {
          first_week.push(
            <div
              className={'date-cell'}
              onClick={this.selectDay.bind(this, days + 1)}
              style={{color:this.setFontcolor((days + 1), i)}}
            >
              <div
                className={'date-number '+(year+'-'+month+'-'+(days + 1))}
                day={days + 1}
                onContextMenu={e => this.handleClick(e, days + 1)}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
              >{days + 1}</div>
              <div
                className={'treat-info'}
                day={days + 1}
                onContextMenu={e => this.handleClick(e, days + 1)}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
                style={{backgroundColor:this.setBackgroundColor(days + 1), color:this.getCellColor(days + 1)}}
              >{this.getScheduleInfo(days + 1)}</div>
            </div>
          );
          days++;
        }
      }
    }
    let calendar_body = [];
    for (let week = 1; week < 6; week++) {
      calendar_body.push(
        <>
          <div className={'flex div-row'}>
            <div
              className={'date-cell'}
              style={{color:'red'}}
              onClick={this.selectDay.bind(this, (days < this.state.last_day) ? (days + 1) : '')}
            >
              <div
                className={'date-number '+(year+'-'+month+'-'+(days + 1))}
                day={(((days) < this.state.last_day)) ? (days + 1) : ''}
                onContextMenu={e => this.handleClick(e, (days < this.state.last_day) ? (days + 1) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
              >{((days + 1) > this.state.last_day) ? '' : days + 1}</div>
              <div
                className={'treat-info'}
                day={(((days) < this.state.last_day)) ? (days + 1) : ''}
                onContextMenu={e => this.handleClick(e, (days < this.state.last_day) ? (days + 1) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
                style={{backgroundColor:this.setBackgroundColor((days < this.state.last_day) ? (days + 1) : ''), color:this.getCellColor((days < this.state.last_day) ? (days + 1) : '')}}
              >
                {this.getScheduleInfo(((days + 1) > this.state.last_day) ? '' : days + 1)}
              </div>
            </div>
            <div
              className={'date-cell'}
              style={{color:this.setFontcolor(((days < this.state.last_day) ? (days + 2) : ''), 1)}}
              onClick={this.selectDay.bind(this, ((days + 1) < this.state.last_day) ? (days + 2) : '')}
            >
              <div
                className={'date-number '+(year+'-'+month+'-'+(days + 2))}
                day={(((days) < this.state.last_day)) ? (days + 2) : ''}
                onContextMenu={e => this.handleClick(e, (days < this.state.last_day) ? (days + 2) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
              >{((days + 2) > this.state.last_day) ? '' : days + 2}</div>
              <div
                className={'treat-info'}
                day={(((days) < this.state.last_day)) ? (days + 2) : ''}
                onContextMenu={e => this.handleClick(e, (days < this.state.last_day) ? (days + 2) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
                style={{backgroundColor:this.setBackgroundColor((days < this.state.last_day) ? (days + 2) : ''), color:this.getCellColor((days < this.state.last_day) ? (days + 2) : '')}}
              >
                {this.getScheduleInfo(((days + 2) > this.state.last_day) ? '' : days + 2)}
              </div>
            </div>
            <div
              className={'date-cell'}
              style={{color:this.setFontcolor(((days < this.state.last_day) ? (days + 3) : ''), 2)}}
              onClick={this.selectDay.bind(this, ((days + 2) < this.state.last_day) ? (days + 3) : '')}
            >
              <div
                className={'date-number '+(year+'-'+month+'-'+(days + 3))}
                day={(((days) < this.state.last_day)) ? (days + 3) : ''}
                onContextMenu={e => this.handleClick(e, (days < this.state.last_day) ? (days + 3) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
              >{((days + 3) > this.state.last_day) ? '' : days + 3}</div>
              <div
                className={'treat-info'}
                day={(((days) < this.state.last_day)) ? (days + 3) : ''}
                onContextMenu={e => this.handleClick(e, (((days) < this.state.last_day)) ? (days + 3) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
                style={{backgroundColor:this.setBackgroundColor((days < this.state.last_day) ? (days + 3) : ''), color:this.getCellColor((days < this.state.last_day) ? (days + 3) : '')}}
              >
                {this.getScheduleInfo(((days + 3) > this.state.last_day) ? '' : days + 3)}
              </div>
            </div>
            <div
              className={'date-cell'}
              style={{color:this.setFontcolor(((days < this.state.last_day) ? (days + 4) : ''), 3)}}
              onClick={this.selectDay.bind(this, ((days + 3) < this.state.last_day) ? (days + 4) : '')}
            >
              <div
                className={'date-number '+(year+'-'+month+'-'+(days + 4))}
                day={(((days) < this.state.last_day)) ? (days + 4) : ''}
                onContextMenu={e => this.handleClick(e, ((days < this.state.last_day) ? (days + 4) : ''))}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
              >{((days + 4) > this.state.last_day) ? '' : days + 4}</div>
              <div
                className={'treat-info'}
                day={(((days) < this.state.last_day)) ? (days + 4) : ''}
                onContextMenu={e => this.handleClick(e, ((((days) < this.state.last_day)) ? (days + 4) : ''))}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
                style={{backgroundColor:this.setBackgroundColor((days < this.state.last_day) ? (days + 4) : ''), color:this.getCellColor((days < this.state.last_day) ? (days + 4) : '')}}
              >
                {this.getScheduleInfo(((days + 4) > this.state.last_day) ? '' : days + 4)}
              </div>
            </div>
            <div
              className={'date-cell'}
              style={{color:this.setFontcolor(((days < this.state.last_day) ? (days + 5) : ''), 4)}}
              onClick={this.selectDay.bind(this, ((days + 4) < this.state.last_day) ? (days + 5) : '')}
            >
              <div
                className={'date-number '+(year+'-'+month+'-'+(days + 5))}
                day={(((days) < this.state.last_day)) ? (days + 5) : ''}
                onContextMenu={e => this.handleClick(e, (days < this.state.last_day) ? (days + 5) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
              >{((days + 5) > this.state.last_day) ? '' : days + 5}</div>
              <div
                className={'treat-info'}
                day={(((days) < this.state.last_day)) ? (days + 5) : ''}
                onContextMenu={e => this.handleClick(e, (((days) < this.state.last_day)) ? (days + 5) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
                style={{backgroundColor:this.setBackgroundColor((days < this.state.last_day) ? (days + 5) : ''), color:this.getCellColor((days < this.state.last_day) ? (days + 5) : '')}}
              >
                {this.getScheduleInfo(((days + 5) > this.state.last_day) ? '' : days + 5)}
              </div>
            </div>
            <div
              className={'date-cell'}
              style={{color:this.setFontcolor(((((days) < this.state.last_day)) ? (days + 6) : ''), 5)}}
              onClick={this.selectDay.bind(this, (((days + 5) < this.state.last_day)) ? (days + 6) : '')}
            >
              <div
                className={'date-number '+(year+'-'+month+'-'+(days + 6))}
                day={(((days) < this.state.last_day)) ? (days + 6) : ''}
                onContextMenu={e => this.handleClick(e, (days < this.state.last_day) ? (days + 6) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
              >{((days + 6) > this.state.last_day) ? '' : days + 6}</div>
              <div
                className={'treat-info'}
                day={(((days) < this.state.last_day)) ? (days + 6) : ''}
                onContextMenu={e => this.handleClick(e, (days < this.state.last_day) ? (days + 6) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
                style={{backgroundColor:this.setBackgroundColor((days < this.state.last_day) ? (days + 6) : ''), color:this.getCellColor((days < this.state.last_day) ? (days + 6) : '')}}
              >
                {this.getScheduleInfo(((days + 6) > this.state.last_day) ? '' : days + 6)}
              </div>
            </div>
            <div
              className={'date-cell'}
              style={{color:this.setFontcolor(((days < this.state.last_day) ? (days + 7) : ''), 6)}}
              onClick={this.selectDay.bind(this, ((days + 6) < this.state.last_day) ? (days + 7) : '')}
            >
              <div
                className={'date-number '+(year+'-'+month+'-'+(days + 7))}
                day={(((days) < this.state.last_day)) ? (days + 7) : ''}
                onContextMenu={e => this.handleClick(e, (days < this.state.last_day) ? (days + 7) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
              >{((days + 7) > this.state.last_day) ? '' : days + 7}</div>
              <div
                className={'treat-info'}
                day={(((days) < this.state.last_day)) ? (days + 7) : ''}
                onContextMenu={e => this.handleClick(e, (days < this.state.last_day) ? (days + 7) : '')}
                onMouseOver={e => this.handleHover(e)}
                onMouseOut={e => {this.closeHoverMenu(e)}}
                style={{backgroundColor:this.setBackgroundColor((days < this.state.last_day) ? (days + 7) : ''), color:this.getCellColor((days < this.state.last_day) ? (days + 7) : '')}}
              >
                {this.getScheduleInfo(((days + 7) > this.state.last_day) ? '' : days + 7)}
              </div>
            </div>
          </div>
        </>
      );
      days += 7;
    }

    return (
      <Calendar>
        <div className={'year text-center'}>{year + '年' + (month > 9 ? month : '0'+month) + '月'}</div>
        <div className={'flex div-row'}>
          <div className={'date-cell'} style={{color:"red", height:"20px"}}>日</div>
          <div className={'date-cell'} style={{height:"20px"}}>月</div>
          <div className={'date-cell'} style={{height:"20px"}}>火</div>
          <div className={'date-cell'} style={{height:"20px"}}>水</div>
          <div className={'date-cell'} style={{height:"20px"}}>木</div>
          <div className={'date-cell'} style={{height:"20px"}}>金</div>
          <div className={'date-cell'} style={{color:"blue",height:"20px"}}>土</div>
        </div>
        <div className={'flex div-row'}>{first_week}</div>
        {calendar_body}
        <ContextMenu
          {...this.state.contextMenu}
          parent={this}
          schedule_date={this.state.schedule_date}
        />
        <HoverMenu
          {...this.state.hoverMenu}
          cur_schedule_data={this.state.cur_schedule_data}
        />
      </Calendar>
    );
  }
}

MonthCalendar.propTypes = {
  selectDay: PropTypes.func,
  changeSchedule: PropTypes.func,
  year: PropTypes.number,
  month: PropTypes.number,
  holidays: PropTypes.array,
  schedule_color_info: PropTypes.array,
  schedule_data: PropTypes.array,
  time_limit_from: PropTypes.string,
  time_limit_to: PropTypes.string,
};

export default MonthCalendar;
