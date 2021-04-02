import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import PropTypes from "prop-types";
import Context from "~/helpers/configureStore";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { WEEKDAYS, getVisitPlaceNameForModal } from "~/helpers/constants";
import {
  surface,
  secondary200,
  disable
} from "~/components/_nano/colors";
import * as apiClient from "~/api/apiClient";
import SystemConfirmModal from "~/components/molecules/SystemConfirmModal";
import {formatDate, formatJapanDateSlash, formatJapanSlashDateTime} from "~/helpers/date";
import * as karteApi from "~/helpers/cacheKarte-utils";
import axios from "axios";
import {Bar} from "~/components/styles/harukaBackgroundCss";
import {formatDateLine} from "../../helpers/date";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const renderTooltip = (props) => <Tooltip {...props} className={'tooltip-area'}>{props}</Tooltip>;

const underLine = {
  textDecorationLine: "underline"
};

const textAlignRight = {
  textAlign: "right"
};

const Wrapper = styled.div`
  display: block;
  align-items: flex-start;
  justify-content: space-between;
  font-size: 1rem;
  width: 100%;

  .patient-info {
    text-align: right;
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  flex-direction: column;
  display: flex;
  text-align: center;
  .content{
    height: 57vh;
    overflow-y: hidden;
  }
  .justify-content {
    align-items: flex-start;
    justify-content: space-between;
  }
  ._color_implemented{
    .history-region{
      background: #e5ffdb;
    }
    .doctor-name{
      background: #e5ffdb;
    }
    .data-item{
      background: linear-gradient(#d0e6b5, #e6ffcb, #e6ffcb);
    }
  }
  ._color_not_implemented{
    .history-region{
      background: #ffe5ef;
    }
    .doctor-name{
      background: #ffe5ef;
    }
    .data-item{
      background: linear-gradient(#eac1db, #ffd4f0, #ffd4f0);
    }
  }
`;

const Col = styled.div`
  background-color: ${surface};
  width: 100%;
  max-height: calc(100vh - 182px);
  overflow-y: hidden;
  -ms-overflow-style: auto;
  .data-item{
    border-bottom: 1px solid ${disable};
    background: rgb(160, 235, 255);
  }
  .data-header{
    background: rgb(105, 200, 225);
    color: white;
    padding: 4px 8px;
  }
  .bottom-line{
    border-bottom: 1px solid rgb(213, 213, 213);
  }
  .data-title{
    border: 1px solid rgb(213,213,213);
    cursor: pointer;
    .data-item{
      padding:10px;
    }
    .note{
      text-align: left;
    }
    .date{
      text-align: left;
    }
  }
  .department{
    font-size: 1rem;
  }
  .note{
    font-weight: bold;
  }
  .date{
    font-weight:bold
  }
  .doctor-name{
    font-size: 1rem;
    padding-right: 0.5rem;
  }
  .history-region{
    border-bottom: 1px solid rgb(213,213,213);
    font-size: 1rem;
    padding-right: 0.5rem;
  }
  .order{
    display: block !important;
  }
  .data-list{
    overflow: hidden;
  }

  .soap-history-title{
    font-size: 0.8rem;
  }

  .low-title,
  .middle-title{
    background: #ddf8ff;
  }
  .facility-border{
    border-top: 1px solid rgb(213, 213, 213);
  }

  .no-result {
    padding: 10rem;
    text-align: center;

    p {
      padding: 10px;
      border: 2px solid #aaa;
    }
  }
`;

const MedicineListWrapper = styled.div`
  font-size: 12px;
  height:calc(57vh - 10rem);
  overflow-y:auto;
  .no-bottom{
    label{
      margin-bottom: 0px !important;
    }
  }
  .row {
    margin: 0;
    &:first-child {
      border-top: 1px solid ${disable};
    }
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
      left: 50px;
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
      left: 200px;
    }

    .text-left{
      .table-item{
        width: 150px;
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

  .patient-name {
    margin-left: 1rem;
  }

  .drug-item {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .number {
    margin-right: 8px;
    width: 60px;
  }
  .number .rp{
    text-decoration-line: underline;
  }

  .unit{
    text-align: right;
  }

  .w80 {
    text-align: right;
    width: 80px;
    margin-left: 8px;
  }

  .option {
    border-bottom: 1px solid ${disable};
    padding: 4px;
  }

  .text-right {
    width: calc(100% - 88px);
  }

  .remarks-comment {
    margin-left: auto;
    width: calc(100% - 80px);
    word-wrap: break-word;
  }

  .content-border{
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
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
  .prescription-body-part {
    width: 100%;
    padding-left: 4.5rem;
  }
  .item-details{
    text-align:left;
  }
  .item-details:last-child{
    border-bottom: 1px solid #ddd;
  }
`;

class InjectionDoneModal extends Component {
  constructor(props) {
    super(props);
    let modal_data = this.props.modal_data;
    this.state = {
      modal_type: this.props.modal_type,
      modal_title: this.props.modal_title,
      modal_data,
      confirm_message: "",
      detailedInsuranceInfo: [],
      confirm_type: ""
    }
    this.is_period = false;
    this.is_exist = false;
    if (modal_data.data.order_data.order_data.length > 0) {
      modal_data.data.order_data.order_data.map(item=>{
        if (item.order_numbers !== undefined && item.order_numbers != null && Object.keys(item.order_numbers).length>0) {
          this.is_period = true;
          Object.keys(item.order_numbers).map(index=>{
            if (formatDateLine(new Date()) == index.substr(0, 10)) this.is_exist = true;
          })
        }
      });
    }
    this.can_done = false;
  }
  
  async componentDidMount(){
    await this.getInsuranceInfo();
    // set permission
    this.can_done = this.context.$canDoAction(this.context.FEATURES.PRESCRIPTION, this.context.AUTHS.DONE_OREDER);
  }
  
  getInsurance = type => {
    let insurance = "既定";
    // if (this.props.patientInfo.insurance_type_list) {
    if (this.state.detailedInsuranceInfo && this.state.detailedInsuranceInfo.length > 0) {
      this.state.detailedInsuranceInfo.map(item => {
        if (item.insurance_type_number === parseInt(type)) {
          insurance = item.insurance_type;
        }
      });
    }
    return insurance;
  };
  
  getInsuranceInfo = async () => {
    if (this.props.patientId > 0) {
      let data = await axios.get("/app/api/v2/karte/patient_datailed", {
        // パラメータ
        params: {
          systemPatientId: this.props.patientId
        }
      });
      this.setState({
        detailedInsuranceInfo: data.data.insurance_pattern
      });
    }
  }
  
  getInsuranceName = (_insuranceName) => {
    let result = "既定";
    
    if (_insuranceName == undefined || _insuranceName == null || _insuranceName == "") return result;
    
    return _insuranceName
  }
  
  doneData = async() => {
    this.setState({
      confirm_message: "実施しますか？",
      confirm_type: "_doneOrder"
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
      strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)}(${this.getWeekDay(strDateTime.substr(0,10))}) ${strDateTime.substr(11, 8)}`;
      return strHistory;
    } else{
      if (nDoctorConsented == 1) {
        strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        return strHistory;
      } else{
        strHistory = `${nHistoryLength}版 : ${strDateTime.substr(0, 4)}/${strDateTime.substr(5, 2)}/${strDateTime.substr(8, 2)}(${this.getWeekDay(strDateTime.substr(0,10))}) ${strDateTime.substr(11, 8)} 入力者 : ${strStuffName}`;
        if (nHistoryLength == 1) {
          strHistory = `${nHistoryLength}版 入力者 : ${strStuffName}`;
        }
        return strHistory;
      }
    }
  }
  
  getUnevenValues = (values, unit) => {
    let unevenValues = [];
    values.map(splitNum => {
      if (splitNum.value !== undefined) {
        unevenValues.push(splitNum.label + " " + splitNum.value + unit);
      }
    });
    return unevenValues.join(",");
  };
  
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
  
  confirmOk = async() => {
    let patientInfo = karteApi.getPatient(this.props.patientId);
    let current_insurance_type = patientInfo != undefined && patientInfo != null && patientInfo.insurance_type != undefined && patientInfo.insurance_type != null ? patientInfo.insurance_type : 0;
    let path = "/app/api/v2/order/injection/execute";
    let post_data = {
        number: this.props.modal_data.target_number,
        system_patient_id: this.props.modal_data.system_patient_id,
        insurance_type: current_insurance_type
    }
    
    await apiClient._post(
      path,
      {params: post_data})
      .then((res) => {
        if(res){
          if (this.props.modal_type == "injection" && this.props.fromPage != "injectionList" && this.props.fromPage != "notDoneList"){
            window.sessionStorage.setItem("alert_messages", "実施しました。");
            if (this.props.gotoUrl !== undefined && this.props.gotoUrl !== "" && this.props.gotoUrl === "injection") {
              this.props.history.replace(`/patients/${this.props.patientId}/injection`);
            } else {
              this.props.history.replace(`/patients/${this.props.patientId}/soap`);
            }
          } else if(this.props.fromPage == "notDoneList") {
            this.props.closeInjection();
            return;
          } else {
            window.sessionStorage.setItem("alert_messages", "実施しました。");
          }
        }
      })
      .catch(() => {
      
      })
    if (this.props.modal_type == "injection" && this.props.fromPage == "injectionList" != this.props.fromPage != "notDoneList") {
      this.props.closeModalAndRefresh();
    } else {
      this.props.closeModal();
    }
  }
  
  confirmCancel() {
    this.setState({
      confirm_message: "",
      confirm_type: ""
    });
  }
  getKarteStatusName = (_modalData) => {
    let result = "外来";
    if(_modalData == undefined || _modalData == null) return result;
    if (_modalData.karte_status == undefined || _modalData.karte_status == null){
      if (_modalData.data != undefined &&
        _modalData.data.karte_status > 0) {
        result = _modalData.data.karte_status == 1 ? "外来" : _modalData.data.karte_status == 3 ? "入院" : "在宅";
      }
    } else {
      result = _modalData.karte_status == 1 ? "外来" : _modalData.karte_status == 3 ? "入院" : "在宅";
    }
    
    return result;
  }
  
  getDepartmentName = (_modalData) => {
    let result = "";
    if(_modalData == undefined || _modalData == null) return result;
    if (_modalData.medical_department_name == undefined || _modalData.medical_department_name == null){
      if (_modalData.data != undefined &&
        _modalData.data.order_data != undefined &&
        _modalData.data.order_data.department != undefined &&
        _modalData.data.order_data.department != "") {
        result = _modalData.data.order_data.department;
      }
    } else {
      result = _modalData.medical_department_name;
    }
    
    return result;
  }
  
  getOrderTitleClassName = (param_obj) => {
    if (param_obj.target_table == "order") {
      if (param_obj.is_doctor_consented != 4 && (param_obj.done_order == 0 || param_obj.done_order == 3)) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if (param_obj.done_order == 1) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";
      }
      if (param_obj.done_order == 2) {
        return param_obj.karte_status != 3? "_color_received" : "_color_received_hospital";
      }
    } else if(param_obj.target_table == "inspection_order") {
      if (param_obj.is_doctor_consented !== 4 && param_obj.state == 0) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if ( param_obj.state == 2) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";
      }
      if (param_obj.state == 1) {
        return param_obj.karte_status != 3? "_color_received" : "_color_received_hospital";
      }
    } else if(param_obj.target_table == "treat_order_header") {
      if (param_obj.is_doctor_consented !== 4 && param_obj.state == 0) {
        return param_obj.karte_status != 3? "_color_not_implemented" : "_color_not_implemented_hospital";
      }
      if (param_obj.done_order == 1) {
        return param_obj.karte_status != 3? "_color_implemented" : "_color_implemented_hospital";
      }
    }
    return "";
  }
  
  getDoneStatus (modal_data) {
    if (modal_data.is_doctor_consented != 4 && (modal_data.data.done_order == 0 || modal_data.data.done_order == 3)) return '未実施';
    if (modal_data.is_doctor_consented != 4 && modal_data.data.done_order == 2) return '受付済み';
    return '';
  }  
  
  render() {
    let { modal_data, modal_title, modal_type} = this.props;
    var done_status = this.getDoneStatus(modal_data, modal_type);
    var karte_status = 1;
    if (modal_data.karte_status != undefined) karte_status = modal_data.karte_status;
    if (modal_data.data != undefined && modal_data.data.karte_status != undefined) karte_status = modal_data.data.karte_status;
    return  (
      <Modal show={true} id="done-order-modal"  className="custom-modal-sm first-view-modal guidance-done-modal">
        <Modal.Header>
          <Modal.Title>{modal_title}実施</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Wrapper>
            <Col id="soap_list_wrapper">
              <Bar>
                <div className="content">
                  <div className="data-list">
                    <div className={'patient-info'}>
                      {this.props.patientInfo.receId} : {this.props.patientInfo.name}
                    </div>
                    <div className={`data-title
                  ${this.getOrderTitleClassName({target_table:'order',is_doctor_consented:modal_data.is_doctor_consented, done_order:modal_data.data.done_order, is_enabled:modal_data.data.is_enabled,karte_status:karte_status})}`}>
                      <div className="data-item">
                        <div className="flex" style={{justifyContent: "space-between"}}>
                          <div className="note">【{this.getKarteStatusName(modal_data)}・注射】{done_status}
                          </div>
                          <div className="department text-right">{this.getDepartmentName(modal_data)}</div>
                        </div>
                        <div className="date">
                            {modal_data.treatment_datetime !== undefined && modal_data.treatment_datetime !== null && modal_data.treatment_datetime !== ""  ? (
                              <>
                                {formatJapanSlashDateTime(modal_data.treatment_datetime)}
                              </>
                            ) : (
                              <>
                                {modal_data.data != undefined && modal_data.data.created_at != undefined && modal_data.data.created_at != "" ? (
                                  <>
                                    {formatJapanSlashDateTime(modal_data.data.created_at)}
                                  </>
                                ):(
                                  <>
                                    {modal_data.treatment_date !== "" && modal_data.treatment_date !== undefined ? (
                                      <>
                                        {modal_data.treatment_date.substr(0, 4)}/
                                        {modal_data.treatment_date.substr(5, 2)}/
                                        {modal_data.treatment_date.substr(8, 2)}
                                        ({this.getWeekDay(modal_data.treatment_date.substr(0,10))})
                                      </>
                                    ):(
                                      <>
                                        {formatJapanSlashDateTime(modal_data.created_at)}
                                      </>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                        </div>
                      </div>
                      {modal_data.data.history != undefined && modal_data.data.history !== null && modal_data.data.history != "" ? (
                        <div className="history-region text-right middle-title">
                          {this.getHistoryInfo(modal_data.data.history.split(",").length-1, modal_data.substitute_name != undefined && modal_data.substitute_name != "" ? modal_data.substitute_name : modal_data.doctor_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                        </div>
                      ):(
                        <>
                          {modal_data.is_doctor_consented !=2 && (
                            <div className="history-region text-right middle-title">
                              {this.getHistoryInfo(0, modal_data.substitute_name != undefined && modal_data.substitute_name != "" ? modal_data.substitute_name : modal_data.doctor_name, modal_data.updated_at, modal_data.is_doctor_consented)}
                            </div>
                          )}
                        </>
                      )}
                      <div className="doctor-name text-right low-title">
                        {this.getDoctorName(modal_data.is_doctor_consented, modal_data.doctor_name)}
                      </div>
                      {modal_data.data != undefined && modal_data.data != null && modal_data.data.order_data != undefined && modal_data.data.order_data.visit_place_id != undefined && modal_data.data.order_data.visit_place_id > 0 && (
                        <div className="doctor-name text-right low-title facility-border">
                          {getVisitPlaceNameForModal(modal_data.data.order_data.visit_place_id)}
                        </div>
                      )}
                    </div>
                    {this.is_period && !this.is_exist && (
                      <div className="no-result"><p>未実施の注射がありません。</p></div>
                    )}
                    <MedicineListWrapper>
                      <div className="history-item soap-data-item content-border">
                        {modal_data.data.order_data.order_data.length > 0 && modal_data.data.order_data.order_data.map((item, key)=>{
                          return (
                            <>
                              {item.order_numbers !== undefined && item.order_numbers != null && Object.keys(item.order_numbers).length>0 ? (
                                <>
                                  {Object.keys(item.order_numbers).map(date_time_index=>{
                                    if (formatDateLine(new Date()) == date_time_index.substr(0, 10))
                                    return (
                                      <>
                                      <div className="history-item" key={date_time_index}>
                                        <div className="box w70p" draggable="true">
                                          <div className="flex between drug-item table-row">
                                            <div className="number" style={underLine}>
                                              {" Rp" + parseInt(key + 1)}
                                            </div>
                                            <div className="text-right">
                                              <div className="table-item" style={{marginRight:'8px'}}>
                                                {!item.usage_name ? "" : `手技: ${item.usage_name}`}
                                              </div>
                                            </div>
                                            <div className="w80 table-item">
                                              {item.days !== 0 && item.days !== undefined
                                                ? item.days +
                                                (item.days_suffix !== undefined && item.days_suffix !== ""
                                                  ? item.days_suffix
                                                  : "日分")
                                                : ""}
                                            </div>
                                          </div>
                                          {item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                            return (
                                              <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                                <div className="flex between">
                                                  <div className="flex full-width table-item">
                                                    <div className="number">
                                                    </div>
                
                                                    <div className="ml-3 full-width mr-2" style={{textAlign:'left'}}>
                                                      {medicine_item.item_name}
                                                      {medicine_item.amount > 0 &&
                                                      medicine_item.uneven_values !== undefined &&
                                                      medicine_item.uneven_values.length > 0 && (
                                                        <p style={textAlignRight}>
                                                          {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                        </p>
                                                      )}
                                                      {medicine_item.free_comment
                                                        ? medicine_item.free_comment.map(comment => {
                                                          return (
                                                            <p key={comment.id} style={textAlignRight}>
                                                              {comment}
                                                            </p>
                                                          );
                                                        })
                                                        : ""}
                                                    </div>
                                                  </div>
                                                  <div className="w80 table-item" style={textAlignRight}>
                                                    {" "}
                                                    {medicine_item.amount}
                                                    {medicine_item.unit}
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          })}
                                          {item.is_precision !== undefined && item.is_precision == 1 && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                【精密持続点滴】
                                              </div>
                                            </div>
                                          )}
                                          {item.insurance_type !== undefined && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                {`保険: ${this.getInsurance(item.insurance_type)}`}
                                              </div>
                                            </div>
                                          )}
                                          {item.body_part !== undefined && item.body_part !== "" && (
                                            <div className="flex between option table-row prescription-body-part">
                                              <div className="text-right table-item">
                                                {`部位/補足: ${item.body_part}`}
                                              </div>
                                            </div>
                                          )}
                                          {item.discontinuation_start_date !== undefined &&
                                          item.discontinuation_start_date !== "" && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                {`中止期間の最初日: ${formatDate(
                                                  item.discontinuation_start_date
                                                )}`}
                                              </div>
                                            </div>
                                          )}
                                          {item.discontinuation_end_date !== undefined &&
                                          item.discontinuation_end_date !== "" && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                {`中止期間の最後日: ${formatDate(
                                                  item.discontinuation_end_date
                                                )}`}
                                              </div>
                                            </div>
                                          )}
                                          {item.discontinuation_comment !== undefined &&
                                          item.discontinuation_comment !== "" && (
                                            <div className="flex between option table-row">
                                              <div className="text-right table-item">
                                                {`中止コメント: ${item.discontinuation_comment}`}
                                              </div>
                                            </div>
                                          )}
                                          {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                                            <div className="flex between drug-item table-row">
                                              <div className="text-right">
                                                <div className="table-item">
                                                  {!item.injectUsageName ? "" : `用法: ${item.injectUsageName}`}
                                                </div>
                                                {item.usage_remarks_comment ? (
                                                  <div className="table-item remarks-comment">
                                                    {item.usage_remarks_comment.map((comment, ci) => {
                                                      return <p key={ci}>{comment}</p>;
                                                    })}
                                                  </div>
                                                ) : (
                                                  ""
                                                )}
                                              </div>
                                              <div className="w80 table-item">
                                              </div>
                                            </div>
                                          )}
                                          {(item.temporary_medication !== undefined && item.temporary_medication === 1) ||
                                          (item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1) ||
                                          (item.med[0].milling !== undefined && item.med[0].milling === 1) ||
                                          (item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1) ||
                                          (item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1) ||
                                          (item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1) && (
        
                                            <div className="option flex table-item table-row dcVhIR">
                                              {item.temporary_medication !== undefined && item.temporary_medication === 1 && (
                                                <p className="gCXasu">【臨時処方】&nbsp;</p>
                                              )}
                                              {item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1 && (
                                                <p className="gCXasu">【一包化】&nbsp;</p>
                                              )}
                                              {item.med[0].milling !== undefined && item.med[0].milling === 1 && (
                                                <p className="gCXasu">【粉砕】&nbsp;</p>
                                              )}
                                              {item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1 && (
                                                <p className="gCXasu">【後発不可】&nbsp;</p>
                                              )}
                                              {item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1 && (
                                                <p className="gCXasu">【別包】&nbsp;</p>
                                              )}
                                              {item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1 && (
                                                <p className="gCXasu">【一般名処方】&nbsp;</p>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex between option table-row no-bottom">
                                        <div className="text-right table-item">
                                          <label>実施予定日時: </label>
                                          <label>{formatJapanDateSlash(date_time_index) + " " + date_time_index.substr(11, 2) + "時" + date_time_index.substr(14, 2) + "分"}</label>
                                        </div>
                                      </div>
                                      </>
                                    )
                                  })}
                                </>
                              ):(
                                <div className="history-item" key={key}>
                                  <div className="box w70p" draggable="true">
                                    <div className="flex between drug-item table-row">
                                      <div className="number" style={underLine}>
                                        {" Rp" + parseInt(key + 1)}
                                      </div>
                                      <div className="text-right">
                                        <div className="table-item" style={{marginRight:'8px'}}>
                                          {!item.usage_name ? "" : `手技: ${item.usage_name}`}
                                        </div>
                                      </div>
                                      <div className="w80 table-item">
                                        {item.days !== 0 && item.days !== undefined
                                          ? item.days +
                                          (item.days_suffix !== undefined && item.days_suffix !== ""
                                            ? item.days_suffix
                                            : "日分")
                                          : ""}
                                      </div>
                                    </div>
                                    {item.med.length > 0 && item.med.map((medicine_item, medicine_key)=>{
                                      return (
                                        <div className="drug-item table-row HistoryUl__DrugItem-h3zsie-0 ffNuc" key={medicine_key}>
                                          <div className="flex between">
                                            <div className="flex full-width table-item">
                                              <div className="number">
                                              </div>
                
                                              <div className="ml-3 full-width mr-2" style={{textAlign:'left'}}>
                                                {medicine_item.item_name}
                                                {medicine_item.amount > 0 &&
                                                medicine_item.uneven_values !== undefined &&
                                                medicine_item.uneven_values.length > 0 && (
                                                  <p style={textAlignRight}>
                                                    {this.getUnevenValues(medicine_item.uneven_values, medicine_item.unit)}
                                                  </p>
                                                )}
                                                {medicine_item.free_comment
                                                  ? medicine_item.free_comment.map(comment => {
                                                    return (
                                                      <p key={comment.id} style={textAlignRight}>
                                                        {comment}
                                                      </p>
                                                    );
                                                  })
                                                  : ""}
                                              </div>
                                            </div>
                                            <div className="w80 table-item" style={textAlignRight}>
                                              {" "}
                                              {medicine_item.amount}
                                              {medicine_item.unit}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                    {item.is_precision !== undefined && item.is_precision == 1 && (
                                      <div className="flex between option table-row">
                                        <div className="text-right table-item">
                                          【精密持続点滴】
                                        </div>
                                      </div>
                                    )}
                                    {item.insurance_type !== undefined && (
                                      <div className="flex between option table-row">
                                        <div className="text-right table-item">
                                          {`保険: ${this.getInsurance(item.insurance_type)}`}
                                        </div>
                                      </div>
                                    )}
                                    {item.body_part !== undefined && item.body_part !== "" && (
                                      <div className="flex between option table-row prescription-body-part">
                                        <div className="text-right table-item">
                                          {`部位/補足: ${item.body_part}`}
                                        </div>
                                      </div>
                                    )}
                                    {item.discontinuation_start_date !== undefined &&
                                    item.discontinuation_start_date !== "" && (
                                      <div className="flex between option table-row">
                                        <div className="text-right table-item">
                                          {`中止期間の最初日: ${formatDate(
                                            item.discontinuation_start_date
                                          )}`}
                                        </div>
                                      </div>
                                    )}
                                    {item.discontinuation_end_date !== undefined &&
                                    item.discontinuation_end_date !== "" && (
                                      <div className="flex between option table-row">
                                        <div className="text-right table-item">
                                          {`中止期間の最後日: ${formatDate(
                                            item.discontinuation_end_date
                                          )}`}
                                        </div>
                                      </div>
                                    )}
                                    {item.discontinuation_comment !== undefined &&
                                    item.discontinuation_comment !== "" && (
                                      <div className="flex between option table-row">
                                        <div className="text-right table-item">
                                          {`中止コメント: ${item.discontinuation_comment}`}
                                        </div>
                                      </div>
                                    )}
                                    {item.injectUsageName != undefined && item.injectUsageName != null && item.injectUsageName != "" && (
                                      <div className="flex between drug-item table-row">
                                        <div className="text-right">
                                          <div className="table-item">
                                            {!item.injectUsageName ? "" : `用法: ${item.injectUsageName}`}
                                          </div>
                                          {item.usage_remarks_comment ? (
                                            <div className="table-item remarks-comment">
                                              {item.usage_remarks_comment.map((comment, ci) => {
                                                return <p key={ci}>{comment}</p>;
                                              })}
                                            </div>
                                          ) : (
                                            ""
                                          )}
                                        </div>
                                        <div className="w80 table-item">
                                        </div>
                                      </div>
                                    )}
                                    {(item.temporary_medication !== undefined && item.temporary_medication === 1) ||
                                    (item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1) ||
                                    (item.med[0].milling !== undefined && item.med[0].milling === 1) ||
                                    (item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1) ||
                                    (item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1) ||
                                    (item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1) && (
        
                                      <div className="option flex table-item table-row dcVhIR">
                                        {item.temporary_medication !== undefined && item.temporary_medication === 1 && (
                                          <p className="gCXasu">【臨時処方】&nbsp;</p>
                                        )}
                                        {item.med[0].one_dose_package !== undefined && item.med[0].one_dose_package === 1 && (
                                          <p className="gCXasu">【一包化】&nbsp;</p>
                                        )}
                                        {item.med[0].milling !== undefined && item.med[0].milling === 1 && (
                                          <p className="gCXasu">【粉砕】&nbsp;</p>
                                        )}
                                        {item.med[0].is_not_generic !== undefined && item.med[0].is_not_generic === 1 && (
                                          <p className="gCXasu">【後発不可】&nbsp;</p>
                                        )}
                                        {item.med[0].separate_packaging !== undefined && item.med[0].separate_packaging === 1 && (
                                          <p className="gCXasu">【別包】&nbsp;</p>
                                        )}
                                        {item.med[0].can_generic_name !== undefined && item.med[0].can_generic_name === 1 && (
                                          <p className="gCXasu">【一般名処方】&nbsp;</p>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          )
                        })}
                        <div>
                          {!this.is_period && modal_data.data.order_data.schedule_date !== null && modal_data.data.order_data.schedule_date !== undefined && modal_data.data.order_data.schedule_date != "" && (
                            <div className="flex between option table-row no-bottom">
                              <div className="text-right table-item">
                                <label>実施予定日: </label>
                                <label>{formatJapanDateSlash(modal_data.data.order_data.schedule_date)}</label>
                              </div>
                            </div>
                          )}
                          {modal_data.data != undefined && modal_data.data != null && modal_data.data.done_order == 1 && (
                            <div className="flex between option table-row no-bottom">
                              <div className="text-right table-item">
                                <label>実施日時: </label>
                                <label>{formatJapanDateSlash(modal_data.data.order_data.executed_date_time) + " " + modal_data.data.order_data.executed_date_time.substr(11, 2) + "時" + modal_data.data.order_data.executed_date_time.substr(14, 2) + "分"}</label>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data.location_name !== null && modal_data.data.order_data.location_name !== undefined && modal_data.data.order_data.location_name != "" && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    <label>実施場所: </label>
                                    <label>{modal_data.data.order_data.location_name}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data.drip_rate !== null && modal_data.data.order_data.drip_rate !== undefined && modal_data.data.order_data.drip_rate !== "" &&
                          modal_data.data.order_data.drip_rate !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    {`点滴速度: ${modal_data.data.order_data.drip_rate}ml/h`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data.water_bubble !== null && modal_data.data.order_data.water_bubble !== undefined && modal_data.data.order_data.water_bubble !== "" &&
                          modal_data.data.order_data.water_bubble !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    {`1分あたり: ${modal_data.data.order_data.water_bubble}滴`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data.exchange_cycle !== null && modal_data.data.order_data.exchange_cycle !== undefined && modal_data.data.order_data.exchange_cycle !== "" &&
                          modal_data.data.order_data.exchange_cycle !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    {`交換サイクル: ${modal_data.data.order_data.exchange_cycle}時間`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data.require_time !== null && modal_data.data.order_data.require_time !== undefined && modal_data.data.order_data.require_time !== "" &&
                          modal_data.data.order_data.require_time !== 0 && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item">
                                    {`所要時間: ${modal_data.data.order_data.require_time}時間`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data != null && modal_data.data.order_data.free_comment != null && modal_data.data.order_data.free_comment !== undefined && modal_data.data.order_data.free_comment.length > 0 &&  modal_data.data.order_data.free_comment[0] != null && (
                            <div className="history-item">
                              <div className="box">
                                <div className="flex between option table-row">
                                  <div className="text-right table-item" style={{paddingLeft:"80px"}}>
                                    <label>備考: </label>
                                    <label>{modal_data.data.order_data.free_comment[0]}</label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {modal_data.data.order_data.item_details != null && modal_data.data.order_data.item_details != undefined && modal_data.data.order_data.item_details.length > 0 && modal_data.data.order_data.item_details.map(detail=>{
                            return(
                              <>
                                <div className="item-details"><label>{detail.item_name}
                                  {((detail.value1 != undefined && detail.value1 != null) || (detail.value2 != undefined && detail.value2 != null))? "：": ""}</label>
                                  {detail.format1 != null && detail.format1 != undefined && detail.format1.includes("年") && detail.format1.includes("月") ? (
                                    <>
                                      {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                        <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label></>
                                      )}
                                      {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                        <> ~ <label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label></>
                                      )}
                                    </>
                                  ):(
                                    <>
                                      {(detail.value1 !== undefined && detail.value1 != null && detail.value1 !== "") && (
                                        <><label>{(detail.value1_format !== undefined) ? detail.value1_format : detail.value1}</label><br /></>
                                      )}
                                      {(detail.value2 !== undefined && detail.value2 != null && detail.value2 !== "") && (
                                        <><label>{(detail.value2_format !== undefined) ? detail.value2_format : detail.value2}</label><br /></>
                                      )}
                                    </>
                                  )}
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </div>
                    </MedicineListWrapper>
                  </div>
                </div>
              </Bar>
              {this.state.confirm_message !== "" && this.state.confirm_type !== "" && (
                <SystemConfirmModal
                  hideConfirm= {this.confirmCancel.bind(this)}
                  confirmCancel= {this.confirmCancel.bind(this)}
                  confirmOk= {this.confirmOk.bind(this)}
                  confirmTitle= {this.state.confirm_message}
                />
              )}
            </Col>
          </Wrapper>
        </Modal.Body>
        <Modal.Footer>
          <div
            onClick={this.props.closeModal}
            className={this.state.curFocus === 1 ? "custom-modal-btn cancel-btn focus " : "custom-modal-btn cancel-btn"}
            style={{cursor:"pointer"}}
          >
            <span>キャンセル</span>
          </div>
          {(modal_data.data.done_order !== undefined && modal_data.data.done_order != null && modal_data.data.done_order === 1) ? (
            <></>
          ):(
            <>
            {(this.is_period && !this.is_exist) ? (
              <></>
            ):(
              <>
                {this.can_done ? (
                  <div id="system_confirm_Ok"
                    className={"custom-modal-btn red-btn"}
                    onClick={this.doneData}
                    style={{cursor:"pointer"}}>
                    <span>実施</span>
                  </div>
                ):(
                  <OverlayTrigger placement={"top"} overlay={renderTooltip("権限がありません。")}>
                    <div id="system_confirm_Ok"
                      className={"custom-modal-btn disable-btn"}                      
                      style={{cursor:"pointer"}}>
                      <span>実施</span>
                    </div>
                  </OverlayTrigger>
                )}
              </>                            
            )}
            </>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

InjectionDoneModal.contextType = Context;

InjectionDoneModal.propTypes = {
  closeModal: PropTypes.func,
  closeInjection: PropTypes.func,
  closeModalAndRefresh: PropTypes.func,
  modal_type: PropTypes.string,
  patientId: PropTypes.number,
  modal_title: PropTypes.string,
  modal_data: PropTypes.object,
  history: PropTypes.object,
  patientInfo: PropTypes.object,
  gotoUrl:PropTypes.string,
  fromPage:PropTypes.string,
};

export default withRouter(InjectionDoneModal);