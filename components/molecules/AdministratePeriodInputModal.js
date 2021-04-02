import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
// import Button from "~/components/atoms/Button";
import Context from "~/helpers/configureStore";
// import SelectorWithLabel from "~/components/molecules/SelectorWithLabel";
// import RadioGroupButton from "~/components/molecules/RadioGroup";
// import InputWithLabel from "~/components/molecules/InputWithLabel";
import * as apiClient from "~/api/apiClient";
import {formatDateLine} from "~/helpers/date";
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
    .date-setting-area{
      display: flex;
      justify-content: space-between;
    }
    .setting-area{
      margin-top: 2rem;
      margin-left: 10rem;
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
      width: 70%;
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

class AdministratePeriodInputModal extends Component {
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
    if(this.state.period_end_date.getTime() < this.state.period_start_date.getTime()){
      this.setState({alert_messages:"投与終了日を投与開始日以降の日付を選択してください。"});
      return;
    }
    let _state = {};
    _state.period_start_date = formatDateLine(this.state.period_start_date);
    _state.period_end_date = formatDateLine(this.state.period_end_date);
    _state.period_type = this.state.period_type;
    _state.period_category = this.state.period_category;

    let result = [];
    this.state.week_days.map(item=>{
      if (item.checked == true) {
        result.push(item.value);
      }
    });
    _state.period_week_days = result;

    // if injection
    // if(this.props.type != "prescription") {

      // get count dates by api
      let path = "/app/api/v2/order/injection/getAdministratePeriod";        
      await apiClient
          ._post(path, {
              params: _state
          })
          .then((res) => {
            if (res && res.length > 0) {
              _state.days = res.length;
            }
          })
          .catch(() => {
              // if (err.response.data) {
                  // error_msg = error_messages;
              // }
              return false;
          });
    // }

    // if done days is one day
    if ( _state.days == undefined || _state.days == null || _state.days < 1) {
      this.setState({alert_messages:"投与期間を正確に設定してください。"});
      return;
    }    
    
    this.props.saveAdministratePeriod(_state);
  }

  closeModal=()=>{
    this.setState({alert_messages:""});
  }

  render() {
    let alert_text_01 = "注射間隔指定：注射開始日から注射終了日の間で指定された間隔でオーダを実行します。";
    if(this.props.type == "prescription") alert_text_01 = "処方間隔指定：処方開始日から処方終了日の間で指定された間隔でオーダを実行します。";
    let alert_text_02 = "曜 日 指 定：注射開始日から注射投与終了日の間で指定された曜日にオーダを実行します。";
    if(this.props.type == "prescription") alert_text_02 = "曜 日 指 定：処方開始日から処方投与終了日の間で指定された曜日にオーダを実行します。";
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal administrate_group_modal first-view-modal">
          <Modal.Header>
            <Modal.Title>投与期間入力</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className="date-setting-area">
                  <div className="left-col" style={{width:"50%"}}>
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
                  <div className="right-col" style={{width:"50%"}}>
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
                        label={this.props.type != "prescription" ? '注射間隔指定' : "処方間隔指定"}
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

AdministratePeriodInputModal.contextType = Context;
AdministratePeriodInputModal.propTypes = {
  closeModal: PropTypes.func,
  saveAdministratePeriod: PropTypes.func,
  administrate_period: PropTypes.object,
  type: PropTypes.string,
};

export default AdministratePeriodInputModal;
