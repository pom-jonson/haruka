import React, { Component } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import CompleteStatusModal from "~/components/templates/Dial/modals/CompleteStatusModal";
import * as apiClient from "~/api/apiClient";
import ja from "date-fns/locale/ja";
import DatePicker, { registerLocale } from "react-datepicker";
import ConfirmNoFocusModal from "~/components/molecules/ConfirmNoFocusModal";
import {formatDateLine, formatJapanDateSlash, formatJapanSlashDateTime, formatTimeIE} from "~/helpers/date";
import AlertNoFocusModal from "~/components/molecules/AlertNoFocusModal";
import {
  CACHE_SESSIONNAMES,
  getInspectionMasterInfo,
  getStaffName,
  WEEKDAYS
} from "~/helpers/constants";
import renderHTML from "react-render-html";
import {disable, midEmphasis, secondary200, surface} from "~/components/_nano/colors";
import axios from "axios/index";
import * as sessApi from "~/helpers/cacheSession-utils";
registerLocale("ja", ja);
import {Bar} from "~/components/styles/harukaBackgroundCss";
import {displayLineBreak, toHalfWidthOnlyNumber, setDateColorClassName} from "~/helpers/dialConstants";
import InputWithLabelBorder from "~/components/molecules/InputWithLabelBorder";
import {DatePickerBox} from "~/components/styles/DatePickerBox";

const RightArea = styled.div`
  width: 20rem;
  height: 100%;
  padding-top: 2.5rem;
  margin-left: 1rem;
  font-size: 1rem;
  .flex{display: flex;}
  .select-period {
    .period-title {
      line-height: 2rem;
      margin: 0;
      width: 5rem;
      font-size:1rem;
      text-align: right;
      margin-right: 0.5rem;
    }
    .react-datepicker-wrapper {
      input {
        width:11rem;
        height: 2rem;
      }
    }
    .react-datepicker{
      width: 130% !important;
      font-size: 1.25rem;
      .react-datepicker__month-container{
        width:79% !important;
        height:24.375rem;
      }
      .react-datepicker__navigation--next--with-time{
        right: 6rem;
      }
      .react-datepicker__time-container{
        width:21% !important;
      }
      .react-datepicker__time-box{
        width:auto !important;
      }
      .react-datepicker__current-month{
        font-size: 1.25rem;
      }
      .react-datepicker__day-names, .react-datepicker__week{
        display: flex;
        justify-content: space-between;
      }
      .react-datepicker__month{
        .react-datepicker__week{
          margin-bottom:0.25rem;
        }
      }
    }
  }
  .input-result {
    margin-top:0.5rem;
    div {margin-top:0;}
    .label-title{
      width:5rem;
      font-size: 1rem;
      line-height:2rem;
      margin:0;
      text-align: right;
      margin-right: 0.5rem;
    }
    .label-unit{
      margin:0;
      font-size: 1rem;
      line-height:2rem;
      margin-left:0.3rem;
    }
    input{
      width:6rem;
      height: 2rem;
      font-size: 1rem;
    }
    .ime-active input {
      ime-mode: active;
    }
    .ime-inactive input {
      ime-mode: inactive;
    }
  }
`;

const LeftArea = styled.div`
  width:calc(100% - 20rem);
  .patient-info {
    text-align: right;
    font-size: 18px;
    font-weight: bold;
  }
  .data-list{
    background-color: ${surface};
    overflow: hidden;
    margin-top: 0.5rem;
    .data-item{
      padding: 0.5rem 0.5rem 0 0.5rem;
    }
  }
  .data-title{
    border: 1px solid rgb(213,213,213);
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  .note{
    font-weight: bold;
  }
  .department{
    font-size: 1rem;
  }
  .date{
    font-weight:bold;
    text-align: left;
    padding-left: 0.5rem;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 12px;
    padding-right: 8px;
  }
  .middle-title{
    background: rgb(230, 230, 231);
  }
  .doctor-name{
    font-size: 12px;
    padding-right: 8px;
  }
`;

const Wrapper = styled.div`
  display:flex;
  width:100%;
  height:100%;
`;

const imageButtonStyle = {
  textAlign: "center",
  color: "blue",
  cursor: "pointer",
  float: "right"
};

const MedicineListWrapper = styled.div`
  font-size:0.75rem;
  height:calc( 60vh - 10rem);
  .history-item {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 1px;
  }
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
  }
  .item-detail-div{
    width: 100%;
    word-break: break-all;
  }
  .box {
    line-height: 1.3;
    position: relative;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 80px;
    }
    &:after {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      right: 80px;
    }
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .phy-box{
    line-height: 1.3;
    position: relative;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    &:before {
      content: "";
      background-color: ${disable};
      width: 1px;
      height: 100%;
      position: absolute;
      top: 0;
      left: 195px;
    }
    .text-left{
      .table-item{
        width: 9.375rem;
        float: left;
        text-align: right;
      }
    }
    .text-right{
      .table-item{
        text-align: left;
      }
    }
    .table-row {
      &:nth-child(2n) {
        background-color: ${secondary200};
      }
    }
  }
  .line-through {
    color: #ff0000;
  }
  .flex {
    display: flex;
    margin-bottom: 0;
    &.between {
      justify-content: space-between;
      div {
        margin-right: 0;
      }
    }
    div {
      margin-right: 8px;
    }
    .date {
      margin-left: auto;
      margin-right: 24px;
    }
  }
  .rp-number {
    margin-right: 4px;
    width: 75px;
  }
  .unit {
    margin-left: auto;
    text-align: right;
    width: 80px;
  }
  .full-text {
    width: 100%;
    text-align: right;
    margin-right: 11px;
  }
  .patient-name {
    margin-left: 16px;
  }
  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }
  .number {
    margin-right: 8px;
    width: 80px;
  }
  .number .rp{
    text-decoration-line: underline;
  }
  .unit{
    text-align: right;
  }
  .w80 {
    text-align: right;
    width: 5rem;
    margin-left: 8px;
  }
  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }
  .options {
    float: right;
  }
  .text-right {
    width: calc(100% - 88px);
  }
  .inject-usage{
    width: calc(100% - 110px - 5rem);
  }
  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }
  .order-copy {
    background-color: transparent;
    border: 1px solid #ced4da;
    padding: 0 4px;
    min-width: auto;
    span {
      color: ${midEmphasis};
      font-weight: normal;
      letter-spacing: 0;
    }
  }
  .hidden {
    display: none;
  }
  p {
    margin-bottom: 0;
  }
  .doing {
    background: #ccc !important;

    .table-row {
      &:nth-child(2n) {
        background-color: #ccc;
      }
    }
  }
  .stop-rp {
    background: rgb(229, 229, 229) !important;
    color: red;
    .table-row {
      &:nth-child(2n) {
        background-color: rgb(229, 229, 229) !important;
      }
    }
  }
  .full-width {
    width: calc(100% - 5rem - 15px);
  }
  .prescription-body-part {
    width: 100%;
    padding-left: 6.5rem;
  }
  .note-red {
    color:rgb(255, 0, 0);
  }
`;

class InspectionStartEndDateTimeRegister extends Component {
  constructor(props) {
    super(props);
    let cur_order_data = props.modal_data.order_data;
    this.departmentOptions = [];
    let init_status = sessApi.getObject(CACHE_SESSIONNAMES.INIT_STATUS);
    if(init_status !== undefined && init_status != null){
      let department_data = init_status.diagnosis_treatment_department;
      if(department_data.length > 0){
        department_data.map(department=>{
          this.departmentOptions[department['id']] = department['value'];
        })
      }
    }
    let inspection_info = getInspectionMasterInfo(cur_order_data.inspection_id);
    this.state = {
      date_time: new Date(),
      complete_message:"",
      confirm_title:"",
      confirm_message:"",
      alert_type:"",
      alert_title:"",
      alert_messages:"",
      cur_order_data,
      done_comment:"",
      inspection_info,
      done_result:"",
    };
    this.min_date = "";
    if(props.modal_type == "start_date"){
      this.min_date = new Date(cur_order_data.inspection_DATETIME.split('-').join('/'));
    } else {
      this.min_date = new Date(cur_order_data.start_date.split('-').join('/'));
      if(cur_order_data.continue_date !== undefined){
        cur_order_data.continue_date.map(item=>{
          this.min_date = new Date(item.date.split('-').join('/'));
        });
      }
    }
  }
  
  setPeriod=(key,value)=>{
    if(value == null){
      value = new Date();
    }
    this.setState({[key]:value});
  };
  
  register=async()=>{
    this.setState({
      confirm_title:"",
      confirm_message:"",
      complete_message:"登録中",
    });
    let path = "/app/api/v2/order/inspection/start_end_date/register";
    let order_data = JSON.parse(JSON.stringify(this.state.cur_order_data));
    if(this.props.modal_type === "done_continue_date"){
      if(order_data.continue_date === undefined){
        order_data.continue_date = [];
      }
      let authInfo = JSON.parse(window.sessionStorage.getItem("haruka"));
      let done_info = {};
      done_info.date = formatDateLine(this.state.date_time) + " " + formatTimeIE(this.state.date_time) + ":00";
      done_info.user_number = authInfo.user_number;
      if(this.state.done_comment !== ""){
        done_info.done_comment = this.state.done_comment;
      }
      if(this.state.done_result !== ""){
        done_info.done_result = this.state.done_result;
        done_info.result_suffix = this.state.inspection_info.result_suffix;
      }
      order_data.continue_date.push(done_info);
    } else {
      order_data[this.props.modal_type] = formatDateLine(this.state.date_time) + " " + formatTimeIE(this.state.date_time) + ":00";
    }
    if(this.props.from_mode === "soap"){
      this.param_order_data = order_data;
    }
    let post_data = {
      type:this.props.modal_type,
      order_data,
    };
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        this.setState({
          complete_message:"",
          alert_type:"modal_close",
          alert_title:"登録確認",
          alert_messages:res.alert_messages,
        });
      })
      .catch(() => {
      });
  }
  
  confirmRegister=()=>{
    let alert_messages = "";
    if(this.min_date.getTime() > this.state.date_time.getTime()){
      if(this.props.modal_type == "start_date"){
        alert_messages = "開始日時は検査日以降の日付を選択してください。";
      } else if(this.props.modal_type == "done_continue_date"){
        alert_messages = "実施日時は開始日時の後で選択してください。";
      } else {
        if(this.state.cur_order_data.continue_date !== undefined){
          alert_messages = "終了日時は継続登録日後の日付で選択してください。";
        } else {
          alert_messages = "終了日時は開始日時の後で選択してください。";
        }
      }
    }
    if(alert_messages !== ""){
      this.setState({
        alert_title:"エラー",
        alert_messages,
      });
      return;
    }
    this.setState({
      confirm_title:"登録確認",
      confirm_message:(this.props.modal_type === "start_date" ? "開始" : (this.props.modal_type === "end_date" ? "終了" : "実施")) + "日時を登録しますか？"
    });
  }
  
  closeModal=()=>{
    if(this.state.alert_type === "modal_close"){
      if(this.props.from_mode === "soap"){
        this.props.setDoneInfo(this.param_order_data);
      } else {
        this.props.closeModal('refresh');
      }
    }
    this.setState({
      confirm_title:"",
      confirm_message:"",
      alert_type:"",
      alert_title:"",
      alert_messages:"",
    });
  }
  
  getWeekDay = dateStr => {
    let weekday = new Date(dateStr).getDay();
    return WEEKDAYS[weekday];
  }
  
  getHistoryInfo = (nHistoryLength = -1, strStuffName = "", strDateTime = "", nDoctorConsented = -1) => {
    let strHistory = "";
    nHistoryLength++;
    if (nHistoryLength < 10) {
      nHistoryLength = `0${nHistoryLength}`;
    }
    if (nDoctorConsented == 4) {
      return "";
    }
    if (nDoctorConsented == 2) {
      strHistory = `${nHistoryLength}版 : ${formatJapanSlashDateTime(strDateTime)}`;
      return strHistory;
    } else{
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      } else{
        strHistory = `${nHistoryLength}版 : ${formatJapanSlashDateTime(strDateTime)} 入力者 : ${strStuffName}`;
        if (nHistoryLength == 1) {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        }
        return strHistory;
      }
    }
  }
  
  getDoctorName = (nDoctorConsented = -1, strDoctorName = "") => {
    if (nDoctorConsented == 4) {
      return `（過去データ取り込み）${strDoctorName}`;
    }
    if (nDoctorConsented == 2) {
      return strDoctorName;
    } else{
      if (nDoctorConsented == 1) {
        return `[承認済み] 依頼医: ${strDoctorName}`;
      } else{
        return  <div><span className='not-consented'>[未承認]</span> 依頼医: {strDoctorName}</div>;
      }
    }
  }
  
  getInsuranceName = (_insuranceName) => {
    let result = "既定";
    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
    return _insuranceName
  }
  
  openInspectionImageModal = async (number) => {
    const { data } = await axios.post("/app/api/v2/order/inspection/getImage", {
      params: {
        number: number
      }
    });
    this.setState({
      endoscope_image: data,
      isOpenInspectionImageModal: true,
    });
  }
  
  setDoneComment = (name, e) => {
    this.setState({[name]:e.target.value});
  }
  
  setDoneResult = (e) => {
    let value = e.target.value;
    if(this.state.inspection_info.result_type === 0){
      let RegExp = /^[0-9０-９]+\.?[0-9０-９]*$/;
      if ((value !== '' && !RegExp.test(value)) || (value.length > this.state.inspection_info.result_input_length)){
        this.setState({done_result: this.state.done_result});
      } else {
        this.setState({done_result: toHalfWidthOnlyNumber(value)});
      }
    } else {
      if (value.length > this.state.inspection_info.result_input_length){
        this.setState({done_result: this.state.done_result});
      } else {
        this.setState({done_result: value});
      }
    }
  }
  
  getContinueDate=(continue_date)=>{
    let date_arr = [];
    continue_date.map(item=>{
      let date = item.date.split(" ")[0];
      if(date_arr[date] === undefined){
        date_arr[date] = [];
      }
      date_arr[date].push(item);
    });
    let date_html = [];
    Object.keys(date_arr).map(date=>{
      date_html.push(<p style={{margin:0}}>{formatJapanDateSlash(date)}</p>);
      date_arr[date].map(item=>{
        date_html.push(
          <p style={{margin:0}}>
            ・{(item.date.split(" ")[1] !== undefined ? formatTimeIE(item.date) : "")}
            {item.done_result !== undefined ? (" 結果: " + displayLineBreak(item.done_result) + item.result_suffix) : ""}
            {"　" + getStaffName(item.user_number)}
          </p>
        );
        if(item.done_comment !== undefined){
          date_html.push(
            <p style={{margin:0}}>{"　コメント:" + displayLineBreak(item.done_comment)}</p>
          );
        }
      });
    });
    return date_html;
  }

  render() {
    let modal_data = this.props.modal_data;
    let cur_order_data = this.state.cur_order_data;
    return (
      <>
        <Modal
          show={true}
          className="inspection-start-end-datetime-register first-view-modal"
        >
          <Modal.Header><Modal.Title>{this.props.modal_type == "start_date" ? "開始" : (this.props.modal_type == "end_date" ? "終了" : "実施")}日時登録</Modal.Title></Modal.Header>
          <Modal.Body>
            <DatePickerBox style={{width:"100%", height:"100%"}}>
              <Wrapper>
                <LeftArea>
                  <Bar>
                    <div className={'patient-info'}>{cur_order_data.patientInfo.receId} : {cur_order_data.patientInfo.name}</div>
                    <div className="data-list">
                      <div className={'data-title ' + (cur_order_data.state == 0 ? '_color_not_implemented_hospital' : '_color_implemented_hospital')}>
                        <div className={'data-item'}>
                          <div className="flex justify-content">
                            <div className="note">【入院・{this.state.inspection_info.name}】</div>
                            <div className="department text-right">{this.departmentOptions[cur_order_data.department_id]}</div>
                          </div>
                          <div className="date">{formatJapanSlashDateTime(modal_data.treatment_datetime)}</div>
                        </div>
                        {(modal_data.history != null && modal_data.history !== "") ? (
                          <div className="history-region text-right middle-title">
                            {this.getHistoryInfo(modal_data.history.split(",").length-1, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                          </div>
                        ):(
                          <div className="history-region text-right middle-title">
                            {this.getHistoryInfo(0, modal_data.input_staff_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                          </div>
                        )}
                        <div className="doctor-name text-right low-title">{this.getDoctorName(modal_data.is_doctor_consented, cur_order_data.doctor_name)}</div>
                      </div>
                      <MedicineListWrapper>
                        <div className={'history-item soap-data-item'}>
                          <div className="history-item">
                            <div className="phy-box w70p">
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">検査日</div>
                                </div>
                                <div className="text-right">
                                  <div className={'table-item remarks-comment'}>
                                    {cur_order_data.inspection_DATETIME === "日未定" ? "[日未定]" : (formatJapanDateSlash(cur_order_data.inspection_DATETIME) + ((cur_order_data.reserve_time !== undefined && cur_order_data.reserve_time !== "") ? (" "+cur_order_data.reserve_time) : ""))}
                                    {cur_order_data.is_emergency == 1 && renderHTML("<span className='note-red'>[当日緊急]</span>")}
                                  </div>
                                </div>
                              </div>
                              <div className="flex between drug-item table-row">
                                <div className="text-left">
                                  <div className="table-item">保険</div>
                                </div>
                                <div className="text-right">
                                  <div className="table-item remarks-comment">{this.getInsuranceName(cur_order_data.insurance_name)}</div>
                                </div>
                              </div>
                              {cur_order_data.classification1_name !== undefined && cur_order_data.classification1_name != null && cur_order_data.classification1_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査種別</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cur_order_data.classification1_name}</div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.classification2_name !== undefined && cur_order_data.classification2_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査詳細</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cur_order_data.classification2_name}</div>
                                  </div>
                                </div>
                              )}
                              {/* ---------- start 内視鏡------------- */}
                              {cur_order_data.inspection_type_name !== undefined && cur_order_data.inspection_type_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査種別</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cur_order_data.inspection_type_name}</div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.inspection_item_name !== undefined && cur_order_data.inspection_item_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査項目</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cur_order_data.inspection_item_name}</div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.endoscope_purpose_name !== undefined && cur_order_data.endoscope_purpose_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">検査目的</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cur_order_data.endoscope_purpose_name}</div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.inspection_purpose !== undefined && cur_order_data.inspection_purpose != null && cur_order_data.inspection_purpose.length > 0 && (
                                cur_order_data.inspection_purpose.map((item, index)=>{
                                  return (
                                    <>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          {index == 0 ? (
                                            <div className="table-item">検査目的</div>
                                          ):(
                                            <div className="table-item"> </div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.name}</div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                })
                              )}
                              {cur_order_data.inspection_symptom !== undefined && cur_order_data.inspection_symptom != null && cur_order_data.inspection_symptom.length > 0 && (
                                cur_order_data.inspection_symptom.map((item, index)=>{
                                  return (
                                    <>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          {index == 0 ? (
                                            <div className="table-item">現症</div>
                                          ):(
                                            <div className="table-item"> </div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.name}</div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                })
                              )}
                              {cur_order_data.inspection_risk !== undefined && cur_order_data.inspection_risk != null && cur_order_data.inspection_risk.length > 0 && (
                                cur_order_data.inspection_risk.map((item, index)=>{
                                  return (
                                    <>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          {index == 0 ? (
                                            <div className="table-item">冠危険因子</div>
                                          ):(
                                            <div className="table-item"> </div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.name}</div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                })
                              )}
                              {cur_order_data.inspection_sick !== undefined && cur_order_data.inspection_sick != null && cur_order_data.inspection_sick.length > 0 && (
                                cur_order_data.inspection_sick.map((item, index)=>{
                                  return (
                                    <>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          {index == 0 ? (
                                            <div className="table-item">{item.title}</div>
                                          ):(
                                            <div className="table-item"></div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.name}</div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                })
                              )}
                              {cur_order_data.inspection_request !== undefined && cur_order_data.inspection_request != null && cur_order_data.inspection_request.length > 0 && (
                                cur_order_data.inspection_request.map((item, index)=>{
                                  return (
                                    <>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          {index == 0 ? (
                                            <div className="table-item">{item.title}</div>
                                          ):(
                                            <div className="table-item"> </div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.name}</div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                })
                              )}
                              {cur_order_data.is_anesthesia !== undefined && cur_order_data.is_anesthesia != null && cur_order_data.is_anesthesia.length > 0 && (
                                cur_order_data.is_anesthesia.map((item, index)=>{
                                  return (
                                    <>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          {index == 0 ? (
                                            <div className="table-item">{item.title}</div>
                                          ):(
                                            <div className="table-item"> </div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.name}</div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                })
                              )}
                              {cur_order_data.is_sedation !== undefined && cur_order_data.is_sedation != null && cur_order_data.is_sedation.length > 0 && (
                                cur_order_data.is_sedation.map((item, index)=>{
                                  return (
                                    <>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          {index == 0 ? (
                                            <div className="table-item">{item.title}</div>
                                          ):(
                                            <div className="table-item"> </div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.name}</div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                })
                              )}
                              {cur_order_data.inspection_movement !== undefined && cur_order_data.inspection_movement != null && cur_order_data.inspection_movement.length > 0 && (
                                cur_order_data.inspection_movement.map((item, index)=>{
                                  return (
                                    <>
                                      <div className="flex between drug-item table-row">
                                        <div className="text-left">
                                          {index == 0 ? (
                                            <div className="table-item">患者移動形態</div>
                                          ):(
                                            <div className="table-item"> </div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="table-item remarks-comment">{item.name}</div>
                                        </div>
                                      </div>
                                    </>
                                  )
                                })
                              )}
                              {(cur_order_data.done_height !== undefined || (cur_order_data.height !== undefined && cur_order_data.height != null && cur_order_data.height !== "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">身長</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cur_order_data.done_height !== undefined ? cur_order_data.done_height : cur_order_data.height}cm
                                    </div>
                                  </div>
                                </div>
                              )}
                              {(cur_order_data.done_weight !== undefined || (cur_order_data.weight !== undefined && cur_order_data.weight != null && cur_order_data.weight !== "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">体重</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cur_order_data.done_weight !== undefined ? cur_order_data.done_weight : cur_order_data.weight}kg</div>
                                  </div>
                                </div>
                              )}
                              {(cur_order_data.done_surface_area !== undefined || (cur_order_data.surface_area !== undefined && cur_order_data.surface_area != null && cur_order_data.surface_area !== "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">体表面積</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {cur_order_data.done_surface_area !== undefined ? cur_order_data.done_surface_area : cur_order_data.surface_area}㎡
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.connection_date_title !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">{cur_order_data.connection_date_title}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{formatJapanDateSlash(cur_order_data.calculation_start_date)}</div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.sick_name !== undefined && cur_order_data.sick_name != null && cur_order_data.sick_name !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">臨床診断、病名</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cur_order_data.sick_name}</div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.etc_comment !== undefined && cur_order_data.etc_comment != null && cur_order_data.etc_comment !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">
                                      <div>主訴、臨床経過</div>
                                      <div>検査目的、コメント</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cur_order_data.etc_comment}</div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.special_presentation !== undefined && cur_order_data.special_presentation !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">特殊指示</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cur_order_data.special_presentation}</div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.count !== undefined && cur_order_data.count !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">{cur_order_data.count_label !== '' ? cur_order_data.count_label : ''}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">{cur_order_data.count}{cur_order_data.count_suffix !== '' ? cur_order_data.count_suffix : ''}</div>
                                  </div>
                                </div>
                              )}
                              {((cur_order_data.done_body_part !== undefined && cur_order_data.done_body_part !== "") || (cur_order_data.done_body_part === undefined && cur_order_data.body_part !== undefined && cur_order_data.body_part !== "")) && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">部位指定コメント</div>
                                  </div>
                                  <div className="text-right">
                                    <div className={'table-item remarks-comment'}>
                                      {cur_order_data.done_body_part !== undefined ? cur_order_data.done_body_part : cur_order_data.body_part}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.image_path != null && cur_order_data.image_path !== undefined && cur_order_data.image_path !== "" && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      <a
                                        className="soap-image-title"
                                        onClick={() => this.openInspectionImageModal(cur_order_data.number)}
                                        style={imageButtonStyle}
                                      >
                                        画像を見る
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.additions !== undefined && Object.keys(cur_order_data.additions).length > 0 && (
                                <div className={`history-item soap-data-item`}>
                                  <div className="phy-box w70p">
                                    <div className="flex between drug-item table-row">
                                      <div className="text-left">
                                        <div className="table-item">追加指示等</div>
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item remarks-comment">
                                          {Object.keys(cur_order_data.additions).map(addition=>{
                                            return(
                                              <>
                                                <span>{cur_order_data.additions[addition].name}</span><br />
                                              </>
                                            )
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.start_date !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">開始日時</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {formatJapanDateSlash(cur_order_data.start_date) + " " + formatTimeIE(new Date((cur_order_data.start_date).split('-').join('/')))}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.continue_date !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">{this.state.inspection_info.performed_multiple_times_type === 1 ? "実施情報" : "継続登録"}</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {this.getContinueDate(cur_order_data.continue_date)}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {cur_order_data.end_date !== undefined && (
                                <div className="flex between drug-item table-row">
                                  <div className="text-left">
                                    <div className="table-item">終了日時</div>
                                  </div>
                                  <div className="text-right">
                                    <div className="table-item remarks-comment">
                                      {formatJapanDateSlash(cur_order_data.end_date) + " " + formatTimeIE(new Date((cur_order_data.end_date).split('-').join('/')))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </MedicineListWrapper>
                    </div>
                  </Bar>
                </LeftArea>
                <RightArea>
                  <div className={'select-period flex remove-x-input'}>
                    <div className={'period-title'}>{this.props.modal_type == "start_date" ? "開始" : (this.props.modal_type == "end_date" ? "終了" : "実施")}日時</div>
                    <DatePicker
                      locale="ja"
                      selected={this.state.date_time}
                      onChange={this.setPeriod.bind(this,"date_time")}
                      dateFormat="yyyy/MM/dd HH:mm"
                      timeCaption="時間"
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={10}
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      minDate={this.min_date}
                      dayClassName = {date => setDateColorClassName(date)}
                    />
                  </div>
                  {this.props.modal_type === "done_continue_date" && (
                    <>
                      {this.state.inspection_info.enable_result === 1 && (
                        <div className={'input-result'}>
                          {this.state.inspection_info.result_type === 0 && (
                            <div className='flex ime-inactive'>
                              <InputWithLabelBorder
                                label="結果"
                                type="text"
                                getInputText={this.setDoneResult.bind(this)}
                                diseaseEditData={this.state.done_result}
                              />
                              <div className='label-unit'>{this.state.inspection_info.result_suffix}</div>
                            </div>
                          )}
                          {this.state.inspection_info.result_type === 1 && (
                            <div className='flex ime-active'>
                              <InputWithLabelBorder
                                label="結果"
                                type="text"
                                getInputText={this.setDoneResult.bind(this)}
                                diseaseEditData={this.state.done_result}
                              />
                              <div className='label-unit'>{this.state.inspection_info.result_suffix}</div>
                            </div>
                          )}
                          {this.state.inspection_info.result_type === 2 && (
                            <>
                              <div className='sub-title'>結果</div>
                              <textarea value={this.state.done_result} onChange={this.setDoneResult.bind(this)} style={{width:"100%", height:"4rem"}}/>
                              <div className='sub-title'>{this.state.inspection_info.result_suffix}</div>
                            </>
                          )}
                        </div>
                      )}
                      <div style={{marginTop:"0.5rem"}}>
                        <div className='sub-title'>実施コメント</div>
                        <textarea value={this.state.done_comment} onChange={this.setDoneComment.bind(this, 'done_comment')} style={{width:"100%", height:"4rem"}}/>
                      </div>
                    </>
                  )}
                </RightArea>
              </Wrapper>
            </DatePickerBox>
          </Modal.Body>
          <Modal.Footer>
            <div onClick={this.props.closeModal} className={"custom-modal-btn cancel-btn"} style={{cursor:"pointer"}}>
              <span>キャンセル</span>
            </div>
            <div onClick={this.confirmRegister} className={"custom-modal-btn red-btn"} style={{cursor:"pointer"}}>
              <span>登録</span>
            </div>
          </Modal.Footer>
          {this.state.complete_message !== '' && (
            <CompleteStatusModal
              message = {this.state.complete_message}
            />
          )}
          {this.state.confirm_message !== "" && (
            <ConfirmNoFocusModal
              hideConfirm= {this.closeModal}
              confirmCancel= {this.closeModal}
              confirmOk= {this.register}
              confirmTitle= {this.state.confirm_message}
              title= {this.state.confirm_title}
            />
          )}
          {this.state.alert_messages !== "" && (
            <AlertNoFocusModal
              hideModal= {this.closeModal.bind(this)}
              handleOk= {this.closeModal.bind(this)}
              showMedicineContent= {this.state.alert_messages}
              title= {this.state.alert_title}
            />
          )}
        </Modal>
      </>
    );
  }
}

InspectionStartEndDateTimeRegister.propTypes = {
  closeModal: PropTypes.func,
  modal_data: PropTypes.object,
  modal_type: PropTypes.string,
  from_mode: PropTypes.string,
  setDoneInfo: PropTypes.func,
};
export default InspectionStartEndDateTimeRegister;
