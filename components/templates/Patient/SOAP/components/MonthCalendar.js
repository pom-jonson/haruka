import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Calendar = styled.div`
    width: 33%;
    margin: 5px;
    .flex {
        display: flex;
    }
    .div-row {
        font-size: 14px;
        margin-right: 2%;
        height:21px;
    }
    .year {
        font-size: 16px;
        margin-right: 2%;
        display: flex;
        border-bottom: 1px solid #aaa;
        .month {
            width: calc(100% - 40px);
        }
        .move {
            width: 20px;
            height: 25px;
        }
        .move-month {
            background: rgb(160, 235, 255);
            border-left: 1px solid #aaa;
            border-right: 1px solid #aaa;
            border-top: 1px solid #aaa;
            cursor: pointer;
        }
    }
    .date-cell {
        width: 14%;
        text-align: center;
        cursor:pointer;
    }
`

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
        });
    }

    selectDay =(date)=>{
        if(date === ''){
            return;
        }
        this.props.selectDay(this.state.year, this.state.month, date);
    }

    moveMonth=(act)=>{
        this.props.selectMonth(act);
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
            return;
        }
        let calendar_date = this.state.year+ '-' + (this.state.month > 9 ? this.state.month : '0'+this.state.month) + '-' + (day > 9 ? day : '0' + day);
        if(this.props.view_karte_date !== undefined && this.props.view_karte_date != null && Object.keys(this.props.view_karte_date).length > 0){
            if(this.props.view_karte_date[calendar_date] !== undefined){
                return 'rgb(248, 183, 56)';
            }
        }
        if(this.props.view_karte_date !== undefined && this.props.view_karte_date != null && Object.keys(this.props.view_karte_date).length > 0){
            if(this.props.all_karte_date[calendar_date] !== undefined){
                return 'rgb(255, 254, 208)';
            }
        }
        return '';
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
                        style={{color:this.setFontcolor((days + 1), i), backgroundColor:this.setBackgroundColor(days + 1)}}
                    >
                        {days + 1}
                    </div>
                );
                days++;
            } else {
                if(days === 0){
                    first_week.push(
                        <div className={'date-cell'}></div>
                    );
                } else {
                    first_week.push(
                        <div
                            className={'date-cell'}
                            onClick={this.selectDay.bind(this, days + 1)}
                            style={{color:this.setFontcolor((days + 1), i), backgroundColor:this.setBackgroundColor(days + 1)}}
                        >
                            {days + 1}
                        </div>
                    );
                    days++;
                }
            }
        }
        first_week.push(<div style={{width:"2%"}}> </div>);
        let calendar_body = [];
        for (let week = 1; week < 6; week++) {
            calendar_body.push(
                <>
                    <div className={'flex div-row'}>
                        <div
                            className={'date-cell'}
                            style={{color:'red', backgroundColor:this.setBackgroundColor((((days) < this.state.last_day)) ? (days + 1) : '')}}
                            onClick={this.selectDay.bind(this, (((days) < this.state.last_day)) ? (days + 1) : '')}
                        >
                            {((days + 1) > this.state.last_day) ? '' : days + 1}
                        </div>
                        <div
                            className={'date-cell'}
                            style={{color:this.setFontcolor(((((days) < this.state.last_day)) ? (days + 2) : ''), 1), backgroundColor:this.setBackgroundColor((((days) < this.state.last_day)) ? (days + 2) : '')}}
                            onClick={this.selectDay.bind(this, (((days + 1) < this.state.last_day)) ? (days + 2) : '')}
                        >
                            {((days + 2) > this.state.last_day) ? '' : days + 2}
                        </div>
                        <div
                            className={'date-cell'}
                            style={{color:this.setFontcolor(((((days) < this.state.last_day)) ? (days + 3) : ''), 2), backgroundColor:this.setBackgroundColor((((days) < this.state.last_day)) ? (days + 3) : '')}}
                            onClick={this.selectDay.bind(this, (((days + 2) < this.state.last_day)) ? (days + 3) : '')}
                        >
                            {((days + 3) > this.state.last_day) ? '' : days + 3}
                        </div>
                        <div
                            className={'date-cell'}
                            style={{color:this.setFontcolor(((((days) < this.state.last_day)) ? (days + 4) : ''), 3), backgroundColor:this.setBackgroundColor((((days) < this.state.last_day)) ? (days + 4) : '')}}
                            onClick={this.selectDay.bind(this, (((days + 3) < this.state.last_day)) ? (days + 4) : '')}
                        >
                            {((days + 4) > this.state.last_day) ? '' : days + 4}
                        </div>
                        <div
                            className={'date-cell'}
                            style={{color:this.setFontcolor(((((days) < this.state.last_day)) ? (days + 5) : ''), 4), backgroundColor:this.setBackgroundColor((((days) < this.state.last_day)) ? (days + 5) : '')}}
                            onClick={this.selectDay.bind(this, (((days + 4) < this.state.last_day)) ? (days + 5) : '')}
                        >
                            {((days + 5) > this.state.last_day) ? '' : days + 5}
                        </div>
                        <div
                            className={'date-cell'}
                            style={{color:this.setFontcolor(((((days) < this.state.last_day)) ? (days + 6) : ''), 5), backgroundColor:this.setBackgroundColor((((days) < this.state.last_day)) ? (days + 6) : '')}}
                            onClick={this.selectDay.bind(this, (((days + 5) < this.state.last_day)) ? (days + 6) : '')}
                        >
                            {((days + 6) > this.state.last_day) ? '' : days + 6}
                        </div>
                        <div
                            className={'date-cell'}
                            style={{color:this.setFontcolor(((((days) < this.state.last_day)) ? (days + 7) : ''), 6), backgroundColor:this.setBackgroundColor((((days) < this.state.last_day)) ? (days + 7) : '')}}
                            onClick={this.selectDay.bind(this, (((days + 6) < this.state.last_day)) ? (days + 7) : '')}
                        >
                            {((days + 7) > this.state.last_day) ? '' : days + 7}
                        </div>
                        <div style={{width:"2%"}}> </div>
                    </div>
                </>
            );
            days += 7;
        }

        return (
            <Calendar>
                <div className={'year'}>
                    {this.props.type === 'left' ? (
                        <div className={'move-month move'} onClick={this.moveMonth.bind(this, 'prev')}>{'＜'}</div>
                    ):(
                        <div className={'move'}> </div>
                    )}
                    <div className={'text-center month'}>{year + '/' + (month > 9 ? month : '0'+month)}</div>
                    {this.props.type === 'right' ? (
                        <div className={'move-month move'} onClick={this.moveMonth.bind(this, 'next')}>{'＞'}</div>
                    ):(
                        <div className={'move'}> </div>
                    )}
                </div>
                <div className={'flex div-row'} style={{borderBottom:"1px solid #aaa"}}>
                    <div className={'date-cell'} style={{color:"red"}}>日</div>
                    <div className={'date-cell'}>月</div>
                    <div className={'date-cell'}>火</div>
                    <div className={'date-cell'}>水</div>
                    <div className={'date-cell'}>木</div>
                    <div className={'date-cell'}>金</div>
                    <div className={'date-cell'} style={{color:"blue"}}>土</div>
                    <div style={{width:"2%"}}> </div>
                </div>
                <div className={'flex div-row'}>{first_week}</div>
                {calendar_body}
            </Calendar>
        );
    }
}

MonthCalendar.propTypes = {
    selectDay: PropTypes.func,
    selectMonth: PropTypes.func,
    year: PropTypes.number,
    month: PropTypes.number,
    type: PropTypes.string,
    holidays: PropTypes.array,
    view_karte_date: PropTypes.array,
    all_karte_date: PropTypes.array,
};

export default MonthCalendar;
