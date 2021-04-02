import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Calendar = styled.div`
    margin: 0.3rem;
    .flex {display: flex;}
    .div-row {
        font-size: 1rem;
        border-bottom: 1px solid #aaa;
        border-right: 1px solid #aaa;
    }
    .year {
        font-size: 1rem;
        border: 1px solid #aaa;
    }
    .selected {
      background-color: #2222ff !important;
      color: white;
    }
    .date-cell {
        width: calc(100%/7);
        border-left: 1px solid #aaa;
        text-align: center;
        cursor:pointer;
    }
`

class ResevationCalendarBody extends Component {
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
      reservation_status_data:props.reservation_status_data,
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
      reservation_status_data:nextProps.reservation_status_data,
    });
  }

  selectDay =(date)=>{
    if(date !== ''){
      this.setState({
        date,
      }, ()=>{
        this.props.selectDay(date);
      })
    }
  }

  getBackColor=(day)=>{
    if(day == ""){
      return;
    }
    let month = this.state.month > 9 ? this.state.month : '0'+this.state.month;
    let day_index = day > 9 ? day : '0'+day;
    let date = this.state.year+"-"+month+"-"+day_index;
    let back_color = "";
    if(this.state.reservation_status_data[date] != undefined){
      let max_persons = 0;
      let reserve_count = 0;
      this.state.reservation_status_data[date].map(item=>{
        max_persons += item.max_persons;
        reserve_count += item.reserve_count;
      });
      if(max_persons == reserve_count){
        back_color = "#808080";
      } else {
        back_color = "#008000";
      }
    }
    return back_color;
  }

  render() {
    const {year, month , date} = this.state;
    let days = 0;
    let first_week = [];
    for (let i = 0; i < 7; i++) {
      if(this.state.cur_week === i){
        first_week.push(
          <div
            className={((days + 1) === date) ? 'date-cell selected' : 'date-cell'}
            onClick={this.selectDay.bind(this, days + 1)}
            style={{backgroundColor:this.getBackColor(days + 1)}}
          >{days + 1}</div>
        );
        days++;
      } else {
        if(days === 0){
          first_week.push(
            <div className={'date-cell'}>&nbsp;</div>
          );
        } else {
          first_week.push(
            <div
              className={((days + 1) === date) ? 'date-cell selected' : 'date-cell'}
              style={{backgroundColor:this.getBackColor(days + 1)}}
              onClick={this.selectDay.bind(this, days + 1)}
            >{days + 1}</div>
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
              className={((days < this.state.last_day) && (days + 1) === date) ? 'date-cell selected' : 'date-cell'}
              onClick={this.selectDay.bind(this, (((days) < this.state.last_day)) ? (days + 1) : '')}
              style={{backgroundColor:this.getBackColor((((days) < this.state.last_day)) ? (days + 1) : '')}}
            >{((days + 1) > this.state.last_day) ? '　' : days + 1}</div>
            <div
              className={(((days + 1) < this.state.last_day) && (days + 2) === date) ? 'date-cell selected' : 'date-cell'}
              onClick={this.selectDay.bind(this, (((days + 1) < this.state.last_day)) ? (days + 2) : '')}
              style={{backgroundColor:this.getBackColor((((days + 1) < this.state.last_day)) ? (days + 2) : '')}}
            >{((days + 2) > this.state.last_day) ? '　' : days + 2}</div>
            <div
              className={(((days + 2) < this.state.last_day) && (days + 3) === date) ? 'date-cell selected' : 'date-cell'}
              onClick={this.selectDay.bind(this, (((days + 2) < this.state.last_day)) ? (days + 3) : '')}
              style={{backgroundColor:this.getBackColor((((days + 2) < this.state.last_day)) ? (days + 3) : '')}}
            >{((days + 3) > this.state.last_day) ? '　' : days + 3}</div>
            <div
              className={(((days + 3) < this.state.last_day) && (days + 4) === date) ? 'date-cell selected' : 'date-cell'}
              onClick={this.selectDay.bind(this, (((days + 3) < this.state.last_day)) ? (days + 4) : '')}
              style={{backgroundColor:this.getBackColor((((days + 3) < this.state.last_day)) ? (days + 4) : '')}}
            >{((days + 4) > this.state.last_day) ? '　' : days + 4}</div>
            <div
              className={(((days + 4) < this.state.last_day) && (days + 5) === date) ? 'date-cell selected' : 'date-cell'}
              onClick={this.selectDay.bind(this, (((days + 4) < this.state.last_day)) ? (days + 5) : '')}
              style={{backgroundColor:this.getBackColor((((days + 4) < this.state.last_day)) ? (days + 5) : '')}}
            >{((days + 5) > this.state.last_day) ? '　' : days + 5}</div>
            <div
              className={(((days + 5) < this.state.last_day) && (days + 6) === date) ? 'date-cell selected' : 'date-cell'}
              onClick={this.selectDay.bind(this, (((days + 5) < this.state.last_day)) ? (days + 6) : '')}
              style={{backgroundColor:this.getBackColor((((days + 5) < this.state.last_day)) ? (days + 6) : '')}}
            >{((days + 6) > this.state.last_day) ? '　' : days + 6}</div>
            <div
              className={(((days + 6) < this.state.last_day) && (days + 7) === date) ? 'date-cell selected mr2' : 'date-cell mr2'}
              onClick={this.selectDay.bind(this, (((days + 6) < this.state.last_day)) ? (days + 7) : '')}
              style={{backgroundColor:this.getBackColor((((days + 6) < this.state.last_day)) ? (days + 7) : '')}}
            >{((days + 7) > this.state.last_day) ? '　' : days + 7}</div>
          </div>
        </>
      );
      days += 7;
    }

    return (
      <Calendar>
        <div className={'text-center year'}>{month + ' 月 ' + year + ' 年'}</div>
        <div className={'flex div-row'}>
          <div className={'date-cell'}>日</div>
          <div className={'date-cell'}>月</div>
          <div className={'date-cell'}>火</div>
          <div className={'date-cell'}>水</div>
          <div className={'date-cell'}>木</div>
          <div className={'date-cell'}>金</div>
          <div className={'date-cell mr2'}>土</div>
        </div>
        <div className={'flex div-row'}>{first_week}</div>
        {calendar_body}
      </Calendar>
    );
  }
}

ResevationCalendarBody.propTypes = {
  selectDay: PropTypes.func,
  year: PropTypes.number,
  month: PropTypes.number,
  date: PropTypes.number,
  reservation_status_data: PropTypes.object,
};

export default ResevationCalendarBody;
