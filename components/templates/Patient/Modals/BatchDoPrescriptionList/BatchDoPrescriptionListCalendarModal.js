import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import Context from "~/helpers/configureStore";
import Button from "~/components/atoms/Button";
// import ja from "date-fns/locale/ja";
// import { registerLocale } from "react-datepicker";
// registerLocale("ja", ja);
// import Radiobox from "~/components/molecules/Radiobox";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel"
// import Checkbox from "~/components/molecules/Checkbox";
// import KarteCalendar from "~/components/templates/Patient/SOAP/components/KarteCalendar";
import BatchMonthCalendar from "./BatchMonthCalendar";
import * as localApi from "~/helpers/cacheLocal-utils";
import {CACHE_LOCALNAMES} from "~/helpers/constants";
import {formatDateLine} from "~/helpers/date";
import axios from "axios/index";
// import InputBoxTag from "~/components/molecules/InputBoxTag";
import Radiobox from "~/components/molecules/Radiobox";

const Wrapper = styled.div`
    overflow-y: auto;
    height: 100%;
    padding: 20px;
    .flex {
        display: flex;
    }        
    .flex-header{
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        padding: 0px 10%;
    }   
    .flex-calendar{
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        margin-top: 40px;
    }
    .calendar-area {
        width: 80%;
        display: flex;
    }
    .div-month{
        width: 60px;
        background:#ddd;
        height: 30px;
        text-align: center;
        line-height: 30px;
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        border-left: 1px solid black;        
    }
    .div-month:last-child{
        border-right: 1px solid black;
    }
    .div-month:hover{
        cursor: pointer;
    }
    .block-area {
        border: 1px solid #aaa;
        margin-top: 20px;
        padding: 10px;
        position: relative;
        width: 22rem;
        padding: 2rem;
        label {
          font-size: 14px;
          width: 5rem;
        }
      }
      .block-title {
        position: absolute;
        top: -16px;
        left: 10px;
        font-size: 18px;
        background-color: white;
        padding-left: 5px;
        padding-right: 5px;
      }
      .input-year {
        display:flex;
        div {margin:0;}
        float: left;
        margin-right: 20px;
        margin-top: 20px;
        .label-title {
          width:0;
          margin:0;
        }
        .short-year-input{
          width:3rem!important;          
        }
        .pullbox-select{
            width: 90px;
        }
      }
      .input-month {
        display:flex;
        div {margin:0;}
        margin-top: 20px;
        .label-title {width:0;}
        input {
          width: 3rem;
          // padding-left:0.1rem;
          // padding-right:0.1rem;
        }
        .pullbox-select{
            width: 60px;
        }
      }
      .left-label-height{
        line-height: 2.5rem;
        margin-left: 5px;        
      }
`;


class BatchDoPrescriptionListCalendarModal extends Component {
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
        
        this.standard_year_list = [];

        var current_year = new Date().getFullYear();
        for (let i = 1867 ;i <= current_year; i++){
            this.standard_year_list.push({id: i, value: i});
        }

        this.state = {
            middle_year,
            middle_month,
            left_year,
            left_month,
            right_year,
            right_month,
            all_karte_date,
            month_count: 3,  
            sel_year: 0,
            sel_month: 0,
            sel_day: 0          
        }
        this.month_label_array = [
            { id:7, label:"7月"},
            { id:8, label:"8月"},
            { id:9, label:"9月"},
            { id:10, label:"10月"},
            { id:11, label:"11月"},
            { id:12, label:"12月"},
            { id:1, label:"1月"},
            { id:2, label:"2月"},
            { id:3, label:"3月"},
            { id:4, label:"4月"},
            { id:5, label:"5月"},
            { id:6, label:"6月"},
        ];        
        this.month_array = [
            { id:1, value:"1"},
            { id:2, value:"2"},
            { id:3, value:"3"},
            { id:4, value:"4"},
            { id:5, value:"5"},
            { id:6, value:"6"},
            { id:7, value:"7"},
            { id:8, value:"8"},
            { id:9, value:"9"},
            { id:10, value:"10"},
            { id:11, value:"11"},
            { id:12, value:"12"},
        ];
    }

    async componentDidMount() {
        await this.getHolidays();
    }

    async getHolidays(){
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
            await axios.post(path, {params: post_data}).then((res)=>{
                let holidays = {};
                holidays[cache_name] = Object.keys(res.data);
                localApi.setObject(CACHE_LOCALNAMES.KARTE_HOLIDAYS, holidays);
                this.setState({holidays:holidays[cache_name]});
            })
        }
    }  

    selectMonth = (type, mid_montth = null)=>{
        let middle_month = this.state.middle_month;
        let middle_year = this.state.middle_year;

        if(mid_montth != null) {
            middle_month = mid_montth;
        } else {
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
        }, ()=>{
            this.getHolidays();
        });
    }

    onSelectMonth = (month) => {
        this.setState({
            middle_month: month
        },()=>{
            this.selectMonth("", month);
        });
    }

    getSelectYear = (e) => {        
        this.setState({            
            middle_year: e.target.value
        },()=>{
            this.selectMonth("", this.state.middle_month);
        });
    }

    getSelectMonth = (e) => {        
        let val = e.target.value;
        this.setState({            
            middle_month: val
        },()=>{
            this.selectMonth("", val);
        });
    }

    getInspectionRequest = (e) => {
        this.setState({month_count:parseInt(e.target.value)});
    };

    getselectedtDate = (_year, _month, _day) => {
        this.setState({
            sel_year: _year,
            sel_month: _month,
            sel_day: _day
        });
    }

    handleConfirm = () => {
        if (this.state.sel_year == 0 || this.state.sel_month == 0 || this.state.sel_day == 0) {
            return;
        }
        let str_month = this.state.sel_month < 10 ? "0"+this.state.sel_month: this.state.sel_month;
        let str_day = this.state.sel_day < 10 ? "0"+this.state.sel_day: this.state.sel_day;

        this.props.handleConfirmDate(this.state.sel_year + "-" + str_month + "-" + str_day);
    }

    render() {
        return (
            <>
                <Modal
                    show={true}
                    className="custom-modal-sm batch-do-prescription-modal first-view-modal"
                >
                    <Modal.Header><Modal.Title>カレンダー画面</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <Wrapper>
                            <div className="flex-header">                                
                                <div className="div-left">
                                    <div className={'input-year'}>
                                        <SelectorWithLabel
                                            options={this.standard_year_list}
                                            title=""
                                            getSelect={this.getSelectYear.bind(this)}
                                            departmentEditCode={this.state.middle_year}                                            
                                            id = {'sel-year'}
                                        />
                                        <span className="left-label-height">年</span>
                                    </div>
                                    <div className={'input-month'}>
                                        <SelectorWithLabel
                                        options={this.month_array}
                                        title=""
                                        getSelect={this.getSelectMonth.bind(this)}
                                        departmentEditCode={this.state.middle_month}
                                        id = {'sel-month'}
                                        />
                                        <span className="left-label-height">月</span>
                                    </div>                                    
                                </div>
                                <div className="div-right">
                                    <div className={'block-area'}>
                                        <div className={'block-title'}>月数</div>                                                                    
                                            <Radiobox
                                                label="２ヶ月"
                                                value={2}
                                                getUsage={this.getInspectionRequest.bind(this)}
                                                checked={this.state.month_count == 2 ? true : false}
                                                name={`month_count`}
                                            />
                                            <Radiobox
                                                label="3ヶ月"
                                                value={3}
                                                getUsage={this.getInspectionRequest.bind(this)}
                                                checked={this.state.month_count == 3 ? true : false}
                                                name={`month_count`}
                                            />
                                            <Radiobox
                                                label="6ヶ月"
                                                value={6}
                                                getUsage={this.getInspectionRequest.bind(this)}
                                                checked={this.state.month_count == 6 ? true : false}
                                                name={`month_count`}
                                            />                                                                                  
                                    </div>
                                </div>
                            </div>
                            <div className="flex-calendar">
                                {this.month_label_array.map(item=>{
                                    return(
                                        <>
                                        <div className="div-month" onClick={()=>this.onSelectMonth(item.id)}>
                                            {item.label}
                                        </div>
                                        </>
                                    );
                                })}
                            </div>
                            <div className="flex-calendar">
                                <div className="calendar-area">
                                    <BatchMonthCalendar
                                        selectDay={this.getselectedtDate.bind(this)}
                                        year={this.state.left_year}
                                        month={this.state.left_month}
                                        type={'left'}
                                        selectMonth={this.selectMonth}
                                        holidays={this.state.holidays}
                                        view_karte_date={this.state.view_karte_date}
                                        all_karte_date={this.state.all_karte_date}
                                        now_date_color={true}
                                        last_prescription_date={'2020/08/03'}
                                    />
                                    <BatchMonthCalendar
                                        selectDay={this.getselectedtDate.bind(this)}
                                        year={this.state.middle_year}
                                        month={this.state.middle_month}
                                        type={'middle'}
                                        holidays={this.state.holidays}
                                        view_karte_date={this.state.view_karte_date}
                                        all_karte_date={this.state.all_karte_date}
                                        now_date_color={true}
                                        last_prescription_date={'2020/08/03'}
                                    />
                                    <BatchMonthCalendar
                                        selectDay={this.getselectedtDate.bind(this)}
                                        year={this.state.right_year}
                                        month={this.state.right_month}
                                        type={'right'}
                                        selectMonth={this.selectMonth}
                                        holidays={this.state.holidays}
                                        view_karte_date={this.state.view_karte_date}
                                        all_karte_date={this.state.all_karte_date}
                                        now_date_color={true}
                                        last_prescription_date={'2020/08/03'}
                                    />
                                </div>
                            </div>
                        </Wrapper>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="cancel-btn" onClick={this.props.cancelModal}>閉じる</Button>                                        
                        <Button className="red-btn">本日</Button>
                        <Button className="red-btn" onClick={this.handleConfirm}>確定</Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

BatchDoPrescriptionListCalendarModal.contextType = Context;
BatchDoPrescriptionListCalendarModal.propTypes = {
    cancelModal: PropTypes.func,
    handleConfirmDate: PropTypes.func,
};

export default BatchDoPrescriptionListCalendarModal;
