import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Context from "~/helpers/configureStore";

const Calendar = styled.div`
    margin: 5px;
    height: 100%;
    width: 100%;
    .flex {
        display: flex;
    }
    .div-row {
        font-size: 1.2rem;
        margin-right: 2%;
        height:13%;
        margin-bottom:1%;
    }
    .selected {
        // background-color: #2222ff;
        background-color: rgb(125, 125, 255);
        color: white;
        // border:1px solid;
        cursor:pointer;
    }
    .date-cell {
        width: 13%;
        margin-right:1%;
        text-align: center;
        // cursor:pointer;
        height: 100%;
        
    }
    .cell-body {
        text-align: left;
        padding-left: 0.1rem;
        font-size: 1rem;
        height: calc(100% - 30px);
        overflow-y: auto;
    }
    .month-color {
        background-color: #F2F2F2;
        cursor:pointer;
    }
    .other-month-color {
      background-color: #fbfafa;
      cursor:pointer;
      .calendar-day{
        color:lightgray!important;
      }
    }
    .selected-number {
      background-color:#f7a081;
      color:white;
    }
    .summary-row:hover {
        background-color: rgb(246, 252, 253);
        cursor: pointer;
        color: blue !important;
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
                         is_register,
                         is_edit,
                         is_delete,
                         parent,
                         schedule_date,
                         cur_summary,
                     }) => {
    if (visible && (is_register || is_edit || is_delete)) {
        return (
            <ContextMenuUl>
                <ul className="context-menu" style={{ left: `${x}px`, top: `${y}px` }}>
                    {is_register && (
                        <>
                            <li><div onClick={() =>parent.contextMenuAction("add_schedule", schedule_date, null)}>この日にスケジュールを追加</div></li>
                        </>
                    )}
                    {cur_summary != null && (
                        <>
                            {is_edit && (
                                <li><div onClick={() =>parent.contextMenuAction("edit_schedule", schedule_date, cur_summary)}>編集</div></li>
                            )}
                            {is_delete && (
                                <li><div onClick={() =>parent.contextMenuAction("delete_schedule", schedule_date, cur_summary)}>削除</div></li>
                            )}
                        </>
                    )}
                </ul>
            </ContextMenuUl>
        );
    } else {
        return null;
    }
};


class MyMonthCalendar extends Component {
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
            date:props.date,
            selected_month:props.selected_month,
            holidays:props.holidays,
            schedule_data:props.schedule_data,
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
            date:nextProps.date,
            selected_month:nextProps.selected_month,
            holidays:nextProps.holidays,
            schedule_data:nextProps.schedule_data,
        });
    }

    selectDay =(date, month_type=null)=>{
      let selected_month = this.state.selected_month;
      if(month_type==="prev"){
        selected_month = "prev";
      } else {
        if(date > this.state.last_day){
          date = date - this.state.last_day;
          selected_month = "next";
        }
      }
      this.setState({
          date,
          selected_month,
      }, ()=>{
          this.props.selectDay(date, selected_month);
      })
    };

    setBackgroundColor = (day) => {
        if(day === ''){
            return '';
        }
        let month_last_date = new Date(this.state.year, this.state.month, 0);
        if(month_last_date.getDate() < day){
            return '';
        }
            return '#808080';
    };

    getCellColor = (day) => {
        if(day === ''){
            return '';
        }
        let month_last_date = new Date(this.state.year, this.state.month, 0);
        if(month_last_date.getDate() < day){
            return '';
        }
            return '';
    };

    setFontcolor = (day, day_of_week, month_type=null) => {
      let cur_year = this.state.year;
      let cur_month = this.state.month;
      if(month_type === "prev"){
        cur_month--;
        if(cur_month == 0){
          cur_month = 12;
          cur_year--;
        }
      } else {
        if(day > this.state.last_day){
          if(day > this.state.last_day){
            day = day - this.state.last_day;
            cur_month++;
            if(cur_month == 13){
              cur_month = 1;
              cur_year++;
            }
          }
        }
      }

        let holidays = this.state.holidays;
        let date = cur_year+ '-' + (cur_month > 9 ? cur_month : '0'+cur_month) + '-' + (day > 9 ? day : '0' + day);
        if (holidays != null && holidays.length > 0 && holidays.includes(date)){
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
    };

    handleClick=(e, day, cur_summary, month_type=null)=>{
        if(day == null){
            day = e.target.getAttribute("day");
        }
        let cur_year = this.state.year;
        let cur_month = this.state.month;
        if(month_type === "prev"){
          cur_month--;
          if(cur_month == 0){
            cur_month = 12;
            cur_year--;
          }
        } else {
          if(day > this.state.last_day){
            day = day - this.state.last_day;
            cur_month++;
            if(cur_month == 13){
              cur_month = 1;
              cur_year++;
            }
          }
        }
        // let day = e.target.getAttribute("day");
        let schedule_date = cur_year+'-'+(cur_month > 9 ? cur_month : "0"+cur_month)+ '-' + (day > 9 ? day : "0"+day);
        // if (e.type === "contextmenu") {
            e.preventDefault();
            // eslint-disable-next-line consistent-this
            const that = this;
            document.addEventListener(`click`, function onClickOutside() {
                that.setState({contextMenu: { visible: false }});
                document.removeEventListener(`click`, onClickOutside);
            });
            window.addEventListener("scroll", function onScrollOutside() {
                that.setState({contextMenu: { visible: false },});
                window.removeEventListener(`scroll`, onScrollOutside);
            });
            let is_register = this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.REGISTER, 0);
            let is_edit = this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.EDIT, 0);
            let is_delete = this.context.$canDoAction(this.context.FEATURES.MyCalendar, this.context.AUTHS.DELETE, 0);
            let cur_page = "";
            let path = window.location.href.split("/");
            path.map(word=>{
              if(word === "system_setting"){
                cur_page = word;
              }
            });
            this.setState({
                contextMenu: {
                    visible: true,
                    x: e.clientX-(cur_page === "system_setting" ? 0 : 200),
                    y: e.clientY + window.pageYOffset-(cur_page === "system_setting" ? 0 : 170),
                    is_register,
                    is_edit,
                    is_delete,
                },
                schedule_date,
                cur_summary,
            });
        // }
    };

    contextMenuAction = (type, schedule_date, cur_summary) => {
        this.props.manageSchedule(type, schedule_date, cur_summary);
    };

    getSummary=(day, month_type=null)=>{
      let cur_year = this.state.year;
      let cur_month = this.state.month;
      let cur_day = day;
      if(month_type === "prev"){
        cur_month--;
        if(cur_month == 0){
          cur_month = 12;
          cur_year--;
        }
      } else {
        if(cur_day > this.state.last_day){
          cur_day = cur_day - this.state.last_day;
          cur_month++;
          if(cur_month == 13){
            cur_month = 1;
            cur_year++;
          }
        }
      }
      let summary_html = [];
      cur_month = cur_month > 9 ? cur_month : '0'+cur_month;
      cur_day = cur_day > 9 ? cur_day : '0'+cur_day;
      if(this.state.schedule_data[cur_year+'-'+cur_month+'-'+cur_day] != null){
        let summary_data = this.state.schedule_data[cur_year+'-'+cur_month+'-'+cur_day];
        summary_data.map(summary=>{
          summary_html.push(
            <div
                style={{color:summary.summary_color != null ? summary.summary_color : ""}}
                className={"summary-row"}
                onContextMenu={e => this.handleClick(e, day, summary, month_type)}
                onDoubleClick={e => this.handleClick(e, day, summary, month_type)}
            >
              {summary.classfic == 1 ? ("[他] "+
                ((summary.summary != null && summary.summary.length > 3) ? summary.summary.substring(0,3) + '…' : summary.summary)
              ) : (
                (summary.summary != null && summary.summary.length > 6) ? summary.summary.substring(0,6) + '…' : summary.summary
              )}
            </div>
          )
        });
        summary_html.push(
            <div
                style={{height:"calc(100% - "+summary_data.length *25+"px)"}}
                onContextMenu={e => this.handleClick(e, day, null, month_type)}
                onDoubleClick={e => this.handleClick(e, day, null, month_type)}
            > </div>
        )
      } else {
        summary_html.push(
            <div
                style={{height:"100%"}}
                onContextMenu={e => this.handleClick(e, day, null,month_type)}
                onDoubleClick={e => this.handleClick(e, day, null,month_type)}
            > </div>
        )
      }
      return summary_html;
    };

    render() {
        let {date, last_day} = this.state;
        let days = 0;
        let first_week = [];
        let last_year = this.state.year;
        let last_month = this.state.month - 1;
        if(last_month == 0){
          last_month = 12;
          last_year--;
        }
        let last_month_last_day = new Date(last_year, last_month, 0).getDate();
        for (let i = 0; i < 7; i++) {
            if(this.state.cur_week === i){
                first_week.push(
                    <div
                        className={'date-cell '+(((days + 1) === date) ? 'selected' : 'month-color')}
                        onClick={this.selectDay.bind(this, days + 1)}
                    >
                        <div
                            style={{color:this.setFontcolor((days + 1), i)}}
                            day={days + 1}
                            onContextMenu={e => this.handleClick(e, null, null)}
                            onDoubleClick={e => this.handleClick(e, null, null)}
                            className={'calendar-day'}
                        >{days + 1}</div>
                        <div className={'cell-body'}>{this.getSummary(days + 1)}</div>
                    </div>
                );
                days++;
            } else {
                if(days === 0){
                    first_week.push(
                      <div
                        className={'date-cell other-month-color'}
                        onClick={this.selectDay.bind(this, ((last_month_last_day - this.state.cur_week + 1) + i), "prev")}
                      >
                        <div
                          style={{color:this.setFontcolor(((last_month_last_day - this.state.cur_week + 1) + i), i, "prev")}}
                          onContextMenu={e => this.handleClick(e, null, null, "prev")}
                          onDoubleClick={e => this.handleClick(e, null, null, "prev")}
                          day={(last_month_last_day - this.state.cur_week + 1) + i}
                          className={'calendar-day'}
                        >{(last_month_last_day - this.state.cur_week + 1) + i}</div>
                        <div className={'cell-body'}>{this.getSummary(((last_month_last_day - this.state.cur_week + 1) + i), "prev")}</div>
                      </div>
                    );
                } else {
                    first_week.push(
                        <div
                            className={'date-cell '+(((days + 1) === date) ? 'selected' : 'month-color')}
                            onClick={this.selectDay.bind(this, days + 1)}
                        >
                            <div
                                style={{color:this.setFontcolor((days + 1), i)}}
                                onDoubleClick={e => this.handleClick(e, null, null)}
                                day={days + 1}
                                onContextMenu={e => this.handleClick(e, null, null)}
                                className={'calendar-day'}
                            >{days + 1}</div>
                            <div className={'cell-body'}>{this.getSummary(days + 1)}</div>
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
                            className={'date-cell ' + ((days < last_day) && ((days + 1) === date) ? 'selected' : (days < last_day ? 'month-color' : 'other-month-color'))}
                            onClick={this.selectDay.bind(this, (days + 1))}
                        >
                            <div
                                style={{color:'red'}}
                                day={days + 1}
                                onContextMenu={e => this.handleClick(e, null, null)}
                                onDoubleClick={e => this.handleClick(e, null, null)}
                                className={'calendar-day'}
                            >
                                {((days + 1) > last_day) ? ((days + 1) - last_day) : days + 1}
                            </div>
                            <div className={'cell-body'}>{this.getSummary(days + 1)}</div>
                        </div>
                        <div
                            className={'date-cell '+(((days + 1) < last_day) && ((days + 2) === date) ? 'selected' : ((days + 1) < last_day ? 'month-color' : 'other-month-color'))}
                            onClick={this.selectDay.bind(this, (days + 2))}
                        >
                            <div
                                style={{color:this.setFontcolor((days + 2), 1)}}
                                day={days + 2}
                                onContextMenu={e => this.handleClick(e, null, null)}
                                onDoubleClick={e => this.handleClick(e, null, null)}
                                className={'calendar-day'}
                            >{((days + 2) > last_day) ? ((days + 2) - last_day) : days + 2}</div>
                            <div className={'cell-body'}>{this.getSummary(days + 2)}</div>
                        </div>
                        <div
                            className={'date-cell '+((((days + 2) < last_day) && (days + 3) === date) ? 'selected' : ((days + 2) < last_day ? 'month-color' : 'other-month-color'))}
                            onClick={this.selectDay.bind(this, (days + 3))}
                        >
                            <div
                                style={{color:this.setFontcolor((days + 3), 2)}}
                                day={days + 3}
                                onContextMenu={e => this.handleClick(e, null, null)}
                                onDoubleClick={e => this.handleClick(e, null, null)}
                                className={'calendar-day'}
                            >{((days + 3) > last_day) ? ((days + 3) - last_day) : days + 3}</div>
                            <div className={'cell-body'}>{this.getSummary(days + 3)}</div>
                        </div>
                        <div
                            className={'date-cell '+((((days + 3) < last_day) && (days + 4) === date) ? 'selected' : ((days + 3) < last_day ? 'month-color' : 'other-month-color'))}
                            onClick={this.selectDay.bind(this, (days + 4))}
                        >
                            <div
                                style={{color:this.setFontcolor((days + 4), 3)}}
                                day={days + 4}
                                onContextMenu={e => this.handleClick(e, null, null)}
                                onDoubleClick={e => this.handleClick(e, null, null)}
                                className={'calendar-day'}
                            >{((days + 4) > last_day) ? ((days + 4) - last_day) : days + 4}</div>
                            <div className={'cell-body'}>{this.getSummary(days + 4)}</div>
                        </div>
                        <div
                            className={'date-cell '+((((days + 4) < last_day) && (days + 5) === date) ? 'selected' : ((days + 4) < last_day ? 'month-color' : 'other-month-color'))}
                            onClick={this.selectDay.bind(this, (days + 5))}
                        >
                            <div
                                style={{color:this.setFontcolor((days + 5), 4)}}
                                day={days + 5}
                                onContextMenu={e => this.handleClick(e, null, null)}
                                onDoubleClick={e => this.handleClick(e, null, null)}
                                className={'calendar-day'}
                            >{((days + 5) > last_day) ? ((days + 5) - last_day) : days + 5}</div>
                            <div className={'cell-body'}>{this.getSummary(days + 5)}</div>
                        </div>
                        <div
                            className={'date-cell '+((((days + 5) < last_day) && (days + 6) === date) ? 'selected' : ((days + 5) < last_day ? 'month-color' : 'other-month-color'))}
                            onClick={this.selectDay.bind(this, (days + 6))}
                        >
                            <div
                                style={{color:this.setFontcolor((days + 6), 5)}}
                                day={days + 6}
                                onContextMenu={e => this.handleClick(e, null, null)}
                                onDoubleClick={e => this.handleClick(e, null, null)}
                                className={'calendar-day'}
                            >{((days + 6) > last_day) ? ((days + 6) - last_day) : days + 6}</div>
                            <div className={'cell-body'}>{this.getSummary(days + 6)}</div>
                        </div>
                        <div
                            className={'date-cell mr2 '+((((days + 6) < last_day) && (days + 7) === date) ? 'selected' : ((days + 6) < last_day ? 'month-color' : 'other-month-color'))}
                            onClick={this.selectDay.bind(this, (days + 7))}
                        >
                            <div
                                style={{color:this.setFontcolor((days + 7), 6)}}
                                day={days + 7}
                                onContextMenu={e => this.handleClick(e, null, null)}
                                onDoubleClick={e => this.handleClick(e, null, null)}
                                className={'calendar-day'}
                            >{((days + 7) > last_day) ? ((days + 7) - last_day) : days + 7}</div>
                            <div className={'cell-body'}>{this.getSummary(days + 7)}</div>
                        </div>
                    </div>
                </>
            );
            days += 7;
        }

        return (
            <Calendar>
                <div className={'flex div-row'} style={{height:"5%"}}>
                    <div className={'date-cell'} style={{color:"red"}}>日</div>
                    <div className={'date-cell'}>月</div>
                    <div className={'date-cell'}>火</div>
                    <div className={'date-cell'}>水</div>
                    <div className={'date-cell'}>木</div>
                    <div className={'date-cell'}>金</div>
                    <div className={'date-cell mr2'} style={{color:"blue"}}>土</div>
                </div>
                <div className={'flex div-row'}>{first_week}</div>
                {calendar_body}
                <ContextMenu
                    {...this.state.contextMenu}
                    parent={this}
                    schedule_date={this.state.schedule_date}
                    cur_summary={this.state.cur_summary}
                />
            </Calendar>
        );
    }
}

MyMonthCalendar.contextType = Context;
MyMonthCalendar.propTypes = {
    selectDay: PropTypes.func,
    manageSchedule: PropTypes.func,
    year: PropTypes.number,
    month: PropTypes.number,
    date: PropTypes.number,
    selected_month: PropTypes.string,
    holidays: PropTypes.array,
    schedule_data: PropTypes.array,
};

export default MyMonthCalendar;
