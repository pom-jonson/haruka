import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
// import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import RadioGroupButton from "~/components/molecules/RadioGroup";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import {formatDateLine, formatDateSlash, formatTime, formatTimePicker} from "~/helpers/date";
// import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import Radiobox from "~/components/molecules/Radiobox";
import Checkbox from "~/components/molecules/Checkbox";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
registerLocale("ja", ja);
// import SelectDoctorModal from "~/components/templates/Patient/components/SelectDoctorModal";
// import MonthCalendar from "./MonthCalendar";
// import axios from "axios/index";
// import SystemAlertModal from "~/components/molecules/SystemAlertModal";
// import GroupScheduleRegisterConfirmModal from "./GroupScheduleRegisterConfirmModal";
// import SystemConfirmJapanModal from "~/components/molecules/SystemConfirmJapanModal";
// import Spinner from "react-bootstrap/Spinner";
// import * as sessApi from "~/helpers/cacheSession-utils";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import {setDateColorClassName} from "~/helpers/dialConstants";
import {DatePickerBox} from "~/components/styles/DatePickerBox";
import Button from "~/components/atoms/Button";

const Wrapper = styled.div`  
    width: 100%;
    height: 100%;
    font-size: 1rem;
    overflow-y:auto;
    display: flex;
    .block-left{
      width: 30%;
    }
    .block-right{
      width: 70%;
    }
    .usage-select-area{
      .pullbox-title{
        width: 5rem;
        font-size: 1rem;
        line-height: 2rem;
      }
      .pullbox-select{
        width: 5rem;
        font-size: 1rem;
        height: 2rem;
      }
    }
    .count-time{
      margin-bottom: 0.2rem;
      .count-label{
        width: 5rem;
        font-size: 1rem;
        line-height: 2rem;
      }
      label{
        font-size: 1rem;
      }
      input{
        width: 5rem;
        // height: 2rem;
      }
      .react-datepicker-wrapper{
        input{
          width: 5rem;
          height: 2rem;
        }
      }
    }
    .date-setting-area{
      display: flex;
      justify-content: space-between;
    }
    .setting-area{
      margin-top: 2rem;
      // margin-left: 10rem;
      label{
        font-size: 1rem;
      }
      .alert-label{
        font-size: 1rem;
      }
    }
    .flex{
        display: flex;
    }
    .period-date-cls{
      width: 100%;      
      text-align: center;
      margin: 0px auto;     
    }
    .react-datepicker{
      width: 100% !important;
    }
    .calendar-area{
      width: 100%;
      margin: 0px auto;
    }
    .select-time-zone{
      margin-top: 1rem;      
    }    
    .block-area{
      width: 50rem;
      padding: 1rem;
      border: 1px solid #aaa;
      display: flex;
      justify-content: space-between;
    }
    .week-area{
      width: 20rem;
      padding: 1rem;
      border: 1px solid #aaa;
      display: flex;
      justify-content: space-between;
    }
`;

class AdministratePeriodInputInjectionModal extends Component {
  constructor(props) {
    super(props);
    
    let week_days = [
      {name:"日", value: 0, checked: false},
      {name:"月", value: 1, checked: false},
      {name:"火", value: 2, checked: false},
      {name:"水", value: 3, checked: false},
      {name:"木", value: 4, checked: false},
      {name:"金", value: 5, checked: false},
      {name:"土", value: 6, checked: false},
    ];

    let count_master = [
      {id:0,value:""},
      {id:1,value:"1"},
      {id:2,value:"2"},
      {id:3,value:"3"},
      {id:4,value:"4"},
      {id:5,value:"5"},
      {id:6,value:"6"},
      {id:7,value:"7"},
      {id:8,value:"8"},
      {id:9,value:"9"},
    ];

    let count_times = [
      {id:0,value:""},
      {id:1,value:""},
      {id:2,value:""},
      {id:3,value:""},
      {id:4,value:""},
      {id:5,value:""},
      {id:6,value:""},
      {id:7,value:""},
      {id:8,value:""}      
    ];

    let current_count = 0;    
    let start_count = 0;    
    let end_count = 0;    
    this.period_start_date = new Date();
    let period_end_date = new Date();
    period_end_date.setDate(period_end_date.getDate() + 1);
    let period_type = 0;
    let period_category = 0;
    if(props.administrate_period != undefined && props.administrate_period != null){
      this.period_start_date = new Date(props.administrate_period.period_start_date);
      period_end_date = new Date(props.administrate_period.period_end_date);
      period_type = props.administrate_period.period_type;
      period_category = props.administrate_period.period_category;
      current_count = props.administrate_period.done_count && props.administrate_period.done_count != "" && props.administrate_period.done_count != 0 ? props.administrate_period.done_count : current_count;
      start_count = props.administrate_period.start_count && props.administrate_period.start_count != "" && props.administrate_period.done_count != 0 ? props.administrate_period.start_count - 1 : start_count;
      if (props.administrate_period.end_count == undefined) {
        end_count = current_count - 1;
      } else {
        end_count = props.administrate_period.end_count && props.administrate_period.end_count != "" && props.administrate_period.done_count != 0 ? props.administrate_period.end_count - 1 : end_count;      
      }
      if(props.administrate_period.done_times && props.administrate_period.done_times.length > 0) {
        props.administrate_period.done_times.map((item, index)=>{
          count_times[index].value = formatTimePicker(item);
        });
      }
      if(props.administrate_period.period_week_days != undefined && props.administrate_period.period_week_days != null && props.administrate_period.period_week_days.length > 0){
        props.administrate_period.period_week_days.map(day=>{
          if(week_days.find((x) => x.value == day) != undefined){
            week_days.find((x) => x.value == day).checked = true;
          }
        })
      }
    }    
    
    this.state = {
      period_start_date:this.period_start_date,
      period_end_date,
      week_days,
      period_type,
      period_category,
      alert_messages:"",
      count_master,
      current_count,
      count_times,
      start_count,
      end_count
    };
  }

  async componentDidMount() {
  }

  getPeriodStartDate = (value) => {
    this.setState({
      period_start_date:value,
    })
  }

  getPeriodEndDate = (value) => {
    this.setState({
      period_end_date:value,
    })
  }

  confirmClose = () => {
    this.props.closeModal();
  }

  getCheckbox(name, value, pos) {
    let week_days = this.state.week_days;
    week_days.map(item=>{
      if (pos == item.value) {
        item.checked = !item.checked;
      }
    });
    this.setState({week_days});
  }

  allSelect = () => {

    if (this.state.period_type == 0) return;
    
    let week_days = this.state.week_days;
    week_days.map(item=>{
      item.checked = true;
    });
    this.setState({week_days});
  };

  allDeSelect = () => {

    if (this.state.period_type == 0) return;
    
    let week_days = this.state.week_days;
    week_days.map(item=>{
      item.checked = false;
    });
    this.setState({week_days});
  };

  setPeriodType = (e) => {
    this.setState({period_type:parseInt(e.target.value)});
  };

  setPeriodCategory = (e) => {
    this.setState({period_category:parseInt(e.target.value)});
  };

  confirmOk = async () => {
    if(this.state.period_start_date == null && this.state.period_start_date == ''){
      this.setState({alert_messages:"投与開始日を選択してください。"});
      return;
    }
    if(this.state.period_end_date == null || this.state.period_end_date == ''){
      this.setState({alert_messages:"投与終了日を選択してください。"});
      return;
    }
    if(this.state.period_end_date.getTime() <= this.state.period_start_date.getTime()){
      this.setState({alert_messages:"投与終了日を投与開始日以降の日付を選択してください。"});
      return;
    }
    if(this.state.current_count < 1){
      this.setState({alert_messages:"実施回数を入力してください。"});
      return;
    }

    let same_time_exist = 0;
    same_time_exist = this.getExistTime();
    
    if(same_time_exist == 1){
      this.setState({alert_messages:"同じ実施時間を入力することはできません。"});
      return;
    }
    let _state = {};
    _state.period_start_date = formatDateLine(this.state.period_start_date);
    _state.period_end_date = formatDateLine(this.state.period_end_date);
    _state.period_type = this.state.period_type;
    _state.period_category = this.state.period_category;
    _state.done_count = this.state.current_count;
    _state.start_count = this.state.start_count+1;
    _state.end_count = this.state.end_count+1;
    let done_times = [];
    this.state.count_times.map((item, index)=>{
      if (index < this.state.current_count) {
        done_times.push(formatTime(item.value));
      }
    });
    _state.done_times = done_times;

    let result = [];
    this.state.week_days.map(item=>{
      if (item.checked == true) {
        result.push(item.value);
      }
    });
    _state.period_week_days = result;

    // if injection or treatment
    if(this.props.type != "prescription") {

      // get count dates by api
      let path = "/app/api/v2/order/injection/getAdministratePeriod";        
      await apiClient
          ._post(path, {
              params: _state
          })
          .then((res) => {
            if (res && res.length > 0) {
              _state.days = res.length;
              
              let done_days = [];
              res.map(item=>{
                done_days.push(item);
              });
              _state.done_days = done_days;              

              /*
              let done_times = {};
              // create done_times
              res.map(item=>{
                this.state.count_times.map(ele=>{
                  if (ele.value != "") {                    
                    console.log("ele", ele);
                    console.log("formatTime(ele.value)", formatTime(ele.value));
                    let recd = {
                      order_number: "",
                      done_status: 0,
                      completed_by:"",
                      completed_at:"",
                      stop_by:"",
                      stop_at:""
                    };
                    done_times[item+" "+formatTime(ele.value)+":00"] = recd;
                  }
                });
              });
              */              
            }
          })
          .catch(() => {
              // if (err.response.data) {
                  // error_msg = error_messages;
              // }
              return false;
          });
    }    

    // if done days is one day
    if ( _state.done_days == undefined || _state.done_days.length < 1) {
      this.setState({alert_messages:"投与期間を正確に設定してください。"});
      return;
    }
    if (_state.done_days.length == 1 && this.state.current_count > 1 ) {
      if (this.state.end_count <= this.state.start_count) {
        this.setState({alert_messages:"投与期間内の実施日が一日であるため、終了日の終了タイミングを開始日の開始タイミング以降のタイミングで選択してください。"});
        return;        
      }
    }

    this.props.saveAdministratePeriod(_state);
  }

  closeModal=()=>{
    this.setState({alert_messages:""});
  }

  getCount = (e) => {    
    this.setState({
      current_count: parseInt(e.target.id),
      start_count: 0,
      end_count: parseInt(e.target.id) - 1
    });    
  }

  setCountTime = (key, value) => {    

    let count_times = this.state.count_times;
    count_times[key].value = value;
    this.setState({
      count_times: count_times
    });
  }

  getExistTime = () => {
    
    let result = 0;
    let count_times = this.state.count_times;
    for(var i = 0; i < this.state.current_count-1; i++){
      for(var j = i+1; j < this.state.current_count; j++){        
        if (count_times[i].value != "" && count_times[i].value != null && formatTime(count_times[i].value) == formatTime(count_times[j].value)) {
          result = 1;
        }
      }  
    }

    return result;
  }

  setStartCount = (e) => {
    this.setState({start_count:parseInt(e.target.value)});
  }

  setEndCount = (e) => {
    this.setState({end_count:parseInt(e.target.value)});
  }

  getMinTime = (i) => {
    let result = new Date(formatDateSlash(new Date())+" 00:00:00");
    let count_times = this.state.count_times;
    if (i == 0) return result;
    if (i - 1 == 0 && ((count_times[i-1].value != undefined && count_times[i-1].value != null && count_times[i-1].value == "") || (count_times[i-1].value != undefined && count_times[i-1].value != null && count_times[i-1].value == null))) return new Date(formatDateSlash(new Date())+" 00:05:00");

    let min_time = "";
    for (var loop = i-1; loop >= 0; loop--) {
      if (count_times[loop] && count_times[loop].value != "" && count_times[loop].value != null) {
        min_time = formatTime(count_times[loop].value);
      }
      if (min_time != "") break;
    }

    result = min_time == "" ? result : new Date(formatDateSlash(new Date()) + " " + min_time + ":00"); 
    result.setMinutes(result.getMinutes() + 5);
    let convert_date = new Date(formatDateSlash(new Date()) + " " + result.getHours()+":"+result.getMinutes() + ":00"); 

    return convert_date;
  }

  getMaxTime = (i) => {
    let result = new Date(formatDateSlash(new Date())+" 23:55:00");
    let count_times = this.state.count_times;
    if (i == this.state.current_count - 1) return result;
    if (i + 1 == this.state.current_count - 1 && ((count_times[i+1] != undefined && count_times[i+1] != null && count_times[i+1].value == "") || (count_times[i-1] != undefined && count_times[i-1] != null && count_times[i-1].value == null))) return new Date(formatDateSlash(new Date())+" 23:50:00");

    let max_time = "";
    for (var loop = i+1; loop <= this.state.current_count - 1; loop++) {
      if (count_times[loop] && count_times[loop].value != "" && count_times[loop].value != null) {
        max_time = formatTime(count_times[loop].value);
      }
      if (max_time != "") break;
    }

    result = max_time == "" ? result : new Date(formatDateSlash(new Date()) + " " + max_time + ":00");    
    result.setMinutes(result.getMinutes() - 5);
    let convert_date = new Date(formatDateSlash(new Date()) + " " + result.getHours()+":"+result.getMinutes() + ":00"); 

    return convert_date;
  }

  render() {
    let alert_text_01 = "注射間隔指定：注射開始日から注射終了日の間で指定された間隔でオーダを実行します。";
    if(this.props.type == "prescription") alert_text_01 = "処方間隔指定：処方開始日から処方終了日の間で指定された間隔でオーダを実行します。";
    if(this.props.type == "treatment") alert_text_01 = "処置間隔指定：処置開始日から処置終了日の間で指定された間隔でオーダを実行します。";
    let alert_text_02 = "曜 日 指 定：注射開始日から注射投与終了日の間で指定された曜日にオーダを実行します。";
    if(this.props.type == "prescription") alert_text_02 = "曜 日 指 定：処方開始日から処方投与終了日の間で指定された曜日にオーダを実行します。";
    if(this.props.type == "treatment") alert_text_02 = "曜 日 指 定：処置開始日から処置投与終了日の間で指定された曜日にオーダを実行します。";
    let radio_text = "注射間隔指定";
    if(this.props.type == "prescription") radio_text = "処方間隔指定";
    if(this.props.type == "treatment") alert_text_01 = "処置間隔指定";
    
    let count_items_obj = [];
    let min_time = new Date(formatDateSlash(new Date())+" 00:00:00");
    let max_time = new Date(formatDateSlash(new Date())+" 23:55:00");
    let count_times = this.state.count_times;

    for (var i = 0; i < this.state.current_count; i++) {
      min_time = this.getMinTime(i); 
      min_time = new Date(min_time.getFullYear(), min_time.getMonth() + 1, min_time.getDate(), min_time.getHours(), min_time.getMinutes());
      max_time = this.getMaxTime(i);
      max_time = new Date(max_time.getFullYear(), max_time.getMonth() + 1, max_time.getDate(), max_time.getHours(), max_time.getMinutes());    
      count_items_obj.push(
        <div className="flex count-time">
          <div className="count-label">{i+1}回目</div>          
          <DatePicker
            selected={count_times[i].value}
            onChange={this.setCountTime.bind(this,i)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={5}
            dateFormat="HH:mm"
            timeFormat="HH:mm"
            timeCaption="時間"
            minTime={min_time}
            maxTime={max_time}
            popperPlacement={i > 6 ? "top":"bottom"}
          />                    
          {this.state.current_count > 1 && (
            <>
              <div style={{paddingLeft:"1rem", lineHeight:"2rem",width:"6rem"}}>
                <Radiobox
                  label={this.state.start_count === i ? "から": ""}
                  value={i}
                  getUsage={this.setStartCount.bind(this)}
                  checked={this.state.start_count === i}
                  name={`start_count_type`}
                />
              </div>
              <div style={{paddingLeft:"1rem", lineHeight:"2rem",width:"6rem"}}>
                <Radiobox
                  label={this.state.end_count === i ? "まで" : ""}
                  value={i}
                  getUsage={this.setEndCount.bind(this)}
                  checked={this.state.end_count === i}
                  name={`end_count_type`}
                />
              </div>
            </>
          )}
        </div>
      );
    }

    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal administrate_group_modal first-view-modal">
          <Modal.Header>
            <Modal.Title>投与期間入力</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className="block-left">
                  <div>用法</div>
                  <div className="usage-select-area" style={{ display: "flex" }}>
                    <SelectorWithLabel
                      title="1日＊回"
                      options={this.state.count_master}
                      getSelect={this.getCount}                    
                      departmentEditCode={this.state.current_count}
                    />
                    {this.state.current_count > 1 && (
                      <>
                        <div style={{width:"6rem",lineHeight:"2rem",textAlign:"center"}}>開始日</div>
                        <div style={{width:"6rem",lineHeight:"2rem",textAlign:"center"}}>終了日</div>
                      </>  
                    )}
                  </div>
                  <div>
                    {count_items_obj}
                  </div>                
                </div>
                <div className="block-right">
                  <div className="date-setting-area">
                    <div className="left-col" style={{width:"45%"}}>
                      <div className="period-date-cls">投与開始日</div>
                      <div className='calendar-area'>
                        <DatePicker
                            showPopperArrow={false}
                            locale="ja"
                            selected={this.state.period_start_date}
                            onChange={this.getPeriodStartDate}
                            dateFormat="yyyy/MM/dd"
                            inline
                            minDate={this.period_start_date}
                            dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                    </div>
                    <div className="right-col" style={{width:"45%"}}>
                      <div className="period-date-cls">投与終了日</div>
                      <div className='calendar-area'>
                        <DatePicker
                            showPopperArrow={false}
                            locale="ja"
                            selected={this.state.period_end_date}
                            onChange={this.getPeriodEndDate}
                            dateFormat="yyyy/MM/dd"
                            inline
                            minDate={this.state.period_start_date}
                            dayClassName = {date => setDateColorClassName(date)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="setting-area">
                    <div className="alert-label">{alert_text_01}</div>                
                    <div className="alert-label">{alert_text_02}</div>
                    <div className={'select-time-zone flex'}>
                      <div style={{padding:"1rem",width:"12rem"}}>
                        <Radiobox
                          label={radio_text}
                          value={0}
                          getUsage={this.setPeriodType.bind(this)}
                          checked={this.state.period_type === 0}
                          name={`period_type`}
                        />
                      </div>
                      <div className="week-area">
                        <Radiobox
                          label={'日'}
                          value={0}
                          getUsage={this.setPeriodCategory.bind(this)}
                          checked={this.state.period_category === 0}
                          isDisabled={this.state.period_type !== 0}
                          name={`period_category`}
                        />
                        <Radiobox
                          label={'週'}
                          value={1}
                          getUsage={this.setPeriodCategory.bind(this)}
                          checked={this.state.period_category === 1}
                          isDisabled={this.state.period_type !== 0}
                          name={`period_category`}
                        />
                        <Radiobox
                          label={'月'}
                          value={2}
                          getUsage={this.setPeriodCategory.bind(this)}
                          checked={this.state.period_category === 2}
                          isDisabled={this.state.period_type !== 0}
                          name={`period_category`}
                        />
                      </div>
                    </div>
                    <div className={'select-time-zone flex'}>
                      <div style={{padding:"1rem",width:"12rem"}}>
                        <Radiobox
                          label={'曜 日 指 定'}
                          value={1}
                          getUsage={this.setPeriodType.bind(this)}
                          checked={this.state.period_type === 1}
                          name={`period_type`}
                        />
                      </div>
                      <div className={'block-area'}>
                        <>
                          {this.state.week_days.map((item, index)=>{
                            return (
                              <>
                                <Checkbox
                                  label={item.name}
                                  getRadio={this.getCheckbox.bind(this, index)}
                                  number={index}
                                  value={item.checked}
                                  name={`select_weekdays`}
                                  isDisabled={this.state.period_type !== 1}
                                />
                              </>
                            );
                          })}
                        </>
                        <div>
                          <Button type="common" onClick={this.allSelect} style={{marginRight:"0.2rem"}}>全選択</Button>
                          <Button type="common" onClick={this.allDeSelect}>全解除</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <div
              onClick={this.confirmClose}
              className={"custom-modal-btn cancel-btn"}
              style={{cursor:"pointer"}}
              id='cancel_btn'
            >
              <span>キャンセル</span>
            </div>
            <div
              onClick={this.confirmOk}
              className={"custom-modal-btn red-btn"}
              style={{cursor:"pointer"}}
            >
              <span>確定</span>
            </div>
          </Modal.Footer>
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {/* {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
            <SystemConfirmJapanModal
              hideConfirm= {this.confirmCancel.bind(this)}
              confirmCancel= {this.confirmCancel.bind(this)}
              confirmOk= {this.confirmOk.bind(this)}
              confirmTitle= {this.state.confirm_message}
            />
          )}
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.doctors != null && this.state.openSelectDoctorModal && (
            <SelectDoctorModal
              closeDoctor={this.closeModal}
              getDoctor={this.getDoctor}
              selectDoctorFromModal={this.selectDoctorFromModal}
              doctors={this.doctors}
            />
          )}
          {this.state.alert_messages !== "" && (
            <SystemAlertModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
            />
          )}
          {this.state.isCloseConfirm && (
            <SystemConfirmJapanModal
              hideConfirm={this.confirmCancel.bind(this)}
              confirmCancel={this.confirmCancel.bind(this)}
              confirmOk={this.props.closeModal}
              confirmTitle={this.state.confirm_message}
            />
          )} */}
        </Modal>
      </>
    );
  }
}

AdministratePeriodInputInjectionModal.contextType = Context;
AdministratePeriodInputInjectionModal.propTypes = {
  closeModal: PropTypes.func,
  saveAdministratePeriod: PropTypes.func,
  administrate_period: PropTypes.object,
  type: PropTypes.string,
};

export default AdministratePeriodInputInjectionModal;
