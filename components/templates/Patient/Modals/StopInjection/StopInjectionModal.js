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
// import * as karteApi from "~/helpers/cacheKarte-utils";
import {
  formatDateLine, 
  // formatDate, 
  // formatTime, 
  // formatTimePicker, 
  formatJapanDateSlash
} from "~/helpers/date";
// import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
// import Radiobox from "~/components/molecules/Radiobox";
// import Checkbox from "~/components/molecules/Checkbox";
import DatePicker, { registerLocale } from "react-datepicker";
// import { registerLocale } from "react-datepicker";
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
import {setDateColorClassName} from '~/helpers/dialConstants';
import {DatePickerBox} from "~/components/styles/DatePickerBox";

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
    .stop-date-label{
      border: 1px solid #ddd;      
      height: 38px;
      line-height: 38px;
      width: 9rem;
      padding-left: 8px;
      border-radius: 4px;
    }
    .usage-select-area{
      .pullbox-title{
        width: 7rem;
        font-size: 1rem;
      }
      .pullbox-select{
        width: 5rem;
        font-size: 1rem;
      }
    }
    .count-time{
      margin-bottom: 0.2rem;
      .count-label{
        width: 5rem;
        font-size: 1rem;
        line-height: 2rem;
      }
      input{
        width: 5rem;
        height: 2rem;
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
      text-align: left;
      margin: 0px auto;     
    }
    .react-datepicker{
      width: 100% !important;
    }
    .calendar-area{
      width: 100%;
      margin: 0px auto;
      margin-top: 10px;
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

class StopInjectionModal extends Component {
  constructor(props) {
    super(props);      
    this.rp_data = null; // rp order info
    this.rp_count = 0; // 実施回数
    this.rp_dates = []; // 期間内の実施日付
    if (this.props.rp_index != undefined && this.props.rp_index != null) {
      this.rp_data = this.props.modal_data.data.order_data.order_data[this.props.rp_index];
      if (this.rp_data != undefined && 
        this.rp_data != null && 
        this.rp_data.administrate_period != undefined && 
        this.rp_data.administrate_period != null && 
        this.rp_data.administrate_period.done_count != undefined && 
        this.rp_data.administrate_period.done_count != null) {

        if (this.rp_data.administrate_period.done_count != undefined && this.rp_data.administrate_period.done_count != null) {
          this.rp_count = this.rp_data.administrate_period.done_count;
        }

        if (this.rp_data.administrate_period.done_days != undefined && this.rp_data.administrate_period.done_days != null) {          
          this.rp_dates = this.rp_data.administrate_period.done_days;
        }
      }
    }
   
    let count_master = [{id:0,value:""}];
    if (this.rp_count > 0) {      
      for(let i = 0; i < this.rp_count; i++){
        let _id = i + 1;
        let obj = {id: _id, value: _id.toString()};
        count_master.push(obj);
      }
    }

    this.rp_dates_obj = [];
    if (this.rp_dates.length > 0) {
      this.rp_dates.map(item=>{
        this.rp_dates_obj.push(new Date(item));
      });
    }


    let current_count = 0;    
    
    this.state = {
      stop_date: "",
      alert_messages:"",
      count_master,
      current_count,
    };
  }

  async componentDidMount() {
  }

  getPeriodStopDate = (value) => {
    this.setState({
      stop_date:value,
    })
  }

  confirmClose = () => {
    this.props.closeModal();
  }

  confirmOk = async () => {  
    // validate 1.中止日
    if (this.rp_dates_obj.length > 0) {
      let stop_date_selected = 0;
      this.rp_dates_obj.map(_date=>{
        if (formatDateLine(_date) == formatDateLine(this.state.stop_date)) {
          stop_date_selected = 1;
        }
      });
      if (stop_date_selected == 0) {
        this.setState({alert_messages:"投与期間内の日付を選択してください。"});
        return;
      }      
    }

    // validate 2.中止回数目
    if (this.state.current_count < 1) {
      this.setState({alert_messages:"中止回数目を選択してください。"});
      return;
    }

    // execute 3.中止 (api)
    let path = "/app/api/v2/order/injection/stopInjection";            
    
    let post_data = {        
        number: this.props.modal_data.data.number,
        system_patient_id: this.props.patientId,
        rp_index: this.props.rp_index,
        stop_date: formatDateLine(this.state.stop_date),
        stop_count: this.state.current_count,
        doctor_code: this.context.selectedDoctor.code
        // doctor_name: this.context.selectedDoctor.name;
    };

    let result = "";
    
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          result = res;
        }
      })
      .catch(() => {
        this.props.closeModal("中止処理に失敗しました。");
      });

    if (this.props.middleboxRefresh != undefined && this.props.middleboxRefresh != null && result != "") {
      this.props.middleboxRefresh(this.props.modal_data.number, "injection_stop", result);
    }

    this.props.saveAdministratePeriod("stop_injection");
  }

  closeModal=()=>{
    this.setState({alert_messages:""});
  }

  getCount = (e) => {    
    this.setState({
      current_count: parseInt(e.target.id)
    });    
  }

  render() {          
    return (
      <>
        <Modal show={true} className="custom-modal-sm patient-exam-modal administrate_injection_stop_modal first-view-modal">
          <Modal.Header>
            <Modal.Title>中止登録</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <div className="block-left">
                  <div>中止設定</div>
                  <div className="flex" style={{marginTop:"10px"}}>
                    <div style={{width:"7rem",lineHeight:"38px"}}>中止日</div>
                    <div className="stop-date-label">{formatJapanDateSlash(formatDateLine(this.state.stop_date))}</div>
                  </div>
                  <div className="usage-select-area" style={{ display: "flex", marginTop:"5px" }}>
                    <SelectorWithLabel
                      title="中止回数目"
                      options={this.state.count_master}
                      getSelect={this.getCount}                    
                      departmentEditCode={this.state.current_count}
                    />
                  </div>                
                </div>
                <div className="block-right">
                  <div className="date-setting-area">
                    <div className="left-col" style={{width:"95%"}}>
                      <div className="period-date-cls">投与期間</div>
                      <div className='calendar-area'>
                        <DatePicker
                            showPopperArrow={false}
                            locale="ja"
                            selected={this.state.stop_date}
                            onChange={this.getPeriodStopDate}
                            dateFormat="yyyy/MM/dd"
                            inline                          
                            includeDates={this.rp_dates_obj}
                            dayClassName = {date => setDateColorClassName(date)}
                        />                      
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
          
        </Modal>
      </>
    );
  }
}

StopInjectionModal.contextType = Context;
StopInjectionModal.propTypes = {
  closeModal: PropTypes.func,
  saveAdministratePeriod: PropTypes.func,
  middleboxRefresh: PropTypes.func,
  administrate_period: PropTypes.object,
  type: PropTypes.string,
  modal_data: PropTypes.object,
  modal_type: PropTypes.string,
  patientId: PropTypes.number,
  rp_index: PropTypes.number,
  modal_title: PropTypes.string,
  patientInfo: PropTypes.object,
};

export default StopInjectionModal;
